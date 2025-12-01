import { useState } from "react";
import { toast } from "react-toastify";
import { register as registerRequest } from "../../services/authService";
import StepPersonalInfo from "./StepPersonalInfo";
import StepAccountDetails from "./StepAccountDetails";
import StepAddress from "./StepAddress";

const steps = ["Personal Info", "Account Details", "Address"];

export default function RegisterForm({ toggleMode }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
    address: { street: "", city: "", state: "", zip: "", country: "" },
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] : value,
      }));
    }
  };

  const nextStep = () =>
    activeStep < steps.length - 1 && setActiveStep(activeStep + 1);
  const prevStep = () => activeStep > 0 && setActiveStep(activeStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerRequest(formData);
      toast.success("Account created successfully!");
      toggleMode();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
        <div className="md:flex">
          <div className="md:w-full p-8 md:p-12">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        index <= activeStep
                          ? "bg-pink-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index < activeStep ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 hidden md:block ${
                        index <= activeStep
                          ? "text-pink-600 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((activeStep + 1) / steps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
              Create Your Account
            </h2>
            <p className="text-gray-600 mb-8 text-center md:text-left">
              Fill in your details to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeStep === 0 && (
                <StepPersonalInfo
                  formData={formData}
                  handleChange={handleChange}
                />
              )}
              {activeStep === 1 && (
                <StepAccountDetails
                  formData={formData}
                  handleChange={handleChange}
                />
              )}
              {activeStep === 2 && (
                <StepAddress formData={formData} handleChange={handleChange} />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ← Previous
                </button>

                {activeStep < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md`}
                  >
                    {isLoading ? "Creating Account..." : "Create Account 🎉"}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Already have an account?
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-300"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
