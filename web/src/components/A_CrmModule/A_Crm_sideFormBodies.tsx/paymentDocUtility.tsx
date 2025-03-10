import { useState, useEffect } from 'react'

import {
  DocumentTextIcon,
  TrashIcon,
  ChatIcon,
  DownloadIcon,
  EyeIcon,
} from '@heroicons/react/outline'
import { prettyDate } from 'src/util/dateConverter'

const PaymentDocUtility = ({ id, fileName, date }) => {
  const [showModel, setShoModel] = useState(false)
  const [dateIs, setDate] = useState('NA')
  const toggle = () => setShoModel(!showModel)
  const deleteDocument = async (id) => {

  }
  useEffect(() => {
    if(date){
      setDate(prettyDate(date))
    }
    else{
      setDate('NA')
    }
  }, [date])

  return (
    <>
      <div className="flex max-w-3xl mx-auto items-center p-4 rounded-lg hover:bg-gray-300 cursor-pointer text-gray-700 text-sm">
        <DocumentTextIcon className="w-4 h-4 text-blue-500" />
        <p className="flex-grow pl-2 pr-10">{fileName}</p>

        <p className="pr-5 text-xs truncate">{dateIs}</p>

        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => setShoModel(true)}
        >
          <ChatIcon name="delete" className="w-4 h-4" />
        </button>
        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => setShoModel(true)}
        >
          <EyeIcon name="delete" className="w-4 h-4" />
        </button>

        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => setShoModel(true)}
        >
          <DownloadIcon name="delete" className="w-4 h-4" />
        </button>

        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => setShoModel(true)}
        >
          <TrashIcon name="delete" className="w-4 h-4" />
        </button>
      </div>

    </>
  )
}

export default PaymentDocUtility
