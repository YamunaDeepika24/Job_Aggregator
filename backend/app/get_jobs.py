# backend/app/get_jobs.py

import requests
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from . import database, models, schemas, crud

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

LANDING_URL = "https://jobright.ai/swan/recommend/landing/jobs"


# -----------------------------
# Extract experience level from job title
# -----------------------------
def extract_experience_level(title: str):
    title = title.lower()

    senior_titles = {
        "senior": "senior",
        "sr": "senior",
        "lead": "senior",
        "principal": "senior",
        "staff": "senior",
        "manager": "senior",
        "director": "senior",
    }

    junior_titles = {
        "junior": "junior",
        "jr": "junior",
        "entry": "junior",
        "intern": "junior",
        "internship": "junior",
        "associate": "junior",
        "new grad": "junior",
    }

    for keyword in senior_titles:
        if keyword in title:
            return "senior"

    for keyword in junior_titles:
        if keyword in title:
            return "junior"

    return "mid-level"


# -----------------------------
# Map categories to UI tags
# -----------------------------
CATEGORY_MAP = {
    "data science": "data-science",
    "data analyst": "data-analyst",
    "data engineering": "data-engineering",
    "software engineering": "software-engineering",
    "business analyst": "business-analyst",
    "ai ml": "ai-ml",
    "cybersecurity": "cybersecurity",
    "cloud": "cloud",
    "devops": "devops",
}

def map_category_to_ui(category: str):
    if not category:
        return None
    category = category.lower().strip()

    for key in CATEGORY_MAP:
        if key in category:
            return CATEGORY_MAP[key]

    return "other"


# -----------------------------
# Fetch Jobs from API
# -----------------------------
def fetch_jobs_from_api():
    try:
        response = requests.get(LANDING_URL, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print("Error fetching jobs:", e)
        return []


# -----------------------------
# Format Job Item
# -----------------------------
def format_job_item(job: dict):
    title = job.get("title", "Unknown Title")

    job_item = {
        "title": title,
        "company": job.get("company", "Unknown Company"),
        "location": job.get("location", "Remote"),
        "url": job.get("url", "#"),
        "summary": job.get("summary", ""),
        "salary": job.get("salary", "Not Provided"),
        "experience_level": extract_experience_level(title),
        "category": map_category_to_ui(job.get("category", "")),
    }

    return job_item


# -----------------------------
# GET — Recommended Jobs for User
# -----------------------------
@router.get("/recommended")
def get_recommended_jobs():
    jobs = fetch_jobs_from_api()
    formatted = [format_job_item(job) for job in jobs]

    # If no jobs, return empty list but not an error
    if not formatted:
        return {
            "message": "No jobs found at the moment. Try again later.",
            "jobs": []
        }

    return {
        "message": "Success",
        "jobs": formatted
    }


# -----------------------------
# Save a Job Bookmark
# -----------------------------
@router.post("/bookmark")
def bookmark_job(job: schemas.JobCreate, db: Session = Depends(database.get_db)):
    return crud.create_bookmark(db, job)

@router.get("/recommended")
def get_recommended_jobs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(crud.get_current_user)
):
    # Get profile
    profile = crud.get_profile_by_user(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    jobs = fetch_jobs_from_api()
    formatted = [format_job_item(j) for j in jobs]

    # Apply filters
    filtered = []

    for job in formatted:
        # 1. DOMAIN FILTER
        if profile.domains:
            if not any(d.lower() in job["category"].lower() for d in profile.domains):
                continue

        # 2. LOCATION FILTER
        if profile.location:
            if profile.location.lower() not in job["location"].lower():
                continue

        # 3. EXPERIENCE FILTER
        exp_map = {"junior": 0, "mid-level": 3, "senior": 7}
        job_exp = exp_map.get(job["experience_level"], 0)
        user_exp = profile.years_experience or 0

        if job_exp > user_exp + 2:  # allow ±2 years tolerance
            continue

        # 4. WORK MODE FILTER
        if profile.work_modes:
            if not any(w.lower() in job["location"].lower() for w in profile.work_modes):
                continue

        filtered.append(job)

    return {"jobs": filtered}