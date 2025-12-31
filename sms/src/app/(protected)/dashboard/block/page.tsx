import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { Building, MapPin } from "lucide-react";
import Link from "next/link";

const BlockViewPage = async () => {
  const hostels = await prisma.hostel.findMany({
    include: {
      _count: {
        select: { blocks: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hostel Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <Link href={`/dashboard/block/${hostel.id}`} key={hostel.id}>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-t-4 border-t-indigo-600 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {hostel.name}
                  </CardTitle>
                  <Building className="text-indigo-500 h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2 text-gray-600 mb-4 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{hostel.address || "No address provided"}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <span className="text-sm font-medium text-gray-600">
                    Blocks
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    {hostel._count.blocks}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlockViewPage;
