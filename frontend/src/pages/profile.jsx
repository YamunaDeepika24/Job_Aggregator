// // import React, { useEffect, useState } from "react";
// // import { logout } from "../api";
// // import { Link, useNavigate } from "react-router-dom";

// // export default function Profile() {
// //   const [profile, setProfile] = useState({
// //     email: "",
// //     domains: [],
// //     roles: [],
// //     experience: "",
// //     visa_sponsorship: "",
// //     locations: [],
// //     work_mode: [],
// //   });

// //   const navigate = useNavigate();

// //   // ---- LOAD USER PREFS ----
// //   useEffect(() => {
// //     const load = async () => {
// //       const token = localStorage.getItem("access_token");
// //       if (!token) return navigate("/login");

// //       const res = await fetch("http://localhost:8000/api/preferences", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (res.status === 401) return navigate("/login");

// //       const data = await res.json();

// //       setProfile({
// //         email: data.email || "",
// //         domains: data.domains || [],
// //         roles: data.roles || [],
// //         experience: data.experience || "",
// //         visa_sponsorship: data.visa_sponsorship || "",
// //         locations: data.locations || [],
// //         work_mode: data.work_mode ? data.work_mode.split(",") : [],
// //       });
// //     };

// //     load();
// //   }, []);

// //   // ---- HANDLE INPUT CHANGES ----
// //   const handleChange = (field, value) => {
// //     setProfile((prev) => ({ ...prev, [field]: value }));
// //   };

// //   // ---- SAVE FUNCTION ----
// //   async function handleSave() {
// //     const token = localStorage.getItem("access_token");

// //     const res = await fetch("http://localhost:8000/api/preferences/update", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify(profile),
// //     });

// //     if (res.ok) {
// //       alert("Preferences saved!");
// //     } else {
// //       alert("Failed to save");
// //     }
// //   }

// //   function handleLogout() {
// //     logout();
// //     navigate("/login");
// //   }

// //   // ---- UI ----
// //   return (
// //     <div style={{ padding: 20 }}>
// //       <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //         <h2>Profile</h2>
// //         <nav>
// //           <Link to="/dashboard" style={{ marginRight: 12 }}>Dashboard</Link>
// //           <Link to="/profile" style={{ marginRight: 12 }}>Profile</Link>
// //           <button onClick={handleLogout}>Logout</button>
// //         </nav>
// //       </header>

// //       <section style={{ marginTop: 20 }}>
// //         <h3>My Preferences</h3>

// //         {/* EMAIL */}
// //         <label>Email</label>
// //         <input 
// //           type="text"
// //           value={profile.email}
// //           onChange={(e) => handleChange("email", e.target.value)}
// //           style={{ display: "block", marginBottom: 10 }}
// //         />

// //         {/* DOMAINS */}
// //         <label>Preferred Domains (multi-select)</label>
// //         <select 
// //           multiple
// //           value={profile.domains}
// //           onChange={(e) =>
// //             handleChange("domains", Array.from(e.target.selectedOptions, (o) => o.value))
// //           }
// //           style={{ display: "block", marginBottom: 10 }}
// //         >
// //           <option value="AI">AI</option>
// //           <option value="ML">ML</option>
// //           <option value="Data Science">Data Science</option>
// //           <option value="Full Stack">Full Stack</option>
// //           <option value="Cybersecurity">Cybersecurity</option>
// //         </select>

// //         {/* ROLES */}
// //         <label>Preferred Roles (multi-select)</label>
// //         <select 
// //           multiple
// //           value={profile.roles}
// //           onChange={(e) =>
// //             handleChange("roles", Array.from(e.target.selectedOptions, (o) => o.value))
// //           }
// //           style={{ display: "block", marginBottom: 10 }}
// //         >
// //           <option value="SDE">SDE</option>
// //           <option value="Data Scientist">Data Scientist</option>
// //           <option value="ML Engineer">ML Engineer</option>
// //           <option value="Backend Engineer">Backend Engineer</option>
// //         </select>

