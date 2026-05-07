import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    VERSION: str = "2.0.0"
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # --- API KEYS ---
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.5-flash"

    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_API_URL: str = "https://api.groq.com/openai/v1/chat/completions"

    OLLAMA_API_URL: str = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")

    # --- RAG & DB ---
    # Dùng tên model HuggingFace trực tiếp (tự cache lần đầu chạy)
    # Nếu đã download local thì ưu tiên dùng local
    _local_model_path: str = os.path.join(BASE_DIR, "models", "my_embed_model")
    EMBED_MODEL_NAME: str = (
        _local_model_path
        if os.path.exists(os.path.join(_local_model_path, "config.json"))
        else "paraphrase-multilingual-MiniLM-L12-v2"
    )

    VECTOR_DB_PATH: str = os.path.join(BASE_DIR, "vector_db")
    COLLECTION_NAME: str = "pbl5_requirements"
    TOP_K_RAG: int = 3

    # --- STRATEGY ---
    AI_STRATEGY_ORDER: list[str] = ["groq", "gemini", "local_llama"]
    TIMEOUT_CLOUD: int = 30
    TIMEOUT_LOCAL: int = 45