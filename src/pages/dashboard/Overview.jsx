// src/pages/dashboard/Overview.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowRight,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "../../utils/api";

// mock usage data — replace with real API when usage endpoint is added
const mockUsage = [
  { day: "Mon", calls: 12 },
  { day: "Tue", calls: 28 },
  { day: "Wed", calls: 19 },
  { day: "Thu", calls: 45 },
  { day: "Fri", calls: 33 },
  { day: "Sat", calls: 8 },
  { day: "Sun", calls: 15 },
];

export default function Overview() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("cg_email") || "you";

  // In a real app you'd fetch actual stats — using mock + session count for now
  useEffect(() => {
    setLoading(false);
  }, []);

  const stats = [
    {
      label: "API Calls This Week",
      value: mockUsage.reduce((s, d) => s + d.calls, 0),
      icon: Activity,
      color: "text-sage",
    },
    {
      label: "Avg Response Time",
      value: "~2ms",
      icon: Clock,
      color: "text-gold",
    },
    {
      label: "Tests Passing",
      value: "26/26",
      icon: CheckCircle,
      color: "text-sage",
    },
    {
      label: "Active Sessions",
      value: "—",
      icon: AlertCircle,
      color: "text-coral",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <p className="section-label mb-1">Dashboard</p>
        <h1 className="text-3xl font-display font-bold text-ink">
          Welcome back{email ? `, ${email.split("@")[0]}` : ""}.
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate">{s.label}</p>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-2xl font-display font-bold text-ink">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-ink">
            API Calls — Last 7 Days
          </h2>
          <span className="tag">Mock data</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockUsage} barSize={28}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#6B6B7B" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B6B7B" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #E5E5E5",
                borderRadius: 0,
                fontSize: 12,
              }}
              cursor={{ fill: "#F0EEE9" }}
            />
            <Bar dataKey="calls" radius={0}>
              {mockUsage.map((_, i) => (
                <Cell key={i} fill={i === 3 ? "#C9A84C" : "#0A0A0F"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: "Try the Playground",
            desc: "Test the /quick endpoint instantly",
            href: "/dashboard/playground",
            color: "border-gold",
          },
          {
            title: "View Sessions",
            desc: "Browse your decision session history",
            href: "/dashboard/sessions",
            color: "border-sage",
          },
          {
            title: "Manage API Keys",
            desc: "View, copy, or revoke your API keys",
            href: "/dashboard/keys",
            color: "border-coral",
          },
          {
            title: "New Group Decision",
            desc: "Create a session and share with your group",
            href: "/session/new",
            color: "border-ink",
          },
        ].map((q) => (
          <Link
            key={q.title}
            to={q.href}
            className={`card border-l-4 ${q.color} hover:shadow-md transition-shadow group`}
          >
            <h3 className="font-display font-semibold text-ink mb-1">
              {q.title}
            </h3>
            <p className="text-sm text-slate mb-3">{q.desc}</p>
            <span className="text-xs text-ink font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Open <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
