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
  steamUnitActivityLog,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { db, storage } from 'src/context/firebaseConfig'
import { prettyDate, prettyDateTime, timeConv } from 'src/util/dateConverter'
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
import {
  Bed,
  Building2,
  Calendar,
  Compass,
  DollarSign,
  Download,
  Home,
  Ruler,
  Square,
} from 'lucide-react'

import units1 from '../../../public/units1.png'
import units2 from '../../../public/units2.png'
import units3 from '../../../public/units3.png'
import units4 from '../../../public/units4.png'

import Dimensions from '../../../public/Dimensions.png'
import BrokerageDetails from './A_BrokerageDetails/BrokerageDetails'
import ToDoList from './T_UnitTasks/ToDoList'
import ProjectTasks from './T_UnitTasks/ToDoList'
import TaskManagementDashboard from './T_UnitTasks/ToDoList'
import DocumentManagement from '../LegalModule/Docu_row'
import { computeTotal } from 'src/util/computeCsTotals'
import { crmActivieLogNamer } from 'src/util/CrmActivityLogHelper'
import UnitDocsWidget from '../LegalModule/UnitDocsWidget'
import toast from 'react-hot-toast'
import StatusStepper from './StatusStepper'
import BookingProgressCard from './StatusStepper'
import Timelines from './StatusStepper'

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

