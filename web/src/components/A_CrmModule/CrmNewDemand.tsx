/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, useRef } from 'react'
import { AttachFile } from '@mui/icons-material'
import { format } from 'date-fns'
import { setHours, setMinutes } from 'date-fns'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from '@redwoodjs/router'
import Confetti from 'src/components/shared/confetti'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import { demandMode } from 'src/constants/projects'
import {
  addNewUnitDemand,
  addNewUnitModification,
  addPaymentReceivedEntrySup,
  createNewCustomerS,
  steamBankDetailsList,
  steamUsersProjAccessList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import { TextField2 } from 'src/util/formFields/TextField2'
import { EyeIcon } from 'lucide-react'

import { FaTools, FaHammer, FaRegFileAlt, FaArrowUp } from 'react-icons/fa'
import { formatIndianNumber } from 'src/util/formatIndianNumberTextBox'
import { CustomSelect } from 'src/util/formFields/selectBoxField'

const AddNewDemand = ({
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

  const [startDate, setStartDate] = useState(d)

  const [paymentModex, setPaymentModex] = useState('civil_alter')
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

    return
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

    return
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
    console.log('inside supabase support', data.payment_choice_1, data)
    let y = {}
    y = data

    const { mode, comments, dated, purpose, gst } = data
    const amount = data?.amount.replace(/,/g, '')
    const gstV = gst / 100
    const totalWithGst = Number(amount) + Number(amount) * Number(gstV)
    const x = {
      TotalNetSaleValueGsT: totalWithGst,
      TotalSaleValue: amount,
      charges: amount,
      component: { label: mode, value: mode },
      description: comments,
      purpose: purpose,
      type: 'modification',
      gst: { label: gst, value: gst },
      gstValue: Number(amount) * Number(gstV),
      myId: 'uuid',
      units: { label: 'Fixed Cost', value: 'fixedcost' },
    }

    const ps = {
      description: comments,
      purpose: purpose || '',
      outStanding: 0,
      value: totalWithGst,
      elgible: true,
      type: 'modification',
      stage: {
        value: mode,
        label: mode,
      },
      schDate: dated,
      myId: 'uuid',
      leftOver: totalWithGst,
      oldDate: 0,
      percentage: '200000',
      zeroDay: '0',
      elgFrom: dated,
      amt: totalWithGst,
      order: selUnitDetails?.fullPS?.length + 1,
      preCheck: totalWithGst,
    }

    console.log('value is', ps)

    const newConstAdditionalChargesCS =
      selUnitDetails?.constAdditionalChargesCS || []
    newConstAdditionalChargesCS.push(x)
    let existingPs = selUnitDetails?.fullPs
    let newfullPs = selUnitDetails?.fullPs
    if (data?.payment_choice_1 === 'last_milestone') {
      let milestoneSub = newfullPs[newfullPs.length - 1]?.subA || []

      milestoneSub.push(ps)
      console.log(
        'milestone sub is',
        milestoneSub,
        newfullPs[newfullPs.length - 1],
        ps
      )
      newfullPs[newfullPs.length - 1].elgFrom = dated
      newfullPs[newfullPs.length - 1].value =
        newfullPs[newfullPs.length - 1].value + totalWithGst
      newfullPs[newfullPs.length - 1].subA = milestoneSub

      console.log(
        'matter of it',
        newfullPs[newfullPs.length - 1],
        milestoneSub,
        ps
      )
    } else if (data?.payment_choice_1 === 'split_equally') {
      let z = existingPs.filter((item) => {
        return item.elgible == false
      })
      const splittedAmount = Math.floor(totalWithGst / z.length)

      if (z.length > 0) {
        z.map((item) => {
          let subArray = item.subA || []
          subArray.push(ps)
          item.elgFrom = dated
          item.value = item.value + splittedAmount
          item.subA = subArray
        })
      } else {
        console.log('nothing found in subarray')
        newfullPs.push(ps)
      }
    }

    // }
    // const newfullPs = selUnitDetails?.fullPs || []
    // newfullPs.push(ps)

    const dataObj = {
      constAdditionalChargesCS: newConstAdditionalChargesCS,
      fullPs: newfullPs,
      T_balance: selUnitDetails?.T_balance + totalWithGst,
      T_total: selUnitDetails?.T_total + totalWithGst,
      T_D: (selUnitDetails?.T_D || 0) + totalWithGst,
      T_elgible_balance: selUnitDetails?.T_elgible_balance + totalWithGst,
    }
    console.log('value is', amount, totalWithGst)

    addNewUnitModification(
      orgId,
      selUnitDetails,
      selUnitDetails?.id,
      dataObj,
      user.email,
      enqueueSnackbar
    )
    //

    await onSubmitFun(y, resetForm)

    await confettiRef?.current?.fire()

    return

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
    towardsBankDocId: '',
    mode: bankData?.mode || paymentModex,
    purpose: bankData?.purpose || '',
    payto: bankData?.payto || '',
    comments: bankData?.comments || '',
    gst: bankData?.gst || 0,
    dated: bankData?.dated || datee,
    bookingSource: '',
    bookedBy: bankData?.bookedBy || email,
    status: 'review',
    fileUploader: '',
    payment_choice_1: {},
  }

  const submitFormFun = (formik) => {
    formik.handleSubmit()
  }

  const setValueFun = (value) => {
    setPaymentModex(value)
  }

  const setDateFun = (date) => {
    setStartDate(date)
  }
  const bgImgStyle = {
    backgroundImage: '/blob.svg',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
  return (
    <div className="h-screen bg-white">
      <div className="flex items-center justify-center">
        <div
          id="bg-img"
          className="flex h-[664px] w-full flex-col bg-purple-200 h-screen"
          style={bgImgStyle}
        >
          {StatusListA?.length > 0 && (
            <section className="text-white text-right w-full mt-6 pr-5">
              {' '}
              {stepIndx} of {StatusListA?.length} steps
            </section>
          )}
          <div className="relative top-6 mx-auto max-h-[65%]  rounded-xl  ">
            <div className="grid gap-8 grid-cols-1">
              <div className="flex flex-col ">
                <div className="mt-0">
                  <Formik
                    enableReinitialize={false}
                    initialValues={initialState}
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
                                          <div className="inline">
                                            <div className="mt-[4px]">
                                              <label className="text-[24px] font-medium text-[#000000]    mb-1  ">
                                                {title === 'capturePayment'
                                                  ? 'Capture Payment'
                                                  : 'Add Modification'}
                                                <abbr title="required"></abbr>
                                              </label>
                                            </div>

                                            <div>
                                              <p className="text-[#6A6A6A] font-normal  mt-2 text-[12px]">
                                                Created demand will be added to
                                                existing payment schedule of
                                                this unit.
                                              </p>
                                            </div>
                                          </div>
                                        </section>
                                        <section className="flex flex-row justify-between"></section>
                                      </div>
                                    </article>
                                    {!bookingProgress && (
                                      <section>
                                        <div className="flex flex-wrap mt-3">
                                          <div className="justify-center w-full mx-auto">
                                            <p className="text-[#6A6A6A] text-[14px]">
                                              {' '}
                                              Category
                                            </p>
                                          </div>

                                          <div className="w-full mb-8 mt-[12px] flex flex-wrap gap-x-4 gap-y-4">
                                            {demandMode.map((dat, i) => {
                                              return (
                                                <button
                                                  type="button"
                                                  className={`border rounded-xl p-2 px-[10px] w-[100px] cursor-pointer hover:bg-[#F2F2F2] hover:text-[#484848] text-[10px] flex flex-col items-center ${
                                                    paymentModex === dat.value
                                                      ? 'bg-[#F2F2F2] text-[#484848]'
                                                      : ''
                                                  }`}
                                                  key={i}
                                                  onClick={() => {
                                                    setValueFun(dat.value)
                                                    formik.setFieldValue(
                                                      'mode',
                                                      dat.value
                                                    )
                                                  }}
                                                >
                                                  <img
                                                    src={dat.icon}
                                                    alt={dat.label}
                                                    className="h-4 w-4 mb-1"
                                                  />
                                                  {dat.label}
                                                </button>
                                              )
                                            })}
                                          </div>

                                          <div className="w-full lg:w-4/12 pr-3">
                                            <div className="relative w-full mb-5">
                                              <TextField2
                                                label="Amount"
                                                name="amount"
                                                type="text"
                                                value={formik.values.amount.toLocaleString(
                                                  'en-IN'
                                                )}
                                                onChange={(e) => {
                                                  const value =
                                                    e.target.value.replace(
                                                      /,/g,
                                                      ''
                                                    )
                                                  if (!isNaN(value)) {
                                                    const rawValue = Number(
                                                      e.target.value.replace(
                                                        /,/g,
                                                        ''
                                                      )
                                                    )?.toLocaleString('en-IN')

                                                    formik.setFieldValue(
                                                      'amount',
                                                      rawValue
                                                    )
                                                  }
                                                }}
                                              />
                                            </div>
                                          </div>

                                          <div className="w-full lg:w-4/12 px-3">
                                            <div className="relative w-full mb-5  border-[green]">
                                              <TextField2
                                                label="GST %"
                                                name="gst"
                                                type="text"
                                                onChange={(e) => {
                                                  let value = e.target.value
                                                    .replace(/[^0-9.]/g, '')
                                                    .replace(
                                                      /(\..*?)\..*/g,
                                                      '$1'
                                                    )

                                                  if (
                                                    value === '0' ||
                                                    /^0\d/.test(value)
                                                  ) {
                                                    value = value.replace(
                                                      /^0+/,
                                                      ''
                                                    )
                                                  }

                                                  formik.setFieldValue(
                                                    'gst',
                                                    value
                                                  )
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <div className="w-full mt-3 lg:w-4/12 pl-3 ">
                                            <div className="relative w-full mb-5 mt-[-1px] ">
                                              <span className="inline">
                                                <CustomDatePicker
                                                  className="h-8 outline-none border-t-0 border-l-0 border-r-0 border-b border-[#cccccc]  border-solid mt-[-4px]   min-w-[125px]  inline  text-[#0091ae]   lg:w-4/12 w-full flex bg-grey-lighter text-grey-darker border  "
                                                  label="Dated"
                                                  name="dated"
                                                  selected={formik.values.dated}
                                                  onChange={(date) => {
                                                    formik.setFieldValue(
                                                      'dated',
                                                      date.getTime()
                                                    )
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
                                                  dateFormat="MMM dd, yyyy"
                                                />
                                              </span>
                                            </div>
                                          </div>
                                          <div className="w-full  ">
                                            <div className="relative w-full mb-3">
                                              <TextField2
                                                label="Purpose"
                                                name="purpose"
                                                type="text"
                                              />
                                            </div>
                                          </div>
                                          <div className="w-full  ">
                                            <div className="relative w-full mb-3">
                                              <TextField2
                                                label="Comments"
                                                name="comments"
                                                type="text"
                                              />
                                            </div>
                                          </div>

                                          <div className="w-full lg:w-12/12 ">
                                            <div className="relative w-full mb-3 mt-">
                                              <div className="w-full flex flex-col mb-3 mt-2">
                                                <CustomSelect
                                                  name="payment_choice_1"
                                                  label="Payment Choice"
                                                  className="input"
                                                  onChange={(value) => {
                                                    console.log(
                                                      'value is ',
                                                      value.value
                                                    )
                                                    formik.setFieldValue(
                                                      'payment_choice_1',
                                                      value.value
                                                    )
                                                  }}
                                                  value={
                                                    formik.values
                                                      .payment_choice_1
                                                  }
                                                  options={[
                                                    {
                                                      label:
                                                        'At last milestone',
                                                      value: 'last_milestone',
                                                    },
                                                    {
                                                      label:
                                                        'Split equally into available milestone',
                                                      value: 'split_equally',
                                                    },
                                                    {
                                                      label:
                                                        'Immediate milestone',
                                                      value:
                                                        'immediate_milestone',
                                                    },
                                                    {
                                                      label: 'On possession',
                                                      value: 'on_possession',
                                                    },
                                                  ]}
                                                />
                                                <p
                                                  className="text-sm text-red-500 hidden mt-3"
                                                  id="error"
                                                >
                                                  Please fill out this field.
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <label
                                            htmlFor="formFile1"
                                            className="form-label cursor-pointer inline-block mt-2  font-regular text-xs  rounded-2xl  py-1 "
                                          >
                                            <AttachFile
                                              className="w-[12px] h-[6px]  text-[#17B9FF]"
                                              style={{ fontSize: '14px' }}
                                            />

                                            <span className="text-[#17B9FF] border-b border-[#17B9FF]">
                                              Add document
                                            </span>
                                          </label>
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

                                    <div className="text-center space-x-4 mt-6">
                                      <button
                                        className="bg-[#00ADB4] translate-y-1 text-[#fff]  text-[12px]  py-2.5 px-6  font-medium  rounded-full inline-flex items-center"
                                        type="submit"
                                        disabled={loading}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-5 h-5"
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
                                            : 'Add Modification'}{' '}
                                        </span>
                                      </button>
                                    </div>

                                    <Confetti ref={confettiRef} />
                                  </section>
                                </div>
                              </div>
                            </div>
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

export default AddNewDemand
