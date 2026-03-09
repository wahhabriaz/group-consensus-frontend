// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen]   = useState(false);
  const location          = useLocation();
  const navigate          = useNavigate();
  const isDashboard       = location.pathname.startsWith("/dashboard");
  const apiKey            = localStorage.getItem("cg_api_key");

  function logout() {
    localStorage.removeItem("cg_api_key");
    localStorage.removeItem("cg_email");
    navigate("/");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ink flex items-center justify-center">
            <span className="text-paper text-xs font-display font-bold">C</span>
          </div>
          <span className="font-display font-semibold text-ink text-lg">Consensus</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!isDashboard && (
            <>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/docs"    className="nav-link">Docs</Link>
            </>
          )}
          {isDashboard && (
            <>
              <Link to="/dashboard"          className="nav-link">Overview</Link>
              <Link to="/dashboard/sessions" className="nav-link">Sessions</Link>
              <Link to="/dashboard/keys"     className="nav-link">API Keys</Link>
              <Link to="/dashboard/playground" className="nav-link">Playground</Link>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {apiKey ? (
            <>
              <Link to="/dashboard" className="btn-secondary py-2">Dashboard</Link>
              <button onClick={logout} className="nav-link text-coral">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link">Sign In</Link>
              <Link to="/register" className="btn-primary py-2">Get API Key</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-paper border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link to="/pricing"    className="nav-link" onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/docs"       className="nav-link" onClick={() => setOpen(false)}>Docs</Link>
          <Link to="/dashboard"  className="nav-link" onClick={() => setOpen(false)}>Dashboard</Link>
          {apiKey
            ? <button onClick={logout} className="nav-link text-coral text-left">Logout</button>
            : <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>Get API Key</Link>
          }
        </div>
      )}
    </nav>
  );
}
