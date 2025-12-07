import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from "./pages/home/HomePage";
import PlanPage from "./pages/plan/PlanPage";
import PlanDetail from "./pages/plan/PlanDetail"; // ✅ Import detail page
import Layout from "./utils/Layout";
import PolicyApplicationForm from "./pages/apply/PolicyApplicationForm";
import UserApplications from "./pages/apply/UserApplications";
import AuthPage from "./pages/auth/AuthPage";
import ClaimSubmissionForm from "./pages/apply/ClaimSubmissionForm";
import MyClaims from "./components/claim/MyClaims";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the animated Navbar and PageTransition
import { PageTransition } from "./components/navigation/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <HomePage />
          </PageTransition>
        ),
      },
      {
        path: "plans",
        element: (
          <PageTransition>
            <PlanPage />
          </PageTransition>
        ),
      },
      {
        path: "plans/:id",
        element: (
          <PageTransition>
            <PlanDetail />
          </PageTransition>
        ),
      },

      {
        path: "apply",
        element: (
          <PageTransition>
            <PolicyApplicationForm />
          </PageTransition>
        ),
      },
      {
        path: "user-stats",
        element: (
          <PageTransition>
            <UserApplications />
          </PageTransition>
        ),
      },
      {
        path: "claim",
        element: (
          <PageTransition>
            <ClaimSubmissionForm />
          </PageTransition>
        ),
      },
      {
        path: "show/claims",
        element: (
          <PageTransition>
            <MyClaims />
          </PageTransition>
        ),
      },
    ],
  },

  // ⭐ Authentication page
  {
    path: "/auth",
    element: (
      <PageTransition>
        <AuthPage />
      </PageTransition>
    ),
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
