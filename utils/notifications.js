// utils/notifications.js
import { push } from 'notivue'

export function notifySuccess(title, message) {
  push.success({ title, message })
}

export function notifyError(title, message) {
  push.error({ title, message })
}

export function notifyWarning(title, message) {
  push.warning({ title, message })
}

/**
 * Toast de carga controlado (resolve/reject)
 * Devuelve un objeto con métodos para resolver/rechazar el estado
 */
export function notifyLoading(title, message) {
  let controller
  const promise = new Promise((resolve, reject) => {
    controller = { resolve, reject }
  })

  const toast = push.promise(promise, {
    loading: { title, message },
    success: { title: 'Éxito 🎉', message: 'Operación completada' },
    error: { title: 'Error', message: 'Ocurrió un problema' }
  })

  return {
    resolve: (opts) => {
      controller.resolve()
      toast.resolve(opts)
    },
    reject: (opts) => {
      controller.reject()
      toast.reject(opts)
    }
  }
}
