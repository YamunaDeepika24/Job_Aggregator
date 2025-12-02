// // frontend/src/pages/dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { fetchJobs, logout } from "../api";
// import { Link, useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const [jobs, setJobs] = useState([]); // always array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       setLoading(true);
//       setError("");
//       try {
//         const data = await fetchJobs("/api/jobs/matching"); // returns { jobs: [...] }
//         let arr = [];
//         // defensive: data may be { jobs: [..] } or { status:..., jobs: [...] } or data.jobs may be an object with result.jobList
//         if (!data) {
//           arr = [];
//         } else if (Array.isArray(data.jobs)) {
//           arr = data.jobs;
//         } else if (data.jobs && data.jobs.result && Array.isArray(data.jobs.result.jobList)) {
//           // case where backend returned nested shape accidentally
//           arr = data.jobs.result.jobList.map(i => (i.jobResult ? i.jobResult : i));
//         } else if (Array.isArray(data)) {
//           arr = data;
//         } else if (data.jobs && typeof data.jobs === "object") {
//           // try to pull possible job arrays from common keys
//           const p = data.jobs;
//           if (Array.isArray(p.jobList)) arr = p.jobList;
//           else if (Array.isArray(p.jobs)) arr = p.jobs;
//           else arr = [];
//         } else {
//           arr = [];
//         }

//         // ensure each job has title/company/url/posted for rendering; normalize minimal shape
//         const normalized = arr.map((j) => ({
//           title: j.title || j.jobTitle || j.name || "Untitled",
//           company: j.company || j.companyName || (j.companyResult && j.companyResult.companyName) || "",
//           location: j.location || j.jobLocation || "",
//           posted: j.posted || j.publishTimeDesc || j.publishTime || j.posted || "",
//           url: j.url || j.applyLink || j.apply_link || j.jobUrl || j.applyUrl || "#",
//         }));

//         if (mounted) setJobs(normalized);
//       } catch (err) {
//         console.error("Failed to load jobs:", err);
//         setError("Failed to load jobs. Please try again.");
//         setJobs([]);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }
//     load();
//     return () => { mounted = false; };
//   }, []);

//   function handleLogout() {
//     logout();
//     navigate("/login");
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h2>Dashboard</h2>
//         <nav>
//           <Link to="/dashboard" style={{ marginRight: 12 }}>Dashboard</Link>
//           <Link to="/profile" style={{ marginRight: 12 }}>Profile</Link>
//           <button onClick={handleLogout}>Logout</button>
//         </nav>
//       </header>

//       <section style={{ marginTop: 20 }}>
//         <h3>Recommended Jobs</h3>

//         {loading && <p>Loading jobs…</p>}
//         {error && <p style={{ color: "red" }}>{error}</p>}

//         {!loading && jobs.length === 0 && !error && <p>No matching jobs found.</p>}

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, marginTop: 12 }}>
//           {jobs.map((j, i) => (
//             <div key={i} className="job-card" style={{
//               padding: 12, border: "1px solid #ddd", borderRadius: 6, background: "#fff"
//             }}>
//               <h4 style={{ margin: "0 0 4px 0" }}>{j.title}</h4>
//               <div style={{ fontSize: 13, color: "#444" }}>
//                 <div>{j.company}</div>
//                 <div style={{ color: "#666" }}>{j.location} • {j.posted}</div>
//               </div>
//               <div style={{ marginTop: 8 }}>
//                 <a href={j.url || "#"} target="_blank" rel="noreferrer">Apply / View</a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// // frontend/src/pages/dashboard.jsx

import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/jobs/matching", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs.");
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) return <div className="p-4">Loading jobs...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Job Dashboard</h1>

      {jobs.length === 0 ? (
        <div>No jobs match your preferences.</div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>

              <a
                href={job.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Apply ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
