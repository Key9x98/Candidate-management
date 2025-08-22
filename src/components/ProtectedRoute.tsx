// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a global loading spinner here if you want
    return (
        <div className="flex justify-center items-center h-screen">
            <div>Loading...</div>
        </div>
    );
  }

  // If the user is authenticated, render the child routes (e.g., Dashboard).
  // The <Outlet /> component is a placeholder for the nested route components.
  if (user) {
    return <Outlet />;
  }
  
  // If not authenticated, redirect them to the login page.
  // The `replace` prop prevents the user from going back to the protected page via the browser's back button.
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;