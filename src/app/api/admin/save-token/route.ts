import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ success: false, message: "No token provided" }, { status: 400 });
  }
  // For demo: store a single admin token. For multi-admin, associate with user.
  await prisma.adminToken.upsert({
    where: { id: 1 },
    update: { token },
    create: { id: 1, token },
  });
  return NextResponse.json({ success: true });
}
