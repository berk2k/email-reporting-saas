import cron from 'node-cron';
import { generateReport,calculateNextRun } from '../services/reportService.js';
import { prisma } from '../prismaClient';


const scheduleReports = () => {
  cron.schedule('* * * * *', async () => { 
    const now = new Date();

    
    const scheduledReports = await prisma.scheduledReport.findMany({
      where: {
        nextRun: {
          lte: now,
        },
      },
    });

    
    for (const scheduledReport of scheduledReports) {
      try {
        
        const reportSettings = await prisma.reportSettings.findUnique({
          where: { id: scheduledReport.reportSettingsId },
        });

        if (reportSettings) {
          
          await generateReport(reportSettings.id);

          
          const nextRun = calculateNextRun(reportSettings);

          
          await prisma.scheduledReport.update({
            where: { id: scheduledReport.id },
            data: { nextRun },
          });
        }
      } catch (error) {
        console.error('Error processing scheduled report:', error);
      }
    }
  });
};


scheduleReports();
