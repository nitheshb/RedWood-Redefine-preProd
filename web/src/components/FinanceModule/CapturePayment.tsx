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

  // const [formattedValue, setFormattedValue] = useState('');

  // const handleChange = (e) => {
  //   const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  //   const formatted = value ? `Rs.${parseInt(value, 10).toLocaleString('en-IN')}` : '';
  //   setFormattedValue(formatted);
  // };










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
      console.log('fetched users list is',selUnitDetails?.custObj1?.customerName1)
      let x = bankA.filter((u)=> u?.Name === (selUnitDetails?.custObj1?.customerName1 || selUnitDetails?.customerDetailsObj?.customerName1 || selUnitDetails?.secondaryCustomerDetailsObj?.customerName1  ))
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

              // Resolve the promise with the URL once the upload is successful
              resolve(x1)
            }).catch((err) => {
              reject(err) // Reject if getDownloadURL fails
            })
          }
        )
      } catch (error) {
        console.log('upload error is ', error)
        reject(error) // Reject the promise in case of any other errors
      }
    })
  }

  const onSubmitSupabase = async (data, resetForm) => {
    console.log('inside supabase support', data)
   let x =  await handleFileUploadFun(data?.fileUploader, 'panCard1')
    const z = await commentAttachUrl
    data.attchUrl = x
    let y = {}
    y = data


   await console.log('data is ',x,commentAttachUrl, data,data?.fileUploader,data?.fileUploader[0],data?.fileUploader.File, data?.fileUploader.url, commentAttachUrl)

   await setPayementDetails(data)


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
      'url("httpsss://images.unsplash.com/photo-1605106715994-18d3fecffb98?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dtest")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
  return (
    <div className="">
      <div className="flex items-center justify-center">
        <div id="bg-img" className="flex  w-full flex-col" style={bgImgStyle}>
          {StatusListA?.length > 0 && (
            <section className="text-white text-right w-full  pr-5">
              {' '}
              {stepIndx} of {StatusListA?.length} steps
            </section>
          )}
          <div className="relative mx-4 max-h-[65%]  rounded-xl  px-2 pb-14 border ">
            {/* <div className="space-y-4 text-white">
              <h3 className="font-bold text-2xl">Confirm Booking</h3>

            </div> */}

            <div className="grid gap-8 grid-cols-1">
              <div className="flex flex-col ">
                <div className="mt-0">
                  <Formik
                    enableReinitialize={true}
                    initialValues={initialState}
                    validationSchema={paymentModex === 'wallet' ? validate_captureWalletPayment : validate_capturePayment }
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

                          <section className="overflow-y-auto h-[60vh] sm:h-[50vh] md:h-[60vh] lg:h-[100vh]">
                            <div className="w-full mx-auto">
                              <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg bg-white ">
                                <div className=" flex flex-row px-0 py-2  overflow-auto ">
                                  <section className=" p- rounded-md w-full ">
                                    <article className="mt-3">
                                      <div className="flex flex-row  justify-between">
                                        <section className="flex flex-row">
                                          <span className="text-[38px] mt-[-16px]">
                                            🎊
                                          </span>
                                          <div className="inline">
                                            <div className="mt-[4px]">
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
                                          <div className="flex flex-col mr-2 mt-2">
                                            {/* <h6 className="text-blueGray-400 text-sm mt- ml-6 mb- font-weight-[700]  font-uppercase">
                                              Payment
                                            </h6> */}
                                            <span className="text-right text-[13px] font-normal">
                                              {format(new Date(), 'dd-MMMM-yy')}
                                            </span>
                                            <span className="text-right text-[13px] font-normal">
                                              Unit Balance: {selUnitDetails?.T_balance?.toLocaleString('en-IN')|| myBookingPayload?.T_balance?.toLocaleString('en-IN')}
                                            </span>
                                          </div>
                                        </section>
                                      </div>
                                      <hr className="mt-1 border-b-1 border-blueGray-300" />
                                    </article>
                                    {!bookingProgress && (
                                      <section>
                                        <div className="flex flex-wrap mt-3">
                                          <div className="justify-center w-full mx-auto"></div>

                                         {false &&<section className="border rounded-md w-full lg:w-12/12 mx-3 mb-3">
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
                                              <section className="flex flex-col">
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
                                                        // console.log(
                                                        //   'changed value is ',
                                                        //   payload
                                                        // )
                                                        // const {
                                                        //   value,
                                                        //   id,
                                                        //   accountName,
                                                        // } = payload
                                                        // formik.setFieldValue(
                                                        //   'builderName',
                                                        //   accountName
                                                        // )
                                                        // formik.setFieldValue(
                                                        //   'landlordBankDocId',
                                                        //   id
                                                        // )
                                                        // formik.setFieldValue(
                                                        //   'towardsBankDocId',
                                                        //   id
                                                        // )
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
                                                        // formik.setFieldValue('builderName', accountName)
                                                        // formik.setFieldValue('landlordBankDocId', id)
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

                                          <section className="border rounded-md w-full lg:w-12/12 mx-3 mb-3">
                                            <article className="border-b w-full bg-[#F9FAFB] px-3 py-1 rounded-t-md">
                                              <span className="text-sm font-semibold text-gray-500">
                                                Paid Through
                                              </span>
                                            </article>
                                            <div className="w-full px-3 mb-4 mt-8 flex flex-row gap-x-6">
                                              {paymentMode.map((dat, i) => {
                                                return (
                                                  // <span
                                                  //   className={` mr-2 border rounded-xl px-2 py-2 cursor-pointer hover:bg-violet-400 hover:text-white text-sm ${
                                                  //     paymentModex == dat.value
                                                  //       ? 'bg-violet-400 text-white'
                                                  //       : ''
                                                  //   }`}
                                                  //   key={i}
                                                  //   onClick={() => {
                                                  //     setPaymentModex(dat.value)
                                                  //     formik.setFieldValue(
                                                  //       'mode',
                                                  //       dat.value
                                                  //     )
                                                  //   }}
                                                  // >
                                                  //   {dat.label}
                                                  // </span>
                                                  <div
                                                    className="flex flex-col items-center gap-x-1"
                                                    key={i}
                                                    onClick={() => {
                                                      // setPaymentModex(dat.value)



                                                      setPaymentModex(dat.value)
                                                      formik.setFieldValue(
                                                        'mode',
                                                        dat.value
                                                      )
                                                    }}
                                                  >
                                                    <input
                                                      id="push-everything"
                                                      name="push-notifications"
                                                      type="radio"
                                                      checked={
                                                        paymentModex ==
                                                        dat.value
                                                      }
                                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    />
                                                    <label
                                                      htmlFor="push-everything"
                                                      className="block text-sm mt-2 font-medium leading-6 text-gray-900"
                                                    >
                                                      {dat.label}
                                                    </label>
                                                  </div>
                                                )
                                              })}
                                            </div>

                                            {![
                                              'credit_note',
                                              'wallet',
                                            ].includes(paymentModex) && (
                                              <div className="w-full  px-3 mt-4">
                                                <div className=" mb-4 w-full">
                                                  <MultiSelectMultiLineField
                                                    label="Paid Towards Account"
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
                                                      formik.setFieldValue(
                                                        'builderName',
                                                        accountName
                                                      )
                                                      formik.setFieldValue(
                                                        'landlordBankDocId',
                                                        id
                                                      )

                                                      formik.setFieldValue(
                                                        'towardsBankDocId',
                                                        id
                                                      )
                                                    }}
                                                    value={
                                                      formik.values
                                                        .towardsBankDocId
                                                    }
                                                    options={bankDetailsA}
                                                  />
                                                </div>


{/* <div className="mb-4 w-full">
      <MultiSelectMultiLineField
        label="Paid Towards Account box"
        name="towardsBankDocId"
        onChange={(payload) => {
          console.log('Changed value is ', payload);
          const { value, id, accountName } = payload;


          const formattedValue = formatIndianNumber(value);


          formik.setFieldValue('builderName', accountName);
          formik.setFieldValue('landlordBankDocId', id);
          formik.setFieldValue('towardsBankDocId', formattedValue);

          console.log('Formatted value:', formattedValue);
        }}
        value={formik.values.towardsBankDocId}
        options={bankDetailsA}
      />
    </div> */}



                                              </div>
                                            )}

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
                                                    label="Customer wallet"
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
                                                        uid
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
                                            <section className="">
                                              <div className="w-full lg:w-12/12 px-3">
                                                <div className="relative w-full mb-3">
                                                  <TextField2
                                                    label="Amount"
                                                    name="amount_commas"
                                                    type="text"
                                                    value={
                                                      formik.values.amount_commas!== null
                                                        ? formatIndianNumber(formik.values.amount_commas)
                                                        : 0
                                                    }
                                                    onChange={(e) => {
                                                      // setAmount(e.target.value)
                                                      console.log(
                                                        'changed value is ',
                                                        e.target.value,  formik.values
                                                        .selCustomerWallet
                                                        ?.walletAmount,  (e.target.value > 0 &&
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
                                                            Number((   formik.values
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

                                                        let x =  Number((e.target.value || '').replace(/,/g, ''))
                                                        console.log(
                                                          'changed value is ',
                                                          e.target.value,x )
                                                        if (
                                                          x > 0 &&
                                                          (x <= selUnitDetails?.T_balance || x <= myBookingPayload?.T_balance)

                                                        ){
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
                                                      else if(x > 0){

                                                        setLimitError(true)

                                                      }else{
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
                                              </div>

                                              <div className="text-xs px-3 ">
                                                {' '}
                                                Paying{' '}
                                                <RupeeInWords
                                                  amount={
                                                    Number(formik?.values?.amount) || 0
                                                  }
                                                />
                                              </div>
                                             {limitError && <div className="text-xs px-3  text-red-700">
                                                {' '}
                                                Amount cannot be greater than Unit Balance {' '}
                                              </div>}
                                            </section>
                                            <section className="flex flex-row mt-3">
                                              <div className="w-full lg:w-10/12 px-3">
                                                <div className="relative w-full mb-5">
                                                  <TextField2
                                                    label="Cheque/Ref No"
                                                    name="bank_ref_no"
                                                    type="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="w-full mt-3 lg:w-4/12 px-  ">
                                                <div className="relative w-full mb-5 mt-[-1px] ">
                                                  <span className="inline">
                                                    <CustomDatePicker
                                                      className="h-8 outline-none border-t-0 border-l-0 border-r-0 border-b border-gray-500  border-solid mt-[-4px] pb-1  min-w-[125px]  inline  text-[#0091ae]   lg:w-11/12 w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] "
                                                      label="Dated"
                                                      name="dated"
                                                      // selected={startDate}
                                                      selected={
                                                        formik.values.dated
                                                      }
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
                                                      //dateFormat="MMM d, yyyy"
                                                      dateFormat="MMM dd, yyyy"
                                                    />
                                                  </span>
                                                </div>
                                              </div>
                                            </section>

                                            <div className="w-full  px-3 pb-4">
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
                                        <div>
                                          <label
                                            htmlFor="formFile1"
                                            className="form-label cursor-pointer inline-block mt-2 ml-2 text-[#00ADB4]  font-regular text-xs  rounded-2xl  py-1 "
                                          >
                                            <AttachFile
                                              className="w-4 h-4 text-[14px]"
                                              style={{ fontSize: '14px' }}
                                            />
                                          Add Receipt
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
                                    {!bookingProgress && (
                                      <div className="text-center space-x-4 mt-6 pb-10">
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
                                    )}

                                    <Confetti ref={confettiRef} />
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
                                  // myAdditionalCharges={
                                  //   newAdditonalChargesObj
                                  // }
                                  // netTotal={netTotal}
                                  // setNetTotal={setNetTotal}
                                  // partATotal={partATotal}
                                  // partBTotal={partBTotal}
                                  // setPartATotal={setPartATotal}
                                  // setPartBTotal={setPartBTotal}
                                  projectDetails={projectDetails}
                                  // leadDetailsObj1={leadDetailsObj1}
                                />
                              </div>
                            )}

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