const timelineItems = [
  {
    status: 'Booked',
    date: 'Mar 20-2025',
    color: 'bg-green-100 text-green-800',
  },
  {
    status: 'Allotment',
    date: 'Mar 20-2025',
    color: 'bg-gray-200 text-gray-700',
  },
  {
    status: 'Agreement',
    date: 'Mar 20-2025',
    color: 'bg-gray-200 text-gray-700',
  },
  {
    status: 'Registered',
    date: 'Mar 20-2025',
    color: 'bg-gray-200 text-gray-700',
  },
  {
    status: 'Possession',
    date: 'Mar 20-2025',
    color: 'bg-gray-200 text-gray-700',
  },
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



// const [events] = useState([
//   { key: 'booked', event: 'Booked', completed: true, date: 'Mar 20-2025' },
//   { key: 'allotment', event: 'Allotment', completed: true, date: 'Mar 20-2025' },
//   { key: 'agreement', event: 'Agreement', completed: false, status: 'Delayed by 3 Days' },
//   { key: 'registered', event: 'Registered', completed: false, status: 'In 77 Days' },
//   { key: 'possession', event: 'Possession', completed: false, status: 'In 130 Days' }
// ]);

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
  setOpen,
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
  selectedUnitId,
  selCustomerPayload: selUnitPayload,
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

  const [brokerageType, setBrokerageType] = useState('percentage')

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
    const channel = supabase
      .channel('unit-accounts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: `${orgId}_accounts`,
        },
        (payload) => {
          // const subscription = supabase
          //   .from(`${orgId}_accounts`)
          //   .on('*', (payload) => {
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
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
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

  const documentsd = [
    { id: 1, name: 'EC' },
    { id: 2, name: 'Agreement' },
    { id: 3, name: 'Registration Document' },
    { id: 4, name: 'Katha Document' },
  ]

  const [editableEvent, setEditableEvent] = useState(null)
  const [editedDate, setEditedDate] = useState('')

  const events = [
    { event: 'Booked', key: 'booked_on' },
    { event: 'Allotment', key: 'alloted_on' },
    { event: 'Agreement', key: 'ats_date' },
    { event: 'Registered', key: 'sd_date' },
    { event: 'Possession', key: 'possession_on' },
  ]

  const handleEdit = (key) => {
    setEditableEvent(key)
    setEditedDate(customerDetails[key] || '')
  }

  const plots = [
    {
      number: '34',
      orientations: ['East', 'West'],
      type: 'Villa',
    },
    {
      number: '33',
      orientations: ['South', 'West'],
      type: 'Villa',
    },
  ]

  const documents = [
    {
      id: 1234,
      name: 'EC',
      type: 'ec',
      time: customerDetails?.ecDocUpDate,
      url: customerDetails?.ecDocUrl,
      fileName: customerDetails?.ecFilName,
    },
    {
      id: 1235,
      name: 'Agreement',
      type: 'agree',
      time: customerDetails?.agreeDocUpDate,
      url: customerDetails?.agreeDocUrl,
      fileName: customerDetails?.agreeFilName,
    },
    {
      id: 1236,
      name: 'Register Doc',
      type: 'reg',
      time: customerDetails?.regDocUpDate,
      url: customerDetails?.regDocUrl,
      fileName: customerDetails?.regFilName,
    },
  ]

  // Filter out documents that don't have URLs (i.e., haven't been uploaded)
  const availableDocuments = documents.filter((doc) => doc.url)

  const handleSave = async (key) => {
    try {
      console.log('date is', editedDate)
      const dateTimestamp = new Date(editedDate).getTime()

      const updatedDetails = {
        ...customerDetails,
        [key]: dateTimestamp,
      }
      updateUnitStatusDates(
        orgId,
        selCustomerPayload?.id,
        { key, time: dateTimestamp, oldDate: customerDetails[key] || 0 },
        user.email,
        enqueueSnackbar
      )
      customerDetails[key] = dateTimestamp

      setEditableEvent(null)

      enqueueSnackbar('Date updated successfully', {
        variant: 'success',
      })
      return
      const unitDocRef = doc(db, `${orgId}_units`, customerDetails.id)
      await updateDoc(unitDocRef, {
        [key]: dateTimestamp,
        [`${key}_updated_by`]: user.email,
        [`${key}_updated_at`]: new Date().getTime(),
      })

      customerDetails[key] = dateTimestamp

      setEditableEvent(null)

      enqueueSnackbar('Date updated successfully', {
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating date:', error)
      enqueueSnackbar('Error updating date', {
        variant: 'error',
      })
    }
  }

  const handleCancel = () => {
    setEditableEvent(null)
    setEditedDate('')
  }

  const documentTypes = [
    {
      id: 1235,
      name: 'Agreement',
      type: 'agree',
      uploadedCount: customerDetails?.agree_doc_count || 0,
    },
    {
      id: 1236,
      name: 'Register Doc',
      type: 'reg',
      uploadedCount: customerDetails?.reg_doc_count || 0,
    },
    {
      id: 1237,
      name: 'Construction Gallery',
      type: 'constructGallery',
      uploadedCount: customerDetails?.constructGallery_doc_count || 0,
    },
    {
      id: 1238,
      name: 'EC',
      type: 'ec',
      uploadedCount: customerDetails?.ec_doc_count || 0,
    },
    {
      id: 1239,
      name: 'Others',
      type: 'others',
      uploadedCount: customerDetails?.others_doc_count || 0,
    },
  ]

  const totalUploadedDocs = documentTypes.reduce(
    (sum, doc) => sum + doc.uploadedCount,
    0
  )

  const pendingDocs = documentTypes.length - totalUploadedDocs

  const [netTotal, setNetTotal] = useState(0)
  const [partATotal, setPartATotal] = useState(0)
  const [partBTotal, setPartBTotal] = useState(0)
  const [unitFetchedActivityData, setUnitFetchedActivityData] = useState([])

  // const boot = async () => {
  //   const unsubscribe = steamUnitActivityLog(orgId, {
  //     uid: selUnitPayload?.id,
  //     pId: selUnitPayload?.pId,
  //   })

  //   const y = await unsubscribe
  //   setUnitFetchedActivityData(y)
  //   await console.log('new setup ', unitFetchedActivityData)
  //   await console.log('new setup ', y)
  // }

  useEffect(() => {
    console.log('unit dta is ', selUnitPayload, selUnitPayload?.id)
    boot()
    setTotalFun()
    const channel = supabase
      .channel('unit-logs-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: `${orgId}_unit_logs`,
        },
        (payload) => {
          // const subscription = supabase
          //   .from(`${orgId}_unit_logs`)
          //   .on('*', (payload) => {
          console.log('account records', payload)
          const updatedData = payload.new
          const { uid } = payload.old
          const eventType = payload.eventType
          console.log('account records', updatedData.Uuid, selUnitPayload?.id)

          if (updatedData.Uuid === selUnitPayload?.id) {
            if (updatedData.Uuid === selUnitPayload?.id) {
              console.log(
                'account records',
                updatedData.Uuid,
                selUnitPayload?.id
              )
              setUnitFetchedActivityData((prevLogs) => {
                const existingLog = prevLogs.find((log) => log.uid === uid)
                console.log(
                  'account records',
                  prevLogs,
                  existingLog,
                  uid,
                  payload.old,
                  uid
                )
                if (existingLog) {
                  console.log('Existing record found!')
                  if (payload.new.status === 'Done') {
                    const updatedLogs = prevLogs.filter((log) => log.uid != uid)
                    return [...updatedLogs]
                  } else {
                    const updatedLogs = prevLogs.map((log) =>
                      log.uid === uid ? payload.new : log
                    )
                    return [...updatedLogs]
                  }
                } else {
                  console.log('New record added!')
                  return [payload.new, ...prevLogs]
                }
              })
            } else {
              if (
                updatedData.by_uid === user?.uid ||
                updatedData?.to_uid === user?.uid
              ) {
                setUnitFetchedActivityData((prevLogs) => {
                  const existingLog = prevLogs.find((log) => log.uid === uid)

                  if (existingLog) {
                    console.log('Existing record found!')
                    if (payload.new.status === 'Done') {
                      const updatedLogs = prevLogs.filter(
                        (log) => log.uid != uid
                      )
                      return [...updatedLogs]
                    } else {
                      const updatedLogs = prevLogs.map((log) =>
                        log.id === uid ? payload.new : log
                      )
                      return [...updatedLogs]
                    }
                  } else {
                    console.log('New record added!')
                    return [payload.new, ...prevLogs]
                  }
                })
              }
            }
          }
        }
      )
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const boot = async () => {
    const unsubscribe = steamUnitActivityLog(orgId, {
      uid: selUnitPayload?.id,
      pId: selUnitPayload?.pId,
    })

    const y = await unsubscribe
    setUnitFetchedActivityData(y)
    await console.log('new setup ', unitFetchedActivityData)
    await console.log('new setup ', y)
  }
  const setTotalFun = async () => {
    const partBTotal = selUnitPayload?.additonalChargesObj?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selUnitPayload?.super_built_up_area ||
            selUnitPayload?.area?.toString()?.replace(',', '')
          )
        ),
      0
    )

    const partATotal = selUnitPayload?.plotCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )

    console.log('myObj', partATotal)

    setPartBTotal(partBTotal)
    setPartATotal(partATotal)
    setNetTotal(partATotal + partBTotal)
  }

  return (
    //bg-[#F9F9FA]
    <div className={` `}>
      <section className="flex ml-6  mt-4	">
        <div className="w-full">
          <div className="rounded-t  mb-0">
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
                      <h3 className="mb-1 text-xsfont-medium text-gray-900 ">
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
                        <h2 className="text-xlfont-medium leading-tight">
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
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xsfont-medium text-gray-700 uppercase tracking-wider">
                                  Name
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xsfont-medium text-gray-700 uppercase tracking-wider">
                                  Created On / By
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xsfont-medium text-gray-700 uppercase tracking-wider">
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
                <>
                  {/* <div className="py-8 px-8  flex flex-col items-center">
              <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                <img
                  className="w-[200px] h-[200px] inline"
                  alt=""
                  src="/all-complete.svg"
                />
              </div>
              <h3 className="mb-1 text-smfont-medium text-gray-900 ">
                You are clean
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                Sitback & Relax <span className="text-blue-600">Add Task</span>
              </time>
            </div> */}

                  <ToDoList selUnitPayload={selUnitPayload} />

                  {/* <TaskManagementDashboard/> */}

                  {/* <ToDoList currentUnitId={selectedUnitId} /> */}

                  {/* <ProjectTasks/> */}
                </>
              )}

              {selFeature === 'timeline' && (
                <>
                  {/*
            <div>
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
                  <h3 className="mb-1 text-xsfont-medium text-gray-900 ">
                    Timeline is Empty box1
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
                      <PlusCircleIcon className="mr-3 mb-3 w-8 h-8 rounded-full sm:mb-0" />
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
            </div>

             */}












                  <div className="overflow-y-scroll w-full items-center justify-center mx-auto min-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">


                    <div className="relative min-h-screen mr-6">
                      <div className="max-w-6xl bg-white rounded-[16px] mx-auto p-6">
                        <h1 className="font-[Outfit] font-semibold text-[16px] leading-[100%] tracking-[0%] mb-6">Unit Timeline                     </h1>

                        {/* Top summary card */}
                        <div className="max-w-5xl mx-auto my-4 p-4 bg-white border border-[#e7e7e9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-[16px]">
                          <div className="flex flex-row divide-x divide-gray-200">
                            <div className="flex-1 p-2 px-6 text-center">
                              <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">   Last Activity</div>
                              <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">
                                {unitFetchedActivityData[0]?.type || 'No Data'}
                              </div>
                            </div>

                            <div className="flex-1 p-2 px-6 text-center">
                              <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">Upcoming Milestone</div>
                              <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">
                                {unitFetchedActivityData.find(
                                  (act) => act.status === 'pending'
                                )?.type || 'No Data'}
                              </div>
                            </div>

                            <div className="flex-1 p-2 px-6 text-center">
                              <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">
                                Current Unit Status
                              </div>
                              <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">
                                {unitFetchedActivityData[0]?.status ||
                                  'No Data'}
                              </div>
                            </div>
                          </div>
                        </div>















                        {/* Main details card */}


                        <div className="w-full h-full flex justify-center  z-10 relative">
                          <div className="w-full max-w-5xl">
                            <section className="p-4 mt-2 rounded-2xl">
                              <table className="w-full rounded-2xl overflow-hidden">
                                <thead>
                                  <tr className="h-9">
                                    <th className="w-[25%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                      User
                                    </th>
                                    <th className="w-[25%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                      Date/Time
                                    </th>
                                    <th className="w-[30%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                      Activity
                                    </th>
                                    <th className="w-[20%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                      Status
                                    </th>
                                  </tr>
                                </thead>

                                <tbody className="bg-[#fff]">
                                  {unitFetchedActivityData?.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan="4"
                                        className="text-center py-8 text-gray-500"
                                      >
                                        No activity data available
                                      </td>
                                    </tr>
                                  ) : (
                                    unitFetchedActivityData?.map(
                                      (activity, index) => (
                                        <tr
                                          key={index}
                                          className={`border-b border-dashed h-[45px] ${index % 2 === 0
                                            ? 'bg-[#FCFCFD]'
                                            : 'bg-[#FCFCFD]'
                                            }`}
                                        >
                                          <td className="text-[12px] text-center text-gray-800">
                                            {activity.by || 'System'}
                                          </td>
                                          <td className="text-[12px] text-center text-gray-800">
                                            {activity.type === 'ph'
                                              ? timeConv(
                                                Number(activity.time)
                                              ).toLocaleString()
                                              : timeConv(
                                                activity.T
                                              ).toLocaleString()}
                                          </td>
                                          <td className="text-[12px] text-center text-gray-800">
                                            {crmActivieLogNamer(activity)}
                                          </td>
                                          <td className="text-[12px] text-center">
                                            <span
                                              className={`px-2 py-1 rounded-full ${activity.status === 'Done'
                                                ? 'bg-green-100 text-green-800'
                                                : activity.status ===
                                                  'In Progress'
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                              {activity.status || 'Pending'}
                                            </span>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  )}
                                </tbody>
                              </table>
                            </section>
                          </div>
                        </div>




                      </div>
                    </div>
                  </div>















                  {/* <div className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="relative min-h-screen mr-6">
                      <div className="relative z-0">
                        <h1 className="text-[#606062] mx-auto w-full mb-1 tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
                          Unit Timeline
                        </h1>

                        <img
                          alt="CRM Background"
                          src="/crmfinal.svg"
                          className="w-full h-auto object-cover"
                        />

                        <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
                          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center space-y-2">
                              <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                                Last Activity
                              </p>
                              <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                                {unitFetchedActivityData[0]?.type || 'No Data'}
                              </h2>
                            </div>
                            <div className="text-center space-y-2">
                              <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                                Upcoming Milestone
                              </p>
                              <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                                {unitFetchedActivityData.find(
                                  (act) => act.status === 'pending'
                                )?.type || 'No Data'}
                              </h2>
                            </div>
                            <div className="text-center space-y-2">
                              <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                                Current Unit Status
                              </p>
                              <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                                {unitFetchedActivityData[0]?.status ||
                                  'No Data'}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-full flex justify-center mt-[-90px] z-10 relative">
                        <div className="w-full max-w-5xl">
                          <section className="p-4 mt-2 rounded-2xl">
                            <table className="w-full rounded-2xl overflow-hidden">
                              <thead>
                                <tr className="h-9">
                                  <th className="w-[25%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                    User
                                  </th>
                                  <th className="w-[25%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                    Date/Time
                                  </th>
                                  <th className="w-[30%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                    Activity
                                  </th>
                                  <th className="w-[20%] text-[12px] text-center text-[#0E0A1F] crm_bg_color tracking-wide">
                                    Status
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="bg-[#fff]">
                                {unitFetchedActivityData?.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="text-center py-8 text-gray-500"
                                    >
                                      No activity data available
                                    </td>
                                  </tr>
                                ) : (
                                  unitFetchedActivityData?.map(
                                    (activity, index) => (
                                      <tr
                                        key={index}
                                        className={`border-b border-dashed h-[45px] ${index % 2 === 0
                                            ? 'bg-[#FCFCFD]'
                                            : 'bg-[#FCFCFD]'
                                          }`}
                                      >
                                        <td className="text-[12px] text-center text-gray-800">
                                          {activity.by || 'System'}
                                        </td>
                                        <td className="text-[12px] text-center text-gray-800">
                                          {activity.type === 'ph'
                                            ? timeConv(
                                              Number(activity.time)
                                            ).toLocaleString()
                                            : timeConv(
                                              activity.T
                                            ).toLocaleString()}
                                        </td>
                                        <td className="text-[12px] text-center text-gray-800">
                                          {crmActivieLogNamer(activity)}
                                        </td>
                                        <td className="text-[12px] text-center">
                                          <span
                                            className={`px-2 py-1 rounded-full ${activity.status === 'Done'
                                                ? 'bg-green-100 text-green-800'
                                                : activity.status ===
                                                  'In Progress'
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                              }`}
                                          >
                                            {activity.status || 'Pending'}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  )
                                )}
                              </tbody>
                            </table>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div> */}








                </>
              )}
            </>
          </div>

          {selFeature === 'applicant_info' && (
            <>
              {!openApplicantEdit && (
                <div className=" w-full items-center justify-center  mx-auto min-h-screen">
                  <ShowCustomerDetails
                    source="fromBookedUnit"
                    title="Booking Form"
                    selUnitDetails={selCustomerPayload}
                    leadDetailsObj2={selCustomerPayload}
                    setShowApplicantEdit={setShowApplicantEdit}
                    selCustomerPayload={selCustomerPayload}

                  />
                </div>
              )}
              {openApplicantEdit && (
                <div className="mt-2 h-full flex flex-col justify-between overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
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




              <div className="overflow-y-scroll w-full items-center justify-center mx-auto min-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">


                <div className="relative min-h-screen mr-6">
                  <div className="max-w-6xl bg-white rounded-[16px] mx-auto p-6">
                    <h1 className="font-[Outfit] font-semibold text-[16px] leading-[100%] tracking-[0%] mb-6">Last Completed</h1>

                    {/* Top summary card */}
                    <div className="max-w-5xl mx-auto my-4 p-4 bg-white border border-[#e7e7e9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-[16px]">
                      <div className="flex flex-row divide-x divide-gray-200">
                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">   Last Completed</div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">

                          </div>
                        </div>

                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">   Next Due Task</div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">

                          </div>
                        </div>

                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">
                            Urgent Tasks
                          </div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">


                          </div>
                        </div>
                      </div>
                    </div>















                    {/* Main details card */}

                    <div className="absolute   w-full flex justify-center z-10">
                      <div className="w-full max-w-4xl px-4 mx-auto">
                        <div>
                          <div className="w-full flex justify-center">
                            <div className="p-8 rounded-2xl  bg-white w-full">
                              <section className="mb-8">
                                <h2 className="font-outfit text-[#606062] font-medium text-[12px] leading-[100%] tracking-normal uppercase mb-6">
                                  UNIT DETAILS
                                </h2>

                                <div className="flex flex-wrap">
                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.725 2.56357C3.94557 2.70853 3.37194 2.96493 2.91843 3.41843C2.46493 3.87194 2.20853 4.44557 2.06357 5.225M13.275 2.56357C14.0544 2.70853 14.6281 2.96493 15.0816 3.41843C15.5351 3.87194 15.7915 4.44557 15.9364 5.225M10.425 2.37872C9.98669 2.375 9.51293 2.375 9 2.375C8.48707 2.375 8.0133 2.375 7.57499 2.37872M16.1213 8.075C16.125 8.51331 16.125 8.98707 16.125 9.5C16.125 10.0129 16.125 10.4867 16.1213 10.9251M1.87872 8.075C1.875 8.51331 1.875 8.98707 1.875 9.5C1.875 10.0129 1.875 10.4867 1.87872 10.9251M2.06357 13.775C2.20853 14.5544 2.46493 15.1281 2.91843 15.5816C3.37194 16.0351 3.94557 16.2915 4.725 16.4364M15.9364 13.775C15.7915 14.5544 15.5351 15.1281 15.0816 15.5816C14.6281 16.0351 14.0544 16.2915 13.275 16.4364M10.425 16.6213C9.98669 16.625 9.51293 16.625 9 16.625C8.48712 16.625 8.0134 16.625 7.57512 16.6213"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                        Unit No
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.unit_no}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center  flex-1 border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M10.2911 10.7911C10.5782 10.5039 10.7423 10.121 11.0705 9.35522L12.2379 6.63128C12.3552 6.35758 12.4139 6.22073 12.3466 6.15342C12.2793 6.08611 12.1424 6.14476 11.8687 6.26207L9.14478 7.42947C8.379 7.75766 7.99612 7.92175 7.70893 8.20893M10.2911 10.7911C10.0039 11.0782 9.621 11.2423 8.85522 11.5705L6.13128 12.7379C5.85758 12.8552 5.72073 12.9139 5.65342 12.8466C5.58611 12.7793 5.64476 12.6424 5.76207 12.3687L6.92947 9.64478C7.25766 8.879 7.42175 8.49612 7.70893 8.20893M10.2911 10.7911L7.70893 8.20893"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M16.5 9.5C16.5 13.6421 13.1421 17 9 17C4.85786 17 1.5 13.6421 1.5 9.5C1.5 5.35786 4.85786 2 9 2C13.1421 2 16.5 5.35786 16.5 9.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M9 2L9 3.125M9 17L9 15.875"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M16.5 9.5L15.375 9.5M1.5 9.5L2.625 9.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                        Facing
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.facing}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center  flex-1 border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.725 2.56357C3.94557 2.70853 3.37194 2.96493 2.91843 3.41843C2.46493 3.87194 2.20853 4.44557 2.06357 5.225M13.275 2.56357C14.0544 2.70853 14.6281 2.96493 15.0816 3.41843C15.5351 3.87194 15.7915 4.44557 15.9364 5.225M10.425 2.37872C9.98669 2.375 9.51293 2.375 9 2.375C8.48707 2.375 8.0133 2.375 7.57499 2.37872M16.1213 8.075C16.125 8.51331 16.125 8.98707 16.125 9.5C16.125 10.0129 16.125 10.4867 16.1213 10.9251M1.87872 8.075C1.875 8.51331 1.875 8.98707 1.875 9.5C1.875 10.0129 1.875 10.4867 1.87872 10.9251M2.06357 13.775C2.20853 14.5544 2.46493 15.1281 2.91843 15.5816C3.37194 16.0351 3.94557 16.2915 4.725 16.4364M15.9364 13.775C15.7915 14.5544 15.5351 15.1281 15.0816 15.5816C14.6281 16.0351 14.0544 16.2915 13.275 16.4364M10.425 16.6213C9.98669 16.625 9.51293 16.625 9 16.625C8.48712 16.625 8.0134 16.625 7.57512 16.6213"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M1.875 9.5H16.125"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M9 2.375L9 16.625"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                        Size (sqft)
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.area?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center flex-1   flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M3.75 2V6.5M1.5 4.25H6"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M15 14L15 5.75M5.25 15.5H13.5M13.5 4.25H9M3.75 9.5V14"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M13.5 4.25C13.5 3.54289 13.5 3.18934 13.7197 2.96967C13.9393 2.75 14.2929 2.75 15 2.75C15.7071 2.75 16.0607 2.75 16.2803 2.96967C16.5 3.18934 16.5 3.54289 16.5 4.25C16.5 4.95711 16.5 5.31066 16.2803 5.53033C16.0607 5.75 15.7071 5.75 15 5.75C14.2929 5.75 13.9393 5.75 13.7197 5.53033C13.5 5.31066 13.5 4.95711 13.5 4.25Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M13.5 15.5C13.5 14.7929 13.5 14.4393 13.7197 14.2197C13.9393 14 14.2929 14 15 14C15.7071 14 16.0607 14 16.2803 14.2197C16.5 14.4393 16.5 14.7929 16.5 15.5C16.5 16.2071 16.5 16.5607 16.2803 16.7803C16.0607 17 15.7071 17 15 17C14.2929 17 13.9393 17 13.7197 16.7803C13.5 16.5607 13.5 16.2071 13.5 15.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M2.25 15.5C2.25 14.7929 2.25 14.4393 2.46967 14.2197C2.68934 14 3.04289 14 3.75 14C4.45711 14 4.81066 14 5.03033 14.2197C5.25 14.4393 5.25 14.7929 5.25 15.5C5.25 16.2071 5.25 16.5607 5.03033 16.7803C4.81066 17 4.45711 17 3.75 17C3.04289 17 2.68934 17 2.46967 16.7803C2.25 16.5607 2.25 16.2071 2.25 15.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px]  font-outfit">
                                        BUA (sqft)
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.builtup_area?.toLocaleString(
                                          'en-IN'
                                        ) ||
                                          selCustomerPayload?.construct_area?.toLocaleString(
                                            'en-IN'
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>

                              {(customerDetails?.projectType?.name === 'Villas' ||
                                customerDetails?.projectType?.name ===
                                'Apartment') && (
                                  <section className="mb-8">
                                    <h2 className="text-[12px] text-gray-600 font-medium mb-6">
                                      Details
                                    </h2>

                                    <div className="flex flex-wrap">
                                      <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                          <svg
                                            width="18"
                                            height="19"
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M9.75 14L13.0999 9.98014C13.2912 9.75056 13.3869 9.63577 13.3869 9.5C13.3869 9.36423 13.2912 9.24944 13.0999 9.01986L9.75 5"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                            <path
                                              d="M4.5 14L7.84988 9.98014C8.0412 9.75056 8.13686 9.63577 8.13686 9.5C8.13686 9.36423 8.0412 9.24944 7.84988 9.01986L4.5 5"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                            BedRooms
                                          </div>
                                          <div className="text-base font-outfit font-medium">
                                            {selCustomerPayload?.Bedrooms_D}
                                          </div>
                                        </div>
                                      </div>


                                      <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                          <svg
                                            width="18"
                                            height="19"
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M8.25 14L4.90012 9.98014C4.7088 9.75056 4.61314 9.63577 4.61314 9.5C4.61314 9.36423 4.7088 9.24944 4.90012 9.01986L8.25 5"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                            <path
                                              d="M13.5 14L10.1501 9.98014C9.9588 9.75056 9.86314 9.63577 9.86314 9.5C9.86314 9.36423 9.9588 9.24944 10.1501 9.01986L13.5 5"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <div className="text-[#606062] font-medium text-[12px]  font-outfit">
                                            Bathrooms
                                          </div>
                                          <div className="text-base font-outfit font-medium">
                                            {selCustomerPayload?.BathRooms_D?.toLocaleString(
                                              'en-IN'
                                            )}
                                          </div>
                                        </div>
                                      </div>


                                      <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                          <svg
                                            width="18"
                                            height="19"
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M4.5 9.125L8.49321 5.46456C8.73382 5.244 8.85413 5.13371 9 5.13371C9.14587 5.13371 9.26618 5.244 9.50679 5.46456L13.5 9.125"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                            <path
                                              d="M4.5 14L8.49321 10.3396C8.73382 10.119 8.85413 10.0087 9 10.0087C9.14587 10.0087 9.26618 10.119 9.50679 10.3396L13.5 14"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                            Car Parking
                                          </div>
                                          <div className="text-base font-outfit font-medium">
                                            {selCustomerPayload?.Carpet_Area_D?.toLocaleString(
                                              'en-IN'
                                            )}
                                          </div>
                                        </div>
                                      </div>


                                      <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                          <svg
                                            width="18"
                                            height="19"
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M4.5 9.875L8.49321 13.5354C8.73382 13.756 8.85413 13.8663 9 13.8663C9.14587 13.8663 9.26618 13.756 9.50679 13.5354L13.5 9.875"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                            <path
                                              d="M4.5 5L8.49321 8.66044C8.73382 8.881 8.85413 8.99129 9 8.99129C9.14587 8.99129 9.26618 8.881 9.50679 8.66044L13.5 5"
                                              stroke="#0E0A1F"
                                              stroke-width="1.125"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                            Carpet Area Sqft
                                          </div>
                                          <div className="text-base font-outfit font-medium">
                                            {selCustomerPayload?.Carpet_Area_D?.toLocaleString(
                                              'en-IN'
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </section>
                                )}

                              <section className="mb-8">
                                <h2 className="text-[12px] text-gray-600 font-medium mb-4 font-outfit">
                                  DIMENSIONS
                                </h2>

                                <div className="flex flex-wrap">
                                  <div className="flex items-center   border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M9.75 14L13.0999 9.98014C13.2912 9.75056 13.3869 9.63577 13.3869 9.5C13.3869 9.36423 13.2912 9.24944 13.0999 9.01986L9.75 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M4.5 14L7.84988 9.98014C8.0412 9.75056 8.13686 9.63577 8.13686 9.5C8.13686 9.36423 8.0412 9.24944 7.84988 9.01986L4.5 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        East
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.east_d?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8.25 14L4.90012 9.98014C4.7088 9.75056 4.61314 9.63577 4.61314 9.5C4.61314 9.36423 4.7088 9.24944 4.90012 9.01986L8.25 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M13.5 14L10.1501 9.98014C9.9588 9.75056 9.86314 9.63577 9.86314 9.5C9.86314 9.36423 9.9588 9.24944 10.1501 9.01986L13.5 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        West
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.west_d?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.5 9.125L8.49321 5.46456C8.73382 5.244 8.85413 5.13371 9 5.13371C9.14587 5.13371 9.26618 5.244 9.50679 5.46456L13.5 9.125"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M4.5 14L8.49321 10.3396C8.73382 10.119 8.85413 10.0087 9 10.0087C9.14587 10.0087 9.26618 10.119 9.50679 10.3396L13.5 14"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        North
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.north_d?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center   flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.5 9.875L8.49321 13.5354C8.73382 13.756 8.85413 13.8663 9 13.8663C9.14587 13.8663 9.26618 13.756 9.50679 13.5354L13.5 9.875"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M4.5 5L8.49321 8.66044C8.73382 8.881 8.85413 8.99129 9 8.99129C9.14587 8.99129 9.26618 8.881 9.50679 8.66044L13.5 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        South
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.south_d?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>

                              <section className="mb-8">
                                <h2 className="text-[12px] text-gray-600 font-medium mb-4 font-outfit">
                                  STATUS
                                </h2>

                                <div className="flex flex-wrap">
                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M11.25 6.125C11.25 6.125 11.625 6.125 12 6.875C12 6.875 13.1912 5 14.25 4.625"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M16.5 5.75C16.5 7.82107 14.8211 9.5 12.75 9.5C10.6789 9.5 9 7.82107 9 5.75C9 3.67893 10.6789 2 12.75 2C14.8211 2 16.5 3.67893 16.5 5.75Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M1.5 8L2.0625 8L1.5 8ZM7.85294 2.5625C8.1636 2.5625 8.41544 2.31066 8.41544 2C8.41544 1.68934 8.1636 1.4375 7.85294 1.4375L7.85294 2.5625ZM7.85294 17V17.5625V17ZM1.5 11H0.9375H1.5ZM8.64706 17V16.4375V17ZM14.0696 16.1213L14.4559 16.5303L14.0696 16.1213ZM15.5624 11.3142C15.5626 11.0035 15.3109 10.7515 15.0002 10.7514C14.6896 10.7512 14.4376 11.0029 14.4375 11.3136L15.5624 11.3142ZM8.64706 16.4375H7.85294V17.5625H8.64706V16.4375ZM2.0625 11L2.0625 8L0.9375 8L0.9375 11H2.0625ZM2.0625 8C2.0625 6.56898 2.06384 5.55558 2.17318 4.78746C2.27973 4.03898 2.47886 3.60659 2.81659 3.28762L2.04414 2.46973C1.45151 3.02944 1.18545 3.74351 1.05941 4.62891C0.936164 5.49468 0.9375 6.6026 0.9375 8L2.0625 8ZM7.85294 1.4375C6.37058 1.4375 5.20533 1.43643 4.29663 1.55182C3.3749 1.66885 2.63224 1.91431 2.04414 2.46973L2.81659 3.28762C3.15887 2.96437 3.63008 2.77049 4.43835 2.66785C5.25965 2.56357 6.3405 2.5625 7.85294 2.5625L7.85294 1.4375ZM7.85294 16.4375C6.3405 16.4375 5.25965 16.4364 4.43835 16.3321C3.63008 16.2295 3.15887 16.0356 2.81659 15.7124L2.04414 16.5303C2.63223 17.0857 3.3749 17.3311 4.29663 17.4482C5.20533 17.5636 6.37058 17.5625 7.85294 17.5625L7.85294 16.4375ZM0.9375 11C0.9375 12.3974 0.936164 13.5053 1.05941 14.3711C1.18545 15.2565 1.45151 15.9706 2.04414 16.5303L2.81659 15.7124C2.47886 15.3934 2.27973 14.961 2.17318 14.2125C2.06384 13.4444 2.0625 12.431 2.0625 11H0.9375ZM8.64706 17.5625C10.1294 17.5625 11.2947 17.5636 12.2034 17.4482C13.1251 17.3311 13.8678 17.0857 14.4559 16.5303L13.6834 15.7124C13.3411 16.0356 12.8699 16.2295 12.0617 16.3321C11.2404 16.4364 10.1595 16.4375 8.64706 16.4375L8.64706 17.5625ZM14.4375 11.3136C14.4368 12.637 14.4267 13.5795 14.3143 14.296C14.2051 14.9929 14.0088 15.405 13.6834 15.7124L14.4559 16.5303C15.0257 15.9921 15.294 15.3107 15.4258 14.4703C15.5544 13.6496 15.5618 12.6111 15.5624 11.3142L14.4375 11.3136Z"
                                          fill="#0E0A1F"
                                        />
                                        <path
                                          d="M5.25 10.25H8.25"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M5.25 13.25L11.25 13.25"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Unit Status
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.status}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M3 11H4.79611C5.01673 11 5.23431 11.0497 5.43163 11.1452L6.96311 11.8862C7.16043 11.9816 7.37801 12.0313 7.59862 12.0313H8.38059C9.1369 12.0313 9.75 12.6246 9.75 13.3565C9.75 13.3861 9.72973 13.4121 9.70034 13.4202L7.79466 13.9471C7.4528 14.0416 7.08675 14.0087 6.76875 13.8548L5.13158 13.0627"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M9.75 12.875L13.1946 11.8167C13.8052 11.6264 14.4653 11.852 14.8478 12.3817C15.1244 12.7647 15.0118 13.3131 14.6088 13.5456L8.97216 16.7979C8.61365 17.0047 8.19071 17.0552 7.79637 16.9382L3 15.515"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M11.25 9.5H9.75C8.33579 9.5 7.62868 9.5 7.18934 9.06066C6.75 8.62132 6.75 7.91421 6.75 6.5V5C6.75 3.58579 6.75 2.87868 7.18934 2.43934C7.62868 2 8.33579 2 9.75 2H11.25C12.6642 2 13.3713 2 13.8107 2.43934C14.25 2.87868 14.25 3.58579 14.25 5V6.5C14.25 7.91421 14.25 8.62132 13.8107 9.06066C13.3713 9.5 12.6642 9.5 11.25 9.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Status
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.release_status?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M10.3125 14.1875C11.2026 15.0776 12.375 15.9821 12.375 15.9821L13.9821 14.375C13.9821 14.375 13.0776 13.2026 12.1875 12.3125C11.2974 11.4224 10.125 10.5179 10.125 10.5179L8.51786 12.125C8.51786 12.125 9.42239 13.2974 10.3125 14.1875ZM10.3125 14.1875L7.5 17M14.25 14.1071L12.1071 16.25M10.3929 10.25L8.25 12.3929"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M15 10.25L15 6.41804C15 5.13228 15 4.4894 14.799 3.97594C14.4759 3.15049 13.7927 2.49939 12.9264 2.19151C12.3876 2 11.7129 2 10.3636 2C8.00236 2 6.82172 2 5.87877 2.33514C4.36285 2.87393 3.16711 4.01336 2.6017 5.45789C2.25 6.35644 2.25 7.48148 2.25 9.73157L2.25 11.6645C2.25 13.9952 2.25 15.1605 2.88577 15.9699C3.06793 16.2017 3.28396 16.4076 3.5273 16.5812C3.80262 16.7776 4.11721 16.9103 4.5 17"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M2.25 9.5C2.25 8.11929 3.36929 7 4.75 7C5.24934 7 5.83803 7.08749 6.32352 6.95741C6.75489 6.84182 7.09182 6.50489 7.20741 6.07352C7.3375 5.58803 7.25 4.99934 7.25 4.5C7.25 3.11929 8.36929 2 9.75 2"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Mortgage
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.mortgage_type}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M1.5 17H16.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M13.5 7.25H10.5C8.6385 7.25 8.25 7.6385 8.25 9.5V17H15.75V9.5C15.75 7.6385 15.3615 7.25 13.5 7.25Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M11.25 17H2.25V4.25C2.25 2.3885 2.6385 2 4.5 2H9C10.8615 2 11.25 2.3885 11.25 4.25V7.25"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M2.25 5H4.5M2.25 8H4.5M2.25 11H4.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M11.25 10.25H12.75M11.25 12.5H12.75"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M12 17L12 14.75"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Sharing
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.sharing || 'No Data'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>

                              <section className="mb-8">
                                <h2 className="text-[12px] text-gray-600 font-medium mb-4 font-outfit">
                                  SCHEDULE
                                </h2>

                                <div className="flex flex-wrap">
                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M15 5V14M13.5 3.5H4.5M13.5 15.5H4.5M3 14V5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M16.5 3.5C16.5 4.32843 15.8284 5 15 5C14.1716 5 13.5 4.32843 13.5 3.5C13.5 2.67157 14.1716 2 15 2C15.8284 2 16.5 2.67157 16.5 3.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M4.5 3.5C4.5 4.32843 3.82843 5 3 5C2.17157 5 1.5 4.32843 1.5 3.5C1.5 2.67157 2.17157 2 3 2C3.82843 2 4.5 2.67157 4.5 3.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M16.5 15.5C16.5 16.3284 15.8284 17 15 17C14.1716 17 13.5 16.3284 13.5 15.5C13.5 14.6716 14.1716 14 15 14C15.8284 14 16.5 14.6716 16.5 15.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M4.5 15.5C4.5 16.3284 3.82843 17 3 17C2.17157 17 1.5 16.3284 1.5 15.5C1.5 14.6716 2.17157 14 3 14C3.82843 14 4.5 14.6716 4.5 15.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        East by
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.east_sch_by?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="16"
                                        height="18"
                                        viewBox="0 0 16 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M2 3.75V14.25H14V2.25"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M9.5 14.25L9.5 10.1529C9.5 8.54534 6.5 8.68773 6.5 10.1529L6.5 14.25"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M9.5 16.5L6.5 16.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M1.25 3.75L7.05132 1.69511C7.99167 1.43496 8.00833 1.43496 8.94868 1.69511L14.75 3.75"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M8.00895 6H8"
                                          stroke="#0E0A1F"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        West by
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.west_sch_by?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M3.375 2.75L3.375 16.25"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M13.125 2.75L13.125 16.25"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M8.25 2.75V5.75"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M8.25 8L8.25 11"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M8.25 13.25L8.25 16.25"
                                          stroke="#141B34"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        North by
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.north_sch_by?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center   flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M15 5V14M13.5 3.5H4.5M13.5 15.5H4.5M3 14V5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M16.5 3.5C16.5 4.32843 15.8284 5 15 5C14.1716 5 13.5 4.32843 13.5 3.5C13.5 2.67157 14.1716 2 15 2C15.8284 2 16.5 2.67157 16.5 3.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M4.5 3.5C4.5 4.32843 3.82843 5 3 5C2.17157 5 1.5 4.32843 1.5 3.5C1.5 2.67157 2.17157 2 3 2C3.82843 2 4.5 2.67157 4.5 3.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M16.5 15.5C16.5 16.3284 15.8284 17 15 17C14.1716 17 13.5 16.3284 13.5 15.5C13.5 14.6716 14.1716 14 15 14C15.8284 14 16.5 14.6716 16.5 15.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M4.5 15.5C4.5 16.3284 3.82843 17 3 17C2.17157 17 1.5 16.3284 1.5 15.5C1.5 14.6716 2.17157 14 3 14C3.82843 14 4.5 14.6716 4.5 15.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        South by
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.south_sch_by?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>

                              <section className="mb-8">
                                <h2 className="text-[12px] text-gray-600 font-medium mb-4">
                                  ADDITIONAL DETAILS
                                </h2>

                                <div className="flex flex-wrap">
                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M1.5 5C1.5 4.29289 1.5 3.93934 1.71967 3.71967C1.93934 3.5 2.29289 3.5 3 3.5C3.70711 3.5 4.06066 3.5 4.28033 3.71967C4.5 3.93934 4.5 4.29289 4.5 5V6.5C4.5 7.20711 4.5 7.56066 4.28033 7.78033C4.06066 8 3.70711 8 3 8C2.29289 8 1.93934 8 1.71967 7.78033C1.5 7.56066 1.5 7.20711 1.5 6.5V5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M4.875 12.5C4.875 11.7929 4.875 11.4393 5.09467 11.2197C5.31434 11 5.66789 11 6.375 11C7.08211 11 7.43566 11 7.65533 11.2197C7.875 11.4393 7.875 11.7929 7.875 12.5V14C7.875 14.7071 7.875 15.0607 7.65533 15.2803C7.43566 15.5 7.08211 15.5 6.375 15.5C5.66789 15.5 5.31434 15.5 5.09467 15.2803C4.875 15.0607 4.875 14.7071 4.875 14V12.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M10.125 5C10.125 4.29289 10.125 3.93934 10.3447 3.71967C10.5643 3.5 10.9179 3.5 11.625 3.5C12.3321 3.5 12.6857 3.5 12.9053 3.71967C13.125 3.93934 13.125 4.29289 13.125 5V6.5C13.125 7.20711 13.125 7.56066 12.9053 7.78033C12.6857 8 12.3321 8 11.625 8C10.9179 8 10.5643 8 10.3447 7.78033C10.125 7.56066 10.125 7.20711 10.125 6.5V5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M10.125 12.5C10.125 11.7929 10.125 11.4393 10.3447 11.2197C10.5643 11 10.9179 11 11.625 11C12.3321 11 12.6857 11 12.9053 11.2197C13.125 11.4393 13.125 11.7929 13.125 12.5V14C13.125 14.7071 13.125 15.0607 12.9053 15.2803C12.6857 15.5 12.3321 15.5 11.625 15.5C10.9179 15.5 10.5643 15.5 10.3447 15.2803C10.125 15.0607 10.125 14.7071 10.125 14V12.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M6.75 4.25L7.875 3.5V8"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M1.5 11.75L2.625 11V15.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M15.375 4.25L16.5 3.5V8"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M15.375 11.75L16.5 11V15.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Survey No
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.survey_no ||
                                          'No Data'}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M1.5 5C1.5 4.29289 1.5 3.93934 1.71967 3.71967C1.93934 3.5 2.29289 3.5 3 3.5C3.70711 3.5 4.06066 3.5 4.28033 3.71967C4.5 3.93934 4.5 4.29289 4.5 5V6.5C4.5 7.20711 4.5 7.56066 4.28033 7.78033C4.06066 8 3.70711 8 3 8C2.29289 8 1.93934 8 1.71967 7.78033C1.5 7.56066 1.5 7.20711 1.5 6.5V5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M4.875 12.5C4.875 11.7929 4.875 11.4393 5.09467 11.2197C5.31434 11 5.66789 11 6.375 11C7.08211 11 7.43566 11 7.65533 11.2197C7.875 11.4393 7.875 11.7929 7.875 12.5V14C7.875 14.7071 7.875 15.0607 7.65533 15.2803C7.43566 15.5 7.08211 15.5 6.375 15.5C5.66789 15.5 5.31434 15.5 5.09467 15.2803C4.875 15.0607 4.875 14.7071 4.875 14V12.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M10.125 5C10.125 4.29289 10.125 3.93934 10.3447 3.71967C10.5643 3.5 10.9179 3.5 11.625 3.5C12.3321 3.5 12.6857 3.5 12.9053 3.71967C13.125 3.93934 13.125 4.29289 13.125 5V6.5C13.125 7.20711 13.125 7.56066 12.9053 7.78033C12.6857 8 12.3321 8 11.625 8C10.9179 8 10.5643 8 10.3447 7.78033C10.125 7.56066 10.125 7.20711 10.125 6.5V5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M10.125 12.5C10.125 11.7929 10.125 11.4393 10.3447 11.2197C10.5643 11 10.9179 11 11.625 11C12.3321 11 12.6857 11 12.9053 11.2197C13.125 11.4393 13.125 11.7929 13.125 12.5V14C13.125 14.7071 13.125 15.0607 12.9053 15.2803C12.6857 15.5 12.3321 15.5 11.625 15.5C10.9179 15.5 10.5643 15.5 10.3447 15.2803C10.125 15.0607 10.125 14.7071 10.125 14V12.5Z"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                        />
                                        <path
                                          d="M6.75 4.25L7.875 3.5V8"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M1.5 11.75L2.625 11V15.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M15.375 4.25L16.5 3.5V8"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M15.375 11.75L16.5 11V15.5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        PID No
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.PID_no || 'No Data'}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center border border-r  border-0  border-transparent mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8.64706 17H7.85294C4.85814 17 3.36073 17 2.43037 16.1213C1.5 15.2426 1.5 13.8284 1.5 11L1.5 8C1.5 5.17157 1.5 3.75736 2.43037 2.87868C3.36073 2 4.85814 2 7.85294 2L8.64706 2C11.6419 2 13.1393 2 14.0696 2.87868C15 3.75736 15 5.17157 15 8V8.375"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M5.25 5.75H11.25"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M5.25 9.5H9"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                        />
                                        <path
                                          d="M11.91 16.4C11.515 16.4 11.1525 16.29 10.8225 16.07C10.4975 15.845 10.2375 15.53 10.0425 15.125C9.8475 14.72 9.75 14.2425 9.75 13.6925C9.75 13.1425 9.845 12.6675 10.035 12.2675C10.23 11.8625 10.49 11.55 10.815 11.33C11.14 11.11 11.5 11 11.895 11C12.295 11 12.6575 11.11 12.9825 11.33C13.3075 11.55 13.565 11.8625 13.755 12.2675C13.95 12.6675 14.0475 13.145 14.0475 13.7C14.0475 14.25 13.95 14.7275 13.755 15.1325C13.565 15.5375 13.3075 15.85 12.9825 16.07C12.6625 16.29 12.305 16.4 11.91 16.4ZM11.895 15.59C12.155 15.59 12.38 15.52 12.57 15.38C12.76 15.24 12.9075 15.03 13.0125 14.75C13.1225 14.47 13.1775 14.1175 13.1775 13.6925C13.1775 13.2725 13.1225 12.9225 13.0125 12.6425C12.9075 12.3625 12.7575 12.155 12.5625 12.02C12.3725 11.88 12.15 11.81 11.895 11.81C11.64 11.81 11.415 11.88 11.22 12.02C11.03 12.155 10.8825 12.3625 10.7775 12.6425C10.6725 12.9175 10.62 13.2675 10.62 13.6925C10.62 14.1175 10.6725 14.47 10.7775 14.75C10.8825 15.03 11.03 15.24 11.22 15.38C11.415 15.52 11.64 15.59 11.895 15.59Z"
                                          fill="#0E0A1F"
                                        />
                                        <path
                                          d="M15.6021 16.325V11.075H16.4496V16.325H15.6021ZM14.5521 11.8475V11.075H16.3746V11.8475H14.5521Z"
                                          fill="#0E0A1F"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Katha No
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.Katha_no ||
                                          'No Data'}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-1 items-center min-w-48"></div>
                                </div>
                              </section>
                            </div>
                          </div>

                          <div className="flex flex-col  mr-4 rounded-lg  mb-10 mt-2 ">
                            <div className="flex flex-row">
                              <h1 className="font-outfit text-left uppercase text-[#606062] font-medium text-[12px] mb-2 mt-3 ml-1">
                                Dates
                              </h1>
                            </div>

                            <div className="relative bg-white font-outfit  max-w-5xl rounded-2xl p-8 col-span-12 'w-full  mx-auto  space-y-2 sm:col-span-9 mt-1">
                              <ol className="items-center font-outfit sm:flex">
                                {events.map((d, i) => (
                                  <li key={i} className="relative mb-6 sm:mb-0">
                                    <div className=" mr-6 px-4 border-l-4 border-[#DBD3FD]">
                                      <h4 className="text-[#606062] inline-block shadow-2xs px-4 py-1 rounded-md mb-3 font-medium bg-[#F2F2F3]  font-medium text-[15px]">
                                        {d.event}
                                      </h4>

                                      {editableEvent === d.key ? (
                                        <div className="">
                                          <input
                                            type="date"
                                            className="border border-gray-300 rounded-md  text-sm"
                                            value={editedDate}
                                            onChange={(e) =>
                                              setEditedDate(e.target.value)
                                            }
                                          />
                                          <div className="flex space-x-2 mt-2">
                                            <button
                                              onClick={() => handleSave(d.key)}
                                              className="p-1 text-sm bg-[#EDE9FE]  rounded-full"
                                            >

                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={handleCancel}
                                              className="p-1 text-sm  bg-[#EDE9FE]  rounded-full"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M6 18L18 6M6 6l12 12"
                                                />
                                              </svg>

                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <time className="block mb-2 text-[12px] font-outfit font-normal leading-none text-[#606062] ">
                                          On:{' '}
                                          {customerDetails[d.key]
                                            ? prettyDate(
                                              Number(customerDetails[d.key])
                                            ).toLocaleString()
                                            : 'Not Available'}
                                        </time>
                                      )}

                                      {!(editableEvent === d.key) && (
                                        <button
                                          onClick={() => handleEdit(d.key)}
                                          className="text-blue-500 text-sm mt-1"
                                        >


                                          <svg
                                            width="25"
                                            height="26"
                                            viewBox="0 0 30 31"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <rect
                                              y="0.827393"
                                              width="30"
                                              height="30"
                                              rx="15"
                                              fill="#EDE9FE"
                                            />
                                            <path
                                              d="M18.2141 9.80978L19.6158 8.40802C20.39 7.63385 21.6452 7.63385 22.4194 8.40802C23.1935 9.18219 23.1935 10.4374 22.4194 11.2115L21.0176 12.6133M18.2141 9.80978L9.98023 18.0436C8.93493 19.0889 8.41226 19.6116 8.05637 20.2485C7.70047 20.8854 7.3424 22.3893 7 23.8274C8.43809 23.485 9.94199 23.1269 10.5789 22.771C11.2158 22.4151 11.7384 21.8925 12.7837 20.8472L21.0176 12.6133M18.2141 9.80978L21.0176 12.6133"
                                              stroke="#0E0A1F"
                                              stroke-width="1.5"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                            <path
                                              d="M14 23.8274H20"
                                              stroke="#0E0A1F"
                                              stroke-width="1.5"
                                              stroke-linecap="round"
                                            />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>
                </div>
              </div>



              {/* 
<div className="overflow-y-scroll w-full items-center justify-center mx-auto min-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">

                <div className="relative  min-h-screen mr-6">


                  <div className="relative z-0">
                    <h1 className="text-[#606062] mb-1  mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
                      Unit Features
                    </h1>

                    <img
                      alt="CRM Background"
                      src="/crmfinal.svg"
                      className="w-full h-auto object-cover"
                    />

                    <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
                      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Booked On
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            No Data
                          </h2>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Next Target Date
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            No Data
                          </h2>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Premium Type
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            No Data
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute w-full flex justify-center mt-[-70px] z-10">
                    <div className="w-full max-w-4xl px-4 mx-auto">
                      <div>
                        <div className="w-full flex justify-center">
                          <div className="p-8 rounded-2xl  bg-white w-full">
                            <section className="mb-8">
                              <h2 className="font-outfit text-[#606062] font-medium text-[12px] leading-[100%] tracking-normal uppercase mb-6">
                                UNIT DETAILS
                              </h2>

                              <div className="flex flex-wrap">
                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.725 2.56357C3.94557 2.70853 3.37194 2.96493 2.91843 3.41843C2.46493 3.87194 2.20853 4.44557 2.06357 5.225M13.275 2.56357C14.0544 2.70853 14.6281 2.96493 15.0816 3.41843C15.5351 3.87194 15.7915 4.44557 15.9364 5.225M10.425 2.37872C9.98669 2.375 9.51293 2.375 9 2.375C8.48707 2.375 8.0133 2.375 7.57499 2.37872M16.1213 8.075C16.125 8.51331 16.125 8.98707 16.125 9.5C16.125 10.0129 16.125 10.4867 16.1213 10.9251M1.87872 8.075C1.875 8.51331 1.875 8.98707 1.875 9.5C1.875 10.0129 1.875 10.4867 1.87872 10.9251M2.06357 13.775C2.20853 14.5544 2.46493 15.1281 2.91843 15.5816C3.37194 16.0351 3.94557 16.2915 4.725 16.4364M15.9364 13.775C15.7915 14.5544 15.5351 15.1281 15.0816 15.5816C14.6281 16.0351 14.0544 16.2915 13.275 16.4364M10.425 16.6213C9.98669 16.625 9.51293 16.625 9 16.625C8.48712 16.625 8.0134 16.625 7.57512 16.6213"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                      Unit No
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.unit_no}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center  flex-1 border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10.2911 10.7911C10.5782 10.5039 10.7423 10.121 11.0705 9.35522L12.2379 6.63128C12.3552 6.35758 12.4139 6.22073 12.3466 6.15342C12.2793 6.08611 12.1424 6.14476 11.8687 6.26207L9.14478 7.42947C8.379 7.75766 7.99612 7.92175 7.70893 8.20893M10.2911 10.7911C10.0039 11.0782 9.621 11.2423 8.85522 11.5705L6.13128 12.7379C5.85758 12.8552 5.72073 12.9139 5.65342 12.8466C5.58611 12.7793 5.64476 12.6424 5.76207 12.3687L6.92947 9.64478C7.25766 8.879 7.42175 8.49612 7.70893 8.20893M10.2911 10.7911L7.70893 8.20893"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M16.5 9.5C16.5 13.6421 13.1421 17 9 17C4.85786 17 1.5 13.6421 1.5 9.5C1.5 5.35786 4.85786 2 9 2C13.1421 2 16.5 5.35786 16.5 9.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M9 2L9 3.125M9 17L9 15.875"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M16.5 9.5L15.375 9.5M1.5 9.5L2.625 9.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                      Facing
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.facing}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center  flex-1 border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.725 2.56357C3.94557 2.70853 3.37194 2.96493 2.91843 3.41843C2.46493 3.87194 2.20853 4.44557 2.06357 5.225M13.275 2.56357C14.0544 2.70853 14.6281 2.96493 15.0816 3.41843C15.5351 3.87194 15.7915 4.44557 15.9364 5.225M10.425 2.37872C9.98669 2.375 9.51293 2.375 9 2.375C8.48707 2.375 8.0133 2.375 7.57499 2.37872M16.1213 8.075C16.125 8.51331 16.125 8.98707 16.125 9.5C16.125 10.0129 16.125 10.4867 16.1213 10.9251M1.87872 8.075C1.875 8.51331 1.875 8.98707 1.875 9.5C1.875 10.0129 1.875 10.4867 1.87872 10.9251M2.06357 13.775C2.20853 14.5544 2.46493 15.1281 2.91843 15.5816C3.37194 16.0351 3.94557 16.2915 4.725 16.4364M15.9364 13.775C15.7915 14.5544 15.5351 15.1281 15.0816 15.5816C14.6281 16.0351 14.0544 16.2915 13.275 16.4364M10.425 16.6213C9.98669 16.625 9.51293 16.625 9 16.625C8.48712 16.625 8.0134 16.625 7.57512 16.6213"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M1.875 9.5H16.125"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M9 2.375L9 16.625"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                      Size (sqft)
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.area?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center flex-1   flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3.75 2V6.5M1.5 4.25H6"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M15 14L15 5.75M5.25 15.5H13.5M13.5 4.25H9M3.75 9.5V14"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M13.5 4.25C13.5 3.54289 13.5 3.18934 13.7197 2.96967C13.9393 2.75 14.2929 2.75 15 2.75C15.7071 2.75 16.0607 2.75 16.2803 2.96967C16.5 3.18934 16.5 3.54289 16.5 4.25C16.5 4.95711 16.5 5.31066 16.2803 5.53033C16.0607 5.75 15.7071 5.75 15 5.75C14.2929 5.75 13.9393 5.75 13.7197 5.53033C13.5 5.31066 13.5 4.95711 13.5 4.25Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M13.5 15.5C13.5 14.7929 13.5 14.4393 13.7197 14.2197C13.9393 14 14.2929 14 15 14C15.7071 14 16.0607 14 16.2803 14.2197C16.5 14.4393 16.5 14.7929 16.5 15.5C16.5 16.2071 16.5 16.5607 16.2803 16.7803C16.0607 17 15.7071 17 15 17C14.2929 17 13.9393 17 13.7197 16.7803C13.5 16.5607 13.5 16.2071 13.5 15.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M2.25 15.5C2.25 14.7929 2.25 14.4393 2.46967 14.2197C2.68934 14 3.04289 14 3.75 14C4.45711 14 4.81066 14 5.03033 14.2197C5.25 14.4393 5.25 14.7929 5.25 15.5C5.25 16.2071 5.25 16.5607 5.03033 16.7803C4.81066 17 4.45711 17 3.75 17C3.04289 17 2.68934 17 2.46967 16.7803C2.25 16.5607 2.25 16.2071 2.25 15.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px]  font-outfit">
                                      BUA (sqft)
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.builtup_area?.toLocaleString(
                                        'en-IN'
                                      ) ||
                                        selCustomerPayload?.construct_area?.toLocaleString(
                                          'en-IN'
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            {(customerDetails?.projectType?.name === 'Villas' ||
                              customerDetails?.projectType?.name ===
                                'Apartment') && (
                              <section className="mb-8">
                                <h2 className="text-[12px] text-gray-600 font-medium mb-6">
                                  Details
                                </h2>

                                <div className="flex flex-wrap">
                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M9.75 14L13.0999 9.98014C13.2912 9.75056 13.3869 9.63577 13.3869 9.5C13.3869 9.36423 13.2912 9.24944 13.0999 9.01986L9.75 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M4.5 14L7.84988 9.98014C8.0412 9.75056 8.13686 9.63577 8.13686 9.5C8.13686 9.36423 8.0412 9.24944 7.84988 9.01986L4.5 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit ">
                                        BedRooms
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.Bedrooms_D}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8.25 14L4.90012 9.98014C4.7088 9.75056 4.61314 9.63577 4.61314 9.5C4.61314 9.36423 4.7088 9.24944 4.90012 9.01986L8.25 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M13.5 14L10.1501 9.98014C9.9588 9.75056 9.86314 9.63577 9.86314 9.5C9.86314 9.36423 9.9588 9.24944 10.1501 9.01986L13.5 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px]  font-outfit">
                                        Bathrooms
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.BathRooms_D?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.5 9.125L8.49321 5.46456C8.73382 5.244 8.85413 5.13371 9 5.13371C9.14587 5.13371 9.26618 5.244 9.50679 5.46456L13.5 9.125"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M4.5 14L8.49321 10.3396C8.73382 10.119 8.85413 10.0087 9 10.0087C9.14587 10.0087 9.26618 10.119 9.50679 10.3396L13.5 14"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Car Parking
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.Carpet_Area_D?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>


                                  <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                      <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.5 9.875L8.49321 13.5354C8.73382 13.756 8.85413 13.8663 9 13.8663C9.14587 13.8663 9.26618 13.756 9.50679 13.5354L13.5 9.875"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M4.5 5L8.49321 8.66044C8.73382 8.881 8.85413 8.99129 9 8.99129C9.14587 8.99129 9.26618 8.881 9.50679 8.66044L13.5 5"
                                          stroke="#0E0A1F"
                                          stroke-width="1.125"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                        Carpet Area Sqft
                                      </div>
                                      <div className="text-base font-outfit font-medium">
                                        {selCustomerPayload?.Carpet_Area_D?.toLocaleString(
                                          'en-IN'
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            )}

                            <section className="mb-8">
                              <h2 className="text-[12px] text-gray-600 font-medium mb-4 font-outfit">
                                DIMENSIONS
                              </h2>

                              <div className="flex flex-wrap">
                                <div className="flex items-center   border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.75 14L13.0999 9.98014C13.2912 9.75056 13.3869 9.63577 13.3869 9.5C13.3869 9.36423 13.2912 9.24944 13.0999 9.01986L9.75 5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M4.5 14L7.84988 9.98014C8.0412 9.75056 8.13686 9.63577 8.13686 9.5C8.13686 9.36423 8.0412 9.24944 7.84988 9.01986L4.5 5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      East
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.east_d?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M8.25 14L4.90012 9.98014C4.7088 9.75056 4.61314 9.63577 4.61314 9.5C4.61314 9.36423 4.7088 9.24944 4.90012 9.01986L8.25 5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M13.5 14L10.1501 9.98014C9.9588 9.75056 9.86314 9.63577 9.86314 9.5C9.86314 9.36423 9.9588 9.24944 10.1501 9.01986L13.5 5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      West
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.west_d?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.5 9.125L8.49321 5.46456C8.73382 5.244 8.85413 5.13371 9 5.13371C9.14587 5.13371 9.26618 5.244 9.50679 5.46456L13.5 9.125"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M4.5 14L8.49321 10.3396C8.73382 10.119 8.85413 10.0087 9 10.0087C9.14587 10.0087 9.26618 10.119 9.50679 10.3396L13.5 14"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      North
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.north_d?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center   flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.5 9.875L8.49321 13.5354C8.73382 13.756 8.85413 13.8663 9 13.8663C9.14587 13.8663 9.26618 13.756 9.50679 13.5354L13.5 9.875"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M4.5 5L8.49321 8.66044C8.73382 8.881 8.85413 8.99129 9 8.99129C9.14587 8.99129 9.26618 8.881 9.50679 8.66044L13.5 5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      South
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.south_d?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section className="mb-8">
                              <h2 className="text-[12px] text-gray-600 font-medium mb-4 font-outfit">
                                STATUS
                              </h2>

                              <div className="flex flex-wrap">
                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.25 6.125C11.25 6.125 11.625 6.125 12 6.875C12 6.875 13.1912 5 14.25 4.625"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M16.5 5.75C16.5 7.82107 14.8211 9.5 12.75 9.5C10.6789 9.5 9 7.82107 9 5.75C9 3.67893 10.6789 2 12.75 2C14.8211 2 16.5 3.67893 16.5 5.75Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M1.5 8L2.0625 8L1.5 8ZM7.85294 2.5625C8.1636 2.5625 8.41544 2.31066 8.41544 2C8.41544 1.68934 8.1636 1.4375 7.85294 1.4375L7.85294 2.5625ZM7.85294 17V17.5625V17ZM1.5 11H0.9375H1.5ZM8.64706 17V16.4375V17ZM14.0696 16.1213L14.4559 16.5303L14.0696 16.1213ZM15.5624 11.3142C15.5626 11.0035 15.3109 10.7515 15.0002 10.7514C14.6896 10.7512 14.4376 11.0029 14.4375 11.3136L15.5624 11.3142ZM8.64706 16.4375H7.85294V17.5625H8.64706V16.4375ZM2.0625 11L2.0625 8L0.9375 8L0.9375 11H2.0625ZM2.0625 8C2.0625 6.56898 2.06384 5.55558 2.17318 4.78746C2.27973 4.03898 2.47886 3.60659 2.81659 3.28762L2.04414 2.46973C1.45151 3.02944 1.18545 3.74351 1.05941 4.62891C0.936164 5.49468 0.9375 6.6026 0.9375 8L2.0625 8ZM7.85294 1.4375C6.37058 1.4375 5.20533 1.43643 4.29663 1.55182C3.3749 1.66885 2.63224 1.91431 2.04414 2.46973L2.81659 3.28762C3.15887 2.96437 3.63008 2.77049 4.43835 2.66785C5.25965 2.56357 6.3405 2.5625 7.85294 2.5625L7.85294 1.4375ZM7.85294 16.4375C6.3405 16.4375 5.25965 16.4364 4.43835 16.3321C3.63008 16.2295 3.15887 16.0356 2.81659 15.7124L2.04414 16.5303C2.63223 17.0857 3.3749 17.3311 4.29663 17.4482C5.20533 17.5636 6.37058 17.5625 7.85294 17.5625L7.85294 16.4375ZM0.9375 11C0.9375 12.3974 0.936164 13.5053 1.05941 14.3711C1.18545 15.2565 1.45151 15.9706 2.04414 16.5303L2.81659 15.7124C2.47886 15.3934 2.27973 14.961 2.17318 14.2125C2.06384 13.4444 2.0625 12.431 2.0625 11H0.9375ZM8.64706 17.5625C10.1294 17.5625 11.2947 17.5636 12.2034 17.4482C13.1251 17.3311 13.8678 17.0857 14.4559 16.5303L13.6834 15.7124C13.3411 16.0356 12.8699 16.2295 12.0617 16.3321C11.2404 16.4364 10.1595 16.4375 8.64706 16.4375L8.64706 17.5625ZM14.4375 11.3136C14.4368 12.637 14.4267 13.5795 14.3143 14.296C14.2051 14.9929 14.0088 15.405 13.6834 15.7124L14.4559 16.5303C15.0257 15.9921 15.294 15.3107 15.4258 14.4703C15.5544 13.6496 15.5618 12.6111 15.5624 11.3142L14.4375 11.3136Z"
                                        fill="#0E0A1F"
                                      />
                                      <path
                                        d="M5.25 10.25H8.25"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M5.25 13.25L11.25 13.25"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      Unit Status
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.status}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3 11H4.79611C5.01673 11 5.23431 11.0497 5.43163 11.1452L6.96311 11.8862C7.16043 11.9816 7.37801 12.0313 7.59862 12.0313H8.38059C9.1369 12.0313 9.75 12.6246 9.75 13.3565C9.75 13.3861 9.72973 13.4121 9.70034 13.4202L7.79466 13.9471C7.4528 14.0416 7.08675 14.0087 6.76875 13.8548L5.13158 13.0627"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M9.75 12.875L13.1946 11.8167C13.8052 11.6264 14.4653 11.852 14.8478 12.3817C15.1244 12.7647 15.0118 13.3131 14.6088 13.5456L8.97216 16.7979C8.61365 17.0047 8.19071 17.0552 7.79637 16.9382L3 15.515"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M11.25 9.5H9.75C8.33579 9.5 7.62868 9.5 7.18934 9.06066C6.75 8.62132 6.75 7.91421 6.75 6.5V5C6.75 3.58579 6.75 2.87868 7.18934 2.43934C7.62868 2 8.33579 2 9.75 2H11.25C12.6642 2 13.3713 2 13.8107 2.43934C14.25 2.87868 14.25 3.58579 14.25 5V6.5C14.25 7.91421 14.25 8.62132 13.8107 9.06066C13.3713 9.5 12.6642 9.5 11.25 9.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      Status
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.release_status?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10.3125 14.1875C11.2026 15.0776 12.375 15.9821 12.375 15.9821L13.9821 14.375C13.9821 14.375 13.0776 13.2026 12.1875 12.3125C11.2974 11.4224 10.125 10.5179 10.125 10.5179L8.51786 12.125C8.51786 12.125 9.42239 13.2974 10.3125 14.1875ZM10.3125 14.1875L7.5 17M14.25 14.1071L12.1071 16.25M10.3929 10.25L8.25 12.3929"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M15 10.25L15 6.41804C15 5.13228 15 4.4894 14.799 3.97594C14.4759 3.15049 13.7927 2.49939 12.9264 2.19151C12.3876 2 11.7129 2 10.3636 2C8.00236 2 6.82172 2 5.87877 2.33514C4.36285 2.87393 3.16711 4.01336 2.6017 5.45789C2.25 6.35644 2.25 7.48148 2.25 9.73157L2.25 11.6645C2.25 13.9952 2.25 15.1605 2.88577 15.9699C3.06793 16.2017 3.28396 16.4076 3.5273 16.5812C3.80262 16.7776 4.11721 16.9103 4.5 17"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M2.25 9.5C2.25 8.11929 3.36929 7 4.75 7C5.24934 7 5.83803 7.08749 6.32352 6.95741C6.75489 6.84182 7.09182 6.50489 7.20741 6.07352C7.3375 5.58803 7.25 4.99934 7.25 4.5C7.25 3.11929 8.36929 2 9.75 2"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      Mortgage
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.mortgage_type}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1.5 17H16.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M13.5 7.25H10.5C8.6385 7.25 8.25 7.6385 8.25 9.5V17H15.75V9.5C15.75 7.6385 15.3615 7.25 13.5 7.25Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M11.25 17H2.25V4.25C2.25 2.3885 2.6385 2 4.5 2H9C10.8615 2 11.25 2.3885 11.25 4.25V7.25"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M2.25 5H4.5M2.25 8H4.5M2.25 11H4.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M11.25 10.25H12.75M11.25 12.5H12.75"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M12 17L12 14.75"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      Sharing
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.sharing || 'No Data'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section className="mb-8">
                              <h2 className="text-[12px] text-gray-600 font-medium mb-4 font-outfit">
                                SCHEDULE
                              </h2>

                              <div className="flex flex-wrap">
                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M15 5V14M13.5 3.5H4.5M13.5 15.5H4.5M3 14V5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M16.5 3.5C16.5 4.32843 15.8284 5 15 5C14.1716 5 13.5 4.32843 13.5 3.5C13.5 2.67157 14.1716 2 15 2C15.8284 2 16.5 2.67157 16.5 3.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M4.5 3.5C4.5 4.32843 3.82843 5 3 5C2.17157 5 1.5 4.32843 1.5 3.5C1.5 2.67157 2.17157 2 3 2C3.82843 2 4.5 2.67157 4.5 3.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M16.5 15.5C16.5 16.3284 15.8284 17 15 17C14.1716 17 13.5 16.3284 13.5 15.5C13.5 14.6716 14.1716 14 15 14C15.8284 14 16.5 14.6716 16.5 15.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M4.5 15.5C4.5 16.3284 3.82843 17 3 17C2.17157 17 1.5 16.3284 1.5 15.5C1.5 14.6716 2.17157 14 3 14C3.82843 14 4.5 14.6716 4.5 15.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      East by
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.east_sch_by?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="16"
                                      height="18"
                                      viewBox="0 0 16 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2 3.75V14.25H14V2.25"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M9.5 14.25L9.5 10.1529C9.5 8.54534 6.5 8.68773 6.5 10.1529L6.5 14.25"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M9.5 16.5L6.5 16.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M1.25 3.75L7.05132 1.69511C7.99167 1.43496 8.00833 1.43496 8.94868 1.69511L14.75 3.75"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M8.00895 6H8"
                                        stroke="#0E0A1F"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      West by
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.west_sch_by?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3.375 2.75L3.375 16.25"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M13.125 2.75L13.125 16.25"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M8.25 2.75V5.75"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M8.25 8L8.25 11"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M8.25 13.25L8.25 16.25"
                                        stroke="#141B34"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      North by
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.north_sch_by?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center   flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M15 5V14M13.5 3.5H4.5M13.5 15.5H4.5M3 14V5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M16.5 3.5C16.5 4.32843 15.8284 5 15 5C14.1716 5 13.5 4.32843 13.5 3.5C13.5 2.67157 14.1716 2 15 2C15.8284 2 16.5 2.67157 16.5 3.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M4.5 3.5C4.5 4.32843 3.82843 5 3 5C2.17157 5 1.5 4.32843 1.5 3.5C1.5 2.67157 2.17157 2 3 2C3.82843 2 4.5 2.67157 4.5 3.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M16.5 15.5C16.5 16.3284 15.8284 17 15 17C14.1716 17 13.5 16.3284 13.5 15.5C13.5 14.6716 14.1716 14 15 14C15.8284 14 16.5 14.6716 16.5 15.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M4.5 15.5C4.5 16.3284 3.82843 17 3 17C2.17157 17 1.5 16.3284 1.5 15.5C1.5 14.6716 2.17157 14 3 14C3.82843 14 4.5 14.6716 4.5 15.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      South by
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.south_sch_by?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section className="mb-8">
                              <h2 className="text-[12px] text-gray-600 font-medium mb-4">
                                ADDITIONAL DETAILS
                              </h2>

                              <div className="flex flex-wrap">
                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1.5 5C1.5 4.29289 1.5 3.93934 1.71967 3.71967C1.93934 3.5 2.29289 3.5 3 3.5C3.70711 3.5 4.06066 3.5 4.28033 3.71967C4.5 3.93934 4.5 4.29289 4.5 5V6.5C4.5 7.20711 4.5 7.56066 4.28033 7.78033C4.06066 8 3.70711 8 3 8C2.29289 8 1.93934 8 1.71967 7.78033C1.5 7.56066 1.5 7.20711 1.5 6.5V5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M4.875 12.5C4.875 11.7929 4.875 11.4393 5.09467 11.2197C5.31434 11 5.66789 11 6.375 11C7.08211 11 7.43566 11 7.65533 11.2197C7.875 11.4393 7.875 11.7929 7.875 12.5V14C7.875 14.7071 7.875 15.0607 7.65533 15.2803C7.43566 15.5 7.08211 15.5 6.375 15.5C5.66789 15.5 5.31434 15.5 5.09467 15.2803C4.875 15.0607 4.875 14.7071 4.875 14V12.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M10.125 5C10.125 4.29289 10.125 3.93934 10.3447 3.71967C10.5643 3.5 10.9179 3.5 11.625 3.5C12.3321 3.5 12.6857 3.5 12.9053 3.71967C13.125 3.93934 13.125 4.29289 13.125 5V6.5C13.125 7.20711 13.125 7.56066 12.9053 7.78033C12.6857 8 12.3321 8 11.625 8C10.9179 8 10.5643 8 10.3447 7.78033C10.125 7.56066 10.125 7.20711 10.125 6.5V5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M10.125 12.5C10.125 11.7929 10.125 11.4393 10.3447 11.2197C10.5643 11 10.9179 11 11.625 11C12.3321 11 12.6857 11 12.9053 11.2197C13.125 11.4393 13.125 11.7929 13.125 12.5V14C13.125 14.7071 13.125 15.0607 12.9053 15.2803C12.6857 15.5 12.3321 15.5 11.625 15.5C10.9179 15.5 10.5643 15.5 10.3447 15.2803C10.125 15.0607 10.125 14.7071 10.125 14V12.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M6.75 4.25L7.875 3.5V8"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M1.5 11.75L2.625 11V15.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M15.375 4.25L16.5 3.5V8"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M15.375 11.75L16.5 11V15.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      Survey No
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.survey_no ||
                                        'No Data'}
                                    </div>
                                  </div>
                                </div>


                                <div className="flex items-center border border-r border-gray-300 border-0 mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1.5 5C1.5 4.29289 1.5 3.93934 1.71967 3.71967C1.93934 3.5 2.29289 3.5 3 3.5C3.70711 3.5 4.06066 3.5 4.28033 3.71967C4.5 3.93934 4.5 4.29289 4.5 5V6.5C4.5 7.20711 4.5 7.56066 4.28033 7.78033C4.06066 8 3.70711 8 3 8C2.29289 8 1.93934 8 1.71967 7.78033C1.5 7.56066 1.5 7.20711 1.5 6.5V5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M4.875 12.5C4.875 11.7929 4.875 11.4393 5.09467 11.2197C5.31434 11 5.66789 11 6.375 11C7.08211 11 7.43566 11 7.65533 11.2197C7.875 11.4393 7.875 11.7929 7.875 12.5V14C7.875 14.7071 7.875 15.0607 7.65533 15.2803C7.43566 15.5 7.08211 15.5 6.375 15.5C5.66789 15.5 5.31434 15.5 5.09467 15.2803C4.875 15.0607 4.875 14.7071 4.875 14V12.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M10.125 5C10.125 4.29289 10.125 3.93934 10.3447 3.71967C10.5643 3.5 10.9179 3.5 11.625 3.5C12.3321 3.5 12.6857 3.5 12.9053 3.71967C13.125 3.93934 13.125 4.29289 13.125 5V6.5C13.125 7.20711 13.125 7.56066 12.9053 7.78033C12.6857 8 12.3321 8 11.625 8C10.9179 8 10.5643 8 10.3447 7.78033C10.125 7.56066 10.125 7.20711 10.125 6.5V5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M10.125 12.5C10.125 11.7929 10.125 11.4393 10.3447 11.2197C10.5643 11 10.9179 11 11.625 11C12.3321 11 12.6857 11 12.9053 11.2197C13.125 11.4393 13.125 11.7929 13.125 12.5V14C13.125 14.7071 13.125 15.0607 12.9053 15.2803C12.6857 15.5 12.3321 15.5 11.625 15.5C10.9179 15.5 10.5643 15.5 10.3447 15.2803C10.125 15.0607 10.125 14.7071 10.125 14V12.5Z"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                      />
                                      <path
                                        d="M6.75 4.25L7.875 3.5V8"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M1.5 11.75L2.625 11V15.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M15.375 4.25L16.5 3.5V8"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M15.375 11.75L16.5 11V15.5"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      PID No
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.PID_no || 'No Data'}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center border border-r  border-0  border-transparent mr-4  flex-1 min-w-42">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-4">
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M8.64706 17H7.85294C4.85814 17 3.36073 17 2.43037 16.1213C1.5 15.2426 1.5 13.8284 1.5 11L1.5 8C1.5 5.17157 1.5 3.75736 2.43037 2.87868C3.36073 2 4.85814 2 7.85294 2L8.64706 2C11.6419 2 13.1393 2 14.0696 2.87868C15 3.75736 15 5.17157 15 8V8.375"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M5.25 5.75H11.25"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M5.25 9.5H9"
                                        stroke="#0E0A1F"
                                        stroke-width="1.125"
                                        stroke-linecap="round"
                                      />
                                      <path
                                        d="M11.91 16.4C11.515 16.4 11.1525 16.29 10.8225 16.07C10.4975 15.845 10.2375 15.53 10.0425 15.125C9.8475 14.72 9.75 14.2425 9.75 13.6925C9.75 13.1425 9.845 12.6675 10.035 12.2675C10.23 11.8625 10.49 11.55 10.815 11.33C11.14 11.11 11.5 11 11.895 11C12.295 11 12.6575 11.11 12.9825 11.33C13.3075 11.55 13.565 11.8625 13.755 12.2675C13.95 12.6675 14.0475 13.145 14.0475 13.7C14.0475 14.25 13.95 14.7275 13.755 15.1325C13.565 15.5375 13.3075 15.85 12.9825 16.07C12.6625 16.29 12.305 16.4 11.91 16.4ZM11.895 15.59C12.155 15.59 12.38 15.52 12.57 15.38C12.76 15.24 12.9075 15.03 13.0125 14.75C13.1225 14.47 13.1775 14.1175 13.1775 13.6925C13.1775 13.2725 13.1225 12.9225 13.0125 12.6425C12.9075 12.3625 12.7575 12.155 12.5625 12.02C12.3725 11.88 12.15 11.81 11.895 11.81C11.64 11.81 11.415 11.88 11.22 12.02C11.03 12.155 10.8825 12.3625 10.7775 12.6425C10.6725 12.9175 10.62 13.2675 10.62 13.6925C10.62 14.1175 10.6725 14.47 10.7775 14.75C10.8825 15.03 11.03 15.24 11.22 15.38C11.415 15.52 11.64 15.59 11.895 15.59Z"
                                        fill="#0E0A1F"
                                      />
                                      <path
                                        d="M15.6021 16.325V11.075H16.4496V16.325H15.6021ZM14.5521 11.8475V11.075H16.3746V11.8475H14.5521Z"
                                        fill="#0E0A1F"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-[#606062] font-medium text-[12px] font-outfit">
                                      Katha No
                                    </div>
                                    <div className="text-base font-outfit font-medium">
                                      {selCustomerPayload?.Katha_no ||
                                        'No Data'}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex-1 items-center min-w-48"></div>
                              </div>
                            </section>
                          </div>
                        </div>

                        <div className="flex flex-col  mr-4 rounded-lg  mb-10 mt-2 ">
                          <div className="flex flex-row">
                            <h1 className="font-outfit text-left uppercase text-[#606062] font-medium text-[12px] mb-2 mt-3 ml-1">
                              Dates
                            </h1>
                          </div>

                          <div className="relative bg-white font-outfit  max-w-5xl rounded-2xl p-8 col-span-12 'w-full  mx-auto  space-y-2 sm:col-span-9 mt-1">
                            <ol className="items-center font-outfit sm:flex">
                              {events.map((d, i) => (
                                <li key={i} className="relative mb-6 sm:mb-0">
                                  <div className=" mr-6 px-4 border-l-4 border-[#DBD3FD]">
                                    <h4 className="text-[#606062] inline-block shadow-2xs px-4 py-1 rounded-md mb-3 font-medium bg-[#F2F2F3]  font-medium text-[15px]">
                                      {d.event}
                                    </h4>

                                    {editableEvent === d.key ? (
                                      <div className="">
                                        <input
                                          type="date"
                                          className="border border-gray-300 rounded-md  text-sm"
                                          value={editedDate}
                                          onChange={(e) =>
                                            setEditedDate(e.target.value)
                                          }
                                        />
                                        <div className="flex space-x-2 mt-2">
                                          <button
                                            onClick={() => handleSave(d.key)}
                                            className="p-1 text-sm bg-[#EDE9FE]  rounded-full"
                                          >

                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth={2}
                                              stroke="currentColor"
                                              className="w-4 h-4"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={handleCancel}
                                            className="p-1 text-sm  bg-[#EDE9FE]  rounded-full"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth={2}
                                              stroke="currentColor"
                                              className="w-4 h-4"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                   
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <time className="block mb-2 text-[12px] font-outfit font-normal leading-none text-[#606062] ">
                                        On:{' '}
                                        {customerDetails[d.key]
                                          ? prettyDate(
                                              Number(customerDetails[d.key])
                                            ).toLocaleString()
                                          : 'Not Available'}
                                      </time>
                                    )}

                                    {!(editableEvent === d.key) && (
                                      <button
                                        onClick={() => handleEdit(d.key)}
                                        className="text-blue-500 text-sm mt-1"
                                      >
                         

                                        <svg
                                          width="25"
                                          height="26"
                                          viewBox="0 0 30 31"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            y="0.827393"
                                            width="30"
                                            height="30"
                                            rx="15"
                                            fill="#EDE9FE"
                                          />
                                          <path
                                            d="M18.2141 9.80978L19.6158 8.40802C20.39 7.63385 21.6452 7.63385 22.4194 8.40802C23.1935 9.18219 23.1935 10.4374 22.4194 11.2115L21.0176 12.6133M18.2141 9.80978L9.98023 18.0436C8.93493 19.0889 8.41226 19.6116 8.05637 20.2485C7.70047 20.8854 7.3424 22.3893 7 23.8274C8.43809 23.485 9.94199 23.1269 10.5789 22.771C11.2158 22.4151 11.7384 21.8925 12.7837 20.8472L21.0176 12.6133M18.2141 9.80978L21.0176 12.6133"
                                            stroke="#0E0A1F"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M14 23.8274H20"
                                            stroke="#0E0A1F"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}










            </>
          )}

          {selFeature === 'summary' && (
            <div className="">
              <CrmUnitSummary
                selCustomerPayload={selCustomerPayload}
                assets={selCustomerPayload?.assets}
                totalIs={totalIs}
                unitTransactionsA={unitTransactionsA}
                setFeature={setFeature}
              />
            </div>
          )}

          {['finance_info'].includes(selFeature) && (
            <>
              <div className="">
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

          {selFeature === 'loan_info' && (
            <>









              <div className="overflow-y-scroll w-full items-center justify-center mx-auto min-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">


                <div className="relative min-h-screen mr-6">
                  <div className="max-w-6xl bg-white rounded-[16px] mx-auto p-6">
                    <h1 className="font-[Outfit] font-semibold text-[16px] leading-[100%] tracking-[0%] mb-6">Last Completed</h1>

                    {/* Top summary card */}
                    <div className="max-w-5xl mx-auto my-4 p-4 bg-white border border-[#e7e7e9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-[16px]">
                      <div className="flex flex-row divide-x divide-gray-200">
                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">
                            Funding Type

                          </div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">
                            No Data
                          </div>
                        </div>

                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">
                            Self Contribution
                          </div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">
                            No Data
                          </div>
                        </div>

                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">
                            Bank Contribution
                          </div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">
                            No Data

                          </div>
                        </div>
                      </div>
                    </div>















                    {/* Main details card */}



                    <div className="w-full max-w-5xl px-4 mx-auto  h-full items-center justify-center  flex  z-10 relative">
                      <LoanApplyFlowHome customerDetails={customerDetails} />
                    </div>






                  </div>
                </div>
              </div>








              {/* <div className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
                <div className="relative min-h-screen mr-6">
  

                  <div className="relative z-0">
                    <h1 className="text-[#606062] mb-1   mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
                      Loan details
                    </h1>

                    <img
                      alt="CRM Background"
                      src="/crmfinal.svg"
                      className="w-full h-auto object-cover"
                    />

                    <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
                      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Funding Type
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            No Data
                          </h2>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Self Contribution
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            No Data
                          </h2>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Bank Contribution
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            No Data
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-5xl px-4 mx-auto  h-full items-center justify-center  flex mt-[-70px] z-10 relative">
                    <LoanApplyFlowHome customerDetails={customerDetails} />
                  </div>
                </div>
              </div> */}
            </>
          )}

          {selFeature === 'agreement_info' && (
            <>
              {/* <div className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">

                <div className="relative min-h-screen mr-6">


                  <div className="relative z-0">
                    <h1 className="text-[#606062] font-outfit mb-1    mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
                      Unit Documents
                    </h1>

                    <img
                      alt="CRM Background"
                      src="/crmfinal.svg"
                      className="w-full h-auto object-cover"
                    />

                    <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
                      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Total Documents
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            {' '}
                            {totalUploadedDocs || 0}
                          </h2>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Uploaded By
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            No Data
                          </h2>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-outfit font-normal  text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                            Pending Documents
                          </p>
                          <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                            {pendingDocs}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-full items-center flex justify-center mt-[-90px] z-10 relative ">
                    <div className="w-full max-w-3xl px-4 flex flex-col">
                      <section className="w-full max-w-3xl mx-auto  mt-2 rounded-2xl">
                        {documentTypes.length === 0 ? (
                          <div className="w-full text-center py-5">
                            No documents
                          </div>
                        ) : (
                          documentTypes.map((doc, i) => (
                            <section key={i} className="px-4">
                              <UnitDocsWidget
                                data={doc}
                                id={customerDetails?.id}
                                unitDetails={customerDetails}
                                fileName={doc?.name}
                                date={doc?.time}
                                uploadedCount={doc.uploadedCount}
                              />
                            </section>
                          ))
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              </div> */}










              <div className="overflow-y-scroll w-full items-center justify-center mx-auto min-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">


                <div className="relative min-h-screen mr-6">
                  <div className="max-w-6xl bg-white rounded-[16px] mx-auto p-6">
                    <h1 className="font-[Outfit] font-semibold text-[16px] leading-[100%] tracking-[0%] mb-6">Unit Details</h1>

                    {/* Top summary card */}
                    <div className="max-w-6xl mx-auto my-4 p-4 bg-white border border-[#e7e7e9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-[16px]">
                      <div className="flex flex-row divide-x divide-gray-200">
                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">Eligible Due</div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">₹ 1,22,32,000</div>
                        </div>

                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">Next Milestone</div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">Registration in 2 Days</div>
                        </div>

                        <div className="flex-1 p-2 px-6 text-center">
                          <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">Upcoming Milestone</div>
                          <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">Video KYC</div>
                        </div>
                      </div>
                    </div>

                    {/* Main details card */}
                    <div className="p-4 flex flex-col items-center">

                      {/* <div className=" w-full  flex items-center justify-center  z-10"> */}
                      <div className="w-full max-w-6xl">


                        {documentTypes.length === 0 ? (
                          <div className="w-full text-center py-5">
                            No documents
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-4">
                            {documentTypes.map((doc, i) => (
                              <div key={i} className="w-full px-4">
                                <UnitDocsWidget
                                  data={doc}
                                  id={customerDetails?.id}
                                  unitDetails={customerDetails}
                                  fileName={doc?.name}
                                  date={doc?.time}
                                  uploadedCount={doc.uploadedCount}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </div>
















              </div>




            </>
          )}

          {selFeature === 'legal_info' && <></>}

          {selFeature === 'brokerage_info' && (
            <>
              <div className="">
                <BrokerageDetails
                  openUserProfile={openUserProfile}
                  selUnitDetails={selCustomerPayload}
                />
              </div>
            </>
          )}

          {selFeature === 'cancel_booking' && (
            <>
              <CancelUnitForm
                setOpen={setOpen}
                openUserProfile={openUserProfile}
                selUnitDetails={selCustomerPayload}
              />{' '}
            </>
          )}

          {selFeature === 'unblock_Unit' && (
            <>
              <UnblockUnitForm
                openUserProfile={openUserProfile}
                selUnitDetails={selCustomerPayload}
              />{' '}
            </>
          )}

          {selFeature === 'unit_audit' && (
            <>
              <UnitAudit selUnitDetails={selCustomerPayload} />{' '}
            </>
          )}
        </div>









<div className="w-[210px] min-w-[210px] mx-6 bg-white rounded-2xl h-[80%] overflow-auto">
  <div className="py-4">
    <ul className="flex flex-col" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
      {[
        {
          icon: "/icons/summary-icon.svg",
          selectedIcon: "/icons/summary-icon-selected.svg",
          lab: 'Summary',
          val: 'summary',
        },
        {
          icon: "/icons/applicant-icon.svg",
          selectedIcon: "/icons/applicant-icon-selected.svg",
          lab: 'Applicant Details',
          val: 'applicant_info',
        },
        {
          icon: "/icons/unit-icon.svg",
          selectedIcon: "/icons/unit-icon-selected.svg",
          lab: 'Unit Details',
          val: 'unit_information',
        },
        {
          icon: "/icons/cost-icon.svg",
          selectedIcon: "/icons/cost-icon-selected.svg",
          lab: 'Cost & Payments',
          val: 'finance_info',
        },
        {
          icon: "/icons/documents-icon.svg",
          selectedIcon: "/icons/documents-icon-selected.svg",
          lab: 'Documents',
          val: 'agreement_info',
        },
        {
          icon: "/icons/loan-icon.svg",
          selectedIcon: "/icons/loan-icon-selected.svg",
          lab: 'Loan Details',
          val: 'loan_info',
        },
        {
          icon: "/icons/brokerage-icon.svg",
          selectedIcon: "/icons/brokerage-icon-selected.svg",
          lab: 'Brokerage Details',
          val: 'brokerage_info',
        },
        {
          icon: "/icons/tasks-icon.svg",
          selectedIcon: "/icons/tasks-icon-selected.svg",
          lab: 'Tasks',
          val: 'tasks',
        },
        {
          icon: "/icons/timeline-icon.svg",
          selectedIcon: "/icons/timeline-icon-selected.svg",
          lab: 'Timeline',
          val: 'timeline',
        },
        {
          icon: "/icons/cancel-icon.svg",
          selectedIcon: "/icons/cancel-icon-selected.svg",
          lab: 'Cancel Booking',
          val: 'cancel_booking',
        },
        {
          icon: "/icons/audit-icon.svg",
          selectedIcon: "/icons/audit-icon-selected.svg",
          lab: 'Unit Audit',
          val: 'unit_audit',
        },
      ].map((d, i) => (
        <li key={i} className="text-sm font-bodyLato" role="presentation">
          <div
            className={`relative flex items-center text-[#0E0A1F] px-2 my-2 py-2 font-bold cursor-pointer  transition-colors duration-200 ${
              selFeature === d.val ? '' : ''
            }`}
            onClick={() => {
              if (d.val === 'cancel_booking') {
                if (['booked', 'agreement_pipeline', 'allotment', 'ATS', 'sd_pipeline'].includes(selCustomerPayload?.status)) {
                  setFeature(d.val);
                } else {
                  toast.error('You cannot cancel booking for this status');
                }
              } else {
                setFeature(d.val);
              }
            }}
          >

            {selFeature === d.val && (
              <div className="absolute left-0 top-0 h-full w-[6px] bg-[#6F3FF5] rounded-r-lg"></div>
            )}
            
    
            <img 
              src={selFeature === d.val ? d.selectedIcon : d.icon} 
              alt={d.lab}
              className="w-5 h-5 ml-6"
            />
            
     
            <span
              className={`ml-3 font-outfit text-[14px] font-medium ${
                selFeature === d.val
                  ? 'text-[#0E0A1F]'
                  : 'text-[#606062] hover:text-[#0E0A1F]'
              }`}
            >
              {d.lab}
            </span>
          </div>
        </li>
      ))}
    </ul>
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
