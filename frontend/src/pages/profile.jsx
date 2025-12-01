// import React, { useEffect, useState } from "react";
// import { logout } from "../api";
// import { Link, useNavigate } from "react-router-dom";

// export default function Profile() {
//   const [profile, setProfile] = useState({
//     email: "",
//     domains: [],
//     roles: [],
//     experience: "",
//     visa_sponsorship: "",
//     locations: [],
//     work_mode: [],
//   });

//   const navigate = useNavigate();

//   // ---- LOAD USER PREFS ----
//   useEffect(() => {
//     const load = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) return navigate("/login");

//       const res = await fetch("http://localhost:8000/api/preferences", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 401) return navigate("/login");

//       const data = await res.json();

//       setProfile({
//         email: data.email || "",
//         domains: data.domains || [],
//         roles: data.roles || [],
//         experience: data.experience || "",
//         visa_sponsorship: data.visa_sponsorship || "",
//         locations: data.locations || [],
//         work_mode: data.work_mode ? data.work_mode.split(",") : [],
//       });
//     };

//     load();
//   }, []);

//   // ---- HANDLE INPUT CHANGES ----
//   const handleChange = (field, value) => {
//     setProfile((prev) => ({ ...prev, [field]: value }));
//   };

//   // ---- SAVE FUNCTION ----
//   async function handleSave() {
//     const token = localStorage.getItem("access_token");

//     const res = await fetch("http://localhost:8000/api/preferences/update", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(profile),
//     });

//     if (res.ok) {
//       alert("Preferences saved!");
//     } else {
//       alert("Failed to save");
//     }
//   }

//   function handleLogout() {
//     logout();
//     navigate("/login");
//   }

//   // ---- UI ----
//   return (
//     <div style={{ padding: 20 }}>
//       <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h2>Profile</h2>
//         <nav>
//           <Link to="/dashboard" style={{ marginRight: 12 }}>Dashboard</Link>
//           <Link to="/profile" style={{ marginRight: 12 }}>Profile</Link>
//           <button onClick={handleLogout}>Logout</button>
//         </nav>
//       </header>

//       <section style={{ marginTop: 20 }}>
//         <h3>My Preferences</h3>

//         {/* EMAIL */}
//         <label>Email</label>
//         <input 
//           type="text"
//           value={profile.email}
//           onChange={(e) => handleChange("email", e.target.value)}
//           style={{ display: "block", marginBottom: 10 }}
//         />

//         {/* DOMAINS */}
//         <label>Preferred Domains (multi-select)</label>
//         <select 
//           multiple
//           value={profile.domains}
//           onChange={(e) =>
//             handleChange("domains", Array.from(e.target.selectedOptions, (o) => o.value))
//           }
//           style={{ display: "block", marginBottom: 10 }}
//         >
//           <option value="AI">AI</option>
//           <option value="ML">ML</option>
//           <option value="Data Science">Data Science</option>
//           <option value="Full Stack">Full Stack</option>
//           <option value="Cybersecurity">Cybersecurity</option>
//         </select>

//         {/* ROLES */}
//         <label>Preferred Roles (multi-select)</label>
//         <select 
//           multiple
//           value={profile.roles}
//           onChange={(e) =>
//             handleChange("roles", Array.from(e.target.selectedOptions, (o) => o.value))
//           }
//           style={{ display: "block", marginBottom: 10 }}
//         >
//           <option value="SDE">SDE</option>
//           <option value="Data Scientist">Data Scientist</option>
//           <option value="ML Engineer">ML Engineer</option>
//           <option value="Backend Engineer">Backend Engineer</option>
//         </select>

//         {/* EXPERIENCE */}
//         <label>Experience (years)</label>
//         <input 
//           type="number"
//           value={profile.experience}
//           onChange={(e) => handleChange("experience", Number(e.target.value))}
//           style={{ display: "block", marginBottom: 10 }}
//         />

//         {/* VISA */}
//         <label>Visa Sponsorship</label>
//         <select
//           value={profile.visa_sponsorship}
//           onChange={(e) => handleChange("visa_sponsorship", e.target.value)}
//           style={{ display: "block", marginBottom: 10 }}
//         >
//           <option value="">Select</option>
//           <option value="Yes">Yes</option>
//           <option value="No">No</option>
//         </select>

//         {/* LOCATIONS */}
//         <label>Preferred Locations (multi-select)</label>
//         <select
//           multiple
//           value={profile.locations}
//           onChange={(e) =>
//             handleChange("locations", Array.from(e.target.selectedOptions, (o) => o.value))
//           }
//           style={{ display: "block", marginBottom: 10 }}
//         >
//           <option value="Anywhere in US">Anywhere in US</option>
//           <option value="Texas">Texas</option>
//           <option value="California">California</option>
//           <option value="New York">New York</option>
//         </select>

