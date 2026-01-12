import { cookies } from "next/headers";
import { decrypt } from "@/session";
import ComplaintForm from "./ComplaintForm";
import ComplaintList from "./ComplaintList";
import prisma from "@/lib/db";

const ComplaintsDashboard = async () => {
  // Get session and user
  const session = cookies().get("__session")?.value;
  let user = null;
  try {
    const result = await decrypt(session);
    user = result?.user;
  } catch (error) {
    user = null;
  }

  if (!user) {
    return <div className="text-red-600 p-8 text-center">You must be logged in to view complaints.</div>;
  }

  let complaints = [];
  let studentProfile = null;
  if (user.role === "ADMIN") {
    // Admin: fetch all complaints
    complaints = await prisma.complaint.findMany({
      include: {
        student: {
          select: { first_name: true, last_name: true, bedspace: { select: { room: { select: { roomNumber: true } } } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } else if (user.role === "STUDENT") {
    // Student: fetch only their complaints
    studentProfile = await prisma.student.findUnique({ where: { userId: user.id } });
    complaints = await prisma.complaint.findMany({
      where: { studentId: studentProfile?.id },
      include: {
        student: {
          select: { first_name: true, last_name: true, bedspace: { select: { room: { select: { roomNumber: true } } } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Complaints Dashboard</h1>
      {user.role === "STUDENT" && (
        <div className="mb-8">
          {/* Fetch studentProfile from DB for logged-in user */}
          {studentProfile?.id ? (
            <ComplaintForm studentId={studentProfile.id} />
          ) : (
            <div className="text-red-600">Student profile not found. Cannot submit complaint.</div>
          )}
        </div>
      )}
      <ComplaintList complaints={complaints} isAdmin={user.role === "ADMIN"} />
    </div>
  );
};

export default ComplaintsDashboard;
