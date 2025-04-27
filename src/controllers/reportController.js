import { PrismaClient } from '@prisma/client';
import * as reportService from '../services/reportService.js'; 

const prisma = new PrismaClient();

// Manuel olarak rapor oluşturma
export const generateReport = async (req, res) => {
  try {
    const { reportSettingsId } = req.body;

    // Kullanıcının kendi rapor ayarı olduğunu doğrulayalım
    const reportSettings = await prisma.reportSettings.findFirst({
      where: {
        id: reportSettingsId,
        userId: req.user.id, // Kullanıcının doğrulaması
      },
    });

    if (!reportSettings) {
      return res.status(403).json({ message: 'Bu rapor ayarına erişim izniniz yok' });
    }

    // ReportService'den rapor oluşturma işlemini çağırıyoruz
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

// Kullanıcının tüm raporlarını listeleme
export const getUserReports = async (req, res) => {
  try {
    const reports = await reportService.getUserReports(req.user.id);
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
    
    // Raporu getirme işlemi
    const report = await reportService.getReportById(parseInt(reportId), req.user.id);

    if (!report) {
      return res.status(404).json({ message: 'Rapor bulunamadı' });
    }

    // JSON string'i objeye çevirelim
    const reportContent = JSON.parse(report.content);

    res.status(200).json({
      id: report.id,
      createdAt: report.createdAt,
      reportSettings: report.reportSettings,
      content: reportContent,
    });
  } catch (error) {
    console.error('Rapor getirme hatası:', error);
    res.status(500).json({ message: 'Rapor getirilirken bir hata oluştu' });
  }
};
