import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth  from "../hooks/useAuth";

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const user = useAuth();
  const location = useLocation();

  if (user === null) {
    return <div>Loading...</div>;
  }

  const isAdmin = user.roles.includes("Admin");

  if (!isAdmin) {
    return <Navigate to="/not-found" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
