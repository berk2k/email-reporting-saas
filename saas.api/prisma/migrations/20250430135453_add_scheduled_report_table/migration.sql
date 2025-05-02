-- CreateTable
CREATE TABLE "ScheduledReport" (
    "id" SERIAL NOT NULL,
    "reportSettingsId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "nextRun" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduledReport" ADD CONSTRAINT "ScheduledReport_reportSettingsId_fkey" FOREIGN KEY ("reportSettingsId") REFERENCES "ReportSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
