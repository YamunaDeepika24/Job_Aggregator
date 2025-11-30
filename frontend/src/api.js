// api.js
const API_URL = "http://localhost:8000";

// ---------- AUTH ----------
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------- PROFILE ----------
export async function getProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function saveProfile(data) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------- JOBS ----------
export async function fetchJobs() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
