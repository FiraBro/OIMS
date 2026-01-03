import React, { useState, useMemo, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePolicies } from "@/hooks/usePolicy";
import {
  FiRefreshCw,
  FiSearch,
  FiInbox,
  FiChevronLeft,
  FiChevronRight,
  FiCheckSquare,
  FiTrash2,
  FiX,
  FiLoader,
} from "react-icons/fi";

// UI Components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import AdminPolicyActions from "@/components/modal/PolicyActions";
import { toast } from "react-toastify";

export default function PolicyList() {
  const { useAdminPolicies, updateStatus, deletePolicy } = usePolicies();

  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  // Bulk Selection & Processing State
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- Data Fetching ---
  const { data, isLoading, isPlaceholderData, refetch } = useAdminPolicies({
    page: currentPage,
    limit: itemsPerPage,
    category: activeTab === "All" ? undefined : activeTab,
    search: deferredSearch || undefined,
  });

  const policies = data?.policies || [];
  const totalCount = data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const categories = ["All", "Health", "Life", "Vehicle", "Property"];

  // --- Bulk Action Handlers (Frontend Logic) ---
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectPage = () => {
    if (selectedIds.length === policies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(policies.map((p) => p._id));
    }
  };

  const handleBulkUpdate = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    let successCount = 0;

    for (let i = 0; i < selectedIds.length; i++) {
      try {
        await updateStatus.mutateAsync({
          id: selectedIds[i],
          data: { status: newStatus },
        });
        successCount++;
        setProgress(Math.round(((i + 1) / selectedIds.length) * 100));
      } catch (err) {
        console.error(`Failed to update ${selectedIds[i]}`, err);
      }
    }

    toast.success(`Updated ${successCount} policies to ${newStatus}`);
    resetBulkState();
  };

  const resetBulkState = () => {
    setSelectedIds([]);
    setIsProcessing(false);
    setProgress(0);
    refetch();
  };

  const handleTabChange = (val) => {
    setActiveTab(val);
    setCurrentPage(1);
    setSelectedIds([]); // Clear selection when switching filters
  };

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6 relative pb-24">
      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-8 border border-slate-700 min-w-[400px] md:min-w-[600px]"
          >
            {isProcessing ? (
              <div className="flex flex-col w-full gap-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-2">
                    <FiLoader className="animate-spin" /> Processing Bulk
                    Actions...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
                  <div className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">
                    {selectedIds.length}
                  </div>
                  <span className="text-sm font-semibold">Selected</span>
                </div>

                <div className="flex flex-1 items-center gap-3">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
                    onClick={() => handleBulkUpdate("Active")}
                  >
                    <FiCheckSquare /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white gap-2"
                    onClick={() => setSelectedIds([])}
                  >
                    <FiX /> Cancel
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight italic">
            Policy Registry
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            System found{" "}
            <span className="text-blue-600 font-bold">
              {totalCount.toLocaleString()}
            </span>{" "}
            policies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleSelectPage}
            className="rounded-xl border-slate-200"
          >
            {selectedIds.length === policies.length && policies.length > 0
              ? "Deselect All"
              : "Select All Page"}
          </Button>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl border-slate-200 hover:bg-white shadow-sm"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search thousands of records..."
              className="pl-11 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-fit"
          >
            <TabsList className="bg-slate-100 p-1 rounded-xl h-12">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-lg px-6 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Data List */}
      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
            />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {policies.length > 0 ? (
              policies.map((policy, idx) => (
                <motion.div
                  key={policy._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex items-center gap-4 group"
                >
                  <Checkbox
                    checked={selectedIds.includes(policy._id)}
                    onCheckedChange={() => toggleSelect(policy._id)}
                    className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-blue-600 transition-all"
                  />

                  <Card
                    className={`flex-1 border-slate-200 transition-all duration-300 rounded-2xl overflow-hidden ${
                      selectedIds.includes(policy._id)
                        ? "bg-blue-50/40 border-blue-200 shadow-md"
                        : "bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex">
                      <div
                        className={`w-1.5 ${
                          policy.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <div className="flex-1 p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:flex h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl items-center justify-center font-bold text-slate-400">
                              {policy.userId?.fullName?.charAt(0) || "P"}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">
                                  {policy.planId?.name}
                                </span>
                                <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none text-[10px] px-2 py-0">
                                  {policy.status}
                                </Badge>
                              </div>
                              <p className="text-xs font-mono text-slate-400 tracking-tighter">
                                #{policy.policyNumber}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-8">
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 uppercase font-black">
                                Premium
                              </p>
                              <p className="font-bold text-slate-900">
                                ${policy.premium}
                              </p>
                            </div>
                            <AdminPolicyActions policy={policy} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
                <FiInbox className="mx-auto text-5xl text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">
                  No matching policies
                </h3>
                <p className="text-slate-500">
                  Refine your search or filter categories.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-8 border-t border-slate-100">
          <div className="text-sm font-medium text-slate-500">
            Showing{" "}
            <span className="text-slate-900">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, totalCount)}
            </span>{" "}
            of {totalCount}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1 || isPlaceholderData}
              onClick={() => {
                setCurrentPage((p) => p - 1);
                setSelectedIds([]);
              }}
              className="rounded-xl h-10 w-10"
            >
              <FiChevronLeft />
            </Button>
            <span className="text-sm font-bold bg-slate-900 text-white w-10 h-10 flex items-center justify-center rounded-xl">
              {currentPage}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages || isPlaceholderData}
              onClick={() => {
                setCurrentPage((p) => p + 1);
                setSelectedIds([]);
              }}
              className="rounded-xl h-10 w-10"
            >
              <FiChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
