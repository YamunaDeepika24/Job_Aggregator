# backend/app/get_jobs.py
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import database, models, crud
from .auth_utils import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

LANDING_URL = "https://jobright.ai/swan/recommend/landing/jobs"

def _normalize_jobright_payload(data):
    """
    Convert JobRight API response into a plain list of job dicts with keys:
    title, company, location, url, posted (publishTime / publishTimeDesc), summary
    """
    jobs = []
    # defensive parsing
    if not data:
        return jobs

    # If the response includes result.jobList (your sample)
    try:
        if isinstance(data, dict):
            # try nested structures
            joblist = None
            if "result" in data and isinstance(data["result"], dict) and "jobList" in data["result"]:
                joblist = data["result"]["jobList"]
            elif "jobs" in data and isinstance(data["jobs"], list):
                joblist = data["jobs"]
            elif "jobList" in data and isinstance(data["jobList"], list):
                joblist = data["jobList"]
            else:
                # attempt to find first list value inside dict
                for v in data.values():
                    if isinstance(v, list):
                        joblist = v
                        break

            if not joblist:
                return jobs

            for item in joblist:
                # item may have jobResult and companyResult like your sample
                jr = item.get("jobResult") if isinstance(item, dict) and item.get("jobResult") else item
                if not jr:
                    continue
                title = jr.get("jobTitle") or jr.get("title") or jr.get("name") or ""
                company = ""
                # try common company fields
                company = jr.get("companyName") or jr.get("company") or (item.get("companyResult") or {}).get("companyName", "")
                location = jr.get("jobLocation") or jr.get("location") or ""
                posted = jr.get("publishTimeDesc") or jr.get("publishTime") or jr.get("postDate") or ""
                url = jr.get("applyLink") or jr.get("applyUrl") or jr.get("apply_link") or jr.get("url") or jr.get("jobUrl") or jr.get("apply_link")
                # fallback: sometimes top-level has applyLink
                url = url or jr.get("applyLink") or jr.get("applyLink")
                summary = jr.get("jobSummary") or jr.get("summary") or jr.get("description") or ""

                jobs.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "posted": posted,
                    "url": url,
                    "summary": summary,
                    "raw": jr
                })
    except Exception:
        # be tolerant: return whatever we could parse
        return jobs

    return jobs


@router.get("/jobright")
def get_jobright_jobs(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # fetch profile (so route remains protected exactly like your app expects)
    profile = crud.get_profile_by_user(db, current_user.id) if hasattr(crud, "get_profile_by_user") else crud.get_preferences(db, current_user.id)

    # fetch external data
    try:
        resp = requests.get(LANDING_URL, timeout=8)
        resp.raise_for_status()
        # jobright returns JSON in this endpoint (based on your sample)
        data = resp.json()
    except Exception:
        # return empty jobs list so frontend still displays friendly message
        return {"jobs": []}

    job_items = _normalize_jobright_payload(data)

    # optional: filter by profile (use your existing filter/score if present).
    # For minimal change, return the normalized jobs array.
    return {"jobs": job_items}
