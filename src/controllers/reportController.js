import { PrismaClient } from '@prisma/client';
import * as reportService from '../services/reportService.js'; 

const prisma = new PrismaClient();

// Manuel olarak rapor oluşturma
export const generateReport = async (req, res) => {
  try {
    const { reportSettingsId } = req.body;
    const tokenUserId = req.user.userId;

    const reportSettings = await prisma.reportSettings.findUnique({
      where: { id: reportSettingsId },
    });

    if (!reportSettings) {
      return res.status(404).json({ message: 'Rapor ayarları bulunamadı.' });
    }

    if (reportSettings.userId !== tokenUserId) {
      return res.status(403).json({ message: 'Bu rapor ayarına erişim izniniz yok.' });
    }

    // Safe zone: Yetki kontrolü geçildi
    const report = await reportService.generateReport(reportSettingsId);

    res.status(201).json({
      message: 'Rapor başarıyla oluşturuldu',
      reportId: report.id,
    });
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error);
    res.status(500).json({ message: 'Rapor oluşturulurken bir hata oluştu' });
  }
};
// export const generateReport = async (req, res) => {
//   try {
//     const reportSettings = req.reportSettings; // verifyOwnership sayesinde geliyor

//     // Safe zone: userId kontrolü yapılmış oldu
    
//     const report = await reportService.generateReport(reportSettings.id);

//     res.status(201).json({
//       message: 'Rapor başarıyla oluşturuldu',
//       reportId: report.id,
//     });
//   } catch (error) {
//     console.error('Rapor oluşturma hatası:', error);
//     res.status(500).json({ message: 'Rapor oluşturulurken bir hata oluştu' });
//   }
// };



// Kullanıcının tüm raporlarını listeleme
export const getUserReports = async (req, res) => {
  try {
    const reports = await reportService.getUserReports(req.user.userId);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Raporları getirme hatası:', error);
    res.status(500).json({ message: 'Raporlar getirilirken bir hata oluştu' });
  }
};

// Belirli bir raporu görüntüleme
export const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await reportService.getReportById(parseInt(reportId));

    // Authorization: Check if the user has permission to access the report
    if (report.reportSettings.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Bu rapora erişim izniniz yok.' });
    }

    // Parse the report content (if needed)
    const reportContent = JSON.parse(report.content);

    res.status(200).json({
      createdAt: report.createdAt,
      content: reportContent,
    });
  } catch (error) {
    // Error handling
    console.error('Rapor getirme hatası:', error.message);

    if (error.message.includes('Rapor bulunamadı')) {
      return res.status(404).json({ message: 'Rapor bulunamadı' });
    }

    // General error message
    res.status(500).json({ message: 'Bir şeyler yanlış gitti, lütfen tekrar deneyin.' });
  }
};


