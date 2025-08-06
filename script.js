import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Registro
async function registrarUsuario() {
  const nombre = document.getElementById("signup-name")?.value.trim();
  const email = document.getElementById("signup-email")?.value.trim();
  const password = document.getElementById("signup-password")?.value.trim();
  const msg = document.getElementById('signupMsg');

  if (!nombre || !email || !password) {
    if (msg) {
      msg.textContent = "⚠️ Por favor, completa todos los campos.";
      msg.style.color = "red";
    }
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "usuarios", uid), {
      uid,
      email,
      nombreUsuario: nombre
    });

    if (msg) {
      msg.textContent = "🎉 ¡Usuario registrado con éxito!";
      msg.style.color = "green";
    }

    setTimeout(() => window.location.href = "login.html", 2000);
  } catch (error) {
    if (msg) {
      msg.textContent = "⚠️ " + error.message;
      msg.style.color = "red";
    }
    console.error(error);
  }
}

// Login
async function login() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value.trim();
  const msg = document.getElementById("loginMsg");

  if (!email || !password) {
    if (msg) {
      msg.textContent = "⚠️ Por favor, completa todos los campos.";
      msg.style.color = "red";
    }
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (msg) {
      msg.textContent = "✅ Sesión iniciada correctamente";
      msg.style.color = "green";
    }

    window.location.href = "index.html";
  } catch (error) {
    if (msg) {
      msg.textContent = "❌ Error: " + error.message;
      msg.style.color = "red";
    }
    console.error(error);
  }
}

// Logout
async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}

// Manejo de autenticación
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const authContainer = document.getElementById("auth-container");

  onAuthStateChanged(auth, (user) => {
    const isLoginPage = window.location.pathname.includes("login.html");
    const isSignupPage = window.location.pathname.includes("signup.html");

    if (user) {
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (authContainer) authContainer.style.display = "none";
    } else {
      if (logoutBtn) logoutBtn.style.display = "none";
      if (authContainer) authContainer.style.display = "flex";

      // Redirigir si está en index u otra protegida y no ha iniciado sesión
      const isProtected = !isLoginPage && !isSignupPage;
      if (isProtected) {
        window.location.href = "login.html";
      }
    }
  });

  logoutBtn?.addEventListener("click", logout);
});

// Botones de acción
document.getElementById("btnSignup")?.addEventListener("click", registrarUsuario);
document.getElementById("login-btn")?.addEventListener("click", login);

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(() => console.log('✅ SW registrado desde script.js'))
      .catch(err => console.error('❌ Error al registrar SW:', err));
  });
}

// Botón de instalación PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) {
    installBtn.style.display = 'inline-block';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          console.log('[PWA] ✅ Usuario aceptó instalación');
        } else {
          console.log('[PWA] ❌ Usuario canceló instalación');
        }
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
});

// Menú hamburguesa
document.getElementById('hamburger-btn')?.addEventListener('click', () => {
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.toggle('active');
});

export { registrarUsuario, login, logout };