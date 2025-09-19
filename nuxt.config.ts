import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
// Desactivar completamente componentes e imports automáticos
components: false,
  imports: {
    autoImport: false
  },

  devtools: { enabled: false },
  ssr: false,

  // Configuración de TypeScript
  typescript: {
    shim: false,
    typeCheck: false
  },

  vite: {
    server: {
      fs: {
        strict: false,
        allow: ['..', '*']
      },
      hmr: { overlay: false }
    },
  },

  css: ['@/assets/css/main.css'],
  
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

  nitro: { 
    preset: 'node-server',
    serveStatic: true
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
    }
  },

  experimental: {
    asyncEntry: false,
    componentIslands: false
  }
})
