# Excel to Google Calendar Converter

## Description

This web application allows users to easily convert Excel spreadsheets containing schedule information into Google Calendar events. It provides a simple, intuitive interface for uploading Excel files and generating calendar files that can be imported into Google Calendar.

## Features

- Drag-and-drop file upload
- Support for .xlsx file format
- Real-time conversion progress indication
- Downloadable .ics calendar file output
- Responsive design for desktop and mobile use
- User authentication with Clerk

## Technologies Used

- React.js
- Next.js 14
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- XLSX library for Excel file parsing
- ICS library for calendar file creation
- OpenAI GPT-4 for intelligent event extraction
- Clerk for user authentication

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or later)
- npm or yarn
- An OpenAI API key
- A Clerk account and API keys

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/ize202/my-calendar-app.git
   ```

2. Navigate to the project directory:
   ```
   cd excel-to-calendar-converter
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Sign in using your google account.
2. On the converter page, drag and drop your Excel file or click to browse and select it.
3. Click the "Convert to Calendar" button.
4. Wait for the conversion process to complete.
5. Once complete, the .ics file will automatically download.
6. Import the .ics file into your preferred calendar application (e.g., Google Calendar).