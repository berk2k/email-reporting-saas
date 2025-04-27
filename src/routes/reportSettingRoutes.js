// src/routes/reportSettingsRoutes.js

import express from 'express';
import {
  createOrUpdateReportSettingController,
  getAllReportSettingsController,
  updateReportSettingController,
  deleteReportSettingController
} from '../controllers/reportSettingsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
//import { authMiddleware, verifyOwnership } from '../middlewares/authMiddleware.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ReportSetting
 *   description: Report settings for managing user preferences on report frequency and type.
 */

/**
 * @swagger
 * /settings/report-settings:
 *   post:
 *     summary: Create or Update a report setting
 *     description: Creates a new report setting or updates an existing one based on user ID, report type, and frequency.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               reportType:
 *                 type: string
 *               frequency:
 *                 type: string
 *             required:
 *               - userId
 *               - reportType
 *               - frequency
 *     responses:
 *       200:
 *         description: Report setting created or updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/report-settings', authMiddleware, createOrUpdateReportSettingController);

/**
 * @swagger
 * /settings/report-settings/{userId}:
 *   get:
 *     summary: Get all report settings for a user
 *     description: Retrieves all report settings associated with the specified user ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The user ID to get report settings for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched report settings.
 *       500:
 *         description: Internal server error.
 */
router.get('/report-settings/:userId', authMiddleware, getAllReportSettingsController);
 


/**
 * @swagger
 * /settings/report-settings/{userId}/{reportType}/{frequency}:
 *   put:
 *     summary: Update a specific report setting
 *     description: Updates an existing report setting's frequency for a specific user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The user ID.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: reportType
 *         in: path
 *         description: The type of report.
 *         required: true
 *         schema:
 *           type: string
 *       - name: frequency
 *         in: path
 *         description: The current frequency.
 *         required: true
 *         schema:
 *           type: string
 *       - name: newFrequency
 *         in: body
 *         description: The new frequency for the report.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report setting updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.put('/report-settings/:userId/:reportType/:frequency', authMiddleware, updateReportSettingController);

/**
 * @swagger
 * /settings/report-settings/{userId}/{reportType}/{frequency}:
 *   delete:
 *     summary: Delete a report setting
 *     description: Deletes a specific report setting for a user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The user ID.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: reportType
 *         in: path
 *         description: The type of report.
 *         required: true
 *         schema:
 *           type: string
 *       - name: frequency
 *         in: path
 *         description: The frequency of the report.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report setting deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete('/report-settings/:userId/:reportType/:frequency', authMiddleware, deleteReportSettingController);

export default router;
