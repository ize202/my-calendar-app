"use client"

import { useState } from "react"
import { Upload, Calendar, Check, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// You'll need to create these components or use a UI library that provides them
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function ExcelToCalendar() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isConverted, setIsConverted] = useState(false)
  const [error, setError] = useState(null)

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload', true)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(percentComplete)
        }
      }

      xhr.onload = function() {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'text/calendar' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'calendar.ics'
          document.body.appendChild(a)
          a.click()
          a.remove()
          setIsConverted(true)
        } else {
          const errorData = JSON.parse(xhr.responseText)
          setError(`Error: ${errorData.error}`)
        }
        setIsUploading(false)
      }

      xhr.onerror = function() {
        setError('An error occurred while uploading the file. Please try again.')
        setIsUploading(false)
      }

      xhr.responseType = 'blob'
      xhr.send(formData)
    } catch (error) {
      console.error('Error uploading file:', error)
      setError('An error occurred while uploading the file. Please try again.')
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center text-gray-800"
      >
        Excel to Calendar Converter
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-blue-300 rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors hover:border-blue-500"
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx"
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-gray-600">
              {file ? file.name : "Drag & drop your Excel file here or click to browse"}
            </p>
          </label>
        </div>
        <Button
          onClick={handleConvert}
          disabled={!file || isUploading || isConverted}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="mr-2 h-4 w-4" />
          )}
          Convert to Calendar
        </Button>
        {isUploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-center mt-2">{uploadProgress}% uploaded</p>
          </div>
        )}
        {isConverted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="text-gray-800 mb-2">Conversion complete!</p>
            <p className="text-gray-600">Your calendar file has been downloaded.</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center text-red-500"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
