import BedspaceAssignment from "@/components/Forms/BedspaceAssignment";
import RoomForm from "@/components/Forms/RoomForm";
import prisma from "@/lib/db";
import { ArrowLeft, Bed, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const BlockDetailsPage = async ({
  params,
}: {
  params: { id: string; blockId: string };
}) => {
  const block = await prisma.block.findUnique({
    where: { id: params.blockId },
    include: {
      hostel: true,
      rooms: {
        orderBy: { roomNumber: "asc" },
        include: {
          bedspaces: {
            orderBy: { number: "asc" },
            include: {
              student: true, // Include student info if assigned
            },
          },
        },
      },
    },
  });

  if (!block) {
    return notFound();
  }

  const availableStudents = await prisma.student.findMany({
    where: { bedspace: null },
    orderBy: { first_name: "asc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/dashboard/buildings/${params.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {block.hostel.name}
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          {block.name} - Rooms
        </h1>
        <p className="text-gray-500">Manage rooms and bedspaces</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bed className="h-5 w-5 text-indigo-600" />
            Room List
          </h2>
          <RoomForm blockId={block.id} hostelId={block.hostelId} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {block.rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 bg-gray-50 hover:border-indigo-200 transition-colors"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  Room {room.roomNumber}
                </h3>
                <span className="text-xs font-medium bg-white border px-2 py-1 rounded text-gray-600">
                  Capacity: {room.capacity}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {room.bedspaces.map((bed) => (
                  <div
                    key={bed.id}
                    className={`p-3 rounded border text-sm flex flex-col gap-1 ${
                      bed.isOccupied
                        ? "bg-indigo-100 border-indigo-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {bed.number}
                    </div>
                    <BedspaceAssignment
                      bedspace={bed}
                      availableStudents={availableStudents}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {block.rooms.length === 0 && (
            <div className="text-center py-8 text-gray-500 italic">
              No rooms added to this block yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockDetailsPage;