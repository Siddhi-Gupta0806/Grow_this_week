import os
import hashlib
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Rachel / Standard calm voice
ELEVENLABS_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

class VoiceService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or ELEVENLABS_API_KEY

    def is_available(self) -> bool:
        """Check if ElevenLabs voice synthesis is configured."""
        return bool(self.api_key and len(self.api_key.strip()) > 0)

    async def generate_audio(self, text: str) -> Optional[str]:
        """Generate or retrieve cached audio MP3 filepath for given text."""
        if not text:
            return None

        # Compute MD5 hash for caching
        text_hash = hashlib.md5(text.strip().encode("utf-8")).hexdigest()
        cache_path = os.path.join(CACHE_DIR, f"{text_hash}.mp3")

        # 1. Check disk cache first
        if os.path.exists(cache_path):
            logger.info(f"Returning cached ElevenLabs audio for hash {text_hash}")
            return cache_path

        # 2. If no key configured, return None
        if not self.is_available():
            logger.info("ElevenLabs API key not set. Audio synthesis disabled.")
            return None

        # 3. Call ElevenLabs API
        try:
            headers = {
                "xi-api-key": self.api_key,
                "Content-Type": "application/json",
                "Accept": "audio/mpeg"
            }
            payload = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75
                }
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(ELEVENLABS_URL, json=payload, headers=headers)
                if resp.status_code == 200:
                    with open(cache_path, "wb") as f:
                        f.write(resp.content)
                    logger.info(f"Successfully generated & cached ElevenLabs audio at {cache_path}")
                    return cache_path
                else:
                    logger.error(f"ElevenLabs API error ({resp.status_code}): {resp.text}")
        except Exception as e:
            logger.error(f"Voice generation exception: {e}")

        return None

voice_service = VoiceService()
