// All database calls live here. Backend = json-server running on port 3001 (see db.json).
const BASE = 'https://lz4qtzt2-5000.inc1.devtunnels.ms';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

/* ---------- AUTH ---------- */
export async function loginUser(email, password) {
  const users = await fetch(
    `${BASE}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );
  const userdata = await users.json();
  return userdata[0] || null;
}

export async function registerUser(data) {
  const existing = await request(`/users?email=${encodeURIComponent(data.email)}`);
  if (existing.length > 0) throw new Error('An account with this email already exists.');
  return request('/users', { method: 'POST', body: JSON.stringify(data) });
}

/* ---------- PROVIDERS (consumer side) ---------- */
export function getProviders() {
  return request('/users?userType=provider');
}

/* ---------- REQUESTS ---------- */
export function createRequest(data) {
  return request('/requests', { method: 'POST', body: JSON.stringify(data) });
}

export function getProviderRequests(providerId) {
  return request(`/requests?providerId=${providerId}`);
}

export function updateRequestStatus(id, status) {
  return request(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

/* ---------- SESSION (who is logged in) ---------- */
export function saveSession(user) {
  const { password, ...safeUser } = user; // never keep the password in the browser
  localStorage.setItem('currentUser', JSON.stringify(safeUser));
}
export function getSession() {
  try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
}
export function clearSession() {
  localStorage.removeItem('currentUser');
}

/* ---------- HELPERS ---------- */
export function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}
export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}
