/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { DownloadIcon } from '@heroicons/react/solid'
import ClockIcon from '@heroicons/react/solid/ClockIcon'
import { setHours, setMinutes } from 'date-fns'
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import {
  addLeadScheduler,
  deleteSchLog,
  steamLeadActivityLog,
  steamLeadScheduleLog,
  steamUsersListByRole,
  updateSchLog,
  addLeadNotes,
  steamLeadNotes,
  createAttach,
  getCustomerDocs,
  getAllProjects,
  updateLeadProject,
  getFinanceForUnit,
  streamGetAllUnitTransactions,
  updateUnitStatus,
  updateUnitStatusDates,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { db, storage } from 'src/context/firebaseConfig'
import {
  prettyDate,
  prettyDateTime,
  timeConv,
} from 'src/util/dateConverter'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import DocRow from '../LegalModule/Docu_row'
import 'react-datepicker/dist/react-datepicker.css'
import { useSnackbar } from 'notistack'
import SiderForm from '../SiderForm/SiderForm'
import CrmUnitSummary from './A_CrmUnitSummary'
import CrmUnitPsHome from './CustomerFinanceStatement'
import AddApplicantDetails from '../AddApplicantDetails'
import LoanApplyFlowHome from '../A_LoanModule/LoanApplyFlowHome'
import { supabase } from 'src/context/supabase'
import ShowCustomerDetails from './CrmShowCustomerDetails'
import CancelUnitForm from './A_UnitCancel.tsx/CancelUnitForm'
import UnitAudit from './A_Crm_UnitAudit/UnitAudit'
import UnblockUnitForm from './A_UnitUnblock/UnblockUnitForm'
import { Bed, Building2, Calendar, Compass, DollarSign, Home, Ruler, Square } from 'lucide-react'



import units1 from '../../../public/units1.png'
import units2 from '../../../public/units2.png'
import units3 from '../../../public/units3.png'
import units4 from '../../../public/units4.png'



import Dimensions from '../../../public/Dimensions.png'
import BrokerageDetails from './A_BrokerageDetails/BrokerageDetails'





// interface iToastInfo {
//   open: boolean
//   message: string
//   severity: AlertColor
// }
const people = [
  { name: 'Priority 1' },
  { name: 'Priority 2' },
  { name: 'Priority 3' },
  { name: 'Priority 4' },
]


const attachTypes = [
  { label: 'Select Document', value: '' },
  { label: 'Bank Cheque', value: 'bank_cheque' },
  { label: 'Booking Form', value: 'booking_form' },
  { label: 'Customer Aadhar', value: 'customer_aadhar' },
  { label: 'Co-Applicant Aadhar', value: 'co-applicant_Aadhar' },
  { label: 'Cancellation Form', value: 'cancellation_form' },
  { label: 'Cost Sheet', value: 'cost_sheet' },
  // { label: 'Follow Up', value: 'followup' },
  { label: 'Estimation Sheet', value: 'estimation_sheet' },
  { label: 'Payment Screenshot (IMPS/RTGS/NEFT)', value: 'payment_screenshot' },
  { label: 'Payment Receipt', value: 'payment_receipt' },
  { label: 'Others', value: 'others' },

  // { label: 'RNR', value: 'rnr' },
  // { label: 'Dead', value: 'Dead' },
]

const notInterestOptions = [
  { label: 'Select Document', value: '' },
  { label: 'Budget Issue', value: 'budget_issue' },
  { label: 'Looking for Different Property', value: 'differeent_options' },

  { label: 'Others', value: 'others' },

  // { label: 'Follow Up', value: 'followup' },
  // { label: 'RNR', value: 'rnr' },
  // { label: 'Dead', value: 'Dead' },
]
export default function UnitFullSummary({
  openUserProfile,
  rustomerDetails,
  unitViewerrr,
  unitsViewMode,
  setUnitsViewMode,
  transactionData,
  customerDetails,
  selCustomerPayload,
  selSubMenu,
  selSubMenu2,
  source,

}) {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const { orgId } = user
  const [fetchedUsersList, setfetchedUsersList] = useState([])

  const [usersList, setusersList] = useState([])

  // const [leadStatus, setLeadStatus] = useState([])
  const [selFeature, setFeature] = useState('summary')
  const [tempLeadStatus, setLeadStatus] = useState('')
  const [assignerName, setAssignerName] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [leadsActivityFetchedData, setLeadsFetchedActivityData] = useState([])
  const [customerInfo, setCustomerInfo] = useState({})

  const [leadSchFetchedData, setLeadsFetchedSchData] = useState([])
  const [leadNotesFetchedData, setLeadsFetchedNotesData] = useState([])
  const [unitTransactionsA, setUnitTransactionsA] = useState([])
  const [leadSchFilteredData, setLeadsFilteredSchData] = useState([])
  const [takTitle, setTakTitle] = useState('')
  const [takNotes, setNotesTitle] = useState('')
  const [attachType, setAttachType] = useState('')
  const [notInterestType, setNotInterestType] = useState('')
  const [attachTitle, setAttachTitle] = useState('')
  const [filterData, setFilterData] = useState([])
  const [docsList, setDocsList] = useState([])
  const [progress, setProgress] = useState(0)
  const [openCapturePayment, setOpenCapturePayment] = useState(false)
  const [openApplicantEdit, setShowApplicantEdit] = useState(false)

  const d = new window.Date()
  const [value, setValue] = useState(d)

  // const [startDate, setStartDate] = useState(d)
  const [startDate, setStartDate] = useState(setHours(setMinutes(d, 30), 16))
  const [selected, setSelected] = useState(people[0])
  const [taskDetails, setTaskDetails] = useState('')
  const [schPri, setSchPri] = useState(1)
  const [schTime, setSchTime] = useState()
  const [schStsA, setschStsA] = useState([])
  const [schStsMA, setschStsMA] = useState([])
  const [selFilterVal, setSelFilterVal] = useState('pending')
  const [addNote, setAddNote] = useState(false)
  const [addSch, setAddSch] = useState(false)
  const [attach, setAttach] = useState(false)
  const [loader, setLoader] = useState(false)
  const [projectList, setprojectList] = useState([])
  const [financeMode, setFinanceMode] = useState('transactions')

  const [selProjectIs, setSelProjectIs] = useState({
    projectName: '',
    uid: '',
  })

  const [leadDetailsObj, setLeadDetailsObj] = useState({})
  const {
    id,
    Name,
    Project,
    ProjectId,
    Source,
    Status,
    by,
    Mobile,

    Email,
    Assigned,
    AssignedBy,
    Notes,
    Timeline,
    attachments,
    mode,
    chequeno,
    dated,
    amount,
    fromObj,
    toAccount,
    stsUpT,
    assignT,
    CT,
  } = customerDetails

  const totalIs = 0
  useEffect(() => {
    const count = projectList.filter(
      (dat) => dat.uid == selCustomerPayload?.pId
    )

    console.log('myData is ', selCustomerPayload?.pId, projectList)
    if (count.length > 0) {
      setSelProjectIs(count[0])
      console.log('myData is ', selProjectIs, count[0])
    }

    console.log(
      'myData is ',
      customerDetails,
      selCustomerPayload,
      selSubMenu,
      projectList,
      selProjectIs
    )
  }, [projectList])


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
    if (selSubMenu) {
      console.log('new setValue is ', selSubMenu)
      setFeature(selSubMenu)
    } else {
      console.log('new setValue is ', selSubMenu)
      setFeature('summary')
    }
    console.log('new setValue is ', selSubMenu)
  }, [selSubMenu])

  useEffect(() => {
    let x = []
    if (selFilterVal === 'all') {
      x = leadSchFetchedData.filter((d) => d?.schTime != undefined)
    } else {
      x = leadSchFetchedData.filter(
        (d) => d?.schTime != undefined && d?.sts === selFilterVal
      )
    }
    setLeadsFilteredSchData(x)
  }, [leadSchFetchedData, selFilterVal])
  useEffect(() => {
    setAssignedTo(customerDetails?.assignedTo)
    setAssignerName(customerDetails?.assignedToObj?.label)
    setSelProjectIs({ projectName: Project, uid: ProjectId })

    setLeadStatus(Status)
    console.log('assinger to yo yo', customerDetails)
  }, [customerDetails])
  // adopt this
  useEffect(() => {
    // setFilterData
    let fet = 'notes'
    if (selFeature === 'notes') {
      getLeadNotesFun()
      fet = 'notes'
    } else if (selFeature === 'phone') {
      fet = 'ph'
    } else if (selFeature === 'attachments') {
      fet = 'attach'
    } else if (selFeature === 'appointments') {
      fet = 'appoint'
    } else if (selFeature === 'timeline') {
      fet = 'status'
    }

    if (fet === 'appoint') {
      return
    } else {
      leadsActivityFetchedData.map((data) => {
        console.log('value of filtered feature count before', data)
      })
      let x = []
      if (selFeature != 'timeline') {
        x = leadsActivityFetchedData.filter((data) => data.type === fet)
      } else {
        x = leadsActivityFetchedData
      }
      console.log(
        'value of filtered feature count is wow it ',
        leadsActivityFetchedData,
        x.length
      )
      setFilterData(x)
    }
  }, [leadsActivityFetchedData, selFeature])

  useEffect(() => {
    getLeadsDataFun()
  }, [])

  useEffect(() => {
    getCustomerDocsFun()
    getProjectsListFun()
  }, [])

  const getCustomerDocsFun = () => {
    const unsubscribe = getCustomerDocs(
      orgId,
      id,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        console.log('user docs list fetched are', projects)
        setDocsList(projects)
      },
      () => setDocsList([])
    )
    return unsubscribe
  }

  const getProjectsListFun = () => {
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
        console.log('fetched proejcts list is', projectsListA)
        setprojectList(projectsListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
  }
  useEffect(() => {
    const subscription = supabase
      .from(`${orgId}_accounts`)
      .on('*', (payload) => {
        console.log('account records', payload)
        const updatedData = payload.new
        const { id } = payload.old
        const updatedLeadLogs = [...unitTransactionsA]
        setUnitTransactionsA((prevLogs) => {
          const existingLog = prevLogs.find(
            (log) => log.id === id && log.unit_id === selCustomerPayload?.id
          )

          if (existingLog) {
            console.log('Existing record found!')
            const updatedLogs = prevLogs.map((log) =>
              log.id === id ? payload.new : log
            )
            return [...updatedLogs]
          } else {
            console.log('New record added!')
            return [...prevLogs]
          }
        })

      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])
  useEffect(() => {
    getAllTransactionsUnit()
  }, [])

  const getAllTransactionsUnit = async () => {
    const { access, uid } = user

    const steamLeadLogs = await streamGetAllUnitTransactions(
      orgId,
      'snap',
      {
        unit_id: selCustomerPayload?.id,
      },
      (error) => []
    )
    await setUnitTransactionsA(steamLeadLogs)
    return

    console.log('transactions id is ', selCustomerPayload?.uid)
    const unsubscribe = getFinanceForUnit(
      orgId,
      async (querySnapshot) => {
        const transactionsListRaw = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        // setBoardData
        console.log('my Array data is ', transactionsListRaw)

        await setUnitTransactionsA(transactionsListRaw)
        await console.log('my Array data is set it')
      },
      {
        unitId: selCustomerPayload?.id,
      },
      () => setUnitTransactionsA([])
    )
    return unsubscribe
  }
  useEffect(() => {
    setLeadStatus(Status?.toLowerCase())
  }, [customerDetails])

  const setAssigner = (leadDocId, value) => {
    setAssignerName(value.name)
    setAssignedTo(value.value)

  }
  const setNewProject = (leadDocId, value) => {
    console.log('sel pROJECT DETAILS ', value)


    const x = {
      Project: value.projectName,
      ProjectId: value.uid,
    }
    setSelProjectIs(value)
    updateLeadProject(orgId, leadDocId, x)
  }

  const setStatusFun = async (leadDocId, newStatus) => {
    setLoader(true)
    setLeadStatus(newStatus)

    const arr = ['notinterested', 'visitdone', 'visitcancel']
    arr.includes(newStatus) ? setFeature('notes') : setFeature('appointments')
    arr.includes(newStatus) ? setAddNote(true) : setAddSch(true)
    if (newStatus === 'visitfixed') {
      await setTakTitle('Schedule a cab ')
    } else if (newStatus === 'booked') {
      await setTakTitle('Share the Details with CRM team')
      await fAddSchedule()
    } else {
      setTakTitle(' ')
    }


  }

  const downloadFile = (url) => {
    window.location.href = url
  }
  const getLeadsDataFun = async () => {
    if (id == undefined) return
    console.log('ami triggered')
    const unsubscribe = steamLeadActivityLog(
      orgId,
      (doc) => {
        console.log('my total fetched list is yo yo ', doc.data())
        const usersList = doc.data()
        const usersListA = []

        Object.entries(usersList).forEach((entry) => {
          const [key, value] = entry
          usersListA.push(value)
          console.log('my total fetched list is 3', `${key}: ${value}`)
        })


        console.log('my total fetched list is', usersListA.length)
        setLeadsFetchedActivityData(usersListA)
      },
      {
        uid: id,
      },
      (error) => setLeadsFetchedActivityData([])
    )

    //  lead Schedule list
    steamLeadScheduleLog(
      orgId,
      (doc) => {
        console.log('my total fetched list is 1', doc.data())
        const usersList = doc.data()
        const usersListA = []
        if (usersList == undefined) return
        const sMapStsA = []
        console.log('this is what we found', usersList?.staA)
        setschStsA(usersList?.staA || [])
        setschStsMA(usersList?.staDA || [])

        Object.entries(usersList).forEach((entry) => {
          const [key, value] = entry
          if (['staA', 'staDA'].includes(key)) {
            if (key === 'staA') {
            } else if (key === 'staDA') {
            }
          } else {
            usersListA.push(value)

          }
        })


        console.log('my total fetched list is', usersListA.length)
        usersListA.sort((a, b) => {
          return b.ct - a.cr
        })
        setLeadsFetchedSchData(
          usersListA.sort((a, b) => {
            return a.ct - b.ct
          })
        )
      },
      {
        uid: id,
      },
      (error) => setLeadsFetchedSchData([])
    )

    return unsubscribe
  }
  const getLeadNotesFun = async () => {
    console.log('ami triggered')
    const unsubscribe = steamLeadNotes(
      (doc) => {
        console.log('my total fetched list is yo yo ', doc.data())
        const usersList = doc.data()
        const usersListA = []

        Object.entries(usersList).forEach((entry) => {
          const [key, value] = entry
          usersListA.push(value)
          console.log('my total fetched list is 3', `${key}: ${value}`)
        })
        console.log('my total notes list is ', usersListA)
        setLeadsFetchedNotesData(usersListA)
      },
      {
        uid: id,
      },
      (error) => setLeadsFetchedActivityData([])
    )
    return unsubscribe
  }
  const fAddSchedule = async () => {
    console.log('start time is ', startDate)
    const data = {
      by: user.email,
      type: 'schedule',
      pri: selected?.name,
      notes: takTitle,
      sts: 'pending',
      schTime:
        tempLeadStatus === 'booked'
          ? Timestamp.now().toMillis() + 10800000
          : startDate.getTime(),
      ct: Timestamp.now().toMillis(),
    }

    const x = schStsA

    console.log('new one ', schStsA, x)
    x.push('pending')
    setschStsA(x)
    // addSchedulerLog(id, data)
    console.log('new one ', schStsA)
    await addLeadScheduler(orgId, id, data, schStsA, '')
    if (Status != tempLeadStatus) {
    }
    await setTakTitle('')
    await setAddSch(false)
    await setLoader(false)
  }
  const cancelResetStatusFun = () => {
    setAddSch(false)
    setAddNote(false)
    // if its not edit mode ignore it
    setLeadStatus(Status)
    setLoader(false)
  }

  const handleColor = (time) => {
    return time.getHours() > 12 ? 'text-success' : 'text-error'
  }

  const openPaymentFun = () => {
    setOpenCapturePayment(true)
  }
  const doneFun = (data) => {
    console.log('clicked schedule is', data)
    const inx = schStsMA.indexOf(data.ct)
    const x = schStsA
    x[inx] = 'completed'
    setschStsA(x)

    updateSchLog(orgId, id, data.ct, 'completed', schStsA)
  }
  const delFun = (data) => {
    console.log('clicked schedule is', data)
    const inx = schStsMA.indexOf(data.ct)
    const x = schStsA
    const y = schStsMA
    x.splice(inx, 1)
    y.splice(inx, 1)
    setschStsA(x)
    setschStsMA(y)

    deleteSchLog(orgId, id, data.ct, 'completed', schStsA, schStsMA)
  }

  const selFun = () => {
    console.log('i was selcted')
    setAddNote(true)
  }

  const showAddAttachF = () => {
    setAttach(true)
  }

  const fAddNotes = async () => {
    console.log('start time is ', startDate)
    const data = {
      by: user.email,
      type: 'notes',
      notes: takNotes,
      ct: Timestamp.now().toMillis(),
    }

    await addLeadNotes(orgId, id, data)
    await setNotesTitle('')
    await setAddNote(false)
  }

  const docUploadHandler = async (e) => {
    e.preventDefault()
    console.log('filer upload stuff', e.target[0].files[0])
    uploadStuff(e.target[0].files[0])
  }

  const uploadStuff = async (file) => {
    if (!file) return
    try {
      const uid = uuidv4()
      const storageRef = ref(storage, `/spark_files/${Name}_${uid}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100

          setProgress(prog)
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            createAttach(orgId, url, by, file.name, id, attachType)
            console.log('file url i s', url)
            //  save this doc as a new file in spark_leads_doc
          })
        }
      )
    } catch (error) {
      console.log('upload error is ', error)
    }
  }





  const [editableEvent, setEditableEvent] = useState(null);
  const [editedDate, setEditedDate] = useState('');

  const events = [
    { event: 'Booked', key: 'booked_on' },
    { event: 'Allotment', key: 'alloted_on' },
    { event: 'Agreement', key: 'ats_date' },
    { event: 'Registered', key: 'sd_date' },
    { event: 'Possession', key: 'possession_on' },
  ];



  const handleEdit = (key) => {
    setEditableEvent(key)
    setEditedDate(customerDetails[key] || '')
  }







  const handleSave = async (key) => {
    try {
      console.log('date is',editedDate )
      const dateTimestamp = new Date(editedDate).getTime()

      const updatedDetails = {
        ...customerDetails,
        [key]: dateTimestamp
      }
      updateUnitStatusDates(
          orgId,
          selCustomerPayload?.id,
          {key, time: dateTimestamp, oldDate:customerDetails[key] || 0 },
          user.email,
          enqueueSnackbar
        )
        customerDetails[key] = dateTimestamp

        setEditableEvent(null)


        enqueueSnackbar('Date updated successfully', {
          variant: 'success'
        })
        return;
      const unitDocRef = doc(db, `${orgId}_units`, customerDetails.id)
      await updateDoc(unitDocRef, {
        [key]: dateTimestamp,
        [`${key}_updated_by`]: user.email,
        [`${key}_updated_at`]: new Date().getTime()
      })


      customerDetails[key] = dateTimestamp

      setEditableEvent(null)


      enqueueSnackbar('Date updated successfully', {
        variant: 'success'
      })
    } catch (error) {
      console.error('Error updating date:', error)
      enqueueSnackbar('Error updating date', {
        variant: 'error'
      })
    }
  }


  const handleCancel = () => {
    setEditableEvent(null);
    setEditedDate('');
  };






  return (
    //bg-[#F9F9FA]
    <div
      className={`bg-[#fff]    rounded-md h-screen      `}
    >
<section className="flex flex-row-reverse	">
    <div className='w-full'>
      <div className="rounded-t bg-[#F1F5F9] mb-0 px-3">
        <>

          {selFeature === 'attachments' && (
            <div className="border px-4 bg-[#F6F7FF]">
              {docsList.length === 0 && (
                <div className="py-8 px-8 flex flex-col items-center mt-6">
                  <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                    <img
                      className="w-[80px] h-[80px] inline"
                      alt=""
                      src="/empty-dashboard.svg"
                    />
                  </div>
                  <h3 className="mb-1 text-xs font-semibold text-gray-900 ">
                    No Attachments
                  </h3>
                  <button onClick={() => showAddAttachF()}>
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400 ">
                      Better always attach a string
                      <span className="text-blue-600 text-xs">
                        {' '}
                        Add Dcoument
                      </span>
                    </time>
                  </button>
                </div>
              )}

              {attach && (
                <div className="flex justify-center mt-4">
                  <div className="mb-3 w-96 px-10 bg-[#FFF9F2] rounded-md py-3 pb-6">
                    <div className="w-full flex flex-col mb-3 mt-2">
                      <CustomSelect
                        name="source"
                        label="Document Type *"
                        className="input mt-3"
                        onChange={(value) => {
                          setAttachType(value.value)
                        }}
                        value={attachType}
                        options={attachTypes}
                      />
                    </div>
                    <label
                      htmlFor="formFile"
                      className="form-label inline-block mb-2  font-regular text-sm "
                    >
                      Upload file
                    </label>
                    <form onSubmit={docUploadHandler}>
                      <input
                        className="form-control
    block
    w-full
    px-3
    py-1.5
    text-base
    font-normal
    text-gray-700
    bg-white bg-clip-padding
    border border-solid border-gray-300
    rounded
    transition
    ease-in-out
    m-0
    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        type="file"
                        id="formFile"
                      />
                      <div className="flex flex-row mt-3">
                        <button
                          // onClick={() => fAddSchedule()}
                          type="submit"
                          className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
                        >
                          <span className="ml-1 ">Upload</span>
                        </button>
                        <button
                          // onClick={() => fSetLeadsType('Add Lead')}
                          onClick={() => setAttach(false)}
                          className={`flex mt-2 ml-4  rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700  `}
                        >
                          <span className="ml-1 ">Cancel</span>
                        </button>
                      </div>
                    </form>

                    {/* <h3> {progress}</h3> */}
                  </div>
                </div>
              )}

              {docsList.length > 0 && (
                <div className="py-8">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight">
                      Customer attachments
                    </h2>
                    <button onClick={() => showAddAttachF()}>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                        <span className="text-blue-600"> Add Dcoument</span>
                      </time>
                    </button>
                  </div>
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Name
                            </th>

                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Created On / By
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {docsList.map((dat, i) => {
                            return (
                              <tr key={i} className=" border-b">
                                <td className="px-5 py-5 bg-white text-sm ">
                                  <div className="flex">
                                    <div className="">
                                      <p className="text-gray-900 whitespace-no-wrap overflow-ellipsis">
                                        {dat.name}
                                      </p>
                                      <p className="text-blue-600 whitespace-no-wrap">
                                        {dat.type}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-5 bg-white text-sm ">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {prettyDate(dat.cTime)}
                                  </p>
                                  <p className="text-gray-600 whitespace-no-wrap overflow-ellipsis">
                                    {dat.by}
                                  </p>
                                </td>
                                <td className="px-5 py-5 bg-white text-sm">
                                  <>


                                    <DownloadIcon
                                      onClick={() => downloadFile(dat.url)}
                                      className="w-5 h-5 text-gray-400 ml-3 cursor-pointer"
                                      aria-hidden="true"
                                    />
                                  </>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {selFeature === 'tasks' && (
            <div className="py-8 px-8 flex flex-col items-center">
              <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                <img
                  className="w-[200px] h-[200px] inline"
                  alt=""
                  src="/all-complete.svg"
                />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                You are clean
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                Sitback & Relax <span className="text-blue-600">Add Task</span>
              </time>
            </div>
          )}

          {selFeature === 'timeline' && (
            <div className="py-8 px-8  border bg-[#F6F7FF]">
              {filterData.length == 0 && (
                <div className="py-8 px-8 flex flex-col items-center">
                  <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                    <img
                      className="w-[80px] h-[80px] inline"
                      alt=""
                      src="/templates.svg"
                    />
                  </div>
                  <h3 className="mb-1 text-xs font-semibold text-gray-900 ">
                    Timeline is Empty
                  </h3>
                  <time className="block mb-2 text-xs font-normal leading-none text-gray-400 ">
                    This scenario is very rare to view
                  </time>
                </div>
              )}
              <div className="font-md font-medium text-xs mb-4 text-gray-800">
                Timelines
              </div>
              <ol className="relative border-l border-gray-200 ">
                {filterData.map((data, i) => (
                  <section key={i} className="">
                    <a
                      href="#"
                      className="block items-center p-3 sm:flex hover:bg-gray-100 "
                    >
                      {/* <PlusCircleIcon className="mr-3 mb-3 w-10 h-10 rounded-full sm:mb-0" /> */}
                      {data?.type == 'status' && (
                        <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white  ">
                          <svg
                            className="w-3 h-3 text-blue-600 \"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      )}
                      {data?.type == 'ph' && (
                        <>
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-green-200 rounded-full ring-8 ring-white ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-blue-600 "
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </span>
                          <div className="text-gray-600  m-3">
                            <div className="text-base font-normal">
                              <span className="font-medium text-green-900 ">
                                {'Rajiv'}
                              </span>{' '}
                              called{' '}
                              <span className="text-sm text-red-900 ">
                                {Name}
                              </span>{' '}
                            </div>
                            <div className="text-sm font-normal">
                              {data?.txt}
                            </div>
                            <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                              <ClockIcon className="mr-1 w-3 h-3" />
                              {data?.type == 'ph'
                                ? timeConv(Number(data?.time)).toLocaleString()
                                : timeConv(data?.T).toLocaleString()}
                              {'    '}
                              <span className="text-red-900 ml-4 mr-4">
                                {Number(data?.duration)} sec
                              </span>
                              or
                              <span className="text-red-900 ml-4">
                                {parseInt(data?.duration / 60)} min
                              </span>
                            </span>
                          </div>
                        </>
                      )}
                      {data?.type != 'ph' && (
                        <div className="text-gray-600  m-3">
                          <div className="text-base font-normal">
                            <span className="font-medium text-green-900 ">
                              {data?.type?.toUpperCase()}
                            </span>{' '}
                            set by{' '}
                            <span className="text-sm text-red-900 ">
                              {data?.by}
                            </span>{' '}
                          </div>
                          <div className="text-sm font-normal">{data?.txt}</div>
                          <span className="inline-flex items-center text-xs font-normal text-gray-500 ">


                            <ClockIcon className="mr-1 w-3 h-3" />
                            {data?.type == 'ph'
                              ? timeConv(Number(data?.time)).toLocaleString()
                              : timeConv(data?.T).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </a>
                  </section>
                ))}
              </ol>
            </div>
          )}
        </>
      </div>


{selFeature === 'applicant_info' && (
  <>
    {!openApplicantEdit && (
      <div className="mt-2 pb-[250px] overflow-auto no-scrollbar h-[100%] overflow-y-scroll">
        <ShowCustomerDetails
          source="fromBookedUnit"
          title="Booking Form"
          selUnitDetails={selCustomerPayload}
          leadDetailsObj2={selCustomerPayload}
          setShowApplicantEdit={setShowApplicantEdit}
        />
      </div>
    )}
    {openApplicantEdit && (
      <div className="mt-2 h-full flex flex-col justify-between overflow-auto no-scrollbar">
        <div className="flex-1 overflow-y-auto">
          <AddApplicantDetails
            source="fromBookedUnit"
            title="Booking Form"
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            selUnitDetails={selCustomerPayload}
            leadDetailsObj2={selCustomerPayload}
            setShowApplicantEdit={setShowApplicantEdit}
          />
        </div>

        <div className="flex justify-end mt-2 p-4">
          <button
            className="w-[80px] bg-[#8b5cf6] px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-sm hover:shadow-lg hover:bg-green-500"
            onClick={() => setShowApplicantEdit(false)}
          >
            Back
          </button>
        </div>
      </div>
      )}
     </>
   )}

      {selFeature === 'unit_information' && (
        <>
          <div className="">
            <div className="">



            </div>


            <div className="">


            {(customerDetails?.projectType?.name === 'Villas' || customerDetails?.projectType?.name === 'Apartment') && (


<section className="flex flex-col  bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md ">


  <div className="flex items-center mb-2">
    <div className="border-l-4 border-[#57C0D0] pl-2 text-sm font-semibold text-gray-700">Details
    </div>
  </div>

  <section className="grid grid-cols-2 ">
    <div className="text-start">
      <div className="text-base font-semibold text-slate-900">{selCustomerPayload?.Bedrooms_D}

      </div>
      <div className="text-xs text-gray-500">BedRooms
      </div>
    </div>
    <div className="text-start">
      <div className="text-base font-semibold text-slate-900">{selCustomerPayload?.BathRooms_D?.toLocaleString('en-IN')}

      </div>
      <div className="text-xs text-gray-500">Bathrooms</div>
    </div>
    <div className="text-start">
      <div className="text-base font-semibold text-slate-900">{selCustomerPayload?.Car_Parking_D}

      </div>
      <div className="text-xs text-gray-500">Car Parking
      </div>
    </div>
    <div className="text-start">
      <div className="text-base font-semibold text-slate-900">{selCustomerPayload?.Carpet_Area_D?.toLocaleString('en-IN')}


      </div>
      <div className="text-xs text-gray-500">Carpet Area Sqft
      </div>
    </div>

  </section>
</section>

                )}


              </div>



          </div>





          <div className="h-[68%]  mx-4 bg-[#f0f1ff] grid grid-cols-3 gap-2 rounded-lg border border-gray-100 p-4">





          <div className="w-full max-w-[400px]   h-[200px] shadow-md  rounded-[10px]   bg-white  pt-4  ">
        <h2 className="text-[13px] font-semibold ml-10 text-[#3D3D3D]  ">
          Unit Details
        </h2>
        <div className='border-b my-4 mt-2 border-[#f1f1f1]'></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 mx-8 items-center">

          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
            <img src={units1}  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"  />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.unit_no}</div>
              <div className="text-xs  font-medium text-[#949494]">Unit No</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
            <img src={units2}  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"  />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate">{selCustomerPayload?.area?.toLocaleString('en-IN')}</div>
              <div className="text-xs  font-medium  text-[#949494]">Size (sqft)</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
            <img src={units3}  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"  />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.facing}</div>
              <div className="text-xs  font-medium  text-[#949494]">Facing</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
            <img src={units4}  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"  />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate">  {selCustomerPayload?.builtup_area?.toLocaleString('en-IN') || selCustomerPayload?.construct_area?.toLocaleString('en-IN')}</div>
              <div className="text-xs  font-medium   text-[#949494]">BUA (sqft)</div>
            </div>
          </div>
        </div>
      </div>



      <div className="w-full max-w-[400px] h-[200px] shadow-md rounded-[10px]  bg-white pt-4   ">
        <h2 className="text-[13px] font-semibold ml-10 text-[#3D3D3D]  ">
        Dimensions
        </h2>
        <div className='border-b my-4 mt-2 border-[#f1f1f1]'></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-8 ">

          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <img src={Dimensions} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />



            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize"> {selCustomerPayload?.east_d?.toLocaleString('en-IN')}</div>
              <div className="text-xs  font-medium   text-[#949494]">East</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
            <img src={Dimensions} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transform rotate-180" />

            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.west_d?.toLocaleString('en-IN')}</div>
              <div className="text-xs   font-medium  text-[#949494]">West</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
            <img src={Dimensions} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transform rotate-90" />

            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.south_d?.toLocaleString('en-IN')}</div>
              <div className="text-xs   font-medium  text-[#949494]">South</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
            <img
  src={Dimensions}
  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transform rotate-220"
/>

            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.north_d?.toLocaleString('en-IN')}</div>
              <div className="text-xs  font-medium   text-[#949494]">North</div>
            </div>
          </div>
        </div>
      </div>



<div className="w-full max-w-[400px] h-[200px] shadow-md rounded-[10px]  bg-white   pt-4 ">
  <h2 className="text-[13px] font-semibold ml-10 text-[#3D3D3D]">Schedule</h2>
  <div className="border-b my-4 mt-2 border-[#f1f1f1]"></div>

  <div className="grid grid-cols-1 md:grid-cols-2 mx-8 gap-6">

    <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
        <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.east_sch_by?.toLocaleString('en-IN')}</div>
        <div className="text-xs  text-[#949494]">East By</div>
      </div>
    </div>


    <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.west_sch_by?.toLocaleString('en-IN')}</div>
        <div className="text-xs  text-[#949494]">West By</div>
      </div>
    </div>



    <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.north_sch_by?.toLocaleString('en-IN')}</div>
        <div className="text-xs  text-[#949494]">North By</div>
      </div>
    </div>


    <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
        <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.south_sch_by?.toLocaleString('en-IN')}</div>
        <div className="text-xs  text-[#949494]">South By</div>
      </div>
    </div>


  </div>
</div>


      <div className="w-full max-w-[400px]  h-[200px] shadow-md rounded-[10px]   bg-white  pt-4 ">
        <h2 className="text-[13px] ml-10 font-semibold text-[#3D3D3D]  ">
        Additonal Details
        </h2>
        <div className='border-b my-4 mt-2 border-[#f1f1f1]'></div>

        <div className="grid grid-cols-1 mx-8 sm:grid-cols-2 gap-6 ">

          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.survey_no}</div>
              <div className="text-xs   font-medium  text-[#949494]">Survey No</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.Katha_no}</div>
              <div className="text-xs  font-medium   text-[#949494]">Katha No</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.PID_no}</div>
              <div className="text-xs   font-medium  text-[#949494]">PID No</div>
            </div>
          </div>


        </div>
      </div>


      <div className="w-full max-w-[400px] shadow-md  h-[200px]   bg-white  rounded-[10px]  pt-4 ">
        <h2 className="text-[13px] font-semibold ml-10 text-[#3D3D3D]  ">
        Status
        </h2>
        <div className='border-b my-4 mt-2 border-[#f1f1f1]'></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 mx-8 gap-4">

          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.status}</div>
              <div className="text-xs  font-medium  text-[#949494]">Unit Status</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.release_status?.toLocaleString('en-IN')}</div>
              <div className="text-xs  font-medium  text-[#949494]">Status</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.mortgage_type}</div>
              <div className="text-xs  font-medium  text-[#949494]">Mortgage</div>
            </div>
          </div>


          <div className="flex items-center space-x-3 p-2 sm:p-0 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#000000] font-normal truncate capitalize">{selCustomerPayload?.sharing}</div>
              <div className="text-xs   font-medium  text-[#949494]">Sharing</div>
            </div>
          </div>




        </div>
      </div>


      {/* box 6 */}





    </div>



<div className="flex flex-col bg-[#f0f1ff] rounded-lg p-3 mt-2 mx-4">
      <div className="flex flex-row">
        <img
          src="https://static.ambitionbox.com/static/benefits/WFH.svg"
          alt=""
        />
        <h1 className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-3 ml-1">
          Dates
        </h1>
      </div>

      <div className="relative col-span-12 pl-6 space-y-2 sm:col-span-9 mt-1">
        <ol className="items-center sm:flex">
          {events.map((d, i) => (
            <li key={i} className="relative mb-6 sm:mb-0">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-[#E5E7EB] rounded-full ring-0 ring-[#DDD6FE] sm:ring-8 shrink-0">
                  <svg
                    className="w-2.5 h-2.5 text-blue-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <div className="hidden sm:flex w-full bg-[#E5E7EB] h-0.5"></div>
              </div>

              <div className="mt-3 sm:pe-8 bg-white p-3 rounded-lg mr-2">
                <h4 className="text-gray-900 text-[13px]">
                  {d.event}
                </h4>



{editableEvent === d.key ? (
      <div>
        <input
          type="date"
          className="border border-gray-300 rounded-md p-1 text-sm"
          value={editedDate}
          onChange={(e) => setEditedDate(e.target.value)}
        />
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => handleSave(d.key)}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <time className="block mb-2 text-[10px] font-normal leading-none text-gray-500 mt-1">
        On: {customerDetails[d.key]
          ? prettyDate(Number(customerDetails[d.key])).toLocaleString()
          : 'Not Available'}
      </time>
    )}




             { !(editableEvent === d.key) &&  <button
                  onClick={() => handleEdit(d.key)}
                  className="text-blue-500 text-sm mt-1"
                >
                  Edit
                </button>
}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>











        </>
      )}












      {selFeature === 'summary' && (


        <div className=" pb-[250px] overflow-auto no-scrollbar  h-[100%] overflow-y-scroll">
          <CrmUnitSummary
            selCustomerPayload={selCustomerPayload}
            assets={selCustomerPayload?.assets}
            totalIs={totalIs}
            unitTransactionsA={unitTransactionsA}

          />
        </div>
      )}








      {['finance_info'].includes(selFeature) && (
        <>
          <div className="py-3 px-3 pb-[250px] m-4 mt-2 rounded-lg border border-gray-100 h-[100%] overflow-y-scroll">
            <CrmUnitPsHome
              financeMode={financeMode}
              setFinanceMode={setFinanceMode}
              selCustomerPayload={selCustomerPayload}
              assets={selCustomerPayload?.assets}
              totalIs={totalIs}
              unitTransactionsA={unitTransactionsA}
            />
          </div>

        </>
      )}






      {selFeature === 'loan_info' && <LoanApplyFlowHome customerDetails={customerDetails} />}
      {selFeature === 'agreement_info' && (
        <section className="bg-white w-full md:px-10 md:mb-20">
          <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
            <div className="flex p-4 items-center justify-between">
              <div className="flex flex-row">
                <h2 className="font-medium flex-grow">Unit Document</h2>
                <span
                  className=" ml-2 text-blue-500 hover:underline"
                  onClick={() => {
                    setSliderInfo({
                      open: true,
                      title: 'legal_doc_upload',
                      sliderData: {},
                      widthClass: 'max-w-xl',
                    })
                  }}
                >
                </span>
              </div>
              <p className="mr4">Date Created</p>
            </div>
          </div>
          {[
            { id: 1234, name: 'EC', time: '22-Nov-2022' },
            {
              id: 1235,
              name: 'Agreement',
              time: '24-Nov-2022',
            },
            {
              id: 1236,
              name: 'Register Doc',
              time: '2-Dec-2022',
            },
          ].length === 0 ? (
            <div className="w-full text-center py-5">No documents</div>
          ) : (
            ''
          )}
          {[
            { id: 1234, name: 'EC',type: 'ec',time: customerDetails?.ecDocUpDate, url: customerDetails?.ecDocUrl , filName: customerDetails?.ecFilName },
            {
              id: 1235,
              name: 'Agreement',
              type: 'agree',
              time: customerDetails?.agreeDocUpDate, url: customerDetails?.agreeDocUrl , filName: customerDetails?.agreeFilName,
            },
            {
              id: 1236,
              name: 'Register Doc',
              type: 'reg',
              time: customerDetails?.regDocUpDate, url: customerDetails?.regDocUrl , filName: customerDetails?.regFilName,
            },
          ]?.map((doc, i) => (
            <section
              key={i}

            >
              <DocRow  key={i} data={doc} id={customerDetails?.id} fileName={doc?.name} date={doc?.time}  />
            </section>
          ))}
        </section>
      )}

      {selFeature === 'legal_info' && <></>}


      {selFeature === 'brokerage_info' && <>

<BrokerageDetails openUserProfile={openUserProfile} selUnitDetails={selCustomerPayload} /> </>}





      {selFeature === 'cancel_booking' && <>

      <CancelUnitForm openUserProfile={openUserProfile} selUnitDetails={selCustomerPayload} /> </>}

      {selFeature === 'unblock_Unit' && <>

<UnblockUnitForm openUserProfile={openUserProfile} selUnitDetails={selCustomerPayload} /> </>}

      {selFeature === 'unit_audit' && <>

<UnitAudit selUnitDetails={selCustomerPayload} /> </>}
      </div>

      <div className="w-[250px] min-w-[250px] h-full  rounded-r-md overflow-auto">
            <div className="">


<div className="  border border-[#F3F4F6]  py-4 bg-[#fff]  rounded-md  bg-gradient-r to-[#EDEDED] from-[#EDEDED] ">
                <ul
                  className="flex flex-col"
                  id="myTab"
                  data-tabs-toggle="#myTabContent"
                  role="tablist"
                >
                  {[

                     {  icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.64648 6.53467C2.64648 4.64905 2.64648 3.70624 3.23227 3.12046C3.81805 2.53467 4.76086 2.53467 6.64648 2.53467C8.5321 2.53467 9.47491 2.53467 10.0607 3.12046C10.6465 3.70624 10.6465 4.64905 10.6465 6.53467V8.53467C10.6465 10.4203 10.6465 11.3631 10.0607 11.9489C9.47491 12.5347 8.5321 12.5347 6.64648 12.5347C4.76086 12.5347 3.81805 12.5347 3.23227 11.9489C2.64648 11.3631 2.64648 10.4203 2.64648 8.53467V6.53467Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M2.64648 19.5347C2.64648 18.6028 2.64648 18.1369 2.79872 17.7693C3.00171 17.2793 3.39106 16.8899 3.88111 16.6869C4.24866 16.5347 4.7146 16.5347 5.64648 16.5347H7.64648C8.57836 16.5347 9.0443 16.5347 9.41185 16.6869C9.9019 16.8899 10.2913 17.2793 10.4942 17.7693C10.6465 18.1369 10.6465 18.6028 10.6465 19.5347C10.6465 20.4666 10.6465 20.9325 10.4942 21.3001C10.2913 21.7901 9.9019 22.1795 9.41185 22.3825C9.0443 22.5347 8.57836 22.5347 7.64648 22.5347H5.64648C4.7146 22.5347 4.24866 22.5347 3.88111 22.3825C3.39106 22.1795 3.00171 21.7901 2.79872 21.3001C2.64648 20.9325 2.64648 20.4666 2.64648 19.5347Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M14.6465 16.5347C14.6465 14.6491 14.6465 13.7063 15.2323 13.1205C15.8181 12.5347 16.7609 12.5347 18.6465 12.5347C20.5321 12.5347 21.4749 12.5347 22.0607 13.1205C22.6465 13.7063 22.6465 14.6491 22.6465 16.5347V18.5347C22.6465 20.4203 22.6465 21.3631 22.0607 21.9489C21.4749 22.5347 20.5321 22.5347 18.6465 22.5347C16.7609 22.5347 15.8181 22.5347 15.2323 21.9489C14.6465 21.3631 14.6465 20.4203 14.6465 18.5347V16.5347Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M14.6465 5.53467C14.6465 4.60279 14.6465 4.13685 14.7987 3.7693C15.0017 3.27925 15.3911 2.8899 15.8811 2.68691C16.2487 2.53467 16.7146 2.53467 17.6465 2.53467H19.6465C20.5784 2.53467 21.0443 2.53467 21.4119 2.68691C21.9019 2.8899 22.2913 3.27925 22.4943 3.7693C22.6465 4.13685 22.6465 4.60279 22.6465 5.53467C22.6465 6.46655 22.6465 6.93249 22.4943 7.30004C22.2913 7.79009 21.9019 8.17944 21.4119 8.38243C21.0443 8.53467 20.5784 8.53467 19.6465 8.53467H17.6465C16.7146 8.53467 16.2487 8.53467 15.8811 8.38243C15.3911 8.17944 15.0017 7.79009 14.7987 7.30004C14.6465 6.93249 14.6465 6.46655 14.6465 5.53467Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>

                    ), lab: 'Summary', val: 'summary' },
                    { icon: (
                      <svg width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.14648 4.28467C8.14648 3.31817 8.92999 2.53467 9.89648 2.53467H15.3965C16.363 2.53467 17.1465 3.31817 17.1465 4.28467C17.1465 5.25117 16.363 6.03467 15.3965 6.03467H9.89648C8.92999 6.03467 8.14648 5.25117 8.14648 4.28467Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M8.15039 6.03467C6.59459 6.08134 5.667 6.25451 5.02516 6.89694C4.14648 7.77644 4.14648 9.19197 4.14648 12.023V18.5291C4.14648 21.3602 4.14648 22.7757 5.02516 23.6552C5.90384 24.5347 7.31806 24.5347 10.1465 24.5347H15.1465C17.9749 24.5347 19.3891 24.5347 20.2678 23.6552C21.1465 22.7757 21.1465 21.3602 21.1465 18.5291V12.023C21.1465 9.19197 21.1465 7.77644 20.2678 6.89695C19.626 6.25451 18.6984 6.08134 17.1426 6.03467" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8.64453 17.868H12.6445M8.64453 12.4513H16.6445" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>

                    ), lab: 'Applicant Details', val: 'applicant_info' },
                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6465 6.53467H21.6465" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M11.6465 12.5347H21.6465" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M11.6465 18.5347H21.6465" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M3.64648 7.92753C3.64648 7.92753 4.64648 8.57933 5.14648 9.53467C5.14648 9.53467 6.64648 5.78467 8.64648 4.53467" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.64648 18.9276C3.64648 18.9276 4.64648 19.5794 5.14648 20.5347C5.14648 20.5347 6.64648 16.7847 8.64648 15.5347" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                    ), lab: 'Unit Details', val: 'unit_information' },
                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.6625 2.53467C19.5491 2.53467 18.6465 5.22096 18.6465 8.53467H20.6625C21.6341 8.53467 22.1199 8.53467 22.4206 8.19922C22.7214 7.86376 22.669 7.422 22.5643 6.53848C22.2879 4.2061 21.5408 2.53467 20.6625 2.53467Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M18.6465 8.58893V19.1805C18.6465 20.6922 18.6465 21.448 18.1845 21.7455C17.4296 22.2318 16.2626 21.2121 15.6756 20.842C15.1906 20.5361 14.9482 20.3832 14.679 20.3744C14.3882 20.3648 14.1414 20.5115 13.6174 20.842L11.7065 22.0471C11.191 22.3721 10.9333 22.5347 10.6465 22.5347C10.3597 22.5347 10.1019 22.3721 9.58648 22.0471L7.67561 20.842C7.19063 20.5361 6.94814 20.3832 6.67901 20.3744C6.3882 20.3648 6.14141 20.5115 5.61735 20.842C5.03043 21.2121 3.86335 22.2318 3.10843 21.7455C2.64648 21.448 2.64648 20.6922 2.64648 19.1805V8.58893C2.64648 5.73492 2.64648 4.30792 3.52516 3.4213C4.40384 2.53467 5.81805 2.53467 8.64648 2.53467H20.6465" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.64648 6.53467H14.6465"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.64648 10.5347H6.64648"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.1465 11.4097C12.3181 11.4097 11.6465 11.9973 11.6465 12.7222C11.6465 13.4471 12.3181 14.0347 13.1465 14.0347C13.9749 14.0347 14.6465 14.6223 14.6465 15.3472C14.6465 16.0721 13.9749 16.6597 13.1465 16.6597M13.1465 11.4097C13.7996 11.4097 14.3552 11.7749 14.5611 12.2847M13.1465 11.4097V10.5347M13.1465 16.6597C12.4934 16.6597 11.9378 16.2945 11.7319 15.7847M13.1465 16.6597V17.5347" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>

                    ), lab: 'Cost & Payments', val: 'finance_info' },
                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.64648 11.5347H6.64648C3.33715 11.5347 2.64648 12.2254 2.64648 15.5347V18.5347C2.64648 21.844 3.33715 22.5347 6.64648 22.5347H18.6465C21.9558 22.5347 22.6465 21.844 22.6465 18.5347V15.5347C22.6465 13.3236 22.3382 12.2815 21.1465 11.8334"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.6465 18.5347H18.6465"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.8907 3.66758C18.3378 3.18245 18.5614 2.93989 18.7989 2.79841C19.3721 2.45701 20.078 2.4464 20.6607 2.7704C20.9022 2.90468 21.1327 3.14042 21.5935 3.61188C22.0544 4.08335 22.2848 4.31908 22.4161 4.56616C22.7328 5.16234 22.7224 5.88438 22.3887 6.47078C22.2504 6.7138 22.0133 6.9425 21.5391 7.3999L15.8969 12.8422C14.4021 14.284 13.4762 14.583 11.4057 14.5288C11.0298 14.5189 10.8419 14.514 10.7327 14.3898C10.6234 14.2657 10.6383 14.074 10.6681 13.6905C10.8057 11.9228 11.1171 11.0171 12.3202 9.71173L17.8907 3.66758Z"  stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>

                    ), lab: 'Documents', val: 'agreement_info' },
                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.64648 5.03467H9.40384C10.1995 5.03467 10.9626 5.35074 11.5252 5.91335L14.6465 9.03467"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.64648 14.0347H2.64648"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.14648 8.03467L11.1465 10.0347C11.6988 10.587 11.6988 11.4824 11.1465 12.0347C10.5942 12.587 9.69877 12.587 9.14648 12.0347L7.64648 10.5347C6.78579 11.3954 5.42319 11.4922 4.44942 10.7619L4.14648 10.5347"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.64648 11.5347V16.0347C5.64648 17.9203 5.64648 18.8631 6.23227 19.4489C6.81805 20.0347 7.76086 20.0347 9.64648 20.0347H18.6465C20.5321 20.0347 21.4749 20.0347 22.0607 19.4489C22.6465 18.8631 22.6465 17.9203 22.6465 16.0347V13.0347C22.6465 11.1491 22.6465 10.2062 22.0607 9.62046C21.4749 9.03467 20.5321 9.03467 18.6465 9.03467H10.1465"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.8965 14.5347C15.8965 15.5012 15.113 16.2847 14.1465 16.2847C13.18 16.2847 12.3965 15.5012 12.3965 14.5347C12.3965 13.5682 13.18 12.7847 14.1465 12.7847C15.113 12.7847 15.8965 13.5682 15.8965 14.5347Z"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                    ), lab: 'Loan Details', val: 'loan_info' },

                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6465 11.0347V10.5347C19.6465 6.76343 19.6465 4.87782 18.4749 3.70624C17.3034 2.53467 15.4177 2.53467 11.6465 2.53467C7.87524 2.53467 5.98963 2.53467 4.81805 3.70624C3.64648 4.87782 3.64648 6.76343 3.64648 10.5347V16.5347C3.64648 18.3985 3.64648 19.3303 3.95096 20.0654C4.35694 21.0455 5.13563 21.8242 6.11575 22.2302C6.85083 22.5347 7.78271 22.5347 9.64648 22.5347"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.64648 7.53467H15.6465M7.64648 11.5347H11.6465"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M15.929 19.5391C15.87 18.6504 15.7645 17.7005 15.3282 16.6264C14.956 15.7103 15.0597 13.5552 17.1465 13.5552C19.2333 13.5552 19.3129 15.7103 18.9407 16.6264C18.5043 17.7005 18.423 18.6504 18.364 19.5391M21.6465 22.5347H12.6465V21.289C12.6465 20.8425 12.9129 20.4501 13.2993 20.3275L15.5541 19.6117C15.7149 19.5606 15.8813 19.5347 16.0486 19.5347H18.2444C18.4117 19.5347 18.5781 19.5606 18.7389 19.6117L20.9937 20.3275C21.3801 20.4501 21.6465 20.8425 21.6465 21.289V22.5347Z"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                    ), lab: 'Brokerage Details', val: 'brokerage_info' },

                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.14648 12.5347C3.14648 8.05633 3.14648 5.81716 4.53772 4.42591C5.92897 3.03467 8.16814 3.03467 12.6465 3.03467C17.1248 3.03467 19.364 3.03467 20.7553 4.42591C22.1465 5.81716 22.1465 8.05633 22.1465 12.5347C22.1465 17.013 22.1465 19.2522 20.7553 20.6435C19.364 22.0347 17.1248 22.0347 12.6465 22.0347C8.16814 22.0347 5.92897 22.0347 4.53772 20.6435C3.14648 19.2522 3.14648 17.013 3.14648 12.5347Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M11.6465 7.53467H17.6465"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7.64648 7.53467H8.64648"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7.64648 12.5347H8.64648"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7.64648 17.5347H8.64648"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M11.6465 12.5347H17.6465"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M11.6465 17.5347H17.6465"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>

                    ), lab: 'Tasks', val: 'tasks' },
                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6465 22.5347C18.1693 22.5347 22.6465 18.0575 22.6465 12.5347C22.6465 7.01182 18.1693 2.53467 12.6465 2.53467C7.12364 2.53467 2.64648 7.01182 2.64648 12.5347C2.64648 18.0575 7.12364 22.5347 12.6465 22.5347Z"  stroke="currentColor" stroke-width="1.5"/>
                <path d="M10.1465 10.0347L13.6464 13.5343M16.6465 8.53467L11.6465 13.5347"  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                    ), lab: 'Timeline', val: 'timeline' },
                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.6465 9.53467L9.64648 15.5343M15.6465 15.5347L9.64648 9.53506" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.14648 12.5347C3.14648 8.05633 3.14648 5.81716 4.53772 4.42591C5.92897 3.03467 8.16814 3.03467 12.6465 3.03467C17.1248 3.03467 19.364 3.03467 20.7553 4.42591C22.1465 5.81716 22.1465 8.05633 22.1465 12.5347C22.1465 17.013 22.1465 19.2522 20.7553 20.6435C19.364 22.0347 17.1248 22.0347 12.6465 22.0347C8.16814 22.0347 5.92897 22.0347 4.53772 20.6435C3.14648 19.2522 3.14648 17.013 3.14648 12.5347Z"  stroke="currentColor" stroke-width="1.5"/>
                </svg>

                    ), lab: 'Cancel Booking', val: 'cancel_booking' },
                    { icon: (
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1465 20.5347C14.1465 20.5347 15.1465 20.5347 16.1465 22.5347C16.1465 22.5347 19.323 17.5347 22.1465 16.5347" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.64648 16.5347H11.6465M7.64648 11.5347H15.6465" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7.14649 4.03467C5.59069 4.08134 4.6631 4.25451 4.02126 4.89694C3.14258 5.77644 3.14258 7.19197 3.14258 10.023V16.5291C3.14258 19.3602 3.14258 20.7757 4.02126 21.6552C4.89994 22.5347 6.31416 22.5347 9.14258 22.5347H11.6426M16.1387 4.03467C17.6945 4.08134 18.6221 4.25451 19.2639 4.89695C20.1426 5.77644 20.1426 7.19197 20.1426 10.023V14.0347" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7.14258 4.28467C7.14258 3.31817 7.92609 2.53467 8.89258 2.53467H14.3926C15.3591 2.53467 16.1426 3.31817 16.1426 4.28467C16.1426 5.25117 15.3591 6.03467 14.3926 6.03467H8.89258C7.92609 6.03467 7.14258 5.25117 7.14258 4.28467Z"  stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>

                    ), lab: 'Unit Audit', val: 'unit_audit' },

                  ].map((d, i) => {
                    return (

                <li
                key={i}
                className="mr-2 ml-2 text-sm font-bodyLato"
                role="presentation"
              >
                <div
                  className={`flex items-center gap-3 text-gray-500 hover:bg-gray-50 p-2 rounded-lg cursor-pointer w-60 ${
                    selFeature === d.val ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setFeature(d.val)}
                >
                  <span
                    className={`hover:text-[#484848] ${
                      selFeature === d.val ? 'text-[#484848]' : 'text-gray-500'
                    }`}
                  >

                    {React.cloneElement(d.icon, {
                    className: "w-5 h-5",
                    fill: "none",
                    stroke: selFeature === d.val ? "#484848" : "#A6A6A6",
                    strokeWidth: 1.5,

                     })}


                  </span>
                  <button
                    className={`inline-block  mt-1 mr-2 py-1  text-sm font-medium text-center rounded-lg border-b-2 hover:text-[#484848] border-transparent ${
                      selFeature === d.val ? 'text-[#484848]' : 'text-[#A6A6A6]'
                    }`}
                    type="button"
                    role="tab"
                  >
                    <span className="mt-[3px]">{d.lab}</span>
                  </button>
                </div>
              </li>
                    )
                  })}
                </ul>
              </div>









            </div>
          </div>
      </section>
      <SiderForm
        open={openCapturePayment}
        setOpen={setOpenCapturePayment}
        title={'capturePayment'}
        unitsViewMode={false}
        widthClass="max-w-md"
        selUnitDetails={selCustomerPayload}
      />
    </div>
  )
}
