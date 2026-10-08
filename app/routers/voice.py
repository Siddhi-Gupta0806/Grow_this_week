from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from app.services.voice_service import voice_service

router = APIRouter(prefix="/api/voice", tags=["Voice TTS"])

class VoiceRequest(BaseModel):
    text: str

@router.get("/status")
async def voice_status():
    """Check if voice feature is available."""
    return {"available": voice_service.is_available()}

@router.post("/speak")
async def speak_text(req: VoiceRequest):
    """Generates or fetches cached MP3 audio file for daily tip."""
    if not req.text:
        raise HTTPException(status_code=400, detail="Text required")

    audio_path = await voice_service.generate_audio(req.text)
    if not audio_path or not os.path.exists(audio_path):
        raise HTTPException(status_code=503, detail="Voice generation unavailable or API key not set.")

    return FileResponse(audio_path, media_type="audio/mpeg", filename="garden_tip.mp3")
