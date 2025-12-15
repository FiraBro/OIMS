import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authReady } = useAuth();

  // 🔹 WAIT until auth is fully initialized
  if (!authReady) {
    return null; // or loading spinner
  }

  // 🔹 If not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
