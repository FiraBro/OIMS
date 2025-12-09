import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";

const STATUS = ["Pending", "Under Review", "Approved", "Rejected", "Settled"];
const CLAIM_TYPES = ["Auto Accident", "Property Damage", "Theft", "Other"];
const POLICY_TYPES = ["Auto", "Home", "Property", "Liability"];

export default function ClaimsManagement({ role = "user" }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    policyId: "",
    incidentDate: "",
    incidentLocation: "",
    claimType: CLAIM_TYPES[0],
    estimatedLoss: "",
    incidentDescription: "",
    documents: [],
  });
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    policyType: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const api = axios.create({ baseURL: "/api/v1" });

  // Fetch claims
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/claims", {
        params: { page: pagination.page, limit: pagination.limit },
      });
      setClaims(data.claims);
      setPagination((prev) => ({ ...prev, total: data.total }));
    } catch (err) {
      toast.error("Failed to fetch claims.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [pagination.page]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const fileList = Array.from(files);
      setFormData((prev) => ({ ...prev, documents: fileList }));
      setFilePreviews(fileList.map((f) => URL.createObjectURL(f)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (
      !formData.policyId ||
      !formData.incidentDate ||
      !formData.incidentLocation ||
      !formData.estimatedLoss
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "documents")
        value.forEach((f) => formPayload.append("documents", f));
      else formPayload.append(key, value);
    });

    try {
      await api.post("/claims", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Claim submitted successfully!");
      setFormData({
        policyId: "",
        incidentDate: "",
        incidentLocation: "",
        claimType: CLAIM_TYPES[0],
        estimatedLoss: "",
        incidentDescription: "",
        documents: [],
      });
      setFilePreviews([]);
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit claim");
    }
  };

  const filteredClaims = claims.filter((c) => {
    const statusMatch = filters.status ? c.status === filters.status : true;
    const policyMatch = filters.policyType
      ? c.policyId.type === filters.policyType
      : true;
    const dateMatch =
      (!filters.startDate ||
        new Date(c.incidentDate) >= new Date(filters.startDate)) &&
      (!filters.endDate ||
        new Date(c.incidentDate) <= new Date(filters.endDate));
    return statusMatch && policyMatch && dateMatch;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Claims Management
      </h1>

      {/* Claim Form */}
      <motion.div layout className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Submit New Claim</h2>
        <form className="space-y-4" onSubmit={handleSubmitClaim}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Policy *
              </label>
              <Select
                value={formData.policyId}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, policyId: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Policy" />
                </SelectTrigger>
                <SelectContent>
                  {POLICY_TYPES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Incident Date *
              </label>
              <Input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Location *
              </label>
              <Input
                type="text"
                name="incidentLocation"
                value={formData.incidentLocation}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Claim Type
              </label>
              <Select
                value={formData.claimType}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, claimType: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {CLAIM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Estimated Loss *
              </label>
              <Input
                type="number"
                name="estimatedLoss"
                value={formData.estimatedLoss}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Documents
              </label>
              <Input
                type="file"
                name="documents"
                onChange={handleInputChange}
                multiple
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {filePreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-2">
            Submit Claim
          </Button>
        </form>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-4 items-center">
        <Select
          value={filters.status}
          onValueChange={(v) => setFilters((prev) => ({ ...prev, status: v }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.policyType}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, policyType: v }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Policies" />
          </SelectTrigger>
          <SelectContent>
            {POLICY_TYPES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>

      {/* Claims Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        {loading ? (
          <p>Loading claims...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Policy Type</TableHead>
                <TableHead>Incident Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Claim Amount</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim._id} className="hover:bg-gray-50">
                  <TableCell>{claim.claimNumber}</TableCell>
                  <TableCell>{claim.policyId?.type}</TableCell>
                  <TableCell>
                    {new Date(claim.incidentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        claim.status === "Pending"
                          ? "secondary"
                          : claim.status === "Approved"
                          ? "success"
                          : claim.status === "Rejected"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${claim.estimatedLoss}</TableCell>
                  <TableCell>
                    {new Date(claim.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setSelectedClaim(claim);
                        setIsModalOpen(true);
                      }}
                    >
                      View
                    </Button>
                    {role !== "user" && (
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Claim Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Claim Details - {selectedClaim?.claimNumber}
            </DialogTitle>
            <DialogClose>
              <X className="w-5 h-5" />
            </DialogClose>
          </DialogHeader>
          {selectedClaim && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p>
                <strong>Status:</strong> {selectedClaim.status}
              </p>
              <p>
                <strong>Policy Type:</strong> {selectedClaim.policyId?.type}
              </p>
              <p>
                <strong>Claim Amount:</strong> ${selectedClaim.estimatedLoss}
              </p>
              <h3 className="font-semibold">History</h3>
              <ul className="border-l-2 border-blue-500 ml-4 space-y-1">
                {selectedClaim.history?.map((h, idx) => (
                  <li key={idx}>
                    <span className="font-medium">
                      {new Date(h.date).toLocaleDateString()}:
                    </span>{" "}
                    {h.status} - {h.note}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 flex-wrap mt-2">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" /> Upload Documents
                </Button>
                <Button variant="outline" size="sm">
                  Add Note
                </Button>
                <Button variant="default" size="sm">
                  Request Update
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
