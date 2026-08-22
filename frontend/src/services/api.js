const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function getApiHealth() {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) throw new Error('API health request failed');
  return response.json();
}
