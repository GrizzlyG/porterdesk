import Image from "next/image";

const AdminNavbar = async ({ user }: { user: any }) => {
  return (
    <header className="top-0 left-0 w-full z-50">
      <nav className="bg-white/70 backdrop-blur-lg shadow-lg border-b border-green-200 px-4 md:px-10">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold text-green-700 tracking-wide drop-shadow">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-green-900">{user.fullName}</span>
              <span className="text-xs text-green-600">{user.role}</span>
            </div>
            <Image
              src={"/image/noavatar.png"}
              width={40}
              height={40}
              className="rounded-full border-2 border-green-300 shadow"
              alt="Avatar"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
