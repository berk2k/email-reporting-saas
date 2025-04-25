-- CreateTable
CREATE TABLE "ReportSettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "lastGenerated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportSettings" ADD CONSTRAINT "ReportSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
