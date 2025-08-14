import React from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={submit} className="auth-form">
        <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "..." : "Login"}</button>
      </form>
    </div>
  );
}
