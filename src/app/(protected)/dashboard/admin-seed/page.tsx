"use client";
import { useRef, useState } from "react";

export default function AdminSeedPage() {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/seed", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message || (res.ok ? "Seeded successfully!" : "Failed to seed."));
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Admin Seed Database</h1>
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded">
        <strong className="block mb-2">How to Seed a Hostel:</strong>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>Enter the <b>Hostel Name</b> you want to create and seed.</li>
          <li>Upload a <b>CSV file</b> with student data (see format below).</li>
        </ol>
        <div className="mt-3">
          <span className="font-semibold">Expected CSV Columns:</span>
          <table className="w-full mt-2 mb-2 text-xs border border-yellow-300 bg-white">
            <thead>
              <tr className="bg-yellow-100">
                <th className="border border-yellow-300 px-2 py-1">firstName</th>
                <th className="border border-yellow-300 px-2 py-1">lastName</th>
                <th className="border border-yellow-300 px-2 py-1">matricNumber</th>
                <th className="border border-yellow-300 px-2 py-1">department</th>
                <th className="border border-yellow-300 px-2 py-1">level</th>
                <th className="border border-yellow-300 px-2 py-1">email</th>
                <th className="border border-yellow-300 px-2 py-1">phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-yellow-200 px-2 py-1">John</td>
                <td className="border border-yellow-200 px-2 py-1">Doe</td>
                <td className="border border-yellow-200 px-2 py-1">12345</td>
                <td className="border border-yellow-200 px-2 py-1">Computer Science</td>
                <td className="border border-yellow-200 px-2 py-1">100</td>
                <td className="border border-yellow-200 px-2 py-1">john@example.com</td>
                <td className="border border-yellow-200 px-2 py-1">08012345678</td>
              </tr>
            </tbody>
          </table>
          <span className="text-xs text-yellow-900">Make sure your CSV has a header row and matches the columns above.</span>
        </div>
      </div>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="text"
          name="hostelName"
          placeholder="Hostel Name"
          required
          className="border p-2 rounded"
        />
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept=".csv"
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-green-300"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload & Seed"}
        </button>
      </form>
      {message && <div className="mt-4 text-center text-green-700">{message}</div>}
    </div>
  );
}
