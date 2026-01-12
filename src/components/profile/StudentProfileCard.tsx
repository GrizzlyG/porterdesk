import UserProfileCard from "@/components/UserProfileCard";
import { get_student_info } from "@/lib/controller/get_students";
import NoticeCard from "../NoticeCard";
import CompleteProfileForm from "../Forms/CompleteProfileForm";

const StudentProfileCard = async ({
  role,
  id,
}: {
  role: string;
  id: number;
}) => {
  const { student, notices } = await get_student_info(
    id
  );

  if (student && student.status === 'INACTIVE') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg text-center">
          <h3 className="font-bold text-yellow-800">Account Approval Pending</h3>
          <p className="text-sm text-yellow-700 mt-1">Your account is awaiting admin approval. You will be able to access your dashboard once approved.</p>
        </div>
      </div>
    );
  }

  if (student && !student.studentProfile?.profileComplete) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="py-1">
              <h3 className="font-bold text-yellow-800">Complete Your Profile</h3>
              <p className="text-sm text-yellow-700 mt-1">Please fill out your details to access all features, including posting complaints.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white p-8 rounded-lg shadow-md">
          <CompleteProfileForm user={student} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row">
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          {/* User INFO */}
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Profile
            </h1>
            <UserProfileCard user={student!} />
          </div>
        </div>
        {/* Complaints Navigation */}
        <div className="p-4">
          <a
            href="/dashboard/complaints"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors mt-2"
          >
            Submit/View Complaints
          </a>
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3">
        <div className="mt-1 p-2">
          <h2 className="font-bold text-2xl ">Recent Notices</h2>
        </div>
        <div className="mt-1">
          {notices?.map((notice, index) => (
            <NoticeCard key={index} notice={notice} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;
