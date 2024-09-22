// pages/index.js

import Head from 'next/head';
import UploadForm from '../components/uploadForm';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Excel to Google Calendar Converter</title>
      </Head>
      <main>
        <h1>Excel to Google Calendar Converter</h1>
        <UploadForm />
      </main>
    </div>
  );
}
