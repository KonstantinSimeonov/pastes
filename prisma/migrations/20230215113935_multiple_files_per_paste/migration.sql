/*
  Warnings:

  - You are about to drop the column `content` on the `pastes` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `pastes` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `pastes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pastes" DROP COLUMN "content",
DROP COLUMN "language",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255),
    "content" VARCHAR(8192) NOT NULL,
    "pasteId" UUID NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "pastes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
