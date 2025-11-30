from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import requests
from .database import get_db
from .crud import get_preferences
from .auth_utils import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

THEIRSTACK_URL = "https://api.theirstack.com/v1/jobs/search"
THEIRSTACK_KEY = "PUT_YOUR_KEY_HERE"

def fetch_jobs():
    headers = {"x-api-key": THEIRSTACK_KEY}
    params = {"limit": 30, "query": "software engineer"}

    r = requests.get(THEIRSTACK_URL, headers=headers, params=params)
    if r.status_code != 200:
        return []

    jobs = r.json().get("jobs", [])
    return [
        {
            "title": j.get("title"),
            "company": j.get("company_name"),
            "location": j.get("location"),
            "work_mode": j.get("workplace_type"),
            "url": j.get("job_url"),
            "experience": j.get("years_experience"),
            "domain": j.get("tags"),
        }
        for j in jobs
    ]

@router.get("/")
def get_jobs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    prefs = get_preferences(db, user.id)
    jobs = fetch_jobs()

    if not prefs:
        return {"jobs": jobs}

    def match(job):
        if prefs.location and prefs.location.lower() not in (job["location"] or "").lower():
            return False
        if prefs.role and prefs.role.lower() not in job["title"].lower():
            return False
        if prefs.domain and prefs.domain.lower() not in str(job["domain"]).lower():
            return False
        return True

    return {"jobs": [j for j in jobs if match(j)]}
