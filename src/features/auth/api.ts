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
