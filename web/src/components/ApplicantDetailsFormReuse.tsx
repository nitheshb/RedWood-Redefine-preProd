import React, { useEffect, useState } from 'react'

import { ArrowCircleDownIcon, PlusIcon } from '@heroicons/react/solid'
import { InputAdornment, TextField as MuiTextField } from '@mui/material'
import { setHours, setMinutes } from 'date-fns'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { Formik, Form } from 'formik'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import { checkIfLeadAlreadyExists, streamMasters, streamUnitById, updateUnitCustomerDetailsTo } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import { formatIndianNumber } from 'src/util/formatIndianNumberTextBox'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import { PhoneNoField } from 'src/util/formFields/phNoField'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { TextField } from 'src/util/formFields/TextField'
import NoBorderDropDown from './comps/noBorderDropDown'
import { useSnackbar } from 'notistack'
import CrmConfirmationDialog from './A_CrmModule/CrmConfirmationDialog'
import WarningModel from './comps/warnPopUp'
import { use } from 'i18next'


const EmailSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
})
let leadIdGlobal = ''

const EmailForm = ({
  onSubmitFun,
  onSave,
  leadPayload,
  selUnitDetails,
  customerInfo,
  handleClone,
  handleDelete,
  setShowApplicantEdit,
  index,
  applicantDetailsA,
}) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [aadhrUrl1, setAadharUrl1] = useState('')
  const [panCard1, setPanCard1] = useState('')
  const [showLeadLink, setShowLeadLink] = useState(false)
  const [givenPhNo1, setGivenPhNo1] = useState('')
  const [givenPhNo2, setGivenPhNo2] = useState('')
  const [statesListA, setStatesList] = useState([])
  const [fetchedLeadsObj, setFetchedLeadsObj] = useState({})
  const [leadLink, setLeadLink] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  useEffect(() => {
    console.log('custoemr infor is',index,"-->", customerInfo)
    console.log('Customer Name:', customerInfo?.customerName1);

    if(leadPayload){
      setGivenPhNo1(leadPayload?.Mobile || '')
    }
  }, [customerInfo, leadPayload])

  useEffect(() => {
  if(customerInfo?.leadId && customerInfo?.leadId.length >1 ){
    setLeadLink(true)
    setFetchedLeadsObj({id:customerInfo?.leadId})
  }else{
    setLeadLink(false)
    setFetchedLeadsObj({})
  }
}, [customerInfo])

  useEffect(() => {
    const unsubscribe = streamMasters(
      orgId,
      (querySnapshot) => {
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          return x
        })

        console.log('fetched users list is', bankA)
        // step 3: filter and set values to each title
        if (bankA?.length > 0) {
          const dA = bankA.filter((item) => item.title == 'State')

          setStatesList(
            dA.sort((a, b) => {
              return a.order - b.order
            })
          )
        }
      },
      () => {}
    )

    return unsubscribe
  }, [])
  const isValidDate = (time) => {
    return !isNaN(new Date(time).getTime())
  }
  const isValidPAN = (value) => {
    const regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
    console.log('match value is ', value, value === '', value == undefined)
    if (value === '' || value == undefined) {
      return true
    }
    return regex.test(value)
  }
  const isValidAadhar = (value) => {
    // Aadhar card format: 12 digits
    const regex = /^\d{12}$/
    if (value === '' || value == undefined) {
      return true
    }
    return regex.test(value)
  }
  const validateSchema = Yup.object({
    customerName1: Yup.string().required('Required'),
    panNo1: Yup.string().test('pan', 'Invalid PAN card number', isValidPAN),
    aadharNo1: Yup.string().test(
      'aadhar',
      'Invalid Aadhar card number',
      isValidAadhar
    ),

  })
  const uid = selUnitDetails?.uid || selUnitDetails?.id
  const datee = new Date().getTime()
  const initialState = {
    customerName1:
      customerInfo?.customerName1 ||
      '',

    relation1:
      selUnitDetails?.customerDetailsObj?.relation1 ||
      customerInfo?.relation1 || {
        label: 'S/O',
        value: 'S/O',
      },



    co_Name1:
      selUnitDetails?.customerDetailsObj?.co_Name1 ||
      customerInfo?.co_Name1 ||
      '',

    leadPhNo:
leadPayload?.Mobile ||
      '',
    phoneNo1:
      selUnitDetails?.customerDetailsObj?.phoneNo1 ||
      customerInfo?.phoneNo1 ||
      '',
    phoneNo3:
      selUnitDetails?.customerDetailsObj?.phoneNo3 ||
      customerInfo?.phoneNo3 ||
      '',


    email1:
      selUnitDetails?.customerDetailsObj?.email1 ||
      customerInfo?.email1 ||
      '',

    dob1: isValidDate(customerInfo?.dob1 )
      ? customerInfo?.dob1
      : isValidDate(leadPayload?.customerDetailsObj?.dob1) ? leadPayload?.customerDetailsObj?.dob1 : datee,

    marital1:
      selUnitDetails?.customerDetailsObj?.marital1 ||
      customerInfo?.marital1 || {
        label: 'Single',
        value: 'Single',
      },

    address1:
      selUnitDetails?.customerDetailsObj?.address1 ||
      customerInfo?.address1 ||
      '',

    city1:
      selUnitDetails?.customerDetailsObj?.city1 ||
      customerInfo?.city1 ||
      '',

    countryName1:
      selUnitDetails?.customerDetailsObj?.countryName1 ||
      customerInfo?.countryName1 ||
      '',

    pincode1:
      selUnitDetails?.customerDetailsObj?.pincode1 ||
      customerInfo?.pincode1 ||
      '',

    countryCode1:
      selUnitDetails?.customerDetailsObj?.countryCode1 ||
      customerInfo?.countryCode1 ||
      '',


      address2p:
      selUnitDetails?.customerDetailsObj?.address2p ||
      customerInfo?.address2p ||
      '',




    city2p:
    selUnitDetails?.customerDetailsObj?.city2p ||
    customerInfo?.city2p ||
    '',

  countryName2p:
    selUnitDetails?.customerDetailsObj?.countryName2p ||
    customerInfo?.countryName2p ||
    '',

  pincode2p:
    selUnitDetails?.customerDetailsObj?.pincode2p ||
    customerInfo?.pincode2p ||
    '',

  countryCode2p:
    selUnitDetails?.customerDetailsObj?.countryCode2p ||
    customerInfo?.countryCode2p ||
    '',


    state1:
      selUnitDetails?.customerDetailsObj?.state1 ||
      customerInfo?.state1 || {
        value: 'KA',
        label: 'Karnataka',
      },

      state2p:
      selUnitDetails?.customerDetailsObj?.state2p ||
      customerInfo?.state2p || {
        value: 'KA',
        label: 'Karnataka',
      },


    panNo1:
      selUnitDetails?.customerDetailsObj?.panNo1 ||
      customerInfo?.panNo1 ||
      '',

    panDocUrl1:
      selUnitDetails?.customerDetailsObj?.panDocUrl1 ||
      customerInfo?.panDocUrl1 ||
      '',


    aadharNo1:
      selUnitDetails?.customerDetailsObj?.aadharNo1 ||
      customerInfo?.aadharNo1 ||
      '',

    aadharUrl1:
      selUnitDetails?.customerDetailsObj?.aadharUrl1 ||
      customerInfo?.aadharUrl1 ||
      '',

    occupation1:
      selUnitDetails?.customerDetailsObj?.occupation1 ||
      customerInfo?.occupation1 ||
      '',

    companyName1:
      selUnitDetails?.customerDetailsObj?.companyName1 ||
      customerInfo?.companyName1 ||
      '',
    designation1:
      selUnitDetails?.customerDetailsObj?.designation1 ||
      customerInfo?.designation1 ||
      '',

    annualIncome1:
      selUnitDetails?.customerDetailsObj?.annualIncome1 ||
      customerInfo?.annualIncome1  ||
      '',


    aggrementAddress:
      leadPayload?.aggrementDetailsObj?.aggrementAddress ||
      customerInfo?.aggrementAddress ||
      '',
    industry: leadPayload?.industry || '',
    designation: leadPayload?.designation || '',
    annualIncome: leadPayload?.annualIncome || '',
    leadSource:
      leadPayload?.Status === 'booked'
        ? leadPayload[`${uid}_otherInfo`]?.leadSource
        : '',
    sourceOfPay:
      leadPayload?.Status === 'booked'
        ? leadPayload[`${uid}_otherInfo`]?.sourceOfPay
        : customerInfo?.aggrementAddress || '',
    purpose:
      leadPayload?.Status === 'booked'
        ? leadPayload[`${uid}_otherInfo`]?.purpose
        : '',

    bookingSource: leadPayload?.bookingSource || '',
    bookedBy: leadPayload?.bookedBy || leadPayload?.assignedToObj?.label || '',
    purchasePurpose: leadPayload?.purchasePurpose || '',
  }
  const customPhoneNoFieldStyles = {
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    margin: '0',
    padding: '0',
    paddingLeft: '0.5rem',
  }
  const downloadImage = (imageUrl, filename) => {
    console.error('downloading image:', imageUrl)
    fetch(imageUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => {
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'download';

        link.click();

        URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
        console.error('Download failed:', error);
    });
    return;
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url


        link.setAttribute('download', 'filename.pdf')
        document.body.appendChild(link)
        console.log('fetcher url ', filename)
        link.click()

        link.parentNode.removeChild(link)


      })
      .catch((error) => {
        console.error('Error downloading image:', error)
      })
  }
  const [income, setIncome] = useState(0)


  const handleFileUploadFun = async (file, type, formik) => {
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

          file.isUploading = false
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            file.url = url
            if (type === 'panCard1') {
              formik.setFieldValue('panDocUrl1', url)
            } else if (type === 'panCard2') {
              formik.setFieldValue('panDocUrl2', url)
            } else if (type === 'aadharNo1Url') {
              formik.setFieldValue('aadharUrl1', url)
            } else if (type === 'aadharNo2Url') {
              formik.setFieldValue('aadharUrl2', url)
            }
            console.log(
              'file url i s',
              url,
              'dd',
              type,
              type === 'aadharNo1Url',
              aadhrUrl1
            )
            return url
          })
        }
      )
    } catch (error) {
      console.log('upload error is ', error)
    }
  }
 const  searchPhoneNoFun= (providedPhNo1) => {
    console.log('givenPhNo1 is ', providedPhNo1)
    setGivenPhNo1(providedPhNo1)

  }
  const searchFun = async (formik) => {
    const foundLength = await checkIfLeadAlreadyExists(
      `${orgId}_leads`,
      givenPhNo1
    )
    if (foundLength?.length > 0) {
      console.log('foundLength', foundLength)

      setFetchedLeadsObj(foundLength[0])
       leadIdGlobal=foundLength[0].id
      setLeadLink(true)
      const x = foundLength[0]
      if(x?.Name){
      console.log('setcustomerName', x?.Name)

      formik.setFieldValue('customerName1', x?.Name)
      }
      console.log('customerName1', foundLength, x)
      if(x?.Mobile){
        formik.setFieldValue('customerName1', x?.Name)
      formik.setFieldValue('phoneNo1', x?.Mobile)}
      if(x?.Email){
        formik.setFieldValue('customerName1', x?.Name)
      formik.setFieldValue('email1', x?.Email)
      }


      setFetchedLeadsObj(foundLength[0])

      setLeadLink(true)
    }

    }

  const replaceFormData = async (formik) => {
    searchFun(formik)
  }







  return (
    <>
    <Formik
      enableReinitialize={true}
      initialValues={initialState}
      validationSchema={validateSchema}
      onSubmit={(values, { resetForm }) => {
        console.log('submitted ==>', income)

      const fullData = values
      console.log('testing link',leadLink,fetchedLeadsObj )

        fullData.leadId = fetchedLeadsObj?.id  ||leadIdGlobal|| '';
        onSubmitFun(fullData, resetForm)
      }}
    >
      {(formik) => (
        <Form className="space-y-4">
          <div>

            <section
              className="  bg-[#fff] rounded-[20px] border pb-4 "
              style={{ boxShadow: '0 1px 12px #f2f2f2' }}
            >
              <div
                className="w-full bg-[#EDEDED] flex flex-row justify-between mb-2 p-4 bg-white-100 rounded-t-[20px]"
              >
                <section className="flex flex-row">
                  <div className="w-full flex flex-col">
                    <div className="  flex flex-row gap-2 ">
                      <div>
                        <section className="flex flex-row">
                          <h6 className="text-black text-[14px] mt-[2px] mb- font-bold">
                            {index=== 0 ?'Primary Applicant' : `Applicant Details-${index+1}`}
                          </h6>

                        </section>
                        <div className="w-[455.80px] opacity-50 text-blue-950  text-[12px] font-normal ">
                          These details will be used for registration.So be
                          careful what you record.
                        </div>

                      </div>

                      <div></div>
                    </div>


                  </div>
                </section>
              </div>

              <section className="mt-1 px-4 mx-4 rounded-lg bg-white border border-gray-200 shadow inset-shadow-2xs">
                <section className="flex flex-row  pt-2 mt-1 ">
                  {/* <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div> */}
                  <span className=" leading-[15px] flex flex-row   justify-between w-full">
                    <label className="font-semibold text-[#053219]    text-[14px] leading-[15px] mb-1  ">
                      Personal Details
                      <abbr title="required"></abbr>
                      {/* <div className="border-b-2 border-[#8B5CF6] mt-[1px]"></div> */}
                      <div className="border-t-4 rounded-xl w-16 mt-1 mb-3 border-[#8b5cf6]"></div>

                    </label>





                    <div className=' rounded-lg'>
                    {!leadLink && <div
                            className="  text-[10px] cursor-pointer  bg-[#F5F5F5] border border-gray-300 p-1 px-2 rounded-lg  text-[#7A7A7A] "
                            onClick={() => setShowLeadLink(!showLeadLink)}
                          >
                            Auto fill & link with lead
                          </div>}

                          {leadLink && <div
                            className=" ml- text-[10px] cursor-pointer  rounded-full px-2  text-orange-500 "
                            onClick={() => setShowLeadLink(!showLeadLink)}
                          >
                            Applicant Linked to Lead
                          </div>}
                    </div>

                  </span>
                </section>

                {showLeadLink && (
                <div className="bg-[#DCD7FF] rounded-xl p-2 mt-2 flex-col">
                  <label className='text-[14px] '>Auto fill from matched Leads Phone No </label>
                  <section className='flex flex-row '>
                  <div className="w-full flex flex-row lg:w-3/12 px- mt-2">
                    <div className="relative w-full ">
                      <PhoneNoField
                        label="Lead Phone No"
                        name="leadPhNo1"
                        value={givenPhNo1}
                        onChange={(value) => {
                          console.log('value is ', value.value)

                          searchPhoneNoFun(value.value)
                        }}
                        options={{}}
                        labelSize="text-[11px]"
                        textSize="text-[12px]"
                        txtPad="px-1"
                        className="text-[10px]"
                      />
                    </div>

                  </div>
                  {givenPhNo1.length ===10 &&<button className='ml-2 mt-5 text-[12px] underline' onClick={()=> {
                    replaceFormData(formik)
                    }}>Replace existing details</button>}
                  </section>
                </div>
              )}
                {/* row 1 */}
                <div className="md:flex flex-row md:space-x-4 w-full text-sm mt-4 ">
                  <div className="space-y-2 w-full text-xs mt-">
                    <TextField
                      label="Customer Name*"
                      name="customerName1"
                      type="text"
                      labelClassName="text-gray-500"
                       />
                  </div>

                  <div className=" space-y-2 w-full text-xs mt-">
                    <div className="relative ">
                      <label className="label font-regular text-[12px] block mb-1 mt- text-gray-500">
                        Son/Daughter/Wife of{' '}
                      </label>
                      <MuiTextField
                        id="area"
                        className={`w-full bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 mt-1 p-0`}
                        size="small"
                        InputProps={{
                          style: {
                            height: '2rem',
                            paddingLeft: '7px',
                          },
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              style={{ height: '32px' }}
                            >
                              <NoBorderDropDown
                                name="relation1"
                                label=""
                                className="input  min-w-[85px] h-[32px]"
                                onChange={(value) => {
                                  formik.setFieldValue('relation1', value)
                                }}
                                value={formik.values.relation1.value}
                                options={[
                                  {
                                    label: 'D/O',
                                    value: 'D/O',
                                  },
                                  {
                                    label: 'S/O',
                                    value: 'S/O',
                                  },
                                  {
                                    label: 'W/O',
                                    value: 'W/O',
                                  },
                                  {
                                    label: 'C/O',
                                    value: 'C/O',
                                  },
                                ]}
                              />
                            </InputAdornment>
                          ),
                        }}
                        label=""
                        name="co_Name1"
                        type="text"
                        value={formik.values.co_Name1}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/* row 2 */}
                <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-2 ">
                  <div className="space-y-2 w-full text-xs mt-">
                    <section className="">
                      <div className="w-full flex flex-col">
                        <CustomSelect
                          name="MaritualStatus"
                          label="Status"
                          labelClassName="text-black"

                          className="input"
                          onChange={(value) => {
                            formik.setFieldValue('marital1', value)
                          }}
                          value={formik?.values?.marital1.value}
                          options={[
                            {
                              label: 'Divorced',
                              value: 'Divorced',
                            },
                            {
                              label: 'Married',
                              value: 'Married',
                            },
                            {
                              label: 'Single',
                              value: 'Single',
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
                    </section>
                  </div>

                  <div className="space-y-2 w-full text-xs mt-">
                    <section className="">
                      <div className="w-full mt-5 flex flex-col">

                      <CustomDatePicker
                          className="h-8 outline-none border-radius rounded-md  border border-[#cccccc]  px-2  text-sm w-full  flex bg-grey-lighter text-grey-darker  "
                          label="Dated"
                          name="dob1"
                          selected={formik.values.dob1}
                          onChange={(date) => {
                            formik.setFieldValue('dob1', date.getTime())
                          }}
                          timeFormat="HH:mm"
                          injectTimes={[
                            setHours(setMinutes(d, 1), 0),
                            setHours(setMinutes(d, 5), 12),
                            setHours(setMinutes(d, 59), 23),
                          ]}
                          dateFormat="MMM dd, yyyy"
                        />


                      </div>
                    </section>
                  </div>


                </div>

                {/* row 3 */}
                <div className="flex flex-row justify-between pt-2 mb-2">
                  <section className="w-12/12 w-full">
                    <label className="label font-regular text-[12px] block mb-1 mt-1 text-gray-500">
                      PAN No{' '}
                    </label>
                    <MuiTextField
                      id="area"
                      className={`w-full bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 mt-1 p-0`}
                      size="small"
                      InputProps={{
                        style: {
                          height: '2rem',
                          paddingLeft: '7px',
                        },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ height: '32px' }}
                          >
                            <div className="flex   flex-row-reverse">
                              <label
                                htmlFor="formFile3"
                                className="form-label cursor-pointer inline-block   font-regular text-xs  rounded-2xl px-1 py-1  "
                              >
                                {`${
                                  formik.values.panDocUrl1 === '' ||
                                  formik.values.panDocUrl1 == undefined
                                    ? 'Upload'
                                    : 'Download'
                                }`}
                              </label>
                              {formik.values.panDocUrl1 != '' && (
                                <button
                                type="button"
                                  onClick={() =>
                                    downloadImage(
                                      formik.values.panDocUrl1,
                                      'pancard1'
                                    )
                                  }
                                >
                                  {' '}
                                  {formik.values.panDocUrl1 === '' ||
                                  formik.values.panDocUrl1 == undefined ? (
                                    <PlusIcon className="w-4 h-4 cursor-pointer ml-1  mb-[3px] mr-2 inline-block text-gray-400 border rounded-[16px] " />
                                  ) : (
                                    <ArrowCircleDownIcon className="w-4 h-4 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                  )}
                                </button>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                id="formFile3"
                                onChange={async (e) => {
                                  await handleFileUploadFun(
                                    e.target.files[0],
                                    'panCard1',
                                    formik
                                  )
                                }}
                              />
                            </div>
                          </InputAdornment>
                        ),
                      }}
                      label=""
                      name="panNo1"
                      type="text"
                      value={formik.values.panNo1}

                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.toUpperCase();
                        value = value.replace(/[^A-Z0-9]/g, '');


                        const part1 = value.slice(0, 5);
                        const part2 = value.slice(5, 9);
                        const part3 = value.slice(9, 10);


                        value = part1 + part2 + part3;
                        formik.setFieldValue('panNo1', value);
                        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                        if (value && !panRegex.test(value)) {
                          formik.setFieldError('panNo1', 'PAN must be in the format: XXXXX1234X');
                        } else {
                          formik.setFieldError('panNo1', '');
                        }
                      }}





                    />
                                  {formik.errors.panNo1 && formik.touched.panNo1 && (
        <div className="text-red-500 text-xs ml-2">{formik.errors.panNo1}</div>
      )}
                  </section>
                  <section className="w-full ml-4">
                    <label className="label font-regular text-[12px] block mb-1 mt-1 text-gray-500">
                      Aadhar No{' '}
                    </label>
                    <MuiTextField
                      id="area"
                      className={`w-full bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 mt-1 p-0`}
                      size="small"
                      InputProps={{
                        style: {
                          height: '2rem',
                          paddingLeft: '7px',
                        },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ height: '32px' }}
                          >
                            <div className=" flex flex-row-reverse">
                              <label
                                htmlFor="formFile4"
                                className="form-label cursor-pointer inline-block font-regular text-xs  rounded-2xl px-1 py-1"
                              >
                                {`${
                                  formik.values.aadharUrl1 === '' ||
                                  formik.values.aadharUrl1 == undefined
                                    ? 'Upload'
                                    : 'Download'
                                }`}
                              </label>
                              {formik.values.aadharUrl1 != '' && (
                                <button
                                  onClick={() =>
                                    downloadImage(
                                      formik.values.aadharUrl1,
                                      'Aadhar1'
                                    )
                                  }
                                >
                                  {' '}
                                  {formik.values.aadharUrl1 === '' ||
                                  formik.values.aadharUrl1 == undefined ? (
                                    <PlusIcon className="w-4 h-4 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 border rounded-[16px] " />
                                  ) : (
                                    <ArrowCircleDownIcon className="w-4 h-4 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                                  )}
                                </button>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                id="formFile4"
                                onChange={(e) => {
                                  console.log('iwas clicked aadharno 2')
                                  handleFileUploadFun(
                                    e.target.files[0],
                                    'aadharNo1Url',
                                    formik
                                  )
                                }}
                              />
                            </div>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 12,
                      }}
                      label=""
                      name="aadharNo1"
                      type="text"
                      value={formik.values.aadharNo1}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 12) {
                          formik.setFieldValue('aadharNo1', value);
                        }
                      }}

                    />
                      {formik.errors.aadharNo1 && formik.touched.aadharNo1 && (
        <div className="text-red-500 text-xs ml-2">{formik.errors.aadharNo1}</div>
      )}
                  </section>
                </div>
              </section>
              {/* section-2 */}
              <section className="mt-2 px-4 mx-4 rounded-lg bg-white border border-gray-200 shadow inset-shadow-2xs pb-2">
                <section className="flex flex-row  pt-2 mt-1 ">
                  {/* <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div> */}
                  <span className=" leading-[15px] ">
                    <label className="font-semibold text-[#053219]  text-[14px] leading-[15px] mb-1  ">
                      Contact Details
                      <abbr title="required"></abbr>
                      {/* <div className="border-b-2 border-[#8B5CF6] mt-[1px]"></div> */}

                      <div className="border-t-4 rounded-xl w-16 mt-1 mb-3 border-[#8b5cf6]"></div>

                    </label>
                  </span>
                </section>
                {/* row 1 */}
                <div className="w-full flex-col lg:w-12/12 mt-2">

                <div className='flex'>

                  <div className="w-full  mb-2 ">
                    <div className="relative w-full mt-2">
                      <div className="space-y-1 w-full text-xs">
                        <label htmlFor="countryCode" className="inline-block text-gray-500">
                        Primary Phone No
                        </label>

                        <div className="flex border mb-6 mt-0 border-[#cccccc] rounded-md">
                          <div className="inline-block">
                            <input
                              type="text"
                              id="countryCode1"
                              name="countryCode1"
                              value={formik.values.countryCode1}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  'countryCode1',
                                  e.target.value
                                )
                              }
                              onBlur={formik.handleBlur}
                              className="w-11 bg-grey-lighter text-grey-darker h-7 px-2 border-none rounded-l-md focus:outline-none"
                              placeholder="+91"
                              style={{
                                margin: '0',
                                padding: '0',
                                paddingLeft: '0.5rem', // Add padding-left
                              }}
                            />
                            {formik.errors.countryCode1 &&
                              formik.touched.countryCode1 && (
                                <div className="text-red-500 text-xs ml-2">
                                  {formik.errors.countryCode1}
                                </div>
                              )}
                          </div>

                          <div className="border-l border-gray-400 mt-1 mb-1"></div>

                          <PhoneNoField
                            name="phoneNo1"
                            value={formik.values.phoneNo1}
                            customStyles={customPhoneNoFieldStyles}
                            onChange={(value) => {
                              formik.setFieldValue('phoneNo1', value.value)
                            }}
                            options={{}}
                            labelSize="text-[11px]"
                            textSize="text-[12px]"
                            txtPad="px-2"
                            className="text-[10px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>



                  <div className="w-full  pl-4">
                    <div className="relative w-full mt-2">
                      <div className="space-y-1 w-full text-xs">
                        <label htmlFor="countryCode" className="inline-block text-gray-500">
                        Secondary Phone No
                        </label>

                        <div className="flex border mb-6 mt-0 border-[#cccccc] rounded-md">
                          <div className="inline-block">
                            <input
                              type="text"
                              id="countryCode3"
                              name="countryCode3"
                              value={formik.values.countryCode3}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  'countryCode3',
                                  e.target.value
                                )
                              }
                              onBlur={formik.handleBlur}
                              className="w-11 bg-grey-lighter text-grey-darker h-7 px-2 border-none rounded-l-md focus:outline-none"
                              placeholder="+91"
                            />
                            {formik.errors.countryCode3 &&
                              formik.touched.countryCode3 && (
                                <div className="text-red-500 text-xs ml-2">
                                  {formik.errors.countryCode3}
                                </div>
                              )}
                          </div>

                          <div className="border-l border-gray-400 mt-1 mb-1"></div>

                          <PhoneNoField
                            name="phoneNo3"
                            value={formik.values.phoneNo3}
                            customStyles={customPhoneNoFieldStyles}
                            onChange={(value) => {
                              formik.setFieldValue('phoneNo3', value.value)
                            }}
                            options={{}}
                            labelSize="text-[11px]"
                            textSize="text-[12px]"
                            txtPad="px-1"
                            className="text-[10px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  </div>






                  <div className="w-full ">
                    <div className="relative w-full mt-2">
                      <TextField   label="Email" labelClassName="text-[#000000]" name="email1" type="text" />
                    </div>
                  </div>



                </div>
              </section>

                            {/* section-3-B */}
                            <section className="mt-2 px-4 mx-4 py-2 rounded-lg bg-white border-gray-200 shadow inset-shadow-2xs shadow">

                              <section className='flex justify-between'>

                              <section className="flex flex-row  mt-1 ">
                  {/* <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div> */}
                  <span className=" leading-[15px] ">
                    <label className="font-semibold text-[#053219]  text-[14px] leading-[15px] mb-1  ">
                    Current Address
                      <abbr title="required"></abbr>
                      {/* <div className="border-b-2 border-[#8B5CF6] mt-[1px]"></div> */}
                      <div className="border-t-4 rounded-xl w-16 mt-1 mb-3 border-[#8b5cf6]"></div>

                    </label>
                  </span>
                </section>

                {/* Add Checkbox Here */}


                {/* <section>
                {index > 0 && (
  <div className="flex items-center mt-2">
    <input
      type="checkbox"
      id="copyAddress"
      name="copyAddress"
      onChange={(e) => {
        if (e.target.checked) {
          formik.setFieldValue('address2p', applicantDetailsA[0]?.address2p || '');
          formik.setFieldValue('pincode2p', applicantDetailsA[0]?.pincode2p || '');
          formik.setFieldValue('city2p', applicantDetailsA[0]?.city2p || '');
          formik.setFieldValue('state2p', applicantDetailsA[0]?.state2p || '');
          formik.setFieldValue('countryName2p', applicantDetailsA[0]?.countryName2p || '');

          formik.setFieldValue('address1', applicantDetailsA[0]?.address1 || '');
          formik.setFieldValue('pincode1', applicantDetailsA[0]?.pincode1 || '');
          formik.setFieldValue('city1', applicantDetailsA[0]?.city1 || '');
          formik.setFieldValue('state1', applicantDetailsA[0]?.state1 || '');
          formik.setFieldValue('countryName1', applicantDetailsA[0]?.countryName1 || '');
        }
      }}
    />
    <label htmlFor="copyAddress" className="ml-2 text-sm text-gray-700">
      Copy Current & Permanent Address from Applicant 1
    </label>
  </div>
)}

                </section> */}


                              </section>







                {/* row 1 */}
                <div className="w-full lg:w-12/12 ">
                  <div className="relative w-full mb-3 mt-2">
                    <TextField label="Address"    labelClassName="text-gray-500" name="address2p" type="text" />
                  </div>
                </div>
                <div className="w-full  flex flex-row lg:w-12/12 mt-1">
                <div className="w-full lg:w-12/12 ">
                    {/* Pincode 2 */}
                    <div className="relative w-full mb-3 ">
                      <TextField label="Pincode"   labelClassName="text-gray-500" name="pincode2p" type="text"
                      onChange={(e)=>{
                        formik.setFieldValue('pincode2p', e.target.value)
                        if(e.target.value.length == 6){

                          fetch(
                            `https://api.postalpincode.in/pincode/${e.target.value}`)
                          .then(res => res.json())
                          .then(data => {
                            console.log('data is', data)
                            if(data.length > 0){
                              formik.setFieldValue('city2p', data[0]?.PostOffice[0]?.Block)
                              if(data[0]?.PostOffice[0]?.State){
                                let fil=  statesListA.filter((d)=> d.label == data[0]?.PostOffice[0]?.State)
                                formik.setFieldValue('state2p', fil[0].value)}
                              formik.setFieldValue('countryName2p', data[0]?.PostOffice[0]?.Country)
                            }
                          })
                        }
      }}/>
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 px- pl-4">
                    <div className="relative w-full mb-3 mt-">
                      <TextField label="City" labelClassName="text-gray-500" name="city2p" type="text" />
                    </div>
                  </div>

                </div>

                <div className="w-full flex flex-row lg:w-12/12 mt-">
                <div className="w-full lg:w-12/12 ">
                    <div className="relative w-full mb-3 mt-">
                      <div className="w-full flex flex-col mb-3 mt-2">
                        <CustomSelect
                          name="state2p"
                          label="State"
                          className="input"
                          labelClassName="text-gray-500"
                          onChange={(value) => {
                            console.log('value is ', value.value)
                            formik.setFieldValue('state2p', value.value)
                          }}
                          value={formik.values.state2p}
                          options={statesListA}
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
                  <div className="w-full lg:w-12/12  pl-4">
                    {/* Country Name 2 */}
                    <div className="relative w-full mb-3 mt-2">
                      <TextField
                        label="Country Name"
                        name="countryName2p"
                        type="text"
                        labelClassName="text-gray-500"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                          formik.setFieldValue('countryName2p', value);
                        }}
                      />
                    </div>
                  </div>

                </div>
              </section>





              {/* section-3 */}
              <section className="mt-2 px-4 mx-4 py-2 rounded-lg bg-white border-gray-200 shadow inset-shadow-2xs shadow">

                <section className='flex justify-between'>
                <section className="flex flex-row  mt-1 ">
                  {/* <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div> */}
                  <span className=" leading-[15px] ">
                    <label className="font-semibold text-[#053219]  text-[14px] leading-[15px] mb-1  ">
                    Permanent Address
                      <abbr title="required"></abbr>
                      {/* <div className="border-b-2 border-[#8B5CF6] mt-[1px]"></div> */}
                      <div className="border-t-4 rounded-xl w-16 mt-1 mb-3 border-[#8b5cf6]"></div>

                    </label>
                  </span>
                </section>


                <section>
