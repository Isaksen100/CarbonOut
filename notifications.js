const DEFAULT_ICON = './icons/logo-192.png';
const DEFAULT_BADGE = './icons/logo-192.png';

export async function enableNotifications() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export async function notify({ title, body = '', icon = DEFAULT_ICON, badge = DEFAULT_BADGE, tag = 'carbonout', vibrate = [80, 40, 80], data = {} } = {}) {
  if (Notification.permission !== 'granted') return;

  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    const options = {
      body,
      icon,
      badge,
      tag,
      renotify: true,
      vibrate,
      data
    };

    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch (e) {
    console.error('Error mostrando notificación:', e);
  }
}

export async function notifyPoints(points, extra = '') {
  const title = `¡Ganaste ${points} puntos!`;
  const body = extra || 'Sigue sumando acciones ecológicas 🌱';
  await notify({ title, body, tag: 'points' });
}