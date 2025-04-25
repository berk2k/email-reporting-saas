/*
  Warnings:

  - A unique constraint covering the columns `[userId,reportType,frequency]` on the table `ReportSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReportSettings_userId_reportType_frequency_key" ON "ReportSettings"("userId", "reportType", "frequency");
