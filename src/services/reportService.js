
import { PrismaClient } from '@prisma/client';
import * as reportService from '../services/reportService.js';
import * as fileService from '../services/fileService.js';


const prisma = new PrismaClient();



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
        reportContent = await reportService.generateSalesReport(reportSettings);
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

    await fileService.saveReportToFile(reportSettings.userId, reportSettings.reportType, reportContent);

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


// Kullanıcının tüm raporlarını getirir
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

// Belirli bir raporu ID'ye göre getirir

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
      throw new Error('Rapor bulunamadı');
    }

    return report;
  } catch (error) {
    console.error('Rapor getirme hatası:', error.message);
    throw new Error('Rapor getirilirken bir hata oluştu: ' + error.message);
  }
};


  
  
