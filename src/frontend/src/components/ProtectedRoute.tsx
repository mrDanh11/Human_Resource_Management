import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');

  // LOG ĐỂ DEBUG
  console.log("ProtectedRoute Checking:", { 
    path: location.pathname, 
    hasToken: !!token, 
    role: userRole 
  });

  if (!token) {
    console.warn("No token found -> Redirecting to Login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole) {
       console.warn("Token exists but No Role found -> Redirecting");
       return <Navigate to="/login" replace />;
    }
    
    // So sánh role (Case-insensitive)
    const hasPermission = allowedRoles.some(
      (role) => role.toUpperCase() === userRole.toUpperCase()
    );

    if (!hasPermission) {
      console.warn(`Role mismatch (Required: ${allowedRoles}, Current: ${userRole}) -> Forbidden`);
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;