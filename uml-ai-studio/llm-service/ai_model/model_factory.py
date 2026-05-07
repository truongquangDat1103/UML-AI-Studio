from .strategies.gemini_strategy import GeminiStrategy
from .strategies.groq_strategy import GroqStrategy
from .strategies.local_llama_strategy import LocalLlamaStrategy

class ModelFactory:
    _instances = {}
    _strategies = {
        "gemini": GeminiStrategy,
        "groq": GroqStrategy,
        "local_llama": LocalLlamaStrategy,
    }

    @staticmethod
    def get_strategy(name: str):
        strategy_class = ModelFactory._strategies.get(name.lower())
        if not strategy_class:
            raise ValueError(f"Model {name} không được hỗ trợ!")
        if name.lower() not in ModelFactory._instances:
            ModelFactory._instances[name.lower()] = strategy_class()
        return ModelFactory._instances[name.lower()]