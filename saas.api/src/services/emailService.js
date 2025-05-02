import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: config.emailUser,
        pass: config.emailPass
    },
});

/**
 * 
 * @param {string} to - Alıcı email adresi
 * @param {string} subject - Email başlığı
 * @param {string} text - Düz metin içeriği
 * @param {string} html - HTML içeriği
 * @param {Array} attachments - Eklenecek dosyalar [{ filename, path }]
 */
export const sendEmail = async (to, subject, text, html,attachments = []) => {
    try {
      const mailOptions = {
        from: config.emailUser,
        to,
        subject,
        text,
        html,
        attachments,
      };
  
      
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  };