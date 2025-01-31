import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/auth/LoginPage';
import JoinGroup from './components/JoinGroup';

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    protected: true
  },
  {
    path: '/join-group',
    element: <JoinGroup />,
    protected: true
  }
];

export default routes;