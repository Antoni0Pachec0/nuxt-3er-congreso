import { defineNuxtConfig } from 'nuxt/config'
// Importamos 'node:process' para asegurarnos de que el runtimeConfig
// y el define de Vite reconozcan la variable 'process.env'.
import * as nodeProcess from 'node:process'; 


export default defineNuxtConfig({
  // Desactiva explícitamente el SSR para funcionar en modo SPA (Cliente)
  ssr: false,

  // ----------------
  // MÓDULOS Y CARACTERÍSTICAS
  // ----------------
  // Desactiva completamente la auto-importación de componentes (CRÍTICO para el error)
  components: true,
  // Desactiva la auto-importación de composición
  imports: { autoImport: true },

  modules: [
    'notivue/nuxt'
  ],
  
  devtools: { enabled: false },
  
  experimental: {
    asyncEntry: false,
    componentIslands: false
  },

  // ----------------
  // RUTAS Y REDIRECCIONAMIENTOS
  // ----------------
  routeRules: {
    /* '/auth/login':   { redirect: '/login' },
    '/auth/register':{ redirect: '/register' },
    '/auth/verify':  { redirect: '/verify' },
    '/auth/forgot':  { redirect: '/forgot' },
    '/auth/reset':  { redirect: '/reset' }, */

    '/user/home':  { redirect: '/user-home' },

  },

  // ----------------
  // CONFIGURACIÓN AMBIENTAL
  // ----------------
  runtimeConfig: {
    public: {
      // Usamos nodeProcess.env para asegurar la correcta resolución
      apiBase: nodeProcess.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
    }
  },

  // ----------------
  // ESTILOS Y HEAD
  // ----------------
  css: [
    '@/assets/css/main.css',
  ],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css' }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js', defer: true, tagPosition: 'bodyClose' },
        { src: '/particles-init.js', defer: true, tagPosition: 'bodyClose' }
      ]
    }
  },

  // ----------------
  // CONFIGURACIÓN DEL SERVIDOR (NITRO)
  // ----------------
  nitro: { 
    serveStatic: true,
    // Elimina la advertencia del log al usar la fecha recomendada
    compatibilityDate: '2025-09-29' 
  },

  // ----------------
  // CONFIGURACIÓN DE VITE (CRÍTICA - SOLUCIONES DE PATHING)
  // ----------------
  vite: {
    optimizeDeps: {
      // CRÍTICO 1: Excluye el helper de la pre-optimización
      exclude: [
        'plugin-vue:export-helper',
        'vite/modulepreload-polyfill'
      ]
    },
    
    build: {
      modulePreload: {
        polyfill: false
      },
      rollupOptions: {
         // CRÍTICO 2: Excluye el helper de Rollup durante el build/transformación
        external: ['plugin-vue:export-helper'] 
      }
    },
    
    server: {
      fs: {
        strict: false
      }
    },
    
    // CRÍTICO 3: Asegura que el pathing se resuelve correctamente
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeProcess.env.NODE_ENV || 'development')
    }
  },

  // ----------------
  // CONFIGURACIÓN DE TYPESCRIPT
  // ----------------
  typescript: {
    shim: false,
    typeCheck: false
  }
})
