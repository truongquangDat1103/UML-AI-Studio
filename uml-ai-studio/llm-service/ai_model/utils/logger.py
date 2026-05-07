import json
import time
from datetime import datetime
from pathlib import Path


class AILogger:
    def __init__(self, log_path="logs/inference_history.jsonl"):
        self.log_path = Path(log_path)
        self.log_path.parent.mkdir(parents=True, exist_ok=True)

    def log(self, model_name, domain, latency, status, input_len, output_len, rag_score=None):
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "model": model_name,
            "domain": domain,
            "latency_seconds": round(latency, 3),
            "status": status,  # SUCCESS hoặc FAIL
            "tokens_estimate": input_len + output_len,
            "rag_similarity_score": rag_score,  # Điểm tương đồng từ ChromaDB
        }

        with open(self.log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")


# Khởi tạo một instance dùng chung
logger = AILogger()