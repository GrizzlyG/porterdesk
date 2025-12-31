"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { UserRole, UserStatus, GENDER } from "@prisma/client";

export async function createStaff(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const sex = formData.get("sex") as GENDER;

  if (!id || !firstName || !lastName || !password || !role) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return { success: false, message: "User ID already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a dummy email based on ID since email is required by schema
    const email = `staff${id}@school.com`;

    await prisma.user.create({
      data: {
        id,
        email,
        password: hashedPassword,
        role,
        sex: sex || GENDER.MALE,
        status: UserStatus.ACTIVE,
        phone: phone || "N/A",
        address: address || "N/A",
        lastLogin: new Date(),
      },
    });

    revalidatePath("/dashboard/staff");
    return { success: true, message: "Staff account created successfully" };
  } catch (error) {
    console.error("Create staff error:", error);
    return { success: false, message: "Failed to create staff account" };
  }
}