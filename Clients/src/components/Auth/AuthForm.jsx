import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ResetPasswordModal from "./ResetPasswordModal";
import {
  register as registerRequest,
  forgotPassword,
  resetPassword,
} from "../../services/authService";
import { toast } from "react-toastify";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login: ctxLogin } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

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

  // -------------------------
  // LOGIN
  // -------------------------
  const loginUser = async () => {
    try {
      await ctxLogin({ email: formData.email, password: formData.password });

      toast.success("Login successful! Redirecting...");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // -------------------------
  // REGISTER
  // -------------------------
  const registerUser = async () => {
    try {
      await registerRequest(formData);

      toast.success("Account created successfully!");

      setTimeout(() => {
        setIsRegistering(false);
        resetForm();
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // -------------------------
  // FORGOT PASSWORD
  // -------------------------
  const handleForgotPassword = async () => {
    if (!forgotEmail) return toast.error("Enter your email first");

    try {
      await forgotPassword(forgotEmail);
      toast.success("Reset link sent! Check your email.");

      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  // -------------------------
  // RESET PASSWORD
  // -------------------------
  const handleResetPassword = async () => {
    if (!resetToken || !newPassword || !newPasswordConfirm)
      return toast.error("Fill all fields");

    try {
      await resetPassword(resetToken, newPassword, newPasswordConfirm);

      toast.success("Password reset successful! Please log in.");
      setResetToken("");
      setNewPassword("");
      setNewPasswordConfirm("");

      setShowResetModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  // -------------------------
  // FORM SUBMIT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegistering) await registerUser();
    else await loginUser();

    setIsLoading(false);
  };

  // -------------------------
  // RESET FORM
  // -------------------------
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      profilePicture: null,
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    });
    setActiveStep(0);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  const nextStep = () => activeStep < 2 && setActiveStep(activeStep + 1);
  const prevStep = () => activeStep > 0 && setActiveStep(activeStep - 1);

  const steps = ["Personal Info", "Account Details", "Address"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
        <div className="md:flex">
          {/* Left Side - Branding */}
          <div className="md:w-2/5 bg-gradient-to-br from-pink-500 to-purple-600 text-white p-8 flex flex-col justify-center">
            <div className="text-center md:text-left">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                <span className="text-2xl font-bold">✨</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {isRegistering ? "Join Our Community" : "Welcome Back"}
              </h1>
              <p className="text-pink-100 text-lg opacity-90">
                {isRegistering
                  ? "Create your account and start your journey with us today."
                  : "Sign in to access your personalized dashboard and continue where you left off."}
              </p>

              {/* Feature List for Register */}
              {isRegistering && (
                <div className="mt-8 space-y-3">
                  {["Secure & Encrypted", "24/7 Support", "Free Forever"].map(
                    (feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        {feature}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 p-8 md:p-12">
            {/* Progress Steps for Registration */}
            {isRegistering && (
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
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
              {isRegistering
                ? "Create Your Account"
                : "Sign In to Your Account"}
            </h2>
            <p className="text-gray-600 mb-8 text-center md:text-left">
              {isRegistering
                ? "Fill in your details to get started"
                : "Enter your credentials to continue"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering ? (
                <>
                  {/* Step 1: Personal Information */}
                  {activeStep === 0 && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl  focus:outline-none transition-all duration-300"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">
                              Prefer not to say
                            </option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Picture
                          </label>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                              {formData.profilePicture ? (
                                <span className="text-green-500">✅</span>
                              ) : (
                                <span className="text-gray-400">👤</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="file"
                                name="profilePicture"
                                accept="image/*"
                                onChange={handleChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Account Details */}
                  {activeStep === 1 && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                            placeholder="your@email.com"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                            placeholder="Create a strong password"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password *
                          </label>
                          <input
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address Information */}
                  {activeStep === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {["street", "city", "state", "zip", "country"].map(
                          (field, i) => (
                            <div
                              key={i}
                              className={
                                field === "street" || field === "country"
                                  ? "md:col-span-2"
                                  : ""
                              }
                            >
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                                {field === "street" || field === "country"
                                  ? "*"
                                  : ""}
                              </label>
                              <input
                                type="text"
                                name={`address.${field}`}
                                value={formData.address[field]}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                                placeholder={`Enter your ${field}`}
                                required={
                                  field === "street" || field === "country"
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons for Multi-step Form */}
                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={activeStep === 0}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
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
                        className={`px-8 py-3 rounded-xl font-semibold transform transition-all duration-300 shadow-md ${
                          isLoading
                            ? "bg-pink-300 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600 hover:scale-105 text-white"
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating Account...
                          </div>
                        ) : (
                          "Create Account 🎉"
                        )}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Login Form */
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-pink-500 focus:outline-none"
                      />
                      <span className="ml-2 text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-semibold text-white transform transition-all duration-300 shadow-md ${
                      isLoading
                        ? "bg-pink-300 cursor-not-allowed"
                        : "bg-pink-500 hover:bg-pink-600 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      "Sign In →"
                    )}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-300"
                >
                  {isRegistering ? "Sign in here" : "Create one now"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModal
        show={showForgotModal}
        email={forgotEmail}
        onEmailChange={setForgotEmail}
        onSubmit={handleForgotPassword}
        onClose={() => setShowForgotModal(false)}
      />
      <ResetPasswordModal
        show={showResetModal}
        token={resetToken}
        newPassword={newPassword}
        newPasswordConfirm={newPasswordConfirm}
        onTokenChange={setResetToken}
        onPasswordChange={setNewPassword}
        onPasswordConfirmChange={setNewPasswordConfirm}
        onSubmit={handleResetPassword}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
}
