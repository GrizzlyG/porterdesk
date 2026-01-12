import Link from "next/link";

export default function StudentComplaintCard() {
  return (
    <div className="bg-white p-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">Complaints</h2>
        <p className="text-sm text-gray-500">Have an issue? Let us know.</p>
      </div>
      <Link href="/dashboard/complaints" className="bg-blue-500 text-white px-4 py-2 text-sm hover:bg-blue-600 transition-colors">
        Submit
      </Link>
    </div>
  );
}