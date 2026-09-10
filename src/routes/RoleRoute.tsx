import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "../types/user";
import { useAppSelector } from "../hooks/redux";

interface Props {
  allowedRoles: UserRole[];
}

const RoleRoute = ({ allowedRoles }: Props) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
