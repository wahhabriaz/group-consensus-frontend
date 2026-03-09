// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-paper">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-ink flex items-center justify-center">
                <span className="text-paper text-xs font-display font-bold">C</span>
              </div>
              <span className="font-display font-semibold text-ink">Consensus</span>
            </div>
            <p className="text-sm text-slate leading-relaxed">
              Fair group decision-making API for developers.
            </p>
          </div>

          <div>
            <p className="label">Product</p>
            <div className="flex flex-col gap-2">
              <Link to="/pricing" className="text-sm text-slate hover:text-ink transition-colors">Pricing</Link>
              <Link to="/docs"    className="text-sm text-slate hover:text-ink transition-colors">Docs</Link>
              <Link to="/register" className="text-sm text-slate hover:text-ink transition-colors">Get API Key</Link>
            </div>
          </div>

          <div>
            <p className="label">Developers</p>
            <div className="flex flex-col gap-2">
              <a href="http://localhost:3000/docs" target="_blank" rel="noreferrer"
                 className="text-sm text-slate hover:text-ink transition-colors">Swagger UI</a>
              <Link to="/docs" className="text-sm text-slate hover:text-ink transition-colors">API Reference</Link>
              <Link to="/dashboard/playground" className="text-sm text-slate hover:text-ink transition-colors">Playground</Link>
            </div>
          </div>

          <div>
            <p className="label">Account</p>
            <div className="flex flex-col gap-2">
              <Link to="/login"     className="text-sm text-slate hover:text-ink transition-colors">Sign In</Link>
              <Link to="/register"  className="text-sm text-slate hover:text-ink transition-colors">Register</Link>
              <Link to="/dashboard" className="text-sm text-slate hover:text-ink transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate">© 2026 Consensus API. All rights reserved.</p>
          <p className="text-xs text-slate font-mono">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
