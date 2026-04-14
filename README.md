# Excel2Calendar

Excel2Calendar is a Next.js utility that turns a spreadsheet into an `.ics` file. Upload a class or event schedule, let the server extract event data, and download a calendar you can import into Google Calendar or Apple Calendar.

## What it is

This repo is a small App Router prototype built with Next.js. It uses Clerk for sign-in, parses the first workbook sheet with `xlsx`, asks OpenAI to shape the rows into calendar events, and returns a generated ICS file.

## What problem it solves

Schedule data often arrives as a spreadsheet that is annoying to re-enter by hand. This project was my pass at reducing that work to one upload and one download.

## What I built

- A Clerk-backed sign-in flow and protected converter page
- A drag-and-drop upload UI with progress feedback and download state
- A server route that reads spreadsheet rows with `xlsx`
- An OpenAI step that normalizes those rows into calendar events
- ICS generation and browser download from the same flow

## Stack

- Next.js 14
- React
- Clerk
- OpenAI
- XLSX
- ICS
- Tailwind CSS

## Screenshots or demo

1. Sign in.
2. Open `/converter`.
3. Upload an `.xlsx` file with schedule rows.
4. Wait for the server to convert the first sheet into calendar events.
5. Download `calendar.ics`.

There is no hosted demo right now. Run it locally if you want to test the flow.

## Local setup

1. Install dependencies with `npm install`.
2. Create `.env.local` with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
OPENAI_API_KEY=...
```

3. Start the app with `npm run dev`.
4. Visit `http://localhost:3000`.

## Current status

Working prototype. It is best suited to one-sheet schedules where the event details can be inferred from row data.
