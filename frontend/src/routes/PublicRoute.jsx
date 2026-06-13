import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  // if logged in → redirect away from public pages
  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  return children;
}

export default PublicRoute;
