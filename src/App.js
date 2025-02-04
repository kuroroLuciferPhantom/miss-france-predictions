import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, PrivateRoute } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import ContactPage from './pages/home/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';
import CreateGroupPage from './pages/groups/CreateGroupPage';
import JoinGroupPage from './pages/groups/JoinGroupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import RankingPage from './pages/RankingPage';
import LegalPage from './pages/legal/LegalPage';
import TermsPage from './pages/legal/TermsPage';
import PolitiqueConfidentialitePage from './pages/legal/PolitiqueConfidentialitePage';
import ProfilePage from './pages/profile/ProfilePage';
import PageTransition from './components/transitions/PageTransition';
import { AnimatePresence } from 'framer-motion';


function App() {
  return (
    <Layout>
      <AuthProvider>
        <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/onboarding" element={
            <PrivateRoute>
              <PageTransition>
                <OnboardingPage />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/group/create" element={
            <PrivateRoute>
              <PageTransition>
                <CreateGroupPage />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/group/join" element={
            <PrivateRoute>
              <PageTransition>
                <JoinGroupPage />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/group/:groupId" element={
            <PrivateRoute>
              <GroupDetailPage />
            </PrivateRoute>
          } />
          <Route path="/group/:groupId/prediction" element={
            <PrivateRoute>
              <PageTransition>
                <RankingPage />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/mentions-legales" element={<LegalPage />} />
          <Route path="/conditions-utilisation" element={<TermsPage />} />
          <Route path="/confidentialite" element={<PolitiqueConfidentialitePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        </AnimatePresence>
      </AuthProvider>
    </Layout>
  );
}

export default App;