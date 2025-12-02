export default function StepIndicator({ steps, activeStep }) {
  return (
    <div className="flex justify-between mb-8 relative">
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center flex-1 relative">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-all duration-300 ${
              i <= activeStep
                ? "bg-gray-900 text-white border-2 border-gray-900"
                : "bg-white text-gray-400 border-2 border-gray-200"
            }`}
          >
            {i < activeStep ? "✓" : i + 1}
          </div>
          <span
            className={`text-xs font-medium tracking-wide ${
              i <= activeStep ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
