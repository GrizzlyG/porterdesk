import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { parse } from "csv-parse/sync";

export const runtime = "edge";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const hostelName = formData.get("hostelName");
  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
  }
  if (!hostelName || typeof hostelName !== "string") {
    return NextResponse.json({ message: "No hostel name provided." }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const text = Buffer.from(arrayBuffer).toString("utf-8");
  let records;
  try {
    records = parse(text, { columns: true, skip_empty_lines: true });
  } catch (e) {
    return NextResponse.json({ message: "Invalid CSV format." }, { status: 400 });
  }
  // Create hostel and seed students
  let hostel;
  try {
    hostel = await prisma.hostel.create({ data: { name: hostelName } });
  } catch (e) {
    return NextResponse.json({ message: "Failed to create hostel. It may already exist." }, { status: 400 });
  }
  let created = 0;
  for (const row of records) {
    try {
      await prisma.student.create({ data: { ...row, hostelId: hostel.id } });
      created++;
    } catch (e) {
      // skip duplicates or errors
    }
  }
  return NextResponse.json({ message: `Created hostel '${hostelName}' and seeded ${created} students.` });
}
