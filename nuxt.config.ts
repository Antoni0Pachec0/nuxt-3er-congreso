import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  css: [
    '@/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      STRIPE_PUBLISHABLE_KEY: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      API_BASE: process.env.NUXT_PUBLIC_API_BASE,
      RETURN_URL: process.env.NUXT_PUBLIC_RETURN_URL,
    },
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap'
        },
        // Agregar Material Design Icons
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css'
        }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
          defer: true,
          tagPosition: 'bodyClose'
        },
        {
          src: '/particles-init.js',
          defer: true,
          tagPosition: 'bodyClose'
        }
      ]
    }
  },

  // Asegúrate que Nuxt cargue los plugins correctamente
  plugins: [
    // No necesitas especificar los plugins individualmente si sigues la convención de nombres
  ],

  // Configuración para manejar mejor las dependencias de cliente
  build: {
    transpile: ['@vue-stripe/vue-stripe']
  },

  // Configuración de alias explícita
  alias: {
    '@': fileURLToPath(new URL('.', import.meta.url)),
    '~': fileURLToPath(new URL('.', import.meta.url))
  },

  // Mejorar la resolución de Vite
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
        '~': fileURLToPath(new URL('.', import.meta.url))
      }
    }
  },
})

