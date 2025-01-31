import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard';
import JoinGroup from './components/JoinGroup';

const PrivateRoute = ({ children }) => {
  const auth = getAuth();
  return auth.currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/join-group"
          element={
            <PrivateRoute>
              <JoinGroup />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;