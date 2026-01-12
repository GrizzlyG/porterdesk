import StudentForm from "@/components/Forms/StudentForm";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import prisma from "@/lib/db";
import ApproveButton from "@/components/ApproveButton";

export const dynamic = 'force-dynamic';

const StudentsPage = async ({ searchParams }: { searchParams?: { status?: string } }) => {
  const statusFilter = searchParams?.status || "all";
  const students = await prisma.student.findMany({
    include: {
      user: true,
    },
    orderBy: { id: "desc" },
  });
  const filtered = statusFilter === "all"
    ? students
    : students.filter(s => (statusFilter === "approved" ? s.user?.status === "ACTIVE" : s.user?.status !== "ACTIVE"));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-500">Manage Students</p>
        </div>
        <StudentForm />
      </div>
      <div className="mb-4 flex gap-2">
        <a href="?status=all" className={`px-3 py-1 rounded ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>All</a>
        <a href="?status=approved" className={`px-3 py-1 rounded ${statusFilter === "approved" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Approved</a>
        <a href="?status=pending" className={`px-3 py-1 rounded ${statusFilter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}>Pending Approval</a>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.matricNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.first_name} {s.last_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.user?.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {s.user?.status === "ACTIVE" ? (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">Approved</span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                  {/* Expand Modal */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">Expand</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Student Details</DialogTitle>
                      <div className="space-y-2">
                        <div><b>Matric No:</b> {s.matricNumber}</div>
                        <div><b>Name:</b> {s.first_name} {s.last_name}</div>
                        <div><b>Phone:</b> {s.user?.phone}</div>
                        <div><b>Type:</b> {s.type}</div>
                        <div><b>DOB:</b> {s.dob ? new Date(s.dob).toLocaleDateString() : "-"}</div>
                        <div><b>Department:</b> {s.department}</div>
                        <div><b>Address:</b> {s.user?.address}</div>
                        <div><b>Status:</b> {s.user?.status}</div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* Delete Modal */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this student? This action cannot be undone.</p>
                      <form method="post" action={`/api/students/delete/${s.id}`}>
                        <button type="submit" className="bg-red-600 px-4 py-2 rounded shadow text-white w-full">Confirm Delete</button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  {/* Approve Button */}
                  {s.user?.status !== "ACTIVE" && s.user?.id && (
                    <ApproveButton userId={s.user.id} />
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;