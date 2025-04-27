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
  Clock,
  IndianRupee,
  MessageSquare,
  Phone,
  Plus,
  PlusCircle,
} from 'lucide-react'
import SemicircleProgressChart from './A_SalesModule/Reports/charts/SemiCircleProgress'
import toast, { ToastBar } from 'react-hot-toast'
import { use } from 'i18next'

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
  { label: 'less than 25 lakhs', value: 'less25L', str: 10 },
  { label: 'less than 50 lakhs', value: 'less50L', str: 20 },
  { label: 'less than 1 Cr', value: 'less1Cr', str: 30 },
  { label: 'less than 1.5 Cr', value: 'less1.5Cr', str: 40 },
  { label: 'less than 2 Cr', value: 'less2Cr', str: 50 },
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

    return unsubscribe
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
        Math.abs(getDifferenceInHours(x?.schTime, '')) <= 24 &&
        Math.abs(getDifferenceInHours(x?.schTime, '')) >= 0
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
        setprojectList(projectsListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
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
  const setNewProject = (leadDocId, value) => {
    const x = {
      Project: value.projectName,
      ProjectId: value.uid,
    }
    setSelProjectIs(value)
    updateLeadProject(orgId, leadDocId, x)
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

    return unsubscribe
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
    return unsubscribe
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

  const activieLogNamer = (dat) => {
    const { type, from, to, by } = dat
    let tex = type

    switch (type) {
      case 'l_ctd':
        return (tex = 'Lead Created')
      case 'sts_change':
        return (tex = `completed & moved to`)
      case 'assign_change':
        return (tex = `Lead Assigned To`)
      default:
        return (tex = type)
    }
    return tex
  }

  const empNameSetter = (emp_id) => {
    const userIsA = usersList?.filter((userD) => {
      return userD?.uid == emp_id
    })
    if (userIsA[0]) {
      const { email } = userIsA[0] || []
      return email
    } else {
      return emp_id
    }
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
      label: 'Visit Fixed',
      value: 'visitfixed',
      logo: 'FireIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Visit Done',
      value: 'visitdone',
      logo: 'DuplicateInactiveIcon',
      color: ' bg-violet-500',
    },
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

  async function handleCallButtonClick(uid, name, number) {
    try {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        console.error('User not found!')
        return
      }

      const { fcmToken } = userSnap.data()
      console.error('Date', userSnap.data())
      if (!fcmToken) {
        toast.error('No Sales App exits for you')
        return
      }

      console.log('FCM Token:', fcmToken)

      await addDoc(collection(db, 'calls'), {
        name,
        number,
        fcmToken,
        // timestamp: Timestamp.now()
      })

      console.log('Call document added successfully!')
    } catch (error) {
      console.error('Error in call trigger:', error)
    }
  }

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
        className={`   h-screen    ${openUserProfile ? 'hidden' : ''} `}
        style={{
          background: 'linear-gradient(to left, #EEF0F9, #E1F2F2, #DBE6F0)',
        }}
      >
        <div className="h-screen overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
          <div className=" pb-[2px] px-3  mt-0 rounded-xs">
            <div className="flex  justify-between">
              <div className="w-full pl-1 pt-[2px]">
                <div className="">
                  <div className="font-semibold text-[#053219] text-sm mt-3 mb-1 tracking-wide">
                    <div className="flex gap-4 flex-row">
                      <div>
                        <span className="w-12 h-12 bg-[#D3D7F8] rounded-full flex items-center justify-center font-semibold text-[#5B5FC7] uppercase text-[21px]">
                          {Name?.[0]}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[16px] uppercase">
                              {Name}
                            </span>
                          </div>
                          <img
                            src="/edit-02.svg"
                            alt="edit"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => setisImportLeadsOpen(true)}
                          />
                          {/* <div className="text-sm ml-1 px-1 rounded text-[#FF8C02]">
                {currentStatusDispFun(leadDetailsObj?.Status)}
              </div> */}
                        </div>

                        <div className="flex mt-2 flex-row">
                          <div className="flex items-center gap-2">
                            <img
                              src="/phone.svg"
                              className="w-4 h-4"
                              alt="Phone Icon"
                            />
                            <span className="font-[Outfit] font-normal text-[14px] leading-[100%] tracking-[0.06em] text-[#0E0A1F]">
                              {Mobile?.replace(
                                /(\d{3})(\d{3})(\d{4})/,
                                '$1-$2-$3'
                              )}
                            </span>
                          </div>

                          <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>

                          <div className="flex items-center gap-2">
                            <img
                              src="/mail.svg"
                              className="w-4 h-4"
                              alt="Mail Icon"
                            />
                            <span className="font-[Outfit] font-normal text-[14px] leading-[100%] tracking-[0.06em] text-[#0E0A1F]">
                              {Email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="ml-2">
                  <div className="flex flex-row p-4 py-2">
                    <section>
                      <div className="flex flex-col justify-center bg-white px-2.5 py-3 rounded-[14px] mx-auto">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center cursor-pointer">
                            <div
                              className="bg-purple-100 p-2 rounded-lg flex items-center justify-center"
                              onClick={() => {
                                console.log(
                                  'Call button clicked for lead:',
                                  Name,
                                  Mobile
                                )
                                handleCallButtonClick(user?.uid, Name, Mobile)
                              }}
                            >
                              <img
                                src="/call.svg"
                                alt="Call Icon"
                                className="w-[18px] h-[18px] min-w-[18px]"
                              />
                            </div>
                          </div>

                          <div>
                            <h2 className="font-semibold text-[14px] leading-[100%] tracking-[6%] mb-1 text-[#696990]">
                              {streamCurrentStatus}
                            </h2>
                            <p className="font-normal whitespace-nowrap text-[12px] leading-[100%]  cursor-pointer text-[#960000] decoration-solid">
                              Starts in 3min
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
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
          <div className="mt-[1px]   ">
            <div className="flex flex-row justify-between pb-3 pt-5 mb-0   relative rounded-lg">
              {StatusListA.map((statusFlowObj, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center relative"
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-200 mb-1 z-10 ${
                      streamCoveredA.includes(statusFlowObj.value)
                        ? 'bg-[#5B5FC7]  text-white '
                        : statusFlowObj.value === streamCurrentStatus ||
                          statusFlowObj.value === tempLeadStatus
                        ? 'bg-white border-black text-black'
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
                      <div className="h-2 w-2 bg-black  rounded-full" />
                    ) : streamCoveredA.includes(statusFlowObj.value) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white "
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
                    className={`font-bodyLato text-[11px] text-black font-normal px-2 py-1 z-10 text-center ${
                      statusFlowObj.value === streamCurrentStatus ||
                      statusFlowObj.value === tempLeadStatus
                        ? 'text-[13px] '
                        : 'text-[11px]'
                    }`}
                  >
                    {statusFlowObj.label}
                  </span>

                  {i < StatusListA.length - 1 && (
                    <div
                      className={`absolute top-3 left-[calc(50%+0.5rem)] h-[1px] w-[calc(100%-1rem)] ${
                        streamCoveredA.includes(StatusListA[i + 1].value)
                          ? 'bg-[#5B5FC7]'
                          : 'bg-gray-300'
                      }`}
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr />

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
              <section className=" pb-8 px-5 py-2  rounded-xs  bg-white">
                <div className="">
                  <div className="">
                    <div className="flex flex-row justify-between border-gray-200 mt-2">
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
                          { lab: 'Email', val: 'email' },
                          { lab: 'Activity Log', val: 'timeline' },
                        ].map((d, i, array) => {
                          return (
                            <div key={i} className="flex items-center">
                              <li className="" role="presentation">
                                <button
                                  className={`inline-block pb-1 text-sm font-medium text-center text-[#606062] rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${
                                    selFeature === d.val
                                      ? 'border-black text-black'
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
                          className=" px-[10px] py-[11px] gap-[8px] font-outfit font-semibold text-[14px] leading-[100%] underline underline-offset-[25%] decoration-[0%] text-[#5B5FC7] cursor-pointer"
                          onClick={() => setFeature('lead_strength')}
                        >
                          Lead requirement
                        </span>
                      )}
                      {selFeature == 'lead_strength' && (
                        <span
                          className="px-[10px] py-[11px] gap-[8px] font-outfit font-semibold text-[14px] leading-[100%] underline underline-offset-[25%] decoration-[0%] text-[#5B5FC7] cursor-pointer"
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
                            <div className="flex flex-col pt-0 my-10 mt-[30px] rounded  mx-4 p-4">
                              <div className="border border-red-100 mt-2 mt-4 bg-white rounded-md p-4 font-bold">
                                <div className="flex justify-between w-full ">
                                  <div>Total Lead Strength</div>
                                  <div>{`${opstr}%`}</div>
                                </div>
                                <Slider
                                  onChange={(e) => setopstr(e.target.value)}
                                  value={opstr}
                                  defaultValue={opstr}
                                  aria-label="Default"
                                  valueLabelDisplay="auto"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-8 pt-3 mx-3  mt-2">
                                <div className="mt-2">
                                  <div className="flex justify-between w-11.7/12 m-auto">
                                    <div>Any Existing Banglore Assets ?*</div>

                                    <div className="flex items-center">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.asstr}
                                          height={8}
                                          fillColor="#7BD2EA"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.asstr}%`}</span>
                                    </div>
                                  </div>
                                  <CustomSelect
                                    name="accountName"
                                    label="Existing Asset"
                                    className="input"
                                    onChange={(value) => {
                                      setoptionvalues({
                                        ...optionvalues,
                                        asset: value.value,
                                        asstr: value.str,
                                      })
                                    }}
                                    value={optionvalues.asset}
                                    options={exitstingAsset}
                                  />
                                </div>
                                <div className="mt-2">
                                  <div className="flex justify-between w-11.7/12 m-auto">
                                    <div>Reason For Purchase ?*</div>

                                    <div className="flex items-center">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.pstr}
                                          height={8}
                                          fillColor="#7BD2EA"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.pstr}%`}</span>
                                    </div>
                                    {/* <div> {`${optionvalues.pstr}%`}</div> */}
                                  </div>
                                  <CustomSelect
                                    name="reasonPurchase"
                                    label="Purchase Reason"
                                    className="input"
                                    onChange={(value) => {
                                      setoptionvalues({
                                        ...optionvalues,
                                        purchase: value.value,
                                        pstr: value.str,
                                      })
                                    }}
                                    value={optionvalues.purchase}
                                    options={reasonPurchase}
                                  />
                                </div>
                                <div className="mt-2">
                                  <div className="flex justify-between w-11.7/12 m-auto">
                                    <div>Preferred Area ?*</div>
                                    <div className="flex items-center">
                                      <div className="w-16 mr-2">
                                        <RoundedProgressBar
                                          progress={optionvalues.astr}
                                          height={8}
                                          fillColor="#7BD2EA"
                                          showLabels={false}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{`${optionvalues.astr}%`}</span>
                                    </div>
                                    {/* <div> {`${optionvalues.astr}%`}</div> */}
                                  </div>
                                  <CustomSelect
                                    name="preferredArea"
                                    className="input"
                                    onChange={(value) => {
                                      setoptionvalues({
                                        ...optionvalues,
                                        area: value.value,
                                        astr: value.str,
                                      })
                                    }}
                                    value={optionvalues.area}
                                    options={preferredArea}
                                  />
                                </div>
                              </div>
                              <div></div>

                              <div className="flex flex-row justify-end mt-6">
                                <section className="flex flex-row">
                                  <button
                                    onClick={() => LeadStrengthFun()}
                                    className={`flex mt-2 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium  bg-[#7bd2ea] text-black hover:bg-gray-700 hover:text-white   `}
                                  >
                                    <span className="ml-1 ">Save</span>
                                  </button>

                                  <button
                                    onClick={() => setFeature('appointments')}
                                    className={`flex mt-2 ml-4  rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  text-black hover:bg-gray-700 hover:text-white  `}
                                  >
                                    <span className="ml-1 ">Cancel</span>
                                  </button>
                                </section>
                              </div>
                            </div>
                          )}
                        </Formik>
                      </>
                    )}
                    {selFeature == 'email' && (
                      <>
                        <EmailForm />
                      </>
                    )}
                    {selFeature === 'notes' && (
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
                              No Helpful Notes {addNote}
                            </h3>
                            <button onClick={() => selFun()}>
                              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                                <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                  </svg>
                                  Add Notes
                                </span>
                              </time>
                            </button>
                            <Confetti />
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
                                <div className=" form flex flex-col pt-0 my-10 mt-[10px] rounded bg-white mx-4 p-4">
                                  <div className="  outline-none border  rounded p-4 mt-4">
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
                                      className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF] "
                                    ></textarea>
                                  </div>
                                  <div className="flex flex-row mt-1">
                                    <button
                                      type="submit"
                                      className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-black  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white  `}
                                    >
                                      <span className="ml-1 ">Save</span>
                                    </button>
                                    <button
                                      onClick={() => cancelResetStatusFun()}
                                      type="submit"
                                      className={`flex mt-2 ml-4 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-black  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                    >
                                      <span className="ml-1 ">
                                        Save & Whats App
                                      </span>
                                    </button>
                                    <button
                                      onClick={() => cancelResetStatusFun()}
                                      className={`flex mt-2 ml-4  rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white `}
                                    >
                                      <span className="ml-1 ">Cancel</span>
                                    </button>
                                  </div>
                                </div>
                              </Form>
                            )}
                          </Formik>
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
                              No Helpful Notes {addNote}
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
                      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div>
      <div className="flex justify-between overflow-visible items-center mb-4">
        <div className="flex items-center gap-2 overflow-visible">
          <div>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.6104 8.91158C20.9426 8.7905 18.0674 8.80569 15.3803 8.88988C15.3731 10.8167 15.4503 12.7437 15.7156 14.682C18.299 14.5884 20.8823 14.5137 23.5212 14.4879C23.5212 15.4544 23.5212 16.4209 23.5404 17.3966C25.6148 15.5448 27.6893 13.6933 29.7926 11.7077C27.8147 9.76957 25.7596 7.9096 23.6345 6.11766C23.6321 7.05403 23.6104 8.00705 23.6104 8.91158Z" fill="#2F2F2F"/>
<path d="M23.5211 14.2812C23.5766 14.2812 23.6296 14.3029 23.6682 14.3413C23.7068 14.3801 23.7285 14.4329 23.7285 14.4882C23.7285 15.2909 23.7285 16.1166 23.7382 16.9413C25.622 15.2617 27.5589 13.5277 29.4958 11.7053C27.7133 9.96647 25.8126 8.23869 23.8395 6.56252C23.8371 6.87923 23.8322 7.19666 23.8298 7.51241C23.8226 7.98566 23.8178 8.45505 23.8178 8.9119C23.8178 8.96834 23.7937 9.02238 23.7526 9.06145C23.7116 9.10053 23.6586 9.11982 23.6007 9.11838C21.2441 9.01176 18.5498 9.00235 15.5853 9.09088C15.5877 11.1433 15.6866 12.8632 15.8965 14.4689C18.8971 14.3613 21.2537 14.3032 23.5211 14.2812ZM23.5404 17.6039C23.5114 17.6039 23.4825 17.5981 23.456 17.5865C23.3836 17.5539 23.3329 17.4816 23.3329 17.4005C23.316 16.4946 23.3161 15.5833 23.3161 14.6973C21.0704 14.7212 18.7162 14.7808 15.7228 14.8893C15.6166 14.8956 15.525 14.8157 15.5105 14.7106C15.2741 12.9804 15.1656 11.1305 15.1728 8.88947C15.1728 8.77803 15.2621 8.68685 15.373 8.68347C18.3351 8.59061 21.0342 8.59495 23.4029 8.69554C23.4053 8.30574 23.4101 7.90799 23.415 7.5071C23.4198 7.04518 23.427 6.57941 23.427 6.11773C23.427 6.03717 23.4728 5.96408 23.5476 5.93031C23.62 5.89654 23.7068 5.90764 23.7671 5.95974C25.9259 7.78015 28.0028 9.66423 29.9397 11.5604C29.9783 11.5997 30 11.6537 30 11.7099C30 11.7661 29.9758 11.8199 29.9348 11.8585C27.8267 13.8485 25.7185 15.7309 23.6779 17.5513C23.6393 17.5858 23.5886 17.6039 23.5404 17.6039Z" fill="#2F2F2F"/>
<path d="M7.70991 5.72557C7.29262 4.33331 6.83914 3.36823 5.40153 2.22731C5.01318 1.91905 3.63347 0.560314 3.63347 0.560314C3.63347 0.560314 4.82985 0.514004 5.37498 0.444536C7.87391 0.126863 10.2571 0.276653 12.7705 0.398222C13.441 0.430544 15.4648 0.206463 15.4648 0.206463C15.4648 0.206463 13.8704 2.22587 13.3904 2.85012C12.7681 3.66299 12.3701 4.13021 12.0879 4.877C11.8129 5.60063 12.0758 6.45258 12.5462 7.05078C13.0165 7.64922 13.6654 8.05059 14.2901 8.4592C17.5223 10.5724 20.5736 13.3603 21.9437 17.1242C23.3137 20.888 22.5153 25.7609 19.3386 27.9653C17.7346 29.078 15.7663 29.3981 13.8559 29.5322C11.5403 29.695 9.21264 29.6241 6.90909 29.3204C4.74544 29.0353 2.39122 28.4007 1.15382 26.4913C0.461549 25.4249 0.222771 24.0917 0.208299 22.7962C0.169705 19.4137 1.56871 16.1364 3.61175 13.5446C5.50766 11.1378 8.59032 8.67026 7.70991 5.72557Z" fill="white"/>
<path d="M7.90762 5.66674C8.64089 8.11743 6.81013 10.1875 5.03965 12.1895C4.58618 12.7009 4.15924 13.184 3.7733 13.6732C1.57347 16.4666 0.379482 19.7059 0.415664 22.7943C0.432548 24.2649 0.73888 25.471 1.32743 26.3791C2.59619 28.3368 5.13613 28.8785 6.93555 29.1159C9.2198 29.4169 11.5451 29.4876 13.8414 29.3265C15.5877 29.2037 17.5922 28.9258 19.2203 27.7957C22.4115 25.5809 23.0122 20.6668 21.7506 17.1956C20.588 14.007 18.1108 11.2061 14.1767 8.63289L14.0488 8.54943C13.4554 8.16326 12.8428 7.76381 12.3845 7.17937C11.8128 6.45453 11.6198 5.52225 11.8948 4.80418C12.1577 4.11166 12.5027 3.66277 13.0285 2.98329L13.2263 2.72471C13.5736 2.27341 14.5119 1.08208 14.9992 0.463614C14.3527 0.528257 13.2383 0.628363 12.7608 0.605207L12.2398 0.579878C9.90967 0.465063 7.70743 0.356998 5.40147 0.650311C5.07101 0.69228 4.51622 0.725567 4.11823 0.745829C4.5524 1.1665 5.27362 1.86142 5.5293 2.06573C6.97173 3.21074 7.46138 4.17655 7.90762 5.66674ZM11.4365 29.8243C9.9145 29.8243 8.39004 29.7249 6.88248 29.5262C5.00104 29.2782 2.34294 28.7054 0.980103 26.6044C0.348135 25.6295 0.0176636 24.3492 0.000778951 22.7991C-0.0354025 19.6164 1.18994 16.2845 3.45007 13.417C3.84083 12.9187 4.29189 12.4085 4.72848 11.9153C6.4266 9.99814 8.1802 8.01564 7.51205 5.78518C7.08993 4.37796 6.62923 3.46643 5.27363 2.38992C4.88046 2.07827 3.54416 0.763924 3.48868 0.707962C3.43079 0.650312 3.41149 0.56275 3.44044 0.485804C3.46938 0.408857 3.54414 0.356998 3.62615 0.353863C3.63821 0.35338 4.81773 0.30731 5.3484 0.239531C7.69295 -0.0581226 9.91207 0.0511436 12.2614 0.166443L12.78 0.192013C13.4265 0.221439 15.4237 0.00338936 15.443 0.00121689C15.5274 -0.0077076 15.607 0.0335369 15.6456 0.106623C15.6866 0.17971 15.6794 0.26968 15.6287 0.335289C15.6119 0.355551 14.0271 2.36072 13.5567 2.97653L13.3565 3.23631C12.8524 3.88662 12.522 4.31573 12.2808 4.95107C12.0589 5.53625 12.2253 6.31053 12.7077 6.92344C13.1274 7.4541 13.7111 7.83473 14.2755 8.20282L14.4034 8.28652C18.4147 10.9106 20.945 13.7784 22.139 17.054C22.8409 18.982 22.9856 21.1553 22.549 23.1739C22.0859 25.3113 20.9884 27.0736 19.4567 28.1359C17.7466 29.3229 15.6722 29.6125 13.8703 29.7392C13.0623 29.7959 12.2494 29.8243 11.4365 29.8243Z" fill="#2F2F2F"/>
<path d="M9.19329 6.22278C8.72293 6.22278 8.25498 6.17816 7.79668 6.0877C7.68572 6.06575 7.61095 5.95673 7.63266 5.84481C7.65678 5.7324 7.76532 5.65956 7.87627 5.68175C9.17398 5.93767 10.5633 5.80549 11.7887 5.3098C11.8948 5.26711 12.0154 5.31824 12.0564 5.42413C12.0998 5.53003 12.0492 5.65063 11.9431 5.69357C11.0771 6.0438 10.134 6.22278 9.19329 6.22278Z" fill="#2F2F2F"/>
<path d="M8.50818 8.11548C8.24285 8.11548 7.97753 8.1039 7.70979 8.0805C7.59642 8.07061 7.51198 7.97003 7.52163 7.85618C7.53369 7.74257 7.63501 7.65935 7.74597 7.66828C9.34519 7.80818 10.9468 7.50546 12.3796 6.79196C12.4833 6.74083 12.6063 6.78256 12.657 6.88507C12.71 6.98734 12.6666 7.11156 12.5653 7.16246C11.3014 7.79105 9.91202 8.11548 8.50818 8.11548Z" fill="#2F2F2F"/>
<path d="M11.8802 24.4171C10.5753 24.4171 9.27518 23.9212 8.32964 23.0041C8.24763 22.9245 8.24523 22.7936 8.32483 22.7115C8.40443 22.6295 8.53708 22.6275 8.61909 22.7072C9.85649 23.9106 11.8537 24.3265 13.4698 23.719C14.3092 23.4036 14.8881 22.8415 15.0208 22.2159C15.1631 21.5395 14.7772 20.757 14.0849 20.3134C13.5205 19.9523 12.7727 19.7808 11.7934 19.7864C11.6849 19.7871 11.5787 19.7895 11.4726 19.7919C11.0119 19.8026 10.5367 19.8131 10.0736 19.6882C9.54535 19.5459 8.89167 19.1298 8.78553 18.4247C8.64804 17.5241 9.49469 16.8176 10.2617 16.4864C11.5426 15.9333 12.9946 15.8045 14.3502 16.1234C14.4636 16.1497 14.5311 16.2609 14.5046 16.3721C14.4805 16.4833 14.3695 16.5525 14.2562 16.5262C12.985 16.2278 11.6246 16.3484 10.4258 16.8663C9.79379 17.1391 9.09188 17.6946 9.19319 18.3625C9.26555 18.8377 9.74073 19.1701 10.1821 19.2888C10.5874 19.398 11.0119 19.3886 11.463 19.3783C11.5715 19.3758 11.68 19.3732 11.7886 19.3725C12.8499 19.3659 13.6748 19.5594 14.3092 19.9649C15.1438 20.4994 15.6021 21.4598 15.426 22.301C15.1945 23.4036 14.0825 23.9308 13.6145 24.1065C13.0574 24.3158 12.4688 24.4171 11.8802 24.4171Z" fill="#2F2F2F"/>
<path d="M12.0179 25.6106L12.0059 25.6101C11.8901 25.6024 11.8057 25.5038 11.8129 25.3896C12.0541 21.8574 11.6392 18.3531 10.5827 14.9737C10.549 14.8647 10.6093 14.7487 10.7202 14.7147C10.8288 14.68 10.9445 14.7415 10.9783 14.8505C12.0493 18.2788 12.469 21.8342 12.2253 25.4176C12.2181 25.5269 12.1265 25.6106 12.0179 25.6106Z" fill="#2F2F2F"/>
<path d="M3.68886 10.0432C3.28845 10.0432 2.88804 9.93081 2.55517 9.65342C2.46834 9.58033 2.45626 9.44984 2.52863 9.36204C2.6034 9.27424 2.73367 9.26266 2.8205 9.33551C3.3584 9.78367 4.20263 9.665 4.75741 9.31645C5.37491 8.92955 5.79702 8.30433 6.2119 7.64318L6.32527 7.46059C6.63884 6.9567 6.96206 6.43882 7.35764 5.94965C6.79321 5.91974 6.22878 6.09703 5.78495 6.44944C5.674 6.53675 5.57269 6.6342 5.46415 6.73744C5.33148 6.8648 5.19159 6.9965 5.0348 7.11107C4.42454 7.55852 3.57067 7.67237 2.86151 7.40173C2.75538 7.36072 2.70231 7.24133 2.74331 7.13447C2.7819 7.02761 2.90251 6.97455 3.00864 7.01507C3.58996 7.23747 4.28947 7.14388 4.79119 6.777C4.92627 6.67834 5.04927 6.56136 5.17953 6.43786C5.28807 6.33293 5.40386 6.22463 5.52688 6.12549C6.16126 5.62137 7.01271 5.42261 7.80388 5.59242C7.87383 5.6081 7.93413 5.66068 7.95584 5.73087C7.97996 5.80083 7.96309 5.87777 7.91485 5.93277C7.42519 6.47838 7.04406 7.08912 6.67743 7.6796L6.56165 7.86268C6.13953 8.53831 5.66917 9.2342 4.9769 9.66693C4.62232 9.89029 4.1568 10.0432 3.68886 10.0432Z" fill="#2F2F2F"/>
<path d="M14.3261 29.4492C14.2851 29.4497 14.2513 29.4197 14.2513 29.38C14.2513 29.3421 14.2827 29.3112 14.3213 29.3112H14.3261C15.332 29.3112 16.4005 28.8317 17.2592 27.9952C18.1179 27.156 18.6848 26.078 19.0828 25.2328C19.0997 25.1984 19.1407 25.1839 19.1744 25.1998C19.2082 25.216 19.2251 25.2572 19.2082 25.2918C18.8054 26.1475 18.2313 27.2394 17.3533 28.0941C16.4705 28.9554 15.3682 29.4492 14.3261 29.4492Z" fill="#2F2F2F"/>
<path d="M13.1684 29.5402C13.1443 29.5402 13.1201 29.5276 13.1081 29.5049C13.0888 29.4719 13.1008 29.4296 13.1346 29.4111C13.9571 28.9506 14.6422 28.2781 15.1198 27.4667C15.1391 27.4339 15.1825 27.4231 15.2162 27.4423C15.2476 27.4614 15.2597 27.5038 15.2404 27.5366C14.7507 28.3694 14.044 29.0589 13.2021 29.5315L13.1684 29.5402Z" fill="#2F2F2F"/>
<path d="M8.95702 29.6154L8.94496 29.6147C8.07902 29.4794 7.30475 28.9028 6.92846 28.11C6.91158 28.0755 6.92605 28.0345 6.95981 28.0181C6.996 28.0014 7.037 28.0162 7.05147 28.0507C7.41087 28.803 8.14416 29.3498 8.96668 29.4782C9.00527 29.4842 9.02941 29.5195 9.02458 29.557C9.01976 29.591 8.99079 29.6154 8.95702 29.6154Z" fill="#2F2F2F"/>
<path d="M6.29155 29.2745L6.25056 29.261C5.0614 28.391 3.97352 27.5018 3.69854 26.1974C3.69131 26.1603 3.71545 26.1235 3.75404 26.1159C3.79022 26.1074 3.8264 26.132 3.83364 26.1691C4.09897 27.4256 5.1651 28.2961 6.33256 29.1498C6.3615 29.1722 6.36875 29.2154 6.34704 29.2463L6.29155 29.2745Z" fill="#2F2F2F"/>
<path d="M9.01725 5.90149C8.98589 5.90149 8.95695 5.88026 8.94971 5.84866C8.73986 4.97862 8.43595 4.12932 8.0476 3.32441C8.03072 3.29016 8.04519 3.24891 8.07896 3.23227C8.11272 3.21586 8.15373 3.23009 8.17061 3.26435C8.56619 4.07794 8.87252 4.93665 9.08238 5.81658C9.09203 5.85349 9.07033 5.89063 9.03173 5.89956L9.01725 5.90149Z" fill="#2F2F2F"/>
<path d="M10.0231 5.95032L10.0159 5.95008C9.97727 5.94646 9.95074 5.91293 9.95315 5.87482C10.0328 5.04313 10.3029 4.22688 10.7395 3.51459C10.7612 3.48226 10.8022 3.47189 10.836 3.49215C10.8673 3.51169 10.877 3.55439 10.8577 3.58695C10.4332 4.28115 10.1678 5.07665 10.0906 5.88784C10.0882 5.92354 10.0569 5.95032 10.0231 5.95032Z" fill="#2F2F2F"/>
<path d="M11.0168 5.60559L10.9951 5.60245C10.9589 5.59112 10.9396 5.55301 10.9492 5.51707L11.2556 4.48542C11.2677 4.44393 11.2894 4.42053 11.3183 4.41353C11.3448 4.40823 11.3714 4.41667 11.3858 4.43524C11.4196 4.47046 11.4413 4.49603 11.0819 5.5588C11.0723 5.5875 11.0457 5.60559 11.0168 5.60559Z" fill="#2F2F2F"/>
<path d="M20.7738 14.3246C19.5774 12.4735 17.8769 10.7552 15.6336 9.13231C15.6312 9.11832 15.6288 9.10409 15.6288 9.08962C15.9038 9.08142 16.1787 9.07394 16.4489 9.06767C16.9651 9.51777 17.5898 9.87741 18.1374 10.4081C18.7235 10.9416 19.2927 11.4933 19.8282 12.0811C20.0887 12.3339 20.3372 12.598 20.5591 12.8877C20.617 12.9557 20.8606 13.2734 20.8582 13.2734C20.8582 13.2734 20.8558 13.2729 20.8558 13.2722C21.0729 13.5419 21.208 13.8542 21.2562 13.9874C21.3044 14.1022 21.29 14.2189 21.2393 14.3149C21.0849 14.3181 20.9306 14.3212 20.7738 14.3246Z" fill="#868686"/>
<path d="M20.9086 14.5363C20.8627 14.4656 20.8193 14.3954 20.7735 14.325C20.9303 14.3216 21.0847 14.3184 21.239 14.3153C21.1739 14.4374 21.0461 14.5261 20.9086 14.5363ZM15.6285 9.08999C15.6285 9.07576 15.6261 9.06153 15.6285 9.04681C15.6213 8.83937 15.807 8.69585 15.9927 8.69585C16.0796 8.69585 16.164 8.72721 16.2291 8.7974C16.2677 8.83551 16.2966 8.88255 16.3135 8.93344C16.3352 8.95732 16.357 8.98217 16.3787 9.00557C16.4028 9.02655 16.4245 9.0473 16.4486 9.06804C16.1785 9.07431 15.9035 9.08179 15.6285 9.08999Z" fill="#2F2F2F"/>
<path d="M20.8825 14.5372C20.8053 14.5372 20.7281 14.5126 20.6557 14.4555C20.6196 14.4323 20.5882 14.405 20.5617 14.3749L20.5472 14.364C20.3398 14.1482 20.4797 14.2967 20.2746 14.0208C20.2891 14.0406 20.3325 14.0949 20.3374 14.1043C19.9804 13.6021 19.7633 13.2653 19.5076 12.9884C18.7912 12.224 18.0796 11.4531 17.3054 10.7447C16.999 10.4736 16.6806 10.216 16.3671 9.95425C16.1741 9.8035 15.9835 9.64864 15.8268 9.46219C15.7423 9.36498 15.6579 9.25885 15.6338 9.13269C17.877 10.7555 19.5776 12.4739 20.774 14.325C20.8198 14.3954 20.8632 14.4656 20.909 14.5363C20.8994 14.537 20.8897 14.5372 20.8825 14.5372Z" fill="#2F2F2F"/>
<path d="M9.27287 6.75208C8.96412 6.75208 8.65536 6.72072 8.35385 6.64715C8.19465 6.60518 8.09575 6.49567 8.05234 6.36686C8.0451 6.3056 8.03546 6.24409 8.02581 6.1821C8.02823 6.16449 8.02822 6.14712 8.03304 6.12951C8.41416 6.19174 8.80493 6.22238 9.19328 6.22238C10.0761 6.22238 10.9638 6.06439 11.7863 5.75468C11.7983 5.87383 11.82 5.99395 11.8514 6.11359C11.8152 6.14953 11.7694 6.17534 11.7235 6.20115L11.7356 6.19319C11.7043 6.21466 11.6753 6.2342 11.6416 6.24988L11.644 6.24963L11.6391 6.25132L11.5981 6.26893L11.5885 6.27279L11.574 6.28292L11.5837 6.27569L11.5788 6.27762C11.4462 6.36156 11.2797 6.39581 11.135 6.4537C10.5368 6.62206 9.90243 6.75208 9.27287 6.75208ZM9.19568 5.80871C9.15709 5.80871 9.1185 5.80846 9.0799 5.80798C9.02201 5.55954 8.95448 5.31278 8.8797 5.06843C8.899 5.07374 8.92069 5.07929 8.94481 5.08556C9.13537 5.11475 9.36936 5.13163 9.62745 5.13163C9.77218 5.13163 9.92414 5.12632 10.0809 5.1145C10.0279 5.32942 9.98927 5.54723 9.96515 5.76649C9.70946 5.79472 9.45136 5.80871 9.19568 5.80871ZM8.93758 5.80412C8.6023 5.79158 8.26944 5.75492 7.93899 5.69341C7.92934 5.67508 7.91728 5.65867 7.90281 5.64444C7.82079 5.37718 7.73878 5.12681 7.64954 4.88897C7.73155 4.80913 7.83766 4.75727 7.96791 4.75727C7.99445 4.75727 8.02339 4.75969 8.05234 4.76475C8.19465 4.77271 8.31286 4.87185 8.4407 4.92516C8.5999 4.99655 8.58302 4.99414 8.72292 5.02887C8.80252 5.28504 8.87487 5.54362 8.93758 5.80412ZM10.105 5.74937C10.1316 5.53155 10.1726 5.31519 10.2256 5.10196C10.5247 5.07229 10.8311 5.01899 11.123 4.93649L10.9493 5.51684C10.9445 5.54024 10.9493 5.5646 10.9637 5.58197C10.6815 5.65554 10.3945 5.7115 10.105 5.74937ZM11.0843 5.54941C11.1857 5.25224 11.2556 5.03684 11.3039 4.88005C11.3159 4.87619 11.328 4.87209 11.34 4.86799C11.4245 4.82795 11.5089 4.8101 11.5885 4.8101C11.6922 4.8101 11.7863 4.84097 11.8634 4.89307C11.82 5.02719 11.7911 5.16805 11.779 5.31302C11.5523 5.4042 11.3207 5.48307 11.0843 5.54941Z" fill="#DEDEDE"/>
<path d="M8.05254 6.36731C8.03083 6.30821 8.02361 6.24502 8.02602 6.18254C8.03567 6.24453 8.04531 6.30604 8.05254 6.36731ZM11.8516 6.11404C11.8202 5.9944 11.7985 5.87428 11.7865 5.75512C11.8371 5.73534 11.8902 5.71508 11.9433 5.69409C11.9915 5.81639 11.9746 5.97028 11.8878 6.06893C11.8781 6.08582 11.8661 6.10053 11.8516 6.11404ZM7.90301 5.64489C7.87407 5.61932 7.84028 5.60098 7.8041 5.59278C7.73415 5.57831 7.66662 5.56649 7.59667 5.55709C7.43747 5.35664 7.4809 5.05923 7.64974 4.88942C7.73899 5.12725 7.821 5.37763 7.90301 5.64489ZM12.018 5.36122C11.9794 5.31901 11.924 5.29489 11.8661 5.29489C11.8395 5.29489 11.813 5.29971 11.7889 5.30985C11.7865 5.31105 11.7816 5.31226 11.7792 5.31346C11.7913 5.1685 11.8202 5.02763 11.8637 4.89352C12.0084 4.99386 12.0832 5.17284 12.018 5.36122Z" fill="#2F2F2F"/>
<path d="M9.19325 6.22278C8.80491 6.22278 8.41413 6.19215 8.03302 6.12991C8.04749 6.03632 8.08851 5.94756 8.15605 5.88002C8.09093 5.85518 8.0282 5.82792 7.96549 5.79801C7.9679 5.77582 7.96307 5.75315 7.95583 5.7312C7.95101 5.71817 7.9462 5.70563 7.93896 5.69381C8.26942 5.75532 8.60228 5.79198 8.93756 5.80452C8.94238 5.81948 8.94479 5.83443 8.94962 5.84939C8.95685 5.88099 8.98579 5.90221 9.01715 5.90221L9.03164 5.90028C9.07023 5.89136 9.09193 5.85421 9.08228 5.81731C9.08228 5.81417 9.08229 5.81128 9.07988 5.80838C9.11847 5.80886 9.15706 5.80911 9.19566 5.80911C9.45134 5.80911 9.70944 5.79512 9.96512 5.7669C9.9603 5.80284 9.95789 5.83902 9.95306 5.8752C9.95065 5.91331 9.97717 5.94684 10.0158 5.95045L10.023 5.9507C10.0568 5.9507 10.0881 5.92392 10.0905 5.88822C10.0954 5.84191 10.1002 5.79584 10.105 5.74977C10.3945 5.7119 10.6815 5.65594 10.9637 5.58237C10.9734 5.59154 10.983 5.59877 10.9951 5.60263L11.0168 5.60577C11.0457 5.60577 11.0723 5.58768 11.0819 5.55897C11.0819 5.55584 11.0843 5.5527 11.0843 5.54981C11.3207 5.48347 11.5523 5.4046 11.779 5.31342C11.7814 5.31221 11.7862 5.31101 11.7887 5.3098C11.8128 5.29967 11.8393 5.29485 11.8658 5.29485C11.9237 5.29485 11.9792 5.31897 12.0178 5.36118C11.9961 5.42341 11.9599 5.48661 11.9044 5.54836L11.8683 5.57972L11.8875 5.60335C11.9117 5.63013 11.9286 5.66076 11.943 5.69405C11.89 5.71503 11.8369 5.7353 11.7863 5.75508C10.9637 6.06479 10.0761 6.22278 9.19325 6.22278Z" fill="#2F2F2F"/>
<path d="M7.9656 5.79773C7.88842 5.76107 7.81363 5.72079 7.73886 5.67616C7.68097 5.64312 7.63274 5.60235 7.59656 5.55676C7.66651 5.56617 7.73404 5.57799 7.80399 5.59246C7.84017 5.60066 7.87395 5.61899 7.9029 5.64456C7.91737 5.65879 7.92943 5.6752 7.93908 5.69353C7.94632 5.70535 7.95112 5.71789 7.95595 5.73092C7.96318 5.75287 7.96802 5.77554 7.9656 5.79773Z" fill="#2F2F2F"/>
<path d="M9.0174 5.90149C8.98604 5.90149 8.9571 5.88026 8.94987 5.84866C8.94504 5.83371 8.94263 5.81875 8.93781 5.8038C8.87509 5.54329 8.80274 5.28472 8.72314 5.02855C8.76174 5.0382 8.80998 5.0505 8.87993 5.06811C8.95471 5.31245 9.02224 5.55921 9.08013 5.80766C9.08254 5.81055 9.08253 5.81345 9.08253 5.81658C9.09218 5.85349 9.07048 5.89063 9.03189 5.89956L9.0174 5.90149Z" fill="#2F2F2F"/>
<path d="M10.0231 5.95032L10.0159 5.95008C9.97727 5.94646 9.95074 5.91293 9.95315 5.87482C9.95798 5.83864 9.96039 5.80246 9.96522 5.76652C9.98934 5.54726 10.0279 5.32944 10.081 5.11453C10.1292 5.11091 10.1775 5.10681 10.2257 5.10198C10.1727 5.31521 10.1316 5.53158 10.1051 5.74939C10.1003 5.79546 10.0954 5.84153 10.0906 5.88784C10.0882 5.92354 10.0569 5.95032 10.0231 5.95032Z" fill="#2F2F2F"/>
<path d="M11.0171 5.60559L10.9954 5.60245C10.9833 5.5986 10.9737 5.59136 10.964 5.58219C10.9496 5.56483 10.9447 5.54046 10.9496 5.51707L11.1232 4.93672C11.1835 4.91911 11.2438 4.9003 11.3041 4.88028C11.2559 5.03706 11.1859 5.25246 11.0846 5.54963C11.0846 5.55253 11.0822 5.55566 11.0822 5.5588C11.0726 5.5875 11.046 5.60559 11.0171 5.60559Z" fill="#2F2F2F"/>
<path d="M9.03189 8.72961C8.81963 8.72961 8.60737 8.70887 8.39752 8.66111C8.12254 8.58899 8.00433 8.33668 8.02845 8.10319C8.19006 8.1114 8.34927 8.11574 8.50846 8.11574C9.86165 8.11574 11.198 7.81471 12.4257 7.23098C12.4619 7.27729 12.5029 7.3224 12.5415 7.3663C12.527 7.42588 12.5029 7.48256 12.4643 7.5308L12.4378 7.56168L12.4088 7.58966L12.3847 7.61957C12.0374 7.9054 11.6128 8.0728 11.1979 8.23441C10.5057 8.47658 9.76999 8.72961 9.03189 8.72961ZM8.50846 7.70182C8.44334 7.70182 8.37822 7.7011 8.31309 7.69965C8.35651 7.67963 8.40957 7.66588 8.46505 7.66033C8.49158 7.65406 8.51811 7.65141 8.54465 7.65141C8.62907 7.65141 8.71109 7.67843 8.79551 7.697C8.69903 7.70013 8.60495 7.70182 8.50846 7.70182ZM11.4512 7.18925C11.4681 7.18081 11.4826 7.17309 11.4946 7.16586C11.8396 7.00063 11.854 6.91379 12.047 6.87978C12.0735 6.87399 12.1001 6.87061 12.1266 6.86989L12.1387 6.86844L12.1363 6.86965C12.1483 6.86965 12.1604 6.87013 12.17 6.87109C12.1748 6.87688 12.1773 6.88268 12.1821 6.88822C11.9409 6.9999 11.6973 7.10025 11.4512 7.18925Z" fill="#DEDEDE"/>
<path d="M12.5414 7.36633C12.5028 7.32243 12.4618 7.27733 12.4256 7.23101C12.4642 7.21268 12.5028 7.19411 12.539 7.17506C12.5559 7.23777 12.5559 7.30362 12.5414 7.36633ZM12.182 6.88826C12.1772 6.88271 12.1747 6.87692 12.1699 6.87113C12.1844 6.87209 12.1965 6.87378 12.2085 6.87571C12.1989 6.88006 12.1892 6.88416 12.182 6.88826Z" fill="#2F2F2F"/>
<path d="M8.50834 8.11548C8.34914 8.11548 8.18993 8.11114 8.02832 8.10294C8.04762 7.93288 8.14412 7.77272 8.31297 7.69939C8.37809 7.70084 8.44321 7.70156 8.50834 7.70156C8.60482 7.70156 8.6989 7.69988 8.79539 7.69674C8.79539 7.69722 8.79778 7.69746 8.80019 7.69794C8.95456 7.7059 9.07278 7.71 9.16926 7.71C9.45871 7.71 9.55518 7.6731 9.97006 7.60049C10.4838 7.51294 11.2075 7.30381 11.4511 7.18899C11.6971 7.09999 11.9407 6.99964 12.182 6.88796C12.1892 6.88386 12.1988 6.87976 12.2085 6.87542C12.3243 6.89544 12.4352 6.9637 12.4955 7.07008C12.5172 7.10312 12.5317 7.13834 12.5389 7.17476C12.5028 7.19382 12.4642 7.21239 12.4256 7.23072C11.1978 7.81445 9.86152 8.11548 8.50834 8.11548Z" fill="#2F2F2F"/>
<path d="M8.90871 29.7628C8.49142 29.7628 8.07413 29.7481 7.65925 29.6916C7.22748 29.634 6.79091 29.579 6.37121 29.4618C6.34467 29.455 6.31813 29.4476 6.28918 29.4394C6.49421 29.4723 6.69199 29.5008 6.88255 29.526C7.68819 29.632 8.49626 29.7097 9.30913 29.7592C9.17647 29.7613 9.04137 29.7628 8.90871 29.7628Z" fill="#DEDEDE"/>
<path d="M11.4365 29.4104C10.3825 29.4104 9.32836 29.3623 8.28151 29.266C7.75085 29.0151 7.30702 28.5845 7.05134 28.0503C7.04169 28.0254 7.01516 28.0109 6.99104 28.0109C6.97898 28.0109 6.96934 28.0131 6.95969 28.0177C6.92592 28.0341 6.91145 28.0751 6.92833 28.1096C7.06582 28.3976 7.25398 28.6572 7.48071 28.8774C7.38905 28.8665 7.16714 28.8383 7.01036 28.8183L7.02482 28.8207C7.16713 28.8468 7.32393 28.8687 7.49277 28.8875C7.62785 29.0168 7.77498 29.1325 7.93418 29.2322C7.60131 29.1982 7.26844 29.1594 6.93557 29.1157C6.67506 29.0812 6.40008 29.0407 6.11545 28.99C5.40389 28.4599 4.7454 27.9142 4.30881 27.2661C5.57034 27.5628 6.70401 27.7179 7.5796 27.8179C8.59027 27.9509 9.1354 28.0913 9.90004 28.125C10.7636 28.1723 11.6319 28.2297 12.4979 28.2297C13.0647 28.2297 13.6315 28.2051 14.196 28.1371C14.3817 28.1151 14.5481 28.0981 14.6977 28.0831C14.2876 28.5963 13.7859 29.0317 13.2167 29.3644C12.6233 29.395 12.0299 29.4104 11.4365 29.4104ZM13.5061 29.3479C14.0368 29.0031 14.5047 28.5681 14.8858 28.0642C15.4647 28.0069 15.8386 27.9646 16.5646 27.7321C17.0447 27.6026 17.5367 27.3865 18.0143 27.1107C17.79 27.4202 17.5391 27.7205 17.2593 27.9953C16.6539 28.5853 15.9423 28.9975 15.2259 29.1895C14.7532 29.2529 14.29 29.2947 13.8414 29.3263C13.7304 29.334 13.6171 29.3412 13.5061 29.3479ZM15.9447 29.0742C16.444 28.8438 16.9265 28.5124 17.3534 28.0942C17.72 27.7374 18.0336 27.3394 18.3038 26.9344C18.6535 26.7118 18.9912 26.4593 19.3072 26.1879C19.6521 25.7735 19.9175 25.3046 20.231 24.6907C20.904 23.4328 21.3092 22.4122 21.6759 20.9392C21.8616 20.2232 21.9509 19.7633 22.0087 19.1369C22.0329 19.0327 22.1149 18.9673 22.2089 18.9458C22.5708 21.0718 22.3223 23.4398 21.3358 25.3391C21.3261 25.3565 21.3141 25.3741 21.3044 25.3914C21.3044 25.3938 21.3044 25.3965 21.3044 25.3989C20.8003 26.3483 20.1128 27.177 19.2204 27.7955C18.2217 28.489 17.0808 28.8617 15.9447 29.0742ZM5.80911 28.9331C4.1906 28.612 2.34776 27.9535 1.32745 26.3789C1.18514 26.1594 1.05972 25.9223 0.951172 25.6684C0.977705 25.6572 1.00907 25.6509 1.04042 25.6509C1.07419 25.6509 1.10794 25.6587 1.14171 25.6753C1.47217 25.9192 1.85571 26.3054 2.04144 26.4228C2.13793 26.4916 2.23199 26.5548 2.32607 26.6148C2.37189 26.6207 2.4153 26.6343 2.4563 26.6604C2.96526 26.9207 2.60345 26.7591 3.08828 26.942C3.43562 27.0454 3.78055 27.1376 4.11342 27.2193C4.51624 27.8686 5.1289 28.4128 5.80911 28.9331Z" fill="#DEDEDE"/>
<path d="M9.309 29.759C8.49613 29.7096 7.68806 29.6319 6.88242 29.5258C6.69187 29.5007 6.49409 29.4722 6.28906 29.4392C5.70774 29.2723 4.65607 28.8393 4.46069 28.7486C4.09164 28.6037 3.62852 28.4042 3.12198 28.045C3.0858 28.02 3.04479 27.9939 3.00378 27.9676C2.97001 27.9872 2.92901 27.9987 2.88801 27.9987C2.85182 27.9987 2.81564 27.9908 2.77946 27.9734C2.58167 27.8391 2.4056 27.6716 2.23434 27.502C2.16439 27.4652 2.09684 27.4283 2.03171 27.3879C1.91834 27.324 1.85805 27.2263 1.83634 27.1219C1.65061 26.9412 1.41421 26.7835 1.29843 26.5495L1.29119 26.4965L1.22606 26.4405C1.08134 26.2929 0.864263 26.1855 0.782252 25.9892C0.741247 25.8531 0.828082 25.7154 0.951099 25.6682C1.05964 25.9221 1.18506 26.1592 1.32738 26.3787C2.34769 27.9533 4.19053 28.6119 5.80904 28.9329C5.95377 29.0431 6.10092 29.1524 6.25047 29.2612L6.29146 29.2747L6.34696 29.2465C6.36867 29.2156 6.36142 29.1724 6.33247 29.15C6.2577 29.0967 6.18533 29.0434 6.11538 28.9898C6.40001 29.0405 6.67499 29.081 6.93549 29.1155C7.26836 29.1592 7.60124 29.198 7.93411 29.232C8.24045 29.425 8.58536 29.5577 8.94476 29.6141L8.95682 29.6148C8.99059 29.6148 9.01956 29.5905 9.02438 29.5564C9.02921 29.5189 9.00507 29.4836 8.96648 29.4776C8.72768 29.4404 8.49611 29.3681 8.28144 29.2658C9.32829 29.3621 10.3824 29.4102 11.4365 29.4102C12.0299 29.4102 12.6232 29.3949 13.2166 29.3642C13.1901 29.3799 13.1635 29.3955 13.1346 29.411C13.1008 29.4295 13.0888 29.4718 13.1081 29.5048C13.1201 29.5275 13.1442 29.5401 13.1684 29.5401L13.2021 29.5314C13.3058 29.4734 13.4071 29.4122 13.506 29.3477C13.617 29.3411 13.7304 29.3338 13.8413 29.3261C14.29 29.2945 14.7531 29.2528 15.2259 29.1894C14.9244 29.2694 14.6228 29.3111 14.3262 29.3111H14.3213C14.2827 29.3111 14.2514 29.342 14.2514 29.3799C14.2514 29.4195 14.2852 29.4491 14.3262 29.4491C14.8616 29.4491 15.414 29.3183 15.9447 29.074C17.0808 28.8616 18.2217 28.4888 19.2203 27.7953C20.1128 27.1769 20.8002 26.3481 21.3043 25.3987C21.3188 25.6195 21.1451 25.8146 21.068 26.0159C20.8075 26.5426 20.4818 27.0459 20.038 27.4369C19.0128 28.3637 17.7489 29.0082 16.3981 29.3005C15.0811 29.5272 13.7424 29.6056 12.4109 29.6819C11.5957 29.7559 10.7804 29.7443 9.96267 29.7477C9.74558 29.7506 9.52609 29.7556 9.309 29.759ZM21.3357 25.3389C22.3222 23.4396 22.5707 21.0716 22.2089 18.9456C22.2306 18.9403 22.2547 18.9377 22.2764 18.9377C22.3705 18.9377 22.4646 18.9811 22.5152 19.0723C22.6069 19.3576 22.5635 19.6763 22.5827 19.9744C22.5755 20.5162 22.5562 21.0583 22.4983 21.5973C22.4814 21.7731 22.4573 21.9477 22.4308 22.1224C22.4959 22.2953 22.4091 22.5155 22.3657 22.7539C22.3343 22.8979 22.2981 23.0409 22.2619 23.1833C22.2306 23.3704 22.2089 23.5972 22.0955 23.7303C22.0014 24.0077 21.8881 24.2792 21.753 24.5417C21.6324 24.8172 21.4901 25.0825 21.3357 25.3389Z" fill="#2F2F2F"/>
<path d="M14.3261 29.4492C14.2851 29.4492 14.2513 29.4196 14.2513 29.38C14.2513 29.3421 14.2827 29.3112 14.3213 29.3112H14.3261C14.6228 29.3112 14.9243 29.2694 15.2258 29.1895C15.9422 28.9974 16.6538 28.5852 17.2592 27.9952C17.539 27.7204 17.7899 27.4201 18.0142 27.1106C18.1107 27.0542 18.2072 26.9954 18.3037 26.9343C18.0335 27.3393 17.7199 27.7373 17.3533 28.0941C16.9264 28.5124 16.4439 28.8438 15.9446 29.0741C15.414 29.3184 14.8616 29.4492 14.3261 29.4492Z" fill="#2F2F2F"/>
<path d="M13.1684 29.5402C13.1443 29.5402 13.1201 29.5276 13.1081 29.5049C13.0888 29.4719 13.1008 29.4296 13.1346 29.4111C13.1636 29.3956 13.1901 29.38 13.2166 29.3643C13.7859 29.0316 14.2876 28.5962 14.6976 28.083C14.7628 28.0765 14.8255 28.0702 14.8858 28.0642C14.5047 28.5681 14.0367 29.003 13.5061 29.3478C13.4072 29.4123 13.3059 29.4735 13.2021 29.5315L13.1684 29.5402Z" fill="#2F2F2F"/>
<path d="M8.95702 29.6154L8.94496 29.6147C8.58556 29.5583 8.24065 29.4256 7.93431 29.2326C7.77511 29.1329 7.62798 29.0172 7.4929 28.8879C7.5532 28.8946 7.61591 28.901 7.68104 28.907C7.62074 28.898 7.56044 28.8882 7.50013 28.88C7.49531 28.8792 7.48808 28.8785 7.48084 28.8778C7.2541 28.6576 7.06595 28.398 6.92846 28.11C6.91158 28.0755 6.92605 28.0345 6.95981 28.0181C6.96946 28.0135 6.97911 28.0113 6.99117 28.0113C7.01529 28.0113 7.04182 28.0258 7.05147 28.0507C7.30715 28.585 7.75098 29.0155 8.28164 29.2664C8.49631 29.3687 8.72788 29.441 8.96668 29.4782C9.00527 29.4842 9.02941 29.5195 9.02458 29.557C9.01976 29.591 8.99079 29.6154 8.95702 29.6154Z" fill="#2F2F2F"/>
<path d="M6.2914 29.2745L6.25041 29.261C6.10086 29.1522 5.9537 29.0429 5.80898 28.9327C5.12877 28.4124 4.5161 27.8683 4.11328 27.2189C4.17841 27.2348 4.24355 27.2505 4.30867 27.2657C4.74526 27.9139 5.40375 28.4595 6.11532 28.9896C6.18527 29.0432 6.25763 29.0965 6.33241 29.1498C6.36135 29.1722 6.3686 29.2154 6.34689 29.2463L6.2914 29.2745Z" fill="#2F2F2F"/>
</svg>

          </div>
          <h2 className="text-gray-600 font-medium text-[12px] uppercase tracking-wide">
            LAST TRANSACTION
          </h2>
        </div>
        <div className="inline-block border border-green-600 text-green-600 rounded-md px-4 py-1 text-sm">
          Success
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">On 27 Mar 2025</p>
          <p className="text-[#0E0A1F] text-[14px] font-medium ">Brother Builder pvt</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Check</p>
          <p className="text-[#0E0A1F] text-[14px] font-medium ">₹ 22,76,36,500</p>
        </div>
      </div>
    </div>
  </div>


  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div>


      <div className="flex items-center gap-2  mb-4 overflow-visible">
      <div>
      <svg width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1248 5.29233C10.9532 4.50175 10.8586 3.67949 11.0078 2.88415C11.1571 2.0888 11.5758 1.31847 12.2556 0.879473C12.9485 0.432137 13.8141 0.374253 14.6378 0.32971C15.2752 0.295171 15.9124 0.260392 16.5498 0.225853C17.4874 0.174878 18.5207 0.153203 19.2503 0.744172C20.0468 1.38921 20.1957 2.5259 20.2855 3.54705C20.3331 4.08538 20.3753 4.65467 20.1397 5.14108C19.9041 5.62771 19.2832 5.97096 18.8077 5.7137C18.3625 5.47241 18.2758 4.87143 18.3199 4.36693C18.3637 3.86243 18.4788 3.3241 18.2515 2.87152C17.8714 2.11429 16.8252 2.07022 15.9801 2.13263C15.533 2.16574 15.0859 2.19862 14.6388 2.23172C14.109 2.27079 13.5021 2.35344 13.2132 2.79959C12.8361 3.38222 13.2532 4.18447 13.0286 4.84142C12.8897 5.24779 12.4893 5.55077 12.0605 5.57364C11.6318 5.59675 11.2012 5.33854 11.1248 5.29233Z" fill="white"/>
<path d="M16.4899 1.90868C17.241 1.90868 18.0723 2.06185 18.4329 2.78001C18.6487 3.2102 18.5975 3.6785 18.5477 4.13179C18.5384 4.21659 18.5291 4.30067 18.522 4.38404C18.4984 4.65511 18.4884 5.30968 18.9043 5.53477C19.0763 5.62791 19.2554 5.60099 19.3752 5.5624C19.616 5.48475 19.8442 5.28467 19.9569 5.05242C20.1746 4.60247 20.126 4.05104 20.0831 3.56464C19.9926 2.53753 19.844 1.48612 19.1225 0.90158C18.4682 0.371827 17.5373 0.375159 16.5607 0.428277L14.6487 0.532135C13.8907 0.573343 13.0313 0.620029 12.3655 1.04998C11.7819 1.42657 11.3599 2.10877 11.2073 2.92126C11.088 3.55654 11.1187 4.27042 11.3044 5.16104C11.4706 5.2518 11.7684 5.38614 12.0494 5.37042C12.3939 5.35208 12.7247 5.10196 12.8364 4.77539C12.9229 4.52171 12.8977 4.23016 12.8707 3.92146C12.8343 3.50247 12.7967 3.06895 13.0427 2.68878C13.3671 2.18761 13.9943 2.07542 14.6239 2.02897L15.9649 1.92988C16.13 1.91749 16.3075 1.90868 16.4899 1.90868ZM19.1618 6.00378C19.002 6.00378 18.8483 5.96615 18.7109 5.89207C18.269 5.65268 18.0527 5.09029 18.1173 4.34902C18.1247 4.26256 18.1344 4.17538 18.144 4.08748C18.1892 3.67492 18.2321 3.28523 18.0699 2.96247C17.8119 2.44868 17.1526 2.2493 15.9949 2.33482L14.6537 2.43391C14.1646 2.47012 13.6232 2.53967 13.3836 2.90959C13.2133 3.1728 13.2435 3.51938 13.2754 3.88597C13.3047 4.22325 13.335 4.57197 13.2207 4.90688C13.0551 5.39138 12.5825 5.74867 12.0713 5.77607C11.6431 5.79917 11.2287 5.59194 11.0198 5.46617C10.9718 5.43735 10.9379 5.38971 10.9261 5.33516C10.7121 4.34831 10.6745 3.55749 10.8081 2.84647C10.9811 1.92488 11.4685 1.14573 12.1452 0.708637C12.9017 0.220331 13.8581 0.168405 14.6267 0.126482L16.5388 0.0226312C17.5551 -0.0321546 18.612 -0.0340624 19.3781 0.585968C20.2232 1.27031 20.3897 2.41509 20.4878 3.52891C20.5329 4.04127 20.5891 4.67869 20.3225 5.2294C20.1615 5.56169 19.8464 5.83752 19.4998 5.94924C19.3867 5.98568 19.2728 6.00378 19.1618 6.00378Z" fill="#2F2F2F"/>
<path d="M0.423802 25.7259C0.263471 22.6184 0.237698 19.5049 0.21183 16.3931C0.189511 13.7079 0.169597 10.9972 0.702185 8.37105C0.869852 7.5445 1.23134 6.49595 1.76338 5.67941C2.12673 5.12203 2.73385 4.79378 3.37586 4.77544C10.923 4.55844 18.2841 4.66778 25.8457 4.42553C27.0772 4.38599 27.8778 4.56821 28.3873 4.87835C29.916 5.80827 28.827 7.88893 28.9054 8.58709C29.5626 14.4244 30.0287 20.5034 29.68 25.8915C28.9561 25.9903 27.3345 25.9853 26.2447 25.9963C18.9346 26.0697 11.6243 26.1428 4.31425 26.2161C3.12063 26.2281 1.925 26.24 0.423802 25.7259Z" fill="white"/>
<path d="M0.619655 25.5772C2.02634 26.036 3.13843 26.0248 4.3123 26.0129L26.2427 25.7931C26.4092 25.7914 26.5878 25.7902 26.7738 25.7888C27.7038 25.7821 28.8419 25.7738 29.4879 25.7094C29.8483 19.8321 29.2144 13.1452 28.7037 8.60991C28.679 8.38958 28.7423 8.1004 28.8226 7.73429C29.0253 6.80913 29.2773 5.65744 28.2819 5.0517C27.7628 4.73585 26.9456 4.59389 25.8523 4.62866C21.9275 4.75443 17.9931 4.78588 14.1884 4.81636C10.6603 4.84471 7.01213 4.874 3.38173 4.97833C2.79545 4.99501 2.25412 5.29871 1.93365 5.79036C1.47838 6.48875 1.09253 7.4687 0.901325 8.41125C0.370477 11.0286 0.393105 13.7548 0.415067 16.3914C0.439983 19.4039 0.465851 22.5171 0.619655 25.5772ZM3.77597 26.4226C2.748 26.4226 1.66244 26.3647 0.358114 25.9179C0.279676 25.8912 0.225343 25.8193 0.22115 25.7364C0.0605571 22.6231 0.0342123 19.4567 0.00882038 16.3947C-0.0132368 13.7371 -0.0360324 10.9895 0.503272 8.3305C0.704049 7.34031 1.11161 6.30772 1.59329 5.56835C1.98651 4.96547 2.65068 4.59294 3.37011 4.57245C7.00458 4.46788 10.655 4.43858 14.1851 4.41024C17.9874 4.37975 21.9194 4.3483 25.8394 4.22253C27.0287 4.18442 27.8969 4.34235 28.4929 4.70488C29.7363 5.46116 29.4252 6.8813 29.2192 7.821C29.1527 8.12446 29.0901 8.41101 29.1075 8.56441C29.6246 13.1588 30.2677 19.9546 29.8828 25.9045C29.8764 26.0008 29.8032 26.0796 29.7075 26.0927C29.081 26.1782 27.8033 26.1875 26.7767 26.1949C26.5911 26.1963 26.4127 26.1975 26.2467 26.1992L4.3164 26.419C4.13756 26.4209 3.9576 26.4226 3.77597 26.4226Z" fill="#2F2F2F"/>
<path d="M13.9723 17.2087C13.9273 17.2087 13.8818 17.1937 13.8442 17.163L4.91151 9.8901C4.28819 9.3825 3.64374 8.85775 3.13729 8.18531C2.50282 7.34305 2.11742 6.28902 2.05191 5.21712C2.04493 5.10517 2.13016 5.00894 2.24219 5.00203C2.35366 4.99703 2.45051 5.08016 2.45723 5.19235C2.51797 6.18564 2.87482 7.16178 3.46176 7.94116C3.93851 8.57382 4.5635 9.08284 5.16802 9.57496L14.1007 16.8481C14.1876 16.9188 14.2007 17.0468 14.1298 17.1337C14.0897 17.183 14.0311 17.2087 13.9723 17.2087Z" fill="#2F2F2F"/>
<path d="M4.54622 26.1539C4.43401 26.1539 4.34311 26.0629 4.34311 25.9508C4.34311 19.5897 3.98617 14.1156 3.1857 8.20213C3.17063 8.09089 3.24859 7.9887 3.35968 7.97369C3.47061 7.95702 3.57313 8.03634 3.58821 8.14758C4.3912 14.0799 4.74924 19.5709 4.74924 25.9508C4.74924 26.0629 4.65844 26.1539 4.54622 26.1539Z" fill="#2F2F2F"/>
<path d="M18.969 17.0466C18.9094 17.0466 18.8508 17.0209 18.8106 16.9709C18.7403 16.8837 18.7539 16.7558 18.8413 16.6853L25.9806 10.9285C26.7478 10.3099 28.3442 9.02245 28.7591 8.11825C28.8058 8.0163 28.9264 7.97152 29.0285 8.01844C29.1305 8.06513 29.1753 8.18566 29.1284 8.28761C28.7287 9.1587 27.5017 10.2237 26.2354 11.2448L19.0962 17.0016C19.0585 17.0319 19.0135 17.0466 18.969 17.0466Z" fill="#2F2F2F"/>
<path d="M18.8211 15.2454C19.021 16.1868 19.0438 17.1691 18.8881 18.1196C18.8499 18.352 18.7902 18.6019 18.6134 18.7465C18.4888 18.8482 18.3264 18.8799 18.1704 18.9047C17.0608 19.0807 15.9242 19.0652 14.8194 18.8582C14.66 18.8284 14.4943 18.7913 14.3697 18.6827C14.1613 18.5011 14.13 18.1827 14.1186 17.8983C14.086 17.081 14.0884 16.2621 14.1091 15.4017C14.2584 15.062 14.6748 14.983 15.0288 14.9482C16.0559 14.8469 17.0873 14.7455 18.1172 14.8029C18.3928 14.8181 18.7489 14.906 18.8211 15.2454Z" fill="white"/>
<path d="M14.311 15.4517C14.2891 16.3866 14.2925 17.1629 14.3215 17.8906C14.3318 18.1495 14.3611 18.4063 14.503 18.5299C14.5878 18.6038 14.7186 18.6331 14.8568 18.659C15.9432 18.8622 17.0472 18.8777 18.1384 18.7045C18.273 18.6831 18.4009 18.6581 18.4847 18.5897C18.6069 18.4897 18.6546 18.2891 18.6877 18.0871C18.8385 17.1672 18.8158 16.1994 18.6224 15.288C18.5865 15.118 18.4126 15.0232 18.106 15.0063C17.0903 14.9491 16.0525 15.0518 15.0487 15.1506C14.7493 15.1801 14.4306 15.2395 14.311 15.4517ZM16.6285 19.2302C16.0108 19.2302 15.3937 19.1728 14.782 19.0582C14.5945 19.0232 14.3977 18.977 14.2362 18.8362C13.978 18.6116 13.9297 18.2567 13.9156 17.9068C13.8859 17.1586 13.8828 16.3611 13.9059 15.3971C13.9066 15.3707 13.9123 15.3445 13.923 15.3202C14.1376 14.8324 14.7481 14.7721 15.0087 14.7464C16.028 14.6461 17.0818 14.5425 18.1286 14.6006C18.6265 14.6282 18.943 14.8424 19.0197 15.2037C19.2234 16.1639 19.2475 17.1836 19.0886 18.1529C19.0448 18.4201 18.9692 18.7183 18.7418 18.9041C18.5796 19.0368 18.3864 19.0763 18.2022 19.1056C17.6794 19.1885 17.1537 19.2302 16.6285 19.2302Z" fill="#2F2F2F"/>
<path d="M16.229 16.4863C16.0959 16.397 16.017 16.2252 16.0335 16.0601C16.0499 15.8948 16.1607 15.7438 16.3086 15.6855C16.3936 15.6521 16.4863 15.6478 16.577 15.6507C16.7178 15.6552 16.865 15.679 16.9775 15.7681C17.1699 15.9206 17.1902 16.2598 17.0172 16.4365C16.9646 16.4903 16.895 16.5346 16.8738 16.609C16.8617 16.6514 16.8681 16.6969 16.8743 16.7407C16.9215 17.0665 16.9686 17.3924 17.0158 17.7182C16.6952 17.8092 16.3615 17.8493 16.0297 17.8364C16.1064 17.4048 16.1831 16.9729 16.229 16.4863Z" fill="white"/>
<path d="M16.5329 15.8527C16.4829 15.8527 16.4274 15.8568 16.3833 15.8741C16.3066 15.9044 16.2447 15.9911 16.2359 16.0799C16.2268 16.17 16.2716 16.27 16.3421 16.3174C16.4041 16.3589 16.4384 16.4308 16.4312 16.5051C16.3933 16.9094 16.3338 17.2786 16.2718 17.633C16.4457 17.6261 16.6184 17.6037 16.7887 17.5658L16.6735 16.7695C16.6658 16.7169 16.6546 16.6376 16.6787 16.553C16.7104 16.4415 16.7849 16.3741 16.8395 16.3251L16.8723 16.2941C16.9143 16.2512 16.9367 16.18 16.9317 16.104C16.9271 16.0292 16.8971 15.9632 16.8516 15.9273C16.7937 15.8813 16.7044 15.8577 16.5706 15.8534L16.5329 15.8527ZM16.1518 18.0417C16.1087 18.0417 16.0653 18.041 16.022 18.0394C15.9634 18.037 15.9086 18.0094 15.8717 17.9639C15.835 17.9181 15.8195 17.8586 15.8298 17.8007C15.8991 17.4115 15.9705 17.0096 16.0165 16.5716C15.8829 16.4341 15.8121 16.2369 15.8317 16.0397C15.8555 15.8003 16.0172 15.5819 16.2342 15.4964C16.359 15.4473 16.4869 15.4444 16.5837 15.4475C16.7256 15.4521 16.9338 15.474 17.1039 15.6088C17.2401 15.7167 17.3252 15.888 17.3371 16.0783C17.3492 16.2703 17.2856 16.4525 17.1627 16.5783L17.1117 16.6264L17.0667 16.6712L17.0755 16.7116L17.217 17.689C17.2316 17.7895 17.1694 17.8855 17.0715 17.9134C16.7711 17.9986 16.4624 18.0417 16.1518 18.0417Z" fill="#2F2F2F"/>
<path d="M4.48365 7.823L4.44568 7.81133C4.41479 7.79037 4.40669 7.7482 4.42772 7.71723C4.93558 6.97072 5.47637 6.23279 6.0352 5.52439C6.05845 5.49533 6.10106 5.49032 6.13029 5.51343C6.15959 5.5363 6.16462 5.57893 6.14153 5.60823C5.58467 6.31425 5.04575 7.04933 4.53975 7.79346C4.52665 7.81276 4.50533 7.823 4.48365 7.823Z" fill="#2F2F2F"/>
<path d="M5.65921 8.92834L5.61574 8.91263C5.58709 8.88857 5.58337 8.84593 5.60738 8.81735C6.46413 7.79571 7.31943 6.74693 8.14938 5.70052C8.17266 5.67098 8.21527 5.66622 8.2445 5.68956C8.2738 5.71267 8.27873 5.75531 8.25548 5.78461C7.42476 6.83196 6.56863 7.8817 5.71112 8.90429L5.65921 8.92834Z" fill="#2F2F2F"/>
<path d="M6.9099 10.0847L6.87167 10.0728C6.84087 10.0518 6.83306 10.0097 6.85407 9.97872C7.93966 8.39565 9.14692 6.87476 10.4423 5.45867C10.4676 5.43104 10.5105 5.42913 10.538 5.45438C10.5656 5.47963 10.5675 5.5225 10.5423 5.55013C9.25103 6.96146 8.04778 8.47736 6.96583 10.0554C6.95271 10.0745 6.93148 10.0847 6.9099 10.0847Z" fill="#2F2F2F"/>
<path d="M8.05447 11.2028L8.01428 11.1894C7.98413 11.167 7.97789 11.1249 8.00013 11.0946C9.41396 9.18522 10.9146 7.30345 12.4604 5.50172C12.4847 5.47337 12.5275 5.47028 12.5559 5.49434C12.5842 5.51888 12.5873 5.56151 12.563 5.58986C11.0195 7.38921 9.52089 9.26812 8.10889 11.1754L8.05447 11.2028Z" fill="#2F2F2F"/>
<path d="M9.15114 12.2039L9.11029 12.1903C9.08051 12.1676 9.07465 12.1253 9.09726 12.0955C10.7993 9.84974 12.5868 7.62164 14.4102 5.47237C14.4345 5.44379 14.4771 5.44022 14.5057 5.46452C14.5343 5.48881 14.5376 5.53145 14.5136 5.56003C12.6916 7.70715 10.9056 9.93359 9.20521 12.1772L9.15114 12.2039Z" fill="#2F2F2F"/>
<path d="M10.4607 13.0386L10.4178 13.0233C10.3889 12.9995 10.3847 12.9569 10.4084 12.9278C12.4935 10.3884 14.6416 7.8418 16.7934 5.3593C16.818 5.33095 16.8606 5.32786 16.889 5.3524C16.9173 5.37693 16.9202 5.41957 16.8959 5.44791C14.7447 7.92946 12.5973 10.4751 10.513 13.0138L10.4607 13.0386Z" fill="#2F2F2F"/>
<path d="M11.4363 14.0876L11.3927 14.0717C11.3641 14.0476 11.3605 14.005 11.3846 13.9764L18.7123 5.28718C18.7366 5.25859 18.779 5.25502 18.8078 5.27908C18.8364 5.30313 18.84 5.34577 18.8159 5.37435L11.488 14.0636L11.4363 14.0876Z" fill="#2F2F2F"/>
<path d="M12.8269 15.0818L12.7843 15.0665C12.7552 15.0427 12.7509 15.0003 12.7745 14.9713L20.6724 5.31232C20.696 5.28326 20.7386 5.27898 20.7677 5.3028C20.7965 5.32638 20.8008 5.36902 20.7772 5.39808L12.8795 15.057L12.8269 15.0818Z" fill="#2F2F2F"/>
<path d="M15.4777 14.3748L15.4367 14.3607C15.4069 14.3378 15.4015 14.2954 15.4241 14.2657C17.7503 11.2324 20.2135 8.24329 22.7453 5.3811C22.7703 5.35276 22.8132 5.35038 22.8409 5.37515C22.869 5.39992 22.8716 5.44256 22.8468 5.47067C20.3169 8.33047 17.8558 11.3175 15.5315 14.3483L15.4777 14.3748Z" fill="#2F2F2F"/>
<path d="M17.8021 14.0613L17.7583 14.0451C17.7297 14.0208 17.7264 13.9781 17.7504 13.9496L25.0688 5.34013C25.0931 5.31155 25.1357 5.30821 25.1641 5.33227C25.1927 5.35656 25.1962 5.3992 25.1719 5.42779L17.8535 14.0375L17.8021 14.0613Z" fill="#2F2F2F"/>
<path d="M19.7194 14.5359L19.6751 14.5195C19.6467 14.4949 19.6436 14.4523 19.6682 14.4239C22.2352 11.4603 24.9002 8.51448 27.5887 5.66801C27.6145 5.6411 27.6573 5.63966 27.6845 5.66539C27.7116 5.69112 27.7128 5.73399 27.6871 5.76115C25 8.60595 22.3365 11.5503 19.7706 14.5125L19.7194 14.5359Z" fill="#2F2F2F"/>
<path d="M24.2978 11.7917L24.252 11.7741C24.2244 11.7489 24.2225 11.7062 24.2477 11.6786C25.5766 10.2225 26.9522 8.77163 28.3355 7.36626C28.3617 7.33958 28.4045 7.33911 28.4312 7.36555C28.4579 7.39176 28.4584 7.43486 28.4322 7.4613C27.0499 8.86548 25.6755 10.3149 24.3475 11.7698L24.2978 11.7917Z" fill="#2F2F2F"/>
<path d="M3.3816 6.43237L3.34094 6.4188C3.31107 6.39617 3.30512 6.35377 3.32755 6.32376L4.06745 5.34119C4.08988 5.31142 4.13212 5.3057 4.16227 5.32809C4.19214 5.35048 4.1981 5.39288 4.17556 5.42289L3.43577 6.40522L3.3816 6.43237Z" fill="#2F2F2F"/>
<path d="M1.84128 25.0398C1.80584 25.0398 1.77606 25.0122 1.77375 24.9764C1.40352 19.2239 1.39523 13.3902 1.74908 7.63727C1.75132 7.59987 1.78285 7.57248 1.82082 7.57367C1.85812 7.57606 1.88652 7.60821 1.88418 7.64537C1.5307 13.3931 1.53899 19.2209 1.90893 24.9676C1.91136 25.005 1.88297 25.0372 1.84576 25.0396L1.84128 25.0398Z" fill="#2F2F2F"/>
<path d="M3.20262 25.4227C3.1667 25.4227 3.13674 25.3946 3.13497 25.3584L2.36605 9.3222C2.36426 9.28504 2.39301 9.25312 2.43043 9.25146C2.46642 9.24812 2.49946 9.27837 2.50122 9.31577L3.27017 25.3517C3.27203 25.3894 3.24328 25.4211 3.20586 25.4227H3.20262Z" fill="#2F2F2F"/>
<path d="M3.75766 26.0164C2.77862 26.0164 1.80351 25.963 0.619662 25.5769C0.546821 24.1284 0.502707 22.668 0.473766 21.2121C0.481412 21.2076 0.489225 21.2036 0.497038 21.1995C0.486604 21.0814 0.476576 20.9635 0.466786 20.8453C0.439536 19.3485 0.427151 17.8576 0.415074 16.391C0.393112 13.7544 0.370483 11.0282 0.901332 8.41089C1.09001 7.48073 1.46815 6.51459 1.91553 5.8181C1.9948 5.83216 2.07119 5.86098 2.13827 5.90433C2.28669 6.68753 2.60285 7.43785 3.05786 8.07598C3.11805 8.21247 3.17229 8.32919 3.2189 8.44757C3.24599 8.65004 3.27243 8.8518 3.29846 9.05307C3.25716 9.15169 3.18663 9.22981 3.10121 9.28389C3.24589 9.64118 3.37578 10.0149 3.47647 10.4946C3.51694 10.8374 3.55593 11.1804 3.59342 11.5218C3.58609 11.5418 3.57723 11.5615 3.56663 11.5811L3.56105 11.5887C3.59195 11.7392 3.62134 11.89 3.64926 12.041C4.10574 16.3679 4.32457 20.6112 4.34218 25.3268C4.34189 25.3268 4.3416 25.327 4.34141 25.327C4.3416 25.3275 4.34189 25.3277 4.34218 25.328C4.34292 25.5347 4.3433 25.742 4.3433 25.9504C4.3433 25.9718 4.34663 25.9925 4.35287 26.0121L4.31231 26.0125C4.1263 26.0145 3.94198 26.0164 3.75766 26.0164ZM2.61374 14.4845L3.13518 25.358C3.13694 25.3942 3.16691 25.4223 3.20283 25.4223H3.20607C3.24349 25.4206 3.27224 25.3889 3.27038 25.3513L2.75006 14.4985C2.79984 14.5107 2.84767 14.5304 2.89103 14.5576C2.88043 14.4566 2.8714 14.3556 2.86004 14.2548C2.80589 13.7434 2.74317 13.2363 2.66509 12.7278L2.50143 9.31533C2.49976 9.2796 2.46989 9.25078 2.43602 9.25078C2.43426 9.25078 2.43249 9.25078 2.43064 9.25102C2.39321 9.25268 2.36446 9.2846 2.36625 9.32176L2.47873 11.6683C2.39815 11.265 2.30501 10.8581 2.19625 10.4446C2.27097 11.2502 2.35034 12.0551 2.43118 12.8597C2.48618 13.4019 2.54647 13.9433 2.60881 14.4845C2.6105 14.4845 2.61217 14.4845 2.61374 14.4845ZM3.27688 21.4804C3.32219 22.3286 3.36416 23.1768 3.4157 24.0248C3.4344 24.3718 3.44836 24.7191 3.46222 25.0667C3.55155 25.0762 3.64609 25.0874 3.7478 25.101C3.73468 25.0724 3.72434 25.0426 3.717 25.0119C3.7115 24.9716 3.70621 24.9314 3.7008 24.8913C3.7008 24.8933 3.7008 24.8952 3.7009 24.8973C3.67465 24.7084 3.65038 24.5193 3.62675 24.3302C3.54319 23.6065 3.46206 22.8824 3.39329 22.1571C3.35801 22.0925 3.33726 22.0201 3.33746 21.946C3.34396 21.9941 3.34677 22.0142 3.34677 22.0142C3.34687 22.0142 3.29084 21.5983 3.27883 21.4949L3.27688 21.4804ZM1.50585 18.2192C1.54018 20.4773 1.6295 22.7328 1.77383 24.9757C1.77614 25.0114 1.80591 25.039 1.84136 25.039L1.84583 25.0388C1.88304 25.0364 1.91143 25.0043 1.909 24.9669C1.74489 22.4177 1.65192 19.8523 1.63015 17.285C1.64058 17.2178 1.65127 17.1509 1.66235 17.0837C1.65054 16.9634 1.63863 16.8431 1.62662 16.7228C1.61312 13.6901 1.69901 10.6564 1.88426 7.64461C1.88659 7.60745 1.8582 7.57529 1.8209 7.57291C1.82006 7.57291 1.81923 7.57291 1.8184 7.57291C1.78155 7.57291 1.75139 7.60007 1.74915 7.63651C1.59061 10.2138 1.50483 12.8071 1.49161 15.4022C1.43652 14.8723 1.38052 14.3425 1.32506 13.8125C1.32404 13.8721 1.32356 13.9295 1.32394 13.9828C1.34905 15.3994 1.4141 16.8152 1.50473 18.2294C1.50509 18.2261 1.50547 18.2228 1.50585 18.2192ZM1.8516 22.6075C1.91115 23.2723 1.96977 23.9369 2.02532 24.6017C2.02791 24.6608 2.0338 24.7232 2.04001 24.7868C2.0776 24.8073 2.11464 24.8254 2.15168 24.842C2.13344 24.7165 2.11576 24.5907 2.10283 24.4645C2.04523 23.8449 2.00912 23.224 1.98065 22.6027C1.95264 22.6073 1.92456 22.6097 1.89655 22.6097C1.88157 22.6097 1.86668 22.6089 1.8516 22.6075Z" fill="#DEDEDE"/>
<path d="M3.90244 26.3689C3.83906 26.3689 3.77467 26.3615 3.71205 26.357C3.40975 26.3398 3.10679 26.331 2.80494 26.3063C2.18191 26.2741 1.5625 26.1016 1.10444 25.7284C1.05671 25.742 1.0074 25.7493 0.958167 25.7493C0.85155 25.7493 0.745194 25.715 0.655775 25.6364C0.470147 25.5111 0.429201 25.2639 0.404833 25.0564C0.377274 24.8278 0.366769 24.5974 0.357098 24.3676C0.283495 24.0167 0.261248 23.6544 0.261915 23.2969C0.257436 22.7576 0.227208 22.2192 0.20496 21.6807C0.202268 21.4625 0.317272 21.3019 0.473577 21.2126C0.502518 22.6685 0.546633 24.1289 0.619474 25.5774C1.80332 25.9635 2.77843 26.0168 3.75747 26.0168C3.94179 26.0168 4.12611 26.0149 4.31212 26.013L4.35268 26.0126C4.36319 26.0457 4.38208 26.0752 4.40683 26.0985C4.34516 26.1912 4.25292 26.2686 4.12704 26.3167C4.05727 26.3577 3.98059 26.3689 3.90244 26.3689ZM0.466597 20.8458C0.302193 18.8526 0.23614 16.8505 0.191931 14.8513C0.163561 13.4273 0.336065 12.0103 0.487726 10.5971C0.630097 9.12097 0.952022 7.6751 1.25089 6.22543C1.32497 5.94364 1.56483 5.80906 1.8046 5.80906C1.84174 5.80906 1.87878 5.81215 1.91534 5.81858C1.46796 6.51508 1.08982 7.48121 0.901143 8.41138C0.370295 11.0287 0.392924 13.7549 0.414885 16.3915C0.426962 17.8581 0.439347 19.349 0.466597 20.8458Z" fill="#2F2F2F"/>
<path d="M3.05777 8.07593C2.60277 7.43779 2.2866 6.68747 2.13818 5.90428C2.1768 5.92953 2.21243 5.9593 2.2438 5.99384L2.26381 6.00432C2.48805 6.1227 2.52852 6.38186 2.57849 6.60696C2.63702 6.85159 2.69619 7.0967 2.77722 7.33513C2.87903 7.65861 2.97402 7.88656 3.05777 8.07593Z" fill="#2F2F2F"/>
<path d="M4.40686 26.0985C4.38211 26.0752 4.36322 26.0456 4.35272 26.0125C4.34648 25.993 4.34314 25.9723 4.34314 25.9508C4.34314 25.7424 4.34276 25.5352 4.34202 25.3284C4.52384 25.538 4.56124 25.8665 4.40686 26.0985ZM4.34202 25.3272C4.32442 20.6116 4.10559 16.3683 3.6491 12.0415C3.75629 12.6215 3.84181 13.206 3.9115 13.7925C4.34193 16.9422 4.18662 20.1326 4.49833 23.2911C4.53508 23.702 4.55797 24.1136 4.59053 24.5247C4.59408 24.7293 4.674 24.9525 4.56021 25.14C4.51005 25.2286 4.43116 25.2905 4.34202 25.3272ZM3.59327 11.5222C3.55578 11.1809 3.51678 10.8379 3.47631 10.4951C3.49763 10.5966 3.51762 10.7028 3.53615 10.8143C3.55837 11.0472 3.6759 11.2964 3.59327 11.5222ZM3.29831 9.05352C3.27227 8.85224 3.24583 8.65049 3.21875 8.44802C3.2677 8.57236 3.30817 8.69837 3.33814 8.85129C3.33785 8.92561 3.32353 8.9935 3.29831 9.05352Z" fill="#2F2F2F"/>
<path d="M1.84096 25.0398C1.80551 25.0398 1.77574 25.0122 1.77343 24.9764C1.6291 22.7336 1.53978 20.4781 1.50545 18.2199C1.54016 17.9077 1.58175 17.5961 1.62975 17.2857C1.65152 19.853 1.74449 22.4184 1.9086 24.9676C1.91103 25.005 1.88264 25.0372 1.84543 25.0396L1.84096 25.0398ZM1.62622 16.7236C1.5822 16.2831 1.53699 15.8432 1.49121 15.403C1.50443 12.8078 1.5902 10.2146 1.74875 7.63727C1.75099 7.60082 1.78115 7.57367 1.81799 7.57367C1.81883 7.57367 1.81966 7.57367 1.8205 7.57367C1.8578 7.57605 1.88619 7.60821 1.88386 7.64537C1.69861 10.6571 1.61272 13.6908 1.62622 16.7236Z" fill="#2F2F2F"/>
<path d="M3.20262 25.4227C3.1667 25.4227 3.13674 25.3946 3.13497 25.3584L2.61353 14.4849C2.61846 14.4847 2.62339 14.4847 2.62823 14.4847C2.66927 14.4847 2.71022 14.4894 2.74985 14.499L3.27017 25.3517C3.27203 25.3894 3.24328 25.4211 3.20586 25.4227H3.20262ZM2.66489 12.7282C2.61094 12.3764 2.54953 12.0241 2.47852 11.6687L2.36605 9.3222C2.36426 9.28504 2.39301 9.25312 2.43043 9.25146C2.43229 9.25122 2.43405 9.25122 2.43581 9.25122C2.46968 9.25122 2.49956 9.28004 2.50122 9.31577L2.66489 12.7282Z" fill="#2F2F2F"/>
<path d="M3.71678 25.0123C3.70776 24.9749 3.70133 24.9366 3.70068 24.8978C3.7059 24.9359 3.71128 24.9742 3.71678 25.0123Z" fill="#DEDEDE"/>
<path d="M3.71676 25.0123C3.71126 24.9742 3.70587 24.9359 3.70066 24.8978C3.70056 24.8956 3.70056 24.8937 3.70056 24.8918C3.70597 24.9318 3.71126 24.9721 3.71676 25.0123Z" fill="#C1C1C1"/>
<path d="M16.887 19.7448C16.78 19.7448 16.6743 19.7419 16.5706 19.7371C15.9547 19.7259 15.3275 19.7119 14.7267 19.5651C14.6772 19.5432 14.6281 19.5201 14.5783 19.4982C14.4531 19.4434 14.3756 19.4158 14.242 19.3479C14.0164 19.2336 13.8564 19.1231 13.693 18.9377C13.677 18.9196 13.6563 18.9065 13.6341 18.897C13.4462 18.6057 13.3195 18.2713 13.1975 17.9514C13.1687 17.8756 13.1106 17.8163 13.0382 17.7949C13.011 17.7656 13.0034 17.7532 13.0105 17.7532C13.0112 17.7532 13.012 17.7532 13.0129 17.7534L13.017 17.7546C12.3324 17.3023 11.135 16.056 9.84506 15.0527C9.25459 14.5458 8.10362 13.8046 7.23753 13.0604C6.58975 12.504 5.91329 11.9812 5.31065 11.374C4.68343 10.7428 4.75386 10.7373 4.28871 10.1849C4.2112 10.1106 4.17947 10.0208 4.18097 9.93241C4.02224 9.70612 3.87782 9.50604 3.74197 9.32167C3.7202 9.14993 3.69805 8.97724 3.67554 8.80478C4.06494 9.20067 4.49303 9.54915 4.91157 9.89002L8.6015 12.8942C8.59135 12.9142 8.57944 12.933 8.56577 12.9504C8.84184 13.1524 9.12182 13.3487 9.40142 13.5456L13.8442 17.1629C13.8449 17.1634 13.8454 17.1639 13.8459 17.1643C13.8564 17.1805 13.8661 17.197 13.8747 17.2141C13.8828 17.2332 13.8902 17.2501 13.8969 17.2656C13.9011 17.4847 13.9073 17.6974 13.9157 17.9063C13.9297 18.2562 13.9781 18.6112 14.2363 18.8358C14.3978 18.9766 14.5945 19.0228 14.782 19.0578C15.3937 19.1724 16.0109 19.2298 16.6285 19.2298C17.1537 19.2298 17.6794 19.1881 18.2023 19.1052C18.3864 19.0759 18.5796 19.0363 18.7418 18.9037C18.9693 18.7179 19.0448 18.4197 19.0886 18.1524C19.1546 17.7491 19.1891 17.3368 19.1922 16.9238L26.2355 11.2444C27.214 10.4553 28.169 9.64014 28.7368 8.9084C28.7559 9.07918 28.7752 9.25355 28.7945 9.43005C28.6925 9.56344 28.5634 9.68326 28.4598 9.80617C28.0816 10.1756 27.6859 10.5272 27.3181 10.9078C26.5733 11.616 25.8199 12.3165 25.0481 12.9956C24.6453 13.2341 24.2763 13.5533 23.9202 13.8446C23.4831 14.2024 23.0644 14.5811 22.6445 14.9586C22.2255 15.3355 21.8179 15.7271 21.3844 16.0875C20.9563 16.4433 20.5157 16.7685 20.0645 17.0926C19.8339 17.2584 19.6722 17.4599 19.556 17.6858L19.5455 17.6903L19.55 17.6979C19.4114 17.9714 19.3385 18.2798 19.2913 18.6052L19.2901 18.6578C19.2401 18.7465 19.1858 18.8322 19.1186 18.9103C18.5948 19.5816 17.7066 19.7448 16.887 19.7448Z" fill="#DEDEDE"/>
<path d="M28.7945 9.43042C28.7752 9.25392 28.7559 9.07955 28.7368 8.90876C28.7706 8.86541 28.8028 8.82254 28.8338 8.77966C28.9255 8.86089 28.9798 8.98142 28.9529 9.11409C28.9276 9.23081 28.8681 9.33419 28.7945 9.43042Z" fill="#2F2F2F"/>
<path d="M13.846 17.1648C13.8455 17.1643 13.845 17.1638 13.8443 17.1634L9.4015 13.5461C9.85817 13.8679 10.3135 14.1914 10.7473 14.5444C11.6562 15.2568 11.9556 15.5181 12.6676 16.0436C13.1857 16.3961 13.7385 16.847 13.8088 17.0981L13.821 17.1269C13.8295 17.1395 13.8379 17.1519 13.846 17.1648ZM8.60158 12.8946L4.91165 9.89046C4.49311 9.5496 4.06502 9.20112 3.67562 8.80523C3.66278 8.70685 3.64984 8.60871 3.63672 8.5101C4.09694 8.92266 4.53704 9.35237 4.97194 9.79184C5.43233 10.257 5.89672 10.7144 6.42188 11.1062C6.89782 11.4616 7.38593 11.7984 7.8679 12.1455C8.13866 12.3403 8.39149 12.5507 8.63945 12.7672C8.63462 12.8115 8.62178 12.8551 8.60158 12.8946Z" fill="#2F2F2F"/>
<path d="M3.74212 9.32202C3.6461 9.19197 3.55435 9.06929 3.46467 8.95091C3.35495 8.77607 3.42558 8.56407 3.57055 8.45093C3.5927 8.47046 3.61476 8.49023 3.63679 8.51C3.64991 8.60862 3.66285 8.70676 3.67569 8.80513C3.6982 8.97759 3.72035 9.15028 3.74212 9.32202Z" fill="#2F2F2F"/>
<path d="M19.1921 16.9236C19.1926 16.8383 19.1918 16.7533 19.1899 16.668C19.193 16.6656 19.1964 16.663 19.1997 16.6604C19.3786 16.5158 19.5565 16.37 19.7352 16.2252C19.749 16.2278 19.7633 16.2295 19.7776 16.2295C19.8219 16.2295 19.8674 16.2154 19.9093 16.1816C21.0527 15.2569 22.1488 14.271 23.261 13.3096C23.6059 13.0114 23.9541 12.7175 24.3033 12.4245C24.4098 12.3361 24.5161 12.2473 24.6218 12.158C24.866 11.9543 25.1096 11.7504 25.354 11.5472C25.3638 11.5465 25.3736 11.5463 25.3833 11.5463C25.4024 11.5463 25.4212 11.5475 25.4398 11.5503C25.657 11.3543 25.8771 11.1613 26.1065 10.9784C26.3373 10.7755 26.5605 10.5642 26.7818 10.3507C27.3725 9.851 27.9685 9.35722 28.5635 8.86296C28.63 8.8077 28.6438 8.73981 28.6257 8.67883C28.7024 8.69193 28.7755 8.72766 28.8336 8.77911C28.8027 8.82199 28.7705 8.86486 28.7367 8.90821C28.1688 9.63996 27.2139 10.4551 26.2354 11.2442L19.1921 16.9236Z" fill="#2F2F2F"/>
<path d="M14.526 18.5476C14.5181 18.5419 14.5103 18.5357 14.5031 18.5293C14.4843 18.5131 14.4676 18.4945 14.4526 18.474L14.4988 18.4571L14.5017 18.4719C14.5077 18.4978 14.5162 18.5228 14.526 18.5476Z" fill="#DEDEDE"/>
<path d="M16.6286 19.2302C16.011 19.2302 15.3938 19.1728 14.7821 19.0582C14.5947 19.0232 14.3979 18.977 14.2364 18.8362C13.9782 18.6116 13.9298 18.2567 13.9158 17.9068C13.9075 17.6979 13.9013 17.4852 13.897 17.266C13.9932 17.4838 13.9741 17.373 14.0792 17.7803C14.0863 17.8463 14.134 17.9878 14.1471 18.0309L14.1473 18.0316C14.1664 18.0833 14.2328 18.1855 14.2678 18.2388C14.3338 18.3139 14.405 18.3849 14.4391 18.4797L14.4527 18.4747C14.4677 18.4951 14.4844 18.5137 14.5032 18.5299C14.5103 18.5364 14.5182 18.5425 14.5261 18.5483C14.5332 18.5657 14.5408 18.583 14.5484 18.6004C14.5582 18.6231 14.5708 18.6443 14.5849 18.6645C14.6366 18.7021 14.6795 18.7464 14.7138 18.7953C14.7414 18.8098 14.7716 18.8186 14.8038 18.8186C14.844 18.8186 14.8898 18.8034 14.9238 18.7776C14.9567 18.7936 14.9929 18.8043 15.0308 18.8086C15.531 18.8665 16.0334 18.8813 16.536 18.8813C16.7823 18.8813 17.0288 18.8777 17.2751 18.8739C17.4652 18.871 17.6553 18.8644 17.8456 18.8589C18.0159 18.8541 18.1924 18.8601 18.3544 18.7989C18.5147 18.7379 18.6328 18.6088 18.6912 18.4568C18.741 18.433 18.781 18.3913 18.7996 18.3332C18.846 18.1888 18.8513 18.0288 18.8622 17.8784C18.8653 17.8356 18.867 17.7927 18.8691 17.7498C18.8958 17.7027 18.9251 17.6574 18.9634 17.6202C18.933 17.6007 18.9044 17.5793 18.8772 17.5557C18.8786 17.5073 18.8801 17.459 18.8813 17.4106C18.8877 17.1453 18.8884 16.8799 18.8884 16.6143C18.9289 16.6691 18.9975 16.7084 19.0702 16.7084C19.1102 16.7084 19.1516 16.6965 19.1902 16.6686C19.1921 16.7539 19.1928 16.839 19.1924 16.9242C19.1893 17.3373 19.1547 17.7496 19.0887 18.1529C19.0449 18.4201 18.9694 18.7183 18.7419 18.9041C18.5797 19.0368 18.3865 19.0763 18.2024 19.1056C17.6796 19.1885 17.1539 19.2302 16.6286 19.2302Z" fill="#2F2F2F"/>
<path d="M11.1826 4.43604C11.1508 4.17473 11.1355 3.92939 11.1364 3.69643C11.1622 3.68071 11.1903 3.66666 11.2211 3.65499C11.3109 3.6114 11.4107 3.60687 11.5115 3.60687C11.5253 3.60687 11.5391 3.60687 11.5532 3.60687C11.5672 3.60711 11.5813 3.60711 11.5953 3.60711C11.6377 3.60711 11.6799 3.60615 11.7209 3.6021C11.9178 3.59996 12.1163 3.59115 12.314 3.59115C12.4586 3.59115 12.6027 3.59591 12.7458 3.61092C12.7825 3.61735 12.8173 3.62878 12.8494 3.6445C12.8547 3.73716 12.8625 3.82959 12.8706 3.92153C12.8856 4.09446 12.9002 4.26215 12.8949 4.42079C12.3268 4.42556 11.7556 4.43056 11.1826 4.43604Z" fill="#DEDEDE"/>
<path d="M11.0459 4.4375C10.8652 4.22431 10.8705 3.86011 11.1364 3.69647C11.1355 3.92943 11.1509 4.17477 11.1827 4.43607C11.1372 4.43655 11.0914 4.43702 11.0459 4.4375ZM12.895 4.42083C12.9002 4.26219 12.8857 4.0945 12.8707 3.92156C12.8626 3.82962 12.8547 3.7372 12.8495 3.64454C13.0977 3.7653 13.1987 4.13404 13.0079 4.35032C12.9903 4.37748 12.9703 4.40058 12.9486 4.42035C12.9307 4.42059 12.9129 4.42059 12.895 4.42083Z" fill="#2F2F2F"/>
<path d="M11.4053 4.60132C11.2511 4.60132 11.1288 4.53533 11.0459 4.43743C11.0914 4.43696 11.1372 4.43648 11.1827 4.436C11.7557 4.43053 12.3269 4.42553 12.895 4.42076C12.9128 4.42052 12.9307 4.42052 12.9486 4.42029C12.7999 4.55558 12.5627 4.53891 12.37 4.54486C12.0506 4.56582 11.7311 4.58393 11.4117 4.60132C11.4096 4.60132 11.4074 4.60132 11.4053 4.60132Z" fill="#2F2F2F"/>
<path d="M18.5229 4.37085C18.5301 4.29201 18.5389 4.21221 18.5475 4.13218C18.568 3.94591 18.5887 3.75749 18.5911 3.56979C18.617 3.56527 18.6432 3.56169 18.669 3.55812C18.8867 3.52215 19.1053 3.49166 19.3247 3.46689C19.4169 3.45069 19.5115 3.44069 19.6029 3.44069C19.7945 3.44069 19.9729 3.48475 20.087 3.60957C20.1046 3.81275 20.122 4.02642 20.1196 4.23818C20.0855 4.28272 20.0438 4.32059 19.9967 4.35204C19.5046 4.35894 19.0129 4.36513 18.5229 4.37085Z" fill="#DEDEDE"/>
<path d="M18.2777 4.37378C18.1212 4.16893 18.1086 3.85379 18.3632 3.67014C18.4251 3.60845 18.5073 3.58439 18.5911 3.56986C18.5888 3.75756 18.568 3.94598 18.5476 4.13225C18.539 4.21228 18.5302 4.29207 18.523 4.37092C18.4411 4.37187 18.3594 4.37283 18.2777 4.37378ZM20.1197 4.23825C20.122 4.02649 20.1047 3.81282 20.087 3.60964C20.158 3.68753 20.2042 3.79663 20.213 3.94598C20.2145 4.06293 20.1792 4.16036 20.1197 4.23825Z" fill="#2F2F2F"/>
<path d="M18.6623 4.57092C18.5027 4.57092 18.3669 4.49017 18.2778 4.37346C18.3595 4.3725 18.4412 4.37155 18.5232 4.37059C19.0132 4.36488 19.5048 4.35869 19.9969 4.35178C19.8852 4.4261 19.743 4.46373 19.6013 4.46373C19.5844 4.46373 19.5674 4.46326 19.5505 4.46206C19.0408 4.50399 19.2156 4.49184 18.8023 4.55067C18.754 4.56449 18.7073 4.57092 18.6623 4.57092Z" fill="#2F2F2F"/>
</svg>

      </div>
        <h2 className="text-[#606062] font-medium text-[12px] uppercase tracking-wide">
          APPLICANT DETAILS
        </h2>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden">
              <div className="w-full h-full bg-gray-300"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden">
              <div className="w-full h-full bg-gray-300"></div>
            </div>
          </div>
          <span className="ml-5 text-[16px] text-[#0E0A1F] font-medium">2 applicants</span>
        </div>
        <div className="h-6 w-px bg-gray-300 mx-4"></div>
        <div className="text-[#960000] text-[14px] font-medium text-right whitespace-nowrap">
          1 KYC Pending
        </div>
      </div>
    </div>
  </div>
</div> */}

                      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

                      {/* <div className="bg-white rounded-2xl shadow-lg  p-6">
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-4 ">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.150879 2.40428V21.7649L15.3244 21.4459L15.5012 2.12979L0.150879 2.40428Z" fill="white"/>
<path d="M0.300844 2.55233V21.6118L15.1757 21.2993L15.3497 2.28308L0.300844 2.55233ZM0.150815 21.9154C0.111601 21.9154 0.0737874 21.9001 0.0456025 21.8725C0.0167172 21.8443 0.000610352 21.8056 0.000610352 21.7654V2.40475C0.000610352 2.32282 0.0660864 2.25612 0.148015 2.25455L15.4985 1.98005C15.5389 1.9811 15.5782 1.99511 15.6069 2.02364C15.6357 2.052 15.6517 2.09122 15.6513 2.13165L15.4747 21.4478C15.4738 21.529 15.4087 21.5949 15.3276 21.5966L0.153965 21.9154H0.150815Z" fill="#2F2F2F"/>
<path d="M19.8533 1.44539C19.9741 1.15391 20.0949 0.862258 20.2157 0.570605C20.2736 0.430556 20.34 0.280702 20.4732 0.204725C20.5978 0.133825 20.7529 0.144329 20.8951 0.167612C21.0661 0.195622 21.2592 0.25952 21.3189 0.419176C21.3746 0.567804 21.2881 0.727985 21.2034 0.862783C21.0066 1.17544 20.8028 1.4839 20.5922 1.78781C20.5472 1.85258 20.4998 1.91928 20.431 1.95902C20.3741 1.99193 20.3065 2.00366 20.2404 2.00366C20.0854 2.00349 19.9266 1.93504 19.8402 1.80882C19.7537 1.6826 19.7537 1.49896 19.8533 1.44539Z" fill="white"/>
<path d="M19.9315 1.57329C19.9227 1.59464 19.923 1.66414 19.9638 1.72366C20.0179 1.80227 20.1265 1.85304 20.2404 1.85321H20.241C20.2886 1.85321 20.3281 1.84481 20.3558 1.8287C20.3945 1.80629 20.4283 1.76008 20.4685 1.70213C20.6765 1.40225 20.8808 1.09292 21.0762 0.782531C21.1439 0.674868 21.2089 0.5539 21.1782 0.471621C21.1509 0.39897 21.0419 0.343475 20.8708 0.315465C20.7663 0.298484 20.635 0.285181 20.5475 0.335074C20.4601 0.384792 20.4083 0.497006 20.3542 0.627777L19.992 1.50274C19.9798 1.53215 19.9586 1.55683 19.9315 1.57329ZM20.2411 2.15344H20.2401C20.0269 2.15344 19.8262 2.05383 19.7163 1.89347C19.6379 1.77951 19.6079 1.63211 19.6379 1.50886C19.6536 1.44374 19.6858 1.38895 19.7305 1.34903L20.0768 0.51276C20.1317 0.379888 20.2149 0.178918 20.3987 0.0740559C20.5685 -0.0224032 20.7661 -0.00594759 20.9193 0.0190864C21.2092 0.0665281 21.3909 0.183294 21.4596 0.366409C21.5466 0.598891 21.4006 0.830848 21.3304 0.942363C21.1327 1.2566 20.9258 1.56979 20.7154 1.87317C20.6693 1.93952 20.6061 2.0309 20.5062 2.08884C20.4318 2.13173 20.3427 2.15344 20.2411 2.15344Z" fill="#2F2F2F"/>
<path d="M3.352 0.571347C3.1379 0.62124 2.89737 0.691088 2.80003 0.884706C2.75189 0.980465 2.74839 1.0911 2.74594 1.19789C2.73333 1.74514 2.72073 2.29431 2.7813 2.83857C2.80283 3.03097 2.83802 3.23299 2.96441 3.38162C3.09081 3.53024 3.33747 3.59677 3.48873 3.47247C3.61442 3.36919 3.62667 3.18747 3.6293 3.02677C3.63805 2.4748 3.6468 1.92282 3.65556 1.37085C3.66028 1.07973 3.61775 0.716824 3.352 0.571347Z" fill="white"/>
<path d="M3.32353 0.732205C3.15915 0.773695 2.99406 0.831816 2.93384 0.951558C2.90023 1.01878 2.89796 1.11157 2.89585 1.2012C2.8836 1.73496 2.87082 2.28711 2.93034 2.82157C2.9482 2.9821 2.97586 3.16329 3.07844 3.28391C3.15354 3.37214 3.31075 3.42378 3.39303 3.35603C3.46831 3.29424 3.47671 3.15244 3.47864 3.02412L3.50525 1.36803C3.51032 1.04714 3.44922 0.833741 3.32353 0.732205ZM3.29674 3.68848C3.12834 3.68848 2.95713 3.60497 2.84964 3.4784C2.69961 3.30211 2.65637 3.07453 2.63186 2.85483C2.57006 2.30024 2.58302 1.73794 2.59545 1.19402C2.59825 1.08268 2.60158 0.944204 2.66565 0.816759C2.80237 0.544888 3.13744 0.46681 3.31758 0.424795C3.35347 0.416217 3.39128 0.42147 3.42366 0.439327C3.68451 0.582177 3.813 0.896063 3.80548 1.37276L3.77904 3.02884C3.77677 3.17012 3.77257 3.43289 3.58367 3.58817C3.49894 3.65784 3.39828 3.68848 3.29674 3.68848Z" fill="#2F2F2F"/>
<path d="M8.09304 0.571347C7.87894 0.62124 7.63841 0.691088 7.54107 0.884706C7.49293 0.980465 7.4896 1.0911 7.48715 1.19789C7.47437 1.74514 7.46177 2.29431 7.52252 2.83857C7.54387 3.03097 7.57906 3.23299 7.70545 3.38162C7.83185 3.53024 8.07851 3.59677 8.22994 3.47247C8.35546 3.36919 8.36771 3.18747 8.37034 3.02677C8.37909 2.4748 8.38785 1.92282 8.39677 1.37085C8.40133 1.07973 8.35896 0.716824 8.09304 0.571347Z" fill="white"/>
<path d="M8.06525 0.732205C7.90087 0.773695 7.73578 0.831816 7.67556 0.951558C7.6416 1.01913 7.6395 1.11156 7.63757 1.20102C7.62515 1.73426 7.61236 2.28553 7.67189 2.82157C7.68974 2.9821 7.71758 3.16329 7.82016 3.28391C7.89509 3.37214 8.05229 3.42396 8.13475 3.35603C8.20968 3.29441 8.21843 3.15244 8.22035 3.02412L8.24661 1.36803C8.25186 1.04714 8.19077 0.833741 8.06525 0.732205ZM8.03829 3.68848C7.86988 3.68848 7.69884 3.60497 7.59136 3.4784C7.44133 3.30229 7.39791 3.07453 7.3734 2.85501C7.31161 2.29883 7.32456 1.73724 7.33717 1.19402C7.33979 1.08303 7.34294 0.944555 7.40737 0.816759C7.54391 0.544888 7.87916 0.46681 8.05912 0.424795C8.09518 0.416217 8.133 0.42147 8.16538 0.439327C8.42623 0.582177 8.55472 0.896238 8.54702 1.37276L8.52076 3.02884C8.51831 3.17029 8.51411 3.43306 8.32539 3.58817C8.24048 3.65802 8.13983 3.68848 8.03829 3.68848Z" fill="#2F2F2F"/>
<path d="M12.8347 0.571347C12.6206 0.62124 12.38 0.691088 12.2827 0.884706C12.2346 0.980465 12.2311 1.0911 12.2286 1.19789C12.216 1.74514 12.2034 2.29431 12.264 2.83857C12.2855 3.03097 12.3207 3.23299 12.4471 3.38162C12.5733 3.53024 12.8201 3.59677 12.9714 3.47247C13.0969 3.36919 13.1093 3.18747 13.1118 3.02677C13.1207 2.4748 13.1295 1.92282 13.1382 1.37085C13.1428 1.07973 13.1004 0.716824 12.8347 0.571347Z" fill="white"/>
<path d="M12.8071 0.732381C12.6425 0.77387 12.4774 0.831991 12.4172 0.951734C12.3834 1.01913 12.3811 1.11174 12.3792 1.20137C12.3668 1.73514 12.3542 2.28728 12.4137 2.82174C12.4316 2.98228 12.459 3.16347 12.5618 3.28408C12.6367 3.37232 12.7941 3.42396 12.8766 3.35621C12.9517 3.29459 12.9601 3.15261 12.962 3.02429L12.9884 1.3682C12.9935 1.04732 12.9326 0.833917 12.8071 0.732381ZM12.7801 3.68848C12.6117 3.68848 12.4405 3.60497 12.333 3.47858C12.183 3.30229 12.1396 3.07471 12.1151 2.85501C12.0534 2.30041 12.0662 1.73811 12.0788 1.19419C12.0814 1.08285 12.0848 0.944555 12.1488 0.816935C12.2856 0.545064 12.6208 0.466986 12.8009 0.424971C12.8372 0.416393 12.8748 0.421821 12.907 0.439502C13.1715 0.584279 13.2964 0.889586 13.2888 1.37293L13.2624 3.02902C13.2601 3.17029 13.2559 3.43306 13.0672 3.58834C12.9821 3.65802 12.8816 3.68848 12.7801 3.68848Z" fill="#2F2F2F"/>
<path d="M16.2685 7.71581C15.3711 9.49041 14.6744 11.115 13.6711 13.0995C13.581 13.3645 13.4654 13.6227 13.4101 13.8967C13.3548 14.1709 13.3655 14.4709 13.515 14.7088C13.6643 14.9468 13.978 15.0973 14.2455 15.0013C14.4687 14.9215 14.604 14.7046 14.7217 14.5023C15.8871 12.4969 16.9138 10.3655 17.9831 8.30944L16.2685 7.71581Z" fill="white"/>
<path d="M13.8099 13.1577C13.7836 13.2342 13.7554 13.3104 13.7272 13.3863C13.6588 13.5708 13.594 13.7452 13.5574 13.9264C13.5179 14.1221 13.5005 14.4031 13.6421 14.6288C13.7479 14.7971 13.9893 14.934 14.195 14.86C14.3645 14.7992 14.4793 14.6203 14.5919 14.4267C15.4229 12.9968 16.1946 11.4803 16.9408 10.0138C17.2117 9.4814 17.4911 8.93241 17.7699 8.39444L16.3435 7.90077C15.9325 8.71848 15.5663 9.49785 15.1795 10.3205C14.759 11.215 14.3244 12.1401 13.8099 13.1577ZM14.0737 15.1805C13.8116 15.1805 13.5418 15.034 13.3878 14.7886C13.1933 14.4789 13.2125 14.1165 13.263 13.8669C13.3043 13.6626 13.3761 13.469 13.4457 13.2818C13.4741 13.205 13.5026 13.1283 13.5289 13.0509L13.5371 13.0315C14.0516 12.014 14.4868 11.0881 14.9077 10.1927C15.3138 9.32875 15.6974 8.51278 16.1345 7.64815C16.1685 7.5811 16.2471 7.54907 16.3176 7.57393L18.0323 8.16756C18.0735 8.18174 18.1066 8.21325 18.1227 8.25387C18.1388 8.29431 18.1367 8.34 18.1166 8.37869C17.8118 8.96427 17.5051 9.567 17.2085 10.15C16.4605 11.6201 15.6867 13.1404 14.8515 14.5776C14.7447 14.7616 14.5829 15.0399 14.2962 15.1427C14.2248 15.1683 14.1495 15.1805 14.0737 15.1805Z" fill="#2F2F2F"/>
<path d="M18.0225 8.78357C17.6832 8.64019 16.4251 8.05374 15.8915 7.70624C16.5222 6.63468 16.7369 5.95947 17.297 4.82839C17.5148 4.38846 18.325 2.82061 18.4939 2.48624C19.1672 1.15227 20.1252 1.43622 20.6488 1.80052C21.5831 2.45053 20.5236 3.71062 20.3324 4.0625C19.4643 5.66064 18.7586 7.02647 18.0225 8.78357Z" fill="#2F2F2F"/>
<path d="M16.0944 7.65557C16.6028 7.96106 17.5299 8.39994 17.9429 8.58463C18.6398 6.93764 19.3268 5.59877 20.2003 3.99048C20.2311 3.93358 20.2779 3.86233 20.337 3.77217C20.8064 3.05687 21.1588 2.33807 20.5629 1.92334C20.3633 1.78452 19.9647 1.56797 19.5354 1.67616C19.182 1.76561 18.8767 2.06077 18.6277 2.55339C18.5637 2.68031 18.4073 2.98474 18.226 3.33767C17.932 3.91012 17.5662 4.62245 17.4314 4.8945C17.2244 5.31237 17.0664 5.66459 16.9134 6.00544C16.6761 6.53378 16.4514 7.03445 16.0944 7.65557ZM18.0224 8.93335C18.0024 8.93335 17.9826 8.92932 17.9639 8.92162C17.6339 8.7821 16.3586 8.18934 15.8094 7.83169C15.742 7.78792 15.7212 7.69899 15.7618 7.62966C16.1539 6.96338 16.3789 6.46235 16.6394 5.88237C16.7934 5.53907 16.9527 5.18422 17.1623 4.7611C17.298 4.48713 17.6644 3.77375 17.9588 3.2006C18.1398 2.84837 18.2956 2.54481 18.3597 2.41807C18.6493 1.84439 19.0202 1.49672 19.4619 1.38503C20.0056 1.24743 20.4928 1.50862 20.7344 1.67686C21.6523 2.31548 20.9065 3.45181 20.5881 3.93708C20.535 4.01796 20.4892 4.08798 20.4643 4.13385C19.5473 5.82197 18.8763 7.13336 18.161 8.84127C18.1454 8.87803 18.116 8.90709 18.0791 8.92215C18.0609 8.92967 18.0416 8.93335 18.0224 8.93335Z" fill="#2F2F2F"/>
<path d="M19.2506 8.45972C19.1417 8.45972 19.0353 8.42978 18.9488 8.37078C18.7056 8.20483 18.6034 7.85995 18.7004 7.53224C18.7812 7.25879 18.9665 7.04206 19.1298 6.8509L20.6549 5.06527C20.9588 4.70971 21.2729 4.34173 21.4786 3.92439C21.7002 3.4743 21.7582 3.01792 21.6421 2.63908C21.511 2.21176 21.1274 1.88964 20.7299 1.87336C20.6469 1.87004 20.5825 1.80001 20.586 1.71721C20.5893 1.6344 20.6591 1.56893 20.7421 1.5733C21.2713 1.59501 21.7594 1.99713 21.9292 2.55103C22.0679 3.00339 22.0036 3.5382 21.748 4.05726C21.5257 4.50822 21.1992 4.89055 20.8834 5.26046L19.3582 7.04592C19.2142 7.21433 19.051 7.40532 18.9883 7.61749C18.9374 7.78975 18.9656 8.01874 19.1181 8.12272C19.1842 8.16771 19.2898 8.17191 19.3749 8.13217C19.4092 8.11642 19.4678 8.08018 19.4748 8.01611C19.4834 7.93366 19.5571 7.87343 19.6399 7.88271C19.7224 7.89129 19.7821 7.96534 19.7733 8.0478C19.757 8.2022 19.6578 8.33245 19.5011 8.40492C19.4216 8.44169 19.3353 8.45972 19.2506 8.45972Z" fill="#2F2F2F"/>
<path d="M13.3453 16.0189C13.3241 16.0189 13.3026 16.0144 13.2821 16.005C13.207 15.9699 13.1743 15.8808 13.2091 15.8056L13.6238 14.9118C13.6587 14.8366 13.748 14.8044 13.8232 14.839C13.8985 14.8738 13.9311 14.9631 13.8962 15.0384L13.4815 15.9319C13.4561 15.9867 13.4019 16.0189 13.3453 16.0189Z" fill="#2F2F2F"/>
<path d="M12.6784 6.49329L12.6739 6.49311C9.45728 6.39788 6.19499 6.38825 2.97753 6.46493C2.8977 6.46668 2.82575 6.40138 2.82365 6.3184C2.82172 6.2356 2.88737 6.16662 2.97018 6.1647C6.19324 6.08784 9.46095 6.0973 12.683 6.19306C12.7658 6.19551 12.8309 6.26466 12.8284 6.34764C12.8262 6.42886 12.7593 6.49329 12.6784 6.49329Z" fill="#2F2F2F"/>
<path d="M8.50371 9.65369C6.61374 9.65369 4.72062 9.60747 2.84326 9.51504C2.76045 9.51101 2.69656 9.44046 2.70076 9.35766C2.70478 9.27485 2.77183 9.21096 2.85814 9.21516C5.99245 9.36939 9.17069 9.39477 12.3052 9.29043H12.3103C12.3908 9.29043 12.4575 9.35433 12.4601 9.43556C12.4629 9.51854 12.398 9.58786 12.3152 9.59066C11.05 9.63268 9.77746 9.65369 8.50371 9.65369Z" fill="#2F2F2F"/>
<path d="M8.37263 12.8119C6.48407 12.8119 4.59234 12.7792 2.71621 12.714C2.63323 12.7111 2.56845 12.6416 2.57125 12.5588C2.57423 12.4758 2.64566 12.412 2.72654 12.4138C5.78399 12.5202 8.88451 12.5398 11.9414 12.4723H11.9448C12.0262 12.4723 12.093 12.5374 12.0948 12.6191C12.0965 12.702 12.0309 12.7708 11.9481 12.7727C10.7612 12.7988 9.56743 12.8119 8.37263 12.8119Z" fill="#2F2F2F"/>
<path d="M5.80052 15.7423C4.72966 15.7423 3.65986 15.7247 2.59618 15.6897C2.5132 15.6871 2.44826 15.6176 2.45088 15.5348C2.45368 15.452 2.52493 15.3839 2.60599 15.3897C5.13108 15.4725 7.69101 15.4566 10.2151 15.3424C10.298 15.3363 10.3681 15.4028 10.3717 15.4857C10.3756 15.5684 10.3115 15.6386 10.2285 15.6423C8.76029 15.7089 7.27944 15.7423 5.80052 15.7423Z" fill="#2F2F2F"/>
<path d="M2.48981 18.4473C2.40718 18.4473 2.33995 18.3806 2.3396 18.2979C2.33908 18.215 2.40595 18.1474 2.48893 18.1471L12.1741 18.098H12.1749C12.2576 18.098 12.3246 18.1649 12.3251 18.2475C12.3255 18.3305 12.2586 18.3981 12.1756 18.3984L2.49051 18.4473H2.48981Z" fill="#2F2F2F"/>
<path d="M17.7454 9.09668C17.7706 9.04731 17.796 8.99794 17.8214 8.94858C17.8072 9.01037 17.7806 9.05939 17.7454 9.09668ZM15.8834 8.15012C15.8934 8.08972 15.9205 8.0323 15.9634 7.98854C15.9365 8.04246 15.9099 8.09637 15.8834 8.15012Z" fill="#DEDEDE"/>
<path d="M17.3725 9.16602C17.3417 9.15621 17.3111 9.14326 17.2817 9.12733C17.017 9.02054 16.7768 8.86964 16.5471 8.70088C16.3947 8.60547 16.2248 8.54297 16.0612 8.46962C16.123 8.3434 16.1855 8.21683 16.2488 8.08921C16.6754 8.32152 17.2104 8.57938 17.5847 8.75217C17.5138 8.88994 17.4431 9.02807 17.3725 9.16602Z" fill="#DEDEDE"/>
<path d="M17.5132 9.18848C17.4672 9.18848 17.4196 9.18077 17.3726 9.16572C17.4432 9.02777 17.5139 8.88964 17.5848 8.75187C17.679 8.79546 17.763 8.83345 17.8325 8.86444C17.8323 8.88107 17.8306 8.8984 17.8274 8.9166C17.8259 8.92763 17.8238 8.93831 17.8215 8.94847C17.7961 8.99783 17.7707 9.0472 17.7455 9.09657C17.6863 9.15924 17.6028 9.18848 17.5132 9.18848ZM16.0612 8.46932C16.0476 8.46319 16.0339 8.45707 16.0205 8.45077C15.9068 8.38914 15.8645 8.26432 15.8836 8.15001C15.91 8.09626 15.9366 8.04235 15.9636 7.98843C15.9765 7.97512 15.9909 7.96322 16.0066 7.95289C16.0816 7.99648 16.1631 8.04234 16.2489 8.08891C16.1855 8.21653 16.123 8.3431 16.0612 8.46932Z" fill="#2F2F2F"/>
<path d="M17.8329 8.86462C17.7634 8.83364 17.6793 8.79565 17.5851 8.75206C17.2109 8.57927 16.6759 8.32141 16.2492 8.0891C16.1635 8.04253 16.0819 7.99667 16.007 7.95308C16.0315 7.93679 16.0595 7.92454 16.0905 7.91701C16.1157 7.91001 16.1416 7.90669 16.1675 7.90669C16.2193 7.90669 16.271 7.92016 16.3156 7.94642C16.438 7.99912 16.5596 8.05339 16.6815 8.10696L16.6944 8.11256L16.714 8.12026C16.9309 8.19886 17.1225 8.32683 17.325 8.43362C17.5188 8.53148 17.8374 8.60816 17.8329 8.86462Z" fill="#2F2F2F"/>
<path d="M17.9431 8.58484C17.8583 8.54685 17.7517 8.49818 17.6316 8.44234C17.6125 8.31489 17.6829 8.16574 17.7309 8.046C17.8492 7.78708 17.9865 7.53622 18.0971 7.2731C18.3305 6.75527 18.6065 6.25862 18.8602 5.75094C19.1424 5.17288 19.4327 4.59955 19.7441 4.03673C20.0953 3.38672 20.5201 2.79939 20.5053 2.33232C20.5023 2.18667 20.6175 2.09669 20.7379 2.08531C21.0726 2.51071 20.7504 3.14304 20.3372 3.77238C20.278 3.86254 20.2313 3.93379 20.2005 3.99069C19.3269 5.59898 18.64 6.93786 17.9431 8.58484Z" fill="#868686"/>
<path d="M17.913 8.67126C17.8504 8.67126 17.7886 8.65148 17.7399 8.60929C17.6727 8.56325 17.6412 8.50548 17.6317 8.44246C17.7518 8.4983 17.8584 8.54697 17.9431 8.58496C18.6401 6.93798 19.327 5.5991 20.2006 3.99081C20.2314 3.93391 20.2781 3.86266 20.3373 3.77251C20.7504 3.14316 21.0727 2.51084 20.738 2.08543C20.7466 2.08473 20.7552 2.08438 20.7637 2.08438C20.8562 2.08438 20.9472 2.1313 20.9862 2.23564C21.0249 2.31477 21.0031 2.4086 20.9992 2.49368C20.9815 2.66541 20.9406 2.83365 20.8763 2.994C20.3755 4.30207 19.5933 5.47726 18.9893 6.73701C18.7687 7.1589 18.5725 7.59236 18.3643 8.02039C18.3502 8.0498 18.3428 8.06468 18.3407 8.06853C18.2723 8.24271 18.2359 8.43773 18.1233 8.58636C18.0681 8.64133 17.9901 8.67126 17.913 8.67126Z" fill="#2F2F2F"/>
<path d="M15.1423 9.69336C15.0308 9.68268 14.9249 9.61493 14.8874 9.50587C14.8357 9.39803 14.8711 9.27129 14.8671 9.15557C14.8904 7.83 14.9182 6.50128 14.8396 5.17641C14.8081 4.25103 14.7794 3.32618 14.6971 2.4036C14.6957 2.36439 14.7018 2.32763 14.7136 2.29401L15.3359 2.28299C15.3413 2.29804 15.3457 2.31362 15.3492 2.32955L15.2846 9.3919C15.2372 9.49221 15.1897 9.59252 15.1423 9.69336Z" fill="#DEDEDE"/>
<path d="M15.2847 9.39209L15.3493 2.32974C15.3677 2.41167 15.3647 2.50182 15.3733 2.5848C15.4007 2.99007 15.4433 3.39464 15.4519 3.80114C15.4664 4.88337 15.597 5.9614 15.5492 7.04486C15.5364 7.51472 15.5534 7.98459 15.5513 8.45428C15.5473 8.61166 15.5243 8.76729 15.5079 8.92362C15.4331 9.0796 15.3589 9.23558 15.2847 9.39209ZM14.7136 2.2942C14.7607 2.1601 14.9004 2.07432 15.0391 2.07432C15.1201 2.07432 15.2008 2.10356 15.2626 2.16956C15.2983 2.20264 15.3211 2.24133 15.336 2.28317L14.7136 2.2942Z" fill="#2F2F2F"/>
<path d="M15.1732 9.69507C15.1629 9.69507 15.1524 9.69454 15.1422 9.69349C15.1897 9.59266 15.2371 9.49235 15.2845 9.39204C15.3588 9.23553 15.433 9.07955 15.5077 8.92357C15.4997 8.99902 15.4932 9.07465 15.4911 9.15063C15.4824 9.35615 15.5002 9.61944 15.252 9.68492C15.2264 9.69174 15.1998 9.69507 15.1732 9.69507Z" fill="#2F2F2F"/>
<path d="M14.668 21.3101C14.6586 21.2866 14.6528 21.2612 14.6511 21.2342C14.6318 21.1336 14.6848 21.035 14.6955 20.9351C14.7312 20.4065 14.7782 20.2863 14.7612 19.7098C14.7244 19.151 14.6285 18.5971 14.626 18.0355C14.6164 17.6831 14.6374 17.3307 14.6369 16.9783C14.6227 16.5173 14.6192 16.0557 14.6397 15.5951C14.5455 15.6324 14.4403 15.6543 14.3372 15.6543C14.1633 15.6543 13.9956 15.5923 13.8976 15.4388C13.8461 15.3312 13.8365 15.233 13.8577 15.1484C13.9286 15.1696 14.0014 15.1808 14.0737 15.1808C14.1495 15.1808 14.2248 15.1685 14.2962 15.143C14.583 15.0402 14.7447 14.7619 14.8515 14.5778C14.9839 14.3503 15.1145 14.1206 15.2438 13.8893L15.1761 21.2993L14.668 21.3101Z" fill="#DEDEDE"/>
<path d="M14.9472 21.4889C14.8299 21.4889 14.7116 21.4185 14.668 21.3096L15.176 21.2989L15.2437 13.8889C15.2716 13.8392 15.2992 13.7893 15.3271 13.7396C15.4123 13.7842 15.4776 13.8663 15.4892 13.9833C15.5065 14.1398 15.4291 14.2926 15.4045 14.4477C15.3708 14.7544 15.4136 15.0636 15.3962 15.371C15.3607 16.0988 15.3446 16.8259 15.3525 17.5546C15.3642 18.1475 15.4146 18.7385 15.4241 19.3314C15.4244 19.8081 15.4337 20.5087 15.3696 20.7036C15.3411 20.8989 15.3178 21.0976 15.2275 21.2762L15.2418 21.2426C15.2332 21.2622 15.2203 21.2911 15.2084 21.3164C15.183 21.3713 15.1401 21.4148 15.0892 21.4492C15.0458 21.4764 14.9966 21.4889 14.9472 21.4889Z" fill="#2F2F2F"/>
<path d="M14.111 14.8787C14.1502 14.8624 14.1924 14.8501 14.2365 14.8421C14.2228 14.8489 14.209 14.8549 14.1948 14.86C14.1673 14.8698 14.1393 14.8759 14.111 14.8787ZM14.8116 14.044C14.8212 14.009 14.8315 13.9742 14.8425 13.9393C14.865 13.8539 14.9141 13.7919 14.9759 13.7523C14.9213 13.8499 14.8667 13.947 14.8116 14.044Z" fill="#DEDEDE"/>
<path d="M14.0734 15.1805C14.0011 15.1805 13.9283 15.1693 13.8574 15.1481C13.8882 15.0255 13.9838 14.9314 14.1109 14.8787C14.1393 14.8759 14.1673 14.8698 14.1948 14.86C14.2089 14.8549 14.2228 14.849 14.2364 14.8421C14.2762 14.8349 14.3175 14.8313 14.3597 14.8313C14.3649 14.8313 14.37 14.8313 14.3751 14.8313C14.3782 14.8313 14.3812 14.8313 14.3842 14.8313C14.3991 14.8313 14.4134 14.8323 14.4276 14.8341L14.4407 14.8223C14.4656 14.7975 14.5013 14.7549 14.5256 14.7257C14.5995 14.6244 14.651 14.5088 14.7329 14.4131C14.7527 14.289 14.7781 14.1659 14.8115 14.044C14.8667 13.9471 14.9213 13.8499 14.9759 13.7524C15.0312 13.7172 15.0963 13.6999 15.1616 13.6999C15.2191 13.6999 15.2765 13.7133 15.3269 13.7398C15.2991 13.7895 15.2714 13.8394 15.2436 13.8891C15.1142 14.1204 14.9836 14.35 14.8512 14.5776C14.7445 14.7616 14.5827 15.0399 14.296 15.1427C14.2245 15.1683 14.1493 15.1805 14.0734 15.1805Z" fill="#2F2F2F"/>
<path d="M3.29661 3.38721C3.21888 3.38721 3.1296 3.34397 3.07848 3.28392C2.97589 3.1633 2.94823 2.98211 2.93038 2.82158C2.92215 2.74683 2.91515 2.67173 2.90955 2.59645C2.96084 2.56442 3.02071 2.54638 3.08058 2.54638C3.16531 2.54638 3.25004 2.58262 3.31096 2.667C3.3381 2.69676 3.35631 2.73142 3.36593 2.77134C3.44314 3.0159 3.40234 2.95708 3.4771 3.08452C3.47254 3.19464 3.45661 3.30388 3.39306 3.35605C3.36681 3.37775 3.33302 3.38721 3.29661 3.38721Z" fill="#DEDEDE"/>
<path d="M3.21717 3.6123C3.15292 3.6123 3.08674 3.59077 3.02617 3.54088C2.94792 3.49344 2.92008 3.40065 2.88595 3.32065C2.83798 3.19548 2.80787 3.06436 2.77461 2.93464C2.73277 2.78846 2.80279 2.66294 2.90958 2.59677C2.91518 2.67205 2.92219 2.74715 2.93041 2.8219C2.94827 2.98243 2.97593 3.16362 3.07852 3.28424C3.12963 3.34429 3.21891 3.38753 3.29664 3.38753C3.33305 3.38753 3.36684 3.37807 3.3931 3.35636C3.45665 3.3042 3.47258 3.19496 3.47713 3.08484C3.48396 3.0964 3.49166 3.10953 3.50042 3.12458C3.63854 3.35531 3.43932 3.6123 3.21717 3.6123Z" fill="#2F2F2F"/>
<path d="M7.9752 3.36462C7.95716 3.36462 7.93931 3.36305 7.92163 3.35955C7.88207 3.34117 7.846 3.31491 7.81992 3.2841C7.71733 3.16348 7.6895 2.98229 7.67164 2.82176C7.65886 2.70657 7.64941 2.59085 7.64258 2.47461C7.69282 2.44152 7.75164 2.42192 7.81222 2.42192C7.87471 2.42192 7.93913 2.44292 7.99795 2.49141C8.09371 2.55829 8.12715 2.68241 8.18877 2.77747C8.19963 2.79865 8.21136 2.81983 8.22309 2.84101L8.22011 3.0243C8.21871 3.11656 8.21381 3.216 8.18317 3.2876C8.12488 3.33591 8.04995 3.36462 7.9752 3.36462Z" fill="#DEDEDE"/>
<path d="M7.92193 3.35925C7.87712 3.35067 7.83405 3.33054 7.79606 3.29728C7.67299 3.1961 7.62643 3.02576 7.53662 2.89657C7.43964 2.73463 7.51334 2.55957 7.64288 2.47432C7.64971 2.59056 7.65917 2.70627 7.67195 2.82146C7.6898 2.98199 7.71764 3.16318 7.82022 3.2838C7.84631 3.31461 7.88237 3.34087 7.92193 3.35925ZM8.18348 3.2873C8.21411 3.2157 8.21901 3.11627 8.22041 3.02401L8.22339 2.84072C8.25998 2.90759 8.29517 2.97587 8.29377 3.05377C8.29657 3.14865 8.25105 3.23111 8.18348 3.2873Z" fill="#2F2F2F"/>
<path d="M12.7035 3.3501C12.6792 3.3501 12.6538 3.34695 12.6279 3.34029C12.6025 3.32454 12.5795 3.30546 12.5615 3.2841C12.4587 3.16348 12.4313 2.98229 12.4134 2.82176C12.3971 2.67576 12.3863 2.52853 12.3793 2.3806C12.439 2.32476 12.52 2.2915 12.6011 2.2915C12.6853 2.2915 12.7695 2.32739 12.8302 2.41142C12.9258 2.54341 12.9155 2.72583 12.9642 2.87918L12.9617 3.02431C12.9608 3.08558 12.9584 3.14983 12.9479 3.20707C12.8968 3.29285 12.8083 3.3501 12.7035 3.3501Z" fill="#DEDEDE"/>
<path d="M12.6281 3.34045C12.6017 3.3338 12.5747 3.32365 12.5474 3.30929C12.3457 3.17484 12.3636 2.88827 12.2971 2.67749C12.2626 2.55723 12.3042 2.45114 12.3795 2.38077C12.3865 2.52869 12.3974 2.67592 12.4136 2.82192C12.4315 2.98245 12.459 3.16364 12.5617 3.28426C12.5798 3.30562 12.6027 3.3247 12.6281 3.34045ZM12.9481 3.20723C12.9586 3.14999 12.9611 3.08574 12.9619 3.02447L12.9644 2.87934C12.9654 2.88284 12.9667 2.88634 12.9679 2.89002C13.0134 3.00521 12.9997 3.12075 12.9481 3.20723Z" fill="#2F2F2F"/>
</svg>

          <h2 className="text-[#606062] font-medium text-[12px] uppercase tracking-wide">
            LAST ACTIVITY
          </h2>
        </div>
        <div className="flex items-center mb-2 text-[#960000]">
          <span className="text-[12px]">Deleted Doc</span>
          <span className="ml-2 p-1">
            <img src="/DeleteIcon.svg" alt="Delete" className="h-5 w-5" />
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-gray-500 text-[12px]">24 Mar 25, 10:57 am</p>
        <div className="flex justify-between items-center">
          <p className="text-[#0E0A1F] text-[14px] font-medium">Vishal@gmail.com</p>
          <p className="text-[#0E0A1F] text-[12px] font-medium">Sale Agreement</p>
        </div>
      </div>
    </div>
  </div> */}

                      {/*
  <div className="bg-white rounded-2xl shadow-lg overflow-visible p-6">
    <div>
      <div className="flex items-center gap-2 overflow-visible mb-4">
        <div>
        <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.0796 7.92288C16.3593 7.32996 9.58247 7.39395 2.87519 8.1132C1.95733 8.21157 0.932205 8.40066 0.545139 9.23878C0.0729561 10.2621 0.957268 11.4357 1.96273 11.9445C3.50457 12.7246 5.30031 12.777 7.02833 12.7847C12.1925 12.8073 17.3824 12.5689 22.4459 11.5492C22.6427 11.5096 22.8601 11.4537 22.9616 11.2814C23.0341 11.1617 23.0299 11.0136 23.0217 10.8744C22.9802 9.92241 22.9367 8.96997 23.0796 7.92288Z" fill="white"/>
<path d="M13.955 7.70091C10.2581 7.70091 6.56156 7.89766 2.89428 8.29094C1.95695 8.39138 1.04324 8.58502 0.706502 9.31442C0.291271 10.2138 1.077 11.2984 2.04311 11.7872C3.51454 12.5317 5.24112 12.6002 7.02899 12.6081C13.2985 12.6346 18.0451 12.2554 22.4108 11.3761C22.5702 11.3442 22.7463 11.3009 22.8105 11.192C22.8519 11.1197 22.8519 11.0095 22.8457 10.8838C22.8042 9.99328 22.7628 9.07625 22.8788 8.08487C19.9173 7.8289 16.9351 7.70091 13.955 7.70091ZM7.65401 12.9647C7.4467 12.9647 7.23795 12.9643 7.02733 12.9635C5.19535 12.9554 3.42321 12.8837 1.88261 12.1042C0.76946 11.5409 -0.120234 10.2573 0.383842 9.1653C0.794931 8.2752 1.81509 8.04925 2.85617 7.93762C9.56511 7.21817 16.3739 7.15418 23.0942 7.7471C23.1439 7.75145 23.1874 7.77547 23.2184 7.81316C23.2495 7.85127 23.2619 7.90014 23.2557 7.94819C23.1149 8.9785 23.1584 9.93799 23.1998 10.8658C23.206 11.0093 23.2164 11.2034 23.1149 11.3728C22.9658 11.6271 22.651 11.6904 22.4812 11.7244C18.2377 12.5791 13.6422 12.9647 7.65401 12.9647Z" fill="#2F2F2F"/>
<path d="M14.932 2.6679C16.5992 2.87272 18.2642 3.07734 19.9293 3.28216C18.5707 5.19367 17.9826 7.53698 17.5435 9.84094C17.469 10.2429 17.3716 10.6849 17.0423 10.927C16.8705 11.0527 16.6592 11.1059 16.4521 11.1562C16.0793 11.2476 15.6879 11.3391 15.3152 11.2463C14.5427 11.0547 14.1699 10.1831 14.0187 9.40293C13.5859 7.14805 14.0726 4.80163 14.932 2.6679Z" fill="white"/>
<path d="M15.0485 2.86069C14.1082 5.24252 13.8224 7.43155 14.1952 9.36895C14.3008 9.92397 14.5949 10.8839 15.357 11.0734C15.6967 11.1581 16.0757 11.0651 16.4112 10.9831C16.5975 10.9373 16.7922 10.8899 16.9372 10.7834C17.2023 10.5881 17.2934 10.2104 17.37 9.80737C17.7884 7.61213 18.3496 5.32661 19.6191 3.42214L15.0485 2.86069ZM15.649 11.4617C15.5227 11.4617 15.3964 11.4492 15.2721 11.4184C14.3174 11.1811 13.9695 10.0745 13.8452 9.43605C13.4538 7.39634 13.7624 5.09672 14.7689 2.6012C14.7979 2.52643 14.8766 2.48253 14.9553 2.49123L19.9525 3.10528C20.0147 3.11294 20.0685 3.1527 20.0934 3.20986C20.1182 3.26723 20.112 3.3335 20.0747 3.38444C18.7286 5.28001 18.1466 7.62373 17.72 9.87364C17.6475 10.2543 17.5481 10.7756 17.1484 11.0696C16.9455 11.2181 16.7073 11.2767 16.4961 11.3283C16.2434 11.3898 15.9493 11.4617 15.649 11.4617Z" fill="#2F2F2F"/>
<path d="M6.18589 12.4257C5.93696 8.64675 5.75326 4.76594 6.91757 1.1554C8.55323 0.949129 10.2042 0.996349 11.8508 1.04336C13.2922 1.08457 14.7274 1.12558 16.1502 0.997593C15.475 4.67627 14.7999 8.45539 15.4916 12.1305L6.18589 12.4257Z" fill="white"/>
<path d="M7.05225 1.31866C5.98218 4.71817 6.09421 8.28357 6.35204 12.2437L15.2804 11.9606C14.6509 8.34797 15.3157 4.56347 15.9328 1.19503C14.5763 1.29982 13.1908 1.26026 11.8488 1.22195C10.2703 1.17701 8.63986 1.1302 7.05225 1.31866ZM6.18574 12.6042C6.09254 12.6042 6.01489 12.532 6.00867 12.4384C5.738 8.33058 5.60691 4.64217 6.74864 1.10163C6.76977 1.03598 6.82713 0.988547 6.89547 0.980057C8.54542 0.77213 10.2299 0.820177 11.8592 0.866775C13.2675 0.907159 14.7234 0.948787 16.1337 0.821629C16.1875 0.81728 16.2434 0.837783 16.2807 0.878788C16.318 0.919793 16.3346 0.975918 16.3242 1.03059C15.6905 4.4885 14.9719 8.40783 15.6656 12.0987C15.676 12.1497 15.6636 12.2023 15.6304 12.2429C15.5973 12.2832 15.5497 12.3075 15.4979 12.3091L6.19154 12.604L6.18574 12.6042Z" fill="#2F2F2F"/>
<path d="M23.792 9.90563C16.8667 10.0889 9.94048 10.2142 3.01347 10.2821C2.08257 10.291 0.090504 10.8152 0.545084 9.23919C0.211035 10.1129 0.139158 11.3135 0.194453 12.2473C0.370072 15.2131 0.41564 18.1868 0.330523 21.1566C0.307949 21.9442 0.279164 22.7525 0.533273 23.4983C0.787174 24.2443 1.39398 24.9258 2.14906 25.095C9.43642 25.5726 16.3448 25.2752 23.5891 25.2321C23.1065 19.9675 23.6346 15.1634 23.792 9.90563Z" fill="white"/>
<path d="M2.17478 24.9182C7.63243 25.2752 12.7743 25.1986 18.2189 25.1178C19.9088 25.0927 21.6525 25.0666 23.3963 25.0553C23.067 21.3043 23.243 17.8338 23.4294 14.1629C23.4957 12.839 23.564 11.4721 23.6075 10.0877C16.7754 10.2674 9.84857 10.3923 3.01496 10.4594C2.8528 10.4609 2.65068 10.4795 2.43654 10.499C1.69472 10.5669 0.853481 10.6439 0.477184 10.1887L0.476153 10.1873C0.367634 10.7995 0.32891 11.5152 0.371573 12.2363C0.546777 15.1947 0.592755 18.1976 0.507845 21.1614L0.506591 21.208C0.484845 21.961 0.462487 22.7397 0.701271 23.4407C0.956415 24.1902 1.53381 24.7686 2.17478 24.9182ZM11.4074 25.5409C8.34504 25.5409 5.29511 25.4788 2.13749 25.2719L2.10994 25.2679C1.34596 25.0969 0.660882 24.4244 0.364939 23.5552C0.105445 22.7937 0.128856 21.9823 0.15143 21.1978L0.152866 21.1512C0.237362 18.1978 0.191602 15.2055 0.0170188 12.2574C-0.0515306 11.0996 0.083714 9.94747 0.379035 9.1752C0.413207 9.08636 0.511148 9.04017 0.601443 9.0702C0.691531 9.10065 0.742073 9.19653 0.715772 9.28807C0.626098 9.59851 0.637907 9.82549 0.750982 9.96238C1.00778 10.273 1.7819 10.2022 2.40402 10.1452C2.62562 10.125 2.83479 10.1057 3.01144 10.104C9.90573 10.0367 16.8955 9.90999 23.7877 9.72774C23.8333 9.72567 23.883 9.74513 23.9182 9.77972C23.9513 9.8143 23.9699 9.86173 23.9699 9.9106C23.9265 11.3626 23.854 12.7953 23.7836 14.1808C23.5951 17.9013 23.417 21.4157 23.767 25.2155C23.7711 25.265 23.7546 25.3143 23.7214 25.3512C23.6883 25.3881 23.6407 25.4092 23.591 25.4094C21.7851 25.4202 19.975 25.4471 18.2251 25.473C15.9138 25.5073 13.6565 25.5409 11.4074 25.5409Z" fill="#2F2F2F"/>
<path d="M11.768 4.50378C9.9383 4.50378 8.10548 4.46858 6.28799 4.39858C6.18982 4.39485 6.1134 4.31243 6.11733 4.21426C6.12106 4.1163 6.20329 4.03989 6.30166 4.04341C9.33108 4.16042 12.4038 4.17947 15.4357 4.10118H15.4398C15.5351 4.10118 15.6138 4.1776 15.6179 4.27411C15.62 4.37207 15.5434 4.45387 15.444 4.45615C14.2242 4.48784 12.9961 4.50378 11.768 4.50378Z" fill="#2F2F2F"/>
<path d="M12.7475 10.2206C12.6502 10.2206 12.5715 10.1433 12.5694 10.0464C12.559 9.50133 12.1966 8.97737 11.6934 8.77173C11.3848 8.64602 11.0394 8.63007 10.6533 8.62324C10.1919 8.61495 9.74726 8.62407 9.38608 8.81977C8.96278 9.04924 8.70225 9.544 8.75258 10.0228C8.76272 10.1203 8.69211 10.2077 8.59436 10.2181C8.4993 10.227 8.40943 10.1576 8.39907 10.0599C8.33425 9.44189 8.67057 8.80341 9.21668 8.50747C9.65408 8.27055 10.1488 8.25916 10.6597 8.26786C11.0665 8.27511 11.4614 8.29395 11.8259 8.44265C12.4596 8.70007 12.9111 9.35657 12.9235 10.0392C12.9256 10.1373 12.849 10.2185 12.7496 10.2206H12.7475Z" fill="#2F2F2F"/>
<path d="M23.8151 15.0569C21.6323 14.9587 19.9859 14.997 17.8072 15.1716C17.0907 15.2292 16.3555 15.3066 15.7135 15.6281C15.0694 15.9495 14.5268 16.5685 14.4978 17.2875C14.4647 18.1002 15.0984 18.8209 15.8419 19.1493C16.5874 19.4778 17.4241 19.4971 18.238 19.5109C19.8969 19.5397 21.5536 19.5683 23.2125 19.5969C23.5335 19.6023 23.8711 19.6035 24.1506 19.4445C24.6808 19.1406 24.7595 18.4197 24.7761 17.8078C24.7906 17.2631 24.8072 16.7182 24.8217 16.1734C24.8279 15.9335 24.7347 15.5883 24.6539 15.3624C24.5731 15.1364 23.9394 15.0312 23.8151 15.0569Z" fill="white"/>
<path d="M21.6158 15.1809C20.4063 15.1809 19.2383 15.235 17.8217 15.3485C17.099 15.4065 16.399 15.4837 15.7922 15.7869C15.1378 16.1137 14.6987 16.7056 14.6759 17.2944C14.6449 18.0675 15.2951 18.7134 15.9144 18.9866C16.6371 19.3057 17.4904 19.3202 18.2422 19.3333L23.2146 19.419C23.4983 19.424 23.8172 19.4294 24.0616 19.2902C24.5069 19.0359 24.5835 18.3957 24.598 17.8028L24.6435 16.1684C24.6497 15.9588 24.5628 15.6351 24.4862 15.4218C24.4364 15.3259 23.985 15.2128 23.8483 15.2313L23.8069 15.2342C23.0261 15.1992 22.3137 15.1809 21.6158 15.1809ZM23.3761 19.7762C23.3181 19.7762 23.2622 19.7752 23.2084 19.7744L18.2359 19.6886C17.449 19.675 16.5585 19.6597 15.7715 19.3115C15.0218 18.9808 14.2824 18.2243 14.3197 17.2801C14.3487 16.5637 14.8644 15.853 15.6327 15.469C16.2975 15.1375 17.0348 15.0552 17.7927 14.9944C20.0398 14.8144 21.6717 14.7831 23.8089 14.8786C24.0181 14.8606 24.7015 14.9658 24.8217 15.3023C24.8651 15.4255 25.008 15.853 24.9997 16.1781L24.9542 17.8125C24.9355 18.5042 24.8341 19.257 24.2376 19.5986C23.9663 19.7541 23.6536 19.7762 23.3761 19.7762Z" fill="#2F2F2F"/>
<path d="M17.6081 16.5076C17.3927 16.438 17.1484 16.504 16.9723 16.6453C16.7963 16.7865 16.6824 16.9942 16.6203 17.2111C16.5871 17.3266 16.5664 17.4492 16.5892 17.5675C16.6078 17.6621 16.6534 17.7499 16.7135 17.8261C17.0179 18.2198 17.7013 18.2192 18.014 17.8313C18.3267 17.4436 18.2232 16.7068 17.6081 16.5076Z" fill="#2F2F2F"/>
<path d="M17.428 16.6578C17.312 16.6578 17.1857 16.7021 17.0842 16.7839C16.9164 16.9175 16.8336 17.1169 16.7901 17.2607C16.757 17.374 16.7487 17.4605 16.7632 17.5334C16.7756 17.5937 16.8067 17.6571 16.8523 17.7173C16.962 17.8575 17.1484 17.9422 17.3555 17.9441L17.3617 17.9443C17.5709 17.9443 17.7614 17.8606 17.8753 17.72C18.0016 17.5637 18.041 17.3236 17.9789 17.1089C17.9416 16.9869 17.838 16.7688 17.5522 16.6767C17.5129 16.664 17.4715 16.6578 17.428 16.6578ZM17.3617 18.2997L17.3514 18.2995C17.0345 18.2966 16.7487 18.1636 16.5727 17.9352C16.4898 17.8298 16.438 17.7175 16.4153 17.6016C16.3883 17.4713 16.4008 17.3315 16.4505 17.1617C16.5292 16.8848 16.6721 16.6584 16.8605 16.5068C17.0966 16.319 17.4031 16.2548 17.662 16.3385C17.983 16.4424 18.2232 16.6862 18.3185 17.0074C18.4158 17.3361 18.3516 17.6945 18.1507 17.9433C17.9706 18.1669 17.6765 18.2997 17.3617 18.2997Z" fill="#2F2F2F"/>
<path d="M1.2432 9.95007L1.20924 9.9393C1.18252 9.92046 1.1761 9.88359 1.19474 9.85688C1.54059 9.36461 1.95438 8.92473 2.42408 8.54905C2.44976 8.52876 2.48703 8.5329 2.50732 8.55837C2.52762 8.58385 2.52368 8.62112 2.498 8.64163C2.037 9.01005 1.63109 9.44185 1.29165 9.9248C1.28026 9.94137 1.26183 9.95007 1.2432 9.95007Z" fill="#2F2F2F"/>
<path d="M2.67743 9.79285L2.63808 9.77794C2.61364 9.7564 2.61136 9.71891 2.6331 9.69427L3.75558 8.42807C3.77732 8.40343 3.8146 8.40136 3.83924 8.4231C3.86368 8.44485 3.86596 8.48233 3.84422 8.50677L2.72175 9.77297L2.67743 9.79285Z" fill="#2F2F2F"/>
<path d="M4.38829 9.75671L4.34831 9.74118C4.32408 9.71923 4.32263 9.68154 4.34479 9.65772L5.37075 8.53981C5.39312 8.51558 5.4306 8.51454 5.45442 8.53629C5.47865 8.55845 5.4801 8.59593 5.45794 8.61996L4.43198 9.73766L4.38829 9.75671Z" fill="#2F2F2F"/>
<path d="M18.0906 9.57703L18.0513 9.56212C18.0264 9.54037 18.0243 9.50289 18.0471 9.47845L19.0847 8.31062C19.1075 8.28598 19.1447 8.2839 19.1675 8.30544C19.1924 8.32719 19.1944 8.36467 19.1737 8.38911L18.1362 9.55694L18.0906 9.57703Z" fill="#2F2F2F"/>
<path d="M19.1693 9.67371L19.1278 9.65817C19.1051 9.63601 19.103 9.59874 19.1237 9.57451C19.542 9.12013 19.9977 8.69496 20.4781 8.311C20.505 8.29071 20.5423 8.29485 20.563 8.32032C20.5817 8.34579 20.5775 8.38328 20.5527 8.40357C20.0763 8.78381 19.6249 9.20463 19.2128 9.65465L19.1693 9.67371Z" fill="#2F2F2F"/>
<path d="M20.8222 9.42761L20.7808 9.41104C20.758 9.38826 20.758 9.35078 20.7808 9.32738L21.7293 8.34656C21.7521 8.32316 21.7893 8.32254 21.8142 8.34511C21.837 8.3681 21.837 8.40537 21.8142 8.42898L20.8657 9.40959L20.8222 9.42761Z" fill="#2F2F2F"/>
<path d="M22.0173 9.48901L21.9821 9.47638C21.9551 9.45629 21.951 9.41922 21.9717 9.39333L22.4004 8.84183C22.4191 8.81574 22.4563 8.81118 22.4833 8.83148C22.5081 8.85157 22.5143 8.88864 22.4936 8.91432L22.0649 9.46623L22.0173 9.48901Z" fill="#2F2F2F"/>
<path d="M1.94473 23.8982L1.89708 23.874C1.60321 23.4743 1.55932 22.9685 1.53757 22.4417C1.50464 21.6495 1.49243 20.8458 1.50113 20.0528C1.50134 20.0201 1.52639 19.9944 1.56097 19.9944C1.59349 19.9946 1.61979 20.0215 1.61938 20.0542C1.61089 20.8452 1.6231 21.6466 1.65582 22.4367C1.67695 22.9445 1.71857 23.431 1.99256 23.8038C2.01182 23.8303 2.00622 23.8671 1.97992 23.8866L1.94473 23.8982Z" fill="#2F2F2F"/>
<path d="M3.19086 24.1191C3.16974 24.1191 3.14945 24.1078 3.13868 24.0881C2.88603 23.618 2.76859 23.066 2.80856 22.534C2.81105 22.5013 2.84026 22.4758 2.87194 22.4793C2.90467 22.4818 2.92909 22.5102 2.92681 22.5429C2.8885 23.0528 3.00076 23.5815 3.24306 24.0317C3.25839 24.0607 3.24783 24.0966 3.21883 24.1121L3.19086 24.1191Z" fill="#2F2F2F"/>
<path d="M15.4106 9.92078C15.2842 7.58616 15.5928 5.21552 15.9759 2.9741L16.6014 3.05093C16.6904 3.24415 16.5848 3.45871 16.5579 3.65939C16.473 4.20861 16.3839 4.75762 16.299 5.30705C16.094 6.45769 16.007 7.7916 15.9967 9.2475C15.9946 9.46806 16.0091 9.68821 16.0091 9.90877C15.8103 9.9127 15.6094 9.91684 15.4106 9.92078Z" fill="#DEDEDE"/>
<path d="M16.6015 3.05066L15.9761 2.97383C15.9844 2.92847 15.9906 2.8827 15.9989 2.83755C16.061 2.80856 16.1314 2.79365 16.2018 2.79365C16.3509 2.79365 16.5 2.86241 16.5787 3.00841C16.587 3.02229 16.5953 3.03637 16.6015 3.05066Z" fill="#2F2F2F"/>
<path d="M15.1852 9.92566C15.1251 9.04487 15.0795 8.16036 15.1499 7.27854C15.2411 6.30932 15.3695 5.41942 15.5372 4.42763C15.5869 4.39491 15.618 4.33796 15.618 4.27396C15.6159 4.23482 15.6035 4.19899 15.5807 4.17021C15.6387 3.83367 15.7008 3.48451 15.7671 3.11525C15.7982 2.98292 15.8893 2.8891 15.999 2.83836C15.9908 2.88351 15.9845 2.92928 15.9763 2.97463C15.5931 5.21605 15.2846 7.5867 15.4109 9.92131C15.3343 9.92276 15.2597 9.92421 15.1852 9.92566Z" fill="#2F2F2F"/>
<path d="M15.6054 10.3826C15.5018 10.3826 15.4004 10.3447 15.3217 10.2782C15.5101 10.2745 15.6986 10.2707 15.887 10.2668C15.8642 10.29 15.8373 10.3103 15.8083 10.3269C15.7441 10.365 15.6737 10.3826 15.6054 10.3826Z" fill="#DEDEDE"/>
<path d="M15.3217 10.2792C15.2596 10.2249 15.212 10.1518 15.1954 10.0648C15.1913 10.0186 15.1892 9.97267 15.1851 9.92649C15.2596 9.92504 15.3342 9.92359 15.4108 9.92214C15.6096 9.9182 15.8105 9.91407 16.0093 9.91013C16.0093 9.91054 16.0093 9.91095 16.0093 9.91137C16.0259 10.041 15.9803 10.1767 15.8871 10.2678C15.6986 10.2717 15.5102 10.2754 15.3217 10.2792Z" fill="#2F2F2F"/>
<path d="M15.5371 4.42761C15.5516 4.3425 15.5661 4.25676 15.5806 4.17019C15.6034 4.19898 15.6158 4.23481 15.6179 4.27395C15.6179 4.33794 15.5868 4.39489 15.5371 4.42761Z" fill="#2F2F2F"/>
<path d="M1.59632 10.1962C1.22706 10.1962 0.900895 10.1448 0.750957 9.9636C0.639538 9.82857 0.626266 9.60635 0.712004 9.30254C0.712212 9.30171 0.712642 9.30088 0.713056 9.29985C0.751576 9.28659 0.793613 9.27914 0.838346 9.27914C0.862162 9.27914 0.886798 9.28121 0.912064 9.28556C1.01955 9.2868 1.10425 9.36136 1.19351 9.41293L1.24654 9.44109C1.30659 9.46263 1.40828 9.49866 1.45612 9.50757C1.45695 9.50798 1.45798 9.50819 1.45901 9.5084C1.36706 9.62189 1.27884 9.73848 1.19476 9.85819C1.17612 9.8849 1.18255 9.92177 1.20926 9.94061L1.24322 9.95138C1.26186 9.95138 1.28029 9.94268 1.29168 9.92611C1.38611 9.79191 1.48553 9.66165 1.5899 9.53553C1.64748 9.54567 1.70711 9.55541 1.74294 9.56121C1.99042 9.59103 2.23894 9.59745 2.48767 9.59745C2.56533 9.59745 2.64319 9.59683 2.72085 9.59621L2.63346 9.69478C2.61172 9.71943 2.614 9.75691 2.63844 9.77845L2.67779 9.79336L2.72211 9.77348L2.88052 9.59475C2.90765 9.59434 2.9346 9.59434 2.96173 9.59414C3.05761 9.59434 3.15369 9.59475 3.24958 9.59475C3.63685 9.59475 4.02412 9.59186 4.41119 9.58585L4.34471 9.65854C4.32255 9.68236 4.324 9.72005 4.34823 9.742L4.38821 9.75754L4.4319 9.73848L4.57438 9.58316C4.75124 9.58005 4.92791 9.57591 5.10456 9.57135C5.26734 9.56493 5.43053 9.56825 5.5931 9.55748C5.60884 9.5523 5.678 9.54029 5.74179 9.54029C5.77638 9.54029 5.80951 9.54381 5.83167 9.55375C5.83912 9.55561 5.84638 9.55769 5.85363 9.55996C5.85964 9.73061 5.86646 9.90188 5.87392 10.074C4.91816 10.0856 3.96427 10.0959 3.01142 10.1053C2.83476 10.1069 2.62559 10.1262 2.404 10.1465C2.14513 10.1701 1.85974 10.1962 1.59632 10.1962Z" fill="#DEDEDE"/>
<path d="M0.712402 9.30261C0.712568 9.30195 0.712738 9.30128 0.712904 9.30062C0.71307 9.30062 0.713078 9.30062 0.713244 9.30046C0.712912 9.30128 0.712568 9.30195 0.712402 9.30261Z" fill="#2F2F2F"/>
<path d="M5.87429 10.0741C5.86683 9.902 5.86001 9.73073 5.854 9.56008C6.06773 9.62635 6.17355 9.87052 6.11991 10.071C6.03852 10.072 5.95589 10.0731 5.87429 10.0741Z" fill="#2F2F2F"/>
<path d="M2.65806 10.5165C2.59034 10.5165 2.52263 10.5163 2.45491 10.5163C2.40479 10.515 2.35424 10.5136 2.30371 10.5117C2.34844 10.5076 2.39298 10.5034 2.43709 10.4995C2.65123 10.48 2.85335 10.4614 3.01551 10.4599C3.51399 10.455 4.0131 10.4498 4.51242 10.4444C4.3428 10.4575 4.17299 10.4688 4.00296 10.4769C3.55543 10.5123 3.10664 10.5165 2.65806 10.5165Z" fill="#DEDEDE"/>
<path d="M2.30293 10.5116C1.72533 10.4888 1.12145 10.4023 0.642851 10.0636C0.314601 9.87664 0.411096 9.40445 0.712423 9.29925C0.712216 9.30007 0.712003 9.3009 0.711796 9.30173C0.626058 9.60555 0.63933 9.82776 0.750748 9.96279C0.900687 10.144 1.22685 10.1954 1.59611 10.1954C1.85954 10.1954 2.14492 10.1693 2.40379 10.1457C2.62538 10.1254 2.83455 10.1061 3.01121 10.1044C3.96407 10.0951 4.91795 10.0848 5.87371 10.0732C5.9553 10.0721 6.03794 10.0711 6.11933 10.0701C6.09759 10.1512 6.04975 10.2252 5.9725 10.2776C5.882 10.3569 5.76768 10.3724 5.65088 10.3724C5.61277 10.3724 5.57424 10.3708 5.53635 10.3691C5.49845 10.3677 5.46139 10.3658 5.42535 10.3658C5.42411 10.3658 5.42266 10.3658 5.42121 10.3658C5.11822 10.3915 4.81524 10.4207 4.51164 10.4443C4.01232 10.4497 3.51321 10.4549 3.01473 10.4598C2.85257 10.4613 2.65045 10.4799 2.43631 10.4994C2.3922 10.5033 2.34766 10.5075 2.30293 10.5116Z" fill="#2F2F2F"/>
<path d="M1.2432 9.95007L1.20924 9.9393C1.18252 9.92046 1.1761 9.88359 1.19474 9.85688C1.27882 9.73718 1.36704 9.62058 1.45899 9.50709C1.48798 9.51517 1.53811 9.5249 1.58988 9.53422C1.4855 9.66034 1.38609 9.7906 1.29165 9.9248C1.28026 9.94137 1.26183 9.95007 1.2432 9.95007Z" fill="#2F2F2F"/>
<path d="M2.67743 9.79285L2.63808 9.77794C2.61364 9.7564 2.61136 9.71891 2.6331 9.69427L2.72049 9.59569C2.77372 9.59507 2.82694 9.59465 2.88016 9.59424L2.72175 9.77297L2.67743 9.79285Z" fill="#2F2F2F"/>
<path d="M4.38829 9.75671L4.34831 9.74118C4.32408 9.71923 4.32263 9.68154 4.34479 9.65772L4.41127 9.58503C4.46573 9.5842 4.5202 9.58317 4.57446 9.58234L4.43198 9.73766L4.38829 9.75671Z" fill="#2F2F2F"/>
<path d="M17.7197 9.8739C17.7653 9.63305 17.8129 9.39054 17.8626 9.14823C17.873 9.14699 17.8833 9.14595 17.8958 9.14533C18.0614 9.11924 18.2292 9.09977 18.3969 9.08528L18.0469 9.47918C18.0242 9.50361 18.0262 9.5411 18.0511 9.56285L18.0904 9.57776L18.136 9.55767L18.5668 9.07223C18.8691 9.05193 19.1736 9.04613 19.478 9.04613C19.5318 9.04613 19.5857 9.04634 19.6395 9.04675C19.4635 9.21761 19.2916 9.39385 19.1238 9.57485C19.1031 9.59908 19.1052 9.63636 19.128 9.65852L19.1694 9.67405L19.2129 9.655C19.4034 9.44604 19.6043 9.24329 19.8094 9.048C19.8901 9.04883 19.9709 9.04965 20.0496 9.05069C20.2422 9.05297 20.4327 9.05504 20.6253 9.05504C20.646 9.05504 20.6667 9.05504 20.6874 9.05504C20.7723 9.05815 20.8552 9.0596 20.9401 9.0596C20.9732 9.0596 21.0064 9.05918 21.0395 9.05897L20.7806 9.32779C20.7578 9.35119 20.7578 9.38867 20.7806 9.41146L20.822 9.42802L20.8656 9.41L21.2093 9.05546C21.5635 9.0451 21.9176 9.01797 22.2738 9.0043L21.9714 9.39364C21.9507 9.41953 21.9549 9.4566 21.9818 9.47669L22.017 9.48932L22.0646 9.46654L22.4271 8.99933C22.485 8.99788 22.543 8.99685 22.6031 8.99664C22.6818 8.99933 22.7522 9.01755 22.8102 9.04717C22.8019 9.28637 22.8019 9.52163 22.8061 9.754C21.1141 9.79749 19.4179 9.83745 17.7197 9.8739Z" fill="#DEDEDE"/>
<path d="M22.8061 9.75391C22.8019 9.52154 22.8019 9.28628 22.8102 9.04708C23.0753 9.18252 23.1043 9.55509 22.9117 9.75121C22.8765 9.75204 22.8413 9.75308 22.8061 9.75391Z" fill="#2F2F2F"/>
<path d="M17.517 9.87878C17.3451 9.62364 17.4383 9.19598 17.8629 9.14856C17.8132 9.39086 17.7655 9.63337 17.72 9.87422C17.6516 9.87567 17.5833 9.87733 17.517 9.87878Z" fill="#2F2F2F"/>
<path d="M17.8837 10.0673C17.7159 10.0673 17.5916 9.98877 17.5171 9.87756C17.5834 9.87611 17.6517 9.87445 17.72 9.873C19.4182 9.83655 21.1144 9.79659 22.8064 9.7531C22.8416 9.75227 22.8768 9.75123 22.912 9.7504C22.8374 9.82558 22.7318 9.87507 22.593 9.87487C22.5868 9.87487 22.5827 9.87487 22.5765 9.87466C21.9034 9.91152 21.2324 9.98794 20.5573 9.98794C20.4869 9.98794 20.4165 9.98691 20.346 9.98525C19.5321 10.0134 18.4428 9.96351 18.0121 10.0532C17.9665 10.0627 17.923 10.0673 17.8837 10.0673Z" fill="#2F2F2F"/>
<path d="M18.0906 9.57703L18.0513 9.56212C18.0264 9.54037 18.0243 9.50289 18.0471 9.47845L18.3971 9.08455C18.453 9.07958 18.511 9.07523 18.5669 9.0715L18.1362 9.55694L18.0906 9.57703Z" fill="#2F2F2F"/>
<path d="M19.1693 9.67371L19.1278 9.65817C19.1051 9.63601 19.103 9.59874 19.1237 9.57451C19.2914 9.3935 19.4633 9.21726 19.6394 9.04641C19.6974 9.04661 19.7533 9.04703 19.8092 9.04765C19.6042 9.24294 19.4033 9.44569 19.2128 9.65465L19.1693 9.67371Z" fill="#2F2F2F"/>
<path d="M20.8222 9.42761L20.7808 9.41104C20.758 9.38826 20.758 9.35078 20.7808 9.32738L21.0396 9.05856C21.0955 9.05773 21.1515 9.0567 21.2095 9.05504L20.8657 9.40959L20.8222 9.42761Z" fill="#2F2F2F"/>
<path d="M22.0173 9.48901L21.9821 9.47638C21.9551 9.45629 21.951 9.41922 21.9717 9.39333L22.2741 9.00399C22.3259 9.00212 22.3756 9.00047 22.4273 8.99902L22.0649 9.46623L22.0173 9.48901Z" fill="#2F2F2F"/>
<path d="M22.7855 25.0603C22.6074 24.235 22.595 23.3826 22.5411 22.5424C22.5101 21.8952 22.4645 21.2483 22.4707 20.6007C21.9633 20.6011 21.4601 20.6615 20.9548 20.6615C20.9527 20.6615 20.9506 20.6615 20.9486 20.6615C20.8409 20.6655 20.7166 20.6676 20.5861 20.6676C19.9441 20.6676 19.1012 20.6226 18.8279 20.5717C18.2397 20.5218 17.6557 20.4443 17.0862 20.2908C16.351 20.1287 15.5764 19.8251 15.1208 19.1967C15.0587 19.087 15.067 18.9822 15.1125 18.9004C15.3176 19.0723 15.5433 19.2115 15.7711 19.3117C16.5581 19.6598 17.4486 19.6751 18.2356 19.6888L23.208 19.7745C23.2121 19.7745 23.2142 19.7745 23.2163 19.7748C23.1976 21.4402 23.2349 23.1167 23.3778 24.8509C23.3737 24.9201 23.3654 24.9886 23.353 25.0562C23.1624 25.0574 22.974 25.0589 22.7855 25.0603Z" fill="#DEDEDE"/>
<path d="M23.0756 25.3475C22.9555 25.3475 22.8374 25.2771 22.8043 25.1473C22.7981 25.1185 22.7919 25.0895 22.7856 25.0605C22.9741 25.059 23.1626 25.0576 23.3531 25.0564C23.3427 25.1063 23.3303 25.1558 23.3137 25.2044C23.264 25.3018 23.1708 25.3475 23.0756 25.3475ZM23.3779 24.8511C23.235 23.1169 23.1978 21.4404 23.2164 19.7749C23.2682 19.7758 23.322 19.7766 23.3759 19.7766C23.3904 19.7766 23.4028 19.7764 23.4152 19.7764C23.4918 19.9025 23.5043 20.0672 23.4235 20.2005L23.3883 20.2459V20.2854C23.5043 20.4008 23.4691 20.6255 23.4525 20.8007C23.4256 21.1314 23.3883 21.4611 23.3738 21.7927C23.351 22.5911 23.4049 23.3894 23.3924 24.1878C23.3779 24.4048 23.3945 24.6312 23.3779 24.8511Z" fill="#2F2F2F"/>
<path d="M16.6122 19.203C16.3719 19.1537 16.1379 19.0841 15.9142 18.9858C15.8935 18.9769 15.8728 18.9673 15.8521 18.9574C15.8832 18.9481 15.9143 18.9441 15.9432 18.9441C16.0944 18.9441 16.227 19.0541 16.3678 19.1142C16.4486 19.1487 16.5293 19.1775 16.6122 19.203ZM15.6699 18.8592C15.6471 18.8456 15.6243 18.8315 15.6015 18.8168C15.6264 18.8265 15.6492 18.8414 15.6699 18.8592ZM15.5829 18.805C15.5642 18.7919 15.5435 18.7787 15.5249 18.765C15.5456 18.7753 15.5642 18.7886 15.5829 18.805Z" fill="#DEDEDE"/>
<path d="M23.3755 19.7762C23.3217 19.7762 23.2678 19.7754 23.216 19.7746C23.214 19.7744 23.2119 19.7744 23.2077 19.7744L18.2353 19.6886C17.4484 19.675 16.5578 19.6597 15.7709 19.3115C15.5431 19.2113 15.3173 19.0721 15.1123 18.9002C15.1703 18.8012 15.2821 18.7358 15.396 18.7358C15.4395 18.7358 15.483 18.7453 15.5244 18.7658C15.5431 18.7795 15.5638 18.7927 15.5824 18.8058C15.5865 18.8087 15.5886 18.8116 15.5928 18.8147C15.5948 18.8155 15.599 18.8166 15.601 18.8176C15.6238 18.8323 15.6466 18.8464 15.6694 18.86C15.7108 18.8967 15.744 18.9447 15.7854 18.9822C15.8061 18.9729 15.8268 18.9646 15.8496 18.959C15.8496 18.9588 15.8516 18.9586 15.8516 18.9582C15.8723 18.9681 15.893 18.9777 15.9138 18.9866C16.1374 19.0849 16.3714 19.1545 16.6117 19.2038C16.8043 19.2626 17.001 19.3039 17.1936 19.3573L17.1895 19.3567L17.1998 19.3585C17.2661 19.3838 17.496 19.4225 17.585 19.4376L17.6057 19.4401C18.4921 19.5536 19.3806 19.6342 20.2732 19.6342C20.4181 19.6342 20.5631 19.6319 20.706 19.6275C20.9048 19.617 21.1036 19.6139 21.3004 19.6139C21.4412 19.6139 21.58 19.6153 21.7187 19.617C21.8595 19.6184 21.9983 19.6201 22.1391 19.6201C22.3876 19.6201 22.6362 19.6151 22.8847 19.5965C22.9116 19.5965 22.9385 19.5942 22.9654 19.5921C22.9986 19.5836 23.0338 19.5791 23.069 19.5791C23.1042 19.5791 23.1415 19.5838 23.1767 19.5934C23.2802 19.6207 23.3631 19.6893 23.4148 19.776C23.4024 19.776 23.39 19.7762 23.3755 19.7762Z" fill="#2F2F2F"/>
<path d="M23.3943 14.8613C23.2432 14.8557 23.0961 14.8508 22.9491 14.8464C22.947 14.8292 22.945 14.8114 22.947 14.793C23.1168 13.4868 23.2245 11.8302 23.2515 10.2824C23.2494 10.2062 23.2763 10.143 23.3198 10.0956C23.4151 10.0931 23.5124 10.0904 23.6077 10.0879C23.5642 11.4724 23.4958 12.8392 23.4296 14.1632C23.4171 14.3966 23.4047 14.6294 23.3943 14.8613Z" fill="#DEDEDE"/>
<path d="M23.529 14.8671C23.4834 14.8652 23.4379 14.8635 23.3944 14.8617C23.4047 14.6297 23.4172 14.397 23.4296 14.1636C23.4959 12.8396 23.5642 11.4727 23.6077 10.0883C23.5124 10.0908 23.4151 10.0935 23.3198 10.0959C23.3778 10.0309 23.4648 9.9953 23.5518 9.9953C23.6595 9.9953 23.763 10.0498 23.8086 10.1707C23.8707 10.3919 23.7982 10.6474 23.8107 10.8786C23.8086 11.8666 23.734 12.8518 23.6429 13.8353C23.6408 13.9596 23.5663 14.5436 23.5642 14.5436C23.5642 14.5436 23.5663 14.5357 23.5683 14.5183C23.5435 14.6304 23.558 14.7569 23.529 14.8671Z" fill="#2F2F2F"/>
<path d="M23.2537 15.0896C23.1149 15.0896 22.9741 14.9925 22.9492 14.8469C23.0963 14.8512 23.2433 14.8562 23.3945 14.8618C23.438 14.8637 23.4835 14.8653 23.5291 14.8672C23.5167 14.9171 23.4939 14.9635 23.4545 15.0039C23.3986 15.0633 23.3261 15.0896 23.2537 15.0896Z" fill="#2F2F2F"/>
</svg>

        </div>
        <h2 className="text-[#606062] font-medium text-[12px] uppercase tracking-wide">
          UPCOMING EVENTS
        </h2>
      </div>
      <div className="space-y-1">
        <p className="text-gray-500 text-[12px]">On 27 Mar 2025</p>
        <div className="flex justify-between items-center">
          <p className="text-[#0E0A1F] text-[14px] font-medium">
            Before Execution of Construction Agreement
          </p>
          <p className="text-[#0E0A1F] text-[14px] font-medium">
            ₹ 22,76,36,500
          </p>
        </div>
      </div>
    </div>
  </div> */}
                      {/* </div> */}

                      <div>
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 ">
                          <div
                            className=" bg-[#F9F9FB] rounded-[16px] p-4  border border-[#E7E7E9] flex flex-col gap-3"

                            // style={{
                            //   transition: 'transform 200ms ease-in-out',
                            //   cursor: 'pointer'
                            // }}
                            // onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                            // onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <h2 className="font-[Outfit] font-medium text-[16px] leading-[100%] tracking-[0%] text-[#0E0A1F]">
                                  {leadNextTaskObj?.notes}
                                </h2>
                                <div
                                  className={`bg-white border rounded-full px-3 py-1 flex items-center gap-1 ${
                                    leadNextTaskObj?.comingSoon
                                      ? 'text-green-400 border-green-400'
                                      : 'border-[#DC3C3C] text-[#DC3C3C] '
                                  } text-[12px]`}
                                >
                                  <Phone size={14} />
                                  <span className="font-medium text-[12px] leading-[100%] cursor-pointer tracking-[0%]">
                                    {' '}
                                    {(leadNextTaskObj?.sts != 'completed' ||
                                      Math.abs(
                                        getDifferenceInHours(
                                          leadNextTaskObj?.schTime,
                                          ''
                                        )
                                      ) <= 24) && (
                                      <span
                                        className={`  py-1  mb-2 ${
                                          leadNextTaskObj?.comingSoon
                                            ? 'text-green-400 border-green-400'
                                            : 'text-[#DC3C3C]'
                                        }  text-black text-[12px] text-center`}
                                      >
                                        {leadNextTaskObj?.comingSoon
                                          ? 'Starts in'
                                          : 'Delayed by'}{' '}
                                        {'  '}
                                        {Math.abs(
                                          getDifferenceInMinutes(
                                            leadNextTaskObj?.schTime,
                                            ''
                                          )
                                        ) > 60
                                          ? Math.abs(
                                              getDifferenceInMinutes(
                                                leadNextTaskObj?.schTime,
                                                ''
                                              )
                                            ) > 8640
                                            ? `${Math.abs(
                                                getDifferenceInDays(
                                                  leadNextTaskObj?.schTime,
                                                  ''
                                                )
                                              )} Days `
                                            : `${Math.abs(
                                                getDifferenceInHours(
                                                  leadNextTaskObj?.schTime,
                                                  ''
                                                )
                                              )} Hours `
                                          : `${Math.abs(
                                              getDifferenceInMinutes(
                                                leadNextTaskObj?.schTime,
                                                ''
                                              )
                                            )} Min`}{' '}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="text-gray-500">
                                  <img
                                    src="/comment.svg"
                                    alt=""
                                    className="w-5 h-5"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-[Outfit] font-normal text-[14px] leading-[100%] tracking-[0%] text-[#0E0A1F]">
                                    Recent Comments:
                                  </span>
                                  <span className="font-[Outfit] font-normal text-[14px] leading-[100%] tracking-[0%] text-[#606062]">
                                    {' '}
                                    {leadDetailsObj?.Remarks || 'NA'}
                                  </span>
                                  <span className="font-[Outfit] font-normal text-[10px] leading-[100%] tracking-[0%] text-[#606062] ml-2">
                                    {leadDetailsObj?.Remarks_T &&
                                      prettyDateTime(leadDetailsObj?.Remarks_T)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row rounded-[16px]  bg-[#F9F9FB] overflow-visible border border-[#E7E7E9]">
                            {/* Section 1 - Project Dropdown */}
                            <div className="relative flex-1 p-3  border-b md:border-b-0 flex flex-col justify-center items-center text-center z-[20]">
                              <span className="hidden md:block absolute top-2 bottom-2 right-0 w-px bg-gray-200" />
                              <p className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062] mb-1">
                                Project
                              </p>
                              <div className="font-[Outfit] font-semibold text-[14px] text-[#0E0A1F] tracking-wide overflow-visible relative">
                                <AssigedToDropComp
                                  assignerName={
                                    selProjectIs?.projectName || Project
                                  }
                                  id={id}
                                  align="right"
                                  setAssigner={setNewProject}
                                  usersList={projectList}
                                  className="z-[999]"
                                />
                              </div>
                            </div>

                            {/* Section 2 - Assigned To (Dynamically integrated) */}
                            <div className="relative flex-1 p-3  border-b md:border-b-0 flex flex-col justify-center items-center text-center">
                              <span className="hidden md:block absolute top-2 bottom-2 right-0 w-px bg-gray-200" />
                              <p className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062] mb-1">
                                Assigned to
                              </p>
                              {!user?.role?.includes(USER_ROLES.CP_AGENT) ? (
                                <div className="font-[Outfit] font-semibold text-[14px] text-[#0E0A1F] tracking-wide overflow-ellipsis">
                                  <AssigedToDropComp
                                    assignerName={assignerName}
                                    id={id}
                                    setAssigner={setAssigner}
                                    usersList={usersList}
                                    align={undefined}
                                  />
                                </div>
                              ) : (
                                <span className="text-[14px] text-[#0E0A1F] font-[Outfit]">
                                  {assignerName}
                                </span>
                              )}
                            </div>

                            {/* Section 3 - Lead Created */}
                            <div className="relative flex-1 p-3  border-b md:border-b-0 flex flex-col justify-center items-center text-center">
                              <span className="hidden md:block absolute top-2 bottom-2 right-0 w-px bg-gray-200" />
                              <p className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062] mb-1">
                                Lead Created
                              </p>
                              <p className="font-[Outfit] font-normal text-[14px] leading-[100%] tracking-[0%] text-[#0E0A1F]">
                                27 Mar 2025, 11:30 am
                              </p>
                            </div>

                            {/* Section 4 - Source */}
                            <div className="flex-1 p-3 flex flex-col justify-center items-center text-center">
                              <p className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062] mb-1">
                                Source
                              </p>
                              <p className="font-[Outfit] font-normal text-[14px] leading-[100%] tracking-[0%] text-[#0E0A1F]">
                                {Source?.toString() || 'NA'}
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                              {/* Left Column */}
                              <div className="space-y-4">
                                <div className=" rounded-[16px] p-4  bg-[#F9F9FB]  border border-[#E7E7E9]  max-w-lg">
                                  <div className="flex items-center mb-8">
                                    <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                      {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                                      <img
                                        src="/fire.svg"
                                        alt=""
                                        className="w-[18px] h-[18px]"
                                      />
                                    </div>

                                    <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                                      LEAD STRENGTH
                                    </span>
                                  </div>

                                  {/* <div className="relative h-3 bg-gray-100 rounded-full mb-6">
        <div
          className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
          style={{ width: '50%' }}
        >
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-xs font-medium text-white z-10">50%</span>
        </div>
      </div> */}

                                  <div className="mb-6">
                                    {/* <Slider
      onChange={(e) => setopstr(e.target.value)} // Use the same handler to set value
      value={opstr}
      defaultValue={opstr}
      aria-label="Lead Strength Slider"
      valueLabelDisplay="auto"
      min={0}
      max={100}
    /> */}

                                    <Box
                                      sx={{
                                        position: 'relative',
                                        width: '100%',
                                      }}
                                    >
                                      <Slider
                                        value={opstr}
                                        min={0}
                                        max={100}
                                        onChange={(e) =>
                                          setopstr(e.target.value)
                                        }
                                        aria-label="Lead Strength Slider"
                                        sx={{
                                          height: 20,
                                          paddingRight: 0,
                                          '& .MuiSlider-track': {
                                            // backgroundColor: '#5a5acc',
                                            // height: 20,
                                            // borderRadius: 10,
                                            backgroundColor: '#5a5acc',
                                            height: 20,
                                            borderRadius: 10,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff', // optional, for visibility
                                            fontSize: 12, // optional
                                          },
                                          '& .MuiSlider-rail': {
                                            backgroundColor: '#cfd0ff',
                                            height: 20,
                                            borderRadius: 10,
                                          },
                                          // '& .MuiSlider-thumb': {
                                          //   display: 'none', // Hide the thumb
                                          // },
                                          '& .MuiSlider-thumb': {
                                            width: 24,
                                            height: 24,
                                            backgroundColor: '#5B5FC7',
                                            // border: '2px solid #5a5acc',

                                            '&:hover, &.Mui-focusVisible': {
                                              boxShadow:
                                                '0px 0px 0px 8px rgba(90, 90, 204, 0.16)',
                                            },
                                          },
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          top: 0,
                                          left: `${opstr}%`,
                                          transform: 'translateX(-100%)',
                                          height: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          pr: 1,
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: '0.75rem',
                                          }}
                                        >
                                          {opstr}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </div>

                                  {/*

<div className="mb-6 relative">
  <Slider
    onChange={(e) => setopstr(e.target.value)}
    value={opstr}
    defaultValue={opstr}
    aria-label="Lead Strength Slider"
    valueLabelDisplay="auto"
    min={20}
    max={100}
    sx={{
      height: '14px',
      '& .MuiSlider-rail': {
        backgroundColor: '#e0e0e0',
      },
      '& .MuiSlider-track': {
        backgroundColor: '#3f51b5',
      },
      '& .MuiSlider-thumb': {
        width: 20,
        height: 20,
        backgroundColor: '#3f51b5',
      }
    }}
  />

  <div
    className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
    style={{
      width: `${opstr}%`,
    }}
  >
    <span className="text-xs font-medium text-white">{`${opstr}%`}</span>
  </div>


  <div className="flex justify-between mt-2">
    <span className="text-xs font-medium text-[#606062]">0%</span>
    <span className="text-xs font-medium text-[#606062]">100%</span>
  </div>
</div> */}

                                  <div className="flex justify-between items-center mb-6">
                                    <div className="font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062]">
                                      Requirement : 10/12
                                    </div>
                                    <div className="font-normal text-[12px] leading-[100%] tracking-[0%] text-[#606062]">
                                      Updated : 27 Mar, 4:30 pm
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-3">
                                    <div className="bg-white rounded-[4px] border border-[#E7E7E9]  px-2 py-1 flex items-center">
                                      {/* <Clock className="w-5 h-5 mr-2 text-gray-600" /> */}
                                      <img
                                        src="/costR.svg"
                                        alt=""
                                        className="w-5 h-5"
                                      />
                                      <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#606062]">
                                        Shuba Ecosone Ph 2
                                      </span>
                                    </div>

                                    <div className="bg-white rounded-[4px] border border-[#E7E7E9] px-2 py-1 flex items-center">
                                      <img
                                        src="/costR.svg"
                                        alt=""
                                        className="w-5 h-5"
                                      />
                                      <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#606062]">
                                        Min: 2.12cr
                                      </span>
                                    </div>

                                    <div className="bg-white rounded-[4px] border border-[#E7E7E9] px-2 py-1 flex items-center">
                                      <img
                                        src="/costR.svg"
                                        alt=""
                                        className="w-5 h-5"
                                      />
                                      <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#606062]">
                                        Max: 5.12cr
                                      </span>
                                    </div>

                                    {[1, 2, 3, 4, 5].map((index) => (
                                      <div
                                        key={index}
                                        className="bg-white border border-[#E7E7E9] rounded-[4px] px-2 py-1 flex items-center h-[28px]"
                                      >
                                        <img
                                          src="/costR.svg"
                                          alt=""
                                          className="w-5 h-5 mr-1"
                                        />
                                        <span className="font-[Outfit] font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#606062]">
                                          Call
                                        </span>
                                      </div>
                                    ))}

                                    {/* Add button */}
                                    <div className="border border-indigo-500 rounded-md p-1 flex items-center justify-center">
                                      <Plus className="w-5 h-5 text-[#5B5FC7]" />
                                    </div>
                                  </div>
                                </div>

                                {/* Lead Strength Card */}
                                {/* <div className="border border-[#E7E7E9] bg-[#F9F9FB] p-3 rounded-[16px]">
    <div className="flex items-center mb-2">
      <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
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

                                <div className="border border-[#E7E7E9] bg-[#F9F9FB] p-3 rounded-[16px]">
                                  <div className="flex justify-between">
                                    <div className="flex flex-col ">
                                      <div className="flex items-center mb-4">
                                        <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                          <img
                                            src="/location.svg"
                                            alt=""
                                            className="w-[18px] h-[18px]"
                                          />
                                        </div>
                                        <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                                          SITE VISIT (
                                          {projectData.siteVisit.count})
                                        </span>
                                      </div>

                                      <div>
                                        <p className="font-normal text-[14px] text-[#606062]">
                                          Visit Date:{' '}
                                          {projectData.siteVisit.date}
                                        </p>
                                        <p className="font-normal text-[14px] text-[#606062]">
                                          Site In-charge:{' '}
                                          {projectData.siteVisit.inCharge}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-center font-semibold text-[14px] text-[#0E0A1F]">
                                      <img
                                        src="/good.svg"
                                        alt="icon"
                                        className="mb-1 w-16 h-16"
                                      />
                                      Good
                                    </div>
                                  </div>
                                </div>

                                {/*
  <div className="border border-[#E7E7E9] bg-[#F9F9FB] p-4 rounded-[16px]">
  <div className="flex items-center mb-4">
    <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
      <img src="/quill_clock.svg" alt="" className='w-[18px] h-[18px]' />
    </div>
    <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">SITE VISIT (4)</span>
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

                                <div className="border border-[#E7E7E9] bg-[#F9F9FB] p-4 rounded-[16px] cursor-pointer">
                                  <div className="flex items-center mb-4">
                                    <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                      <img
                                        src="/target-sale.svg"
                                        alt="Clock Icon"
                                        className="w-[18px] h-[18px]"
                                      />
                                    </div>
                                    <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
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
                                            ? 'border-b pb-3 mb-3'
                                            : ''
                                        }`}
                                      >
                                        <div className="flex justify-between  items-center">
                                          <div className="flex gap-2 items-center">
                                            <img
                                              src="/fileicon.svg"
                                              alt="File Icon"
                                              className="w-5 h-5"
                                            />
                                            <span className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                              {item.label}
                                            </span>
                                          </div>
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
                                <div className=" rounded-[16px] p-4  bg-[#F9F9FB]  border border-[#E7E7E9]  max-w-lg">
                                  <div className="flex items-center mb-4">
                                    {/* <div className="bg-purple-50 p-3 rounded-full mr-3">
          <Clock className="text-purple-600 w-5 h-5" />
        </div> */}
                                    <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                      <img
                                        src="/folder-library.svg"
                                        alt=""
                                        className="w-[18px] h-[18px]"
                                      />
                                    </div>
                                    <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                                      PROJECT
                                    </span>
                                  </div>

                                  <div className="mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                      <h2 className="font-medium text-base leading-tight tracking-normal text-[#404040]">
                                        {' '}
                                        {selProjectFullDetails?.projectName}
                                      </h2>
                                      <a
                                        href="#"
                                        className="font-medium text-xs leading-tight tracking-normal text-[#7746E0] underline decoration-solid decoration-0 decoration-offset-[25%] decoration-thick decoration-skip-ink-auto"
                                        onClick={() => {
                                          setUnitsViewMode(!unitsViewMode)
                                        }}
                                      >
                                        View Units (
                                        {selProjectFullDetails?.availableCount}/
                                        {selProjectFullDetails?.totalUnitCount})
                                      </a>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                      <div className="border bg-white rounded-lg py-1 px-2 flex items-center">
                                        <span className="mr-2 font-outfit font-normal text-xs leading-tight tracking-normal text-[#0E0A1F]">
                                          Planning Approval-
                                          {
                                            selProjectFullDetails?.planningApproval
                                          }
                                        </span>
                                        <div className="">
                                          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg> */}
                                          <img
                                            src="/yes1.svg"
                                            alt=""
                                            className="w-5 h-5"
                                          />
                                        </div>
                                      </div>

                                      <div className="border bg-white rounded-lg py-1 px-2 flex items-center">
                                        <span className="mr-2 font-outfit font-normal text-xs leading-tight tracking-normal text-[#0E0A1F]">
                                          Rera Approval-
                                          {
                                            selProjectFullDetails?.planningApproval
                                          }
                                        </span>
                                        <div className=" ">
                                          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg> */}
                                          <img
                                            src="/yes1.svg"
                                            alt=""
                                            className="w-5 h-5"
                                          />
                                        </div>
                                      </div>

                                      <div className="border bg-white rounded-lg py-1 px-2 font-outfit font-normal text-xs leading-tight tracking-normal text-[#0E0A1F] flex items-center justify-center">
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
                                        studio, 1 BHK, and 2 BHK apartments with
                                        modern amenities.
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
                                    className="mt-4 font-medium text-xs leading-tight tracking-normal text-[#7746E0] underline decoration-solid decoration-0 decoration-offset-[25%] decoration-thick decoration-skip-ink-auto flex items-center"
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
                                </div>

                                {/* Projects Card */}
                                <div className="border border-[#E7E7E9] bg-[#F9F9FB] p-4 rounded-[16px] ">
                                  {!isProjectsExpanded && (
                                    <div>
                                      <div className="flex items-center mb-4">
                                        <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                          {/* <Clock className="text-purple-600" size={20} /> */}
                                          <img
                                            src="/quill_clock.svg"
                                            alt=""
                                            className="w-[18px] h-[18px]"
                                          />
                                        </div>
                                        <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                                          PROJECTS (3)
                                        </span>
                                        <div className="ml-auto">
                                          <button className="bg-[#5B5FC7] p-1 rounded-lg text-white">
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
                                            <button className="font-outfit text-[#7746E0] font-normal text-[12px] leading-[100%] tracking-[0em] underline decoration-solid decoration-[0px] underline-offset-[0%]">
                                              View units
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <button
                                        onClick={toggleProjectsExpand}
                                        className="flex items-center font-medium text-[12px] leading-[100%] tracking-[0em] text-[#7746E0] mt-2"
                                      >
                                        +7 more{' '}
                                        <ChevronDown
                                          size={16}
                                          className="ml-1"
                                        />
                                      </button>
                                    </div>
                                  )}
                                  {/* Expanded View */}
                                  {isProjectsExpanded && (
                                    <div>
                                      <div className="flex items-center mb-4">
                                        <div className="border border-[#E7E7E9] bg-[#F9F9FB] p-1.5 rounded-[16px] mr-3">
                                          {/* <Clock className="text-purple-600" size={20} /> */}
                                          <img
                                            src="/quill_clock.svg"
                                            alt=""
                                            className="w-[18px] h-[18px]"
                                          />
                                        </div>
                                        <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                                          PROJECTS (3)
                                        </span>
                                        <div className="ml-auto">
                                          <button className="bg-[#EDE9FE] p-2 rounded-lg text-white">
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
                                </div>

                                <div className="border border-[#E7E7E9] bg-[#F9F9FB] p-4 rounded-[16px] ">
                                  <div className="flex items-center mb-4">
                                    <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                      <img
                                        src="/quill_clock.svg"
                                        alt=""
                                        className="w-[18px] h-[18px]"
                                      />
                                    </div>
                                    <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                                      ASSIGNED TO
                                    </span>
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    <div
                                      className="flex justify-between items-center cursor-pointer"
                                      onClick={toggleAssignedExpand}
                                    >
                                      {!user?.role?.includes(
                                        USER_ROLES.CP_AGENT
                                      ) ? (
                                        <div className="font-semibold text-sm text-slate-900 tracking-wide w-full">
                                          <AssigedToDropComp
                                            assignerName={assignerName}
                                            id={id}
                                            setAssigner={setAssigner}
                                            usersList={usersList}
                                            align={undefined}
                                          />
                                        </div>
                                      ) : (
                                        <span className="text-left text-sm font-medium text-[#404040]">
                                          {assignerName}
                                        </span>
                                      )}

                                      {isAssignedExpanded ? (
                                        <ChevronUp
                                          size={20}
                                          className="text-gray-500"
                                        />
                                      ) : (
                                        <ChevronDown
                                          size={20}
                                          className="text-gray-500"
                                        />
                                      )}
                                    </div>

                                    {/* Date display - shown for all users */}
                                    <div className="font-normal text-[12px] leading-[100%] tracking-[0em] text-[#666666]">
                                      {assignT != undefined
                                        ? prettyDateTime(assignT)
                                        : prettyDateTime(Date)}
                                    </div>
                                  </div>
                                </div>

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
                                <div className="border border-[#E7E7E9] bg-[#F9F9FB] cursor-pointer p-4 rounded-[16px] ">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                      <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                        <img
                                          src="/call.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>
                                      <h2 className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                                        CALL ACTIVITY
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
                                            ? 'pb-3 border-b border-gray-200'
                                            : ''
                                        }`}
                                      >
                                        <div className="flex items-center">
                                          <div className="mr-3">
                                            <img
                                              src="/fileicon.svg"
                                              alt="Icon"
                                              className="w-5 h-5"
                                            />
                                          </div>
                                          <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                            {item.label}
                                          </p>
                                        </div>
                                        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162]">
                                          {item.value}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="border border-[#E7E7E9] bg-[#F9F9FB] cursor-pointer p-4 rounded-[16px] ">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                      <div className="bg-[#EDE9FE] p-1.5 rounded-lg mr-3">
                                        <img
                                          src="/quill_clock.svg"
                                          alt="Clock Icon"
                                          className="w-[18px] h-[18px]"
                                        />
                                      </div>
                                      <h2 className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
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
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                      <div className="flex items-center">
                                        <div className="mr-3">
                                          <img
                                            src="/fileicon.svg"
                                            alt="Icon"
                                            className="w-5 h-5"
                                          />
                                        </div>
                                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                          Created On
                                        </p>
                                      </div>
                                      <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162]">
                                        {CT != undefined
                                          ? prettyDateTime(CT)
                                          : prettyDateTime(Date)}
                                      </p>
                                    </div>

                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                      <div className="flex items-center">
                                        <div className="mr-3">
                                          <img
                                            src="/fileicon.svg"
                                            alt="Icon"
                                            className="w-5 h-5"
                                          />
                                        </div>
                                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                          Updated On :
                                        </p>
                                      </div>
                                      <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162]">
                                        {stsUpT === undefined
                                          ? 'NA'
                                          : prettyDateTime(stsUpT) || 'NA'}
                                      </p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <div className="mr-3">
                                          <img
                                            src="/fileicon.svg"
                                            alt="Icon"
                                            className="w-5 h-5"
                                          />
                                        </div>
                                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                                          Assigned On
                                        </p>
                                      </div>
                                      <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162]">
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
                                    selFilterVal === 'all' ? 'bg-[#e4faff]' : ''
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
                                      ? 'bg-[#e4faff] text-[0E0A1F]'
                                      : ''
                                  } `}
                                  onClick={() => setSelFilterVal('pending')}
                                >
                                  <CheckCircleIcon className="w-4 h-3  inline " />
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
                                      ? 'bg-[#e4faff]'
                                      : ''
                                  }  rounded-xl rounded-l-none`}
                                  onClick={() => setSelFilterVal('completed')}
                                >
                                  <CheckCircleIcon className="w-4 h-3 inline text-[#058527]" />
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
                          {loader && (
                            <div
                              id="toast-success"
                              className="flex items-center w-[96.4%] mx-4 rounded-t-lg p-2 text-white
                     bg-[#7bd2ea]"
                              role="alert"
                            >
                              <div className=" text-sm font-normal font-bodyLato  tight-wider">
                                Hey, Plan your{' '}
                                <span className="text-xs  tight-wider ">
                                  {tempLeadStatus.toLocaleUpperCase()}{' '}
                                </span>
                                ..!
                              </div>
                              <button
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
                              </button>
                            </div>
                          )}
                          {addSch && (
                            <div className="flex flex-col pt-0 my-10 mx-4 mt-[0px] ">
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
                                    <div className=" form outline-none border  py-4">
                                      <section className=" px-4">
                                        <div className="text-xs font-bodyLato text-[#516f90]">
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
                                          className="w-full h-full pb-1 outline-none text-sm font-bodyLato focus:border-blue-600 hover:border-blue-600  border-b border-[#cdcdcd] text-[33475b]  "
                                        ></input>
                                        <div className="flex flex-row mt-3">
                                          <section>
                                            <span className="text-xs font-bodyLato text-[#516f90]">
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
                                                  className=" mt-[2px] pl- px- min-w-[240px] inline text-xs text-[#0091ae] "
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
                                        </div>
                                      </section>
                                      <div className="flex flex-row mt-4 justify-between pr-4 border-t">
                                        <section>
                                          <span>{''}</span>
                                        </section>
                                        <section className="flex">
                                          <button
                                            type="submit"
                                            className={`flex mt-2 cursor-pointer rounded-lg text-bodyLato items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium   bg-[#7bd2ea] bg-[#7bd2ea] text-black hover:bg-gray-700 hover:text-white  `}
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
                                            className={`flex mt-2 ml-4 rounded-lg items-center text-bodyLato pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white `}
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
                          <div className="max-h-[60%]">
                            <ol className="relative  border-gray-200 ">
                              {leadSchFilteredData.map((data, i) => (
                                <section
                                  key={i}
                                  className=" mx-2 bg-[#FFF] mb-[1px]  px-3 py-3 border-b"
                                  onMouseEnter={() => {
                                    hoverEffectTaskFun(data?.ct)
                                  }}
                                  onMouseLeave={() => {
                                    hoverEffectTaskFun(2000)
                                  }}
                                >
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
                                    />
                                    {addTaskCommentObj?.ct === data?.ct && (
                                      <AddLeadTaskComment
                                        closeTask={closeTask}
                                        data={data}
                                        setShowVisitFeedBackStatusFun={
                                          setShowVisitFeedBackStatusFun
                                        }
                                        setShowNotInterestedFun={
                                          setShowNotInterestedFun
                                        }
                                        setAddCommentTitle={setAddCommentTitle}
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
                                        addCommentPlusTask={addCommentPlusTask}
                                        setSelType={setSelType}
                                        selType={selType}
                                        d={d}
                                      />
                                    )}
                                    {data?.comments?.map((commentObj, k) => {
                                      return (
                                        <li
                                          key={k}
                                          className={`ml-6 py-1 text-[14px] text-[#7E92A2] tracking-wide ${
                                            data?.comments?.length - 1 === k
                                              ? 'mb-1'
                                              : ''
                                          }`}
                                        >
                                          <section className="flex flex-row justify-between">
                                            <span>
                                              {' '}
                                              <svg
                                                viewBox="0 0 12 12"
                                                className="notes_icon inline w-4 h-4 mr-1"
                                                aria-label="2 comments"
                                              >
                                                <g
                                                  fill="none"
                                                  fillRule="evenodd"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    fillRule="nonzero"
                                                    d="M9.5 1A1.5 1.5 0 0 1 11 2.5v5A1.5 1.5 0 0 1 9.5 9H7.249L5.28 10.97A.75.75 0 0 1 4 10.44V9H2.5A1.5 1.5 0 0 1 1 7.5v-5A1.5 1.5 0 0 1 2.5 1h7zm0 1h-7a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5H5v1.836L6.835 8H9.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"
                                                  ></path>
                                                </g>
                                              </svg>{' '}
                                              <span className="text-[#606062]">
                                                {commentObj?.c}
                                              </span>
                                            </span>
                                            <span className="text-[#606062] text-[14px]">
                                              {' '}
                                              {prettyDateTime(commentObj?.t)}
                                            </span>
                                          </section>
                                        </li>
                                      )
                                    })}
                                    {(showNotInterested ||
                                      showVisitFeedBackStatus) &&
                                      selSchGrpO?.ct === data?.ct && (
                                        <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-[#FFFFFF] mx-2">
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
                                          {showVisitFeedBackStatus && (
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
                                          )}

                                          <div className="  outline-none border  rounded p-4 mt-4">
                                            <textarea
                                              value={fbNotes}
                                              onChange={(e) =>
                                                setfbNotes(e.target.value)
                                              }
                                              placeholder="Type & make a notes *"
                                              className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFFFFF] "
                                            ></textarea>
                                          </div>
                                          <div className="flex flex-row mt-1">
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
                                              className={`flex mt-2 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                            >
                                              <span className="ml-1 ">
                                                Save
                                              </span>
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
                                              className={`flex mt-2 ml-4 rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-balck  bg-[#7bd2ea]  hover:bg-gray-700 hover:text-white `}
                                            >
                                              <span className="ml-1 ">
                                                Save & Whats App
                                              </span>
                                            </button>
                                            <button
                                              onClick={() =>
                                                cancelResetStatusFun()
                                              }
                                              className={`flex mt-2 ml-4  rounded-lg items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white  `}
                                            >
                                              <span className="ml-1 ">
                                                Cancel
                                              </span>
                                            </button>
                                          </div>
                                        </div>
                                      )}
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
                                  </>
                                </section>
                              ))}{' '}
                            </ol>
                          </div>
                        </div>
                      )}
                    </Formik>
                  </>
                )}
                {selFeature === 'timeline' && (
                  <div className="py-8 mx-4">
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

                    <div className="mx-4">
                      <ol className="col-span-12 space-y-2 relative pl-4 sm:col-span-8  sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:bg-gray-200">
                        {filterData?.map((data, i) => (
                          <section
                            key={i}
                            className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:bg-[#7BD2EA] bg-white  rounded-lg"
                          >
                            <a
                              href="#"
                              className="block items-center px-3 sm:flex "
                            >
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
                                </>
                              )}
                              {data?.type != 'ph' && (
                                <div className="text-gray-600 font-bodyLato mx-3 my-1">
                                  <div className="text-base font-normal">
                                    {data?.type === 'sts_change' && (
                                      <span className="text-sm font-medium text-gray-800 ">
                                        {data?.from?.toUpperCase()} {'  '}
                                      </span>
                                    )}
                                    <span className="text-sm font-normal text-gray-800 mx-2 ">
                                      {activieLogNamer(data)}
                                    </span>{' '}
                                    {data?.type === 'sts_change' && (
                                      <span className="text-sm font-medium text-gray-800 ">
                                        {'  '} {data?.to?.toUpperCase()}
                                      </span>
                                    )}
                                    {data?.type === 'assign_change' && (
                                      <span className="text-xs  text-gray-500 ">
                                        {'  '} {empNameSetter(data?.to)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm font-normal">
                                    {data?.txt}
                                  </div>
                                  <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                                    <ClockIcon className=" w-3 h-3   text-gray-500" />

                                    <span className="text-xs  text-gray-500 ml-1">
                                      {data?.type == 'ph'
                                        ? timeConv(
                                            Number(data?.time)
                                          ).toLocaleString()
                                        : timeConv(data?.T).toLocaleString()}
                                    </span>

                                    <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>

                                    <span className="text-xs  text-gray-500">
                                      by:
                                    </span>
                                    <span className="text-xs  text-gray-500 ml-1 ">
                                      {data?.by}
                                    </span>
                                  </span>
                                </div>
                              )}
                            </a>
                          </section>
                        ))}
                      </ol>
                    </div>
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
