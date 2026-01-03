import { useState, useDeferredValue, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiFileText,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { useUsers } from "@/hooks/useUser";

// Animation Variants
const rowVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 10, transition: { duration: 0.1 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
};

export default function AdminUsersPage() {
  // --- State ---
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const deferredSearch = useDeferredValue(search);

  // --- Hook Integration ---
  const {
    data,
    isLoading,
    isFetching,
    deleteUser,
    isProcessing,
    exportToCSV,
    isExporting,
  } = useUsers({
    page: currentPage,
    limit: 10,
    search: deferredSearch,
    status: filter,
  });

  const users = data?.users || [];
  const meta = {
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
  };

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearch, filter]);

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this user?")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="p-8 bg-zinc-50/30 min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">
            User Registry
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Database Scale:{" "}
            <span className="text-blue-600 font-black">
              {meta.total.toLocaleString()}
            </span>{" "}
            Verified Records
          </p>
        </div>

        {/* Shine Export Button */}
        <Button
          onClick={exportToCSV}
          disabled={isExporting || isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest px-6 h-11 rounded-xl shadow-lg shadow-blue-200 border-none transition-all active:scale-95"
        >
          {isExporting ? (
            <FiRefreshCw className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <FiDownload className="mr-2 h-3 w-3" />
          )}
          {isExporting ? "Generating..." : "Download CSV"}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <Tabs
          value={filter}
          onValueChange={setFilter}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-zinc-100/50 border border-zinc-200">
            <TabsTrigger
              value="all"
              className="text-[10px] font-black uppercase"
            >
              All Users
            </TabsTrigger>
            <TabsTrigger
              value="applicant"
              className="text-[10px] font-black uppercase"
            >
              Applicants
            </TabsTrigger>
            <TabsTrigger
              value="registered"
              className="text-[10px] font-black uppercase"
            >
              Registered Only
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-blue-500 rounded-xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-zinc-200 rounded-3xl overflow-hidden shadow-md bg-white relative">
        {/* Shine Progress Bar */}
        {(isFetching || isExporting) && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-50 overflow-hidden z-10">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            />
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-zinc-50/80 border-b border-zinc-200 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
            <tr>
              <th className="px-6 py-5 text-left">User Identity</th>
              <th className="px-6 py-5 text-left">Contact Information</th>
              <th className="px-6 py-5 text-left">Status</th>
              <th className="px-6 py-5 text-right">Management</th>
            </tr>
          </thead>

          <motion.tbody layout className="divide-y divide-zinc-100">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 bg-zinc-50/30" />
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <FiUser className="mx-auto text-4xl text-zinc-200 mb-2" />
                    <p className="text-[10px] font-black text-zinc-400 uppercase">
                      No records found
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-200 ring-2 ring-white">
                          {user.fullName?.[0]}
                        </div>
                        <span className="font-bold text-zinc-800">
                          {user.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {user.isApplicant ? (
                        <Badge className="bg-blue-500 text-white border-none font-black text-[9px] uppercase tracking-tighter shadow-sm">
                          <FiFileText className="mr-1 h-3 w-3" /> Applicant
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-zinc-200 text-zinc-400 font-black text-[9px] uppercase tracking-tighter"
                        >
                          Registered
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-full hover:bg-blue-100 hover:text-blue-600"
                          onClick={() => {
                            setSelectedUser(user);
                            setViewOpen(true);
                          }}
                        >
                          <FiEye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-full hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(user._id)}
                          disabled={isProcessing}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </motion.tbody>
        </table>

        {/* Pagination Footer */}
        <div className="bg-white border-t border-zinc-100 px-6 py-4 flex items-center justify-between">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Page <span className="text-zinc-900">{currentPage}</span> of{" "}
            {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 px-4 text-[10px] font-bold uppercase transition-all active:scale-95"
              disabled={currentPage === 1 || isFetching}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FiChevronLeft className="mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 px-4 text-[10px] font-bold uppercase bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-95"
              disabled={currentPage === meta.totalPages || isFetching}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next <FiChevronRight className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- PREMIUM PROFILE MODAL --- */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="p-0 border-none max-w-md bg-white overflow-hidden sm:rounded-3xl shadow-2xl">
          <AnimatePresence>
            {viewOpen && (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header Gradient */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700">
                  <div className="absolute -bottom-10 left-6">
                    <div className="h-20 w-20 rounded-2xl bg-white p-1 shadow-xl">
                      <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-inner">
                        {selectedUser?.fullName?.[0]}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-14 p-8">
                  <DialogHeader>
                    <div>
                      <DialogTitle className="text-2xl font-black text-zinc-900 uppercase tracking-tight">
                        {selectedUser?.fullName}
                      </DialogTitle>
                      <Badge className="mt-1 bg-blue-50 text-blue-600 border-blue-100 font-bold uppercase text-[9px] tracking-widest">
                        {selectedUser?.role || "Verified Member"}
                      </Badge>
                    </div>
                  </DialogHeader>

                  {selectedUser && (
                    <div className="mt-8 grid grid-cols-2 gap-6 bg-zinc-50 p-5 rounded-2xl border border-zinc-100 shadow-inner">
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                          Current Status
                        </p>
                        <p className="text-sm font-bold text-zinc-700 mt-1 flex items-center gap-1">
                          {selectedUser.isApplicant ? (
                            <>
                              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />{" "}
                              Active Applicant
                            </>
                          ) : (
                            "Registered User"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                          Registration Date
                        </p>
                        <p className="text-sm font-bold text-zinc-700 mt-1">
                          {new Date(selectedUser.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                      <div className="col-span-2 pt-2">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                          Email Address
                        </p>
                        <p className="text-sm font-bold text-zinc-700 mt-1 truncate">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="p-6 pt-0">
                  <Button
                    variant="ghost"
                    className="w-full font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl h-11"
                    onClick={() => setViewOpen(false)}
                  >
                    Close Record
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
