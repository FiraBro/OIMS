import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaUserCircle,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCreditCard,
  FaIdCard,
  FaChartLine,
  FaFilter,
  FaDownload,
  FaSearch,
  FaChevronRight,
  FaHistory,
  FaClipboardList,
  FaUserShield,
} from "react-icons/fa";
import { FiUsers, FiDollarSign, FiPackage } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { applicationService } from "@/services/applicationService";

export default function AdminPolicyApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await applicationService.listApplications();
    const apps = Array.isArray(res.applications) ? res.applications : [];
    setApplications(apps);

    const statsData = {
      total: apps.length,
      pending: apps.filter((app) => app.status === "pending").length,
      approved: apps.filter((app) => app.status === "approved").length,
      rejected: apps.filter((app) => app.status === "rejected").length,
    };
    setStats(statsData);
  };

  const handleApprove = async (id) => {
    await applicationService.approveApplication(id);
    fetchApplications();
  };

  const handleReject = async (id) => {
    await applicationService.rejectApplication(id);
    fetchApplications();
  };

  const statusBadge = (status) => {
    const variants = {
      approved:
        "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
      rejected: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100",
      pending:
        "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
    };

    const icons = {
      approved: <FaCheck className="w-3 h-3 mr-1" />,
      rejected: <FaTimes className="w-3 h-3 mr-1" />,
      pending: null,
    };

    const labels = {
      approved: "Approved",
      rejected: "Rejected",
      pending: "Pending Review",
    };

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Badge
          variant="outline"
          className={`px-3 py-1 rounded-full border font-medium ${variants[status]}`}
        >
          {icons[status]}
          {labels[status]}
        </Badge>
      </motion.div>
    );
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.personal?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.personal?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.planId?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="overflow-hidden"
    >
      <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <motion.p
                key={value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-gray-900"
              >
                {value}
              </motion.p>
              {trend && (
                <p className="text-xs font-medium text-green-600 mt-1">
                  {trend}
                </p>
              )}
            </div>
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`p-3 rounded-full ${color} bg-opacity-10`}
            >
              <Icon className={`w-6 h-6 ${color.replace("text-", "")}`} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6 bg-gray-50 min-h-screen"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Policy Applications
            </h1>
            <p className="text-gray-600 mt-1">
              Review and manage insurance applications
            </p>
          </div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Button
              variant="outline"
              className="gap-2 bg-white border border-gray-300"
            >
              <FaDownload className="w-4 h-4 " />
              Export
            </Button>
            <Button className="gap-2 bg-gradient-to-r text-white from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <FaChartLine className="w-4 h-4" />
              Analytics
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={FiUsers}
            color="text-blue-600"
            trend="+12% this month"
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={FaEye}
            color="text-amber-600"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={FaCheck}
            color="text-emerald-600"
            trend="+8% conversion"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={FaTimes}
            color="text-rose-600"
          />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <motion.div
                  className="relative flex-1 max-w-md"
                  whileFocus={{ scale: 1.01 }}
                >
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or plan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-300"
                  />
                </motion.div>

                <div className="flex items-center gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-white border-gray-300">
                      <FaFilter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border border-gray-200 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 ">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 ">
                  Recent Applications
                </CardTitle>
                <Badge variant="outline" className="font-normal bg-white">
                  {filteredApplications.length} results
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 ">
              <Table>
                <TableHeader className="bg-gray-50/50 ">
                  <TableRow className="border border-gray-300">
                    <TableHead className="font-semibold text-gray-700">
                      Applicant
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Plan
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Applied Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <AnimatePresence mode="wait">
                    {filteredApplications.map((app, index) => (
                      <motion.tr
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          backgroundColor: "rgba(249, 250, 251, 0.8)",
                        }}
                        className="hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <TableCell className="bg-white">
                          <motion.div
                            className="flex items-center gap-3"
                            whileHover={{ x: 5 }}
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
                            >
                              <FaUserCircle className="w-5 h-5 text-blue-600" />
                            </motion.div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {app.personal?.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {app.personal?.email}
                              </div>
                            </div>
                          </motion.div>
                        </TableCell>

                        <TableCell className="bg-white">
                          <div className="font-medium text-gray-900">
                            {app.planId?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            <FiDollarSign className="inline w-3 h-3 mr-1" />
                            Premium
                          </div>
                        </TableCell>

                        <TableCell className="bg-white">
                          {statusBadge(app.status)}
                        </TableCell>

                        <TableCell className="bg-white">
                          <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </motion.div>
                        </TableCell>

                        <TableCell className="bg-white">
                          <div className="flex justify-end gap-2">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() => setSelectedApp(app)}
                              >
                                <FaEye className="w-4 h-4" />
                              </Button>
                            </motion.div>

                            {app.status === "pending" && (
                              <>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    onClick={() => handleApprove(app._id)}
                                  >
                                    <FaCheck className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.15 }}
                                >
                                  <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                    onClick={() => handleReject(app._id)}
                                  >
                                    <FaTimes className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>

              {filteredApplications.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-white"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatDelay: 1,
                    }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <FaSearch className="w-8 h-8 text-gray-400" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No applications found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No applications have been submitted yet"}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Details Modal - Fixed with White Background */}
      <AnimatePresence>
        {selectedApp && (
          <Dialog
            open={!!selectedApp}
            onOpenChange={() => setSelectedApp(null)}
          >
            <DialogContent className="max-w-6xl p-0 gap-0 overflow-hidden bg-white rounded-xl shadow-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
                    <FaUserCircle className="w-6 h-6 text-blue-600" />
                    Application Details
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Review all submitted information and documents for{" "}
                    {selectedApp?.personal?.fullName}
                  </DialogDescription>
                </DialogHeader>

                {selectedApp && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white"
                  >
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger
                          value="overview"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                        >
                          <FaClipboardList className="w-4 h-4 mr-2" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="personal"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                        >
                          <FaUserShield className="w-4 h-4 mr-2" />
                          Personal Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="documents"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                        >
                          <FaFileAlt className="w-4 h-4 mr-2" />
                          Documents
                        </TabsTrigger>
                        <TabsTrigger
                          value="timeline"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                        >
                          <FaHistory className="w-4 h-4 mr-2" />
                          Timeline
                        </TabsTrigger>
                      </TabsList>

                      <AnimatePresence mode="wait">
                        <TabsContent value="overview" className="space-y-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Status Card */}
                              <motion.div
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Card className="border border-gray-200 shadow-sm">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-700">
                                      Application Status
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        {statusBadge(selectedApp.status)}
                                        <span className="text-sm text-gray-500 ml-2">
                                          ID: {selectedApp._id?.substring(0, 8)}
                                        </span>
                                      </div>
                                      <Progress
                                        value={
                                          selectedApp.status === "approved"
                                            ? 100
                                            : selectedApp.status === "rejected"
                                            ? 100
                                            : 50
                                        }
                                        className="h-2"
                                      />
                                      <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                          <FaCalendarAlt className="w-3 h-3" />
                                          Applied on{" "}
                                          {new Date(
                                            selectedApp.createdAt
                                          ).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>

                              {/* Quick Actions */}
                              <motion.div
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Card className="border border-gray-200 shadow-sm">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-700">
                                      Quick Actions
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    {selectedApp.status === "pending" ? (
                                      <div className="space-y-3">
                                        <div className="flex gap-2">
                                          <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1"
                                          >
                                            <Button
                                              onClick={() =>
                                                handleApprove(selectedApp._id)
                                              }
                                              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                                            >
                                              <FaCheck className="mr-2 w-4 h-4" />
                                              Approve Application
                                            </Button>
                                          </motion.div>
                                          <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1"
                                          >
                                            <Button
                                              onClick={() =>
                                                handleReject(selectedApp._id)
                                              }
                                              variant="outline"
                                              className="w-full text-rose-700 border-rose-300 hover:bg-rose-50 hover:border-rose-400"
                                            >
                                              <FaTimes className="mr-2 w-4 h-4" />
                                              Reject
                                            </Button>
                                          </motion.div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-center">
                                          Review all information before making a
                                          decision
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="text-center py-4">
                                        <motion.div
                                          animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0],
                                          }}
                                          transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                          }}
                                          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3"
                                        >
                                          {selectedApp.status === "approved" ? (
                                            <FaCheck className="w-6 h-6 text-emerald-600" />
                                          ) : (
                                            <FaTimes className="w-6 h-6 text-rose-600" />
                                          )}
                                        </motion.div>
                                        <p className="text-gray-700 font-medium">
                                          Application has been{" "}
                                          {selectedApp.status}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                          Decision made on{" "}
                                          {new Date(
                                            selectedApp.updatedAt ||
                                              selectedApp.createdAt
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </div>

                            {/* Overview Cards */}
                            <div className="grid md:grid-cols-3 gap-4">
                              <InfoCard
                                title="Plan Details"
                                icon={FiPackage}
                                iconColor="text-blue-600"
                              >
                                <p className="font-semibold text-gray-900 text-lg mb-1">
                                  {selectedApp.planId?.name}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                  Insurance Coverage Plan
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="text-gray-700">
                                    <span className="font-medium">
                                      Premium:
                                    </span>{" "}
                                    ${selectedApp.payment?.amount || "N/A"}
                                  </div>
                                  <div className="text-gray-700">
                                    <span className="font-medium">Term:</span>{" "}
                                    {selectedApp.planId?.term || "1 Year"}
                                  </div>
                                </div>
                              </InfoCard>

                              <InfoCard
                                title="Payment Details"
                                icon={FaCreditCard}
                                iconColor="text-emerald-600"
                              >
                                <p className="font-semibold text-gray-900 text-lg mb-1">
                                  {selectedApp.payment?.method}
                                </p>
                                <p className="text-sm text-gray-600 mb-2 capitalize">
                                  Payment Method
                                </p>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      Frequency:
                                    </span>
                                    <span className="font-medium text-gray-900 capitalize">
                                      {selectedApp.payment?.frequency}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      Status:
                                    </span>
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                      Active
                                    </Badge>
                                  </div>
                                </div>
                              </InfoCard>

                              <InfoCard
                                title="Documents"
                                icon={FaFileAlt}
                                iconColor="text-amber-600"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-semibold text-gray-900 text-lg">
                                      {selectedApp.documents?.length || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Uploaded Files
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      document
                                        .querySelector(
                                          '[data-value="documents"]'
                                        )
                                        ?.click()
                                    }
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                  >
                                    View All
                                  </Button>
                                </div>
                                <div className="text-sm text-gray-500">
                                  All required documents have been submitted
                                </div>
                              </InfoCard>
                            </div>

                            {/* Application Summary */}
                            <motion.div
                              whileHover={{ y: -3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="border border-gray-200 shadow-sm">
                                <CardHeader>
                                  <CardTitle className="text-sm font-semibold text-gray-700">
                                    Application Summary
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-3">
                                        Personal Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Full Name:
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {selectedApp.personal?.fullName}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Email:
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {selectedApp.personal?.email}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Phone:
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {selectedApp.personal?.phone}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-3">
                                        Nominee Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Nominee Name:
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {selectedApp.nominee?.name}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Relationship:
                                          </span>
                                          <span className="font-medium text-gray-900 capitalize">
                                            {selectedApp.nominee?.relationship}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="personal" className="bg-white">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <Card className="border border-gray-200 shadow-sm">
                              <CardHeader>
                                <CardTitle className="text-sm font-semibold text-gray-700">
                                  Personal Information
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <InfoRow
                                      icon={
                                        <FaUserCircle className="w-4 h-4" />
                                      }
                                      label="Full Name"
                                    >
                                      <span className="font-medium text-gray-900">
                                        {selectedApp.personal?.fullName}
                                      </span>
                                    </InfoRow>
                                    <InfoRow
                                      icon={<FaEnvelope className="w-4 h-4" />}
                                      label="Email Address"
                                    >
                                      <span className="font-medium text-gray-900">
                                        {selectedApp.personal?.email}
                                      </span>
                                    </InfoRow>
                                    <InfoRow
                                      icon={<FaPhone className="w-4 h-4" />}
                                      label="Phone Number"
                                    >
                                      <span className="font-medium text-gray-900">
                                        {selectedApp.personal?.phone}
                                      </span>
                                    </InfoRow>
                                  </div>
                                  <div className="space-y-4">
                                    <InfoRow
                                      icon={
                                        <FaCalendarAlt className="w-4 h-4" />
                                      }
                                      label="Date of Birth"
                                    >
                                      <span className="font-medium text-gray-900">
                                        {new Date(
                                          selectedApp.personal?.dob
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </InfoRow>
                                    <InfoRow
                                      icon={<FaIdCard className="w-4 h-4" />}
                                      label="Nominee Name"
                                    >
                                      <span className="font-medium text-gray-900">
                                        {selectedApp.nominee?.name}
                                      </span>
                                    </InfoRow>
                                    <InfoRow
                                      icon={<FiUsers className="w-4 h-4" />}
                                      label="Nominee Relationship"
                                    >
                                      <span className="font-medium text-gray-900 capitalize">
                                        {selectedApp.nominee?.relationship}
                                      </span>
                                    </InfoRow>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border border-gray-200 shadow-sm">
                              <CardHeader>
                                <CardTitle className="text-sm font-semibold text-gray-700">
                                  Medical History
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <p className="text-gray-700 whitespace-pre-line">
                                    {selectedApp.medical?.history ||
                                      "No medical history provided"}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="documents" className="bg-white">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <Card className="border border-gray-200 shadow-sm">
                              <CardHeader>
                                <CardTitle className="text-sm font-semibold text-gray-700">
                                  Uploaded Documents
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <p className="text-gray-600">
                                    All submitted documents for verification.
                                    Click any document to preview.
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedApp.documents?.map(
                                      (doc, index) => (
                                        <motion.div
                                          key={doc._id}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: index * 0.1 }}
                                          whileHover={{ y: -4, scale: 1.02 }}
                                          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group bg-white"
                                          onClick={() =>
                                            setSelectedDoc(doc.url)
                                          }
                                        >
                                          <div className="flex items-center justify-between mb-3">
                                            <motion.div
                                              whileHover={{ rotate: 360 }}
                                              transition={{ duration: 0.5 }}
                                              className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors"
                                            >
                                              <FaFileAlt className="w-6 h-6 text-blue-600" />
                                            </motion.div>
                                            <Badge
                                              variant="outline"
                                              className="text-xs bg-gray-50"
                                            >
                                              Doc {index + 1}
                                            </Badge>
                                          </div>
                                          <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {doc.name}
                                          </h4>
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                              Click to preview
                                            </span>
                                            <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                          </div>
                                        </motion.div>
                                      )
                                    )}
                                  </div>
                                  {(!selectedApp.documents ||
                                    selectedApp.documents.length === 0) && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="text-center py-8"
                                    >
                                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <FaFileAlt className="w-8 h-8 text-gray-400" />
                                      </div>
                                      <h4 className="font-medium text-gray-900 mb-2">
                                        No documents uploaded
                                      </h4>
                                      <p className="text-gray-500">
                                        The applicant has not submitted any
                                        documents yet.
                                      </p>
                                    </motion.div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="timeline" className="bg-white">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <Card className="border border-gray-200 shadow-sm">
                              <CardHeader>
                                <CardTitle className="text-sm font-semibold text-gray-700">
                                  Application Timeline
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <TimelineStep
                                    status="completed"
                                    title="Application Submitted"
                                    date={new Date(
                                      selectedApp.createdAt
                                    ).toLocaleDateString()}
                                    description="Application was successfully submitted by the user"
                                  />
                                  <TimelineStep
                                    status={
                                      selectedApp.status === "pending"
                                        ? "current"
                                        : "completed"
                                    }
                                    title="Under Review"
                                    date={new Date(
                                      selectedApp.createdAt
                                    ).toLocaleDateString()}
                                    description="Application is currently being reviewed by the team"
                                  />
                                  <TimelineStep
                                    status={
                                      selectedApp.status === "pending"
                                        ? "pending"
                                        : "completed"
                                    }
                                    title={
                                      selectedApp.status === "approved"
                                        ? "Approved"
                                        : selectedApp.status === "rejected"
                                        ? "Rejected"
                                        : "Decision"
                                    }
                                    date={
                                      selectedApp.updatedAt
                                        ? new Date(
                                            selectedApp.updatedAt
                                          ).toLocaleDateString()
                                        : "Pending"
                                    }
                                    description={
                                      selectedApp.status === "pending"
                                        ? "Awaiting final decision"
                                        : `Application has been ${selectedApp.status}`
                                    }
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </TabsContent>
                      </AnimatePresence>
                    </Tabs>
                  </motion.div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <Dialog
            open={!!selectedDoc}
            onOpenChange={() => setSelectedDoc(null)}
          >
            <DialogContent className="max-w-4xl bg-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-gray-900">
                    <FaFileAlt className="w-5 h-5 text-blue-600" />
                    Document Preview
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    View the uploaded document in detail
                  </DialogDescription>
                </DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-4"
                >
                  <img
                    src={`/${selectedDoc}`}
                    alt="Document"
                    className="w-full max-h-[60vh] object-contain rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/600x800?text=Document+Preview+Not+Available";
                    }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-end gap-3 pt-4"
                >
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDoc(null)}
                  >
                    Close Preview
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Download Document
                  </Button>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

function InfoCard({ title, icon: Icon, iconColor, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`border border-gray-200 shadow-sm ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </motion.div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                {title}
              </h4>
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
      className="flex items-start gap-3 py-2"
    >
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className="text-gray-900 mt-1">{children}</div>
      </div>
    </motion.div>
  );
}

function TimelineStep({ status, title, date, description }) {
  const statusConfig = {
    completed: {
      dot: "bg-emerald-500",
      line: "bg-emerald-500",
      icon: <FaCheck className="w-3 h-3 text-white" />,
    },
    current: {
      dot: "bg-blue-500",
      line: "bg-gray-300",
      icon: <FaEye className="w-3 h-3 text-white" />,
    },
    pending: {
      dot: "bg-gray-300",
      line: "bg-gray-300",
      icon: <FaClock className="w-3 h-3 text-gray-400" />,
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`w-6 h-6 rounded-full flex items-center justify-center ${config.dot}`}
        >
          {config.icon}
        </motion.div>
        <div className={`w-0.5 h-full ${config.line} mt-2`}></div>
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}
