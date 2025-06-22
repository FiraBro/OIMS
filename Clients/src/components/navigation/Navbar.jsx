import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        InsureWise
      </Link>
      <div className="space-x-4">
        <Link to="/#features" className="text-gray-600 hover:text-blue-600">
          Features
        </Link>
        <Link to="/auth" className="text-gray-600 hover:text-blue-600">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
