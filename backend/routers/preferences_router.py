# backend/routers/preferences_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db
from backend.auth_utils import get_current_user
from backend.email_utils import send_email

router = APIRouter(prefix="", tags=["preferences"])

@router.get("/profile", response_model=schemas.UserPreferencesOut)
def read_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    prefs = crud.get_preferences(db, current_user.id)
    if not prefs:
        # return an empty PreferenceOut-like structure
        empty = schemas.PreferenceOut(
            id=0, user_id=current_user.id, domains=[], roles=[], locations=[],
            experience=None, work_mode=None, visa_sponsorship=None, email_opt_in=True
        )
        return empty
    # convert csv -> lists
    def csv_to_list(s): return s.split(",") if s else []
    return schemas.PreferenceOut(
        id=prefs.id,
        user_id=prefs.user_id,
        domains=csv_to_list(prefs.domains),
        roles=csv_to_list(prefs.roles),
        locations=csv_to_list(prefs.locations),
        experience=prefs.experience,
        work_mode=prefs.work_mode,
        visa_sponsorship=prefs.visa_sponsorship,
        email_opt_in=prefs.email_opt_in
    )

@router.post("/profile")
def save_profile(preferences: schemas.UserPreferencesIn, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    pref = crud.save_preferences(db, current_user.id, preferences)

    # after saving preferences, trigger immediate job match check and email optionally
    if pref.email_opt_in:
        # fire-and-forget job fetch and email (simple)
        try:
            from backend.routers.jobs_router import scrape_jobright, filter_jobs_for_prefs
            jobs = scrape_jobright()
            matched = filter_jobs_for_prefs(jobs, pref)
            if matched:
                # send top 5 jobs
                body_lines = []
                for j in matched[:10]:
                    body_lines.append(f"{j.get('title')} | {j.get('company')} | {j.get('url')}")
                body = "New matched jobs:\n\n" + "\n".join(body_lines)
                send_email(current_user.email, "New job matches on Job Aggregator", body)
        except Exception as e:
            print("Post-save email check failed:", e)

    return {"success": True, "id": pref.id}
