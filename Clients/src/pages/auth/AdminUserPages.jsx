import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
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
  FiRefreshCw,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import { userService } from "@/services/userService";

// Animation variants for the modal content
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
  const [users, setUsers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await userService.getUserAnalysis();
      setUsers(res.data.registeredUsers || []);
      setApplicants(res.data.planApplicants || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getFilteredData = () => {
    let list = [...users];
    if (filter === "applicants") {
      list = users.filter((u) => applicants.some((a) => a._id === u._id));
    } else if (filter === "registered") {
      list = users.filter((u) => !applicants.some((a) => a._id === u._id));
    }
    return list.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const currentList = getFilteredData();

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* ... Header and Search Bars (Same as your code) ... */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">
            User Identification
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Verify registration & application status
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-200 text-zinc-600"
          onClick={fetchData}
        >
          <FiRefreshCw
            className={`mr-2 h-3 w-3 ${loading && "animate-spin"}`}
          />{" "}
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <Tabs
          defaultValue="all"
          className="w-full md:w-auto"
          onValueChange={setFilter}
        >
          <TabsList className="bg-zinc-100 border border-zinc-200 p-1">
            <TabsTrigger value="all" className="text-xs font-bold uppercase">
              All ({users.length})
            </TabsTrigger>
            <TabsTrigger
              value="applicants"
              className="text-xs font-bold uppercase"
            >
              Applicants ({applicants.length})
            </TabsTrigger>
            <TabsTrigger
              value="registered"
              className="text-xs font-bold uppercase"
            >
              Registered Only
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by name..."
            className="pl-10 border-zinc-200 focus-visible:ring-zinc-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          {/* ... (Table content same as your code) ... */}
          <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
            <tr>
              <th className="px-6 py-4 text-left">Identity</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Account Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {currentList.map((user) => {
              const isApplicant = applicants.some((a) => a._id === user._id);
              return (
                <tr
                  key={user._id}
                  className="hover:bg-zinc-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                        <FiUser />
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
                    {isApplicant ? (
                      <Badge className="bg-blue-50 text-blue-600 border-blue-100 shadow-none hover:bg-blue-50 flex w-fit gap-1 items-center font-bold text-[10px] uppercase">
                        <FiFileText className="w-3 h-3" /> Plan Applicant
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-zinc-200 text-zinc-400 font-bold text-[10px] uppercase shadow-none hover:bg-transparent"
                      >
                        Registered
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedUser(user);
                          setViewOpen(true);
                        }}
                      >
                        <FiEye className="text-zinc-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:text-red-600"
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteOpen(true);
                        }}
                      >
                        <FiTrash2 className="text-zinc-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- ANIMATED VIEW MODAL --- */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="p-0 border-zinc-200 max-w-md bg-white overflow-hidden sm:rounded-2xl">
          <AnimatePresence>
            {viewOpen && (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-6">
                  <DialogHeader className="border-b border-zinc-100 pb-4">
                    <DialogTitle className="text-xl font-black uppercase tracking-tight">
                      Profile Overview
                    </DialogTitle>
                  </DialogHeader>

                  {selectedUser && (
                    <div className="py-6 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                          {selectedUser.fullName[0]}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-zinc-900">
                            {selectedUser.fullName}
                          </h2>
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase font-black"
                          >
                            {selectedUser.role}
                          </Badge>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-6">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <p className="text-[10px] font-black text-zinc-400 uppercase">
                            Status
                          </p>
                          <p className="text-sm font-bold text-zinc-700 mt-1">
                            {applicants.some((a) => a._id === selectedUser._id)
                              ? "Active Applicant"
                              : "Registered"}
                          </p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-[10px] font-black text-zinc-400 uppercase">
                            Joined
                          </p>
                          <p className="text-sm font-bold text-zinc-700 mt-1">
                            {new Date(
                              selectedUser.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="bg-zinc-50 p-4 border-t border-zinc-200">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-200 rounded-xl"
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
