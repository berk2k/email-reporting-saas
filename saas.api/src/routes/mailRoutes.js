import express from 'express';

import {sendTestEmail} from '../controllers/emailController.js';

const router = express.Router();

/**
 * @swagger
 * /email/send-test-email:
 *   post:
 *     summary: Test amaçlı bir e-posta gönderir
 *     tags: [Email Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 example: example@example.com
 *                 description: Alıcı e-posta adresi
 *               subject:
 *                 type: string
 *                 example: Test Email
 *                 description: E-posta başlığı
 *               text:
 *                 type: string
 *                 example: This is a plain text email
 *                 description: Düz metin içeriği
 *               html:
 *                 type: string
 *                 example: "<h1>HTML Email</h1><p>This is a test.</p>"
 *                 description: HTML içerikli mesaj
 *     responses:
 *       200:
 *         description: E-posta başarıyla gönderildi
 *       500:
 *         description: E-posta gönderimi sırasında bir hata oluştu
 */
router.post('/send-test-email', sendTestEmail);

export default router;