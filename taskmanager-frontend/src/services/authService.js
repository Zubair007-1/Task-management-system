import api from './api';

export const authService = {
  /** POST /api/auth/login → { token } */
  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { token: "..." }
  },

  /** POST /api/auth/register → string message */
  register: async ({ name, email, password }) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },
};

/**
 * Decode a JWT payload (no verification — client-side only).
 * Returns null if the token is missing or malformed.
 */
export function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
