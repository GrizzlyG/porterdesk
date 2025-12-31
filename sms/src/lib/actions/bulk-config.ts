"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function bulkCreateRooms(formData: FormData) {
  const blockId = formData.get("blockId") as string;
  const hostelId = formData.get("hostelId") as string;
  const numberOfRooms = parseInt(formData.get("numberOfRooms") as string);
  const startRoomNumber = parseInt(formData.get("startRoomNumber") as string);
  const capacity = parseInt(formData.get("capacity") as string);

  if (!blockId || !numberOfRooms || isNaN(startRoomNumber)) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < numberOfRooms; i++) {
        const currentRoomNum = startRoomNumber + i;
        const roomNumberStr = currentRoomNum.toString();

        // Check if room exists to avoid duplicates
        const existing = await tx.hostelRoom.findFirst({
          where: { blockId, roomNumber: roomNumberStr },
        });

        if (existing) continue;

        const room = await tx.hostelRoom.create({
          data: {
            blockId,
            roomNumber: roomNumberStr,
            capacity,
          },
        });

        // Create bedspaces
        for (let j = 0; j < capacity; j++) {
          await tx.bedspace.create({
            data: {
              roomId: room.id,
              number: `${roomNumberStr}-${String.fromCharCode(65 + j)}`,
            },
          });
        }
      }
    });

    revalidatePath("/dashboard/block-config");
    return { success: true, message: "Rooms created successfully" };
  } catch (error) {
    console.error("Bulk create rooms error:", error);
    return { success: false, message: "Failed to create rooms" };
  }
}

export async function bulkUpdateBedspaces(formData: FormData) {
  const roomIdsRaw = formData.get("roomIds") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const hostelId = formData.get("hostelId") as string;

  if (!roomIdsRaw || !capacity)
    return { success: false, message: "Invalid data" };

  const roomIds = JSON.parse(roomIdsRaw) as string[];

  try {
    await prisma.$transaction(async (tx) => {
      for (const roomId of roomIds) {
        const room = await tx.hostelRoom.findUnique({
          where: { id: roomId },
          include: { bedspaces: true },
        });

        if (!room) continue;

        await tx.hostelRoom.update({
          where: { id: roomId },
          data: { capacity },
        });

        const currentCount = room.bedspaces.length;

        if (currentCount < capacity) {
          // Add more bedspaces
          const toAdd = capacity - currentCount;
          for (let k = 0; k < toAdd; k++) {
            const charCode = 65 + currentCount + k;
            await tx.bedspace.create({
              data: {
                roomId,
                number: `${room.roomNumber}-${String.fromCharCode(charCode)}`,
              },
            });
          }
        } else if (currentCount > capacity) {
          // Remove excess bedspaces (only unoccupied)
          const toRemove = currentCount - capacity;
          const unoccupied = room.bedspaces.filter((b) => !b.isOccupied);
          // Sort reverse alphabetical to remove from end (e.g. remove D, C...)
          unoccupied.sort((a, b) => b.number.localeCompare(a.number));

          for (let k = 0; k < toRemove && k < unoccupied.length; k++) {
            await tx.bedspace.delete({ where: { id: unoccupied[k].id } });
          }
        }
      }
    });
    revalidatePath("/dashboard/block-config");
    return { success: true, message: "Bedspaces updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update bedspaces" };
  }
}

export async function bulkDeleteRooms(formData: FormData) {
  const roomIdsRaw = formData.get("roomIds") as string;

  if (!roomIdsRaw) return { success: false, message: "No rooms selected" };

  const roomIds = JSON.parse(roomIdsRaw) as string[];

  try {
    await prisma.hostelRoom.deleteMany({
      where: {
        id: { in: roomIds },
      },
    });
    revalidatePath("/dashboard/block-config");
    return { success: true, message: "Rooms deleted successfully" };
  } catch (error) {
    console.error("Bulk delete rooms error:", error);
    return { success: false, message: "Failed to delete rooms" };
  }
}