"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createBlock(formData: FormData) {
  const name = formData.get("name") as string;
  const hostelId = formData.get("hostelId") as string;

  try {
    await prisma.block.create({
      data: {
        name,
        hostelId,
      },
    });
    revalidatePath(`/dashboard/buildings/${hostelId}`);
    return { success: true, message: "Block created successfully" };
  } catch (error) {
    console.error("Failed to create block:", error);
    return { success: false, message: "Failed to create block" };
  }
}