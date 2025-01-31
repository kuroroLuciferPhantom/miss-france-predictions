import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, PrivateRoute } from './contexts/AuthContext';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';
import CreateGroupPage from './pages/groups/CreateGroupPage';
import JoinGroupPage from './pages/groups/JoinGroupPage';
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/onboarding" element={
          <PrivateRoute>
            <OnboardingPage />
          </PrivateRoute>
        } />
        <Route path="/group/create" element={
          <PrivateRoute>
            <CreateGroupPage />
          </PrivateRoute>
        } />
        <Route path="/group/join" element={
          <PrivateRoute>
            <JoinGroupPage />
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