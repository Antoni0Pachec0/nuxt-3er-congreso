// nuxt.config.ts
export default defineNuxtConfig({
  // ✅ Configuración compatible con Railpack
  compatibilityDate: '2024-04-03',
  
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
  
  // ✅ Configuración específica para Railpack
  nitro: {
    preset: 'node-server'
  },
  
  typescript: {
    typeCheck: false,  // ✅ Desactivar para Railpack
    shim: false
  }
})

function defineNuxtConfig(arg0: {
  // ✅ Configuración compatible con Railpack
  compatibilityDate: string; css: string[]; app: { head: { link: ({ rel: string; href: string; } | { rel: string; href: string; crossorigin: string; })[]; script: { src: string; defer: boolean; tagPosition: string; }[]; }; };
  // ✅ Configuración específica para Railpack
  nitro: { preset: string; }; typescript: {
    typeCheck: boolean; // ✅ Desactivar para Railpack
    shim: boolean;
  };
}) {
  throw new Error("Function not implemented.");
}
