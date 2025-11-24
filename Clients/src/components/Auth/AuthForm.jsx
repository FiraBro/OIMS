import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { register as registerRequest } from "../../services/authService";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login: ctxLogin } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
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
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: type === "file" ? files[0] : value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);

    try {
      if (isRegistering) {
        await registerUser();
      } else {
        await loginUser();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async () => {
    await registerRequest(formData); // send JSON instead of FormData

    setMessage({ text: "✅ Registration successful!", type: "success" });
    setTimeout(() => {
      setIsRegistering(false);
      setFormData((prev) => ({ ...prev, password: "", passwordConfirm: "" }));
    }, 1500);
  };

  const loginUser = async () => {
    try {
      setIsLoading(true);
      await ctxLogin({
        email: formData.email,
        password: formData.password,
      });

      setMessage({
        text: "✅ Login successful! Redirecting...",
        type: "success",
      });

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setIsLoading(false);
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
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    });
    setMessage({ text: "", type: "" });
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isRegistering ? "Create Account" : "Welcome Back"}
      </h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering ? (
          // Registration Form - All Fields
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Personal Information
              </h3>
            </div>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password *"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Profile Picture */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Address Information */}
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Address Information
              </h3>
            </div>

            <input
              type="text"
              name="address.street"
              placeholder="Street Address"
              value={formData.address.street}
              onChange={handleChange}
              className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              name="address.city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              name="address.state"
              placeholder="State/Province"
              value={formData.address.state}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              name="address.zip"
              placeholder="ZIP/Postal Code"
              value={formData.address.zip}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              name="address.country"
              placeholder="Country"
              value={formData.address.country}
              onChange={handleChange}
              className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ) : (
          // Login Form - Only Email & Password
          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : isRegistering ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}
          <button
            type="button"
            onClick={toggleMode}
            className="ml-1 text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            {isRegistering ? "Sign in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}
