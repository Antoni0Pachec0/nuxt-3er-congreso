import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Desactiva explícitamente el SSR para funcionar en modo SPA (Cliente)
  ssr: false,

  // ----------------
  // MÓDULOS Y CARACTERÍSTICAS
  // ----------------
  components: true,
  imports: { autoImport: true },

  modules: [
    'notivue/nuxt',
    '@pinia/nuxt',
  ],
  
  // Eliminamos el bloque 'pinia' para evitar el error de tipado,
  // ya que los autoimports por defecto son suficientes.
  
  devtools: { enabled: false },
  
  experimental: {
    asyncEntry: false,
    componentIslands: false
  },

  // ----------------
  // CONFIGURACIÓN AMBIENTAL
  // ----------------
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.congresoti.com.mx',
      // apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
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
      meta: [
        { name: 'theme-color', content: '#132953' },
        { name: 'msapplication-navbutton-color', content: '#132953' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' }
      ],
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
    compatibilityDate: '2025-10-03' 
  },

  // ----------------
  // CONFIGURACIÓN DE VITE (CRÍTICA - SOLUCIONES DE PATHING)
  // ----------------
  vite: {
    optimizeDeps: {
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
        external: ['plugin-vue:export-helper'] 
      }
    },
    
    server: {
      fs: {
        strict: false
      }
    },
    
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
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
