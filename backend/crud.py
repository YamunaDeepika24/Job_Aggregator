# backend/crud.py
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from typing import Optional, List

from backend import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
#     return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_preferences(db: Session, user_id: int):
    return db.query(models.UserPreference).filter(models.UserPreference.user_id == user_id).first()


def create_user(db: Session, name: str, email: str, password: str) -> models.User:
    hashed = pwd_context.hash(password)
    u = models.User(name=name, email=email, hashed_password=hashed)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Preferences
# def get_preferences(db: Session, user_id: int):
#     return db.query(models.UserPreference).filter(models.UserPreference.user_id == user_id).first()

def save_preferences(db: Session, user_id: int, prefs: schemas.UserPreferencesIn):
    pref = get_preferences(db, user_id)
    # convert lists to comma joined strings for storage (simple)
    domains = ",".join(prefs.domains) if prefs.domains else None
    roles = ",".join(prefs.roles) if prefs.roles else None
    locations = ",".join(prefs.locations) if prefs.locations else None

    if pref:
        pref.domains = domains
        pref.roles = roles
        pref.locations = locations
        pref.experience = prefs.experience
        pref.work_mode = prefs.work_mode
        pref.visa_sponsorship = prefs.visa_sponsorship
        pref.email_opt_in = prefs.email_opt_in if prefs.email_opt_in is not None else True
        db.commit()
        db.refresh(pref)
        return pref
    new_pref = models.UserPreference(
        user_id=user_id,
        domains=domains,
        roles=roles,
        locations=locations,
        experience=prefs.experience,
        work_mode=prefs.work_mode,
        visa_sponsorship=prefs.visa_sponsorship,
        email_opt_in=prefs.email_opt_in if prefs.email_opt_in is not None else True
    )
    db.add(new_pref)
    db.commit()
    db.refresh(new_pref)
    return new_pref
