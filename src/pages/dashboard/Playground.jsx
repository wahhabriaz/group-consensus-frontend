// src/pages/dashboard/Playground.jsx
import { useState } from "react";
import { Play, Plus, Trash2, Zap } from "lucide-react";
import { api } from "../../utils/api";

const DEFAULTS = {
  topic: "Where should we eat tonight?",
  members: [
    { name: "Ali",  likes: "chinese, mild",       dislikes: "spicy" },
    { name: "Sara", likes: "chinese, vegetarian", dislikes: "" },
  ],
  options: [
    { name: "Golden Dragon",  tags: "chinese, mild, vegetarian" },
    { name: "Spicy Thai",     tags: "thai, spicy" },
    { name: "Pizza Palace",   tags: "italian, pizza, mild" },
    { name: "McDonalds",      tags: "fast-food, american, cheap" },
  ]
};

function parseTags(str) {
  return str.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
}

export default function Playground() {
  const [topic,   setTopic]   = useState(DEFAULTS.topic);
  const [members, setMembers] = useState(DEFAULTS.members);
  const [options, setOptions] = useState(DEFAULTS.options);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  function addMember()  { setMembers([...members, { name: "", likes: "", dislikes: "" }]); }
  function addOption()  { setOptions([...options, { name: "", tags: "" }]); }
  function removeMember(i) { setMembers(members.filter((_, idx) => idx !== i)); }
  function removeOption(i) { setOptions(options.filter((_, idx) => idx !== i)); }

  function updateMember(i, field, val) {
    const updated = [...members];
    updated[i] = { ...updated[i], [field]: val };
    setMembers(updated);
  }

  function updateOption(i, field, val) {
    const updated = [...options];
    updated[i] = { ...updated[i], [field]: val };
    setOptions(updated);
  }

  async function run() {
    setError(""); setResult(null); setLoading(true);
    try {
      const payload = {
        topic,
        members: members
          .filter(m => m.name)
          .map(m => ({
            name:     m.name,
            likes:    parseTags(m.likes),
            dislikes: parseTags(m.dislikes),
          })),
        options: options
          .filter(o => o.name)
          .map(o => ({
            name: o.name,
            tags: parseTags(o.tags),
          })),
      };

      const res = await api.quick(payload);
      setResult(res);
    } catch (err) {
      setError(err.error || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTopic(DEFAULTS.topic);
    setMembers(DEFAULTS.members);
    setOptions(DEFAULTS.options);
    setResult(null);
    setError("");
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="section-label mb-1">Playground</p>
          <h1 className="text-3xl font-display font-bold text-ink">Quick Consensus Tester</h1>
          <p className="text-slate text-sm mt-1">Test the /quick endpoint live against your API.</p>
        </div>
        <button onClick={reset} className="btn-secondary py-2 text-xs">Reset</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left — inputs */}
        <div className="flex flex-col gap-5">

          {/* Topic */}
          <div className="card">
            <label className="label">Decision Topic</label>
            <input className="input" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="Where to eat, movie to watch..." />
          </div>

          {/* Members */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="label mb-0">Members & Preferences</p>
              <button onClick={addMember} className="text-xs flex items-center gap-1 text-ink hover:text-gold transition-colors">
                <Plus size={13} /> Add member
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {members.map((m, i) => (
                <div key={i} className="border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input className="input py-1.5 text-sm font-medium" placeholder="Name"
                      value={m.name} onChange={e => updateMember(i, "name", e.target.value)} />
                    <button onClick={() => removeMember(i)} className="ml-2 text-coral hover:bg-coral/10 p-1.5">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="label text-sage">Likes (comma separated)</p>
                      <input className="input py-1.5 text-sm" placeholder="chinese, mild, vegetarian"
                        value={m.likes} onChange={e => updateMember(i, "likes", e.target.value)} />
                    </div>
                    <div>
                      <p className="label text-coral">Dislikes (comma separated)</p>
                      <input className="input py-1.5 text-sm" placeholder="spicy, loud"
                        value={m.dislikes} onChange={e => updateMember(i, "dislikes", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="label mb-0">Options</p>
              <button onClick={addOption} className="text-xs flex items-center gap-1 text-ink hover:text-gold transition-colors">
                <Plus size={13} /> Add option
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {options.map((o, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-1">
                    <input className="input py-1.5 text-sm" placeholder="Option name"
                      value={o.name} onChange={e => updateOption(i, "name", e.target.value)} />
                    <input className="input py-1.5 text-xs text-slate" placeholder="Tags: chinese, mild, vegetarian"
                      value={o.tags} onChange={e => updateOption(i, "tags", e.target.value)} />
                  </div>
                  <button onClick={() => removeOption(i)} className="text-coral hover:bg-coral/10 p-1.5 mt-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={run} disabled={loading}
            className="btn-gold justify-center text-base py-4">
            {loading
              ? "Running..."
              : <><Zap size={16} /> Run Consensus</>
            }
          </button>
        </div>

        {/* Right — result */}
        <div className="flex flex-col gap-5">
          {error && (
            <div className="card border-coral/30 bg-coral/5">
              <p className="text-sm text-coral font-medium">Error</p>
              <p className="text-sm text-coral mt-1">{error}</p>
            </div>
          )}

          {result && (
            <>
              {/* Winner */}
              <div className="card border-l-4 border-gold animate-fade-up">
                <p className="label mb-2">Recommendation</p>
                <h2 className="text-3xl font-display font-bold text-ink mb-1">{result.recommendation}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 flex-1 bg-mist">
                    <div className="h-2 bg-gold transition-all" style={{ width: `${result.consensus_score}%` }} />
                  </div>
                  <span className="text-sm font-mono font-medium text-ink">{result.consensus_score}/100</span>
                </div>
              </div>

              {/* Fairness */}
              {result.fairness && (
                <div className="card animate-fade-up delay-100">
                  <p className="label mb-4">Fairness Breakdown</p>
                  <div className="flex flex-col gap-4">
                    {Object.entries(result.fairness).map(([name, data]) => (
                      <div key={name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-ink">{name}</span>
                          <span className="text-sm font-mono text-ink">{data.score}/100</span>
                        </div>
                        <div className="h-1.5 bg-mist mb-2">
                          <div className="h-1.5 bg-ink transition-all" style={{ width: `${data.score}%` }} />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {data.won.map(w  => <span key={w} className="text-xs px-2 py-0.5 bg-sage/20 text-sage">✓ {w}</span>)}
                          {data.lost.map(l => <span key={l} className="text-xs px-2 py-0.5 bg-coral/10 text-coral">✗ {l}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {result.alternatives?.length > 0 && (
                <div className="card animate-fade-up delay-200">
                  <p className="label mb-3">Alternatives</p>
                  <div className="flex flex-col gap-2">
                    {result.alternatives.map(a => (
                      <div key={a.option} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-ink">{a.option}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-mist">
                            <div className="h-1.5 bg-gray-300" style={{ width: `${a.consensus_score}%` }} />
                          </div>
                          <span className="text-xs font-mono text-slate w-10 text-right">{a.consensus_score}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conflicts */}
              {result.conflicts_resolved?.length > 0 && (
                <div className="card animate-fade-up delay-300">
                  <p className="label mb-3">Conflict Explanations</p>
                  <div className="flex flex-col gap-2">
                    {result.conflicts_resolved.map((c, i) => (
                      <p key={i} className="text-xs text-slate leading-relaxed border-l-2 border-mist pl-3">{c}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <div className="card border-gold/30 bg-gold/5 animate-fade-up delay-400">
                  <p className="label text-gold mb-2">Warnings</p>
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-xs text-slate">{w}</p>
                  ))}
                </div>
              )}
            </>
          )}

          {!result && !error && (
            <div className="card flex flex-col items-center justify-center py-16 text-slate">
              <Play size={32} className="opacity-20 mb-3" />
              <p className="text-sm">Fill in the form and click Run Consensus</p>
              <p className="text-xs mt-1 opacity-60">Results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
