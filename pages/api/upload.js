// pages/api/upload.js

import nextConnect from 'next-connect';
import multer from 'multer';
import XLSX from 'xlsx';
import { createEvents } from 'ics';

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Transform jsonData into events
    const events = jsonData.map((entry) => {
      // Adjust these fields based on your Excel file's column names
      const startDate = new Date(entry['Start Date']);
      const endDate = new Date(entry['End Date']);

      return {
        title: entry['Class Name'] || 'Class',
        description: entry['Description'] || '',
        location: entry['Location'] || '',
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ],
      };
    });

    // Create the ICS file content
    const { error, value } = createEvents(events);

    if (error) {
      throw error;
    }

    // Set headers to prompt file download
    res.setHeader('Content-Disposition', 'attachment; filename=calendar.ics');
    res.setHeader('Content-Type', 'text/calendar');

    res.status(200).send(value);
  } catch (error) {
    res.status(500).json({ error: `Failed to process the file: ${error.message}` });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};
