import { useEffect, useState } from "react";
import { claimService } from "@/services/claimService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import EditClaimModal from "@/components/modal/EditClaimModal";

/* ---------------- Utils ---------------- */

const formatDate = (date) =>
  date ? format(new Date(date), "MMM dd, yyyy") : "—";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);

const statusBadge = (status) => {
  // Normalize to lowercase for mapping, but display original for UI
  const s = status?.toLowerCase();
  const map = {
    pending: "outline",
    processing: "secondary",
    approved: "default",
    rejected: "destructive",
  };
  return (
    <Badge variant={map[s] || "outline"} className="capitalize">
      {status || "Unknown"}
    </Badge>
  );
};

/* ---------------- Page ---------------- */

export default function AdminClaimsManagement() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimService.listAllClaims();
      // Adjusting based on your console log structure
      console.log("Fetched claims:", res);
      const data = res.claims || res.data || [];
      setClaims(data);
    } catch (err) {
      console.error("Failed to load claims", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateStatus = async (id, status) => {
    // lowercase status matches what your backend/Postman expects
    const action = status === "approved" ? "approve" : "reject";
    if (!confirm(`Are you sure you want to ${action} this claim?`)) return;

    try {
      setUpdatingId(id);

      // Call service with the lowercase status string
      await claimService.updateClaimStatus(id, status);

      // Wait for fetch to finish so UI is accurate
      await fetchClaims();
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert(
        `Error: ${err.response?.data?.message || "Failed to update status"}`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats calculation (normalized for case sensitivity)
  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status?.toLowerCase() === "pending").length,
    approved: claims.filter((c) => c.status?.toLowerCase() === "approved")
      .length,
    rejected: claims.filter((c) => c.status?.toLowerCase() === "rejected")
      .length,
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64 border border-gray-200" />
        <Skeleton className="h-64 w-full border border-gray-200" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-blue-600">🛡️</span>
            Claims Management
          </h1>
          <p className="text-gray-600">Review and manage insurance claims</p>
        </div>

        <Button
          variant="outline"
          className="border border-gray-200 bg-white"
          onClick={fetchClaims}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Total", stats.total],
          ["Pending", stats.pending],
          ["Approved", stats.approved],
          ["Rejected", stats.rejected],
        ].map(([label, value]) => (
          <Card key={label} className="border border-gray-200">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>All Claims</CardTitle>
          <CardDescription>Administrative overview</CardDescription>
        </CardHeader>

        <CardContent className="border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead>ID</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence>
                {claims.map((claim) => (
                  <motion.tr
                    key={claim._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="font-mono text-xs">
                      {claim._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>{claim.policyNumber}</TableCell>
                    <TableCell>{claim.claimType}</TableCell>
                    <TableCell>{formatCurrency(claim.amount)}</TableCell>
                    <TableCell>{statusBadge(claim.status)}</TableCell>
                    <TableCell>{formatDate(claim.submittedAt)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedClaim(claim)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Lowercase check and lowercase update calls */}
                      {claim.status?.toLowerCase() === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={updatingId === claim._id}
                            onClick={() => updateStatus(claim._id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={updatingId === claim._id}
                            onClick={() => updateStatus(claim._id, "rejected")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {selectedClaim && (
        <EditClaimModal
          claim={selectedClaim}
          open={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onUpdated={fetchClaims}
        />
      )}
    </motion.div>
  );
}
