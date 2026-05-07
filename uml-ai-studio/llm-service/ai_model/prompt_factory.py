import yaml
import os


class PromptFactory:
    """
    Quản lý các mẫu Prompt và lắp ghép dữ liệu RAG.
    """

    _COT_INSTRUCTION = """
<Reasoning_Steps>
Trước khi xuất JSON, bắt buộc suy luận theo đúng 3 bước:
1) Liệt kê Actors (danh từ/vai trò người dùng hoặc hệ thống ngoài).
2) Liệt kê Use Cases (động từ hành động) và đặt tên theo format UC_.
3) Phân tích quan hệ giữa các Use Case để chọn include/extend hợp lý.
Sau khi suy luận xong, chỉ in ra JSON cuối cùng, không in giải thích.
</Reasoning_Steps>
"""

    @staticmethod
    def _get_template(version: str = "v1") -> str:
        # 1. Lấy thư mục chứa chính file prompt_factory.py này
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # 2. Trỏ thẳng vào thư mục prompts nằm cùng cấp
        path = os.path.join(current_dir, "prompts", f"{version}.yaml")

        # In ra để bạn kiểm tra chính xác trong Terminal khi chạy
        # print(f"[DEBUG] Đường dẫn prompt: {path}")

        if not os.path.exists(path):
            raise FileNotFoundError(
                f"\n[LỖI] Không tìm thấy file cấu hình Prompt!\n"
                f"Đường dẫn dự kiến: {path}\n"
                f"Vui lòng kiểm tra lại tên file hoặc thư mục."
            )

        with open(path, "r", encoding="utf-8") as f:
            try:
                data = yaml.safe_load(f)
                return data["template"]
            except Exception as e:
                raise ValueError(f"Lỗi khi đọc file YAML: {e}")

    @staticmethod
    def build_final_prompt(user_input: str, docs: list[str], metas: list[dict], version: str = "v1") -> str:
        # 1. Xây dựng block ví dụ mẫu (Few-shot)
        examples_block = ""
        if docs:
            for i, (doc, meta) in enumerate(zip(docs, metas), start=1):
                examples_block += (
                    f"<Example_{i}>\n"
                    f"Requirement: {doc}\n"
                    f"Output: {meta.get('output', '')}\n"
                    f"</Example_{i}>\n\n"
                )
        else:
            examples_block = "No examples provided. Use general UML knowledge."

        # 2. Lấy template từ file versioning
        try:
            template = PromptFactory._get_template(version)
        except Exception as e:
            print(f"[PromptFactory] Lỗi load template {version}: {e}")
            # Fallback nếu không load được file
            return f"Analyze this: {user_input}"

        # 3. Lắp ghép dữ liệu
        final_prompt = template.format(
            examples_block=examples_block,
            user_input=user_input
        )

        return f"{final_prompt}\n\n{PromptFactory._COT_INSTRUCTION.strip()}"