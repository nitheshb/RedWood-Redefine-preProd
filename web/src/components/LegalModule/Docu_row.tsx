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
            file.url = url
            setCmntFileType(file.name.split('.').pop())

            console.log('data is ===>', file)
            const x1 = {[`${type}DocUrl`] : url, [`${type}FilName`]: file.name,[`${type}DocUpDate`]: Timestamp.now().toMillis()}
            console.log('data is ===> @@@', data?.type, type, x1)
            updateUnitDocs(orgId,id,'Uploaded',fileName,x1,user.email,'Doc Uploaded Successfully','success',enqueueSnackbar )
            setUplaoding(false)
            return url
  
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
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url


        link.setAttribute('download', filename)
        document.body.appendChild(link)
        console.log('fetcher url ', filename)
        link.click()

        link.parentNode.removeChild(link)

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
    <div className="flex justify-between max-w-3xl items-center py-4 rounded-lg cursor-pointer text-gray-700 text-sm">

        {/* <DocumentTextIcon className="w-4 h-4 text-blue-500" /> */}

        <div className='flex items-center gap-4'>
          
        <div>
        <svg width="30" height="35" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.9597 24.0475H3.01073C2.1666 24.0475 1.60456 23.3631 1.752 22.519L4.39644 7.52205C4.47792 7.10013 4.70283 6.7194 5.03305 6.44442L8.86335 3.18808C9.1844 2.90803 9.59387 2.75007 10.0198 2.74194H18.7172C19.5613 2.74194 20.1233 3.42586 19.9759 4.26998L16.7579 22.519C16.6092 23.3631 15.8043 24.0475 14.9597 24.0475Z" fill="#231F20"/>
<path d="M14.0649 23.0912H2.34094C1.51258 23.0912 0.959915 22.4201 1.10522 21.5921L3.6998 6.87727C3.77994 6.46329 4.0006 6.08968 4.32447 5.81966L8.08278 2.62383C8.39771 2.34887 8.79951 2.19377 9.2175 2.18579H17.7512C18.5791 2.18579 19.1322 2.85692 18.9869 3.68485L15.8299 21.5909C15.6842 22.4214 14.8937 23.0912 14.0649 23.0912Z" fill="#6C6C6C"/>
<path d="M13.2312 22.258H1.28221C0.438089 22.258 -0.123952 21.5737 0.0234819 20.7296L2.6675 5.73262C2.74931 5.31083 2.97416 4.9302 3.30411 4.65499L7.13442 1.39865C7.47062 1.11273 7.88692 0.952515 8.29088 0.952515H16.9886C17.8323 0.952515 18.3948 1.63643 18.2474 2.48055L15.0294 20.7296C14.8803 21.5737 14.0753 22.258 13.2312 22.258Z" fill="#EDE9FE"/>
<path d="M2.85352 5.10131H5.40294C6.2445 5.10131 7.0473 4.41954 7.19559 3.57669L7.64982 1.00085" stroke="#231F20" stroke-width="0.20724" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.25195 10.594H15.3748" stroke="#231F20" stroke-width="0.20724" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.59961 8.61523H15.7225" stroke="#231F20" stroke-width="0.20724" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.94922 6.63647H16.0721" stroke="#231F20" stroke-width="0.20724" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3054 18.7913H8.49038C8.14608 18.7913 7.91641 18.5117 7.97905 18.1674L8.82787 13.3524C8.8888 13.0081 9.2169 12.729 9.56163 12.729H14.3767C14.721 12.729 14.9511 13.0081 14.8901 13.3524L14.0413 18.1674C13.98 18.5117 13.6497 18.7913 13.3054 18.7913Z" stroke="#231F20" stroke-width="0.20724" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </div>

        <div className='flex gap-1  flex-col'>
        <p className=" font-outfit font-medium font-[#606062] font-[12px]">{prettyDate(data?.time) || 'NA'}</p>
        <p className="flex-grow  font-[#0E0A1F] font-[12px]  font-semibold  ">{fileName}</p>
        </div>
        </div>
        <p className="pr-3 text-xs truncate text-green-800">{data?.filName}</p>
        {/* <p className="mr-3 px-2 py-1 rounded-2xl text-xs truncate bg-green-200 text-green-900">{status}</p> */}
        {uploading && <Loader className="w-4 h-4 mr-2" />}

     
        {/* {data?.type} */}

        <div className='flex'>


        <div className="font-medium text-sm text-[#000000] tracking-wide pr-2 mr-1 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-[20px] after:bg-gray-300 group-hover:after:bg-white">
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

                    <div className="font-medium text-sm text-[#000000] tracking-wide pr-2 mr-1 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-[20px] after:bg-gray-300 group-hover:after:bg-white">



                    <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => { downloadImage(
            data?.url,
            `${data?.filName}`
          )}}
        >
          <DownloadIcon name="delete" className="w-4 mt-2 h-4" />
        </button>

                    </div>




        <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => {deleteDoc()}}
        >
          <TrashIcon name="delete" className="w-4 h-4" />
        </button>

        </div>




        

      </div>

    </>
  )
}

export default DocRow
