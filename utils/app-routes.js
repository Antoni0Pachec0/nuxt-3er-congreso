// utils/app-routes.js - Mejorar con tipos de parámetros
export const APP_ROUTES = {
  //default
  404: { name: 'error 404', path: '404', title: '404' },
  home:       { name: 'index', path: '/', title: 'Inicio' },

  // auth
  login:      { name: 'login', path: '/login', title: 'Iniciar sesión' },
  register:   { name: 'register', path: '/register', title: 'Crear cuenta' },
  verify:     { name: 'verify', path: '/verify', title: 'Verificar cuenta' },
  forgot:     { name: 'forgot', path: '/forgot', title: 'Recuperar contraseña' },
  reset:      { name: 'reset', path: '/reset', title: 'Restablecer contraseña' },

  // user
  userHome:   { name: 'user-home', path: '/user-home', title: (p) => `Inicio ${p?.username ?? 'Usuario'}` },

  // game
  game:       { name: 'game-game', path: '/game/game', title: 'Juego' },
  leaderboard:{ name: 'game-leaderboard', path: '/game/leaderboard', title: 'Tabla de posiciones' },

  // admin
  adminHome:  { name: 'admin-home', path: '/admin', title: 'Administración' }, // Ruta principal de admin (opcional, pero útil)
  adminAnalysis: { name: 'admin-analysis', path: '/admin/analysis', title: 'Análisis' },
  adminBadges:   { name: 'admin-badges', path: '/admin/badges', title: 'Insignias' },
  adminSchedule: { name: 'admin-schedule', path: '/admin/schedule', title: 'Agenda' },
  adminUsers:    { name: 'admin-users', path: '/admin/users', title: 'Usuarios' },
  adminWorkshops:{ name: 'admin-workshops', path: '/admin/workshops', title: 'Talleres' },
}

// Helpers mejorados
export const R = {
  to(key, params = {}, query = {}) {
    const route = APP_ROUTES[key]
    if (!route) {
      console.error(`Route ${key} not found in APP_ROUTES`)
      return { name: 'index' }
    }
    return { 
      name: route.name, 
      params,
      query,
      hash: params.hash // Para soportar anclas
    }
  },
  
  path(key, params = {}) {
    const route = APP_ROUTES[key]
    if (!route) return '/'
    
    let path = route.path
    
    // Reemplazar parámetros en la ruta si existen
    Object.keys(params).forEach(key => {
      path = path.replace(`:${key}`, params[key])
    })
    
    return path
  },
  
  name(key) { 
    return APP_ROUTES[key]?.name ?? 'index' 
  }
}