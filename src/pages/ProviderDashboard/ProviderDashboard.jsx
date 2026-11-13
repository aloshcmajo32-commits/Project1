import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProviderRequests, updateRequestStatus, getSession, clearSession, getInitials, formatDateTime,
} from '../../api';
import './provider.css';

function ProviderDashboard() {
  const navigate = useNavigate();
  const user = getSession();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // request shown in the details modal

  // Guard: only logged-in providers can see this page
  useEffect(() => {
    if (!user || user.userType !== 'provider') navigate('/');
    // eslint-disable-next-line
  }, []);

  const loadRequests = () =>
    getProviderRequests(user.id)
      .then((data) => setRequests([...data].reverse())) // newest first
      .catch(() => setError('Could not load requests. Is json-server running?'))
      .finally(() => setLoading(false));

  useEffect(() => {
    if (user) loadRequests();
    // eslint-disable-next-line
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const handleDecision = async (status) => {
    try {
      await updateRequestStatus(selected.id, status);
      setSelected(null);
      loadRequests();
    } catch (err) {
      setError('Could not update the request.');
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

        <div className="provider-layout">

          {/* INCOMING REQUESTS */}
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2>Incoming Requests</h2>
                <p>Manage requests from consumers here.</p>
              </div>
              <div className="total-badge">{requests.length} Total</div>
            </div>

            {loading && <div className="empty-state">Loading requests...</div>}
            {error && <div className="empty-state">{error}</div>}
            {!loading && !error && requests.length === 0 && (
              <div className="empty-state">No requests yet.</div>
            )}

            {requests.map((r) => (
              <div className="request-row" key={r.id}>
                <div className="request-left">
                  <div className={'avatar-req ' + (r.id % 2 === 1 ? 'av-gray' : 'av-pink')}>
                    {getInitials(r.consumerName)}
                  </div>
                  <div>
                    <div className="request-name">
                      {r.consumerName}
                      <span className={'status ' + r.status.toLowerCase()}>{r.status.toUpperCase()}</span>
                    </div>
                    <div className="request-meta">
                      Requested <b>{r.platform}</b> <i></i> {r.requestedDate}
                    </div>
                  </div>
                </div>
                <button className="details-btn" onClick={() => setSelected(r)}>View Details</button>
              </div>
            ))}
          </div>

          {/* PROFILE SUMMARY */}
          <div className="panel profile-panel">
            <div className="profile-title">
              <div className="profile-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <h3>Profile Summary</h3>
            </div>

            <div className="field-label">Email</div>
            <div className="field-value">{user.email}</div>

            <div className="field-label">My Platforms</div>
            <div className="tag-row">
              {(user.platforms || []).map((pl) => (
                <span className="tag" key={pl}>{pl}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* REQUEST DETAILS MODAL */}
      <div className={'modal-overlay' + (selected ? ' open' : '')}>
        {selected && (
          <div className="modal">
            <div className="modal-body">
              <div className="modal-top">
                <h2>Request Details</h2>
                <span className={'status ' + selected.status.toLowerCase()}>{selected.status.toUpperCase()}</span>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
              <p className="modal-desc">Review the access request and duration below.</p>

              <div className="requested-by">
                <div className="avatar-red">{getInitials(selected.consumerName)}</div>
                <div>
                  <small>Requested by</small>
                  <strong>{selected.consumerName}</strong>
                  <span>{selected.consumerEmail}</span>
                </div>
              </div>

              <div className="modal-label">PLATFORM REQUESTED</div>
              <div className="platform-chip">{selected.platform}</div>

              <div className="modal-section">
                <div className="modal-label">DURATION</div>
                <div className="duration-row">
                  <div className="duration-box">
                    <small>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                      From
                    </small>
                    <div>{formatDateTime(selected.fromDate)}</div>
                  </div>
                  <div className="duration-box">
                    <small>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                      To
                    </small>
                    <div>{formatDateTime(selected.toDate)}</div>
                  </div>
                </div>
              </div>
            </div>

            {selected.status === 'Pending' && (
              <div className="modal-footer">
                <button className="decline-btn" onClick={() => handleDecision('Declined')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                  Decline
                </button>
                <button className="accept-btn" onClick={() => handleDecision('Accepted')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                  Accept Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;
