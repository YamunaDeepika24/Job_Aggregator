import React, { useEffect, useState } from "react";

export default function Preferences() {
  const [form, setForm] = useState({
    domain: "",
    role: "",
    experience: "",
    location: "",
    visa_sponsorship: false,
    work_mode: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/api/preferences", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data) setForm(data);
      });
  }, []);

  const save = async () => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8000/api/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    alert("Preferences saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Preferences</h2>

      <input placeholder="Domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
      <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
      <input type="number" placeholder="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
      <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

      <label>
        Visa Sponsorship:
        <input type="checkbox" checked={form.visa_sponsorship} onChange={(e) => setForm({ ...form, visa_sponsorship: e.target.checked })} />
      </label>

      <input placeholder="Work Mode (Remote/Hybrid/On-site)" value={form.work_mode} onChange={(e) => setForm({ ...form, work_mode: e.target.value })} />

      <button onClick={save}>Save Preferences</button>
    </div>
  );
}
