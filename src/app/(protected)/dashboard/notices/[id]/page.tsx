import { get_notice_info } from "@/lib/controller/get_notices";
import { Status } from "@/lib/types";
import { format } from "date-fns";
import { ArrowLeft, Calendar, File as FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleNoticePage = async ({ params }: { params: { id: string } }) => {
  const { notice, status } = await get_notice_info(params.id);

  if (status !== Status.OK || !notice) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md my-8">
      <Link
        href="/dashboard/notices"
        className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Notices
      </Link>

      <article>
        <header className="mb-4 border-b pb-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {notice.headline}
            </h1>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full">
              {notice.type}
            </span>
          </div>
          {notice.subhead && (
            <p className="mt-2 text-lg text-gray-500">{notice.subhead}</p>
          )}
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {notice.createdAt ? format(new Date(notice.createdAt), "PPP") : ""}
            </span>
          </div>
        </header>

        {notice.imageUrl && (
          <div className="my-6 relative aspect-video w-full rounded-lg overflow-hidden">
            <Image
              src={notice.imageUrl}
              alt={notice.headline}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
          {notice.body}
        </div>

        {notice.ps && (
          <p className="mt-6 text-sm text-gray-500 italic border-t pt-4">
            <strong>P.S.</strong> {notice.ps}
          </p>
        )}

        {notice.fileUrl && (
          <div className="mt-6">
            <Link
              href={notice.fileUrl}
              target="_blank"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FileIcon size={16} />
              Download Attachment
            </Link>
          </div>
        )}
      </article>
    </div>
  );
};

export default SingleNoticePage;