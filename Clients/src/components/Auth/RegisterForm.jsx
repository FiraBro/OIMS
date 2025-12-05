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
    switch (activeStep) {
      case 0:
        if (!formData.fullName.trim()) {
          toast.error("Please enter your full name");
          return false;
        }
        if (!formData.email.trim()) {
          toast.error("Please enter your email");
          return false;
        }
        if (!formData.password.trim()) {
          toast.error("Please enter a password");
          return false;
        }
        if (formData.password !== formData.passwordConfirm) {
          toast.error("Passwords do not match");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) setActiveStep(activeStep + 1);
  };
  const prevStep = () => setActiveStep(activeStep - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep === steps.length - 1) {
      if (!acceptTerms) {
        toast.error("Please accept the terms and conditions");
        return;
      }
      onSubmit(); // calls register(formData)
    } else {
      nextStep();
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
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
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

        <div className="flex justify-between pt-8 border-t border-gray-200">
          {activeStep > 0 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              ← Previous
            </Button>
          ) : (
            <div></div>
          )}

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white"
            disabled={
              isLoading || (activeStep === steps.length - 1 && !acceptTerms)
            }
          >
            {isLoading
              ? "Processing..."
              : activeStep === steps.length - 1
              ? "Create account"
              : "Next Step →"}
          </Button>
        </div>
      </form>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToLogin}
            className="text-blue-500 cursor-pointer font-semibold p-0 h-auto"
          >
            Sign in here
          </Button>
        </p>
      </div>
    </div>
  );
}
