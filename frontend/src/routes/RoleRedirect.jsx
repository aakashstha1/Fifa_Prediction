import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";

function RoleRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
  );
}

export default RoleRedirect;
