import { get_notices } from "@/lib/controller/get_notices";
import Link from "next/link";

const NoticesPage = async () => {
  const { notices } = await get_notices({ take: 20 });

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Notices</h1>
      <div className="grid gap-4">
        {notices?.map((notice) => (
          <div
            key={notice.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-lg text-gray-900">{notice.headline}</h2>
              {notice.subhead && (
                <p className="text-sm text-gray-600">{notice.subhead}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
            <Link
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
              href={`/home/notices/${notice.id}`}
            >
              Read More
            </Link>
          </div>
        ))}
        {notices?.length === 0 && (
          <p className="text-gray-500 text-center py-10">No notices found.</p>
        )}
      </div>
    </div>
  );
};

export default NoticesPage;
