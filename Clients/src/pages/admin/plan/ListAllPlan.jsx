import React, {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiEye,
  FiDownload,
  FiSearch,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { usePlans } from "@/hooks/usePlan";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanEditModal } from "@/components/modal/PLanEditModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Optimized Table Row Component
const VirtualTableRow = React.memo(
  ({ plan, index, handleDelete, toggleStatus, onEditClick }) => {
    return (
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, delay: index * 0.01 }}
        className="group hover:bg-blue-50/40 transition-all border-b border-slate-100 last:border-0"
      >
        <TableCell className="py-5 pl-6">
          <div className="flex items-center gap-3">
            {plan.isPopular && (
              <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-[10px]">
                Popular
              </Badge>
            )}
            {plan.isFeatured && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                Featured
              </Badge>
            )}
            <div>
              <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate max-w-[280px]">
                {plan.name}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px] italic">
                {plan.shortDescription}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 truncate">
              ${plan.premium}
            </span>
            <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-tight truncate">
              {plan.premiumFrequency}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm font-semibold text-slate-700 truncate">
            ${plan.coverageAmount?.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 uppercase truncate">
            Total Limit
          </div>
        </TableCell>
        <TableCell className="text-center">
          <button
            onClick={() => toggleStatus(plan)}
            className="focus:outline-none"
          >
            <Badge
              className={`px-3 py-1 rounded-full transition-all active:scale-95 ${
                plan.status?.toUpperCase() === "PUBLISHED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              }`}
              variant="outline"
            >
              {plan.status}
            </Badge>
          </button>
        </TableCell>
        <TableCell className="text-right pr-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl border border-transparent hover:border-slate-200"
              >
                <FiMoreVertical className="text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-2 rounded-2xl shadow-2xl border-slate-200"
            >
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer rounded-xl">
                <FiEye className="text-lg opacity-70" />{" "}
                <span className="font-medium">Quick View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditClick(plan)}
                className="gap-3 py-3 cursor-pointer rounded-xl"
              >
                <FiEdit2 className="text-lg opacity-70" />{" "}
                <span className="font-medium">Edit Config</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 opacity-50" />
              <DropdownMenuItem
                onClick={() => handleDelete(plan._id)}
                className="gap-3 py-3 cursor-pointer rounded-xl text-red-600"
              >
                <FiTrash2 className="text-lg opacity-70" />{" "}
                <span className="font-medium">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </motion.tr>
    );
  }
);

VirtualTableRow.displayName = "VirtualTableRow";

export default function AdminPlanListPage() {
  const { listAdmin, deletePlan, updatePlan } = usePlans();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingPlan, setEditingPlan] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const { data, isLoading } = listAdmin();

  // Robust Data Normalization
  const plans = useMemo(() => {
    if (!data) return [];
    const source = data.data || data.plans || (Array.isArray(data) ? data : []);
    return source;
  }, [data]);

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        p.status?.toLowerCase() === statusFilter.toLowerCase();
      const term = deferredSearchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.id?.toString().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [plans, deferredSearchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlans = useMemo(() => {
    return filteredPlans.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlans, startIndex, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, statusFilter, itemsPerPage]);

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm("Are you sure?")) return;
      try {
        await deletePlan.mutateAsync(id);
        toast.success("Plan deleted");
      } catch (e) {
        toast.error(e.message);
      }
    },
    [deletePlan]
  );

  const toggleStatus = useCallback(
    async (plan) => {
      const newStatus =
        plan.status?.toLowerCase() === "published" ? "draft" : "published";
      try {
        await updatePlan.mutateAsync({
          id: plan._id,
          data: { ...plan, status: newStatus },
        });
        toast.success(`Plan marked as ${newStatus}`);
      } catch (e) {
        toast.error(e.message);
      }
    },
    [updatePlan]
  );

  const handleEditClick = useCallback((plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading Inventory...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-10 space-y-8 max-w-screen-2xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">
              Manage Plans
            </h1>
            <p className="text-slate-500">Total: {plans.length} products</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:flex gap-2 border-slate-200"
            >
              <FiDownload /> Export
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg gap-2 h-11 px-6"
              onClick={() => navigate("/admin/create/plan")}
            >
              <FiPlus /> Create New Plan
            </Button>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search plans..."
              className="pl-11 h-11 bg-slate-50 border-none rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-11 bg-slate-50 border-none rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => setItemsPerPage(Number(v))}
            >
              <SelectTrigger className="w-[100px] h-11 bg-slate-50 border-none rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25/page</SelectItem>
                <SelectItem value="50">50/page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 shadow-xl rounded-2xl bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100">
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest py-5 pl-6">
                    Product
                  </TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                    Premium
                  </TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                    Coverage
                  </TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest pr-8">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedPlans.map((plan, idx) => (
                    <VirtualTableRow
                      key={plan._id || `idx-${idx}`}
                      plan={plan}
                      index={idx}
                      handleDelete={handleDelete}
                      toggleStatus={toggleStatus}
                      onEditClick={handleEditClick}
                    />
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {filteredPlans.length === 0 && (
            <div className="py-20 text-center">
              <FiAlertCircle className="mx-auto text-4xl text-slate-200 mb-2" />
              <p>No plans found</p>
            </div>
          )}

          {/* Professional Pagination Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-slate-100 bg-white">
            <div className="text-sm font-medium text-slate-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredPlans.length)} of{" "}
              {filteredPlans.length}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-10 w-10 rounded-full"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </Button>
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-8 w-8 rounded-full text-xs font-bold ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-transparent text-slate-600"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                className="h-10 w-10 rounded-full"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                <FiChevronRight />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <PlanEditModal
        plan={editingPlan}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => toast.success("Updated!")}
      />
    </>
  );
}
