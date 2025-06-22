import { useEffect, useState } from "react";
import { policyService } from "../../services/policyService";
import axios from "axios";

export default function PolicyApplicationForm() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/plans")
      .then((res) => setPlans(res.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan || documents.length === 0) {
      setMessage("Please select a plan and upload documents.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("plan", selectedPlan);

      Array.from(documents).forEach((file) => {
        formData.append("documents", file);
      });

      const res = await policyService.applyForPolicy(formData);
      setMessage("✅ Application submitted successfully!");
      console.log("Response:", res);
    } catch (err) {
      console.error("Error:", err.message || err);
      setMessage(`❌ Error: ${err.message || err}`);
    }
  };

  return (
    <div className="max-w-md p-6 bg-white shadow rounded mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Apply for Policy</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a Plan</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          onChange={(e) => setDocuments(e.target.files)}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
