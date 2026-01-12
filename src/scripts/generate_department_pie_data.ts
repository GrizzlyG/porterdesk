import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const csvPath = path.join(process.cwd(), "matric_pair.csv");
const csv = fs.readFileSync(csvPath, "utf-8");

const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
});

const departmentCounts: Record<string, number> = {};
for (const row of records) {
  const dept = (row["DEPARTMENT"] || row["Department"] || "").trim();
  if (!dept) continue;
  departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
}

const pieData = Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));

fs.writeFileSync(path.join(process.cwd(), "department_pie_data.json"), JSON.stringify(pieData, null, 2));
console.log("Pie chart data written to department_pie_data.json");
