import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { policyService } from "../../services/policyService";

export default function UserApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    policyService
      .getUserApplications()
      .then((data) => {
        setApplications(data);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            className="border rounded p-4 mb-3 shadow-sm bg-white"
          >
            <p>
              <strong>Plan:</strong> {app.planId?.name}
            </p>
            <p>
              <strong>Status:</strong> {app.status}
            </p>
            <p>
              <strong>Policy #:</strong> {app.policyNumber}
            </p>
            <Link
              to={`/claim?policyNumber=${app.policyNumber}`}
              className="text-blue-600 hover:underline"
            >
              Claim
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
