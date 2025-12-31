"use server";

import { FilterOptions } from "@/lib/types";
import prisma from "../db";
import { Status, User, UserRole } from "@prisma/client";

type GetStudentReturnProps = {
  students?: User[];
  status: Status;
};
export const get_students = async (
  filters: FilterOptions
): Promise<GetStudentReturnProps> => {
  try {
    const where = {
      role: UserRole.STUDENT,
      AND: [] as any[],
    };

    if (filters.q) {
      where.AND.push({ OR: [
        { studentProfile: { matricNumber: { contains: filters.q, mode: 'insensitive' } } },
        { studentProfile: { first_name: { contains: filters.q, mode: 'insensitive' } } },
        { studentProfile: { last_name: { contains: filters.q, mode: 'insensitive' } } },
      ]});
    }

    const students = await prisma.user.findMany({
      where,
      include: {
        studentProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { students: students as unknown as User[], status: Status.OK };
  } catch (error) {
    console.error(error);
    return { status: Status.INTERNAL_SERVER_ERROR };
  }
};

export const get_student_info = async (id: number) => {
  try {
    const [student, notices] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: id },
        include: {
          studentProfile: true,
        },
      }),
      prisma.notice.findMany({
        where: { visibleToStudents: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!student) {
      return { status: Status.NOT_FOUND };
    }
    return { student: student as unknown as User, notices, status: Status.OK };
  } catch (error) {
    return { status: Status.INTERNAL_SERVER_ERROR };
  }
};
