import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { get_dashboard } from "@/lib/controller/get_dashboard";
import { Status } from "@/lib/types";
import { Bed, Building, Building2, GraduationCap, Users } from "lucide-react";
import Link from "next/link";

const DashboardPage = async () => {
  const {
    hostelCount,
    blockCount,
    roomCount,
    managerCount,
    porterCount,
    studentCount,
    status,
  } = await get_dashboard();

  if (status !== Status.OK) {
    return <div className="p-6">Error loading dashboard data.</div>;
  }

  const stats = [
    {
      title: "Total Hostels",
      value: hostelCount || 0,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/dashboard/buildings",
    },
    {
      title: "Total Blocks",
      value: blockCount || 0,
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-100",
      href: "/dashboard/block",
    },
    {
      title: "Total Rooms",
      value: roomCount || 0,
      icon: Bed,
      color: "text-green-600",
      bg: "bg-green-100",
      href: "/dashboard/block",
    },
    {
      title: "Students",
      value: studentCount || 0,
      icon: GraduationCap,
      color: "text-orange-600",
      bg: "bg-orange-100",
      href: "/dashboard/students",
    },
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Link href={stat.href} key={index}>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 h-full" style={{ borderLeftColor: 'currentColor' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
