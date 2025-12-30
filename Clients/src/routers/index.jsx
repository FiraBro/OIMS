import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

/* Layouts (same folder) */
import UserLayout from "@/layout/UserLayout";
import AdminLayout from "@/layout/AdminLayout";

/* Guards */
import ProtectedRoute from "@/components/Auth/ProtectRoutes";

/* Public Pages */
const HomePage = lazy(() => import("@/pages/home/HomePage"));
const PlansPage = lazy(() => import("@/pages/plan/PlanPages"));
const PlanDetail = lazy(() => import("@/pages/plan/PlanDetail"));
const SupportPage = lazy(() => import("@/pages/support/SupportPage"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));

/* User Protected Pages */
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const ApplyPlan = lazy(() => import("@/pages/plan/ApplyPlan"));
const UserApplications = lazy(() => import("@/pages/apply/UserApplications"));
const ClaimSubmissionForm = lazy(() =>
  import("@/pages/apply/ClaimsManagement")
);
const MyClaims = lazy(() => import("@/components/claim/MyClaims"));
const MyPolicies = lazy(() => import("@/pages/policies/MyPolicy"));

/* Admin Pages */
const AdminDashboard = lazy(() => import("@/pages/metrics/AdminDashboard"));
const AdminPlansList = lazy(() => import("@/pages/plan/AdminPlanList"));
const AdminPolicyApplications = lazy(() =>
  import("@/pages/policies/AdminPolicyApplications")
);
const ViewPolicyApplication = lazy(() =>
  import("@/pages/policies/ViewPolicyApplication")
);
const AdminUsersPage = lazy(() => import("@/pages/auth/AdminUserPages"));
const AdminClaimsManagement = lazy(() =>
  import("@/pages/claims/ClaimsManagement")
);

const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "plans", element: <PlansPage /> },
      { path: "plans/:id", element: <PlanDetail /> },
      { path: "support", element: <SupportPage /> },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "apply/:id",
        element: (
          <ProtectedRoute>
            <ApplyPlan />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-applications",
        element: (
          <ProtectedRoute>
            <UserApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "claims/new",
        element: (
          <ProtectedRoute>
            <ClaimSubmissionForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "show/claims",
        element: (
          <ProtectedRoute>
            <MyClaims />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-policies",
        element: (
          <ProtectedRoute>
            <MyPolicies />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },

  /* ---------------- Admin (protected ONCE) ---------------- */
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "plans", element: <AdminPlansList /> },
      { path: "applications", element: <AdminPolicyApplications /> },
      { path: "policies/details", element: <ViewPolicyApplication /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "all-claims", element: <AdminClaimsManagement /> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);
