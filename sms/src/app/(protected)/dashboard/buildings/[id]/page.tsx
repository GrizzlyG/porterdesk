import BlockForm from "@/components/Forms/BlockForm";
import prisma from "@/lib/db";
import { ArrowLeft, Building2, Home } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const HostelDetailsPage = async ({ params }: { params: { id: string } }) => {
  const hostel = await prisma.hostel.findUnique({
    where: { id: params.id },
    include: {
      blocks: {
        include: {
          _count: {
            select: { rooms: true },
          },
        },
      },
    },
  });

  if (!hostel) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/buildings"
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Hostels
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{hostel.name}</h1>
        <p className="text-gray-500">{hostel.address}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Blocks Configuration
          </h2>
          <BlockForm hostelId={hostel.id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostel.blocks.map((block) => (
            <Link
              href={`/dashboard/buildings/${hostel.id}/blocks/${block.id}`}
              key={block.id}
            >
              <div className="border rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer bg-gray-50 h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{block.name}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {block._count.rooms} Rooms
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Click to manage rooms
                </div>
              </div>
            </Link>
          ))}
          {hostel.blocks.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500 italic">
              No blocks added yet. Add a block to start configuring rooms.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelDetailsPage;