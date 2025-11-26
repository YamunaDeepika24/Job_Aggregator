import React, { useEffect, useState } from "react";
import { listJobs } from "../api";

export default function Dashboard({ token }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    listJobs()
      .then((data) => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load jobs:", err);
        setLoading(false);
      });
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Recommended Jobs for You</h2>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs match your profile yet. Try updating your preferences.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Location</th>
              <th>Published</th>
              <th>Apply</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j, i) => (
              <tr key={i}>
                <td>{j.title}</td>
                <td>{j.company}</td>
                <td>{j.location}</td>
                <td>{j.published}</td>
                <td>
                  <a href={j.url} target="_blank" rel="noreferrer">
                    Apply →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
