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

        <nav className="flex flex-col space-y-1">
          {steps.map((label, i) => {
            const isCompleted = step > i;
            const isActive = step === i;

            return (
              <div
                key={label}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : "border-current"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "opacity-100" : "opacity-70"
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
          <div className="border-t p-4 md:p-6 flex justify-between bg-muted/20">
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
