import { defineNuxtConfig } from "nuxt/config";

// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  
  // ✅ Configuración experimental corregida
  experimental: {
    externalVue: false,
    // inlineSSRStyles no existe en Nuxt 3 - ELIMINADO
  },
  
  // ✅ Usar parser alternativo
  vite: {
    esbuild: {
      supported: {
        'top-level-await': true
      }
    }
  },
  
  css: [
    '@/assets/css/main.css'
  ],
  
  app: {
    head: {
      link: [
        { 
          rel: 'preconnect', 
          href: 'https://fonts.googleapis.com' 
        },
        { 
          rel: 'preconnect', 
          href: 'https://fonts.gstatic.com', 
          crossorigin: 'anonymous'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap'
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
  
  nitro: {
    preset: 'node-server'
  },
  
  typescript: {
    typeCheck: false,
    shim: false
  }
})