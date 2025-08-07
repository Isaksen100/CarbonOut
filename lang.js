const traducciones = {
  es: {
    // Navegación y generales
    inicio: "Inicio",
    irInicio: "Ir al inicio",
    acciones: "Acciones",
    ranking: "Ranking",
    nosotros: "Nosotros",
    perfil: "Perfil",
    login: "Login",
    signup: "Sign-up",
    registrarAccion: "Registrar acción",
    guardarAccion: "Guardar acción",
    cancelar: "Cancelar",
    cerrarSesion: "Cerrar sesión",
    instalarApp: "📲 Instalar App",
    notificaciones: "🔔 Notificaciones",

    // Formularios
    correo: "Correo electrónico",
    contrasena: "Contraseña",
    nombre: "Nombre completo",
    signup: "Registrarse",
    login: "Inicia sesión",
    yaCuenta: "¿Ya tienes cuenta?",
    noCuenta: "¿No tienes cuenta?",
    tipoPlaceholder: "¿Qué hiciste?",

    // Secciones
    miPerfil: "Mi Perfil",
    puntosTotales: "Puntos totales:",
    misAcciones: "Mis Acciones",
    categoria: "Categoría",
    tipo: "Tipo",
    fecha: "Fecha",
    tituloIndex: "CarbonOut - Acción por el Clima",
    tituloRanking: "Ranking Ecológico",
    tituloAcciones: "Explora Acciones Ecológicas",
    textoAcciones: "Elige una categoría y empieza a mejorar tu impacto ambiental hoy mismo.",
    sobreNosotros: "Sobre CarbonOut",
    mision: "Misión",
    misionTexto: "Concientizar y facilitar la reducción de la huella de carbono personal mediante tecnología accesible y divertida.",
    vision: "Visión",
    visionTexto: "Ser una plataforma líder en educación ambiental digital, motivando acciones sostenibles diarias.",
    proposito: "Propósito",
    propositoTexto: "Empoderar a cada persona para actuar contra el cambio climático.",
    pie: "© 2025 CarbonOut. Todos los derechos reservados.",
    conAmor: "Con amor verde 💚 por el planeta — 2025",
    restoRanking: "Otros participantes",
    nombre: "Nombre",
    puntos: "Puntos",

    // Tarjetas
    textoCardTransporte: "Descubre cómo reducir emisiones al moverte.",
    textoCardEnergia: "Ahorra energía en casa con pequeños cambios.",
    textoCardAlimentacion: "Adopta hábitos alimenticios más sostenibles.",
    textoCardConsumo: "Reduce, reutiliza y elige productos responsables.",
    tituloCardTransporte: "Transporte",
    tituloCardEnergia: "Energía",
    tituloCardAlimentacion: "Alimentación",
    tituloCardConsumo: "Consumo",

    // Cambios de perfil
    cambiarNombre: "Cambiar nombre",
    cambiarContrasena: "Cambiar contraseña",
    nuevoNombre: "Nuevo nombre",
    nombreActual: "Nombre actual",
    contrasenaActual: "Contraseña actual",
    nuevaContrasena: "Nueva contraseña",
    confirmarContrasena: "Confirmar nueva contraseña",
    guardarCambios: "Guardar cambios",
    cambiosGuardados: "Cambios guardados exitosamente",
    errorActualizacion: "Error al actualizar los datos",
    contrasenaIncorrecta: "Contraseña actual incorrecta",
    contrasenasNoCoinciden: "Las contraseñas no coinciden"
  },
  en: {
    // Navigation and general
    inicio: "Home",
    irInicio: "Go to Home",
    acciones: "Actions",
    ranking: "Ranking",
    nosotros: "About",
    perfil: "Profile",
    login: "Login",
    signup: "Sign-up",
    registrarAccion: "Log action",
    guardarAccion: "Save action",
    cancelar: "Cancel",
    cerrarSesion: "Log out",
    instalarApp: "📲 Install App",
    notificaciones: "🔔 Notifications",

    // Forms
    correo: "Email",
    contrasena: "Password",
    nombre: "Full name",
    signup: "Sign up",
    login: "Login",
    yaCuenta: "Already have an account?",
    noCuenta: "Don't have an account?",
    tipoPlaceholder: "What did you do?",

    // Sections
    miPerfil: "My Profile",
    puntosTotales: "Total points:",
    misAcciones: "My Actions",
    categoria: "Category",
    tipo: "Type",
    fecha: "Date",
    tituloIndex: "CarbonOut - Climate Action",
    tituloRanking: "Eco Ranking",
    tituloAcciones: "Explore Eco Actions",
    textoAcciones: "Choose a category and start improving your environmental impact today.",
    sobreNosotros: "About CarbonOut",
    mision: "Mission",
    misionTexto: "Raise awareness and facilitate the reduction of personal carbon footprint through accessible and fun technology.",
    vision: "Vision",
    visionTexto: "Be a leading platform in digital environmental education, motivating daily sustainable actions.",
    proposito: "Purpose",
    propositoTexto: "Empower every person to act against climate change.",
    pie: "© 2025 CarbonOut. All rights reserved.",
    conAmor: "With green love 💚 for the planet — 2025",
    restoRanking: "Other participants",
    nombre: "Name",
    puntos: "Points",

    // Cards
    textoCardTransporte: "Discover how to reduce emissions while commuting.",
    textoCardEnergia: "Save energy at home with small changes.",
    textoCardAlimentacion: "Adopt more sustainable eating habits.",
    textoCardConsumo: "Reduce, reuse and choose responsible products.",
    tituloCardTransporte: "Transport",
    tituloCardEnergia: "Energy",
    tituloCardAlimentacion: "Food",
    tituloCardConsumo: "Consumption",

    // Profile updates
    cambiarNombre: "Change name",
    cambiarContrasena: "Change password",
    nuevoNombre: "New name",
    nombreActual: "Current name",
    contrasenaActual: "Current password",
    nuevaContrasena: "New password",
    confirmarContrasena: "Confirm new password",
    guardarCambios: "Save changes",
    cambiosGuardados: "Changes saved successfully",
    errorActualizacion: "Error updating data",
    contrasenaIncorrecta: "Incorrect current password",
    contrasenasNoCoinciden: "Passwords do not match"
  }
};

function cambiarIdioma(lang) {
  localStorage.setItem("idioma", lang);

  // Cambiar innerText según data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (traducciones[lang][key]) {
      el.innerText = traducciones[lang][key];
    }
  });

  // Cambiar placeholder según data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (traducciones[lang][key]) {
      el.placeholder = traducciones[lang][key];
    }
  });
}

function iniciarIdioma() {
  const lang = localStorage.getItem("idioma") || "es";
  cambiarIdioma(lang);

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.textContent = lang === "es" ? "EN" : "ES";
    toggle.addEventListener("click", () => {
      const nuevo = lang === "es" ? "en" : "es";
      localStorage.setItem("idioma", nuevo);
      location.reload(); // Recargar para aplicar cambios
    });
  }
}

document.addEventListener("DOMContentLoaded", iniciarIdioma);