//         {/* WORK MODE */}
//         <label>Work Mode (multi-select)</label>
//         <select
//           multiple
//           value={profile.work_mode}
//           onChange={(e) =>
//             handleChange("work_mode", Array.from(e.target.selectedOptions, (o) => o.value))
//           }
//           style={{ display: "block", marginBottom: 20 }}
//         >
//           <option value="Remote">Remote</option>
//           <option value="Hybrid">Hybrid</option>
//           <option value="Onsite">Onsite</option>
//         </select>

//         <button onClick={handleSave}>Save Preferences</button>
//       </section>
//     </div>
//   );
// }

// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { logout } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");

  const [domains, setDomains] = useState([]);
  const [roles, setRoles] = useState([]);
  const [experience, setExperience] = useState("");
  const [visa, setVisa] = useState("");
  const [locations, setLocations] = useState([]);
  const [workMode, setWorkMode] = useState([]);

  const [message, setMessage] = useState("");

  // Hardcoded master options
  const DOMAIN_OPTIONS = ["Software", "AI/ML", "Data", "Cloud", "Full-Stack"];
  const ROLE_OPTIONS = ["SWE", "Data Scientist", "ML Engineer", "Backend Engineer"];
  const VISA_OPTIONS = ["Yes", "No"];
  const LOCATION_OPTIONS = ["Anywhere in USA", "Texas", "California", "New York", "Remote"];
  const WORK_MODE_OPTIONS = ["Remote", "Hybrid", "Onsite"];

  // Fetch profile
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) return navigate("/login");

        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();

        // Email comes from backend.user (modify if needed)
        setEmail(data.email || "");

        setDomains(data.domains || []);
        setRoles(data.roles || []);
        setExperience(data.experience || "");
        setVisa(data.visa_sponsorship || "");
        setLocations(data.locations || []);
        setWorkMode(data.work_mode || []);
      } catch (e) {
        console.error(e);
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save Handler
  const handleSave = async () => {
    setMessage("");

    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    const payload = {
      domains,
      roles,
      experience: Number(experience),
      visa_sponsorship: visa,
      locations,
      work_mode: workMode,
    };

    try {
      const res = await fetch("http://localhost:8000/api/profile/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return navigate("/login");

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }

      setMessage("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save profile");
    }
  };

  const toggleMultiSelect = (value, list, setter) => {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else {
      setter([...list, value]);
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Profile</h2>
        <nav>
          <Link to="/dashboard" style={{ marginRight: 12 }}>
            Dashboard
          </Link>
          <Link to="/profile" style={{ marginRight: 12 }}>
            Profile
          </Link>
          <button onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </button>
        </nav>
      </header>

      <div style={{ marginTop: 20, maxWidth: 600 }}>
        {message && <p>{message}</p>}

        {/* Email */}
        <label>Email</label>
        <input
          value={email}
          disabled
          style={{ width: "100%", marginBottom: 20 }}
        />

        {/* Domains */}
        <label>Domains</label>
        <div style={{ marginBottom: 15 }}>
          {DOMAIN_OPTIONS.map((d) => (
            <label key={d} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={domains.includes(d)}
                onChange={() => toggleMultiSelect(d, domains, setDomains)}
              />
              {d}
            </label>
          ))}
        </div>

        {/* Roles */}
        <label>Roles</label>
        <div style={{ marginBottom: 15 }}>
          {ROLE_OPTIONS.map((r) => (
            <label key={r} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={roles.includes(r)}
                onChange={() => toggleMultiSelect(r, roles, setRoles)}
              />
              {r}
            </label>
          ))}
        </div>

        {/* Experience */}
        <label>Experience (years)</label>
        <input
          type="number"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{ width: "100%", marginBottom: 20 }}
        />

        {/* Visa */}
        <label>Visa Sponsorship</label>
        <select
          value={visa}
          onChange={(e) => setVisa(e.target.value)}
          style={{ width: "100%", marginBottom: 20 }}
        >
          <option value="">Select</option>
          {VISA_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        {/* Locations */}
        <label>Locations</label>
        <div style={{ marginBottom: 15 }}>
          {LOCATION_OPTIONS.map((loc) => (
            <label key={loc} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={locations.includes(loc)}
                onChange={() =>
                  toggleMultiSelect(loc, locations, setLocations)
                }
              />
              {loc}
            </label>
          ))}
        </div>

        {/* Work Mode */}
        <label>Work Mode</label>
        <div>
          {WORK_MODE_OPTIONS.map((wm) => (
            <label key={wm} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={workMode.includes(wm)}
                onChange={() => toggleMultiSelect(wm, workMode, setWorkMode)}
              />
              {wm}
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
