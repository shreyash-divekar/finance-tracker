import React from 'react';
import { Navigate } from 'react-router-dom';
import { clearAuth, getSession, isAuthenticated, storeAuth } from '../api';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = React.useState(isAuthenticated() ? 'checking' : 'guest');

  React.useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated()) {
      setStatus('guest');
      return undefined;
    }

    getSession()
      .then((session) => {
        if (cancelled) {
          return;
        }

        storeAuth(session.username);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        clearAuth();
        setStatus('guest');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') {
    return <div className="auth-page"><div className="auth-panel"><p className="auth-copy">Checking session...</p></div></div>;
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
