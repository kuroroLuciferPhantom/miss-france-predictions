import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, PrivateRoute } from './contexts/AuthContext';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/onboarding" element={
          <PrivateRoute>
            <OnboardingPage />
          </PrivateRoute>
        } />
        <Route path="/group/:groupId" element={
          <PrivateRoute>
            <GroupDetailPage />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;