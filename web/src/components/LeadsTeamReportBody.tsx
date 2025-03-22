/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react'
import { CalendarIcon, EyeIcon } from '@heroicons/react/outline'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
import { startOfWeek, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { sourceListItems } from 'src/constants/projects'
import {
  addAgreegatedSalesValues,
  getAllProjects,
  getEmployeesListDept,
  getEmployeesTaskProgressDept,
  getLeadbyId1,
  getLeadsByDate,
  getTodayTodoLeadsData,
  getTodayTodoLeadsDataByUser,
  steamAllLeadsActivity,
  steamUsersListByRole,
  streamLeadLogdWithNullProj,
  updateLeadLastUpdateTime,
  updateLeadsLogWithProject,
  updateTodaySourceStatsDB,
  updateTodayTasksTotal,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { sendWhatAppTextSms1 } from 'src/util/axiosWhatAppApi'
import CSVDownloader from 'src/util/csvDownload'
import { prettyDate } from 'src/util/dateConverter'
import {
  SlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'

import MarketingAnalyticsHome from './A_MarketingModule/MarketinAnalyticsHome'
import StackedBarChart from './A_MarketingModule/Reports/Charts/marketingStackedBarChart'
import CampaingsTopBarsComponent from './A_MarketingModule/Reports/Charts/marketingTopBars'
import BookingSummaryReport from './A_SalesModule/Reports/bookingSummaryReport'
import EmpLeadsTasksSummaryTable from './A_SalesModule/Reports/empLeadsTasksSummaryTable'
import EmpTasksReportM from './A_SalesModule/Reports/EmpTasks/empTasksReportM'
import LeadsCoversionGraphs from './A_SalesModule/Reports/leadsConversionRatio/LeadsCoversionGraphs'
import ProfileSummary from './A_SalesModule/Reports/profileSummary'
import SalesSummaryReport from './A_SalesModule/Reports/salesSummaryReport'
import SiteVisitM from './A_SalesModule/Reports/SiteVisitM'
import TableEdit from './A_SalesModule/Reports/TableEdit'
// import TabTask from './A_SalesModule/Reports/TabTask'
import { serialEmployeeLeadData } from './LeadsTeamReport/serialEmployeeLeadData'
import { serialEmployeeTaskLeadData } from './LeadsTeamReport/serialEmployeeTaskLeadData'
import { serialProjectLeadData } from './LeadsTeamReport/serialProjectLeadData'
import { serialProjecVisitFixedData } from './LeadsTeamReport/serialProjectVisitsFixedData'
import { serialMyData } from './LeadsTeamReport/SourceLeads'
import ReportSideWindow from './SiderForm/ReportSideView'
import SiderForm from './SiderForm/SiderForm'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'




const valueFeedData = [
  { k: 'Total', v: 300, pic: '' },
  { k: 'Progress', v: 100, pic: '' },
  { k: 'Booked', v: 25, pic: '' },
  { k: 'RNR', v: 50, pic: '' },
  { k: 'Dead', v: 75, pic: '' },
  { k: 'Not Interested', v: 50, pic: '' },
]
const calculatePercentage = (data) => {
  let totalCount = 0
  data &&
    data.map((item) => {
      totalCount = totalCount + item.Total.length
    })
  return (
    data &&
    data
      .map((item) => {
        const per = item.Total.length / totalCount
        return {
          ...item,
          percetage: Math.ceil(isNaN(per) ? 0 * 100 : per * 100),
        }
      })
      .sort((a, b) => b.percetage - a.percetage)
  )
}

const MycalculatePercentage = (total, count) => {
  const per = total / count
  return Math.ceil(isNaN(per) ? 0 * 100 : per * 100)
}
const LeadsTeamReportBody = ({ project, onSliderOpen = () => {}, isEdit }) => {

  const sourceDropDown = () => {
    return (
      <SlimSelectBox
        name="project"
        label=""
        className="input min-w-[164px]"
        onChange={(value) => {
          console.log('zoro condition changed one  is', value)
          selViewSource(value)
        }}
        value={viewSource?.value}
        options={[
          ...[{ label: 'All Sources', value: 'allsources' }],
          ...sourceListTuned,
        ]}
        placeholder={undefined}
      />
    )
  }
  // }
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId, access } = user
  const [leadsFetchedRawData, setLeadsFetchedRawData] = useState([])
  const [leadLogsRawData, setLeadLogsRawData] = useState([])
  const [leadLogsFetchedRawData, setLeadLogsFetchRawData] = useState([])
  const [empPerDayTasksCountsA, setEmpPerDayTasksCountsA] = useState([])

  const [sourceListTuned, setSourceListTuned] = useState([])
  const [selCat, setSelCat] = useState('lead_perf')

  const [sourceFiltListTuned, setFiltSourceListTuned] = useState([])
  const [viewSource, selViewSource] = useState({
    label: 'All Sources',
    value: 'allsources',
  })
  const [leadsLogFilData, setLeadsLogFilData] = useState([])

  const [showInproFSource, setShowInproFSource] = useState(false)
  const [showArchiFSource, setShowArchiFSource] = useState(false)
  const [usersList, setusersList] = useState([])
  const [usersList1, setusersList1] = useState([])
  const [usersCleanList, setusersCleanList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [projectFilList, setFiltProjectListTuned] = useState([])
  const [viewProjs, selProjs] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [empListTuned, setEmployeeListTuned] = useState([])
  const [empFiltListTuned, setFiltEmployeeListTuned] = useState([])
  const [viewEmp1, selEmp1] = useState({
    label: 'All Employee',
    value: 'allemployees',
  })
  const [empTaskListTuned, setTaskEmployeeListTuned] = useState([])
  const [empTaskListTunedTotal, setTaskEmployeeListTunedTotal] = useState({})

  const [projectListTuned, setProjectListTuned] = useState([])
  const [selProjectEmpIs, setSelProjectEmp] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [EmpRawFilData, setEmpRawFilData] = useState([])
  const [EmpDownloadRows, setEmpDownloadRows] = React.useState([])
  const [resettingEmpValues, setResettingEmpValues] = React.useState(false)

  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [sourceRawFilData, setSourceRawFilData] = useState([])
  const [sourceDownloadRows, setSourceDownloadRows] = React.useState([])

  const [projDownloadRows, setProjDownloadRows] = React.useState([])
  const [drillDownPayload, setDrillDownPayload] = React.useState([])

  const [sourceDateRange, setSourceDateRange] = React.useState(
    startOfDay(d).getTime()
  )
  const [empDateRange, setEmpDateRange] = React.useState(
    startOfWeek(d).getTime()
  )

  const [isOpenSideForm, setReportSideForm] = React.useState(false)
  const [isImportLeadsOpen, setisImportLeadsOpen] = React.useState(false)
  const [customerDetails, setCustomerDetails] = React.useState({})

  const [dateRange, setDateRange] = React.useState([null, null])
  const [isOpened, setIsOpened] = React.useState(false)
  const [subTitle, setSubTitle] = React.useState('false')

  const [startDate, endDate] = dateRange
  const [viewSourceStats1A, SetViewSourceStats1A] = useState([
    'label',
    'total',
    'inprogress',
    'booked',
    'archieve',
    'others',
  ])

  useEffect(() => {
    console.log('was this updated', dateRange)
    if (dateRange[0] != null) {
      const [startDate, endDate] = dateRange
      setSourceDateRange(startDate?.getTime())
      setEmpDateRange(endDate?.getTime())
    }
  }, [dateRange])
  useEffect(() => {
    getLeadsDataFun()
    getEmployees()
  }, [])
  useEffect(() => {
    getLeadsDataFun()
  }, [sourceDateRange, dateRange])

  useEffect(() => {
    showAllEmpTodayActivity()
  }, [usersCleanList])



  useEffect(() => {
    if (selProjectIs?.value === 'allprojects') {
      setSourceListTuned(
        serialMyData(sourceListItems, leadsFetchedRawData, 'by_source')
      )
      setSourceRawFilData(leadsFetchedRawData)
    } else if (selProjectIs?.value === 'others') {
      const projectWideA = leadsFetchedRawData.filter(
        (d) => d?.ProjectId === '' || d?.ProjectId === undefined
      )
      setSourceListTuned(
        serialMyData(sourceListItems, projectWideA, 'by_source')
      )
      setSourceRawFilData(projectWideA)
    } else {
      const projectWideA = leadsFetchedRawData.filter(
        (d) => d?.ProjectId === selProjectIs?.value
      )
      setSourceListTuned(
        serialMyData(sourceListItems, projectWideA, 'by_source')
      )
      setSourceRawFilData(projectWideA)
    }
  }, [leadsFetchedRawData, selProjectIs])

  useEffect(() => {
    if (viewSource?.value == 'allsources') {
      setFiltSourceListTuned(sourceListTuned)
    } else {
      const z = sourceListTuned.filter((da) => {
        return da.value == viewSource?.value
      })
      setFiltSourceListTuned(z)
    }
  }, [sourceListTuned, viewSource])

  useEffect(() => {
    if (viewEmp1?.value == 'allemployees') {
      setFiltEmployeeListTuned(empListTuned)
    } else {
      const z = empListTuned.filter((da) => {
        return da.value == viewEmp1?.value
      })
      setFiltEmployeeListTuned(z)
    }
  }, [empListTuned, viewEmp1])

  useEffect(() => {
    if (viewProjs?.value == 'allprojects') {
      console.log('project list i s', projectList)
      setFiltProjectListTuned(projectList)
    } else {
      const z = projectList.filter((da) => {
        return da.value == viewProjs?.value
      })
      setFiltProjectListTuned(z)
    }
  }, [projectList, viewProjs])



  useEffect(() => {
    setProjectListTuned(serialProjectLeadData(projectList, leadsFetchedRawData))
  }, [projectList, leadsFetchedRawData])
  useEffect(() => {
    console.log('selected project is ', selProjectIs?.value)
    if (selProjectIs?.value === 'allprojects') {
      setLeadsLogFilData(
        serialProjecVisitFixedData(projectList, leadLogsRawData)
      )
    } else {
      const projectWideA = leadLogsRawData.filter(
        (d) => d?.ProjectId === selProjectEmpIs?.value
      )
      console.log('selected project is ', selProjectIs?.value)
      const x = leadLogsRawData?.filter((datObj) => {
        return datObj?.ProjectId === selProjectIs?.value
      })

      console.log('selected project is ', leadLogsRawData, x)

      setLeadsLogFilData(
        serialProjecVisitFixedData(
          projectList,
          leadLogsRawData?.filter((datObj) => {
            return datObj?.ProjectId === selProjectIs?.value
          })
        )
      )
      console.log('selected project is ', leadsLogFilData)
    }
  }, [projectList, leadLogsRawData, selProjectIs])

  useEffect(() => {
    if (selProjectEmpIs?.value === 'allprojects') {
      console.log('leadsFetchedRawData', leadsFetchedRawData)
      setEmployeeListTuned(
        serialEmployeeLeadData(usersList, leadsFetchedRawData)
      )
      setEmpRawFilData(leadsFetchedRawData)
    } else if (selProjectEmpIs?.value === 'others') {
      const projectWideA = leadsFetchedRawData.filter(
        (d) => d?.ProjectId === '' || d?.ProjectId === undefined
      )

      setEmployeeListTuned(serialEmployeeLeadData(usersList, projectWideA))

      setEmpRawFilData(projectWideA)
    } else {
      const projectWideA = leadsFetchedRawData.filter(
        (d) => d?.ProjectId === selProjectEmpIs?.value
      )

      setEmployeeListTuned(serialEmployeeLeadData(usersList, projectWideA))

      setEmpRawFilData(projectWideA)
    }
  }, [usersList, leadsFetchedRawData, selProjectEmpIs])
  const insertTodaySourcePerformance = () => {
    console.log('insertTodaySourcePerformance')


    updateTodaySourceStatsDB(orgId, 'snap', {}, (error) => [])
  }
  const getEmployees = async () => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projects.map((user) => {
          user.label = user?.projectName
          user.value = user?.uid
        })
        setusersList1([...projects])
        console.log('project are ', projects)
      },
      () => setusersList1([])
    )
    return unsubscribe
  }
  const updateAgreegatedValues = async (projectFilList) => {
    projectFilList.map((data) => {
      const payload = {
        Total: data?.TotalNew?.length || 0,
        inprogress: data?.inprogress_new?.length || 0,
        new: data?.new?.length || 0,
        followup: data?.followup?.length || 0,
        visitfixed: data?.visitfixed?.length || 0,
        visitdone: data?.visitdone?.length || 0,
        negotiation: data?.negotiation?.length || 0,
        booked: data?.booked_new?.length || 0,
        notinterested: data?.notinterested?.length || 0,
        dead: data?.dead?.length || 0,
        blocked: data?.blocked?.length || 0,
        junk: data?.junk?.length || 0,
        archieve: data?.archieve_new?.length || 0,
        others: data?.others?.length || 0,
      }
      console.log('payload is', payload, data)
      addAgreegatedSalesValues(orgId, data?.uid, payload)
    })
  }
  const updateAgreegatedSiteVisitsValues = async (projectFilList) => {
    projectFilList.map((data) => {
      const payload = {
        visitfixed: data?.visitfixed?.length || 0,
        visitdone: data?.visitdone?.length || 0,
      }
      console.log('payload is', payload, data)
      addAgreegatedSalesValues(orgId, data?.uid, payload)
    })
  }
  const showAllEmpTodayActivity = async () => {
    const todaydate = new Date()
    console.log('employee list is ', usersCleanList)

    getEmployeesTaskProgressDept(
      orgId,
      async (querySnapshot) => {
        const empTodayTasksCountA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        // const sortVal = empTodayTasksCountA.sort((a, b) => {
        //   return b.emp < a.emp
        // })
        const sortVal = empTodayTasksCountA.sort((a, b) =>
          a.emp.localeCompare(b.emp)
        )
        setEmpPerDayTasksCountsA(sortVal)
        console.log('sort valis ', sortVal)
      },
      {
        dateFull:
          'D' +
          todaydate.getDate() +
          'M' +
          todaydate.getMonth() +
          'Y' +
          todaydate.getFullYear(),
      },
      (error) => setEmpPerDayTasksCountsA([])
    )
  }

  const showDrillDownFun = async (text, data) => {
    setReportSideForm(true)
    setDrillDownPayload(data)
    setSubTitle(text)
  }
  const setEmpTaskFun = async () => {
    const x = await serialEmployeeTaskLeadData(usersCleanList)

    const z = Promise.all(x).then(function (results) {
      console.log('master one', results)
      setTaskEmployeeListTuned(results)
      let sum1,
        now1,
        Sum7,
        Sum30,
        Sum20,
        Sum40,
        Sum50,
        Sum50M = 0

      const Total = {}
      empTaskListTuned.map((dat) => {
        sum1 = sum1 + dat.Total.length || 0
        now1 = now1 + dat.now.length || 0
        Sum7 = Sum7 + dat.sevenDays.length || 0
        Sum30 = Sum30 + dat.thirtyDays.length || 0
        Sum20 = Sum20 + dat.twentyDays.length || 0
        Sum40 = Sum40 + dat.fourtyDays.length || 0
        Sum50 = Sum50 + dat.fiftyDays.length || 0
        Sum50M = dat.fiftyDaysMore.length || 0 + Sum50M
      })
      Total.TotalSum = sum1
      Total.now = now1
      Total.Sum7 = Sum7
      Total.Sum30 = Sum30
      Total.Sum20 = Sum20
      Total.Sum40 = Sum40
      Total.Sum50 = Sum50
      Total.Sum50M = Sum50M
      setTaskEmployeeListTunedTotal(Total)
      console.log('sum1 is ', Total)

      return results
    })
    await console.log('setted value is 0', z)

    const a1 = await x.map((dat) => {
      const { label, fiftyDays, value } = dat
      console.log(
        'setted value is 1 ',
        label,
        value,
        fiftyDays,
        dat?.fiftyDays,
        dat
      )
      const z = {}

      z.label = dat.label
      z.sevenDays = fiftyDays?.length
      z.twentyDays = dat.twentyDays
      z.thirtyDays = dat.thirtyDays
      z.fourtyDays = dat.fourtyDays
      z.sevenDays = dat.sevenDays
      z.fiftyDays = dat.fiftyDays
      z.Total = 0

      return z
    })
    await console.log('setted value is ', a1, a1.length)
  }
  useEffect(() => {
    getUsersDataFun1()
  }, [])
  useEffect(() => {
    setEmpTaskFun()
  }, [usersCleanList])

  const getUsersDataFun = async () => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA1 = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        usersListA1.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA1)

        await setusersList([
          ...usersListA1,
          ...[{ label: 'others', value: 'others' }],
        ])
      },
      (error) => setusersList([])
    )

    return unsubscribe
  }



  const getUsersDataFun1 = async () => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is clean', usersListA)

        await setusersCleanList(usersListA)
      },
      (error) => setusersCleanList([])
    )

    return unsubscribe
  }
  const getProjectsListFun = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.uid
        })
        console.log('fetched users list is', projectsListA)

        setprojectList([
          ...projectsListA,
          ...[{ label: 'others', value: 'others' }],
        ])
      },
      (error) => setprojectList([])
    )

    return unsubscribe
  }

  const getLeadsDataFun = async () => {
    startOfWeek(d)
    console.log(
      'date is',
      d,
      subMonths(startOfMonth(d), 6).getTime(),
      sourceDateRange
    )
    const { access, uid, orgId } = user

    if (access?.includes('manage_leads')) {
      const unsubscribe = getLeadsByDate(orgId, {
        cutoffDate: sourceDateRange,
        endDate: empDateRange,
        dateRange: dateRange,
      })
      await console.log('my Array data is delayer 1 ccc', await unsubscribe)
      await setLeadsFetchedRawData(await unsubscribe)
      await getProjectsListFun()
      await getUsersDataFun()

      const y = await serialMyData(
        sourceListItems,
        await unsubscribe,
        'by_source'
      )
      await setSourceListTuned(y)
      return unsubscribe
    }
  }

  useEffect(() => {
    fetchLogsData()
  }, [])
  useEffect(() => {
    fetchLogsData()
  }, [sourceDateRange, dateRange])

  const fetchLogsData = async () => {
    const steamLeadLogs = await steamAllLeadsActivity(
      orgId,
      'snap',
      {
        uid: 'VIzMzz5rl0NAywdnpHpb',
        cutoffDate: sourceDateRange,
        dateRange: dateRange,
      },
      (error) => setLeadLogsRawData([])
    )
    await setLeadLogsRawData(steamLeadLogs)
  }
  const GenerateTasksDailyReportForEmp = async () => {
    console.log('employee list is ', usersList)

    await getEmployeesListDept(orgId, {}).then(async (empList) => {
      console.log('employee list is ', empList)
      const data = []
      for (const empListD of empList) {
        const dataUser = await getRestEmpTodayTasksCount(
          empListD?.uid,
          empListD?.name
        )
        data.push(dataUser)
      }
    })
    await setResettingEmpValues(false)

    return
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA1 = await querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        usersListA1.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA1)

        const usersListA = await [
          ...usersListA1,
          ...[{ label: 'others', value: 'others' }],
        ]
        await usersListA.map(async (empDetails) => {
          const { uid } = empDetails
          if (uid) {
            await getRestEmpTodayTasksCount(uid)
          } else {
            return
          }
        })
        await setResettingEmpValues(false)
        return usersListA
      },
      (error) => []
    )
  }
  const getRestEmpTodayTasksCount = async (empID, name) => {
    // Get all the employees of sales,crm , finance, legal of each dept
    // Loop through each emp and get TastDate < Tomorrow
    // get the Lead status of each task and put that into that section count
    // save count in db too
    // send to whats app

    return await getTodayTodoLeadsDataByUser(
      orgId,
      async (querySnapshot) => {
        let pro


        const userTodoTasksList = []
        console.log('Total fetcher is ', querySnapshot.docs.length, name)
        for (const docSnapshot of querySnapshot.docs) {
          const x = docSnapshot.data()
          // results.filter((data) => data != 'remove')
          console.log('Total Tasks count is ', x, name)
          const { staDA } = x
          y = staDA
          if (y.length > 0) {
            x.uid = docSnapshot.id
            // eslint-disable-next-line prefer-const
            let leadDetails = await getLeadbyId1(orgId, x.uid)
            x.leadUser = await leadDetails
            userTodoTasksList.push(x)
          }
        }
        if (userTodoTasksList.length > 0) {

          Promise.all(userTodoTasksList).then(function (results) {
            results.filter((data) => data != 'remove')
            filterTodayTodoFun(
              results.filter((data) => data != 'remove'),
              empID,
              name
            )
            console.log(
              'fetched values is 1',
              results.filter((data) => data != 'remove')
            )
          })
        }
      },
      { uid: empID, type: 'today' },
      () => {
        console.log('error')
      }
    )
  }

  const filterTodayTodoFun = (todaySch, empID, name) => {
    const todaydate = new Date()

    const ddMy =
      'D' +
      todaydate.getDate() +
      'M' +
      todaydate.getMonth() +
      'Y' +
      todaydate.getFullYear()
    const oneJan = new Date(todaydate.getFullYear(), 0, 1)

    const numberOfDays = Math.floor(
      (todaydate - oneJan) / (24 * 60 * 60 * 1000)
    )

    const weekCount = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7)
    const streamedTodo = []
    const whole = {
      new: [],
      followup: [],
      all: [],
      visitfixed: [],
      visitdone: [],
      vistcancel: [],
      negotiation: [],
      booked: [],
      dead: [],
      notinterested: [],
      blocked: [],
      junk: [],
      others: [],
      unassigned: [],
    }
    console.log('report today data 0', todaySch.length)
    const z = todaySch.map((data1) => {
      data1['staDA'].map((data2) => {
        const y = data1[data2]
        const torrowDate = new Date(
          +new Date().setHours(0, 0, 0, 0) + 86400000
        ).getTime()
        if (y['sts'] === 'pending' && y['schTime'] < torrowDate) {
          if (y['schTime'] < torrowDate) {
            y.uid = data1.uid
            y.id = data1.uid
            y.leadUser = data1.leadUser
            streamedTodo.push(y)
            whole.all.push(y)
            switch (data1?.leadUser?.Status) {
              case 'new':
                return whole.new.push(y)
              case 'followup':
                return whole.followup.push(y)
              case 'visitfixed':
                return whole.visitfixed.push(y)
              case 'visitdone':
                return whole.visitdone.push(y)
              case 'vistcancel':
                return whole.vistcancel.push(y)
              case 'negotiation':
                return whole.negotiation.push(y)
              case 'booked':
                return whole.booked.push(y)
              case 'dead':
                return whole.dead.push(y)
              case 'notinterested':
                return whole.notinterested.push(y)
              case 'blocked':
                return whole.blocked.push(y)
              case 'junk':
                return whole.junk.push(y)
              case 'unassigned':
                return whole.unassigned.push(y)
              default:
                return whole.others.push(y)
            }
            console.log('whole is ', whole)
            console.log(
              'report today data 1',
              data1.leadUser,
              torrowDate,
              user?.uid,
              streamedTodo
            )
            return y
          } else {
            return
          }
        }
      })
    })
    const taskCounts = {
      uid: empID,
      emp: name,
      date: ddMy,
      new: whole?.new.length,
      followup: whole?.followup.length,
      all: whole?.all.length,
      visitfixed: whole?.visitfixed.length,
      visitdone: whole?.visitdone.length,
      vistcancel: whole?.vistcancel.length,
      negotiation: whole?.negotiation.length,
      others: whole?.others.length,
      booked: whole?.booked.length,
      dead: whole?.dead.length,
      notinterested: whole?.notinterested.length,
      blocked: whole?.blocked.length,
      junk: whole?.junk.length,
      new_comp: 0,
      followup_comp: 0,
      all_comp: 0,
      visitfixed_comp: 0,
      visitdone_comp: 0,
      vistcancel_comp: 0,
      negotiation_comp: 0,
      others_comp: 0,
    }


    updateTodayTasksTotal(orgId, `${empID}DD${ddMy}`, taskCounts)

    console.log('whole is ', name, whole)
  }
  const updateLeadsLastUpdatetimeFun = async () => {


    getTodayTodoLeadsData(
      orgId,
      (querySnapshot) => {
        let pro
        let y = []
        querySnapshot.docs.map(async (docSnapshot) => {
          const x = docSnapshot.data()
          const { staDA, staA } = x

          const indi = staA.indexOf('pending')

          y = staDA

          if (y.length > 0 && y[indi]) {


            const { comments, ct, schTime } = x[y[indi]]
            if (comments) {

            } else if (ct) {
              try {
                updateLeadLastUpdateTime(orgId, docSnapshot.id, ct, schTime)
              } catch (error) {
                console.log(
                  'faile to throw error at inside fun getTodayTodoLeadsData  ',
                  error
                )
              }
            }
          }
        })
      },
      { type: 'upcoming' },
      () => {
        console.log('error')
      }
    )
  }
  const updateProjectNameInlogs = async () => {


    const steamLeadLogs = await streamLeadLogdWithNullProj(
      orgId,
      'snap',
      {
        uid: 'VIzMzz5rl0NAywdnpHpb',
      },
      (error) => []
    )

    await console.log('logs update is ', steamLeadLogs)

    await steamLeadLogs.map(async (logData) => {
      const { Luid } = logData
      const x = await getLeadbyId1(orgId, Luid)
      const { ProjectId } = await x
      await console.log('flexed value is ', ProjectId)
      updateLeadsLogWithProject(
        orgId,
        'snap',
        {
          LeadId: Luid,
          pId: ProjectId,
        },
        (error) => []
      )
    })
    console.log('stream logs', steamLeadLogs)
  }
  React.useEffect(() => {
    const downRows = []
    sourceRawFilData.map((data) => {
      const row = {}
      row.Date = prettyDate(data?.Date).toLocaleString()
      row.Name = data?.Name
      row.CountryCode = data['Country Code']
      row.Mobile = data?.Mobile
      row.Email = data?.Email
      row.AssignedTo = data?.assignedToObj?.name
      row.Source = data?.Source
      row.Status = data?.Status
      row.Project = data?.Project

      downRows.push(row)
    })

    setSourceDownloadRows(downRows)
  }, [sourceRawFilData])

  React.useEffect(() => {
    const downRows = []
    EmpRawFilData.map((data) => {
      const row = {}
      row.Date = prettyDate(data?.Date).toLocaleString()
      row.Name = data?.Name
      row.CountryCode = data['Country Code']
      row.Mobile = data?.Mobile
      row.Email = data?.Email
      row.AssignedTo = data?.assignedToObj?.name
      row.Source = data?.Source
      row.Status = data?.Status
      row.Project = data?.Project

      downRows.push(row)
    })

    setEmpDownloadRows(downRows)
  }, [EmpRawFilData])
  React.useEffect(() => {
    const downRows = []
    leadsFetchedRawData.map((data) => {
      const row = {}
      row.Date = prettyDate(data?.Date).toLocaleString()
      row.Name = data?.Name
      row.CountryCode = data['Country Code']
      row.Mobile = data?.Mobile
      row.Email = data?.Email
      row.AssignedTo = data?.assignedToObj?.name
      row.Source = data?.Source
      row.Status = data?.Status
      row.Project = data?.Project

      downRows.push(row)
    })

    setProjDownloadRows(downRows)
  }, [leadsFetchedRawData])
  const showColumnsSourceFun = async (id) => {
    const y = ['new', 'followup', 'visitfixed', 'visitdone', 'neogotiation']
    const y1 = ['notinterested', 'dead', 'blocked', 'junk']
    if (id === 'inprogress') {
      const check = !showInproFSource
      await setShowInproFSource(check)
      const x = viewSourceStats1A
      if (check) {
        SetViewSourceStats1A([...x, ...y])
      } else {
        const z = viewSourceStats1A.filter((d1) => {
          return !y.includes(d1)
        })
        await SetViewSourceStats1A(z)
      }
    } else if (id === 'archieve') {
      const check = !showArchiFSource
      await setShowArchiFSource(check)
      const x = await viewSourceStats1A
      if (check) {
        await SetViewSourceStats1A([...x, ...y1])
      } else {
        const z = viewSourceStats1A.filter((d1) => {
          return !y1.includes(d1)
        })
        await SetViewSourceStats1A(z)
      }
    }
  }

  const bgColors = [
    'bg-white border-blue-200',
    'bg-[#baf6d0] border-purple-200',
    'bg-white border-blue-200',
    'bg-[#baf6d0] border-purple-200',
    'bg-white border-blue-200',
    'bg-[#baf6d0] border-purple-200',
    'bg-white border-blue-200',
    'bg-[#baf6d0] border-purple-200',
  ]
  const triggerWhatsAppAlert = async (check) => {
    empListTuned.map((empData, i) => {
      const { label, offPh, followup, visitfixed, negotiation, booked } =
        empData
      sendWhatAppTextSms1(
        '9849000525',
        `🔥  ${label} Leads Stats As Per Today \n
      Followup -  ${followup?.length || 0}
      Visits Fixed -${visitfixed?.length || 0}
      Negotiation -${negotiation?.length || 0}
      Booked -${booked?.length || 0}`
      )
    })
  }
  const triggerWhatsAppTasksCountAlert = async () => {
    empTaskListTuned.map((empData, i) => {
      const { label, offPh, now, sevenDays, Total } = empData
      sendWhatAppTextSms1(
        '9849000525',
        `Good Morning..! ${label} 🏆\n
      Here is your Today's task overview  \n
      Due Tasks   -${(Total?.length || 0) - (now?.length || 0)}
      Today Tasks -  ${now?.length || 0}\n \n

      This is an automated notification generated by www.redefineerp.in. Please do not reply.
      `
      )
    })
  }
  return (
    <div>







      <section className="pb-8 pt-1 mb-8 leading-7 text-gray-900 bg-white mt-1 mx-1 rounded-lg ">




        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">




          <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">


          <div className="flex justify-between items-center mb-6">
          <div>

            <section className='flex flex-row mt-3'>
                <img className="w-12 h-12" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/payments-subscriptions.svg'}></img>

                <h2 className="ml-2 mt-2 text-md font-semibold text-black leading-light font-Playfair">
                Sales Reports
                </h2>
                {/* <h1 className="text-2xl mt-2 font-semibold mb-2">
                Sales Reports
                </h1> */}
                </section>
            {/* <p className="text-gray-600">This area is usually used to setting up values for the dropdowns and other resuable options</p> */}
          </div>

        </div>



            <div className="flex items-center space-x-1 mb-6 border-b">
          {[

{ label: 'Leads Performance', value: 'lead_perf' },
{ label: 'Source Performance', value: 'source_perf' },
{ label: 'Site Visits', value: 'site_visits' },
{ label: 'Employee Performance', value: 'emp_tasks' },
{ label: 'Booking Performance', value: 'booking_perf' },

// { label: 'Home', value: 'sale_report_home' },
// { label: 'Marketing', value: 'marketing_Dashboard' },

// { label: 'Top Bar', value: 'bar_tasks' },
// { label: 'Profile', value: 'profile_tasks' },



        ].map((data, i) => (
            <button
              key={i}
              onClick={() =>     setSelCat(data.value)}
              className={`px-4 py-2 ${
                selCat === data.value
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
               <span
                  className={`flex items-center   text-sm   ${
                    selCat === data.value
                      ? 'font-semibold text-green-800 '
                      : 'font-medium text-black-100 '
                  }  rounded-full`}
                >
                  <img alt="" src="/temp2.png" className="h-5 w-5 mr-1" />
                  {data?.label}
                </span>
            </button>
          ))}
        </div>

          </div>
          {selCat === 'lead_perf' && (
            <div className="flex flex-col  mt-2 drop-shadow-md rounded-lg  px-4">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div
                  className="py-2 inline-block  sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#ebfafa' }}
                >
                  <div className="overflow-hidden">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      className=" text-md font-bold leading-none pl-0 mt-4 border-b pb-4 mb-4 "
                    >
                      <div>Lead Performance vs Created Date</div>
                      <div className="flex flex-row">
                        {orgId == 'spark' && (
                          <div
                            className="mt-3 mr-2 cursor-pointer"
                            onClick={() =>
                              updateAgreegatedValues(projectFilList)
                            }
                          >
                            Calculate
                          </div>
                        )}

                        <section className="flex mb-2">
                          {!isEdit && (
                            // <Link to={routes.projectEdit({ uid })}>
                            <button
                              onClick={() => {
                                setSourceDateRange(startOfDay(d).getTime())
                              }}
                            >
                              <span
                                className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                  sourceDateRange === startOfDay(d).getTime()
                                        ? 'font-semibol text-[#4C0053] border border-[#4C0053] bg-[#E0E3FF]  '
                                  : 'text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  border border-[#4C0053]  bg-[#fff]  '

                                }rounded-full`}
                              >
                                <EyeIcon
                                  className="h-4 w-4 mr-1"
                                  aria-hidden="true"
                                />
                                Today
                              </span>
                            </button>
                            // </Link>
                          )}

                          <button
                            onClick={() => {
                              setSourceDateRange(startOfWeek(d).getTime())
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange === startOfWeek(d).getTime()
                                  ? 'font-semibol text-[#4C0053] border border-[#4C0053] bg-[#E0E3FF] '
                                  : 'text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  border border-[#4C0053]  bg-[#fff] '
                              }rounded-full`}
                            >
                              <CalendarIcon
                                className="h-4 w-4 mr-1"
                                aria-hidden="true"
                              />
                              This Week
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setSourceDateRange(startOfMonth(d).getTime())
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange === startOfMonth(d).getTime()
                                      ? 'font-semibol text-[#4C0053] border border-[#4C0053] bg-[#E0E3FF] '
                                      : ' bg-white border border-[#4C0053] text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  rounded-full '
                              }rounded-full`}
                            >
                              <CalendarIcon
                                className="h-4 w-4 mr-1"
                                aria-hidden="true"
                              />
                              This Month
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setSourceDateRange(
                                subMonths(startOfMonth(d), 6).getTime()
                              )
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange ===
                                subMonths(startOfMonth(d), 6).getTime()

                                  ? 'font-semibol text-[#4C0053] border border-[#4C0053] bg-[#E0E3FF]  '
                                  : ' bg-white border border-[#4C0053] text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  rounded-full '

                              }rounded-full`}
                            >
                              <CalendarIcon
                                className="h-4 w-4 mr-1"
                                aria-hidden="true"
                              />
                              Last 6 Months
                            </span>
                          </button>
                          <span className="max-h-[42px] mt-[2px] ml-3">
                            <label className="bg-green   pl-   flex flex-row cursor-pointer">
                              {!isOpened && (
                                <span
                                  className={`flex ml-1 mt-[6px] items-center h-6 px-3 text-xs ${
                                    sourceDateRange === startDate?.getTime()

                                  ? 'font-semibol text-[#4C0053] border border-[#4C0053] bg-[#E0E3FF]  '
                                  : ' bg-white border border-[#4C0053] text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  rounded-full '

                                  } rounded-full`}
                                  onClick={() => {
                                    setIsOpened(true)
                                  }}
                                >
                                  <CalendarIcon
                                    className="h-4 w-4 mr-1"
                                    aria-hidden="true"
                                  />
                                  {startDate == null ? 'Custom' : ''}
                                  {/* {sourceDateRange} -- {startDate?.getTime()} */}
                                  {startDate != null
                                    ? prettyDate(
                                        startDate?.getTime() + 21600000
                                      )
                                    : ''}
                                  {endDate != null ? '-' : ''}
                                  {endDate != null
                                    ? prettyDate(endDate?.getTime() + 21600000)
                                    : ''}
                                </span>
                              )}
                              {
                                <span
                                  className="inline"
                                  style={{
                                    visibility: isOpened ? 'visible' : 'hidden',
                                  }}
                                >
                                  <CustomDatePicker
                                    className={`z-10 pl- py-1 px-3 mt-[7px] inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer  max-w-fit   ${
                                      sourceDateRange === startDate?.getTime()
                                        ? 'font-semibol text-[#4C0053] bg-[#E0E3FF] '
                                        : 'text-green-800 bg-green-200 '
                                    } rounded-full`}
                                    onCalendarClose={() => setIsOpened(false)}
                                    placeholderText="&#128467;	 Custom"
                                    onChange={(update) => {
                                      setDateRange(update)

                                      console.log(
                                        'was this updated',
                                        update,
                                        dateRange,
                                        startDate,
                                        endDate
                                      )
                                    }}
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    isClearable={true}
                                    onClear={() => {
                                      console.log('am i cleared')
                                    }}
                                    // dateFormat="MMM d, yyyy "
                                    //dateFormat="d-MMMM-yyyy"
                                    dateFormat="MMM dd, yyyy"
                                  />
                                </span>
                              }
                            </label>
                          </span>

                          <span style={{ display: '' }}>
                            <CSVDownloader
                              className="mr-6 h-[20px] w-[20px]"
                              downloadRows={sourceRawFilData}
                              style={{ height: '20px', width: '20px' }}
                            />
                          </span>
                        </section>

                      </div>
                    </div>
                    <LeadsCoversionGraphs
                      sourceRawFilData={sourceRawFilData}
                      showDrillDownFun={showDrillDownFun}
                      projectFilList={projectListTuned}
                      leadsFetchedRawData={leadsFetchedRawData}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {selCat === 'emp_tasks' && (
            <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  px-4">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div
                  className="py-2 inline-block  sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#ebfafa' }}
                >
                  <div className="overflow-hidden">

                  <EmpLeadsTasksSummaryTable projects={usersList1} />
                    <div className="flex flex-row justify-between pl-0 mt-4 border-b pb-4 mb-4 ">
                      <div className=" text-md font-bold leading-none mt-2">
                        {`Employee Tasks Performance`}
                        {/* <div>DateSourceComponent()</div> */}
                      </div>
                      <section className="flex flex-row justify-between">
                        <section></section>
                        <div className=" flex   ">
                          <div
                            className="ml-4 text-blue cursor-pointer"
                            onClick={() => {
                              setResettingEmpValues(true)
                              GenerateTasksDailyReportForEmp()
                            }}
                          >
                            Generate Today Report
                          </div>

                          {resettingEmpValues && <span>InProgress</span>}
                          <button
                            onClick={() => {
                              triggerWhatsAppTasksCountAlert()
                            }}
                          >
                            <span
                              className={`flex ml-2 mr-4  items-center h-6 px-3 text-xs
                            text-green-800 bg-green-200
                          rounded-full`}
                            >
                              <CalendarIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              Send WhatsApp Notification
                            </span>
                          </button>


                        </div>
                      </section>
                    </div>

                    <EmpTasksReportM
                      leadLogsRawData={leadLogsRawData}
                      showDrillDownFun={showDrillDownFun}
                      empPerDayTasksCountsA={empPerDayTasksCountsA}
                      MycalculatePercentage={MycalculatePercentage}
                    />

                    <table className="text-center mt-6 ">
                      <thead className="border-b">
                        <tr>
                          {[
                            { label: 'Name', id: 'label' },
                            { label: 'Rnr', id: 'all' },
                            { label: 'Busy', id: 'new' },
                            { label: 'All', id: 'all' },
                            { label: 'New', id: 'new' },
                            { label: 'Follow Up', id: 'followup' },
                            { label: 'Visit Fixed', id: 'visitfixed' },
                            { label: 'Visit Done', id: 'visitdone' },
                            { label: 'Visit Cancel', id: 'visitCancel' },

                            { label: 'Negotiations', id: 'negotiation' },
                            { label: 'Others', id: 'others' },
                          ].map((d, i) => (
                            <th
                              key={i}
                              scope="col"
                              className={`text-sm font-medium font-semibold text-gray-900 px-6 py-4 ${
                                ['Name'].includes(d.label) ? 'text-left' : ''
                              }`}
                              onClick={() => {
                                if (['inprogress', 'archieve'].includes(d.id))
                                  showColumnsSourceFun(d.id)
                              }}
                            >
                              {d.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {empPerDayTasksCountsA?.map((data, i) => {
                          return (
                            <tr
                              className={`  ${
                                i % 2 === 0
                                  ? 'bg-white border-blue-200'
                                  : 'bg-gray-100'
                              }`}
                              key={i}
                            >
                              <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                                {i + 1}
                                {')'}
                                {data?.emp}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.rnr || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.busy || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.all_comp || 0}/{data?.all || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.new_comp || 0}/{data?.new || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.followup_comp || 0}/{data?.followup || 0}
                              </td>

                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.visitfixed_comp || 0}/{' '}
                                {data?.visitfixed || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.visitdone_comp || 0}/{' '}
                                {data?.visitdone || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.visitCancel_comp || 0}/{' '}
                                {data?.visitCancel || 0}
                              </td>

                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.negotiation_comp || 0}/
                                {data?.negotiation || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.others_comp || 0}/ {data?.others || 0}
                              </td>
                            </tr>
                          )
                        })}

                        <tr className="border-b bg-gray-800 boder-gray-900">
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                            Total
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">

                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>

                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>

                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selCat === 'sale_report_home' && <SalesSummaryReport />}

          {selCat === 'marketing_Dashboard' && <MarketingAnalyticsHome />}

          {selCat === 'profile_tasks' && <ProfileSummary />}

          {selCat === 'edit_table' && <TableEdit />}

          {selCat === 'edit_table' && <TableEdit />}



          {selCat === 'bar_tasks' && <CampaingsTopBarsComponent />}


          {selCat === 'site_visits' && (
            <>
              {/* old comp */}
              <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  px-4">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div
                    className="py-2 inline-block  sm:px-6 lg:px-8"
                    style={{ backgroundColor: '#ebfafa' }}
                  >
                    <div className="overflow-hidden">
                      <section className="flex flex-row justify-between border-b mt-4 pb-2">
                        <div className=" text-md font-bold leading-none pl-0 mt-2  mb-4  ">
                          {`Site Visit's Overview`}
                        </div>
                        <div className=" ">
                          <SlimSelectBox
                            name="project"
                            label=""
                            className="input min-w-[164px] ml-4"
                            onChange={(value) => {
                              console.log(
                                'zoro condition changed one  is',
                                value
                              )
                              setSelProject(value)
                            }}
                            value={selProjectIs?.value}
                            options={[
                              ...[
                                { label: 'All Projects', value: 'allprojects' },
                              ],
                              ...projectList,
                            ]}
                            placeholder={undefined}
                          />
                        </div>
                      </section>

                      <section className="flex flex-row justify-between mt-[18px]">
                        <section className="flex mb-2">
                          {!isEdit && (
                            <button
                              onClick={() => {
                                setSourceDateRange(startOfDay(d).getTime())
                              }}
                            >
                              <span
                                className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                  sourceDateRange === startOfDay(d).getTime()
                                   ? 'font-semibol text-[#4C0053] bg-[#E0E3FF] '
                                  : 'text-[#020B97] bg-[#C4FECB] '

                                }rounded-full`}
                              >
                                <EyeIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                Now
                              </span>
                            </button>
                            // </Link>
                          )}

                          <button
                            onClick={() => {
                              setSourceDateRange(startOfWeek(d).getTime())
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange === startOfWeek(d).getTime()
                                  ? 'font-semibol text-[#4C0053] bg-[#E0E3FF] '
                                  : 'text-[#020B97] bg-[#C4FECB] '
                              }rounded-full`}
                            >
                              <CalendarIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              This Week
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setSourceDateRange(startOfMonth(d).getTime())
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange === startOfMonth(d).getTime()
                                 ? 'font-semibol text-[#4C0053] bg-[#E0E3FF] '
                                  : 'text-[#020B97] bg-[#C4FECB] '
                              }rounded-full`}
                            >
                              <CalendarIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              This Month
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setSourceDateRange(
                                subMonths(startOfMonth(d), 6).getTime()
                              )
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange ===
                                subMonths(startOfMonth(d), 6).getTime()
                                  ? 'font-semibol text-[#4C0053] bg-[#E0E3FF] '
                                  : 'text-[#020B97] bg-[#C4FECB] '
                              }rounded-full`}
                            >
                              <CalendarIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              Last 6 Months
                            </span>
                          </button>
                          <span className="max-h-[42px] mt-[2px] ml-3">
                            <label className="bg-green   pl-   flex flex-row cursor-pointer">
                              {!isOpened && (
                                <span
                                  className={`flex ml-1 mt-[6px] items-center h-6 px-3 text-xs ${
                                    sourceDateRange === startDate?.getTime()
                                      ? 'font-semibold text-pink-800 bg-pink-200 '
                                      : 'text-green-800 bg-green-200 '
                                  } rounded-full`}
                                  onClick={() => {
                                    setIsOpened(true)
                                  }}
                                >
                                  <CalendarIcon
                                    className="h-3 w-3 mr-1"
                                    aria-hidden="true"
                                  />
                                  {startDate == null ? 'Custom' : ''}
                                  {startDate != null
                                    ? prettyDate(
                                        startDate?.getTime() + 21600000
                                      )
                                    : ''}
                                  {endDate != null ? '-' : ''}
                                  {endDate != null
                                    ? prettyDate(endDate?.getTime() + 21600000)
                                    : ''}
                                </span>
                              )}
                              {
                                <span
                                  className="inline"
                                  style={{
                                    visibility: isOpened ? 'visible' : 'hidden',
                                  }}
                                >
                                  <CustomDatePicker
                                    className={`z-10 pl- py-1 px-3 mt-[7px] inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer  max-w-fit   ${
                                      sourceDateRange === startDate?.getTime()
                                       ? 'font-semibol text-[#4C0053] bg-[#E0E3FF] '
                                       : 'text-[#020B97] bg-[#C4FECB] '
                                    } rounded-full`}
                                    onCalendarClose={() => setIsOpened(false)}
                                    placeholderText="&#128467;	 Custom"
                                    onChange={(update) => {
                                      setDateRange(update)

                                      console.log(
                                        'was this updated',
                                        update,
                                        dateRange,
                                        startDate,
                                        endDate
                                      )
                                    }}
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    isClearable={true}
                                    onClear={() => {
                                      console.log('am i cleared')
                                    }}

                                    dateFormat="MMM dd, yyyy"
                                  />
                                </span>
                              }
                            </label>
                          </span>

                          {orgId === 'spark' && (
                            <button
                              onClick={() =>
                                updateAgreegatedSiteVisitsValues(
                                  leadsLogFilData
                                )
                              }
                            >

                            </button>
                          )}
                        </section>

                      </section>
                      <SiteVisitM
                        leadLogsRawData={leadLogsRawData}
                        showDrillDownFun={showDrillDownFun}
                      />
                      <table className="min-w-full text-center mt-6">
                        <thead className="border-b">
                          <tr>
                            {[
                              { label: 'Source', id: 'label' },
                              { label: 'Total Visit Done', id: 'total' },
                              { label: 'InProgress', id: 'inprogress' },
                              { label: 'New', id: 'new' },
                              { label: 'Followup', id: 'followup' },
                              { label: 'VisitFixed', id: 'visitfixed' },
                              { label: 'VisitDone', id: 'visitdone' },
                              { label: 'Neogotiation', id: 'neogotiation' },
                              { label: 'Booked', id: 'booked' },
                              { label: 'NotInterested', id: 'notinterested' },
                              { label: 'Dead', id: 'dead' },
                              { label: 'Blocked', id: 'blocked' },
                              { label: 'Junk', id: 'junk' },
                              { label: 'Archieve', id: 'archieve' },
                              { label: 'Others', id: 'others' },
                            ].map((d, i) => (
                              <th
                                key={i}
                                scope="col"
                                className={`text-sm font-semibold font-medium text-gray-900 px-6 py-4 ${
                                  ['Source'].includes(d.label)
                                    ? 'text-left'
                                    : ''
                                }`}
                                style={{
                                  display: viewSourceStats1A.includes(d.id)
                                    ? ''
                                    : 'none',
                                  color:
                                    ['inprogress'].includes(d.id) &&
                                    showInproFSource
                                      ? 'blue'
                                      : ['archieve'].includes(d.id) &&
                                        showArchiFSource
                                      ? 'blue'
                                      : 'black',
                                }}
                                onClick={() => {
                                  if (['inprogress', 'archieve'].includes(d.id))
                                    showColumnsSourceFun(d.id)
                                }}
                              >
                                {d.label}
                                {d.id === 'inprogress' && !showInproFSource && (
                                  <ChevronDoubleRightIcon
                                    className="w-4 h-4 inline"
                                    aria-hidden="true"
                                  />
                                )}
                                {d.id === 'inprogress' && showInproFSource && (
                                  <ChevronDoubleLeftIcon
                                    className="w-4 h-4 inline"
                                    aria-hidden="true"
                                  />
                                )}
                                {d.id === 'archieve' && !showArchiFSource && (
                                  <ChevronDoubleRightIcon
                                    className="w-4 h-4 inline"
                                    aria-hidden="true"
                                  />
                                )}
                                {d.id === 'archieve' && showArchiFSource && (
                                  <ChevronDoubleLeftIcon
                                    className="w-4 h-4 inline"
                                    aria-hidden="true"
                                  />
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {leadsLogFilData.map((data, i) => {
                            return (
                              <tr
                                className={` ${
                                  i % 2 === 0
                                    ? 'bg-white border-blue-200'
                                    : 'bg-gray-100'
                                }`}
                                key={i}
                              >
                                <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                                  {data?.label}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  onClick={() =>
                                    showDrillDownFun(
                                      'Total Visits Fixed',
                                      data?.visitdone
                                    )
                                  }
                                >
                                  {data?.visitdone?.length}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  onClick={() =>
                                    showDrillDownFun(
                                      'Total Visits Fixed',
                                      data?.inprogress
                                    )
                                  }
                                >
                                  {data?.inprogress?.length}
                                </td>
                                {showInproFSource && (
                                  <>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.new
                                        )
                                      }
                                    >
                                      {data?.new?.length}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.followup
                                        )
                                      }
                                    >
                                      {data?.followup?.length}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.visitfixed
                                        )
                                      }
                                    >
                                      {data?.visitfixed?.length}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.visitdone
                                        )
                                      }
                                    >
                                      {data?.visitdone?.length}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.negotiation
                                        )
                                      }
                                    >
                                      {data?.negotiation?.length}
                                    </td>
                                  </>
                                )}
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  onClick={() =>
                                    showDrillDownFun(
                                      'Total Visits Fixed',
                                      data?.booked
                                    )
                                  }
                                >
                                  {data?.booked?.length}
                                </td>
                                {showArchiFSource && (
                                  <>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.notinterested
                                        )
                                      }
                                    >
                                      {data?.notinterested?.length}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.dead
                                        )
                                      }
                                    >
                                      {data?.dead?.length}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.blocked
                                        )
                                      }
                                    >
                                      {data?.blocked?.length}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      onClick={() =>
                                        showDrillDownFun(
                                          'Total Visits Fixed',
                                          data?.junk
                                        )
                                      }
                                    >
                                      {data?.junk?.length}
                                    </td>
                                  </>
                                )}
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  onClick={() =>
                                    showDrillDownFun(
                                      'Total Visits Fixed',
                                      data?.archieve
                                    )
                                  }
                                >
                                  {data?.archieve?.length}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  onClick={() =>
                                    showDrillDownFun(
                                      'Total Visits Fixed',
                                      data?.others
                                    )
                                  }
                                >
                                  {data?.others?.length}
                                </td>
                              </tr>
                            )
                          })}

                          {viewProjs?.value == 'allprojects' && (
                            <tr className="border-b bg-gray-800 boder-gray-900">
                              <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                                Total
                              </td>
                              <td
                                className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                onClick={() =>
                                  showDrillDownFun(
                                    'Total Visits Fixed',
                                    leadLogsRawData?.filter((datObj) =>
                                      datObj?.coverA.includes('visitdone')
                                    )
                                  )
                                }
                              >
                                {
                                  leadLogsRawData?.filter((datObj) =>
                                    datObj?.coverA.includes('visitdone')
                                  ).length
                                }
                              </td>
                              <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                {
                                  leadLogsRawData?.filter((datObj) =>
                                    [
                                      'new',
                                      'unassigned',
                                      'followup',
                                      'visitfixed',
                                      'visitdone',
                                      'negotiation',
                                    ].includes(datObj?.to)
                                  ).length
                                }
                              </td>
                              {showInproFSource && (
                                <>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) => datObj?.to == 'new'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'new'
                                      ).length
                                    }
                                  </td>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) => datObj?.to == 'followup'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'followup'
                                      ).length
                                    }
                                  </td>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) => datObj?.to == 'visitfixed'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'visitfixed'
                                      ).length
                                    }
                                  </td>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) => datObj?.to == 'visitdone'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'visitdone'
                                      ).length
                                    }
                                  </td>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) =>
                                            datObj?.to == 'negotiation'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'negotiation'
                                      ).length
                                    }
                                  </td>
                                </>
                              )}
                              <td
                                className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                onClick={() =>
                                  showDrillDownFun(
                                    'Total Visits Fixed',
                                    leadLogsRawData?.filter(
                                      (datObj) => datObj?.to == 'booked'
                                    )
                                  )
                                }
                              >
                                {
                                  leadLogsRawData?.filter(
                                    (datObj) => datObj?.to == 'booked'
                                  ).length
                                }
                              </td>
                              {showArchiFSource && (
                                <>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) =>
                                            datObj?.to == 'notinterested'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) =>
                                          datObj?.to == 'notinterested'
                                      ).length
                                    }
                                  </td>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) => datObj?.to == 'dead'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'dead'
                                      ).length
                                    }
                                  </td>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) => datObj?.to == 'blocked'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'blocked'
                                      ).length
                                    }
                                  </td>
                                  <td
                                    className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                    onClick={() =>
                                      showDrillDownFun(
                                        'Total Visits Fixed',
                                        leadLogsRawData?.filter(
                                          (datObj) => datObj?.to == 'junk'
                                        )
                                      )
                                    }
                                  >
                                    {
                                      leadLogsRawData?.filter(
                                        (datObj) => datObj?.to == 'junk'
                                      ).length
                                    }
                                  </td>
                                </>
                              )}
                              <td
                                className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                onClick={() =>
                                  showDrillDownFun(
                                    'Total Visits Fixed',
                                    leadLogsRawData?.filter((datObj) =>
                                      [
                                        'blocked',
                                        'dead',
                                        'notinterested',
                                        'junk',
                                      ].includes(datObj?.to)
                                    )
                                  )
                                }
                              >
                                {
                                  leadLogsRawData?.filter((datObj) =>
                                    [
                                      'blocked',
                                      'dead',
                                      'notinterested',
                                      'junk',
                                    ].includes(datObj?.to)
                                  ).length
                                }
                              </td>
                              <td
                                className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap"
                                onClick={() =>
                                  showDrillDownFun(
                                    'Total Visits Fixed',
                                    leadLogsRawData?.filter(
                                      (datObj) => datObj?.to == ''
                                    )
                                  )
                                }
                              >
                                {
                                  leadLogsRawData?.filter(
                                    (datObj) => datObj?.to == ''
                                  ).length
                                }
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {selCat === 'booking_perf' && <BookingSummaryReport />}
          {/* {selCat === 'payment_ui' && <BookingSummaryHeader/>} */}

          {selCat === 'source_perf' && (
            <section>
              <section className="flex flex-row flex-wrap gap-2">
                <section className="w-[99%] border-[#e7e5eb] bg-white rounded-lg p-4">
                  <div className="flex flex-col"></div>
                  <section className="flex flex-row justify-between">
                    <article className="flex flex-col">
                      <div className="text-[#1f2937]">Leads</div>
                      <div className="text-[#1f2937] font-[700] text-2xl mt-2">
                        00,000
                      </div>
                      <div className="text-[#EF4444] text-xs mt-1">
                        0.0% less than the previous 30 days
                      </div>
                    </article>
                    <article>date</article>
                  </section>

                  <div className="w-full h-[400px] mt-4">
                    <section className="flex flex-row justify-between">
                      <article></article>
                      <article className="flex flex-row mr-2 mb-3">
                        <section className="flex flex-row">
                          <div className="text-[#1f2937] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#9333ea]"></div>
                          <div className="text-[#4b5563] text-xs">
                            {' '}
                            This month
                          </div>
                        </section>
                        <section className="flex flex-row">
                          <div className="text-[#2563eb] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#2563eb]"></div>
                          <div className="text-[#4b5563] text-xs">
                            {' '}
                            Last month
                          </div>
                        </section>
                      </article>
                    </section>
                    <StackedBarChart />
                  </div>
                  {/* bottom sheet */}
                  <section className="mt-3 ml-4">
                    <div className="text-[#1f2937] font-[600] text-xl">
                      Conversion funnel
                    </div>
                    <div className="flex flex-row border-b border-gray-200">
                      <ul
                        className="flex flex-wrap -mb-px mt-1"
                        id="myTab"
                        data-tabs-toggle="#myTabContent"
                        role="tablist"
                      >
                        {[
                          {
                            lab: 'First-Time',
                            val: 'business_tasks',
                            color: '#4F46E5',
                          },
                          {
                            lab: 'Returning',
                            val: 'personal_tasks',
                            color: '#9333EA',
                          },
                        ].map((d, i) => {
                          return (
                            <li key={i} className="mr-4">
                              {' '}
                              <button
                                className={`inline-block pb-[6px] mr-3 text-sm  text-center text-black rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${
                                  1 == 1 ? 'border-black' : 'border-transparent'
                                }`}
                                type="button"
                                role="tab"
                              >
                                <section className="flex flex-row text-[15px] mb-1ss ">
                                  <div
                                    className={`w-3 h-3 bg-[${d.color}] mt-1 mr-1 rounded-sm`}
                                  ></div>
                                  {d.lab}
                                </section>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </section>
                  <article className="text-[#4f46e5] text-center font-[500] text-[13px]">
                    View full Report
                  </article>
                </section>
              </section>
              <div className="flex flex-row">
                <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  px-4">
                  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div
                      className="py-2 inline-block  sm:px-6 lg:px-8"
                      style={{ backgroundColor: '#ebfafa' }}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-row justify-between border-b mt-4 pb-2">
                          <div className=" text-md font-bold leading-none pl-0 mt-2  mb-4 ">
                            {`Source Performance `}
                          </div>
                          {orgId === 'spark' && (
                            <div
                              onClick={() => {
                                insertTodaySourcePerformance()
                              }}
                            >
                              admin
                            </div>
                          )}
                          <div className=" flex flex-row   ">
                            <span className="mr-4">
                              <SlimSelectBox
                                name="project"
                                label=""
                                className="input min-w-[164px]"
                                onChange={(value) => {
                                  console.log(
                                    'zoro condition changed one  is',
                                    value
                                  )
                                  selViewSource(value)
                                }}
                                value={viewSource?.value}
                                options={[
                                  ...[
                                    {
                                      label: 'All Sources',
                                      value: 'allsources',
                                    },
                                  ],
                                  ...sourceListTuned,
                                ]}
                                placeholder={undefined}
                              />
                            </span>
                            <SlimSelectBox
                              name="project"
                              label=""
                              className="input min-w-[164px] ml-4"
                              onChange={(value) => {
                                console.log(
                                  'zoro condition changed one  is',
                                  value
                                )
                                setSelProject(value)
                              }}
                              value={selProjectIs?.value}
                              options={[
                                ...[
                                  {
                                    label: 'All Projects',
                                    value: 'allprojects',
                                  },
                                ],
                                ...projectList,
                              ]}
                              placeholder={undefined}
                            />
                            <span style={{ display: '' }}>
                              <CSVDownloader
                                className="mr-6 h-[20px] w-[20px]"
                                downloadRows={sourceDownloadRows}
                                style={{ height: '20px', width: '20px' }}
                              />
                            </span>
                          </div>
                        </div>


                        <section className="flex flex-row justify-between mt-[18px]">
                          <section className="flex">
                            {!isEdit && (
                              <button
                                onClick={() => {
                                  setDateRange([null, null])
                                  setSourceDateRange(startOfDay(d).getTime())
                                }}
                              >
                                <span
                                  className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                    sourceDateRange === startOfDay(d).getTime()
                                      ? 'font-semibold text-pink-800 bg-pink-200 '
                                      : 'text-green-800 bg-green-200 '
                                  }rounded-full`}
                                >
                                  <EyeIcon
                                    className="h-3 w-3 mr-1"
                                    aria-hidden="true"
                                  />
                                  Now
                                </span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setDateRange([null, null])
                                setSourceDateRange(startOfWeek(d).getTime())
                              }}
                            >
                              <span
                                className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                  sourceDateRange === startOfWeek(d).getTime()
                                    ? 'font-semibold text-pink-800 bg-pink-200 '
                                    : 'text-green-800 bg-green-200 '
                                }rounded-full`}
                              >
                                <CalendarIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                This Week
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setDateRange([null, null])
                                setSourceDateRange(startOfMonth(d).getTime())
                              }}
                            >
                              <span
                                className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                  sourceDateRange === startOfMonth(d).getTime()
                                    ? 'font-semibold text-pink-800 bg-pink-200 '
                                    : 'text-green-800 bg-green-200 '
                                }rounded-full`}
                              >
                                <CalendarIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                This Month
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setDateRange([null, null])
                                setSourceDateRange(
                                  subMonths(startOfMonth(d), 6).getTime()
                                )
                              }}
                            >
                              <span
                                className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                  sourceDateRange ===
                                  subMonths(startOfMonth(d), 6).getTime()
                                    ? 'font-semibold text-pink-800 bg-pink-200 '
                                    : 'text-green-800 bg-green-200 '
                                }rounded-full`}
                              >
                                <CalendarIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                Last 6 Months
                              </span>
                            </button>
                            <span className="max-h-[42px] mt-[2px] ml-3">
                              <label className="bg-green   pl-   flex flex-row cursor-pointer">
                                {!isOpened && (
                                  <span
                                    className={`flex ml-1 mt-[6px] items-center h-6 px-3 text-xs ${
                                      sourceDateRange === startDate?.getTime()
                                        ? 'font-semibold text-pink-800 bg-pink-200 '
                                        : 'text-green-800 bg-green-200 '
                                    } rounded-full`}
                                    onClick={() => {
                                      setIsOpened(true)
                                    }}
                                  >
                                    <CalendarIcon
                                      className="h-3 w-3 mr-1"
                                      aria-hidden="true"
                                    />
                                    {startDate == null ? 'Custom' : ''}
                                    {startDate != null
                                      ? prettyDate(
                                          startDate?.getTime() + 21600000
                                        )
                                      : ''}
                                    {endDate != null ? '-' : ''}
                                    {endDate != null
                                      ? prettyDate(
                                          endDate?.getTime() + 21600000
                                        )
                                      : ''}
                                  </span>
                                )}
                                {
                                  <span
                                    className="inline"
                                    style={{
                                      visibility: isOpened
                                        ? 'visible'
                                        : 'hidden',
                                    }}
                                  >
                                    <CustomDatePicker
                                      className={`z-10 pl- py-1 px-3 mt-[7px] inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer  max-w-fit   ${
                                        sourceDateRange === startDate?.getTime()
                                          ? 'font-semibold text-pink-800 bg-pink-200 '
                                          : 'text-green-800 bg-green-200 '
                                      } rounded-full`}
                                      onCalendarClose={() => setIsOpened(false)}
                                      placeholderText="&#128467;	 Custom"
                                      onChange={(update) => {
                                        setDateRange(update)
                                      }}
                                      selectsRange={true}
                                      startDate={startDate}
                                      endDate={endDate}
                                      isClearable={true}
                                      onClear={() => {
                                        console.log('am i cleared')
                                      }}

                                      dateFormat="MMM dd, yyyy"
                                    />
                                  </span>
                                }
                              </label>
                            </span>
                          </section>
                        </section>
                        <table className="w-[700px] text-center font-semibold mt-6 cardborder">
                          <thead className="border-b">
                            <tr>
                              {[
                                { label: 'Source', id: 'label' },
                                { label: 'Total', id: 'total' },
                                { label: 'Unassigned', id: 'unassigned' },
                                { label: 'InProgress', id: 'inprogress' },
                                { label: 'New', id: 'new' },
                                { label: 'Followup', id: 'followup' },
                                { label: 'VisitFixed', id: 'visitfixed' },
                                { label: 'VisitDone', id: 'visitdone' },
                                { label: 'Neogotiation', id: 'neogotiation' },

                                { label: 'Booked', id: 'booked' },
                                { label: 'NotInterested', id: 'notinterested' },
                                { label: 'Dead', id: 'dead' },
                                { label: 'Blocked', id: 'blocked' },
                                { label: 'Junk', id: 'junk' },
                                { label: 'Archieve', id: 'archieve' },
                                { label: 'Others', id: 'others' },
                              ].map((d, i) => (
                                <th
                                  key={i}
                                  scope="col"
                                  className={`text-sm font-medium font-semibold text-gray-900 px-6 py-4 ${
                                    ['Source'].includes(d.label)
                                      ? 'text-left'
                                      : ''
                                  }`}
                                  style={{
                                    display: viewSourceStats1A.includes(d.id)
                                      ? ''
                                      : 'none',
                                    color:
                                      ['inprogress'].includes(d.id) &&
                                      showInproFSource
                                        ? 'blue'
                                        : ['archieve'].includes(d.id) &&
                                          showArchiFSource
                                        ? 'blue'
                                        : 'black',
                                  }}
                                  onClick={() => {
                                    if (
                                      ['inprogress', 'archieve'].includes(d.id)
                                    )
                                      showColumnsSourceFun(d.id)
                                  }}
                                >
                                  {d.label}
                                  {d.id === 'inprogress' &&
                                    !showInproFSource && (
                                      <ChevronDoubleRightIcon
                                        className="w-4 h-4 inline"
                                        aria-hidden="true"
                                      />
                                    )}
                                  {d.id === 'inprogress' &&
                                    showInproFSource && (
                                      <ChevronDoubleLeftIcon
                                        className="w-4 h-4 inline"
                                        aria-hidden="true"
                                      />
                                    )}
                                  {d.id === 'archieve' && !showArchiFSource && (
                                    <ChevronDoubleRightIcon
                                      className="w-4 h-4 inline"
                                      aria-hidden="true"
                                    />
                                  )}
                                  {d.id === 'archieve' && showArchiFSource && (
                                    <ChevronDoubleLeftIcon
                                      className="w-4 h-4 inline"
                                      aria-hidden="true"
                                    />
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sourceFiltListTuned.map((data, i) => {
                              return (
                                <tr
                                  className={`  ${
                                    i % 2 === 0
                                      ? 'bg-white border-blue-200'
                                      : 'bg-gray-100'
                                  }`}
                                  key={i}
                                >
                                  <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                                    {data?.label}
                                  </td>
                                  <td
                                    className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                    onClick={() => {
                                      console.log(
                                        'total stuff is ',
                                        data?.Total
                                      )
                                    }}
                                  >
                                    {data?.Total?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.inprogress?.length}
                                  </td>
                                  {showInproFSource && (
                                    <>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.new?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.followup?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.visitfixed?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.visitdone?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.negotiation?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.unassigned?.length}
                                      </td>
                                    </>
                                  )}
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.booked?.length}
                                  </td>
                                  {showArchiFSource && (
                                    <>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.notinterested?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.dead?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.blocked?.length}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                        {data?.junk?.length}
                                      </td>
                                    </>
                                  )}
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.archieve?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.others?.length}
                                  </td>
                                </tr>
                              )
                            })}

                            {viewSource?.value === 'allsources' && (
                              <tr className="border-b bg-gray-800 boder-gray-900">
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                                  Total
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                                  {sourceRawFilData.length}
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    sourceRawFilData.filter((datObj) =>
                                      [
                                        'new',
                                        'unassigned',
                                        'followup',
                                        'visitfixed',
                                        'visitdone',
                                        'negotiation',
                                      ].includes(datObj?.Status)
                                    ).length
                                  }
                                </td>
                                {showInproFSource && (
                                  <>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) => datObj?.Status == 'new'
                                        ).length
                                      }
                                    </td>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) =>
                                            datObj?.Status == 'followup'
                                        ).length
                                      }
                                    </td>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) =>
                                            datObj?.Status == 'visitfixed'
                                        ).length
                                      }
                                    </td>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) =>
                                            datObj?.Status == 'visitdone'
                                        ).length
                                      }
                                    </td>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) =>
                                            datObj?.Status == 'negotiation'
                                        ).length
                                      }
                                    </td>
                                  </>
                                )}
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                                  {
                                    sourceRawFilData.filter(
                                      (datObj) => datObj?.Status == 'booked'
                                    ).length
                                  }
                                </td>
                                {showArchiFSource && (
                                  <>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) =>
                                            datObj?.Status == 'notinterested'
                                        ).length
                                      }
                                    </td>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) => datObj?.Status == 'dead'
                                        ).length
                                      }
                                    </td>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) =>
                                            datObj?.Status == 'blocked'
                                        ).length
                                      }
                                    </td>
                                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                      {
                                        sourceRawFilData.filter(
                                          (datObj) => datObj?.Status == 'junk'
                                        ).length
                                      }
                                    </td>
                                  </>
                                )}
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    sourceRawFilData.filter((datObj) =>
                                      [
                                        'blocked',
                                        'dead',
                                        'notinterested',
                                        'junk',
                                      ].includes(datObj?.Status)
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    sourceRawFilData.filter(
                                      (datObj) => datObj?.Status == ''
                                    ).length
                                  }
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {selCat === 'emp_status_report' && (
            <div className="flex flex-col  mt-14 drop-shadow-md rounded-lg  px-4">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div
                  className="py-2 inline-block sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#ebfafa' }}
                >
                  <div className="overflow-hidden">
                    <div className=" text-md font-bold leading-none pl-0 mt-4 border-b pb-4 mb-4 ">
                      {`Employee vs Status `}
                    </div>

                    <section className="flex flex-row justify-between mt-[18px]">
                      <section className="flex">
                        {!isEdit && (
                          // <Link to={routes.projectEdit({ uid })}>
                          <button
                            onClick={() => {
                              setDateRange([null, null])

                              setSourceDateRange(startOfDay(d).getTime())
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange === startOfDay(d).getTime()
                                  ? 'font-semibold text-pink-800 bg-pink-200 '
                                  : 'text-green-800 bg-green-200 '
                              }rounded-full`}
                            >
                              <EyeIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              Now
                            </span>
                          </button>
                          // </Link>
                        )}

                        <button
                          onClick={() => {
                            setDateRange([null, null])

                            setSourceDateRange(startOfWeek(d).getTime())
                          }}
                        >
                          <span
                            className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                              sourceDateRange === startOfWeek(d).getTime()
                                ? 'font-semibold text-pink-800 bg-pink-200 '
                                : 'text-green-800 bg-green-200 '
                            }rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            This Week
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setDateRange([null, null])

                            setSourceDateRange(startOfMonth(d).getTime())
                          }}
                        >
                          <span
                            className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                              sourceDateRange === startOfMonth(d).getTime()
                                ? 'font-semibold text-pink-800 bg-pink-200 '
                                : 'text-green-800 bg-green-200 '
                            }rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            This Month
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setDateRange([null, null])

                            setSourceDateRange(
                              subMonths(startOfMonth(d), 6).getTime()
                            )
                          }}
                        >
                          <span
                            className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                              sourceDateRange ===
                              subMonths(startOfMonth(d), 6).getTime()
                                ? 'font-semibold text-pink-800 bg-pink-200 '
                                : 'text-green-800 bg-green-200 '
                            } rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            Last 6 Months
                          </span>
                        </button>
                        <span className="max-h-[42px] mt-[2px] ml-3">
                          <label className="bg-green   pl-   flex flex-row cursor-pointer">
                            {!isOpened && (
                              <span
                                className={`flex ml-1 mt-[6px] items-center h-6 px-3 text-xs ${
                                  sourceDateRange === startDate?.getTime()
                                    ? 'font-semibold text-pink-800 bg-pink-200 '
                                    : 'text-green-800 bg-green-200 '
                                } rounded-full`}
                                onClick={() => {
                                  setIsOpened(true)
                                }}
                              >
                                <CalendarIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                {startDate == null ? 'Custom' : ''}
                                {startDate != null
                                  ? prettyDate(startDate?.getTime() + 21600000)
                                  : ''}
                                {endDate != null ? '-' : ''}
                                {endDate != null
                                  ? prettyDate(endDate?.getTime() + 21600000)
                                  : ''}
                              </span>
                            )}
                            {
                              <span
                                className="inline"
                                style={{
                                  visibility: isOpened ? 'visible' : 'hidden',
                                }}
                              >
                                <CustomDatePicker
                                  className={`z-10 pl- py-1 px-3 mt-[7px] inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer  max-w-fit   ${
                                    sourceDateRange === startDate?.getTime()
                                      ? 'font-semibold text-pink-800 bg-pink-200 '
                                      : 'text-green-800 bg-green-200 '
                                  } rounded-full`}
                                  onCalendarClose={() => setIsOpened(false)}
                                  placeholderText="&#128467;	 Custom"
                                  onChange={(update) => {
                                    setDateRange(update)
                                  }}
                                  selectsRange={true}
                                  startDate={startDate}
                                  endDate={endDate}
                                  isClearable={true}
                                  onClear={() => {
                                    console.log('am i cleared')
                                  }}
                                  // dateFormat="MMM d, yyyy "
                                  //dateFormat="d-MMMM-yyyy"
                                  dateFormat="MMM dd, yyyy"
                                />
                              </span>
                            }
                          </label>
                        </span>
                      </section>
                      <div className=" flex   ">
                        <button
                          onClick={() => {
                            triggerWhatsAppAlert(startOfWeek(d).getTime())
                          }}
                        >
                          <span
                            className={`flex ml-2 mr-4  items-center h-6 px-3 text-xs
                            text-green-800 bg-green-200
                          rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            Alert Status Count
                          </span>
                        </button>
                        <span className="mr-4">
                          <SlimSelectBox
                            name="project"
                            label=""
                            className="input min-w-[164px]"
                            onChange={(value) => {
                              console.log(
                                'zoro condition changed one  is',
                                value
                              )
                              selEmp1(value)
                            }}
                            value={viewEmp1?.value}
                            options={[
                              ...[
                                {
                                  label: 'All Employees',
                                  value: 'allemployees',
                                },
                              ],
                              ...empListTuned,
                            ]}
                            placeholder={undefined}
                          />
                        </span>
                        <SlimSelectBox
                          name="project"
                          label=""
                          className="input min-w-[164px] "
                          onChange={(value) => {
                            setSelProjectEmp(value)
                          }}
                          value={selProjectEmpIs?.value}
                          options={[
                            ...[
                              { label: 'All Projects', value: 'allprojects' },
                            ],
                            ...projectList,
                          ]}
                          placeholder={undefined}
                        />
                        <span style={{ display: '' }}>
                          <CSVDownloader
                            className="mr-6 h-[20px] w-[20px]"
                            downloadRows={EmpDownloadRows}
                            style={{ height: '20px', width: '20px' }}
                          />
                        </span>
                      </div>
                    </section>
                    <table className="min-w-full font-semibold text-center mt-6">
                      <thead className="border-b">
                        <tr>
                          {[
                            { label: 'Employee', id: 'label' },
                            { label: 'Total', id: 'total' },
                            { label: 'InProgress', id: 'inprogress' },
                            { label: 'New', id: 'new' },
                            { label: 'Followup', id: 'followup' },
                            { label: 'VisitFixed', id: 'visitfixed' },
                            { label: 'VisitDone', id: 'visitdone' },
                            { label: 'Neogotiation', id: 'neogotiation' },
                            { label: 'Booked', id: 'booked' },
                            { label: 'NotInterested', id: 'notinterested' },
                            { label: 'Dead', id: 'dead' },
                            { label: 'Blocked', id: 'blocked' },
                            { label: 'Junk', id: 'junk' },
                            { label: 'Archieve', id: 'archieve' },
                            { label: 'Others', id: 'others' },
                          ].map((d, i) => (
                            <th
                              key={i}
                              scope="col"
                              className={`text-sm font-medium text-gray-900 px-6 py-4 ${
                                ['Employee'].includes(d.label)
                                  ? 'text-left'
                                  : ''
                              }`}
                              style={{
                                display: viewSourceStats1A.includes(d.id)
                                  ? ''
                                  : 'none',
                                color:
                                  ['inprogress'].includes(d.id) &&
                                  showInproFSource
                                    ? 'blue'
                                    : ['archieve'].includes(d.id) &&
                                      showArchiFSource
                                    ? 'blue'
                                    : 'black',
                              }}
                              onClick={() => {
                                if (['inprogress', 'archieve'].includes(d.id))
                                  showColumnsSourceFun(d.id)
                              }}
                            >
                              {d.label}
                              {d.id === 'inprogress' && !showInproFSource && (
                                <ChevronDoubleRightIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                              {d.id === 'inprogress' && showInproFSource && (
                                <ChevronDoubleLeftIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                              {d.id === 'archieve' && !showArchiFSource && (
                                <ChevronDoubleRightIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                              {d.id === 'archieve' && showArchiFSource && (
                                <ChevronDoubleLeftIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {empFiltListTuned.map((data, i) => {
                          return (
                            <tr
                              className={`  ${
                                i % 2 === 0
                                  ? 'bg-white border-blue-200'
                                  : 'bg-gray-100'
                              }`}
                              key={i}
                            >
                              <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                                {data?.label}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.Total?.length}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.inprogress?.length}
                              </td>
                              {showInproFSource && (
                                <>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.new?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.followup?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.visitfixed?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.visitdone?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.negotiation?.length}
                                  </td>
                                </>
                              )}
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.booked?.length}
                              </td>
                              {showArchiFSource && (
                                <>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.notinterested?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.dead?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.blocked?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.junk?.length}
                                  </td>
                                </>
                              )}
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.archieve?.length}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.others?.length}
                              </td>
                            </tr>
                          )
                        })}

                        {viewEmp1?.value == 'allemployees' && (
                          <tr className="border-b bg-gray-800 boder-gray-900">
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                              Total
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {EmpRawFilData.length}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                EmpRawFilData.filter((datObj) =>
                                  [
                                    'new',
                                    'unassigned',
                                    'followup',
                                    'visitfixed',
                                    'visitdone',
                                    'negotiation',
                                  ].includes(datObj?.Status)
                                ).length
                              }
                            </td>
                            {showInproFSource && (
                              <>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) => datObj?.Status == 'new'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) => datObj?.Status == 'followup'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) => datObj?.Status == 'visitfixed'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) => datObj?.Status == 'visitdone'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) =>
                                        datObj?.Status == 'negotiation'
                                    ).length
                                  }
                                </td>
                              </>
                            )}
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                EmpRawFilData.filter(
                                  (datObj) => datObj?.Status == 'booked'
                                ).length
                              }
                            </td>
                            {showArchiFSource && (
                              <>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) =>
                                        datObj?.Status == 'notinterested'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) => datObj?.Status == 'dead'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) => datObj?.Status == 'blocked'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    EmpRawFilData.filter(
                                      (datObj) => datObj?.Status == 'junk'
                                    ).length
                                  }
                                </td>
                              </>
                            )}
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                EmpRawFilData.filter((datObj) =>
                                  [
                                    'blocked',
                                    'dead',
                                    'notinterested',
                                    'junk',
                                  ].includes(datObj?.Status)
                                ).length
                              }
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                EmpRawFilData.filter(
                                  (datObj) => datObj?.Status == ''
                                ).length
                              }
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selCat === 'proj_leads_report' && (
            <div className="flex flex-col  mt-14 drop-shadow-md rounded-lg  px-4">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div
                  className="py-2 inline-block  sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#ebfafa' }}
                >
                  <div className="overflow-hidden">
                    <div className=" text-md font-bold leading-none pl-0 mt-4 border-b pb-4 mb-4 ">
                      {`Project vs Status `}
                    </div>

                    <section className="flex flex-row justify-between mt-[18px]">
                      <section className="flex">
                        {!isEdit && (
                          // <Link to={routes.projectEdit({ uid })}>
                          <button
                            onClick={() => {
                              setSourceDateRange(startOfDay(d).getTime())
                            }}
                          >
                            <span
                              className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                                sourceDateRange === startOfDay(d).getTime()
                                  ? 'font-semibold text-pink-800 bg-pink-200 '
                                  : 'text-green-800 bg-green-200 '
                              }rounded-full`}
                            >
                              <EyeIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              Now
                            </span>
                          </button>
                          // </Link>
                        )}

                        <button
                          onClick={() => {
                            setSourceDateRange(startOfWeek(d).getTime())
                          }}
                        >
                          <span
                            className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                              sourceDateRange === startOfWeek(d).getTime()
                                ? 'font-semibold text-pink-800 bg-pink-200 '
                                : 'text-green-800 bg-green-200 '
                            }rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            This Week
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setSourceDateRange(startOfMonth(d).getTime())
                          }}
                        >
                          <span
                            className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                              sourceDateRange === startOfMonth(d).getTime()
                                ? 'font-semibold text-pink-800 bg-pink-200 '
                                : 'text-green-800 bg-green-200 '
                            }rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            This Month
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setSourceDateRange(
                              subMonths(startOfMonth(d), 6).getTime()
                            )
                          }}
                        >
                          <span
                            className={`flex ml-2 mt-[5px] items-center h-6 px-3 text-xs ${
                              sourceDateRange ===
                              subMonths(startOfMonth(d), 6).getTime()
                                ? 'font-semibold text-pink-800 bg-pink-200 '
                                : 'text-green-800 bg-green-200 '
                            }rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            Last 6 Months
                          </span>
                        </button>
                        <span className="max-h-[42px] mt-[2px] ml-3">
                          <label className="bg-green   pl-   flex flex-row cursor-pointer">
                            {!isOpened && (
                              <span
                                className={`flex ml-1 mt-[6px] items-center h-6 px-3 text-xs ${
                                  sourceDateRange === startDate?.getTime()
                                    ? 'font-semibold text-pink-800 bg-pink-200 '
                                    : 'text-green-800 bg-green-200 '
                                } rounded-full`}
                                onClick={() => {
                                  setIsOpened(true)
                                }}
                              >
                                <CalendarIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                {startDate == null ? 'Custom' : ''}
                                {/* {sourceDateRange} -- {startDate?.getTime()} */}
                                {startDate != null
                                  ? prettyDate(startDate?.getTime() + 21600000)
                                  : ''}
                                {endDate != null ? '-' : ''}
                                {endDate != null
                                  ? prettyDate(endDate?.getTime() + 21600000)
                                  : ''}
                              </span>
                            )}
                            {
                              <span
                                className="inline"
                                style={{
                                  visibility: isOpened ? 'visible' : 'hidden',
                                }}
                              >
                                <CustomDatePicker
                                  className={`z-10 pl- py-1 px-3 mt-[7px] inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer  max-w-fit   ${
                                    sourceDateRange === startDate?.getTime()
                                      ? 'font-semibold text-pink-800 bg-pink-200 '
                                      : 'text-green-800 bg-green-200 '
                                  } rounded-full`}
                                  onCalendarClose={() => setIsOpened(false)}
                                  placeholderText="&#128467;	 Custom"
                                  onChange={(update) => {
                                    setDateRange(update)

                                    console.log(
                                      'was this updated',
                                      update,
                                      startDate
                                    )
                                  }}
                                  selectsRange={true}
                                  startDate={startDate}
                                  endDate={endDate}
                                  isClearable={true}
                                  onClear={() => {
                                    console.log('am i cleared')
                                  }}
                                  //dateFormat="MMM d, yyyy "
                                  dateFormat="MMM dd, yyyy"
                                />
                              </span>
                            }
                          </label>
                        </span>
                      </section>
                      <div className=" flex flex-row   ">
                        <SlimSelectBox
                          name="project"
                          label=""
                          className="input min-w-[164px] "
                          onChange={(value) => {
                            selProjs(value)
                          }}
                          value={viewProjs?.value}
                          options={[
                            ...[
                              { label: 'All Projects', value: 'allprojects' },
                            ],
                            ...projectList,
                          ]}
                          placeholder={undefined}
                        />
                        <span style={{ display: '' }}>
                          <CSVDownloader
                            className="mr-6 h-[20px] w-[20px]"
                            downloadRows={projDownloadRows}
                            style={{ height: '20px', width: '20px' }}
                          />
                        </span>
                      </div>
                    </section>
                    <table className="min-w-full font-semibold text-center mt-6">
                      <thead className="border-b">
                        <tr>
                          {[
                            { label: 'Source', id: 'label' },
                            { label: 'Total', id: 'total' },
                            { label: 'InProgress', id: 'inprogress' },
                            { label: 'New', id: 'new' },
                            { label: 'Followup', id: 'followup' },
                            { label: 'VisitFixed', id: 'visitfixed' },
                            { label: 'VisitDone', id: 'visitdone' },
                            { label: 'Neogotiation', id: 'neogotiation' },
                            { label: 'Booked', id: 'booked' },
                            { label: 'NotInterested', id: 'notinterested' },
                            { label: 'Dead', id: 'dead' },
                            { label: 'Blocked', id: 'blocked' },
                            { label: 'Junk', id: 'junk' },
                            { label: 'Archieve', id: 'archieve' },
                            { label: 'Others', id: 'others' },
                          ].map((d, i) => (
                            <th
                              key={i}
                              scope="col"
                              className={`text-sm font-medium text-gray-900 px-6 py-4 ${
                                ['Source'].includes(d.label) ? 'text-left' : ''
                              }`}
                              style={{
                                display: viewSourceStats1A.includes(d.id)
                                  ? ''
                                  : 'none',
                                color:
                                  ['inprogress'].includes(d.id) &&
                                  showInproFSource
                                    ? 'blue'
                                    : ['archieve'].includes(d.id) &&
                                      showArchiFSource
                                    ? 'blue'
                                    : 'black',
                              }}
                              onClick={() => {
                                if (['inprogress', 'archieve'].includes(d.id))
                                  showColumnsSourceFun(d.id)
                              }}
                            >
                              {d.label}
                              {d.id === 'inprogress' && !showInproFSource && (
                                <ChevronDoubleRightIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                              {d.id === 'inprogress' && showInproFSource && (
                                <ChevronDoubleLeftIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                              {d.id === 'archieve' && !showArchiFSource && (
                                <ChevronDoubleRightIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                              {d.id === 'archieve' && showArchiFSource && (
                                <ChevronDoubleLeftIcon
                                  className="w-4 h-4 inline"
                                  aria-hidden="true"
                                />
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projectFilList.map((data, i) => {
                          return (
                            <tr
                              className={` ${
                                i % 2 === 0
                                  ? 'bg-white border-blue-200'
                                  : 'bg-gray-100'
                              }`}
                              key={i}
                            >
                              <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                                {data?.label}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.Total?.length}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.inprogress?.length}
                              </td>
                              {showInproFSource && (
                                <>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.new?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.followup?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.visitfixed?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.visitdone?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.negotiation?.length}
                                  </td>
                                </>
                              )}
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.booked?.length}
                              </td>
                              {showArchiFSource && (
                                <>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.notinterested?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.dead?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.blocked?.length}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                    {data?.junk?.length}
                                  </td>
                                </>
                              )}
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.archieve?.length}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.others?.length}
                              </td>
                            </tr>
                          )
                        })}

                        {viewProjs?.value == 'allprojects' && (
                          <tr className="border-b bg-gray-800 boder-gray-900">
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                              Total
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {leadsFetchedRawData.length}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                leadsFetchedRawData.filter((datObj) =>
                                  [
                                    'new',
                                    'unassigned',
                                    'followup',
                                    'visitfixed',
                                    'visitdone',
                                    'negotiation',
                                  ].includes(datObj?.Status)
                                ).length
                              }
                            </td>
                            {showInproFSource && (
                              <>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) => datObj?.Status == 'new'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) => datObj?.Status == 'followup'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) => datObj?.Status == 'visitfixed'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) => datObj?.Status == 'visitdone'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) =>
                                        datObj?.Status == 'negotiation'
                                    ).length
                                  }
                                </td>
                              </>
                            )}
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                leadsFetchedRawData.filter(
                                  (datObj) => datObj?.Status == 'booked'
                                ).length
                              }
                            </td>
                            {showArchiFSource && (
                              <>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) =>
                                        datObj?.Status == 'notinterested'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) => datObj?.Status == 'dead'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) => datObj?.Status == 'blocked'
                                    ).length
                                  }
                                </td>
                                <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                                  {
                                    leadsFetchedRawData.filter(
                                      (datObj) => datObj?.Status == 'junk'
                                    ).length
                                  }
                                </td>
                              </>
                            )}
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                leadsFetchedRawData.filter((datObj) =>
                                  [
                                    'blocked',
                                    'dead',
                                    'notinterested',
                                    'junk',
                                  ].includes(datObj?.Status)
                                ).length
                              }
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {
                                leadsFetchedRawData.filter(
                                  (datObj) => datObj?.Status == ''
                                ).length
                              }
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selCat === 'emp_leads_report' && (
            <div
              className="flex flex-col  mt-14 drop-shadow-md rounded-lg  px-4"
              style={{ backgroundColor: '#ebfafa' }}
            >
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <div className=" text-md font-bold leading-none pl-0 mt-4 border-b pb-4 mb-4 ">
                      {`Employee vs Leads Aging `}
                    </div>

                    <section className="flex flex-row justify-between mt-[18px]">
                      <section></section>
                      <div className=" flex   ">
                        <button
                          onClick={() => {
                            triggerWhatsAppTasksCountAlert()
                          }}
                        >
                          <span
                            className={`flex ml-2 mr-4  items-center h-6 px-3 text-xs
                            text-green-800 bg-green-200
                          rounded-full`}
                          >
                            <CalendarIcon
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            Alert Tasks Counts
                          </span>
                        </button>

                      </div>
                    </section>
                    <table className="min-w-full  font-semibold text-center mt-6">
                      <thead className="border-b">
                        <tr>
                          {[
                            { label: 'Name', id: 'label' },
                            { label: 'Total', id: 'total' },
                            { label: 'Today', id: '1' },
                            { label: '1-7 days', id: '7' },
                            { label: '8-20 days', id: '20' },
                            { label: '21-30', id: '30' },
                            { label: '31-40', id: '40' },
                            { label: '41-50', id: '50' },
                            { label: '50+', id: 'oldest' },
                          ].map((d, i) => (
                            <th
                              key={i}
                              scope="col"
                              className={`text-sm font-medium font-semibold text-gray-900 px-6 py-4 ${
                                ['Name'].includes(d.label) ? 'text-left' : ''
                              }`}
                              onClick={() => {
                                if (['inprogress', 'archieve'].includes(d.id))
                                  showColumnsSourceFun(d.id)
                              }}
                            >
                              {d.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {empTaskListTuned?.map((data, i) => {
                          return (
                            <tr
                              className={`  ${
                                i % 2 === 0
                                  ? 'bg-white border-blue-200'
                                  : 'bg-gray-100'
                              }`}
                              key={i}
                            >
                              <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                                {data?.label}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.Total?.length || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.now?.length || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.sevenDays?.length || 0}
                              </td>

                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.twentyDays?.length || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.thirtyDays?.length || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.fourtyDays?.length || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.fiftyDays?.length || 0}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                                {data?.fiftyDaysMore?.length || 0}
                              </td>
                            </tr>
                          )
                        })}

                        <tr className="border-b bg-gray-800 boder-gray-900">
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                            Total
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">

                            {empTaskListTunedTotal?.TotalSum}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {empTaskListTunedTotal?.now}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {empTaskListTunedTotal?.Sum7}
                          </td>

                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {empTaskListTunedTotal?.Sum20}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {empTaskListTunedTotal?.Sum30}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {empTaskListTunedTotal?.Sum40}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {empTaskListTunedTotal?.Sum50}
                          </td>
                          <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                            {empTaskListTunedTotal?.Sum50M}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}


          <ReportSideWindow
            open={isOpenSideForm}
            setOpen={setReportSideForm}
            title="Site Visit Leads"
            subtitle={subTitle}
            setCustomerDetails={setCustomerDetails}
            setisImportLeadsOpen={setisImportLeadsOpen}
            leadsLogsPayload={drillDownPayload}
            widthClass="max-w-7xl"
            unitsViewMode={undefined}
            setIsClicked={undefined}
          />

          <SiderForm
            open={isImportLeadsOpen}
            setOpen={setisImportLeadsOpen}
            title={'User Profile'}
            customerDetails={customerDetails}
            widthClass="max-w-4xl"
            pId={undefined}
            phaseFeed={undefined}
            BlockFeed={undefined}
            myBlock={undefined}
            projectDetails={undefined}
            phaseDetails={undefined}
            blockDetails={undefined}
            unitViewerrr={undefined}
            unitsViewMode={undefined}
            setUnitsViewMode={undefined}
            leadDetailsObj={undefined}
            projectsList={undefined}
            viewLegalDocData={undefined}
            viewUnitConstData={undefined}
            transactionData={undefined}
            selCustomerPayload={undefined}
            selUnitDetails={undefined}
            selSubMenu={undefined}
            selSubMenu2={undefined}
            setIsClicked={undefined}
            wbPayload={undefined}
          />
        </div>
      </section>
    </div>
  )
}

export default LeadsTeamReportBody
