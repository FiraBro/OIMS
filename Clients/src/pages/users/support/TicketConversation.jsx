import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSend,
  FiCheck,
  FiMoreVertical,
  FiShield,
} from "react-icons/fi";
import { useTickets } from "@/hooks/useTicket";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Paperclip, Smile } from "lucide-react";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [reply, setReply] = useState("");

  const {
    ticketDetails: ticket,
    isLoadingDetails,
    replyToTicket,
    isReplying,
  } = useTickets(id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    replyToTicket(
      { id, message: reply, sender: "USER" },
      { onSuccess: () => setReply("") }
    );
  };

  if (isLoadingDetails)
    return (
      <div className="h-screen flex items-center justify-center bg-[#8DB0D1]">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-[#8DB0D1] font-sans overflow-hidden">
      {/* --- Telegram Header --- */}
      <header className="bg-[#517DA2] text-white px-4 py-2 flex items-center justify-between shadow-md z-30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-black/10 rounded-full"
          >
            <FiArrowLeft size={20} />
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold shadow-inner">
              <FiShield size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[16px] leading-tight flex items-center gap-2">
                Support Team
                <Badge className="bg-blue-400/20 text-[9px] h-4 px-1 border-none uppercase font-black">
                  Official
                </Badge>
              </h2>
              <p className="text-[12px] text-blue-100 opacity-80">
                {ticket?.status === "OPEN"
                  ? "Support is active"
                  : "Ticket archived"}
              </p>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-white rounded-full">
          <FiMoreVertical size={20} />
        </Button>
      </header>

      {/* --- Chat Workspace --- */}
      <main className="flex-1 overflow-hidden flex flex-col relative bg-[#E7EBF0]">
        {/* Telegram Wallpaper Pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[url('https://edgetelegram.com/wp-content/uploads/2021/05/telegram-background-pattern.png')] bg-repeat" />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:px-[25%] space-y-2 relative z-10 scroll-smooth"
        >
          {/* Date Indicator */}
          <div className="flex justify-center mb-6">
            <span className="bg-black/10 backdrop-blur-md px-4 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
              {new Date(ticket?.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {ticket?.messages?.map((msg, index) => {
            const ticketOwnerId =
              typeof ticket.user === "object" ? ticket.user._id : ticket.user;
            const messageSenderId =
              typeof msg.sender === "object" ? msg.sender._id : msg.sender;
            const isUser = String(messageSenderId) === String(ticketOwnerId);

            return (
              <div
                key={index}
                className={`flex w-full ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[85%] px-3 py-1.5 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-1 duration-300 ${
                    isUser
                      ? "bg-[#EFFDDE] text-slate-800 rounded-2xl rounded-tr-none shadow-[#c8e6a1]/50"
                      : "bg-white text-slate-800 rounded-2xl rounded-tl-none"
                  }`}
                >
                  <p className="text-[14.5px] leading-snug pr-10">
                    {msg.message}
                  </p>

                  {/* Bottom Meta (Telegram Style) */}
                  <div className="absolute bottom-1 right-2 flex items-center gap-1 opacity-40">
                    <span className="text-[9px] font-bold">
                      {new Date(
                        msg.createdAt || msg.timestamp
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                    {isUser && (
                      <div className="flex -space-x-1.5">
                        <FiCheck size={12} />
                        <FiCheck size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Telegram Style Input --- */}
        <footer className="p-2 md:px-[25%] bg-[#E7EBF0] z-20">
          {ticket?.status === "CLOSED" ? (
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                This conversation is closed
              </p>
            </div>
          ) : (
            <div className="flex items-end gap-2 max-w-5xl mx-auto">
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-1 flex items-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 rounded-full h-10 w-10 shrink-0"
                >
                  <Smile size={24} />
                </Button>

                <textarea
                  rows={1}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Message"
                  className="flex-1 min-h-[40px] max-h-40 bg-transparent border-none focus:ring-0 py-2.5 px-2 text-[15px] resize-none overflow-y-auto"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 rounded-full h-10 w-10 shrink-0"
                >
                  <Paperclip size={22} />
                </Button>
              </div>

              <button
                onClick={handleSendReply}
                disabled={isReplying || !reply.trim()}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 ${
                  reply.trim()
                    ? "bg-[#517DA2] text-white scale-100 rotate-0"
                    : "bg-white text-[#517DA2] scale-90"
                }`}
              >
                {isReplying ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <FiSend size={20} className="ml-0.5" />
                )}
              </button>
            </div>
          )}
          <div className="h-2" />
        </footer>
      </main>
    </div>
  );
};

export default TicketDetailPage;
