import React, { useState, useCallback, useRef } from 'react';
import { Papa } from 'papaparse';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader,
  Download
} from 'lucide-react';
import _ from 'lodash';

// Mock Firebase implementation - Replace with actual Firebase in production
const mockFirestore = {
  collection: (name) => ({
    doc: (id) => ({
      set: async (data) => {
        // Simulate success/failure (5% failure rate for demo)
        await new Promise(resolve => setTimeout(resolve, 2));
        if (Math.random() > 0.95) throw new Error("Simulated failure");
        return Promise.resolve();
      }
    })
  })
};

// In real implementation, import these
// import { collection, doc, setDoc } from 'firebase/firestore';
// import { db } from './firebase-config';

export default function BulkCsvUploader() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);
  const [failedRows, setFailedRows] = useState([]);
  const [successRows, setSuccessRows] = useState(0);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const abortControllerRef = useRef(null);
  const batchSizeRef = useRef(null);
  const collectionNameRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setIsComplete(false);
      setCurrentProgress(0);
      setProcessedRows(0);
      setSuccessRows(0);
      setFailedRows([]);
    }
  };

  // Generate a unique ID for each document
  const generateId = (row, index) => {
    return row.id || `doc-${index}-${Date.now()}`;
  };

  // Helper to save failed rows to CSV
  const saveFailedRowsToCsv = () => {
    if (failedRows.length === 0) return;

    const csv = Papa.unparse(failedRows.map(item => item.data));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `failed_rows_${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process the CSV file in batches
  const processFile = useCallback(async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    const batchSize = parseInt(batchSizeRef.current.value) || 100;
    const collectionName = collectionNameRef.current.value || 'uploads';

    setProcessing(true);
    setError("");
    setCurrentProgress(0);
    setProcessedRows(0);
    setSuccessRows(0);
    setFailedRows([]);
    setIsComplete(false);

    // Create a new AbortController for this operation
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true, // Use a worker thread for better performance
        step: function(results, parser) {
          // Just count rows here, actual processing happens later
          parser.pause();
          setTimeout(() => parser.resume(), 0);
        },
        complete: async function(results) {
          const rows = results.data;
          setTotalRows(rows.length);

          // Process in batches for better performance
          const batches = _.chunk(rows, batchSize);

          for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            if (signal.aborted) break;

            const batch = batches[batchIndex];
            const promises = batch.map((row, rowIndex) => {
              const actualIndex = batchIndex * batchSize + rowIndex;
              const docId = generateId(row, actualIndex);

              // In production, replace with real Firestore
              // return setDoc(doc(db, collectionName, docId), row)
              return mockFirestore.collection(collectionName).doc(docId).set(row)
                .then(() => {
                  setSuccessRows(prev => prev + 1);
                  return { success: true, data: row };
                })
                .catch(error => {
                  // Store failed rows for later export
                  setFailedRows(prev => [...prev, { data: row, error: error.message }]);
                  return { success: false, data: row, error: error.message };
                })
                .finally(() => {
                  setProcessedRows(prev => {
                    const newValue = prev + 1;
                    setCurrentProgress(Math.floor((newValue / rows.length) * 100));
                    return newValue;
                  });
                });
            });

            // Wait for current batch to complete before processing next batch
            await Promise.all(promises);

            // Small delay between batches to let UI update
            await new Promise(resolve => setTimeout(resolve, 10));
          }

          setIsComplete(true);
          setProcessing(false);
        },
        error: function(error) {
          setError(`Error parsing CSV: ${error.message}`);
          setProcessing(false);
        }
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
      setProcessing(false);
    }
  }, [file]);

  // Cancel the upload process
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setProcessing(false);
      setError("Upload canceled");
    }
  };

  // Display for progress percentage
  const progressPercentage = totalRows > 0 ? Math.floor((processedRows / totalRows) * 100) : 0;

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Bulk CSV Uploader</h1>

      {/* Configuration */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Collection Name</label>
          <input
            ref={collectionNameRef}
            type="text"
            className="border p-2 rounded-md"
            placeholder="firestore_collection_name"
            defaultValue="uploads"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Batch Size</label>
          <input
            ref={batchSizeRef}
            type="number"
            className="border p-2 rounded-md"
            placeholder="100"
            defaultValue="100"
            min="10"
            max="500"
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {!file ? (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-4">Drag & drop a CSV file or click to browse</p>
              <input
                type="file"
                id="csv-file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={processing}
              />
              <label
                htmlFor="csv-file"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Select CSV File
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setCurrentProgress(0);
                  setTotalRows(0);
                  setProcessedRows(0);
                  setFailedRows([]);
                  setSuccessRows(0);
                  setError("");
                  setIsComplete(false);
                }}
                className="text-red-500 hover:text-red-700"
                disabled={processing}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex mb-6">
        <button
          onClick={processFile}
          disabled={!file || processing}
          className={`flex-1 py-2 px-4 rounded-md mr-2 flex items-center justify-center ${
            !file || processing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {processing ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Processing...
            </>
          ) : (
            <>Upload to Firestore</>
          )}
        </button>

        {processing && (
          <button
            onClick={handleCancel}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Progress Display */}
      {(processing || isComplete) && totalRows > 0 && (
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Progress: {processedRows} of {totalRows} rows ({progressPercentage}%)
            </span>
            <span className="text-sm font-medium text-gray-700">
              {successRows} successful • {failedRows.length} failed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                isComplete
                  ? failedRows.length === 0
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {isComplete && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-medium text-lg mb-2 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Upload Complete
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded-md border border-gray-200">
              <p className="text-sm text-gray-500">Total Rows</p>
              <p className="text-xl font-bold">{totalRows}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-green-200">
              <p className="text-sm text-green-600">Successful</p>
              <p className="text-xl font-bold text-green-600">{successRows}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-red-200">
              <p className="text-sm text-red-600">Failed</p>
              <p className="text-xl font-bold text-red-600">{failedRows.length}</p>
            </div>
          </div>

          {failedRows.length > 0 && (
            <div>
              <button
                onClick={saveFailedRowsToCsv}
                className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Failed Rows as CSV
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}