import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/customer-validation"
        state={{ returnTo: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
