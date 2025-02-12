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
import { Pie } from 'recharts';
import { PieChart,  Cell } from 'recharts';
import { BellIcon } from 'lucide-react';
import { ChevronDownIcon } from "lucide-react";
import { calculatePercentages } from 'src/util/areaConverter'

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

  // { label: 'Follow Up', value: 'followup' },
  // { label: 'RNR', value: 'rnr' },
  // { label: 'Dead', value: 'Dead' },
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

  // const [leadStatus, setLeadStatus] = useState([])
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
    //  else if (fet === 'ph') {
    //   const unsubscribe = steamLeadPhoneLog(orgId,
    //     (doc) => {
    //       console.log('my total fetched list is yo yo 1', doc.data())
    //       const usersList = doc.data()
    //       const usersListA = []

    //       Object.entries(usersList).forEach((entry) => {
    //         const [key, value] = entry
    //         usersListA.push(value)
    //         console.log('my total fetched list is 3', `${key}: ${value}`)
    //       })
    //       console.log('my total fetched list is', usersListA.length)
    //       // setLeadsFetchedActivityData(usersListA)
    //     },
    //     {
    //       uid: id,
    //     },
    //     (error) => setLeadsFetchedActivityData([])
    //   )
    // }
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
    // save assigner Details in db

    // updateLeadAssigTo(orgId, leadDocId, value, '', by)
    // const todayTasksIncre = leadSchFetchedData?.filter(
    //   (d) => d?.sts === 'pending' && d?.schTime < torrowDate
    // ).length

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
      // 'ProjectId',
      ProjectId,
      receiverDetails,
      msgPayload
    )
  }

  const setNewProject = (leadDocId, value) => {
    console.log('sel pROJECT DETAILS ', value)

    // setProjectName(value.projectName)
    // setProjectId(value.uid)
    // save assigner Details in db
    // projectName
    const x = {
      Project: value.projectName,
      ProjectId: value.uid,
    }
    setSelProjectIs(value)
    updateLeadProject(orgId, leadDocId, x)
    // updateLeadAssigTo(leadDocId, value, by)
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

      // if newStatus  make check list
      const dataObj = { status: newStatus?.value }
      console.log('payment stuff is ', selCustomerPayload)
      const { fullPs } = selCustomerPayload
      dataObj[`${newStatus?.value}_on`] = Timestamp.now().toMillis()
      if (
        newStatus?.value === 'agreement_pipeline' &&
        selCustomerPayload?.kyc_status &&
        selCustomerPayload?.man_cs_approval && !balanceRestrict
      ) {
        return
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
          selCustomerPayload?.id,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      } else if (
        newStatus?.value === 'ats_pipeline' &&
        // selCustomerPayload?.T_balance <= 0 &&
        selCustomerPayload?.ats_creation &&
        selCustomerPayload?.both_ats_approval
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
          selCustomerPayload?.id,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      }else if (
        newStatus?.value === 'ATS'
        // &&
        // selCustomerPayload?.T_balance <= 0

      ) {
        setUnitStatusObj(newStatus)
        dataObj.fullPs = selCustomerPayload?.fullPs
        dataObj.T_elgible_new = selCustomerPayload?.T_elgible
        dataObj.T_elgible_balance = selCustomerPayload?.T_elgible_balance
        dataObj.eventKey= 'agreement_on'

        updateUnitStatus(
          orgId,
          selCustomerPayload?.id,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      } else if (
        newStatus?.value === 'registered'
        //  &&
        // selCustomerPayload?.T_balance <= 0

      ) {
        setUnitStatusObj(newStatus)
        dataObj.fullPs = selCustomerPayload?.fullPs
        dataObj.T_elgible_new = selCustomerPayload?.T_elgible
        dataObj.T_elgible_balance = selCustomerPayload?.T_elgible_balance
        dataObj.eventKey= 'registered_on'

        updateUnitStatus(
          orgId,
          selCustomerPayload?.id,
          dataObj,
          user.email,
          enqueueSnackbar
        )
      }else if (
        newStatus?.value === 'possession'
        // &&
        // selCustomerPayload?.T_balance <= 0

      ) {
        setUnitStatusObj(newStatus)
        dataObj.fullPs = selCustomerPayload?.fullPs
        dataObj.T_elgible_new = selCustomerPayload?.T_elgible
        dataObj.T_elgible_balance = selCustomerPayload?.T_elgible_balance
        dataObj.eventKey= 'possession_on'


        updateUnitStatus(
          orgId,
          selCustomerPayload?.id,
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

        errorList = errorList + 'is mandatory steps are missing'
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

    //
    // updateLeadStatus(leadDocId, newStatus)
    // toast.success('status Updated Successfully')
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
        // for (const key in usersList) {
        //   if (usersList.hasOwnProperty(key)) {
        //     console.log(`${key} : ${usersList[key]}`)
        //     console.log(`my total fetched list is 2 ${usersList[key]}`)
        //   }
        // }

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

        setschStsA(usersList?.staA)
        setschStsMA(usersList?.staDA)
        // delete usersList['staA']
        // delete usersList['staDA']
        Object?.entries(usersList)?.forEach((entry) => {
          const [key, value] = entry
          if (['staA', 'staDA'].includes(key)) {
            if (key === 'staA') {
              // setschStsA(value)
            } else if (key === 'staDA') {
              // sMapStsA = value
            }
          } else {
            usersListA.push(value)
            // console.log(
            //   'my total fetched list is 3',
            //   `${key}: ${JSON.stringify(value)}`
            // )
          }
        })
        // for (const key in usersList) {
        //   if (usersList.hasOwnProperty(key)) {
        //     console.log(`${key} : ${usersList[key]}`)
        //     console.log(`my total fetched list is 2 ${usersList[key]}`)
        //   }
        // }

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
    if (status != tempLeadStatus) {
    }
    await setTakTitle('')
    await setAddSch(false)
    await setLoader(false)
  }
  const cancelResetStatusFun = () => {
    setAddSch(false)
    setAddNote(false)
    // if its not edit mode ignore it
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
            //  save this doc as a new file in spark_leads_doc
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
    // data.attchUrl = data?.fileUploader?.url || data?.attchUrl || ''
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
  return (
    <div
      className={`bg-white   h-screen    ${openUserProfile ? 'hidden' : ''} overflow-y-scroll overflow-x-hidden `}
    >
      <div className=" pb-[2px] px-3 mt-0 rounded-xs border-b bg-[#F9F9FA]">
        <div className="-mx-3 flex  sm:-mx-4 px-3">
          <div className="w-full   ">
            {/* <div className="">
                <div className="font-semibold text-[#053219]  text-sm  mt-3 mb-1  tracking-wide font-bodyLato">
                  <span className="mb-[4px] text-xl uppercase">{Name}</span>

                  <div className="mt-1">
                    <div className="font-md text-sm text-gray-500 mb-[2] tracking-wide">
                      <MailIcon className="w-3 h-3 inline text-[#058527] " />{' '}
                      {Email}
                    </div>
                    <div className="font-md text-sm text-gray-500 mb-[2] tracking-wide ">
                      <DeviceMobileIcon className="w-3 h-3 inline text-[#058527] " />{' '}
                      {Mobile?.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                    </div>
                  </div>
                </div>
              </div> */}

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
                                        <span className="  text-[10px] h-[20px]  text-[#176600] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {selCustomerPayload?.area?.toLocaleString(
                                            'en-IN'
                                          )}{' '}
                                          sqft
                                        </span>
                                        <span className="  text-[10px] h-[20px]  text-[#176600] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {  selCustomerPayload?.construct_area!= undefined && <>{selCustomerPayload?.construct_area?.toLocaleString(
                                            'en-IN'
                                          )}{' '}
                                          sqft</>}
                                        </span>

                                        <span className="  text-[10px] h-[20px] text-[#176600] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {selCustomerPayload?.facing}
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

                   className="flex flow-row justify-between bg-white  py-[15px]  mr-2   text-black rounded-3xl items-center align-middle text-xs cursor-pointer hover:underline">
                    <div className="font-md text-xs  text-gray-700 tracking-wide mr-1">
                      CRM Owner
                    </div>
                    <div className="font-md ml-8 text-xs tracking-wide font-semibold text-slate-900 ">
                      {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <div className='mb-1.5 mt-[6px]'>
                          <AssigedToDropComp
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
                  <section className="flex flow-row justify-between  py-[15px] mr-2    px-[15px] bg-white text-black rounded-3xl items-center align-middle text-xs cursor-pointer hover:underline">
                    <div className="font-md text-xs text-gray-700 tracking-wide mr-1">
                      Status
                    </div>
                    <div className="font-md  ml-8  text-xs tracking-wide font-semibold text-slate-900 ">
                      {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <div className=' mt-[2px]'>
                          <AssigedToDropComp
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



          {/* {today 14} */}
            {/* <div className="flex justify-between items-center mb-6">


  <div className="bg-[#F9F9FA] p-4 rounded-lg  flex items-center space-x-4">
      <div className="bg-white p-4 rounded-[18px] flex flex-col items-center justify-center w-20 h-20">
        <span className="text-2xl font-bold"> {selCustomerPayload?.unit_no}</span>
        <span className="text-xs text-[#000]">Unit no</span>
      </div>
      <div className="flex flex-col ml-4 space-y-2">
        <span className="text-xs font-semibold">{selCustomerPayload?.customerDetailsObj?.customerName1 ||'NA'}</span>
        <div className="flex space-x-2 items-center">
          <span className="bg-white p-1 py-1  rounded-lg text-xs w-20 text-center">
          {selCustomerPayload?.area?.toLocaleString('en-IN')}{' '}sqft
          </span>
          <div className="bg-white p-1 rounded-lg text-xs w-20 text-center flex items-center justify-center space-x-1">
            <span>{selCustomerPayload?.facing}</span>
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.89648 13.4346V7.97028C5.89648 7.63636 6.01538 7.35049 6.25318 7.1127C6.49098 6.8749 6.77684 6.756 7.11077 6.756H12.0893L11.1179 5.78457L11.9679 4.93457L14.3965 7.36314L11.9679 9.79171L11.1179 8.94171L12.0893 7.97028H7.11077V13.4346H5.89648Z"
                fill="#484848"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-white p-1 px-2 rounded-lg text-xs">Booked : {prettyDate(selCustomerPayload?.booked_on || 0)}</span>
        </div>
      </div>
    </div>




    <div className="flex space-x-4 bg-[#F9F9FA] p-8 rounded-lg">
      <div className="relative inline-block text-left">
        <button className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-3 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
          CRM Owner


          <div className="font-md ml-8 text-xs tracking-wide font-semibold text-slate-900 ">
                      {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <div className=''>
                          <AssigedToDropComp
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
        </button>
      </div>

      <div className="relative inline-block items-center text-left">
        <button className="flex justify-center items-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-3 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
          Status


<div className="font-md ml-8 text-xs   items-center tracking-wide font-semibold text-slate-900 ">

                      {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <div className=''>


                          <AssigedToDropComp
                            assignerName={unitStatus}
                            id={id}
                            setAssigner={setStatusFun}
                            usersList={StatusListA}
                            align={undefined}
                          />
                        </div>
                      )}
                      {user?.role?.includes(USER_ROLES.CP_AGENT) && (
                        <span className="">
                          {' '}
                          {assignerName}
                        </span>
                      )}
                    </div>
        </button>
      </div>

      <button

onClickCapture={() => {
  openPaymentFun()
}}
      className="bg-white border border-gray-300 rounded-full py-3 px-4 text-xs flex items-center">
        <svg
          width="18"
          className="mr-2"
          height="18"
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.64648 8.10124H21.6465M8.31315 21.4346V8.10124M3.86871 1.43457H19.4243C20.6516 1.43457 21.6465 2.42949 21.6465 3.65679V19.2123C21.6465 20.4396 20.6516 21.4346 19.4243 21.4346H3.86871C2.64141 21.4346 1.64648 20.4396 1.64648 19.2123V3.65679C1.64648 2.42949 2.64141 1.43457 3.86871 1.43457Z"
            stroke="#3E3E3E"
            strokeWidth="1.44444"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Payment

        {customerDetails?.man_cs_approval==="approved" &&<section
                    className="text-center px-[10px] py-[2px]  pt-[3px] h-[24px] ml-2 bg-gradient-to-r from-[#E7E7E7] to-[#E7E7E7] text-black rounded-3xl items-center align-middle text-xs cursor-pointer hover:underline"
                    onClickCapture={() => {
                      openDemandFun()
                    }}
                  >
                    NEW DEMAND</section>}
      </button>
    </div>
        </div> */}













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
        {/* <div className="flex flex-row justify-between">
          <div className="px-1 py-2 flex flex-row  text-xs  border-t border-[#ebebeb] font-thin   font-bodyLato text-[12px]  py-[6px] ">
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
        </div> */}
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


      {/* {today 14} */}


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
      </PieChart>
      {/* Centered Text */}
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
      </PieChart>
         {/* <PieChart width={400} height={400}>
        <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart> */}
      {/* Centered Text */}
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
    {/* <div className="flex justify-between">
      <span className="font-medium">Payment schedule</span>
      <BellIcon size={16} />
    </div> */}
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






{/*
<div className="bg-white   rounded-xl shadow-sm">
      <div className="border rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
              <h3 className="font-semibold">Activity</h3>
            </div>
            <div className="flex gap-2">
            <button className="px-2 py-1 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors">
            <svg width="5" height="17" viewBox="0 0 5 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.64648 16.5347C2.09648 16.5347 1.62565 16.3388 1.23398 15.9472C0.842318 15.5555 0.646484 15.0847 0.646484 14.5347C0.646484 13.9847 0.842318 13.5138 1.23398 13.1222C1.62565 12.7305 2.09648 12.5347 2.64648 12.5347C3.19648 12.5347 3.66732 12.7305 4.05898 13.1222C4.45065 13.5138 4.64648 13.9847 4.64648 14.5347C4.64648 15.0847 4.45065 15.5555 4.05898 15.9472C3.66732 16.3388 3.19648 16.5347 2.64648 16.5347ZM2.64648 10.5347C2.09648 10.5347 1.62565 10.3388 1.23398 9.94717C0.842318 9.5555 0.646484 9.08467 0.646484 8.53467C0.646484 7.98467 0.842318 7.51383 1.23398 7.12217C1.62565 6.7305 2.09648 6.53467 2.64648 6.53467C3.19648 6.53467 3.66732 6.7305 4.05898 7.12217C4.45065 7.51383 4.64648 7.98467 4.64648 8.53467C4.64648 9.08467 4.45065 9.5555 4.05898 9.94717C3.66732 10.3388 3.19648 10.5347 2.64648 10.5347ZM2.64648 4.53467C2.09648 4.53467 1.62565 4.33883 1.23398 3.94717C0.842318 3.5555 0.646484 3.08467 0.646484 2.53467C0.646484 1.98467 0.842318 1.51383 1.23398 1.12217C1.62565 0.730501 2.09648 0.534668 2.64648 0.534668C3.19648 0.534668 3.66732 0.730501 4.05898 1.12217C4.45065 1.51383 4.64648 1.98467 4.64648 2.53467C4.64648 3.08467 4.45065 3.5555 4.05898 3.94717C3.66732 4.33883 3.19648 4.53467 2.64648 4.53467Z" fill="#5F6368"/>
</svg>

              </button>
              <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                All actions
              </button>
              <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Filter
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
              <div className="flex items-center border rounded-md bg-white shadow-md w-full max-w-md mx-auto">
      <span className="material-icons text-gray-500 ml-3">search</span>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="flex-grow py-2 px-3 outline-none border-none text-gray-700"
      />
    </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Booked
              </button>
              <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Review
              </button>
            </div>
          </div>

        </div>
      </div>
    </div> */}





</div>



      {/* <div className="grid bg-[#F9F9FA]  rounded-lg grid-cols-3 gap-4 mb-3">
  <div className="bg-white p-4 rounded-lg">
    <div className="flex justify-between ">
      <span className="font-medium">Stage Balance</span>
      <span className='font-semibold'>...</span>
    </div>
    <div className="relative flex justify-center items-center">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={100}
          cy={100}
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          <Cell fill="#00D4FF" />
          <Cell fill="#E5E7EB" />
        </Pie>
      </PieChart>
      <div className="absolute text-center">
        <div className="text-xs text-gray-500">Amount Borrowed</div>
        <div className="font-bold">₹ 67,23,523</div>
      </div>
    </div>
    <div className="text-center">
      <div className="text-sm text-gray-500">Paid</div>
      <div className="font-bold">₹ 10,198</div>
    </div>
  </div>

  <div className="bg-white  p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="font-medium">Cost sheet</span>
      <ChevronDownIcon size={16} className="ml-2" />
    </div>
    <div className="relative flex justify-center items-center">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={100}
          cy={100}
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          <Cell fill="#00D4FF" />
          <Cell fill="#E5E7EB" />
        </Pie>
      </PieChart>

      <div className="absolute text-center">
        <div className="text-xs text-gray-500">Amount Borrowed</div>
        <div className="font-bold">₹ 67,23,523</div>
      </div>
    </div>
    <div className="text-center">
      <div className="text-sm text-gray-500">Paid</div>
      <div className="font-bold">₹ 10,198</div>
    </div>
  </div>

  <div className="bg-white p-4 rounded-lg">

    <div className="flex justify-between items-center">
  <span className="font-medium">Payment schedule</span>
  <BellIcon size={16} className="ml-2" />
</div>

    <div className="flex flex-col items-center mt-8">
      <div className="text-sm text-gray-500 mb-2">Amount Borrowed</div>
      <div className="font-bold mb-4">₹ 67,23,523</div>
      <div className="w-full bg-gray-200 h-7 rounded-full mb-6">
        <div className="bg-cyan-400 h-7 rounded-full w-1/3"></div>
      </div>
      <div className="text-sm text-gray-500 mb-2">Received</div>
      <div className="font-bold">₹ 10,198</div>
    </div>
  </div>



</div> */}





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
