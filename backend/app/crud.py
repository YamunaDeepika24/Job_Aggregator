from sqlalchemy.orm import Session
from . import models, auth, schemas
import json
from typing import Any

# -------------------
# USER OPERATIONS
# -------------------
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not auth.verify_password(password, user.hashed_password):
        return None
    return user

# -------------------
# PROFILE OPERATIONS
# -------------------
def _ensure_list(value: Any):
    """
    Safely convert value to Python list.
    Handles: None, str (JSON), list, or JSONB from DB.
    """
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return [value]  # fallback for plain strings
    return [value]

def get_profile_by_user(db: Session, user_id: int):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if profile:
        profile.domains = _ensure_list(profile.domains)
        profile.roles = _ensure_list(profile.roles)
        profile.work_modes = _ensure_list(profile.work_modes)
    return profile

def create_or_update_profile(db: Session, user_id: int, profile_in: schemas.ProfileCreate):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()

    if profile:
        # Update existing profile
        for k, v in profile_in.dict(exclude_unset=True).items():
            if k in ["domains", "roles", "work_modes"]:
                setattr(profile, k, v or [])

            else:
                setattr(profile, k, v)
    else:
        # Create new profile
        profile_data = profile_in.dict()
        for k in ["domains", "roles", "work_modes"]:
            profile_data[k] = profile_data.get(k) or []
        profile = models.Profile(user_id=user_id, **profile_data)
        db.add(profile)

    db.commit()
    db.refresh(profile)

    # Always return Python lists for response
    profile.domains = _ensure_list(profile.domains)
    profile.roles = _ensure_list(profile.roles)
    profile.work_modes = _ensure_list(profile.work_modes)

    return profile
