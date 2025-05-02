-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "reportSettingsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportSettingsId_fkey" FOREIGN KEY ("reportSettingsId") REFERENCES "ReportSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
