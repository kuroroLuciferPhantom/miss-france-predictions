import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import routes from './routes';

const RequireAuth = ({ children }) => {
  const auth = getAuth();
  const location = useLocation();

  if (!auth.currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.protected ? (
                <RequireAuth>
                  {route.element}
                </RequireAuth>
              ) : (
                route.element
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;