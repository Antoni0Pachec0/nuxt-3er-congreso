// plugins/route-title.client.js
import { APP_ROUTES } from '@/utils/app-routes'

export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute()

  const apply = () => {
    const routes = Object.values(APP_ROUTES)

    // Match por name → por path → por prefijo (útil para subrutas)
    let entry = routes.find(r => r.name === route.name)
    if (!entry) entry = routes.find(r => r.path === route.path)
    if (!entry) entry = routes.find(r => route.path.startsWith(r.path))

    if (!entry) return

    const raw = entry.title
    const title = typeof raw === 'function'
      ? raw({ ...route.params, ...route.query })
      : raw

    if (title) useHead({ title })
  }

  // Aplicar al cargar y en cada navegación
  apply()
  nuxtApp.hook('page:finish', apply)
})
