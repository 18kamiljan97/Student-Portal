import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("studentPortalToken");

  if (!token) {
    // If there's no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children; // If authenticated, render the children (protected page)
};

export default PrivateRoute;
