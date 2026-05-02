import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, isAuthenticated, loginUser, storeAuth } from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    getSession()
      .then((session) => {
        storeAuth(session.username);
        navigate('/');
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await loginUser({ username, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <p className="eyebrow">Finance Tracker</p>
        <h1>Log in</h1>
        <p className="auth-copy">Use your account to reach the dashboard and live data views.</p>
        {error ? <p className="error-text">{error}</p> : null}
        <label className="field-label">
          Username
          <input
            type="text"
            placeholder="jane"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="field-label">
          Password
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="button" className="primary-button" onClick={handleLogin} disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <button type="button" className="link-button" onClick={() => navigate('/register')}>
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;
