"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ChartOverview({ data }: {
  data: { name: string; count: number; href: string }[];
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>School Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barSize={40}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardContent>
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          {data.map((item) => (
            <Link key={item.name} href={item.href || "#"} className="text-indigo-600 underline hover:text-indigo-800 cursor-pointer text-sm">
              {item.name}: <span className="font-semibold">{item.count}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
