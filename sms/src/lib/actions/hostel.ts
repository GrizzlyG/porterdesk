"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createHostel(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;

  try {
    await prisma.hostel.create({
      data: {
        name,
        address,
      },
    });
    revalidatePath("/dashboard/buildings");
    return { success: true, message: "Hostel created successfully" };
  } catch (error) {
    console.error("Failed to create hostel:", error);
    return { success: false, message: "Failed to create hostel" };
  }
}