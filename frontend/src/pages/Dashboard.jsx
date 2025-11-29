// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { authFetch } from "../api";

export default function Dashboard({ token }) {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (!token) return;
    authFetch("/api/jobs/recommended", token)
      .then(res => {
        setJobs(res.jobs || []);
      })
      .catch(e => setErr(e.message || "Failed to fetch"));
  }, [token]);

  return (
    <div style={{padding:20}}>
      <h2>Recommended Jobs</h2>
      {err && <div style={{color:"red"}}>{err}</div>}
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr style={{background:"#eee"}}><th>Role</th><th>Company</th><th>Location</th><th>Mode</th><th>Exp</th><th>Apply</th></tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr><td colSpan={6}>No jobs found.</td></tr>
          ) : jobs.map((j, i) => (
            <tr key={i} style={{borderBottom:"1px solid #ddd"}}>
              <td>{j.title}</td>
              <td>{j.company || "—"}</td>
              <td>{j.location || "—"}</td>
              <td>{j.work_model || "—"}</td>
              <td>{j.min_years_experience ?? "—"}</td>
              <td><a href={j.url} target="_blank" rel="noreferrer">Apply</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
