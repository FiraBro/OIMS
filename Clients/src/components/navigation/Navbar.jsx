import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleGetStarted = () => {
    if (token) {
      navigate("/apply");
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect after logout
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        InsureWise
      </Link>
      <div className="space-x-4">
        <Link to="/#features" className="text-gray-600 hover:text-blue-600">
          Features
        </Link>
        <Link to="/user-stats" className="text-gray-600 hover:text-blue-600">
          My-Application
        </Link>

        {/* Show Logout if logged in, otherwise Login */}
        {token ? (
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-blue-600 cursor-pointer bg-transparent border-none"
          >
            Logout
          </button>
        ) : (
          <Link to="/auth" className="text-gray-600 hover:text-blue-600">
            Login
          </Link>
        )}

        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
