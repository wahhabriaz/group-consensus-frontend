// src/pages/NewSession.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

const DECISION_TYPES = ["RESTAURANT", "MOVIE", "ACTIVITY", "TIME", "CUSTOM"];

export default function NewSession() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    decision_topic: "",
    decision_type: "RESTAURANT",
    created_by: "",
    expires_in_hours: 24,
  });
  const [options, setOptions] = useState([
    { name: "", tags: "" },
    { name: "", tags: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addOption() {
    setOptions([...options, { name: "", tags: "" }]);
  }
  function removeOption(i) {
    setOptions(options.filter((_, idx) => idx !== i));
  }
  function updateOption(i, field, val) {
    const updated = [...options];
    updated[i] = { ...updated[i], [field]: val };
    setOptions(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await api.createSession(form);
      // save options to localStorage keyed by session_id
      // so the resolve step can use them
      const validOptions = options
        .filter((o) => o.name.trim())
        .map((o) => ({
          name: o.name.trim(),
          tags: o.tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
        }));
      localStorage.setItem(
        `session_options_${session.session_id}`,
        JSON.stringify(validOptions),
      );
      navigate(`/session/${session.session_id}/share`);
    } catch (err) {
      setError(err.error || "Failed to create session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="section-label mb-2">New Session</p>
          <h1 className="text-4xl font-display font-bold text-ink mb-2">
            Create a group decision
          </h1>
          <p className="text-slate text-sm">
            Set up the topic and options. Then share the link with your group.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Topic */}
          <div className="card">
            <p className="label mb-4">Session Details</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="label">Decision Topic</label>
                <input
                  className="input"
                  placeholder="Where should we eat tonight?"
                  value={form.decision_topic}
                  onChange={(e) =>
                    setForm({ ...form, decision_topic: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Decision Type</label>
                  <select
                    className="input"
                    value={form.decision_type}
                    onChange={(e) =>
                      setForm({ ...form, decision_type: e.target.value })
                    }
                  >
                    {DECISION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Your Name</label>
                  <input
                    className="input"
                    placeholder="Ali"
                    value={form.created_by}
                    onChange={(e) =>
                      setForm({ ...form, created_by: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Expires In (hours)</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="72"
                  value={form.expires_in_hours}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expires_in_hours: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="label mb-0">Options to choose from</p>
              <button
                type="button"
                onClick={addOption}
                className="text-xs flex items-center gap-1 text-ink hover:text-gold transition-colors"
              >
                <Plus size={13} /> Add option
              </button>
            </div>
            <p className="text-xs text-slate mb-4">
              Add the options your group will vote on. Tags help the engine
              match preferences accurately.
            </p>
            <div className="flex flex-col gap-3">
              {options.map((o, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-start border border-gray-100 p-3"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      className="input py-2 text-sm"
                      placeholder="Option name (e.g. Golden Dragon)"
                      value={o.name}
                      onChange={(e) => updateOption(i, "name", e.target.value)}
                    />
                    <input
                      className="input py-2 text-xs text-slate"
                      placeholder="Tags: chinese, mild, vegetarian (comma separated)"
                      value={o.tags}
                      onChange={(e) => updateOption(i, "tags", e.target.value)}
                    />
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-coral hover:bg-coral/10 p-2 mt-1 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
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
            {loading ? (
              "Creating session..."
            ) : (
              <>
                Create Session & Get Share Link <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
