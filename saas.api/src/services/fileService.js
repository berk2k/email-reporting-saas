import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const reportDirectory = path.join(__dirname, '..', 'report_files', 'reports');


export const ensureReportDirectoryExists = () => {
  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory, { recursive: true });
  }
};


export const saveReportToFile = (userId, reportType, reportContent) => {
  ensureReportDirectoryExists();

  const reportFileName = `${userId}-${reportType}.json`;
  const reportFilePath = path.join(reportDirectory, reportFileName);

  let existingContent = [];
  if (fs.existsSync(reportFilePath)) {
    const existingData = fs.readFileSync(reportFilePath, 'utf-8');
    existingContent = JSON.parse(existingData);
  }

  existingContent.push(reportContent);

  fs.writeFileSync(reportFilePath, JSON.stringify(existingContent, null, 2));

  console.log(`report file saved: ${reportFilePath}`);
  return reportFilePath; 
};


export const readReportFile = (userId, reportType) => {
  const reportFileName = `${userId}-${reportType}.json`;
  const reportFilePath = path.join(reportDirectory, reportFileName);

  if (!fs.existsSync(reportFilePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(reportFilePath, 'utf-8');
  return JSON.parse(fileContent);
};
