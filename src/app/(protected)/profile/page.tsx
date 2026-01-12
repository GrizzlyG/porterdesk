import { cookies } from "next/headers";
import { decrypt } from "@/session";
import StudentProfileCard from "@/components/profile/StudentProfileCard";

const ProfilePage = async () => {
  // Get session cookie
  const session = cookies().get("__session")?.value;
  let user = null;
  try {
    const result = await decrypt(session);
    user = result?.user;
  } catch (error) {
    user = null;
  }

  if (!user || user.role !== "STUDENT") {
    return (
      <div className="text-red-600 p-8 text-center">
        Profile not found or you are not logged in as a student.
      </div>
    );
  }

  // Render student profile card with user id
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      <StudentProfileCard role="STUDENT" id={user.id} />
    </div>
  );
};

export default ProfilePage;
