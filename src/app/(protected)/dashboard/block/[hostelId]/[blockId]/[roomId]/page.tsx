import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { ArrowLeft, User, Bed } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

const RoomOccupantsViewPage = async ({ params }: { params: { hostelId: string; blockId: string; roomId: string } }) => {
  const room = await prisma.hostelRoom.findUnique({
    where: { id: params.roomId },
    include: {
      block: {
        include: {
          hostel: true
        }
      },
      bedspaces: {
        orderBy: { number: "asc" },
        include: {
          student: {
            include: {
              user: true // This is the user relation in student model
            }
          }
        }
      }
    }
  });

  if (!room) return notFound();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/dashboard/block/${params.hostelId}/${params.blockId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {room.block.name}
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Room {room.roomNumber} - Occupants</h1>
        <p className="text-gray-500">{room.block.hostel.name}, {room.block.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {room.bedspaces.map((bed) => (
          <Card key={bed.id} className={`border-t-4 ${bed.isOccupied ? 'border-t-indigo-600' : 'border-t-gray-300'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Bed {bed.number}
                </CardTitle>
                <Bed className={`h-5 w-5 ${bed.isOccupied ? 'text-indigo-500' : 'text-gray-400'}`} />
              </div>
            </CardHeader>
            <CardContent>
              {bed.student ? (
                <div className="flex items-center gap-4 mt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={bed.student.user?.img || "/image/noavatar.png"}
                      alt="Student"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {bed.student.first_name} {bed.student.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {bed.student.matricNumber}
                    </div>
                    <div className="text-xs text-indigo-600 mt-1">
                      {bed.student.type}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-400 italic flex flex-col items-center gap-2">
                  <User className="h-8 w-8 opacity-20" />
                  <span>Vacant</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomOccupantsViewPage;
