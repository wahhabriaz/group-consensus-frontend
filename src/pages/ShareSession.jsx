// src/pages/ShareSession.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  Copy,
  CheckCircle,
  Users,
  Play,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

export default function ShareSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const shareUrl = `${window.location.origin}/join/${sessionId}`;

  async function loadSession() {
    try {
      const s = await api.getSession(sessionId);
      setSession(s);
      if (s.result) setResult(s.result);
    } catch {
      setError("Session not found");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function resolveNow() {
    setResolving(true);
    setError("");
    try {
      const savedOptions = localStorage.getItem(`session_options_${sessionId}`);
      console.log("Saved options:", savedOptions); // ← add this

      if (!savedOptions) {
        setError("Options not found. Please recreate the session.");
        setResolving(false);
        return;
      }

      const options = JSON.parse(savedOptions);
      console.log("Parsed options:", options); // ← add this

      if (!options || options.length < 2) {
        setError(
          "Need at least 2 options to resolve. Please recreate the session.",
        );
        setResolving(false);
        return;
      }

      const res = await api.resolve(sessionId, options);
      setResult(res);
      await loadSession();
    } catch (err) {
      setError(err.error || err.message || "Failed to resolve");
    } finally {
      setResolving(false);
    }
  }

  if (loading)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-slate text-sm">Loading...</p>
      </div>
    );

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="section-label mb-2">Session Created</p>
          <h1 className="text-4xl font-display font-bold text-ink mb-2">
            {session?.decision_topic}
          </h1>
          <p className="text-sm text-slate">
            Share the link below with your group. Once everyone submits, click
            Resolve to get the result.
          </p>
        </div>

        {/* Share link */}
        <div className="card mb-5">
          <p className="label mb-3">Share this link with your group</p>
          <div className="flex items-center gap-3 bg-mist border border-gray-200 px-4 py-3 mb-3">
            <code className="text-sm font-mono text-ink flex-1 break-all">
              {shareUrl}
            </code>
            <button onClick={copyLink} className="flex-shrink-0">
              {copied ? (
                <CheckCircle size={16} className="text-sage" />
              ) : (
                <Copy
                  size={16}
                  className="text-slate hover:text-ink transition-colors"
                />
              )}
            </button>
          </div>
          <p className="text-xs text-slate">
            Anyone with this link can submit their preferences — no account
            needed.
          </p>
        </div>

        {/* Member status */}
        <div className="card mb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="label mb-0">Participants</p>
            <button
              onClick={loadSession}
              className="text-xs flex items-center gap-1 text-slate hover:text-ink transition-colors"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          {session?.members?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {session.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-mist flex items-center justify-center text-xs font-medium text-ink">
                      {m.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-ink">{m.name}</span>
                  </div>
                  <span className="tag bg-sage/20 text-sage text-xs">
                    Submitted ✓
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Users size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-slate">
                Waiting for participants to join...
              </p>
              <p className="text-xs text-slate mt-1">
                Share the link above to get started
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-coral/10 border border-coral/20 text-coral text-sm px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {/* Result */}
        {result ? (
          <div className="card border-l-4 border-gold animate-fade-up">
            <p className="section-label mb-3">Consensus Result</p>
            <h2 className="text-3xl font-display font-bold text-ink mb-2">
              {result.recommendation}
            </h2>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-2 bg-mist">
                <div
                  className="h-2 bg-gold"
                  style={{
                    width: `${result.consensusScore || result.consensus_score}%`,
                  }}
                />
              </div>
              <span className="text-sm font-mono font-medium">
                {result.consensusScore || result.consensus_score}/100
              </span>
            </div>

            {/* Fairness */}
            {result.fairnessScores && (
              <div className="mb-4">
                <p className="label mb-3">Fairness</p>
                {Object.entries(result.fairnessScores).map(([name, data]) => (
                  <div key={name} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-ink w-20 flex-shrink-0">
                      {name}
                    </span>
                    <div className="flex-1 h-1.5 bg-mist">
                      <div
                        className="h-1.5 bg-ink"
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate">
                      {data.score}/100
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate(`/session/${sessionId}/result`)}
              className="btn-primary"
            >
              View Full Result <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          /* Resolve button */
          session?.status === "OPEN" && (
            <div className="card text-center py-8">
              <Play size={28} className="text-gray-300 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-ink mb-2">
                Ready to find consensus?
              </h3>
              <p className="text-sm text-slate mb-5">
                {session?.member_count > 0
                  ? `${session.member_count} member(s) have submitted. Click resolve when everyone is ready.`
                  : "Share the link first so people can submit their preferences."}
              </p>
              <button
                onClick={resolveNow}
                disabled={resolving || session?.member_count === 0}
                className="btn-gold"
              >
                {resolving ? (
                  "Resolving..."
                ) : (
                  <>
                    <Play size={15} /> Resolve Consensus
                  </>
                )}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
