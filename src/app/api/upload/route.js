import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createEvents } from 'ics';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Use AI to interpret the data
    const events = await interpretDataWithAI(jsonData);

    const { error, value } = createEvents(events);

    if (error) {
      throw error;
    }

    return new NextResponse(value, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': 'attachment; filename=calendar.ics',
      },
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: `Failed to process the file: ${error.message}` }, { status: 500 });
  }
}

async function interpretDataWithAI(jsonData) {
  const prompt = `
    You are an AI assistant that interprets Excel data and converts it into calendar events.
    The data represents a schedule of classes or events.
    Please analyze the following JSON data and extract the necessary information to create calendar events.
    Each event should have a title, start date and time, end date and time, description, and URL if available.
    Here's the data:
    ${JSON.stringify(jsonData, null, 2)}
    
    Please return a JSON array of events in the following format:
    [
      {
        "title": "Event Title",
        "start": ["YYYY", "MM", "DD", "HH", "mm"],
        "end": ["YYYY", "MM", "DD", "HH", "mm"],
        "description": "Event description",
        "url": "Event URL (if available)"
      },
      ...
    ]
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const aiInterpretedEvents = JSON.parse(response.choices[0].message.content);
  return aiInterpretedEvents;
}

export const config = {
  api: {
    bodyParser: false,
  },
};
