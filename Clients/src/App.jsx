import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // ✅ import provider

import HomePage from "./pages/home/HomePage";
import PlanPage from "./pages/plan/PlanPage";
import Layout from "./utils/Layout";
import PolicyApplicationForm from "./pages/apply/PolicyApplicationForm";
import UserApplications from "./pages/apply/UserApplications";
import AuthPage from "./pages/auth/AuthPage";
import ClaimSubmissionForm from "./pages/apply/ClaimSubmissionForm";
import MyClaims from "./components/claim/MyClaims";

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
      {" "}
      {/* 🔥 FIXED */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
