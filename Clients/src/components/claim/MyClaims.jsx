import React, { useEffect, useState } from "react";
import { claimService } from "../../services/claimService";

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const claimsData = await claimService.getUserClaims();
        setClaims(claimsData);
      } catch (error) {
        console.error("Error fetching claims:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading claims...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">My Claims</h2>
      {claims.length === 0 ? (
        <p>No claims found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Reason</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim._id} className="border-t">
                  <td className="p-3">₹{claim.claimAmount || 0}</td>
                  <td
                    className={`p-3 font-medium ${getStatusColor(
                      claim.status
                    )}`}
                  >
                    {claim.status}
                  </td>
                  <td className="p-3">{claim.reason}</td>
                  <td className="p-3">
                    {new Date(claim.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "text-green-600";
    case "Rejected":
      return "text-red-600";
    default:
      return "text-yellow-600";
  }
};

export default MyClaims;
