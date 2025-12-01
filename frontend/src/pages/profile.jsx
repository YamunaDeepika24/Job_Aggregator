// Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>My Profile</h2>
      {profile && (
        <>
          <p>Name: {profile.full_name}</p>
          <p>Email: {profile.email}</p>
        </>
      )}
    </div>
  );
}
