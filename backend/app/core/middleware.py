import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DevToolsInterceptor")

class DevToolsLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(
            f"DevTools Log | Path: {request.url.path} | Method: {request.method} | Status: {response.status_code} | Duration: {process_time:.2f}ms"
        )
        response.headers["X-Process-Time-MS"] = f"{process_time:.2f}"
        return response