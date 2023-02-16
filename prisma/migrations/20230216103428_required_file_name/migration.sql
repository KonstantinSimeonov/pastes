/*
  Warnings:

  - Made the column `name` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "files" ALTER COLUMN "name" SET NOT NULL;
