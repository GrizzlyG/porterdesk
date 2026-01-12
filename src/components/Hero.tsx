import {
  SCHOOL_CODE,
  SCHOOL_EIIN,
  SCHOOL_LOGO,
  SCHOOL_MESSAGE,
  SCHOOL_NAME,
} from "@/lib/data";
import Image from "next/image";
import Navbar from "./Navbar/Navbar";

const Hero = () => {
  return (
    <div className="bg-primary pt-4">
      <div className="max-w-screen-xl flex mx-auto ">
        <div className="flex items-center justify-center">
          {/* <Image alt="School Logo" src={SCHOOL_LOGO} width={100} height={100} /> */}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center flex-col h-full">
            <div className=" text-center">
              <h1 className="text-white text-xl font-extrabold flex items-center justify-center">
                {SCHOOL_NAME}
              </h1>
            </div>
            <div className="flex flex-col gap-2  lg:gap-4 items-center py-2">
              <div className="text-gray-300 font-semibold text-xs flex gap-2 lg:gap-6">
                {SCHOOL_MESSAGE}
              </div>
              {/* Removed Hostel Code and EIIN */}
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Hero;
