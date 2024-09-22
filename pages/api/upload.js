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
      const [startDate, startTime] = entry['Date'].split(' ');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      
      // Assuming each session is 75 minutes (1 hour and 15 minutes)
      const endDate = new Date(startDate);
      endDate.setHours(startHour + 1);
      endDate.setMinutes(startMinute + 15);

      const startDateTime = new Date(startDate);
      startDateTime.setHours(startHour);
      startDateTime.setMinutes(startMinute);

      return {
        title: `${entry['Course']} - ${entry['Topic']}`,
        description: `Faculty: ${entry['Faculty']}\nMeeting Link: ${entry['Meeting Link']}`,
        start: [
          startDateTime.getFullYear(),
          startDateTime.getMonth() + 1,
          startDateTime.getDate(),
          startDateTime.getHours(),
          startDateTime.getMinutes(),
        ],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ],
        url: entry['Meeting Link'],
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
