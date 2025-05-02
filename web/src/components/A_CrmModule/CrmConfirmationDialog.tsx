import React from 'react'

const CrmConfirmationDialog = ({ onConfirm, onCancel }) => {
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center">
        <div className="flex h-[664px] w-full flex-col bg-purple-200 h-screen">
          <div className="relative top-6 mx-auto max-h-[65%] rounded-xl">
            <div className="grid gap-8 grid-cols-1">
              <div className="flex flex-col items-center">
                <h1>Are you sure?</h1>
                <div className="flex mt-4 space-x-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrmConfirmationDialog
