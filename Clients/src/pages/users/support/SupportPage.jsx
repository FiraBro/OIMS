import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useTickets } from "@/hooks/useTicket";
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

// --- HELPER COMPONENTS FOR SCHEMA MAPPING ---
const PriorityBadge = ({ priority }) => {
  const styles = {
    LOW: "text-slate-500 bg-slate-100",
    MEDIUM: "text-blue-600 bg-blue-50",
    HIGH: "text-orange-600 bg-orange-50",
    EMERGENCY: "text-red-600 bg-red-50 animate-pulse font-black",
  };
  return (
    <span
      className={`text-[9px] font-bold px-2 py-1 rounded-md tracking-tight ${
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

const GeneralSupportPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, limit: 5, search: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data Fetching
  const { myTickets, isLoading, createTicket } = useTickets(
    null,
    false,
    filters
  );
  const tickets = myTickets?.data || [];
  const pagination = myTickets?.pagination || { page: 1, pages: 1, total: 0 };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    // Logic to call createTicket({ subject, category, priority, userQuery })
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFAFF]">
      {/* --- STICKY AI NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <FiCpu className="text-indigo-400 size-5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-md font-black text-slate-900 tracking-tight uppercase">
                  Safe<span className="text-indigo-600">Guard</span>
                </h1>
                <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] font-bold px-1.5 py-0">
                  v2.4 AI-CORE
                </Badge>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Neural Support Interface
              </p>
            </div>
          </div>

          {/* CREATE TICKET MODAL */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100">
                <FiPlus className="mr-2 size-4" />
                Initialize Case
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-white rounded-[32px] border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                  Create Intelligence Ticket
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Our autonomous engine will prioritize and route your request
                  based on the parameters provided below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-5 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                      Category
                    </Label>
                    <Select required>
                      <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="CLAIM">Claim Request</SelectItem>
                        <SelectItem value="PAYMENT">Billing/Payment</SelectItem>
                        <SelectItem value="POLICY">Policy Update</SelectItem>
                        <SelectItem value="ACCOUNT">Account Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                      Priority
                    </Label>
                    <Select required defaultValue="LOW">
                      <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Subject
                  </Label>
                  <Input
                    placeholder="E.g., Unable to process premium payment"
                    className="rounded-xl border-slate-100 bg-slate-50/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Detailed Analysis
                  </Label>
                  <Textarea
                    placeholder="Provide all relevant data for the AI engine..."
                    className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[100px]"
                    required
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-indigo-500 text-white rounded-xl h-12 font-black uppercase text-[10px] tracking-widest transition-all"
                  >
                    Submit to Neural Engine
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* --- METRIC ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <MetricCard
            label="Active Requests"
            val={pagination.total || 0}
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

        <div className="grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Case Records
              </h2>
              <div className="relative w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <Input
                  placeholder="Filter by ID or Subject..."
                  className="pl-12 h-11 bg-white border-slate-100 rounded-xl shadow-sm text-xs font-medium focus-visible:ring-indigo-500"
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

            {/* --- TABLE SECTION --- */}
            <Card className="border-slate-100 shadow-sm rounded-[24px] overflow-hidden bg-white">
              <CardContent className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400">
                    <tr>
                      <th className="px-8 py-5">Case Intelligence</th>
                      <th className="px-8 py-5">Ticket ID</th>
                      <th className="px-8 py-5">Priority</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-8 py-12 text-center text-slate-400 text-[10px] font-black uppercase animate-pulse tracking-widest"
                        >
                          Synchronizing with Neural Core...
                        </td>
                      </tr>
                    ) : tickets.length > 0 ? (
                      tickets.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {t.subject}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge
                                variant="outline"
                                className="text-[9px] font-bold border-slate-200 text-slate-400 rounded-md"
                              >
                                {t.category}
                              </Badge>
                              {t.isEscalated && (
                                <span className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase">
                                  <FiAlertCircle className="size-3" /> Escalated
                                </span>
                              )}
                            </div>
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-8 py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest"
                        >
                          No records match your query
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* --- PAGINATION --- */}
                {pagination.pages > 1 && (
                  <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Node {pagination.page} / {pagination.pages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl border-slate-100"
                        disabled={filters.page === 1}
                        onClick={() =>
                          setFilters((p) => ({ ...p, page: p.page - 1 }))
                        }
                      >
                        <FiChevronLeft />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl border-slate-100"
                        disabled={filters.page === pagination.pages}
                        onClick={() =>
                          setFilters((p) => ({ ...p, page: p.page + 1 }))
                        }
                      >
                        <FiChevronRight />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* --- SIDEBAR --- */}
          <div className="space-y-6">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[24px] bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-slate-900 p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1">
                    Neural Concierge
                  </h3>
                  <p className="text-white text-sm font-medium opacity-80">
                    AI-Enhanced 24/7 Routing
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">
                        Live AI Chat
                      </span>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      Instant resolution via our advanced language model.
                    </p>
                    <Button className="w-full bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-900 border border-slate-100 shadow-none rounded-xl h-10 font-bold uppercase text-[9px] tracking-widest transition-all">
                      Open Uplink
                    </Button>
                  </div>
                  <hr className="border-slate-50" />
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-3">
                      Documentation
                    </p>
                    <a
                      href="#"
                      className="flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      Neural FAQ Center
                      <FiChevronRight />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-[24px] bg-indigo-50/50 border border-indigo-100/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <FiShield className="text-indigo-600 size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-wide">
                    System Health
                  </p>
                  <p className="text-[10px] font-medium text-slate-500">
                    Neural Nodes Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ label, val, icon, color }) => (
  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[24px] bg-white overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
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
