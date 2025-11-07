// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth()

    if (!auth.isAuthenticated()) {
        return navigateTo('/login')
    }

})