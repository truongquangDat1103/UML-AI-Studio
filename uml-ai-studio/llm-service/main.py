import sys
import os
from pathlib import Path

# Đảm bảo Python tìm thấy các module trong thư mục project_root
sys.path.insert(0, str(Path(__file__).parent))

try:
    from ai_model.ai_root import AIRoot
    from ai_model.config import Config
except ImportError as e:
    print(f"[LỖI] Thiếu module hoặc sai cấu trúc thư mục: {e}")
    sys.exit(1)

BANNER = f"""
╔══════════════════════════════════════════════════════════╗
║     PBL5 — SINH USE CASE DIAGRAM TỪ YÊU CẦU (AI + RAG)   ║
║     Phiên bản: {Config.VERSION if hasattr(Config, 'VERSION') else '2.0'}                          ║
╚══════════════════════════════════════════════════════════╝
Gõ 'exit' để thoát | 'help' để xem hướng dẫn | 'dashboard' để xem link giám sát.
"""

def print_result(data: dict, puml: str, latency: float = 0) -> None:
    print("\n" + "█" * 60)
    print(f"  KẾT QUẢ PHÂN TÍCH (Xử lý trong {latency:.2f}s)")
    print("█" * 60)

    # Hiển thị Actors
    actors = data.get("actors", [])
    print(f"\n📌 ACTORS ({len(actors)}):")
    print("   " + ", ".join([f"[{a}]" for a in actors]))

    # Hiển thị Use Cases
    usecases = data.get("usecases", [])
    print(f"\n📋 USE CASES ({len(usecases)}):")
    for uc in usecases:
        print(f"   • {uc}")

    # Hiển thị PlantUML Code
    print("\n" + "─" * 60)
    print("📄 CODE PLANTUML (Sao chép đoạn dưới đây):")
    print("─" * 60)
    print(puml)
    print("─" * 60)
    print("💡 Mẹo: Dán code tại: https://www.plantuml.com/plantuml")
    print()

def main() -> None:
    print(BANNER)

    # Khởi tạo AIRoot
    with st_status("Đang khởi tạo Engine AI..."):
        try:
            ai = AIRoot()
        except Exception as e:
            print(f"❌ Lỗi khởi tạo hệ thống: {e}")
            return

    while True:
        try:
            query = input("📝 Nhập yêu cầu (hoặc 'exit'): ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if not query: continue
        if query.lower() in ("exit", "quit", "thoát"): break

        if query.lower() == "dashboard":
            print("\n📊 Để xem Dashboard, hãy chạy lệnh sau ở terminal mới:")
            print("   streamlit run dashboard.py\n")
            continue

        if query.lower() == "help":
            print("\n" + "─"*30 + "\nNhập mô tả chức năng phần mềm.\nVí dụ: 'Hệ thống quản lý khách sạn cho phép lễ tân đặt phòng và khách hàng thanh toán.'\n" + "─"*30)
            continue

        # Thực hiện pipeline
        import time
        start = time.time()
        data, puml = ai.process(query)
        end = time.time()

        if data:
            print_result(data, puml, latency=end-start)
        else:
            print("\n⚠️  AI không thể tạo JSON hợp lệ. Vui lòng thử diễn đạt rõ ràng hơn.\n")

def st_status(msg):
    """Giả lập hiệu ứng loading đơn giản cho terminal"""
    import itertools, threading, time
    done = False
    def animate():
        for c in itertools.cycle(['|', '/', '-', '\\']):
            if done: break
            sys.stdout.write(f'\r{msg} {c}')
            sys.stdout.flush()
            time.sleep(0.1)
    t = threading.Thread(target=animate)
    t.start()
    class Spinner:
        def __enter__(self): return self
        def __exit__(self, exc_type, exc_val, exc_tb):
            nonlocal done
            done = True
            sys.stdout.write('\r' + ' '*(len(msg)+2) + '\r')
    return Spinner()

if __name__ == "__main__":
    main()