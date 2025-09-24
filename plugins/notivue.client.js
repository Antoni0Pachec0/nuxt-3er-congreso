// plugins/notivue.client.js
import { defineNuxtPlugin } from '#app'
import { createNotivue } from 'notivue'

export default defineNuxtPlugin((nuxtApp) => {
  const notivue = createNotivue({
    position: 'top-right',
    limit: 5,
    notifications: {
      success: { duration: 3000 },
      error: { duration: 5000 }, // Aumentar tiempo para errores
      warning: { duration: 4000 },
      loading: { duration: 0 }
    }
  })

  nuxtApp.vueApp.use(notivue)
})
