# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .get_jobs import router as jobs_router
from .auth_utils import get_current_user

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
# (KEEP all your other routers exactly as they are)
