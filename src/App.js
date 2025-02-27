import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ScoreModalProvider } from './contexts/ScoreModalContext';
import PrivateRoute from './components/PrivateRoute'
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
import QuizMiss from './pages/dashboard/QuizMiss';
import AdminResultsPage from './pages/admin/AdminResultsPage';
import AdminScoresPage from './pages/admin/AdminScoresPage';
import AdminContactsPage from './pages/admin/AdminContactsPage';
import NotFoundPage from './pages/NotFoundPage';
import CheckEmailPage from './pages/auth/CheckEmailPage';
import CanonicalLink from './components/seo/CanonicalLink';

function App() {
  const location = useLocation();

  return (

    <AuthProvider>
      <Layout>
        <CanonicalLink path={location.pathname} />
        <ScoreModalProvider>
          <AnimatePresence mode="wait">
            <Routes future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              } />
              <Route path="/signup" element={
                <PageTransition>
                  <SignUpPage />
                </PageTransition>
              } />
              <Route path="/check-email" element={<CheckEmailPage />} />
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
                  <PageTransition>
                    <GroupDetailPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              <Route path="/predictions" element={
                <PrivateRoute>
                  <PageTransition>
                    <RankingPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              <Route path="/quiz-miss" element={
                <PrivateRoute>
                  <PageTransition>
                    <QuizMiss />
                  </PageTransition>
                </PrivateRoute>
              } />
              <Route path="/mentions-legales" element={<LegalPage />} />
              <Route path="/conditions-utilisation" element={<TermsPage />} />
              <Route path="/confidentialite" element={<PolitiqueConfidentialitePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/admin/results"
                element={
                  <PrivateRoute>
                    <AdminResultsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/scores"
                element={
                  <PrivateRoute>
                    <AdminScoresPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/contacts"
                element={
                  <PrivateRoute>
                    <PageTransition>
                      <AdminContactsPage />
                    </PageTransition>
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFoundPage />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </ScoreModalProvider>
      </Layout>
    </AuthProvider>
  );
}

export default App;