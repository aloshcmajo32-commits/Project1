import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import './Register.css';

const PLATFORMS = [
  { label: 'Amazon Prime', value: 'Amazon Prime' },
  { label: 'Netflix', value: 'Netflix' },
  { label: 'Hulu', value: 'Hulu' },
  { label: 'Disney+', value: 'Disney Plus' },
];

function Registration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', address: '', phone: '', password: '', dob: '', userType: '',
  });
  const [platforms, setPlatforms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const togglePlatform = (value) =>
    setPlatforms((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.userType) {
      setError('Name, email, password and user type are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.userType === 'provider' && platforms.length === 0) {
      setError('Providers must select at least one platform.');
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address,
        phone: form.phone,
        password: form.password,
        dob: form.dob,
        userType: form.userType,
        platforms: form.userType === 'provider' ? platforms : [],
      });
      navigate('/', { state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Create an Account</h1>
        <p className="register-subtitle">Enter your information to register as a consumer or provider.</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="register-grid">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group full">
            <label>Address</label>
            <input type="text" name="address" placeholder="123 Main St, City, Country" value={form.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="********" value={form.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Date of birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>User Type</label>
            <select name="userType" value={form.userType} onChange={handleChange}>
              <option value="" disabled>Select a user type</option>
              <option value="consumer">Consumer</option>
              <option value="provider">Provider</option>
            </select>
          </div>
        </div>

        <div className="platforms-box">
          <h3>Provider Platforms</h3>
          <p>Select the platforms you provide services for.</p>
          <div className="platform-grid">
            {PLATFORMS.map((p) => (
              <label className="platform-item" key={p.value}>
                <input
                  type="checkbox"
                  checked={platforms.includes(p.value)}
                  onChange={() => togglePlatform(p.value)}
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

export default Registration;
