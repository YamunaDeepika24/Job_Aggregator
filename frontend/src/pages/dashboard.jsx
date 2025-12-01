// frontend/src/pages/dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchJobs, logout } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchJobs(); // returns { jobs: [...] }
        let arr = [];
        // defensive: data may be { jobs: [..] } or { status:..., jobs: [...] } or data.jobs may be an object with result.jobList
        if (!data) {
          arr = [];
        } else if (Array.isArray(data.jobs)) {
          arr = data.jobs;
        } else if (data.jobs && data.jobs.result && Array.isArray(data.jobs.result.jobList)) {
          // case where backend returned nested shape accidentally
          arr = data.jobs.result.jobList.map(i => (i.jobResult ? i.jobResult : i));
        } else if (Array.isArray(data)) {
          arr = data;
        } else if (data.jobs && typeof data.jobs === "object") {
          // try to pull possible job arrays from common keys
          const p = data.jobs;
          if (Array.isArray(p.jobList)) arr = p.jobList;
          else if (Array.isArray(p.jobs)) arr = p.jobs;
          else arr = [];
        } else {
          arr = [];
        }

        // ensure each job has title/company/url/posted for rendering; normalize minimal shape
        const normalized = arr.map((j) => ({
          title: j.title || j.jobTitle || j.name || "Untitled",
          company: j.company || j.companyName || (j.companyResult && j.companyResult.companyName) || "",
          location: j.location || j.jobLocation || "",
          posted: j.posted || j.publishTimeDesc || j.publishTime || j.posted || "",
          url: j.url || j.applyLink || j.apply_link || j.jobUrl || j.applyUrl || "#",
        }));

        if (mounted) setJobs(normalized);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setError("Failed to load jobs. Please try again.");
        setJobs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <nav>
          <Link to="/dashboard" style={{ marginRight: 12 }}>Dashboard</Link>
          <Link to="/profile" style={{ marginRight: 12 }}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <section style={{ marginTop: 20 }}>
        <h3>Recommended Jobs</h3>

        {loading && <p>Loading jobs…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && jobs.length === 0 && !error && <p>No matching jobs found.</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, marginTop: 12 }}>
          {jobs.map((j, i) => (
            <div key={i} className="job-card" style={{
              padding: 12, border: "1px solid #ddd", borderRadius: 6, background: "#fff"
            }}>
              <h4 style={{ margin: "0 0 4px 0" }}>{j.title}</h4>
              <div style={{ fontSize: 13, color: "#444" }}>
                <div>{j.company}</div>
                <div style={{ color: "#666" }}>{j.location} • {j.posted}</div>
              </div>
              <div style={{ marginTop: 8 }}>
                <a href={j.url || "#"} target="_blank" rel="noreferrer">Apply / View</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
