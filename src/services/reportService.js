
import { PrismaClient } from '@prisma/client';
import * as reportService from '../services/reportService.js';
import * as fileService from '../services/fileService.js';


const prisma = new PrismaClient();


// Belirli bir rapor ayarına göre rapor oluşturur
export const generateReport = async (reportSettingsId, req) => {
  try {
    console.log('Generating report for settings ID:', reportSettingsId);
    //console.log('User from token:', req.user);
    
    const reportSettings = await prisma.reportSettings.findUnique({
      where: { id: reportSettingsId },
      include: { user: true },
    });

    console.log('User relationship:', reportSettings.user);

    console.log('Found report settings:', reportSettings);
    
    if (!reportSettings) {
      throw new Error('Rapor ayarları bulunamadı');
    }

    console.log('User relationship:', reportSettings.user);
    console.log('report settings userid:', reportSettings.userId);
    console.log('req.user:', req.user); // hata veren yer

    
    
    if (reportSettings.userId !== req.user.userId) {
      console.log(`Auth mismatch: report userId=${reportSettings.userId}, token userId=${req.user.userId}`);
      throw new Error('Yetkisiz erişim. Bu raporu oluşturma yetkiniz yok.');
    }
    

    let reportContent;
    switch (reportSettings.reportType) {
      case 'sales':
        reportContent = await reportService.generateSalesReport(reportSettings);
        break;
      default:
        throw new Error('Desteklenmeyen rapor tipi');
    }
    console.log("deneme2")
    
    const report = await prisma.report.create({
      data: {
        reportSettingsId: reportSettings.id,
        content: JSON.stringify(reportContent),
        sent: false,
      },
    });
    
    
    // JSON dosyasını kaydetme
    await fileService.saveReportToFile(reportSettings.userId, reportSettings.reportType, reportContent);
  
    console.log(`Rapor başarıyla kaydedildi.`);
    
    await prisma.reportSettings.update({
      where: { id: reportSettings.id },
      data: { lastGenerated: new Date() },
    });
    
    return report;
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error);
    throw error;
  }
};
  

// Satış raporu oluşturan yardımcı metod
export const generateSalesReport = async (reportSettings) => {
  // Frequency değerine göre tarih aralığını belirleyelim
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
      startDate.setDate(endDate.getDate() - 1); // Varsayılan olarak günlük
  }

  // Satış verilerini çekelim
  const salesData = await prisma.sales.findMany({
    where: {
      userId: reportSettings.userId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Rapor özeti için bazı hesaplamalar yapalım
  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const itemCount = salesData.length;

  // Ödeme metotlarına göre gruplama yapalım
  const paymentMethods = {};
  salesData.forEach((sale) => {
    if (!paymentMethods[sale.paymentMethod]) {
      paymentMethods[sale.paymentMethod] = 0;
    }
    paymentMethods[sale.paymentMethod] += sale.total;
  });

  // En çok satılan ürünleri bulalım
  const itemSales = {};
  salesData.forEach((sale) => {
    if (!itemSales[sale.item]) {
      itemSales[sale.item] = { quantity: 0, total: 0 };
    }
    itemSales[sale.item].quantity += sale.quantity;
    itemSales[sale.item].total += sale.total;
  });

  // Sonuçları döndürelim
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

export const getReportById = async (reportId, req) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        reportSettings: {
          userId: req.user.userId,  // Kullanıcının erişim izni kontrolü
        },
      },
      include: {
        reportSettings: true,
      },
    });

    if (!report) {
      throw new Error('Rapor bulunamadı'); // Hata mesajı, sadece backend için
    }

    return report;
  } catch (error) {
    console.error('Rapor getirme hatası:', error.message);
    throw new Error('Rapor getirilirken bir hata oluştu: ' + error.message);
  }
};

  
  
