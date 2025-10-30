// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  // ----------------
  // MODO DE RENDERIZADO
  // ----------------
  ssr: false, // Desactiva SSR para modo SPA

  // ----------------
  // MÓDULOS Y COMPONENTES
  // ----------------
  components: true,

  imports: {
    autoImport: true,
  },

  css: [
    'notivue/notification.css',
    'notivue/animations.css',
    '@/assets/css/main.css',
  ],

  // 👇 El módulo va sin opciones inline
  modules: [
    'notivue/nuxt',
    '@pinia/nuxt',
  ],

  // 👇 Las opciones van en la clave `notivue` (by-the-book)
  notivue: {
    position: 'top-right',
    limit: 3,
    pauseOnHover: true,
    avoidDuplicates: true,
    // En Notivue el estado "loading" se modela con `promise`
    notifications: {
      success: { duration: 4000 },
      error:   { duration: 6000, ariaLive: 'assertive', ariaRole: 'alert' },
      warning: { duration: 5000 },
      info:    { duration: 4000 },
      promise: { duration: Infinity }, // para push.promise()
    },
  },

  devtools: { enabled: false },

  experimental: {
    asyncEntry: false,
    componentIslands: false,
  },

  // ----------------
  // VARIABLES DE ENTORNO
  // ----------------
  runtimeConfig: {
    public: {
      apiBase: 
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
        stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ,
        returnUrl: process.env.NUXT_PUBLIC_RETURN_URL || 'http://localhost:3000/stripe/success',
    },
  },

  // ---------------->
  // METADATOS Y HEAD GLOBAL
  // ----------------
  app: {
    head: {
      titleTemplate: '%s | Congreso TI',
      meta: [
        { name: 'theme-color', content: '#132953' },
        { name: 'msapplication-navbutton-color', content: '#132953' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
          defer: true,
          tagPosition: 'bodyClose',
        },
        { src: '/particles-init.js', defer: true, tagPosition: 'bodyClose' },
      ],
    },
  },

  // ----------------
  // CONFIGURACIÓN DEL SERVIDOR (NITRO)
  // ----------------
  nitro: {
    serveStatic: true,
    compatibilityDate: '2025-10-13',
  },

  // ----------------
  // CONFIGURACIÓN DE COMPILACIÓN
  // ----------------
  build: {
    transpile: ['vuetify'],
  },

  // ----------------
  // CONFIGURACIÓN DE VITE
  // ----------------
  vite: {
    plugins: [vuetify({ autoImport: true })],

    optimizeDeps: {
      exclude: [
        'plugin-vue:export-helper',
        'vite/modulepreload-polyfill',
      ],
    },

    build: {
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        external: ['plugin-vue:export-helper'],
      },
    },

    server: {
      fs: {
        strict: false,
      },
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
    },
  },

  // ----------------
  // CONFIGURACIÓN DE TYPESCRIPT
  // ----------------
  typescript: {
    shim: false,
    typeCheck: false,
  },
})
