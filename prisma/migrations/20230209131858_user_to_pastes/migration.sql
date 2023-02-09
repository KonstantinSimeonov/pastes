-- AlterTable
ALTER TABLE "pastes" ADD COLUMN     "authorId" TEXT;

-- AddForeignKey
ALTER TABLE "pastes" ADD CONSTRAINT "pastes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
