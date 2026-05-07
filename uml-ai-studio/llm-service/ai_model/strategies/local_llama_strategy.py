import requests

from .base_strategies import LLMStrategy, LLMServiceError
from ..config import Config


class LocalLlamaStrategy(LLMStrategy):
    def __init__(self):
        self.url = Config.OLLAMA_API_URL
        self.model = Config.OLLAMA_MODEL
        self.timeout = Config.TIMEOUT_LOCAL

    def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        try:
            response = requests.post(self.url, json=payload, timeout=self.timeout)
            if response.status_code == 429:
                raise LLMServiceError("Ollama rate limit (429)", retryable=True)
            response.raise_for_status()
            data = response.json()
            text = (data.get("response") or "").strip()
            if not text:
                raise LLMServiceError("Ollama trả về rỗng", retryable=True)
            return text
        except requests.exceptions.RequestException as e:
            is_retryable = any(
                token in str(e).lower()
                for token in ["timeout", "timed out", "connection", "refused", "429"]
            )
            raise LLMServiceError(f"[LocalLlama Error] {e}", retryable=is_retryable) from e
