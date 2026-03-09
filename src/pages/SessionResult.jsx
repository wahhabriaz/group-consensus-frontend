// src/pages/SessionResult.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../utils/api";
import { Share2, Copy, CheckCircle } from "lucide-react";

export default function SessionResult() {
  const { sessionId } = useParams();
  const [result, setResult] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([
          api.getSession(sessionId),
          api.getResult(sessionId),
        ]);
        setSession(s);
        setResult(r);
      } catch {
        setError("Result not found. Has the host resolved the session?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-slate text-sm">Loading result...</p>
      </div>
    );

  if (error)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-coral font-medium mb-2">
            Result not available yet
          </p>
          <p className="text-slate text-sm mb-4">{error}</p>
          <Link to={`/join/${sessionId}`} className="btn-secondary">
            Submit Your Preferences
          </Link>
        </div>
      </div>
    );

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="section-label mb-2">Consensus Result</p>
            <h1 className="text-4xl font-display font-bold text-ink">
              {session?.decision_topic}
            </h1>
          </div>
          <button
            onClick={copyLink}
            className="btn-secondary py-2 text-xs flex items-center gap-2"
          >
            {copied ? (
              <CheckCircle size={14} className="text-sage" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        {/* Winner */}
        <div className="bg-ink text-paper p-8 mb-5">
          <p className="text-xs font-medium tracking-widest uppercase text-gold mb-3">
            The group chose
          </p>
          <h2 className="text-5xl font-display font-bold mb-4">
            {result?.recommendation}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-700">
              <div
                className="h-2 bg-gold transition-all"
                style={{ width: `${result?.consensus_score}%` }}
              />
            </div>
            <span className="font-mono text-sm text-gold">
              {result?.consensus_score}/100
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Consensus score</p>
        </div>

        {/* Fairness */}
        {result?.fairness && (
          <div className="card mb-5">
            <p className="label mb-5">How fair was this for everyone?</p>
            <div className="flex flex-col gap-5">
              {Object.entries(result.fairness).map(([name, data]) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-mist flex items-center justify-center text-xs font-medium">
                        {name[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-ink">
                        {name}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-ink font-medium">
                      {data.score}/100
                    </span>
                  </div>
                  <div className="h-2 bg-mist mb-2">
                    <div
                      className={`h-2 transition-all ${data.score >= 70 ? "bg-sage" : data.score >= 40 ? "bg-gold" : "bg-coral"}`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.won?.map((w) => (
                      <span
                        key={w}
                        className="text-xs px-2 py-0.5 bg-sage/20 text-sage"
                      >
                        ✓ {w}
                      </span>
                    ))}
                    {data.lost?.map((l) => (
                      <span
                        key={l}
                        className="text-xs px-2 py-0.5 bg-coral/10 text-coral"
                      >
                        ✗ {l}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives */}
        {result?.alternatives?.length > 0 && (
          <div className="card mb-5">
            <p className="label mb-4">Alternatives considered</p>
            <div className="flex flex-col gap-3">
              {result.alternatives.map((a) => (
                <div
                  key={a.option}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-ink">{a.option}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 bg-mist">
                      <div
                        className="h-1.5 bg-gray-300"
                        style={{ width: `${a.consensus_score}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate">
                      {a.consensus_score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eliminated */}
        {result?.eliminated?.length > 0 && (
          <div className="card mb-5 border-coral/20">
            <p className="label text-coral mb-3">Eliminated options</p>
            {result.eliminated.map((e) => (
              <div key={e.option} className="flex items-start gap-2 mb-2">
                <span className="text-xs text-coral mt-0.5">✗</span>
                <p className="text-xs text-slate">
                  <strong className="text-ink">{e.option}</strong> — {e.reason}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Conflicts */}
        {result?.conflicts_resolved?.length > 0 && (
          <div className="card">
            <p className="label mb-3">How we reached this decision</p>
            {result.conflicts_resolved.map((c, i) => (
              <p
                key={i}
                className="text-xs text-slate leading-relaxed border-l-2 border-mist pl-3 mb-2"
              >
                {c}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
