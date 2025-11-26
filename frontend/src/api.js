const API_BASE = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("access_token");
}

async function request(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data || { detail: "Request failed" };
  return data;
}

export async function register(email, password) {
  return request("/auth/register", "POST", { email, password });
}
export async function login(email, password) {
  return request("/auth/login", "POST", { email, password });
}
export async function getMyProfile() {
  return request("/profile/me");
}
export async function saveMyProfile(profile) {
  return request("/profile/me", "POST", profile);
}
export async function listJobs() {
  return request("/jobs/jobright");
}
