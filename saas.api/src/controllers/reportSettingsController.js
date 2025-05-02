import { createOrUpdateReportSetting, getAllReportSettings, updateReportSetting, deleteReportSetting } from '../services/reportSettingService.js';


export const createOrUpdateReportSettingController = async (req, res) => {
  const { userId, reportType, frequency, startDate } = req.body;
  try {
    const result = await createOrUpdateReportSetting(userId, reportType, frequency, startDate);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllReportSettingsController = async (req, res) => {
  const { userId } = req.params;
  try {
    const settings = await getAllReportSettings(userId);
    res.status(200).json(settings);
  } catch (error) {
    res.status(404).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};



export const updateReportSettingController = async (req, res) => {
  const { userId, reportType, frequency } = req.params;
  const { newFrequency } = req.body;
  try {
    const updatedSetting = await updateReportSetting(userId, reportType, frequency, newFrequency);
    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteReportSettingController = async (req, res) => {
  const { userId, reportType, frequency } = req.params;
  try {
    const deletedSetting = await deleteReportSetting(userId, reportType, frequency);
    res.status(200).json(deletedSetting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
