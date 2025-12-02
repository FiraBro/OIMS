import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountStep({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
          Full Name *
        </Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          placeholder="John Doe"
          className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="register-email"
          className="text-sm font-medium text-gray-700"
        >
          Email Address *
        </Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="name@company.com"
          className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password *
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Create a strong password"
          className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be at least 8 characters with uppercase, lowercase, and numbers
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="passwordConfirm"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password *
        </Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          onChange={onChange}
          placeholder="Confirm your password"
          className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          required
        />
      </div>
    </div>
  );
}
