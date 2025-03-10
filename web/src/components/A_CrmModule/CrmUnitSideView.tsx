/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import {
  XIcon,
} from '@heroicons/react/solid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import {
  addLeadScheduler,
  deleteSchLog,
  steamLeadActivityLog,
  steamLeadScheduleLog,
  updateSchLog,
  addLeadNotes,
  steamLeadNotes,
  createAttach,
  getCustomerDocs,
  getAllProjects,
  updateLeadProject,
  getFinanceForUnit,
  capturePaymentS,
  updateUnitStatus,
  steamUsersListByDept,
  updateUnitCrmOwner,
  streamUnitById,
  updateCrmExecutiveReAssignAgreegations,
  getProjectByUid,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import {
  prettyDate,
  prettyDateTime,
} from 'src/util/dateConverter'
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import SiderForm from '../SiderForm/SiderForm'
import AssigedToDropComp from '../assignedToDropComp'
import { USER_ROLES } from 'src/constants/userRoles'
import UnitFullSummary from './CrmUnitFullSummary'
import { getWhatsAppTemplates } from 'src/util/TuneWhatsappMsg'
import { supabase } from 'src/context/supabase'
import { Pie, Tooltip } from 'recharts';
import { PieChart,  Cell } from 'recharts';
import { BellIcon } from 'lucide-react';
import { ChevronDownIcon } from "lucide-react";
import { calculatePercentages } from 'src/util/areaConverter'
import AssigedToDropCompCrm from '../assignedToDropCompCrm'

const data = [
  { name: 'Paid', value: 10 },
  { name: 'Remaining', value: 90 },
];




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

const StatusListA = [
  {
    label: 'Booking Review',
    value: 'booked',
    logo: 'FireIcon',
    color: 'bg-violet-500',
    allowed: ['cancel_booking', 'swapUnit', 'agreement_pipeline'],
  },
  {
    label: 'Allotment',
    value: 'agreement_pipeline',
    logo: 'RefreshIcon',
    color: 'bg-violet-500',
    allowed: ['agreement_pipeline', 'sd_pipeline', 'ATS'],
  },
  {
    label: 'Agreement',
    value: 'ATS',
    logo: 'FireIcon',
    color: 'bg-violet-500',
    allowed: ['registered'],
  },
  {
    label: 'Registered',
    value: 'registered',
    logo: 'DuplicateInactiveIcon',
    color: 'bg-violet-500',
    allowed: ['possession'],
  },
  {
    label: 'Possession',
    value: 'possession',
    logo: 'DuplicateInactiveIcon',
    color: 'bg-violet-500',
    allowed: [''],
  },
  {
    label: 'Cancel Booking',
    value: 'cancel_booking',
    logo: 'DuplicateInactiveIcon',
    color: 'bg-violet-500',
    allowed: [''],
  },
  {
    label: 'Swap Unit',
    value: 'swapUnit',
    logo: 'DuplicateInactiveIcon',
    color: 'bg-violet-500',
    allowed: [''],
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
  { label: 'Estimation Sheet', value: 'estimation_sheet' },
  { label: 'Payment Screenshot (IMPS/RTGS/NEFT)', value: 'payment_screenshot' },
  { label: 'Payment Receipt', value: 'payment_receipt' },
  { label: 'Others', value: 'others' },
]

const notInterestOptions = [
  { label: 'Select Document', value: '' },
  { label: 'Budget Issue', value: 'budget_issue' },
  { label: 'Looking for Different Property', value: 'differeent_options' },

  { label: 'Others', value: 'others' },


]
export default function UnitSideViewCRM({
  openUserProfile,
  rustomerDetails,
  unitViewerrr,
  unitsViewMode,
  setUnitsViewMode,
  transactionData,
  customerDetails,
  selCustomerPayload,
  selUnitDetails,
  setSelUnitDetails,

  selSubMenu,
  selSubMenu2,
}) {
  const { user } = useAuth()
  console.log('my user is ', user)
  const { enqueueSnackbar } = useSnackbar()

  const { orgId } = user
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])

  const [selFeature, setFeature] = useState('summary')
  const [tempLeadStatus, setLeadStatus] = useState('')
  const [assignerName, setAssignerName] = useState('')
  const [unitStatusObj, setUnitStatusObj] = useState({
    label: 'Booking Review',
    value: 'booking_review',
    logo: 'FireIcon',
    color: ' bg-violet-500',
  })

  const [assignedTo, setAssignedTo] = useState('')
  const [leadsActivityFetchedData, setLeadsFetchedActivityData] = useState([])

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
  const [newDemand, setOpenNewDemand] = useState(false)

  const d = new window.Date()
  const [value, setValue] = useState(d)

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
  const [financeMode, setFinanceMode] = useState('schedule')
  const [timeHide, setTimeHide] = useState(false)
  const [statusValidError, setStatusValidError] = useState(false)
  const [newStatusErrorList, setNewStatusErrorList] = useState('')
  const [unitPayload, setUnitPayload] = useState({})
  const [unitStatusLabel, setUnitStatusLabel] = useState('')
  const [allowStatusChangeOnDue, setAllowStatusChangeOnDue] = useState(false)











  const [selProjectIs, setSelProjectIs] = useState({
    projectName: '',
    uid: '',
    allowCrmStatusChangeOnDue: false
  })

  const [leadDetailsObj, setLeadDetailsObj] = useState({})
  useEffect(() => {
    console.log('hello', customerDetails)
    streamUnitDataFun()
  }, [])


  useEffect(() => {
    setSelUnitDetails(unitPayload)
  }, [unitPayload])

  useEffect(() => {
    setAllowStatusChangeOnDue(selProjectIs?.allowCrmStatusChangeOnDue)
  }, [selProjectIs])
  const {
    id,
    Name,
    Project,
    ProjectId,
    Source,
    status,
    unitStatus,
    by,
    Mobile,
    Date,
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

  const streamUnitDataFun = () => {
    const { id } = customerDetails
    console.log('hello ==>', customerDetails, unitPayload)
    const z = streamUnitById(
      orgId,
      (querySnapshot) => {
        const SnapData = querySnapshot.data()
        SnapData.id = id
        console.log('hello', SnapData)
        setUnitPayload(SnapData)
      },
      { uid: id },
      () => {
        console.log('error')
      }
    )
  }
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
    const unsubscribe = steamUsersListByDept(
      orgId,
      ['crm'],
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

    setLeadStatus(status)
    console.log('assinger to yo yo', customerDetails, customerDetails?.status)
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
    }

    else {
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
    getAllTransactionsUnit()
  }, [])

  const getAllTransactionsUnit = () => {
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
    setLeadStatus(status?.toLowerCase())
  }, [customerDetails])

  useEffect(() => {
    setCorrectStatusLableFun(status)
  }, [status])

  const setAssignerFun = (leadDocId, value) => {
    setAssignerName(value.name)
    setAssignedTo(value.value)


    const { data: data4, error: error4 } = supabase
      .from(`${orgId}_unit_logs`)
      .insert([
        {
          type: 'assign_change',
          subtype: 'crm_owner',
          T: Timestamp.now().toMillis(),
          Uuid: selCustomerPayload?.id,
          by,
          payload: {},
          from: '',
          to: value.name,
        },
      ])
    const txt = `A New Customer is assigned to ${value.name}`
    updateUnitCrmOwner(
      orgId,
      selCustomerPayload?.id,
      value,
      user.email,
      enqueueSnackbar
    )
    selCustomerPayload?.fullPs.map((ps) => {
      console.log('my values are', ps)
      const newPayload = ps
      newPayload.assignedTo = value?.value
      newPayload.oldAssignedTo = selCustomerPayload?.assignedTo

      updateCrmExecutiveReAssignAgreegations(
        orgId,
        newPayload,
        user.email,
        enqueueSnackbar
      )
    })

    const msgPayload = {
      projectName: Project,
      broucherLink: '',
      locLink: '',
      projContactNo: '',
      scheduleTime: d.getTime() + 60000,
    }
    const receiverDetails = {
      customerName: Name,
      executiveName: value.name,
      receiverPhNo: Mobile,
      executivePh: value?.offPh,
      executiveEmail: value?.email,
    }
    getWhatsAppTemplates(
      'on_lead_assign',
      'wa',
      'customer',
      ProjectId,
      receiverDetails,
      msgPayload
    )
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

  const setCorrectStatusLableFun = (status) => {
    const x = StatusListA.filter((d) => d.value === status)
    if (x.length > 0) {
      setUnitStatusLabel(x[0]?.label)
    }
  }
  const setStatusFun = async (leadDocId, newStatus) => {
    console.log('New Statusiiiiiiiii: ', newStatus);
    const x = StatusListA.filter((d) => d.value === status)
    let allowedList = [{ allowed: [] }]
    if (x.length > 0) {
      allowedList = x[0].allowed
    }
    console.log('value is', x, newStatus)
    console.log('balance ', selProjectIs)
    const allowCrmStatusChangeOnDue = selProjectIs?.allowCrmStatusChangeOnDue || false
    const isBalanceExists = selCustomerPayload?.T_elgible_balance > 0
    const balanceRestrict = allowCrmStatusChangeOnDue ? false : isBalanceExists

    if (!allowedList?.includes(newStatus?.value)) {
      enqueueSnackbar(`${status} unit cannot be ${newStatus?.label}`, {
        variant: 'warning',
      })
    } else {
      setLoader(true)

      const dataObj = { status: newStatus?.value , oldStatus: ''}
      dataObj.oldStatus = selCustomerPayload?.status || ''
      console.log('payment stuff is ', selCustomerPayload)
      const { fullPs } = selCustomerPayload
      dataObj[`${newStatus?.value}_on`] = Timestamp.now().toMillis()
      if (
        newStatus?.value === 'agreement_pipeline' &&
        selCustomerPayload?.kyc_status &&
        selCustomerPayload?.man_cs_approval && !balanceRestrict
      ) {

        setUnitStatusObj(newStatus)
        const updatedPs = fullPs.map((item) => {
          if (item.order === 2) {
            return { ...item, elgible: true }
          } else {
            return item
          }
        })
        const t_elgible = updatedPs.reduce((total, item) => {
          if (item.elgible) {
            return total + item.value
          } else {
            return total
          }
        }, 0)
        dataObj.fullPs = updatedPs
        dataObj.T_elgible_new = t_elgible
        dataObj.T_elgible_balance =
          t_elgible -
          (selCustomerPayload?.T_review ||
            0 + selCustomerPayload?.T_approved ||
            0)
            dataObj.eventKey= 'alloted_on'
        updateUnitStatus(
          orgId,
          selCustomerPayload,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      } else if (
        newStatus?.value === 'ats_pipeline' &&
        selCustomerPayload?.ats_creation &&
        selCustomerPayload?.both_ats_approval && !balanceRestrict
      ) {
        const updatedPs = fullPs.map((item) => {
          if (item.order === 3) {
            return { ...item, elgible: true }
          } else {
            return item
          }
        })
        const t_elgible = updatedPs.reduce((total, item) => {
          if (item.elgible) {
            return total + item.value
          } else {
            return total
          }
        }, 0)
        dataObj.fullPs = updatedPs
        dataObj.T_elgible_new = t_elgible
        dataObj.T_elgible_balance =
          t_elgible -
          (selCustomerPayload?.T_review ||
            0 + selCustomerPayload?.T_approved ||
            0)

        setUnitStatusObj(newStatus)
        updateUnitStatus(
          orgId,
          selCustomerPayload,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      }else if (
        newStatus?.value === 'ATS' && !balanceRestrict


      ) {
        setUnitStatusObj(newStatus)
        dataObj.fullPs = selCustomerPayload?.fullPs
        dataObj.T_elgible_new = selCustomerPayload?.T_elgible
        dataObj.T_elgible_balance = selCustomerPayload?.T_elgible_balance
        dataObj.eventKey= 'agreement_on'

        updateUnitStatus(
          orgId,
          selCustomerPayload,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      } else if (
        newStatus?.value === 'registered'

        && !balanceRestrict
      ) {
        setUnitStatusObj(newStatus)
        dataObj.fullPs = selCustomerPayload?.fullPs
        dataObj.T_elgible_new = selCustomerPayload?.T_elgible
        dataObj.T_elgible_balance = selCustomerPayload?.T_elgible_balance
        dataObj.eventKey= 'registered_on'

        updateUnitStatus(
          orgId,
          selCustomerPayload,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      }else if (
        newStatus?.value === 'possession'
        && !balanceRestrict


      ) {
        setUnitStatusObj(newStatus)
        dataObj.fullPs = selCustomerPayload?.fullPs
        dataObj.T_elgible_new = selCustomerPayload?.T_elgible
        dataObj.T_elgible_balance = selCustomerPayload?.T_elgible_balance
        dataObj.eventKey= 'possession_on'


        updateUnitStatus(
          orgId,
          selCustomerPayload,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      }else {
        setStatusValidError(true)
console.log('newStatus?.value',  newStatus?.value, selCustomerPayload)

        console.log('is this in statusvalidat or ')
        let errorList = ''
        if (
          newStatus?.value === 'agreement_pipeline' &&
          !selCustomerPayload?.kyc_status
        ) {
          errorList = errorList + 'KYC,'
        }
        if (
          newStatus?.value === 'agreement_pipeline' &&
          !selCustomerPayload?.man_cs_approval
        ) {
          errorList = errorList + 'Manger Costsheet Approval,'
        }
        if (
          newStatus?.value === 'ats_pipeline' &&
          selCustomerPayload?.T_balance <= 0
        ) {
          errorList = errorList + 'Due Payment,'
        }
        if (
          newStatus?.value === 'ats_pipeline' &&
          !selCustomerPayload?.ats_creation
        ) {
          errorList = errorList + 'ATS Creation,'
        }
        if (
          newStatus?.value === 'ats_pipeline' &&
          !selCustomerPayload?.both_ats_approval
        ) {
          errorList = errorList + 'Manger or Customer Costsheet Approval,'
        }

        if (
          selCustomerPayload?.T_elgible_balance > 0
        ) {
          errorList = errorList + 'Payment Due exists'
        }
        errorList = errorList +'...needs to be completed'
        setNewStatusErrorList(errorList)
        enqueueSnackbar(`${errorList}`, {
          variant: 'warning',
        })
      }
    }

    return
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

    steamLeadScheduleLog(
      orgId,
      (doc) => {
        console.log('my total fetched list is 1', doc.data())
        const usersList = doc.data()
        const usersListA = []
        if (usersList == undefined) return
        const sMapStsA = []

        setschStsA(usersList?.staA)
        setschStsMA(usersList?.staDA)

        Object?.entries(usersList)?.forEach((entry) => {
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
    console.log('new one ', schStsA)
    await addLeadScheduler(orgId, id, data, schStsA, '')
    if (status != tempLeadStatus) {
    }
    await setTakTitle('')
    await setAddSch(false)
    await setLoader(false)
  }
  const cancelResetStatusFun = () => {
    setAddSch(false)
    setAddNote(false)
    setLeadStatus(status)
    setLoader(false)
  }

  const handleColor = (time) => {
    return time.getHours() > 12 ? 'text-success' : 'text-error'
  }

  const openPaymentFun = () => {
    setOpenCapturePayment(true)
  }
  const openDemandFun = () => {
    setOpenNewDemand(true)
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
          })
        }
      )
    } catch (error) {
      console.log('upload error is ', error)
    }
  }

  const paymentCaptureFun = async (data, resetForm) => {
    const {
      pId: projectId,
      id: unitId,
      phaseId,
      customerDetailsObj,
    } = selCustomerPayload
    const customLeadObj = { Name: customerDetailsObj?.customerName1 }
    data.category = 'Payment'
    const y = {}
    y.m = data?.fileUploader

    console.log('unit log ', data, y, y.m, y['m']['url'])







    const x = await capturePaymentS(
      orgId,
      true,
      projectId,
      unitId,
      8,
      customLeadObj,
      data,
      user?.email,
      enqueueSnackbar
    )
  }
  const demandCaptureFun = async (data, resetForm) => {
    const {
      pId: projectId,
      id: unitId,
      phaseId,
      customerDetailsObj,
    } = selCustomerPayload
    const customLeadObj = { Name: customerDetailsObj?.customerName1 }
    data.attchUrl = data?.fileUploader?.url || data?.attchUrl || ''
    data.category = 'Payment'
    const y = {}
    y.m = data?.fileUploader

    console.log('unit log ', data, y, y.m, y['m']['url'])
return
    const x = await capturePaymentS(
      orgId,
      true,
      projectId,
      unitId,
      8,
      customLeadObj,
      data,
      user?.email,
      enqueueSnackbar
    )
  }







  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-md text-sm">
          <p className="text-gray-700 font-medium">{payload[0].name}: ₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };
  


const CustomTooltiptwo = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-md text-sm border border-gray-200">
        <p className="text-gray-700 font-medium">
          {payload[0]?.name}: ₹{payload[0]?.value?.toLocaleString('en-IN') ?? '0'}
        </p>
      </div>
    );
  }
  return null;
};




  return (
    <div
      className={`bg-white   h-screen    ${openUserProfile ? 'hidden' : ''} overflow-y-scroll overflow-x-hidden `}
    >
      <div className=" pb-[2px] px-3 mt-0 rounded-xs border-b bg-[#F9F9FA]">
        <div className="-mx-3 flex  sm:-mx-4 px-3">
          <div className="w-full   ">


             <div className="flex flex-col justify-between">
              <section className="flex flex-row justify-between bg-[#F9F9FA] px-3 py-1  rounded-md ">
                <section>
                <section className="flex flex-row   pt-2 justify-between">
                                  <div className="flex flex-row">
                                    <section className="bg-violet-100  items-center rounded-2xl shadow-xs flex flex-col px-2 py-1 shadow">
                                      <div className="font-semibold text-[#053219]  text-[22px]  mb-[1] tracking-wide">
                                        {selCustomerPayload?.unit_no}
                                      </div>

                                      <span
                                        className={`items-center h-6   text-xs font-semibold text-gray-500  rounded-full
                      `}
                                      >
                                        Unit No
                                      </span>
                                    </section>
                                    <div className="flex flex-col ml-2 item-right">
                                      <span
                                        className={`items-center h-1 mt-[6px] mb-2  text-xs font-semibold text-green-600
                      `}
                                      >
                                        {selCustomerPayload?.customerDetailsObj?.customerName1 ||
                                          'NA'}
                                      </span>
                                      <p className="text-xs tracking-tight  font-body my-[2px]">
                    <span className="">
                      {selCustomerPayload?.customerDetailsObj?.phoneNo1}
                    </span>

                  </p>
                                      <div className="font text-[12px] text-gray-500 tracking-wide overflow-ellipsis overflow-hidden ">
                                      {selCustomerPayload?.projName}
                                      </div>
                                      <section>
                                       {selCustomerPayload?.block_no!= undefined &&  <span className="  text-[10px] h-[20px]  text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          Block:{selCustomerPayload?.block_no?.toLocaleString(
                                            'en-IN'
                                          )}{' '}

                                        </span>}
                                        {selCustomerPayload?.floor_no!= undefined && <span className="  text-[10px] h-[20px]  text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          floor:{selCustomerPayload?.floor_no?.toLocaleString(
                                            'en-IN'
                                          )}{' '}

                                        </span>}
                                        <span className="  text-[10px] h-[20px]  text-[#176600] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5]  py-[2px] rounded-xl mr-1 ">
                                        Size:{selCustomerPayload?.area?.toLocaleString(
                                            'en-IN'
                                          )}{' '}
                                          sqft
                                        </span>
                                        <span className="  text-[10px] h-[20px]  text-[#176600] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                        BUA:{  selCustomerPayload?.construct_area!= undefined && <>{selCustomerPayload?.construct_area?.toLocaleString(
                                            'en-IN'
                                          )}{' '}
                                          sqft</>}
                                        </span>

                                        <span className="  text-[10px] h-[20px] text-[#176600] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                        Facing:{selCustomerPayload?.facing}
                                        </span>

                                         <span className=" text-[10px]  text-[#824605] font-bodyLato font-[600] mt-[2px] bg-[#fff0c7] px-[14px] py-[8px] rounded-xl mr-1 ">
                        Booked : {prettyDate(selCustomerPayload?.booked_on || 0)}
                      </span>
                                      </section>
                                    </div>
                                  </div>
                                </section>



                </section>
                <section className="flex flex-row  h-[28px] mt-6">
                  <section
                    style={{ padding: '12px 16px' }}

                   className="flex group  flow-row justify-between bg-white  py-[15px]  mr-2   text-black rounded-3xl items-center align-middle text-xs cursor-pointer  hover:bg-[#E5E7EB]">
                    <div className="font-medium text-sm text-gray-700 tracking-wide pr-2 mr-1 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-[10px] after:bg-gray-300 group-hover:after:bg-white">

                    {/* <div className="font-medium	 text-sm   text-gray-700 tracking-wide border-r-[1.5px] border-gray-500 pr-2  h-2 mr-1"> */}
                      CRM Owner
                    </div>
                    <div className="font-md ml-2 text-xs tracking-wide font-semibold text-slate-900 ">
                      {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <div className=''>
                          <AssigedToDropCompCrm
                            assignerName={assignerName}
                            id={id}
                            setAssigner={setAssignerFun}
                            usersList={usersList}
                            align={undefined}
                          />
                        </div>
                      )}
                      {user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <span className="text-left text-sm">
                          {' '}
                          {assignerName}
                        </span>
                      )}
                    </div>
                  </section>
                  <section className="flex group flow-row justify-between  py-[15px] mr-2    px-[15px] bg-white text-black rounded-3xl items-center align-middle text-xs cursor-pointer hover:bg-[#E5E7EB]">
                  <div className="font-medium text-sm text-gray-700 tracking-wide pr-2 mr-1 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[0.8px] after:h-[10px] after:bg-gray-300 group-hover:after:bg-white">

                    {/* <div className="font-medium		 text-sm text-gray-700 tracking-wide   border-r-[1.5px] border-gray-500 pr-2 mr-1"> */}
                      Status
                    </div>
                    <div className="font-md  ml-2  text-xs tracking-wide font-semibold text-slate-900 ">
                      {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <div className=''>
                          <AssigedToDropCompCrm
                           assignerName={unitStatusLabel}

                            id={id}
                            setAssigner={setStatusFun}
                            usersList={StatusListA}
                            align={undefined}
                          
                          />
                        </div>
                      )}

                      {user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <span className="text-left text-sm">
                          {' '}
                          {assignerName}
                        </span>
                      )}
                    </div>
                  </section>
                { (user?.role.includes('crm-manager') || user?.role.includes('crm-executive') || user?.role.includes('admin'))&&  <button
                    className="text-[10px]  rounded-2xl ml-2 bg-[#E3BDFF] px-5 border    border-[#E3BDFF] text-gray-800"
                    onClickCapture={() => {
                      openPaymentFun()
                    }}
                  >
                    CAPTURE PAYMENT
                  </button>}

                  {customerDetails?.man_cs_approval==="approved" &&<button
                    className=" text-[10px]  rounded-2xl ml-2 bg-white px-5 border  border-[#E3BDFF]"
                    onClickCapture={() => {
                      openDemandFun()
                    }}
                  >
                    MODIFICATIONS
                  </button>}

                </section>
              </section>
            </div>



          </div>
        </div>
        {statusValidError && (
          <div className=" border-b border-[#ffe6bc]  bg-[#ffe6bc]">
            <div className="w-full border-b border-[#ffe6bc]  bg-[#f69c10] "></div>
            <div className=" w-full flex flex-row justify-between pt-1 font-md text-xs text-gray-500 mb-[2px] tracking-wide mr-4 ml-1 flex flex-row">
              {' '}
              <section>
                <span className="font-Rubik font-sanF text-[#844b00] font-[500]   text-[11px]  py-[6px]">
                  {newStatusErrorList}
                </span>
              </section>
              <XIcon
                className="h-4 w-4 mr-2 inline text-green"
                aria-hidden="true"
              />
            </div>
          </div>
        )}
     
        {timeHide && (
          <>
            <div className="w-full border-b border-[#ebebeb]"></div>
            <div className=" w-full  pt-1 font-md text-xs text-gray-500 mb-[2px] tracking-wide mr-4 ml-1 flex flex-row justify-between">
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





<div className='bg-[#F9F9FA] p-8  rounded-lg'>

<div className="grid bg-[#F9F9FA]  rounded-lg grid-cols-3 gap-4 mb-3">
  <div className="bg-white p-4 rounded-lg">
    <div className="flex justify-between ">
      <span className="font-medium">Stage Balance</span>
      <span className='font-semibold'>...</span>
    </div>
    <div className="relative flex justify-center items-center">
      <PieChart width={250} height={250}>
        <Pie
          data={[  { name: 'Paid', value:  calculatePercentages((selCustomerPayload?.T_review || 0) +(selCustomerPayload?.T_approved || 0 ), selCustomerPayload?.T_elgible).paidPercentage},
          { name: 'Remaining', value:  calculatePercentages((selCustomerPayload?.T_review || 0) +(selCustomerPayload?.T_approved || 0 ), selCustomerPayload?.T_elgible).unpaidPercentage}]}
          cx={125}
          cy={125}
          innerRadius={70}
          outerRadius={95}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          <Cell fill="#E3BDFF" />
          <Cell fill="#E5E7EB" />
         

        </Pie>
        <Tooltip content={<CustomTooltip />} />

      </PieChart>

      <div className="absolute text-center">
        <div className="text-xs text-gray-500">Balance</div>
        <div className="font-bold">            ₹{selCustomerPayload?.T_elgible_balance <0 ? 0: selCustomerPayload?.T_elgible_balance?.toLocaleString('en-IN')}</div>
      </div>
    </div>


    <section className="flex flex-row justify-between mx-2">
    <div className="text-center">
      <div className="text-[12px] text-gray-500">Elgible Cost</div>
      <div className="font-bold text-[14px]">₹ {((selCustomerPayload?.T_elgible || 0)
                                            )?.toLocaleString('en-IN')}</div>
    </div>
    <div className="text-center">
      <div className="text-[12px] text-gray-500">Paid</div>
      <div className="font-bold text-[14px]">              ₹{((selCustomerPayload?.T_review || 0) +(selCustomerPayload?.T_approved || 0 ))?.toLocaleString('en-IN')}</div>
    </div>
    <div className="text-center">
      <div className="text-[12px] text-gray-500">Balance</div>
      <div className="font-bold text-[14px]">₹ {selCustomerPayload?.T_elgible_balance <0 ? 0: selCustomerPayload?.T_elgible_balance?.toLocaleString('en-IN')}</div>
    </div>
    </section>
  </div>

  <div className="bg-white  p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="font-medium">Unit Cost</span>
      <ChevronDownIcon size={16} className="ml-2" />
    </div>
    <div className="relative flex justify-center items-center">
      <PieChart width={250} height={250}>
        <Pie
          data={[  { name: 'Paid', value:  calculatePercentages(  (selCustomerPayload?.T_review || 0) +
          (selCustomerPayload?.T_approved || 0), selCustomerPayload?.T_total || selCustomerPayload?.T_Total).paidPercentage},
          { name: 'Remaining', value:  calculatePercentages(  (selCustomerPayload?.T_review || 0) +
          (selCustomerPayload?.T_approved || 0), selCustomerPayload?.T_total || selCustomerPayload?.T_Total).unpaidPercentage}]}
          cx={125}
          cy={125}
          innerRadius={70}
          outerRadius={95}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          <Cell fill="#E3BDFF" />
          <Cell fill="#E5E7EB" />
        </Pie>
        <Tooltip content={<CustomTooltiptwo />} />

      </PieChart>

      <div className="absolute text-center">
        <div className="text-xs text-gray-500">Balance</div>
        <div className="font-bold">₹ {selCustomerPayload?.T_balance?.toLocaleString(
                                            'en-IN'
                                          )}</div>
      </div>
    </div>
    <section className="flex flex-row justify-between mx-2">
    <div className="text-center">
      <div className="text-[12px] text-gray-500">Unit Cost</div>
      <div className="font-bold text-[14px]">₹ {((selCustomerPayload?.T_total || 0)
                                            )?.toLocaleString('en-IN')}</div>
    </div>
    <div className="text-center">
      <div className="text-[12px] text-gray-500">Paid</div>
      <div className="font-bold text-[14px]">₹ {((selCustomerPayload?.T_review || 0) +
                                            (selCustomerPayload?.T_approved || 0))?.toLocaleString('en-IN')}</div>
    </div>
    <div className="text-center">
      <div className="text-[12px] text-gray-500">Balance</div>
      <div className="font-bold text-[14px]">₹ {(selCustomerPayload?.T_balance || 0)
                                            ?.toLocaleString('en-IN')}</div>
    </div>
    </section>
  </div>

  <div className="bg-white p-4 rounded-lg">

    <div className="flex justify-between items-center">
  <span className="font-medium">Unit Payments</span>
  <BellIcon size={16} className="ml-2" />
</div>

    <div className="flex flex-col items-center mt-8">
      <section className='flex flex-row justify-between'>
        <div className=''>
      <div className="text-sm text-gray-500 mb-2">Total Paid</div>
      <div className="font-bold mb-4">₹ {((selCustomerPayload?.T_review || 0) +
                                            (selCustomerPayload?.T_approved || 0))?.toLocaleString('en-IN')}</div>
                                            </div>

      </section>
      <div className="w-full bg-gray-200 h-7 rounded-full mb-6">
        <div className="bg-[#E3BDFF] h-7 rounded-full w-1/3"></div>
      </div>
      <div className="text-sm text-gray-500 mb-2">Total Cost</div>
      <div className="font-bold">₹ {((selCustomerPayload?.T_total || 0)
                                            )?.toLocaleString('en-IN')}</div>
    </div>
  </div>



</div>


</div>


      <UnitFullSummary
        customerDetails={customerDetails}
        selCustomerPayload={selCustomerPayload}
      />

      {selFeature === 'legal_info' && <></>}
      <SiderForm
        open={openCapturePayment}
        setOpen={setOpenCapturePayment}
        title={'capturePayment'}
        unitsViewMode={false}
        widthClass="max-w-xl"
        selUnitDetails={selCustomerPayload}
        paymentCaptureFun={paymentCaptureFun}
      />
      <SiderForm
        open={newDemand}
        setOpen={setOpenNewDemand}
        title={'newDemand'}
        unitsViewMode={false}
        widthClass="max-w-xl"
        selUnitDetails={selCustomerPayload}
        paymentCaptureFun={demandCaptureFun}
      />
    </div>
  )
}
