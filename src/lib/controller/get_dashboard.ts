import prisma from "../db";
import { Notice, Status, UserRole } from "../types";

type HostelBarData = {
  id: string;
  name: string;
  blockCount: number;
  studentCount: number;
  bedspaceCount: number;
};

type DasboardRetrunProps = {
  notices?: Notice[];
  hostelCount?: number;
  blockCount?: number;
  roomCount?: number;
  managerCount?: number;
  porterCount?: number;
  studentCount?: number;
  hostelsBarData?: HostelBarData[];
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
      hostelsBarDataRaw,
    ] = await prisma.$transaction([
      prisma.notice.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.hostel.count(),
      prisma.block.count(),
      prisma.hostelRoom.count(),
      prisma.user.count({ where: { status: "ACTIVE", role: "MANAGER" } }),
      prisma.user.count({ where: { status: "ACTIVE", role: "PORTER" } }),
      prisma.user.count({ where: { status: "ACTIVE", role: "STUDENT" } }),
      prisma.hostel.findMany({
        include: {
          blocks: {
            include: {
              rooms: {
                include: {
                  bedspaces: {
                    include: {
                      student: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    // Map hostelsBarDataRaw to { id, name, blockCount, studentCount, bedspaceCount }
    const hostelsBarData: HostelBarData[] = hostelsBarDataRaw.map(
      (hostel: any) => {
        let studentCount = 0;
        let bedspaceCount = 0;
        hostel.blocks.forEach((block: any) => {
          block.rooms?.forEach((room: any) => {
            room.bedspaces?.forEach((bed: any) => {
              bedspaceCount++;
              if (bed.student) studentCount++;
            });
          });
        });
        return {
          id: hostel.id,
          name: hostel.name,
          blockCount: hostel.blocks.length,
          studentCount,
          bedspaceCount,
        };
      }
    );

    return {
      notices,
      hostelCount,
      blockCount,
      roomCount,
      managerCount,
      porterCount,
      studentCount,
      hostelsBarData,
      status: Status.OK,
    };
  } catch (error) {
    return { status: Status.INTERNAL_SERVER_ERROR };
  }
}
