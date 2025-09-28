import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 기본 Firebase 프로젝트 설정
const primaryFirebaseConfig = {
  apiKey: "AIzaSyCI246Ppdz4ZDh-ObZz85OWu5ha4KjSE2k",
  authDomain: "panel-connect-app.firebaseapp.com",
  projectId: "panel-connect-app",
  storageBucket: "panel-connect-app.firebasestorage.app",
  messagingSenderId: "802183418145",
  appId: "1:802183418145:web:9517967cbd563ad7d42e60",
  measurementId: "G-MP7Z0NZZ0P"
};

// 여기에 두 번째 Firebase 프로젝트의 설정을 추가하세요.
const secondaryFirebaseConfig = {
  apiKey: "AIzaSyC6TfQQUZVquFHK76CNwNRFJCTc9bvUoNg",
  authDomain: "studio-2849154483-c5aae.firebaseapp.com",
  projectId: "studio-2849154483-c5aae",
  storageBucket: "studio-2849154483-c5aae.firebasestorage.app",
  messagingSenderId: "405891973902",
  appId: "G-4ZDSRZTRT1"
};


// Firebase 앱 초기화
// 기본 앱 초기화 (이름을 지정하여 명시적으로 관리)
let primaryApp;
if (!getApps().some(app => app.name === '[DEFAULT]')) {
  primaryApp = initializeApp(primaryFirebaseConfig);
} else {
  primaryApp = getApp();
}

// 두 번째 앱 초기화
let secondaryApp;
if (!getApps().some(app => app.name === 'secondary')) {
  secondaryApp = initializeApp(secondaryFirebaseConfig, 'secondary');
} else {
  secondaryApp = getApp('secondary');
}


const db = getFirestore(primaryApp);
const auth = getAuth(primaryApp);
const secondaryDb = getFirestore(secondaryApp);

export { db, auth, secondaryDb };