import React, { useState } from "react";
import { register } from "../api";

export default function Register({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      alert("Registered. Please login.");
      onSwitch();
    } catch {
      alert("Register failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
      <button type="button" onClick={onSwitch}>Back to login</button>
    </form>
  );
}