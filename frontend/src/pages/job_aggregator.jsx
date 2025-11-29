import React, { useState } from "react";
import axios from "axios";

const JobAggregator = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/jobs/aggregate-jobs", {
        keyword,
        location
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Job Aggregator</h1>

      <div>
        <input
          type="text"
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={fetchJobs}>{loading ? "Loading..." : "Search Jobs"}</button>
      </div>

      <div>
        {jobs.map((job, idx) => (
          <div key={idx} className="job-card">
            <h2>{job.title}</h2>
            <p>{job.company} • {job.source}</p>
            <a href={job.link} target="_blank" rel="noopener noreferrer">View Job</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobAggregator;
