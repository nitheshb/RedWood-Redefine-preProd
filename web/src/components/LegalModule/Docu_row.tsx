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

const DowRow = ({ id, fileName, date, amount, status,data, key }) => {
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

  const handleFileUploadFun = async (file, type) => {
    console.log('am i inside handle FileUpload')
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
            let x = {[`${data?.type}DocUrl`] : url, [`${data?.type}FilName`]: file.name,[`${data?.type}DocUpDate`]: Timestamp.now().toMillis()}

            updateUnitDocs(orgId,id,x,user.email,'Doc Uploaded Successfully','success',enqueueSnackbar )
            setCommentAttachUrl(url)
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
    let x= {[`${data?.type}DocUrl`] : '', [`${data?.type}FilName`]: '',[`${data?.type}DocUpDate`]: 0}
        updateUnitDocs(orgId,id,x,user.email,'Doc Deleted Successfully','error',enqueueSnackbar)
   }
  return (
    <>
      <div className="flex max-w-3xl mx-auto items-center p-4 rounded-lg hover:bg-gray-300 cursor-pointer text-gray-700 text-sm">
        <DocumentTextIcon className="w-4 h-4 text-blue-500" />
        <p className="flex-grow pl-2 pr-10">{fileName}</p>
        <p className="pr-3 text-xs truncate text-green-800">{data?.filName}</p>
        <p className="mr-3 px-2 py-1 rounded-2xl text-xs truncate bg-green-200 text-green-900">{status}</p>
        {uploading && <Loader />}

        <p className="pr-3 text-xs truncate">{prettyDate(data?.time) || 'NA'}</p>
        <div>
                      <label
                        htmlFor="formFile1"
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
                        id="formFile1"
                        onChange={(e) => {
                          handleFileUploadFun(e.target.files[0], 'panCard1')
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

export default DowRow
