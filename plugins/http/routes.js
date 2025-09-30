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
    // 💡 Añadimos LOGOUT aquí aunque no sea usado en el middleware, es buena práctica
    LOGOUT: '/auth/logout', 
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
