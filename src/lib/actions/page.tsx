import ComplaintForm from "@/components/Forms/ComplaintForm";
import { deleteComplaint } from "@/lib/actions/complaint";
import getSession from "@/lib/get_session";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function StudentComplaintsPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) return <div className="p-4">Not authenticated.</div>;

  // Fetch the user with student profile
  const user = await prisma.user.findUnique({
    where: { id: typeof userId === "string" ? parseInt(userId) : userId },
    include: {
      studentProfile: true,
    },
  });

  const student = user?.studentProfile;

  if (!student) return <div className="p-4">Student profile not found.</div>;

  // Fetch student's complaints
  const complaints = await prisma.complaint.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-8">
      <Link href="/student" className="w-fit bg-gray-500 text-white px-4 py-2 text-sm hover:bg-gray-600 transition-colors">
        Back
      </Link>
      <ComplaintForm studentId={student.id} />
      
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">My Complaints</h2>
        {complaints.length === 0 ? (
          <p className="text-gray-500">No complaints submitted yet.</p>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="p-4 bg-white border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{c.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 ${
                    c.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    c.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {c.status}
                  </span>
                  <form action={deleteComplaint}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-xs text-red-500 hover:underline">Delete</button>
                  </form>
                </div>
              </div>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}