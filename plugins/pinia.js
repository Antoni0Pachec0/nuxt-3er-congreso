import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

// El directorio 'plugins' auto-registra este archivo como un plugin de Nuxt.
// defineNuxtPlugin inyecta la instancia de Pinia ($pinia) una vez que está lista.
export default defineNuxtPlugin(({ $pinia }) => {
  // Usamos el plugin 'pinia-plugin-persistedstate' en la instancia de Pinia.
  // Es importante usar 'use' para adjuntar el comportamiento de persistencia.
  $pinia.use(piniaPluginPersistedState);
});
