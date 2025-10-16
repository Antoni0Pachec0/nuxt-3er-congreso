// utils/http/routes.js o donde tengas ROUTES
export const ROUTES = {
  AUTH: {
    HOME: '/',
    REGISTER: '/auth/register',
    CHECK_SPEAKER_SECRET: '/auth/speakers/check-secret',
    VERIFY: '/auth/verify',
    RESEND: '/auth/resend-code',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  SCORES: {
    CREATE: '/scores',
    LEADERBOARD: '/scores/leaderboard',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id) => `/users/${id}`,
  },
  WORKSHOPS: {
    LIST: '/workshops',
    BY_ID: (id) => `/workshops/${id}`,
  },
}
