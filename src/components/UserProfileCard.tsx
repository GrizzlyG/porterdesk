import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { User } from "@/lib/types";

const UserProfileCard = ({ user }: { user: User }) => {
  if (!user) return null;

  return (
    <Card className="max-w-xs mx-auto bg-white border border-gray-200 shadow-md rounded-xl p-0 overflow-hidden">
      <CardContent className="flex flex-col items-center p-6 gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
          <Image
            src={user.img || "/image/noavatar.png"}
            alt="Student photo"
            width={96}
            height={96}
            className="object-cover w-24 h-24"
          />
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-lg font-semibold text-gray-900 tracking-tight">
            {user.studentProfile
              ? `${user.studentProfile.first_name} ${user.studentProfile.last_name}`
              : user.email}
          </span>
          <span className="text-xs text-gray-400 font-mono">ID: {user.id}</span>
        </div>
        <div className="w-full flex flex-col gap-2 mt-2">
          <InfoRow label="Email" value={user.email} />
          {user.phone && <InfoRow label="Phone" value={user.phone} />}
          {user.studentProfile?.dob && (
            <InfoRow
              label="DOB"
              value={new Date(user.studentProfile.dob).toLocaleDateString()}
            />
          )}
          {user.address && <InfoRow label="Address" value={user.address} />}
        </div>
      </CardContent>
    </Card>
  );
};

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-xs text-gray-700">
      <span className="font-medium text-gray-500">{label}</span>
      <span className="text-gray-800 text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}

export default UserProfileCard;
  
