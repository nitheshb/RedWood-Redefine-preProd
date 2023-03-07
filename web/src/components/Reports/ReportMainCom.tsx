import { useEffect, useState } from 'react'
import { startOfWeek, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { sourceList, sourceListItems } from '../../constants/projects'
import {
  getAllProjects,
  getEmployeesListDept,
  getEmployeesTaskProgressDept,
  getLeadbyId1,
  getLeadsByDate,
  getTodayTodoLeadsData,
  getTodayTodoLeadsDataByUser,
  steamAllLeadsActivity,
  steamLeadScheduleLog,
  steamUsersListByRole,
  updateLeadLastUpdateTime,
  updateLeadsLogWithProject,
  updateTodayTasksTotal,
} from '../../context/dbQueryFirebase'
import { useAuth } from '../../context/firebase-auth-context'
import { serialEmployeeLeadData } from '../LeadsTeamReport/serialEmployeeLeadData'
import { serialEmployeeTaskLeadData } from '../LeadsTeamReport/serialEmployeeTaskLeadData'
import { serialProjectLeadData } from '../LeadsTeamReport/serialProjectLeadData'
import { serialProjecVisitFixedData } from '../LeadsTeamReport/serialProjectVisitsFixedData'
import { serialMyData } from '../LeadsTeamReport/SourceLeads'
import ReportCard from './ReportCard'
import {
  SlimSelectBox,
  SlimDateSelectBox,
} from '../../util/formFields/slimSelectBoxField'
import { Responsive, WidthProvider } from 'react-grid-layout'
import '../../../../node_modules/react-grid-layout/css/styles.css'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
const ResponsiveGridLayout = WidthProvider(Responsive)
import ChartBar from './ChartExm'
import PieChart from './PieChart'
import LineChart from './LineChart'
export default function ReportMainCom() {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId, access, uid } = user
  const [leadsFetchedRawData, setLeadsFetchedRawData] = useState([])
  const [leadLogsRawData, setLeadLogsRawData] = useState([])
  const [empPerDayTasksCountsA, setEmpPerDayTasksCountsA] = useState([])

  const [sourceListTuned, setSourceListTuned] = useState([])
  const [sourceFiltListTuned, setFiltSourceListTuned] = useState([])
  const [viewSource, selViewSource] = useState({
    label: 'All Sources',
    value: 'allsources',
  })
  const [leadsLogFilData, setLeadsLogFilData] = useState([])

  const [showInproFSource, setShowInproFSource] = useState(false)
  const [showArchiFSource, setShowArchiFSource] = useState(false)
  const [showInproFProject, setShowInproFProject] = useState(false)
  const [showArchiFProject, setShowArchiFProject] = useState(false)
  const [showInproFEmployee, setShowInproFEmployee] = useState(false)
  const [showArchiFEmployee, setShowArchiFEmployee] = useState(false)
  const [usersList, setusersList] = useState([])
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
  const [selEmpIsProject, setSelProjectEmp] = useState({
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

  const [sourceDateRange, setSourceDateRange] = React.useState(
    startOfDay(d).getTime()
  )

  const [projectDateRange, setProjectDateRange] = React.useState(
    startOfDay(d).getTime()
  )
  const [empDateRange, setEmpDateRange] = React.useState(
    startOfWeek(d).getTime()
  )
  const [dateRange, setDateRange] = React.useState([null, null])
  const [isOpened, setIsOpened] = React.useState(false)
  const [startDate, endDate] = dateRange
  const [viewSourceStats1A, SetViewSourceStats1A] = useState([
    'label',
    'total',
    'percentage',
    'inprogress',
    'booked',
    'archieve',
    'others',
  ])
  const [viewProjectStats1A, SetViewProjectStats1A] = useState([
    'label',
    'total',
    'percentage',
    'inprogress',
    'booked',
    'archieve',
    'others',
  ])
  const [viewEmployeeStats1A, SetViewEmployeeStats1A] = useState([
    'label',
    'total',
    'percentage',
    'inprogress',
    'booked',
    'archieve',
    'others',
  ])
  const [employeeTaskColumn, setEmployeeTaskColumn] = useState([
    'no',
    'name',
    'all',
    'rnr',
    'busy',
    'new',
    'followup',
    'visitfixed',
  ])
  const [showEmployeeTaskAllData, setShowEmployeeTaskAllData] = useState(false)
  const [compactType, setcompactType] = useState('vertical')
  const [mounted, setmounted] = useState(false)
  const [layout, setlayout] = useState([
    { i: 'a', x: 0, y: 0, w: 9, h: 9 },
    { i: 'b', x: 1, y: 12, w: 9, h: 9 },
  ])
  const [btnBackgroundColor, SetBtnBackgroundColor] = useState({task:true, source:false, project:false, employee:false, performance:false})
  const [btnChartDisplay, SetBtnChartDisplay] = useState({task:false, source:false, project:false, employee:false, performance:false})
  const [formattedSourceData, setFormattedSourceData] = useState([])
  const [formattedProjectData, setFormattedProjectData] = useState([])
  const [formattedEmployeeData, setFormattedEmployeeData] = useState([])
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
  const showColumnsProjectFun = async (id) => {
    const y = ['new', 'followup', 'visitfixed', 'visitdone', 'neogotiation']
    const y1 = ['notinterested', 'dead', 'blocked', 'junk']

    if (id === 'inprogress') {
      const check = !showInproFProject
      await setShowInproFProject(check)
      const x = viewProjectStats1A
      if (check) {
        SetViewProjectStats1A([...x, ...y])
      } else {
        const z = viewProjectStats1A.filter((d1) => {
          return !y.includes(d1)
        })
        await SetViewProjectStats1A(z)
      }
    } else if (id === 'archieve') {
      const check = !showArchiFProject
      await setShowArchiFProject(check)
      console.log(check, 'check')
      const x = viewProjectStats1A
      if (check) {
        SetViewProjectStats1A([...x, ...y1])
      } else {
        const z = viewProjectStats1A.filter((d1) => {
          return !y1.includes(d1)
        })
        SetViewProjectStats1A(z)
      }
    }
    console.log(
      id,
      'id',
      showInproFProject,
      'showInproFProject',
      showArchiFProject,
      'showArchiFProject'
    )
  }
  console.log(viewProjectStats1A, 'viewProjectStats1A')
  const showColumnsEmployeeFun = async (id) => {
    const y = ['new', 'followup', 'visitfixed', 'visitdone', 'neogotiation']
    const y1 = ['notinterested', 'dead', 'blocked', 'junk']
    if (id === 'inprogress') {
      const check = !showInproFEmployee
      await setShowInproFEmployee(check)
      const x = viewEmployeeStats1A
      if (check) {
        SetViewEmployeeStats1A([...x, ...y])
      } else {
        const z = viewEmployeeStats1A.filter((d1) => {
          return !y.includes(d1)
        })
        await SetViewEmployeeStats1A(z)
      }
    } else if (id === 'archieve') {
      const check = !showArchiFEmployee
      await setShowArchiFEmployee(check)
      const x = await viewEmployeeStats1A
      if (check) {
        await SetViewEmployeeStats1A([...x, ...y1])
      } else {
        const z = viewEmployee1A.filter((d1) => {
          return !y1.includes(d1)
        })
        await SetViewEmployeeStats1A(z)
      }
    }
  }
  const showColumnsEmployeeTaskFun = async () => {
    const y = [
      'visitdone',
      'visitCancel',
      'booked',
      'dead',
      'blocked',
      'junk',
      'negotiation',
      'others',
    ]
    // [
    //   { label: 'sNo', id: 'no' },
    //   { label: 'Name', id: 'name' },
    //   { label: 'All', id: 'all' },
    //   { label: 'Rnr', id: 'rnr' },
    //   { label: 'Busy', id: 'busy' },
    //   { label: 'New', id: 'new' },
    //   { label: 'Follow Up', id: 'followup' },
    //   { label: 'Visit Fixed', id: 'visitfixed' },
    //   { label: 'Visit Done', id: 'visitdone' },
    //   { label: 'Visit Cancel', id: 'visitCancel' },
    //   { label: 'Booked', id: 'booked' },
    //   { label: 'Dead', id: 'dead' },
    //   { label: 'Blocked', id: 'blocked' },
    //   { label: 'Junk', id: 'junk' },

    //   { label: 'Negotiations', id: 'negotiation' },
    //   { label: 'Others', id: 'others' },
    // ]
    // { label: 'sNo', id: 'no' },
    // { label: 'Name', id: 'label' },
    // { label: 'Rnr', id: 'all' },
    // { label: 'Busy', id: 'new' },
    // { label: 'All', id: 'all' },
    // { label: 'New', id: 'new' },
    // { label: 'Follow Up', id: 'followup' },
    // { label: 'Visit Fixed', id: 'visitfixed' },
    // { label: 'Visit Done', id: 'visitdone' },
    // { label: 'Visit Cancel', id: 'visitCancel' },
    // { label: 'Booked', id: 'booked' },
    // { label: 'Dead', id: 'dead' },
    // { label: 'Blocked', id: 'blocked' },
    // { label: 'Junk', id: 'junk' },

    // { label: 'Negotiations', id: 'negotiation' },
    // { label: 'Others', id: 'others' }
    if (!showEmployeeTaskAllData) {
      const x = employeeTaskColumn
      setEmployeeTaskColumn([...x, ...y])
    } else {
      const z = employeeTaskColumn.filter((d1) => {
        return !y.includes(d1)
      })
      await setEmployeeTaskColumn(z)
    }
    setShowEmployeeTaskAllData(!showEmployeeTaskAllData)
    // if (id === 'inprogress') {
    //   const check = !showInproFEmployee
    //   await setShowInproFEmployee(check)
    //   const x = viewEmployeeStats1A
    //   if (check) {
    //     SetViewEmployeeStats1A([...x, ...y])
    //   } else {
    //     const z = viewEmployeeStats1A.filter((d1) => {
    //       return !y.includes(d1)
    //     })
    //     await SetViewEmployeeStats1A(z)
    //   }
    // } else if (id === 'archieve') {
    //   const check = !showArchiFEmployee
    //   await setShowArchiFEmployee(check)
    //   const x = await viewEmployeeStats1A
    //   if (check) {
    //     await SetViewEmployeeStats1A([...x, ...y1])
    //   } else {
    //     const z = viewEmployee1A.filter((d1) => {
    //       return !y1.includes(d1)
    //     })
    //     await SetViewEmployeeStats1A(z)
    //   }
    // }
  }
  useEffect(() => {
    if (viewProjs?.value == 'allprojects') {
      console.log('project list i s', projectList)
      setFiltProjectListTuned(projectList)
    } else {
      const z = projectList.filter((da) => {
        return da.value == viewProjs?.value
      })
      setFiltProjectListTuned(z)
      // viewSource
    }
  }, [projectList, viewProjs])

  useEffect(() => {
    if (viewEmp1?.value == 'allemployees') {
      setFiltEmployeeListTuned(empListTuned)
    } else {
      const z = empListTuned.filter((da) => {
        return da.value == viewEmp1?.value
      })
      setFiltEmployeeListTuned(z)
      // viewSource
    }
  }, [empListTuned, viewEmp1])

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

  useEffect(() => {
    setmounted(true)
    getLeadsDataFun(startOfDay(d).getTime(), true, true, true)
  }, [])
  useEffect(() => {
    getUsersDataFun1()
  }, [])
  useEffect(() => {
    if (usersCleanList && usersCleanList.length) showAllEmpTodayActivity()
  }, [usersCleanList])
  const GenerateTasksDailyReportForEmp = async () => {
    // get all the employees based on orgId
    console.log('employee list is ', usersList)
    // const data = []
    // for (const empListD of [
    //   { uid: 'yP5IMRXqByUNYZ6atk5AaJjaoGH3', name: 'RAM PRASAD' },
    // ]) {
    //   const dataUser = await getRestEmpTodayTasksCount(
    //     empListD?.uid,
    //     empListD?.name
    //   )
    //   data.push(dataUser)
    // }
    // return
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
    // const empDempListA = await getEmployeesListDept(orgId, {})
    // await empDempListA.map(async (empDetails) => {
    //   const { uid } = empDetails
    //   if (uid) {
    //     await getRestEmpTodayTasksCount(uid)
    //   } else {
    //     return
    //   }
    // })

    // await console.log('get users list is', empDempListA)
    return
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA1 = await querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        // setusersList(usersListA)
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
        let y = []
        // const projects = await querySnapshot.docs.map(async (docSnapshot) => {
        //   const x = docSnapshot.data()
        //   console.log('git values is 2', x)
        //   const { staDA } = x
        //   y = staDA
        //   if (y.length > 0) {
        //     x.uid = docSnapshot.id
        //     // eslint-disable-next-line prefer-const
        //     let y1 = await getLeadbyId1(orgId, x.uid)
        //     x.leadUser = await y1
        //     return x
        //   }
        // })

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
        //  get the task details from docid
        if (userTodoTasksList.length > 0) {
          // projects.filter((data) => data != undefined)
          // const data = []
          // for (const results of userTodoTasksList) {
          //   console.log('TaskListResults is', results)
          //   results?.filter((data) => data != 'remove')
          //   const dataUser = await filterTodayTodoFun(
          //     results?.filter((data) => data != 'remove'),
          //     empID,
          //     name
          //   )
          //   data.push(dataUser)
          // }
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

  const getUsersDataFun1 = async () => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        // setusersList(usersListA)
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
  // useEffect(() => {
  //   fetchLogsData()
  // }, [])
  // useEffect(() => {
  //   fetchLogsData()
  // }, [sourceDateRange])

  // const fetchLogsData = async () => {
  //   try{
  //   const steamLeadLogs = await steamAllLeadsActivity(
  //     orgId,
  //     'snap',
  //     {
  //       uid: 'VIzMzz5rl0NAywdnpHpb',
  //       cutoffDate: sourceDateRange,
  //     },
  //     (error) => setLeadLogsRawData([])
  //   )
  //   await setLeadLogsRawData(steamLeadLogs)
  //   }catch(err){
  //     setLeadLogsRawData([])
  //   }
  // }
  useEffect(() => {
    if (sourceDateRange) {
      getLeadsDataFun(sourceDateRange, true, false, false)
    }
  }, [sourceDateRange, projectDateRange])
  useEffect(() => {
    if (projectDateRange) {
      getLeadsDataFun(projectDateRange, false, true, false)
    }
  }, [projectDateRange])
  useEffect(() => {
    if (empDateRange) {
      getLeadsDataFun(empDateRange, false, false, true)
    }
  }, [empDateRange])

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
      // viewSource
    }
  }, [sourceListTuned, viewSource])

  useEffect(() => {
    setProjectListTuned(serialProjectLeadData(projectList, leadsFetchedRawData))
  }, [projectList, leadsFetchedRawData])
  useEffect(() => {
    setLeadsLogFilData(serialProjecVisitFixedData(projectList, leadLogsRawData))
  }, [projectList, leadLogsRawData])

  useEffect(() => {
    if (selEmpIsProject?.value === 'allprojects') {
      console.log('leadsFetchedRawData', leadsFetchedRawData)
      setEmployeeListTuned(
        serialEmployeeLeadData(usersList, leadsFetchedRawData)
      )
      setEmpRawFilData(leadsFetchedRawData)
    } else if (selEmpIsProject?.value === 'others') {
      const projectWideA = leadsFetchedRawData.filter(
        (d) => d?.ProjectId === '' || d?.ProjectId === undefined
      )

      setEmployeeListTuned(serialEmployeeLeadData(usersList, projectWideA))

      setEmpRawFilData(projectWideA)
    } else {
      const projectWideA = leadsFetchedRawData.filter(
        (d) => d?.ProjectId === selEmpIsProject?.value
      )

      setEmployeeListTuned(serialEmployeeLeadData(usersList, projectWideA))

      setEmpRawFilData(projectWideA)
    }
  }, [usersList, leadsFetchedRawData, selEmpIsProject])

  const getProjectsListFun = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        // setprojectList(projectsListA)
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.uid
        })
        console.log('fetched users list is project', projectsListA)

        setprojectList([
          ...projectsListA,
          ...[{ label: 'others', value: 'others' }],
        ])
      },
      (error) => setprojectList([])
    )

    return unsubscribe
  }

  const getLeadsDataFun = async (
    dateRange,
    sourceApi,
    projectApi,
    employeeApi
  ) => {
    const { access, uid, orgId } = user

    if (access?.includes('manage_leads')) {
      const unsubscribe = getLeadsByDate(orgId, {
        cutoffDate: dateRange,
      })
      console.log('my Array data is delayer 1 ', unsubscribe)
      await setLeadsFetchedRawData(await unsubscribe)
      if (projectApi) {
        await getProjectsListFun()
      }
      if (employeeApi) {
        await getUsersDataFun()
      }
      if (sourceApi) {
        const y = await serialMyData(
          sourceListItems,
          await unsubscribe,
          'by_source'
        )
        console.log(y, 'dataY')
        await setSourceListTuned(y)
      }
      return unsubscribe
    }
  }
  const getUsersDataFun = async () => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA1 = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        // setusersList(usersListA)
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

  const sourceDropDown = () => {
    return (
      <SlimSelectBox
        name="project"
        label=""
        className="input min-w-[164px]"
        onChange={(value) => {
          console.log('zoro condition changed one  is', value)
          selViewSource(value)
          // formik.setFieldValue('project', value.value)
        }}
        value={viewSource?.value}
        // options={aquaticCreatures}
        options={[
          ...[{ label: 'All Sources', value: 'allsources' }],
          ...sourceListTuned,
        ]}
      />
    )
  }
  const projectDropDown = () => {
    return (
      <SlimSelectBox
        name="project"
        label=""
        className="input min-w-[164px] "
        onChange={(value) => {
          selProjs(value)
        }}
        value={viewProjs?.value}
        options={[
          ...[{ label: 'All Projects', value: 'allprojects' }],
          ...projectList,
        ]}
      />
    )
  }
  const employeeProjectDropDown = () => {
    return (
      <SlimSelectBox
        name="project"
        label=""
        className="input min-w-[164px] "
        onChange={(value) => {
          setSelProjectEmp(value)
        }}
        value={selEmpIsProject?.value}
        options={[
          ...[{ label: 'All Projects', value: 'allprojects' }],
          ...projectList,
          ,
        ]}
      />
    )
  }
  const DateSourceComponent = () => {
    return (
      <SlimDateSelectBox
        onChange={async (value) => {
          console.log(value, 'dateValueSource')
          setSourceDateRange(value)
          //getLeadsDataFun()
        }}
      />
    )
  }
  const DateProjectComponent = () => {
    return (
      <SlimDateSelectBox
        onChange={async (value) => {
          console.log(value, 'dateValueSource')
          setProjectDateRange(value)
          //getLeadsDataFun()
        }}
      />
    )
  }
  const DateEmployeeComponent = () => {
    return (
      <SlimDateSelectBox
        onChange={async (value) => {
          console.log(value, 'dateValueSource')
          setEmpDateRange(value)
          //getLeadsDataFun()
        }}
      />
    )
  }

  const employeeDataDropDown = () => {
    return (
      <SlimSelectBox
        name="project"
        label=""
        className="input min-w-[164px]"
        onChange={(value) => {
          console.log('zoro condition changed one  is', value)
          selEmp1(value)
          // formik.setFieldValue('project', value.value)
        }}
        value={viewEmp1?.value}
        // options={aquaticCreatures}
        options={[
          ...[{ label: 'All Employees', value: 'allemployees' }],
          ...empListTuned,
        ]}
      />
    )
  }

  console.log(empPerDayTasksCountsA, 'empPerDayTasksCountsA')
  useEffect(() => {
    const formattedArr = (data)=> {
      return data.map((data) => {
        return {
          name: data?.label,
          total: data?.Total?.length,
          inprogress: data?.inprogress?.length,
          new: data?.new?.length,
          followup: data?.followup?.length,
          visitfixed: data?.visitfixed?.length,
          visitdone: data?.visitdone?.length,
          neogotiation: data?.negotiation?.length,
          booked: data?.booked?.length,
          notinterested: data?.notinterested?.length,
          dead: data?.dead?.length,
          blocked: data?.blocked?.length,
          junk: data?.junk?.length,
          archieve: data?.archieve?.length,
          others: data?.others?.length,
        }
      })
    }
    if (sourceFiltListTuned.length) {
      const arr = formattedArr(sourceFiltListTuned)
      setFormattedSourceData([...arr])
    }
    if (projectFilList.length) {
      const arr = formattedArr(projectFilList)
      setFormattedProjectData([...arr])
    }
    if(empFiltListTuned.length){
      const arr = formattedArr(empFiltListTuned)
      setFormattedEmployeeData([...arr])
    }

  }, [sourceFiltListTuned, projectFilList, empFiltListTuned])
  console.log(formattedSourceData, 'formattedSourceData')
  const numFormatter = new Intl.NumberFormat('en-US')
  const formattedPieChart = (data) => {
    console.log(data, 'datata')
    let obj = {}
    if (data.length) {
      data.forEach((item) => {
        Object.keys(item).map((key) => {
          if (key !== 'name') {
            if (obj[key]) {
              const value = obj[key]
              obj = { ...obj, [key]: value + item[key] }
            } else {
              obj = { ...obj, [key]: item[key] }
            }
          }
        })
      })
      const arr = Object.keys(obj).map((item) => {
        return {
          type: item,
          value: obj[item],
        }
      })
      console.log(arr, 'arrarr')
      return arr
      // console.log(obj,'formattedPieChart')
      // return [{ ...obj }]
    }
    return []
  }

  // console.log(formattedPieChart())
  return (
    <>
    <div
      className="  z-10"
      style={{
        background: 'rgb(229, 229, 229)',
        position:'sticky',
        top:'0px',
        borderRadius: '15px',
      }}
    >
      <div
        style={{
          padding: '10px',
          paddingLeft: '10px',
          /* padding: 5px; */
          borderBottom: '1px solid gray',
          display: 'flex',
          alignItems: 'center',
          background: 'rgb(69,186,102)',
          justifyContent:"space-between"
        }}
      >
        <div style={{display:"flex", alignItems:"center"}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          style={{color:'white'}}
        >
          <g fill="none" fillRule="evenodd">
            <g fill="currentColor" fillRule="nonzero">
              <g>
                <g>
                  <path
                    d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 1c-4.418 0-8 3.582-8 8 0 .702.09 1.383.26 2.031l2.886-2.885c.196-.195.512-.195.708 0l2.646 2.647 4.793-4.794L13 9c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h3.52l.052.005L16.5 8c.036 0 .071.004.105.011l.046.012.04.015c.014.005.027.012.04.019.013.006.025.013.036.02l.035.025c.014.01.027.02.04.033l.012.011.011.013c.012.012.023.025.033.039l-.044-.052c.026.027.05.056.069.087l.02.034.02.042.014.04c.005.015.009.03.012.046l.006.033.005.051V12c0 .276-.224.5-.5.5s-.5-.224-.5-.5V9.706l-5.146 5.148c-.196.195-.512.195-.708 0L7.5 12.207 4.618 15.09C5.827 17.974 8.677 20 12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8z"
                    transform="translate(-564 -480) translate(528 444) translate(36 36)"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <h1 className="text-2xl font-bold" style={{color:'white'}}>Reports</h1>
        </div>
        <div style={{display:"flex", gap:'10px'}}>
          <button style={{color:'white',padding:'4px', background: btnBackgroundColor.task ? "rgb(53,149,82)" : ""}} onClick={()=>{SetBtnBackgroundColor({task:true, source:false, project:false, employee:false, performance:false})}}><a href="#section-1">Employee vs Tasks</a></button>
          <button style={{color:'white',padding:'4px', background: btnBackgroundColor.source ? "rgb(53,149,82)" : ""}} onClick={()=>{SetBtnBackgroundColor({task:false, source:true, project:false, employee:false, performance:false})}}><a href="#section-2">Source vs Status</a></button>
          <button style={{color:'white', padding:'4px',background: btnBackgroundColor.project ? "rgb(53,149,82)" : ""}} onClick={()=>{SetBtnBackgroundColor({task:false, source:false, project:true, employee:false, performance:false})}}><a href="#section-3">Project vs Status</a></button>
          <button style={{color:'white', padding:'4px',background: btnBackgroundColor.employee ? "rgb(53,149,82)" : ""}} onClick={()=>{SetBtnBackgroundColor({task:false, source:false, project:false, employee:true, performance:false})}}><a href="#section-4">Employee vs Status</a></button>
          <button style={{color:'white', padding:'4px',background: btnBackgroundColor.performance ? "rgb(53,149,82)" : ""}}onClick={()=>{SetBtnBackgroundColor({task:false, source:false, project:false, employee:false, performance:true})}}><a href="#section-5">Visits Performance Counts</a></button>
        </div>
      </div>
      </div>
      {/* <div className="drop-shadow-md  rounded-lg " style={{height:"100vh", width:"33%", background: 'red'}}>Content</div> */}
      <div
        style={{
          width: '100vm',
          height: '100vh',
          overflow: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          gap: '50px',
        }}
      >

        <div
          className="  rounded-lg "
          style={{
            backgroundColor: 'white',
            width: '95vw',
          }}
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <div style={{ display: 'flex' }} className={'dragMe'}>
              <div className=" flex flex-col overscroll-x-scroll p-10 max-w-[100%]">
                <div>
                  <div>
                    <div
                      className="flex m-1 justify-between"
                      style={{
                        position: 'sticky',
                        top: '0px',
                        background: 'white',
                      }}
                      id='section-1'
                    >
                      <div className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 ml-1 mt-4 ">
                        <div className="text-md font-bold leading-none">
                          {`Employee vs Tasks `}
                        </div>
                      </div>

                      <div
                        className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 ml-1 mt-4 ml-4 text-blue cursor-pointer"
                        style={{ gap: '50px' }}
                        onClick={() => {
                          setResettingEmpValues(true)
                          GenerateTasksDailyReportForEmp()
                        }}
                      >
                        Generate Daily Task Report
                      </div>
                    </div>
                    {/* <div className=" text-md font-bold leading-none pl-0 mt-4 border-b pb-4 mb-4 ">
                    {`Employee vs Tasks `}
                  </div>

                  <section className="flex flex-row justify-between mt-[18px]">
                    <section></section>
                    <div className=" flex   ">
                      <div
                        className="ml-4 text-blue cursor-pointer"
                        onClick={() => {
                          setResettingEmpValues(true)
                          GenerateTasksDailyReportForEmp()
                        }}
                      >
                        Generate Daily Task Report
                      </div>

                      {resettingEmpValues && <span>InProgress</span>}
                    </div>
                  </section> */}

                    <div style={{ overflowX: 'scroll' }}>
                      <table className="text-center mt-6">
                        <thead>
                          <tr style={{ background: 'rgb(229,229,229)' }}>
                            {[
                              { label: 'sNo', id: 'no' },
                              { label: 'Name', id: 'name' },
                              { label: 'All', id: 'all' },
                              { label: 'Rnr', id: 'rnr' },
                              { label: 'Busy', id: 'busy' },
                              { label: 'New', id: 'new' },
                              { label: 'Follow Up', id: 'followup' },
                              { label: 'Visit Fixed', id: 'visitfixed' },
                              { label: 'Visit Done', id: 'visitdone' },
                              { label: 'Visit Cancel', id: 'visitCancel' },
                              { label: 'Booked', id: 'booked' },
                              { label: 'Dead', id: 'dead' },
                              { label: 'Blocked', id: 'blocked' },
                              { label: 'Junk', id: 'junk' },

                              { label: 'Negotiations', id: 'negotiation' },
                              { label: 'Others', id: 'others' },
                            ].map((d, i) => (
                              <th
                                key={i}
                                scope="col"
                                style={{
                                  display: employeeTaskColumn.includes(d.id)
                                    ? ''
                                    : 'none',
                                  color:
                                    ['all'].includes(d.id) &&
                                    showEmployeeTaskAllData
                                      ? 'blue'
                                      : 'rgb(146,146,146)',
                                  border: '1px solid rgb(223,223,223)',
                                }}
                                className={`text-sm font-medium text-gray-900 px-6 py-4 ${
                                  ['name'].includes(d.label) ? 'text-left' : ''
                                }`}
                                onClick={() => {
                                  if (['all'].includes(d.id))
                                    showColumnsEmployeeTaskFun()
                                }}
                              >
                                <div style={{ display: 'flex' }}>
                                  {d.label}
                                  {d.id === 'all' ? (
                                    !showEmployeeTaskAllData ? (
                                      <ChevronDoubleRightIcon
                                        className="w-4 h-5 inline"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ChevronDoubleLeftIcon
                                        className="w-4 h-5 inline"
                                        aria-hidden="true"
                                      />
                                    )
                                  ) : null}
                                </div>
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
                                <td
                                  className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {i + 1}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.emp}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.all_comp || 0}/{data?.all || 0}
                                </td>

                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.rnr || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.busy || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.new_comp || 0}/{data?.new || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.followup_comp || 0}/
                                  {data?.followup || 0}
                                </td>

                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.visitfixed_comp || 0}/{' '}
                                  {data?.visitfixed || 0}
                                </td>
                                {showEmployeeTaskAllData && (
                                  <>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.visitdone_comp || 0}/{' '}
                                      {data?.visitdone || 0}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.visitCancel_comp || 0}/{' '}
                                      {data?.visitCancel || 0}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.booked_comp || 0}/{' '}
                                      {data?.booked || 0}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.dead_comp || 0}/ {data?.dead || 0}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.blocked_comp || 0}/{' '}
                                      {data?.blocked || 0}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.junk_comp || 0}/ {data?.junk || 0}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.negotiation_comp || 0}/
                                      {data?.negotiation || 0}
                                    </td>
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                      style={{
                                        border: '1px solid rgb(231,231,231)',
                                      }}
                                    >
                                      {data?.others_comp || 0}/{' '}
                                      {data?.others || 0}
                                    </td>
                                  </>
                                )}
                              </tr>
                            )
                          })}

                          <tr className="border-b bg-gray-800 boder-gray-900">
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                              Total
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {/* {Object.keys(empTaskListTuned.Total).length
                            empTaskListTuned.reduce((a, b) => {
                              return a.Total + b.Total
                            }).length
                          } */}
                              {/* {empTaskListTuned.reduce(
                            (previousValue, currentValue) =>
                              previousValue.Total + currentValue.Total,
                            0
                          )} */}
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
                            {showEmployeeTaskAllData && (
                              <>
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
                              </>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="  rounded-lg "
          style={{
            backgroundColor: 'white',
            width: '95vw',
          }}
          id='section-2'
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <ReportCard
              title="Source Vs Status"
              headers={[
                { label: 'Source', id: 'label' },
                { label: 'Percentage', id: 'percentage' },
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
              ]}
              showColumnsSourceFun={showColumnsSourceFun}
              sourceDropDown={sourceDropDown}
              data={calculatePercentage(sourceFiltListTuned)}
              showInproFSource={showInproFSource}
              showArchiFSource={showArchiFSource}
              viewSourceStats1A={viewSourceStats1A}
              DateComponent={DateSourceComponent}
              id="test"
              chartOpen = {btnChartDisplay.source}
              chartOpenfn = {()=> {SetBtnChartDisplay({...btnChartDisplay, source:!btnChartDisplay.source})}}
              lineChartData = {formattedSourceData}
              pieChartdata={formattedPieChart(
                formattedSourceData
              )}
              barData1={sourceFiltListTuned.map((data) => {
                return {
                  name: data?.label,
                  total: data?.Total?.length,
                  inprogress: data?.inprogress?.length,
                  new: data?.new?.length,
                  followup: data?.followup?.length,
                  visitfixed: data?.visitfixed?.length,
                  visitdone: data?.visitdone?.length,
                  neogotiation: data?.negotiation?.length,
                  booked: data?.booked?.length,
                  notinterested: data?.notinterested?.length,
                  dead: data?.dead?.length,
                  blocked: data?.blocked?.length,
                  junk: data?.junk?.length,
                  archieve: data?.archieve?.length,
                  others: data?.others?.length,
                }
              })}
              seriresData1={[
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
              ].map((item) => {
                return {
                  type: 'column',
                  xKey: 'name',
                  yKey: item.id,
                  stacked: true,
                  yName: item.label,
                  tooltip: {
                    renderer: ({ title, xValue, yValue }) => ({
                      title,
                      content: `${xValue}: ${numFormatter.format(yValue)}`,
                    }),
                  },
                }
              })}
            />
          </div>
        </div>
        <div
          className=" rounded-lg "
          style={{
            backgroundColor: 'white',
            width: '95vw',
          }}
          id='section-3'
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <ReportCard
              title="Project vs Status"
              headers={[
                { label: 'Source', id: 'label' },
                { label: 'Percentage', id: 'percentage' },
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
              ]}
              showColumnsSourceFun={showColumnsProjectFun}
              sourceDropDown={projectDropDown}
              data={calculatePercentage(projectFilList)}
              showInproFSource={showInproFProject}
              showArchiFSource={showArchiFProject}
              viewSourceStats1A={viewProjectStats1A}
              DateComponent={DateProjectComponent}
              id="test1"
              chartOpen = {btnChartDisplay.project}
              chartOpenfn = {()=> {SetBtnChartDisplay({...btnChartDisplay, project:!btnChartDisplay.project})}}
              lineChartData = {formattedProjectData}
              pieChartdata={formattedPieChart(
                formattedProjectData
              )}
              barData1={projectFilList.map((data) => {
                return {
                  name: data?.label,
                  total: data?.Total?.length,
                  inprogress: data?.inprogress?.length,
                  new: data?.new?.length,
                  followup: data?.followup?.length,
                  visitfixed: data?.visitfixed?.length,
                  visitdone: data?.visitdone?.length,
                  neogotiation: data?.negotiation?.length,
                  booked: data?.booked?.length,
                  notinterested: data?.notinterested?.length,
                  dead: data?.dead?.length,
                  blocked: data?.blocked?.length,
                  junk: data?.junk?.length,
                  archieve: data?.archieve?.length,
                  others: data?.others?.length,
                }
              })}
              seriresData1={[
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
              ].map((item) => {
                return {
                  type: 'column',
                  xKey: 'name',
                  yKey: item.id,
                  stacked: true,
                  yName: item.label,
                  tooltip: {
                    renderer: ({ title, xValue, yValue }) => ({
                      title,
                      content: `${xValue}: ${numFormatter.format(yValue)}`,
                    }),
                  },
                }
              })}
            />
          </div>
        </div>

        <div
          className="drop-shadow-md  rounded-lg "
          style={{
            backgroundColor: 'white',
            width: '95vw',
          }}
          id='section-4'
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <ReportCard
              title="Employee vs Status"
              headers={[
                { label: 'Source', id: 'label' },
                { label: 'Percentage', id: 'percentage' },
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
              ]}
              showColumnsSourceFun={showColumnsEmployeeFun}
              sourceDropDown={employeeProjectDropDown}
              data={calculatePercentage(empFiltListTuned)}
              showInproFSource={showInproFEmployee}
              showArchiFSource={showArchiFEmployee}
              viewSourceStats1A={viewEmployeeStats1A}
              DateComponent={DateEmployeeComponent}
              employeeDataDropDown={employeeDataDropDown}
              chartOpen = {btnChartDisplay.employee}
              chartOpenfn = {()=> {SetBtnChartDisplay({...btnChartDisplay, employee:!btnChartDisplay.employee})}}
              lineChartData = {formattedEmployeeData}
              pieChartdata={formattedPieChart(
                formattedEmployeeData
              )}
              barData1={empFiltListTuned.map((data) => {
                return {
                  name: data?.label,
                  total: data?.Total?.length,
                  inprogress: data?.inprogress?.length,
                  new: data?.new?.length,
                  followup: data?.followup?.length,
                  visitfixed: data?.visitfixed?.length,
                  visitdone: data?.visitdone?.length,
                  neogotiation: data?.negotiation?.length,
                  booked: data?.booked?.length,
                  notinterested: data?.notinterested?.length,
                  dead: data?.dead?.length,
                  blocked: data?.blocked?.length,
                  junk: data?.junk?.length,
                  archieve: data?.archieve?.length,
                  others: data?.others?.length,
                }
              })}
              seriresData1={[
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
              ].map((item) => {
                return {
                  type: 'column',
                  xKey: 'name',
                  yKey: item.id,
                  stacked: true,
                  yName: item.label,
                  tooltip: {
                    renderer: ({ title, xValue, yValue }) => ({
                      title,
                      content: `${xValue}: ${numFormatter.format(yValue)}`,
                    }),
                  },
                }
              })}
            />
          </div>
        </div>
        <div
          className="drop-shadow-md  rounded-lg "
          style={{
            backgroundColor: 'white',
            width: '95vw',
          }}
          id='section-5'
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <ReportCard
              title="Visits Performance Counts"
              headers={[
                { label: 'Source', id: 'label' },
                { label: 'Percentage', id: 'percentage' },
                { label: 'Total Visit Fixed', id: 'total' },
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
              ]}
              showColumnsSourceFun={showColumnsProjectFun}
              sourceDropDown={projectDropDown}
              data={calculatePercentage(projectFilList)}
              showInproFSource={showInproFProject}
              showArchiFSource={showArchiFProject}
              viewSourceStats1A={viewProjectStats1A}
              DateComponent={DateProjectComponent}
              chartOpen = {btnChartDisplay.project}
              chartOpenfn = {()=> {SetBtnChartDisplay({...btnChartDisplay, project:!btnChartDisplay.project})}}
              lineChartData = {formattedProjectData}
              pieChartdata={formattedPieChart(
                formattedProjectData
              )}
              barData1={projectFilList.map((data) => {
                return {
                  name: data?.label,
                  total: data?.Total?.length,
                  inprogress: data?.inprogress?.length,
                  new: data?.new?.length,
                  followup: data?.followup?.length,
                  visitfixed: data?.visitfixed?.length,
                  visitdone: data?.visitdone?.length,
                  neogotiation: data?.negotiation?.length,
                  booked: data?.booked?.length,
                  notinterested: data?.notinterested?.length,
                  dead: data?.dead?.length,
                  blocked: data?.blocked?.length,
                  junk: data?.junk?.length,
                  archieve: data?.archieve?.length,
                  others: data?.others?.length,
                }
              })}
              seriresData1={[
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
              ].map((item) => {
                return {
                  type: 'column',
                  xKey: 'name',
                  yKey: item.id,
                  stacked: true,
                  yName: item.label,
                  tooltip: {
                    renderer: ({ title, xValue, yValue }) => ({
                      title,
                      content: `${xValue}: ${numFormatter.format(yValue)}`,
                    }),
                  },
                }
              })}
            />
          </div>
        </div>
      </div>

    </>
  )
}
