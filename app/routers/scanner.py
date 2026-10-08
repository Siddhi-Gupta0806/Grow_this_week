from fastapi import APIRouter, UploadFile, File, HTTPException
import logging
from app.models.schemas import SpaceScannerResponse
from app.services.gemma_service import gemma_service

router = APIRouter(prefix="/api/scanner", tags=["Space Scanner"])

logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 5 * 1024 * 1024

@router.post("/analyze", response_model=SpaceScannerResponse)
async def scan_space_photo(file: UploadFile = File(...)):
    """Space Scanner AI photo analysis for balconies, terraces, or yards using Gemma 4 Vision."""
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image file format.")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit.")

    try:
        scan_res = await gemma_service.scan_space(image_bytes=content)
        return scan_res
    except Exception as e:
        logger.error(f"Space scanner error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze space photo.")
