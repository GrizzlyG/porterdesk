import { Notice, UserRole } from "@/lib/types";
import Link from "next/link";

const NoticeCard = ({ notice, userRole }: { notice: Notice, userRole?: UserRole }) => {
  return (
    <div
      key={notice.id}
      className="p-4 border border-gray-200 rounded-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{notice.headline}</h3>
          {notice.subhead && (
            <p className="text-sm text-gray-500 font-medium">{notice.subhead}</p>
          )}
        </div>
        <Link
          className="text-green-700 hover:text-yellow-500"
          href={`/dashboard/notices/${notice.id}`}
        >
          View
        </Link>
      </div>
      {userRole === 'ADMIN' && (
        <div className="flex items-center gap-2 text-xs mt-2">
          <span className="font-semibold text-gray-600">Visible to:</span>
          <div className="flex gap-2">
            {notice.visibleToManagers && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Managers</span>}
            {notice.visibleToPorters && <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Porters</span>}
            {notice.visibleToStudents && <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Students</span>}
            {(!notice.visibleToManagers && !notice.visibleToPorters && !notice.visibleToStudents) && <span className="text-gray-400">None</span>}
          </div>
        </div>
      )}
      <div className="text-right text-xs text-gray-400 mt-2">
        {notice.createdAt?.toDateString()}
      </div>
    </div>
  );
};

export default NoticeCard;
