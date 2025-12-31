"use client";

import { bulkCreateRooms, bulkDeleteRooms, bulkUpdateBedspaces } from "@/lib/actions/bulk-config";
import { useState } from "react";
import { useFormStatus } from "react-dom";

// Types for props
type Room = { id: string; roomNumber: string; capacity: number };
type Block = { id: string; name: string; rooms: Room[] };
type Hostel = { id: string; name: string; blocks: Block[] };

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400 w-full"
    >
      {pending ? "Processing..." : label}
    </button>
  );
};

export default function BlockConfigurator({ hostels }: { hostels: Hostel[] }) {
  const [selectedHostelId, setSelectedHostelId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  const selectedHostel = hostels.find((h) => h.id === selectedHostelId);
  const selectedBlock = selectedHostel?.blocks.find(
    (b) => b.id === selectedBlockId
  );

  const toggleRoom = (roomId: string) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const toggleAllRooms = () => {
    if (!selectedBlock) return;
    if (selectedRoomIds.length === selectedBlock.rooms.length) {
      setSelectedRoomIds([]);
    } else {
      setSelectedRoomIds(selectedBlock.rooms.map((r) => r.id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Selection Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Hostel
          </label>
          <select
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            value={selectedHostelId}
            onChange={(e) => {
              setSelectedHostelId(e.target.value);
              setSelectedBlockId("");
              setSelectedRoomIds([]);
            }}
          >
            <option value="">-- Select Hostel --</option>
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Block
          </label>
          <select
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            value={selectedBlockId}
            onChange={(e) => {
              setSelectedBlockId(e.target.value);
              setSelectedRoomIds([]);
            }}
            disabled={!selectedHostelId}
          >
            <option value="">-- Select Block --</option>
            {selectedHostel?.blocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedBlock && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bulk Create Rooms */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Bulk Create Rooms
            </h2>
            <form action={bulkCreateRooms} className="space-y-4">
              <input type="hidden" name="hostelId" value={selectedHostelId} />
              <input type="hidden" name="blockId" value={selectedBlockId} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rooms to Create
                </label>
                <input name="numberOfRooms" type="number" min="1" required className="w-full border p-2 rounded" placeholder="e.g. 10" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Starting Room Number
                </label>
                <input name="startRoomNumber" type="number" required className="w-full border p-2 rounded" placeholder="e.g. 101" />
                <p className="text-xs text-gray-500 mt-1">Rooms will be numbered sequentially (101, 102, ...)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Capacity
                </label>
                <input name="capacity" type="number" min="1" defaultValue="4" required className="w-full border p-2 rounded" />
              </div>

              <SubmitButton label="Create Rooms" />
            </form>
          </div>

          {/* Bulk Configure Bedspaces */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Bulk Configure Bedspaces
            </h2>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-gray-700">Select Rooms</label>
                <button type="button" onClick={toggleAllRooms} className="text-sm text-indigo-600 hover:underline">
                  {selectedRoomIds.length === selectedBlock.rooms.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="border rounded p-2 max-h-60 overflow-y-auto grid grid-cols-3 gap-2">
                {selectedBlock.rooms.length === 0 && <p className="text-gray-500 text-sm col-span-3 text-center py-4">No rooms found.</p>}
                {selectedBlock.rooms.map((room) => (
                  <label key={room.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input type="checkbox" checked={selectedRoomIds.includes(room.id)} onChange={() => toggleRoom(room.id)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                    <span>{room.roomNumber} <span className="text-gray-400">({room.capacity})</span></span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{selectedRoomIds.length} rooms selected</p>
            </div>

            <form action={async (formData) => { await bulkUpdateBedspaces(formData); setSelectedRoomIds([]); }} className="space-y-4">
              <input type="hidden" name="hostelId" value={selectedHostelId} />
              <input type="hidden" name="roomIds" value={JSON.stringify(selectedRoomIds)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Capacity for Selected Rooms</label>
                <input name="capacity" type="number" min="1" required className="w-full border p-2 rounded" placeholder="e.g. 6" />
                <p className="text-xs text-red-500 mt-1">Warning: Reducing capacity will remove unoccupied bedspaces.</p>
              </div>
              <SubmitButton label="Update Bedspaces" />
            </form>

            <form
              action={async (formData) => {
                if (confirm(`Are you sure you want to delete ${selectedRoomIds.length} rooms? This action cannot be undone.`)) {
                  await bulkDeleteRooms(formData);
                  setSelectedRoomIds([]);
                }
              }}
              className="mt-4 pt-4 border-t"
            >
              <input type="hidden" name="roomIds" value={JSON.stringify(selectedRoomIds)} />
              <button
                type="submit"
                disabled={selectedRoomIds.length === 0}
                className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Delete Selected Rooms
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
