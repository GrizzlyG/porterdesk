"use server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { UserRole, UserStatus, GENDER, Level } from "@prisma/client";
import { getDepartmentFromMatric } from "../department_mapping";

interface ReturnProps {
  success: boolean;
  message: string;
}

export async function createStudent(formData: FormData) {
  const matricNumberStr = formData.get("matricNumber") as string;
  const phone = formData.get("phone") as string;

  if (!matricNumberStr || !phone) {
    return { success: false, message: "Matric Number and Phone Number are required." };
  }

  try {
    const existingStudent = await prisma.student.findFirst({
      where: { matricNumber: matricNumberStr },
    });

    if (existingStudent) {
      return { success: false, message: "Matric Number already exists" };
    }

    // Phone number is the password
    const hashedPassword = await bcrypt.hash(phone, 10);
    const email = `student${matricNumberStr.replace(/[^a-zA-Z0-9]/g, '')}@school.com`;
    const department = getDepartmentFromMatric(matricNumberStr.toString());

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        sex: GENDER.MALE, // Default value
        status: UserStatus.ACTIVE,
        phone: phone,
        address: "", // Default empty
        studentProfile: {
          create: {
            matricNumber: matricNumberStr,
            department: department || undefined,
          },
        },
      },
    });
    revalidatePath("/dashboard/students");
    return { success: true, message: "Student created successfully" };
  } catch (error) {
    console.error("Create student error:", error);
    return { success: false, message: "Failed to create student" };
  }
}

export async function registerStudent(prevState: any, formData: FormData): Promise<ReturnProps> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const matricNumberStr = formData.get("matricNumber") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const dob = formData.get("dob") as string;
  const level = formData.get("level") as Level;
  const sex = formData.get("sex") as GENDER;
  const address = formData.get("address") as string;

  // Basic validation
  if (!firstName || !lastName || !matricNumberStr || !phone || !password || !dob || !level || !sex || !address) {
    return { success: false, message: "All fields are required." };
  }

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { matricNumber: matricNumberStr },
    });

    if (existingStudent) {
      return { success: false, message: "Matric Number already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const email = `student${matricNumberStr.replace(/[^a-zA-Z0-9]/g, '')}@school.com`;
    const department = getDepartmentFromMatric(matricNumberStr);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        sex: sex,
        status: UserStatus.ACTIVE,
        phone: phone,
        address: address,
        studentProfile: {
          create: {
            first_name: firstName,
            last_name: lastName,
            matricNumber: matricNumberStr,
            dob: new Date(dob),
            level: level,
            profileComplete: true, // Profile is complete on self-registration
            department: department || undefined,
          },
        },
      },
    });

    return { success: true, message: "Registration successful! You can now log in." };
  } catch (error) {
    console.error("Register student error:", error);
    return { success: false, message: "Failed to register student." };
  }
}

export async function completeStudentProfile(prevState: any, formData: FormData): Promise<ReturnProps> {
  const userId = parseInt(formData.get("userId") as string);
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const dob = formData.get("dob") as string;
  const level = formData.get("level") as Level;
  const sex = formData.get("sex") as GENDER;
  const address = formData.get("address") as string;

  if (!userId || !firstName || !lastName || !phone || !dob || !level || !sex || !address) {
    return { success: false, message: "All fields are required." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        address,
        sex,
        studentProfile: {
          update: {
            first_name: firstName,
            last_name: lastName,
            dob: new Date(dob),
            level: level,
            profileComplete: true,
          }
        }
      }
    });

    revalidatePath('/profile');
    return { success: true, message: "Profile completed successfully!" };
  } catch (error) {
    console.error("Complete profile error:", error);
    return { success: false, message: "Failed to complete profile." };
  }
}