<div className="flex items-center mt-2">

<label htmlFor="copyCurrentToPermanent" className="ml-2 mr-2 text-sm text-[#B3B3B3]">
  same as current address
  </label>
  <input
    type="checkbox"
    id="copyCurrentToPermanent"
    name="copyCurrentToPermanent"
    onChange={(e) => {
      if (e.target.checked) {
        formik.setFieldValue('address1', formik.values.address2p || '');
        formik.setFieldValue('pincode1', formik.values.pincode2p || '');
        formik.setFieldValue('city1', formik.values.city2p || '');
        formik.setFieldValue('state1', formik.values.state2p || '');
        formik.setFieldValue('countryName1', formik.values.countryName2p || '');
      }
    }}
  />

</div>
                </section>

                </section>




                {/* row 1 */}
                <div className="w-full lg:w-12/12 ">
                  <div className="relative w-full mb-3 mt-2">
                    <TextField label="Address"    labelClassName="text-[#000000]" name="address1" type="text" />
                  </div>
                </div>
                <div className="w-full  flex flex-row lg:w-12/12 mt-1">
                <div className="w-full lg:w-12/12 ">
                    {/* Pincode 2 */}
                    <div className="relative w-full mb-3 ">
                      <TextField label="Pincode"   labelClassName="text-[#000000]" name="pincode1" type="text"
                      onChange={(e)=>{
                        formik.setFieldValue('pincode1', e.target.value)
                        if(e.target.value.length == 6){

                          fetch(
                            `https://api.postalpincode.in/pincode/${e.target.value}`)
                          .then(res => res.json())
                          .then(data => {
                            console.log('data is', data)
                            if(data.length > 0){
                              formik.setFieldValue('city1', data[0]?.PostOffice[0]?.Block)
                              if(data[0]?.PostOffice[0]?.State){
                                let fil=  statesListA.filter((d)=> d.label == data[0]?.PostOffice[0]?.State)
                                formik.setFieldValue('state1', fil[0].value)}
                              formik.setFieldValue('countryName1', data[0]?.PostOffice[0]?.Country)
                            }
                          })
                        }
      }}/>
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 px- pl-4">
                    <div className="relative w-full mb-3 mt-">
                      <TextField label="City" labelClassName="text-gray-500" name="city1" type="text" />
                    </div>
                  </div>

                </div>

                <div className="w-full flex flex-row lg:w-12/12 mt-">
                <div className="w-full lg:w-12/12 ">
                    <div className="relative w-full mb-3 mt-">
                      <div className="w-full flex flex-col mb-3 mt-2">
                        <CustomSelect
                          name="state1"
                          label="State"
                          className="input"
                          labelClassName="text-gray-500"
                          onChange={(value) => {
                            console.log('value is ', value.value)
                            formik.setFieldValue('state1', value.value)
                          }}
                          value={formik.values.state1}
                          options={statesListA}
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
                  <div className="w-full lg:w-12/12  pl-4">
                    {/* Country Name 2 */}
                    <div className="relative w-full mb-3 mt-2">
                      <TextField
                        label="Country Name"
                        name="countryName1"
                        type="text"
                        labelClassName="text-gray-500"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                          formik.setFieldValue('countryName1', value);
                        }}
                      />
                    </div>
                  </div>

                </div>
              </section>

              {/* section-4 */}
              <section className="mt-2 px-4 mx-4 py-2 rounded-lg bg-white border-gray-200 shadow inset-shadow-2xs shadow">
                <section className="flex flex-row  px- mt-1 ">
                  {/* <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div> */}
                  <span className=" leading-[15px] ">
                    <label className="font-semibold text-[#053219]  text-[14px] leading-[15px] mb-1  ">
                      Other Details
                      <abbr title="required"></abbr>
                      {/* <div className="border-b-2 border-[#8B5CF6] mt-[1px]"></div> */}
                      <div className="border-t-4 rounded-xl w-16 mt-1 mb-3 border-[#8b5cf6]"></div>

                    </label>
                  </span>
                </section>



                {/* row 1 */}
                <div className="w-full  flex flex-row lg:w-12/12 ">
                  <div className="w-full lg:w-12/12 px- ">
                    <div className="relative w-full mb-3 mt-[10px]">
                      <TextField
                        label="Occupation"
                        name="occupation1"
                        type="text"
                        labelClassName="text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 pl-4">
                    <div className="relative w-full mb-3 mt-2">
                      <TextField
                        label="Annual Income"
                        name="annualIncome1"
                        type="text"
                        labelClassName="text-gray-500"
                        value={
                        formik.values.annualIncome1.toLocaleString('en-IN')
                        }
                        onChange={(e) =>{
                          const rawValue = Number(e.target.value.replace(/,/g, ''))?.toLocaleString('en-IN')


                          formik.setFieldValue('annualIncome1', rawValue)
                        }
                        }
                      />
                    </div>
                  </div>
                  <WarningModel
            type={'Danger'}
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
            proceedAction={handleDelete}
            title={'Are you sure you want to delete this user?'}
            subtext={
              '   Selected data will be permanently removed. This action cannot be undone.'
            }
            actionBtnTxt={'Delete'}
          />
                </div>
              </section>
            </section>
          </div>
          <div className=" flex flex-row-reverse">
            <button   type="submit" className="mb-2 md:mb-0 bg-[#8b5cf6] px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 ">Save box</button>

      <button onClick={handleClone} className="mb-4  md:mb-0 bg-[#8b5cf6] px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 mb-4 mr-2">Save & Add New Applicant</button>
      {index !=0 && <button onClick={()=>setIsDialogOpen(true)} className="mb-4  md:mb-0 bg-[#8b5cf6] px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 mb-4 mr-2">Delete</button>}








          </div>
        </Form>
      )}
    </Formik>
      {isDialogOpen && (
        <CrmConfirmationDialog
          onConfirm={handleDelete}
          onCancel={()=>setIsDialogOpen(false)}
        />
      )}
      </>
  )

}

