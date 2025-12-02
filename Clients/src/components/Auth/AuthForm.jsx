import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import BrandSection from "./BrandSection";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ResetPasswordModal from "./ResetPasswordModal";

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
        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(result.message || "Invalid credentials. Please try again.");
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
      toast.success(
        "Account created successfully! Redirecting to dashboard..."
      );
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        <BrandSection />

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex mb-8 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveMode("login");
                resetForm();
              }}
              className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
                activeMode === "login"
                  ? "text-gray-900 border-b-2 border-gray-900"
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
              className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
                activeMode === "register"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create Account
            </button>
          </div>

          {activeMode === "login" ? (
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
          ) : (
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
          )}

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our security standards and compliance
              policies
            </p>
          </div>
        </div>
      </div>

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
