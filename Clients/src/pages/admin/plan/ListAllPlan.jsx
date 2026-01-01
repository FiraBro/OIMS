import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiEye,
  FiFilter,
  FiDownload,
  FiSearch,
  FiAlertCircle,
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

export default function PlanAdminPage() {
  const { listAdmin, deletePlan, updatePlan } = usePlans();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Admin Plans
  const { data, isLoading } = listAdmin();

  // 2. Data Normalization (Fixes the ".filter is not a function" error)
  // We check if data itself is the array, or if it's nested under .data or .plans
  const plans = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.plans && Array.isArray(data.plans)) return data.plans;
    return [];
  }, [data]);

  // 3. Filtered Data
  const filteredPlans = plans.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Action Handlers
  const handleDelete = async (id) => {
    if (window.confirm("Confirm deletion of this insurance plan?")) {
      await deletePlan.mutateAsync(id);
    }
  };

  const toggleStatus = async (plan) => {
    const newStatus = plan.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await updatePlan.mutateAsync({
      id: plan.id,
      data: { ...plan, status: newStatus },
    });
  };

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
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">
            Manage Plans
          </h1>
          <p className="text-slate-500">
            Global control center for all insurance products.
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
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest px-4">
          Total: {filteredPlans.length} Results
        </div>
      </div>

      {/* Main Table Interface */}
      <Card className="overflow-hidden border-slate-200 shadow-2xl rounded-2xl bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
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
              {filteredPlans.map((plan, idx) => (
                <motion.tr
                  key={plan.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-blue-50/40 transition-all border-b border-slate-100 last:border-0"
                >
                  <TableCell className="py-5 pl-6">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {plan.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                      {plan.shortDescription}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">
                        ${plan.premium}
                      </span>
                      <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-tight">
                        {plan.premiumFrequency}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-semibold text-slate-700">
                      ${plan.coverageAmount?.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">
                      Total Limit
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => toggleStatus(plan)}>
                      <Badge
                        className={`px-3 py-1 rounded-full transition-all active:scale-95 ${
                          plan.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
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
                        <DropdownMenuItem className="gap-3 py-3 cursor-pointer rounded-xl focus:bg-blue-50 focus:text-blue-700">
                          <FiEdit2 className="text-lg opacity-70" />
                          <span className="font-medium">Edit Config</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 opacity-50" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(plan.id)}
                          className="gap-3 py-3 cursor-pointer rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700"
                        >
                          <FiTrash2 className="text-lg opacity-70" />
                          <span className="font-medium">
                            Delete Permanently
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

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
              We couldn't find any plans matching "{searchTerm}". Try adjusting
              your filters.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
