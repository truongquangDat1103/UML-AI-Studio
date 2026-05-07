from __future__ import annotations

import json
import re


class RuleEngine:
    """
    Parse JSON trả về từ LLM và sinh code PlantUML.
    """

    # ── Loại quan hệ hợp lệ ──────────────────────────────────────────────────
    _VALID_TYPES = {"association", "extend", "include"}

    # ── Arrow mapping ─────────────────────────────────────────────────────────
    _ARROW = {
        "association": "-->",
        "extend": "..>",
        "include": "..>",
    }
    _LABEL = {
        "association": "",
        "extend": " : <<extend>>",
        "include": " : <<include>>",
    }

    # ─────────────────────────────────────────────────────────────────────────
    @staticmethod
    def clean_and_parse(raw_text: str) -> dict | None:
        """
        Trích xuất JSON từ chuỗi LLM trả về.
        Handles:
        - JSON bọc trong ```json ... ```
        - JSON nằm giữa văn bản thừa
        - relations là list[dict] (kiểu chuẩn mới)
        """
        if not raw_text:
            return None

        # Bỏ markdown code fence nếu có
        text = re.sub(r"```(?:json)?", "", raw_text).strip()

        # Tìm khối JSON đầu tiên
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            print("[RuleEngine] Không tìm thấy JSON trong kết quả AI.")
            return None

        try:
            data: dict = json.loads(match.group())
        except json.JSONDecodeError as e:
            print(f"[RuleEngine] JSON không hợp lệ: {e}")
            return None

        # ── Validate & clean ──────────────────────────────────────────────────
        actors: list[str] = data.get("actors", [])
        usecases: list[str] = data.get("usecases", [])
        actor_set = set(actors)

        cleaned_relations: list[dict] = []
        for r in data.get("relations", []):
            # Bỏ qua nếu không phải dict đúng cấu trúc
            if not isinstance(r, dict):
                continue
            src = r.get("source", "")
            tgt = r.get("target", "")
            rel_type = r.get("type", "association")

            # Chuẩn hóa type
            if rel_type not in RuleEngine._VALID_TYPES:
                rel_type = "association"

            # Bỏ quan hệ Actor <-> Actor (sai UML Use Case)
            if src in actor_set and tgt in actor_set:
                continue

            cleaned_relations.append({"source": src, "target": tgt, "type": rel_type})

        data["actors"] = actors
        data["usecases"] = usecases
        data["relations"] = cleaned_relations
        return data

    # ─────────────────────────────────────────────────────────────────────────
    @staticmethod
    def to_plantuml(data: dict) -> str:
        """Chuyển dict đã parse thành code PlantUML."""
        lines = ["@startuml", "left to right direction", ""]

        # Actors
        for actor in data.get("actors", []):
            lines.append(f'actor "{actor}"')

        lines.append("")

        # Use Cases trong rectangle
        lines.append("rectangle System {")
        for uc in data.get("usecases", []):
            lines.append(f'  usecase "{uc}"')
        lines.append("}")

        lines.append("")

        # Relations
        for r in data.get("relations", []):
            src = r["source"]
            tgt = r["target"]
            rel_type = r.get("type", "association")
            arrow = RuleEngine._ARROW.get(rel_type, "-->")
            label = RuleEngine._LABEL.get(rel_type, "")
            lines.append(f'"{src}" {arrow} "{tgt}"{label}')

        lines.append("")
        lines.append("@enduml")
        return "\n".join(lines)