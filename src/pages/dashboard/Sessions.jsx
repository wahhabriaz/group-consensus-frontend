// src/pages/dashboard/Sessions.jsx
import { useState } from "react";
import { api } from "../../utils/api";
import { Search, Trash2, Eye, ChevronRight } from "lucide-react";

const STATUS_COLORS = {
  OPEN:     "bg-sage/20 text-sage",
  RESOLVED: "bg-blue-100 text-blue-600",
  EXPIRED:  "bg-gray-100 text-gray-500",
};

export default function Sessions() {
  const [sessionId, setSessionId]   = useState("");
  const [session,   setSession]     = useState(null);
  const [error,     setError]       = useState("");
  const [loading,   setLoading]     = useState(false);
  const [deleted,   setDeleted]     = useState(false);

  async function lookup() {
    if (!sessionId.trim()) return;
    setError(""); setSession(null); setDeleted(false); setLoading(true);
    try {
      const res = await api.getSession(sessionId.trim());
      setSession(res);
    } catch (err) {
      setError(err.error || "Session not found");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession() {
    if (!session) return;
    try {
      await api.deleteSession(session.session_id);
      setSession(null);
      setDeleted(true);
    } catch (err) {
      setError(err.error || "Delete failed");
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <p className="section-label mb-1">Sessions</p>
        <h1 className="text-3xl font-display font-bold text-ink">Session History</h1>
        <p className="text-slate text-sm mt-1">Look up any session by its ID.</p>
      </div>

      {/* Lookup */}
      <div className="card mb-6">
        <p className="label mb-3">Look Up Session</p>
        <div className="flex gap-3">
          <input className="input flex-1" placeholder="Enter session ID (UUID)..."
            value={sessionId} onChange={e => setSessionId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && lookup()} />
          <button onClick={lookup} disabled={loading} className="btn-primary">
            {loading ? "..." : <><Search size={15} /> Lookup</>}
          </button>
        </div>
      </div>

      {error   && <div className="bg-coral/10 border border-coral/20 text-coral text-sm px-4 py-3 mb-4">{error}</div>}
      {deleted && <div className="bg-sage/10 border border-sage/20 text-sage text-sm px-4 py-3 mb-4">Session deleted successfully.</div>}

      {/* Session detail */}
      {session && (
        <div className="card animate-fade-up">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-xl text-ink mb-1">{session.decision_topic}</h2>
              <code className="text-xs font-mono text-slate">{session.session_id}</code>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 font-medium ${STATUS_COLORS[session.status] || "bg-gray-100"}`}>
                {session.status}
              </span>
              <button onClick={deleteSession}
                className="text-coral hover:bg-coral/10 p-2 transition-colors" title="Delete session">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { label: "Decision Type", value: session.decision_type },
              { label: "Created By",    value: session.created_by },
              { label: "Members",       value: session.member_count },
            ].map(f => (
              <div key={f.label}>
                <p className="label">{f.label}</p>
                <p className="text-sm font-medium text-ink">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Members */}
          {session.members?.length > 0 && (
            <div className="mb-6">
              <p className="label mb-3">Members</p>
              <div className="flex flex-wrap gap-2">
                {session.members.map(m => (
                  <span key={m.id} className="tag">{m.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {session.result && (
            <div className="bg-mist border border-gray-200 p-5">
              <p className="label mb-3">Consensus Result</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-display font-bold text-ink">{session.result.recommendation}</p>
                  <p className="text-sm text-slate">Consensus score: <strong>{session.result.consensusScore}/100</strong></p>
                </div>
                <ChevronRight size={20} className="text-slate" />
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-slate">
              Expires: {new Date(session.expires_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!session && !error && !deleted && (
        <div className="text-center py-16 text-slate">
          <Eye size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter a session ID above to view its details</p>
        </div>
      )}
    </div>
  );
}
