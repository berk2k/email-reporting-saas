
import { PrismaClient } from '@prisma/client';
import * as fileService from '../services/fileService.js';
import { sendEmail } from '../services/emailService.js';




const prisma = new PrismaClient();

export const createScheduledReport = async (reportSettings) => {
  try {
    
    const startDate = reportSettings.startDate;

    // NextRun'ı hesapla
    const nextRun = calculateNextRun(reportSettings);

    
    const scheduledReport = await prisma.scheduledReport.create({
      data: {
        reportSettingsId: reportSettings.id,
        startDate: startDate, 
        nextRun: nextRun,
      },
    });

    console.log('Scheduled Report created:', scheduledReport);
    return scheduledReport;
  } catch (error) {
    console.error('Error creating scheduled report:', error);
    throw error;
  }
};



export const generateReport = async (reportSettingsId) => {
  try {
    const reportSettings = await prisma.reportSettings.findUnique({
      where: { id: reportSettingsId },
      include: { user: true },
    });

    if (!reportSettings) {
      throw new Error('Rapor settings error');
    }

    let reportContent;
    switch (reportSettings.reportType) {
      case 'sales':
        reportContent = await generateSalesReport(reportSettings);
        break;
      default:
        throw new Error('Unsupported report type');
    }

    const report = await prisma.report.create({
      data: {
        reportSettingsId: reportSettings.id,
        content: JSON.stringify(reportContent),
        sent: false,
      },
    });

    const filePath = await fileService.saveReportToFile(reportSettings.userId, reportSettings.reportType, reportContent);
    await sendEmail(
      reportSettings.user.email,
      'Your Report is Ready',
      'You can find your report attached.',
      '<p>You can find your report attached.</p>',
      [
        {
          filename: `${reportSettings.reportType}-report.json`,
          path: filePath,
        },
      ]
    );

    await prisma.reportSettings.update({
      where: { id: reportSettings.id },
      data: { lastGenerated: new Date() },
    });

    return report;
  } catch (error) {
    console.error('Creating report error:', error);
    throw error;
  }
};

  


export const generateSalesReport = async (reportSettings) => {

  const endDate = new Date();
  let startDate = new Date();

  switch (reportSettings.frequency) {
    case 'daily':
      startDate.setDate(endDate.getDate() - 1);
      break;
    case 'weekly':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 1);
  }


  const salesData = await prisma.sales.findMany({
    where: {
      userId: reportSettings.userId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
  });


  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const itemCount = salesData.length;


  const paymentMethods = {};
  salesData.forEach((sale) => {
    if (!paymentMethods[sale.paymentMethod]) {
      paymentMethods[sale.paymentMethod] = 0;
    }
    paymentMethods[sale.paymentMethod] += sale.total;
  });

 
  const itemSales = {};
  salesData.forEach((sale) => {
    if (!itemSales[sale.item]) {
      itemSales[sale.item] = { quantity: 0, total: 0 };
    }
    itemSales[sale.item].quantity += sale.quantity;
    itemSales[sale.item].total += sale.total;
  });


  return {
    period: {
      startDate,
      endDate,
    },
    summary: {
      totalSales,
      itemCount,
      averageSale: itemCount > 0 ? totalSales / itemCount : 0,
    },
    paymentMethods,
    topItems: Object.entries(itemSales)
      .map(([item, data]) => ({
        item,
        quantity: data.quantity,
        total: data.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5),
    allSales: salesData,
  };
};



export const getUserReports = async (userId) => {
  return prisma.report.findMany({
    where: {
      reportSettings: {
        userId,
      },
    },
    include: {
      reportSettings: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};



export const getReportById = async (reportId) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
      },
      include: {
        reportSettings: true,
      },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    return report;
  } catch (error) {
    console.error('fetching report error:', error.message);
    throw new Error('error occured: ' + error.message);
  }
};




export const calculateNextRun = (reportSettings, startDate) => {
  const baseDate = new Date(startDate);
  switch (reportSettings.frequency) {
    case 'daily':
      return new Date(baseDate.setDate(baseDate.getDate() + 1));
    case 'weekly':
      return new Date(baseDate.setDate(baseDate.getDate() + 7));
    case 'monthly':
      return new Date(baseDate.setMonth(baseDate.getMonth() + 1));
    default:
      return baseDate; 
  }
};



  
  
