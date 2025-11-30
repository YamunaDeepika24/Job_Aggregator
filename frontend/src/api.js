// api.js
const API_URL = "http://localhost:8000";

// AUTH
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  if (data.access_token) localStorage.setItem("token", data.access_token);
  return data;
}

export async function register(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// JOBS
export async function fetchJobs() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// PROFILE
export async function getProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function saveProfile(data) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}
