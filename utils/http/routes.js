// utils/http/routes.js
export const ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
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
