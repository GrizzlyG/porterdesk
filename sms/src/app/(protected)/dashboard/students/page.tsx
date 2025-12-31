import StudentForm from "@/components/Forms/StudentForm";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import prisma from "@/lib/db";

const StudentsPage = async () => {
  const students = await prisma.student.findMany({
    include: {
      user: true, // Include user details
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-500">Manage Students</p>
        </div>
        <StudentForm />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matric No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {s.matricNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {s.first_name} {s.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {s.user?.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {s.level}
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
                        <div><b>Level:</b> {s.level}</div>
                        <div><b>DOB:</b> {s.dob ? new Date(s.dob).toLocaleDateString() : "-"}</div>
                        <div><b>Department:</b> {s.department}</div>
                        <div><b>Address:</b> {s.user?.address}</div>
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
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;