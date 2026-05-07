from __future__ import annotations
import chromadb
from sentence_transformers import SentenceTransformer
from .config import Config


class RAGManager:
    """
    Quản lý Vector DB (ChromaDB) theo Pattern Singleton.
    Đảm bảo embedding model chỉ nạp 1 lần duy nhất trong suốt vòng đời ứng dụng.
    """
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RAGManager, cls).__new__(cls)
        return cls._instance

    def __init__(self) -> None:
        # Nếu đã khởi tạo rồi thì không nạp lại model nữa
        if RAGManager._initialized:
            return

        print("[RAG] Loading embedding model...")
        self.embed_model = SentenceTransformer(Config.EMBED_MODEL_NAME)

        self.client = chromadb.PersistentClient(path=Config.VECTOR_DB_PATH)
        self.collection = self.client.get_or_create_collection(
            name=Config.COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )

        RAGManager._initialized = True
        print(f"[RAG] Vector DB ready - {self.collection.count()} samples.")

    def index_data(self, dataset: list[dict]) -> None:
        """Nạp dataset vào ChromaDB."""
        documents = []
        metadatas = []
        ids = []

        for item in dataset:
            documents.append(item["requirement"])
            metadatas.append({
                "domain": item.get("domain", "General"),
                "output": str(item.get("expected_puml_relations", [])),
                "id": str(item.get("id", "0"))
            })
            ids.append(f"id_{item.get('id', 'unknown')}")

        self.collection.upsert(documents=documents, metadatas=metadatas, ids=ids)
        print(f"[RAG] Indexed {len(documents)} samples.")

    def get_context(self, query_text: str, filter_domain: str = None, limit: int = 3):
        """
        Truy xuất top mẫu tương tự.
        limit: Linh hoạt theo từng model (Gemini=2, Groq=5).
        """
        docs: list[str] = []
        metas: list[dict] = []
        seen_ids = set()

        def _extend_from_query(where_clause: dict | None, n_results: int):
            if n_results <= 0:
                return
            res = self.collection.query(
                query_texts=[query_text],
                n_results=n_results,
                where=where_clause
            )
            fetched_docs = res.get("documents", [[]])[0]
            fetched_metas = res.get("metadatas", [[]])[0]
            for doc, meta in zip(fetched_docs, fetched_metas):
                sample_id = meta.get("id")
                if sample_id in seen_ids:
                    continue
                seen_ids.add(sample_id)
                docs.append(doc)
                metas.append(meta)
                if len(docs) >= limit:
                    break

        if filter_domain and filter_domain != "General":
            _extend_from_query({"domain": filter_domain}, limit)

        if len(docs) < limit:
            _extend_from_query({"domain": "General"}, limit - len(docs))

        if len(docs) < limit:
            _extend_from_query(None, limit - len(docs))

        return docs[:limit], metas[:limit]