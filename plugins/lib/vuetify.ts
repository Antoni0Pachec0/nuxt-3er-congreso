// plugins/vuetify.ts
import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'     // si usas autoImport, puedes omitir estas dos
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#2563eb',
            secondary: '#1ca2ff',
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
