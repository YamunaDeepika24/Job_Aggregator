import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from . import database, models, crud, auth
from .get_jobs import router as job_router
from fastapi.security import OAuth2PasswordBearer
from .auth_utils import get_current_user

load_dotenv()
app = FastAPI(title="Job Aggregator API")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    payload = auth.decode_access_token(token)
    if not payload or "sub" not in payload: raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).filter(models.User.id == int(payload["sub"])).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    return user

app.include_router(job_router, dependencies=[Depends(get_current_user)])
models.Base.metadata.create_all(bind=database.engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/register", response_model=crud.schemas.UserOut)
def register(user_in: crud.schemas.UserCreate, db: Session = Depends(database.get_db)):
    if crud.get_user_by_email(db, user_in.email): raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user_in)

@app.post("/api/auth/login", response_model=crud.schemas.Token)
def login(user_in: crud.schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = crud.authenticate_user(db, user_in.email, user_in.password)
    if not user: raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/profile/me", response_model=crud.schemas.ProfileOut)
def read_my_profile(current_user=Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = crud.get_profile_by_user(db, current_user.id)
    if not profile: raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.post("/api/profile/me", response_model=crud.schemas.ProfileOut)
def create_update_profile(profile_in: crud.schemas.ProfileCreate, current_user=Depends(get_current_user), db: Session = Depends(database.get_db)):
    return crud.create_or_update_profile(db, current_user.id, profile_in)
