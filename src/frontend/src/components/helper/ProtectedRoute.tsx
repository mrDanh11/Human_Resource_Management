import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    // Ensure role is uppercase for comparison
    const userRole = (decoded.role || '').toUpperCase();

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/forbidden" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;