const API_BASE = '/api';

function authHeader() {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function api(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}), ...authHeader() },
  });
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  return res.status === 204 ? null : res.json();
}

export const Auth = {
  async login(email, password) {
    const data = await api('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },
  logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); },
  currentUser() { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } },
};

export const Users = {
  list: () => api('/users'),
  get: (email) => api(`/users/${encodeURIComponent(email)}`),
  create: (u) => api('/users', { method: 'POST', body: JSON.stringify(u) }),
  update: (email, u) => api(`/users/${encodeURIComponent(email)}`, { method: 'PUT', body: JSON.stringify(u) }),
  remove: (email) => api(`/users/${encodeURIComponent(email)}`, { method: 'DELETE' }),
};

export const Catways = {
  list: () => api('/catways'),
  get: (id) => api(`/catways/${id}`),
  create: (c) => api('/catways', { method: 'POST', body: JSON.stringify(c) }),
  updateState: (id, state) => api(`/catways/${id}`, { method: 'PUT', body: JSON.stringify({ catwayState: state }) }),
  remove: (id) => api(`/catways/${id}`, { method: 'DELETE' }),
};

export const Reservations = {
  listFor: (id) => api(`/catways/${id}/reservations`),
  get: (id, rid) => api(`/catways/${id}/reservations/${rid}`),
  create: (id, r) => api(`/catways/${id}/reservations`, { method: 'POST', body: JSON.stringify(r) }),
  update: (id, rid, r) => api(`/catways/${id}/reservations/${rid}`, { method: 'PUT', body: JSON.stringify(r) }),
  remove: (id, rid) => api(`/catways/${id}/reservations/${rid}`, { method: 'DELETE' }),
};
