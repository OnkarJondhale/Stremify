import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  if (!user || !user._id) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is not onboarded, redirect to onboarding (unless already there)
  if (!user.isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is onboarded but tries to access onboarding, redirect to home
  if (user.isOnboarded && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;