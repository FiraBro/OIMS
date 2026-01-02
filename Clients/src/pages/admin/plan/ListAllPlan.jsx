import React, { useState, useMemo, useCallback, useDeferredValue } from "react";
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

// Virtualization component for better performance
const VirtualTableRow = React.memo(
  ({ plan, index, handleDelete, toggleStatus, onEditClick }) => {
    return (
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.01 }}
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
                plan.status === "PUBLISHED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : plan.status === "DRAFT"
                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
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
                className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
              >
                <FiMoreVertical className="text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-2 rounded-2xl shadow-2xl border-slate-200 animate-in fade-in zoom-in-95 duration-200"
            >
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer rounded-xl focus:bg-blue-50 focus:text-blue-700">
                <FiEye className="text-lg opacity-70" />
                <span className="font-medium">Quick View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditClick(plan)}
                className="gap-3 py-3 cursor-pointer rounded-xl focus:bg-blue-50 focus:text-blue-700"
              >
                <FiEdit2 className="text-lg opacity-70" />
                <span className="font-medium">Edit Config</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 opacity-50" />
              <DropdownMenuItem
                onClick={() => handleDelete(plan.id)}
                className="gap-3 py-3 cursor-pointer rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <FiTrash2 className="text-lg opacity-70" />
                <span className="font-medium">Delete Permanently</span>
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

  // Use deferred value for search to prevent UI blocking
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Fetch Admin Plans
  const { data, isLoading } = listAdmin();

  // Data Normalization
  const plans = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.plans && Array.isArray(data.plans)) return data.plans;
    return [];
  }, [data]);

  // Memoized filtering logic
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      // Status filter
      if (statusFilter !== "ALL" && p.status !== statusFilter) {
        return false;
      }

      // Search filter (only if search term exists)
      if (deferredSearchTerm.trim()) {
        return (
          p.name?.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
          p.shortDescription
            ?.toLowerCase()
            .includes(deferredSearchTerm.toLowerCase()) ||
          p.id?.toString().includes(deferredSearchTerm) ||
          p.category
            ?.toLowerCase()
            .includes(deferredSearchTerm.toLowerCase()) ||
          p.tags?.some((tag) =>
            tag.toLowerCase().includes(deferredSearchTerm.toLowerCase())
          )
        );
      }

      return true;
    });
  }, [plans, deferredSearchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlans = useMemo(() => {
    return filteredPlans.slice(startIndex, endIndex);
  }, [filteredPlans, startIndex, endIndex]);

  // Memoized action handlers
  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Confirm deletion of this insurance plan?")) {
        try {
          await deletePlan.mutateAsync(id);
          toast.success("Plan deleted successfully", {
            description: "The plan has been permanently deleted.",
          });
        } catch (error) {
          toast.error("Failed to delete plan", {
            description: error.message || "Please try again.",
          });
        }
      }
    },
    [deletePlan]
  );

  const toggleStatus = useCallback(
    async (plan) => {
      const newStatus = plan.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      try {
        await updatePlan.mutateAsync({
          id: plan.id,
          data: { ...plan, status: newStatus },
        });
        toast.success(`Plan ${newStatus.toLowerCase()} successfully`, {
          description: `${plan.name} is now ${newStatus.toLowerCase()}.`,
        });
      } catch (error) {
        toast.error("Failed to update status", {
          description: error.message || "Please try again.",
        });
      }
    },
    [updatePlan]
  );

  // Handle page navigation
  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, statusFilter, itemsPerPage]);

  // Handle edit click
  const handleEditClick = useCallback((plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setEditingPlan(null);
    }, 300); // Wait for animation to complete
  }, []);

  // Handle successful plan update
  const handlePlanUpdateSuccess = useCallback(() => {
    toast.success("Plan updated successfully", {
      description: `${editingPlan?.name} has been updated.`,
    });
  }, [editingPlan]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading Admin Inventory...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-10 space-y-8 max-w-screen-2xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">
              Manage Plans
            </h1>
            <p className="text-slate-500">
              Global control center for all insurance products. Total:{" "}
              {plans.length} plans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2 border-slate-200"
            >
              <FiDownload /> Export
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer shadow-blue-600/20 gap-2 h-11 px-6"
              onClick={() => window.location.assign("/admin/create/plan")}
            >
              <FiPlus className="text-lg" /> Create New Plan
            </Button>
          </div>
        </header>

        {/* Control Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, coverage, or status..."
              className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-11 bg-slate-50 border-none rounded-xl">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Items per page */}
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => setItemsPerPage(Number(v))}
            >
              <SelectTrigger className="w-[100px] h-11 bg-slate-50 border-none rounded-xl">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25/page</SelectItem>
                <SelectItem value="50">50/page</SelectItem>
                <SelectItem value="100">100/page</SelectItem>
                <SelectItem value="200">200/page</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest px-4">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredPlans.length)} of{" "}
              {filteredPlans.length}
            </div>
          </div>
        </div>

        {/* Main Table Interface */}
        <Card className="overflow-hidden border-slate-200 shadow-2xl rounded-2xl bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] font-bold text-slate-800 uppercase text-[10px] tracking-widest py-5">
                    Product Details
                  </TableHead>
                  <TableHead className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">
                    Premium
                  </TableHead>
                  <TableHead className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">
                    Coverage
                  </TableHead>
                  <TableHead className="font-bold text-slate-800 uppercase text-[10px] tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-800 uppercase text-[10px] tracking-widest pr-8">
                    Management
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedPlans.map((plan, idx) => (
                    <VirtualTableRow
                      key={plan.id || `${startIndex}-${idx}`}
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

          {/* Empty State */}
          {filteredPlans.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <FiAlertCircle className="text-4xl text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                No Matching Plans
              </h3>
              <p className="text-slate-500 max-w-xs text-sm mt-1">
                {deferredSearchTerm.trim()
                  ? `We couldn't find any plans matching "${deferredSearchTerm}". Try adjusting your filters.`
                  : "No plans found with the current filters."}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredPlans.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-slate-200 bg-slate-50/50">
              <div className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 gap-2"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft /> Previous
                </Button>

                {/* Page numbers - limited display */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="h-9 w-9"
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 text-slate-400">...</span>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 gap-2"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <FiChevronRight />
                </Button>
              </div>

              <div className="text-sm text-slate-500">
                {itemsPerPage} items per page
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Plan Edit Modal */}
      <PlanEditModal
        plan={editingPlan}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handlePlanUpdateSuccess}
      />
    </>
  );
}
