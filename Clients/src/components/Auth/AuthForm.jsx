import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthForm() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();

  const [activeMode, setActiveMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

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

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login({
      email: formData.email,
      password: formData.password,
    });
    console.log("LOGIN RESULT:", result);
    setIsLoading(false);

    if (result.status === "success") {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error(result?.message || "Invalid credentials");
    }
  };

  // ================= REGISTER =================
  const handleRegister = async () => {
    setIsLoading(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.password,

      phone: formData.phone, // ✅ REQUIRED
      dateOfBirth: formData.dateOfBirth, // ✅ REQUIRED
    };

    console.log("REGISTER PAYLOAD:", payload);

    const result = await register(payload);

    setIsLoading(false);

    if (result?.id) {
      toast.success("Account created! Please verify your email.");
      navigate("/login");
    } else {
      toast.error(result?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-10"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">
              {activeMode === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>
          </div>

          {/* Switch */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => {
                setActiveMode("login");
                resetForm();
              }}
              className={`flex-1 py-2 rounded-lg ${
                activeMode === "login" ? "bg-white shadow" : ""
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveMode("register");
                resetForm();
              }}
              className={`flex-1 py-2 rounded-lg ${
                activeMode === "register" ? "bg-white shadow" : ""
              }`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeMode === "login" ? (
              <LoginForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleLogin}
                isLoading={isLoading}
              />
            ) : (
              <RegisterForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleRegister}
                isLoading={isLoading}
                onSwitchToLogin={() => setActiveMode("login")}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
