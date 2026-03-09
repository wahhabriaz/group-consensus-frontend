// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail]   = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate            = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.recover(email);
      localStorage.setItem("cg_api_key", res.api_key);
      localStorage.setItem("cg_email", email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.error || "Email not found");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <p className="section-label mb-3">Welcome back</p>
          <h1 className="text-4xl font-display font-bold text-ink mb-2">Sign in</h1>
          <p className="text-slate text-sm">Enter your email to recover your API key.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Email Address</label>
            <input className="input" type="email" placeholder="ali@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          {error && <p className="text-sm text-coral bg-coral/10 px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary justify-center mt-2">
            {loading ? "Signing in..." : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-6">
          Don't have a key?{" "}
          <Link to="/register" className="text-ink font-medium underline underline-offset-2">Register free</Link>
        </p>
      </div>
    </div>
  );
}
