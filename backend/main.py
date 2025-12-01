# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .get_jobs import router as jobs_router
from .auth_utils import get_current_user
from backend.routers.auth_router import router as auth_router
from backend.routers.preferences_router import router as preferences_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

# ---- Allow frontend ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Include the jobs router ----
app.include_router(jobs_router)
app.include_router(auth_router)   
app.include_router(preferences_router)
