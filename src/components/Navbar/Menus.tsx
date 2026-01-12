"use client";

import { useEffect, useState } from "react";
import SignInForm from "../Forms/SignInForm";
import Link from "next/link";
import ThreeLineSvg from "../svg/ThreeLineSvg";

const Menus = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }
  }, [isOpen]);

  return (
    <>
      <div className="flex items-center gap-4 lg:order-2 px-4">
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          <ThreeLineSvg />
        </button>
      </div>
      <div
        className={`w-full lg:w-auto lg:order-1 lg:block ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="flex flex-col items-center mt-4 lg:mt-0 lg:flex-row lg:gap-8  ">
          {!isLoggedIn && (
            <>
              <SignInForm />
              <Link
                href="/student-register"
                className="mt-2 lg:mt-0 px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Menus;
