import React, { useEffect, useState } from "react";
import { getMyProfile, saveMyProfile } from "../api";

const JOB_DOMAINS = ["Data Science", "Backend", "Frontend", "DevOps", "AI/ML"];
const WORK_MODES = ["Remote", "Hybrid", "Onsite"];
const VISA_OPTIONS = ["Yes", "No", "Yes in future"];
const US_STATES = ["Anywhere in US", "California", "Texas", "New York", "Florida", "Other"];

export default function ProfileForm({ token }) {
  const [domains, setDomains] = useState([]);
  const [roles, setRoles] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [yoe, setYoe] = useState(0);
  const [location, setLocation] = useState("");
  const [visa, setVisa] = useState("");

  useEffect(() => {
    if (!token) return;
    getMyProfile().then(profile => {
      setDomains(profile.domains || []);
      setRoles(profile.roles || []);
      setWorkModes(profile.work_modes || []);
      setYoe(profile.years_experience || 0);
      setLocation(profile.location || "");
      setVisa(profile.visa_required || "");
    }).catch(console.error);
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await saveMyProfile({ domains, roles, work_modes: workModes, years_experience: yoe, location, visa_required: visa });
      alert("Profile saved");
    } catch {
      alert("Save failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 600 }}>
      <h3>Profile</h3>

      <label>Domains</label>
      <select multiple value={domains} onChange={e => setDomains([...e.target.selectedOptions].map(o => o.value))}>
        {JOB_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <label>Roles</label>
      <input placeholder="Comma separated roles" value={roles.join(",")} onChange={e => setRoles(e.target.value.split(",").map(s => s.trim()))} />

      <label>Work Modes</label>
      <select multiple value={workModes} onChange={e => setWorkModes([...e.target.selectedOptions].map(o => o.value))}>
        {WORK_MODES.map(w => <option key={w} value={w}>{w}</option>)}
      </select>

      <label>Years of Experience</label>
      <input type="number" value={yoe} onChange={e => setYoe(e.target.value)} />

      <label>Preferred Location</label>
      <select value={location} onChange={e => setLocation(e.target.value)}>
        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Visa Sponsorship</label>
      <select value={visa} onChange={e => setVisa(e.target.value)}>
        {VISA_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
      </select>

      <button type="submit">Save</button>
    </form>
  );
}
