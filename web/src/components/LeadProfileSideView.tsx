/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'

import {
  PencilIcon,
  DeviceMobileIcon,
  MailIcon,
  PhoneIcon,
  ChatIcon,
  ChatAlt2Icon,
  ChatAltIcon,
} from '@heroicons/react/outline'
import {
  CheckCircleIcon,
  DocumentIcon,
  AdjustmentsIcon,
  XIcon,
} from '@heroicons/react/solid'
import { DownloadIcon } from '@heroicons/react/solid'
import ClockIcon from '@heroicons/react/solid/ClockIcon'
import { Box, Slider, Typography } from '@mui/material'
import { setHours, setMinutes } from 'date-fns'
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ErrorMessage, Form, Formik, useFormik } from 'formik'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import {
  addLeadScheduler,
  updateSch,
  deleteSchLog,
  steamLeadActivityLog,
  steamLeadScheduleLog,
  steamUsersListByRole,
  updateLeadAssigTo,
  updateLeadStatus,
  updateSchLog,
  addLeadNotes,
  steamLeadNotes,
  createAttach,
  getCustomerDocs,
  getAllProjects,
  updateLeadProject,
  steamLeadById,
  updateLeadRemarks_NotIntrested,
  updateLeadRemarks_VisitDone,
  undoSchLog,
  editTaskDB,
  editAddTaskCommentDB,
  updateLeadLastUpdateTime,
  IncrementTastCompletedCount,
  IncrementTastTotalCount,
  decreCountOnResheduleOtherDay,
  sendCallNotification,
  updateLeadsStrength,
  checkIfLeadAlreadyExists,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { db, storage } from 'src/context/firebaseConfig'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  prettyDate,
  prettyDateTime,
  timeConv,
} from 'src/util/dateConverter'
import { CustomSelect } from 'src/util/formFields/selectBoxField'

import LogSkelton from './shimmerLoaders/logSkelton'

import 'react-datepicker/dist/react-datepicker.css'

import AssigedToDropComp from './assignedToDropComp'
import ProjPhaseHome from './ProjPhaseHome/ProjPhaseHome'

import { useSnackbar } from 'notistack'

import SelectDropDownComp from './comps/dropDownhead'
import EditLeadTask from './Comp_CustomerProfileSideView/EditLeadTask'
import AddLeadTaskComment from './Comp_CustomerProfileSideView/AddLeadTaskComment'
import LeadTaskDisplayHead from './Comp_CustomerProfileSideView/LeadTaskDisplayHead'
import LeadTaskFooter from './Comp_CustomerProfileSideView/LeadTaskFooter'

import { USER_ROLES } from 'src/constants/userRoles'
import { currentStatusDispFun } from 'src/util/leadStatusDispFun'

import EmailForm from './customerProfileView/emailForm'
import Confetti from './shared/confetti'

import '../styles/myStyles.css'

import { getWhatsAppTemplates } from 'src/util/TuneWhatsappMsg'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import SiderForm from './SiderForm/SiderForm'
import Stepper from './A_SalesModule/stepper'
import RoundedProgressBar from './A_SalesModule/Reports/charts/horizontalProgressBar'
import ProjectManagement from './A_SalesModule/ProjectManagement'
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Edit3,
  IndianRupee,
  MessageSquare,
  Phone,
  Plus,
  PlusCircle,
  User
} from 'lucide-react'
import SemicircleProgressChart from './A_SalesModule/Reports/charts/SemiCircleProgress'
import toast, { ToastBar } from 'react-hot-toast'
import { use } from 'i18next'
import GradientSlider from './A_SalesModule/LeadProfileSideView/gradientSlider/gradientSlider'
import DuplicateLeadCard from './A_SalesModule/duplicateLeadCard'
import { VerySlimSelectBox } from 'src/util/formFields/slimSelectBoxField'
import AssigedToDropCompCrm from './assignedToDropCompCrm'
import { activieLogNamer, empNameSetter } from 'src/util/logNameTranformer'
import ActivityLogComp from './A_SalesModule/LeadProfileSideView/activityLog'
import { handleCallButtonClick } from 'src/util/dailerFeature'

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
  // { label: 'Select Reason', value: '' },
  { label: 'Budget Issue', value: 'budget_issue' },

  {
    label: 'Looking for Different Area & Property',
    value: 'differeent_area_options',
  },
  { label: 'Looking for Different Area', value: 'differeent_area' },
  { label: 'Looking for Different Property', value: 'differeent_options' },
  { label: 'Not happy with the development & quality', value: 'nh_dev_qual' },

  { label: 'Need more time', value: 'Need_more_time' },
  {
    label: 'Not Looking for any property',
    value: 'not_looking_for_any_property',
  },
  { label: 'just doing property research', value: 'property_research' },
  { label: 'Others', value: 'others' },
]
const junktOptions = [
  { label: 'Phone no invalid', value: 'phone_no_invalid' },

  {
    label: 'Fake Customer',
    value: 'fake_customer',
  },
  { label: 'RNR from Long Time', value: 'long_time_rnr' },
]

const siteVisitFeedbackOptions = [
  { label: 'Happy', value: 'happy' },
  {
    label: 'Sad',
    value: 'sad',
  },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Want more options', value: 'more_options' },

  { label: 'Others', value: 'others' },
]

const lookingAtBudgetRange = [
  { label: '20 lacs - 50 lacs', value: 'less50L', str: 20 },
  { label: '50 lacs - 1 cr', value: 'less1Cr', str: 30 },
  { label: '1 cr - 2 cr', value: 'less1.5Cr', str: 40 },
  { label: ' 2 cr and above', value: 'less2Cr', str: 50 },
]
const bedRoomConfigurtionRange = [
  { label: '1 BHK', value: '1', str: 0 },
  { label: '1.5 BHK', value: '1.5', str: 10 },
  { label: '2 BHK', value: '2', str: 20 },

  { label: '2.5 BHK', value: '2.5', str: 20 },

  { label: '3 BHK', value: '3', str: 50 },

  { label: '3.5 BHK', value: '3.5', str: 50 },
]
const exitstingAsset = [
  { label: 'Plot', value: 'plot', str: 10 },
  { label: 'Apartment', value: 'apartment', str: 20 },
  { label: 'Villa', value: 'villa', str: 30 },
  { label: 'Apartment & Villa', value: 'apart_villa', str: 40 },
  { label: 'Plot & Apartment', value: 'plot_villa', str: 50 },
  { label: 'Others', value: 'other', str: 60 },
]
const reasonPurchase = [
  { label: 'Living', value: 'living', str: 10 },
  { label: 'Commercial', value: 'Commercial', str: 20 },
  { label: 'Rental', value: 'renatal', str: 30 },
  { label: 'Investment', value: 'investment', str: 40 },
]
const preferredArea = [
  { label: 'East Banglore', value: 'eastBanglore', str: 10 },
  { label: 'West Banglore', value: 'westBanglore', str: 20 },
  { label: 'North Banglore', value: 'northBanglore', str: 30 },
  { label: 'South Banglore ', value: 'southBanglore', str: 40 },
]

const labelImages = {
  Happy: '/path/to/images/happy.png',
  Sad: '/path/to/images/sad.png',
  Neutral: '/path/to/images/neutral.png',
  Others: '/path/to/images/others.png',
  'Want More option': '/path/to/images/more.png', // Replace with the image you want for this option
}

const torrowDate = new Date(
  +new Date().setHours(0, 0, 0, 0) + 86400000
).getTime()
const todaydate = new Date()
const ddMy =
  'D' +
  todaydate.getDate() +
  'M' +
  todaydate.getMonth() +
  'Y' +
  todaydate.getFullYear()

