import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../Services/authService';

const ProtectedRoute = ({ children, acceptedRoles }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const token = localStorage.getItem('token');
  const location = useLocation();

  const checkTokenAndRefresh = async () => {
    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = Date.now() >= decodedToken.exp * 1000;


      if (isTokenExpired) {
        setIsRefreshing(true);
        await authService.refreshToken();
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('email');
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }
  };

  useEffect(() => {
    if (token) {
      checkTokenAndRefresh();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isRefreshing) {
    return <div>Обновление токена...</div>;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    const userId = decodedToken.userId;

    if(userRole){
      localStorage.setItem('userRole', userRole);
    }

    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      console.error("userId is missing from the token.");
    }
    

    if (acceptedRoles && !acceptedRoles.includes(userRole)) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  } catch (error) {
    console.error("Error decoding the token:", error);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
