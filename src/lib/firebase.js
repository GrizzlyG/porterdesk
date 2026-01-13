// firebase.js
import { initializeApp } from "firebase/app";
// Do not import getMessaging here; only import in client-only components

const firebaseConfig = {
  apiKey: "AIzaSyBqwef0Pip-BI6lu578u9MgZ232Y3PlLXs",
  authDomain: "porterdesk-f514f.firebaseapp.com",
  projectId: "porterdesk-f514f",
  storageBucket: "porterdesk-f514f.firebasestorage.app",
  messagingSenderId: "207286962257",
  appId: "1:207286962257:web:d9b68d1371dfb901591070"
};

const app = initializeApp(firebaseConfig);

export { app };