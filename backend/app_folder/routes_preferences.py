from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .crud import save_preferences, get_preferences
from .auth_utils import get_current_user
from .schemas import PreferenceUpdate, PreferenceOut

router = APIRouter(prefix="/api/preferences", tags=["preferences"])

@router.get("/", response_model=PreferenceOut)
def get_user_preferences(db: Session = Depends(get_db), user=Depends(get_current_user)):
    prefs = get_preferences(db, user.id)
    return prefs

@router.post("/", response_model=PreferenceOut)
def update_preferences(data: PreferenceUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    updated = save_preferences(db, user.id, data.dict())
    return updated
