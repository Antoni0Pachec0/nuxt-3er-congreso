// utils/mdiIcons.js
import * as mdi from '@mdi/js'

/**
 * Genera una lista única y normalizada de nombres mdi-*
 * Esto se ejecuta una sola vez al importar este módulo.
 */
export const mdiIcons = Object.keys(mdi)
  .filter(k => k.startsWith('mdi'))
  .map(k =>
    'mdi-' +
    k
      .replace(/^mdi/, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
  )
