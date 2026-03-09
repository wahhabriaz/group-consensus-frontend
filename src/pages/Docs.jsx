// src/pages/Docs.jsx
import { useState } from "react";
import { ChevronRight, Copy, CheckCircle } from "lucide-react";

const endpoints = [
  {
    group: "Auth",
    color: "text-sage",
    items: [
      { method: "POST", path: "/auth/register", desc: "Register and get an API key", body: `{ "name": "Ali Hassan", "email": "ali@example.com" }`, response: `{ "api_key": "cg_live_xxx", "message": "API key created" }` },
      { method: "POST", path: "/auth/recover",  desc: "Recover your API key by email", body: `{ "email": "ali@example.com" }`, response: `{ "api_key": "cg_live_xxx" }` },
      { method: "POST", path: "/auth/revoke",   desc: "Revoke your API key", body: `{ "email": "ali@example.com" }`, response: `{ "message": "API key revoked" }` },
    ]
  },
  {
    group: "Session",
    color: "text-gold",
    items: [
      { method: "POST",   path: "/session/create", desc: "Create a new decision session", body: `{ "decision_topic": "Where to eat?", "decision_type": "RESTAURANT", "created_by": "Ali" }`, response: `{ "session_id": "uuid", "status": "OPEN" }` },
      { method: "GET",    path: "/session/:id",    desc: "Get session details", body: null, response: `{ "session_id": "uuid", "status": "OPEN", "members": [] }` },
      { method: "DELETE", path: "/session/:id",    desc: "Delete a session", body: null, response: `{ "message": "Session deleted" }` },
    ]
  },
  {
    group: "Preferences",
    color: "text-coral",
    items: [
      { method: "POST", path: "/session/:id/preferences", desc: "Submit member preferences",
        body: `{
  "member_name": "Ali",
  "preferences": [
    { "category": "chinese", "weight": 8,
      "polarity": "LIKE", "is_hard_constraint": false },
    { "category": "spicy", "weight": 9,
      "polarity": "DISLIKE", "is_hard_constraint": true }
  ]
}`,
        response: `{ "member_id": "uuid", "preferences_saved": 2 }` },
      { method: "GET", path: "/session/:id/preferences", desc: "Get all preferences", body: null, response: `{ "members": [...] }` },
    ]
  },
  {
    group: "Consensus",
    color: "text-blue-400",
    items: [
      { method: "POST", path: "/session/:id/resolve", desc: "Run the consensus algorithm",
        body: `{
  "options": [
    { "name": "Golden Dragon", "tags": ["chinese","mild","vegetarian"] },
    { "name": "Spicy Thai",    "tags": ["thai","spicy"] },
    { "name": "McDonalds",     "tags": ["fast-food","american"] }
  ]
}`,
        response: `{
  "recommendation": "Golden Dragon",
  "consensus_score": 100,
  "fairness": {
    "Ali":  { "score": 90, "won": ["chinese","no spicy"] },
    "Sara": { "score": 95, "won": ["chinese","vegetarian"] }
  },
  "conflicts_resolved": [...],
  "alternatives": [...]
}` },
      { method: "POST", path: "/quick", desc: "One-shot consensus — no session needed",
        body: `{
  "topic": "Pick a movie",
  "members": [
    { "name": "Ali",  "likes": ["thriller"], "dislikes": ["horror"] },
    { "name": "Sara", "likes": ["thriller","comedy"] }
  ],
  "options": [
    { "name": "thriller", "tags": ["thriller"] },
    { "name": "horror",   "tags": ["horror"] },
    { "name": "comedy",   "tags": ["comedy"] }
  ]
}`,
        response: `{ "recommendation": "thriller", "consensus_score": 100 }` },
    ]
  },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="text-gray-500 hover:text-gray-300 transition-colors">
      {copied ? <CheckCircle size={14} className="text-sage" /> : <Copy size={14} />}
    </button>
  );
}

function MethodBadge({ method }) {
  const colors = {
    GET:    "bg-sage/20 text-sage",
    POST:   "bg-blue-500/20 text-blue-400",
    PUT:    "bg-gold/20 text-gold",
    DELETE: "bg-coral/20 text-coral",
  };
  return (
    <span className={`text-xs font-mono font-semibold px-2 py-1 ${colors[method] || "bg-gray-700 text-gray-300"}`}>
      {method}
    </span>
  );
}

export default function Docs() {
  const [active, setActive] = useState(null);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <p className="label mb-4">API Reference</p>
              <div className="flex flex-col gap-1">
                {endpoints.map(g => (
                  <div key={g.group}>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 mt-4 ${g.color}`}>{g.group}</p>
                    {g.items.map(e => (
                      <a key={e.path} href={`#${e.path}`}
                         className="block text-xs text-slate hover:text-ink py-1 pl-2 border-l border-gray-200 hover:border-ink transition-all font-mono">
                        {e.path}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            {/* Intro */}
            <div className="mb-12">
              <p className="section-label mb-3">API Reference</p>
              <h1 className="text-4xl font-display font-bold text-ink mb-4">Documentation</h1>
              <p className="text-slate leading-relaxed mb-6">
                Base URL: <code className="bg-mist px-2 py-1 text-sm font-mono">http://localhost:3000/v1</code>
              </p>
              <div className="bg-ink text-paper p-5">
                <p className="label text-gray-400 mb-2">Authentication</p>
                <p className="text-sm text-gray-300 mb-3">All protected endpoints require your API key in the header:</p>
                <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
                  <code className="text-xs font-mono text-gold">x-api-key: cg_live_your_key_here</code>
                  <CopyBtn text="x-api-key: cg_live_your_key_here" />
                </div>
              </div>
            </div>

            {/* Endpoint groups */}
            {endpoints.map(group => (
              <div key={group.group} className="mb-12">
                <h2 className={`text-sm font-semibold uppercase tracking-widest mb-6 ${group.color}`}>
                  {group.group}
                </h2>

                <div className="flex flex-col gap-4">
                  {group.items.map(ep => (
                    <div key={ep.path} id={ep.path} className="border border-gray-100 overflow-hidden">
                      {/* Header */}
                      <button
                        onClick={() => setActive(active === ep.path ? null : ep.path)}
                        className="w-full flex items-center justify-between p-5 hover:bg-mist transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <MethodBadge method={ep.method} />
                          <code className="text-sm font-mono text-ink">{ep.path}</code>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate hidden md:block">{ep.desc}</span>
                          <ChevronRight size={16} className={`text-slate transition-transform ${active === ep.path ? "rotate-90" : ""}`} />
                        </div>
                      </button>

                      {/* Expanded */}
                      {active === ep.path && (
                        <div className="border-t border-gray-100 bg-gray-50">
                          <div className="grid md:grid-cols-2 divide-x divide-gray-100">
                            {ep.body && (
                              <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="label">Request Body</p>
                                  <CopyBtn text={ep.body} />
                                </div>
                                <pre className="text-xs font-mono text-gray-700 bg-white border border-gray-100 p-4 overflow-x-auto leading-relaxed">
                                  {ep.body}
                                </pre>
                              </div>
                            )}
                            <div className="p-5">
                              <div className="flex items-center justify-between mb-3">
                                <p className="label">Response</p>
                                <CopyBtn text={ep.response} />
                              </div>
                              <pre className="text-xs font-mono text-gray-700 bg-white border border-gray-100 p-4 overflow-x-auto leading-relaxed">
                                {ep.response}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
