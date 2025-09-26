// plugins/notivue.client.js
import { defineNuxtPlugin } from '#app'
import { createNotivue } from 'notivue'

export default defineNuxtPlugin((nuxtApp) => {
  const g = globalThis // persiste entre HMR en el cliente
  if (g.__notivue_installed__) return

  const notivue = createNotivue({
    position: 'top-right',
    limit: 5,
    notifications: {
      success: { duration: 3000 },
      error:   { duration: 5000 },
      warning: { duration: 4000 },
      loading: { duration: 0 }
    }
  })

  nuxtApp.vueApp.use(notivue)
  g.__notivue_installed__ = true
})
