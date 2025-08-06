import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// REGISTRO DE USUARIO
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

// LOGIN
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

// LOGOUT
async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}

// Detectar sesión activa y actualizar botones
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const authContainer = document.getElementById("auth-container");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (authContainer) authContainer.style.display = "none";
    } else {
      if (logoutBtn) logoutBtn.style.display = "none";
      if (authContainer) authContainer.style.display = "flex";
    }
  });

  logoutBtn?.addEventListener("click", logout);
});

// Botones de acción
document.getElementById("btnSignup")?.addEventListener("click", registrarUsuario);
document.getElementById("login-btn")?.addEventListener("click", login);

export { registrarUsuario, login, logout };