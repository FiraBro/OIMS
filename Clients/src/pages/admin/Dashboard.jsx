// components/admin/dashboard/DashboardContent.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: DollarSign,
    trend: "up",
    color: "bg-green-500",
  },
  {
    title: "Subscriptions",
    value: "+2350",
    change: "+180.1%",
    icon: Users,
    trend: "up",
    color: "bg-blue-500",
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19%",
    icon: ShoppingCart,
    trend: "up",
    color: "bg-purple-500",
  },
  {
    title: "Active Now",
    value: "+573",
    change: "-20.1%",
    icon: Activity,
    trend: "down",
    color: "bg-orange-500",
  },
];

const recentOrders = [
  {
    id: 1,
    customer: "Olivia Martin",
    email: "olivia@email.com",
    amount: "$1,999.00",
    status: "completed",
  },
  {
    id: 2,
    customer: "Jackson Lee",
    email: "jackson@email.com",
    amount: "$39.00",
    status: "pending",
  },
  {
    id: 3,
    customer: "Isabella Nguyen",
    email: "isabella@email.com",
    amount: "$299.00",
    status: "processing",
  },
  {
    id: 4,
    customer: "William Kim",
    email: "will@email.com",
    amount: "$99.00",
    status: "completed",
  },
  {
    id: 5,
    customer: "Sofia Davis",
    email: "sofia@email.com",
    amount: "$39.00",
    status: "cancelled",
  },
];

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-full ${stat.color} bg-opacity-10`}
                  >
                    <stat.icon
                      className={`h-6 w-6 ${stat.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue trends for the current year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-gray-400">
                  Using Recharts, Chart.js, or similar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest 5 orders from your store</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.amount}</p>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                          ? "outline"
                          : order.status === "processing"
                          ? "secondary"
                          : "destructive"
                      }
                      className="mt-1"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>
            Current tasks and their completion status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { task: "Website Redesign", progress: 85, color: "bg-blue-500" },
            {
              task: "Mobile App Development",
              progress: 65,
              color: "bg-green-500",
            },
            {
              task: "Marketing Campaign",
              progress: 45,
              color: "bg-purple-500",
            },
            {
              task: "Database Migration",
              progress: 30,
              color: "bg-orange-500",
            },
          ].map((item, index) => (
            <motion.div
              key={item.task}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.task}</span>
                <span className="text-sm text-gray-500">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
