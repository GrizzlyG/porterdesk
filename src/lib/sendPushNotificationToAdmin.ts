import fetch from "node-fetch";
import prisma from "@/lib/db";

export async function sendPushNotificationToAdmin({ title, description }) {
  // Get admin token from DB
  const adminToken = await prisma.adminToken.findUnique({ where: { id: 1 } });
  console.log("Admin FCM token:", adminToken?.token);
  if (!adminToken?.token) {
    console.warn("No admin FCM token found in DB.");
    return;
  }

  const message = {
    to: adminToken.token,
    notification: {
      title: "New Complaint Submitted",
      body: `${title}: ${description}`.slice(0, 100),
    },
  };

  const SERVER_KEY = process.env.FCM_SERVER_KEY;
  console.log("Sending FCM message:", message);

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${SERVER_KEY}`,
    },
    body: JSON.stringify(message),
  });
  let result;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }
  console.log("FCM response:", result);
}
