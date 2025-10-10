// composables/user/use-user-home.js
import { ref, onMounted } from 'vue'
import { navigateTo } from '#imports'
import { R } from '@/utils/app-routes'
import { SessionApi } from '@/backend/auth/session-api'
import { useAuthStore } from '@/security/stores/auth' // si no usas Pinia, puedes quitarlo

export function useUserHome () {
  const loading = ref(false)
  const error   = ref('')

  const authStore = safeUseAuthStore()

  function goToGame () {
    return navigateTo(R.path('game'))
  }

  async function handleLogout () {
    if (loading.value) return
    loading.value = true
    error.value = ''

    try {
      // Llama a la API explícitamente
      await SessionApi.logout()

      // Limpieza local opcional (si tienes store)
      try {
        await authStore?.logout?.()
      } catch { /* ignora si no existe */ }

      // Fuerza recarga para evitar middlewares o estado cacheado
      window.location.href = '/login'
    } catch (err) {
      console.error('Error durante logout:', err)
      error.value = 'Error al cerrar sesión. Redirigiendo...'
      setTimeout(() => { window.location.href = '/login' }, 800)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    // Carga desde storage si tu store lo maneja
    try {
      authStore?.loadFromStorage?.()
    } catch { /* opcional */ }
  })

  return {
    loading,
    error,
    goToGame,
    handleLogout
  }
}

/** Evita romper si no existe el store en este proyecto */
function safeUseAuthStore () {
  try {
    return useAuthStore()
  } catch {
    return null
  }
}
