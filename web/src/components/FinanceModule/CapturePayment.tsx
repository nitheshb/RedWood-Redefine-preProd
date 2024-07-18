/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, useRef } from 'react'

import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'
import { AttachFile } from '@mui/icons-material'
import { format } from 'date-fns'
import { setHours, setMinutes } from 'date-fns'
import { arrayUnion } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import DatePicker from 'react-datepicker'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import { useParams } from '@redwoodjs/router'

import Confetti from 'src/components/shared/confetti'
import { paymentMode, statesList } from 'src/constants/projects'
import {
  addPaymentReceivedEntry,
  addPaymentReceivedEntrySup,
  createBookedCustomer,
  createNewCustomerS,
  steamBankDetailsList,
  steamUsersProjAccessList,
  updateLeadStatus,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'
import { TextField2 } from 'src/util/formFields/TextField2'

import Loader from '../Loader/Loader'
import { validate_capturePayment } from '../Schemas'

const CaptureUnitPayment = ({
  title,
  customerInfo,
  selUnitDetails,
  leadDetailsObj2,
  onSubmitFun,
  bookCompSteps,
  bookCurentStep,
  dialogOpen,
  newPlotCsObj,
  newPlotCostSheetA,
  newPlotPS,
  newConstructCsObj,
  newConstructCostSheetA,
  newConstructPS,
  phase,
  projectDetails,
  stepIndx,
  StatusListA,
}) => {
  const d = new window.Date()

  const { user } = useAuth()
  const { orgId, displayName, email, phone } = user
  const [loading, setLoading] = useState(false)
  const [openAreaFields, setOpenAreaFields] = useState(false)
  const [bookingProgress, setBookingProgress] = useState(false)
  const [bankDetailsA, setBankDetailsA] = useState([])
  const [creditNotersA, setCreditNoters] = useState([])



  // const [formattedValue, setFormattedValue] = useState('');

  // const handleChange = (e) => {
  //   const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  //   const formatted = value ? `Rs.${parseInt(value, 10).toLocaleString('en-IN')}` : '';
  //   setFormattedValue(formatted);
  // };



  

  const [startDate, setStartDate] = useState(d)

  const [paymentModex, setPaymentModex] = useState('cheque')
  const [files, setFiles] = useState([])

  const [commentAttachUrl, setCommentAttachUrl] = useState('')
  const [cmntFileType, setCmntFileType] = useState('')

  const { enqueueSnackbar } = useSnackbar()
  const { uid } = useParams()
  const bankData = {}
  const confettiRef = useRef(null)

  const handleClick = () => {
    console.log(' projectDetails', projectDetails, selUnitDetails)
    confettiRef.current.fire()
  }

  useEffect(() => {
    console.log('unit details are ', selUnitDetails)
  }, [])

  useEffect(() => {
    const unsubscribe = steamBankDetailsList(
      orgId,
      (querySnapshot) => {
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        bankA.map((user) => {
          user.label = user?.accountName
          user.value = user?.accountNo
        })
        console.log('fetched users list is', bankA)
        setBankDetailsA([...bankA])
      },
      (error) => setBankDetailsA([])
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = steamUsersProjAccessList(
      orgId,
      (querySnapshot) => {
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        bankA.map((user) => {
          user.label = user?.name
          user.value = user?.email
        })
        console.log('fetched users list is', bankA)
        setCreditNoters([...bankA])
      },
      { pId: [selUnitDetails?.pId] },
      (error) => setCreditNoters([])
    )

    return unsubscribe
  }, [])
  const handleFileUploadFun = async (file, type) => {
    console.log('am i inside handle FileUpload')
    if (!file) return
    try {
      const uid = uuidv4()
      const storageRef = ref(storage, `/spark_files/${'taskFiles'}_${uid}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100

          // setProgress(prog)
          file.isUploading = false
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            // createAttach(orgId, url, by, file.name, id, attachType)
            file.url = url
            // setCmntFileType(file.name.split('.').pop())
            // setFiles([...files, file])

            setCommentAttachUrl(url)
            return url
            //  save this doc as a new file in spark_leads_doc
          })
        }
      )
    } catch (error) {
      console.log('upload error is ', error)
    }
  }
  const onSubmitSupabase = async (data, resetForm) => {
    console.log('inside supabase support', data)
    let y = {}
    y = data

    await handleFileUploadFun(data?.fileUploader, 'panCard1')
    const z = await commentAttachUrl

    await onSubmitFun(y, resetForm)

    await confettiRef?.current?.fire()

    return
    // get booking details, leadId, unitDetails,
    //  from existing object send values of
    //  booking
    // copy unit data as it is
    // copy lead data as it is
    //  unit details

    // 1)Make an entry to finance Table {source: ''}
    // 2)Create new record in Customer Table
    // 3)Update unit record with customer record and mark it as booked
    // 4)update lead status to book

    //   const x = await addDoc(collection(db, 'spark_leads'), data)
    // await console.log('x value is', x, x.id)

    const { uid } = selUnitDetails
    // 1)Make an entry to finance Table {source: ''}

    // create customer

    // update unit record with booked status

    // update payment schedule
    // log cost sheet
    // capture transaction
    // entry  payment log
    // entry payment sheet

    console.log('check this value ', user, leadDetailsObj2)
    const { Status } = leadDetailsObj2
    createNewCustomerS(
      orgId,
      projectDetails?.uid,
      selUnitDetails?.uid,
      leadDetailsObj2,
      Status,
      'booked',
      user?.email,
      enqueueSnackbar
    )

    return

    const x1 = await addPaymentReceivedEntrySup(
      orgId,
      uid,
      { leadId: 'id' },
      data,
      'leadsPage',
      'nitheshreddy.email@gmail.com',
      enqueueSnackbar
    )

    // add phaseNo , projName to selUnitDetails
    // 2)Create('')

    // 3)Update unit record with customer record and mark it as booked

    // 4)update lead status to book
    // updateLeadStatus(leadDocId, newStatus)
  }

  const onSubmit = async (data, resetForm) => {
    // get booking details, leadId, unitDetails,
    //  from existing object send values of
    //  booking
    // copy unit data as it is
    // copy lead data as it is
    //  unit details

    // 1)Make an entry to finance Table {source: ''}
    // 2)Create new record in Customer Table
    // 3)Update unit record with customer record and mark it as booked
    // 4)update lead status to book

    //   const x = await addDoc(collection(db, 'spark_leads'), data)
    // await console.log('x value is', x, x.id)

    const { uid } = selUnitDetails
    // 1)Make an entry to finance Table {source: ''}

    const x1 = await addPaymentReceivedEntry(
      orgId,
      uid,
      { leadId: 'id' },
      data,
      'leadsPage',
      'nitheshreddy.email@gmail.com',
      enqueueSnackbar
    )

    // add phaseNo , projName to selUnitDetails
    // 2)Create('')

    // 3)Update unit record with customer record and mark it as booked

    // 4)update lead status to book
    // updateLeadStatus(leadDocId, newStatus)
  }

  const datee = new Date().getTime()
  const initialState = {
    amount: bankData?.amount || '',
    towardsBankDocId: '',
    mode: bankData?.mode || paymentModex,
    payto: bankData?.payto || '',
    payReason: bankData?.payReason || '',
    bank_ref_no: bankData?.bank_ref_no || '',
    dated: bankData?.dated || datee,
    bookingSource: '',
    bookedBy: bankData?.bookedBy || email,
    status: 'review',
    fileUploader: '',
  }

  // const validateSchema = Yup.object({
  // date: Yup.string().required('Bank Required'),
  // amount: Yup.string().required('Required'),
  // payto: Yup.string().required('Required'),
  // mode: Yup.string().required('Bank Required'),
  // drawnonbank: Yup.string().required('Required'),
  // bank_ref_no: Yup.string().required('Required'),
  // dated: Yup.string().required('Required'),
  // })

  const submitFormFun = (formik) => {
    formik.handleSubmit()
  }

  const setDateFun = (date) => {
    setStartDate(date)
  }
  const bgImgStyle = {
    backgroundImage:
      'url("https://images.unsplash.com/photo-1605106715994-18d3fecffb98?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
  return (
    <div className="">
      <div className="flex items-center justify-center">
        <div id="bg-img" className="flex h-[664px] w-full flex-col" style={bgImgStyle}>
       {StatusListA?.length>0 && <section className="text-white text-right w-full mt-6 pr-5">
                                        {' '}
                                        {stepIndx} of {StatusListA?.length}{' '}
                                        steps
                                      </section> }
          <div className="relative top-6 mx-auto max-h-[65%]  rounded-xl  px-9 pb-14 pt-5 shadow-md">
            {/* <div className="space-y-4 text-white">
              <h3 className="font-bold text-2xl">Confirm Booking</h3>

            </div> */}

            <div className="grid gap-8 grid-cols-1">
              <div className="flex flex-col ">
                <div className="mt-0">
                  <Formik
                    enableReinitialize={true}
                    initialValues={initialState}
                    validationSchema={validate_capturePayment}
                    onSubmit={(values, { resetForm }) => {
                      setBookingProgress(true)
                      onSubmitSupabase(values, resetForm)
                      console.log(values)
                    }}
                  >
                    {(formik, setFieldValue) => (
                      <Form>
                        <div className="form">
                          {/* Phase Details */}

                          <section className=" ">
                            <div className="w-full mx-auto ">
                              <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg bg-white ">
                                <div className=" flex flex-row px-2 py-2  overflow-y-scroll overflow-auto no-scrollbar">
                                  <section className=" p-4 rounded-md w-[540px]">
                                    <article className="mt-5">
                                      <div className="flex flex-row justify-between">
                                        <section className="flex flex-row">
                                          <span className="text-[42px] mt-[-16px]">
                                            🎊
                                          </span>
                                          <div className="inline">
                                            <div className="mt-[7px]">
                                              <label className="text-[22px] font-semibold text-[#053219]  text-sm  mb-1  ">
                                                {title === 'capturePayment'
                                                  ? 'Capture Payment'
                                                  : 'Booking Confirmation'}
                                                <abbr title="required"></abbr>
                                              </label>
                                            </div>
                                            {/* <div className="border-t-4 rounded-xs w-100 border-[#8B5CF6]"></div> */}
                                          </div>
                                        </section>
                                        <section className="flex flex-row justify-between">
                                          <div className="flex flex-col mt-">
                                            <h6 className="text-blueGray-400 text-sm mt- ml-6 mb- font-weight-[700]  font-uppercase">
                                              Payment
                                            </h6>
                                            <span className="text-center text-[13px] font-normal">
                                              {format(new Date(), 'dd-MMMM-yy')}
                                            </span>
                                          </div>
                                        </section>
                                      </div>
                                      <hr className="mt-6 border-b-1 border-blueGray-300" />
                                    </article>
                                    {!bookingProgress && (
                                      <section>
                                        <div className="flex flex-wrap mt-3">
                                          <div className="justify-center w-full mx-auto"></div>
                                          <div className="w-full px-4 mb-4 mt-8">
                                            {paymentMode.map((dat, i) => {
                                              return (
                                                <span
                                                  className={` mr-2 border rounded-xl px-2 py-2 cursor-pointer hover:bg-violet-400 hover:text-white text-sm ${
                                                    paymentModex == dat.value
                                                      ? 'bg-violet-400 text-white'
                                                      : ''
                                                  }`}
                                                  key={i}
                                                  onClick={() => {
                                                    setPaymentModex(dat.value)
                                                    formik.setFieldValue(
                                                      'mode',
                                                      dat.value
                                                    )
                                                  }}
                                                >
                                                  {dat.label}
                                                </span>
                                              )
                                            })}
                                          </div>

                                          {paymentModex != 'credit_note' && (
                                            <div className="w-full  px-4 mt-3">
                                              <div className=" mb-4 w-full">
                                                <MultiSelectMultiLineField
                                                  label="Paid Towards Account"
                                                  name="towardsBankDocId"
                                                  
                                                  onChange={(payload) => {
                                                    console.log(
                                                      'changed value is ',
                                                      payload
                                                    )
                                                    const {value,id, accountName,} = payload
                                                    formik.setFieldValue('builderName',accountName)
                                                    formik.setFieldValue('landlordBankDocId',id)

                                                    formik.setFieldValue('towardsBankDocId',id)


                                                  }}
                                                  value={formik.values.towardsBankDocId}

                                                  options={bankDetailsA}
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {paymentModex === 'credit_note' && (
                                            <div className="w-full  px-4 mt-3">
                                              <div className=" mb-4 w-full">
                                                <MultiSelectMultiLineField
                                                  label="Credit Note Issuer"
                                                  name="creditNoteIssuer"
                                                  onChange={(payload) => {
                                                    console.log(
                                                      'changed value is ',
                                                      payload
                                                    )
                                                    const {
                                                      value,
                                                      id,
                                                      name,
                                                      uid,
                                                      accountName,
                                                    } = payload
                                                    formik.setFieldValue(
                                                      'builderName',
                                                      name
                                                    )
                                                    formik.setFieldValue(
                                                      'landlordBankDocId',
                                                      uid
                                                    )

                                                    formik.setFieldValue(
                                                      'towardsBankDocId',
                                                      uid
                                                    )
                                                  }}
                                                  value={
                                                    formik.values
                                                      .towardsBankDocId
                                                  }
                                                  options={creditNotersA}
                                                />
                                              </div>
                                            </div>
                                          )}
                                          <div className="w-full lg:w-4/12 px-3">
                                            <div className="relative w-full mb-5">
                                              <TextField2
                                                label="Amount"
                                                name="amount"
                                                type="number"
                                              
                                              />
                                            </div>
                                          </div>

                                          <div className="w-full lg:w-4/12 px-3">
                                            <div className="relative w-full mb-5">
                                              <TextField2
                                                label="Cheque/Ref No"
                                                name="bank_ref_no"
                                                type="text"
                                              />
                                            </div>
                                          </div>
                                          <div className="w-full mt-3 lg:w-4/12 px-3  ">
                                            <div className="relative w-full mb-5 mt-[-1px] ">
                                              <span className="inline">
                                                <DatePicker
                                                  className="h-8 outline-none border-t-0 border-l-0 border-r-0 border-b border-gray-500  border-solid mt-[-4px] pb-1  min-w-[125px]  inline  text-[#0091ae]   lg:w-4/12 w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] "
                                                  label="Dated"
                                                  name="dated"
                                                  // selected={startDate}
                                                  selected={formik.values.dated}
                                                  onChange={(date) => {
                                                    // setFieldValue('dated')
                                                    formik.setFieldValue(
                                                      'dated',
                                                      date.getTime()
                                                    )
                                                    // setStartDate(date)
                                                    console.log(startDate)
                                                  }}
                                                  timeFormat="HH:mm"
                                                  injectTimes={[
                                                    setHours(
                                                      setMinutes(d, 1),
                                                      0
                                                    ),
                                                    setHours(
                                                      setMinutes(d, 5),
                                                      12
                                                    ),
                                                    setHours(
                                                      setMinutes(d, 59),
                                                      23
                                                    ),
                                                  ]}
                                                  dateFormat="MMM d, yyyy"
                                                />
                                              </span>
                                            </div>
                                          </div>
                                          <div className="w-full  px-3">
                                            <div className="relative w-full mb-3">
                                              <TextField2
                                                label="Payment reason"
                                                name="payReason"
                                                type="text"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <label
                                            htmlFor="formFile1"
                                            className="form-label cursor-pointer inline-block mt-2  font-regular text-xs bg-[#efef] rounded-2xl  py-1 "
                                          >
                                            <AttachFile
                                              className="w-4 h-4 text-[18px]"
                                              style={{ fontSize: '18px' }}
                                            />
                                          </label>
                                          {/* {panCard1 != '' && (
                        <button
                          onClick={() =>
                            downloadImage(panCard1, 'pancard1.PNG')
                          }
                        >
                          {' '}
                          <ArrowCircleDownIcon className="w-4 h-4 cursor-pointer ml-1 mb-[9px] mr-2 inline-block text-gray-400 " />
                        </button>
                      )} */}
                                          <input
                                            type="file"
                                            className="hidden"
                                            id="formFile1"
                                            name="fileUploader"
                                            onChange={(e) => {
                                              formik.setFieldValue(
                                                'fileUploader',
                                                e.target.files[0]
                                              )
                                              // handleFileUploadFun(
                                              //   e.target.files[0],
                                              //   'panCard1'
                                              // )
                                            }}
                                          />
                                        </div>
                                        {formik.values.fileUploader && (
                                          <img
                                            src={URL.createObjectURL(
                                              formik.values.fileUploader
                                            )}
                                            alt="Uploaded File"
                                            className="img-preview"
                                          />
                                        )}
                                        <div className="flex flex-row justify-between mt-4 mx-4">
                                          <div className="flex flex-row justify-between">
                                            <div></div>
                                            <div className="flex flex-col">
                                              <h6 className="text-blueGray-400 text-sm mt- ml-6 mb- font-weight-[700]  font-uppercase">
                                                Payment
                                              </h6>
                                              <span className="text-center text-[13px] font-normal">
                                                {format(
                                                  new Date(),
                                                  'dd-MMMM-yy'
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-md font-weight-[700] text-[13px]">
                                              Received By
                                            </div>
                                            <div className="text-center font-semibold text-[13px]">
                                              {displayName.toUpperCase()}
                                            </div>
                                          </div>
                                        </div>
                                      </section>
                                    )}
                                    {title != 'capturePayment' &&
                                      bookingProgress && (
                                        <section className="mb-3">
                                          <div className="mx-auto flex mt-6 flex-row  ">
                                            <section className="ml-3 w-[300px]">
                                              <div className="flex items-center">
                                                {bookCompSteps.includes(
                                                  'payment_captured'
                                                ) && (
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                                                    <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                                                  </div>
                                                )}
                                                {!bookCompSteps.includes(
                                                  'payment_captured'
                                                ) &&
                                                  !bookCurentStep.includes(
                                                    'payment_captured'
                                                  ) && (
                                                    <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                                  )}
                                                {bookCurentStep.includes(
                                                  'payment_captured'
                                                ) && <Loader />}
                                                <span className="ml-2 text-md font-bold text-navy-700 ">
                                                  Payment Confirmed
                                                </span>
                                              </div>
                                            </section>
                                            {/*  */}
                                            <section className="ml-3 w-[300px]">
                                              <div className="flex items-center">
                                                {bookCompSteps.includes(
                                                  'CS_updated'
                                                ) && (
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                                                    <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                                                  </div>
                                                )}
                                                {!bookCompSteps.includes(
                                                  'CS_updated'
                                                ) &&
                                                  !bookCurentStep.includes(
                                                    'CS_updated'
                                                  ) && (
                                                    <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                                  )}
                                                {bookCurentStep.includes(
                                                  'CS_updated'
                                                ) && <Loader />}
                                                <span className="ml-4 text-md font-bold text-navy-700 ">
                                                  Costsheet & Payment Updated
                                                </span>
                                              </div>
                                            </section>
                                          </div>
                                          <div className="mx-auto flex mt-6 flex flex-row  ">
                                            <section className="ml-3 w-[300px]">
                                              <div className="flex items-center">
                                                {bookCompSteps.includes(
                                                  'unit_booked'
                                                ) && (
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                                                    <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                                                  </div>
                                                )}
                                                {!bookCompSteps.includes(
                                                  'unit_booked'
                                                ) &&
                                                  !bookCurentStep.includes(
                                                    'unit_booked'
                                                  ) && (
                                                    <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                                  )}
                                                {bookCurentStep.includes(
                                                  'unit_booked'
                                                ) && <Loader />}
                                                <span className="ml-2 text-md font-bold text-navy-700 ">
                                                  Unit Booked
                                                </span>
                                              </div>
                                            </section>
                                            {/*  */}
                                            <section className="ml-3 w-[300px]">
                                              <div className="flex items-center">
                                                {bookCompSteps.includes(
                                                  'customer_created'
                                                ) && (
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                                                    <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                                                  </div>
                                                )}
                                                {!bookCompSteps.includes(
                                                  'customer_created'
                                                ) &&
                                                  !bookCurentStep.includes(
                                                    'customer_created'
                                                  ) && (
                                                    <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                                  )}
                                                {bookCurentStep.includes(
                                                  'customer_created'
                                                ) && <Loader />}
                                                <span className="ml-2 text-md font-bold text-navy-700 ">
                                                  Customer Created
                                                </span>
                                              </div>
                                            </section>
                                          </div>
                                          <div className="mx-auto flex mt-6 flex flex-row  ">
                                            <section className="ml-3 w-[300px]">
                                              <div className="flex items-center">
                                                {bookCompSteps.includes(
                                                  'customer_email_send'
                                                ) && (
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                                                    <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                                                  </div>
                                                )}
                                                {!bookCompSteps.includes(
                                                  'customer_email_send'
                                                ) &&
                                                  !bookCurentStep.includes(
                                                    'customer_email_send'
                                                  ) && (
                                                    <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                                  )}
                                                {bookCurentStep.includes(
                                                  'customer_email_send'
                                                ) && <Loader />}
                                                <span className="ml-2 text-md font-bold text-navy-700 ">
                                                  Send Welcome E-mail
                                                </span>
                                              </div>
                                            </section>
                                            {/*  */}
                                            <section className="ml-4 w-[300px]">
                                              <div className="flex items-center">
                                                {bookCompSteps.includes(
                                                  'notify_to_manager'
                                                ) && (
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                                                    <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                                                  </div>
                                                )}
                                                {!bookCompSteps.includes(
                                                  'notify_to_manager'
                                                ) &&
                                                  !bookCurentStep.includes(
                                                    'notify_to_manager'
                                                  ) && (
                                                    <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                                  )}
                                                {bookCurentStep.includes(
                                                  'notify_to_manager'
                                                ) && <Loader />}
                                                <span className="ml-2 text-md font-bold text-navy-700 ">
                                                  Notified to Manager
                                                </span>
                                              </div>
                                            </section>
                                          </div>
                                        </section>
                                      )}
                                    {formik?.file?.fileUploader}

                                    {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}

                                    {/* <h6 className="text-blueGray-400 text-sm mt-3 ml-3 pt-4 mb-6 font-bold uppercase">
                                Source Of Booking
                              </h6> */}
                                    {/* <div className="flex flex-wrap">
                                <div className="w-full lg:w-12/12 px-4">
                                  <div className="relative w-full mb-3">
                                    <TextField2
                                      label="Source"
                                      name="bookingSource"
                                      type="text"
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-12/12 px-4">
                                  <div className="relative w-full mb-3">
                                    <TextField2
                                      label="Booked By"
                                      name="bookedBy"
                                      type="text"
                                    />
                                  </div>
                                </div>
                              </div> */}
                                    <div className="text-center space-x-4 mt-6">
                                      <button
                                        className="bg-[#8B5CF6] translate-y-1 text-[#fff] sm:text-lg text-xs font-bold py-2.5 px-6  rounded-full inline-flex items-center"
                                        type="submit"
                                        disabled={loading}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-6 h-6"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        &nbsp; &nbsp;
                                        <span>
                                          {' '}
                                          {title === 'capturePayment'
                                            ? 'Confirm Payment'
                                            : 'Book Unit '}{' '}
                                        </span>
                                      </button>
                                    </div>

                                    <Confetti ref={confettiRef} />
                                  </section>
                                </div>
                              </div>
                            </div>
                            {/* <div className=" text-right  md:block flex flex-col-reverse py-2 z-10 flex flex-row justify-between mt-2 pr-6 bg-white shadow-lg    w-full">
                              <button
                                className=" bg-gradient-to-r from-violet-300 to-indigo-300
                                  text-black font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                onClick={handleClick}
                                type="button"
                              >
                                Reset
                              </button>
                              <button
                                className=" bg-gradient-to-r from-violet-300 to-indigo-300
                                  text-black font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                onClick={handleClick}
                                type="button"
                              >
                                Download
                              </button>
                              <button
                                className=" bg-gradient-to-r from-violet-300 to-indigo-300
                                  text-black  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                type="submit"
                                disabled={loading}
                              >
                                {'Capture Payment'}
                              </button>
                            </div> */}
                          </section>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptureUnitPayment
