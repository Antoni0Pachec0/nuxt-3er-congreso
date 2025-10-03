// plugins/notivue.client.js
import { defineNuxtPlugin } from '#app'
import { createNotivue } from 'notivue'

export default defineNuxtPlugin((nuxtApp) => {
  const g = globalThis // persiste entre HMR en el cliente
  if (g.__notivue_installed__) return

  const notivue = createNotivue({
    position: 'top-right',
    limit: 3, // Reducimos el límite para evitar amontonar demasiados
    pauseOnHover: true, // Pausa la duración cuando se hace hover
    notifications: {
      success: { 
        duration: 4000, 
        showIcon: true,
      },
      error: { 
        duration: 6000, // Mayor duración para errores
        showIcon: true,
        dismissible: true, // Permitir cerrar con click
      },
      warning: { 
        duration: 5000,
        showIcon: true,
        dismissible: true,
      },
      loading: { 
        duration: 0, // Infinito hasta que se resuelva
        showIcon: true,
      },
      info: {
        duration: 4000,
        showIcon: true,
      }
    }
  })

  nuxtApp.vueApp.use(notivue)
  g.__notivue_installed__ = true
})
