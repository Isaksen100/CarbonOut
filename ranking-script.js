import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elemento del DOM
const podiumContainer = document.getElementById("podium-container");

async function mostrarRanking() {
  try {
    const usuariosSnap = await getDocs(collection(db, "usuarios"));
    const accionesSnap = await getDocs(collection(db, "acciones"));

    // Mapa de UID => { nombre, puntos }
    const mapaUsuarios = {};

    // Inicializamos usuarios
    usuariosSnap.forEach(doc => {
      const data = doc.data();
      mapaUsuarios[data.uid] = {
        nombre: data.nombreUsuario || "Anónimo",
        puntos: 0
      };
    });

    // Sumamos los puntos de las acciones por UID
    accionesSnap.forEach(doc => {
      const data = doc.data();
      const uid = data.Usuario;
      const puntos = data.Puntos || 0;
      if (mapaUsuarios[uid]) {
        mapaUsuarios[uid].puntos += puntos;
      }
    });

    // Convertir en array y ordenar
    const listaRanking = Object.entries(mapaUsuarios)
      .map(([uid, info]) => ({ uid, ...info }))
      .sort((a, b) => b.puntos - a.puntos);

    const top3 = listaRanking.slice(0, 3);
    const restantes = listaRanking.slice(3);

    renderizarPodio(top3);
    renderizarTablaRestante(restantes);

    // Aplicar idioma
    const lang = localStorage.getItem("idioma") || "es";
    if (typeof cambiarIdioma === "function") {
      cambiarIdioma(lang);
    }
  } catch (error) {
    console.error("Error al mostrar ranking:", error);
    podiumContainer.innerHTML = `<p>Error al cargar el ranking.</p>`;
  }
}

// Mostrar podio
function renderizarPodio(top3) {
  if (!top3.length) {
    podiumContainer.innerHTML = "<p>No hay datos disponibles.</p>";
    return;
  }

  const segundo = top3[1] || {};
  const primero = top3[0] || {};
  const tercero = top3[2] || {};

  podiumContainer.innerHTML = `
    <div class="podium-place" style="order: 1;">
      <span class="emoji">🥈</span>
      <h2>${segundo.nombre}</h2>
      <div class="score">${segundo.puntos} pts</div>
    </div>
    <div class="podium-place gold-glow" style="order: 2;">
      <span class="emoji">🥇</span>
      <h2>${primero.nombre}</h2>
      <div class="score">${primero.puntos} pts</div>
    </div>
    <div class="podium-place" style="order: 3;">
      <span class="emoji">🥉</span>
      <h2>${tercero.nombre}</h2>
      <div class="score">${tercero.puntos} pts</div>
    </div>
  `;
}

// Mostrar tabla del 4° en adelante
function renderizarTablaRestante(usuarios) {
  if (!usuarios.length) return;

  const tabla = document.createElement("table");
  tabla.className = "ranking-table";
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th data-i18n="perfil">Nombre</th>
        <th data-i18n="puntosTotales">Puntos</th>
      </tr>
    </thead>
    <tbody>
      ${usuarios.map((user, i) => `
        <tr>
          <td>${i + 4}</td>
          <td>${user.nombre}</td>
          <td>${user.puntos}</td>
        </tr>
      `).join("")}
    </tbody>
  `;

  podiumContainer.insertAdjacentElement("afterend", tabla);
}

mostrarRanking();