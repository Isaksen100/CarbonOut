import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elementos del DOM
const userNameEl = document.getElementById("user-name");
const userPointsEl = document.getElementById("user-points");
const accionesBody = document.getElementById("acciones-user-body");

const nuevoNombreInput = document.getElementById("nuevo-nombre");
const btnCambiarNombre = document.getElementById("btn-cambiar-nombre");
const msgCambioNombre = document.getElementById("msg-cambio-nombre");

const passActualInput = document.getElementById("password-actual");
const nuevaPassInput = document.getElementById("nueva-password");
const btnCambiarPassword = document.getElementById("btn-cambiar-password");
const msgCambioPassword = document.getElementById("msg-cambio-password");

const mostrarFormNombreBtn = document.getElementById("mostrar-form-nombre");
const mostrarFormPasswordBtn = document.getElementById("mostrar-form-password");

const formNombre = document.getElementById("form-nombre");
const formPassword = document.getElementById("form-password");

// Usuario actual
let currentUser = null;
let currentDocId = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const email = user.email;
    const uid = user.uid;
    let nombre = email;

    const usuariosSnap = await getDocs(collection(db, "usuarios"));
    usuariosSnap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.email === email) {
        nombre = data.nombreUsuario;
        currentDocId = docSnap.id;
      }
    });
    userNameEl.textContent = nombre;

    let totalPuntos = 0;
    const accionesQuery = query(collection(db, "acciones"), where("Usuario", "==", uid));
    const snapshot = await getDocs(accionesQuery);

    accionesBody.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      totalPuntos += data.Puntos || 0;
      accionesBody.innerHTML += `
        <tr>
          <td>${data.Tipo}</td>
          <td>${data.Fecha}</td>
        </tr>
      `;
    });

    userPointsEl.textContent = totalPuntos;
  } else {
    alert("Debes iniciar sesión para ver tu perfil");
    window.location.href = "login.html";
  }
});

// Mostrar formularios de cambio
mostrarFormNombreBtn?.addEventListener("click", () => {
  formNombre.style.display = "block";
  formPassword.style.display = "none";
});

mostrarFormPasswordBtn?.addEventListener("click", () => {
  formPassword.style.display = "block";
  formNombre.style.display = "none";
});

// Cambio de nombre
btnCambiarNombre?.addEventListener("click", async () => {
  const nuevoNombre = nuevoNombreInput.value.trim();
  if (!nuevoNombre || !currentDocId) return;

  try {
    await updateDoc(doc(db, "usuarios", currentDocId), { nombreUsuario: nuevoNombre });
    userNameEl.textContent = nuevoNombre;
    msgCambioNombre.textContent = "Nombre actualizado correctamente.";
    msgCambioNombre.style.color = "green";
  } catch (error) {
    msgCambioNombre.textContent = "Error al actualizar el nombre.";
    msgCambioNombre.style.color = "red";
  }
});

// Cambio de contraseña
btnCambiarPassword?.addEventListener("click", async () => {
  const actual = passActualInput.value.trim();
  const nueva = nuevaPassInput.value.trim();

  if (!actual || !nueva || !currentUser) return;

  const credential = EmailAuthProvider.credential(currentUser.email, actual);
  try {
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, nueva);
    msgCambioPassword.textContent = "Contraseña actualizada correctamente.";
    msgCambioPassword.style.color = "green";
  } catch (error) {
    msgCambioPassword.textContent = "Error al cambiar la contraseña. Verifica tu contraseña actual.";
    msgCambioPassword.style.color = "red";
  }
});