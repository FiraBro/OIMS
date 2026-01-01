import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui
import { Check } from "lucide-react"; // Icons for completed steps

import StepBasicInfo from "./StepBasicInfo";
import StepPricing from "./StepPricing";
import StepFeatures from "./StepFeatures";
import StepVisibility from "./StepVisibility";
import StepReview from "./StepReview";
import StepRiskScore from "./StepRiskScore";

import { usePlans } from "@/hooks/usePlan";

const steps = [
  "Basic Info",
  "Pricing",
  "Features",
  "Visibility",
  "Risk Score",
  "Review",
];

export default function CreatePlan() {
  const [step, setStep] = useState(0);
  const { createPlan, riskScore } = usePlans();

  const progressValue = ((step + 1) / steps.length) * 100;

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    premium: "",
    coverageAmount: "",
    deductible: 500,
    premiumFrequency: "monthly",
    features: [],
    exclusions: [],
    minAge: 18,
    maxAge: 65,
    maxMembers: 1,
    isPopular: false,
    isFeatured: false,
    status: "PUBLISHED",
    validityPeriod: 365,
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const submit = () => createPlan.mutate(form);

  const {
    data: riskData,
    refetch: refetchRisk,
    isFetching: riskLoading,
  } = riskScore(form);

  useEffect(() => {
    const timer = setTimeout(() => refetchRisk(), 500);
    return () => clearTimeout(timer);
  }, [form, refetchRisk]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Sidebar Navigation */}
      <aside className="lg:col-span-3 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Create Plan</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details to launch your new insurance product.
          </p>
        </div>

        <nav className="flex flex-col space-y-2 relative">
          {steps.map((label, i) => {
            const isCompleted = step > i;
            const isActive = step === i;

            return (
              <div
                key={label}
                className="relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
              >
                {/* Animated Background for Active Step */}
                {isActive && (
                  <motion.div
                    layoutId="activeStepBg"
                    className="absolute inset-0 bg-blue-50 border-l-4 border-blue-600 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Step Circle */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? "#2563eb"
                      : isActive
                      ? "#ffffff"
                      : "#f3f4f6",
                    borderColor:
                      isCompleted || isActive ? "#2563eb" : "#e5e7eb",
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-colors duration-300`}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={isActive ? "text-blue-600" : "text-gray-400"}
                      >
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Step Label */}
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isActive
                      ? "text-blue-700"
                      : isCompleted
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* RIGHT COLUMN: Content Area */}
      <main className="lg:col-span-9 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{Math.round(progressValue)}% Complete</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <Card className="shadow-lg border-none bg-card/50 backdrop-blur">
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && <StepBasicInfo form={form} update={update} />}
                {step === 1 && <StepPricing form={form} update={update} />}
                {step === 2 && <StepFeatures form={form} update={update} />}
                {step === 3 && <StepVisibility form={form} update={update} />}
                {step === 4 && (
                  <StepRiskScore
                    form={form}
                    update={update}
                    riskScore={riskData}
                    isLoading={riskLoading}
                  />
                )}
                {step === 5 && <StepReview form={form} riskScore={riskData} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Persistent Footer Actions */}
          <div className="mx-4 border-t border-gray-300 px-4 p-4 md:p-6 flex justify-between bg-muted/20">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={back}
              className="px-8"
            >
              Previous
            </Button>

            {step < steps.length - 1 ? (
              <Button onClick={next} className="px-8 shadow-md">
                Continue
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={createPlan.isLoading}
                className="px-8 text-white bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                {createPlan.isLoading ? "Publishing..." : "Publish Plan"}
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
