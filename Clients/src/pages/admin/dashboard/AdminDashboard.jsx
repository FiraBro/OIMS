import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  FileText,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
];

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Insurance Overview
          </h1>
          <p className="text-muted-foreground">
            Real-time performance of policies and claims.
          </p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2">
          <FileText size={18} /> Generate Report
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Active Policies",
            value: "12,482",
            icon: FileText,
            color: "text-blue-500",
          },
          {
            label: "Total Revenue",
            value: "$4.2M",
            icon: TrendingUp,
            color: "text-green-500",
          },
          {
            label: "Pending Claims",
            value: "148",
            icon: AlertCircle,
            color: "text-orange-500",
          },
          {
            label: "New Customers",
            value: "+573",
            icon: Users,
            color: "text-purple-500",
          },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Premium Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Claims List */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">John Doe - Auto Claim</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted 2h ago
                  </p>
                </div>
                <div className="text-sm font-semibold text-orange-500">
                  Pending
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;
