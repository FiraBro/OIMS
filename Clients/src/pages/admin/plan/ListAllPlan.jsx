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
  ({ plan, index, handleDelete, toggleStatus, onEditClick }) => (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="group hover:bg-slate-50/80 transition-all border-b border-slate-100 last:border-0"
    >
      <TableCell className="py-5 pl-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            {plan.isPopular && (
              <Badge className="bg-rose-50 text-rose-600 border-rose-100 text-[9px] w-fit">
                Popular
              </Badge>
            )}
            <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate max-w-[250px]">
              {plan.name}
            </div>
            <div className="text-xs text-slate-400 truncate max-w-[250px] italic">
              {plan.shortDescription}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">${plan.premium}</span>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
            {plan.premiumFrequency}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-semibold text-slate-700">
          ${plan.coverageAmount?.toLocaleString()}
        </div>
        <div className="text-[10px] text-slate-400 uppercase font-bold">
          Limit
        </div>
      </TableCell>
      <TableCell className="text-center">
        <button
          onClick={() => toggleStatus(plan)}
          className="focus:outline-none"
        >
          <Badge
            className={`px-3 py-1 rounded-full transition-all active:scale-95 ${
              plan.status?.toLowerCase() === "published"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
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
              className="h-9 w-9 rounded-xl border-transparent hover:border-slate-200 transition-all active:scale-90"
            >
              <FiMoreVertical className="text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-52 p-2 rounded-2xl shadow-2xl bg-white border border-slate-100 data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 duration-200"
          >
            <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-xl focus:bg-slate-50">
              <FiEye className="text-blue-600" />{" "}
              <span className="font-medium">Quick View</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEditClick(plan)}
              className="gap-3 py-2.5 cursor-pointer rounded-xl focus:bg-slate-50"
            >
              <FiEdit2 className="text-amber-600" />{" "}
              <span className="font-medium">Edit Plan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem
              onClick={() => handleDelete(plan._id)}
              className="gap-3 py-2.5 cursor-pointer rounded-xl text-red-600 focus:bg-red-50"
            >
              <FiTrash2 /> <span className="font-medium">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  )
);

export default function AdminPlanListPage() {
  const navigate = useNavigate();
  const { listAdmin, deletePlan, updatePlan } = usePlans();

  // --- Filtering & Pagination State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingPlan, setEditingPlan] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const deferredSearch = useDeferredValue(searchTerm);

  // --- Data Fetching (Server-Side) ---
  const { data, isLoading, isFetching } = listAdmin({
    page: currentPage,
    limit: itemsPerPage,
    search: deferredSearch,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const plans = data?.plans || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearch, statusFilter]);

  // --- Actions ---
  const handleDelete = useCallback(
    async (id) => {
      if (!confirm("Are you sure? This action is permanent.")) return;
      try {
        await deletePlan.mutateAsync(id);
        toast.success("Plan removed from inventory");
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
          data: { status: newStatus },
        });
        toast.success(`Plan is now ${newStatus}`);
      } catch (e) {
        toast.error(e.message);
      }
    },
    [updatePlan]
  );

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 italic">
            Plan Inventory
          </h1>
          <p className="text-slate-500 font-medium">
            Managing{" "}
            <span className="text-blue-600 font-bold">
              {totalCount.toLocaleString()}
            </span>{" "}
            live products
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 hidden sm:flex gap-2 bg-white"
          >
            <FiDownload /> Export CSV
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg gap-2 px-6 h-12"
            onClick={() => navigate("/admin/create/plan")}
          >
            <FiPlus /> New Product
          </Button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full lg:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search thousands of plans..."
            className="pl-11 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 lg:w-[160px] h-12 bg-slate-50 border-none rounded-xl shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-100 rounded-xl shadow-2xl">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={itemsPerPage.toString()}
            onValueChange={(v) => setItemsPerPage(Number(v))}
          >
            <SelectTrigger className="w-[120px] h-12 bg-slate-50 border-none rounded-xl shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-100 rounded-xl shadow-2xl">
              <SelectItem value="25">25/page</SelectItem>
              <SelectItem value="50">50/page</SelectItem>
              <SelectItem value="100">100/page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden border-slate-200 shadow-xl rounded-2xl bg-white relative">
        {/* Subtle Loading Overlay */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100">
                <TableHead className="font-bold uppercase text-[10px] tracking-widest py-5 pl-6 text-slate-500">
                  Product Details
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500">
                  Premium
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500">
                  Coverage
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center text-slate-500">
                  Status
                </TableHead>
                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest pr-8 text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {plans.map((plan, idx) => (
                    <VirtualTableRow
                      key={plan._id}
                      plan={plan}
                      index={idx}
                      handleDelete={handleDelete}
                      toggleStatus={toggleStatus}
                      onEditClick={handleEditClick}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <FiAlertCircle className="mx-auto text-4xl text-slate-200 mb-2" />
                      <p className="text-slate-500 font-medium">
                        No plans found in the registry.
                      </p>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-500 italic">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full h-10 w-10 p-0 border-slate-200"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <FiChevronLeft />
            </Button>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full">
              <span className="h-7 px-3 flex items-center justify-center rounded-full text-xs font-black bg-blue-600 text-white shadow-md">
                {currentPage}
              </span>
            </div>
            <Button
              variant="outline"
              className="rounded-full h-10 w-10 p-0 border-slate-200"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              <FiChevronRight />
            </Button>
          </div>
        </div>
      </Card>

      <PlanEditModal
        plan={editingPlan}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