// //         {/* EXPERIENCE */}
// //         <label>Experience (years)</label>
// //         <input 
// //           type="number"
// //           value={profile.experience}
// //           onChange={(e) => handleChange("experience", Number(e.target.value))}
// //           style={{ display: "block", marginBottom: 10 }}
// //         />

// //         {/* VISA */}
// //         <label>Visa Sponsorship</label>
// //         <select
// //           value={profile.visa_sponsorship}
// //           onChange={(e) => handleChange("visa_sponsorship", e.target.value)}
// //           style={{ display: "block", marginBottom: 10 }}
// //         >
// //           <option value="">Select</option>
// //           <option value="Yes">Yes</option>
// //           <option value="No">No</option>
// //         </select>

// //         {/* LOCATIONS */}
// //         <label>Preferred Locations (multi-select)</label>
// //         <select
// //           multiple
// //           value={profile.locations}
// //           onChange={(e) =>
// //             handleChange("locations", Array.from(e.target.selectedOptions, (o) => o.value))
// //           }
// //           style={{ display: "block", marginBottom: 10 }}
// //         >
// //           <option value="Anywhere in US">Anywhere in US</option>
// //           <option value="Texas">Texas</option>
// //           <option value="California">California</option>
// //           <option value="New York">New York</option>
// //         </select>

// //         {/* WORK MODE */}
// //         <label>Work Mode (multi-select)</label>
// //         <select
// //           multiple
// //           value={profile.work_mode}
// //           onChange={(e) =>
// //             handleChange("work_mode", Array.from(e.target.selectedOptions, (o) => o.value))
// //           }
// //           style={{ display: "block", marginBottom: 20 }}
// //         >
// //           <option value="Remote">Remote</option>
// //           <option value="Hybrid">Hybrid</option>
// //           <option value="Onsite">Onsite</option>
// //         </select>

// //         <button onClick={handleSave}>Save Preferences</button>
// //       </section>
// //     </div>
// //   );
// // }

// // src/pages/Profile.jsx
// import React, { useEffect, useState } from "react";
// import { logout } from "../api";
// import { Link, useNavigate } from "react-router-dom";

// export default function Profile() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   const [email, setEmail] = useState("");

//   const [domains, setDomains] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [experience, setExperience] = useState("");
//   const [visa, setVisa] = useState("");
//   const [locations, setLocations] = useState([]);
//   const [workMode, setWorkMode] = useState([]);

//   const [message, setMessage] = useState("");

//   // Hardcoded master options
//   const DOMAIN_OPTIONS = ["Software", "AI/ML", "Data", "Cloud", "Full-Stack"];
//   const ROLE_OPTIONS = ["SWE", "Data Scientist", "ML Engineer", "Backend Engineer"];
//   const VISA_OPTIONS = ["Yes", "No"];
//   const LOCATION_OPTIONS = ["Anywhere in USA", "Texas", "California", "New York", "Remote"];
//   const WORK_MODE_OPTIONS = ["Remote", "Hybrid", "Onsite"];

//   // Fetch profile
//   useEffect(() => {
//     const loadProfile = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) return navigate("/login");

//       try {
//         const res = await fetch("http://localhost:8000/api/preferences", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.status === 401) return navigate("/login");

//         if (!res.ok) throw new Error("Failed to load");

//         const data = await res.json();

//         // Email comes from backend.user (modify if needed)
//         setEmail(data.email || "");

//         setDomains(data.domains || []);
//         setRoles(data.roles || []);
//         setExperience(data.experience || "");
//         setVisa(data.visa_sponsorship || "");
//         setLocations(data.locations || []);
//         setWorkMode(data.work_mode || []);
//       } catch (e) {
//         console.error(e);
//         setMessage("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, []);

//   // Save Handler
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

//   const toggleMultiSelect = (value, list, setter) => {
//     if (list.includes(value)) {
//       setter(list.filter((v) => v !== value));
//     } else {
//       setter([...list, value]);
//     }
//   };

//   if (loading) return <h3>Loading...</h3>;

