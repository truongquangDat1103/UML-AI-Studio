from sentence_transformers import SentenceTransformer
import os

# 1. Khai báo tên model và đường dẫn lưu trữ
model_name = "paraphrase-multilingual-MiniLM-L12-v2"
save_path = "./models/my_embed_model"

# 2. Tạo thư mục nếu chưa có
if not os.path.exists(save_path):
    os.makedirs(save_path)

print(f"--- Đang bắt đầu tải model: {model_name} ---")

try:
    # 3. Tải model từ Hugging Face
    model = SentenceTransformer(model_name)

    # 4. Lưu model xuống thư mục local
    model.save(save_path)

    print(f"--- THÀNH CÔNG! Model đã được lưu tại: {save_path} ---")
except Exception as e:
    print(f"--- LỖI: {e} ---")
    print("Mẹo: Hãy kiểm tra kết nối mạng hoặc thử lại sau ít phút (lỗi 503).")