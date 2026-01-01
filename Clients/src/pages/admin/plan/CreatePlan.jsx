import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreatePlan } from "@/hooks/useCreator";
import StepBasicInfo from "./StepBasicInfo";
import StepPricing from "./StepPricing";
import StepFeatures from "./StepFeatures";
import StepVisibility from "./StepVisibility";
import StepReview from "./StepReview";
import StepRiskScore from "./StepRiskScore";

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
  const createPlan = useCreatePlan();

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    premium: "",
    coverageAmount: "",
    deductible: 500,
    premiumFrequency: "monthly",
    features: [],
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-between text-sm text-muted-foreground">
        {steps.map((label, i) => (
          <span
            key={label}
            className={i === step ? "font-semibold text-primary" : ""}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <Card className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {step === 0 && <StepBasicInfo form={form} update={update} />}
            {step === 1 && <StepPricing form={form} update={update} />}
            {step === 2 && <StepFeatures form={form} update={update} />}
            {step === 3 && <StepVisibility form={form} update={update} />}
            {step === 4 && <StepRiskScore form={form} update={update} />}
            {step === 5 && <StepReview form={form} />}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={back}>
          Back
        </Button>

        {step < steps.length - 1 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={submit} disabled={createPlan.isLoading}>
            Create Plan
          </Button>
        )}
      </div>
    </div>
  );
}
