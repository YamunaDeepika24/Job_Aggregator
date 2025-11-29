// frontend/src/pages/ProfileForm.jsx
import React, { useEffect, useState } from "react";
import { authFetch } from "../api";

const AVAILABLE_DOMAINS = [
  "Data Science", "Software Engineering", "DevOps", "Security", "Product", "Analytics"
];

const AVAILABLE_ROLES = [
  "Data Scientist", "Machine Learning Engineer", "Data Engineer", "Backend Engineer",
  "Frontend Engineer", "DevOps Engineer", "SRE", "Security Engineer", "Product Manager"
];

const WORK_MODES = ["Remote", "Hybrid", "Onsite"];

const VISA_OPTIONS = ["", "Yes", "No", "Yes in future"];

export default function ProfileForm({ token }) {
  const [profile, setProfile] = useState({
    domains: [], roles: [], work_modes: [], years_experience: 0, location: "", visa_required: ""
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    authFetch("/api/profile/me", token).then(data => {
      if (data) setProfile({
        domains: data.domains || [],
        roles: data.roles || [],
        work_modes: data.work_modes || [],
        years_experience: data.years_experience || 0,
        location: data.location || "",
        visa_required: data.visa_required || ""
      });
    }).catch(e => console.log(e));
  }, [token]);

  function toggleArrayField(field, val) {
    setProfile(prev => {
      const s = new Set(prev[field] || []);
      if (s.has(val)) s.delete(val); else s.add(val);
      return { ...prev, [field]: Array.from(s) };
    });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const body = JSON.stringify(profile);
      const res = await fetch("http://localhost:8000/api/profile/me", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }
      const data = await res.json();
      setMsg("Saved!");
    } catch (err) {
      setMsg("Save failed: " + (err.message || err));
    }
  }

  return (
    <div>
      <h2>Your Profile (preferences)</h2>
      <form onSubmit={submit}>
        <div>
          <label>Domains (multiselect)</label>
          <div>
            {AVAILABLE_DOMAINS.map(d => (
              <label key={d} style={{marginRight:10}}>
                <input type="checkbox" checked={profile.domains.includes(d)} onChange={() => toggleArrayField("domains", d)} />
                {d}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Roles (multiselect)</label>
          <div>
            {AVAILABLE_ROLES.map(r => (
              <label key={r} style={{marginRight:10}}>
                <input type="checkbox" checked={profile.roles.includes(r)} onChange={() => toggleArrayField("roles", r)} />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Work modes</label>
          <div>
            {WORK_MODES.map(m => (
              <label key={m} style={{marginRight:10}}>
                <input type="checkbox" checked={profile.work_modes.includes(m)} onChange={() => toggleArrayField("work_modes", m)} />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Years of experience (number)</label>
          <input type="number" value={profile.years_experience} onChange={e => setProfile({...profile, years_experience: Number(e.target.value)})} />
        </div>

        <div>
          <label>Location (state or "Anywhere in US")</label>
          <input type="text" value={profile.location || ""} onChange={e => setProfile({...profile, location: e.target.value})} />
        </div>

        <div>
          <label>Visa sponsorship preference</label>
          <select value={profile.visa_required || ""} onChange={e => setProfile({...profile, visa_required: e.target.value})}>
            {VISA_OPTIONS.map(v => <option key={v} value={v}>{v || "— select —"}</option>)}
          </select>
        </div>

        <div style={{marginTop:10}}>
          <button type="submit">Save profile</button>
        </div>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
