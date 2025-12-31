import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { ArrowLeft, Bed } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const BlockRoomsViewPage = async ({ params }: { params: { hostelId: string; blockId: string } }) => {
  const block = await prisma.block.findUnique({
    where: { id: params.blockId },
    include: {
      hostel: true,
      rooms: {
        orderBy: { roomNumber: "asc" },
        include: {
          bedspaces: true,
        },
      },
    },
  });

  if (!block) return notFound();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/dashboard/block/${params.hostelId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {block.hostel.name}
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{block.name} - Rooms</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {block.rooms.map((room) => {
          const occupied = room.bedspaces.filter((b) => b.isOccupied).length;
          const capacity = room.capacity;
          const free = capacity - occupied;
          const occupancyRate = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
          
          let statusColor = "bg-green-50 border-green-200";
          if (occupied === capacity) statusColor = "bg-red-50 border-red-200";
          else if (occupied > 0) statusColor = "bg-yellow-50 border-yellow-200";

          return (
            <Link href={`/dashboard/block/${params.hostelId}/${block.id}/${room.id}`} key={room.id}>
              <Card className={`hover:shadow-md transition-all cursor-pointer border ${statusColor}`}>
                <CardHeader className="pb-2 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800">
                      Room {room.roomNumber}
                    </CardTitle>
                    <Bed className="text-gray-500 h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupied</span>
                    <span className="font-semibold">{occupied}/{capacity}</span>
                  </div>
                  {/* Bed/Bunk Occupancy Visualization */}
                  <div className="flex flex-col items-center gap-1 my-2">
                    {(() => {
                      const beds = room.bedspaces;
                      const isOdd = beds.length % 2 === 1;
                      // Special case for 3 beds: all down beds
                      if (beds.length === 3) {
                        return (
                          <div className="flex gap-2">
                            {beds.map((bed, idx) => (
                              <Bed key={bed.id} className={
                                bed.isOccupied ? "text-green-600" : "text-gray-400"
                              } size={24} />
                            ))}
                          </div>
                        );
                      }
                      // For other cases, group as bunks (2 per stack)
                      const topBeds = [];
                      const bottomBeds = [];
                      for (let i = 0; i < beds.length; i += 2) {
                        if (i + 1 < beds.length) {
                          // Bunk: top and bottom
                          topBeds.push(beds[i]);
                          bottomBeds.push(beds[i + 1]);
                        } else {
                          // Odd last bed: down bed
                          bottomBeds.push(beds[i]);
                        }
                      }
                      return (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2 justify-center">
                            {topBeds.map((bed) => (
                              <Bed key={bed.id + "-top"} className={
                                bed.isOccupied ? "text-green-600" : "text-gray-400"
                              } size={24} />
                            ))}
                          </div>
                          <div className="flex gap-2 justify-center">
                            {bottomBeds.map((bed) => (
                              <Bed key={bed.id + "-bottom"} className={
                                bed.isOccupied ? "text-green-600" : "text-gray-400"
                              } size={24} />
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 pt-1">
                    <span>{free} Free</span>
                    <span>{occupancyRate}%</span>
                  </div>
                  <div className="text-xs text-gray-400 pt-1 border-t mt-2">
                    0 Complaints
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BlockRoomsViewPage;
