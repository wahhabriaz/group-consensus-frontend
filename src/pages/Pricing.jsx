// src/pages/Pricing.jsx
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const plans = [
  {
    name:  "Free",
    price: "$0",
    per:   "forever",
    desc:  "Perfect for side projects and testing.",
    features: [
      "100 requests / day",
      "5 active sessions",
      "Quick consensus endpoint",
      "Community support",
    ],
    cta:   "Get started free",
    href:  "/register",
    style: "border border-gray-200",
    badge: null,
  },
  {
    name:  "Basic",
    price: "$9",
    per:   "per month",
    desc:  "For indie developers and small apps.",
    features: [
      "5,000 requests / month",
      "Unlimited sessions",
      "All endpoints",
      "Session history (30 days)",
      "Email support",
    ],
    cta:   "Start Basic",
    href:  "/register",
    style: "border-2 border-ink",
    badge: "Most Popular",
  },
  {
    name:  "Pro",
    price: "$29",
    per:   "per month",
    desc:  "For production apps and growing teams.",
    features: [
      "50,000 requests / month",
      "Unlimited sessions",
      "All endpoints",
      "Session history (1 year)",
      "Usage analytics",
      "Priority support",
      "Custom rate limits",
    ],
    cta:   "Start Pro",
    href:  "/register",
    style: "border border-gray-200",
    badge: null,
  },
];

export default function Pricing() {
  return (
    <div className="pt-16">
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Pricing</p>
          <h1 className="text-5xl font-display font-bold text-ink mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-slate max-w-lg mx-auto">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-white p-8 relative ${plan.style}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs px-4 py-1 font-medium tracking-wide">
                  {plan.badge}
                </div>
              )}
              <p className="text-sm font-medium text-slate mb-2">{plan.name}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-ink">{plan.price}</span>
                <span className="text-sm text-slate mb-1">/{plan.per}</span>
              </div>
              <p className="text-sm text-slate mb-8">{plan.desc}</p>

              <div className="flex flex-col gap-3 mb-8">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-sage mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-ink">{f}</span>
                  </div>
                ))}
              </div>

              <Link to={plan.href}
                className={`w-full text-center block py-3 text-sm font-medium tracking-wide transition-all
                  ${plan.badge
                    ? "bg-ink text-paper hover:bg-accent"
                    : "border border-ink text-ink hover:bg-ink hover:text-paper"
                  }`}>
                {plan.cta} <ArrowRight size={14} className="inline ml-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-3xl font-display font-bold text-ink text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { q: "What counts as a request?", a: "Every API call counts as one request — whether it's creating a session, submitting preferences, or resolving consensus." },
              { q: "Can I upgrade or downgrade?", a: "Yes, you can change plans at any time. Changes take effect on your next billing cycle." },
              { q: "What happens if I exceed limits?", a: "You'll receive a 429 response. You can upgrade your plan or wait for the next reset window." },
              { q: "Is there a free trial for paid plans?", a: "The Free plan is effectively a trial. You can test all core features before upgrading." },
            ].map(f => (
              <div key={f.q} className="border-l-2 border-gold pl-5">
                <h3 className="font-display font-semibold text-ink mb-2">{f.q}</h3>
                <p className="text-sm text-slate leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
