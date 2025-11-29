// frontend/src/App.jsx
import React, { useState } from "react";
import Register from "./pages/Register"; // your existing pages
import Login from "./pages/Login";
import ProfileForm from "./pages/ProfileForm";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const stored = localStorage.getItem("access_token");
  const [token, setToken] = useState(stored && stored !== "undefined" ? stored : null);
  const [page, setPage] = useState("dashboard"); // default page after login

  function handleLogin(tokenStr) {
    localStorage.setItem("access_token", tokenStr);
    setToken(tokenStr);
    setPage("profile");
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setPage("login");
  }

  if (!token) {
    if (page === "register") return <Register onSwitch={() => setPage("login")} />;
    return <Login onLogin={handleLogin} onSwitch={() => setPage("register")} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleLogout}>Logout</button>
      <h1>Job Aggregator</h1>
      <nav>
        <button onClick={() => setPage("profile")}>Profile</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
      </nav>
      <hr />
      {page === "profile" && <ProfileForm token={token} />}
      {page === "dashboard" && <Dashboard token={token} />}
    </div>
  );
}
