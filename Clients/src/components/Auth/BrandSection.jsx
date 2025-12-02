export default function BrandSection() {
  return (
    <div className="hidden md:flex flex-col justify-center p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            SecureAuth Pro
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Enterprise-Grade Authentication
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Join thousands of companies that trust our platform for secure,
          scalable authentication and identity management.
        </p>
      </div>

      <div className="space-y-6">
        <FeatureItem
          icon={
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          title="Lightning Fast"
          description="Sub-second authentication with global edge locations"
          color="blue"
        />

        <FeatureItem
          icon={
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
          title="Bank-Level Security"
          description="SOC 2 Type II certified with end-to-end encryption"
          color="green"
        />

        <FeatureItem
          icon={
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
          title="Easy Integration"
          description="Seamless integration with your existing infrastructure"
          color="purple"
        />
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Trusted by industry leaders</p>
            <div className="flex items-center space-x-6 mt-2">
              <span className="text-gray-400 font-semibold">ACME</span>
              <span className="text-gray-400 font-semibold">TechCorp</span>
              <span className="text-gray-400 font-semibold">GlobalBank</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} SecureAuth Pro
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description, color }) {
  const bgColor = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
  }[color];

  return (
    <div className="flex items-start space-x-4">
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
