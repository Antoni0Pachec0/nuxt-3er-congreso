export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const api = $fetch.create({
        baseURL: config.public.apiBase,       // << usa runtimeConfig
        credentials: 'include',               // << ENVÍA cookies HttpOnly
        headers: { 'Content-Type': 'application/json' },
        onResponseError({ response }) {
            // Normalización de errores (opcional)
            // Puedes disparar toasts aquí
        }
    })

    return { provide: { api } }
})
