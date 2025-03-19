import React, { useState } from 'react';

const DocumentUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Upload Document</h2>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;