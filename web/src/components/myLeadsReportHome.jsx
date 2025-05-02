// import { useState } from 'react'
// import ProjectStatsCard from '../ProjectStatsCard/ProjectStatsCard'
// import PhaseDetailsCard from '../PhaseDetailsCard/PhaseDetailsCard'
import { useEffect, useState } from 'react'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
import { startOfWeek, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

import { sourceListItems } from 'src/constants/projects'
import { USER_ROLES } from 'src/constants/userRoles'
import {
  getAllProjects,
  getMyLeadsByDate,
  getTodayTodoLeadsDataByUser,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import { serialMyData } from './LeadsTeamReport/SourceLeads'
import { serialEmployeeLeadData } from './LeadsTeamReport/serialEmployeeLeadData'

const valueFeedData = [
  { k: 'Due', v: 300, pic: '' },
  { k: 'Pending', v: 100, pic: '' },
  { k: 'Completed', v: 25, pic: '' },
  { k: 'Total', v: 50, pic: '' },
]

const MyLeadsReportHome = ({ project, onSliderOpen = () => {}, isEdit }) => {
  const { area, builderName, location, projectName, projectType } = project
  const d = new window.Date()
  const torrowDate = new Date(
    +new Date().setHours(0, 0, 0, 0) + 86400000
  ).getTime()
  const todayDate = new Date(+new Date().setHours(0, 0, 0, 0)).getTime()
  const { user } = useAuth()
  const { orgId, access, uid } = user
  const [showInproFSource, setShowInproFSource] = useState(false)
  const [dateRange, setDateRange] = React.useState([null, null])
  const [isOpened, setIsOpened] = React.useState(false)
  const [startDate, endDate] = dateRange
  const [showArchiFSource, setShowArchiFSource] = useState(false)
  const [sourceDateRange, setSourceDateRange] = React.useState(
    startOfDay(d).getTime()
  )
  const [schFetCleanData, setSchFetCleanData] = useState([])
  const [searchKey, setSearchKey] = useState(['pending'])
  const [schFetData, setSchFetData] = React.useState([])
  const [selLeadsOf, setSelLeadsOf] = useState({
    label: 'My Tasks Leads',
    value: 'mytasks',
  })
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [todaySch, setTodaySchL] = useState([])
  const [dueTasksList, setDueTasksList] = useState([])
  const [pendTasksList, setPendTasksList] = useState([])

  const [compTasksList, setCompTasksList] = useState([])

  const [totalTasksList, setTotalTasksList] = useState([])

  const [empListTuned, setEmployeeListTuned] = useState([])
  const [empFiltListTuned, setFiltEmployeeListTuned] = useState([])
  const [projectList, setprojectList] = useState([])
  const [projectFilList, setFiltProjectListTuned] = useState([])
  const [EmpDownloadRows, setEmpDownloadRows] = React.useState([])
  const [leadsFetchedRawData, setLeadsFetchedRawData] = useState([])
  const [sourceListTuned, setSourceListTuned] = useState([])
  const [viewProjs, selProjs] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })

  const [viewSourceStats1A, SetViewSourceStats1A] = useState([
    'label',
    'total',
    'inprogress',
    'booked',
    'archieve',
    'others',
  ])

  function demoOnClick(e) {
    console.log(e.name)
  }
  useEffect(() => {
    fetchTasksCount()
    getProjectsListFun()
    getLeadsDataFun()
  }, [])
  React.useEffect(() => {
    if (todaySch) {
      console.log('zoro i s', todaySch)
      sorterFilterFun(todaySch)
    } else {
      console.log('my value is ', todaySch)
    }
  }, [todaySch, searchKey, selLeadsOf, selProjectIs])

  useEffect(() => {
    getLeadsDataFun()
  }, [sourceDateRange])

  useEffect(() => {
    setFiltEmployeeListTuned(empListTuned)
  }, [empListTuned])

  useEffect(() => {
    if (viewProjs?.value == 'allprojects') {
      setFiltProjectListTuned(projectList)
    } else {
      const z = projectList.filter((da) => {
        return da.value == viewProjs?.value
      })
      setFiltProjectListTuned(z)
      // viewSource
    }
  }, [projectList, viewProjs])
  const fetchTasksCount = async () => {
    {
      const todoData = await getTodayTodoLeadsDataByUser(
        orgId,
        (querySnapshot) => {
          let pro
          let y = []
          setTodaySchL([])
          console.log('git values is 2', querySnapshot.docs)
          const projects = querySnapshot.docs.map(async (docSnapshot) => {
            const x = docSnapshot.data()
            const { staDA } = x

            // if ('Today' == 'Today1') {

            //   y = staDA
            // } else {
            //   y = staDA.filter((da) => x[da]['schTime'] > torrowDate)
            // }
            // y = staDA.filter((da) => x[da]['schTime'] > torrowDate)
            y = staDA

            if (y.length > 0) {
              x.uid = docSnapshot.id

              return x
            } else {
              return 'remove'
            }
          })
          //  get the task details from docid
          if (projects.length > 0) {
            projects.filter((data) => data != undefined)
            Promise.all(projects).then(function (results) {
              console.log(
                'my values are ',
                results.filter((data) => data != 'remove')
              )
              results.filter((data) => data != 'remove')
              setTodaySchL(results.filter((data) => data != 'remove'))
            })
          } else {
            console.log('my values are 1 ', projects)
          }
        },
        { uid: uid, type: 'today' },
        () => {
          console.log('error')
        }
      )
      await console.log('what are we', todoData)
    }
  }
  const getLeadsDataFun = async () => {
    startOfWeek(d)
    console.log('date is ==>', d, subMonths(startOfMonth(d), 6).getTime())
    const { uid, displayName, orgId } = user

    const unsubscribe = getMyLeadsByDate(orgId, {
      cutoffDate: sourceDateRange,
      uid: uid,
      isCp: user?.role?.includes(USER_ROLES.CP_AGENT),
    })
    console.log('my Array data is delayer 1 ', unsubscribe)
    await setLeadsFetchedRawData(await unsubscribe)
    await getProjectsListFun()

    const y = await serialMyData(
      sourceListItems,
      await unsubscribe,
      'by_source'
    )
    const z = await setEmployeeListTuned(
      serialEmployeeLeadData(
        [{ label: displayName, name: displayName, value: uid }],
        await unsubscribe
      )
    )

    await setSourceListTuned(y)
    await console.log('whati is the data ', y, z)
    return unsubscribe
  }
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

  const sorterFilterFun = async (todaySch) => {
    console.log('max check it my value is ', todaySch)
    const streamedTodo = []
    const dueTodo = []

    const pendTodo = []

    const compTodo = []

    let y = []

    const z = todaySch.map((data1) => {
      console.log('master log ===>')
      data1['staDA'].map((data2) => {
        const y = data1[data2]

        if (
          y['sts'] === 'pending' &&
          y['assTo'] != undefined &&
          y['schTime'] < torrowDate &&
          y['schTime'] >= todayDate
        ) {
          y.uid = data1.uid
          y.id = data1.uid
          y.leadUser = data1.leadUser
          streamedTodo.push(y)
          pendTodo.push(y)
          return y
        }

        if (
          y['sts'] === 'pending' &&
          y['assTo'] != undefined &&
          y['schTime'] < todayDate
        ) {
          y.uid = data1.uid
          y.id = data1.uid
          y.leadUser = data1.leadUser
          streamedTodo.push(y)
          dueTodo.push(y)
          return y
        }

        if (
          y['sts'] === 'completed' &&
          y['comT'] > todayDate &&
          y['comT'] < torrowDate
        ) {
          y.uid = data1.uid
          y.id = data1.uid
          y.leadUser = data1.leadUser
          streamedTodo.push(y)
          compTodo.push(y)
          console.log('my value is 1 yo i comp', y)
          return y
        }

        console.log('my value is 1 ', y)
        return y
      })
    })

    setSchFetCleanData(streamedTodo)
    setDueTasksList(dueTodo)
    setPendTasksList(pendTodo)
    setCompTasksList(compTodo)
    setTotalTasksList(streamedTodo)

    console.log(
      'my value is 1 ===',
      streamedTodo,
      dueTasksList,
      setPendTasksList
    )
  }

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

  return (
    <div>
      <section className="py-8 mb-8 leading-7 mt-1 mx-1 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-18 rounded-lg">
        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
          <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
            <div className="flex items-center flex-shrink-0  px-0  pl-0 border-b border-grey  mb-2">
              <img className="w-16 h-16" alt="" src="/apart.svg"></img>
              <span className="relative z-10 flex items-center w-auto text-4xl font-bold leading-none pl-0 mt-[18px]">
                {projectName}
              </span>
            </div>
            <div className=" mt-10 grid grid-cols-1 gap-7">
              <span className="min-w-100 ">
                <span>
                  <div
                    className="drop-shadow-md min-w-full z-10 flex flex-col  max-w-md p-4 mx-auto my-0 rounded-lg "
                    style={{ backgroundColor: '#fef7f7' }}
                  >
                    <div className="flex items-center flex-row px-0  pl-0 mb-2 ">
                      <div className="relative z-10 flex items-center w-auto text-md font-bold leading-none pl-0 ml-1 mt-4 ">
                        {`Task Stats of ${user.displayName} for Today`}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-0">
                      <ul className="flex-1 p-0 mt-8 ml-2 mr-2 max-w-[300px] border-r pr-10  border-slate-400 leading-7 text-gray-900  border-gray-200">
                        {[
                          { k: 'Due', v: dueTasksList.length, pic: '' },
                          { k: 'Pending', v: pendTasksList.length, pic: '' },
                          { k: 'Completed', v: compTasksList.length, pic: '' },
                          { k: 'Total', v: totalTasksList.length, pic: '' },
                        ].map((data, i) => {
                          return (
                            <li
                              key={i}
                              className="flex justify-between px-4 py-1 w-full mb-2  font-semibold text-left border-dotted border-b border-gray-300 "
                            >
                              <span className="inline-flex">
                                <span className="text-[16px] text-gray-900 font-light  text-gray-900">
                                  {' '}
                                  {data.k}
                                </span>
                              </span>

                              <div
                                className="relative flex flex-col items-center group"
                                style={{ alignItems: 'end' }}
                              >
                                <div
                                  className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex"
                                  style={{ alignItems: 'end', width: '300px' }}
                                >
                                  <span
                                    className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                    style={{
                                      color: 'black',
                                      background: '#e2c062',
                                      maxWidth: '300px',
                                    }}
                                  ></span>
                                  <div
                                    className="w-3 h-3  -mt-2 rotate-45 bg-black"
                                    style={{
                                      background: '#e2c062',
                                      marginRight: '12px',
                                    }}
                                  ></div>
                                </div>
                                <span className="text-[16px] font-medium text-gray-900">
                                  {data.v.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </li>
                          )
                        })}
                      </ul>

                      <section
                        className=" mt-[40px]"
                        style={{ marginLeft: '-220px' }}
                      >
                        <BarChart
                          width={600}
                          height={300}
                          data={[
                            {
                              name: 'Due',
                              count: dueTasksList.length,
                              pv: 9800,
                              amt: 2290,
                            },
                            {
                              name: 'Pending',
                              count: pendTasksList.length,
                              pv: 1398,
                              amt: 2210,
                            },
                            {
                              name: 'Completed',
                              count: compTasksList.length,
                              pv: 9800,
                              amt: 2290,
                            },
                          ]}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 0,
                            bottom: 5,
                          }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="count"
                            barSize={40}
                            fill="#97E3D5"
                            onClick={demoOnClick}
                          />
                        </BarChart>
                      </section>
                    </div>
                  </div>
                </span>
              </span>
            </div>
            <div
              className="flex flex-col  mt-14 drop-shadow-md rounded-lg  px-4"
              style={{ backgroundColor: '#ebfafa' }}
            >
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <div className=" text-md font-bold leading-none pl-0 mt-4 border-b pb-4 mb-4 ">
                      {`My Leads Stats`}
                    </div>

                    <table className="min-w-full text-center mt-6">
                      <thead className="border-b">
                        <tr>
                          {[
                            { label: 'Name', id: 'label' },
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
                                ['Name'].includes(d.label) ? 'text-left' : ''
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
                        {empListTuned.map((data, i) => {
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col  mt-14 drop-shadow-md rounded-lg  px-4"
              style={{ backgroundColor: '#ebfafa' }}
            >
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <div className=" text-md font-bold leading-none pl-0 mt-4 border-b pb-4 mb-4 ">
                      {`Source vs My Status `}
                    </div>

                    <table className="min-w-full text-center mt-6">
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
                        {sourceListTuned.map((data, i) => {
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MyLeadsReportHome
