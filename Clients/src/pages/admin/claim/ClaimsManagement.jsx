import { useState, useDeferredValue, useEffect } from "react";
import { useClaims } from "@/hooks/useClaim";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiFilter,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EditClaimModal from "@/components/modal/EditClaimModal";

/* ---------------- UI Helpers ---------------- */

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);

const getStatusStyles = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "approved":
      return "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50";
    case "pending":
      return "bg-zinc-100 text-zinc-500 border-zinc-200";
    case "rejected":
      return "bg-red-50 text-red-600 border-red-100";
    default:
      return "bg-gray-50 text-gray-400";
  }
};

export default function AdminClaimsManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Sync Search with Page Reset
  useEffect(() => {
    setPage(1);
  }, [deferredSearch]);

  const { adminClaims, meta, isLoading, isProcessing, updateStatus } =
    useClaims({
      page,
      limit: 10,
      search: deferredSearch,
      isAdmin: true,
    });

  const handleStatusUpdate = async (id, status) => {
    if (!confirm(`Confirm change to ${status.toUpperCase()}?`)) return;
    await updateStatus({ id, status });
  };

  return (
    <div className="p-8 bg-zinc-50/30 min-h-screen max-w-screen-2xl mx-auto font-inter">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase font-manrope">
            Claims Registry
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
              Database:{" "}
              <span className="text-zinc-900">
                {meta.total.toLocaleString()}
              </span>{" "}
              Records
            </p>
          </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="relative w-full md:w-[400px] group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            placeholder="Search by User, Policy, or ID..."
            className="pl-12 h-12 bg-white border-zinc-200 focus-visible:ring-blue-600 rounded-2xl font-medium shadow-sm transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- MAIN REGISTRY TABLE --- */}
      <div className="border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white relative">
        {/* Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 w-full h-[3px] bg-zinc-100 overflow-hidden z-20"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="h-full w-1/4 bg-blue-600"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="border-b border-zinc-100 hover:bg-transparent">
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest font-manrope">
                Claimant
              </TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest font-manrope">
                Reference
              </TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest font-manrope">
                Type
              </TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest font-manrope">
                Settlement
              </TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest font-manrope">
                Status
              </TableHead>
              <TableHead className="px-8 py-6 text-right text-[10px] font-black uppercase text-zinc-400 tracking-widest font-manrope">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-zinc-50">
            {adminClaims.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-32 text-center">
                  <FiFilter className="mx-auto text-4xl text-zinc-200 mb-4" />
                  <p className="font-manrope text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                    No matching claims found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              adminClaims.map((claim) => (
                <TableRow
                  key={claim._id}
                  className="hover:bg-blue-50/30 transition-all group border-none"
                >
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-100 font-manrope">
                        {claim.user?.fullName?.[0] || <FiUser />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 font-manrope text-xs leading-none mb-1.5 uppercase">
                          {claim.user?.fullName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium font-inter">
                          {claim.user?.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-zinc-700 font-manrope text-[10px] mb-1">
                        #{claim._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold tracking-tighter uppercase">
                        {claim.policyNumber}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5 font-bold text-zinc-600 text-xs font-inter">
                    {claim.claimType}
                  </TableCell>

                  <TableCell className="px-8 py-5 font-black text-zinc-900 font-manrope">
                    {formatCurrency(claim.amount)}
                  </TableCell>

                  <TableCell className="px-8 py-5">
                    <Badge
                      className={`px-3 py-1 font-black text-[9px] uppercase tracking-wider border-none ${getStatusStyles(
                        claim.status
                      )}`}
                    >
                      {claim.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm"
                        onClick={() => setSelectedClaim(claim)}
                      >
                        <FiEye className="h-4 w-4 text-zinc-500" />
                      </Button>
                      {claim.status?.toLowerCase() === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl hover:bg-green-50 hover:text-green-600"
                            onClick={() =>
                              handleStatusUpdate(claim._id, "approved")
                            }
                          >
                            <FiCheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              handleStatusUpdate(claim._id, "rejected")
                            }
                          >
                            <FiXCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* --- MODERN PAGINATION FOOTER --- */}
        <div className="bg-zinc-50/50 border-t border-zinc-100 px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-full border-2 border-white bg-zinc-200"
                />
              ))}
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Live Index:{" "}
              <span className="text-blue-600">
                {adminClaims.length} Displayed
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white shadow-sm border border-zinc-200 p-1.5 rounded-[1.2rem]">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-zinc-100 disabled:opacity-20"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <FiChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 px-2">
              <span className="text-xs font-black font-manrope text-zinc-900">
                {page}
              </span>
              <span className="text-xs font-bold text-zinc-300">/</span>
              <span className="text-xs font-bold text-zinc-400">
                {meta.totalPages}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-zinc-100 disabled:opacity-20"
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <FiChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden lg:block">
            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em]">
              Secure Registry Node
            </p>
          </div>
        </div>
      </div>

      {selectedClaim && (
        <EditClaimModal
          claim={selectedClaim}
          open={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </div>
  );
}
