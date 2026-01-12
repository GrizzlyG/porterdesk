"use client";

import { useState } from "react";
import { updateComplaintStatus, deleteComplaint } from "@/lib/actions/complaint";

export default function ComplaintList({ complaints, isAdmin }: { complaints: any[]; isAdmin?: boolean }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    const selected = complaints.filter((c) => selectedIds.includes(c.id));
    if (selected.length === 0) {
      alert("Please select at least one complaint to print.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const html = `
        <html>
          <head>
            <title>Complaint Printout</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .complaint-item { border-bottom: 1px solid #ddd; padding: 15px 0; }
              .header { font-weight: bold; font-size: 1.1em; margin-bottom: 5px; }
              .meta { color: #666; font-size: 0.9em; margin-bottom: 10px; }
              .description { white-space: pre-wrap; line-height: 1.5; }
            </style>
          </head>
          <body>
            <h1>Complaints Report</h1>
            ${selected.map(c => `
              <div class="complaint-item">
                <div class="header">
                  ${c.student.first_name} ${c.student.last_name}
                </div>
                <div class="meta">
                  ${c.student.bedspace?.room ? `Room: ${c.student.bedspace.room.roomNumber}` : 'No Room Assigned'}
                </div>
                <div class="description">
                  ${c.description}
                </div>
              </div>
            `).join('')}
            <script>
              window.onload = () => window.print();
            </script>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors text-sm"
          >
            Print Selected
          </button>
        </div>
      )}

      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          className="flex items-center bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm hover:shadow transition-all gap-3 min-h-[56px]"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(complaint.id)}
            onChange={() => toggleSelect(complaint.id)}
            className="w-4 h-4 accent-blue-500 cursor-pointer mt-0.5"
          />
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide ${
                complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {complaint.status}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-gray-800 text-sm truncate max-w-[180px]">{complaint.title}</span>
                <span className="text-xs text-gray-400 truncate max-w-[200px]">{complaint.description}</span>
              </div>
              <span className="text-[11px] text-gray-400">
                By: {complaint.student.first_name} {complaint.student.last_name}
                {complaint.student.bedspace?.room && (
                  <span className="ml-1 font-medium text-gray-500">
                    - Room {complaint.student.bedspace.room.roomNumber}
                  </span>
                )}
              </span>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 ml-2">
              <form action={updateComplaintStatus}>
                <input type="hidden" name="id" value={complaint.id} />
                <input type="hidden" name="status" value="RESOLVED" />
                <button className="text-[10px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">✔</button>
              </form>
              <form action={updateComplaintStatus}>
                <input type="hidden" name="id" value={complaint.id} />
                <input type="hidden" name="status" value="REJECTED" />
                <button className="text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">✖</button>
              </form>
              <form action={deleteComplaint}>
                <input type="hidden" name="id" value={complaint.id} />
                <button className="text-[10px] bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600">🗑</button>
              </form>
            </div>
          )}
        </div>
      ))}
      
      {complaints.length === 0 && (
        <p className="text-gray-500 text-center py-10">No complaints found.</p>
      )}
    </div>
  );
}