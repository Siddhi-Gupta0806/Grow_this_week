import os
import httpx
import logging
from typing import List, Dict, Any
from app.database import get_connection

logger = logging.getLogger(__name__)

BACKBOARD_API_KEY = os.getenv("BACKBOARD_API_KEY", "")
BACKBOARD_URL = "https://api.backboard.ai/v1/memory"  # Standard endpoint pattern

class MemoryService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or BACKBOARD_API_KEY

    async def add_memory(self, user_id: str, key: str, value: str) -> bool:
        """Store long-term memory for a user."""
        if self.api_key:
            try:
                headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
                payload = {"user_id": user_id, "key": key, "value": value}
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.post(BACKBOARD_URL, json=payload, headers=headers)
                    if resp.status_code in [200, 201]:
                        logger.info(f"Memory saved to Backboard for user {user_id}")
                        return True
            except Exception as e:
                logger.warning(f"Backboard API failed, falling back to local SQLite: {e}")
        
        # SQLite Fallback
        return self._add_local_memory(user_id, key, value)

    async def get_memories(self, user_id: str) -> List[Dict[str, str]]:
        """Retrieve memories for a user."""
        if self.api_key:
            try:
                headers = {"Authorization": f"Bearer {self.api_key}"}
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(f"{BACKBOARD_URL}?user_id={user_id}", headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        if isinstance(data, list):
                            return data
            except Exception as e:
                logger.warning(f"Backboard fetch failed, falling back to SQLite: {e}")
        
        # SQLite Fallback
        return self._get_local_memories(user_id)

    async def get_memory_summary(self, user_id: str = "default_user") -> str:
        """Get formatted summary of past garden notes & memory for AI prompts."""
        memories = await self.get_memories(user_id)
        if not memories:
            return "No previous garden memory recorded yet."
        summary_lines = [f"- {m.get('memory_key', 'Note')}: {m.get('memory_value', '')}" for m in memories]
        return "\n".join(summary_lines)

    def _add_local_memory(self, user_id: str, key: str, value: str) -> bool:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO memory_store (user_id, memory_key, memory_value) VALUES (?, ?, ?)",
                       (user_id, key, value))
        conn.commit()
        conn.close()
        return True

    def _get_local_memories(self, user_id: str) -> List[Dict[str, str]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT memory_key, memory_value FROM memory_store WHERE user_id=? ORDER BY id DESC LIMIT 20",
                       (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [{"memory_key": r["memory_key"], "memory_value": r["memory_value"]} for r in rows]

# Global instance
memory_service = MemoryService()
