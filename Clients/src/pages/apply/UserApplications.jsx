import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { policyService } from "../../services/policyService";

/**
 * Displays a user's insurance applications with relevant details and actions
 * @returns {JSX.Element} UserApplications component
 */
export default function UserApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await policyService.getUserApplications();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
    default: "bg-blue-100 text-blue-800",
  };

  const getStatusColor = (status) => {
    const lowerStatus = status.toLowerCase();
    return statusColors[lowerStatus] || statusColors.default;
  };

  const renderApplicationCard = (app) => (
    <div
      key={app._id}
      className="border border-gray-200 rounded-lg p-6 mb-4 shadow-sm bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-semibold text-indigo-600">Plan</h3>
          <p className="text-gray-800 font-medium">
            {app.planId?.name || "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-indigo-600">Status</h3>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              app.status
            )}`}
          >
            {app.status.toLowerCase()}
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-indigo-600">Policy Number</h3>
          <p className="text-gray-800 font-mono font-medium">
            {app.policyNumber || "Not assigned"}
          </p>
        </div>
      </div>
      {app.policyNumber && (
        <div className="mt-6 text-right">
          <Link
            to={`/claim?policyNumber=${app.policyNumber}`}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            File Claim
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          My Applications
        </h2>
        <p className="text-gray-600 mt-2">
          View and manage your insurance applications
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-rose-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-indigo-700">
                You don't have any applications yet.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map(renderApplicationCard)}
        </div>
      )}
    </div>
  );
}
