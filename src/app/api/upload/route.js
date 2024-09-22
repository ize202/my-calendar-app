import { NextResponse } from 'next/server';
import multer from 'multer';
import XLSX from 'xlsx';
import { createEvents } from 'ics';

const upload = multer({ storage: multer.memoryStorage() });

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();

  try {
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Transform jsonData into events
    const events = jsonData.map((entry) => {
      const [startDate, startTime] = entry['Date'].split(' ');
      const [startHour, startMinute] = startTime.split(':').map(Number);

      // Assuming each session is 75 minutes (1 hour and 15 minutes)
      const startDateTime = new Date(`${startDate} ${startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + 75 * 60000); // Add 75 minutes

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
          endDateTime.getFullYear(),
          endDateTime.getMonth() + 1,
          endDateTime.getDate(),
          endDateTime.getHours(),
          endDateTime.getMinutes(),
        ],
        url: entry['Meeting Link'],
      };
    });

    // Create the ICS file content
    const { error, value } = createEvents(events);

    if (error) {
      throw error;
    }

    // Return the ICS file content
    return new NextResponse(value, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': 'attachment; filename=calendar.ics',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed to process the file: ${error.message}` }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
