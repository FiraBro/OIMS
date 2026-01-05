import { useState } from "react";
import { toast } from "react-toastify";
import StepIndicator from "./StepIndicator";
import AccountStep from "./AccountStep";
import PersonalInfoStep from "./PersonalInfoStep";
import AddressStep from "./AddressStep";
import { Button } from "@/components/ui/button";

const steps = ["Account Details", "Personal Information", "Address"];

export default function RegisterForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
  onSwitchToLogin,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateCurrentStep = () => {
    if (activeStep === 0) {
      if (!formData.fullName.trim()) {
        toast("Please enter your full name");
        return false;
      }
      if (!formData.email.trim()) {
        toast("Please enter your email");
        return false;
      }
      if (!formData.password.trim()) {
        toast("Please enter a password");
        return false;
      }
      if (formData.password !== formData.passwordConfirm) {
        toast("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateCurrentStep()) return;

    if (activeStep === steps.length - 1) {
      if (!acceptTerms) {
        toast("Please accept the terms and conditions");
        return;
      }
      onSubmit(); // ✅ clean call
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={steps} activeStep={activeStep} />

      <form onSubmit={handleSubmit}>
        {activeStep === 0 && (
          <AccountStep
            formData={formData}
            onChange={onChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword} // ✅ must exist
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword} // ✅ must exist
          />
        )}

        {activeStep === 1 && (
          <PersonalInfoStep formData={formData} onChange={onChange} />
        )}
        {activeStep === 2 && (
          <AddressStep
            formData={formData}
            onChange={onChange}
            acceptTerms={acceptTerms}
            onAcceptTermsChange={setAcceptTerms}
          />
        )}

        <div className="flex justify-between pt-8 border-t">
          {activeStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              ← Previous
            </Button>
          ) : (
            <div />
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : activeStep === steps.length - 1
              ? "Create Account"
              : "Next Step →"}
          </Button>
        </div>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm">
          Already have an account?{" "}
          <Button variant="link" onClick={onSwitchToLogin}>
            Sign in here
          </Button>
        </p>
      </div>
    </div>
  );
}
