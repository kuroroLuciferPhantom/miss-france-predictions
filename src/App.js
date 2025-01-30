import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/group/:groupId" element={<GroupDetailPage />} />
    </Routes>
  );
}

export default App;