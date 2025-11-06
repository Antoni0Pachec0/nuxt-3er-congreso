// nuxt.config.ts - VERSIÓN CORREGIDA
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  // ----------------
  // MODO DE RENDERIZADO
  // ----------------
  ssr: false,

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

  modules: [
    'notivue/nuxt',
    '@pinia/nuxt',
  ],

  notivue: {
    position: 'top-right',
    limit: 3,
    pauseOnHover: true,
    avoidDuplicates: true,
    notifications: {
      success: { duration: 4000 },
      error:   { duration: 6000, ariaLive: 'assertive', ariaRole: 'alert' },
      warning: { duration: 5000 },
      info:    { duration: 4000 },
      promise: { duration: Infinity },
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.congresoti.com.mx/',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      returnUrl: process.env.NUXT_PUBLIC_RETURN_URL || 'https://congresoti.com.mx/stripe/success',
    },
  },

  // ----------------
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
    transpile: ['vuetify', 'gsap'], // ✅ GSAP agregado aquí
  },

  // ----------------
  // CONFIGURACIÓN DE VITE - CORREGIDA
  // ----------------
  vite: {
    plugins: [vuetify({ autoImport: true })],

    // ✅ CONFIGURACIÓN DEFINE CORREGIDA (sin duplicados)
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    },

    // ✅ OPTIMIZE DEPS CORREGIDO
    optimizeDeps: {
      exclude: [
        'plugin-vue:export-helper',
        'vite/modulepreload-polyfill',
        'gsap' // ✅ GSAP excluido correctamente
      ],
      include: ['vuetify'] // ✅ Solo vuetify aquí
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
  },

  // ----------------
  // CONFIGURACIÓN DE TYPESCRIPT
  // ----------------
  typescript: {
    shim: false,
    typeCheck: false,
  },

  // ✅ PLUGINS CORREGIDOS
  plugins: [
    '~/plugins/gsap.client.ts'
  ],
})