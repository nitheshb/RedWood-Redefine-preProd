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
import { ChevronDownIcon, ChevronUpIcon, Loader } from 'lucide-react'

const DocRow = ({ id, fileName, date, amount, status,data, key, totalDocs, uploadedCount  }) => {
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



   const [showDropdown, setShowDropdown] = useState(false)


   
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }


  return (
    <>
    <div className=" justify-between max-w-3xl items-center py-2 rounded-lg cursor-pointer text-gray-700 text-sm">

        {/* <DocumentTextIcon className="w-4 h-4 text-blue-500" /> */}

      
{/* 
        <div className='flex gap-1  flex-col'>

          <div>

            
        <p className=" font-outfit font-medium font-[#606062] font-[12px]">{prettyDate(data?.time) || 'NA'}</p>
        <p className="flex-grow  font-[#0E0A1F] font-[12px]  font-semibold  ">{fileName}</p>

          </div>





        <div>
        <button onClick={toggleDropdown}>
      {showDropdown ? (
        <ChevronUpIcon className="w-4 h-4" />
      ) : (
        <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
        </div>


        <div>
        <div className="font-medium text-sm text-[#000000] tracking-wide pr-2 mr-1">
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
        </div>
        </div>
       */}





<div className="flex items-center justify-between bg-white rounded-md p-3 w-full">

  <div className="flex items-center gap-2">
    <img
      alt="Document icon"
      src="/IconSetsdoc.svg"
      className="w-5 h-5"
    />
    <p className="text-[#0E0A1F] text-xs font-semibold">
      {fileName}
    </p>
  </div>

 
  <div className="flex items-center gap-3">

    {uploadedCount > 0 && (
      <span className="text-[12px] text-gray-800">
        {uploadedCount} Documents
      </span>
    )}


    <div className="flex items-center">
      <label
        htmlFor={data?.id}
        className="cursor-pointer"
      >
        <img
          alt="Add document"
          src="/docplus.svg"
          className="w-5 h-5"
        />
      </label>
      <input
        type="file"
        className="hidden"
        id={data?.id}
        onChange={(e) => {
          handleFileUploadFun(e.target.files[0], data.type);
        }}
      />
    </div>

    <button onClick={toggleDropdown} className="flex items-center justify-center">
      {showDropdown ? (
        <ChevronUpIcon className="w-4 h-4" />
      ) : (
        <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  </div>
</div>


<div className='mt-1'>
{showDropdown && (

<div className=' w-[100%] flex justify-between items-center  bg-[#FFFFFF] rounded-md p-4'>



<div className='flex items-center gap-2 '>




<img
    alt="CRM Background"
    src="/IconSetsdoc.svg"
    className="w-5 h-5"
  />




  <div className='flex-col'>
  <p className="font-outfit font-medium text-[#606062] text-[12px]">
      {prettyDate(data?.time) || 'NA'}
    </p>
{uploading && <Loader className="w-4 h-4 mr-2" />}
<p className="pr-3 text-xs truncate text-green-800">{data?.filName}</p>
  </div>

</div>




<div className=''>

<div className='flex items-center'>





  <div>
  <img
    alt="CRM Background"
    src="/docv.svg"
    className="w-5 h-5"
  />

  </div>

<button
  color="gray"
  className="border-0 block rounded ml-2"
  onClick={() => { downloadImage(
    data?.url,
    `${data?.filName}`
  )}}
>
  {/* <DownloadIcon name="delete" className="w-4 mt-2 h-4" /> */}


<img
    alt="CRM Background"
    src="/docd.svg"
    className="w-5 h-5"
  />

</button>



<button
  color="gray"
  className="border-0 block rounded ml-2"
  onClick={() => {deleteDoc()}}
>
  {/* <TrashIcon name="delete" className="w-4 h-4" /> */}


  <img
    alt="CRM Background"
    src="/docdd.svg"
    className="w-5 h-5"
  />


</button>

</div>

</div>




  






</div>
)}

</div>



        
       
        {/* <p className="mr-3 px-2 py-1 rounded-2xl text-xs truncate bg-green-200 text-green-900">{status}</p> */}





     
        {/* {data?.type} */}





        

      </div>

    </>
  )
}

export default DocRow



