import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTicket"; // Check if it's useTicket or useTickets
import { Button } from "@/components/ui/button";
import { FiMessageSquare, FiUser, FiInbox, FiRefreshCcw } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AdminSupportDashboard = () => {
  const navigate = useNavigate();

  // FIX: Pass 'null' for ticketId and 'true' for isAdmin parameter
  const { allTickets, isLoading, updateStatus, refetchAll } = useTickets(
    null,
    true
  );

  // Safety check for data structure - ensuring we handle all response types
  const tickets = Array.isArray(allTickets)
    ? allTickets
    : allTickets?.data || allTickets?.tickets || [];

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase();
    if (s === "OPEN") return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "IN_REVIEW")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (s === "RESOLVED")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-600";
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium text-sm">
          Synchronizing Support Queue...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Support Desk
            </h1>
            <p className="text-slate-500 text-sm">
              Service Governance & User Assistance
            </p>
          </div>
          {/* Added a manual refresh in case of network stutters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchAll?.()}
            className="gap-2"
          >
            <FiRefreshCcw size={14} /> Refresh
          </Button>
        </div>

        {tickets.length === 0 ? (
          <Card className="border-dashed border-2 py-20 bg-transparent text-center">
            <FiInbox
              size={48}
              className="mx-auto mb-4 text-slate-300 opacity-50"
            />
            <p className="font-bold text-slate-500">
              No tickets currently in queue
            </p>
            <p className="text-xs text-slate-400">
              New requests will appear here in real-time
            </p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket._id}
                className="border-slate-200 hover:shadow-md transition-all bg-white overflow-hidden"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <FiUser size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                          {ticket.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{ticket.ticketId || ticket._id.slice(-6)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 leading-none mb-1">
                        {ticket.subject}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        User:{" "}
                        <span className="text-slate-700">
                          {ticket.user?.name || "Anonymous User"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        updateStatus({ id: ticket._id, status: e.target.value })
                      }
                      className={`text-[11px] font-bold uppercase py-1.5 px-3 rounded-md border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-colors ${getStatusStyle(
                        ticket.status
                      )}`}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                      className="bg-slate-900 hover:bg-black text-white px-5 shadow-sm active:scale-95 transition-transform"
                    >
                      <FiMessageSquare className="mr-2" size={14} />
                      Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportDashboard;
