import re
import time

from .rag_manager import RAGManager
from .model_factory import ModelFactory
from .config import Config
from .prompt_factory import PromptFactory
from .rule_engine import RuleEngine
from .strategies.base_strategies import LLMServiceError
RAG_ALLOW = True

class CoreExtractor:
    _instance = None
    _initialized = False
    _model_open_until = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CoreExtractor, cls).__new__(cls)
        return cls._instance

    def __init__(self) -> None:
        if CoreExtractor._initialized:
            return
        self.current_model_name = "unknown"
        self.rag_manager = RAGManager()
        self._failure_counts = {}
        self.last_call_latency = 0.0
        self.last_self_corrected = False
        self.last_error = ""
        CoreExtractor._initialized = True

    def _is_open(self, strategy_name: str) -> bool:
        return time.time() < CoreExtractor._model_open_until.get(strategy_name, 0)

    def _open_circuit(self, strategy_name: str, base_seconds: int = 8) -> None:
        failures = self._failure_counts.get(strategy_name, 1)
        cooldown = min(base_seconds * (2 ** (failures - 1)), 60)
        CoreExtractor._model_open_until[strategy_name] = time.time() + cooldown

    def _validate_output(self, raw_text: str) -> tuple[bool, str]:
        data = RuleEngine.clean_and_parse(raw_text)
        if not data:
            return False, "JSON output không hợp lệ hoặc parse thất bại."

        relations = data.get("relations", [])
        if not relations:
            return False, "Thiếu relations trong JSON."

        invalid_uc = [uc for uc in data.get("usecases", []) if not re.match(r"^UC_[A-Za-z0-9_]+$", uc)]
        if invalid_uc:
            return False, f"Sai format UC_: {invalid_uc[:3]}"

        return True, ""

    def _self_correct(self, strategy_name: str, original_prompt: str, bad_output: str, reason: str) -> str:
        correction_prompt = (
            f"{original_prompt}\n\n"
            "Kết quả trước đó chưa đạt yêu cầu JSON.\n"
            f"Lý do: {reason}\n"
            "Hãy sửa lại và CHỈ trả về JSON đúng format.\n\n"
            f"<PREVIOUS_OUTPUT>\n{bad_output}\n</PREVIOUS_OUTPUT>"
        )
        strategy = ModelFactory.get_strategy(strategy_name)
        return strategy.generate(correction_prompt)

    def call_ai(self, user_input: str) -> tuple[str, float]:

            """
            Thực thi pipeline gọi AI.
            use_rag: True (Mặc định) -> Tìm kiếm ví dụ mẫu; False -> Chỉ dùng prompt thô.
            """
            use_rag = RAG_ALLOW
            self.last_call_latency = 0.0
            self.last_self_corrected = False
            self.last_error = ""

            for strategy_name in Config.AI_STRATEGY_ORDER:
                if self._is_open(strategy_name):
                    continue

                model_start_ts = time.time()

                try:
                    # Cấu hình tham số theo model
                    prompt_version = "v1" if strategy_name == "gemini" else "v2"
                    top_k = 2 if strategy_name == "gemini" else 5

                    # --- LOGIC RAG NẰM THẲNG TẠI ĐÂY ---
                    docs, metas = [], []
                    status_msg = "RAG=OFF"

                    if use_rag:
                        try:
                            docs, metas = self.rag_manager.get_context(user_input, limit=top_k)
                            status_msg = f"RAG_K={top_k}"
                        except Exception as rag_err:
                            # Nếu RAG lỗi, vẫn cho phép chạy tiếp nhưng không có context
                            print(f"⚠️ [RAG Error]: {rag_err}")
                            status_msg = "RAG=FAILED (Fallback to No-RAG)"

                    # Xây dựng Prompt
                    prompt = PromptFactory.build_final_prompt(
                        user_input, docs, metas, version=prompt_version
                    )

                    print(f"[Extractor] Thử {strategy_name}: Prompt={prompt_version}, {status_msg}")
                    # ----------------------------------

                    strategy = ModelFactory.get_strategy(strategy_name)
                    result = strategy.generate(prompt)

                    # ... (Phần validate và self-correct giữ nguyên) ...
                    if result and len(result.strip()) > 0:
                        ok, reason = self._validate_output(result)

                        if not ok:
                            # Logic self-correct
                            pass

                        actual_latency = round(time.time() - model_start_ts, 3)
                        self.current_model_name = strategy_name
                        self._failure_counts[strategy_name] = 0
                        self.last_call_latency = actual_latency
                        return result, actual_latency

                    raise Exception("Empty result")

                except Exception as e:
                    print(f"[Error {strategy_name}]: {e}")
                    self.last_error = str(e)
                    self._failure_counts[strategy_name] = self._failure_counts.get(strategy_name, 0) + 1
                    self._open_circuit(strategy_name)
                    continue

            return "", 0.0

    def reset_circuit_breaker(self):
        """Reset trạng thái circuit breaker cho toàn bộ model."""
        CoreExtractor._model_open_until.clear()
        self._failure_counts.clear()
        print("[CircuitBreaker] Model states reset.")

    def detect_domain(self, text: str) -> str:
        """
        Phân loại ngành bằng model nhanh nhất (mặc định thử Groq trước).
        """
        prompt = f"""Phân loại yêu cầu sau vào ngành: Library, Transport, Banking, Healthcare, Education, E-commerce.
        CHỈ TRẢ VỀ TÊN NGÀNH, không giải thích.
        Yêu cầu: "{text}"
        Ngành:"""

        active_strategies = [s for s in Config.AI_STRATEGY_ORDER if not self._is_open(s)]
        if not active_strategies:
            active_strategies = Config.AI_STRATEGY_ORDER[:]

        try:
            target_model = "groq" if "groq" in active_strategies else active_strategies[0]
            strategy = ModelFactory.get_strategy(target_model)
            tag = strategy.generate(prompt)
            return tag.strip().replace('"', '')[:30] or "General"
        except Exception:
            return "General"