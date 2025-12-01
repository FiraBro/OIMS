export default function StepAddress({ formData, handleChange }) {
  const addressFields = ["street", "city", "state", "zip", "country"];

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {addressFields.map((field, i) => (
          <div
            key={i}
            className={
              field === "street" || field === "country" ? "md:col-span-2" : ""
            }
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {(field === "street" || field === "country") && " *"}
            </label>
            <input
              type="text"
              name={`address.${field}`}
              value={formData.address[field]}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300"
              placeholder={`Enter your ${field}`}
              required={field === "street" || field === "country"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
