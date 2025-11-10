import { api } from '../../lib/api';

export type RegisterInput = { email: string; username: string; password: string };
export type LoginInput = { email: string; password: string };

export type AuthResponse = {
  user: { id: string; email: string; username: string; createdAt: string };
  token: string;
};

export async function register(input: RegisterInput) {
  return api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function login(input: LoginInput) {
  return api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function me() {
  return api<{ user: AuthResponse['user'] }>(`/auth/me`);
}

export async function updateUsername(username: string) {
  return api<{ user: AuthResponse['user'] }>(`/auth/me`, {
    method: 'PATCH',
    body: JSON.stringify({ username }),
  });
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return api<{ ok: true }>(`/auth/me/password`, {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
