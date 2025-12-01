// frontend/src/api.js

const API_URL = "http://localhost:8000";

// Universal helper
async function request(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  return fetch(url, opts);
}

// ------------------ AUTH ------------------

export async function login(email, password) {
  const res = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || "Login failed");

  // FIX → Store token consistently
  localStorage.setItem("access_token", data.access_token);

  return data;
}

export async function registerUser(name, email, password) {
  const res = await request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");

  return data;
}

// ------------------ AUTH FETCH ------------------

export async function authFetch(path, opts = {}) {
  const token = localStorage.getItem("access_token");

  const headers = opts.headers ? { ...opts.headers } : {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await request(path, { ...opts, headers });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return res.json();
}

// ------------------ JOBS ------------------

export function fetchJobs() {
  return authFetch("/api/jobs/jobright");
}

// ------------------ PROFILE ------------------

export function fetchProfile() {
  return authFetch("/api/profile");
}

export function saveProfile(data) {
  return authFetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function logout() {
  localStorage.removeItem("access_token");
}
