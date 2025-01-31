import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../lib/firebase';

const PrivateRoute = ({ children }) => {
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;