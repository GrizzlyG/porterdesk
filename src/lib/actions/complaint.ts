"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendPushNotificationToAdmin } from "@/lib/sendPushNotificationToAdmin";

export async function createComplaint(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const studentIdRaw = formData.get("studentId") as string;

  if (!title || !description || !studentIdRaw) {
    return { success: false, message: "Invalid data" };
  }

  const studentId = parseInt(studentIdRaw);
  if (isNaN(studentId)) {
    return { success: false, message: "Invalid student ID" };
  }

  try {
    await prisma.complaint.create({
      data: {
        title,
        description,
        studentId,
        status: "PENDING",
      },
    });

    // Send push notification to admin
    await sendPushNotificationToAdmin({ title, description });

    revalidatePath("/admin/complaints");
    revalidatePath("/dashboard/complaints");
    return { success: true, message: "Complaint submitted successfully" };
  } catch (error) {
    console.error("Failed to create complaint:", error);
    return { success: false, message: "Failed to submit complaint" };
  }
}

export async function updateComplaintStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  try {
    await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    revalidatePath("/admin/complaints");
    return { success: true, message: "Complaint status updated" };
  } catch (error) {
    console.error("Failed to update complaint:", error);
    return { success: false, message: "Failed to update complaint status" };
  }
}

export async function deleteComplaint(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await prisma.complaint.delete({ where: { id: parseInt(id) } });
    revalidatePath("/admin/complaints");
    revalidatePath("/dashboard/complaints");
    revalidatePath("/dashboard/complaints");
    return { success: true, message: "Complaint deleted successfully" };
  } catch (error) {
    console.error("Failed to delete complaint:", error);
    return { success: false, message: "Failed to delete complaint" };
  }
}