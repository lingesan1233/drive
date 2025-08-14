import React from "react";
import { signup as apiSignup } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiSignup(email, password);
      alert("Signup success. Please login.");
      nav("/login");
    } catch (err) {
      alert(err?.response?.data?.error || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <h2>Signup</h2>
      <form onSubmit={submit} className="auth-form">
        <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "..." : "Signup"}</button>
      </form>
    </div>
  );
}
