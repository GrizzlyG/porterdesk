/*
  Warnings:

  - You are about to drop the column `filePathName` on the `Notice` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notice` table. All the data in the column will be lost.
  - Added the required column `body` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headline` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "filePathName",
DROP COLUMN "title",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "headline" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "ps" TEXT,
ADD COLUMN     "subhead" TEXT;
