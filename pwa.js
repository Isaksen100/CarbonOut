let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = '📲 Instalar CarbonOut';
  installBtn.className = 'install-btn';
  Object.assign(installBtn.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '0',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  });
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', async () => {
    installBtn.disabled = true;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`El usuario eligió: ${outcome}`);
    } finally {
      deferredPrompt = null;
      installBtn.remove();
    }
  });
});

window.addEventListener('appinstalled', () => {
  console.log('PWA instalada');
});