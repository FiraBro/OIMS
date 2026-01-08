import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiPhone,
  FiSearch,
  FiChevronRight,
  FiActivity,
  FiPlus,
  FiShield,
  FiClock,
  FiLifeBuoy,
} from "react-icons/fi";

// Hooks & UI
import { useTickets } from "@/hooks/useTicket"; // Ensure path matches your file structure
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const GeneralSupportPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tickets");

  // Fetch only the logged-in user's tickets
  const {
    myTickets: tickets,
    isLoading,
    createTicket,
    isCreating,
  } = useTickets();

  // Logic for Direct Assistance: Find the most recent active/open ticket
  const activeTicket = tickets?.find(
    (t) => t.status !== "CLOSED" && t.status !== "RESOLVED"
  );

  const [formData, setFormData] = useState({
    category: "General Inquiry",
    policyNo: "",
    subject: "",
    description: "",
  });

  const getStatusColor = (status) => {
    const colors = {
      OPEN: "bg-blue-50 text-blue-700 border-blue-100",
      IN_REVIEW: "bg-amber-50 text-amber-700 border-amber-100",
      RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
      CLOSED: "bg-slate-100 text-slate-500 border-slate-200",
    };
    return colors[status] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  const handleDirectAssistance = () => {
    if (activeTicket) {
      navigate(`/support/tickets/${activeTicket._id}`);
    } else {
      setActiveTab("contact"); // Switch to creation tab if no active ticket
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicket(
      {
        subject: formData.subject,
        category: formData.category,
        relatedPolicyNumber: formData.policyNo,
        priority: "Medium",
        messages: [{ sender: "USER", message: formData.description }],
      },
      {
        onSuccess: (newTicket) => {
          setFormData({
            category: "General Inquiry",
            policyNo: "",
            subject: "",
            description: "",
          });
          setActiveTab("tickets");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Status Banner */}
      <div className="bg-slate-900 py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className="hover:text-blue-600 cursor-pointer">
                  Portal
                </span>
                <FiChevronRight />
                <span className="text-slate-900">Support Center</span>
              </nav>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Assistance Dashboard
              </h1>
            </div>
            <Button
              onClick={() => setActiveTab("contact")}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            >
              <FiPlus className="mr-2" /> New Request
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            label="Active Cases"
            val={
              tickets?.filter((t) => !["CLOSED", "RESOLVED"].includes(t.status))
                .length || 0
            }
            icon={<FiActivity />}
            color="text-blue-600"
          />
          <MetricCard
            label="Resolved"
            val={tickets?.filter((t) => t.status === "RESOLVED").length || 0}
            icon={<FiShield />}
            color="text-emerald-600"
          />
          <MetricCard
            label="Avg Response"
            val="2.4h"
            icon={<FiClock />}
            color="text-slate-500"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-slate-200/40 p-1 border border-slate-200">
            <TabsTrigger value="tickets" className="px-8 font-bold">
              My Requests
            </TabsTrigger>
            <TabsTrigger value="contact" className="px-8 font-bold">
              Open New Case
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="tickets"
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="grid lg:grid-cols-4 gap-8">
              <Card className="lg:col-span-3 border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-lg">Recent History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                        <tr>
                          <th className="px-6 py-4">Inquiry</th>
                          <th className="px-6 py-4">Reference</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                          <LoadingRow />
                        ) : tickets?.length === 0 ? (
                          <EmptyRow />
                        ) : (
                          tickets?.map((t) => (
                            <tr
                              key={t._id}
                              className="hover:bg-slate-50/50 transition-colors group"
                            >
                              <td className="px-6 py-5">
                                <p className="text-sm font-bold text-slate-900">
                                  {t.subject}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1">
                                  Updated{" "}
                                  {new Date(t.updatedAt).toLocaleDateString()}
                                </p>
                              </td>
                              <td className="px-6 py-5 text-xs font-mono font-bold text-slate-400 uppercase">
                                {t.ticketId || t._id.slice(-8)}
                              </td>
                              <td className="px-6 py-5">
                                <Badge
                                  variant="outline"
                                  className={`${getStatusColor(
                                    t.status
                                  )} border rounded-md px-2 py-0.5 text-[10px] font-black`}
                                >
                                  {t.status.replace("_", " ")}
                                </Badge>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    navigate(`/support/tickets/${t._id}`)
                                  }
                                  className="h-8 text-xs font-bold border-slate-200"
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar Contact Info */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Direct Support
                  </h4>
                  <div className="space-y-4">
                    <div
                      onClick={handleDirectAssistance}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FiLifeBuoy size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Live Agent Chat
                        </p>
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            activeTicket ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          {activeTicket ? "Active Session" : "Start New"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FiPhone size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          +251 123 456
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          9am-5pm Hotline
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* New Case Form Content */}
          <TabsContent
            value="contact"
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-slate-200 shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <FiPlus size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-slate-900">
                        Create Support Request
                      </CardTitle>
                      <CardDescription className="text-slate-500 font-medium">
                        Expect a response from our concierge team within 2-4
                        hours.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Category Selection */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Inquiry Category
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(val) =>
                            setFormData({ ...formData, category: val })
                          }
                        >
                          <SelectTrigger className="h-12 border-slate-200 focus:ring-blue-500 bg-slate-50/30">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Inquiry">
                              General Inquiry
                            </SelectItem>
                            <SelectItem value="Policy Issue">
                              Policy Issue
                            </SelectItem>
                            <SelectItem value="Claims Support">
                              Claims Support
                            </SelectItem>
                            <SelectItem value="Billing & Payments">
                              Billing & Payments
                            </SelectItem>
                            <SelectItem value="Technical Help">
                              Technical Help
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Policy Number (Conditional) */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Policy Number (Optional)
                        </Label>
                        <Input
                          placeholder="e.g. POL-123456"
                          value={formData.policyNo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              policyNo: e.target.value,
                            })
                          }
                          className="h-12 border-slate-200 focus:ring-blue-500 bg-slate-50/30 font-mono"
                        />
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Subject Line
                      </Label>
                      <Input
                        required
                        placeholder="Brief summary of your request"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="h-12 border-slate-200 focus:ring-blue-500 bg-slate-50/30 font-semibold"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Detailed Description
                      </Label>
                      <Textarea
                        required
                        placeholder="Please provide as much detail as possible so we can assist you better..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="min-h-[160px] border-slate-200 focus:ring-blue-500 bg-slate-50/30 resize-none py-4"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                        <FiShield className="text-emerald-500" /> Secure
                        Encryption Active
                      </p>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveTab("tickets")}
                          className="font-bold text-slate-500 hover:text-slate-900"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={isCreating}
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 px-8 h-12 font-bold shadow-lg shadow-blue-500/20"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Initializing...
                            </>
                          ) : (
                            "Launch Request"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Right Side: Support Tips */}
              <div className="space-y-6">
                <Card className="border-slate-200 bg-slate-900 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FiLifeBuoy size={80} />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <FiSearch className="text-blue-400" /> Quick Resolution
                      Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter">
                        Claims
                      </p>
                      <p className="text-xs text-slate-300">
                        Have your incident photos and receipts ready for faster
                        processing.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">
                        Billing
                      </p>
                      <p className="text-xs text-slate-300">
                        Updated payment methods usually take 24 hours to reflect
                        in the portal.
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full border-slate-700 hover:bg-slate-800 text-white text-xs font-bold h-9"
                      >
                        Browse Help Center
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 border border-dashed border-slate-300 rounded-xl text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Urgent Matters
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    For immediate emergencies, please call our 24/7 hotline
                    directly.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 4. Functional Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleDirectAssistance}
          className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all hover:translate-y-[-2px] active:scale-95 group"
        >
          <FiMessageSquare
            className="text-blue-400 group-hover:scale-110 transition-transform"
            size={20}
          />
          <span className="font-bold text-sm pr-1">
            {activeTicket ? "Resume Chat" : "Direct Help"}
          </span>
        </button>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const MetricCard = ({ label, val, icon, color }) => (
  <Card className="border-slate-200 shadow-sm">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 mt-1">{val}</p>
      </div>
      <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
    </CardContent>
  </Card>
);

const LoadingRow = () => (
  <tr>
    <td colSpan="4" className="p-10 text-center text-slate-400">
      <Loader2 className="animate-spin w-4 h-4 mx-auto" />
    </td>
  </tr>
);

const EmptyRow = () => (
  <tr>
    <td colSpan="4" className="p-16 text-center text-slate-400 font-medium">
      No records found.
    </td>
  </tr>
);

export default GeneralSupportPage;
