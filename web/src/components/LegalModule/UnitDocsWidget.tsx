import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  TrashIcon,
  DownloadIcon,
  CloudUploadIcon,
  EyeIcon,
} from '@heroicons/react/outline'
import { prettyDate, prettyDateTime } from 'src/util/dateConverter'
import { AttachFile } from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'
import { storage } from 'src/context/firebaseConfig'
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage'
import { useAuth } from 'src/context/firebase-auth-context'
import { useSnackbar } from 'notistack'
import {
  fetchFilesForUnits,
  AddUnitDocs,
  DeleteUnitDocs,
} from 'src/context/dbQueryFirebase'
import { Timestamp } from 'firebase/firestore'
import { ChevronDownIcon, ChevronUpIcon, Loader } from 'lucide-react'

const UnitDocsWidget = ({
  id,
  unitDetails,
  fileName,
  date,
  amount,
  status,
  data,
  key,
  totalDocs,
  uploadedCount,
}) => {
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
  const [docsList, setDocsList] = useState([])

  useEffect(() => {
    if (date) {
      setDate(prettyDate(date))
    } else {
      setDate('NA')
    }
  }, [date])
  useEffect(() => {
    getLeadsDataFun()
  }, [])

  const getLeadsDataFun = async () => {
    // steaminactiveUsersList

    const unsubscribe = fetchFilesForUnits(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          let x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        console.log('docs lists ', usersListA)
        setDocsList(usersListA)
      },
      {
        unitId: id,
        cat: data?.type,
      },
      () => setDocsList([])
    )
    return unsubscribe
  }

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
          console.log(err)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            file.url = url
            setCmntFileType(file.name.split('.').pop())

            console.log('data is ===>', file)
            const x1 = {
              [`${type}Count`]: url,
              [`${type}FilName`]: file.name,
              [`${type}DocUpDate`]: Timestamp.now().toMillis(),
              unitId: id,
            }
            const x2 = {
              url: url,
              name: file.name,
              uploadedOn: Timestamp.now().toMillis(),
              unitId: id,
              cat: type,
              by: user.email,
            }

            await AddUnitDocs(
              orgId,
              id,
              unitDetails,
              'Uploaded',
              fileName,
              x2,
              user.email,
              'Doc Uploaded Successfully',
              'success',
              enqueueSnackbar
            )
            await setUplaoding(false)
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
  // Function to safely extract the storage path
  function getPathFromUrl(url) {
    try {
      const decodedUrl = decodeURIComponent(url)
      const matches = decodedUrl.match(/\/o\/(.*?)\?/)
      return matches && matches[1] ? matches[1] : null
    } catch (e) {
      console.error('URL decode error:', e)
      return null
    }
  }
  const deleteDoc = (docData) => {
    console.log('delete', data?.url)
    const path = getPathFromUrl(docData?.url)
    const fileRef = ref(storage, path)
    deleteObject(fileRef)
      .then(() => {
        DeleteUnitDocs(
          orgId,
          docData?.id,
          id,
          unitDetails,
          'Deleted doc',
          fileName,
          docData,
          user.email,
          'Doc Deleted Successfully',
          'error',
          enqueueSnackbar
        )
        console.log('✅ File deleted successfully')
      })
      .catch((error) => {
        console.error('❌ Error deleting file:', error)
      })
  }

  const [showDropdown, setShowDropdown] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <>
      <div className=" justify-between max-w-3xl items-center  rounded-lg cursor-pointer text-gray-700 text-sm">
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
            <p className="text-[#0E0A1F] text-[14px] font-medium  font-outfit">
              {fileName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {uploading && <Loader className="w-4 h-4 mr-2" />}

            <span className="text-[12px] font-outfit text-[#606062]">
              {docsList.length} Documents
            </span>

            <div className="flex items-center">
              <label htmlFor={data?.id} className="cursor-pointer">
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
                  handleFileUploadFun(e.target.files[0], data.type)
                }}
              />
            </div>

            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center"
            >
              {showDropdown ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-4 ">
          {showDropdown && (
            <div className=" w-[100%] border-0 border-t flex flex-col justify-between items-center  bg-[#FFFFFF] rounded-md p-4">
              {docsList.map((doc, i) => {
                return (
                  <section
                    key={i}
                    className="flex flex-row w-full justify-between pb-2"
                  >
                    <div className="flex items-center gap-2 ">
                      <img
                        alt="CRM Background"
                        src="/IconSetsdoc.svg"
                        className="w-5 h-5"
                      />

                      <div className="flex-col">
                        {uploading && <Loader className="w-4 h-4 mr-2" />}
                        <p className="pr-3 font-medium  truncate font-outfit text-[14px] text-[#0E0A1F]">
                          {doc?.name}
                        </p>
                        <section className="flex flex-row">
                          <p className="font-outfit font-medium text-[#606062] text-[12px] ">
                            {prettyDateTime(doc?.uploadedOn) || 'NA'}
                          </p>
                          <div className="w-[2px] h-[9px] mt-[5px] bg-gray-300 rounded-full mx-2"></div>
                          <p className="font-outfit font-medium text-[#606062] text-[12px]">
                            Uplaoded by:{doc?.by}
                          </p>
                        </section>
                      </div>
                    </div>
                    <div className="">
                      <div className="flex items-center">
                        <button
                          color="gray"
                          className="border-0 block rounded ml-2"
                          onClick={() => {
                            downloadImage(doc?.url, `${doc?.name}`)
                          }}
                        >
                          <img
                            alt="CRM Background"
                            src="/docd.svg"
                            className="w-5 h-5"
                          />
                        </button>

                        <button
                          color="gray"
                          className="border-0 block rounded ml-2"
                          onClick={() => {
                            deleteDoc(doc)
                          }}
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
                  </section>
                )
              })}
            </div>
          )}
        </div>

        {/* <p className="mr-3 px-2 py-1 rounded-2xl text-xs truncate bg-green-200 text-green-900">{status}</p> */}

        {/* {data?.type} */}
      </div>
    </>
  )
}

export default UnitDocsWidget
