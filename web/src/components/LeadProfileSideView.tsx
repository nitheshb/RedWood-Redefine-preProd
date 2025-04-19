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
import { Slider } from '@mui/material'
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
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { db, storage } from 'src/context/firebaseConfig'
import { prettyDate, prettyDateTime, timeConv } from 'src/util/dateConverter'
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

  const [selFeature, setFeature] = useState('appointments')
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
  }, [projectList, customerDetails])

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
    }

    else {
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
  useEffect(() => {
  }, [customerDetails])

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
    if (newStatus == 'visitdone') {
      enqueueSnackbar(`Create VISIT-FIXED Task`, {
        variant: 'error',
      })

      return
    }

    setLeadStatus(newStatus)

    const arr = ['visitdone', 'visitcancel']
    if (newStatus === 'visitdone') {
      setFeature('visitDoneNotes')
    } else if (newStatus === 'visitcancel') {
      setFeature('visitCancelNotes')
    } else if (newStatus === 'notinterested') {
      setShowNotInterestedFun({}, '')
    } else if (newStatus === 'junk') {
      setLoader(false)
      setShowJunk(true)
    } else {
      arr.includes(newStatus) ? setFeature('notes') : setFeature('appointments')
      arr.includes(newStatus) ? setAddNote(true) : setAddSch(true)
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
    setLeadStatus(streamCurrentStatus)
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
      const covA = [
        ...(customerDetails?.coveredA || []),
        ...['visitfixed', 'visitdone'],
      ]

      const dat = {
        coveredA: covA,
        from: streamCurrentStatus,
        Status: 'negotiation',
        VisitDoneReason: fbTitle,
        VisitDoneNotes: fbNotes,
        stsUpT: Timestamp.now().toMillis(),
        Remarks: `${fbTitle}-${fbNotes}`,
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
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User not found!");
      return;
    }

    const { fcmToken } = userSnap.data();

    if (!fcmToken) {
      console.error("FCM Token not found for user!");
      return;
    }

    await addDoc(collection(db, "calls"), {
      name,
      number,
      fcmToken,
      // timestamp: Timestamp.now()
    });

    console.log("Call document added successfully!");
  } catch (error) {
    console.error("Error in call trigger:", error);
  }
}


  return (
    <>
    <div
      className={`bg-[#e7f6fa]   h-screen    ${openUserProfile ? 'hidden' : ''} `}
    >

      <div className="h-screen overflow-y-auto">
        <div className=" pb-[2px] px-3  mt-0 rounded-xs  bg-[#e7f6fa]">
          <div className="-mx-3 flex  sm:-mx-4 px-3 flex justify-between">
            <div className="w-full pl-1 pt-[2px] xl:w-4/12  ">
              <div className="">
                <div className="font-semibold text-[#053219]  text-sm  mt-3 mb-1  tracking-wide font-bodyLato">
                  <div className="flex flex-row">

                    <div className="flex flex-col ml-[6px]">
                      <div className=" flex flex-row">
                        <span className="  text-[16px] uppercase">{Name}</span>
                        <PencilIcon
                          className="w-3 h-3 ml-2 mt-1 inline text-[#058527] cursor-pointer "
                          onClick={() => {
                            setisImportLeadsOpen(true)

                          }}
                        />{' '}
                        <div className=" text-sm  ml-[4px]  px-[3px] pt-[px] rounded  text-[#FF8C02] ">
                          {currentStatusDispFun(leadDetailsObj?.Status)}{' '}
                        </div>



<button
  onClick={() => {
    console.log('Call button clicked for lead:', Name, Mobile);
    handleCallButtonClick(assignedTo, Name, Mobile);
  }}
  className=" rounded-md text-[10px]  px-2 border border-[#7bd2ea]  text-black"
  title="Call"
>
  Call
</button>
                      </div>
                      <div className="flex mt-2 gap-2 flex-row">
                      <div className="font-outfit font-normal text-[14px] leading-[100%] tracking-[0.06em] mb-[2px] border-0 border-r-2 border-red pr-1 ">
  <DeviceMobileIcon className="w-3 h-3 inline text-[#0E0A1F] mb-[2px] " />{' '}
  <span className="mr-[2px]  text-[14px] ">
    {Mobile?.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
  </span>
</div>



                        <div className="font-outfit font-normal text-[14px] leading-[100%] tracking-[6%]">
                          <MailIcon className="w-3 h-3 inline text-[#141B34] " />{' '}
                          {Email}
                        </div>
                      </div>
                    </div>




                     {/* <div className="flex flex-col ml-[6px]">
      <div className="flex flex-row">
        <span className="text-[16px] uppercase">{Name}</span>
        <PencilIcon
          className="w-3 h-3 ml-2 mt-1 inline text-[#058527] cursor-pointer"
          onClick={() => setisImportLeadsOpen(true)}
        />
        <div className="text-sm ml-[4px] px-[3px] pt-[1px] rounded text-[#FF8C02]">
          {leadDetailsObj?.Status}
        </div>
      </div>

      <div className="flex flex-row">
        <div className="font-md text-sm text-gray-500 tracking-wide">
          <DeviceMobileIcon className="w-3 h-3 inline text-[#058527]" />{" "}
          <span className="mr-[2px] text-[12px]">
            {Mobile?.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
          </span>
        </div>
        <div className="font-md text-sm text-gray-500 ml-[6px] tracking-wide">
          <MailIcon className="w-3 h-3 inline text-[#058527]" /> {Email}
        </div>
      </div>


      <button
        onClick={sendNotification}
        className="mt-2 flex items-center px-3 py-1 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
      >
        <PhoneIcon className="w-4 h-4 mr-2" /> Call
      </button>
    </div> */}
{/*
<div className="flex flex-col ml-[6px]">
  <div className="flex flex-row">
    <span className="text-[16px] uppercase">{Name}</span>
    <PencilIcon
      className="w-3 h-3 ml-2 mt-1 inline text-[#058527] cursor-pointer"
      onClick={() => setisImportLeadsOpen(true)}
    />
    <div className="text-sm ml-[4px] px-[3px] pt-[1px] rounded text-[#FF8C02]">
      {leadDetailsObj?.Status}
    </div>
  </div>

  <div className="flex flex-row">
    <div className="font-md text-sm text-gray-500 tracking-wide">
      <DeviceMobileIcon className="w-3 h-3 inline text-[#058527]" />{" "}
      <span className="mr-[2px] text-[12px]">
        {Mobile?.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
      </span>
    </div>
    <div className="font-md text-sm text-gray-500 ml-[6px] tracking-wide">
      <MailIcon className="w-3 h-3 inline text-[#058527]" /> {Email}
    </div>
  </div>

  <button
    onClick={sendNotification}
    className="mt-2 flex items-center px-3 py-1 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
  >
    <PhoneIcon className="w-4 h-4 mr-2" />
    {isSending ? 'Sending...' : 'Call via App'}
  </button>
</div> */}





                  </div>
                </div>
              </div>
            </div>
            <div className='mt-3'>

            <div className=" ml-2 ">
              <div className="flex flex-row  bg-[#e7f6fa] border rounded-xl p-4 py-2 ">
                {/* <section>
                  <div className="font-md text-xs text-gray-500 mb-[px] tracking-wide mr-4">
                    Assigned To box {}
                  </div>
                  {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                    <div>
                      <AssigedToDropComp
                        assignerName={assignerName}
                        id={id}
                        setAssigner={setAssigner}
                        usersList={usersList}
                        align={undefined}
                        classNames={{
                          container: 'text-left',
                          button: 'bg-[#f4f4f4] text-black border border-gray-300',
                          item: 'hover:bg-blue-100',
                          chevron: 'text-blue-600',
                          menuItems: 'shadow-xl',
                        }}


                      />
                    </div>
                  )}
                  {user?.role?.includes(USER_ROLES.CP_AGENT) && (
                    <span className="text-left text-sm"> {assignerName}</span>
                  )}
                </section> */}
                <section>
  <div className="font-md text-xs text-gray-500 mb-[px] tracking-wide mr-4">
    <label htmlFor="assignedTo" className="block text-[12px]  text-gray-700">
      Assigned To
    </label>
  </div>
  {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                      <div className="font-semibold text-sm text-slate-900 tracking-wide overflow-ellipsis">

      <AssigedToDropComp
        assignerName={assignerName}
        id={id}
        setAssigner={setAssigner}
        usersList={usersList}
        align={undefined}


      />
    </div>
  )}
  {user?.role?.includes(USER_ROLES.CP_AGENT) && (
    <span className="text-left text-sm"> {assignerName}</span>
  )}
</section>

                <section className=" ml-2">
                  <div className="flex flex-row ">
                    {/* <div className="font-md text-xs text-gray-500 mb-[2px] tracking-wide mr-4">
                      Project {}
                    </div> */}
                        <label htmlFor="assignedTo" className="block text-[12px] text-gray-700">
                        Project
    </label>
                  </div>
                  <div className="font-semibold text-sm text-slate-900 tracking-wide overflow-ellipsis">

                    <AssigedToDropComp
                      assignerName={selProjectIs?.projectName || Project}
                      id={id}
                      align="right"
                      setAssigner={setNewProject}
                      usersList={projectList}

                    />
                  </div>
                </section>
                <section>
                  <div>
                    <div className="text-center items-center  mt-[1px]">
                      <div
                        className="text-center border border-[#7BD2EA] text-[#5198ab]  rounded-[8px] px-2 py-2 ml-1 items-center align-middle text-xs cursor-pointe"
                        onClickCapture={() => {
                          setUnitsViewMode(!unitsViewMode)
                        }}
                      >
                        {selProjectIs?.uid?.length > 4 &&
                          (unitsViewMode ? (

                            <span className="   text-black  text-[10px] text-[#] font-semibold whitespace-nowrap">
                              {' '}
                              Show Lead
                            </span>
                          ) : (

                            <span className="   text-white-300  text-[10px] text-[#] font-semibold whitespace-nowrap">
                              {' '}
                              Show Units
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            </div>

          </div>

          {/* <hr className="h-[1px]  bg-gradient-to-r from-[#F6F5F8]/100 via-[#B1B1B1] to-[#F6F5F8]/100 border-0 my-3" /> */}



          <div className="flex flex-row justify-between">
            <div className=" py-0 flex flex-row  text-xs font-thin  text-[12px]  py-[6px] px-2 ">
              Recent Comments:{' '}
              <span className="text-[#867777] ml-1 ">
                {' '}
                {leadDetailsObj?.Remarks || 'NA'}
              </span>
            </div>
            <div
              className="relative flex flex-col  group"
            >
              <div
                className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
                style={{ zIndex: '9999' }}
              >
                <span
                  className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                  style={{
                    color: 'black',
                    background: '#e2c062',
                    maxWidth: '300px',
                  }}
                >
                  <div className="italic flex flex-col">
                    <div className="font-bodyLato">
                      {Source?.toString() || 'NA'}
                    </div>
                  </div>
                </span>
                <div
                  className="w-3 h-3  -mt-2 rotate-45 bg-black"
                  style={{ background: '#e2c062', marginRight: '12px' }}
                ></div>
              </div>
              <div className=" flex flex-row ">
                <span className="font-bodyLato text-[#867777] text-xs mt-2">


                  {Source?.toString() || 'NA'}
                </span>
                <div
                  className=" cursor-pointer hover:underline"
                  onClickCapture={() => {
                    setTimeHide(!timeHide)
                  }}
                >
                  {selProjectIs?.uid?.length > 4 &&
                    (timeHide ? (
                      <XIcon
                        className="h-4 w-4  inline text-green"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="px-[3px]  ml-1  text-[#318896]  text-[10px] text-[#] font-semibold">
                        {' '}
                        <AdjustmentsIcon
                          className="h-4 w-4  inline text-[#318896] "
                          aria-hidden="true"
                        />
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

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
<div className='mt-[1px] bg-white'>
  <div className="flex flex-row justify-between pb-3 pt-5 mb-0   bg-white relative">
    {StatusListA.map((statusFlowObj, i) => (
      <div key={i} className="flex-1 flex flex-col items-center relative">
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-200 mb-1 z-10 ${
            streamCoveredA.includes(statusFlowObj.value)
              ? 'bg-[#058527] border-[#dff1fb] text-white'
              : statusFlowObj.value === streamCurrentStatus || statusFlowObj.value === tempLeadStatus
                ? 'bg-white border-black text-black'
                : 'bg-white border-gray-300 text-gray-300'
          }`}
          onClick={() => setStatusFun(id, statusFlowObj.value)}
          onMouseEnter={() => {
            hoverEffectFun(i);
            setHover(true);
          }}
          onMouseLeave={() => {
            hoverEffectFun(1000);
            setHover(false);
          }}
          style={{
            ...(hover && hoverId === i ? { boxShadow: '0 0 0 3px rgba(44, 164, 218, 0.2)' } : {}),
            cursor: 'pointer',
          }}
        >
          {streamCoveredA.includes(statusFlowObj.value) ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : statusFlowObj.value === streamCurrentStatus || statusFlowObj.value === tempLeadStatus ? (
            <div className="h-2 w-2 bg-black  rounded-full" />
          ) : i >= StatusListA.length - 2 ? null : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <span className={`font-bodyLato text-[11px] text-black font-normal px-2 py-1 z-10 text-center ${statusFlowObj.value === streamCurrentStatus || statusFlowObj.value === tempLeadStatus ? 'text-[13px]': 'text-[11px]'}`}>
          {statusFlowObj.label}
        </span>

        {i < StatusListA.length - 1 && (
          <div
            className={`absolute top-3 left-[calc(50%+0.5rem)] h-[1px] w-[calc(100%-1rem)] ${
              streamCoveredA.includes(StatusListA[i + 1].value)
                ? 'bg-[#0E0A1F]'
                : 'bg-gray-300'
            }`}
            style={{ transform: 'translateY(-50%)' }}
          />
        )}
      </div>
    ))}
  </div>
</div>









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
            <section className=" pb-8 pt-1 px-2  rounded-xs  bg-white mt-1 mx-2 rounded-lg">
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
                        className="rounded-[8px] px-[10px] py-[11px] gap-[8px] border text-[#000000] font-outfit font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer"
                        onClick={() => setFeature('lead_strength')}
                      >
                        Lead Strength
                      </span>
                    )}
                    {selFeature == 'lead_strength' && (
                      <span
                        className="rounded-[8px] px-[10px] py-[11px] gap-[8px] border text-[#000000] font-outfit font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer"
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
                          assetPossesed: {},
                        }}
                        onSubmit={(values, { resetForm }) => {

                        }}
                      >
                        {(formik) => (
                          <div className="flex flex-col pt-0 my-10 mt-[30px] rounded bg-[#d1d8e7] mx-4 p-4">
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
                                  <div> {`${optionvalues.asstr}%`}</div>
                                </div>
                                <CustomSelect
                                  name="assetPossesed"
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
                                  <div> {`${optionvalues.pstr}%`}</div>
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
                                  <div> {`${optionvalues.astr}%`}</div>
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
                                  onClick={() => fAddNotes()}
                                  className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-teal-900  hover:bg-teal-700  `}
                                >
                                  <span className="ml-1 ">Save</span>
                                </button>

                                <button
                                  onClick={() => setFeature('appointments')}
                                  className={`flex mt-2 ml-4  rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-teal-900 hover:text-white  `}
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
                    <div className="flex flex-col justify-between border pt-6">
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
                              <div className=" form flex flex-col pt-0 my-10 mt-[10px] rounded bg-[#FFF9F2] mx-4 p-4">


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
                                    className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFF9F2] "
                                  ></textarea>
                                </div>
                                <div className="flex flex-row mt-1">
                                  <button
                                    type="submit"
                                    className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
                                  >
                                    <span className="ml-1 ">Save</span>
                                  </button>
                                  <button
                                    onClick={() => cancelResetStatusFun()}
                                    type="submit"
                                    className={`flex mt-2 ml-4 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
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
                                    <span className="text-red-900 ml-1 mr-4">
                                      {prettyDateTime(data?.ct)}
                                    </span>
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

                  {selFeature === 'visitDoneNotes' && (
                    <div className="flex flex-col justify-between border pt-6">
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
                              <span className="text-blue-600"> Add Notes</span>
                            </time>
                          </button>
                        </div>
                      )}
                      {addNote && (
                        <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-[#FFF9F2] mx-4 p-4">
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
                              className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFF9F2] "
                            ></textarea>
                          </div>
                          <div className="flex flex-row mt-1">
                            <button
                              onClick={() => fAddNotes()}
                              className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
                            >
                              <span className="ml-1 ">Save</span>
                            </button>
                            <button
                              onClick={() => fAddNotes()}
                              className={`flex mt-2 ml-4 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
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
                              type="submit"
                              className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
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
                        </section>
                      ))}
                    </ol>
                  </div>
                </>
              )}

              {selFeature === 'appointments' && (
                <>
                  <Formik
                    initialValues={initialState1}

                  >
                    {(formik2) => (
                      <div className=" h-screen bg-white rounded-xl mt-2 ">
                        {(showNotInterested ||
                          showVisitFeedBackStatus ||
                          showJunk) &&
                          selSchGrpO?.ct === undefined && (
                            <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-[#FFF9F2] mx-4 p-4">
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
                                    className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFF9F2] "
                                  ></textarea>
                                </div>
                              )}
                              <div className="flex flex-row mt-1">
                                <button
                                  onClick={() => notInterestedFun()}
                                  className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
                                >
                                  <span className="ml-1 ">Save</span>
                                </button>
                                <button
                                  onClick={() => notInterestedFun()}
                                  className={`flex mt-2 ml-4 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
                                >
                                  <span className="ml-1 ">
                                    Save & Whats App
                                  </span>
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

                        <div className="font-md font-medium text-xs  ml-2 text-gray-800 flex flex-row justify-between mr-4 py-2">
                          {/* <section className="flex flex-row py-1">



                          </section> */}
                          <div className="flex flex-row ">


                            <div className="flex flex-row bg-white rounded-xl border ">
                              <div
                                className={` py-1 pr-4 pl-4 min-w-[62px] ${
                                  selFilterVal === 'all' ? 'bg-[#c6fff0]' : ''
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
                                    ? 'bg-[#7BD2EA]'
                                    : ''
                                } `}
                                onClick={() => setSelFilterVal('pending')}
                              >
                                <CheckCircleIcon className="w-4 h-3  inline text-black" />
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
                                    ? 'bg-[#c6fff0]'
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
                     bg-[#516F90]"
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
                                                  setHours(setMinutes(d, 1), 0),
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
                                          className={`flex mt-2 cursor-pointer rounded-lg text-bodyLato items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium  bg-[#FF7A53] bg-[#7bd2ea] text-black hover:bg-gray-700  `}
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
                                          onClick={() => cancelResetStatusFun()}
                                          className={`flex mt-2 ml-4 rounded items-center text-bodyLato pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white `}
                                        >
                                          <span className="ml-1 ">Cancel</span>
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
                                    cancelResetStatusFun={cancelResetStatusFun}
                                    editTaskFun={editTaskFun}
                                    d={d}
                                  />
                                ) : null}
                                <>
                                  {' '}
                                  <LeadTaskDisplayHead
                                    data={data}
                                    setAddTaskCommentObj={setAddTaskCommentObj}
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
                                      setPostPoneToFuture={setPostPoneToFuture}
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
                                        className={`ml-6 text-[13px] text-[#7E92A2] tracking-wide ${
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
                                              className="notes_icon inline w-2 h-2 mr-1"
                                              aria-label="2 comments"
                                            >
                                              <g fill="none" fillRule="evenodd">
                                                <path
                                                  fill="currentColor"
                                                  fillRule="nonzero"
                                                  d="M9.5 1A1.5 1.5 0 0 1 11 2.5v5A1.5 1.5 0 0 1 9.5 9H7.249L5.28 10.97A.75.75 0 0 1 4 10.44V9H2.5A1.5 1.5 0 0 1 1 7.5v-5A1.5 1.5 0 0 1 2.5 1h7zm0 1h-7a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5H5v1.836L6.835 8H9.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"
                                                ></path>
                                              </g>
                                            </svg>{' '}
                                            {commentObj?.c}
                                          </span>
                                          <span>
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
                                      <div className="flex flex-col pt-0 my-10 mt-[10px] rounded bg-[#FFF9F2] mx-4 p-4">
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
                                              options={siteVisitFeedbackOptions}
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
                                            className="w-full h-full pb-10 outline-none  focus:border-blue-600 hover:border-blue-600 rounded bg-[#FFF9F2] "
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
                                                enqueueSnackbar(
                                                  'Please Enter Notes',
                                                  {
                                                    variant: 'warning',
                                                  }
                                                )
                                              }
                                            }}
                                            className={`flex mt-2 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
                                          >
                                            <span className="ml-1 ">Save</span>
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
                                            className={`flex mt-2 ml-4 rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium text-white bg-[#FF7A53]  hover:bg-gray-700  `}
                                          >
                                            <span className="ml-1 ">
                                              Save & Whats App
                                            </span>
                                          </button>
                                          <button
                                            onClick={() =>
                                              cancelResetStatusFun()
                                            }
                                            className={`flex mt-2 ml-4  rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium border  hover:bg-gray-700 hover:text-white  `}
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
                <div className="py-8 px-8  border">
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
                  <div className="font-md font-medium text-xs mb-4 text-gray-800">
                    Timeline
                  </div>
                  <ol className="relative border-l border-gray-200 ">
                    {filterData?.map((data, i) => (
                      <section key={i} className=" mx-2 bg-white mb-2">
                        <a
                          href="#"
                          className="block items-center px-3 sm:flex hover:bg-gray-100 "
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
                                  <span className="text-xs text-red-900 ">
                                    {data?.from?.toUpperCase()} {'  '}
                                  </span>
                                )}
                                <span className="text-sm text-green-900 mx-2 ">
                                  {activieLogNamer(data)}
                                </span>{' '}
                                {data?.type === 'sts_change' && (
                                  <span className="text-xs text-red-900 ">
                                    {'  '} {data?.to?.toUpperCase()}
                                  </span>
                                )}
                                {data?.type === 'assign_change' && (
                                  <span className="text-xs text-red-900 ">
                                    {'  '} {empNameSetter(data?.to)}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-normal">
                                {data?.txt}
                              </div>
                              <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                                <ClockIcon className=" w-3 h-3 text-gray-300" />

                                <span className="text-gray-400 ml-1 mr-4">
                                  {data?.type == 'ph'
                                    ? timeConv(
                                        Number(data?.time)
                                      ).toLocaleString()
                                    : timeConv(data?.T).toLocaleString()}
                                </span>
                                <span className="text-green-900 ml-2">by:</span>
                                <span className="text-gray-400 ml-1 mr-4">
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
