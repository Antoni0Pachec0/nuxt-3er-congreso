import { push } from 'notivue';

// Track notifications by message content to prevent duplicates
let activeNotifications = [];
let recentMessages = new Map(); // Map to track recent messages

// Clear all active notifications
function clearNotifications() {
  activeNotifications.forEach((notification) => {
    clearTimeout(notification.timeout);
  });
  activeNotifications = [];
}

// Check if this is a duplicate message within a short timeframe
function isDuplicate(title, message) {
  const key = `${title}:${message}`;
  const now = Date.now();
  
  // If we've seen this message recently (within 3 seconds), it's a duplicate
  if (recentMessages.has(key)) {
    const lastTime = recentMessages.get(key);
    if (now - lastTime < 3000) { // 3 seconds threshold
      return true;
    }
  }
  
  // Update the timestamp for this message
  recentMessages.set(key, now);
  
  // Clean up old messages (older than 10 seconds)
  for (const [msgKey, timestamp] of recentMessages.entries()) {
    if (now - timestamp > 10000) {
      recentMessages.delete(msgKey);
    }
  }
  
  return false;
}

export function notifySuccess(title, message) {
  // Skip if this is a duplicate message
  if (isDuplicate(title, message)) return;
  
  clearNotifications();
  const notification = push.success({ title, message });
  const timeout = setTimeout(() => {
    activeNotifications = activeNotifications.filter(n => n !== notification);
  }, 5000);
  activeNotifications.push({ notification, timeout });
}

export function notifyError(title, message) {
  // Skip if this is a duplicate message
  if (isDuplicate(title, message)) return;
  
  clearNotifications();
  const notification = push.error({ title, message });
  const timeout = setTimeout(() => {
    activeNotifications = activeNotifications.filter(n => n !== notification);
  }, 5000);
  activeNotifications.push({ notification, timeout });
}

export function notifyWarning(title, message) {
  // Skip if this is a duplicate message
  if (isDuplicate(title, message)) return;
  
  clearNotifications();
  const notification = push.warning({ title, message });
  const timeout = setTimeout(() => {
    activeNotifications = activeNotifications.filter(n => n !== notification);
  }, 5000);
  activeNotifications.push({ notification, timeout });
}

export function notifyLoading(title, message) {
  // Skip if this is a duplicate message
  if (isDuplicate(title, message)) {
    // Return a dummy controller for duplicate requests
    return {
      resolve: () => {},
      reject: () => {}
    };
  }

  clearNotifications();

  // Definir la promesa antes de utilizarla
  let controller;
  const promise = new Promise((resolve, reject) => {
    controller = { resolve, reject };  // Asigna el controlador a la promesa
  });

  const toast = push.promise(promise, {
    loading: { title, message },
    success: { title: 'Éxito', message: 'Operación completada' },
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
