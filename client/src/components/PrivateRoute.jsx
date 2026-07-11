import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }


  return children;
};

export default PrivateRoute;
// this is a private route component that checks if the user is authenticated before rendering the children components. If the user is not authenticated, it redirects them to the "/auth" route and passes the current location in the state so that they can be redirected back after successful authentication.