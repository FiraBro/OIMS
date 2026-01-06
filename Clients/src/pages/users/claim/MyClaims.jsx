import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useClaims } from "@/hooks/useClaim"; // Integrated Hook
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants (Original)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.98 },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  }),
  hover: { backgroundColor: "rgba(243, 244, 246, 0.5)" },
};

export default function MyClaims() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // 1. Integration with useClaims Hook
  const { myClaims = [], loading, refresh } = useClaims();
  console.log("claim", myClaims);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 2. Optimization for Thousands of Claims (useMemo)
  const filteredClaims = useMemo(() => {
    const data = Array.isArray(myClaims) ? myClaims : [];
    return data.filter((claim) => {
      const matchesSearch =
        !searchTerm ||
        [claim.policyNumber, claim.claimType, claim.description].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" ||
        claim.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [myClaims, searchTerm, statusFilter]);

  // 3. Optimized Stats calculation
  const stats = useMemo(() => {
    const data = Array.isArray(myClaims) ? myClaims : [];
    return {
      total: data.length,
      approved: data.filter((c) => c.status?.toLowerCase() === "approved")
        .length,
      pending: data.filter((c) =>
        ["pending", "processing", "under review"].includes(
          c.status?.toLowerCase()
        )
      ).length,
      totalAmount: data.reduce(
        (sum, c) => sum + (parseFloat(c.amount) || 0),
        0
      ),
    };
  }, [myClaims]);

  // Styling Helpers (Original Logic)
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "under review":
      case "processing":
        return <Search className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variantMap = {
      approved: "default",
      pending: "outline",
      rejected: "destructive",
      "under review": "secondary",
      processing: "secondary",
    };
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge
          variant={variantMap[status?.toLowerCase()] || "outline"}
          className="flex items-center gap-1.5 border-gray-300"
        >
          {getStatusIcon(status)}
          <span className="capitalize">{status || "Unknown"}</span>
        </Badge>
      </motion.div>
    );
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full border-yellow-200 bg-yellow-50 text-center p-10">
          <Shield className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
          <h2 className="text-xl font-semibold">Login Required</h2>
          <p className="text-gray-600">Please log in to manage your claims.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#fff] p-4 md:p-8"
    >
      {/* Navbar Fix: Prevents layout shift when Radix/Shadcn UI dropdowns open */}
      <style
        dangerouslySetInnerHTML={{
          __html: `body { pointer-events: auto !important; padding-right: 0px !important; }`,
        }}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" /> My Claims
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your insurance claims in one place
            </p>
          </div>
          <Button
            onClick={() => navigate("/claims/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            size="lg"
          >
            <PlusCircle className="h-5 w-5" /> Submit New Claim
          </Button>
        </motion.div>

        {/* Stats Cards (Original Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Claims"
            value={stats.total}
            icon={<FileText className="text-blue-600" />}
            bgColor="bg-blue-50"
            borderColor="bg-blue-500"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircle className="text-emerald-600" />}
            bgColor="bg-emerald-50"
            borderColor="bg-emerald-500"
          />
          <StatCard
            title="In Review"
            value={stats.pending}
            icon={<Clock className="text-amber-600" />}
            bgColor="bg-amber-50"
            borderColor="bg-amber-500"
          />
          <StatCard
            title="Claim Value"
            value={formatCurrency(stats.totalAmount)}
            icon={<DollarSign className="text-emerald-400" />}
            isDark
          />
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={refresh}
                className="gap-2 border-gray-300"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table (Original Original Style) */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Claim History</CardTitle>
            <CardDescription>
              {filteredClaims.length} claims found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredClaims.map((claim, index) => (
                    <motion.tr
                      key={claim._id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell className="font-medium">
                        {claim._id?.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{claim.policyNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {claim.claimType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(claim.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(claim.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/claims/${claim._id}`)}
                          className="mr-2"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("Download", claim._id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// Sub-component for clean Stats Cards
function StatCard({ title, value, icon, bgColor, borderColor, isDark }) {
  return (
    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
      <Card
        className={`relative overflow-hidden border-none shadow-sm ${
          isDark ? "bg-slate-900 text-white" : "bg-white"
        }`}
      >
        {!isDark && (
          <div className={`absolute top-0 left-0 w-1 h-full ${borderColor}`} />
        )}
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {title}
            </p>
            <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          </div>
          <div
            className={`p-3 rounded-xl ${
              isDark ? "bg-slate-800 border border-slate-700" : bgColor
            }`}
          >
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
