// src/components/layout/DashboardLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, History, Key, Play, LogOut } from "lucide-react";

const navItems = [
  { to: "/dashboard",             icon: LayoutDashboard, label: "Overview",   end: true },
  { to: "/dashboard/sessions",    icon: History,         label: "Sessions" },
  { to: "/dashboard/keys",        icon: Key,             label: "API Keys" },
  { to: "/dashboard/playground",  icon: Play,            label: "Playground" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const email    = localStorage.getItem("cg_email") || "";

  function logout() {
    localStorage.removeItem("cg_api_key");
    localStorage.removeItem("cg_email");
    navigate("/");
  }

  return (
    <div className="pt-16 min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-gray-100 bg-paper fixed top-16 bottom-0 left-0">
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs text-slate">Signed in as</p>
          <p className="text-sm font-medium text-ink truncate">{email || "Developer"}</p>
        </div>

        <nav className="flex-1 p-3">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm mb-1 transition-all
                 ${isActive
                   ? "bg-ink text-paper"
                   : "text-slate hover:text-ink hover:bg-mist"
                 }`
              }>
              <item.icon size={15} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate hover:text-coral w-full transition-colors">
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 p-6 md:p-10 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
