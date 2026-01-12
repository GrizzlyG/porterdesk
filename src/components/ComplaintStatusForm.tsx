"use client";
import { useState } from "react";

export default function ComplaintStatusForm({ id, currentStatus, action }) {
  const [status, setStatus] = useState(currentStatus);
  return (
    <form
      action={action}
      method="post"
      className="flex items-center gap-2"
      onSubmit={e => {
        if (!window.confirm("Are you sure you want to update the status?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="border rounded px-1 py-0.5 text-xs"
      >
        <option value="PENDING">PENDING</option>
        <option value="PROCESSING">PROCESSING</option>
        <option value="RESOLVED">RESOLVED</option>
        <option value="REJECTED">REJECTED</option>
      </select>
      <button type="submit" className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600">Update</button>
    </form>
  );
}
