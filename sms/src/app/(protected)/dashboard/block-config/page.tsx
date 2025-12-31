import BlockConfigurator from "@/components/BlockConfig/BlockConfigurator";
import prisma from "@/lib/db";

const BlockConfigPage = async () => {
  const hostels = await prisma.hostel.findMany({
    include: {
      blocks: {
        include: {
          rooms: {
            orderBy: { roomNumber: "asc" },
          },
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Block Configuration</h1>
      <p className="text-gray-500 mb-8">Bulk create rooms and manage bedspace capacities.</p>
      
      <BlockConfigurator hostels={hostels} />
    </div>
  );
};

export default BlockConfigPage;
