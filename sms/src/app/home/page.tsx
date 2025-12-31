import ReadMore from "@/components/buttons/ReadMore";
import NoticeCard from "@/components/NoticeCard";
import { Card } from "@/components/ui/card";
import { get_notices } from "@/lib/controller/get_notices";
import { SCHOOL_INTRO, SCHOOL_NAME } from "@/lib/data";
import Link from "next/link";

const page = async () => {
  const { notices } = await get_notices({ take: 5 });
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-12">
        <div className=" col-span-12 md:col-span-7 p-2">
          <Card className="px-6 md:px-8 py-4">
            <h2 className="font-bold text-xl text-center py-4 text-gray-900">
              Welcome To {SCHOOL_NAME}
            </h2>
            <p className="text-justify text-gray-600">
              {SCHOOL_INTRO.substring(0, 500)}...
            </p>
            <div className="flex justify-end">
              <ReadMore href="/home/message/welcome" />
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-5 my-4 p-2">
          <h2 className="font-bold text-2xl mb-2">Notices</h2>
          {notices?.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