//   return (
//     <div style={{ padding: 20 }}>
//       <header style={{ display: "flex", justifyContent: "space-between" }}>
//         <h2>Profile</h2>
//         <nav>
//           <Link to="/dashboard" style={{ marginRight: 12 }}>
//             Dashboard
//           </Link>
//           <Link to="/profile" style={{ marginRight: 12 }}>
//             Profile
//           </Link>
//           <button onClick={() => { logout(); navigate("/login"); }}>
//             Logout
//           </button>
//         </nav>
//       </header>

//       <div style={{ marginTop: 20, maxWidth: 600 }}>
//         {message && <p>{message}</p>}

//         {/* Email */}
//         <label>Email</label>
//         <input
//           value={email}
//           // disabled
//           style={{ width: "100%", marginBottom: 20 }}
//         />

//         {/* Domains */}
//         <label>Domains</label>
//         <div style={{ marginBottom: 15 }}>
//           {DOMAIN_OPTIONS.map((d) => (
//             <label key={d} style={{ marginRight: 10 }}>
//               <input
//                 type="checkbox"
//                 checked={domains.includes(d)}
//                 onChange={() => toggleMultiSelect(d, domains, setDomains)}
//               />
//               {d}
//             </label>
//           ))}
//         </div>

//         {/* Roles */}
//         <label>Roles</label>
//         <div style={{ marginBottom: 15 }}>
//           {ROLE_OPTIONS.map((r) => (
//             <label key={r} style={{ marginRight: 10 }}>
//               <input
//                 type="checkbox"
//                 checked={roles.includes(r)}
//                 onChange={() => toggleMultiSelect(r, roles, setRoles)}
//               />
//               {r}
//             </label>
//           ))}
//         </div>

//         {/* Experience */}
//         <label>Experience (years)</label>
//         <input
//           type="number"
//           value={experience}
//           onChange={(e) => setExperience(e.target.value)}
//           style={{ width: "100%", marginBottom: 20 }}
//         />

//         {/* Visa */}
//         <label>Visa Sponsorship</label>
//         <select
//           value={visa}
//           onChange={(e) => setVisa(e.target.value)}
//           style={{ width: "100%", marginBottom: 20 }}
//         >
//           <option value="">Select</option>
//           {VISA_OPTIONS.map((v) => (
//             <option key={v} value={v}>
//               {v}
//             </option>
//           ))}
//         </select>

//         {/* Locations */}
//         <label>Locations</label>
//         <div style={{ marginBottom: 15 }}>
//           {LOCATION_OPTIONS.map((loc) => (
//             <label key={loc} style={{ marginRight: 10 }}>
//               <input
//                 type="checkbox"
//                 checked={locations.includes(loc)}
//                 onChange={() =>
//                   toggleMultiSelect(loc, locations, setLocations)
//                 }
//               />
//               {loc}
//             </label>
//           ))}
//         </div>

//         {/* Work Mode */}
//         <label>Work Mode</label>
//         <div>
//           {WORK_MODE_OPTIONS.map((wm) => (
//             <label key={wm} style={{ marginRight: 10 }}>
//               <input
//                 type="checkbox"
//                 checked={workMode.includes(wm)}
//                 onChange={() => toggleMultiSelect(wm, workMode, setWorkMode)}
//               />
//               {wm}
//             </label>
//           ))}
//         </div>

//         <button
//           onClick={handleSave}
//           style={{
//             marginTop: 20,
//             padding: "10px 20px",
//             background: "black",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Save Preferences
//         </button>
//       </div>
//     </div>
//   );
// }

// frontend/src/pages/profile.jsx
import React, { useEffect, useState } from "react";
import { fetchProfile, saveProfile, logout } from "../api";
import { useNavigate, Link } from "react-router-dom";

