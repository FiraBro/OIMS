import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTicket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiArrowLeft, FiSend, FiMoreVertical, FiCheck } from "react-icons/fi";
import { Loader2, Paperclip, Smile } from "lucide-react";

const AdminLiveChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [msgText, setMsgText] = useState("");
  const scrollRef = useRef();

  const { ticketDetails, isLoadingDetails, replyToTicket, isReplying } =
    useTickets(id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticketDetails?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    replyToTicket(
      { id, message: msgText, sender: "AGENT" },
      { onSuccess: () => setMsgText("") }
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

          <div className="flex items-center gap-3 cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center font-bold text-lg shadow-inner">
              {ticketDetails?.user?.name?.charAt(0) || "C"}
            </div>
            <div>
              <h2 className="font-bold text-[16px] leading-tight">
                {ticketDetails?.user?.name || "Customer"}
              </h2>
              <p className="text-[12px] text-blue-100 opacity-80">
                {ticketDetails?.status === "OPEN"
                  ? "online"
                  : "last seen recently"}
              </p>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-white rounded-full">
          <FiMoreVertical size={20} />
        </Button>
      </header>

      {/* --- Telegram Chat Area --- */}
      <main className="flex-1 overflow-hidden flex flex-col relative bg-[#E7EBF0]">
        {/* Signature Telegram Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://edgetelegram.com/wp-content/uploads/2021/05/telegram-background-pattern.png')] bg-repeat" />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:px-[20%] space-y-2 relative z-10 custom-scrollbar"
        >
          {ticketDetails?.messages?.map((m, i) => {
            const ticketOwnerId =
              typeof ticketDetails.user === "object"
                ? ticketDetails.user._id
                : ticketDetails.user;
            const messageSenderId =
              typeof m.sender === "object" ? m.sender._id : m.sender;
            const isMe = String(messageSenderId) !== String(ticketOwnerId);

            return (
              <div
                key={i}
                className={`flex w-full ${
                  isMe ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`relative max-w-[85%] px-3 py-1.5 shadow-sm transition-all ${
                    isMe
                      ? "bg-[#EFFDDE] text-slate-800 rounded-2xl rounded-tr-sm"
                      : "bg-white text-slate-800 rounded-2xl rounded-tl-sm"
                  }`}
                >
                  <p className="text-[14.5px] leading-snug pr-12">
                    {m.message}
                  </p>

                  <div className="absolute bottom-1 right-2 flex items-center gap-1 opacity-50">
                    <span className="text-[10px] font-medium">
                      {new Date(m.createdAt || m.timestamp).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit", hour12: false }
                      )}
                    </span>
                    {isMe && (
                      <div className="flex">
                        <FiCheck size={12} className="-mr-1.5" />
                        <FiCheck size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Telegram Bottom Input --- */}
        <footer className="p-2 md:px-[20%] bg-[#E7EBF0] z-20">
          <div className="flex items-end gap-2 max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 rounded-full h-10 w-10"
            >
              <Smile size={24} />
            </Button>

            <textarea
              rows={1}
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Message"
              className="flex-1 min-h-[40px] max-h-32 bg-transparent border-none focus:ring-0 py-2.5 px-2 text-[15px] resize-none overflow-y-auto"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 rounded-full h-10 w-10"
            >
              <Paperclip size={22} />
            </Button>

            <button
              onClick={handleSend}
              disabled={isReplying || !msgText.trim()}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                msgText.trim()
                  ? "bg-[#517DA2] text-white scale-100"
                  : "bg-transparent text-blue-500 scale-90"
              }`}
            >
              {isReplying ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <FiSend size={20} className="ml-0.5" />
              )}
            </button>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminLiveChat;
