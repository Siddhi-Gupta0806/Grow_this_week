from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.schemas import HarvestEntryCreate, HarvestEntry
from app.database import list_harvest_entries, add_harvest_entry

router = APIRouter(prefix="/api/journal", tags=["Harvest Journal"])

@router.get("", response_model=List[HarvestEntry])
async def get_harvest_journal():
    """Retrieve harvest journal entries."""
    return list_harvest_entries()

@router.post("", response_model=Dict[str, Any])
async def create_harvest_log(entry: HarvestEntryCreate):
    """Add a new harvest log with weight and date."""
    entry_id = add_harvest_entry(entry.dict())
    return {"status": "success", "id": entry_id, "message": "Harvest logged!"}
