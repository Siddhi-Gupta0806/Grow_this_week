from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.gemma_service import gemma_service
from app.services.weather_service import get_weekly_forecast, search_city
from app.services.memory_service import memory_service
from app.database import list_garden_items

router = APIRouter(prefix="/api/chat", tags=["Ask Gemma Chat"])

@router.post("", response_model=ChatResponse)
async def ask_gemma_chat_endpoint(req: ChatRequest):
    """Grounded Ask Gemma garden assistant chat endpoint."""
    # Fetch user location weather context
    cities = await search_city(req.city)
    lat, lon = (cities[0]["latitude"], cities[0]["longitude"]) if cities else (19.0760, 72.8777)
    weather_summary = await get_weekly_forecast(lat, lon, req.city)

    # Active garden summary
    garden_items = list_garden_items()
    g_names = [g["plant_name"] for g in garden_items]
    garden_summary = ", ".join(g_names) if g_names else "No active plants currently recorded."

    # Long-term memory notes
    memory_notes = await memory_service.get_memory_summary("default_user")

    # Generate answer
    reply_text = await gemma_service.ask_gemma_chat(
        message=req.message,
        city=req.city,
        weather_summary=weather_summary,
        garden_summary=garden_summary,
        memory_notes=memory_notes
    )

    return ChatResponse(reply=reply_text)
