from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.telemetry_service import get_recent_ai_telemetry

router = APIRouter(prefix="/api/telemetry", tags=["Observability"])

@router.get("/logs", response_model=List[Dict[str, Any]])
async def get_under_the_hood_telemetry():
    """Retrieve recent Gemma AI telemetry call logs, latencies, tokens, and fallback counts."""
    return get_recent_ai_telemetry(50)
