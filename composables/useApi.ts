// composables/useApi.ts
export const useApi = () => {
    const auth = useAuth()

    const authenticatedFetch = async (url: string, options: any = {}) => {
        const token = auth.getToken()

        if (!token) {
            throw new Error('No authentication token found')
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