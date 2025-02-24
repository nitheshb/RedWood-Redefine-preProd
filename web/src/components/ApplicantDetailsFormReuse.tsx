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
    // co_Name1: Yup.string().required('Required'),
    panNo1: Yup.string().test('pan', 'Invalid PAN card number', isValidPAN),
    // panNo2: Yup.string().test('pan', 'Invalid PAN card number', isValidPAN),
    // panDocUrl1: Yup.string().required('Required'),
    aadharNo1: Yup.string().test(
      'aadhar',
      'Invalid Aadhar card number',
      isValidAadhar
    ),
    // aadharNo2: Yup.string().test(
    //   'aadhar',
    //   'Invalid Aadhar card number',
    //   isValidAadhar
    // ),
    // aadharUrl1: Yup.string().required('Required'),
    // occupation1: Yup.string().required('Required'),
    // phoneNo1: Yup.string().required('Required'),
    // email1: Yup.string().email('Email is invalid'),
    // email2: Yup.string().email('Email is invalid'),
    // aggrementAddress: Yup.string().required('Required'),
  })
  const uid = selUnitDetails?.uid || selUnitDetails?.id
  const datee = new Date().getTime()
  const initialState = {
    customerName1:
      // leadPayload?.customerDetailsObj?.customerName1 ||
      // selUnitDetails?.customerDetailsObj?.customerName1 ||
      customerInfo?.customerName1 ||
      // leadPayload?.Name ||
      '',
    // customerName2:
    //   leadPayload?.secondaryCustomerDetailsObj?.customerName2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.customerName2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.customerName2 ||
    //   '',
    relation1:
    //  leadPayload?.customerDetailsObj?.relation1 ||
      selUnitDetails?.customerDetailsObj?.relation1 ||
      customerInfo?.relation1 || {
        label: 'S/O',
        value: 'S/O',
      },

    // relation2: customerInfo?.secondaryCustomerDetailsObj?.relation2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.relation2 ||
    //   leadPayload?.secondaryCustomerDetailsObj?.relation2 || {
    //     label: 'S/O',
    //     value: 'S/O',
    //   },

    co_Name1:
      // leadPayload?.customerDetailsObj?.co_Name1 ||
      selUnitDetails?.customerDetailsObj?.co_Name1 ||
      customerInfo?.co_Name1 ||
      '',
    // co_Name2:
    //   leadPayload?.secondaryCustomerDetailsObj?.co_Name2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.co_Name2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.co_Name2 ||
    //   '',
    leadPhNo:
leadPayload?.Mobile ||
      '',
    phoneNo1:
      // leadPayload?.customerDetailsObj?.phoneNo1 ||
      selUnitDetails?.customerDetailsObj?.phoneNo1 ||
      customerInfo?.phoneNo1 ||
      // leadPayload?.Mobile ||
      '',
    phoneNo3:
      // leadPayload?.customerDetailsObj?.phoneNo3 ||
      selUnitDetails?.customerDetailsObj?.phoneNo3 ||
      customerInfo?.phoneNo3 ||
      // leadPayload?.Mobile ||
      '',
    // phoneNo2:
    //   leadPayload?.secondaryCustomerDetailsObj?.phoneNo2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.phoneNo2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.phoneNo2 ||
    //   '',

    // phoneNo4:
    //   leadPayload?.secondaryCustomerDetailsObj?.phoneNo4 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.phoneNo4 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.phoneNo4 ||
    //   '',

    email1:
      // leadPayload?.customerDetailsObj?.email1 ||
      selUnitDetails?.customerDetailsObj?.email1 ||
      customerInfo?.email1 ||
      // leadPayload?.Email ||
      '',
    // email2:
    //   leadPayload?.secondaryCustomerDetailsObj?.email2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.email2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.email2 ||
    //   '',
    dob1: isValidDate(customerInfo?.dob1 )
      ? customerInfo?.dob1
      : isValidDate(leadPayload?.customerDetailsObj?.dob1) ? leadPayload?.customerDetailsObj?.dob1 : datee,
    // dob2:
    //   leadPayload?.secondaryCustomerDetailsObj?.dob2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.dob2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.dob2 ||
    //   datee,
    marital1:
    // leadPayload?.customerDetailsObj?.marital1 ||
      selUnitDetails?.customerDetailsObj?.marital1 ||
      customerInfo?.marital1 || {
        label: 'Single',
        value: 'Single',
      },
    // marital2: leadPayload?.secondaryCustomerDetailsObj?.marital2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.marital2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.marital2 || {
    //     label: 'Single',
    //     value: 'Single',
    //   },
    address1:
      // leadPayload?.customerDetailsObj?.address1 ||
      selUnitDetails?.customerDetailsObj?.address1 ||
      customerInfo?.address1 ||
      '',
    // address2:
    //   leadPayload?.secondaryCustomerDetailsObj?.address2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.address2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.address2 ||
    //   '',
    city1:
      // leadPayload?.customerDetailsObj?.city1 ||
      selUnitDetails?.customerDetailsObj?.city1 ||
      customerInfo?.city1 ||
      '',

    countryName1:
      // leadPayload?.customerDetailsObj?.countryName1 ||
      selUnitDetails?.customerDetailsObj?.countryName1 ||
      customerInfo?.countryName1 ||
      '',

    pincode1:
      // leadPayload?.customerDetailsObj?.pincode1 ||
      selUnitDetails?.customerDetailsObj?.pincode1 ||
      customerInfo?.pincode1 ||
      '',

    countryCode1:
      // leadPayload?.customerDetailsObj?.countryCode1 ||
      selUnitDetails?.customerDetailsObj?.countryCode1 ||
      customerInfo?.countryCode1 ||
      '',

    // countryCode2:
    //   leadPayload?.customerDetailsObj?.countryCode2 ||
    //   selUnitDetails?.customerDetailsObj?.countryCode2 ||
    //   customerInfo?.countryCode2 ||
    //   '',

    // city2:
    //   leadPayload?.secondaryCustomerDetailsObj?.city2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.city2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.city2 ||
    //   '',

    // countryName2:
    //   leadPayload?.secondaryCustomerDetailsObj?.countryName2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.countryName2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.countryName2 ||
    //   '',

    // pincode2:
    //   leadPayload?.secondaryCustomerDetailsObj?.pincode2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.pincode2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.pincode2 ||
    //   '',

    // countryCode3:
    //   leadPayload?.secondaryCustomerDetailsObj?.countryCode3 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.countryCode3 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.countryCode3 ||
    //   '',

    // countryCode4:
    //   leadPayload?.secondaryCustomerDetailsObj?.countryCode4 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.countryCode4 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.countryCode4 ||
    //   '',

    state1:
    // leadPayload?.customerDetailsObj?.state1 ||
      selUnitDetails?.customerDetailsObj?.state1 ||
      customerInfo?.state1 || {
        value: 'KA',
        label: 'Karnataka',
      },
    // state2: leadPayload?.secondaryCustomerDetailsObj?.state2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.state2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.state2 || {
    //     value: 'KA',
    //     label: 'Karnataka',
    //   },

    panNo1:
      // leadPayload?.customerDetailsObj?.panNo1 ||
      selUnitDetails?.customerDetailsObj?.panNo1 ||
      customerInfo?.panNo1 ||
      '',
    // panNo2:
    //   leadPayload?.secondaryCustomerDetailsObj?.panNo2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.panNo2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.panNo2 ||
    //   '',
    panDocUrl1:
      // leadPayload?.customerDetailsObj?.panDocUrl1 ||
      selUnitDetails?.customerDetailsObj?.panDocUrl1 ||
      customerInfo?.panDocUrl1 ||
      '',

    // panDocUrl2:
    //   leadPayload?.secondaryCustomerDetailsObj?.panDocUrl2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.panDocUrl2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.panDocUrl2 ||
    //   '',
    aadharNo1:
      // leadPayload?.customerDetailsObj?.aadharNo1 ||
      selUnitDetails?.customerDetailsObj?.aadharNo1 ||
      customerInfo?.aadharNo1 ||
      '',
    // aadharNo2:
    //   leadPayload?.secondaryCustomerDetailsObj?.aadharNo2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.aadharNo2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.aadharNo2 ||
    //   '',
    aadharUrl1:
      // leadPayload?.customerDetailsObj?.aadharUrl1 ||
      selUnitDetails?.customerDetailsObj?.aadharUrl1 ||
      customerInfo?.aadharUrl1 ||
      '',
    // aadharUrl2:
    //   leadPayload?.secondaryCustomerDetailsObj?.aadharUrl2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.aadharUrl2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.aadharUrl2 ||
    //   '',
    occupation1:
      // leadPayload?.customerDetailsObj?.occupation1 ||
      selUnitDetails?.customerDetailsObj?.occupation1 ||
      customerInfo?.occupation1 ||
      '',
    // occupation2:
    //   leadPayload?.secondaryCustomerDetailsObj?.occupation2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.occupation2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.occupation2 ||
    //   '',
    companyName1:
      // leadPayload?.customerDetailsObj?.companyName1 ||
      selUnitDetails?.customerDetailsObj?.companyName1 ||
      customerInfo?.companyName1 ||
      '',
    designation1:
      // leadPayload?.customerDetailsObj?.designation1 ||
      selUnitDetails?.customerDetailsObj?.designation1 ||
      customerInfo?.designation1 ||
      '',
    // designation2:
    //   leadPayload?.secondaryCustomerDetailsObj?.designation2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.designation2 ||
    //   customerInfo?.designation2 ||
    //   '',
    annualIncome1:
      // leadPayload?.customerDetailsObj?.annualIncome1 ||
      selUnitDetails?.customerDetailsObj?.annualIncome1 ||
      customerInfo?.annualIncome1  ||
      '',
    // annualIncome2:
    //   leadPayload?.secondaryCustomerDetailsObj?.annualIncome2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.annualIncome2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.annualIncome2 ||
    //   '',

    // companyName2:
    //   leadPayload?.secondaryCustomerDetailsObj?.companyName2 ||
    //   selUnitDetails?.secondaryCustomerDetailsObj?.companyName2 ||
    //   customerInfo?.secondaryCustomerDetailsObj?.companyName2 ||
    //   '',

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
    // leadSource: "",
    // sourceOfPay: "",
    // purpose: "",
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
        // Create a Blob URL
        const blobUrl = URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'download';

        // Trigger the download
        link.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
        console.error('Download failed:', error);
    });
    return;
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
        link.setAttribute('download', 'filename.pdf')
        document.body.appendChild(link)
        console.log('fetcher url ', filename)
        // Simulate a click on the anchor element to start the download
        link.click()

        // Clean up the temporary anchor element
        link.parentNode.removeChild(link)

        // Set the downloaded image URL to display on the page
        // setImageUrl(url)
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

          // setProgress(prog)
          file.isUploading = false
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            // createAttach(orgId, url, by, file.name, id, attachType)
            file.url = url
            // setFiles([...files, file])
            if (type === 'panCard1') {
              // setPanCard1(url)
              formik.setFieldValue('panDocUrl1', url)
            } else if (type === 'panCard2') {
              // setPanCard2(url)
              formik.setFieldValue('panDocUrl2', url)
            } else if (type === 'aadharNo1Url') {
              // setAadharUrl1(url)
              formik.setFieldValue('aadharUrl1', url)
            } else if (type === 'aadharNo2Url') {
              // setAadharUrl2(url)
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
            //  save this doc as a new file in spark_leads_doc
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
      // formik.setFieldValue('co_Name1', x?.Name)
      if(x?.Mobile){
        formik.setFieldValue('customerName1', x?.Name)
      formik.setFieldValue('phoneNo1', x?.Mobile)}
      if(x?.Email){
        formik.setFieldValue('customerName1', x?.Name)
      formik.setFieldValue('email1', x?.Email)
      }
      // formik.setFieldValue('address1', x?.Address)
      // formik.setFieldValue('city1', x?.City)
      // formik.setFieldValue('state1', x?.State)
      // formik.setFieldValue('countryName1', x?.Country)
      // formik.setFieldValue('pincode1', x?.Pincode)
      // formik.setFieldValue('countryCode1', x?.CountryCode)

      setFetchedLeadsObj(foundLength[0])

      setLeadLink(true)
    }
    // formik.setFieldValue('customerName1', 'New1')

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

        //  values.annualIncome1 = Number(values.annualIncome1.replace(/,/g, ''))
      const fullData = values
      console.log('testing link',leadLink,fetchedLeadsObj )

        fullData.leadId = fetchedLeadsObj?.id  ||leadIdGlobal|| '';
        onSubmitFun(fullData, resetForm)
      }}
    >
      {(formik) => (
        <Form className="space-y-4">
          <div>
            {/* <Field
            as={Input}
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full"
          /> */}
            {/* <TextField label="Customer Name*" name="email" type="text" />
            <ErrorMessage name="email" className="text-red-500" /> */}
            <section
              className="   bg-[#fff] rounded-[20px] border pb-4 "
              style={{ boxShadow: '0 1px 12px #f2f2f2' }}
            >
              <div
                className="w-full bg-[#EDEDED] flex flex-row justify-between mb-2 p-4 bg-white-100 rounded-t-[20px]"
                // style={bgImgStyle}
              >
                <section className="flex flex-row">
                  {/* <div className="w-[53.80px] h-[58px] bg-zinc-100 rounded-[5px] mr-2"></div> */}
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

                        {/* <div className="border-t-4 rounded-xl w-16 mt-[5px] mb-3 border-[#8b5cf6]"></div> */}
                      </div>

                      <div></div>
                    </div>

                    {/* <div className="w-[455.80px] opacity-50 text-white  text-[12px] font-normal ">
                                            Details of applicant is mandatory
                                          </div> */}
                  </div>
                </section>
              </div>

              <section className="mt-1 px-4 mx-4 rounded-lg bg-white border border-gray-100 shadow">
                <section className="flex flex-row  pt-2 mt-1 ">
                  <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div>
                  <span className="ml-1 leading-[15px] flex flex-row ">
                    <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                      Personal Details
                      <abbr title="required"></abbr>
                    </label>
                   {!leadLink && <div
                            className=" ml- text-[13px] cursor-pointer  rounded-full px-2  text-[#0ea5e9] underline"
                            onClick={() => setShowLeadLink(!showLeadLink)}
                          >
                            {/* <LinkIcon className="w-3 h-3 cursor-pointer ml-1 mb-[3px] mr-1 inline-block text-[#0ea5e9]  rounded-[16px] " /> */}
                            Auto fill & link with lead
                          </div>}

                          {leadLink && <div
                            className=" ml- text-[13px] cursor-pointer  rounded-full px-2  text-orange-500 underline"
                            onClick={() => setShowLeadLink(!showLeadLink)}
                          >
                            {/* <LinkIcon className="w-3 h-3 cursor-pointer ml-1 mb-[3px] mr-1 inline-block text-[#0ea5e9]  rounded-[16px] " /> */}
                            Applicant Linked to Lead
                          </div>}
                  </span>
                </section>
{/* auto fill section */}
                {showLeadLink && (
                <div className="bg-[#DCD7FF] rounded-xl p-2 mt-2 flex-col">
                  <label className='text-[14px] '>Auto fill from matched Leads Phone No </label>
                  <section className='flex flex-row '>
                  <div className="w-full flex flex-row lg:w-3/12 px- mt-2">
                    <div className="relative w-full ">
                      <PhoneNoField
                        label="Lead Phone No"
                        name="leadPhNo1"
                        // type="text"
                        value={givenPhNo1}
                        onChange={(value) => {
                          // formik.setFieldValue('mobileNo', value.value)
                          console.log('value is ', value.value)
                          //
                          // formik.setFieldValue('leadPhNo', value.value)
                          searchPhoneNoFun(value.value)
                        }}
                        // value={formik.values.mobileNo}
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
                <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-4 ">
                  <div className="space-y-2 w-full text-xs mt-">
                    <TextField
                      label="Customer Name*"
                      name="customerName1"
                      type="text"
                    />
                  </div>

                  <div className=" space-y-2 w-full text-xs mt-">
                    <div className="relative ">
                      <label className="label font-regular text-[12px] block mb-1 mt- text-gray-700">
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

                  <div className=" space-y-2 w-full text-xs mt-">
                    <div className="relative flex flex-col  ">
                      <label className="text-gray-500 text-[10px] mb-2">
                        Date Of Birth
                      </label>
                      <span className="inline">
                        <CustomDatePicker
                          className="h-8 outline-none border-radius rounded-md  px-2 border-[#cccccc] border-gray-500 text-sm mt-[-4px] pb-1  w-[90%] inline   flex bg-grey-lighter text-grey-darker border border-gray-500 "
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
                          //dateFormat="d-MMMM-yyyy"
                          dateFormat="MMM dd, yyyy"
                        />
                      </span>
                    </div>
                  </div>
                </div>
                {/* row 3 */}
                <div className="flex flex-row justify-between pt-2 mb-2">
                  <section className="w-12/12 w-full">
                    <label className="label font-regular text-[12px] block mb-1 mt-1 text-gray-700">
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
                            <div className="flex flex-row-reverse">
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
                      // onChange={formik.handleChange}

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
                    <label className="label font-regular text-[12px] block mb-1 mt-1 text-gray-700">
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
                      // onChange={formik.handleChange}
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
              <section className="mt-2 px-4 mx-4 rounded-lg bg-white border border-gray-100 shadow pb-2">
                <section className="flex flex-row  pt-2 mt-1 ">
                  <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div>
                  <span className="ml-1 leading-[15px] ">
                    <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                      Contact Details
                      <abbr title="required"></abbr>
                    </label>
                  </span>
                </section>
                {/* row 1 */}
                <div className="w-full  flex flex-row lg:w-12/12 mt-2">
                  <div className="w-full lg:w-3/12 mb-2 ">
                    <div className="relative w-full mt-2">
                      <div className="space-y-1 w-full text-xs">
                        <label htmlFor="countryCode" className="inline-block">
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
                            // type="text"
                            value={formik.values.phoneNo1}
                            customStyles={customPhoneNoFieldStyles}
                            onChange={(value) => {
                              // formik.setFieldValue('mobileNo', value.value)
                              formik.setFieldValue('phoneNo1', value.value)
                            }}
                            // value={formik.values.mobileNo}
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

                  {/*
                                        <div className="w-full lg:w-3/12 pl-4">
                                          <div className="relative w-full mt-2">
                                            <TextField
                                              label="Email"
                                              name="email2"
                                              type="text"
                                            />
                                          </div>
                                        </div> */}

                  <div className="w-full lg:w-3/12 pl-4">
                    <div className="relative w-full mt-2">
                      <div className="space-y-1 w-full text-xs">
                        <label htmlFor="countryCode" className="inline-block">
                          Alternate Phone No
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

                  <div className="w-full lg:w-6/12 pl-4">
                    <div className="relative w-full mt-2">
                      <TextField label="Email" name="email1" type="text" />
                    </div>
                  </div>
                </div>
              </section>
              {/* section-3 */}
              <section className="mt-2 px-4 mx-4 py-2 rounded-lg bg-white border border-gray-100 shadow">
                <section className="flex flex-row  mt-1 ">
                  <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div>
                  <span className="ml-1 leading-[15px] ">
                    <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                      Address
                      <abbr title="required"></abbr>
                    </label>
                  </span>
                </section>
                {/* row 1 */}
                <div className="w-full lg:w-12/12 ">
                  <div className="relative w-full mb-3 mt-2">
                    <TextField label="Address" name="address1" type="text" />
                  </div>
                </div>
                <div className="w-full  flex flex-row lg:w-12/12 mt-1">
                <div className="w-full lg:w-12/12 ">
                    {/* Pincode 2 */}
                    <div className="relative w-full mb-3 ">
                      <TextField label="Pincodes" name="pincode1" type="text"
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
                      <TextField label="City" name="city1" type="text" />
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
              <section className="mt-2 px-4 mx-4 py-2 rounded-lg bg-white border border-gray-100 shadow">
                <section className="flex flex-row  px- mt-1 ">
                  <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-[#8b5cf6]"></div>
                  <span className="ml-1 leading-[15px] ">
                    <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                      Other Details
                      <abbr title="required"></abbr>
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
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 pl-4">
                    <div className="relative w-full mb-3 mt-2">
                      <TextField
                        label="Annual Income"
                        name="annualIncome1"
                        type="text"
                        value={
                        formik.values.annualIncome1.toLocaleString('en-IN')
                        }
                        onChange={(e) =>{
                          const rawValue = Number(e.target.value.replace(/,/g, ''))?.toLocaleString('en-IN')


                          formik.setFieldValue('annualIncome1', rawValue)
                          // handleIncomeChange(rawValue)
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
            <button type="submit" className="mb-2 md:mb-0 bg-[#8b5cf6] px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 ">Save</button>

      <button onClick={handleClone} className="mb-4  md:mb-0 bg-[#8b5cf6] px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 mb-4 mr-2">Save & Add New Applicant</button>
      {index !=0 && <button onClick={()=>setIsDialogOpen(true)} className="mb-4  md:mb-0 bg-[#8b5cf6] px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 mb-4 mr-2">Delete</button>}

            {/* <button
              type="button"
              onClick={() => onSave(values)}
              disabled={isSubmitting}
            >
              Save
            </button> */}






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
      // alert(JSON.stringify(values, null, 2))
      // setSubmitting(false)
      // resetForm()
      // Remove the form from saved forms if it was there
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

    // add to array

    // console.log('customer info', values)
    // let a1 = customerInfo
    // a1[index] = values
    // console.log('customer info', a1)
    // setCustomerInfo(a1)
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
        <div key={form.id} className="border p-2 rounded-lg">
          {/* <h2 className="text-lg font-semibold mb-4">Applicant {i + 1}</h2> */}
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
            // customerInfo={}
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
