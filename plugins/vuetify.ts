// plugins/vuetify.ts
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

/**
 * Esta es tu paleta de colores para el modo claro.
 * La definimos aquí para poder reutilizarla.
 */
const myLightTheme: ThemeDefinition = {
  dark: false, // <-- Esto es lo que pediste
  colors: {
    // 👇 ¡IMPORTANTE! Rellena esto con tus colores.
    // Si no lo haces, tu app se verá sin colores.
    // Estos son los más críticos para evitar fondos negros:
    background: '#FFFFFF', // Fondo general de la app
    surface: '#FFFFFF',    // Fondo de componentes como tarjetas (v-card)

    // El resto de tu paleta
    primary: '#132953',   // (Este lo saqué de tu nuxt.config)
    secondary: '#...',   // (Ejemplo)
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    // ...añade todos los colores que uses
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      /**
       * 1. El tema por defecto es 'light'.
       */
      defaultTheme: 'light',

      themes: {
        /**
         * 2. Cuando pida 'light', usa tu tema.
         */
        light: myLightTheme,

        /**
         * 3. EL TRUCO: Cuando el navegador pida 'dark',
         * ¡TAMBIÉN usa tu tema 'light'!
         */
        dark: myLightTheme,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})