// app.jsx
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./layout/UserLayout";
import ProtectedRoute from "./components/Auth/ProtectRoutes";
import { PageTransition } from "./components/navigation/Navbar";
import MyPolicies from "./pages/policies/MyPolicy";
import AdminLayout from "./layout/AdminLayout";

import AdminDashboard from "./pages/metrics/AdminDashboard";
import AdminPlansList from "./pages/plan/AdminPlanList";
import AdminPolicyApplications from "./pages/policies/AdminPolicyApplications";
import ViewPolicyApplication from "./pages/policies/ViewPolicyAplications";
import AdminUsersPage from "./pages/auth/AdminUserPages";
import PolicyList from "./pages/policies/PolicyList";
import AdminClaimsManagement from "./pages/claims/ClaimsManagement";
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

// ADDED: Profile Page Lazy Import
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));

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
      // ADDED: Profile Route (Protected)
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <ProfilePage />
            </PageTransition>
          </ProtectedRoute>
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
        path: "plans",
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
        path: "my-policies",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <MyPolicies />
            </PageTransition>
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "applications",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminPolicyApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "policies/details",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <ViewPolicyApplication />
          </ProtectedRoute>
        ),
      },
      {
        path: "plans",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminPlansList />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-policies",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <PolicyList />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-claims",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminClaimsManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

/* ---------------- App Root ---------------- */
export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3} // Recommended for Senior devs: prevents toast spamming
      />
    </AuthProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-200 opacity-20"></div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The insurance portal you are looking for doesn't exist.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    </PageTransition>
  );
}
