import UploadForm from './components/UploadForm';

export const metadata = {
  title: 'Excel to Google Calendar Converter',
};

export default function Home() {
  return (
    <div>
      <main>
        <h1>Excel to Google Calendar Converter</h1>
        <UploadForm />
      </main>
    </div>
  );
}