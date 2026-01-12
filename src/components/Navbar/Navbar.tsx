import { decrypt } from "@/session";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Menus from "./Menus";

const Navbar = async () => {
  const cookieStore = cookies();
  const session = cookieStore.get("__session")?.value;
  // const session = loginSession ? loginSession : GENEREL_SESSION;
  const { user } = await decrypt(session);

  return (
    <header className="top-0 left-0 w-full z-50">
      <nav className="bg-white/70 backdrop-blur-lg shadow-lg border-b border-green-200 px-4 md:px-10">
        <div className="max-w-screen-xl mx-auto flex flex-col py-2">
          <div className="flex flex-col items-center justify-center w-full mb-1">
            <span className="text-base font-semibold text-green-800 tracking-wide">Arafims Hostel Network Management System</span>
            <span className="text-xs text-green-600">Central platform for Managing Arafims Hostels</span>
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {user ? (
                <Link href={user.role == "ADMIN" ? "/dashboard" : "/profile"}>
                  <div className="flex gap-4 px-4 py-2 items-center hover:bg-green-50 rounded-xl transition">
                    <Image
                      src={"/image/noavatar.png"}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-green-300 shadow"
                      alt="Avatar"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-green-900">
                        {user.fullName}
                      </span>
                      <span className="text-[10px] text-green-600">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link className="px-4 py-2" href={"/home"}>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-green-700 tracking-wide drop-shadow">A</h1>
                  </div>
                </Link>
              )}
            </div>
            <Menus isLoggedIn={user ? true : false} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
