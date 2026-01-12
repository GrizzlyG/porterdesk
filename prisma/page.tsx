import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BuildingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Buildings</h2>
          <p className="text-muted-foreground">
            Manage school buildings, dormitories, and room allocations. Use this page to add new structures, update existing building details, and monitor occupancy levels.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Building
          </Button>
        </div>
      </div>
    </div>
  );
}