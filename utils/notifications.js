import { push } from 'notivue'

export function notifySuccess(title, message) {
  push({ title, message, type: 'success', position: 'top-right', duration: 3000 })
}
export function notifyError(title, message) {
  push({ title, message, type: 'error', position: 'bottom-right', duration: 5000 })
}
export function notifyWarning(title, message) {
  push({ title, message, type: 'warning', position: 'top-center', duration: 4000 })
}
export function notifyLoading(title, message) {
  return push({ title, message, type: 'loading', position: 'bottom-center', duration: 0 })
}
