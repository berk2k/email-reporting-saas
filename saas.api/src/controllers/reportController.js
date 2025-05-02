import { PrismaClient } from '@prisma/client';
import * as reportService from '../services/reportService.js'; 

const prisma = new PrismaClient();

export const generateReport = async (req, res) => {
  try {
    const { reportSettingsId } = req.body;
    const tokenUserId = req.user.userId;

    const reportSettings = await prisma.reportSettings.findUnique({
      where: { id: reportSettingsId },
    });

    if (!reportSettings) {
      return res.status(404).json({ message: 'Report settings not found.' });
    }

    if (reportSettings.userId !== tokenUserId) {
      return res.status(403).json({ message: 'You do not have permission to access these report settings.' });
    }

    const report = await reportService.generateReport(reportSettingsId);

    res.status(201).json({
      message: 'Report created successfully.',
      reportId: report.id,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'An error occurred while creating the report.' });
  }
};

// export const generateReport = async (req, res) => {
//   try {
//     const reportSettings = req.reportSettings; // comes from verifyOwnership

//     // Safe zone: userId check has already been done
    
//     const report = await reportService.generateReport(reportSettings.id);

//     res.status(201).json({
//       message: 'Report created successfully.',
//       reportId: report.id,
//     });
//   } catch (error) {
//     console.error('Error creating report:', error);
//     res.status(500).json({ message: 'An error occurred while creating the report.' });
//   }
// };

export const getUserReports = async (req, res) => {
  try {
    const id = req.user.userId;
    const reports = await reportService.getUserReports(id);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'An error occurred while fetching the reports.' });
  }
};

export const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await reportService.getReportById(parseInt(reportId));

    if (report.reportSettings.userId !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to access this report.' });
    }

    const reportContent = JSON.parse(report.content);

    res.status(200).json({
      createdAt: report.createdAt,
      content: reportContent,
    });
  } catch (error) {
    console.error('Error fetching report:', error.message);

    if (error.message.includes('Report not found')) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(500).json({ message: 'Something went wrong, please try again.' });
  }
};
