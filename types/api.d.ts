import type { $Fetch } from 'ofetch'

declare module '#app' {
    interface NuxtApp {
        $api: $Fetch
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $api: $Fetch
    }
}

// Declaración global para uso en otros archivos
declare global {
    type ApiClientInstance = $Fetch
}

export { }