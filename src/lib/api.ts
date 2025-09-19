export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail: any = null;
    try { detail = await res.json(); } catch { /* ignore */ }
    const message = detail?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return (await res.json()) as T;
}
