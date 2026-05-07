import sys
import os
import threading
from contextlib import asynccontextmanager

# Fix encoding UTF-8 cho Windows (tránh lỗi charmap với tiếng Việt)
os.environ["PYTHONUTF8"] = "1"
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# ── Lazy init state ───────────────────────────────────────────────────────────
extractor = None
rules = None
spec_builder = None
_ready = False          # True khi model đã load xong
_init_error: str = ""   # Lưu lỗi nếu init thất bại


def _load_models():
    """Chạy trong background thread để tránh block FastAPI startup."""
    global extractor, rules, spec_builder, _ready, _init_error
    try:
        print("[Server] Bắt đầu load models (background)...")
        from ai_model.core_extractor import CoreExtractor
        from ai_model.rule_engine import RuleEngine
        from ai_model.srs_builder import SRSBuilder

        extractor = CoreExtractor()
        rules = RuleEngine()
        spec_builder = SRSBuilder()
        _ready = True
        print("[Server] ✅ Models loaded — server sẵn sàng!")
    except Exception as e:
        _init_error = str(e)
        print(f"[Server] ❌ Load model thất bại: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi động: load model trong thread riêng (không block event loop)
    t = threading.Thread(target=_load_models, daemon=True)
    t.start()
    yield
    # Shutdown: không cần cleanup đặc biệt


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="AI SRS Assistant API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request models ────────────────────────────────────────────────────────────
class RequirementRequest(BaseModel):
    text: str


class GenerateSpecRequest(BaseModel):
    usecase_json: dict
    usecase_name: str | None = None


# ── Helper ────────────────────────────────────────────────────────────────────
def _check_ready():
    """Raise HTTP 503 nếu model chưa load xong."""
    if not _ready:
        detail = f"Server đang khởi động, vui lòng thử lại sau 30-60 giây."
        if _init_error:
            detail = f"Load model thất bại: {_init_error}"
        raise HTTPException(status_code=503, detail=detail)


# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    if not _ready:
        status = "error" if _init_error else "loading"
        return {
            "status": status,
            "detail": _init_error or "Đang load embedding model, vui lòng đợi...",
            "rag_samples": 0,
        }
    return {
        "status": "online",
        "rag_samples": extractor.rag_manager.collection.count(),
    }


@app.post("/analyze")
async def analyze_requirement(request: RequirementRequest):
    """
    Endpoint chính: Nhận yêu cầu thô → AI xử lý → Trả về JSON use case.
    """
    _check_ready()

    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Nội dung yêu cầu không được để trống")

    try:
        raw_ai_output, latency = extractor.call_ai(request.text)

        if not raw_ai_output:
            raise HTTPException(status_code=500, detail="AI không phản hồi hoặc gặp lỗi")

        cleaned_data = rules.clean_and_parse(raw_ai_output)

        return {
            "status": "success",
            "model_used": extractor.current_model_name,
            "latency_seconds": latency,
            "data": cleaned_data,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-spec")
async def generate_spec(request: GenerateSpecRequest):
    _check_ready()

    if not request.usecase_json:
        raise HTTPException(status_code=400, detail="usecase_json không được để trống")

    try:
        spec = spec_builder.generate_spec(
            usecase_payload=request.usecase_json,
            usecase_name=request.usecase_name,
        )
        return {"status": "success", "data": spec}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
