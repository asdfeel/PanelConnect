import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI246Ppdz4ZDh-ObZz85OWu5ha4KjSE2k",
  authDomain: "panel-connect-app.firebaseapp.com",
  projectId: "panel-connect-app",
  storageBucket: "panel-connect-app.firebasestorage.app",
  messagingSenderId: "802183418145",
  appId: "1:802183418145:web:9517967cbd563ad7d42e60",
  measurementId: "G-MP7Z0NZZ0P"
};

// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

let analytics;
if (typeof window !== 'undefined' && isAnalyticsSupported()) {
  analytics = getAnalytics(firebaseApp);
}

export { firebaseApp, db, auth, analytics };