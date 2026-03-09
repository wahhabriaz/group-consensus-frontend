// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { ArrowRight, Copy, CheckCircle } from "lucide-react";

export default function Register() {
  const [form, setForm]     = useState({ name: "", email: "" });
  const [apiKey, setApiKey] = useState(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate            = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.register(form.name, form.email);
      setApiKey(res.api_key);
      localStorage.setItem("cg_api_key", res.api_key);
      localStorage.setItem("cg_email", form.email);
    } catch (err) {
      setError(err.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (apiKey) return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-sage/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={24} className="text-sage" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink mb-2">You're all set!</h1>
          <p className="text-slate text-sm">Save your API key — we won't show it again.</p>
        </div>

        <div className="card mb-4">
          <p className="label mb-2">Your API Key</p>
          <div className="flex items-center justify-between bg-mist border border-gray-200 px-4 py-3">
            <code className="text-sm font-mono text-ink break-all">{apiKey}</code>
            <button onClick={copyKey} className="ml-3 flex-shrink-0">
              {copied
                ? <CheckCircle size={16} className="text-sage" />
                : <Copy size={16} className="text-slate hover:text-ink" />
              }
            </button>
          </div>
          <p className="text-xs text-coral mt-2">⚠ Copy this now. You can recover it by email, but store it safely.</p>
        </div>

        <button onClick={() => navigate("/dashboard")} className="btn-primary w-full justify-center">
          Go to Dashboard <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <p className="section-label mb-3">Get Started</p>
          <h1 className="text-4xl font-display font-bold text-ink mb-2">Get your API key</h1>
          <p className="text-slate text-sm">Free to start. No credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Your Name</label>
            <input className="input" placeholder="Ali Hassan"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input className="input" type="email" placeholder="ali@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          {error && <p className="text-sm text-coral bg-coral/10 px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary justify-center mt-2">
            {loading ? "Creating key..." : <>Get API Key <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-6">
          Already have a key?{" "}
          <Link to="/login" className="text-ink font-medium underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
