// src/pages/JoinSession.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";
import { Plus, Trash2, CheckCircle, Users } from "lucide-react";

export default function JoinSession() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [prefs, setPrefs] = useState([
    { category: "", weight: 5, polarity: "LIKE", is_hard_constraint: false },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const s = await api.getSession(sessionId);
        setSession(s);
      } catch {
        setSessionError("Session not found or has expired.");
      } finally {
        setLoadingSession(false);
      }
    }
    load();
  }, [sessionId]);

  function addPref() {
    setPrefs([
      ...prefs,
      { category: "", weight: 5, polarity: "LIKE", is_hard_constraint: false },
    ]);
  }

  function removePref(i) {
    setPrefs(prefs.filter((_, idx) => idx !== i));
  }

  function updatePref(i, field, val) {
    const updated = [...prefs];
    updated[i] = { ...updated[i], [field]: val };
    setPrefs(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const validPrefs = prefs.filter((p) => p.category.trim());
      if (!validPrefs.length) {
        setError("Add at least one preference");
        setLoading(false);
        return;
      }
      await api.submitPrefs(sessionId, {
        member_name: name,
        budget: budget ? parseInt(budget) : undefined,
        preferences: validPrefs.map((p) => ({
          ...p,
          category: p.category.toLowerCase().trim(),
          weight: parseInt(p.weight),
        })),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.error || "Failed to submit preferences");
    } finally {
      setLoading(false);
    }
  }

  if (loadingSession)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-slate text-sm">Loading session...</p>
      </div>
    );

  if (sessionError)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-coral font-medium mb-2">Session not found</p>
          <p className="text-slate text-sm">{sessionError}</p>
        </div>
      </div>
    );

  if (session?.status === "EXPIRED")
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-coral font-medium mb-2">Session Expired</p>
          <p className="text-slate text-sm">
            This session has expired. Ask the host to create a new one.
          </p>
        </div>
      </div>
    );

  if (submitted)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-sage/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-sage" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink mb-3">
            Preferences submitted!
          </h1>
          <p className="text-slate text-sm mb-6">
            Your preferences for <strong>{session?.decision_topic}</strong> have
            been saved. The host will run the consensus when everyone has
            submitted.
          </p>
          <div className="card text-left">
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-slate" />
              <p className="text-sm font-medium text-ink">
                {session?.member_count} member(s) in this session
              </p>
            </div>
            <p className="text-xs text-slate">
              The host will share the result once consensus is resolved. You can
              bookmark this page to check back.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-16">
        {/* Session info */}
        <div className="card border-l-4 border-gold mb-8">
          <p className="section-label mb-1">You're invited</p>
          <h1 className="text-2xl font-display font-bold text-ink mb-1">
            {session?.decision_topic}
          </h1>
          <p className="text-sm text-slate">
            Created by <strong>{session?.created_by}</strong> ·{" "}
            {session?.member_count} member(s) so far
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name + budget */}
          <div className="card">
            <p className="label mb-4">Your Details</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="label">Your Name</label>
                <input
                  className="input"
                  placeholder="Sara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Budget (optional)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="1500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="label mb-0">Your Preferences</p>
              <button
                type="button"
                onClick={addPref}
                className="text-xs flex items-center gap-1 text-ink hover:text-gold transition-colors"
              >
                <Plus size={13} /> Add preference
              </button>
            </div>
            <p className="text-xs text-slate mb-4">
              Add what you like or dislike. Mark dealbreakers as hard
              constraints.
            </p>

            <div className="flex flex-col gap-3">
              {prefs.map((p, i) => (
                <div key={i} className="border border-gray-100 p-3">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="label">Category</label>
                      <input
                        className="input py-2 text-sm"
                        placeholder="chinese, spicy, vegetarian..."
                        value={p.category}
                        onChange={(e) =>
                          updatePref(i, "category", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Weight (1-10)</label>
                      <input
                        className="input py-2 text-sm"
                        type="number"
                        min="1"
                        max="10"
                        value={p.weight}
                        onChange={(e) =>
                          updatePref(i, "weight", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {["LIKE", "DISLIKE"].map((pol) => (
                        <label
                          key={pol}
                          className="flex items-center gap-1.5 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`polarity_${i}`}
                            value={pol}
                            checked={p.polarity === pol}
                            onChange={() => updatePref(i, "polarity", pol)}
                          />
                          <span
                            className={`text-xs font-medium ${pol === "LIKE" ? "text-sage" : "text-coral"}`}
                          >
                            {pol}
                          </span>
                        </label>
                      ))}
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        checked={p.is_hard_constraint}
                        onChange={(e) =>
                          updatePref(i, "is_hard_constraint", e.target.checked)
                        }
                      />
                      <span className="text-xs text-slate">
                        Hard constraint
                      </span>
                    </label>

                    {prefs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePref(i)}
                        className="text-coral hover:bg-coral/10 p-1 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-coral/10 border border-coral/20 text-coral text-sm px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary justify-center py-4"
          >
            {loading ? "Submitting..." : "Submit My Preferences"}
          </button>
        </form>
      </div>
    </div>
  );
}
