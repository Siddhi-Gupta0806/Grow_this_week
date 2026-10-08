from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import logging
from app.models.schemas import DoctorDiagnosisResponse
from app.services.gemma_service import gemma_service

router = APIRouter(prefix="/api/doctor", tags=["Plant Doctor"])

logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit

@router.post("/diagnose", response_model=DoctorDiagnosisResponse)
async def diagnose_plant_photo(
    file: UploadFile = File(...),
    notes: str = Form("")
):
    """
    Plant Doctor AI Photo Diagnosis using Gemma 4 Vision.
    Validates file type/size, processes image in memory, and returns organic diagnosis.
    """
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image file format. Only JPEG, PNG, or WebP are supported.")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit.")

    try:
        diagnosis = await gemma_service.diagnose_plant_health(image_bytes=content, notes=notes)
        return diagnosis
    except Exception as e:
        logger.error(f"Plant doctor diagnosis error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze plant photo. Please try again.")
