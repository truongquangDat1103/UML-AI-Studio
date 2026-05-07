"""
ingest_data.py — Nạp dữ liệu từ data.json vào Vector DB.
Chạy MỘT LẦN trước khi dùng main.py:

    python ingest_data.py
"""

import json
import sys
from pathlib import Path

# Đảm bảo import từ thư mục gốc dự án
sys.path.insert(0, str(Path(__file__).parent))

from ai_model import RAGManager  # noqa: E402


def load_dataset(path: str = "data.json") -> list[dict]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            raw = json.load(f)
    except FileNotFoundError:
        print(f"[Ingest] LỖI: Không tìm thấy '{path}'")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"[Ingest] LỖI: File JSON không hợp lệ — {e}")
        sys.exit(1)

    # Chuẩn hóa sang định dạng RAGManager yêu cầu
    dataset = []
    for item in raw:
        dataset.append({
            "requirement": item["requirement"],
            "uml_json": {
                "actors": item.get("target_actors", []),
                "puml": item.get("expected_puml_relations", []),
            },
        })
    return dataset


def main() -> None:
    print("=" * 50)
    print("  PBL5 — NẠOP DỮ LIỆU VÀO VECTOR DB")
    print("=" * 50)

    dataset = load_dataset("data.json")
    print(f"[Ingest] Đã đọc {len(dataset)} mẫu từ data.json")

    rag = RAGManager()
    rag.index_data(dataset)

    print("\n[Ingest] Hoàn tất! Bây giờ bạn có thể chạy: python main.py")


if __name__ == "__main__":
    main()