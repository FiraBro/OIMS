import { useEffect, useState } from "react";
import axios from "axios";

export default function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/plans");
        setPlans(res.data.data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Loading insurance plans...
      </div>
    );
  }

  return (
    <section className="min-h-screen py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
          Explore Our Insurance Plans
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-1">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                <div className="mb-2">
                  <span className="font-medium text-gray-800">Coverage:</span>
                  <p className="text-gray-700 text-sm">
                    {plan.coverageDetails || "Not specified"}
                  </p>
                </div>

                <div className="mb-2">
                  <span className="font-medium text-gray-800">Duration:</span>
                  <p className="text-gray-700 text-sm">
                    {plan.durationMonths}{" "}
                    {plan.durationMonths > 1 ? "months" : "month"}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="font-medium text-gray-800">Premium:</span>
                  <p className="text-green-600 font-bold text-lg">
                    ${plan.premium}
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert(`Applied for plan: ${plan.name}`)} // Replace with actual apply logic or route
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
