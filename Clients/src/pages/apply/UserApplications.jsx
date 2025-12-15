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
import { resolveDocumentUrl } from "@/utils/resolveURL";
import { useAuth } from "@/contexts/AuthContext";

export default function UserApplications() {
  const { isAuthenticated } = useAuth();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  /* ==============================
     FETCH DATA (AUTH-GUARDED)
  ============================== */
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchApplications();
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await applicationService.getMyApplications();
      setApps(res?.data || res || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     AUTH UI GUARD
  ============================== */
  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-10 text-center">
            <FiAlertTriangle className="w-10 h-10 mx-auto text-yellow-600 mb-4" />
            <h2 className="text-xl font-semibold">Login Required</h2>
            <p className="text-gray-600 mt-2">
              Please log in to view your applications.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ==============================
     HELPERS
  ============================== */
  const getStatusDetails = (status) => {
    switch ((status || "pending").toLowerCase()) {
      case "approved":
        return {
          label: "Approved",
          class: "bg-green-100 text-green-700",
          icon: <FiCheckCircle className="w-4 h-4" />,
        };
      case "rejected":
        return {
          label: "Rejected",
          class: "bg-red-100 text-red-700",
          icon: <FiXCircle className="w-4 h-4" />,
        };
      default:
        return {
          label: "Pending",
          class: "bg-yellow-100 text-yellow-700",
          icon: <FiClock className="w-4 h-4" />,
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

  const filteredApps = apps.filter((app) =>
    activeTab === "all" ? true : (app.status || "").toLowerCase() === activeTab
  );

  const getStatusCount = (status) =>
    apps.filter((a) => (a.status || "").toLowerCase() === status).length;

  /* ==============================
     RENDER
  ============================== */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-500">
            View and track your submitted policy applications
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchApplications}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="all">
            All <Badge>{apps.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <Badge>{getStatusCount("pending")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved <Badge>{getStatusCount("approved")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected <Badge>{getStatusCount("rejected")}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <p className="text-red-600">{error.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Empty */}
          {!loading && !error && filteredApps.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <FiFileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p>No applications found</p>
              </CardContent>
            </Card>
          )}

          {/* List */}
          {!loading &&
            !error &&
            filteredApps.map((app, index) => {
              const status = getStatusDetails(app.status);

              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{app.planId?.name}</CardTitle>
                        <Badge className={status.class}>
                          {status.icon} {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="grid md:grid-cols-3 gap-4 pt-6">
                      <div>
                        <p className="text-sm text-gray-500">Submitted</p>
                        {formatDate(app.createdAt)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        {formatDate(app.startDate)} → {formatDate(app.endDate)}
                      </div>
                      <div>
                        {app.documents?.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentDocument(
                                resolveDocumentUrl(app.documents[0].url)
                              );
                              setModalOpen(true);
                            }}
                          >
                            <FiFileText className="mr-2" />
                            View File
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </TabsContent>
      </Tabs>

      {/* Document Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-4 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2"
            >
              ✖
            </button>
            <iframe
              src={currentDocument}
              className="w-full h-[600px]"
              title="Document"
            />
          </div>
        </div>
      )}
    </div>
  );
}
