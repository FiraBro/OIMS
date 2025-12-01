import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm({
  formData,
  handleChange,
  toggleMode,
  isLoading,
  setIsLoading,
  onForgotPassword,
}) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
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
          onClick={onForgotPassword}
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
        {isLoading ? "Signing In..." : "Sign In →"}
      </button>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-600">
          Don't have an account?
          <button
            type="button"
            onClick={toggleMode}
            className="ml-2 text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-300"
          >
            Create one now
          </button>
        </p>
      </div>
    </form>
  );
}
