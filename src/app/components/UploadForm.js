'use client';

// components/UploadForm.js

import { useState } from 'react';

function UploadForm() {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select an Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar.ics';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="fileInput">
        Upload Excel File:
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
      </label>
      <button type="submit">Convert to Calendar</button>
    </form>
  );
}

export default UploadForm;
