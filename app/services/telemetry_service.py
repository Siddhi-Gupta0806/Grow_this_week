import os
import time
import uuid
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.database import save_telemetry_log, get_telemetry_logs

logger = logging.getLogger(__name__)

SENTRY_DSN = os.getenv("SENTRY_DSN", "")

# Initialize Sentry if DSN is set and sentry_sdk is installed
if SENTRY_DSN and len(SENTRY_DSN.strip()) > 0:
    try:
        import sentry_sdk
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment=os.getenv("ENVIRONMENT", "development")
        )
        logger.info("Sentry monitoring initialized successfully.")
    except ImportError:
        logger.info("sentry_sdk package not installed. Skipping Sentry initialization.")
    except Exception as e:
        logger.warning(f"Failed to initialize Sentry: {e}")
else:
    logger.info("SENTRY_DSN not set. Skipping Sentry initialization silently.")

class AITrace:
    def __init__(self, endpoint: str, model_used: str):
        self.trace_id = str(uuid.uuid4())[:8]
        self.endpoint = endpoint
        self.model_used = model_used
        self.start_time = time.time()
        self.input_tokens = 0
        self.output_tokens = 0
        self.fallback_used = False
        self.status = "success"

    def record_usage(self, input_tokens: int = 0, output_tokens: int = 0, fallback_used: bool = False, status: str = "success"):
        self.input_tokens = input_tokens
        self.output_tokens = output_tokens
        self.fallback_used = fallback_used
        self.status = status

    def finish(self) -> Dict[str, Any]:
        latency_ms = round((time.time() - self.start_time) * 1000.0, 2)
        log_entry = {
            "id": self.trace_id,
            "endpoint": self.endpoint,
            "model_used": self.model_used,
            "latency_ms": latency_ms,
            "input_tokens": self.input_tokens,
            "output_tokens": self.output_tokens,
            "fallback_used": self.fallback_used,
            "status": self.status,
            "timestamp": datetime.now().isoformat()
        }
        try:
            save_telemetry_log(log_entry)
        except Exception as e:
            logger.error(f"Failed to save AI telemetry log: {e}")
        return log_entry

def get_recent_ai_telemetry(limit: int = 50) -> List[Dict[str, Any]]:
    return get_telemetry_logs(limit)
