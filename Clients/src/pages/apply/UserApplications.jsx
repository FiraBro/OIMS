import { useEffect, useState } from "react";
import { getUserApplications } from "../../services/api";

export default function UserApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getUserApplications().then((res) => {
      setApplications(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Applications</h2>
      {applications.map((app) => (
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
        </div>
      ))}
    </div>
  );
}
