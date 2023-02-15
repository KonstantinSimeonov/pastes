/*
  Warnings:

  - The primary key for the `files` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "files" DROP CONSTRAINT "files_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "files_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pastes" ADD COLUMN     "description" TEXT;
