from fastapi import APIRouter
from typing import Dict, Any
from app.models.schemas import UserProfile
from app.database import get_user_profile, update_user_profile

router = APIRouter(prefix="/api/profile", tags=["User Profile"])

@router.get("", response_model=UserProfile)
async def get_profile():
    """Retrieve current user profile."""
    prof = get_user_profile()
    return UserProfile(**prof)

@router.post("", response_model=Dict[str, Any])
async def save_profile(profile: UserProfile):
    """Update user onboarding profile settings."""
    update_user_profile(profile.dict())
    return {"status": "success", "message": "Profile saved successfully!"}
