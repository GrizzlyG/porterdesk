import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const studentId = parseInt(params.id);
  if (isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
  }
  try {
    // Find the student to get the associated userId
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Deleting the user will cascade and delete the student profile
    await prisma.user.delete({
      where: { id: student.userId },
    });
    const redirectUrl = new URL('/dashboard/students', req.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
