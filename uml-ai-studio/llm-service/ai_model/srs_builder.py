import json
import re

from .config import Config
from .model_factory import ModelFactory


class SRSBuilder:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SRSBuilder, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if SRSBuilder._initialized:
            return
        SRSBuilder._initialized = True

    @staticmethod
    def _fallback_spec(usecase_name: str) -> dict:
        return {
            "usecase": usecase_name,
            "description": f"{usecase_name} mô tả chức năng nghiệp vụ chính của hệ thống.",
            "pre_conditions": [
                "Người dùng đã được xác thực (nếu cần).",
                "Hệ thống hoạt động bình thường."
            ],
            "main_flow": [
                "Actor khởi tạo yêu cầu.",
                "Hệ thống kiểm tra dữ liệu đầu vào.",
                "Hệ thống xử lý nghiệp vụ và phản hồi kết quả."
            ],
            "exception_flow": [
                "Dữ liệu đầu vào không hợp lệ -> hệ thống trả lỗi.",
                "Lỗi hệ thống/timeout -> ghi log và trả thông báo phù hợp."
            ],
            "post_conditions": [
                "Dữ liệu được cập nhật đúng quy tắc nghiệp vụ.",
                "Kết quả xử lý được lưu vết."
            ]
        }

    @staticmethod
    def _extract_json(raw: str) -> dict | None:
        if not raw:
            return None
        text = re.sub(r"```(?:json)?", "", raw).strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return None
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            return None

    def generate_spec(self, usecase_payload: dict, usecase_name: str | None = None) -> dict:
        candidates = Config.AI_STRATEGY_ORDER[:]
        uc_name = usecase_name or usecase_payload.get("usecase") or "UC_Unknown"

        prompt = f"""
Bạn là chuyên gia viết tài liệu SRS.
Hãy viết đặc tả chi tiết cho Use Case dựa trên dữ liệu sau:
{json.dumps(usecase_payload, ensure_ascii=False)}

Yêu cầu output CHỈ JSON theo format:
{{
  "usecase": "{uc_name}",
  "description": "...",
  "pre_conditions": ["..."],
  "main_flow": ["..."],
  "exception_flow": ["..."],
  "post_conditions": ["..."]
}}
"""
        for strategy_name in candidates:
            try:
                strategy = ModelFactory.get_strategy(strategy_name)
                raw = strategy.generate(prompt)
                parsed = self._extract_json(raw)
                if parsed:
                    parsed.setdefault("usecase", uc_name)
                    return parsed
            except Exception:
                continue

        return self._fallback_spec(uc_name)
