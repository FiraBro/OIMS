import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./utils/Layout";
import ProtectedRoute from "./components/Auth/ProtectRoutes";
import { PageTransition } from "./components/navigation/Navbar";
import MyPolicies from "./pages/policies/MyPolicies";

/* ---------------- Lazy Loaded Pages ---------------- */
const HomePage = lazy(() => import("./pages/home/HomePage"));
const PlanDetail = lazy(() => import("./pages/plan/PlanDetail"));
const ApplyPlan = lazy(() => import("./pages/plan/ApplyPlan"));
const PlansPage = lazy(() => import("./pages/plan/PlanPages"));
const UserApplications = lazy(() => import("./pages/apply/UserApplications"));
const ClaimSubmissionForm = lazy(() =>
  import("./pages/apply/ClaimsManagement")
);
const MyClaims = lazy(() => import("./components/claim/MyClaims"));
const SupportPage = lazy(() => import("./pages/support/SupportPage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

/* ---------------- 404 Page ---------------- */
const NotFoundPage = () => (
  <PageTransition>
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    </div>
  </PageTransition>
);

/* ---------------- Router ---------------- */
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
        path: "plans/:id",
        element: (
          <PageTransition>
            <PlanDetail />
          </PageTransition>
        ),
      },
      {
        path: "apply/:id",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <ApplyPlan />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "my-applications",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <UserApplications />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "claims/new",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <ClaimSubmissionForm />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "show/claims",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <MyClaims />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "apply/plans",
        element: (
          <PageTransition>
            <PlansPage />
          </PageTransition>
        ),
      },
      {
        path: "support",
        element: (
          <PageTransition>
            <SupportPage />
          </PageTransition>
        ),
      },
      {
        path: "policy",
        element: (
          <PageTransition>
            <MyPolicies />
          </PageTransition>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/auth",
    element: (
      <PageTransition>
        <AuthPage />
      </PageTransition>
    ),
  },
]);

/* ---------------- App Root ---------------- */
export default function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>

      {/* Global Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </AuthProvider>
  );
}
