import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  TrashIcon,
  DownloadIcon,
  CloudUploadIcon,
  EyeIcon,
} from '@heroicons/react/outline'
import { prettyDate } from 'src/util/dateConverter'
import { AttachFile } from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'
import { storage } from 'src/context/firebaseConfig'
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage'
import { useAuth } from 'src/context/firebase-auth-context'
import { useSnackbar } from 'notistack'
import { updateUnitDocs } from 'src/context/dbQueryFirebase'
import { Timestamp } from 'firebase/firestore'
import { Loader } from 'lucide-react'

const DocRow = ({ id, fileName, date, amount, status,data, key }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [showModel, setShoModel] = useState(false)
  const [dateIs, setDate] = useState('NA')
  const toggle = () => setShoModel(!showModel)
  const [commentAttachUrl, setCommentAttachUrl] = useState('')
  const [cmntFileType, setCmntFileType] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUplaoding] = useState(false)






  const [progress, setProgress] = useState(0)

  // const { user } = useContext(AuthContext)




  useEffect(() => {
    if (date) {
      setDate(prettyDate(date))
    } else {
      setDate('NA')
    }
  }, [date])

  const handleFileUploadFun = async (file, type) => {


    setUplaoding(true)
    if (!file) return
    try {
      const uid = uuidv4()
      const storageRef = ref(storage, `/${orgId}_files/${'unitFiles'}_${uid}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100

          setProgress(prog)
          file.isUploading = false

        },
        (err) => {
          setUplaoding(false)
          console.log(err)},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            // createAttach(orgId, url, by, file.name, id, attachType)
            file.url = url
            setCmntFileType(file.name.split('.').pop())
            // setFiles([...files, file])

            // save it in unit docs table

            // add this to db and update it in unit record

            // updateUnitDocs(orgId, id, file.url, file.name, by)
            console.log('data is ===>', file)
            const x1 = {[`${type}DocUrl`] : url, [`${type}FilName`]: file.name,[`${type}DocUpDate`]: Timestamp.now().toMillis()}
            console.log('data is ===> @@@', data?.type, type, x1)
            updateUnitDocs(orgId,id,'Uploaded',fileName,x1,user.email,'Doc Uploaded Successfully','success',enqueueSnackbar )
            // setCommentAttachUrl(url)
            setUplaoding(false)
            return url
            //  save this doc as a new file in spark_leads_doc
          })
        }
      )
    } catch (error) {
      console.log('upload error is ', error)
    }
  }

  const downloadImage = (imageUrl, filename) => {

    console.error('Error downloading image:', imageUrl)
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary anchor element
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        // Extract the filename from the URL
        // const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)

        // Set the download attribute and filename
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        console.log('fetcher url ', filename)
        // Simulate a click on the anchor element to start the download
        link.click()

        // Clean up the temporary anchor element
        link.parentNode.removeChild(link)

        // Set the downloaded image URL to display on the page
        setImageUrl(url)
      })
      .catch((error) => {
        console.error('Error downloading image:', error)
      })
  }

  const deleteDoc = () => {
    console.log('delete')
    const x= {[`${data?.type}DocUrl`] : '', [`${data?.type}FilName`]: '',[`${data?.type}DocUpDate`]: 0}
        updateUnitDocs(orgId,id,'Deleted doc',fileName, x,user.email,'Doc Deleted Successfully','error',enqueueSnackbar)
   }
  return (
    <>
      <div className="flex max-w-3xl mx-auto items-center p-4 rounded-lg hover:bg-gray-300 cursor-pointer text-gray-700 text-sm">
        <DocumentTextIcon className="w-4 h-4 text-blue-500" />
        <p className="flex-grow pl-2 pr-10">{fileName}</p>
        <p className="pr-3 text-xs truncate text-green-800">{data?.filName}</p>
        <p className="mr-3 px-2 py-1 rounded-2xl text-xs truncate bg-green-200 text-green-900">{status}</p>
        {uploading && <Loader className="w-4 h-4 mr-2" />}

        <p className="pr-3 text-xs truncate">{prettyDate(data?.time) || 'NA'}</p>
        {data?.type}
        <div>
                      <label
                        htmlFor={data?.id}
                        className="form-label cursor-pointer inline-block mt-  font-regular text-xs rounded-2xl  py-1 "
                      >
                        <AttachFile
                          className="w-4 h-4 text-[18px]"
                          style={{ fontSize: '18px' }}
                        />
                      </label>
                      <input
                        type="file"
                        className="hidden"
                        id={data?.id}
                        onChange={(e) => {
                          handleFileUploadFun(e.target.files[0],  data.type)
                        }}
                      />
                    </div>
        {/* <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => setShoModel(true)}
        >
          <EyeIcon name="delete" className="w-4 h-4" />
        </button> */}

        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => { downloadImage(
            data?.url,
            `${data?.filName}`
          )}}
        >
          <DownloadIcon name="delete" className="w-4 h-4" />
        </button>

        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => {deleteDoc()}}
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

export default DocRow
