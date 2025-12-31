import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const HostelBlockViewPage = async ({ params }: { params: { hostelId: string } }) => {
  const hostel = await prisma.hostel.findUnique({
    where: { id: params.hostelId },
    include: {
      blocks: {
        include: {
          rooms: {
            include: {
              bedspaces: true,
            },
          },
        },
      },
    },
  });

  if (!hostel) return notFound();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/block"
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Hostels
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{hostel.name} - Blocks</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostel.blocks.map((block) => {
          let totalCapacity = 0;
          let totalOccupied = 0;
          let freeRooms = 0;
          let fullRooms = 0;
          let partialRooms = 0;

          block.rooms.forEach((room) => {
            const occupied = room.bedspaces.filter((b) => b.isOccupied).length;
            const capacity = room.capacity;
            
            totalCapacity += capacity;
            totalOccupied += occupied;

            if (occupied === 0) freeRooms++;
            else if (occupied === capacity) fullRooms++;
            else partialRooms++;
          });

          const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

          return (
            <Link href={`/dashboard/block/${hostel.id}/${block.id}`} key={block.id}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <CardHeader className="pb-2 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {block.name}
                    </CardTitle>
                    <Building2 className="text-indigo-500 h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-100 p-2 rounded text-green-800">
                      <div className="font-bold text-lg">{freeRooms}</div>
                      <div>Free</div>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded text-yellow-800">
                      <div className="font-bold text-lg">{partialRooms}</div>
                      <div>Partial</div>
                    </div>
                    <div className="bg-red-100 p-2 rounded text-red-800">
                      <div className="font-bold text-lg">{fullRooms}</div>
                      <div>Full</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm pt-2 border-t">
                    <span className="text-gray-600">Occupancy</span>
                    <span className={`font-bold ${occupancyRate >= 90 ? 'text-red-600' : 'text-green-600'}`}>
                      {occupancyRate}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                       Complaints
                    </span>
                    <span className="font-bold text-gray-800">0</span>
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

export default HostelBlockViewPage;
