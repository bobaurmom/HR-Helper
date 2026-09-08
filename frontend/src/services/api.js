const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const TOKEN_KEY = 'hr-helper:token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { email: payload.email, name: payload.name, id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export function googleAuthUrl() {
  return `${API_URL}/auth/google`;
}

export async function getApiHealth() {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) throw new Error('API health request failed');
  return response.json();
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export function listForms() {
  return request('/forms');
}

export function getForm(id) {
  return request(`/forms/${id}`);
}

export function createForm(payload) {
  return request('/forms', { method: 'POST', body: payload });
}
