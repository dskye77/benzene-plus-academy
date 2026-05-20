import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// (optional) import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAdt1BfYiVVXUS6c4mxslh2N3LYi5TFrHg",
  authDomain: "benzene-plus-academy.firebaseapp.com",
  projectId: "benzene-plus-academy",
  storageBucket: "benzene-plus-academy.firebasestorage.app",
  messagingSenderId: "564142562790",
  appId: "1:564142562790:web:4bbfd9be8b061065024a27",
  measurementId: "G-FR5P8XFREC",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);