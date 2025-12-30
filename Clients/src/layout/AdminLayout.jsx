// dashboard/DashboardLayout.js
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import Topbar from "@/components/sidebar/Topbar";
import { PageTransition } from "@/components/navigation/Navbar";
import { motion } from "framer-motion";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-muted">
      <Sidebar />
      <div className="flex flex-1 flex-col ">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 overflow-y-auto"
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </motion.main>
      </div>
    </div>
  );
}
