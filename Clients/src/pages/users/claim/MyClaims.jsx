import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { claimService } from "@/services/claimService";
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  tap: {
    scale: 0.98,
  },
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
  hover: {
    backgroundColor: "rgba(243, 244, 246, 0.5)",
    transition: { duration: 0.2 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const loadingVariants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await claimService.getMyClaims();
      console.log("Fetched claims:", response);
      const claimsData = response.claims || response.data || [];
      setClaims(claimsData);
      setFilteredClaims(claimsData);
    } catch (err) {
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchClaims();
  }, [isAuthenticated]);

  useEffect(() => {
    let result = claims;

    if (searchTerm) {
      result = result.filter(
        (claim) =>
          claim.policyNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          claim.claimType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((claim) => claim.status === statusFilter);
    }

    setFilteredClaims(result);
  }, [searchTerm, statusFilter, claims]);

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
    const statusLower = status?.toLowerCase();
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
          variant={variantMap[statusLower] || "outline"}
          className="flex items-center gap-1.5 border-gray-300"
        >
          {getStatusIcon(status)}
          <span className="capitalize">{status || "Unknown"}</span>
        </Badge>
      </motion.div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const handleViewDetails = (claimId) => {
    navigate(`/claims/${claimId}`);
  };

  const handleNewClaim = () => {
    navigate("/claims/new");
  };

  const handleDownloadDocument = async (claimId) => {
    try {
      console.log("Download document for claim:", claimId);
    } catch (err) {
      console.error("Error downloading document:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="max-w-md w-full border-yellow-200 bg-yellow-50">
            <CardContent className="p-10 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">
                Login Required
              </h2>
              <p className="text-gray-600 mt-2">
                Please log in to view and manage your claims.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.status?.toLowerCase() === "approved")
      .length,
    pending: claims.filter(
      (c) =>
        c.status?.toLowerCase() === "pending" ||
        c.status?.toLowerCase() === "processing" ||
        c.status?.toLowerCase() === "under review"
    ).length,
    totalAmount: claims.reduce(
      (sum, claim) => sum + (parseFloat(claim.amount) || 0),
      0
    ),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#fff] p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="h-8 w-8 text-blue-600" />
              </motion.div>
              My Claims
            </motion.h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your insurance claims in one place
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleNewClaim}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer"
              size="lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 5,
                }}
              >
                <PlusCircle className="h-5 w-5" />
              </motion.div>
              Submit New Claim
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Claims */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="relative overflow-hidden border-none shadow-sm bg-white">
                <motion.div
                  className="absolute top-0 left-0 w-1 h-full bg-blue-500"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Total Claims
                      </p>
                      <motion.h3
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="mt-1 text-3xl font-bold text-gray-900"
                      >
                        {stats.total}
                      </motion.h3>
                    </div>
                    <motion.div
                      className="p-3 bg-blue-50 rounded-xl"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FileText className="h-6 w-6 text-blue-600" />
                    </motion.div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-400 font-medium">
                      Lifetime Submissions
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Approved Claims */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="relative overflow-hidden border-none shadow-sm bg-white">
                <motion.div
                  className="absolute top-0 left-0 w-1 h-full bg-emerald-500"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Approved
                      </p>
                      <motion.h3
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.4 }}
                        className="mt-1 text-3xl font-bold text-emerald-600"
                      >
                        {stats.approved}
                      </motion.h3>
                    </div>
                    <motion.div
                      className="p-3 bg-emerald-50 rounded-xl"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </motion.div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 font-medium">
                      {stats.total > 0
                        ? Math.round((stats.approved / stats.total) * 100)
                        : 0}
                      % Success Rate
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Pending Claims */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="relative overflow-hidden border-none shadow-sm bg-white">
                <motion.div
                  className="absolute top-0 left-0 w-1 h-full bg-amber-500"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        In Review
                      </p>
                      <motion.h3
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                        className="mt-1 text-3xl font-bold text-amber-600"
                      >
                        {stats.pending}
                      </motion.h3>
                    </div>
                    <motion.div
                      className="p-3 bg-amber-50 rounded-xl"
                      animate={{
                        rotate: [0, 10, 0],
                      }}
                      transition={{
                        rotate: {
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <Clock className="h-6 w-6 text-amber-600" />
                    </motion.div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-400 font-medium italic">
                      Awaiting Assessment
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Total Amount */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="relative overflow-hidden border-none shadow-sm bg-slate-900 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Claim Value
                      </p>
                      <motion.h3
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.6 }}
                        className="mt-1 text-2xl font-bold text-white"
                      >
                        {formatCurrency(stats.totalAmount)}
                      </motion.h3>
                    </div>
                    <motion.div
                      className="p-3 bg-slate-800 rounded-xl border border-slate-700"
                      animate={loadingVariants.animate}
                    >
                      <DollarSign className="h-6 w-6 text-emerald-400" />
                    </motion.div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-slate-400 font-medium">
                      Estimated Payout
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={fadeInUp}>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <motion.div
                  className="relative flex-1 w-full md:w-auto"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search claims by policy, type, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 w-full md:w-auto"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px] border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under review">Under Review</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="gap-2 border border-gray-300"
                      variant="outline"
                      onClick={fetchClaims}
                      disabled={!isAuthenticated}
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, ease: "linear" }}
                        style={{ display: "inline-block" }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.span>
                      Refresh
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Claims Table */}
        <motion.div variants={fadeInUp}>
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Claim History</CardTitle>
              <CardDescription>
                {filteredClaims.length} claim
                {filteredClaims.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {filteredClaims.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {claims.length === 0
                        ? "No claims yet"
                        : "No matching claims found"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {claims.length === 0
                        ? "Get started by submitting your first claim"
                        : "Try adjusting your search or filter criteria"}
                    </p>
                    {claims.length === 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleNewClaim}
                          className="gap-2 cursor-pointer"
                        >
                          <PlusCircle className="h-5 w-5" />
                          Submit Your First Claim
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-md border border-gray-100"
                  >
                    <Table className="border border-gray-200">
                      <TableHeader className="border-b border-gray-100">
                        <TableRow className="border-b border-gray-200 mt-2">
                          <TableHead className="w-[180px]">Claim ID</TableHead>
                          <TableHead>Policy Number</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredClaims.map((claim, index) => (
                            <motion.tr
                              key={claim._id}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              exit={{ opacity: 0, x: -20 }}
                              variants={rowVariants}
                              whileHover="hover"
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {claim._id?.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {claim.policyNumber}
                                </div>
                              </TableCell>
                              <TableCell>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700"
                                  >
                                    {claim.claimType}
                                  </Badge>
                                </motion.div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                {formatCurrency(claim.amount)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(claim.status)}
                              </TableCell>
                              <TableCell className="text-gray-500">
                                {formatDate(
                                  claim.submittedAt || claim.createdAt
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleViewDetails(claim._id)
                                      }
                                      className="gap-1 border border-gray-300"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View
                                    </Button>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDownloadDocument(claim._id)
                                      }
                                      className="gap-1"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            {filteredClaims.length > 0 && (
              <CardFooter className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between text-sm text-gray-500 w-full">
                  <div>
                    Showing {filteredClaims.length} of {claims.length} claims
                  </div>
                  <div className="flex items-center gap-4 cursor-pointer">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <span className="font-medium">Page 1 of 1</span>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Need Help With Your Claims?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Our dedicated claims support team is here to assist you
                    24/7. Get answers to your questions or request assistance
                    with pending claims.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        className="h-2 w-2 bg-blue-600 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      <span>24/7 Support Hotline</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        className="h-2 w-2 bg-blue-600 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: 0.5,
                        }}
                      />
                      <span>Email Support</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        className="h-2 w-2 bg-blue-600 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                      />
                      <span>Live Chat</span>
                    </motion.div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="gap-2 border cursor-pointer border-gray-300"
                      onClick={() => navigate("/support")}
                    >
                      <AlertCircle className="h-4 w-4" />
                      Get Help
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleNewClaim}
                      className="gap-2 bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    >
                      <PlusCircle className="h-4 w-4" />
                      New Claim
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
