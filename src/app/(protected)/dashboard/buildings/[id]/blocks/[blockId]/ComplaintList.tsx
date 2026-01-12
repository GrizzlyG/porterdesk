"use client";

import { useState } from "react";
import { updateComplaintStatus, deleteComplaint } from "@/lib/actions/complaint";

export default function ComplaintList({ complaints }: { complaints: any[] }) {
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
                  ${c.student.bedspace?.room ? `Room: ${c.student.bedspace.room.number}` : 'No Room Assigned'}
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
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors text-sm"
        >
          Print Selected
        </button>
      </div>

      {complaints.map((complaint) => (
        <div key={complaint.id} className="p-4 bg-white border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(complaint.id)}
              onChange={() => toggleSelect(complaint.id)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 ${
                  complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {complaint.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                By: {complaint.student.first_name} {complaint.student.last_name}
                {complaint.student.bedspace?.room && (
                  <span className="ml-1 font-medium text-gray-500">
                    - Room {complaint.student.bedspace.room.number}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <form action={updateComplaintStatus}>
                <input type="hidden" name="id" value={complaint.id} />
                <input type="hidden" name="status" value="RESOLVED" />
                <button className="text-xs bg-green-500 text-white px-3 py-2 hover:bg-green-600">
                  Resolve
                </button>
              </form>
              <form action={updateComplaintStatus}>
                <input type="hidden" name="id" value={complaint.id} />
                <input type="hidden" name="status" value="REJECTED" />
                <button className="text-xs bg-red-500 text-white px-3 py-2 hover:bg-red-600">
                  Reject
                </button>
              </form>
              <form action={deleteComplaint}>
                <input type="hidden" name="id" value={complaint.id} />
                <button className="text-xs bg-gray-500 text-white px-3 py-2 hover:bg-gray-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
      
      {complaints.length === 0 && (
        <p className="text-gray-500 text-center py-10">No complaints found.</p>
      )}
    </div>
  );
}