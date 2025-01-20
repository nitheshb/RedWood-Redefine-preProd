import { useState, useEffect } from 'react'

import {
  DocumentTextIcon,
  TrashIcon,
  DownloadIcon,
  EyeIcon,
} from '@heroicons/react/outline'

import { prettyDate } from 'src/util/dateConverter'

const ProjectDocRow = ({ id, fileName,url,  date, amount, status, key }) => {
  const [showModel, setShoModel] = useState(false)
  const [dateIs, setDate] = useState('NA')
  const toggle = () => setShoModel(!showModel)
  // const { user } = useContext(AuthContext)
  const deleteDocument = async (id) => {
    // console.log(id);
    // try {
    //   const docRef = doc(firestore, 'userDocs', `${user?.uid}`, 'docs', id)
    //   console.log(docRef)
    //   if (docRef) {
    //     deleteDoc(docRef)
    //     setShoModel(false)
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }
  useEffect(() => {
    if (date) {
      setDate(prettyDate(date))
    } else {
      setDate('NA')
    }
  }, [date])

  return (
    <>
      <div className="flex max-w-3xl mx-auto items-center p-4 rounded-lg hover:bg-gray-300 cursor-pointer text-gray-700 text-sm">
        <DocumentTextIcon className="w-4 h-4 text-blue-500" />
        <p className="flex-grow pl-2 pr-10">{fileName}</p>

        <p className="pr-3 text-xs truncate">{dateIs}</p>

        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => setShowAssetLink(url)}
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
      {/* <Modal size="sm" active={showModel} toggler={toggle}>
        <ModalBody>Do you really want to delete this document?</ModalBody>
        <ModalFooter>
          <Button
            color="red"
            onClick={() => deleteDocument(id)}
            ripple="dark"
            type="submit"
          >
            Yes
          </Button>
          <Button
            color="blue"
            buttonType="link"
            onClick={() => setShoModel(false)}
            ripple="dark"
          >
            No
          </Button>
        </ModalFooter>
      </Modal> */}
    </>
  )
}

export default ProjectDocRow
