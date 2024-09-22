import ExcelToCalendar from './components/ExcelToCalendar';

export const metadata = {
  title: 'Excel to Google Calendar Converter',
};

export default function Home() {
  return (
    <div>
      <ExcelToCalendar />
    </div>
  );
}