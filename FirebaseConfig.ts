import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDG818HhKBCyIzQ1-LSaMEnnF0W6eTF-9w",
  authDomain: "wellnex-23bff.firebaseapp.com",
  projectId: "wellnex-23bff",
  storageBucket: "wellnex-23bff.firebasestorage.app",
  messagingSenderId: "339150119901",
  appId: "1:339150119901:web:33083740ae4e4dcbdc4c34",
  measurementId: "G-EGPGQ56HG1",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Manually handle persistence using AsyncStorage
const storeAuthState = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store auth state:", error);
  }
};

const getStoredAuthState = async () => {
  try {
    const userData = await AsyncStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Failed to get auth state:", error);
    return null;
  }
};

// Listen for auth state changes and store user
FIREBASE_AUTH.onAuthStateChanged((user) => {
  if (user) {
    storeAuthState(user);
  } else {
    AsyncStorage.removeItem("user");
  }
});

export { FIREBASE_APP, FIREBASE_AUTH, getStoredAuthState };
