// utils/http/routes.js
export const ROUTES = {
  AUTH: {
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
    PUBLIC: '/workshops/public',
    BY_ID: (id) => `/workshops/${id}`,
    AVAILABLE: '/workshops/available/list'
  },

  ADMIN: {
    USERS: {
      LIST: '/admin/users',
      FILTER_OPTIONS: '/admin/users/filter-options',
      ACTIVATION: (id) => `/admin/users/${id}/activation`,
      ACTIVATION_BULK: '/admin/users/activation-bulk', // <— NUEVO
    }
  }
}