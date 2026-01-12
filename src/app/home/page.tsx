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
        <div className="col-span-12 md:col-span-7 p-2">
          <section className="bg-primary/90 text-white px-8 py-8 flex flex-col gap-4 items-center justify-center min-h-[260px]">
            <h1 className="font-extrabold text-3xl md:text-4xl text-center drop-shadow-lg">
              Welcome To {SCHOOL_NAME}
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl mx-auto opacity-90">
              {SCHOOL_INTRO.substring(0, 500)}...
            </p>
            <div className="flex justify-end w-full">
              <ReadMore href="/home/message/welcome" />
            </div>
          </section>
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
