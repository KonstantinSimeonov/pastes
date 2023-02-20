-- CreateTable
CREATE TABLE "user_prefs" (
    "userId" TEXT NOT NULL,
    "prismTheme" TEXT NOT NULL DEFAULT 'tomorrow',
    "uiTheme" TEXT NOT NULL DEFAULT 'dark',

    CONSTRAINT "user_prefs_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "user_prefs" ADD CONSTRAINT "user_prefs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
