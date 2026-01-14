import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For deep linking
import {
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineDotsVertical,
} from "react-icons/hi";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // shadcn skeleton

// Import the hook we created
import { useNotifications } from "@/hooks/useNoitification";
const getTypeStyles = (category) => {
  switch (category) {
    case "claim":
      return {
        icon: <HiOutlineShieldCheck />,
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    case "payment":
      return {
        icon: <HiOutlineCreditCard />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    case "policy":
      return {
        icon: <HiOutlineDocumentText />,
        color: "text-amber-600",
        bg: "bg-amber-50",
      };
    default:
      return {
        icon: <HiOutlineBell />,
        color: "text-slate-600",
        bg: "bg-slate-50",
      };
  }
};

export default function NotificationCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // 1. Dynamic Data Fetching via Hook
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllRead,
    deleteNotification,
  } = useNotifications({
    category:
      activeTab === "all" || activeTab === "unread" ? undefined : activeTab,
  });

  // 2. Client-side filtering for the "unread" tab toggle
  const displayNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  // 3. Deep Linking Handler
  const handleViewDetails = (notif) => {
    // Automatically mark as read when viewed
    if (!notif.isRead) markAsRead(notif._id);

    // Navigate based on metadata provided by the backend trigger
    if (notif.category === "claim")
      navigate(`/dashboard/claims/${notif.metadata?.id}`);
    if (notif.category === "policy")
      navigate(`/dashboard/policies/${notif.metadata?.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-blue-600 text-white rounded-full px-3 animate-pulse">
                  {unreadCount} New
                </Badge>
              )}
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your insurance updates and alerts.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead()}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Tabs Filtering */}
        <Tabs
          defaultValue="all"
          className="w-full mb-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-8">
            {["all", "unread", "claim", "policy", "payment"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 border-b-2 border-transparent rounded-none pb-3 px-1 bg-transparent font-semibold"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <NotificationLoadingSkeleton />
          ) : (
            <AnimatePresence mode="popLayout">
              {displayNotifications.map((notif) => {
                const styles = getTypeStyles(notif.category);
                return (
                  <motion.div
                    key={notif._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`relative group flex gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                      !notif.isRead
                        ? "bg-white border-blue-100 shadow-md shadow-blue-50/50"
                        : "bg-slate-50/50 border-transparent opacity-80"
                    }`}
                  >
                    {/* Unread Indicator */}
                    {!notif.isRead && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                    )}

                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${styles.bg} ${styles.color}`}
                    >
                      {styles.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(notif)}
                        >
                          <h3
                            className={`font-bold ${
                              !notif.isRead
                                ? "text-slate-900"
                                : "text-slate-600"
                            }`}
                          >
                            {notif.title}
                          </h3>
                          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap ml-4">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Button
                          onClick={() => handleViewDetails(notif)}
                          variant="secondary"
                          size="xs"
                          className="h-8 px-4 text-xs font-bold rounded-lg"
                        >
                          View Details
                        </Button>
                        {!notif.isRead && (
                          <Button
                            onClick={() => markAsRead(notif._id)}
                            variant="ghost"
                            size="xs"
                            className="h-8 text-xs text-blue-600 hover:bg-blue-50"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteNotification(notif._id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <HiOutlineDotsVertical />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {!isLoading && displayNotifications.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-2xl">
                <HiOutlineBell />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                All caught up!
              </h3>
              <p className="text-slate-500">No new updates at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple Skeleton for Loading State
function NotificationLoadingSkeleton() {
  return [1, 2, 3].map((i) => (
    <div
      key={i}
      className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white"
    >
      <Skeleton className="w-12 h-12 rounded-xl bg-slate-100" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-1/3 bg-slate-100" />
        <Skeleton className="h-3 w-full bg-slate-50" />
      </div>
    </div>
  ));
}
