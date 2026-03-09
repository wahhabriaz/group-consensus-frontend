// src/pages/dashboard/ApiKeys.jsx
import { useState } from "react";
import { Copy, CheckCircle, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { api } from "../../utils/api";

export default function ApiKeys() {
  const storedKey   = localStorage.getItem("cg_api_key") || "";
  const storedEmail = localStorage.getItem("cg_email") || "";
  const [visible,   setVisible]   = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [revoking,  setRevoking]  = useState(false);
  const [revoked,   setRevoked]   = useState(false);
  const [error,     setError]     = useState("");
  const [email,     setEmail]     = useState(storedEmail);
  const [recovering, setRecovering] = useState(false);
  const [recovered,  setRecovered]  = useState(false);

  function copyKey() {
    navigator.clipboard.writeText(storedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function revokeKey() {
    if (!window.confirm("Are you sure? This will deactivate your key permanently.")) return;
    setRevoking(true); setError("");
    try {
      await api.revoke(storedEmail);
      localStorage.removeItem("cg_api_key");
      setRevoked(true);
    } catch (err) {
      setError(err.error || "Revoke failed");
    } finally {
      setRevoking(false);
    }
  }

  async function recoverKey() {
    if (!email) return;
    setRecovering(true); setError("");
    try {
      const res = await api.recover(email);
      localStorage.setItem("cg_api_key", res.api_key);
      localStorage.setItem("cg_email", email);
      setRecovered(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.error || "Email not found");
    } finally {
      setRecovering(false);
    }
  }

  const maskedKey = storedKey
    ? storedKey.slice(0, 12) + "••••••••••••" + storedKey.slice(-4)
    : "";

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <p className="section-label mb-1">API Keys</p>
        <h1 className="text-3xl font-display font-bold text-ink">Key Management</h1>
        <p className="text-slate text-sm mt-1">View, copy, or revoke your API key.</p>
      </div>

      {error   && <div className="bg-coral/10 border border-coral/20 text-coral text-sm px-4 py-3 mb-4">{error}</div>}
      {revoked && <div className="bg-coral/10 border border-coral/20 text-coral text-sm px-4 py-3 mb-4">Key revoked. Please register for a new key.</div>}

      {storedKey && !revoked ? (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">Your Active API Key</h2>
            <span className="tag bg-sage/20 text-sage">Active</span>
          </div>

          {storedEmail && (
            <div className="mb-4">
              <p className="label">Registered Email</p>
              <p className="text-sm text-ink">{storedEmail}</p>
            </div>
          )}

          <div className="mb-6">
            <p className="label">API Key</p>
            <div className="flex items-center gap-3 bg-mist border border-gray-200 px-4 py-3">
              <code className="text-sm font-mono text-ink flex-1 break-all">
                {visible ? storedKey : maskedKey}
              </code>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setVisible(!visible)} className="text-slate hover:text-ink transition-colors">
                  {visible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button onClick={copyKey} className="text-slate hover:text-ink transition-colors">
                  {copied ? <CheckCircle size={15} className="text-sage" /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Usage example */}
          <div className="bg-ink p-4 mb-6">
            <p className="label text-gray-400 mb-2">Usage Example</p>
            <code className="text-xs font-mono text-gold">
              curl -H "x-api-key: {visible ? storedKey : maskedKey}" http://localhost:3000/v1/health
            </code>
          </div>

          {/* Danger zone */}
          <div className="border border-coral/30 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-coral mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink mb-1">Danger Zone</p>
                <p className="text-xs text-slate mb-3">
                  Revoking your key is permanent. All apps using this key will stop working immediately.
                </p>
                <button onClick={revokeKey} disabled={revoking}
                  className="text-xs border border-coral text-coral px-4 py-2 hover:bg-coral hover:text-white transition-all">
                  {revoking ? "Revoking..." : "Revoke API Key"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No key — recovery form */
        <div className="card max-w-md">
          <h2 className="font-display font-semibold text-ink mb-2">Recover your key</h2>
          <p className="text-sm text-slate mb-4">Enter your registered email to recover your API key.</p>
          <div className="flex flex-col gap-3">
            <input className="input" type="email" placeholder="ali@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={recoverKey} disabled={recovering} className="btn-primary justify-center">
              {recovering ? "Recovering..." : recovered ? "Recovered! ✓" : "Recover Key"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
