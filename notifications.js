const DEFAULT_ICON = './icons/logo-192.png';
const DEFAULT_BADGE = './icons/logo-192.png';

// Solicita permiso al usuario para mostrar notificaciones
export async function enableNotifications() {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

// Muestra una notificación usando el Service Worker o el API directo
export async function notify({
  title,
  body = '',
  icon = DEFAULT_ICON,
  badge = DEFAULT_BADGE,
  tag = 'carbonout',
  vibrate = [80, 40, 80],
  data = {}
} = {}) {
  if (!('Notification' in window)) return;

  if (Notification.permission !== 'granted') {
    const granted = await enableNotifications();
    if (!granted) return;
  }

  const options = {
    body,
    icon,
    badge,
    tag,
    renotify: true,
    vibrate,
    data
  };

  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch (e) {
    console.error('Error mostrando notificación:', e);
  }
}

// Notificación específica al ganar puntos
export async function notifyPoints(points, extra = '') {
  const title = `¡Ganaste ${points} puntos!`;
  const body = extra || 'Sigue sumando acciones ecológicas 🌱';
  await notify({ title, body, tag: 'points' });
}