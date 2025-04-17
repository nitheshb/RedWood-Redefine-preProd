/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, useRef } from 'react'
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'
import { AttachFile } from '@mui/icons-material'
import { format } from 'date-fns'
import { setHours, setMinutes } from 'date-fns'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from '@redwoodjs/router'
import Confetti from 'src/components/shared/confetti'
import { paymentMode } from 'src/constants/projects'
import {
  addPaymentReceivedEntrySup,
  createNewCustomerS,
  getProject,
  getProjectByUid,
  steamUsersProjAccessList,
  streamCustomersList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'
import { MultiSelectMultiLineWallet } from 'src/util/formFields/selectBoxMultiLineWallet'
import { TextField2 } from 'src/util/formFields/TextField2'
import PdfReceiptGenerator from 'src/util/PdfReceiptGenerator'
import RupeeInWords from 'src/util/rupeeWords'
import Loader from '../Loader/Loader'
import { validate_capturePayment, validate_captureWalletPayment } from '../Schemas'
import sendEmail from 'src/util/sendEmail'

// import sendEmail from '../../../../web/src/util/sendEmail'






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
  newConstructPS,
  newConstructCsObj,
  newConstructCostSheetA,
  phase,
  stepIndx,
  StatusListA,
  myBookingPayload,
}) => {
  const d = new window.Date()

  const { user } = useAuth()
  const { orgId, displayName, email, phone } = user
  const [loading, setLoading] = useState(false)
  const [openAreaFields, setOpenAreaFields] = useState(false)
  const [bookingProgress, setBookingProgress] = useState(false)
  const [bankDetailsA, setBankDetailsA] = useState([])
  const [paymentScheduleA, setPaymentScheduleA] = useState([])
  const [payingForA, setPayingForA] = useState([])
  const [creditNotersA, setCreditNoters] = useState([])
  const [walletCustomers, setWalletCustomers] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [projectDetails, setProject] = useState({})
  const [limitError, setLimitError] = useState(false)








  const getProjectDetails = async (id) => {
    const unsubscribe = await getProjectByUid(
      orgId,
      id,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setProject(projects[0])
      },
      () =>
        setProject({
          projectName: '',
        })
    )
    return unsubscribe
  }
  useEffect(() => {
    getProjectDetails(selUnitDetails?.pId)
  }, [selUnitDetails])
  const formatIndianNumber = function (num) {
    const [integerPart, decimalPart] = num.toString().replace(/,/g, '').split('.');
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    const formattedNumber = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    const result = formattedNumber + (formattedNumber ? ',' : '') + lastThree;
    return decimalPart ? `${result}.${decimalPart}` : result;
  }
  const [startDate, setStartDate] = useState(d)
  const [paymentModex, setPaymentModex] = useState('cheque')
  const [payementDetails, setPayementDetails] = useState([])
  const [files, setFiles] = useState([])
  const [commentAttachUrl, setCommentAttachUrl] = useState({})
  const [selWalletCustomer, setSelWalletCustomer] = useState({})
  const [cmntFileType, setCmntFileType] = useState('')
  const [amount, setAmount] = useState(0)
  const { enqueueSnackbar } = useSnackbar()
  const { uid } = useParams()
  const bankData = {}
  const confettiRef = useRef(null)
  const handleClick = () => {
    console.log(' projectDetails', projectDetails, selUnitDetails)
    confettiRef.current.fire()
  }

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('unit details are ', selUnitDetails, newPlotPS)
  }, [])

  useEffect(() => {
    getProjectFun()
  }, [])
  useEffect(() => {
    let fullPs = []
    const newConstructPSA = newConstructPS || []
    if (newPlotPS) {
      fullPs = [...newPlotPS, ...newConstructPSA]
    } else {
      fullPs = selUnitDetails?.fullPs
    }
    setPaymentScheduleA(
      fullPs?.map((user) => {
        user.label = user?.stage?.label
        return user
      })
    )
    if (newPlotPS?.length > 0) {
      setPayingForA([newPlotPS[0]])
    }
  }, [newPlotPS])
  const getProjectFun = async () => {
    const additionalUserInfo = await getProject(orgId, selUnitDetails?.pId)
    const bankA = await additionalUserInfo?.bankAccounts?.map((user) => {
      user.label = user?.accountName
      user.value = user?.accountNo
    })
    await console.log(
      'fetched users list is ==>',
      additionalUserInfo,
      additionalUserInfo?.bankAccounts,
      additionalUserInfo?.bankAccounts?.map((user) => {
        user.label = user?.accountName
        user.value = user?.accountNo
        return user
      })
    )

    await setBankDetailsA(
      additionalUserInfo?.bankAccounts?.map((user) => {
        user.label = user?.accountName
        user.value = user?.accountNo
        return user
      })
    )
    await console.log('selected value is xxx ', additionalUserInfo)
  }

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
  useEffect(() => {
    const unsubscribe = streamCustomersList(
      orgId,
      (querySnapshot) => {
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id

          return x
        })
        console.log('fetched users list is', selUnitDetails?.custObj1?.customerName1)
        let x = bankA.filter((u) => u?.Name === (selUnitDetails?.custObj1?.customerName1 || selUnitDetails?.customerDetailsObj?.customerName1 || selUnitDetails?.secondaryCustomerDetailsObj?.customerName1))
        x.map((user) => {
          user.label = user?.Name
          user.value = user?.id
          user.walletAmount = user?.remaining_money
        })
        console.log('fetched users list is', bankA)
        setWalletCustomers([...x])
      },
      { pId: [selUnitDetails?.pId] },
      (error) => setWalletCustomers([])
    )

    return unsubscribe
  }, [])
  const handleFileUploadFun = (file, type) => {
    try {
      return new Promise((resolve, reject) => {
        console.log('am i inside handle FileUpload')
        if (!file) return reject('No file provided')

        try {
          const uid = uuidv4()
          const storageRef = ref(storage, `/spark_files/${'taskFiles'}_${uid}`)
          const uploadTask = uploadBytesResumable(storageRef, file)

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              // setProgress(prog)
              file.isUploading = false
            },
            (err) => reject(err), // Reject the promise if there's an error during upload
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                file.url = url
                console.log('url is ', url)

                let x1 = { url: url, fileName: file.name }
                setCommentAttachUrl(x1)

                resolve(x1)
              }).catch((err) => {
                reject(err)
              })
            }
          )
        } catch (error) {
          console.log('upload error is ', error)
          reject(error)
        }
      })
    } catch (error) {

    }

  }

  const onSubmitSupabase = async (data, resetForm) => {
    console.log('inside supabase supports', data?.fileUploader, data?.fileUploader != "")
    if (data?.fileUploader) {
      let x = await handleFileUploadFun(data?.fileUploader, 'panCard1')
      const z = await commentAttachUrl
      data.attchUrl = x || ''
    }
    let y = {}
    y = data


    await console.log('data is ', commentAttachUrl, data, data?.fileUploader, data?.fileUploader[0], data?.fileUploader.File, data?.fileUploader.url, commentAttachUrl)

    await setPayementDetails(data)


    await onSubmitFun(y, resetForm)

    await confettiRef?.current?.fire()




    try {
      const emailData = {
        email: customerInfo?.email,
        userFirstname: customerInfo?.name,
        resetPasswordLink: "https://yourdomain.com/reset-password",
      };

      await sendEmail(emailData.email, emailData.userFirstname, emailData.resetPasswordLink);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
    }






    return;



    const { uid } = selUnitDetails


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

  }


  const datee = new Date().getTime()
  const initialState = {
    amount: bankData?.amount || '',
    amount_commas: bankData?.amount || '',
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
    selCustomerWallet: {},
  }



  const submitFormFun = (formik) => {
    formik.handleSubmit()
  }

  const setDateFun = (date) => {
    setStartDate(date)
  }
  // const bgImgStyle = {
  //   backgroundImage:
  //     'url("httpsss://images.unsplash.com/photo-1605106715994-18d3fecffb98?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dtest")',
  //   backgroundRepeat: 'no-repeat',
  //   backgroundSize: 'cover',
  // }















  // const [isOpen, setIsOpen] = useState(false);




  const PaymentIcons = {
    cheque: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    Rtgs: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    DD: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    online: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    credit_note: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    wallet: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };
  return (
    <div className="bg-[#F6F5F8]">
      <div className="flex items-center justify-center">
        <div id="bg-img" className="flex  w-full flex-col">
          {/* {StatusListA?.length > 0 && (
            <section className="text-white text-right w-full  pr-5">
              {' '}
              {stepIndx} of {StatusListA?.length} steps
            </section>
          )} */}
          <div className="relative  max-h-[65%]  rounded-xl">


            <div className="grid gap-8 grid-cols-1">
              <div className="flex flex-col ">
                <div className="mt-0">
                  <Formik
                    enableReinitialize={true}
                    initialValues={initialState}
                    validationSchema={paymentModex === 'wallet' ? validate_captureWalletPayment : validate_capturePayment}
                    onSubmit={(values, { resetForm }) => {
                      console.log(values)
                      setBookingProgress(true)
                      onSubmitSupabase(values, resetForm)
                      console.log(values)
                    }}
                  >
                    {(formik, setFieldValue) => (
                      <Form>
                        <div className="form">
                          {/* Phase Details */}

                          <section className="relative flex flex-col h-screen">
                            <div className=" flex-1">

                              <div className="w-full mx-auto">
                                <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg bg-[#F6F5F8]">
                                  <div className=" flex flex-row px-0 py-2  overflow-auto ">
                                    <section className=" rounded-md w-full ">
                                      <article className="">
                                        <div className="flex flex-row items-center justify-between">
                                          <section className="flex flex-row mx-3">
                                            {/* <span className="text-[38px] mt-[-16px]">
                                            🎊
                                          </span> */}
                                            {/* <div className="inline"> */}
                                            <div className="">
                                              <label className="text-[24px] font-semibold text-[#053219]  text-sm   ">
                                                {title === 'capturePayment'
                                                  ? 'Capture Payment box'
                                                  : 'Booking Confirmation'}
                                                <abbr title="required"></abbr>
                                              </label>
                                            </div>

                                            {/* </div> */}
                                          </section>
                                          <section className="flex flex-row justify-between">
                                            <div className="flex flex-col  mr-3">
                                              <span className="text-right text-[13px] font-normal">
                                                {format(new Date(), 'dd-MMMM-yy')}
                                              </span>

                                            </div>
                                          </section>
                                        </div>
                                        {/* <hr className="mt-1 border-b-1 border-blueGray-300" /> */}
                                        <hr className="h-[1px]  bg-gradient-to-r from-[#F6F5F8]/100 via-[#B1B1B1] to-[#F6F5F8]/100 border-0 mt-3" />

                                      </article>





                                      <section className="relative mb-4">  {/* Make container relative for absolute child positioning */}
                                        <img
                                          alt="CRM Background"
                                          src="/Bgcp.svg"
                                          className="w-full h-auto object-cover"
                                        />

                                        {/* Centered text (both horizontally & vertically) */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className='flex flex-col text-center'>
                                            <span className="text-[13px] font-normal  ">  {/* Optional: Slight bg for readability */}
                                              Unit Balance
                                            </span>
                                            <span className='text-[24px]'>
                                              {selUnitDetails?.T_balance?.toLocaleString('en-IN') || myBookingPayload?.T_balance?.toLocaleString('en-IN')}

                                            </span>
                                          </div>

                                        </div>
                                      </section>

                                      <section className='h-[calc(100vh-300px)] overflow-y-auto pb-20   scroll-smooth scrollbar-thin scrollbar-thumb-gray-300'>


                                        {!bookingProgress && (
                                          <section className='mx-3'>
                                            <div className="flex flex-wrap mt-3">
                                              <div className="justify-center w-full mx-auto"></div>

                                              {false && <section className="border rounded-md w-full lg:w-12/12 mx-3 mb-3">
                                                <article className="border-b w-full bg-[#F9FAFB] px-3 py-1 rounded-t-md flex flex-row justify-between">
                                                  <span className="text-sm font-semibold text-gray-500 w-2/3">
                                                    Paying For
                                                  </span>
                                                  <span className="text-sm font-semibold text-gray-500 w-1/3 text-right">
                                                    Total
                                                  </span>
                                                  <span className="text-sm font-semibold text-gray-500 w-1/3 text-right">
                                                    Balance
                                                  </span>
                                                  <span className="text-sm font-semibold text-gray-500 w-1/3 text-right">
                                                    Paying Now
                                                  </span>
                                                </article>

                                                {paymentModex != 'credit_note' && (
                                                  <section className="flex flex-row">
                                                    <div className="w-full  px-3 mt-3">
                                                      <div className=" mb-4 w-full">
                                                        {payingForA?.map(
                                                          (paying, i) => {
                                                            return (
                                                              <div
                                                                className="flex flex-row border-b pb-2 justify-between"
                                                                key={i}
                                                              >
                                                                <span className="w-2/3">
                                                                  {
                                                                    paying?.stage
                                                                      ?.label
                                                                  }
                                                                </span>{' '}
                                                                <span className="w-1/3  text-right">
                                                                  {paying?.value?.toLocaleString(
                                                                    'en-IN'
                                                                  )}
                                                                </span>
                                                                <span className="w-1/3 text-right">
                                                                  {paying?.balance?.toLocaleString(
                                                                    'en-IN'
                                                                  ) ||
                                                                    paying?.value?.toLocaleString(
                                                                      'en-IN'
                                                                    )}
                                                                </span>
                                                                <span className="w-1/3 text-right">
                                                                  {paying?.balance?.toLocaleString(
                                                                    'en-IN'
                                                                  ) || 0}
                                                                </span>
                                                              </div>
                                                            )
                                                          }
                                                        )}
                                                      </div>
                                                    </div>
                                                    {bankAccounts.length > 0 && (
                                                      <div className="flex  space-x-2 w-full text-xs">
                                                        {bankAccounts.map(
                                                          (data, i) => (
                                                            <section
                                                              key={i}
                                                              className="border px-4 py-2 rounded-lg"
                                                            >
                                                              <div>
                                                                {data?.label}
                                                              </div>
                                                              <div>
                                                                {data?.accountName}
                                                              </div>
                                                            </section>
                                                          )
                                                        )}
                                                      </div>
                                                    )}
                                                    <div className="w-full  px-3 mt-3">
                                                      <div className=" mb-4 w-full">
                                                        <MultiSelectMultiLineField
                                                          label="Select Paying For"
                                                          name="towardsBankDocId"
                                                          onChange={(payload) => {

                                                            console.log(
                                                              'changed value is ',
                                                              payload
                                                            )
                                                            const {
                                                              value,
                                                              id,
                                                              accountName,
                                                            } = payload
                                                            console.log(
                                                              'selected value is ',
                                                              payload
                                                            )

                                                            const x = payingForA
                                                            const exists =
                                                              payingForA.find(
                                                                (item) =>
                                                                  item.id ===
                                                                  payload.id
                                                              )
                                                            if (
                                                              !exists &&
                                                              value !=
                                                              'addNewOption'
                                                            ) {
                                                              x.push(payload)
                                                              setPayingForA(x)
                                                            }

                                                            formik.setFieldValue(
                                                              'towardsBankDocId',
                                                              ''
                                                            )
                                                          }}
                                                          value={
                                                            formik.values
                                                              .towardsBankDocId
                                                          }
                                                          options={paymentScheduleA}
                                                        />
                                                      </div>
                                                    </div>
                                                  </section>
                                                )}
                                              </section>}



                                              {/* <section className='overflow-y-auto  scroll-smooth scrollbar-thin scrollbar-thumb-gray-300'>


                                          </section> */}

                                              <section className=" rounded-md w-full mx-3 lg:w-12/12 mb-3">
                                                <article className=" w-full py-1 rounded-t-md">
                                                  <span className="text-[12px] font- text-[#606062] font-medium">
                                                    Mode of Payment
                                                  </span>
                                                </article>


                                                {/* <div className="bg-[#FFFFFF] rounded-2xl">
  {paymentMode.map((dat, i) => {
    return (


      <div className='mx-6 border-b border-[#E7E7E9] last:border-b-0'>


<div
        className="flex flex-row items-center     justify-between  gap-x-1 p-4 "
        key={i}
        onClick={(e) => {
          e.stopPropagation();
          setPaymentModex(dat.value);
          formik.setFieldValue('mode', dat.value);
          setIsOpen(false);
        }}
      >



        <div className='flex gap-2 '>
        <img src={dat.img} alt={dat.label} className="h-8 w-8" />
        
        <label
          htmlFor={`dropdown-checkbox-${i}`}
          className="block text-[14px] mt-0 font-medium leading-6 text-[#606062] font-normal ml-2"
        >
          {dat.label}
        </label>
        </div>

        <input
          id={`dropdown-checkbox-${i}`}
          name="payment-options-dropdown"
          type="checkbox"
          checked={paymentModex == dat.value}
          className="h-4 w-4 text-black accent-black  border-gray-300 rounded focus:ring-black"
          onChange={() => {
            setPaymentModex(dat.value);
            formik.setFieldValue('mode', dat.value);
            setIsOpen(false);
          }}
          onClick={(e) => e.stopPropagation()}
        />


      </div>

      </div>






    );
  })}
</div> */}



                                                <div className="relative">
                                                  <button
                                                    type="button"
                                                    className=" w-full flex justify-between items-center p-1 px-2 rounded-md border border-[#E7E7E9]"
                                                    onClick={() => setIsOpen(!isOpen)}
                                                  >
                                                    <div className="flex items-center">
                                                      {paymentModex ? (
                                                        <>
                                                          <img
                                                            src={paymentMode.find(mode => mode.value === paymentModex)?.img}
                                                            alt="selected payment"
                                                            className="h-8 w-8"
                                                          />
                                                          <span className="ml-2 text-[14px] text-[#0E0A1F]">
                                                            {paymentMode.find(mode => mode.value === paymentModex)?.label}
                                                          </span>
                                                        </>
                                                      ) : (
                                                        <span className="text-[14px] text-[#606062]">Select Payment Mode</span>
                                                      )}
                                                    </div>
                                                    <svg
                                                      className={`h-5 w-5 text-[#606062] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                                                        }`}
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      viewBox="0 0 20 20"
                                                      fill="currentColor"
                                                    >
                                                      <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                      />
                                                    </svg>
                                                  </button>

                                                  {isOpen && (
                                                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-[#E7E7E9]">
                                                      <div className="py-1">
                                                        {paymentMode.map((dat, i) => (
                                                          <div
                                                            key={i}
                                                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                                            onClick={() => {
                                                              setPaymentModex(dat.value);
                                                              formik.setFieldValue('mode', dat.value);
                                                              setIsOpen(false);
                                                            }}
                                                          >
                                                            <div className="flex items-center">
                                                              <img src={dat.img} alt={dat.label} className="h-8 w-8" />
                                                              {/* <span className="ml-2 text-[14px] text-[#606062]">
                {dat.label}
              </span> */}
                                                              <span
                                                                className={`ml-2 text-[14px] ${paymentModex === dat.value ? 'text-black' : 'text-[#606062]'
                                                                  }`}
                                                              >
                                                                {dat.label}
                                                              </span>

                                                            </div>
                                                            {paymentModex === dat.value && (
                                                              <svg
                                                                className="h-5 w-5 text-[#606062]"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                              >
                                                                <path
                                                                  fillRule="evenodd"
                                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                  clipRule="evenodd"
                                                                />
                                                              </svg>
                                                            )}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>






                                                <div className="flex flex-col md:flex-row gap-4 py-4 items-start">
                                                  {/* Paying Towards Account Field - Left Side */}
                                                  {![
                                                    'credit_note',
                                                    'wallet',
                                                  ].includes(paymentModex) && (
                                                      <div className="w-full md:w-8/12">
                                                        <label className="block text-[12px] font-normal text-[#616162]  tracking-[0.06em] mb-1">
                                                          Paying Towards Account
                                                        </label>
                                                        <MultiSelectMultiLineField
                                                          name="towardsBankDocId"
                                                          onChange={(payload) => {
                                                            console.log('changed value is ', payload);
                                                            const { value, id, accountName } = payload;
                                                            formik.setFieldValue('builderName', accountName);
                                                            formik.setFieldValue('landlordBankDocId', id);
                                                            formik.setFieldValue('towardsBankDocId', id);
                                                          }}
                                                          value={formik.values.towardsBankDocId}
                                                          options={bankDetailsA}
                                                          // className="w-full bg-transparent border border-[#606062]"
                                                          customStyles={{
                                                            control: (provided) => ({
                                                              ...provided,
                                                              backgroundColor: 'transparent',
                                                              // borderColor: '#606062',
                                                              // '&:hover': {
                                                              //   borderColor: '#606062',
                                                              // },
                                                            }),
                                                            menu: (provided) => ({
                                                              ...provided,
                                                              backgroundColor: '#FFFFFF',
                                                            }),
                                                          }}
                                                        />
                                                      </div>
                                                    )}

                                                  {/* Date Field - Right Side */}
                                                  <div className="w-full md:w-4/12">
                                                    <label className="block text-[12px]  font-normal text-[#616162]  tracking-[0.06em] mb-1">
                                                      Date
                                                    </label>
                                                    <CustomDatePicker
                                                      className="w-full h-[36px] px-2 text-[12px] border bg-transparent  rounded-md "
                                                      name="dated"
                                                      selected={formik.values.dated}
                                                      onChange={(date) => {
                                                        formik.setFieldValue('dated', date.getTime());
                                                        console.log(startDate);
                                                      }}
                                                      dateFormat="dd/MM/yyyy"
                                                      showYearDropdown

                                                      customStyles={{
                                                        control: (provided) => ({
                                                          ...provided,
                                                          backgroundColor: 'transparent',
                                                          borderColor: '##606062',
                                                          '&:hover': {
                                                            borderColor: '##606062',
                                                          },
                                                        }),
                                                        menu: (provided) => ({
                                                          ...provided,
                                                          backgroundColor: '#2d2d2d',
                                                        }),
                                                      }}
                                                    />
                                                  </div>
                                                </div>



                                                {paymentModex === 'credit_note' && (
                                                  <div className="w-full  px-3 mt-3">
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

                                                {paymentModex === 'wallet' && (
                                                  <div className="w-full  px-3 mt-3">
                                                    <div className=" mb-4 w-full">
                                                      <MultiSelectMultiLineWallet
                                                        label="Customer Wallet"
                                                        name="creditNoteIssuer"
                                                        setSelWalletCustomer={
                                                          setSelWalletCustomer
                                                        }
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
                                                            walletAmount,
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
                                                            payload?.id
                                                          )

                                                          formik.setFieldValue(
                                                            'selCustomerWallet',
                                                            payload
                                                          )

                                                          formik.setFieldValue(
                                                            'amount',
                                                            walletAmount || 0
                                                          )
                                                        }}
                                                        value={
                                                          formik.values
                                                            .towardsBankDocId
                                                        }
                                                        options={walletCustomers}
                                                      />
                                                    </div>
                                                  </div>
                                                )}


                                                <section className='flex flex-col py-4 gap-4'>
                                                  <div className="flex flex-col md:flex-row gap-4">


                                                    <div className="w-full md:w-7/12">
                                                      <div className=" mb-3">
                                                        <TextField2
                                                          label="Amount"
                                                          name="amount_commas"
                                                          type="text"
                                                          value={
                                                            formik.values.amount_commas !== null
                                                              ? formatIndianNumber(formik.values.amount_commas)
                                                              : 0
                                                          }
                                                          onChange={(e) => {
                                                            console.log(
                                                              'changed value is ',
                                                              e.target.value, formik.values
                                                                .selCustomerWallet
                                                              ?.walletAmount, (e.target.value > 0 &&
                                                                e.target.value >
                                                                formik.values
                                                                  .selCustomerWallet
                                                                  ?.walletAmount),
                                                              paymentModex
                                                            )
                                                            if (
                                                              paymentModex ===
                                                              'wallet'
                                                            ) {
                                                              if (
                                                                e.target.value > 0 &&
                                                                e.target.value >
                                                                formik.values
                                                                  .selCustomerWallet
                                                                  ?.walletAmount
                                                              ) {


                                                                formik.setFieldValue(
                                                                  'amount',
                                                                  Number((formik.values
                                                                    .selCustomerWallet
                                                                    ?.walletAmount || '').replace(/,/g, ''))
                                                                )
                                                                formik.setFieldValue(
                                                                  'amount_commas',
                                                                  (String(Number(formik.values
                                                                    .selCustomerWallet
                                                                    ?.walletAmount)))
                                                                )
                                                              } else {
                                                                formik.setFieldValue(
                                                                  'amount',
                                                                  Number((e.target.value || '').replace(/,/g, ''))
                                                                )
                                                                formik.setFieldValue(
                                                                  'amount_commas',
                                                                  (String(Number(e.target.value.replace(/[^0-9]/g, ''))))
                                                                )
                                                              }
                                                            } else {

                                                              let x = Number((e.target.value || '').replace(/,/g, ''))
                                                              console.log(
                                                                'changed value is ',
                                                                e.target.value, x)
                                                              if (
                                                                x > 0 &&
                                                                (x <= selUnitDetails?.T_balance || x <= myBookingPayload?.T_balance)

                                                              ) {
                                                                formik.setFieldValue(
                                                                  'amount',
                                                                  Number((e.target.value || '').replace(/,/g, ''))
                                                                )
                                                                formik.setFieldValue(
                                                                  'amount_commas',
                                                                  (String(Number(e.target.value.replace(/[^0-9]/g, ''))))
                                                                )
                                                                setLimitError(false)
                                                              }
                                                              else if (x > 0) {

                                                                setLimitError(true)

                                                              } else {
                                                                formik.setFieldValue(
                                                                  'amount',
                                                                  Number((e.target.value || '').replace(/,/g, ''))
                                                                )
                                                                formik.setFieldValue(
                                                                  'amount_commas',
                                                                  (String(Number(e.target.value.replace(/[^0-9]/g, ''))))
                                                                )
                                                              }
                                                            }
                                                          }}
                                                        />
                                                      </div>
                                                      <div className="text-xs">
                                                        {' '}
                                                        Paying{' '}
                                                        <RupeeInWords
                                                          amount={
                                                            Number(formik?.values?.amount) || 0
                                                          }
                                                        />
                                                      </div>
                                                      {limitError && <div className="text-xs text-red-700">
                                                        {' '}
                                                        Amount cannot be greater than Unit Balance {' '}
                                                      </div>}
                                                    </div>
                                                    <div className="w-full md:w-5/12">
                                                      <div className="">
                                                        <TextField2
                                                          label="Cheque/Ref No"
                                                          name="bank_ref_no"
                                                          type="text"
                                                        />
                                                      </div>
                                                    </div>


                                                  </div>
                                                </section>


                                                <div className="w-full   pb-4">
                                                  <div className="relative w-full mb-3">
                                                    <TextField2
                                                      label="Notes"
                                                      name="payReason"
                                                      type="text"
                                                    />
                                                  </div>
                                                </div>
                                              </section>
                                            </div>
                                            <div className="flex flex-col">
                                              <label
                                                htmlFor="formFile1"
                                                className="form-label cursor-pointer  tracking-[0.06em] inline-flex items-center mt-2 ml-2 text-[#606062] font-regular text-[12px] rounded-2xl py-1"
                                              >

                                                Add attachment
                                                <AttachFile
                                                  className="w-4 h-4 mr-1"
                                                  style={{ fontSize: '14px' }}
                                                />
                                              </label>

                                              <input
                                                type="file"
                                                className="hidden"
                                                id="formFile1"
                                                name="fileUploader"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  if (e.target.files && e.target.files[0]) {
                                                    formik.setFieldValue('fileUploader', e.target.files[0]);
                                                  }
                                                }}
                                              />

                                              {formik.values.fileUploader && (
                                                <div className="mt-2 relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                                                  <img
                                                    src={URL.createObjectURL(formik.values.fileUploader)}
                                                    alt="Uploaded File"
                                                    className="w-full h-full object-contain"
                                                  />
                                                  <button
                                                    type="button"
                                                    className="absolute top-0 right-0 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                    onClick={() => formik.setFieldValue('fileUploader', null)}
                                                  >
                                                    ×
                                                  </button>
                                                </div>
                                              )}
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





                                        <Confetti ref={confettiRef} />

                                      </section>


                                    </section>
                                  </div>
                                </div>
                              </div>
                              {bookingProgress && (
                                <div className="inline-block">
                                  <PdfReceiptGenerator
                                    user={user}
                                    selUnitDetails={selUnitDetails}
                                    myObj={newPlotCostSheetA}
                                    newPlotPS={newPlotPS}
                                    payementDetails={payementDetails}

                                    projectDetails={projectDetails}
                                  />
                                </div>
                              )}

                            </div>



                            {!bookingProgress && (

                              <div className="sticky bottom-0 bg-white  border-t border-gray-200">

                                <div className="text-center my-3">
                                  <button
                                    className="bg-[#EDE9FE] translate-y-1 text-[#0E0A1F] text-[12px] font-medium py-2.5 px-8  rounded-md inline-flex items-center"
                                    type="submit"
                                    disabled={loading}
                                  >
                                    {/* <svg
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
                                          </svg> */}
                                    &nbsp; &nbsp;
                                    <span>
                                      {' '}
                                      {title === 'capturePayment'
                                        ? 'Confirm Payment'
                                        : 'Book Unit '}{' '}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            )}


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
// function triggerBookingEmail(email: any, userFirstname: any, resetPasswordLink: string) {
//   throw new Error('Function not implemented.')
// }

