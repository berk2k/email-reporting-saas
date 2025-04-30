import prisma from '../models/prisma.js';

export const createOrUpdateReportSetting = async (userId, reportType, frequency, startDate) => {
  try {
    
    const existingSetting = await prisma.reportSettings.findUnique({
      where: {
        userId_reportType_frequency: {
          userId: userId,
          reportType: reportType,
          frequency: frequency,
        },
      },
    });

    if (existingSetting) {

      console.log('Report setting already exists:', existingSetting);
      return existingSetting;
    }


    const newReportSetting = await prisma.reportSettings.create({
      data: {
        userId,
        reportType,
        frequency,
        startDate: startDate || new Date(),
      },
    });

    console.log('New report setting added:', newReportSetting);
    return newReportSetting;
  } catch (error) {
    console.error('Error creating or updating report setting:', error);
    throw new Error('Error creating or updating report setting: ' + error.message);
  }
};

export const getAllReportSettings = async (userId) => {
  try {
   
    const userIdInt = parseInt(userId, 10);


    if (isNaN(userIdInt)) {
      throw new Error('Invalid user ID');
    }

    
    const reportSettings = await prisma.reportSettings.findMany({
      where: {
        userId: userIdInt,  
      },
    });

    return reportSettings;
  } catch (error) {
    console.error('Error fetching report settings:', error);
    throw new Error('Error fetching report settings: ' + error.message);
  }
};


export const updateReportSetting = async (userId, reportType, frequency, newFrequency) => {
  try {
    const updatedSetting = await prisma.reportSettings.update({
      where: {
        userId_reportType_frequency: {
          userId: userId,
          reportType: reportType,
          frequency: frequency,
        },
      },
      data: {
        frequency: newFrequency,
      },
    });
    return updatedSetting;
  } catch (error) {
    console.error('Error updating report setting:', error);
    throw new Error('Error updating report setting: ' + error.message);
  }
};

export const deleteReportSetting = async (userId, reportType, frequency) => {
  try {
    const deletedSetting = await prisma.reportSettings.delete({
      where: {
        userId_reportType_frequency: {
          userId: userId,
          reportType: reportType,
          frequency: frequency,
        },
      },
    });
    return deletedSetting;
  } catch (error) {
    console.error('Error deleting report setting:', error);
    throw new Error('Error deleting report setting: ' + error.message);
  }
};



