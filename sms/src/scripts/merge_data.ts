import fs from 'fs';
import path from 'path';

// Simple CSV parser helper
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
        i++; // Skip next quote
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

async function mergeData() {
  const rootDir = process.cwd();
  const matricPath = path.join(rootDir, 'matric_pair.csv');
  const roomPath = path.join(rootDir, 'room_number_sheet.csv');
  const outputPath = path.join(rootDir, 'combined_list.csv');
  const complaintPath = path.join(rootDir, 'file_merge_complaint.txt');

  if (!fs.existsSync(matricPath) || !fs.existsSync(roomPath)) {
    console.error("Error: Input files 'matric_pair.csv' and 'room_number_sheet.csv' must exist in the project root.");
    return;
  }

  console.log("Reading CSV files...");
  const matricData = parseCSV(fs.readFileSync(matricPath, 'utf-8'));
  const roomData = parseCSV(fs.readFileSync(roomPath, 'utf-8'));

  // Remove headers
  const matricHeader = matricData.shift();
  const roomHeader = roomData.shift();

  // Indexes based on your provided CSV structure
  // Matric Pair: SURNAME(0), OTHER NAMES(1), MATRIC_NUMBER(2), DEPARTMENT(3), MOBILE(4), DOB(5), YOB(6)
  const M_SURNAME_IDX = 0;
  const M_OTHERNAMES_IDX = 1;
  const M_MATRIC_IDX = 2;
  const M_DEPT_IDX = 3;
  const M_MOBILE_IDX = 4;
  const M_DOB_IDX = 5;
  const M_YOB_IDX = 6;

  // Room Sheet: EMAIL(0), SURNAME(1), OTHER NAMES(2), MATRIC(3), MOBILE(4), PRICE(5), ROOM(6)
  const R_SURNAME_IDX = 1; 
  const R_OTHERNAMES_IDX = 2;
  const R_ROOM_IDX = 6; 

  const combinedList: string[] = [
    "SURNAME,OTHER NAMES,MATRIC_NUMBER,DEPARTMENT,MOBILE_NUMBER,DATE_OF_BIRTH,YEAR_OF_BIRTH,ROOM"
  ];

  const unmatchedMatric: string[][] = [];
  const matchedRoomIndices = new Set<number>();

  // Helper to normalize names for comparison
  const normalize = (s: string) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

  console.log("Merging data...");
  matricData.forEach((mRow) => {
    const mSurname = mRow[M_SURNAME_IDX];
    const mOtherNames = mRow[M_OTHERNAMES_IDX];
    
    // Find match in roomData
    const rIndex = roomData.findIndex((rRow, idx) => {
      if (matchedRoomIndices.has(idx)) return false;
      
      const rSurname = rRow[R_SURNAME_IDX];
      const rOtherNames = rRow[R_OTHERNAMES_IDX];

      // Fuzzy match: check if surnames match and parts of other names match
      if (normalize(mSurname) === normalize(rSurname)) {
         const mParts = normalize(mOtherNames);
         const rParts = normalize(rOtherNames);
         // Match if one contains the other (e.g. "Oluwaseun Daniel" matches "Daniel")
         return mParts.includes(rParts) || rParts.includes(mParts);
      }
      return false;
    });

    if (rIndex !== -1) {
      matchedRoomIndices.add(rIndex);
      const rRow = roomData[rIndex];
      
      // Combine data: Use Matric data for personal info, Room data for Room number
      const combinedRow = [
        `"${mSurname}"`,
        `"${mOtherNames}"`,
        `"${mRow[M_MATRIC_IDX]}"`,
        `"${mRow[M_DEPT_IDX]}"`,
        `"${mRow[M_MOBILE_IDX]}"`,
        `"${mRow[M_DOB_IDX]}"`,
        `"${mRow[M_YOB_IDX]}"`,
        `"${rRow[R_ROOM_IDX] || ''}"`
      ].join(",");
      
      combinedList.push(combinedRow);
    } else {
      unmatchedMatric.push(mRow);
    }
  });

  // Identify unmatched room records
  const unmatchedRoom = roomData.filter((_, idx) => !matchedRoomIndices.has(idx));

  // Write Combined List
  fs.writeFileSync(outputPath, combinedList.join("\n"));
  console.log(`Successfully created ${outputPath}`);

  // Write Complaint File
  let complaintContent = "Unmatched records from matric pair (Students without rooms):\n\n";
  unmatchedMatric.forEach(row => {
    complaintContent += `- ${row.join(", ")}\n`;
  });

  complaintContent += "\n\nUnmatched records from room number sheet (Rooms without matching student record):\n\n";
  unmatchedRoom.forEach(row => {
    complaintContent += `- ${row.join(", ")}\n`;
  });

  fs.writeFileSync(complaintPath, complaintContent);
  console.log(`Successfully created ${complaintPath}`);
}

mergeData();
