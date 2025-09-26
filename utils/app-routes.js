// utils/app-routes.js
export const APP_ROUTES = {
  home:     { name: 'index',    path: '/' },
  login:    { name: 'login',    path: '/login' },
  register: { name: 'register', path: '/register' },
  verify:   { name: 'verify',   path: '/verify' },
  // agrega más rutas aquí
}

export const R = {
  to(key, params, query) {
    const r = APP_ROUTES[key]
    return {
      name: r.name,
      ...(params ? { params } : {}),
      ...(query ? { query } : {}),
    }
  },
  path(key) { return APP_ROUTES[key].path },
  name(key) { return APP_ROUTES[key].name },
}
