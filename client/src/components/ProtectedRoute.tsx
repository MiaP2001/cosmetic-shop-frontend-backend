import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
  requiredRole?: string;
};

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
