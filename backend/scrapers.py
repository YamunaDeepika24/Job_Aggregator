# backend/scrapers.py
import requests
from bs4 import BeautifulSoup
from datetime import datetime

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible)"}

def parse_job_card_to_job(item, source="jobright"):
    # returns dict with title, company, url, posted
    # This is a best-effort mapping; selectors can change.
    try:
        if source == "jobright":
            title = item.select_one("h3, .JobCard_title__9QIqK")
            comp = item.select_one(".JobCard_company__yuaLv, .company")
            link = item.select_one("a[href]")
            posted = item.select_one(".JobCard_meta__, .time")
            return {
                "title": title.get_text(strip=True) if title else None,
                "company": comp.get_text(strip=True) if comp else None,
                "url": "https://jobright.ai" + link["href"] if link and link.get("href") else None,
                "posted": posted.get_text(strip=True) if posted else None,
                "source": "jobright"
            }
        elif source == "indeed":
            title = item.select_one(".jobTitle, .title")
            comp = item.select_one(".companyName, .company")
            link = item.select_one("a[href]")
            posted = item.select_one(".date, .result-link-bar__list-date")
            url = None
            if link and link.get("href"):
                href = link.get("href")
                if href.startswith("http"):
                    url = href
                else:
                    url = "https://www.indeed.com" + href
            return {
                "title": title.get_text(strip=True) if title else None,
                "company": comp.get_text(strip=True) if comp else None,
                "url": url,
                "posted": posted.get_text(strip=True) if posted else None,
                "source": "indeed"
            }
    except Exception:
        return None

def scrape_jobright(query=None, location=None, limit=30):
    url = "https://jobright.ai/jobs"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code != 200:
            return []
        soup = BeautifulSoup(r.text, "lxml")
        cards = soup.select(".JobCard_container__ga46_, .job-card, article")
        jobs = []
        for c in cards[:limit]:
            j = parse_job_card_to_job(c, source="jobright")
            if j:
                jobs.append(j)
        return jobs
    except Exception:
        return []

def scrape_indeed(query=None, location=None, limit=30):
    # simple indeed search: q and l params
    params = {}
    if query: params["q"] = query
    if location: params["l"] = location
    url = "https://www.indeed.com/jobs"
    try:
        r = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if r.status_code != 200:
            return []
        soup = BeautifulSoup(r.text, "lxml")
        cards = soup.select(".jobsearch-SerpJobCard, .result, .job_seen_beacon")
        jobs = []
        for c in cards[:limit]:
            j = parse_job_card_to_job(c, source="indeed")
            if j:
                jobs.append(j)
        return jobs
    except Exception:
        return []
