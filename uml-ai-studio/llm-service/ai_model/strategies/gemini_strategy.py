from google import genai
from ..config import Config
from .base_strategies import LLMStrategy, LLMServiceError


class GeminiStrategy(LLMStrategy):
    def __init__(self):
        self.client = genai.Client(api_key=Config.GEMINI_API_KEY)
        self.model_name = Config.GEMINI_MODEL

    def generate(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={"http_options": {"timeout": 15000}}
            )
            text = (response.text or "").strip()
            if not text:
                raise LLMServiceError("Gemini trả về rỗng", retryable=True)
            return text
        except Exception as e:
            error_text = str(e).lower()
            is_retryable = any(
                token in error_text
                for token in ["429", "rate", "quota", "timeout", "connection", "deadline", "503"]
            )
            raise LLMServiceError(f"[Gemini Error] {e}", retryable=is_retryable) from e