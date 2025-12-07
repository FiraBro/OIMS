import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 text-center text-gray-600 text-sm">
      &copy; {new Date().getFullYear()} InsureWise. All rights reserved.
    </footer>
  );
};

export default Footer;
