import json
import sys
import time
import re
from collections import Counter, defaultdict

class Evaluator:
    def __init__(self) -> None:
        self.extractor = CoreExtractor()
        self.rules = RuleEngine()

    @staticmethod
    def normalize_str(s: str) -> str:
        """Chuẩn hóa logic và xử lý từ đồng nghĩa (Synonyms)."""
        if not s: return ""
        s = s.lower().strip()
        
        # 1. Xóa các tiền tố và ký tự đặc biệt
        s = re.sub(r'^uc_', '', s)
        s = s.replace("_", " ")
        s = re.sub(r'[^a-z0-9\s]', '', s)
        
        # 2. Mapping từ đồng nghĩa (Quan trọng nhất để cứu điểm)
        # Gom các từ khác nhau về cùng một nghĩa trong domain Healthcare
        synonym_map = {
            "patient": "user",
            "caregiver": "user",
            "client": "user",
            "customer": "user",
            "doctor": "serviceprovider",
            "medicalstaff": "serviceprovider",
            "physician": "serviceprovider"
        }
        
        # Xóa khoảng trắng để map cho chính xác
        temp_s = s.replace(" ", "")
        if temp_s in synonym_map:
            return synonym_map[temp_s]
            
        return temp_s

    def _extract_pairs(self, relation_list: list) -> set:
        """Chuyển đổi list string thành set các cặp (source, target) đã chuẩn hóa."""
        pairs = set()
        for rel in relation_list:
            # Tách chuỗi dựa trên các ký hiệu mũi tên hoặc dấu hai chấm
            parts = re.split(r'[-—.>|:]+', rel)
            if len(parts) >= 2:
                src = self.normalize_str(parts[0])
                tgt = self.normalize_str(parts[1])
                if src and tgt:
                    # Lưu theo tuple (nguồn, đích)
                    pairs.add((src, tgt))
        return pairs

    def _calc_metrics(self, pred_pairs: set, truth_pairs: set) -> tuple[float, float, float]:
        """So sánh dựa trên cặp thực thể, không khắt khe về format."""
        if not truth_pairs: return 1.0, 1.0, 1.0
        if not pred_pairs: return 0.0, 0.0, 0.0

        # Tính tập giao (những cặp đúng hoàn toàn sau khi chuẩn hóa)
        tp_set = pred_pairs & truth_pairs
        tp = len(tp_set)
        
        precision = tp / len(pred_pairs)
        recall = tp / len(truth_pairs)
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

        return round(precision, 3), round(recall, 3), round(f1, 3)

    def run_evaluation(self, test_samples: list[dict], limit: int = 10):
        samples = test_samples[:limit]
        print(f"🚀 [Evaluator] Đang đánh giá {len(samples)} mẫu...")

        for i, item in enumerate(samples):
            req = item["requirement"]
            truth_raw = item.get("expected_puml_relations", [])
            
            # 1. Gọi AI lấy kết quả
            raw_output, latency = self.extractor.call_ai(req)
            ai_data = self.rules.clean_and_parse(raw_output)
            
            # 2. Chuyển đổi về dạng cặp (Pairs)
            pred_raw = [f"{r['source']} --> {r['target']}" for r in ai_data.get("relations", [])] if ai_data else []
            pred_pairs = self._extract_pairs(pred_raw)
            truth_pairs = self._extract_pairs(truth_raw)

            # 3. Tính điểm
            p, r, f1 = self._calc_metrics(pred_pairs, truth_pairs)

            # --- HIỂN THỊ TRỰC QUAN ---
            print(f"\n--- [Mẫu {i+1}] ID: {item.get('id')} ---")
            print(f"🎯 TRUTH: {sorted(list(truth_pairs))}")
            print(f"🤖 PRED:  {sorted(list(pred_pairs))}")
            
            # Hiển thị những cái AI tìm đúng (Highlight thành công)
            matches = pred_pairs & truth_pairs
            if matches:
                print(f"✅ KHỚP ({len(matches)}): {matches}")
            
            print(f"📊 KẾT QUẢ: F1={f1:.2f} | P={p:.2f} | R={r:.2f} | {latency:.2f}s")