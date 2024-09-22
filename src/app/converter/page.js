import { auth } from '@clerk/nextjs/server';
import ExcelToCalendar from '../components/ExcelToCalendar';

export const metadata = {
  title: 'Excel to Google Calendar Converter',
};

export default async function ConverterPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not authenticated. Please sign in.</div>;
  }

  return (
    <div>
      <ExcelToCalendar />
    </div>
  );
}
