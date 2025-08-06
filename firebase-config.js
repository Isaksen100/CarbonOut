import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfPRhVJD9TSwrR_ffBhXUDhELnDiAnC2M",
  authDomain: "carbonout-88749.firebaseapp.com",
  projectId: "carbonout-88749",
  storageBucket: "carbonout-88749.appspot.com",
  messagingSenderId: "378125062040",
  appId: "1:378125062040:web:e0b9f07079ed07ab34a5ed",
  measurementId: "G-1BCE0X6LGR"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exportaciones
export { firebaseConfig, auth, db };