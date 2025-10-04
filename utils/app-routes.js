// utils/app-routes.js
export const APP_ROUTES = {
  home:     { name: 'index',     path: '/' },
  login:    { name: 'login',     path: '/login' },
  register: { name: 'register',  path: '/register' },
  verify:   { name: 'verify',    path: '/verify' },
  forgot:   { name: 'forgot',    path: '/forgot' },
  reset:    { name: 'reset',     path: '/reset' },
  userHome: { name: 'user-home', path: '/user-home' }, // Mantén este nombre
  game:     { name: 'game',      path: '/game' },
}

export const R = {
  to(key, params, query) {
    const r = APP_ROUTES[key]
    if (!r) {
      console.error(`Route ${key} not found in APP_ROUTES`)
      return { name: 'index' } // Fallback
    }
    return {
      name: r.name,
      ...(params ? { params } : {}),
      ...(query ? { query } : {}),
    }
  },
  path(key) { 
    const r = APP_ROUTES[key]
    return r ? r.path : '/'
  },
  name(key) { 
    const r = APP_ROUTES[key]
    return r ? r.name : 'index'
  },
}