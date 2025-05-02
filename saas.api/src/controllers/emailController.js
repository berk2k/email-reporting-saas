import * as emailService from '../services/emailService.js';

export const sendTestEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    await emailService.sendEmail(to, subject, text, html);

    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email sending error:', error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
};
