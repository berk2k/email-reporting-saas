import { createScheduledReport } from '../services/reportService.js';

export const createScheduledReportController = async (req, res) => {
    const { reportSettingsId } = req.body;
  
    if (!reportSettingsId) {
      return res.status(400).json({ error: 'reportSettingsId is required' });
    }
  
    try {
      const userId = req.user.userId;
  
      
      const reportSettings = await prisma.reportSettings.findUnique({
        where: { id: reportSettingsId },
      });
  
      
      if (reportSettings.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized access to report setting.' });
      }
  
      
      const scheduledReport = await createScheduledReport(reportSettings);
  
      res.status(201).json(scheduledReport);
    } catch (error) {
      console.error('Error creating scheduled report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  