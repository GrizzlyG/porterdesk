"use server";

import prisma from "@/lib/db";
import { NoticeType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";

export async function createNotice(formData: FormData) {
  const headline = formData.get("headline") as string;
  const subhead = formData.get("subhead") as string | null;
  const body = formData.get("body") as string;
  const ps = formData.get("ps") as string | null;
  const type = formData.get("type") as NoticeType;

  // Handle visibility checkboxes
  const visibleToManagers = formData.get("visibleToManagers") === "on";
  const visibleToPorters = formData.get("visibleToPorters") === "on";
  const visibleToStudents = formData.get("visibleToStudents") === "on";

  // Handle file/image uploads
  const imageFile = formData.get("image") as File | null;
  const uploadFile = formData.get("file") as File | null;
  let imageUrl: string | null = null;
  let fileUrl: string | null = null;

  // Save image if present
  if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
    const imageExt = path.extname(imageFile.name);
    const imageName = `notice-image-${Date.now()}${imageExt}`;
    const imagePath = path.join("public", "uploads", imageName);
    const arrayBuffer = await imageFile.arrayBuffer();
    await fs.writeFile(imagePath, new Uint8Array(arrayBuffer));
    imageUrl = `/uploads/${imageName}`;
  }
  // Save file if present
  if (uploadFile && typeof uploadFile !== "string" && uploadFile.size > 0) {
    const fileExt = path.extname(uploadFile.name);
    const fileName = `notice-file-${Date.now()}${fileExt}`;
    const filePath = path.join("public", "uploads", fileName);
    const arrayBuffer = await uploadFile.arrayBuffer();
    await fs.writeFile(filePath, new Uint8Array(arrayBuffer));
    fileUrl = `/uploads/${fileName}`;
  }

  if (!headline || !body || !type) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    await prisma.notice.create({
      data: {
        headline,
        subhead: subhead || undefined,
        body,
        ps: ps || undefined,
        imageUrl,
        fileUrl,
        type,
        visibleToManagers,
        visibleToPorters,
        visibleToStudents,
      },
    });
    revalidatePath("/dashboard/notices");
    revalidatePath("/home");
    return { success: true, message: "Notice created successfully" };
  } catch (error) {
    console.error("Failed to create notice:", error);
    return { success: false, message: "Failed to create notice" };
  }
}