import fs from 'fs';
import path from 'path';

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

async function generateMapping() {
  const rootDir = process.cwd();
  const csvPath = path.join(rootDir, 'combined_list.csv');
  const outPath = path.join(rootDir, 'src', 'lib', 'department_mapping.ts');

  if (!fs.existsSync(csvPath)) {
    console.error("combined_list.csv not found");
    return;
  }

  const data = parseCSV(fs.readFileSync(csvPath, 'utf-8'));
  data.shift(); // Remove header

  const mapping: Record<string, string> = {};

  data.forEach(row => {
    const matric = row[2]; // MATRIC_NUMBER
    const dept = row[3];   // DEPARTMENT

    if (!matric || !dept) return;

    // Pattern: YY/CODE/NNN or YY/CODE/NNN (e.g. 21/55DZ065)
    const match = matric.match(/^\d{2}\/([A-Z0-9]+?)\/?\d+$/i);
    if (match) {
      const code = match[1].toUpperCase();
      const cleanDept = dept.trim().replace(/\s+/g, ' ');
      if (!mapping[code]) {
        mapping[code] = cleanDept;
      }
    }
  });

  const fileContent = `// This file is auto-generated. Do not edit manually.
export const DepartmentMapping: Record<string, string> = ${JSON.stringify(mapping, null, 2)};

export function getDepartmentFromMatric(matric: string): string | null {
  const match = matric.match(/^\\d{2}\\/([A-Z0-9]+?)\\/?\\d+$/i);
  if (match) {
    const code = match[1].toUpperCase();
    return DepartmentMapping[code] || null;
  }
  return null;
}
`;

  fs.writeFileSync(outPath, fileContent);
  console.log(`Generated ${outPath}`);
}

generateMapping();