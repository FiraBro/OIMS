import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiShield,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiClock,
  FiLifeBuoy,
  FiCpu,
  FiAlertCircle,
} from "react-icons/fi";
import { useTickets } from "@/hooks/useTicket"; // Your Hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- ANIMATION VARIANTS ---
const modalTransition = {
  type: "spring",
  damping: 25,
  stiffness: 400,
};

const GeneralSupportPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 5, search: "" });

  // Using your Hook
  const { myTickets, isLoading, createTicket, isCreating } = useTickets(
    null,
    false,
    filters
  );

  const tickets = myTickets?.data || [];
  const pagination = myTickets?.pagination || { page: 1, pages: 1, total: 0 };

  // --- HANDLERS ---
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const textContent = formData.get("userQuery"); // Getting text from the Textarea

    const payload = {
      subject: formData.get("subject"),
      category: formData.get("category"),
      priority: formData.get("priority"),
      userQuery: textContent, // For the Ticket level
      description: textContent, // CRITICAL: This satisfies the backend controller's req.body.description
    };

    try {
      // Use mutateAsync from your hook
      await createTicket(payload);

      // Reset UI state
      setIsModalOpen(false);
      e.target.reset();
    } catch (err) {
      console.error("Backend Validation Error:", err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAFF]">
      {/* --- STICKY AI NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center gap-3 select-none group">
              {/* Logo Icon Container */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                    Neural
                    <span className="text-blue-500">Sure</span>
                  </span>
                  {/* FIXED: AI Badge with Gemini Thinking Colors */}
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] animate-gradient-x">
                    AI
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* INITIALIZE CASE MODAL */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100">
                  <FiPlus className="mr-2 size-4" /> Initialize Case
                </Button>
              </motion.div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] bg-white/90 backdrop-blur-xl rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
              <AnimatePresence>
                {isModalOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={modalTransition}
                    className="p-8"
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Create Intelligence Ticket
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-500">
                        Neural routing engine will process your request based on
                        priority parameters.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleCreateTicket}
                      className="space-y-5 py-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">
                            Category
                          </Label>
                          <Select
                            name="category"
                            required
                            defaultValue="ACCOUNT"
                          >
                            <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="CLAIM">
                                Claim Request
                              </SelectItem>
                              <SelectItem value="PAYMENT">
                                Billing/Payment
                              </SelectItem>
                              <SelectItem value="POLICY">
                                Policy Update
                              </SelectItem>
                              <SelectItem value="ACCOUNT">
                                Account Access
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">
                            Priority
                          </Label>
                          <Select name="priority" required defaultValue="LOW">
                            <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50">
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="EMERGENCY">
                                Emergency
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black text-slate-400">
                          Subject
                        </Label>
                        <Input
                          name="subject"
                          placeholder="E.g., Secure login failure"
                          className="rounded-xl border-slate-100 bg-slate-50/50 h-11"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black text-slate-400">
                          Analysis Details
                        </Label>
                        <Textarea
                          name="userQuery"
                          placeholder="Detailed description for AI categorization..."
                          className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[120px] resize-none"
                          required
                        />
                      </div>

                      <DialogFooter className="pt-2">
                        <Button
                          type="submit"
                          disabled={isCreating}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-black uppercase text-[10px] tracking-widest transition-all shadow-md"
                        >
                          {isCreating
                            ? "Synchronizing..."
                            : "Initialize Neural Case"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* --- METRIC ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <MetricCard
            label="Active Requests"
            val={pagination.total}
            icon={<FiActivity />}
            color="text-indigo-600"
          />
          <MetricCard
            label="System Accuracy"
            val="99.8%"
            icon={<FiLifeBuoy />}
            color="text-emerald-600"
          />
          <MetricCard
            label="Avg Response"
            val="1.4h"
            icon={<FiClock />}
            color="text-purple-600"
          />
        </div>

        {/* --- TABLE & LISTING --- */}
        <div className="grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Case Records
              </h2>
              <div className="relative w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <Input
                  placeholder="Filter records..."
                  className="pl-12 h-11 bg-white border-slate-100 rounded-xl shadow-sm text-xs font-medium"
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                />
              </div>
            </div>

            <Card className="border-slate-100 shadow-sm rounded-[24px] overflow-hidden bg-white">
              <CardContent className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400">
                    <tr>
                      <th className="px-8 py-5">Case Intel</th>
                      <th className="px-8 py-5">Ticket ID</th>
                      <th className="px-8 py-5">Priority</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-8 py-12 text-center text-slate-400 text-[10px] font-black uppercase animate-pulse"
                          >
                            Decrypting Records...
                          </td>
                        </tr>
                      ) : tickets.length > 0 ? (
                        tickets.map((t, idx) => (
                          <motion.tr
                            key={t._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                          >
                            <td className="px-8 py-6">
                              <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {t.subject}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-[9px] font-bold border-slate-200 text-slate-400 rounded-md mt-1.5"
                              >
                                {t.category}
                              </Badge>
                            </td>
                            <td className="px-8 py-6 font-mono text-[11px] font-bold text-slate-400">
                              {t.ticketId}
                            </td>
                            <td className="px-8 py-6">
                              <PriorityBadge priority={t.priority} />
                            </td>
                            <td className="px-8 py-6">
                              <Badge
                                className={`${getStatusStyles(
                                  t.status
                                )} border rounded-lg text-[9px] font-black uppercase px-2.5 py-1`}
                              >
                                {t.status.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  navigate(`/support/tickets/${t._id}`)
                                }
                                className="h-9 w-9 p-0 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                              >
                                <FiChevronRight size={18} />
                              </Button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-8 py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest"
                          >
                            No Intelligence Matches
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const PriorityBadge = ({ priority }) => {
  const styles = {
    LOW: "text-slate-500 bg-slate-100",
    MEDIUM: "text-blue-600 bg-blue-50",
    HIGH: "text-orange-600 bg-orange-50",
    EMERGENCY: "text-red-600 bg-red-50 animate-pulse font-black",
  };
  return (
    <span
      className={`text-[9px] font-bold px-2 py-1 rounded-md ${
        styles[priority] || styles.LOW
      }`}
    >
      {priority}
    </span>
  );
};

const getStatusStyles = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "IN_REVIEW":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "WAITING":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "RESOLVED":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "CLOSED":
      return "bg-slate-200 text-slate-500 border-transparent";
    default:
      return "bg-slate-50 text-slate-500";
  }
};

const MetricCard = ({ label, val, icon, color }) => (
  <Card className="border-none shadow-sm rounded-[24px] bg-white group hover:translate-y-[-4px] transition-all duration-300">
    <CardContent className="p-8 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          {label}
        </p>
        <p className="text-3xl font-[900] text-slate-900 tracking-tighter">
          {val}
        </p>
      </div>
      <div
        className={`h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center ${color} text-2xl shadow-inner group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
    </CardContent>
  </Card>
);

export default GeneralSupportPage;
