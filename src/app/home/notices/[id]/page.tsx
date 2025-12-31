import { get_notice_info } from "@/lib/controller/get_notices";
import { Status } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleNoticePage = async ({ params }: { params: { id: string } }) => {
  const { notice, status } = await get_notice_info(params.id);

  if (status !== Status.OK || !notice) {
    return notFound();
  }

  if (!notice.fileUrl) {
    return (
      <div className="p-10 text-center text-gray-600">
        <p>No file is attached to this notice.</p>
        <Link href="/home" className="text-indigo-600 hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 h-screen">
      <iframe src={notice.fileUrl} className="w-full h-full border rounded-lg"></iframe>
    </div>
  );
};

export default SingleNoticePage;