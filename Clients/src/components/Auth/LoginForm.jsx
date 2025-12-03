import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export default function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // new state

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form);
    setLoading(false);

    if (!res.success) toast.error(res.message);
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900 text-center">
        Welcome Back
      </h2>
      <p className="text-gray-600 text-center">
        Login to continue to your dashboard
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="
              w-full 
              px-4 py-3 
              rounded-xl 
              border border-gray-300 
              focus:ring-4
              focus:ring-blue-200 
              focus:border-blue-500
              transition-all
            "
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Password with Show/Hide */}
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="
              w-full 
              px-4 py-3 
              rounded-xl 
              border border-gray-300 
              focus:ring-4
              focus:ring-blue-200 
              focus:border-blue-500
              transition-all
            "
            placeholder="••••••••"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="text-center text-gray-600">
        Don’t have an account?{" "}
        <Button
          variant="link"
          size="sm"
          onClick={onSwitchToRegister}
          className="text-blue-500 cursor-pointer"
        >
          Register
        </Button>
      </p>
    </div>
  );
}
