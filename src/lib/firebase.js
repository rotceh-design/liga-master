import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqBVQ4A_jI9FyJmbu5r_MPxpZVxfxHkVM",
  authDomain: "liga-master-b5b83.firebaseapp.com",
  projectId: "liga-master-b5b83",
  storageBucket: "liga-master-b5b83.firebasestorage.app",
  messagingSenderId: "138920480174",
  appId: "1:138920480174:web:d6dd39731d4f451c1a0c3f",
  measurementId: "G-46WBPVP4XS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar servicios para usarlos en el resto de la app
export const db = getFirestore(app);
export const auth = getAuth(app);