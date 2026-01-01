import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

export default function StepRiskScore({ form, riskScore, isLoading }) {
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
          animate={{ width: `${riskScore ?? 0}%` }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`h-4 rounded-full ${getColor(riskScore ?? 0)} shadow-md`}
        />
        <div className="flex justify-between text-sm">
          <span>0%</span>
          <span>{riskScore ?? 0}%</span>
          <span>100%</span>
        </div>
      </div>

      <div>
        {isLoading && <Badge variant="secondary">Calculating...</Badge>}
        {!isLoading && riskScore !== undefined && (
          <Badge
            variant={
              riskScore <= 40
                ? "success"
                : riskScore <= 70
                ? "warning"
                : "destructive"
            }
          >
            {riskScore <= 40
              ? "Low Risk"
              : riskScore <= 70
              ? "Medium Risk"
              : "High Risk"}
          </Badge>
        )}
      </div>
    </div>
  );
}
