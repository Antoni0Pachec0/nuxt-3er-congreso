// utils/notify/adapter.ts
import { push } from 'notivue'

// Devuelve una función (type, title, message) y para "loading" retorna {resolve, reject}
export function createNotifyAdapter() {
  return (type: 'success' | 'error' | 'warning' | 'info' | 'loading', title?: string, message?: string) => {
    if (type !== 'loading') {
      push({ type, title, message })          // usa las opciones del módulo (durations, iconos, etc.)
      return
    }

    // Loading "imperativo" con update a success/error después
    const id = push({ type: 'loading', title, message, duration: 0 })

    return {
      resolve({ title: t, message: m }: { title: string, message: string }) {
        push.update(id, { type: 'success', title: t, message: m })
      },
      reject({ title: t, message: m }: { title: string, message: string }) {
        push.update(id, { type: 'error', title: t, message: m })
      }
    }
  }
}
