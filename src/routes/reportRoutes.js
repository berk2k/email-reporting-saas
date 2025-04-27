// routes/reportRoutes.js
import express from 'express';
import {
    generateReport,
    getReport,
    getUserReports
  } from '../controllers/reportController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
//import { authMiddleware, verifyOwnership } from '../middlewares/authMiddleware.js';


const router = express.Router();


// Tüm rota işlemlerinde authentication gerekiyor
router.use(authMiddleware);
//router.use(verifyOwnership)

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation and management
 */

/**
 * @swagger
 * /reports/generate:
 *   post:
 *     summary: Generate a report manually
 *     description: Creates a new report based on existing report settings
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportSettingsId:
 *                 type: integer
 *                 description: ID of the report settings to use for generating the report
 *             required:
 *               - reportSettingsId
 *     responses:
 *       201:
 *         description: Report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reportId:
 *                   type: integer
 *       403:
 *         description: Forbidden - Not authorized to access this report setting
 *       500:
 *         description: Internal server error
 */
router.post('/generate',generateReport);
//verifyOwnership("reportSettings")

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all user reports
 *     description: Retrieves all reports belonging to the authenticated user
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   reportSettingsId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   sent:
 *                     type: boolean
 *                   reportSettings:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       reportType:
 *                         type: string
 *                       frequency:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', getUserReports);

/**
 * @swagger
 * /reports/{reportId}:
 *   get:
 *     summary: Get a specific report
 *     description: Retrieves a specific report by ID
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the report to retrieve
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 reportSettings:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     reportType:
 *                       type: string
 *                     frequency:
 *                       type: string
 *                 content:
 *                   type: object
 *                   description: The parsed report content, structure varies by report type
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
router.get('/:reportId',getReport);
//verifyOwnership("report")



export default router;