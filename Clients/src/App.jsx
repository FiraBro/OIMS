import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import PlanPage from "./pages/plan/PlanPage";
import Layout from "./utils/Layout";
import PolicyApplicationForm from "./pages/apply/PolicyApplicationForm";
import UserApplications from "./pages/apply/UserApplications";
import AuthPage from "./pages/auth/AuthPage"; // ✅ New

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "plans",
        element: <PlanPage />,
      },
      {
        path: "apply",
        element: <PolicyApplicationForm />,
      },
      {
        path: "user-stats",
        element: <UserApplications />,
      },
    ],
  },
  {
    path: "/auth", // ✅ Auth route outside Layout
    element: <AuthPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
