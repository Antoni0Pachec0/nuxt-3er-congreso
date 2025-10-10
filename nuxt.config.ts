// nuxt.config.ts
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: true,
  css: [
    'vuetify/styles',          // ✅ estilos base de Vuetify
    '@/assets/css/main.css',   // tus estilos
    // Si prefieres CDN de MDI, puedes omitir la línea de abajo.
    // '@mdi/font/css/materialdesignicons.css',
  ],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap'
        },
        // Si usas CDN para MDI, déjalo (y quita la importación local en css arriba)
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
  build: {
    transpile: ['vuetify'],          // ✅ necesario para SSR
  },
  vite: {
    ssr: { noExternal: ['vuetify'] }, // ✅ evita errores en build SSR
    plugins: [
      vuetify({ autoImport: true }),  // ✅ auto-import de <v-btn>, <v-card>, etc.
    ],
  },
})
