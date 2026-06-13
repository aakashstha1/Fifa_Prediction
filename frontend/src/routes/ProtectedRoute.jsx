import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";

function ProtectedRoute({ children, roles = [] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader/>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  return children;
}

export default ProtectedRoute;
