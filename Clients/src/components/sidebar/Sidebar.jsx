// components/admin/Sidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  ShoppingCart,
  Package,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Sidebar({ collapsed, setCollapsed, isOpen }) {
  const navigate = useNavigate();
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      to: "/admin/dashboard",
      active: true,
    },
    { icon: Users, label: "Users", to: "/admin/users" },
    { icon: ShoppingCart, label: "Orders", to: "/admin/orders" },
    { icon: ShoppingCart, label: "Claim", to: "/admin/claims" },
    { icon: Package, label: "Products", to: "/admin/products" },
    { icon: FileText, label: "Invoices", to: "/admin/invoices" },
    { icon: BarChart3, label: "Analytics", to: "/admin/analytics" },
    { icon: Bell, label: "Notifications", to: "/admin/notifications" },
    { icon: Settings, label: "Settings", to: "/admin/settings" },
    { icon: HelpCircle, label: "Help & Support", to: "/admin/help" },
  ];

  return (
    <motion.aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200",
        collapsed ? "w-20" : "w-64"
      )}
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
          <span className="text-xl font-bold text-gray-800">AdminPro</span>
        </motion.div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* User Profile */}
      <motion.div
        className="p-4 border-b border-gray-200"
        animate={{ opacity: collapsed ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
            <AvatarFallback className="bg-blue-500 text-white">
              AD
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">John Doe</p>
              <p className="text-sm text-gray-500 truncate">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.to}
                className={cn(
                  "flex items-center w-full gap-3 px-4 py-2 rounded hover:bg-gray-100",
                  collapsed && "justify-center px-0",
                  item.active && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                )}
              >
                <item.icon size={20} />
                {!collapsed && (
                  <span className="flex-1 text-left font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <Separator className="my-2" />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")} // using useNavigate()
          className={cn(
            "w-full justify-start gap-3 text-red-500 hover:text-red-700 hover:bg-red-50",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
