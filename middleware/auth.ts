// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth()

    if (!auth.isAuthenticated()) {
        console.log('Usuario no autenticado, redirigiendo a login')
        return navigateTo('/login')
    }

    console.log('Usuario autenticado, acceso permitido')
})