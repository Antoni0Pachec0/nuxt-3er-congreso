import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  components: false,
  imports: { autoImport: false },

  devtools: { enabled: false },
  ssr: false,

  typescript: {
    shim: false,
    typeCheck: false
  },

  css: [
    '@/assets/css/main.css', // Tu archivo principal de estilos
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

  nitro: { 
    preset: 'node-server',
    serveStatic: true,
    compatibilityDate: '2025-09-23' // 🔹 Aquí es donde debe ir
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  },

  experimental: {
    asyncEntry: false,
    componentIslands: false
  },

   modules: [
    'notivue/nuxt'
  ],

  vite: {
    optimizeDeps: {
      exclude: [
        'plugin-vue:export-helper',
        'vite/modulepreload-polyfill.js'
      ]
    },
    build: {
      modulePreload: {
        polyfill: false // 🔹 corregido: evita el warning deprecated
      }
    },
    server: {
      fs: {
        strict: false
      }
    }
  }
})