const AVAILABLE_DOMAINS = ["Data Science","Software Engineering","DevOps","Security","Product","Analytics"];
const AVAILABLE_ROLES = ["Data Scientist","Machine Learning Engineer","Data Engineer","Backend Engineer","Frontend Engineer","DevOps Engineer","SRE","Security Engineer","Product Manager"];
const WORK_MODES = ["Remote","Hybrid","Onsite"];
const US_STATES = ["Anywhere in US","AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const VISA = ["","Yes","No","Yes in future"];

export default function Profile() {
  const [prefs, setPrefs] = useState({
    domains: [],
    roles: [],
    experience: 0,
    work_modes: [],
    locations: [],
    visa_sponsorship: "",
    email_opt_in: true
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await fetchProfile();
        // API returns user preferences object (UserPreferencesOut) or 404
        if (data) {
          // adapt to either CSV fields or array fields
          const normalize = (v) => (Array.isArray(v) ? v : (typeof v === "string" && v.length ? v.split(",") : []));
          setPrefs({
            domains: normalize(data.domains || data.domains_list || data.domains_csv),
            roles: normalize(data.roles || data.roles_list || data.roles_csv),
            experience: data.experience || 0,
            work_modes: normalize(data.work_mode ? [data.work_mode] : data.work_modes || []),
            locations: normalize(data.locations || data.locations_list || data.location || data.locations_csv),
            visa_sponsorship: data.visa_sponsorship || "",
            email_opt_in: data.email_opt_in !== undefined ? data.email_opt_in : true
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  function toggleSet(key, val) {
    setPrefs(prev => {
      const s = new Set(prev[key] || []);
      if (s.has(val)) s.delete(val); else s.add(val);
      return { ...prev, [key]: Array.from(s) };
    });
  }

  async function handleSave(e) {
    e?.preventDefault();
    setMsg("");
    try {
      // backend expects UserPreferencesIn model (arrays etc)
      await saveProfile({
        domains: prefs.domains,
        roles: prefs.roles,
        experience: prefs.experience ? Number(prefs.experience) : 0,
        work_mode: prefs.work_modes.join(","),
        locations: prefs.locations,
        visa_sponsorship: prefs.visa_sponsorship,
        email_opt_in: prefs.email_opt_in
      });
      setMsg("Saved!");
    } catch (err) {
      console.error(err);
      setMsg("Failed to save profile: " + (err.message || err));
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) return <div>Loading profile…</div>;

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Profile (Preferences)</h2>
        <nav>
          <Link to="/dashboard" style={{ marginRight: 12 }}>Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <form onSubmit={handleSave} style={{ marginTop: 20 }}>
        <div>
          <label>Domains (multi)</label>
          <div>
            {AVAILABLE_DOMAINS.map(d => (
              <label key={d} style={{ marginRight: 10 }}>
                <input type="checkbox" checked={prefs.domains.includes(d)} onChange={() => toggleSet("domains", d)} />
                {d}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Roles (multi)</label>
          <div>
            {AVAILABLE_ROLES.map(r => (
              <label key={r} style={{ marginRight: 10 }}>
                <input type="checkbox" checked={prefs.roles.includes(r)} onChange={() => toggleSet("roles", r)} />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Work modes</label>
          <div>
            {WORK_MODES.map(m => (
              <label key={m} style={{ marginRight: 10 }}>
                <input type="checkbox" checked={prefs.work_modes.includes(m)} onChange={() => toggleSet("work_modes", m)} />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Years of experience</label>
          <input type="number" min="0" value={prefs.experience} onChange={e => setPrefs({...prefs, experience: Number(e.target.value)})} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Locations (US states / multi)</label>
          <div>
            {US_STATES.map(s => (
              <label key={s} style={{ marginRight: 8 }}>
                <input type="checkbox" checked={prefs.locations.includes(s)} onChange={() => toggleSet("locations", s)} />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Visa sponsorship</label>
          <select value={prefs.visa_sponsorship} onChange={e => setPrefs({...prefs, visa_sponsorship: e.target.value})}>
            {VISA.map(v => <option key={v} value={v}>{v || "— select —"}</option>)}
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>
            <input type="checkbox" checked={!!prefs.email_opt_in} onChange={e => setPrefs({...prefs, email_opt_in: e.target.checked})} />
            Opt in to job-match emails
          </label>
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="submit">Save Preferences</button>
        </div>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </form>
    </div>
  );
}
