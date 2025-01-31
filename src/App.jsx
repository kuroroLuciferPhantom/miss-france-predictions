import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './lib/firebase';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/auth/LoginPage';
import JoinGroup from './components/JoinGroup';
import OnboardPage from './pages/onboarding/OnboardPage';
import SignUpPage from './pages/auth/SignUpPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route 
          path="/dashboard" 
          element={
            auth.currentUser ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route 
          path="/onboard" 
          element={
            auth.currentUser ? <OnboardPage /> : <Navigate to="/login" />
          }
        />
        <Route 
          path="/join-group" 
          element={
            auth.currentUser ? <JoinGroup /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;