// export default EmailForm

const CloneableEmailForm = ({ selUnitDetails, customerInfo, setCustomerInfo, leadPayload, }) => {
  const [forms, setForms] = useState([{ id: 1 }])
  const [savedForms, setSavedForms] = useState({})
  const [applicantDetailsA, setApplicantDetailsA] = useState([])
  const [streamUnitDetails, setStreamUnitDetails] = useState({})


  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    streamUnitDataFun()
  }, [])
  useEffect(() => {
    streamUnitDataFun()
  }, [selUnitDetails])
  useEffect(() => {
    console.log('leads payload is ', leadPayload)
  },[])
  useEffect(() => {
    console.log('customer info selUnitDetails', selUnitDetails, leadPayload)
    const custDetailsA = []
    if (streamUnitDetails?.customerDetailsObj) {
      custDetailsA.push(streamUnitDetails?.customerDetailsObj)
    }
    if (streamUnitDetails?.secondaryCustomerDetailsObj) {
      custDetailsA.push(streamUnitDetails?.secondaryCustomerDetailsObj)
    }
    setApplicantDetailsA(custDetailsA)
    console.log('customer info selUnitDetails', applicantDetailsA, streamUnitDetails?.secondaryCustomerDetailsObj)
  }, [streamUnitDetails,customerInfo])

  const streamUnitDataFun = () => {
    if(selUnitDetails?.id){
    const { id } = selUnitDetails
    console.log('hello', selUnitDetails)
    const z = streamUnitById(
      orgId,
      (querySnapshot) => {
        const SnapData = querySnapshot.data()
        SnapData.id = id
        console.log('hello', SnapData)
        setStreamUnitDetails(SnapData)
      },
      { uid: id },
      () => {
        console.log('error')
      }
    )
    }
  }
  const handleSubmit = (
    values,
    { setSubmitting, resetForm },
    formId,
    index
  ) => {
    setTimeout(() => {

      setSavedForms((prev) => {
        const { [formId]: _, ...rest } = prev
        return rest
      })
    }, 400)
    const { uid } = selUnitDetails
    const x = selUnitDetails
    const y = {}
    if (index === 0) {

      x.customerDetailsObj = values
      x.custObj1 = values

    }
    if (index === 1) {

      x.secondaryCustomerDetailsObj = values
      x.custObj2 = values
    } if (index === 2) {

      x.thirdCustomerDetailsObj = values
      x.custObj3 = values
    } if (index === 3) {

      x.fourthCustomerDetailsObj = values
      x.custObj4 = values
    }


    console.log('uploading values are', x.leadId)
    updateUnitCustomerDetailsTo(
      orgId,
      selUnitDetails?.uid || selUnitDetails?.id,
      x,
      user?.email,
      enqueueSnackbar,
      resetForm
    )
  }

  const handleSave = (values, formId) => {
    setSavedForms((prev) => ({
      ...prev,
      [formId]: values,
    }))
    alert(`Form ${formId} saved!`)
  }

  const handleClone = () => {
    setForms((prev) => [...prev, { id: Date.now() }])
  }

  const handleDelete = (formId)=>{
    setForms(forms.filter(form=>form.id!==formId))
  }

  return (
    <div className="space-y-8">
      {forms.map((form, i) => (
        <div key={form.id} className=" p-2 rounded-lg">
          <EmailForm
            onSubmitFun={(values, formikBag) =>
              handleSubmit(values, formikBag, form.id, i)
            }
            onSave={(values) => handleSave(values, form.id)}
            customerInfo={applicantDetailsA[i]}
            leadPayload={leadPayload}
            handleClone={handleClone}
            handleDelete={()=>handleDelete(form.id)}
            index={i}
            applicantDetailsA={applicantDetailsA}
          />
          {savedForms[form.id] && (
            <span className="mt-4">
              Saved email: {savedForms[form.id].email}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default CloneableEmailForm
