// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    '@/assets/css/main.css'
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
  }
})

