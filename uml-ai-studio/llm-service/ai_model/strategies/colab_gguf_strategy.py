import json
import re
import requests

from .base_strategies import LLMStrategy, LLMServiceError
from ..config import Config
from ..xmi_parser import is_xmi, xmi_to_plantuml
import xml.etree.ElementTree as ET

_XMI = "http://www.omg.org/spec/XMI/20131001"
_UML = "http://www.omg.org/spec/UML/20131001"


class ColabGGUFStrategy(LLMStrategy):
    """
    Strategy gọi model gpt-oss-20b-UML-Generator đang chạy trên Google Colab.
    Model luôn trả về XMI 2.5.1 — strategy này tự parse XMI → JSON
    để tương thích với pipeline hiện tại (RuleEngine).
    """

    def __init__(self):
        self.base_url = Config.COLAB_API_URL.rstrip("/")
        self.timeout = Config.TIMEOUT_COLAB

    # ── Config check ───────────────────────────────────────────────────────────
    def _check_config(self):
        if not self.base_url:
            raise LLMServiceError(
                "[ColabGGUF] COLAB_API_URL chưa được cấu hình trong .env. "
                "Hãy chạy Colab notebook và dán URL ngrok vào .env",
                retryable=False,
            )

    # ── HTTP call tới Colab server ────────────────────────────────────────────
    def _call_colab(self, prompt: str) -> str:
        payload = {
            "prompt": prompt,
            "max_tokens": 2048,
            "temperature": 0.1,
            "stop": ["</s>", "<|end|>", "<|im_end|>"],
        }
        try:
            response = requests.post(
                f"{self.base_url}/generate",
                json=payload,
                timeout=self.timeout,
                headers={"Content-Type": "application/json"},
            )
            if response.status_code == 503:
                raise LLMServiceError(
                    "Colab server chưa sẵn sàng (model đang load hoặc session hết hạn)",
                    retryable=True,
                )
            if response.status_code == 429:
                raise LLMServiceError("Colab rate limit (429)", retryable=True)

            response.raise_for_status()
            data = response.json()
            text = (data.get("text") or "").strip()
            if not text:
                raise LLMServiceError("Colab model trả về rỗng", retryable=True)
            return text

        except requests.exceptions.ConnectTimeout:
            raise LLMServiceError(
                "[ColabGGUF] Không thể kết nối tới Colab. "
                "Kiểm tra: (1) Colab notebook đang chạy? (2) URL ngrok còn hiệu lực?",
                retryable=True,
            )
        except requests.exceptions.ReadTimeout:
            raise LLMServiceError(
                f"[ColabGGUF] Inference timeout sau {self.timeout}s.",
                retryable=False,
            )
        except requests.exceptions.RequestException as e:
            is_retryable = any(
                t in str(e).lower()
                for t in ["timeout", "connection", "refused", "502", "503"]
            )
            raise LLMServiceError(f"[ColabGGUF] {e}", retryable=is_retryable) from e

    # ── XMI → JSON converter ──────────────────────────────────────────────────
    def _extract_xmi_block(self, raw: str) -> str:
        """Lấy block XMI từ raw text (model hay bao quanh bằng code fence)."""
        # Thử tìm trong ```xml ... ``` hoặc ```xmi ... ```
        for pattern in [r"```(?:xml|xmi)\s*([\s\S]*?)```", r"(<\?xml[\s\S]*>)"]:
            m = re.search(pattern, raw, re.IGNORECASE)
            if m:
                return m.group(1).strip()
        # Fallback: nếu text bắt đầu bằng <?xml hoặc <xmi:XMI
        stripped = raw.strip()
        if stripped.startswith("<?xml") or "<xmi:XMI" in stripped or "<uml:Model" in stripped:
            return stripped
        return raw

    def _attr(self, elem: ET.Element, *names: str) -> str:
        for name in names:
            for ns in (_XMI, _UML):
                val = elem.get(f"{{{ns}}}{name}")
                if val:
                    return val
            val = elem.get(f"xmi:{name}") or elem.get(name)
            if val:
                return val
        return ""

    def _xmi_to_json(self, xmi_text: str) -> str:
        """
        Parse XMI → JSON format mà RuleEngine kỳ vọng:
        {
          "actors": [...],
          "usecases": ["UC_XXX", ...],
          "relations": [{"source": ..., "target": ..., "type": ...}],
          "title": "..."
        }
        """
        try:
            root = ET.fromstring(xmi_text.strip())
        except ET.ParseError as e:
            raise LLMServiceError(f"[ColabGGUF] Không parse được XMI: {e}", retryable=False)

        # Tìm uml:Model
        model = root
        for child in root:
            if "Model" in child.tag:
                model = child
                break

        # Build id → name map
        id_map: dict[str, str] = {}
        for elem in model.iter():
            xmi_id = self._attr(elem, "id")
            name = elem.get("name", "")
            if xmi_id and name:
                id_map[xmi_id] = name

        title = model.get("name", "System")
        actors: list[str] = []
        usecases: list[str] = []
        relations: list[dict] = []

        for elem in model.iter():
            xmi_type = self._attr(elem, "type")
            if not xmi_type:
                continue
            name = elem.get("name", "")

            if "Actor" in xmi_type and name and name not in actors:
                actors.append(name)

            elif "UseCase" in xmi_type and name:
                # Chuẩn hóa sang UC_Xxx để RuleEngine không reject
                uc_key = "UC_" + re.sub(r"[^A-Za-z0-9]", "_", name)
                if uc_key not in usecases:
                    usecases.append(uc_key)
                    id_map[self._attr(elem, "id")] = uc_key  # remap

            elif "Association" in xmi_type and "Include" not in xmi_type and "Extend" not in xmi_type:
                ends = []
                for child in elem:
                    local = child.tag.split("}")[-1] if "}" in child.tag else child.tag
                    if local == "memberEnd":
                        ref = self._attr(child, "idref")
                        if ref:
                            ends.append(id_map.get(ref, ref))
                    elif local == "ownedEnd":
                        t = child.get("type", "")
                        if t:
                            ends.append(id_map.get(t, t))
                if len(ends) >= 2:
                    src, tgt = ends[0], ends[1]
                    if tgt in actors and src not in actors:
                        src, tgt = tgt, src
                    relations.append({"source": src, "target": tgt, "type": "association"})

            elif "Include" in xmi_type:
                inc, add = "", ""
                for child in elem:
                    local = child.tag.split("}")[-1] if "}" in child.tag else child.tag
                    ref = self._attr(child, "idref")
                    if local == "includingCase":
                        inc = id_map.get(ref, ref)
                    elif local == "addition":
                        add = id_map.get(ref, ref)
                if inc and add:
                    relations.append({"source": inc, "target": add, "type": "include"})

            elif "Extend" in xmi_type:
                ext_case, ext_ion = "", ""
                for child in elem:
                    local = child.tag.split("}")[-1] if "}" in child.tag else child.tag
                    ref = self._attr(child, "idref")
                    if local == "extendedCase":
                        ext_case = id_map.get(ref, ref)
                    elif local == "extension":
                        ext_ion = id_map.get(ref, ref)
                if ext_case and ext_ion:
                    relations.append({"source": ext_ion, "target": ext_case, "type": "extend"})

        if not actors and not usecases:
            raise LLMServiceError(
                "[ColabGGUF] XMI parse OK nhưng không tìm thấy Actor/UseCase.",
                retryable=False,
            )

        result = {
            "actors": actors,
            "usecases": usecases,
            "relations": relations,
            "title": title,
        }
        print(f"[ColabGGUF] XMI parsed — {len(actors)} actors, {len(usecases)} usecases, {len(relations)} relations")
        return json.dumps(result, ensure_ascii=False)

    # ── Main generate ─────────────────────────────────────────────────────────
    def generate(self, prompt: str) -> str:
        self._check_config()

        raw = self._call_colab(prompt)
        print(f"[ColabGGUF] Raw output ({len(raw)} chars): {raw[:120]}...")

        # Model luôn trả XMI — extract và convert sang JSON
        xmi_block = self._extract_xmi_block(raw)

        if is_xmi(xmi_block):
            print("[ColabGGUF] Phát hiện XMI → chuyển sang JSON cho RuleEngine")
            return self._xmi_to_json(xmi_block)

        # Fallback: nếu vì lý do nào đó model trả JSON luôn
        print("[ColabGGUF] Output không phải XMI, trả thẳng cho RuleEngine")
        return raw
