# # preferences_router.py
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from backend.database import get_db
# from backend.models import User
# from backend.auth_utils import get_current_user
# from backend.schemas import PreferencesUpdate

# router = APIRouter(prefix="/api/profile", tags=["Profile"])

# # -------------------------
# # GET PROFILE (email + preferences)
# # -------------------------
# @router.get("")
# def get_profile(current_user: User = Depends(get_current_user)):
#     return {
#         "email": current_user.email,
#         "domain": current_user.domains or [],
#         "role": current_user.role or [],
#         "experience": current_user.experience,
#         "visa": current_user.visa,
#         "locations": current_user.locations or [],
#         "work_mode": current_user.work_mode or []
#     }

# # -------------------------
# # UPDATE PROFILE
# # -------------------------
# @router.post("/update")
# def update_profile(
#     prefs: PreferencesUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     current_user.domains = prefs.domains
#     current_user.role = prefs.role
#     current_user.experience = prefs.experience
#     current_user.visa = prefs.visa
#     current_user.locations = prefs.locations
#     current_user.work_mode = prefs.work_mode

#     db.commit()
#     db.refresh(current_user)

#     return {"message": "Profile updated successfully"}
# backend/routers/preferences_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import crud, models, schemas
from backend.database import get_db
from backend.auth_utils import get_current_user
from typing import List


router = APIRouter(prefix="/api/profile", tags=["Profile"])

# GET current user preferences
@router.get("")
def get_preferences(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    prefs = crud.get_preferences(db, current_user.id)

    return {
        "email": current_user.email,
        "domains": prefs.domains if prefs else [],
        "roles": prefs.roles if prefs else [],
        "experience": prefs.experience if prefs else 0,
        "visa_sponsorship": prefs.visa_sponsorship if prefs else "",
        "locations": prefs.locations if prefs else [],
        "work_mode": prefs.work_mode if prefs else [],
    }


# POST/PUT to update preferences
@router.post("/update", response_model=schemas.UserPreferencesOut)
def update_preferences(data: schemas.UserPreferencesIn, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    prefs = crud.get_preferences(db, current_user.id)
    if not prefs:
        # create new preferences if not exist
        prefs = models.UserPreferences(user_id=current_user.id, **data.dict())
        db.add(prefs)
    else:
        # update existing preferences
        for key, value in data.dict(exclude_unset=True).items():
            setattr(prefs, key, value)

    db.commit()
    db.refresh(prefs)
    return prefs


