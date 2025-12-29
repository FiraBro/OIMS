import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  FaUsers,
  FaClipboardList,
  FaShieldAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* ----------- TITLE ----------- */}
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {/* ----------- METRIC CARDS ----------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="shadow-sm border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total Users</CardTitle>
              <FaUsers className="text-blue-600 text-3xl" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">456</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policies */}
        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="shadow-sm border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total Policies</CardTitle>
              <FaShieldAlt className="text-green-600 text-3xl" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,247</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Claims */}
        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="shadow-sm border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Claims</CardTitle>
              <FaMoneyBillWave className="text-yellow-600 text-3xl" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">89</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Applications */}
        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="shadow-sm border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>New Applications</CardTitle>
              <FaClipboardList className="text-purple-600 text-3xl" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">23</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ----------- MAIN CONTENT: TWO COLUMNS ----------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Policy Applications */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Latest Policy Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-500">Health Basic</p>
                </div>
                <Button size="sm">View</Button>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold">Sarah Williams</p>
                  <p className="text-sm text-gray-500">Life Premium</p>
                </div>
                <Button size="sm">View</Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Mike Johnson</p>
                  <p className="text-sm text-gray-500">Car Protection</p>
                </div>
                <Button size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Claims */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold">CLM-0012</p>
                  <p className="text-sm text-gray-500">Michael Adams – $1200</p>
                </div>
                <Button size="sm">View</Button>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold">CLM-0029</p>
                  <p className="text-sm text-gray-500">Sarah Kim – $300</p>
                </div>
                <Button size="sm">View</Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">CLM-0034</p>
                  <p className="text-sm text-gray-500">James Lee – $6000</p>
                </div>
                <Button size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
