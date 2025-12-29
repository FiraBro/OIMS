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
import {
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- Utils ---------------- */

const formatDate = (date) =>
  date ? format(new Date(date), "MMM dd, yyyy") : "—";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);

const statusBadge = (status) => {
  const map = {
    pending: "outline",
    processing: "secondary",
    approved: "default",
    rejected: "destructive",
  };
  return (
    <Badge variant={map[status] || "outline"} className="capitalize">
      {status}
    </Badge>
  );
};

/* ---------------- Page ---------------- */

export default function AdminClaimsManagement() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimService.listAllClaims();
      console.log("Claims:", res);
      setClaims(res.data || res.claims || []);
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
    if (!confirm(`Are you sure you want to mark this claim as ${status}?`))
      return;

    try {
      setUpdatingId(id);
      await claimService.updateClaimStatus(id, status);
      fetchClaims();
    } catch (err) {
      alert("Failed to update claim status");
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    approved: claims.filter((c) => c.status === "approved").length,
    rejected: claims.filter((c) => c.status === "rejected").length,
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
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
            <Shield className="text-blue-600" />
            Claims Management
          </h1>
          <p className="text-gray-600">
            Review, approve, or reject insurance claims
          </p>
        </div>

        <Button variant="outline" onClick={fetchClaims}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Total", stats.total],
          ["Pending", stats.pending],
          ["Approved", stats.approved],
          ["Rejected", stats.rejected],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Claims</CardTitle>
          <CardDescription>
            Administrative overview of submitted claims
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <TableCell>{claim._id.slice(0, 8)}...</TableCell>
                    <TableCell>{claim.policyNumber}</TableCell>
                    <TableCell>{claim.claimType}</TableCell>
                    <TableCell>{formatCurrency(claim.amount)}</TableCell>
                    <TableCell>{statusBadge(claim.status)}</TableCell>
                    <TableCell>{formatDate(claim.createdAt)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>

                      {claim.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white"
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

                      {claim.status === "approved" && (
                        <Button size="sm" variant="secondary" disabled>
                          Approved
                        </Button>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
