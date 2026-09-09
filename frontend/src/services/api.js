const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
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

export async function checkAuth() {
  let response;
  try {
    response = await fetch(`${API_URL}/forms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
  } catch {
    throw new Error('Unable to verify session (network error)');
  }

  if (response.status === 200) return { authenticated: true };
  if (response.status === 401) return { authenticated: false };

  const error = new Error(`Session check failed (${response.status})`);
  error.status = response.status;
  throw error;
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
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

export function updateForm(formId, payload) {
  return request(`/forms/${formId}`, { method: 'PATCH', body: payload });
}

export function deleteForm(formId) {
  return request(`/forms/${formId}`, { method: 'DELETE' });
}

export function submitFormAnswers(formId, payload) {
  return request(`/forms/${formId}/submissions`, { method: 'POST', body: payload });
}