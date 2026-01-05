import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

/* Layouts (same folder) */
import UserLayout from "@/layout/UserLayout";
import AdminLayout from "@/layout/AdminLayout";

/* Guards */
import ProtectedRoute from "@/pages/auth/form/ProtectRoutes";
import CreatePlanPage from "@/pages/admin/plan/CreatePlan";
import Settings from "@/pages/admin/support/Setting";
import AdminPlanListPage from "@/pages/admin/plan/ListAllPlan";
import PolicyList from "@/pages/admin/policy/PolicyList";

/* Public Pages */
const HomePage = lazy(() => import("@/pages/users/home/HomePage"));
const PlansPage = lazy(() => import("@/pages/users/plans/PlanPages"));
const PlanDetail = lazy(() => import("@/pages/users/plans/PlanDetail"));
const SupportPage = lazy(() => import("@/pages/users/support/SupportPage"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));

/* User Protected Pages */
const ProfilePage = lazy(() => import("@/pages/users/profile/ProfilePage"));
const ApplyPlan = lazy(() => import("@/pages/users/plans/ApplyPlan"));
const UserApplications = lazy(() =>
  import("@/pages/users/applications/UserApplications")
);
const ClaimSubmissionForm = lazy(() =>
  import("@/pages/users/claim/ClaimsManagement")
);
const MyClaims = lazy(() => import("@/pages/users/claim/MyClaims"));
const MyPolicies = lazy(() => import("@/pages/users/policy/MyPolicy"));

/* Admin Pages */
const AdminDashboard = lazy(() =>
  import("@/pages/admin/dashboard/AdminDashboard")
);
const AdminPolicyApplications = lazy(() =>
  import("@/pages/admin/applications/AdminPolicyApplications")
);
const ViewPolicyApplication = lazy(() =>
  import("@/pages/admin/policy/ViewPolicyApplication")
);
const AdminUsersPage = lazy(() => import("@/pages/admin/users/AdminUserPages"));
const AdminClaimsManagement = lazy(() =>
  import("@/pages/admin/claim/ClaimsManagement")
);

const NotFoundPage = lazy(() => import("@/components/common/NotFoundPage"));

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
      <ProtectedRoute isAdminRequired={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "applications", element: <AdminPolicyApplications /> },
      { path: "all-policies", element: <PolicyList /> },
      { path: "policies/details", element: <ViewPolicyApplication /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "all-claims", element: <AdminClaimsManagement /> },
      { path: "create/plan", element: <CreatePlanPage /> },
      { path: "all-plans", element: <AdminPlanListPage /> },

      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);
