import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

export default function StepRiskScore({ form, riskScore, isLoading }) {
  // ---------------------------
  // Determine color based on score
  // ---------------------------
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
          animate={{ width: `${riskScore?.riskScore ?? 0}%` }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`h-4 rounded-full ${getColor(
            riskScore?.riskScore ?? 0
          )} shadow-md`}
        />
        <div className="flex justify-between text-sm">
          <span>0%</span>
          <span>{riskScore?.riskScore ?? 0}%</span>
          <span>100%</span>
        </div>
      </div>

      <div>
        {isLoading && <Badge variant="secondary">Calculating...</Badge>}
        {!isLoading && riskScore?.riskScore !== undefined && (
          <Badge
            variant={
              riskScore.riskScore <= 40
                ? "success"
                : riskScore.riskScore <= 70
                ? "warning"
                : "destructive"
            }
          >
            {riskScore.riskScore <= 40
              ? "Low Risk"
              : riskScore.riskScore <= 70
              ? "Medium Risk"
              : "High Risk"}
          </Badge>
        )}
      </div>

      {/* ---------------------------
          Recommendations to reduce risk
      --------------------------- */}
      {riskScore?.recommendations?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Suggestions to reduce risk:
          </h3>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {riskScore.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
