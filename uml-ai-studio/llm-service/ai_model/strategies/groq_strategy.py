import requests
from .base_strategies import LLMStrategy
from .base_strategies import LLMServiceError
from ..config import Config  # Sử dụng .. vì config.py nằm ở thư mục cha


class GroqStrategy(LLMStrategy):
    def __init__(self):
        self.api_key = Config.GROQ_API_KEY
        self.model = Config.GROQ_MODEL
        self.url = Config.GROQ_API_URL
        self.timeout = Config.TIMEOUT_CLOUD

    def generate(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.1  # Đặt thấp để tăng độ chính xác cho UML
        }

        try:
            response = requests.post(
                self.url,
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            if response.status_code == 429:
                raise LLMServiceError("Groq rate limit (429)", retryable=True)
            response.raise_for_status()  # Kiểm tra lỗi HTTP (4xx, 5xx)

            data = response.json()
            return data["choices"][0]["message"]["content"]

        except requests.exceptions.RequestException as e:
            is_retryable = any(
                token in str(e).lower()
                for token in ["timeout", "timed out", "connection", "temporarily", "429"]
            )
            raise LLMServiceError(f"[Groq Error] {e}", retryable=is_retryable) from e