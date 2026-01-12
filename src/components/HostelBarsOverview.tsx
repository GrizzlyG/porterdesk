"use client";
import React from "react";
import { Card } from "../components/ui/card";
import { FaHotel } from "react-icons/fa";

export type HostelBarData = {
  id: string;
  name: string;
  blockCount: number;
  studentCount: number;
  bedspaceCount: number;
};

interface HostelBarsOverviewProps {
  hostels: HostelBarData[];
}

export default function HostelBarsOverview({ hostels }: HostelBarsOverviewProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4">Hostel Occupancy Overview</h2>
      <div className="space-y-6">
        {hostels.map((hostel) => {
          const percent = hostel.bedspaceCount > 0 ? Math.round((hostel.studentCount / hostel.bedspaceCount) * 100) : 0;
          return (
            <div key={hostel.id} className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <FaHotel className="text-2xl text-blue-600" />
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 border border-white">
                  {hostel.blockCount}
                </span>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium">{hostel.name}</div>
                <div className="w-full h-4 bg-gray-200 rounded mt-1 relative">
                  <div
                    className="h-4 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  >
                    {percent}%
                  </div>
                  {/* Show percent text outside if bar is too small */}
                  {percent < 15 && (
                    <span className="absolute left-2 top-0 h-4 flex items-center text-blue-700 text-xs font-bold">{percent}%</span>
                  )}
                </div>
              </div>
              <div className="ml-2 text-xs text-gray-700">
                {hostel.studentCount} students / {hostel.bedspaceCount} bedspaces ({percent}%)
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
