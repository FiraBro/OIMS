import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import axios from "@/lib/axios"; // your axios instance

export default function StepRiskScore({ form }) {
  // ---------------------------
  // Fetch AI risk score
  // ---------------------------
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["riskScore", form],
    queryFn: async () => {
      const res = await axios.post("/plans/preview-risk", form);
      return res.data.data.riskScore;
    },
    enabled: false, // manual fetch
    staleTime: 1000 * 60, // optional caching
  });

  // Refetch risk score whenever relevant fields change
  useEffect(() => {
    const timeout = setTimeout(() => refetch(), 500); // debounce
    return () => clearTimeout(timeout);
  }, [
    form.coverageAmount,
    form.deductible,
    form.minAge,
    form.maxAge,
    form.maxMembers,
    form.features,
    form.exclusions,
  ]);

  // Determine color based on risk
  const getColor = (score) => {
    if (score <= 40) return "bg-green-500";
    if (score <= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FiAlertCircle className="text-lg text-muted-foreground" />
        <h2 className="text-xl font-semibold">AI Risk Score Preview</h2>
      </div>

      <div className="space-y-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data ?? 0}%` }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`h-4 rounded-full ${getColor(data)} shadow-md`}
        />
        <div className="flex justify-between text-sm">
          <span>0%</span>
          <span>{data ?? 0}%</span>
          <span>100%</span>
        </div>
      </div>

      <div>
        {isFetching && <Badge variant="secondary">Calculating...</Badge>}
        {!isFetching && data !== undefined && (
          <Badge
            variant={
              data <= 40 ? "success" : data <= 70 ? "warning" : "destructive"
            }
          >
            {data <= 40 ? "Low Risk" : data <= 70 ? "Medium Risk" : "High Risk"}
          </Badge>
        )}
      </div>
    </div>
  );
}
