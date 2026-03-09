// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Zap, Shield, BarChart2, Users, Code2 } from "lucide-react";

const codeExample = `// One API call — fair group decision
const res = await fetch("/v1/quick", {
  method: "POST",
  headers: { "x-api-key": "cg_live_xxx" },
  body: JSON.stringify({
    topic: "Where to eat?",
    members: [
      { name: "Ali",  likes: ["chinese"], dislikes: ["spicy"] },
      { name: "Sara", likes: ["chinese", "vegetarian"] }
    ],
    options: [
      { name: "Golden Dragon", tags: ["chinese","vegetarian","mild"] },
      { name: "Spicy Thai",    tags: ["thai","spicy"] }
    ]
  })
});

// Response
{
  "recommendation": "Golden Dragon",
  "consensus_score": 100,
  "fairness": {
    "Ali":  { "score": 90, "won": ["chinese","no spicy"] },
    "Sara": { "score": 95, "won": ["chinese","vegetarian"] }
  }
}`;

const features = [
  { icon: Zap,      title: "Instant Results",      desc: "Get fair recommendations in milliseconds. No complex setup required." },
  { icon: Shield,   title: "Hard Constraints",      desc: "Dealbreakers are respected. If Ali hates spicy, no spicy options survive." },
  { icon: BarChart2,title: "Fairness Scoring",      desc: "Every member gets a satisfaction score. No one gets steamrolled." },
  { icon: Users,    title: "Multi-member Support",  desc: "Works with 2 to 20 members. Scales to any group size." },
  { icon: Code2,    title: "Tag-based Matching",    desc: "Options matched by semantic tags, not fragile string guessing." },
  { icon: CheckCircle, title: "Conflict Explanations", desc: "Every decision comes with human-readable explanations of trade-offs." },
];

const useCases = [
  { label: "Food Apps",       desc: "Let friend groups agree on a restaurant without the endless back-and-forth." },
  { label: "Team Tools",      desc: "Help remote teams find meeting times, tools, or activities everyone accepts." },
  { label: "Travel Planners", desc: "Pick destinations, hotels, and activities that the whole group can enjoy." },
  { label: "Entertainment",   desc: "Movie night? Game night? Let the algorithm pick what the group actually wants." },
];

export default function Landing() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <p className="section-label mb-4">Group Decision API</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-ink leading-tight mb-6">
              The fair way to
              <br />
              <span className="text-gold">make group</span>
              <br />
              decisions.
            </h1>
            <p className="text-lg text-slate leading-relaxed mb-8 max-w-md">
              A REST API that takes your group's preferences and returns the
              mathematically fairest recommendation — with full explanations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">
                Get your API key <ArrowRight size={16} />
              </Link>
              <Link to="/session/new" className="btn-secondary">
                Start a Group Decision
              </Link>
              <Link to="/docs" className="btn-secondary">
                Read the docs
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {["Free to start", "No credit card", "26 tests passing"].map(
                (t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 text-sm text-slate"
                  >
                    <CheckCircle size={14} className="text-sage" />
                    {t}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Code preview */}
          <div className="animate-fade-up delay-200">
            <div className="bg-ink rounded-none border border-gray-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-coral opacity-80" />
                <div className="w-3 h-3 rounded-full bg-gold opacity-80" />
                <div className="w-3 h-3 rounded-full bg-sage opacity-80" />
                <span className="ml-2 text-xs text-gray-500 font-mono">
                  quick-consensus.js
                </span>
              </div>
              <pre className="p-5 text-xs text-gray-300 font-mono leading-relaxed overflow-x-auto">
                {codeExample}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-mist">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "14", label: "Endpoints" },
              { num: "26", label: "Tests Passing" },
              { num: "~2ms", label: "Avg Response" },
              { num: "100%", label: "Tag Accuracy" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-ink">
                  {s.num}
                </p>
                <p className="text-sm text-slate mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Why Consensus API</p>
          <h2 className="text-4xl font-display font-bold text-ink">
            Built for real use cases
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 bg-mist flex items-center justify-center mb-4">
                <f.icon size={20} className="text-ink" />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink text-paper py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-gold mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-display font-bold">
              Three steps to consensus
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Submit preferences",
                desc: "Each member submits what they like, dislike, and what are absolute dealbreakers.",
              },
              {
                step: "02",
                title: "Engine runs",
                desc: "Hard constraints eliminate options. Remaining options are scored by group satisfaction.",
              },
              {
                step: "03",
                title: "Get fair result",
                desc: "Receive a recommendation, consensus score, per-member fairness, and explanations.",
              },
            ].map((s) => (
              <div key={s.step} className="border border-gray-700 p-8">
                <p className="font-mono text-gold text-sm mb-4">{s.step}</p>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Use Cases</p>
          <h2 className="text-4xl font-display font-bold text-ink">
            Built for any group decision
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((u) => (
            <div
              key={u.label}
              className="flex gap-5 p-6 border border-gray-100 hover:border-gold transition-colors"
            >
              <div className="w-2 h-2 bg-gold mt-2 flex-shrink-0" />
              <div>
                <h3 className="font-display font-semibold text-ink mb-1">
                  {u.label}
                </h3>
                <p className="text-sm text-slate leading-relaxed">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mist border-y border-gray-100 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold text-ink mb-4">
            Ready to add fair decisions to your app?
          </h2>
          <p className="text-slate mb-8">
            Get your API key in seconds. Free to start, no credit card required.
          </p>
          <Link to="/register" className="btn-primary text-base px-8 py-4">
            Get API Key — it's free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
