-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "Paste" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "content" VARCHAR(8192) NOT NULL,

    CONSTRAINT "Paste_pkey" PRIMARY KEY ("id")
);
