import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { get_dashboard } from "@/lib/controller/get_dashboard";
import { Status } from "@/lib/types";
import { Users } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const HostelBarsOverview = dynamic(
  () => import("../../../components/HostelBarsOverview").then(m => m.default),
  { ssr: false }
);

const DashboardPage = async () => {
  const {
    managerCount,
    porterCount,
    status,
    hostelsBarData,
  } = await get_dashboard();

  if (status !== Status.OK) {
    return <div className="p-6">Error loading dashboard data.</div>;
  }

  const stats = [
    {
      title: "Staff",
      value: (managerCount || 0) + (porterCount || 0),
      icon: Users,
      color: "text-pink-600",
      bg: "bg-pink-100",
      href: "/dashboard/staff",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>


      {/* Hostel bars overview (client component) */}
      {hostelsBarData && hostelsBarData.length > 0 && (
        <div className="my-8">
          <HostelBarsOverview
            hostels={hostelsBarData}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Link href={stats[0].href}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 h-full"
            style={{ borderLeftColor: stats[0].color }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stats[0].title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stats[0].bg}`}>
                <Users className={`h-4 w-4 ${stats[0].color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats[0].value}</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
