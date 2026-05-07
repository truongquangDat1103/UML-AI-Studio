from abc import ABC, abstractmethod


class LLMServiceError(Exception):
    """Lỗi phát sinh khi gọi dịch vụ LLM."""

    def __init__(self, message: str, retryable: bool = False):
        super().__init__(message)
        self.retryable = retryable


class LLMStrategy(ABC):
    @abstractmethod
    def generate(self, prompt: str) -> str:
        """Mọi model phải thực hiện hàm này để trả về kết quả text"""
        pass