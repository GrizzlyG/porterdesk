import HostelForm from "@/components/Forms/HostelForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { Building, MapPin } from "lucide-react";
import Link from "next/link";

const BuildingsPage = async () => {
  const hostels = await prisma.hostel.findMany({
    include: {
      _count: {
        select: { blocks: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hostel Management</h1>
          <p className="text-gray-500 mt-1">Manage hostels, blocks, and rooms</p>
        </div>
        <HostelForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <Link href={`/dashboard/buildings/${hostel.id}`} key={hostel.id}>
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
                    Total Blocks
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    {hostel._count.blocks}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {hostels.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Building className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Hostels Found</h3>
            <p className="text-gray-500">Get started by creating a new hostel.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingsPage;