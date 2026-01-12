"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "../components/ui/card";

// Pie chart expects: [{ name: string, value: number }]
export default function DepartmentPieChart({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF6", "#FF6699", "#33CC99", "#FF6666", "#FFCC00", "#66CCFF",
    "#FFB347", "#B19CD9", "#77DD77", "#C23B22", "#FFD700", "#B6D7A8", "#E06666", "#6FA8DC", "#F6B26B", "#8E7CC3"
  ];
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4">Student Distribution by Department</h2>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
