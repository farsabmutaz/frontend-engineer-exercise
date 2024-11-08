// PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If the user is authenticated, redirect to the home page
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the child routes
  return <Outlet />;
};

export default PublicRoute;
