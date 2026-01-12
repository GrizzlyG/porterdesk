/*
  Warnings:

  - The values [ACADEMIC,EXAMINATION,ADMINISTRATIVE,EVENT] on the enum `NoticeType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `student_id` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `student_id_str` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricNumber]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricNumber` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NoticeType_new" AS ENUM ('UNIVERSITY', 'HOSTEL', 'INFORMAL');
ALTER TABLE "Notice" ALTER COLUMN "type" TYPE "NoticeType_new" USING ("type"::text::"NoticeType_new");
ALTER TYPE "NoticeType" RENAME TO "NoticeType_old";
ALTER TYPE "NoticeType_new" RENAME TO "NoticeType";
DROP TYPE "NoticeType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Bedspace" DROP CONSTRAINT "Bedspace_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_student_id_fkey";

-- DropIndex
DROP INDEX "student_student_id_key";

-- AlterTable
ALTER TABLE "student" DROP CONSTRAINT "student_pkey",
DROP COLUMN "student_id",
DROP COLUMN "student_id_str",
ADD COLUMN     "department" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "matricNumber" TEXT NOT NULL,
ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "level" DROP NOT NULL,
ADD CONSTRAINT "student_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_matricNumber_key" ON "student"("matricNumber");

-- CreateIndex
CREATE UNIQUE INDEX "student_userId_key" ON "student"("userId");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bedspace" ADD CONSTRAINT "Bedspace_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
