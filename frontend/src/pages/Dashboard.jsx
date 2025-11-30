import React, { useEffect, useState } from "react";
import { fetchJobs } from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then(data => {
      setJobs(data.jobs || []);
    });
  }, []);

  return (
    <>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <div className="container">
        <h2>Recommended Jobs</h2>

        {jobs.length === 0 ? <p>No jobs found.</p> : null}

        {jobs.map((job, i) => (
          <div key={i} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <a href={job.url} target="_blank" rel="noreferrer">Apply</a>
          </div>
        ))}
      </div>
    </>
  );
}
