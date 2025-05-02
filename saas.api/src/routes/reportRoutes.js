// routes/reportRoutes.js
import express from 'express';
import {
    generateReport,
    getReport,
    getUserReports
  } from '../controllers/reportController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createScheduledReportController } from '../controllers/scheduledReportController.js';
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
 * /reports/scheduled-report:
 *   post:
 *     summary: Create a scheduled report
 *     description: Creates a scheduled report based on an existing report setting and a specified start date.
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
 *                 example: 1
 *               
 *             required:
 *               - reportSettingsId
 *               
 *     responses:
 *       200:
 *         description: Scheduled report created successfully.
 *       403:
 *         description: Unauthorized access to the report setting.
 *       500:
 *         description: Internal server error.
 */

router.post('/schedule-report',createScheduledReportController);


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

/**
 * @swagger
 * /reports/user:
 *   get:
 *     summary: Get reports for the logged-in user
 *     description: Retrieves all reports for the logged-in user based on their authentication token
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   reportSettings:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       reportType:
 *                         type: string
 *                       frequency:
 *                         type: string
 *                   content:
 *                     type: object
 *                     description: The parsed content of the report, the structure depends on the report type
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/user', getUserReports);

//verifyOwnership("report")




export default router;