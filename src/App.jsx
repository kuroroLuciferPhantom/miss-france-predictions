import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/auth/LoginPage';
import JoinGroup from './components/JoinGroup';
import OnboardPage from './pages/onboarding/OnboardPage';

const AuthenticatedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('AuthenticatedRoute: Initializing auth listener');
    return onAuthStateChanged(auth, (user) => {
      console.log('AuthenticatedRoute: Auth state changed:', user?.email);
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    console.log('AuthenticatedRoute: Loading...');
    return <div>Chargement...</div>;
  }

  if (!user) {
    console.log('AuthenticatedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('AuthenticatedRoute: Rendering protected content');
  return children;
};

function App() {
  console.log('App: Rendering');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage />} 
        />
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute>
              <Dashboard />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/onboard"
          element={
            <AuthenticatedRoute>
              <OnboardPage />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/join-group"
          element={
            <AuthenticatedRoute>
              <JoinGroup />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;