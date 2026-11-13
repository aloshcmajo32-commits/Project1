import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, saveSession } from '../../api';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const user = await loginUser(email, password);
      console.log(user)
      
      if (!user) {
        setError('Invalid email or password.');
        return;
      }
      saveSession(user);
      navigate(user.userType === 'provider' ? '/provider' : '/consumer');
    } catch (err) {
      setError('Cannot reach the database. Is json-server running on port 3001?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <form className="login-body" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Enter your credentials to access your account.</p>

          {location.state && location.state.registered && (
            <div className="success-msg">Account created. Please sign in.</div>
          )}
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
