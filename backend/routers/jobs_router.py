# # backend/routers/jobs_router.py
# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from backend import crud, models
# from backend.database import get_db
# from backend.auth_utils import get_current_user
# import requests
# from bs4 import BeautifulSoup
# import time

# router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# JOBRIGHT_URL = "https://jobright.ai/jobs"
# # Indeed search endpoint is dynamic; we'll do a simple query URL that often works.
# INDEED_SEARCH = "https://www.indeed.com/jobs"

# def scrape_jobright():
#     headers = {"User-Agent": "Mozilla/5.0"}
#     try:
#         r = requests.get(JOBRIGHT_URL, headers=headers, timeout=10)
#         if r.status_code != 200:
#             return []
#         soup = BeautifulSoup(r.text, "lxml")
#         cards = soup.select(".JobCard_container__ga46_, .job-card, .card")
#         jobs = []
#         for c in cards[:100]:
#             title = c.select_one(".JobCard_title__9QIqK, .title")
#             company = c.select_one(".JobCard_company__yuaLv, .company")
#             location = c.select_one(".JobCard_location__FMsET, .location")
#             time_el = c.select_one(".time, .date-posted")
#             link = c.find("a", href=True)
#             jobs.append({
#                 "title": title.get_text(strip=True) if title else None,
#                 "company": company.get_text(strip=True) if company else None,
#                 "location": location.get_text(strip=True) if location else None,
#                 "posted": time_el.get_text(strip=True) if time_el else None,
#                 "url": ("https://jobright.ai" + link["href"]) if link and link.get("href") else None,
#                 "source": "jobright",
#                 "scraped_at": int(time.time())
#             })
#         return jobs
#     except Exception as e:
#         print("scrape_jobright failed:", e)
#         return []

# def scrape_indeed(query="software engineer", location=""):
#     headers = {"User-Agent": "Mozilla/5.0"}
#     params = {"q": query, "l": location}
#     try:
#         r = requests.get(INDEED_SEARCH, headers=headers, params=params, timeout=10)
#         if r.status_code != 200:
#             return []
#         soup = BeautifulSoup(r.text, "lxml")
#         job_cards = soup.select(".result, .jobsearch-SerpJobCard")[:80]
#         jobs = []
#         for c in job_cards:
#             title = c.select_one("h2.title a, h2.jobTitle a")
#             company = c.select_one(".company, .companyName")
#             location = c.select_one(".location, .companyLocation")
#             time_el = c.select_one(".date, .date-posted")
#             link = title["href"] if title and title.has_attr("href") else None
#             url = ("https://www.indeed.com" + link) if link and link.startswith("/") else link
#             jobs.append({
#                 "title": title.get_text(strip=True) if title else None,
#                 "company": company.get_text(strip=True) if company else None,
#                 "location": location.get_text(strip=True) if location else None,
#                 "posted": time_el.get_text(strip=True) if time_el else None,
#                 "url": url,
#                 "source": "indeed",
#                 "scraped_at": int(time.time())
#             })
#         return jobs
#     except Exception as e:
#         print("scrape_indeed failed:", e)
#         return []

# def filter_jobs_for_prefs(jobs, pref):
#     # pref is a UserPreference ORM instance (fields stored as CSV)
#     def to_list(csv_str):
#         return [s.strip().lower() for s in (csv_str.split(",") if csv_str else []) if s.strip()]

#     domains = to_list(pref.domains)
#     roles = to_list(pref.roles)
#     locations = to_list(pref.locations)
#     exp_needed = pref.experience

#     filtered = []
#     for j in jobs:
#         title = (j.get("title") or "").lower()
#         loc = (j.get("location") or "").lower()

#         ok = True
#         if roles:
#             ok = any(r in title for r in roles)
#         if ok and domains:
#             ok = any(d in title for d in domains)
#         if ok and locations:
#             ok = any(l in loc for l in locations)
#         # experience: not reliably on cards, so skip numeric filtering
#         if ok:
#             filtered.append(j)
#     return filtered

# # @router.get("/")
# # def get_jobs(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
# #     prefs = crud.get_preferences(db, current_user.id)
# #     jobs = []
# #     jobs.extend(scrape_jobright())
# #     # try indeed too
# #     jobs.extend(scrape_indeed())
# #     if not prefs:
# #         return {"jobs": jobs}
# #     filtered = filter_jobs_for_prefs(jobs, prefs)
# #     return list{"jobs": filtered}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend import models, crud, schemas
from backend.database import get_db
from backend.auth_utils import get_current_user

router = APIRouter()

# @router.get("/api/jobs/matching", response_model=List[schemas.JobOut])
# def get_matching_jobs(current_user: models.User = Depends(get_current_user),
#                       db: Session = Depends(get_db)):
#     # Fetch user preferences
#     preferences = crud.get_user_preferences(db, current_user.id)

#     # Fetch jobs matching preferences
#     jobs = crud.get_jobs_by_preferences(db, preferences)

#     return jobs

@router.get("/api/jobs/matching", response_model=List[schemas.JobOut])
def get_matching_jobs(current_user: models.User = Depends(get_current_user),
                      db: Session = Depends(get_db)):
    print("Current user:", current_user)
    preferences = crud.get_user_preferences(db, current_user.id)
    print("Preferences:", preferences)
    if not preferences:
        return []  # no preferences yet
    
    jobs = crud.get_jobs_by_preferences(db, preferences)
    print("Matching jobs:", jobs)
    return jobs
