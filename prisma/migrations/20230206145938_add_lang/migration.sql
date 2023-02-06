/*
  Warnings:

  - You are about to drop the `Paste` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Paste";

-- CreateTable
CREATE TABLE "pastes" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255),
    "public" BOOLEAN NOT NULL DEFAULT true,
    "language" VARCHAR(16),
    "content" VARCHAR(8192) NOT NULL,

    CONSTRAINT "pastes_pkey" PRIMARY KEY ("id")
);
