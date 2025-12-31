"use server";

import prisma from "../db";
import { Notice, Status } from "../types";

type NoticeReturnProps = {
  notices?: Notice[];
  status: Status;
};

export const get_notices = async ({
  take = 10,
}: {
  take?: number;
}): Promise<NoticeReturnProps> => {
  try {
    const notices = await prisma.notice.findMany({
      select: {
        id: true,
        headline: true,
        subhead: true,
        body: true,
        ps: true,
        imageUrl: true,
        fileUrl: true,
        visibleToManagers: true,
        visibleToPorters: true,
        visibleToStudents: true,
        type: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: take,
    });

    return { notices, status: Status.OK };
  } catch (error) {
    return { status: Status.INTERNAL_SERVER_ERROR };
  }
};

export const get_notice_info = async (
  id: string
): Promise<{ notice?: Notice; status: Status }> => {
  try {
    const notice = await prisma.notice.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        headline: true,
        subhead: true,
        body: true,
        ps: true,
        imageUrl: true,
        fileUrl: true,
        visibleToManagers: true,
        visibleToPorters: true,
        visibleToStudents: true,
        type: true,
        createdAt: true,
      },
    });
    if (!notice) {
      return { status: Status.NOT_FOUND };
    }

    return { notice, status: Status.OK };
  } catch (error) {
    return { status: Status.INTERNAL_SERVER_ERROR };
  }
};
