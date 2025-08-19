import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContextProvider";
import type { JSX } from "react";

const PrivateRoute = ({
  children,
  adminOnly = false,
}: {
  children: JSX.Element;
  adminOnly?: boolean;
}) => {
  const { isAuthenticated, user } = useAuth();
  const role = user?.role; // ✅ fix here
  console.log("is authi=neticated1",isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (adminOnly && role !== "Admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
export default PrivateRoute