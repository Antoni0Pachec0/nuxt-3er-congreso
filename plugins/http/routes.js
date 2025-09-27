// utils/http/routes.js
export const ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    CHECK_SPEAKER_SECRET: '/auth/speakers/check-secret',
    VERIFY: '/auth/verify',
    RESEND: '/auth/resend', // 👈 si tienes endpoint para reenvío
    LOGIN: '/auth/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    SCORE: '/auth/game',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id) => `/users/${id}`,
  },
  WORKSHOPS: {
    LIST: '/workshops',
    BY_ID: (id) => `/workshops/${id}`,
  },
  // agrega aquí otros módulos según vayas necesitando
};
