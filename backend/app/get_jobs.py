from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .auth_utils import get_current_user

router = APIRouter()

@router.get("/api/jobs/recommended")
def get_recommended_jobs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Your ML / API logic can go here
    return {"message": "Jobs fetched successfully", "user_id": current_user.id}
