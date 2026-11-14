// All database calls live here. Backend = json-server running on port 3001 (see db.json).
// BASE is empty on purpose: package.json has  "proxy": "http://localhost:3001"
// so every /users and /requests call is forwarded to json-server by the React dev server.
// This works on localhost AND through a dev tunnel (only port 3000 needs to be forwarded).
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
  // Returns { user, reason, count } so the UI can say exactly what went wrong.
  const users = await request('/users');
  if (!Array.isArray(users)) {
    return { user: null, reason: 'bad-response', count: 0 };
  }
  console.log('Users loaded from database:', users);

  const wantedEmail = email.trim().toLowerCase();
  const found = users.find((u) => String(u.email || '').trim().toLowerCase() === wantedEmail);

  if (!found) return { user: null, reason: 'no-email', count: users.length };
  if (String(found.password) !== password) return { user: null, reason: 'bad-password', count: users.length };
  return { user: found, reason: 'ok', count: users.length };
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
