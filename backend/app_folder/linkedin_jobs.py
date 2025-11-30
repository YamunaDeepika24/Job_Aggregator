# backend/app/linkedin_jobs.py

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def fetch_linkedin_jobs(preferences: dict, max_jobs: int = 20):
    keyword = preferences.get("keyword", "")
    location = preferences.get("location", "")

    # Configure Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run without GUI
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Initialize WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Build LinkedIn jobs search URL
    search_url = f"https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}"
    driver.get(search_url)
    time.sleep(5)  # wait for page to load

    jobs = []

    try:
        job_cards = driver.find_elements(By.CSS_SELECTOR, "ul.jobs-search__results-list li")
        for card in job_cards[:max_jobs]:
            try:
                title_elem = card.find_element(By.CSS_SELECTOR, "h3.base-search-card__title")
                company_elem = card.find_element(By.CSS_SELECTOR, "h4.base-search-card__subtitle")
                link_elem = card.find_element(By.CSS_SELECTOR, "a.base-card__full-link")

                job = {
                    "title": title_elem.text.strip(),
                    "company": company_elem.text.strip(),
                    "link": link_elem.get_attribute("href"),
                    "source": "LinkedIn"
                }
                jobs.append(job)
            except:
                continue
    except:
        pass
    finally:
        driver.quit()

    return jobs
