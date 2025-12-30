import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiFileText,
  FiUsers,
  FiCheckCircle,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import { cn } from "@/lib/utils"; // Standard shadcn utility

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
  { name: "Applications", path: "/admin/applications", icon: FiFileText },
  { name: "Policies", path: "/admin/all-policies", icon: FiFileText },
  { name: "Claims", path: "/admin/all-claims", icon: FiCheckCircle },
  { name: "Customers", path: "/admin/users", icon: FiUsers },
  { name: "Analytics", path: "/admin/reports", icon: FiBarChart2 },
  { name: "Settings", path: "/admin/settings", icon: FiSettings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex flex-col w-72 border border-gray-300 bg-slate-50 border-r h-screen sticky top-0">
      {/* Brand Logo Section */}
      <div className="h-20 flex items-center px-6 gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <FiShield className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            NexusInsure
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
                  isActive
                    ? "bg-white text-primary shadow-sm border-slate-200 border"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )
              }
            >
              <item.icon
                className={cn(
                  "text-lg transition-colors",
                  isActive ? "text-primary" : "group-hover:text-slate-900"
                )}
              />
              <span className="font-medium text-sm">{item.name}</span>

              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Section */}
      <div className="p-4 border-t bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border shadow-sm">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User Avatar"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              Alex Underwriter
            </p>
            <p className="text-xs text-slate-500 truncate">Senior Adjuster</p>
          </div>
          <button className="text-slate-400 hover:text-destructive transition-colors">
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}
