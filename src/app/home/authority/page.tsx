import { decrypt } from "@/session";
import { cookies } from "next/headers";

const Authority = async () => {
  const session = cookies().get("__session")?.value;
  let user = null;
  try {
    const result = await decrypt(session);
    user = result?.user;
  } catch (error) {
    user = null;
  }

  if (!user) {
    return <div className="text-red-600">Session invalid or user not found. Showing default Authority page.</div>;
  }

  return <div>Authority (Welcome, {user?.role || "User"})</div>;
};

export default Authority;
