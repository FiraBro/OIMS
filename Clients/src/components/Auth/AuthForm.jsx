import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ResetPasswordModal from "./ResetPasswordModal";

import { AnimatePresence, motion } from "framer-motion";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeMode, setActiveMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

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
      address: { street: "", city: "", state: "", zip: "", country: "" },
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(result.message || "Invalid credentials.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your connection."
      );
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await registerRequest(formData);
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode} // key triggers the exit/enter animation when activeMode changes
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-10 border border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {activeMode === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {activeMode === "login"
                ? "Sign in to continue to your dashboard"
                : "Join us and manage your insurance easily"}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex mb-8 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => {
                setActiveMode("login");
                resetForm();
              }}
              className={`flex-1 py-2 text-center text-sm rounded-lg transition ${
                activeMode === "login"
                  ? "bg-white shadow font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveMode("register");
                resetForm();
              }}
              className={`flex-1 py-2 text-center text-sm rounded-lg transition ${
                activeMode === "register"
                  ? "bg-white shadow font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {activeMode === "login" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <LoginForm
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  onForgotPassword={() => setShowForgotModal(true)}
                  onSwitchToRegister={() => {
                    setActiveMode("register");
                    resetForm();
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <RegisterForm
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                  onSwitchToLogin={() => {
                    setActiveMode("login");
                    resetForm();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our terms, privacy, and security
              policy.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
}
