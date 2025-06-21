import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition">
      <div className="text-blue-600 text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
