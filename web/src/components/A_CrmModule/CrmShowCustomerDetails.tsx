/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useSnackbar } from 'notistack'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import {
  addLead,
  updateLeadCustomerDetailsTo,
  checkIfLeadAlreadyExists,
  getAllProjects,
  steamUsersListByRole,
  updateUnitCustomerDetailsTo,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import {
  sendWhatAppMediaSms,
  sendWhatAppTextSms,
} from 'src/util/axiosWhatAppApi'
import { prettyDate } from 'src/util/dateConverter'
import { useFileUpload } from '../useFileUpload'
import Profileimg from '../../../public/Profileimg.png'
import NotificationDemo from '../../NotificationDemo'
import { ToastBar , useToaster } from 'react-hot-toast'




const ShowCustomerDetails = ({
  source,
  title,
  leadDetailsObj2,
  selUnitDetails,
  dialogOpen,
  setShowApplicantEdit,
}) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [uploadedFileLink, handleFileUpload] = useFileUpload()
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [progress, setProgress] = useState(0)
  const [panCard1, setPanCard1] = useState('')
  const [panCard2, setPanCard2] = useState('')
  const [aadhrUrl1, setAadharUrl1] = useState('')
  const [aadhrUrl2, setAadharUrl2] = useState('')

  useEffect(() => {
    console.log('yo yo ', selUnitDetails, leadDetailsObj2)
    setPanCard1(leadDetailsObj2?.customerDetailsObj?.panDocUrl1)
    setPanCard2(leadDetailsObj2?.secondaryCustomerDetailsObj?.panDocUrl2)
    setAadharUrl1(leadDetailsObj2?.customerDetailsObj?.aadharUrl1)
    setAadharUrl2(leadDetailsObj2?.secondaryCustomerDetailsObj?.aadharUrl2)
  }, [])

  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(usersListA)
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA)

        setusersList(usersListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])
  useEffect(() => {
    console.log('new customer object', leadDetailsObj2)
  }, [leadDetailsObj2])

  useEffect(() => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(projectsListA)
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        console.log('fetched users list is', projectsListA)
        setprojectList(projectsListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])

  const downloadImage = (imageUrl, filename) => {
    console.error('Error downloading image:', imageUrl)
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary anchor element
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

  const budgetList = [
    { label: 'Select Customer Budget', value: '' },
    { label: '5 - 10 Lacs', value: 'Bangalore,KA' },
    { label: '10 - 20 Lacs', value: 'Cochin,KL' },
    { label: '20 - 30 Lacs', value: 'Mumbai,MH' },
    { label: '30 - 40 Lacs', value: 'Mumbai,MH' },
    { label: '40 - 50 Lacs', value: 'Mumbai,MH' },
    { label: '50 - 60 Lacs', value: 'Mumbai,MH' },
    { label: '60 - 70 Lacs', value: 'Mumbai,MH' },
    { label: '70 - 80 Lacs', value: 'Mumbai,MH' },
    { label: '80 - 90 Lacs', value: 'Mumbai,MH' },
    { label: '90 - 100 Lacs', value: 'Mumbai,MH' },
    { label: '1.0 Cr - 1.1 Cr', value: 'Mumbai,MH' },
    { label: '1.1 Cr - 1.2 Cr', value: 'Mumbai,MH' },
    { label: '1.2 Cr - 1.3 Cr', value: 'Mumbai,MH' },
    { label: '1.3 Cr - 1.4 Cr', value: 'Mumbai,MH' },
    { label: '1.4 Cr - 1.5 Cr', value: 'Mumbai,MH' },
    { label: '1.5 + Cr', value: 'Mumbai,MH' },
  ]




  const gridBgStyle = {
    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
    backgroundSize: '70px 70px',
    backgroundPosition: 'center',
    opacity: 0.3
  };


  const plans = [
    {
      name: 'Apartment',
      img: '/apart1.svg',
    },
    {
      name: 'Plots',
      img: '/plot.svg',
    },
    {
      name: 'WeekendVillas',
      img: '/weekend.svg',
    },
    {
      name: 'Villas',
      img: '/villa.svg',
    },
  ]

  const devTypeA = [
    {
      name: 'Outright',
      img: '/apart.svg',
    },
    {
      name: 'Joint',
      img: '/apart1.svg',
    },
  ]
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [devType, setdevType] = useState(devTypeA[0])
  const [startDate, setStartDate] = useState(new Date())
  const [selRef1, setRefDataFun1] = useState({ label: 'S/O', value: 'S/O' })
  const [selRef2, setRefDataFun2] = useState({ label: 'S/O', value: 'S/O' })

  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const typeSel = async (sel) => {
    await console.log('value is', selected)
    await setSelected(sel)
    await console.log('thsi si sel type', sel, selected)
  }
  const devTypeSel = async (sel) => {
    await setdevType(sel)
  }
  const onSubmitFun = async (data, resetForm) => {
    console.log(data)
    setLoading(true)

    const {
      email,
      name,
      mobileNo,
      assignedTo,
      assignedToObj,
      source,
      project,
    } = data
    // updateUserRole(uid, deptVal, myRole, email, 'nitheshreddy.email@gmail.com')

    const foundLength = await checkIfLeadAlreadyExists('spark_leads', mobileNo)
    const leadData = {
      Date: Timestamp.now().toMillis(),
      Email: email,
      Mobile: mobileNo,
      Name: name,
      Note: '',
      Project: project,
      Source: source,
      Status: assignedTo === '' ? 'unassigned' : 'new',
      intype: 'Form',
      assignedTo: assignedToObj?.value || '',
      assignedToObj: {
        department: assignedToObj?.department || [],
        email: assignedToObj?.email || '',
        label: assignedToObj?.label || '',
        name: assignedToObj?.name || '',
        namespace: orgId,
        roles: assignedToObj?.roles || [],
        uid: assignedToObj?.value || '',
        value: assignedToObj?.value || '',
      },
      by: user?.email,
    }
    console.log('user is ', user)
    if (foundLength?.length > 0) {
      console.log('foundLENGTH IS ', foundLength)
      setFormMessage('Lead Already Exists with Ph No')
      setLoading(false)
    } else {
      console.log('foundLENGTH IS empty ', foundLength)

      // proceed to copy
      await addLead(
        orgId,
        leadData,
        user?.email,
        `lead created and assidged to ${assignedTo}`
      )

      await sendWhatAppTextSms(
        mobileNo,
        `Thank you ${name} for choosing the world className ${
          project || 'project'
        }`
      )

      // msg2
      await sendWhatAppMediaSms(mobileNo)
      const smg =
        assignedTo === ''
          ? 'You Interested will be addressed soon... U can contact 9123456789 mean while'
          : 'we have assigned dedicated manager to you. Mr.Ram as ur personal manager'

      // msg3
      sendWhatAppTextSms(mobileNo, smg)
      resetForm()
      setFormMessage('Saved Successfully..!')
      setLoading(false)
    }
  }

  // const { uid } = selUnitDetails
  const uid = selUnitDetails?.uid || selUnitDetails?.id
  const datee = new Date().getTime()
  const initialState = {
    customerName1:
      leadDetailsObj2?.customerDetailsObj?.customerName1 ||
      leadDetailsObj2?.Name ||
      '',
    customerName2:
      leadDetailsObj2?.secondaryCustomerDetailsObj?.customerName2 || '',
    co_Name1: leadDetailsObj2?.customerDetailsObj?.co_Name1 || '',
    co_Name2: leadDetailsObj2?.secondaryCustomerDetailsObj?.co_Name2 || '',
    phoneNo1:
      leadDetailsObj2?.customerDetailsObj?.phoneNo1 ||
      leadDetailsObj2?.Mobile ||
      '',
    phoneNo2: leadDetailsObj2?.secondaryCustomerDetailsObj?.phoneNo2 || '',
    email1:
      leadDetailsObj2?.customerDetailsObj?.email1 ||
      leadDetailsObj2?.Email ||
      '',
    email2: leadDetailsObj2?.secondaryCustomerDetailsObj?.email2 || '',
    dob1: leadDetailsObj2?.customerDetailsObj?.dob1 || datee,
    dob2: leadDetailsObj2?.secondaryCustomerDetailsObj?.dob2 || datee,
    marital1: leadDetailsObj2?.customerDetailsObj?.marital1 || {
      label: 'Married',
      value: 'Married',
    },
    marital2: leadDetailsObj2?.secondaryCustomerDetailsObj?.marital2 || {
      label: 'Married',
      value: 'Married',
    },
    panNo1: leadDetailsObj2?.customerDetailsObj?.panNo1 || '',
    panNo2: leadDetailsObj2?.secondaryCustomerDetailsObj?.panNo2 || '',
    panDocUrl1: leadDetailsObj2?.customerDetailsObj?.panDocUrl1 || '',

    panDocUrl2: leadDetailsObj2?.secondaryCustomerDetailsObj?.panDocUrl2 || '',
    aadharNo1: leadDetailsObj2?.customerDetailsObj?.aadharNo1 || '',
    aadharNo2: leadDetailsObj2?.secondaryCustomerDetailsObj?.aadharNo2 || '',
    aadharUrl1: leadDetailsObj2?.customerDetailsObj?.aadharUrl1 || '',
    aadharUrl2: leadDetailsObj2?.secondaryCustomerDetailsObj?.aadharUrl2 || '',
    occupation1: leadDetailsObj2?.customerDetailsObj?.occupation1 || '',
    companyName1: leadDetailsObj2?.customerDetailsObj?.companyName1 || '',

    occupation2:
      leadDetailsObj2?.secondaryCustomerDetailsObj?.occupation2 || '',
    companyName2:
      leadDetailsObj2?.secondaryCustomerDetailsObj?.companyName2 || '',

    aggrementAddress:
      leadDetailsObj2?.aggrementDetailsObj?.aggrementAddress || '',
    industry: leadDetailsObj2?.industry || '',
    designation: leadDetailsObj2?.designation || '',
    annualIncome: leadDetailsObj2?.annualIncome || '',
    leadSource:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.leadSource
        : '',
    sourceOfPay:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.sourceOfPay
        : '',
    purpose:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.purpose
        : '',
    // leadSource: "",
    // sourceOfPay: "",
    // purpose: "",
    bookingSource: leadDetailsObj2?.bookingSource || '',
    bookedBy:
      leadDetailsObj2?.bookedBy || leadDetailsObj2?.assignedToObj?.label || '',
    purchasePurpose: leadDetailsObj2?.purchasePurpose || '',
  }
  // Custom PAN card validation function
  const isValidPAN = (value) => {
    const regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
    console.log('match value is ', value, value === '', value == undefined)
    if (value === '' || value == undefined) {
      return true
    }
    return regex.test(value)
  }

  const isValidAadhar = (value) => {
    const regex = /^\d{12}$/
    if (value === '' || value == undefined) {
      return true
    }
    return regex.test(value)
  }
  const validateSchema = Yup.object({

    panNo1: Yup.string().test('pan', 'Invalid PAN card number', isValidPAN),
    panNo2: Yup.string().test('pan', 'Invalid PAN card number', isValidPAN),
    aadharNo1: Yup.string().test(
      'aadhar',
      'Invalid Aadhar card number',
      isValidAadhar
    ),
    aadharNo2: Yup.string().test(
      'aadhar',
      'Invalid Aadhar card number',
      isValidAadhar
    ),

    email1: Yup.string().email('Email is invalid'),
    email2: Yup.string().email('Email is invalid'),

  })

  const resetter = () => {
    setSelected({})
    setFormMessage('')
  }

  const onSubmit = async (data, resetForm) => {
    console.log('customer details form', data)
    const {
      customerName1,
      co_Name1,
      phoneNo1,
      email1,
      dob1,
      marital1,
      panNo1,
      panDocUrl1,
      aadharNo1,
      aadharUrl1,
      occupation1,
      companyName1,
      customerName2,
      co_Name2,
      phoneNo2,
      email2,
      dob2,
      marital2,
      panNo2,
      panDocUrl2,
      aadharNo2,
      aadharUrl2,
      occupation2,
      companyName2,
      aggrementAddress,
      industry,
      designation,
      annualIncome,
      leadSource,
      sourceOfPay,
      purpose,
      bookingSource,
      bookedBy,
      purchasePurpose,
    } = data
    const { uid } = selUnitDetails
    const customerDetailsObj = {
      customerName1: customerName1,
      co_Name1: co_Name1,
      phoneNo1: phoneNo1,
      email1: email1,
      dob1: dob1,
      marital1: marital1,
      panNo1: panNo1,
      panDocUrl1: panCard1 || '',
      aadharNo1: aadharNo1,
      aadharUrl1: aadhrUrl1 || '',
      occupation1,
      companyName1,
    }
    const secondaryCustomerDetailsObj = {
      customerName2,
      co_Name2: co_Name2,
      marital2: marital2,
      phoneNo2,
      email2,
      dob2: dob2,
      marital1,
      panNo2,
      panDocUrl2: panCard2 || '',
      aadharNo2,
      aadharUrl2: aadhrUrl2 || '',
      occupation2,
      companyName2,
    }
    const aggrementDetailsObj = {
      aggrementAddress,
    }

    const xData = {}
    xData[`${uid}${'_source_of_pay'}`] = { self: 20, bank: 80 }
    xData[`${uid}${'_otherInfo'}`] = { leadSource, sourceOfPay, purpose }

    const updateDoc = {
      customerDetailsObj,
      secondaryCustomerDetailsObj,
      aggrementDetailsObj,
      ...xData,
      industry,
      designation,
      annualIncome,
    }
    const { id } = leadDetailsObj2
    console.log('did you find my id', id, leadDetailsObj2)

    if (source === 'fromBookedUnit') {
      updateUnitCustomerDetailsTo(
        orgId,
        id,
        updateDoc,
        'nitheshreddy.email@gmail.com',
        // enqueueSnackbar,
        ToastBar,
        resetForm
      )
    } else {
      updateLeadCustomerDetailsTo(
        orgId,
        id,
        updateDoc,
        'nitheshreddy.email@gmail.com',
        // enqueueSnackbar,
        ToastBar,
        resetForm
      )
    }


  }
  const handleFileUploadFun = async (file, type) => {
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

          setProgress(prog)
          file.isUploading = false
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            file.url = url
            if (type === 'panCard1') {
              setPanCard1(url)
            } else if (type === 'panCard2') {
              setPanCard2(url)
            } else if (type === 'aadharNo1Url') {
              setAadharUrl1(url)
            } else if (type === 'aadharNo2Url') {
              setAadharUrl2(url)
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

  return (
    <>




    



<div className="overflow-y-scroll  min-h-screen mx-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
  <div className="relative min-h-screen mr-6 ">

    {/* <div className="">
      <img alt="CRM Background" src="/crmfinal.svg" className="w-full h-auto" />
    </div> */}

        <div className="relative z-0">
<h1 className="text-[#606062] font-outfit mb-1  mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
APPLICANT DETAILS
  </h1>


  <img
    alt="CRM Background"
    src="/crmfinal.svg"
    className="w-full h-auto object-cover"
  />


  <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
      <div className="text-center space-y-2">
        <p  className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Applicants</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">2</h2>

      </div>
      <div className="text-center space-y-2">
        <p  className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">KYC Pendings</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">NA</h2>
      </div>
      <div className="text-center space-y-2">
        <p  className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Current Balance</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">0</h2>
      </div>
    </div>
  </div>
</div>



    <div className="w-full  flex justify-center mt-[-70px] z-10 absolute">

    <div className='w-full max-w-4xl px-4 mx-auto'>
  {/* <h1 className="text-[#606062] tracking-[0.06em] font-heading font-medium text-[12px] mb-4">APPLICANT DETAILS</h1> */}

  <div className=" w-full relative flex justify-center">
    <div className="bg-white rounded-2xl  mb-6 overflow-hidden w-full relative">


<div
    className="w-[80px] h-[80px] bg-contain bg-no-repeat absolute z-30"
    style={{ backgroundImage: "url('/pri01.svg')", right: "-5px", top: "-5px" }}
  />


      <div className="p-6 pb-5 mb-0 relative">

        <div className="absolute inset-0" style={gridBgStyle}></div>

        <div className="flex items-center relative z-10">
          <div className="w-[70px] h-[70px] rounded-full font-outfit overflow-hidden mr-6 flex items-center justify-center bg-gray-200">
            {leadDetailsObj2?.customerDetailsObj?.customerName1 || leadDetailsObj2?.Name ? (
              <span className="text-[30px] font-outfit font-medium text-gray-700">
                {(leadDetailsObj2?.customerDetailsObj?.customerName1 || leadDetailsObj2?.Name || 'No Data').charAt(0)}
              </span>
            ) : (
              <img alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            )}
          </div>

          <div>
            <div className="flex items-center text-lg font-medium">
              {leadDetailsObj2?.customerDetailsObj?.customerName1 || leadDetailsObj2?.Name || 'No Data'}
              <span className="ml-2 text-gray-500">
                <button onClick={() => setShowApplicantEdit(true)} className="p-2 rounded-full">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.666992" y="0.5" width="24" height="24" rx="12" fill="white"/>
                    <path d="M13.8152 8.00589C14.2279 7.55874 14.4343 7.33517 14.6535 7.20476C15.1826 6.89009 15.8341 6.88031 16.3721 7.17895C16.595 7.30272 16.8077 7.52 17.2331 7.95456C17.6585 8.38911 17.8712 8.60639 17.9923 8.83413C18.2847 9.38364 18.2751 10.0492 17.9671 10.5897C17.8394 10.8136 17.6205 11.0244 17.1828 11.446L11.9748 16.4622C11.1453 17.2612 10.7305 17.6607 10.2122 17.8631C9.69383 18.0656 9.12398 18.0507 7.98429 18.0209L7.82922 18.0168C7.48226 18.0078 7.30878 18.0032 7.20794 17.8888C7.1071 17.7743 7.12086 17.5976 7.1484 17.2442L7.16335 17.0523C7.24085 16.0575 7.2796 15.5602 7.47385 15.1131C7.66809 14.666 8.00316 14.303 8.67329 13.5769L13.8152 8.00589Z" stroke="#191B1C" strokeWidth="0.830746" strokeLinejoin="round"/>
                    <path d="M13.2209 8.06934L17.0978 11.9462" stroke="#191B1C" strokeWidth="0.830746" strokeLinejoin="round"/>
                    <path d="M13.7751 18.0383L18.2058 18.0383" stroke="#191B1C" strokeWidth="0.830746" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </span>
            </div>

            <div className="flex">
              <div className="flex font-outfit items-center mr-6">
                <span className="mr-1">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.51833 8.46161C1.88632 7.35958 1.58115 6.45969 1.39714 5.54752C1.125 4.19843 1.74779 2.88058 2.77951 2.03969C3.21555 1.6843 3.71541 1.80572 3.97325 2.26831L4.55537 3.31265C5.01678 4.14042 5.24748 4.5543 5.20172 4.9931C5.15596 5.4319 4.84483 5.78928 4.22257 6.50404L2.51833 8.46161ZM2.51833 8.46161C3.79759 10.6922 5.80514 12.7009 8.03835 13.9816M8.03835 13.9816C9.14038 14.6136 10.0403 14.9188 10.9524 15.1028C12.3015 15.375 13.6194 14.7522 14.4603 13.7205C14.8157 13.2844 14.6942 12.7846 14.2317 12.5267L13.1873 11.9446C12.3595 11.4832 11.9457 11.2525 11.5069 11.2982C11.0681 11.344 10.7107 11.6551 9.99591 12.2774L8.03835 13.9816Z" stroke="#0E0A1F" strokeLinejoin="round"/>
                  </svg>
                </span>
                {leadDetailsObj2?.customerDetailsObj?.phoneNo1 || leadDetailsObj2?.Mobile || 'No Data'}
              </div>

              <div className="flex font-outfit items-center">
                <span className="mr-1">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.33325 4.5L5.94193 7.11131C7.64098 8.07401 8.35885 8.07401 10.0579 7.11131L14.6666 4.5" stroke="#141B34" strokeLinejoin="round"/>
                    <path d="M1.34376 9.48379C1.38735 11.5275 1.40914 12.5493 2.16322 13.3063C2.91731 14.0632 3.96681 14.0896 6.0658 14.1423C7.35946 14.1748 8.64038 14.1748 9.93404 14.1423C12.033 14.0896 13.0825 14.0632 13.8366 13.3063C14.5907 12.5493 14.6125 11.5275 14.6561 9.48379C14.6701 8.82667 14.6701 8.17342 14.6561 7.5163C14.6125 5.47261 14.5907 4.45077 13.8366 3.69382C13.0825 2.93686 12.033 2.91049 9.93404 2.85775C8.64038 2.82525 7.35946 2.82525 6.0658 2.85775C3.9668 2.91048 2.91731 2.93685 2.16322 3.69381C1.40913 4.45076 1.38734 5.4726 1.34376 7.51629C1.32975 8.17342 1.32975 8.82666 1.34376 9.48379Z" stroke="#141B34" strokeLinejoin="round"/>
                  </svg>
                </span>
                {leadDetailsObj2?.customerDetailsObj?.email1 || 'No Data'}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="p-6 grid grid-cols-4 gap-4">
        <div className="pr-2 col-span-1">
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">S/O</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] font-outfit text-[14px] mb-4">
            {leadDetailsObj2?.customerDetailsObj?.co_Name1 || 'No Data'}
          </div>

          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Martial Status</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] font-outfit text-[14px] mb-4">
            {leadDetailsObj2?.customerDetailsObj?.marital1?.value}
          </div>

          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">DOB</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] font-outfit text-[14px]">
            {prettyDate(leadDetailsObj2?.customerDetailsObj?.dob1 || datee)}
          </div>
        </div>

        <div className="col-span-1">
          <div className='border-l border-r px-4  border-gray-200'>

          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">PAN Card</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] font-outfit text-[14px] mb-4">
            {leadDetailsObj2?.customerDetailsObj?.panNo1 || 'No Data'}
          </div>

          </div>


          <div className='border-l border-r px-4  border-gray-200'>
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Aadhar Card</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] font-outfit text-[14px] mb-4">
            {leadDetailsObj2?.customerDetailsObj?.aadharNo1 || 'No Data'}
          </div>
         </div>

         <div className='border-l border-r px-4  border-gray-200'>
         <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Secondary No</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] font-outfit text-[14px]">
            {leadDetailsObj2?.customerDetailsObj?.phoneNo3 || 'No Data'}
          </div>
         </div>
    

    
        </div>

        <div className="pl-4 col-span-2">
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Current Address</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] text-[14px] mb-4 font-outfit break-words whitespace-pre-wrap">
            {leadDetailsObj2?.customerDetailsObj?.address1 || 'No Data'}
          </div>

          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Permanent Address</div>
          <div className="font-medium text-[#0E0A1F] tracking-[0.06em] text-[14px] font-outfit break-words whitespace-pre-wrap">
            {leadDetailsObj2?.customerDetailsObj?.address2p || 'No Data'}
          </div>
        </div>
      </div>
    </div>
  </div>


  <div className="mb-10 w-full flex justify-center relative">
    <div className="bg-white rounded-2xl  mb-10 overflow-hidden w-full relative">

      <div
        className="w-[70px] h-[70px] bg-contain bg-no-repeat absolute  z-30"
        style={{ backgroundImage: "url('/secondary2.svg')",  right: "-5px", top: "-5px"  }}
      />

      <div className="p-6 pb-5 mb-0 relative">
        <div className="absolute inset-0" style={gridBgStyle}></div>

        <div className="flex items-center relative z-10">
          <div className="w-[70px] h-[70px] rounded-full font-outfit overflow-hidden mr-6 flex items-center justify-center bg-gray-200">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.customerName1 || leadDetailsObj2?.Name ? (
              <span className="text-[30px] font-medium text-gray-700">
                {(leadDetailsObj2?.secondaryCustomerDetailsObj?.customerName1 || leadDetailsObj2?.Name || 'No Data').charAt(0)}
              </span>
            ) : (
              <img alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            )}
          </div>

          <div>
            <div className="flex items-center font-outfit text-lg font-medium">
              {leadDetailsObj2?.secondaryCustomerDetailsObj?.customerName1 || 'No Data'}
              <span className="ml-2 text-gray-500">
                <button onClick={() => setShowApplicantEdit(true)} className="p-2 rounded-full">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.666992" y="0.5" width="24" height="24" rx="12" fill="white"/>
                    <path d="M13.8152 8.00589C14.2279 7.55874 14.4343 7.33517 14.6535 7.20476C15.1826 6.89009 15.8341 6.88031 16.3721 7.17895C16.595 7.30272 16.8077 7.52 17.2331 7.95456C17.6585 8.38911 17.8712 8.60639 17.9923 8.83413C18.2847 9.38364 18.2751 10.0492 17.9671 10.5897C17.8394 10.8136 17.6205 11.0244 17.1828 11.446L11.9748 16.4622C11.1453 17.2612 10.7305 17.6607 10.2122 17.8631C9.69383 18.0656 9.12398 18.0507 7.98429 18.0209L7.82922 18.0168C7.48226 18.0078 7.30878 18.0032 7.20794 17.8888C7.1071 17.7743 7.12086 17.5976 7.1484 17.2442L7.16335 17.0523C7.24085 16.0575 7.2796 15.5602 7.47385 15.1131C7.66809 14.666 8.00316 14.303 8.67329 13.5769L13.8152 8.00589Z" stroke="#191B1C" strokeWidth="0.830746" strokeLinejoin="round"/>
                    <path d="M13.2209 8.06934L17.0978 11.9462" stroke="#191B1C" strokeWidth="0.830746" strokeLinejoin="round"/>
                    <path d="M13.7751 18.0383L18.2058 18.0383" stroke="#191B1C" strokeWidth="0.830746" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </span>
            </div>

            <div className="flex font-outfit">
              <div className="flex items-center mr-6">
                <span className="mr-1">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.51833 8.46161C1.88632 7.35958 1.58115 6.45969 1.39714 5.54752C1.125 4.19843 1.74779 2.88058 2.77951 2.03969C3.21555 1.6843 3.71541 1.80572 3.97325 2.26831L4.55537 3.31265C5.01678 4.14042 5.24748 4.5543 5.20172 4.9931C5.15596 5.4319 4.84483 5.78928 4.22257 6.50404L2.51833 8.46161ZM2.51833 8.46161C3.79759 10.6922 5.80514 12.7009 8.03835 13.9816M8.03835 13.9816C9.14038 14.6136 10.0403 14.9188 10.9524 15.1028C12.3015 15.375 13.6194 14.7522 14.4603 13.7205C14.8157 13.2844 14.6942 12.7846 14.2317 12.5267L13.1873 11.9446C12.3595 11.4832 11.9457 11.2525 11.5069 11.2982C11.0681 11.344 10.7107 11.6551 9.99591 12.2774L8.03835 13.9816Z" stroke="#0E0A1F" strokeLinejoin="round"/>
                  </svg>
                </span>
                {leadDetailsObj2?.secondaryCustomerDetailsObj?.phoneNo1 || 'No Data'}
              </div>

              <div className="flex font-outfit items-center">
                <span className="mr-1">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.33325 4.5L5.94193 7.11131C7.64098 8.07401 8.35885 8.07401 10.0579 7.11131L14.6666 4.5" stroke="#141B34" strokeLinejoin="round"/>
                    <path d="M1.34376 9.48379C1.38735 11.5275 1.40914 12.5493 2.16322 13.3063C2.91731 14.0632 3.96681 14.0896 6.0658 14.1423C7.35946 14.1748 8.64038 14.1748 9.93404 14.1423C12.033 14.0896 13.0825 14.0632 13.8366 13.3063C14.5907 12.5493 14.6125 11.5275 14.6561 9.48379C14.6701 8.82667 14.6701 8.17342 14.6561 7.5163C14.6125 5.47261 14.5907 4.45077 13.8366 3.69382C13.0825 2.93686 12.033 2.91049 9.93404 2.85775C8.64038 2.82525 7.35946 2.82525 6.0658 2.85775C3.9668 2.91048 2.91731 2.93685 2.16322 3.69381C1.40913 4.45076 1.38734 5.4726 1.34376 7.51629C1.32975 8.17342 1.32975 8.82666 1.34376 9.48379Z" stroke="#141B34" strokeLinejoin="round"/>
                  </svg>
                </span>
                {leadDetailsObj2?.secondaryCustomerDetailsObj?.email1 || 'No Data'}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="p-6 grid grid-cols-4 gap-4">
        <div className="pr-2 col-span-1">
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">S/O</div>
          <div className="font-medium font-outfit tracking-[0.06em] text-[#0E0A1F] text-[14px] mb-4">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.co_Name1 || 'No Data'}
          </div>

          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Martial Status</div>
          <div className="font-medium font-outfit tracking-[0.06em] text-[#0E0A1F] text-[14px] mb-4">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.marital1?.value}
          </div>

          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">DOB</div>
          <div className="font-medium font-outfit tracking-[0.06em] text-[#0E0A1F] text-[14px]">
            {prettyDate(leadDetailsObj2?.secondaryCustomerDetailsObj?.dob1 || datee)}
          </div>
        </div>

        <div className=" col-span-1">

          <div className='px-4 border-l border-r border-gray-200'>
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">PAN Card</div>
          <div className="font-medium font-outfit text-[#0E0A1F] text-[14px] tracking-[0.06em] mb-4">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.panNo1 || 'No Data'}
          </div>

          </div>




          <div className='px-4 border-l border-r border-gray-200'>
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Aadhar Card</div>
          <div className="font-medium text-[14px] text-[#0E0A1F] tracking-[0.06em] font-outfit mb-4">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.aadharNo1 || 'No Data'}
          </div>

</div>

 

          <div className='px-4 border-l border-r border-gray-200'>
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Secondary No</div>
          <div className="font-medium font-outfit text-[#0E0A1F] tracking-[0.06em] text-[14px]">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.phoneNo3 || 'No Data'}
          </div>

</div>

 
        </div>

        <div className="pl-4 col-span-2">
          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Current Address</div>
          <div className="font-medium text-[#0E0A1F] font-outfit text-[14px] mb-4 tracking-[0.06em] break-words whitespace-pre-wrap">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.address1 || 'No Data'}
          </div>

          <div className="font-outfit font-normal text-[12px] leading-[100%] mb-1 text-[#606062] tracking-[0.72px]">Permanent Address</div>
          <div className="font-medium text-[#0E0A1F] font-outfit text-[14px] tracking-[0.06em] break-words whitespace-pre-wrap">
            {leadDetailsObj2?.secondaryCustomerDetailsObj?.address2p || 'No Data'}
          </div>
        </div>
      </div>
    </div>
  </div>





</div>


</div>


  </div>
</div>


    </>
  )
}

export default ShowCustomerDetails
