import Image from "next/image";

const AdminNavbar = async ({ user }: { user: any }) => {
  return (
    <div className="flex bg-indigo-800 text-white items-center justify-around px-6 py-2 shadow">
      {/* Navbar */}
      <div className="flex gap-4 text-sm items-center">
      </div>

      {/* Icons And User */}
      <div className="flex gap-6">
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{user.fullName}</span>
          <span className="text-[10px] text-right text-gray-100 dark:text-gray-600">
            {user.role}
          </span>
        </div>
        <Image
          src={"/image/noavatar.png"}
          width={36}
          height={36}
          className="rounded-full"
          alt="Avatar"
        />
      </div>
    </div>
  );
};

export default AdminNavbar;
