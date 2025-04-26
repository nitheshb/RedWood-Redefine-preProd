import { useState } from 'react'
import DocRow from './Docu_row'

const UploadSection = ({ docDataList, id }) => {
  const [showDocs, setShowDocs] = useState(false)

  return (
    <div>
      {!showDocs ? (
        <button
          onClick={() => setShowDocs(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Upload
        </button>
      ) : (
        <div className="space-y-4">
          {docDataList.map((doc, index) => (
            <DocRow
              key={index}
              id={id}
              fileName={doc.fileName}
              date={doc.date}
              amount={doc.amount}
              status={doc.status}
              data={doc.data}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadSection
