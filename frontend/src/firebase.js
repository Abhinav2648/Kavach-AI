import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMKly2ScfPpeUWmDxw-UqhFlFimT3nyC8",
  authDomain: "kavach-ai-83f6f.firebaseapp.com",
  projectId: "kavach-ai-83f6f",
  storageBucket: "kavach-ai-83f6f.firebasestorage.app",
  messagingSenderId: "97839830959",
  appId: "1:97839830959:web:8b356a491d0e9e925ac15a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);