export default function LeadProfileSideView({
  openUserProfile,
  customerDetails,
  unitViewerrr,
  unitsViewMode,
  setUnitsViewMode,
}) {
  const { user } = useAuth()
  const { orgId } = user
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])
  const [uploadFile, setUploadFile] = useState()
  const [postPoneToFuture, setPostPoneToFuture] = useState('present')
  const [founDocs, setFoundDocs] = useState([])
  const [selFeature, setFeature] = useState('lead_summary')
  const [myStatus, setMyStatus] = useState('')
  const [tempLeadStatus, setLeadStatus] = useState('')
  const [assignerName, setAssignerName] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [timeHide, setTimeHide] = useState(false)

  const [optionvalues, setoptionvalues] = useState({
    budget: '',
    bstr: 0,
    purchase: '',
    pstr: 0,
    area: '',
    astr: 0,
    asset: '',
    asstr: 0,
    config: '',
    confstr: 0,
  })
  const [opstr, setopstr] = useState(0)
  const [showNotInterested, setShowNotInterested] = useState(false)
  const [showJunk, setShowJunk] = useState(false)

  const [junkReason, setJunkReason] = useState('Phone no Invalid')
  const [leadsActivityFetchedData, setLeadsFetchedActivityData] = useState([])
  const [leadSchLoading, setLeadsSchLoading] = useState(true)

  const [leadSchFetchedData, setLeadsFetchedSchData] = useState([])
  const [leadNotesFetchedData, setLeadsFetchedNotesData] = useState([])
  const [showVisitFeedBackStatus, setShowVisitFeedBackStatus] = useState(false)
  const [leadSchFilteredData, setLeadsFilteredSchData] = useState([])
  const [leadNextTaskObj, setLeadNextTaskObj] = useState({})

  const [takTitle, setTakTitle] = useState('')
  const [takNotes, setNotesTitle] = useState('')
  const [fbTitle, setFbTitle] = useState('')
  const [fbNotes, setfbNotes] = useState('')
  const [attachType, setAttachType] = useState('')
  const [notInterestType, setNotInterestType] = useState('')
  const [attachTitle, setAttachTitle] = useState('')
  const [filterData, setFilterData] = useState([])
  const [docsList, setDocsList] = useState([])
  const [progress, setProgress] = useState(0)
  const [editTaskObj, setEditTaskObj] = useState({})
  const [selType, setSelType] = useState('')

  const d = new window.Date()
  const [value, setValue] = useState(d)

  const [startDate, setStartDate] = useState(d.getTime() + 60000)

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
  const [statusTimeLineA, setStatusTimeLineA] = useState(['new'])
  const [selSchGrpO, setSelSchGrpO] = useState({})
  const [closeTask, setCloseTask] = useState(false)

  const [selProjectIs, setSelProjectIs] = useState({
    projectName: '',
    uid: '',
  })
  const [selProjectFullDetails, setSelProjectFullDetails] = useState({
    projectName: '',
    uid: '',
  })
  const emailFormik = useFormik({
    initialValues: {
      fromEmail: '',
      toEmail: '',
      subject: '',
      message: '',
      attachFile: '',
    },

    onSubmit: (values) => {
      console.log(values)
    },
  })

  const [leadDetailsObj, setLeadDetailsObj] = useState({})
  const [addTaskCommentObj, setAddTaskCommentObj] = useState({})
  const [addCommentPlusTask, setAddCommentPlusTask] = useState(false)
  const [addCommentTitle, setAddCommentTitle] = useState('')

  const [budget, setBudget] = useState('')
  const [configuration, setConfiguration] = useState('')
  const [reasonLeft, setReasonLeft] = useState('')
  const [reasonRight, setReasonRight] = useState('')

  const [addCommentTime, setAddCommentTime] = useState(d.getTime() + 60000)
  const {
    id,

    by,
    CT,
  } = customerDetails

  const {
    Name,
    Project,
    projectType,
    ProjectId,
    Source,

    Mobile,
    Date,
    Email,
    Assigned,
    AssignedBy,
    Notes,
    Timeline,
    documents,
    Remarks,
    notInterestedReason,
    notInterestedNotes,
    stsUpT,
    assignT,
  } = leadDetailsObj

  const { enqueueSnackbar } = useSnackbar()
  const [hover, setHover] = useState(false)
  const [hoverId, setHoverID] = useState(1000)
  const [hoverTasId, setHoverTasId] = useState(2000)
  const [streamCoveredA, setStreamCoveredA] = useState([])
  const [streamCurrentStatus, setStreamCurrentStatus] = useState('new')
  const [streamfrom, setStreamFrom] = useState('')
  const [isImportLeadsOpen, setisImportLeadsOpen] = React.useState(false)

  const [closePrevious, setClosePrevious] = useState(false)

  useEffect(() => {
    setopstr(
      optionvalues.asstr +
        optionvalues.astr +
        optionvalues.bstr +
        optionvalues.pstr
    )
  }, [optionvalues])

  useEffect(() => {
    streamLeadDataFun()
  }, [])

  useEffect(() => {
    setAddTaskCommentObj(leadNextTaskObj)
  }, [leadNextTaskObj])

  useEffect(() => {
    console.log('my stuff ', selProjectIs?.uid, ProjectId)

    const z = projectList.filter((da) => {
      return da.uid == (selProjectIs?.uid || ProjectId)
    })
    const z1 = {
      ...z[0],
    }
    setSelProjectIs(z1)
    console.log('my stuff ', z, selProjectIs, z1, ProjectId)
    setopstr(customerDetails?.leadstrength || 0)
    setoptionvalues(customerDetails?.optionvalues || optionvalues)
  }, [projectList, customerDetails])

  useEffect(() => {
    const z = projectList.filter((da) => {
      return da.uid == (selProjectIs?.uid || ProjectId)
    })
    const z1 = {
      ...z[0],
    }
    setSelProjectFullDetails(z1)
  }, [selProjectIs])

  useEffect(() => {
    const { schTime } = addTaskCommentObj
    if (schTime) {
      setStartDate(schTime)
    }
  }, [addTaskCommentObj])
  useEffect(() => {
    const { schTime } = editTaskObj
    if (schTime) {
      setStartDate(schTime)
    }
  }, [editTaskObj])

  const streamLeadDataFun = () => {
    const { id } = customerDetails
    console.log('customer details', customerDetails)
    const z = steamLeadById(
      orgId,
      (querySnapshot) => {
        const SnapData = querySnapshot.data()
        SnapData.id = id
        console.log('lead changed', SnapData)

        setLeadDetailsObj(SnapData)
      },
      { uid: id },
      () => {
        console.log('error')
      }
    )
  }

  useEffect(() => {
    const { coveredA, Status, from } = leadDetailsObj
    console.log('lead changed 2', Status, leadDetailsObj)
    if (coveredA) {
      setStreamCoveredA(coveredA)
    } else {
      setStreamCoveredA([])
    }
    setStreamCurrentStatus(Status)
    setStreamFrom(from || '')
    const x = {
      projectName: leadDetailsObj.Project,
      uid: leadDetailsObj.ProjectId,
    }
    setSelProjectIs(x)
    setAssignerName(leadDetailsObj?.assignedToObj?.name)
    setAssignedTo(leadDetailsObj?.assignedTo)
  }, [leadDetailsObj])

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
        setusersList(usersListA)
      },
      (error) => setfetchedUsersList([])
    )

    return
  }, [])
  useEffect(() => {
    let x = []
    if (selFilterVal === 'all') {
      x = leadSchFetchedData.filter((d) => d?.schTime != undefined)
    } else {
      x = leadSchFetchedData.filter(
        (d) => d?.schTime != undefined && d?.sts === selFilterVal
      )
    }
    console.log('xo xo xo', x)
    setLeadsFilteredSchData(x)
  }, [leadSchFetchedData, selFilterVal])
  useEffect(() => {
    if (leadSchFilteredData?.length > 0) {
      const x = leadSchFilteredData[0]
      let y =
        // Math.abs(getDifferenceInHours(x?.schTime, '')) <= 24 &&
        getDifferenceInHours(x?.schTime, '') >= 0
          ? true
          : false
      x.comingSoon = y
      setLeadNextTaskObj(x)
    }
  }, [leadSchFilteredData])
  useEffect(() => {
    setAssignedTo(customerDetails?.assignedTo)
    setAssignerName(customerDetails?.assignedToObj?.label)
    // setSelProjectIs({ projectName: Project, uid: ProjectId })
    setStatusTimeLineA(
      [...statusTimeLineA, ...(customerDetails?.coveredA?.a || [])] || ['new']
    )

    console.log('project o', projectType)
    // setLeadStatus(Status)
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
    } else if (selFeature === 'documents') {
      fet = 'attach'
    } else if (selFeature === 'appointments') {
      fet = 'appoint'
    } else if (selFeature === 'timeline') {
      fet = 'status'
    }

    if (fet === 'appoint') {
      return
    } else {
      let x = []
      if (selFeature != 'timeline') {
        x = leadsActivityFetchedData?.filter((data) => data.type === fet)
      } else {
        x = leadsActivityFetchedData
      }

      setFilterData(leadsActivityFetchedData)
    }
  }, [leadsActivityFetchedData, selFeature])

  useEffect(() => {
    getLeadsDataFun()
  }, [])

  useEffect(() => {
    getCustomerDocsFun()
    getProjectsListFun()
  }, [])
  const receiverDetails = {
    customerName: Name,
    executiveName: assignerName,
    receiverPhNo: Mobile,
  }
  const msgPayload = {
    projectName: Project,
    broucherLink: '',
    locLink: '',
    projContactNo: '',
    scheduleTime: startDate,
  }

  const getCustomerDocsFun = () => {
    const unsubscribe = getCustomerDocs(
      orgId,
      id,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setDocsList(projects)
      },
      () => setDocsList([])
    )
    return
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
        setprojectList(projectsListA)
      },
      (error) => setfetchedUsersList([])
    )

    return
  }
  useEffect(() => {}, [customerDetails])

  const setAssigner = (leadDocId, value) => {
    const projId = selProjectIs?.uid || ProjectId
    if (assignedTo != value.value) {
      setAssignerName(value.name)
      setAssignedTo(value.value)
      const x = leadDetailsObj?.Status || 'unassigned'
      const todayTasksIncre = leadSchFetchedData?.filter(
        (d) => d?.sts === 'pending' && d?.schTime < torrowDate
      ).length
      const txt = `A New Lead is assigned to ${value.name} with ${todayTasksIncre} tasks`
      updateLeadAssigTo(
        orgId,
        projId,
        leadDocId,
        value,
        assignedTo,
        x,
        leadDetailsObj,
        todayTasksIncre,
        txt,
        by
      )

      const receiverDetails = {
        customerName: Name,
        executiveName: value.name,
        receiverPhNo: Mobile,
        executivePh: value?.offPh,
        executiveEmail: value?.email,
      }

      if (x == 'new' || x == 'unassigned') {
        getWhatsAppTemplates(
          'on_lead_assign',
          'wa',
          'customer',
          projId,
          receiverDetails,
          msgPayload
        )
      } else {
        getWhatsAppTemplates(
          'on_reassign',
          'wa',
          'customer',
          projId,
          receiverDetails,
          msgPayload
        )
      }
    }
  }
  const setNewProject = async (leadDocId, value) => {
    const x = {
      Project: value.projectName,
      ProjectId: value.uid,
    }
    setSelProjectIs(value)
    updateLeadProject(orgId, leadDocId, x)
    toast.success('Project updated')
    return
    console.log('my stuff ', x, value)
    const foundLength = await checkIfLeadAlreadyExists(
      `${orgId}_leads`,
      Mobile,
      value.uid
    )
    if (foundLength?.length > 0) {
      console.log('foundLENGTH IS ', foundLength, value.uid)
      toast.error('Duplicate project.. use other lead')
      setFoundDocs(foundLength)
    } else {
      setFoundDocs([])
      console.log('foundLENGTH IS ', foundLength, value.uid)
      toast.success('Project updated')
      setSelProjectIs(value)
      updateLeadProject(orgId, leadDocId, x)
    }
  }

  const setShowNotInterestedFun = (scheduleData, value) => {
    setSelSchGrpO(scheduleData)

    cancelResetStatusFun()

    setLeadStatus('notinterested')

    setShowVisitFeedBackStatus(false)

    setShowNotInterested(true)
  }
  const setShowVisitFeedBackStatusFun = (scheduleData, value) => {
    setSelSchGrpO(scheduleData)
    cancelResetStatusFun()
    setLeadStatus('visitdone')
    setShowNotInterested(false)
    setShowVisitFeedBackStatus(true)
  }

  const setStatusFun = async (leadDocId, newStatus) => {
    cancelResetStatusFun()
    setLoader(true)
    setClosePrevious(true)
    if (newStatus == 'visitdone' && streamCurrentStatus != 'visitfixed') {
      toast.error('No recent site visit found.Create it.')
      setStatusFun(leadDocId, 'visitfixed')
      return
    }

    setLeadStatus(newStatus)

    const arr = ['visitdone', 'visitcancel']

    if (newStatus === 'visitcancel') {
      setFeature('visitCancelNotes')
    } else if (newStatus === 'notinterested') {
      setFeature('appointments')
      setShowNotInterestedFun({}, '')
    } else if (newStatus === 'junk') {
      setFeature('appointments')
      setLoader(false)
      setShowJunk(true)
    } else {
      // arr.includes(newStatus) ? setFeature('notes') : setFeature('appointments')
      // arr.includes(newStatus) ? setAddNote(true) : setAddSch(true)
      setFeature('appointments')
      arr.includes(newStatus) ? null : setAddSch(true)
      if (newStatus === 'followup') {
        await setTakTitle(
          `Make a followup Call to ${customerDetails?.Name || 'Customer'} `
        )
      } else if (newStatus === 'visitfixed') {
        await setTakTitle(
          `${customerDetails?.Project || 'Site'} visit @${
            customerDetails?.Name || 'Customer'
          }   `
        )
      } else if (newStatus === 'visitdone') {
        toast.success('Please fill site visit feedback form')
        let visitFixTaskA = leadSchFilteredData.filter(
          (d) => d?.stsType === 'visitfixed' && d?.sts != 'completed'
        )
        visitFixTaskA.length > 0
          ? setShowVisitFeedBackStatusFun(visitFixTaskA[0], 'visitdone')
          : null
      } else if (newStatus === 'booked') {
        setLeadStatus('booked')
        await setTakTitle('Share the Details with CRM team')
      } else {
        setTakTitle(' ')
      }
    }
  }

  const downloadFile = (url) => {
    window.location.href = url
  }
  const getLeadsDataFun = async () => {
    const steamLeadLogs = await steamLeadActivityLog(
      orgId,
      'snap',
      {
        uid: id,
      },
      (error) => setLeadsFetchedActivityData([])
    )

    await setLeadsFetchedActivityData(steamLeadLogs)

    const unsubscribe = steamLeadActivityLog(
      orgId,
      (doc) => {
        const usersList = doc.data()
        const usersListA = []

        Object.entries(usersList).forEach((entry) => {
          const [key, value] = entry
          usersListA.push(value)
        })

        setLeadsFetchedActivityData(usersListA)
      },
      {
        uid: id,
      },
      (error) => setLeadsFetchedActivityData([])
    )

    steamLeadScheduleLog(
      orgId,
      (doc) => {
        setLeadsSchLoading(true)
        const usersList = doc.data()
        const usersListA = []

        const sMapStsA = []
        const { staA, staDA } = usersList
        setschStsA(staA)
        setschStsMA(staDA)

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

        setLeadsFetchedSchData(
          usersListA.sort((a, b) => {
            return b.schTime - a.schTime
          })
        )
        setLeadsSchLoading(false)
      },
      {
        uid: id,
      },
      (error) => setLeadsFetchedSchData([])
    )

    return
  }
  const getLeadNotesFun = async () => {
    console.log('ami triggered')
    const unsubscribe = steamLeadNotes(
      orgId,
      (doc) => {
        const usersList = doc.data()
        const usersListA = []

        Object?.entries(usersList)?.forEach((entry) => {
          const [key, value] = entry
          usersListA.push(value)
        })
        usersListA?.sort((a, b) => {
          return b.ct - a.ct
        })
        setLeadsFetchedNotesData(usersListA)
      },
      {
        uid: id,
      },
      (error) => setLeadsFetchedActivityData([])
    )
    return
  }
  const fAddSchedule = async () => {
    const y = takTitle === '' ? addCommentTitle : takTitle
    if (closePrevious) {
      closeAllPerviousTasks(`${y}`)
    }

    const data = {
      stsType: tempLeadStatus || 'none',
      assTo: user?.displayName || user?.email,
      assToId: user.uid,
      by: user?.displayName || user?.email,
      cby: user.uid,
      type: 'schedule',
      pri: selected?.name,
      notes: y === '' ? `Negotiate with customer` : y,
      sts: 'pending',
      schTime:
        tempLeadStatus === 'booked'
          ? Timestamp.now().toMillis() + 10800000
          : startDate.getTime(),
      ct: Timestamp.now().toMillis(),
    }

    const x = schStsA

    x.push('pending')
    setschStsA(x)

    await addLeadScheduler(orgId, id, data, schStsA, assignedTo)

    if (
      (startDate?.getTime() || Timestamp.now().toMillis() + 10800000) <
      torrowDate
    ) {
      try {
        IncrementTastTotalCount(
          orgId,
          assignedTo,
          ddMy,
          tempLeadStatus,
          1,
          `New Task-${tempLeadStatus}`
        )
      } catch (error) {
        enqueueSnackbar('error in updating ur performance', {
          variant: 'error',
        })
      }
    }

    const { name } = assignedTo

    if (streamCurrentStatus != tempLeadStatus) {
      updateLeadStatus(
        orgId,
        ProjectId,
        id,
        streamCurrentStatus,
        tempLeadStatus,
        user?.email,
        enqueueSnackbar
      )

      console.log('not interested', tempLeadStatus)

      if (tempLeadStatus === 'visitfixed') {
        getWhatsAppTemplates(
          'on_sitevisit_fix',
          'wa',
          'customer',
          ProjectId,
          receiverDetails,
          msgPayload
        )
      } else if (tempLeadStatus === 'visitdone') {
        getWhatsAppTemplates(
          'on_sitevisit_done',
          'wa',
          'customer',
          ProjectId,
          receiverDetails,
          msgPayload
        )
      } else if (tempLeadStatus === 'booking') {
        getWhatsAppTemplates(
          'on_booking',
          'wa',
          'customer',
          ProjectId,
          receiverDetails,
          msgPayload
        )
      }
    }
    await setTakTitle('')
    await setAddSch(false)
    await setLoader(false)
  }

  const cancelResetStatusFun = () => {
    setCloseTask(false)
    setClosePrevious(false)
    setEditTaskObj({})
    setAddTaskCommentObj({})
    setAddCommentTitle('')
    setAddCommentPlusTask(false)
    setTakTitle('')
    setStartDate(setHours(setMinutes(d, 30), 16))
    setShowNotInterested(false)
    setShowJunk(false)
    setShowVisitFeedBackStatus(false)
    setAddSch(false)
    setAddNote(false)
    setLeadStatus(tempLeadStatus)
    setLoader(false)
  }
  const fUpdateSchedule = async (data, actionType, count) => {
    if (data?.sts != 'completed') {
      const tmId = data.ct
      const newTm = Timestamp.now().toMillis() + 10800000 + 5 * 3600000

      await updateSch(
        orgId,
        id,
        tmId,
        newTm,
        schStsA,
        assignedTo,
        actionType,
        count
      )
      await setTakTitle('')
      await setAddSch(false)
    }
  }
  const handleColor = (time) => {
    return time.getHours() > 12 ? 'text-success' : 'text-error'
  }

  const setTitleFun = (e) => {
    setTakTitle(e.target.value)
  }
  const doneFun = (data) => {
    const inx = schStsMA.indexOf(data.ct)
    const x = schStsA
    x[inx] = 'completed'
    setschStsA(x)

    updateSchLog(orgId, id, data.ct, 'completed', schStsA)
  }
  const EditTaskOpenWindowFun = (data) => {
    cancelResetStatusFun()
    setEditTaskObj(data)
    setTakTitle(data?.notes || '')
    setStartDate(setHours(setMinutes(data?.schTime, 30), 16))
  }
  const editTaskFun = (data) => {
    const inx = schStsMA.indexOf(data.ct)
    data.schTime = startDate
    data.notes = takTitle
    const x = schStsA
    x[inx] = 'pending'
    setschStsA(x)

    editTaskDB(orgId, id, data.ct, 'pending', schStsA, data)
    if (leadDetailsObj?.Status == 'visitfixed') {
      getWhatsAppTemplates(
        'on_sitevisit_reschedule',
        'wa',
        'customer',
        ProjectId,
        receiverDetails,
        msgPayload
      )
    }
    cancelResetStatusFun()
  }
  const addTaskCommentFun = async (data) => {
    await setTakTitle(addCommentTitle)
    const inx = schStsMA.indexOf(data.ct)
    data.comments = [
      {
        c: addCommentTitle,
        t: Timestamp.now().toMillis(),
      },
      ...(data?.comments || []),
    ]
    const x = schStsA
    x[inx] = 'pending'
    setschStsA(x)
    if (addCommentPlusTask) {
      await setTakTitle(addCommentTitle)
      await fAddSchedule()
      await editAddTaskCommentDB(orgId, id, data.ct, 'pending', schStsA, data)
      if (data?.stsType != 'visitfixed') {
        await doneFun(data)
      }
      await cancelResetStatusFun()
    } else {
      if (closeTask) {
        doneFun(data)
      }
      if (selType === 'reschedule') {
        data.schTime = addCommentTime
      }
      await editAddTaskCommentDB(orgId, id, data.ct, 'pending', schStsA, data)
      await updateLeadLastUpdateTime(
        orgId,
        id,
        Timestamp.now().toMillis(),
        addCommentTime
      )
      if (postPoneToFuture === 'present2Future') {
        await decreCountOnResheduleOtherDay(
          orgId,
          user?.uid,
          ddMy,
          `${leadDetailsObj?.Status}`,
          1,
          'Lead Posted'
        )
        setPostPoneToFuture('present')
      } else if (postPoneToFuture === 'Future2Present') {
        IncrementTastTotalCount(
          orgId,
          user?.uid,
          ddMy,
          `${leadDetailsObj?.Status}`,
          1,
          'Lead Posted'
        )
        setPostPoneToFuture('present')
      }
      await cancelResetStatusFun()
    }
  }

  const notInterestedFun = async () => {
    await closeAllPerviousTasks('closed by Not-Interested')
    await fAddNotes()
    await getWhatsAppTemplates(
      'on_not_interested',
      'wa',
      'customer',
      ProjectId,
      receiverDetails,
      msgPayload
    )
    await cancelResetStatusFun()

    return
    data.comments = [
      {
        c: `${fbTitle}-${fbNotes}`,
        t: Timestamp.now().toMillis() + 21600000,
      },
      ...(data?.comments || []),
    ]
    await setTakTitle('Negotiate with customer')

    await editAddTaskCommentDB(orgId, id, data.ct, 'pending', schStsA, data)

    await doneFun(data)
    await fAddSchedule()

    // update status + remarks + fbTitle + fbNotes
    await fAddNotes()
    await setSelSchGrpO({})

    await cancelResetStatusFun()

    const x = schStsA
    x[inx] = 'pending'
    setschStsA(x)
  }
  const closeAllPerviousTasks = async (closingComments) => {
    const pendingTaskAObj = leadSchFetchedData.filter(
      (d) => d?.schTime != undefined && d?.sts === 'pending'
    )
    pendingTaskAObj?.map(async (pendObj) => {
      pendObj.comments = [
        {
          c: closingComments,
          t: Timestamp.now().toMillis() + 21600000,
        },
        ...(pendObj?.comments || []),
      ]
      await editAddTaskCommentDB(
        orgId,
        id,
        pendObj.ct,
        'pending',
        schStsA,
        pendObj
      )
      await doneFun(pendObj)
      if (pendObj?.schTime < torrowDate) {
        await IncrementTastCompletedCount(
          orgId,
          user?.uid,
          ddMy,
          `${leadDetailsObj?.Status}_comp`,
          1,
          'A Task Closed by change status'
        )
      }
    })
  }
  const closeTaskFun = async (data) => {
    if (data?.stsType === 'visitfixed') {
      setShowVisitFeedBackStatusFun(data, 'visitdone')
    } else {
      if (leadSchFetchedData?.filter((d) => d?.sts === 'pending').length != 1) {
        setAddTaskCommentObj(data)
        setCloseTask(true)
      } else {
        enqueueSnackbar(
          `Oops..! You can close this task by changing Lead status`,
          {
            variant: 'error',
          }
        )
      }
    }
  }
  const addFeedbackFun = async (data) => {
    const inx = schStsMA.indexOf(data.ct)

    data.comments = [
      {
        c: `${fbTitle}-${fbNotes}`,
        t: Timestamp.now().toMillis() + 21600000,
      },
      ...(data?.comments || []),
    ]

    await setTakTitle('Negotiate with customer')

    closeAllPerviousTasks(`${fbTitle}-${fbNotes}`)

    await doneFun(data)
    await fAddSchedule()

    await fAddNotes()
    await setSelSchGrpO({})

    await cancelResetStatusFun()

    const x = schStsA
    x[inx] = 'pending'
    setschStsA(x)
    setLeadStatus('negotiation')
  }
  const undoFun = (data) => {
    const inx = schStsMA.indexOf(data.ct)
    const x = schStsA
    x[inx] = 'pending'
    setschStsA(x)

    undoSchLog(orgId, id, data.ct, 'pending', schStsA, data)
  }
  const delFun = (data) => {
    const inx = schStsMA.indexOf(data.ct)
    const x = schStsA
    const y = schStsMA
    x.splice(inx, 1)
    y.splice(inx, 1)
    setschStsA(x)
    setschStsMA(y)

    deleteSchLog(orgId, id, data.ct, 'completed', schStsA, schStsMA, data)
  }

  const selFun = () => {
    setAddNote(true)
  }

  const showAddAttachF = () => {
    setAttach(true)
  }




  const fAddNotes = async () => {
    const data = {
      by: user.email,
      type: 'notes',
      notes: takNotes,
      ct: Timestamp.now().toMillis(),
    }

    await addLeadNotes(orgId, id, data)
    if (tempLeadStatus === 'notinterested') {
      const dat = {
        from: streamCurrentStatus,
        Status: tempLeadStatus,
        notInterestedReason: takTitle === '' ? fbTitle : takTitle,
        notInterestedNotes: takNotes === '' ? fbNotes : takNotes,
        stsUpT: Timestamp.now().toMillis(),
        Remarks: `${notInterestType}-${takNotes}`,
        Remarks_T: Timestamp.now().toMillis(),
      }
      updateLeadRemarks_NotIntrested(
        orgId,
        id,
        dat,
        user.email,
        enqueueSnackbar
      )
      setLeadStatus('notinterested')
      cancelResetStatusFun()
    } else if (tempLeadStatus === 'junk') {
      const dat = {
        from: streamCurrentStatus,
        Status: tempLeadStatus,
        stsUpT: Timestamp.now().toMillis(),
        Remarks: `${junkReason}`,
        Remarks_T: Timestamp.now().toMillis(),
      }
      updateLeadRemarks_NotIntrested(
        orgId,
        id,
        dat,
        user.email,
        enqueueSnackbar
      )
      setLeadStatus('junk')
      cancelResetStatusFun()
    } else if (tempLeadStatus === 'visitdone') {
      const covA = [...streamCoveredA, ...['visitfixed', 'visitdone']]

      const dat = {
        coveredA: covA,
        from: streamCurrentStatus,
        Status: 'negotiation',
        VisitDoneReason: fbTitle,
        VisitDoneNotes: fbNotes,
        stsUpT: Timestamp.now().toMillis(),
        Remarks: `${fbTitle}-${fbNotes}`,
        Remarks_T: Timestamp.now().toMillis(),
      }
      updateLeadRemarks_VisitDone(orgId, id, dat, user.email, enqueueSnackbar)
      doneFun(selSchGrpO)
      setSelSchGrpO({})
      setLeadStatus('negotiation')
      cancelResetStatusFun()
    }

    await setNotesTitle('')
    await setAddNote(false)
  }

  const docUploadHandler = async (e) => {
    e.preventDefault()
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
          })
        }
      )
    } catch (error) {
      console.log('upload error is ', error)
    }
  }
  const initialState1 = {
    notesText: '',
    source: '',
  }
  const validateSchema1 = Yup.object({
    notesText: Yup.string()
      .max(180, 'Must be 180 characters or less')
      .required('Notes Text is  Required'),
  })
  const initialState = {
    taskTitle: takTitle || '',
  }
  const initialCommentState = {
    commentTitle: addCommentTitle || '',
    source: '',
  }
  const validateCommentsSchema = Yup.object({
    commentTitle: Yup.string()
      .max(180, 'Must be 180 characters or less')
      .required('Comment Title Required'),
  })
  const validateSchema = Yup.object({
    taskTitle: Yup.string()
      .max(180, 'Must be 180 characters or less')
      .required('Task Title Required'),
  })
  const StatusListA = [
    { label: 'New', value: 'new', logo: 'FireIcon', color: ' bg-violet-500' },
    {
      label: 'FollowUp',
      value: 'followup',
      logo: 'RefreshIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Prospect',
      value: 'prospect',
      logo: 'RefreshIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Visit Fixed',
      value: 'visitfixed',
      logo: 'FireIcon',
      color: ' bg-violet-500',
    },
    // {
    //   label: 'Visit Done',
    //   value: 'visitdone',
    //   logo: 'DuplicateInactiveIcon',
    //   color: ' bg-violet-500',
    // },
    {
      label: 'Negotiation',
      value: 'negotiation',
      logo: 'CurrencyRupeeIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Booked',
      value: 'booked',
      logo: 'BadgeCheckIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Not Interested',
      value: 'notinterested',
      logo: 'XCircleIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Junk',
      value: 'junk',
      logo: 'XCircleIcon',
      color: ' bg-violet-500',
    },
  ]

  const hoverEffectFun = (id) => {
    setHoverID(id)
  }
  const hoverEffectTaskFun = (id) => {
    setHoverTasId(id)
  }
  const styleO = {
    normal: {
      width: '100%',
      height: '28px',
      borderWidth: '3px 10px 3px 3px',
      boxSizing: 'border-box',
      borderStyle: 'solid',
      verticalAlign: 'middle',
      cursor: 'pointer',
      textOverflow: 'ellipsis',
      transition: 'all 250ms ease',
      position: 'relative',
      overflow: 'hidden',
      whiteSpace: 'nowrap',

      borderImage:
        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2232px%22%20viewBox%3D%220%200%2016%2032%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%3Cdefs%3E%3Cpath%20d%3D%22M0%2C2.99610022%20C0%2C1.34139976%201.3355407%2C0%202.99805158%2C0%20L6.90478569%2C0%20C8.56056385%2C0%2010.3661199%2C1.25756457%2010.9371378%2C2.80757311%20L16%2C16.5505376%20L11.0069874%2C29.2022189%20C10.3971821%2C30.7473907%208.56729657%2C32%206.90478569%2C32%20L2.99805158%2C32%20C1.34227341%2C32%200%2C30.6657405%200%2C29.0038998%20L0%2C2.99610022%20Z%22%20id%3D%22Bg%22/%3E%3C/defs%3E%3Cg%20id%3D%22Bar%22%20stroke%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cmask%20fill%3D%22white%22%20id%3D%22mask%22%3E%3Cuse%20xlink%3Ahref%3D%22%23Bg%22/%3E%3C/mask%3E%3Cuse%20fill%3D%22%23d3d7dc%22%20xlink%3Ahref%3D%22%23Bg%22/%3E%3Cpolygon%20id%3D%22Ln%22%20fill%3D%22%2347E4C2%22%20mask%3D%22url%28%23mask%29%22%20points%3D%220%2030%2016%2030%2016%2032%200%2032%22/%3E%3C/g%3E%3C/svg%3E") 3 10 3 3 fill / 1 / 0 repeat',

      color: 'rgb(51, 51, 51)',
      dataBaseColor: '#2fc6f6',
    },
    completed: {
      borderImage:
        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2232px%22%20viewBox%3D%220%200%2016%2032%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%3Cdefs%3E%3Cpath%20d%3D%22M0%2C2.99610022%20C0%2C1.34139976%201.3355407%2C0%202.99805158%2C0%20L6.90478569%2C0%20C8.56056385%2C0%2010.3661199%2C1.25756457%2010.9371378%2C2.80757311%20L16%2C16.5505376%20L11.0069874%2C29.2022189%20C10.3971821%2C30.7473907%208.56729657%2C32%206.90478569%2C32%20L2.99805158%2C32%20C1.34227341%2C32%200%2C30.6657405%200%2C29.0038998%20L0%2C2.99610022%20Z%22%20id%3D%22Bg%22/%3E%3C/defs%3E%3Cg%20id%3D%22Bar%22%20stroke%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cmask%20fill%3D%22white%22%20id%3D%22mask%22%3E%3Cuse%20xlink%3Ahref%3D%22%23Bg%22/%3E%3C/mask%3E%3Cuse%20fill%3D%22%237BD500%22%20xlink%3Ahref%3D%22%23Bg%22/%3E%3Cpolygon%20id%3D%22Ln%22%20fill%3D%22%237BD500%22%20mask%3D%22url%28%23mask%29%22%20points%3D%220%2030%2016%2030%2016%2032%200%2032%22/%3E%3C/g%3E%3C/svg%3E") 3 10 3 3 fill / 1 / 0 repeat',
    },

    hover: {
      borderImage:
        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2232px%22%20viewBox%3D%220%200%2016%2032%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%3Cdefs%3E%3Cpath%20d%3D%22M0%2C2.99610022%20C0%2C1.34139976%201.3355407%2C0%202.99805158%2C0%20L6.90478569%2C0%20C8.56056385%2C0%2010.3661199%2C1.25756457%2010.9371378%2C2.80757311%20L16%2C16.5505376%20L11.0069874%2C29.2022189%20C10.3971821%2C30.7473907%208.56729657%2C32%206.90478569%2C32%20L2.99805158%2C32%20C1.34227341%2C32%200%2C30.6657405%200%2C29.0038998%20L0%2C2.99610022%20Z%22%20id%3D%22Bg%22/%3E%3C/defs%3E%3Cg%20id%3D%22Bar%22%20stroke%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cmask%20fill%3D%22white%22%20id%3D%22mask%22%3E%3Cuse%20xlink%3Ahref%3D%22%23Bg%22/%3E%3C/mask%3E%3Cuse%20fill%3D%22%2347E4C2%22%20xlink%3Ahref%3D%22%23Bg%22/%3E%3Cpolygon%20id%3D%22Ln%22%20fill%3D%22%2347E4C2%22%20mask%3D%22url%28%23mask%29%22%20points%3D%220%2030%2016%2030%2016%2032%200%2032%22/%3E%3C/g%3E%3C/svg%3E") 3 10 3 3 fill / 1 / 0 repeat',
    },
  }

  // async function handleCallButtonClick(uid, leadName, mobileNumber) {
  //   try {
  //     console.log('Call button clicked with data:', {
  //       uid,
  //       leadName,
  //       mobileNumber
  //     });

  //     // Step 1: Get user's fcmToken from Firestore
  //     const userRef = doc(db, "users", uid);
  //     const userSnap = await getDoc(userRef);

  //     if (!userSnap.exists()) {
  //       console.error("User not found!");
  //       return;
  //     }

  //     const userData = userSnap.data();
  //     console.log('Retrieved user data:', userData);

  //     const { fcmToken } = userData;

  //     if (!fcmToken) {
  //       console.error("FCM Token not found for user!");
  //       return;
  //     }

  //     // Step 2: Add a new call document
  //     const callData = {
  //       leadName,
  //       mobileNumber,
  //       fcmToken,
  //       timestamp: Timestamp.now()
  //     };

  //     console.log('Creating call document with:', callData);

  //     const docRef = await addDoc(collection(db, "calls"), callData);
  //     console.log("Call document added successfully with ID:", docRef.id);

  //   } catch (error) {
  //     console.error("Error in call trigger:", error);
  //   }
  // }



  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false)
  const [isAssignedExpanded, setIsAssignedExpanded] = useState(false)

  const projectData = {
    projects: [
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
    ],
    assignedTo: [
      {
        name: 'Vishal Kumar',
        date: 'Apr 22, 2025',
        isActive: true,
      },
      {
        name: 'Priya Sharma',
        date: 'Apr 21, 2025',
        isActive: false,
      },
      {
        name: 'Rajiv Mehta',
        date: 'Apr 20, 2025',
        isActive: false,
      },
      {
        name: 'Deepak Gupta',
        date: 'Apr 18, 2025',
        isActive: false,
      },
    ],
    siteVisit: {
      date: '27 Mar 2025',
      inCharge: 'Chaithanya',
      count: 4,
    },
    taskLogs: {
      priceQuotations: 1,
      completedTasks: 12,
      totalComments: 10,
    },
  }

  const toggleProjectsExpand = () => {
    setIsProjectsExpanded(!isProjectsExpanded)
  }

  const toggleAssignedExpand = () => {
    setIsAssignedExpanded(!isAssignedExpanded)
  }

  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const LeadStrengthFun = async () => {
    const x = { leadstrength: opstr, optionvalues }
    updateLeadsStrength(orgId, id, x, user.email)
  }

  return (
    <>
      <div
        className={`   h-screen  bg-[#FFFFFF]  shadow-[0px_4px_30px_0px_rgba(0,_0,_0,_0.05)]  ${
          openUserProfile ? 'hidden' : ''
        } `}
        // style={{
        //   background: 'linear-gradient(to left, #EEF0F9, #E1F2F2, #DBE6F0)',
        // }}
      >
        <div className="h-screen overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
          <div className="  bg-white ">
            <div className=" pb-[2px] px-3      mt-0 rounded-xs">
              <div className="flex  justify-between">
                <div className="w-full pl-1 pt-[2px]">
                  <div className="">
                    <div className="font-semibold text-[#053219] text-sm mt-3 mb-1 tracking-wide">
                      <div className="flex gap-4 flex-row">
                        <div>
                          <span className="w-12 h-12 sale_bg_color rounded-lg flex items-center justify-center font-semibold sale_text_color uppercase text-[21px]">
                            {Name?.[0]}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-2">
                              <span className="s_h16 uppercase">{Name}</span>
                            </div>
                            <img
                              src="/edit-02.svg"
                              alt="edit"
                              className="w-5 h-5 cursor-pointer fill-[#414141]"
                              onClick={() => setisImportLeadsOpen(true)}
                            />
                            <div
                              style={{
                                paddingLeft: 12,
                                paddingRight: 12,
                                paddingTop: 12,
                                paddingBottom: 12,
                                overflow: 'hidden',
                                borderRadius: 18,
                                outline:
                                  '1px var(--Secondary-Stroke, #E7E7E9) solid',
                                outlineOffset: '-1px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 5,
                                display: 'inline-flex',
                                height: '20px',
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="13"
                                viewBox="0 0 12 13"
                                fill="none"
                              >
                                <g clip-path="url(#clip0_8776_20781)">
                                  <path
                                    d="M6.92803 11.5703C13.0391 10.0703 9.61692 4.07031 5.46137 1.57031C4.97265 3.32031 4.23919 3.82031 2.77248 5.57031C0.830607 7.88726 1.79475 10.5703 4.48359 11.5703C4.0762 11.0703 3.02479 10.0207 3.75 8.57031C4 8.07031 4.5 7.57031 4.25 6.57031C4.73889 6.82031 5.75 7.07031 6 8.32031C6.40738 7.82031 6.83022 6.77031 6.43915 5.57031C9.5 7.82031 8.25 10.0703 6.92803 11.5703Z"
                                    fill="#D60000"
                                    stroke="#D60000"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_8776_20781">
                                    <rect
                                      width="16"
                                      height="16"
                                      fill="white"
                                      transform="translate(0 0.570312)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              <div
                                style={{
                                  color: 'var(--Black, #0D0A1E)',
                                  fontSize: 12,
                                  fontFamily: 'Outfit',
                                  fontWeight: '500',
                                  wordWrap: 'break-word',
                                }}
                              >
                                Cold
                              </div>
                            </div>
                          </div>

                          <div className="flex mt-[4px] flex-row">
                            <div className="flex items-center gap-[6px]">
                              <Phone  className="w-[14px]" />
                              <span className="font-[Outfit]  s_h12">
                                {Mobile?.replace(
                                  /(\d{3})(\d{3})(\d{4})/,
                                  '$1-$2-$3'
                                )}
                              </span>
                            </div>

                            <div className="s_divider_small"></div>

                            <div className="flex items-center gap-[6px]">
                              <img
                                src="/mail.svg"
                                className="w-[14px]"
                                alt="Mail Icon"
                              />
                              <span className="font-[Outfit] s_h12">
                                {Email || '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!unitsViewMode && (
                  <section className="flex flex-row  h-[28px] mt-4">
                    <section className="flex group  flow-row justify-between bg-white px-[10px] pr-[18px] py-[14px]  mr-2   border border-[#E7E7E9]  text-black rounded-lg items-center align-middle text-xs cursor-pointer  hover:bg-[#E5E7EB]">
                      <User className="w-[14px]" />
                      <div className="font-medium text-sm text-[#000000] tracking-wide pr-2 mr-1 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-[10px] after:bg-gray-300 group-hover:after:bg-white"></div>

                      <div className="font-md ml-2 text-xs tracking-wide font-semibold text-[#000000] ">
                        {(user?.role?.includes(USER_ROLES.SALES_MANAGER) ||(user?.role?.includes(USER_ROLES.ADMIN))|| customerDetails?.assignedTo ==user?.uid ) ? (
                          <div className="">
                            <AssigedToDropCompCrm
                              assignerName={assignerName}
                              id={id}
                              setAssigner={setAssigner}
                              usersList={usersList}
                              align={undefined}
                            />
                          </div>
                        ):  <span className="text-left text-sm whitespace-nowrap mr-2">
                        {' '}
                        {assignerName}
                      </span>}

                      </div>
                    </section>
                    <section className="flex group flow-row justify-between  px-[10px] pr-[18px] py-[14px]  mr-2   border border-[#E7E7E9]    bg-white text-black rounded-lg items-center align-middle text-xs cursor-pointer hover:bg-[#E5E7EB]">
                      <img
                        src="/mail.svg"
                        className="w-[14px]"
                        alt="Mail Icon"
                      />
                      <div className="font-medium text-sm text-[#000000] tracking-wide pr-2 mr-1 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[0.8px] after:h-[10px] after:bg-gray-300 group-hover:after:bg-white"></div>
                      <div className="font-md  ml-2  text-xs tracking-wide font-semibold text-[#000000] ">
                        <div className="">
                          <AssigedToDropCompCrm
                            assignerName={selProjectIs?.projectName || Project}
                            id={id}
                            setAssigner={setNewProject}
                            usersList={projectList}
                            align={undefined}
                          />
                        </div>
                      </div>
                    </section>

                    <button
                      className="text-[12px]  rounded-lg ml-2  px-5 border font-semibold  capitalize  border-[#3D7DC3] text-blue-500"
                      onClickCapture={() => {
                        handleCallButtonClick(user?.uid, Name, Mobile)
                      }}
                    >
                      Call
                    </button>
                  </section>
                )}
                {unitsViewMode && (
                  <section className="flex flex-row  h-[28px] mt-4">
                    {' '}
                    <button
                      className="text-[12px]  rounded-lg ml-2  px-5 border font-semibold    border-[#3D7DC3] text-blue-500 whitespace-nowrap"
                      onClickCapture={() => {
                        setUnitsViewMode(false)
                      }}
                    >
                      Hide Units
                    </button>
                  </section>
                )}
              </div>

              {/* <hr className="h-[1px]  bg-gradient-to-r from-[#F6F5F8]/100 via-[#B1B1B1] to-[#F6F5F8]/100 border-0 my-3" /> */}

              {timeHide && (
                <>
                  <div className="w-full border-b border-[#ebebeb]"></div>
                  <div className=" w-full  pt-1 font-md text-xs text-gray-500 mb-[2px] tracking-wide mr-4 flex flex-row justify-between">
                    {' '}
                    <section>
                      <span className="font-thin   font-bodyLato text-[9px]  py-[6px]">
                        Created On
                        <span className="text-[#867777] ck ml-2">
                          {CT != undefined
                            ? prettyDateTime(CT)
                            : prettyDateTime(Date)}
                        </span>
                      </span>
                    </section>
                    <section>
                      <span className="font-thin   font-bodyLato text-[9px]  py-[6px]">
                        Updated On :
                        <span className="text-[#867777] ck ml-2">
                          {stsUpT === undefined
                            ? 'NA'
                            : prettyDateTime(stsUpT) || 'NA'}
                        </span>
                      </span>
                    </section>
                    <section>
                      <span className="font-thin text-[#867777]   font-bodyLato text-[9px]  py-[6px]">
                        Assigned On
                        <span className="text-[#867777] ck ml-2">
                          {assignT != undefined
                            ? prettyDateTime(assignT)
                            : prettyDateTime(Date)}
                        </span>
                      </span>
                    </section>
                  </div>
                </>
              )}
            </div>

            {/* <hr className="h-[1px]  bg-gradient-to-r from-[#F6F5F8]/100 via-[#B1B1B1] to-[#F6F5F8]/100 border-0 py-[1px]" /> */}
            <div className="  ">
              <div className="flex flex-row bg-white justify-between pb-3 pt-5 mb-0 relative [box-shadow:0px_4px_4px_0px_rgba(0,0,0,0.1)]">
                {StatusListA.map((statusFlowObj, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-200 mb-1 z-10 ${
                        streamCurrentStatus === statusFlowObj.value &&
                        'animate-pulse-blue'
                      } ${
                        streamCoveredA.includes(statusFlowObj.value) ||
                        (streamCurrentStatus === 'new' &&
                          statusFlowObj.value === 'new')
                          ? 'sale_bg_color text-white  '
                          : statusFlowObj.value === streamCurrentStatus ||
                            statusFlowObj.value === tempLeadStatus
                          ? 'sale_bg_color border-[#94B5ED]  shadow-[0_0_0_3px_rgba(251,203,193,1)]  text-black '
                          : 'bg-white border-gray-300 text-gray-300'
                      }`}
                      onClick={() => setStatusFun(id, statusFlowObj.value)}
                      onMouseEnter={() => {
                        hoverEffectFun(i)
                        setHover(true)
                      }}
                      onMouseLeave={() => {
                        hoverEffectFun(1000)
                        setHover(false)
                      }}
                      style={{
                        ...(hover && hoverId === i ? { boxShadow: '' } : {}),
                        cursor: 'pointer',
                      }}
                    >
                      {statusFlowObj.value === streamCurrentStatus ||
                      statusFlowObj.value === tempLeadStatus ? (
                        <div
                          className={`h-1 w-1 rounded-full ${
                            statusFlowObj.value === streamCurrentStatus
                              ? 'bg-white '
                              : 'bg-white'
                          }`}
                        />
                      ) : streamCoveredA.includes(statusFlowObj.value) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-[#414141]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : i >= StatusListA.length - 2 ? null : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>

                    <span
                      className={` text-[11px]  font-normal px-2 py-1 z-10 text-center ${
                        statusFlowObj.value === streamCurrentStatus ||
                        statusFlowObj.value === tempLeadStatus
                          ? 'text-[13px] text-black'
                          : 'text-[11px] text-black'
                      }`}
                    >
                      {statusFlowObj.label}
                    </span>

                    {i < StatusListA.length - 1 && (
                      <div
                        className={`absolute top-3 left-[calc(50%+0.5rem)] h-[1px] w-[calc(100%-1rem)] ${
                          streamCoveredA.includes(StatusListA[i + 1].value)
                            ? 'bg-[#6E85E6]'
                            : 'bg-[#CCCCCC]'
                        }`}
                        style={{ transform: 'translateY(-50%)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* border line */}

          {/*
        <div
          className="flex flex-row justify-between   py-3 px-3  mt-[0.5px] mb-0 rounded-xs bg-[#F2F5F8]"
          style={{ flex: '4 0 100%' }}
        >
          {StatusListA.map((statusFlowObj, i) => (
            <span
              key={i}
              className="font-bodyLato text-sm font-normal px-[2px] py-[1px] mr-1 "
              onClick={() => setStatusFun(id, statusFlowObj.value)}

              style={{
                ...styleO.normal,
                ...(statusFlowObj.value === streamCurrentStatus
                  ? styleO.hover
                  : null),
                ...(streamCoveredA.includes(statusFlowObj.value)
                  ? styleO.completed
                  : null),

                ...(statusFlowObj.value === tempLeadStatus
                  ? styleO.hover
                  : null),
                ...(statusFlowObj.value === streamfrom
                  ? styleO.completed
                  : null),
                ...(hover && hoverId === i ? styleO.hover : null),
              }}
              onMouseEnter={() => {
                hoverEffectFun(i)
                setHover(true)
              }}
              onMouseLeave={() => {
                hoverEffectFun(1000)
                setHover(false)
              }}
            >
              <div>{statusFlowObj.label} </div>\
            </span>
          ))}
        </div>
        */}
          {/* displays the list of duplicate leads */}
          {founDocs?.length > 0 && (
            <section className=" flex  flex-col text-md text-pink-800  mx-5">
              <span className="mt-2">
                {'Duplicate lead found with same project'}
              </span>
              {founDocs.map((customDetails, i) => {
                return (
                  <DuplicateLeadCard
                    leadDetailsO={customDetails}
                    usersList={usersList}
                    projectList={projectList}
                  />
                )
              })}
            </section>
          )}
          {unitsViewMode && (
            <>
              <ProjPhaseHome
                projectDetails={selProjectIs}
                leadDetailsObj={leadDetailsObj}
                source={undefined}
                unitDetails={undefined}
              />
            </>
          )}
          {!unitsViewMode && (
            <>
              <section className=" pb-8 px-5 py-2  rounded-xs bg-[#fbfbfb]  ">
                <div className="">
                  <div className="">
                    <div className="flex flex-row justify-between  mt-2">
                      <ul
                        className="flex rounded-t-lg  mx-2"
                        id="myTab"
                        data-tabs-toggle="#myTabContent"
                        role="tablist"
                      >
                        {[
                          { lab: 'Summary', val: 'lead_summary' },
                          { lab: 'Tasks', val: 'appointments' },
                          { lab: 'Notes', val: 'notes' },
                          // { lab: 'Email', val: 'email' },
                          { lab: 'Activity Log', val: 'timeline' },
                        ].map((d, i, array) => {
                          return (
                            <div key={i} className="flex items-center">
                              <li className="" role="presentation">
                                <button
                                  className={`inline-block pb-1 text-xs font-medium text-center text-[#606062] rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${
                                    selFeature === d.val
                                      ? 'border-zinc-800 text-zinc-800'
                                      : 'text-[#606062] border-none'
                                  }`}
                                  type="button"
                                  role="tab"
                                  onClick={() => setFeature(d.val)}
                                >
                                  {`${d.lab} `}
                                </button>
                              </li>
                              {i !== array.length - 1 && (
                                <div className="w-px mx-4 h-5 bg-[#E7E7E9]"></div>
                              )}
                            </div>
                          )
                        })}
                      </ul>
                      {selFeature != 'lead_strength' && (
                        <span
                          className="s_h14 px-[10px] py-[11px] gap-[8px] font-['outfit'] font-medium  underline underline-offset-[25%] decoration-[0%] s_text_color_1 cursor-pointer"
                          onClick={() => setFeature('lead_strength')}
                        >
                          Lead requirement
                        </span>
                      )}
                      {selFeature == 'lead_strength' && (
                        <span
                          className="px-[10px] py-[11px] gap-[8px] font-outfit font-medium text-[14px] leading-[100%] underline underline-offset-[25%] decoration-[0%] s_text_color_1 cursor-pointer"
                          onClick={() => setFeature('appointments')}
                        >
                          Close
                        </span>
                      )}
                    </div>
                    {selFeature == 'lead_strength' && (
                      <>
                        <Formik
                          enableReinitialize={true}
                          initialValues={{
                            accountName: '',
                            reasonPurchase: '',
                            preferredArea: '',
                          }}
                          onSubmit={(values, { resetForm }) => {}}
                        >
                          {(formik) => (
                            <div className="flex flex-col mt-4  ">
                              <div className=" mt-4 flex flex-col   font-medium text-[16px] leading-[100%] tracking-[-0.5px] text-center  pt-[16px] pr-[24px] pb-[16px] pl-[24px] gap-[10px] border-[1px] border-[#E7E7E9] rounded-[14px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] ">
                                <div className="flex justify-between w-full  ">
                                  <div>Lead Strength</div>
                                  {/* <div>{`${opstr}%`}</div> */}
                                </div>

                                {/* <div className='mt-8'>
                                <Slider
                                  onChange={(e) => setopstr(e.target.value)}
                                  value={opstr}
                                  defaultValue={opstr}
                                  aria-label="Default"
                                  valueLabelDisplay="auto"
                                  sx={{
                                    color: '#94B5ED', // Changes the active track color
                                    '& .MuiSlider-thumb': {
                                      '&:hover, &.Mui-focusVisible': {
                                        boxShadow: '0px 0px 0px 8px rgba(242, 85, 51, 0.16)',
                                      },
                                      '&.Mui-active': {
                                        boxShadow: '0px 0px 0px 14px rgba(242, 85, 51, 0.16)',
                                      },
                                    },
                                    '& .MuiSlider-valueLabel': {
                                      backgroundColor: '#94B5ED',
                                    },
                                  }}
                                />
                                </div> */}

                                <div className="mt-8">
                                  <Slider
                                    onChange={(e) => setopstr(e.target.value)}
                                    value={opstr}
                                    defaultValue={opstr}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    sx={{
                                      height: 8,
                                      '& .MuiSlider-track': {
                                        background:
                                          'linear-gradient(to right, #AEECF6, #94B5ED) !important', // Replace with your desired gradient
                                        border: 'none !important',
                                      },
                                      '& .MuiSlider-rail': {
                                        backgroundColor: '#e2e8f0',
                                        opacity: 1,
                                      },
                                      '& .MuiSlider-thumb': {
                                        height: 24,
                                        width: 24,
                                        backgroundColor: '#fff',
                                        border: '2px solid currentColor',
                                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible':
                                          {
                                            boxShadow: 'inherit',
                                          },
                                      },
                                    }}
                                  />
                                </div>
                              </div>


                              <div className=" py-4">
                                <div className="grid grid-cols-2 gap-6">




   {/* Left Reason Section */}
   <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Budget
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.bstr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.bstr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {lookingAtBudgetRange.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.budget === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            budget: data.value,
                                            bstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>

                                  {/* Right Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Configuration
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.confstr ||0}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.confstr ||0}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-3 gap-4">
                                      {bedRoomConfigurtionRange.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.config === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            config: data.value,
                                            confstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>
                                  {/* Left Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Preferred Area
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.astr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.astr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {preferredArea.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.area === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            area: data.value,
                                            astr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>

                                  {/* Right Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Reason For Purchase
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.pstr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.pstr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {reasonPurchase.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.purchase === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            purchase: data.value,
                                            pstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div></div>

                              <div className="flex flex-row justify-end mt-6">
                                <section className="flex flex-row gap-4">
                                  <button
                                    onClick={() => setFeature('appointments')}
                                    className={`w-[77px] h-[40px] px-6 py-2.5 gap-[10px] rounded-[8px] border border-[#E7E7E9]   flex justify-center items-center `}
                                  >
                                    <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em]">
                                      Cancel
                                    </span>
                                  </button>

                                  <button
                                    onClick={() => LeadStrengthFun()}
                                    className={`w-[77px] h-[40px] px-6 py-2.5 gap-[10px] sale_bg_color rounded-[8px]   flex justify-center items-center`}
                                  >
                                    <span className="font-semibold text-[12px] leading-[100%]  s_btn_txt_color tracking-[0.06em]">
                                      Save
                                    </span>
                                  </button>
                                </section>
                              </div>
                            </div>
                          )}
                        </Formik>
                      </>
                    )}
                    {/* {selFeature == 'email' && (
                      <>
                        <EmailForm />
                      </>
                    )} */}
                    {selFeature === 'notes' && (
                      // <div className="flex flex-col justify-between  pt-6">
                      //   {leadNotesFetchedData.length === 0 && !addNote && (
                      //     <div className="py-8 px-8 flex flex-col items-center mt-5">
                      //       <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                      //         <img
                      //           className="w-[180px] h-[180px] inline"
                      //           alt=""
                      //           src="/note-widget.svg"
                      //         />
                      //       </div>
                      //       <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                      //         No Helpful Notes box1 {addNote}
                      //       </h3>
                      //       <button onClick={() => selFun()}>
                      //         <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                      //           <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                      //             <svg
                      //               xmlns="http://www.w3.org/2000/svg"
                      //               fill="none"
                      //               viewBox="0 0 24 24"
                      //               strokeWidth={2}
                      //               stroke="currentColor"
                      //               className="w-5 h-5"
                      //             >
                      //               <path
                      //                 strokeLinecap="round"
                      //                 strokeLinejoin="round"
                      //                 d="M12 4.5v15m7.5-7.5h-15"
                      //               />
                      //             </svg>
                      //             Add Notes
                      //           </span>
                      //         </time>
                      //       </button>
                      //       <Confetti />
                      //     </div>
                      //   )}
                      //   {addNote && (
                      //     <Formik
                      //       initialValues={initialState1}
                      //       validationSchema={validateSchema1}
                      //       onSubmit={(values, { resetForm }) => {
                      //         console.log('values of form is ', values)
                      //         fAddNotes()
                      //       }}
                      //     >
                      //       {(formik1) => (
                      //         <Form>
                      //           <div className=" form flex flex-col pt-0 my-10 mt-[10px] rounded bg-white mx-4 p-4">
                      //             <div className="  outline-none border  rounded p-4 mt-4">
                      //               <ErrorMessage
                      //                 component="div"
                      //                 name="notesText"
                      //                 className="error-message text-red-700 text-xs p-1"
                      //               />
                      //               <textarea
                      //                 name="notesText"
                      //                 value={takNotes}
                      //                 onChange={(e) => {
                      //                   console.log(
                      //                     'what the matter',
                      //                     e.target.value
                      //                   )
                      //                   formik1.setFieldValue(
                      //                     'notesText',
                      //                     e.target.value
                      //                   )
                      //                   setNotesTitle(e.target.value)
                      //                 }}
                      //                 placeholder="Type & make a notes"
                      //                 className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF] "
                      //               ></textarea>
                      //             </div>
                      //             <div className="flex flex-row mt-1">
                      //               <button
                      //                 type="submit"
                      //                 className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-black  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white  `}
                      //               >
                      //                 <span className="ml-1 ">Save</span>
                      //               </button>
                      //               <button
                      //                 onClick={() => cancelResetStatusFun()}
                      //                 type="submit"
                      //                 className={`flex mt-2 ml-4 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-black  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                      //               >
                      //                 <span className="ml-1 ">
                      //                   Save & Whats App
                      //                 </span>
                      //               </button>
                      //               <button
                      //                 onClick={() => cancelResetStatusFun()}
                      //                 className={`flex mt-2 ml-4  rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white `}
                      //               >
                      //                 <span className="ml-1 ">Cancel</span>
                      //               </button>
                      //             </div>
                      //           </div>
                      //         </Form>
                      //       )}
                      //     </Formik>
                      //   )}
                      //   {leadNotesFetchedData.length > 0 && (
                      //     <div className="px-4">
                      //       <div className="flex justify-between">
                      //         <div className="font-md font-medium text-xl mb-4 text-[#053219]">
                      //           Notes
                      //         </div>

                      //         <button onClick={() => selFun()}>
                      //           <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                      //             <span className="text-blue-600">
                      //               {' '}
                      //               Add Notes
                      //             </span>
                      //           </time>
                      //         </button>
                      //       </div>
                      //       <ol className="relative border-l ml-3 border-gray-200  ">
                      //         {leadNotesFetchedData.map((data, i) => (
                      //           <section key={i} className="">
                      //             <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-green-200 rounded-full ring-8 ring-white  ">
                      //               <DocumentIcon className=" w-3 h-3" />
                      //             </span>
                      //             <div className="text-gray-600  m-3 ml-6">
                      //               <div className="text-base font-normal">
                      //                 <span className="font-medium text-green-900 ">
                      //                   {data?.notes}
                      //                 </span>{' '}
                      //               </div>
                      //               <div className="text-sm font-normal">
                      //                 {data?.txt}
                      //               </div>
                      //               <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                      //                 <ClockIcon className=" w-3 h-3" />

                      //                 <span className="ml-1">added on:</span>
                      //                 <span className="text-gray-500 ml-1">
                      //                   {prettyDateTime(data?.ct)}
                      //                 </span>
                      //                 <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>
                      //                 <span className="">added by:</span>
                      //                 <span className="text-gray-500 ml-1 ">
                      //                   {data?.by}
                      //                 </span>
                      //               </span>
                      //             </div>
                      //           </section>
                      //         ))}
                      //       </ol>
                      //     </div>
                      //   )}
                      // </div>

                      <div className="flex flex-col justify-between  pt-6">
                        {leadNotesFetchedData.length === 0 && !addNote && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-medium text-[16px] leading-[100%] tracking-[0em]">
                                Add notes
                              </h3>

                              <button onClick={() => selFun()}>
                                <span className="inline-flex items-center justify-center px-4 py-3 rounded-[8px] sale_bg_color text-white font-medium text-[14px] leading-[100%] tracking-[0.06em] font-outfit">
                                  Add Notes
                                </span>
                              </button>
                            </div>

                            <div className="py-8 px-8  flex flex-col items-center mt-5">
                              <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                                <img
                                  className="w-[180px] h-[180px] inline"
                                  alt=""
                                  src="/note-widget.svg"
                                />
                              </div>
                              <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                                No Helpful Notes{addNote}
                              </h3>

                              <Confetti />
                            </div>
                          </div>
                        )}
                        {addNote && (
                          <Formik
                            initialValues={initialState1}
                            validationSchema={validateSchema1}
                            onSubmit={(values, { resetForm }) => {
                              console.log('values of form is ', values)
                              fAddNotes()
                            }}
                          >
                            {(formik1) => (
                              <Form>
                                <div className="box__bg relative rounded-[14px] e shadow-[0px_4px_30px_0px_#0000000D]  border-[#E7E7E9] mx-auto p-[1px]">
                                  <div className="w-full max-w-[922px]  h-auto md:h-[344px] p-5 gap-[30px] rounded-[14px] bg-white">
                                    <div className="flex items-start gap-4  max-w-4xl mx-auto">
                                      <div className="p-2 rounded-lg bg-[#FFFFFF] shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Target Sale Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex items-center">
                                          <h2 className="font-normal text-[16px] leading-[100%] tracking-[0em] font-heading underline">
                                            Heading
                                          </h2>
                                          <img
                                            src="/edit-02.svg"
                                            alt="Edit Icon"
                                            className="w-5 h-5 cursor-pointer"
                                            onClick={() =>
                                              setisImportLeadsOpen(true)
                                            }
                                          />
                                        </div>

                                        <p className="font-normal text-[12px] leading-[100%] tracking-[0em] text-[#606062] font-heading">
                                          Mark the visit done to open the next
                                          step: sharing lead experience.
                                        </p>
                                      </div>
                                    </div>

                                    <div className=" form flex flex-col pt-0  mt-[10px] rounded bg-white">
                                      <div className=" w-full max-w-[882px] h-auto p-3 md:p-2 gap-2.5   outline-none border border-[#E7E7E9] rounded-[8px] p-2 mt-2">
                                        <ErrorMessage
                                          component="div"
                                          name="notesText"
                                          className="error-message text-red-700 text-xs p-1"
                                        />
                                        <textarea
                                          name="notesText"
                                          value={takNotes}
                                          onChange={(e) => {
                                            console.log(
                                              'what the matter',
                                              e.target.value
                                            )
                                            formik1.setFieldValue(
                                              'notesText',
                                              e.target.value
                                            )
                                            setNotesTitle(e.target.value)
                                          }}
                                          placeholder="Type & make a notes"
                                          className="w-full min-h-[161px]  text-[12px] outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF] "
                                        ></textarea>
                                      </div>
                                      {/* <div className="flex flex-row  justify-end mt-1">
    <button
      type="submit"
      className={`flex mt-2 rounded-[8px] items-center text-[12px]  pl-2 h-[36px] pr-4 px-4 py-4 text-sm font-medium text-black  sale_bg_color cursor-pointer   `}
    >
      <span className="ml-1 text-white text-[12px] ">Save</span>
    </button>
    <button
      onClick={() => cancelResetStatusFun()}
      type="submit"
      className={`flex mt-2 ml-4 rounded-[8px] text-[12px] items-center  pl-2 h-[36px] pr-4 px-4 py-4 text-sm font-medium text-black  sale_bg_color cursor-pointer `}
    >
      <span className="ml-1 text-white text-[12px] ">
        Save & Whats App
      </span>
    </button>
    <button
      onClick={() => cancelResetStatusFun()}
      className={`flex mt-2 ml-4  rounded-[8px] items-center text-[12px]  pl-2 h-[36px] pr-4 px-4 py-4 text-sm font-medium border cursor-pointer `}
    >
      <span className="ml-1 text-[12px]  text-black">Cancel</span>
    </button>
  </div> */}
                                      <div className="flex flex-wrap  justify-end gap-4 mt-5">
                                        <button
                                          type="submit"
                                          className="flex items-center px-4 h-9 text-sm font-medium text-white sale_bg_color rounded-md"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="submit"
                                          onClick={cancelResetStatusFun}
                                          className="flex items-center px-4 h-9 text-sm font-medium text-white sale_bg_color rounded-md"
                                        >
                                          Save & WhatsApp
                                        </button>
                                        <button
                                          onClick={cancelResetStatusFun}
                                          className="flex items-center px-4 h-9 text-sm font-medium text-black border rounded-md"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        )}
                        {leadNotesFetchedData.length > 0 && (
                          <div className="">
                            <div className="flex my-4  items-center justify-between">
                              <div className="font-medium text-[16px] leading-[100%] tracking-[0%] mb-4 ">
                                 Notes
                              </div>

                              <button onClick={() => selFun()}>
                                <time className="block mb-2 inline-flex items-center justify-center px-4 py-3 rounded-[8px] sale_bg_color text-white font-medium text-[14px] leading-[100%] tracking-[0.06em] font-outfit  ">
                                  <span className="text-[12px] text-white">
                                    {' '}
                                    Add Notes
                                  </span>
                                </time>
                              </button>
                            </div>
                            {/* <ol className="relative border-l ml-3 border-gray-200  ">
                              {leadNotesFetchedData.map((data, i) => (
                                <section key={i} className="">
                                  <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-green-200 rounded-full ring-8 ring-white  ">
                                    <DocumentIcon className=" w-3 h-3" />
                                  </span>
                                  <div className="text-gray-600  m-3 ml-6">
                                    <div className="text-base font-normal">
                                      <span className="font-medium text-green-900 ">
                                        {data?.notes}
                                      </span>{' '}
                                    </div>
                                    <div className="text-sm font-normal">
                                      {data?.txt}
                                    </div>
                                    <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                                      <ClockIcon className=" w-3 h-3" />

                                      <span className="ml-1">added on:</span>
                                      <span className="text-gray-500 ml-1">
                                        {prettyDateTime(data?.ct)}
                                      </span>
                                      <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>
                                      <span className="">added by:</span>
                                      <span className="text-gray-500 ml-1 ">
                                        {data?.by}
                                      </span>
                                    </span>
                                  </div>
                                </section>
                              ))}
                            </ol> */}

                            <ol className="space-y-4 bg-white rounded-xl shadow-md">
                              {leadNotesFetchedData.map((data, i) => (
                                <li
                                  key={i}
                                  className="border-b border-gray-100 py-4 last:border-none"
                                >
                                  <div className="px-6">
                                    <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                        {data?.notes}
                                      </h3>
                                      <p className="mt-2 text-sm text-gray-600">
                                        {data?.txt}
                                      </p>
                                    </div>

                                      <div>
                                        <div className="flex items-center text-xs text-gray-500 space-x-1">
                                          <ClockIcon className="w-3 h-3" />
                                          <span>
                                            {prettyDateTime(data?.ct)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Horizontal line with more visible border style */}
                                    <hr className="border-t-1 border-[#E7E7E9] my-4 w-full" />


                                  </div>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}

                    {selFeature === 'visitDoneNotes' && (
                      <div className="flex flex-col justify-between  pt-6">
                        {leadNotesFetchedData.length === 0 && !addNote && (
                          <div className="py-8 px-8 flex flex-col items-center mt-5">
                            <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                              <img
                                className="w-[180px] h-[180px] inline"
                                alt=""
                                src="/note-widget.svg"
                              />
                            </div>
                            <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                              No Helpful Notes box2 {addNote}
                            </h3>
                            <button onClick={() => selFun()}>
                              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                                Better always attach a string
                                <span className="text-blue-600">
                                  {' '}
                                  Add Notes
                                </span>
                              </time>
                            </button>
                          </div>
                        )}
                        {addNote && (
                          <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-[#FFFFFF] mx-2">
                            <div className="w-full flex flex-col mb-3 mt-2">
                              <CustomSelect
                                name="source"
                                label="Site Visit Feedback*"
                                className="input mt-3"
                                onChange={(value) => {
                                  setNotInterestType(value.value)
                                }}
                                value={notInterestType}
                                options={siteVisitFeedbackOptions}
                              />
                            </div>

                            <div className="  outline-none border  rounded p-4 mt-4">
                              <textarea
                                value={takNotes}
                                onChange={(e) => setNotesTitle(e.target.value)}
                                placeholder="Type & make a notes *"
                                className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF] "
                              ></textarea>
                            </div>
                            <div className="flex flex-row mt-1">
                              <button
                                onClick={() => fAddNotes()}
                                className={`flex mt-2 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                              >
                                <span className="ml-1 ">Save</span>
                              </button>
                              <button
                                onClick={() => fAddNotes()}
                                className={`flex mt-2 ml-4 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-black  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white  `}
                              >
                                <span className="ml-1 ">Save & Whats App</span>
                              </button>
                              <button
                                onClick={() => cancelResetStatusFun()}
                                className={`flex mt-2 ml-4  rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white  `}
                              >
                                <span className="ml-1 ">Cancel</span>
                              </button>
                            </div>
                          </div>
                        )}
                        {leadNotesFetchedData.length > 0 && (
                          <div className="px-4">
                            <div className="flex justify-between">
                              <div className="font-md font-medium text-xl mb-4 text-[#053219]">
                                Notes
                              </div>

                              <button onClick={() => selFun()}>
                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                                  <span className="text-blue-600">
                                    {' '}
                                    Add Notes
                                  </span>
                                </time>
                              </button>
                            </div>
                            <ol className="relative border-l ml-3 border-gray-200  ">
                              {leadNotesFetchedData.map((data, i) => (
                                <section key={i} className="">
                                  <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-green-200 rounded-full ring-8 ring-white  ">
                                    <DocumentIcon className=" w-3 h-3" />
                                  </span>
                                  <div className="text-gray-600  m-3 ml-6">
                                    <div className="text-base font-normal">
                                      <span className="font-medium text-green-900 ">
                                        {data?.notes}
                                      </span>{' '}
                                    </div>
                                    <div className="text-sm font-normal">
                                      {data?.txt}
                                    </div>
                                    <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                                      <ClockIcon className=" w-3 h-3" />

                                      <span className="ml-1">added on:</span>
                                      <span className="text-red-900 ml-1 mr-4">
                                        {prettyDateTime(data?.ct)}
                                      </span>
                                      <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>
                                      <span className="ml-2">added by:</span>
                                      <span className="text-red-900 ml-1 mr-4">
                                        {data?.by}
                                      </span>
                                    </span>
                                  </div>
                                </section>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {selFeature === 'documents' && (
                  <div className="border px-4">
                    {docsList.length === 0 && (
                      <div className="py-8 px-8 flex flex-col items-center mt-6">
                        <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                          <img
                            className="w-[200px] h-[200px] inline"
                            alt=""
                            src="/empty-dashboard.svg"
                          />
                        </div>
                        <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                          No Attachments
                        </h3>
                        <button onClick={() => showAddAttachF()}>
                          <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                            Better always attach a string
                            <span className="text-blue-600"> Add Dcoument</span>
                          </time>
                        </button>
                      </div>
                    )}

                    {attach && (
                      <div className="flex justify-center mt-4">
                        <div className="mb-3 w-96 px-10 bg-[#FFFFFF] rounded-md py-3 pb-6">
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
                                type="submit"
                                className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white  bg-[#7bd2ea]  hover:bg-gray-700  `}
                              >
                                <span className="ml-1 ">Upload</span>
                              </button>
                              <button
                                onClick={() => setAttach(false)}
                                className={`flex mt-2 ml-4  rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700  `}
                              >
                                <span className="ml-1 ">Cancel</span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {docsList.length > 0 && (
                      <div className="py-8">
                        <div className="flex justify-between">
                          <h2 className="text-xl font-semibold leading-tight">
                            Customer Documents
                          </h2>
                          <button onClick={() => showAddAttachF()}>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                              <span className="text-blue-600">
                                {' '}
                                Add Dcoument
                              </span>
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
                                            onClick={() =>
                                              downloadFile(dat.url)
                                            }
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
                      Sitback & Relax{' '}
                      <span className="text-blue-600">Add Task</span>
                    </time>
                  </div>
                )}
                {selFeature === 'phone' && (
                  <>
                    {filterData?.length === 0 && (
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
                          Sitback & Relax{' '}
                          <span className="text-blue-600">Add Task</span>
                        </time>
                      </div>
                    )}

                    <div className="px-4 mt-4">
                      <div className="font-md font-medium text-xl mb-4 text-[#053219]">
                        Phone Calls
                      </div>
                      <ol className="relative border-l border-gray-200 ml-3 ">
                        {filterData?.map((data, i) => (
                          <section key={i} className="">
                            <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-green-200 rounded-full ring-8 ring-white  ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-blue-600 "
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </span>
                            <div className="text-gray-600  m-3 ml-6">
                              <div className="text-base font-normal">
                                <span className="font-medium text-green-900 ">
                                  {'Rajiv'}
                                </span>{' '}
                                called{' '}
                                <span className="text-sm text-red-900  ">
                                  {Name}
                                </span>{' '}
                              </div>
                              <div className="text-sm font-normal">
                                {data?.txt}
                              </div>
                              <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                                <ClockIcon className="mr-1 w-3 h-3" />
                                {data?.type == 'ph'
                                  ? timeConv(
                                      Number(data?.time)
                                    ).toLocaleString()
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
                          </section>
                        ))}
                      </ol>
                    </div>
                  </>
                )}
                {selFeature === 'lead_summary' && (
                  <>
                    <div className="max-w-5xl mx-auto space-y-4 mt-4">
                      {/* </div> */}

                      <div>
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 ">
                          <div className=" rounded-[8px] border border-[#F0F0F5]  bg-[#FFFFFF] overflow-hidden">
                            {/* Card content */}
                            <div className="py-1 px-5">
                                    <div className="pb-3">
                                      {editTaskObj?.ct === leadNextTaskObj?.ct ? (
                                        <EditLeadTask
                                          editTaskObj={editTaskObj}
                                          setStartDate={setStartDate}
                                          startDate={startDate}
                                          takTitle={takTitle}
                                          setTitleFun={setTitleFun}
                                          cancelResetStatusFun={
                                            cancelResetStatusFun
                                          }
                                          editTaskFun={editTaskFun}
                                          d={d}
                                        />
                                      ) : null}
                                    </div>

                                    <>
                                      {' '}
                                      <LeadTaskDisplayHead
                                        data={leadNextTaskObj}
                                        setAddTaskCommentObj={
                                          setAddTaskCommentObj
                                        }
                                        closeTaskFun={closeTaskFun}
                                        hoverTasId={hoverTasId}
                                        undoFun={undoFun}
                                        setShowVisitFeedBackStatusFun={
                                          setShowVisitFeedBackStatusFun
                                        }
                                        EditTaskOpenWindowFun={
                                          EditTaskOpenWindowFun
                                        }
                                      />
                                       <div className="flex flex-wrap mt-1 font-[Outfit] s_h12 ml-[34px]">
                                      <div className=" s_h12 text-[#606062] font-[300]">
                                        Assigned date :{' '}
                                        {prettyDateTime(
                                          leadNextTaskObj?.schTime
                                        )}
                                      </div>
                                      <div className="s_divider_small"></div>
                                      <div className=" s_h12 text-[#606062] font-[300]">
                                        Assigned to: {leadNextTaskObj.by}
                                      </div>
                                    </div>
                                      {addTaskCommentObj?.ct === leadNextTaskObj?.ct && (
                                        <div className="ml-[18px]">

                                        <AddLeadTaskComment
                                          closeTask={closeTask}
                                          data={leadNextTaskObj}
                                          setShowVisitFeedBackStatusFun={
                                            setShowVisitFeedBackStatusFun
                                          }
                                          setShowNotInterestedFun={
                                            setShowNotInterestedFun
                                          }
                                          setAddCommentTitle={
                                            setAddCommentTitle
                                          }
                                          addCommentTitle={addCommentTitle}
                                          addCommentTime={addCommentTime}
                                          setPostPoneToFuture={
                                            setPostPoneToFuture
                                          }
                                          setClosePrevious={setClosePrevious}
                                          setAddCommentPlusTask={
                                            setAddCommentPlusTask
                                          }
                                          setAddCommentTime={setAddCommentTime}
                                          cancelResetStatusFun={
                                            cancelResetStatusFun
                                          }
                                          addTaskCommentFun={addTaskCommentFun}
                                          addCommentPlusTask={
                                            addCommentPlusTask
                                          }
                                          setSelType={setSelType}
                                          selType={selType}
                                          d={d}
                                        />
                                        </div>
                                      )}
                                      {/* <div className='ml-7 border-b border-[#E7E7E9] py-2 min-h-[1px]'>
                                        {addTaskCommentObj?.ct != leadNextTaskObj?.ct && (
                                          <LeadTaskFooter
                                            data={data}
                                            hoverTasId={hoverTasId}
                                            EditTaskOpenWindowFun={
                                              EditTaskOpenWindowFun
                                            }
                                            delFun={delFun}
                                          />
                                        )}
                                      </div> */}
                                      <div
                                        className={`ml-7 pb-[8px] min-h-[1px]`}
                                      >
                                        {addTaskCommentObj?.ct != leadNextTaskObj?.ct && (
                                          <LeadTaskFooter
                                            data={leadNextTaskObj}
                                            hoverTasId={hoverTasId}
                                            EditTaskOpenWindowFun={
                                              EditTaskOpenWindowFun
                                            }
                                            delFun={delFun}
                                          />
                                        )}
                                      </div>
                                      {/*
{data?.comments?.length > 0 && (
  <p className="font-outfit font-medium text-[12px] leading-[100%] tracking-[0%] text-[#606062] mt-4 mb-2 ml-6 mb-2">
    {data.comments.length} Comment{data.comments.length > 1 ? 's' : ''}
  </p>
)} */}
                                      {/* {data?.comments?.length > 0 && (
  <div className="flex items-center mt-4 mb-2 ml-6">
    <div className="w-4 h-px bg-[#E7E7E9] mr-2" />
    <p className="font-outfit font-medium text-[12px] leading-[100%] tracking-[0%] text-[#606062]">
      {data.comments.length} Comment{data.comments.length > 1 ? 's' : ''}
    </p>
  </div>
)} */}
                                      {leadNextTaskObj?.comments?.length > 0 && (
                                        <div
                                          className={`flex items-center mt-[2px] mb-1 ${
                                            leadNextTaskObj?.stsType === 'visitfixed' &&
                                            leadNextTaskObj?.sts !== 'completed'
                                              ? 'ml-[15px]'
                                              : 'ml-[15px]'
                                          } ml-[20px]`}
                                        >
                                          <p className="font-outfit font-medium text-[12px] leading-[100%] tracking-[0%] text-[#606062] ml-[16px]">
                                            {leadNextTaskObj.comments.length} Comment
                                            {leadNextTaskObj.comments.length > 1
                                              ? 's'
                                              : ''}
                                          </p>
                                        </div>
                                      )}
                                      <ol className="list-none ml-[4px]">
                                      {leadNextTaskObj?.comments?.map((commentObj, k) => {
                                        return (
                                          <li
                                            // key={k}
                                            // className={`ml-6 pl-6  py-3 text-[14px] text-[#7E92A2] tracking-wide ${data?.comments?.length - 1 === k
                                            //   ? 'mb-1'
                                            //   : ''
                                            //   }`}

                                            className={` ml-[29px] ${
                                              leadNextTaskObj?.stsType === 'visitfixed' &&
                                              leadNextTaskObj?.sts !== 'completed'
                                                ? 'pl-0'
                                                : 'pl-0'
                                            } py-[4px] text-[14px] text-[#7E92A2] tracking-wide ${
                                              leadNextTaskObj?.comments?.length - 1 === k
                                                ? 'mb-1'
                                                : ''
                                            }`}
                                          >
                                            <section className="flex flex-row justify-between items-center w-full">
                                              <div className="flex items-center space-x-2">
                                                {/* <span>
                                              {' '}

                                              {' '} */}

                                                <img
                                                  src="/material-symbols-light_add-task-rounded.svg"
                                                  alt="Clock Icon"
                                                  className="w-[14px] h-[14px]"
                                                />

                                                <span className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#7E92A2]">
                                                  {commentObj?.c}
                                                </span>
                                                {/* </span> */}
                                              </div>
                                              <p className="text-[12px] font-normal leading-[14px] tracking-normal text-[#606062]">
                                                {' '}
                                                {prettyDateTime(commentObj?.t)}
                                              </p>
                                            </section>
                                          </li>
                                        )
                                      })}
                                      </ol>
                                      {(showNotInterested ||
                                        showVisitFeedBackStatus) &&
                                        selSchGrpO?.ct === leadNextTaskObj?.ct && (
                                          <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-white mx-2">
                                            {showNotInterested && (
                                              <div className="w-full flex flex-col mb-3 mt-2">
                                                <SelectDropDownComp
                                                  label={`Why  ${
                                                    customerDetails?.Name?.toLocaleUpperCase() ||
                                                    'Customer'
                                                  } is  not Interested*`}
                                                  options={notInterestOptions}
                                                  value={fbTitle}
                                                  onChange={(value) => {
                                                    setFbTitle(value.value)
                                                  }}
                                                />
                                              </div>
                                            )}

                                            {/* {showVisitFeedBackStatus && (
                                              <div className="w-full flex flex-col mb-3 mt-2">
                                                <SelectDropDownComp
                                                  label="Sites Visit Feedback *"
                                                  options={
                                                    siteVisitFeedbackOptions
                                                  }
                                                  value={fbTitle}
                                                  onChange={(value) => {
                                                    setFbTitle(value.value)
                                                  }}
                                                />
                                              </div>
                                            )} */}

                                            {showVisitFeedBackStatus && (
                                              <div className="w-full flex  flex-col mb-3 mt-2">
                                                <label className="mb-4 font-outfit font-normal text-xs leading-[100%] tracking-[0%] text-[#606062]">
                                                  Sites Visit Feedback *
                                                </label>

                                                <div className=" py-4">
                                <div className="grid grid-cols-2 gap-6">




   {/* Left Reason Section */}
   <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Budget
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.bstr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.bstr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {lookingAtBudgetRange.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.budget === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            budget: data.value,
                                            bstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>

                                  {/* Right Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Configuration
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.confstr ||0}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.confstr ||0}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-3 gap-4">
                                      {bedRoomConfigurtionRange.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.config === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            config: data.value,
                                            confstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>
                                  {/* Left Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Preferred Area
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.astr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.astr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {preferredArea.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.area === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            area: data.value,
                                            astr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>

                                  {/* Right Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Reason For Purchase
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.pstr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.pstr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {reasonPurchase.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.purchase === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            purchase: data.value,
                                            pstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div></div>


                                                <div className="flex space-x-4">
                                                  {siteVisitFeedbackOptions.map(
                                                    (option) => (
                                                      <button
                                                        key={option.value}
                                                        className={`py-2 px-8 text-[12px] flex border border-[#E7E7E9] rounded-lg items-center space-x-1 rounded-md ${
                                                          fbTitle ===
                                                          option.value
                                                            ? 'sale_bg_color text-white'
                                                            : 'bg-white text-gray-700'
                                                        }`}
                                                        onClick={() =>
                                                          setFbTitle(
                                                            option.value
                                                          )
                                                        }
                                                      >
                                                        <img
                                                          src={`/${option.value}.svg`}
                                                          alt={option.label}
                                                          className="w-5 h-5"
                                                        />
                                                        <span>
                                                          {option.label}
                                                        </span>
                                                      </button>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}

                                            <div className=" w-full max-w-[882px]  h-auto p-3 md:p-2 gap-2.5   outline-none border border-[#E7E7E9] rounded-[8px] p-2 mt-2">
                                              <textarea
                                                value={fbNotes}
                                                onChange={(e) =>
                                                  setfbNotes(e.target.value)
                                                }
                                                placeholder="Type & make a notes *"
                                                className="w-full min-h-[161px]  text-[12px] outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF]"
                                              ></textarea>
                                            </div>
                                            <div className="flex flex-wrap items-end item justify-end gap-4 mt-5">
                                              <button
                                                onClick={() => {
                                                  if (fbNotes != '') {
                                                    setLeadStatus('visitdone')
                                                    if (showNotInterested) {
                                                      notInterestedFun()
                                                      return
                                                    }
                                                    addFeedbackFun(data)
                                                  } else {
                                                    toast.error(
                                                      'Please Enter Notes'
                                                    )
                                                  }
                                                }}
                                                // className={`flex mt-2 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                                className="flex items-center px-4 h-9 text-sm font-medium text-white sale_bg_color rounded-md"
                                              >
                                                Save
                                              </button>
                                              <button
                                                onClick={() => {
                                                  console.log('am i clicked')

                                                  setLeadStatus('visitdone')
                                                  if (showNotInterested) {
                                                    notInterestedFun()
                                                    return
                                                  }
                                                  addFeedbackFun(data)

                                                  getWhatsAppTemplates(
                                                    'on_sitevisit_done',
                                                    'wa',
                                                    'customer',
                                                    ProjectId,
                                                    receiverDetails,
                                                    msgPayload
                                                  )
                                                }}
                                                // className={`flex mt-2 ml-4 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                                className="flex items-center px-4 h-9 text-sm font-medium text-white sale_bg_color s_btn_txt_color rounded-md"
                                              >
                                                Save & Whats App
                                              </button>
                                              <button
                                                onClick={() =>
                                                  cancelResetStatusFun()
                                                }
                                                // className={`flex mt-2 ml-4  rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white  `}
                                                className="flex items-center px-4 h-9 text-sm font-medium text-black s_btn_txt_color border rounded-md"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        )}



                                    </>
                                  </div>


                          </div>

                          <div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                              {/* Left Column */}
                              <div className="space-y-4">
                              <div className="border border-[#F0F0F5] bg-[#FFFFFF] p-3 shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-[8px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-col w-full ">
                                      <div className="flex items-center mb-4 justify-between pb-[16px] pt-[8px] border-b border-[#F0F0F5]">
                                        <section className="flex items-center">
                                          <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                            <div className="bg-[#E3F1FA] p-1 rounded-full">
                                              {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                              <img
                                                src="/location.svg"
                                                alt=""
                                                className="w-[18px] h-[18px]"
                                              />
                                            </div>
                                          </div>
                                          <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">
                                            Site visit (
                                            {projectData.siteVisit.count})
                                          </span>
                                        </section>
                                        <div className="flex flex-row items-center font-medium text-[14px] text-[#0E0A1F] mr-[8px]">
                                          <img
                                            src="/good.svg"
                                            alt="icon"
                                            className="mb-1 w-8 h-8 mr-[8px]"
                                          />
                                          Good
                                        </div>
                                      </div>

                                      <div className="flex flex-row justify-between">
                                        <p className="font-normal text-[12px] text-[#0D0A1E]">
                                          Visit Date:{' '}
                                          {projectData.siteVisit.date}
                                        </p>
                                        <p className="font-normal text-[12px] text-[#0D0A1E]">
                                          Site In-charge:{' '}
                                          {projectData.siteVisit.inCharge}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                                <div className=" rounded-[8px] py-[16px]  bg-[#FFFFFF]  border border-[#F0F0F5]  shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] max-w-lg">
                                  <div className="flex items-center mb-8 border-b border-gray-200 px-4 pb-[16px]">
                                    <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                      <div className="bg-[#E3F1FA] p-1 rounded-full">
                                        {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                        <img
                                          src="/fire.svg"
                                          alt=""
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>
                                    </div>

                                    <span className="font-medium text-[16px]  text-[#0D0A1E]">
                                      Lead strength
                                    </span>
                                  </div>

                                  <section className=" px-4">
                                    <div className="mb-2">
                                      <div className="mb-4">
                                        <GradientSlider
                                          opstr={opstr}
                                          setopstr={setopstr}
                                        />
                                      </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-6">
                                      <div className="font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062]">
                                        Requirement : 10/12
                                      </div>
                                      <div className="font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062]">
                                        Updated : 27 Mar, 4:30 pm
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                      <div className="bg-white rounded-2xl border border-[#E7E7E9]  px-2 py-1 flex items-center">
                                        {/* <Clock className="w-5 h-5 mr-2 text-gray-600" /> */}
                                        <img
                                          src="/Rup.svg"
                                          alt=""
                                          className="w-5 h-5"
                                        />
                                        <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#606062]">
                                          Shuba Ecosone Ph 2
                                        </span>
                                      </div>

                                      <div className="bg-white rounded-2xl border border-[#E7E7E9] px-2 py-1 flex items-center">
                                        <img
                                          src="/Rup.svg"
                                          alt=""
                                          className="w-5 h-5"
                                        />
                                        <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#606062]">
                                          Min: 2.12cr
                                        </span>
                                      </div>

                                      <div className="bg-white rounded-2xl border border-[#E7E7E9] px-2 py-1 flex items-center">
                                        <img
                                          src="/Rup.svg"
                                          alt=""
                                          className="w-5 h-5"
                                        />
                                        <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#606062]">
                                          Max: 5.
                                        </span>
                                      </div>

                                      {/* View more button */}
                                      <button className="mt-4 font-medium text-xs leading-tight tracking-normal text-[#606062] underline decoration-solid decoration-0 decoration-offset-[25%] decoration-thick decoration-skip-ink-auto flex items-center">
                                        View {isExpanded ? 'less' : 'more'}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className={`ml-1 transition-transform ${
                                            isExpanded ? 'rotate-180' : ''
                                          }`}
                                        >
                                          <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                      </button>
                                    </div>
                                  </section>
                                </div>

                                {/* Lead Strength Card */}
                                {/* <div className="border border-[#F0F0F5] bg-[#FFFFFF] p-3 rounded-[14px] ">
    <div className="flex items-center mb-2">
      <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
        <Clock className="text-purple-500 w-5 h-5" />
        <img src="/quill_clock.svg" alt="" className='w-[18px] h-[18px]' />

      </div>
      <h2 className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">LEAD STRENGTH</h2>
    </div>

    <div className="flex justify-between items-center">
      <div className='flex flex-col gap-2'>
        <p className="font-normal text-[14px] leading-[100%] tracking-[0%] text-[#606062] mb-1">Total Questions: 2/3</p>
        <p className="font-normal text-[14px] leading-[100%] tracking-[0%] text-[#606062]">Last Updated: 27 Mar, 4:30 pm</p>
      </div>


      <div>
          <SemicircleProgressChart progress={0}/>
      </div>
    </div>
  </div> */}

<div className=" rounded-[8px] py-[16px]   shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)]  border border-[#F0F0F5]  max-w-lg">
                                  <div className="flex items-center mb-8 border-b border-gray-200 px-4 pb-[16px]">
                                    <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                      <div className="bg-[#E3F1FA] p-1 rounded-full">
                                        {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                        <img
                                          src="/folder-library.svg"
                                          alt=""
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>
                                    </div>

                                    <span className="font-medium text-[16px]  text-[#0D0A1E]">
                                      Project
                                    </span>
                                  </div>

                                  <section className=" px-4">
                                    <div className="mb-4">
                                      <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-medium text-2xl  leading-tight tracking-normal text-[#404040]">
                                          {' '}
                                          {selProjectFullDetails?.projectName}
                                        </h2>
                                        <a
                                          href="#"
                                          className="font-medium text-xs leading-tight tracking-normal sale_text_color underline decoration-solid decoration-0 decoration-offset-[25%] decoration-thick decoration-skip-ink-auto"
                                          onClick={() => {
                                            setUnitsViewMode(!unitsViewMode)
                                          }}
                                        >
                                          View Units (
                                          {
                                            selProjectFullDetails?.availableCount
                                          }
                                          /
                                          {
                                            selProjectFullDetails?.totalUnitCount
                                          }
                                          )
                                        </a>
                                      </div>

                                      <div className="flex flex-wrap gap-2">
                                        <div className="bg-[#F3E1D8] rounded-[15px] py-1 px-2 flex gap-2 items-center">
                                          <div>
                                            <img
                                              src={
                                                selProjectFullDetails?.planningApproval?.toLowerCase() ===
                                                'yes'
                                                  ? '/yessale.svg'
                                                  : '/nosale.svg'
                                              }
                                              alt=""
                                              className="w-3 h-3"
                                            />
                                          </div>

                                          <span className="mr-2 font-outfit font-normal text-xs leading-tight tracking-normal text-[#606062]">
                                            Planning Approval
                                          </span>
                                        </div>

                                        <div className="bg-[#F3E1D8] rounded-[15px] py-1 px-2 flex gap-2 items-center">
                                          <div>
                                            <img
                                              src={
                                                selProjectFullDetails?.planningApproval?.toLowerCase() ===
                                                'yes'
                                                  ? '/yessale.svg'
                                                  : '/nosale.svg'
                                              }
                                              alt=""
                                              className="w-3 h-3"
                                            />
                                          </div>

                                          <span className="mr-2 font-outfit font-normal text-xs leading-tight tracking-normal text-[#606062]">
                                            RERA Approval
                                          </span>
                                        </div>

                                        {/* Amenities */}
                                        <div className="border bg-[#F3E1D8] rounded-[15px] py-1 px-2 font-outfit font-normal text-xs leading-tight tracking-normal text-[#606062] flex items-center justify-center">
                                          +21 Amenities
                                        </div>
                                      </div>
                                    </div>

                                    {isExpanded && (
                                      <div className="mt-4 pt-4 border-t">
                                        <h3 className="font-medium text-base leading-tight tracking-normal text-[#404040] mb-2">
                                          Additional Information
                                        </h3>
                                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                          This is the second phase of the Shuba
                                          Ecosone development featuring
                                          eco-friendly design, sustainable
                                          materials, and energy-efficient
                                          construction. The project includes
                                          studio, 1 BHK, and 2 BHK apartments
                                          with modern amenities.
                                        </p>
                                        <div className="mt-3">
                                          <h4 className="font-medium text-base leading-tight tracking-normal text-[#404040] mb-1">
                                            Key Features:
                                          </h4>
                                          <ul className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                            <li>Solar-powered common areas</li>
                                            <li>Rainwater harvesting</li>
                                            <li>Organic waste composting</li>
                                            <li>EV charging stations</li>
                                          </ul>
                                        </div>
                                      </div>
                                    )}

                                    <button
                                      onClick={toggleExpand}
                                      className="mt-4 font-medium text-xs leading-tight tracking-normal text-[#606062] underline decoration-solid decoration-0 decoration-offset-[25%] decoration-thick decoration-skip-ink-auto flex items-center"
                                    >
                                      View {isExpanded ? 'less' : 'more'}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`ml-1 transition-transform ${
                                          isExpanded ? 'rotate-180' : ''
                                        }`}
                                      >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                      </svg>
                                    </button>
                                  </section>
                                </div>

                                {/*
  <div className="border border-[#E7E7E9] bg-[#FFFFFF] p-4 rounded-[8px]">
  <div className="flex items-center mb-4">
    <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
      <img src="/quill_clock.svg" alt="" className='w-[18px] h-[18px]' />
    </div>
    <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">SITE VISIT (4)</span>
  </div>




  <div className="grid grid-cols-2 items-center gap-4">
  <div className="flex gap-2 flex-col">
    <div className="font-normal text-[14px] tracking-[0%] text-[#606062]">
      Visit Date: {projectData.siteVisit.date}
    </div>
    <div className="font-normal text-[14px] tracking-[0%] text-[#606062]">
      Site In-charge: {projectData.siteVisit.inCharge}
    </div>
  </div>

  <div className="font-semibold text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F] flex flex-col items-center">
    <img src="/good.svg" alt="icon" className="mb-1 w-16 h-16" />
    Good
  </div>
</div>



</div> */}

                                <div className="border border-[#F0F0F5] bg-[#FFFFFF] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] p-4 rounded-[8px] cursor-pointer">
                                  <div className="flex items-center mb-4">
                                    <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                      <div className="bg-[#E3F1FA] p-1 rounded-full">
                                        {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                        <img
                                          src="/target-sale.svg"
                                          alt=""
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>
                                    </div>

                                    <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">
                                      TASK LOGS
                                    </span>
                                    <div className="ml-auto">
                                      <img
                                        src="/arrowright.svg"
                                        alt="Arrow Right Icon"
                                        className="w-5 h-5"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-4 px-4">
                                    {[
                                      {
                                        label: 'Price Quotations',
                                        value:
                                          projectData.taskLogs.priceQuotations,
                                      },
                                      {
                                        label: 'Completed Tasks',
                                        value:
                                          projectData.taskLogs.completedTasks,
                                      },
                                      {
                                        label: 'Total Comments',
                                        value:
                                          projectData.taskLogs.totalComments,
                                      },
                                    ].map((item, index, array) => (
                                      <div
                                        key={item.label}
                                        className={`${
                                          index !== array.length - 1
                                            ? ' pb-3'
                                            : ''
                                        }`}
                                      >
                                        <div className="flex justify-between  items-center">
                                          <div className="flex gap-2 items-center">
                                            <span className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062] whitespace-nowrap">
                                              {item.label}
                                            </span>
                                          </div>
                                          <div className="w-full mx-4 mt-[3px] h-[0.60px] relative custom-dash-border border-neutral-300"></div>
                                          <span className="font-outfit font-normal text-xs leading-tight tracking-tight text-[#606062]">
                                            {item.value}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-4">




                              <div className="border border-[#E7E7E9] bg-[#FFFFFF] p-3 shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-[14px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-col w-full ">
                                      <div className="flex items-center mb-4 justify-between pb-[16px] pt-[8px] border-b border-[#F0F0F5]">
                                        <section className="flex items-center">
                                          <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                            <div className="bg-[#E3F1FA] p-1 rounded-full">
                                              {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                              <img
                                                src="/location.svg"
                                                alt=""
                                                className="w-[18px] h-[18px]"
                                              />
                                            </div>
                                          </div>
                                          <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">
                                            Activity (
                                            {filterData?.length})
                                          </span>
                                        </section>

                                      </div>

                                      <ActivityLogComp filterData={filterData} usersList={usersList} />

                                    </div>
                                  </div>
                              </div>

                                {/* Projects Card */}
                                {/* <div className="border border-[#F0F0F5] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] bg-[#FFFFFF] p-4 rounded-[8px] ">
                                  {!isProjectsExpanded && (
                                    <div>
                                      <div className="flex items-center mb-4">
                                        <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                          <div className="bg-[#E3F1FA] p-1 rounded-full">

                                            <img
                                              src="/quill_clock.svg"
                                              alt=""
                                              className="w-[18px] h-[18px]"
                                            />
                                          </div>
                                        </div>
                                        <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">
                                          PROJECTS (3)
                                        </span>
                                        <div className="ml-auto">
                                          <button className="sale_bg_color p-1 rounded-lg text-white">
                                            <Plus size={20} />
                                          </button>
                                        </div>
                                      </div>

                                      <div className="mb-2">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <span className="font-medium text-[12px] leading-[100%] tracking-normal text-[#404040]">
                                              {projectData.projects[0].name}
                                            </span>
                                            <span className="font-normal text-[12px] leading-[100%] tracking-normal text-[#666666] ml-2">
                                              {projectData.projects[0].date}
                                            </span>
                                          </div>
                                          <div className="flex items-center ml-auto">
                                            <button className="font-outfit sale_text_color font-normal text-[12px] leading-[100%] tracking-[0em] underline decoration-solid decoration-[0px] underline-offset-[0%]">
                                              View units
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <button
                                        onClick={toggleProjectsExpand}
                                        className="flex items-center font-medium text-[12px] leading-[100%] tracking-[0em] text-[#606062] mt-2"
                                      >
                                        +7 more{' '}
                                        <ChevronDown
                                          size={16}
                                          className="ml-1"
                                        />
                                      </button>
                                    </div>
                                  )}

                                  {isProjectsExpanded && (
                                    <div>
                                      <div className="flex items-center mb-4">
                                        <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                          <div className="bg-[#E3F1FA] p-1 rounded-full">

                                            <img
                                              src="/quill_clock.svg"
                                              alt=""
                                              className="w-[18px] h-[18px]"
                                            />
                                          </div>
                                        </div>
                                        <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">
                                          PROJECTS (3)
                                        </span>
                                        <div className="ml-auto">
                                          <button className="crm_bg_color p-2 rounded-lg text-white">
                                            <PlusCircle size={20} />
                                          </button>
                                        </div>
                                      </div>

                                      {projectData.projects.map(
                                        (project, index) => (
                                          <div key={index} className="mb-4">
                                            <div className="flex justify-between items-center">
                                              <div>
                                                <div className="text-gray-800 font-medium">
                                                  {project.name}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                  {project.date}
                                                </div>
                                              </div>
                                              <ChevronRight
                                                size={20}
                                                className="text-gray-400"
                                              />
                                            </div>
                                          </div>
                                        )
                                      )}

                                      <button
                                        onClick={toggleProjectsExpand}
                                        className="flex items-center text-purple-600 mt-2 font-medium"
                                      >
                                        Less{' '}
                                        <ChevronUp size={16} className="ml-1" />
                                      </button>
                                    </div>
                                  )}
                                </div> */}

                                {/* More Details Card */}
                                {/* <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="bg-purple-100 p-2 rounded-full mr-3">
          <Clock className="text-purple-500 w-5 h-5" />
        </div>
        <h2 className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">MORE DETAILS</h2>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>

    <div className="flex justify-between">
      <div>
        <p className="font-outfit font-normal text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F] mb-4">updated on : 27 Mar 2025</p>
        <p className="font-outfit font-normal text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F]">Assigned on : 27 Mar 2025</p>
      </div>
      <div>
        <p className="font-outfit font-normal text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F] text-right">Created on: 27 Mar 2025</p>
      </div>
    </div>
  </div> */}

                                {/* Call Activity Card */}
                                <div className="border border-[#F0F0F5] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] bg-[#FFFFFF] cursor-pointer p-4 rounded-[8px] ">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                      <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <div className="bg-[#E3F1FA] p-1 rounded-full">
                                          {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                          <img
                                            src="/call.svg"
                                            alt=""
                                            className="w-[18px] h-[18px]"
                                          />
                                        </div>
                                      </div>
                                      <h2 className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">
                                        Call Activity
                                      </h2>
                                    </div>
                                    <img
                                      src="/arrowright.svg"
                                      alt="Arrow Icon"
                                      className="w-5 h-5"
                                    />
                                  </div>

                                  <div className="space-y-4 px-4">
                                    {[
                                      {
                                        label: 'Total Talk time',
                                        value: '102 hrs, 32 mins',
                                      },
                                      {
                                        label: 'No of time Contacted',
                                        value: '30 times',
                                      },
                                      {
                                        label: 'RNR',
                                        value: '20 times',
                                      },
                                    ].map((item, index, array) => (
                                      <div
                                        key={item.label}
                                        className={`flex justify-between items-center ${
                                          index !== array.length - 1
                                            ? 'pb-3'
                                            : ''
                                        }`}
                                      >
                                        <div className="flex gap-2 items-center">
                                          <span className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062] whitespace-nowrap">
                                            {item.label}
                                          </span>
                                        </div>
                                        <div className="w-full mx-4 mt-[3px] h-[0.60px] relative custom-dash-border border-neutral-300"></div>
                                        <span className="font-outfit font-normal text-xs leading-tight tracking-tight text-[#606062] whitespace-nowrap">
                                          {item.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="border border-[#F0F0F5] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] bg-[#FFFFFF] cursor-pointer p-4 rounded-[8px] ">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                      <div className="bg-[#f2f7fb] p-1 rounded-full mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <div className="bg-[#E3F1FA] p-1 rounded-full">
                                          {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                          <img
                                            src="/quill_clock.svg"
                                            alt=""
                                            className="w-[18px] h-[18px]"
                                          />
                                        </div>
                                      </div>
                                      <h2 className="font-semibold text-[12px] leading-[100%] tracking-[6%] uppercase text-[#2B2B2B]">
                                        Dates
                                      </h2>
                                    </div>
                                    <img
                                      src="/arrowright.svg"
                                      alt="Arrow Icon"
                                      className="w-5 h-5"
                                    />
                                  </div>

                                  <div className="space-y-4 px-4">
                                    <div className="flex justify-between items-center pb-3  border-gray-200">
                                      <div className="flex items-center">
                                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062] whitespace-nowrap">
                                          Created On
                                        </p>
                                      </div>
                                      <div className="w-full mx-4 mt-[3px] h-[0.60px] relative custom-dash-border border-neutral-300"></div>
                                      <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162] whitespace-nowrap">
                                        {CT != undefined
                                          ? prettyDateTime(CT)
                                          : prettyDateTime(Date)}
                                      </p>
                                    </div>

                                    <div className="flex justify-between items-center pb-3  border-gray-200">
                                      <div className="flex items-center">
                                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062] whitespace-nowrap">
                                          Updated On :
                                        </p>
                                      </div>
                                      <div className="w-full mx-4 mt-[3px] h-[0.60px] relative custom-dash-border border-neutral-300"></div>
                                      <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162] whitespace-nowrap">
                                        {stsUpT === undefined
                                          ? 'NA'
                                          : prettyDateTime(stsUpT) || 'NA'}
                                      </p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062] whitespace-nowrap">
                                          Assigned On
                                        </p>
                                      </div>
                                      <div className="w-full mx-4 mt-[3px] h-[0.60px] relative custom-dash-border border-neutral-300"></div>
                                      <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162] whitespace-nowrap">
                                        {assignT != undefined
                                          ? prettyDateTime(assignT)
                                          : prettyDateTime(Date)}
                                      </p>
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
                )}
                {selFeature === 'appointments' && (
                  <>
                    <Formik initialValues={initialState1}>
                      {(formik2) => (
                        <div className=" h-screen bg-white rounded-xl mt-2 ">
                          {(showNotInterested ||
                            showVisitFeedBackStatus ||
                            showJunk) &&
                            selSchGrpO?.ct === undefined && (
                              <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-[#FFFFFF] mx-2">
                                {showNotInterested && (
                                  <div className="w-full flex flex-col mb-3 mt-2">
                                    <CustomSelect
                                      name="source"
                                      label={`Why  ${
                                        customerDetails?.Name?.toLocaleUpperCase() ||
                                        'Customer'
                                      } is  not Interested *`}
                                      className="input mt-3"
                                      onChange={(value) => {
                                        setNotInterestType(value.value)
                                      }}
                                      value={notInterestType}
                                      options={notInterestOptions}
                                    />
                                  </div>
                                )}
                                {showJunk && (
                                  <div className="w-full flex flex-col mb-3 mt-2">
                                    <CustomSelect
                                      name="source"
                                      label={`Why customer details are Junk ?`}
                                      className="input mt-3"
                                      onChange={(value) => {
                                        setJunkReason(value.value)
                                      }}
                                      value={junkReason}
                                      options={junktOptions}
                                    />
                                  </div>
                                )}

                                {showVisitFeedBackStatus && (
                                  <div className="w-full flex flex-col mb-3 mt-2">
                                    <CustomSelect
                                      name="source"
                                      label="Sitess Visit Feedback*"
                                      className="input mt-3"
                                      onChange={(value) => {
                                        setNotInterestType(value.value)
                                      }}
                                      value={notInterestType}
                                      options={siteVisitFeedbackOptions}
                                    />
                                  </div>
                                )}

                                {!showJunk && (
                                  <div className="  outline-none border  rounded p-4 mt-4">
                                    <textarea
                                      value={takNotes}
                                      onChange={(e) =>
                                        setNotesTitle(e.target.value)
                                      }
                                      placeholder="Type & make a notes"
                                      className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF] "
                                    ></textarea>
                                  </div>
                                )}
                                <div className="flex flex-row mt-1">
                                  <button
                                    onClick={() => notInterestedFun()}
                                    className={`flex mt-2 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white  `}
                                  >
                                    <span className="ml-1 ">Save</span>
                                  </button>
                                  <button
                                    onClick={() => notInterestedFun()}
                                    className={`flex mt-2 ml-4 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                  >
                                    <span className="ml-1 ">
                                      Save & Whats App
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => cancelResetStatusFun()}
                                    className={`flex mt-2 ml-4  rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white  `}
                                  >
                                    <span className="ml-1 ">Cancel</span>
                                  </button>
                                </div>
                              </div>
                            )}

                          <div className="font-md font-medium text-xs  ml-2 text-gray-800 flex flex-row justify-between mr-4 py-2">
                            <section className="flex flex-row py-1"></section>
                            <div className="flex flex-row ">
                              <div className="flex flex-row bg-white rounded-xl border ">
                                <div
                                  className={` py-1 pr-4 pl-4 min-w-[62px] ${
                                    selFilterVal === 'all' ? 'bg-[#E8E8E8]' : ''
                                  } rounded-xl rounded-r-none`}
                                  onClick={() => setSelFilterVal('all')}
                                >
                                  <span className="mr-1 text-[10px] ">All</span>

                                  {
                                    leadSchFetchedData.filter(
                                      (d) => d?.schTime != undefined
                                    ).length
                                  }
                                </div>
                                <div
                                  className={` py-1 pr-4 pl-4 min-w-[62px] border-x ${
                                    selFilterVal === 'pending'
                                      ? 'bg-[#E8E8E8] text-[0E0A1F]'
                                      : ''
                                  } `}
                                  onClick={() => setSelFilterVal('pending')}
                                >
                                  {/* <CheckCircleIcon className="w-4 h-3  inline " /> */}
                                  <span className="mr-1 text-[10px] ">
                                    Pending
                                  </span>
                                  <span
                                    className=" text-[11
                              px] "
                                  >
                                    {' '}
                                    {
                                      leadSchFetchedData?.filter(
                                        (d) => d?.sts === 'pending'
                                      ).length
                                    }
                                  </span>
                                </div>
                                <div
                                  className={` py-1 pr-4 pl-4 min-w-[62px] ${
                                    selFilterVal === 'completed'
                                      ? 'bg-[#E8E8E8]'
                                      : ''
                                  }  rounded-xl rounded-l-none`}
                                  onClick={() => setSelFilterVal('completed')}
                                >
                                  {/* <CheckCircleIcon className="w-4 h-3 inline text-[#058527]" /> */}
                                  <span className="mr-1 text-[10px] ">
                                    Completed
                                  </span>

                                  {
                                    leadSchFetchedData?.filter(
                                      (d) => d?.sts === 'completed'
                                    ).length
                                  }
                                </div>
                              </div>
                            </div>
                          </div>

                          {addSch && (
                            <div className="relative rounded-[14px] border border-[#E7E7E9] bg-[#ffffff] py-2 ">
                              <div>
                                {loader && (
                                  <div
                                    id="toast-success"
                                    // className="flex items-center w-[96.4%] mx-4 rounded-t-lg p-2 text-white"
                                    className="flex items-center w-full  rounded-t-lg p-2 px-8 pb-3 text-white border-b "
                                    role="alert"
                                  >
                                    {/* <div className="flex items-center mb-4"></div> */}

                                    <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                      <img
                                        src="/target-sale.svg"
                                        alt="Clock Icon"
                                        className="w-[18px] h-[18px]"
                                      />
                                    </div>
                                    <div className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#000000] tight-wider">
                                      Hey, Plan your{' '}
                                      <span className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#000000] tight-wider ">
                                        {tempLeadStatus.toLocaleUpperCase()}{' '}
                                      </span>
                                      ..!
                                    </div>
                                    {/* <button
                                type="button"
                                className="ml-auto -mx-0.5 -my-0.5  text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 "
                                data-dismiss-target="#toast-success"
                                aria-label="Close"
                              >
                                <span className="sr-only">Close</span>
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </button> */}
                                  </div>
                                )}
                                {addSch && (
                                  <div className="flex flex-col pt-0  mx-4 mt-[0px] ">
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={initialState}
                                      validationSchema={validateSchema}
                                      onSubmit={(values, { resetForm }) => {
                                        fAddSchedule()
                                      }}
                                    >
                                      {(formik) => (
                                        <Form>
                                          <div className=" form pt-[30px] pb-[30px] gap-[20px] ">
                                            <section className=" flex flex-col gap-6 px-4">
                                              <div>
                                                <div className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#616162]">
                                                  Task Title
                                                  <ErrorMessage
                                                    component="div"
                                                    name="taskTitle"
                                                    className="error-message text-red-700 text-xs p-1"
                                                  />
                                                </div>
                                                <input
                                                  autoFocus
                                                  name="taskTitle"
                                                  type="text"
                                                  value={takTitle}
                                                  onChange={(e) => {
                                                    formik.setFieldValue(
                                                      'taskTitle',
                                                      e.target.value
                                                    )
                                                    setTitleFun(e)
                                                  }}
                                                  placeholder="Enter a short title"
                                                  className="w-full h-full pt-3 pb-[2px] outline-none text-sm   border-b border-[#E7E7E9] text-[33475b]"
                                                ></input>
                                              </div>

                                              {/* <div className="flex flex-row mt-3">
                                          <section>
                                            <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#616162]">
                                              <span className="">
                                                {tempLeadStatus
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  tempLeadStatus.slice(1)}{' '}
                                              </span>
                                              Due Date
                                            </span>
                                            <div className="bg-green   pl-   flex flex-row ">
                                              <span className="inline">
                                                <CustomDatePicker
                                                  className=" py-3 px-2 inline text-xs text-[#2B2B2B] border-b border-[#E7E7E9]"
                                                  selected={startDate}
                                                  onChange={(date) =>
                                                    setStartDate(date)
                                                  }
                                                  showTimeSelect
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
                                                  dateFormat="MMM d, yyyy h:mm aa"
                                                />
                                              </span>
                                            </div>
                                          </section>

                                        </div> */}

                                              <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                  {/* <label className="block text-gray-600 mb-2">Edit Due Date</label> */}
                                                  <span className="font-[Outfit] block font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#616162] mb-2">
                                                    <span className="">
                                                      {tempLeadStatus
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        tempLeadStatus.slice(
                                                          1
                                                        )}{' '}
                                                    </span>
                                                    Due Date
                                                  </span>
                                                  <div className="w-full  border-b border-[#E7E7E9] bg-transparent focus:outline-none focus:border-blue-500">
                                                    <div className="bg-green    flex flex-row ">
                                                      <span className="inline">
                                                        <CustomDatePicker
                                                          className="inline text-xs text-[#2B2B2B]"
                                                          selected={startDate}
                                                          onChange={(date) =>
                                                            setStartDate(date)
                                                          }
                                                          showTimeSelect
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
                                                          dateFormat="MMM d, yyyy h:mm aa"
                                                        />
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>

                                                {tempLeadStatus ===
                                                  'visitfixed' && (
                                                  <div className="">
                                                    <label className="block font-[Outfit] block font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#616162] mb-2">
                                                      Assign lead to Site Incharge
                                                    </label>
                                                    <div className="relative">
                                                      <div className="w-full  border-b border-[#E7E7E9] bg-transparent flex justify-between items-center cursor-pointer">
                                                        <AssigedToDropComp
                                                          assignerName={
                                                            assignerName
                                                          }
                                                          id={id}
                                                          setAssigner={
                                                            setAssigner
                                                          }
                                                          usersList={usersList}
                                                          className="absolute top-[100%]  z-[999]"
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </section>
                                            <div className="flex flex-row mt-4 justify-between pr-4">
                                              <section>
                                                <span>{''}</span>
                                              </section>
                                              <section className="flex">
                                                <button
                                                  type="submit"
                                                  className={`flex mt-2 cursor-pointer rounded-lg items-center justify-center pl-2 h-[36px] pr-4 py-2 px-6 text-sm font-medium sale_bg_color  s_btn_txt_color`}
                                                >
                                                  <span className="ml-1 ">
                                                    Create{' '}
                                                    {tempLeadStatus !=
                                                      streamCurrentStatus &&
                                                      tempLeadStatus}{' '}
                                                    Task
                                                  </span>
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    cancelResetStatusFun()
                                                  }
                                                  className={`flex mt-2 ml-4 rounded-lg items-center text-bodyLato pl-2 h-[36px] pr-4 py-2 text-sm font-medium border `}
                                                >
                                                  <span className="ml-1 ">
                                                    Cancel
                                                  </span>
                                                </button>
                                              </section>
                                            </div>
                                          </div>
                                        </Form>
                                      )}
                                    </Formik>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {leadSchLoading &&
                            [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}

                          {!leadSchLoading &&
                            leadSchFetchedData.length == 0 &&
                            !addSch && (
                              <div className="py-8 px-8 flex flex-col items-center">
                                <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                                  <img
                                    className="w-[200px] h-[200px] inline"
                                    alt=""
                                    src="/target.svg"
                                  />
                                </div>
                                <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                                  No Appointmentss
                                </h3>
                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                                  Appointments always bring more suprises{' '}
                                  <span
                                    className="text-blue-600"
                                    onClick={() => setAddSch(true)}
                                  >
                                    Add new
                                  </span>
                                </time>
                              </div>
                            )}
                          <div className="py-2">
                            <ol className="  rounded-[8px] border-[1px]  border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] ">
                              {leadSchFilteredData.map((data, i) => (
                                <section
                                  key={i}
                                  className="py-1 border-b  last:border-none"
                                  onMouseEnter={() => {
                                    hoverEffectTaskFun(data?.ct)
                                  }}
                                  onMouseLeave={() => {
                                    hoverEffectTaskFun(2000)
                                  }}
                                >
                                  <div className="py-1 px-5">
                                    <div className="pb-3">
                                      {editTaskObj?.ct === data?.ct ? (
                                        <EditLeadTask
                                          editTaskObj={editTaskObj}
                                          setStartDate={setStartDate}
                                          startDate={startDate}
                                          takTitle={takTitle}
                                          setTitleFun={setTitleFun}
                                          cancelResetStatusFun={
                                            cancelResetStatusFun
                                          }
                                          editTaskFun={editTaskFun}
                                          d={d}
                                        />
                                      ) : null}
                                    </div>

                                    <>
                                      {' '}
                                      <LeadTaskDisplayHead
                                        data={data}
                                        setAddTaskCommentObj={
                                          setAddTaskCommentObj
                                        }
                                        closeTaskFun={closeTaskFun}
                                        hoverTasId={hoverTasId}
                                        undoFun={undoFun}
                                        setShowVisitFeedBackStatusFun={
                                          setShowVisitFeedBackStatusFun
                                        }
                                        EditTaskOpenWindowFun={
                                          EditTaskOpenWindowFun
                                        }
                                      />
                                      {addTaskCommentObj?.ct === data?.ct && (
                                       <div className="">
                                       <AddLeadTaskComment
                                          closeTask={closeTask}
                                          data={data}
                                          setShowVisitFeedBackStatusFun={
                                            setShowVisitFeedBackStatusFun
                                          }
                                          setShowNotInterestedFun={
                                            setShowNotInterestedFun
                                          }
                                          setAddCommentTitle={
                                            setAddCommentTitle
                                          }
                                          addCommentTitle={addCommentTitle}
                                          addCommentTime={addCommentTime}
                                          setPostPoneToFuture={
                                            setPostPoneToFuture
                                          }
                                          setClosePrevious={setClosePrevious}
                                          setAddCommentPlusTask={
                                            setAddCommentPlusTask
                                          }
                                          setAddCommentTime={setAddCommentTime}
                                          cancelResetStatusFun={
                                            cancelResetStatusFun
                                          }
                                          addTaskCommentFun={addTaskCommentFun}
                                          addCommentPlusTask={
                                            addCommentPlusTask
                                          }
                                          setSelType={setSelType}
                                          selType={selType}
                                          d={d}
                                        />
                                        </div>
                                      )}
                                      {/* <div className='ml-7 border-b border-[#E7E7E9] py-2 min-h-[1px]'>
                                        {addTaskCommentObj?.ct != data?.ct && (
                                          <LeadTaskFooter
                                            data={data}
                                            hoverTasId={hoverTasId}
                                            EditTaskOpenWindowFun={
                                              EditTaskOpenWindowFun
                                            }
                                            delFun={delFun}
                                          />
                                        )}
                                      </div> */}
                                      <div
                                        className={`ml-7 pb-[8px] min-h-[1px]`}
                                      >
                                        {addTaskCommentObj?.ct != data?.ct && (
                                          <LeadTaskFooter
                                            data={data}
                                            hoverTasId={hoverTasId}
                                            EditTaskOpenWindowFun={
                                              EditTaskOpenWindowFun
                                            }
                                            delFun={delFun}
                                          />
                                        )}
                                      </div>
                                      {/*
{data?.comments?.length > 0 && (
  <p className="font-outfit font-medium text-[12px] leading-[100%] tracking-[0%] text-[#606062] mt-4 mb-2 ml-6 mb-2">
    {data.comments.length} Comment{data.comments.length > 1 ? 's' : ''}
  </p>
)} */}
                                      {/* {data?.comments?.length > 0 && (
  <div className="flex items-center mt-4 mb-2 ml-6">
    <div className="w-4 h-px bg-[#E7E7E9] mr-2" />
    <p className="font-outfit font-medium text-[12px] leading-[100%] tracking-[0%] text-[#606062]">
      {data.comments.length} Comment{data.comments.length > 1 ? 's' : ''}
    </p>
  </div>
)} */}
                                      {data?.comments?.length > 0 && (
                                        <div
                                          className={`flex items-center mt-[2px] mb-1 ${
                                            data?.stsType === 'visitfixed' &&
                                            data?.sts !== 'completed'
                                              ? 'ml-[15px]'
                                              : 'ml-[15px]'
                                          }`}
                                        >
                                          <p className="font-outfit font-medium text-[12px] leading-[100%] tracking-[0%] text-[#606062] ml-[16px]">
                                            {data.comments.length} Comment
                                            {data.comments.length > 1
                                              ? 's'
                                              : ''}
                                          </p>
                                        </div>
                                      )}
                                      {data?.comments?.map((commentObj, k) => {
                                        return (
                                          <li
                                            // key={k}
                                            // className={`ml-6 pl-6  py-3 text-[14px] text-[#7E92A2] tracking-wide ${data?.comments?.length - 1 === k
                                            //   ? 'mb-1'
                                            //   : ''
                                            //   }`}

                                            className={` ml-[29px] ${
                                              data?.stsType === 'visitfixed' &&
                                              data?.sts !== 'completed'
                                                ? 'pl-0'
                                                : 'pl-0'
                                            } py-[4px] text-[14px] text-[#7E92A2] tracking-wide ${
                                              data?.comments?.length - 1 === k
                                                ? 'mb-1'
                                                : ''
                                            }`}
                                          >
                                            <section className="flex flex-row justify-between items-center w-full">
                                              <div className="flex items-center space-x-2">
                                                {/* <span>
                                              {' '}

                                              {' '} */}

                                                <img
                                                  src="/material-symbols-light_add-task-rounded.svg"
                                                  alt="Clock Icon"
                                                  className="w-[14px] h-[14px]"
                                                />

                                                <span className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#7E92A2]">
                                                  {commentObj?.c}
                                                </span>
                                                {/* </span> */}
                                              </div>
                                              <p className="text-[12px] font-normal leading-[14px] tracking-normal text-[#606062]">
                                                {' '}
                                                {prettyDateTime(commentObj?.t)}
                                              </p>
                                            </section>
                                          </li>
                                        )
                                      })}
                                      {(showNotInterested ||
                                        showVisitFeedBackStatus) &&
                                        selSchGrpO?.ct === data?.ct && (
                                          <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-white mx-2">
                                            {showNotInterested && (
                                              <div className="w-full flex flex-col mb-3 mt-2">
                                                <SelectDropDownComp
                                                  label={`Why  ${
                                                    customerDetails?.Name?.toLocaleUpperCase() ||
                                                    'Customer'
                                                  } is  not Interested*`}
                                                  options={notInterestOptions}
                                                  value={fbTitle}
                                                  onChange={(value) => {
                                                    setFbTitle(value.value)
                                                  }}
                                                />
                                              </div>
                                            )}

                                            {/* {showVisitFeedBackStatus && (
                                              <div className="w-full flex flex-col mb-3 mt-2">
                                                <SelectDropDownComp
                                                  label="Sites Visit Feedback *"
                                                  options={
                                                    siteVisitFeedbackOptions
                                                  }
                                                  value={fbTitle}
                                                  onChange={(value) => {
                                                    setFbTitle(value.value)
                                                  }}
                                                />
                                              </div>
                                            )} */}

                                            {showVisitFeedBackStatus && (
                                              <div className="w-full flex  flex-col mb-3 mt-2">
                                                <label className="mb-4 font-outfit font-normal text-xs leading-[100%] tracking-[0%] text-[#606062]">
                                                  Sites Visit Feedback *
                                                </label>

                                                <div className=" py-4">
                                <div className="grid grid-cols-2 gap-6">




   {/* Left Reason Section */}
   <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Budget
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.bstr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.bstr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {lookingAtBudgetRange.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.budget === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            budget: data.value,
                                            bstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>

                                  {/* Right Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Configuration
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.confstr ||0}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.confstr ||0}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-3 gap-4">
                                      {bedRoomConfigurtionRange.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.config === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            config: data.value,
                                            confstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>
                                  {/* Left Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Preferred Area
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.astr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.astr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {preferredArea.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.area === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            area: data.value,
                                            astr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>

                                  {/* Right Reason Section */}
                                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <section className='flex flex-row justify-between'>
                                    <div className="flex items-center gap-3 mb-5">
                                      <div className="bg-[#FFFFFF] p-1.5 rounded-lg  shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                                        <img
                                          src="/target-sale.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>

                                      <h2 className=" font-normal text-[16px] leading-[100%] tracking-[0%] text-[#000000]">
                                        Reason For Purchase
                                      </h2>
                                    </div>
                                    <div className="flex items-center mb-4">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.pstr}
                                          height={8}
                                          fillColor="#94B5ED"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.pstr}%`}</span>
                                    </div>
                                    </section>
                                    <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      {reasonPurchase.map((data, i) => (
                                         <button
                                         className={`py-3 px-6 font-normal text-[12px] leading-[100%] tracking-[0%] text-[#0E0A1F] rounded-md border text-center transition-colors ${
                                          optionvalues.purchase === data.value
                                             ? 'bg-[#FCE6D9]  leading-[100%] tracking-[0] sale_text_color '
                                             : 'bg-white hover:bg-gray-50'
                                         }`}
                                         onClick={() =>

                                           setoptionvalues({
                                            ...optionvalues,
                                            purchase: data.value,
                                            pstr: data.str,
                                          })
                                         }
                                       >
                                         {data.label}
                                       </button>
                                      ))}
                                  </div>

                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div></div>


                                                <div className="flex space-x-4">
                                                  {siteVisitFeedbackOptions.map(
                                                    (option) => (
                                                      <button
                                                        key={option.value}
                                                        className={`py-2 px-8 text-[12px] flex border border-[#E7E7E9] rounded-lg items-center space-x-1 rounded-md ${
                                                          fbTitle ===
                                                          option.value
                                                            ? 'sale_bg_color text-white'
                                                            : 'bg-white text-gray-700'
                                                        }`}
                                                        onClick={() =>
                                                          setFbTitle(
                                                            option.value
                                                          )
                                                        }
                                                      >
                                                        <img
                                                          src={`/${option.value}.svg`}
                                                          alt={option.label}
                                                          className="w-5 h-5"
                                                        />
                                                        <span>
                                                          {option.label}
                                                        </span>
                                                      </button>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}

                                            <div className=" w-full max-w-[882px]  h-auto p-3 md:p-2 gap-2.5   outline-none border border-[#E7E7E9] rounded-[8px] p-2 mt-2">
                                              <textarea
                                                value={fbNotes}
                                                onChange={(e) =>
                                                  setfbNotes(e.target.value)
                                                }
                                                placeholder="Type & make a notes *"
                                                className="w-full min-h-[161px]  text-[12px] outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF]"
                                              ></textarea>
                                            </div>
                                            <div className="flex flex-wrap items-end item justify-end gap-4 mt-5">
                                              <button
                                                onClick={() => {
                                                  if (fbNotes != '') {
                                                    setLeadStatus('visitdone')
                                                    if (showNotInterested) {
                                                      notInterestedFun()
                                                      return
                                                    }
                                                    addFeedbackFun(data)
                                                  } else {
                                                    toast.error(
                                                      'Please Enter Notes'
                                                    )
                                                  }
                                                }}
                                                // className={`flex mt-2 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                                className="flex items-center px-4 h-9 text-sm font-medium text-white sale_bg_color rounded-md"
                                              >
                                                Save
                                              </button>
                                              <button
                                                onClick={() => {
                                                  console.log('am i clicked')

                                                  setLeadStatus('visitdone')
                                                  if (showNotInterested) {
                                                    notInterestedFun()
                                                    return
                                                  }
                                                  addFeedbackFun(data)

                                                  getWhatsAppTemplates(
                                                    'on_sitevisit_done',
                                                    'wa',
                                                    'customer',
                                                    ProjectId,
                                                    receiverDetails,
                                                    msgPayload
                                                  )
                                                }}
                                                // className={`flex mt-2 ml-4 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                                className="flex items-center px-4 h-9 text-sm font-medium text-white sale_bg_color s_btn_txt_color rounded-md"
                                              >
                                                Save & Whats App
                                              </button>
                                              <button
                                                onClick={() =>
                                                  cancelResetStatusFun()
                                                }
                                                // className={`flex mt-2 ml-4  rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white  `}
                                                className="flex items-center px-4 h-9 text-sm font-medium text-black s_btn_txt_color border rounded-md"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      {/*
{(showNotInterested || showVisitFeedBackStatus) && selSchGrpO?.ct === data?.ct && (
  <div className="flex flex-col p-6 my-10 mx-2 rounded-md border shadow-sm bg-white">
    <div className="text-lg font-semibold mb-2">Get into Introduction Call with customer</div>
    <div className="text-sm text-gray-500 mb-4 flex gap-4">
      <span>📅 20 Mar 2025, 12:22</span>
      <span>🗓️ 20 Mar 2025, 12:22</span>
      <span>Assigned to: vishal@gmail.com</span>
    </div>

    <div className="flex flex-wrap gap-4 mb-4">
      {['Happy', 'Sad', 'Neutral', 'Others', 'Want More option'].map((label, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          <span className="text-red-500">⭐</span>
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>




    <textarea
      value={fbNotes || ''}
      onChange={(e) => setfbNotes(e.target.value)}
      placeholder="Type and make a note*"
      className="w-full h-28 p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>

    <div className="flex gap-4">
      <button
        onClick={() => {
          if (fbNotes) {
            setLeadStatus('visitdone');
            if (showNotInterested) {
              notInterestedFun();
              return;
            }
            addFeedbackFun(data || { id: 'dummy_id' }); // fallback dummy data
          } else {
            toast.error('Please Enter Notes');
          }
        }}
        className="bg-[#ff5b3f] hover:bg-[#e64a2f] text-white px-6 py-2 rounded"
      >
        Save
      </button>

      <button
        onClick={() => {
          setLeadStatus('visitdone');
          if (showNotInterested) {
            notInterestedFun();
            return;
          }
          addFeedbackFun(data || { id: 'dummy_id' });
          getWhatsAppTemplates(
            'on_sitevisit_done',
            'wa',
            'customer',
            ProjectId,
            receiverDetails,
            msgPayload
          );
        }}
        className="bg-[#ff5b3f] hover:bg-[#e64a2f] text-white px-6 py-2 rounded"
      >
        Save and Whats App
      </button>

      <button
        onClick={cancelResetStatusFun}
        className="border px-6 py-2 rounded hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  </div>
)}
  */}
                                      {/*

{(showNotInterested || showVisitFeedBackStatus) && selSchGrpO?.ct === data?.ct && (
  <div className="flex flex-col p-6 my-10 mx-2 rounded-md border shadow-sm bg-white">
    <div className="text-lg font-semibold mb-2">Get into Introduction Call with customer</div>
    <div className="text-sm text-gray-500 mb-4 flex gap-4">
      <span>📅 20 Mar 2025, 12:22</span>
      <span>🗓️ 20 Mar 2025, 12:22</span>
      <span>Assigned to: vishal@gmail.com</span>
    </div>

    <div className="flex flex-wrap gap-4 mb-4">
      {['Happy', 'Sad', 'Neutral', 'Others', 'Want More option'].map((label, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:sale_bg_color"
        >
          <img
            src={labelImages[label]} // Dynamically set the image path based on the label
            alt={label}
            className="w-5 h-5" // Adjust size as needed
          />
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>

    <textarea
      value={fbNotes || ''}
      onChange={(e) => setfbNotes(e.target.value)}
      placeholder="Type and make a note*"
      className="w-full h-28 p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>

    <div className="flex gap-4">
      <button
        onClick={() => {
          if (fbNotes) {
            setLeadStatus('visitdone');
            if (showNotInterested) {
              notInterestedFun();
              return;
            }
            addFeedbackFun(data || { id: 'dummy_id' }); // fallback dummy data
          } else {
            toast.error('Please Enter Notes');
          }
        }}
        className="bg-[#ff5b3f] hover:bg-[#e64a2f] text-white px-6 py-2 rounded"
      >
        Save
      </button>

      <button
        onClick={() => {
          setLeadStatus('visitdone');
          if (showNotInterested) {
            notInterestedFun();
            return;
          }
          addFeedbackFun(data || { id: 'dummy_id' });
          getWhatsAppTemplates(
            'on_sitevisit_done',
            'wa',
            'customer',
            ProjectId,
            receiverDetails,
            msgPayload
          );
        }}
        className="bg-[#ff5b3f] hover:bg-[#e64a2f] text-white px-6 py-2 rounded"
      >
        Save and Whats App
      </button>

      <button
        onClick={cancelResetStatusFun}
        className="border px-6 py-2 rounded hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  </div>
)}  */}
                                      {/* {addTaskCommentObj?.ct != data?.ct && (
                                      <LeadTaskFooter
                                        data={data}
                                        hoverTasId={hoverTasId}
                                        EditTaskOpenWindowFun={
                                          EditTaskOpenWindowFun
                                        }
                                        delFun={delFun}
                                      />
                                    )} */}
                                    </>
                                  </div>
                                </section>

                                // </div>
                              ))}{' '}
                            </ol>
                          </div>
                        </div>
                      )}
                    </Formik>
                  </>
                )}
                {selFeature === 'timeline' && (
                  <div className="py-8">
                    {filterData?.length == 0 && (
                      <div className="py-8 px-8 flex flex-col items-center">
                        <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                          <img
                            className="w-[200px] h-[200px] inline"
                            alt=""
                            src="/templates.svg"
                          />
                        </div>
                        <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                          Timeline is Empty
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                          This scenario is very rare to view
                        </time>
                      </div>
                    )}

                    <div className="text-gray-600 font-medium mr-6 text-[12px] uppercase tracking-wide mb-4 ">
                      Timeline
                    </div>
                    <ActivityLogComp filterData={filterData} usersList={usersList} />

                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={'Edit Lead'}
        leadDetailsObj={leadDetailsObj}
        widthClass="max-w-2xl"
      />
    </>
  )
}
