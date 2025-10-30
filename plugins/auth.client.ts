// plugins/auth.client.ts
export default defineNuxtPlugin(() => {
    const auth = useAuth()

    // Verificar autenticación al iniciar la app
    if (process.client) {
        const token = auth.getToken()
        if (token) {
            console.log('Token encontrado al iniciar la app:', token.substring(0, 20) + '...')
        } else {
            console.log('No se encontró token al iniciar la app')
        }
    }

    return {
        provide: {
            auth
        }
    }
})