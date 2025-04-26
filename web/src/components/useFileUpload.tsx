import { useState, useCallback } from 'react'

export function useFileUpload(): [string, (file: File) => Promise<void>] {
  const [uploadedFileLink, setUploadedFileLink] = useState('')

  const handleFileUpload = useCallback(async (file: File) => {
    const uploadedFileLink = await uploadFile(file)
    setUploadedFileLink(uploadedFileLink)
  }, [])

  return [uploadedFileLink, handleFileUpload]
}
