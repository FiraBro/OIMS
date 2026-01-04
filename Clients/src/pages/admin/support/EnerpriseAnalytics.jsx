import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiUsers,
  FiPieChart,
  FiFilter,
  FiArrowUpRight,
  FiActivity,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MONTH_MAP = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function EnterpriseAnalytics({ data }) {
  // Memoized Chart Data Formatting
  const retentionChart = useMemo(
    () =>
      data?.retentionMetrics?.map((m) => ({
        name: MONTH_MAP[m._id] || `M${m._id}`,
        New: m.newPolicies,
        Renewals: m.renewals,
      })),
    [data]
  );

  const funnelSteps = [
    {
      label: "Market Reach (Total Users)",
      count: data?.funnel?.totalUsers || 0,
      color: "bg-slate-200",
    },
    {
      label: "Policy Interest",
      count: data?.funnel?.interested || 0,
      color: "bg-blue-400",
    },
    {
      label: "Active Conversions",
      count: data?.funnel?.activePaid || 0,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Financial Health Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
          <CardHeader className="pb-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Live Loss Ratio
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">
                {data?.profitability?.lossRatio}%
              </span>
              <FiTrendingUp
                className={
                  data?.profitability?.lossRatio > 80
                    ? "text-red-400"
                    : "text-emerald-400"
                }
              />
            </div>
            <p className="text-[10px] font-bold opacity-50 mt-4 uppercase">
              Status:{" "}
              {data?.profitability?.lossRatio > 80 ? "Critical" : "Optimized"}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-[2rem] border-none shadow-xl bg-white p-6">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Acquisition Efficiency
            </CardTitle>
            <FiFilter className="text-slate-300" />
          </CardHeader>
          <div className="space-y-5">
            {funnelSteps.map((step, i) => {
              const percentage =
                data?.funnel?.totalUsers > 0
                  ? ((step.count / data.funnel.totalUsers) * 100).toFixed(0)
                  : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{step.label}</span>
                    <span>
                      {step.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full ${step.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Trend & Risk Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <FiUsers /> Retention & Renewals
          </CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionChart}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="New"
                  stroke="#3b82f6"
                  fill="url(#colorNew)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="Renewals"
                  stroke="#10b981"
                  fill="transparent"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <FiPieChart /> Premium Risk Distribution
          </CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.riskDistribution}
                  dataKey="premiumVolume"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                >
                  {data?.riskDistribution?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
