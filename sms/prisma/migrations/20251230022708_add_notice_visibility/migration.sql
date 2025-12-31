-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "visibleToManagers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visibleToPorters" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visibleToStudents" BOOLEAN NOT NULL DEFAULT false;
