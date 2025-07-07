export const AUTH_CONFIG = {
  tokenKey: 'token',
  userKey: 'user',
  cookieOptions: {
    path: '/',
    maxAge: 86400,
    sameSite: 'strict' as const,
  },
  apiEndpoints: {
    login: '/auth/login',
    me: '/auth/me',
  }
}; 