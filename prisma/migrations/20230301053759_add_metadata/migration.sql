-- CreateTable
CREATE TABLE "Metadata" (
    "id" TEXT NOT NULL,
    "userStatsUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);
