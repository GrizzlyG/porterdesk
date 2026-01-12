/*
  Warnings:

  - You are about to drop the column `level` on the `student` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('RESIDENT', 'VISITOR');

-- AlterTable
ALTER TABLE "student" DROP COLUMN "level",
ADD COLUMN     "type" "Type" DEFAULT 'RESIDENT';

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "LeaveStatus";

-- DropEnum
DROP TYPE "Level";
