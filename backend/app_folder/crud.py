from sqlalchemy.orm import Session
from .models import User, UserPreference
from .auth_utils import hash_password, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, password: str):
    new_user = User(email=email, hashed_password=hash_password(password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def save_preferences(db: Session, user_id: int, prefs: dict):
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not pref:
        pref = UserPreference(user_id=user_id, **prefs)
        db.add(pref)
    else:
        for key, val in prefs.items():
            setattr(pref, key, val)
    db.commit()
    db.refresh(pref)
    return pref

def get_preferences(db: Session, user_id: int):
    return db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
