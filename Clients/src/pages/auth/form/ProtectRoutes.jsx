import { useAuthStore } from "@/stores/authStore"; // correct named import
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authReady } = useAuthStore();

  if (!authReady) return null;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
