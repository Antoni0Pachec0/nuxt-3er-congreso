// composables/useApi.ts
import { useAuthStore } from '~/security/stores/auth' // 1. Importar el store de Pinia

export const useApi = () => {
    // 2. Obtener la instancia del store
    //    IMPORTANTE: Se obtiene aquí, pero el token se lee *dentro* de la función fetch
    const authStore = useAuthStore()

    const authenticatedFetch = async (url: string, options: any = {}) => {
        // 3. Leer el token desde el estado de Pinia
        //    Esto se hace en el momento de la llamada, no cuando se crea el composable
        const token = authStore.accessToken

        if (!token) {
            // 4. Si no hay token, fallar (esto es lo que pasa en la "carrera")
            throw new Error('No authentication token found (desde useApi)')
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }

        return await $fetch(url, {
            ...options,
            headers,
            baseURL: useRuntimeConfig().public.apiBase,
            credentials: 'include',
        })
    }

    return {
        get: (url: string, options?: any) => authenticatedFetch(url, { ...options, method: 'GET' }),
        post: (url: string, body?: any, options?: any) => authenticatedFetch(url, { ...options, method: 'POST', body }),
        put: (url: string, body?: any, options?: any) => authenticatedFetch(url, { ...options, method: 'PUT', body }),
        delete: (url: string, options?: any) => authenticatedFetch(url, { ...options, method: 'DELETE' }),
    }
}