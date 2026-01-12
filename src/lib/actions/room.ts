"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteRoom(roomId: string, hostelId: string, blockId: string) {
  try {
    await prisma.hostelRoom.delete({ where: { id: roomId } });
    revalidatePath(`/dashboard/buildings/${hostelId}/blocks/${blockId}`);
    return { success: true, message: "Room deleted successfully" };
  } catch (error) {
    console.error("Failed to delete room:", error);
    return { success: false, message: "Failed to delete room" };
  }
}

export async function createRoom(formData: FormData) {
  const roomNumber = formData.get("roomNumber") as string;
  const capacity = parseInt(formData.get("capacity") as string) || 4;
  const blockId = formData.get("blockId") as string;
  const hostelId = formData.get("hostelId") as string;

  try {
    // 1. Create the Room
    const room = await prisma.hostelRoom.create({
      data: {
        roomNumber,
        capacity,
        blockId,
      },
    });

    // 2. Auto-generate Bedspaces based on capacity
    const bedspacesData = Array.from({ length: capacity }, (_, i) => ({
      number: `${roomNumber}-${String.fromCharCode(65 + i)}`, // e.g. 101-A, 101-B
      roomId: room.id,
    }));

    await prisma.bedspace.createMany({
      data: bedspacesData,
    });

    revalidatePath(`/dashboard/buildings/${hostelId}/blocks/${blockId}`);
    return { success: true, message: "Room and bedspaces created successfully" };
  } catch (error) {
    console.error("Failed to create room:", error);
    return { success: false, message: "Failed to create room" };
  }
}

export async function assignStudent(formData: FormData) {
  const bedspaceId = formData.get("bedspaceId") as string;
  const studentId = parseInt(formData.get("studentId") as string);
  const path = formData.get("path") as string;

  if (!bedspaceId || isNaN(studentId)) {
    return { success: false, message: "Invalid data" };
  }

  try {
    // Check if student is already assigned
    const existingAssignment = await prisma.bedspace.findUnique({
      where: { studentId: studentId },
    });

    if (existingAssignment) {
      return { success: false, message: "Student is already assigned to a bedspace" };
    }

    await prisma.bedspace.update({
      where: { id: bedspaceId },
      data: {
        studentId: studentId,
        isOccupied: true,
      },
    });
    revalidatePath(path);
    return { success: true, message: "Student assigned successfully" };
  } catch (error) {
    console.error("Failed to assign student:", error);
    return { success: false, message: "Failed to assign student" };
  }
}

export async function removeStudent(formData: FormData) {
  const bedspaceId = formData.get("bedspaceId") as string;
  const path = formData.get("path") as string;

  try {
    await prisma.bedspace.update({
      where: { id: bedspaceId },
      data: {
        studentId: null,
        isOccupied: false,
      },
    });
    revalidatePath(path);
    return { success: true, message: "Student removed successfully" };
  } catch (error) {
    console.error("Failed to remove student:", error);
    return { success: false, message: "Failed to remove student" };
  }
}

export const addRoomAction = createRoom;