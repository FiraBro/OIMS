import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FiFileText,
  FiRefreshCw,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applicationService } from "@/services/applicationService";

export default function UserApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await applicationService.getMyApplications();
      console.log("res", res);
      setApps(res.data || res);
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  };

  const getStatusDetails = (status) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "approved":
        return {
          class: "bg-green-100 text-green-700 border-green-200",
          icon: <FiCheckCircle className="w-4 h-4" />,
          label: "Approved",
        };
      case "rejected":
        return {
          class: "bg-red-100 text-red-700 border-red-200",
          icon: <FiXCircle className="w-4 h-4" />,
          label: "Rejected",
        };
      default:
        return {
          class: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: <FiClock className="w-4 h-4" />,
          label: "Pending",
        };
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  const filteredApps = apps.filter((a) => {
    if (activeTab === "all") return true;
    return (a.status || "").toLowerCase() === activeTab;
  });

  const getStatusCount = (status) =>
    apps.filter((a) => (a.status || "").toLowerCase() === status).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-2">
            View and track your submitted policy applications
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center gap-2 mt-4 md:mt-0"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">
            All <Badge variant="secondary">{apps.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending{" "}
            <Badge variant="secondary">{getStatusCount("pending")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved{" "}
            <Badge variant="secondary">{getStatusCount("approved")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected{" "}
            <Badge variant="secondary">{getStatusCount("rejected")}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-xl border border-gray-100">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <FiAlertTriangle className="text-red-500 w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-lg text-red-800">
                      Failed to Load Applications
                    </h3>
                    <p className="text-red-600 mt-1">{error.message}</p>

                    <Button
                      variant="outline"
                      onClick={fetchApplications}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty */}
          {!loading && !error && filteredApps.length === 0 && (
            <Card className="rounded-xl border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <FiFileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No applications found
                </h3>
              </CardContent>
            </Card>
          )}

          {/* Applications List */}
          {!loading && !error && filteredApps.length > 0 && (
            <div className="grid gap-4">
              {filteredApps.map((app, index) => {
                const status = getStatusDetails(app.status);

                return (
                  <motion.div
                    key={app._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="rounded-xl border border-gray-200 hover:shadow-md transition">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle>
                            Plan: {app.planId?.name || "Plan"}
                          </CardTitle>
                          <Badge className={status.class}>
                            {status.icon} {status.label}
                          </Badge>
                        </div>
                      </CardHeader>

                      <Separator />

                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-gray-500">Submitted</p>
                            <p className="font-medium">
                              {formatDate(app.createdAt)}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">
                              {formatDate(app.startDate)} →{" "}
                              {formatDate(app.endDate)}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Documents</p>
                            {app.documents?.length > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(app.documents[0].url, "_blank")
                                }
                              >
                                <FiFileText className="mr-2" />
                                View File
                              </Button>
                            ) : (
                              <p className="text-gray-500">None</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
