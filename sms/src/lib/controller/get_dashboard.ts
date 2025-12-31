import prisma from "../db";
import { Notice, Status, UserRole } from "../types";

type DasboardRetrunProps = {
  notices?: Notice[];
  hostelCount?: number;
  blockCount?: number;
  roomCount?: number;
  managerCount?: number;
  porterCount?: number;
  studentCount?: number;
  status: Status;
};

export async function get_dashboard(): Promise<DasboardRetrunProps> {
  try {
    const today = new Date();

    const [
      notices,
      hostelCount,
      blockCount,
      roomCount,
      managerCount,
      porterCount,
      studentCount,
    ] = await prisma.$transaction([
      prisma.notice.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
      prisma.hostel.count(),
      prisma.block.count(),
      prisma.hostelRoom.count(),
      prisma.user.count({ where: { status: "ACTIVE", role: "MANAGER" } }),
      prisma.user.count({ where: { status: "ACTIVE", role: "PORTER" } }),
      prisma.user.count({ where: { status: "ACTIVE", role: "STUDENT" } }),
    ]);

    return {
      notices,
      hostelCount,
      blockCount,
      roomCount,
      managerCount,
      porterCount,
      studentCount,
      status: Status.OK,
    };
  } catch (error) {
    return { status: Status.INTERNAL_SERVER_ERROR };
  }
}
