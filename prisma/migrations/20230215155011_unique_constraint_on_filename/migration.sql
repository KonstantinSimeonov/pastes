/*
  Warnings:

  - A unique constraint covering the columns `[pasteId,name]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "files_pasteId_name_key" ON "files"("pasteId", "name");
