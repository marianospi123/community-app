// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwsJws5KTSSXd-EOorVxjFcDcomT_AnGw",
  authDomain: "community-manager-7dbe0.firebaseapp.com",
  projectId: "community-manager-7dbe0",
  storageBucket: "community-manager-7dbe0.appspot.com", // ⚠ Asegúrate que sea ".appspot.com"
  messagingSenderId: "667659198464",
  appId: "1:667659198464:web:91c5e2b563dae7892cf8e5",
  measurementId: "G-YWM24X72FN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Auth, Firestore y Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 Esto faltaba
