import { PrismaClient } from '@prisma/client';
import * as reportService from '../services/reportService.js'; 

const prisma = new PrismaClient();

// Manuel olarak rapor oluşturma
export const generateReport = async (req, res) => {
  try {
    const { reportSettingsId } = req.body;

    //console.log('generateReport içindeki req.user:', req.user);
    //console.log('req.body:', req.body);
    // Kullanıcının kendi rapor ayarı olduğunu doğrulayalım
    const reportSettings = await prisma.reportSettings.findFirst({
      where: {
        id: reportSettingsId,
        userId: req.user.userId, // Kullanıcının doğrulaması
      },
    });

    if (!reportSettings) {
      return res.status(403).json({ message: 'Bu rapor ayarına erişim izniniz yok' });
    }

    // ReportService'den rapor oluşturma işlemini çağırıyoruz
    const report = await reportService.generateReport(reportSettingsId,req);

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
    
    // Raporu getirme işlemi
    const report = await reportService.getReportById(parseInt(reportId), req);

    if (!report) {
      return res.status(404).json({ message: 'Rapor bulunamadı' });
    }

    // JSON string'i objeye çevirelim
    const reportContent = JSON.parse(report.content);

    res.status(200).json({
      createdAt: report.createdAt,
      content: reportContent,
    });
  } catch (error) {
    // Daha detaylı hata mesajı ile loglama
    console.error('Rapor getirme hatası:', error.message);

    // Kullanıcıya dostane mesaj döndürme
    if (error.message.includes('Rapor bulunamadı')) {
      return res.status(404).json({ message: 'Bu rapora erişim izniniz yok veya rapor bulunamadı.' });
    }

    // Genel hata mesajı
    res.status(500).json({ message: 'Bir şeyler yanlış gitti, lütfen tekrar deneyin.' });
  }
};

