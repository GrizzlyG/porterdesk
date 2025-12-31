import { PrismaClient, UserRole, UserStatus, GENDER, Level } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { getDepartmentFromMatric } from '../lib/department_mapping';

const prisma = new PrismaClient();

function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuote && nextChar === '"') {
        current += '"';
        i++; 
      } else {
        inQuote = !inQuote;
      }
    } else if (char === ',' && !inQuote) {
      row.push(current.trim());
      current = "";
    } else if ((char === '\r' || char === '\n') && !inQuote) {
      if (current || row.length > 0) row.push(current.trim());
      if (row.length > 0) result.push(row);
      row = [];
      current = "";
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    result.push(row);
  }
  return result;
}

async function main() {
  const hostelName = "Arafims ONE";
  let hostel = await prisma.hostel.findUnique({ where: { name: hostelName } });
  if (!hostel) {
    hostel = await prisma.hostel.create({ data: { name: hostelName, address: "Main Campus" } });
    console.log(`Created hostel: ${hostelName}`);
  }

  const csvPath = path.join(process.cwd(), 'combined_list.csv');
  if (!fs.existsSync(csvPath)) {
    console.error("combined_list.csv not found in project root.");
    return;
  }

  const data = parseCSV(fs.readFileSync(csvPath, 'utf-8'));
  data.shift(); // Remove header row

  // CSV Columns: SURNAME(0), OTHER NAMES(1), MATRIC_NUMBER(2), DEPARTMENT(3), MOBILE_NUMBER(4), DOB(5), YOB(6), ROOM(7)

  for (const row of data) {
    const matric = row[2]?.replace(/^"|"$/g, '').trim(); // Remove quotes if present
    if (!matric) continue;

    const surname = row[0]?.replace(/^"|"$/g, '').trim();
    const otherNames = row[1]?.replace(/^"|"$/g, '').trim();
    
    let dept: string | undefined = row[3]?.replace(/^"|"$/g, '').trim();
    if (!dept) {
        dept = getDepartmentFromMatric(matric) || undefined;
    }

    const phone = row[4]?.replace(/^"|"$/g, '').trim() || "12345678";
    const dobStr = row[5]?.replace(/^"|"$/g, '').trim();
    const yobStr = row[6]?.replace(/^"|"$/g, '').trim();
    const roomStr = row[7]?.replace(/^"|"$/g, '').trim();

    // Construct Date of Birth
    let dob = new Date();
    if (dobStr && yobStr) {
        const parts = dobStr.split('/');
        if (parts.length >= 2) {
            dob = new Date(`${yobStr}-${parts[0]}-${parts[1]}`);
        }
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({ where: { matricNumber: matric } });
    if (existingStudent) {
        console.log(`Skipping existing student: ${matric}`);
        continue;
    }

    const hashedPassword = await bcrypt.hash(phone, 10);
    // Create unique email based on matric to satisfy User schema
    const email = `student${matric.replace(/[^a-zA-Z0-9]/g, '')}@school.com`;

    try {
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                role: UserRole.STUDENT,
                sex: GENDER.MALE, // Defaulting to Male as gender isn't in CSV
                status: UserStatus.ACTIVE,
                phone: phone,
                address: "",
                studentProfile: {
                    create: {
                        first_name: otherNames,
                        last_name: surname,
                        matricNumber: matric,
                        department: dept,
                        dob: dob,
                        level: Level.PRIMARY,
                        profileComplete: true
                    }
                }
            },
            include: { studentProfile: true }
        });

        const studentId = newUser.studentProfile?.id;

        // Assign Room if provided
        if (roomStr && roomStr.length > 1 && studentId) {
            const blockName = roomStr.charAt(0).toUpperCase(); // First letter is Block
            const roomNum = roomStr.substring(1); // Rest is Room Number

            // Ensure Block exists
            let block = await prisma.block.findFirst({
                where: { hostelId: hostel!.id, name: blockName }
            });
            if (!block) {
                block = await prisma.block.create({ data: { name: blockName, hostelId: hostel!.id } });
            }

            // Ensure Room exists
            let room = await prisma.hostelRoom.findFirst({
                where: { blockId: block.id, roomNumber: roomNum }
            });
            if (!room) {
                room = await prisma.hostelRoom.create({ data: { roomNumber: roomNum, blockId: block.id, capacity: 4 } });
                // Create 4 Bedspaces for the new room
                const bedspacesData = Array.from({ length: 4 }, (_, i) => ({
                    number: `${roomNum}-${String.fromCharCode(65 + i)}`,
                    roomId: room!.id,
                }));
                await prisma.bedspace.createMany({ data: bedspacesData });
            }

            // Find first empty bedspace
            const bedspace = await prisma.bedspace.findFirst({ where: { roomId: room.id, isOccupied: false } });
            if (bedspace) {
                await prisma.bedspace.update({ where: { id: bedspace.id }, data: { isOccupied: true, studentId: studentId } });
                console.log(`Assigned ${matric} to ${blockName}-${roomNum}`);
            }
        }
    } catch (e) {
        console.error(`Failed to process ${matric}:`, e);
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });