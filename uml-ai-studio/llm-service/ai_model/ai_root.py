import time
from .rag_manager import RAGManager
from .prompt_factory import PromptFactory
from .core_extractor import CoreExtractor
from .rule_engine import RuleEngine
from .utils.logger import logger  # Import module logger đã tạo ở bước trước


class AIRoot:
    """
    Điều phối toàn bộ pipeline theo kiến trúc chuẩn CNPM.
    Hỗ trợ: Logging, Latency tracking và Error Handling.
    """

    def __init__(self) -> None:
        print("[AIRoot] Đang khởi tạo hệ thống...")
        self.rag = RAGManager()
        self.extractor = CoreExtractor()
        self.factory = PromptFactory()
        self.rules = RuleEngine()
        print("[AIRoot] Hệ thống đã sẵn sàng.\n")

    def process(self, user_input: str) -> tuple[dict | None, str]:
        start_time = time.time()
        status = "SUCCESS"
        domain_tag = "General"
        raw_output = ""
        rag_score = 0.0  # Để lưu độ tương đồng phục vụ Dashboard

        try:
            # --- BƯỚC 0: NHẬN DIỆN NGÀNH (DOMAIN) ---
            print(f"[Pipeline] Bước 0 — Nhận diện ngành...")
            domain_tag = self.extractor.detect_domain(user_input)

            # --- BƯỚC 1: RAG ---
            print(f"[Pipeline] Bước 1/3 — Truy xuất RAG cho ngành: {domain_tag}...")
            # Cập nhật RAG để trả về cả điểm tương đồng (nếu có)
            docs, metas = self.rag.get_context(user_input, filter_domain=domain_tag)

            # Giả sử bạn muốn theo dõi chất lượng RAG (lấy điểm của mẫu đầu tiên)
            # Nếu metas có trường score, hãy gán vào rag_score

            # --- BƯỚC 2: GỌI LLM (Dùng Strategy Pattern bên trong Extractor) ---
            print(f"[Pipeline] Bước 2/3 — Gọi LLM (Sử dụng cấu hình từ Config)...")
            raw_output, _ = self.extractor.call_ai(user_input)

            # --- BƯỚC 3: PARSE & CLEAN ---
            print("[Pipeline] Bước 3/3 — Parse & sinh PlantUML...")
            data = self.rules.clean_and_parse(raw_output)

            if data is None:
                status = "PARSE_ERROR"
                return None, ""

            puml = self.rules.to_plantuml(data)
            return data, puml

        except Exception as e:
            status = f"ERROR: {str(e)}"
            print(f"[AIRoot] Lỗi hệ thống: {e}")
            return None, ""

        finally:
            # --- BƯỚC CUỐI: GHI LOG PHỤC VỤ OBSERVABILITY ---
            latency = time.time() - start_time
            logger.log(
                model_name=self.extractor.current_model_name,  # Tên model thực tế đã chạy
                domain=domain_tag,
                latency=latency,
                status=status,
                input_len=len(user_input),
                output_len=len(raw_output),
                rag_score=rag_score
            )
            print(f"[Pipeline] Hoàn tất trong {latency:.2f}s. Trạng thái: {status}")