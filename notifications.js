const DEFAULT_ICON = './icons/logo-192.png';
const DEFAULT_BADGE = './icons/logo-192.png';

// Detecta el idioma actual
function getIdiomaActual() {
  return localStorage.getItem("idioma") || "es";
}

// Traducciones de mensajes
const mensajesNotificacion = {
  es: {
    titulo: (p) => `¡Ganaste ${p} puntos!`,
    cuerpo: "Sigue sumando acciones ecológicas 🌱"
  },
  en: {
    titulo: (p) => `You earned ${p} points!`,
    cuerpo: "Keep adding eco-friendly actions 🌱"
  }
};

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

// Notificación específica al ganar puntos (soporta idioma)
export async function notifyPoints(points, extra = '') {
  const lang = getIdiomaActual();
  const t = mensajesNotificacion[lang] || mensajesNotificacion.es;

  const title = t.titulo(points);
  const body = extra || t.cuerpo;

  await notify({ title, body, tag: 'points' });
}