import React, { useEffect, useState } from "react";
import { getProfile, saveProfile } from "../api";
import { Link } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({
    domain: "",
    role: "",
    experience: "",
    location: "",
    visa_sponsorship: "",
    work_mode: ""
  });

  useEffect(() => {
    getProfile().then(data => {
      if (!data || !data.id) return;
      setProfile(data);
    });
  }, []);

  async function submit(e) {
    e.preventDefault();
    const res = await saveProfile(profile);
    alert("Profile saved!");
  }

  return (
    <>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <div className="container">
        <h2>Your Preferences</h2>

        <form onSubmit={submit}>
          <input placeholder="Domain" value={profile.domain} onChange={e => setProfile({ ...profile, domain: e.target.value })} />
          <input placeholder="Role" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} />
          <input placeholder="Experience (years)" value={profile.experience} onChange={e => setProfile({ ...profile, experience: e.target.value })} />

          <input placeholder="Location" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />

          <select value={profile.work_mode} onChange={e => setProfile({ ...profile, work_mode: e.target.value })}>
            <option value="">Select Work Mode</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>

          <select value={profile.visa_sponsorship} onChange={e => setProfile({ ...profile, visa_sponsorship: e.target.value })}>
            <option value="">Visa Sponsorship?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <button type="submit">Save</button>
        </form>
      </div>
    </>
  );
}
