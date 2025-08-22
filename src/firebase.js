import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";  // ✅ ใช้ Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBF5Fvt3lScB1Pzo_fmeYBlGIPAtW6FU58",
  authDomain: "teenovator-jod.firebaseapp.com",
  databaseURL: "https://teenovator-jod-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ ต้องใส่ databaseURL
  projectId: "teenovator-jod",
  storageBucket: "teenovator-jod.appspot.com",
  messagingSenderId: "517161494043",
  appId: "1:517161494043:web:e375f74a48c7e2fa54fabe"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);  // ✅ Realtime Database

export default app;
