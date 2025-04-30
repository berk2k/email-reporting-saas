// src/jobs/cronScheduler.js
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { generateReport } from '../services/reportService.js';

const prisma = new PrismaClient();

const runScheduledReports = async () => {
  const now = new Date();

  const scheduledReports = await prisma.scheduledReport.findMany({
    where: {
      nextRun: {
        lte: now,
      },
    },
    include: {
      reportSettings: true,
    },
  });

  for (const scheduled of scheduledReports) {
    try {
      await generateReport(scheduled.reportSettingsId);

      let nextRun = new Date(scheduled.nextRun);
      switch (scheduled.reportSettings.frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
      }

      await prisma.scheduledReport.update({
        where: { id: scheduled.id },
        data: { nextRun },
      });

      console.log(`Generated scheduled report for settings ID ${scheduled.reportSettingsId}`);
    } catch (err) {
      console.error('Scheduled report error:', err);
    }
  }
};

// run per minute
cron.schedule('* * * * *', runScheduledReports);
