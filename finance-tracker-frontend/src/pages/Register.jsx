import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await registerUser({ username, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <p className="eyebrow">Finance Tracker</p>
        <h1>Create account</h1>
        <p className="auth-copy">Register once, then the app uses your stored credentials for API access.</p>
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
            placeholder="Choose password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="button" className="primary-button" onClick={handleRegister} disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
        <button type="button" className="link-button" onClick={() => navigate('/login')}>
          Back to login
        </button>
      </div>
    </div>
  );
};

export default Register;
