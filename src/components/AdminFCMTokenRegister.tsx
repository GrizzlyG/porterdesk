"use client";
import { useEffect } from "react";
import { getToken, getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const VAPID_KEY = "BGWFHwjVXDhtAmGDzLc6_wH43r-t56Qz31aD2PV1ZsF8NLWXvqj0byt8bPpTBaJlVmwpuDcoargnL3rgYm2N6aA";
const firebaseConfig = {
  apiKey: "AIzaSyBqwef0Pip-BI6lu578u9MgZ232Y3PlLXs",
  authDomain: "porterdesk-f514f.firebaseapp.com",
  projectId: "porterdesk-f514f",
  storageBucket: "porterdesk-f514f.firebasestorage.app",
  messagingSenderId: "207286962257",
  appId: "1:207286962257:web:d9b68d1371dfb901591070"
};

export default function AdminFCMTokenRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              fetch("/api/admin/save-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: currentToken }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (!data.success) {
                    console.error("Failed to save FCM token:", data.message);
                  }
                })
                .catch((err) => {
                  console.error("Error sending FCM token to backend:", err);
                });
            } else {
              console.warn("No registration token available. Request permission to generate one.");
            }
          })
          .catch((err) => {
            console.error("An error occurred while retrieving token. ", err);
          });
      }
    });
  }, []);
  return null;
}
