// frontend/src/api.js
const API_URL = "http://localhost:8000"; // make sure backend is running here

async function request(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  return fetch(url, opts);
}

// ----- AUTH -----
export async function login(email, password) {
  // FastAPI OAuth2 token endpoint may expect form-encoded. If your backend has /login that accepts form,
  // switch headers/body accordingly; the login component below posts JSON to /login ; adjust if needed.
  const res = await request("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => null);
    throw new Error(t || "Login failed");
  }
  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }
  return data;
}

export async function registerUser(name, email, password) {
  const res = await request("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => null);
    throw new Error(t || "Registration failed");
  }
  return res.json();
}

// Generic auth fetch helper (so Profile page can call authenticated endpoints)
export async function authFetch(path, opts = {}) {
  const token = localStorage.getItem("token");
  const headers = opts.headers ? { ...opts.headers } : {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await request(path, { ...opts, headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(txt || `Request failed ${res.status}`);
  }
  return res.json();
}

// ----- JOBS -----
export async function fetchJobs() {
  // get jobs from backend alias that we normalized: /api/jobs/jobright
  return authFetch("/api/jobs/jobright");
}

// ----- PROFILE -----
export async function fetchProfile() {
  return authFetch("/profile");
}

export async function saveProfile(data) {
  return authFetch("/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ----- LOGOUT helper -----
export function logout() {
  localStorage.removeItem("token");
}
