import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviders, createRequest, getSession, clearSession, getInitials } from '../../api';
import './dashboard.css';

function Consumerdashboard() {
  const navigate = useNavigate();
  const user = getSession();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null); // provider whose modal is open
  const [platform, setPlatform] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState('');

  // Guard: only logged-in consumers can see this page
  useEffect(() => {
    if (!user || user.userType !== 'consumer') navigate('/');
    // eslint-disable-next-line
  }, []);

  // Load providers from the database
  useEffect(() => {
    getProviders()
      .then(setProviders)
      .catch(() => setError('Could not load providers. Is json-server running?'))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const openModal = (provider) => {
    setSelectedProvider(provider);
    setPlatform('');
    setFromDate('');
    setToDate('');
    setFormError('');
  };
  const closeModal = () => setSelectedProvider(null);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const isValid = platform && fromDate && toDate;

  const handleSubmit = async () => {
    if (new Date(toDate) <= new Date(fromDate)) {
      setFormError('"To" must be later than "From".');
      return;
    }
    try {
      await createRequest({
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        consumerId: user.id,
        consumerName: user.name,
        consumerEmail: user.email,
        platform,
        fromDate,
        toDate,
        requestedDate: new Date().toLocaleDateString('en-US'),
        status: 'Pending',
      });
      closeModal();
      setToast('Request sent to ' + selectedProvider.name);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setFormError('Could not submit the request. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="container">

        {/* NAVBAR */}
        <div className="navbar">
          <div className="brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>
            <div>Platform<span>Connect</span></div>
          </div>

          <div className="nav-user">
            <div className="user-text">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
            <div className="avatar-sm">{getInitials(user.name)}</div>
            <div className="nav-divider"></div>
            <button className="logout" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
              Logout
            </button>
          </div>
        </div>

        {/* HEADING */}
        <div className="page-head">
          <div>
            <h1>Available Providers</h1>
            <p>Browse and request services from registered platform providers.</p>
          </div>
          <div className="count-badge">
            {providers.length} {providers.length === 1 ? 'Provider' : 'Providers'} Found
          </div>
        </div>

        {loading && <div className="empty-state">Loading providers...</div>}
        {error && <div className="empty-state">{error}</div>}
        {!loading && !error && providers.length === 0 && (
          <div className="empty-state">No providers have registered yet.</div>
        )}

        {/* PROVIDER CARDS */}
        <div className="provider-grid">
          {providers.map((p) => (
            <div className="provider-card" key={p.id}>
              <div className="provider-head">
                <div className="avatar-lg">{getInitials(p.name)}</div>
                <h3>{p.name}</h3>
              </div>

              <div className="contact-box">
                <div className="contact-row">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  {p.email}
                </div>
                <div className="contact-row">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  {p.phone}
                </div>
                <div className="contact-row">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  {p.address}
                </div>
              </div>

              <div className="platforms-label">Supported Platforms</div>
              <div className="tag-row">
                {(p.platforms || []).map((pl) => (
                  <span className="tag" key={pl}>{pl}</span>
                ))}
              </div>

              <button className="request-btn" onClick={() => openModal(p)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                Create Request
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE REQUEST MODAL */}
      <div className={'modal-overlay' + (selectedProvider ? ' open' : '')}>
        {selectedProvider && (
          <div className="modal">
            <div className="modal-body">
              <button className="modal-close" onClick={closeModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
              <h2>Create Request</h2>
              <p className="modal-desc">
                Select a platform and time to request access from <strong>{selectedProvider.name}</strong>.
              </p>

              <div className="modal-label">Available Platforms <span style={{ color: '#ef4444' }}>*</span></div>
              <div className="platform-options">
                {(selectedProvider.platforms || []).map((pl) => (
                  <label className="platform-option" key={pl}>
                    <input
                      type="radio"
                      name="platform"
                      checked={platform === pl}
                      onChange={() => setPlatform(pl)}
                    />
                    <span>{pl}</span>
                  </label>
                ))}
              </div>

              <div className="modal-section">
                <div className="modal-label">Time Duration <span style={{ color: '#ef4444' }}>*</span></div>
                <div className="duration">
                  <div>
                    <label>From</label>
                    <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  </div>
                  <div>
                    <label>To</label>
                    <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {formError && <div className="error-msg">{formError}</div>}
            </div>

            <div className="modal-footer">
              <button className="submit-btn" disabled={!isValid} onClick={handleSubmit}>
                Submit Request
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Consumerdashboard;
