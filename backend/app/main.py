from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.api.routes import router
from app.core.config import get_settings

REQUEST_COUNT = Counter("legaldocs_api_requests_total", "Total API requests", ["method", "path", "status"])
REQUEST_LATENCY = Histogram("legaldocs_api_request_latency_seconds", "API request latency", ["path"])


class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        with REQUEST_LATENCY.labels(path=request.url.path).time():
            response = await call_next(request)
        REQUEST_COUNT.labels(method=request.method, path=request.url.path, status=response.status_code).inc()
        return response


settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0", description="Demo contract intelligence API with mock RAG.")
app.add_middleware(MetricsMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "legaldocs-api", "mode": "demo" if settings.demo_mode else "production"}


@app.get("/metrics")
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


app.include_router(router, prefix=settings.api_prefix)
