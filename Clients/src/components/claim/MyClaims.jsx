import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { claimService } from "@/services/claimService"; // Import the service
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
import { useAuth } from "@/contexts/AuthContext";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await claimService.getMyClaims(); // Use service method
      console.log("Fetched claims:", response);
      const claimsData = response.claims || response.data || [];
      setClaims(claimsData);
      setFilteredClaims(claimsData);
    } catch (err) {
      console.error("Error fetching claims:", err);
      // Optionally show error to user
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
      <Badge
        variant={variantMap[statusLower] || "outline"}
        className="flex items-center gap-1.5"
      >
        {getStatusIcon(status)}
        <span className="capitalize">{status || "Unknown"}</span>
      </Badge>
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
      // You can implement document download logic here
      // For example: claimService.downloadClaimDocument(claimId)
    } catch (err) {
      console.error("Error downloading document:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-yellow-200 bg-yellow-50">
          <CardContent className="p-10 text-center">
            <Shield className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              Login Required
            </h2>
            <p className="text-gray-600 mt-2">
              Please log in to view and manage your claims.
            </p>
          </CardContent>
        </Card>
      </div>
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
    <div className="min-h-screen bg-[#fff] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              My Claims
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your insurance claims in one place
            </p>
          </div>
          <Button
            onClick={handleNewClaim}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer"
            size="lg"
          >
            <PlusCircle className="h-5 w-5" />
            Submit New Claim
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Claims */}
          <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total Claims
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </CardContent>
          </Card>

          {/* Approved Claims */}
          <Card className="border border-gray-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Approved</p>
                <p className="mt-2 text-3xl font-bold text-green-900">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </CardContent>
          </Card>

          {/* Pending Claims */}
          <Card className="border border-gray-200 bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Pending</p>
                <p className="mt-2 text-3xl font-bold text-amber-900">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-10 w-10 text-amber-600" />
            </CardContent>
          </Card>

          {/* Total Amount */}
          <Card className="border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Total Amount
                </p>
                <p className="mt-2 text-3xl font-bold text-purple-900">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                <span className="font-bold text-white">$</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search claims by policy, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
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
                <Button
                  className="gap-2 border border-gray-300"
                  variant="outline"
                  onClick={fetchClaims}
                  disabled={!isAuthenticated}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims Table */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Claim History</CardTitle>
            <CardDescription>
              {filteredClaims.length} claim
              {filteredClaims.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredClaims.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
                  <Button
                    onClick={handleNewClaim}
                    className="gap-2 cursor-pointer"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Submit Your First Claim
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-gray-300">
                <Table className="border border-gray-300">
                  <TableHeader>
                    <TableRow>
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
                    {filteredClaims.map((claim) => (
                      <TableRow key={claim._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {claim._id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {claim.policyNumber}
                          </div>
                        </TableCell>
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
                        <TableCell className="text-gray-500">
                          {formatDate(claim.submittedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(claim._id)}
                              className="gap-1 border border-gray-300"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadDocument(claim._id)}
                              className="gap-1"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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

        {/* Help Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Need Help With Your Claims?
                </h3>
                <p className="text-gray-600 mb-4">
                  Our dedicated claims support team is here to assist you 24/7.
                  Get answers to your questions or request assistance with
                  pending claims.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span>24/7 Support Hotline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span>Email Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span>Live Chat</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2 border cursor-pointer border-gray-300"
                >
                  <AlertCircle className="h-4 w-4" />
                  Get Help
                </Button>
                <Button
                  onClick={handleNewClaim}
                  className="gap-2 bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  New Claim
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
