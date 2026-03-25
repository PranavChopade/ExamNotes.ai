import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { ENV } from "./ENV.js";

const firebaseConfig = {
  apiKey: ENV.apiKey,
  authDomain: ENV.authDomain,
  projectId: ENV.projectId,
  storageBucket: ENV.storageBucket,
  messagingSenderId: ENV.messagingSenderId,
  appId: ENV.appId
};

const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const Provider = new GoogleAuthProvider()