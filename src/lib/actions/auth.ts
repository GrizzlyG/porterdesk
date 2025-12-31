"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { createSession } from "@/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Identifier and password are required" };
  }

  let user: any = null;

  // 1. Check if identifier is a matric number
  const studentProfile = await prisma.student.findUnique({
    where: { matricNumber: identifier },
    include: { user: true },
  });

  if (studentProfile) {
    user = studentProfile.user;
  } else {
    // 2. If not a matric number, check if it's an email for staff/admin
    user = await prisma.user.findUnique({
      where: { email: identifier },
      include: { studentProfile: true },
    });
  }

  if (!user) {
    return { error: "Invalid credentials" };
  }

  // 3. Verify password
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    return { error: "Invalid credentials" };
  }

  // 4. Create session
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await createSession({
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.studentProfile ? `${user.studentProfile.first_name} ${user.studentProfile.last_name}` : user.email,
  });

  // Redirect based on role
  if (user.role === "STUDENT") {
    redirect("/profile");
  } else {
    redirect("/dashboard");
  }
}