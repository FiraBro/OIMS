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

      case 1:
        return true;

      case 2:
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => setActiveStep(activeStep - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep === steps.length - 1) {
      if (!acceptTerms) {
        toast.error("Please accept the terms and conditions");
        return;
      }
      onSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create your account
        </h2>
        <p className="text-gray-600">
          Get started with your free account today
        </p>
      </div>

      <StepIndicator steps={steps} activeStep={activeStep} />

      <form onSubmit={handleSubmit}>
        {activeStep === 0 && (
          <AccountStep formData={formData} onChange={onChange} />
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
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="border-gray-300 hover:bg-gray-50"
            >
              ← Previous
            </Button>
          ) : (
            <div></div>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Next Step →
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          )}
        </div>
      </form>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToLogin}
            className="text-gray-900 font-semibold p-0 h-auto"
          >
            Sign in here
          </Button>
        </p>
      </div>
    </div>
  );
}
