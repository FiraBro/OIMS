import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from "./pages/home/HomePage";
import PlanPage from "./pages/plan/PlanPage";
import Layout from "./utils/Layout";
import PolicyApplicationForm from "./pages/apply/PolicyApplicationForm";
import UserApplications from "./pages/apply/UserApplications";
import AuthPage from "./pages/auth/AuthPage";
import ClaimSubmissionForm from "./pages/apply/ClaimSubmissionForm";
import MyClaims from "./components/claim/MyClaims";

import { ToastContainer } from "react-toastify"; // ✅ FIXED IMPORT
import "react-toastify/dist/ReactToastify.css"; // styles

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "plans", element: <PlanPage /> },
      { path: "apply", element: <PolicyApplicationForm /> },
      { path: "user-stats", element: <UserApplications /> },
      { path: "claim", element: <ClaimSubmissionForm /> },
      { path: "show/claims", element: <MyClaims /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />

      {/* 🔥 Toast System - Works Globally */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}
