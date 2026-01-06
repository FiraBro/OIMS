import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FiFileText,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { resolveDocumentUrl } from "@/utils/resolveURL";
import { useAuthStore } from "@/stores/authStore";
import { useApplications } from "@/hooks/useApplication";

// 1. Memoized Card for performance
const ApplicationCard = memo(({ app, index, onViewFile }) => {
  const getStatusDetails = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "approved")
      return {
        label: "Approved",
        class: "bg-green-100 text-green-700",
        icon: <FiCheckCircle />,
      };
    if (s === "rejected")
      return {
        label: "Rejected",
        class: "bg-red-100 text-red-700",
        icon: <FiXCircle />,
      };
    return {
      label: "Pending",
      class: "bg-yellow-100 text-yellow-700",
      icon: <FiClock />,
    };
  };

  const status = getStatusDetails(app.status);
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.01, 0.3) }} // Cap delay for large lists
    >
      <Card className="mb-4 border-gray-200 hover:shadow-sm transition-all">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {app.planId?.name || "Insurance Plan"}
            </CardTitle>
            <Badge className={`${status.class} flex items-center gap-1`}>
              {status.icon} {status.label}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid md:grid-cols-3 gap-4 pt-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Submitted
            </p>
            <span className="text-sm">{formatDate(app.createdAt)}</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Period
            </p>
            <span className="text-sm">
              {formatDate(app.startDate)} - {formatDate(app.endDate)}
            </span>
          </div>
          <div className="flex justify-end items-center">
            {app.documents?.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewFile(app.documents[0].url)}
              >
                <FiFileText className="mr-2" /> View Document
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ApplicationCard.displayName = "ApplicationCard";

export default function UserApplications() {
  const { authReady, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  // Use hook with server-side filtering logic
  const { apps, counts, isLoading, isFetching, error, refresh } =
    useApplications({
      status: activeTab === "all" ? "" : activeTab,
    });

  if (!authReady)
    return (
      <div className="p-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  if (!isAuthenticated)
    return (
      <Card className="m-6 p-10 text-center">
        Please log in to view applications.
      </Card>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Manage and track your insurance requests.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={isFetching}
        >
          <FiRefreshCw className={`mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Syncing..." : "Refresh"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100/50 p-1">
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab}{" "}
              <Badge variant="secondary" className="ml-2 bg-white">
                {counts[tab] || 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : apps.length === 0 ? (
            <Card className="border-dashed py-20 text-center">
              <FiFileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                No {activeTab} applications found.
              </p>
            </Card>
          ) : (
            <div className="pb-10">
              {apps.map((app, index) => (
                <ApplicationCard
                  key={app._id}
                  app={app}
                  index={index}
                  onViewFile={(url) => {
                    setCurrentDocument(resolveDocumentUrl(url));
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
          <div className="bg-gray-100 h-full w-full">
            <iframe
              src={currentDocument}
              title="Viewer"
              className="w-full h-full border-none"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
