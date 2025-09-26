import { push } from 'notivue';

let activeNotifications = [];

function clearNotifications() {
  activeNotifications.forEach((notification) => {
    clearTimeout(notification.timeout);
  });
  activeNotifications = [];
}

export function notifySuccess(title, message) {
  clearNotifications();
  const notification = push.success({ title, message });
  const timeout = setTimeout(() => {
    activeNotifications = activeNotifications.filter(n => n !== notification);
  }, 5000);
  activeNotifications.push({ notification, timeout });
}

export function notifyError(title, message) {
  clearNotifications();
  const notification = push.error({ title, message });
  const timeout = setTimeout(() => {
    activeNotifications = activeNotifications.filter(n => n !== notification);
  }, 5000);
  activeNotifications.push({ notification, timeout });
}

export function notifyWarning(title, message) {
  clearNotifications();
  const notification = push.warning({ title, message });
  const timeout = setTimeout(() => {
    activeNotifications = activeNotifications.filter(n => n !== notification);
  }, 5000);
  activeNotifications.push({ notification, timeout });
}

export function notifyLoading(title, message) {
  clearNotifications();

  // Definir la promesa antes de utilizarla
  let controller;
  const promise = new Promise((resolve, reject) => {
    controller = { resolve, reject };  // Asigna el controlador a la promesa
  });

  const toast = push.promise(promise, {
    loading: { title, message },
    success: { title: 'Éxito 🎉', message: 'Operación completada' },
    error: { title: 'Error', message: 'Ocurrió un problema' }
  });

  const timeout = setTimeout(() => {
    activeNotifications = activeNotifications.filter(n => n !== toast);
  }, 5000);

  activeNotifications.push({ toast, timeout });

  return {
    resolve: (opts) => {
      controller.resolve();
      toast.resolve(opts);
    },
    reject: (opts) => {
      controller.reject();
      toast.reject(opts);
    }
  };
}
