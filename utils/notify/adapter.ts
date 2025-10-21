// utils/notify/adapter.ts
import { push } from 'notivue'

/**
 * Adapter minimalista alineado a la doc:
 *  - success / error / warning / info => push.<type>({ title, message })
 *  - loading => push.promise({ title, message }) y devolver { resolve, reject }
 */
export function createNotifyAdapter() {
  return (
    type: 'success' | 'error' | 'warning' | 'info' | 'loading',
    title?: string,
    message?: string
  ) => {
    if (type === 'loading') {
      const ctl = push.promise({ title, message }) // duration Infinity por config
      return {
        resolve({ title: t, message: m }: { title?: string; message?: string } = {}) {
          // pasa nuevo título/mensaje (opcional)
          ctl.resolve({ title: t, message: m })
        },
        reject({ title: t, message: m }: { title?: string; message?: string } = {}) {
          ctl.reject({ title: t, message: m })
        }
      }
    }

    // Tipos estándar
    push[type]({ title, message })
  }
}
