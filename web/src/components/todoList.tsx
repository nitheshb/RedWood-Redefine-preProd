/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import { PaperClipIcon, UsersIcon } from '@heroicons/react/solid'
import { Box } from '@mui/material'
import { Checkbox } from '@mui/material'
import { startOfDay } from 'date-fns'
import { useTranslation } from 'react-i18next'
import {
  streamGetAllTaskManTasks,
  streamGetAllParticipantTasks,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { supabase } from 'src/context/supabase'
import CSVDownloader from 'src/util/csvDownload'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  prettyDateTime,
} from 'src/util/dateConverter'
import {
  SlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'
import SiderForm from './SiderForm/SiderForm'

const torrowDate = new Date(
  +new Date().setHours(0, 0, 0, 0) + 86400000
).getTime()

const TodoListView = ({
  moduleName,
  taskListA,
  setisImportLeadsOpen,
  selUserProfileF,
  selTaskManObjF,
  leadsFetchedData,
  leadsTyper,
  leadByViewLayout,
  setLeadByViewLayout,
  searchKey,
  setSearchKey,
}) => {
  // change navbar title
  // useTitle('Data Table V1')
  const d = new window.Date()

  const { t } = useTranslation()
  const [value, setValue] = useState('new')
  const { user } = useAuth()
  const [tableData, setTableData] = useState([])
  const [businessData_F, setBusinessData_F] = useState([])
  const [businessSection_D, setBusinessSection_D] = useState([])
  const [businessData_Filtered, setBusinessData_Filtered] = useState([])
  const [showSettings, setShowSettings] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [selPriority, setSelPriority] = useState('')
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [showOnlyDone, setShowOnlyDone] = useState(false)

  const [sourceDateRange, setSourceDateRange] = useState(
    startOfDay(d).getTime()
  )

  const [personalData_F, setPersonalData_F] = useState([])
  const [personalData_D, setPersonalData_D] = useState([])
  const [ParticipantsData_D, setParticipantsData_D] = useState([])
  const [tabHeadFieldsA, settabHeadFieldsA] = useState([])
  const [isImportLeadsOpen1, setisImportLeadsOpen1] = useState(false)
  const [isClicked, setisClicked] = useState('dept_tasks')
  const [subSection, setSubSection] = useState('all_business')
  const [sortType, setSortType] = useState('Latest')
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  // const [leadsFetchedData, setLeadsFetchedData] = useState([])
  useEffect(() => {
    getTasksDataFun()
  }, [showCompletedTasks, showOnlyDone])

  useEffect(() => {
    getTasksDataFun()

    // Subscribe to real-time changes in the `${user?.orgId}_accounts` table
    const channel = supabase
    .channel('maahomes-tasks-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'maahomes_TM_Tasks',
      },
      (payload) => {
      // .on('*', (payload) => {
        // When a change occurs, update the 'leadLogs' state with the latest data
        console.log('account records', payload)
        // Check if the updated data has the id 12
        const updatedData = payload.new
        // const oldData = payload.old
        const { id } = payload.old
        const eventType = payload.eventType
        const updatedLeadLogs = [...businessData_F]
        if (
          updatedData.by_uid === user?.uid ||
          updatedData?.to_uid === user?.uid ||
          updatedData?.followersUid.includes(user?.uid)
        ) {
          if (
            updatedData.by_uid === user?.uid &&
            updatedData.to_uid === user?.uid
          ) {
            setPersonalData_F((prevLogs) => {
              const existingLog = prevLogs.find((log) => log.id === id)

              if (existingLog) {
                console.log('Existing record found!')
                if (payload.new.status === 'Done') {
                  const updatedLogs = prevLogs.filter((log) => log.id != id)
                  return [...updatedLogs]
                } else {
                  const updatedLogs = prevLogs.map((log) =>
                    log.id === id ? payload.new : log
                  )
                  return [...updatedLogs]
                }
              } else {
                console.log('New record added!')
                return [payload.new,...prevLogs]
              }
            })
          } else if (updatedData?.followersUid.includes(user?.uid)) {
            setParticipantsData_D((prevLogs) => {
              const existingLog = prevLogs.find((log) => log.id === id)
              if (existingLog) {
                console.log('Existing record found!')
                if (payload.new.status === 'Done') {
                  const updatedLogs = prevLogs.filter((log) => log.id != id)
                  return [...updatedLogs]
                } else {
                  const updatedLogs = prevLogs.map((log) =>
                    log.id === id ? payload.new : log
                  )
                  return [...updatedLogs]
                }
              } else {
                console.log('New record added!')
                return [payload.new,...prevLogs]
              }
            })
          }

          else {
            if (
              updatedData.by_uid === user?.uid ||
              updatedData?.to_uid === user?.uid
            ) {
              setBusinessData_F((prevLogs) => {
                const existingLog = prevLogs.find((log) => log.id === id)

                if (existingLog) {
                  console.log('Existing record found!')
                  if (payload.new.status === 'Done') {
                    const updatedLogs = prevLogs.filter((log) => log.id != id)
                    return [...updatedLogs]
                  } else {
                    const updatedLogs = prevLogs.map((log) =>
                      log.id === id ? payload.new : log
                    )
                    return [...updatedLogs]
                  }
                } else {
                  console.log('New record added!')
                  return [payload.new,...prevLogs]
                }
              })
            }
          }
        }
      })
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  useEffect(() => {
    // first

    // return () => {
    //   second
    // }

    console.log('is my value changed, sortType', sortType, searchText)

    if (subSection == 'all_business') {
      const x = businessData_F.filter(
        (d) =>
          d.priority?.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setBusinessSection_D(x)
      bootBusinessFun(x)
    } else if (subSection == 'assigned_to_me') {
      const x = businessData_F.filter(
        (d) =>
          d.by_uid != user?.uid &&
          d.to_uid === user?.uid &&
          d.priority?.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setBusinessSection_D(x)
      bootBusinessFun(x)
    } else if (subSection == 'created_by_me') {
      const x = businessData_F.filter(
        (d) =>
          d.by_uid === user?.uid &&
          d.to_uid != user?.uid &&
          d.priority?.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setBusinessSection_D(x)
      bootBusinessFun(x)
    } else if (subSection == 'participants') {
      // const x = businessData_F.filter(
      //   (d) =>
      //     d.priority.toLowerCase().includes(selPriority.toLowerCase()) &&
      //     d.title?.toLowerCase().includes(searchText.toLowerCase())
      // )
      setParticipantsData_D(ParticipantsData_D)
      bootBusinessFun(ParticipantsData_D)
    }

    if(selPriority != '' || searchText != ''){
      console.log('is clicked ==>');
      setShowSettings(false)
    }
  }, [
    businessData_F,
    ParticipantsData_D,
    subSection,
    isClicked,
    sortType,
    searchText,
    selPriority,
  ])

  const sortDataFun = (data) => {
    if (sortType === 'Oldest') {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return a.due_date - b.due_date
      })
      setBusinessSection_D(x)
    } else {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return b.due_date - a.due_date
      })
      setBusinessSection_D(x)
    }
  }

  const sortPersonalDataFun = (data) => {
    console.log('personal data is ', sortType)
    if (sortType === 'Oldest') {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return a.due_date - b.due_date
      })
      setPersonalData_D(x)
    } else {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return b.due_date - a.due_date
      })
      setPersonalData_D(x)
    }
  }

  const sortParticipantsDataFun = (data) => {
    console.log('personal data is ', sortType)
    if (sortType === 'Oldest') {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return a.due_date - b.due_date
      })
      setParticipantsData_D(x)
    } else {
      console.log('ami here', sortType)
      const x = data.sort((a, b) => {
        return b.due_date - a.due_date
      })
      setParticipantsData_D(x)
    }
  }

  useEffect(() => {
    // bootBusinessFun()
  }, [businessSection_D, sortType, subSection])

  const bootBusinessFun = async (x) => {
    sortDataFun(x)
  }

  const handleSortDrop = (e) => {
    setSortType(e.target.value)
  }

  const getTasksDataFun = async () => {
    console.log('login role detials', user)
    const { uid } = user

    const steamLeadLogs = await streamGetAllTaskManTasks(
      user?.orgId,
      'snap',
      {
        uid,
        statusVAl: showCompletedTasks,
        showOnlyDone: showOnlyDone,
      },
      (error) => []
    )
    const steamParticipantLogs = await streamGetAllParticipantTasks(
      user?.orgId,
      'snap',
      {
        uid,
        statusVAl: showCompletedTasks,
        showOnlyDone: showOnlyDone,
      },
      (error) => []
    )

    const x = await steamLeadLogs.filter(
      (d) =>
        d.by_uid === user?.uid &&
        d.to_uid === user?.uid &&
        d.title?.toLowerCase().includes(searchText.toLowerCase())
    )
    await setPersonalData_F(x)
    const y = await steamLeadLogs.filter(
      (d) =>
        (d.by_uid != user?.uid && d.to_uid === user?.uid) ||
        (d.by_uid === user?.uid && d.to_uid != user?.uid)
    )

    const z = await steamParticipantLogs

    await console.log('z o is ', z)
    await setBusinessData_F(y)
    await sortDataFun(y)
    await sortPersonalDataFun(x)
    await sortParticipantsDataFun(z)
    return
  }

  useEffect(() => {
    console.log('is clicked', isClicked, selPriority)
    if (isClicked === 'personal_tasks') {
      const x = personalData_F.filter(
        (d) =>
          d.by_uid === user?.uid &&
          d.to_uid === user?.uid &&
          d.priority.toLowerCase().includes(selPriority.toLowerCase()) &&
          d.title?.toLowerCase().includes(searchText.toLowerCase())
      )
      setPersonalData_D(x)
      sortPersonalDataFun(x)
      if(selPriority != '' || searchText != ''){
        console.log('is clicked ==>');
        setShowSettings(false)
      }
    } else if (isClicked === 'dept_tasks') {
      setShowSettings(true)

    }
  }, [isClicked, searchText, sortType, selPriority, personalData_F])

  const handleFilterClearFun = async () => {
    setSelPriority('')
    setSearchText('')
  }

  const filterTable = tableData.filter((item) =>
    value !== '' ? item.role.toLowerCase() === value : item.role
  )

  const openingTaskAddWindow = () => {
    console.log('i was clicked')
    setisImportLeadsOpen1(true)
  }
  const archieveTab = [
    { lab: 'Archieve', val: 'all' },
    { lab: 'Dead', val: 'dead' },
    { lab: 'Not Interested', val: 'notinterested' },
    { lab: 'Blocked', val: 'blockded' },
  ]
  const financeTab = [
    { lab: 'All', val: 'all' },
    { lab: 'In Review', val: 'inReview' },
    { lab: 'Cleared', val: 'cleared' },
    { lab: 'Uncleared', val: 'uncleared' },
  ]
  const changeFun = () => {
    setShowCompletedTasks(!showCompletedTasks)
    setShowOnlyDone(false)
  }

  return (
    <>
      <div className="mb-4 font-sanF">
        <div className=" w-full font-sanF">
          <div className="bg-white py-4 md:py-7 px-4 md:px-4 xl:px-6 rounded-lg">
            <div className="flex flex-row justify-between border-gray-200 border-b">
              <ul
                className="flex w-full  rounded-t-lg  mx-"
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                {[
                  { lab: `${moduleName} Tasks `, val: 'dept_tasks' },
                  { lab: 'Business Tasks', val: 'business_tasks' },
                  { lab: 'Personal', val: 'personal_tasks' },
                ].map((d, i) => {
                  return (
                    <li key={i} className=" mr-4" role="presentation">
                      <button
                        className={`inline-block pb-[6px] mr-3 text-sm font-medium text-center text-black rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${
                          isClicked === d.val
                            ? 'border-black'
                            : 'border-transparent'
                        }`}
                        type="button"
                        role="tab"
                        onClick={() => setisClicked(d.val)}
                      >
                        <section className="flex flex-row text-[15px] h-[24px]  mb-0">
                          {' '}

                          {/* 🏆 */}
                          {d.val === 'dept_tasks' && (
                            <>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 15 15"
                                className="fill-current mt-[4px] mr-1 text-purple-500"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M14.1755 7.88376L11.9493 9.56253L12.7948 12.266C12.9314 12.6853 12.9331 13.1389 12.7997 13.5593C12.6663 13.9797 12.4049 14.3444 12.0544 14.5988C11.7099 14.8615 11.2925 15.0022 10.8643 15C10.436 14.9978 10.02 14.8528 9.67807 14.5866L7.50125 12.9323L5.3238 14.5846C4.97996 14.8458 4.56476 14.9876 4.13792 14.9898C3.71108 14.9919 3.29457 14.8542 2.94827 14.5966C2.60197 14.3389 2.34373 13.9745 2.21066 13.5557C2.0776 13.1369 2.07657 12.6854 2.20772 12.266L3.05318 9.56253L0.826957 7.88376C0.483556 7.62452 0.22828 7.25987 0.0975914 6.84188C-0.0330973 6.4239 -0.0325136 5.97396 0.0992584 5.55633C0.23103 5.13871 0.487251 4.77476 0.831323 4.51648C1.17539 4.25819 1.58972 4.11878 2.01511 4.11815H4.74974L5.57957 1.44762C5.71006 1.02726 5.96649 0.660548 6.31187 0.400372C6.65724 0.140196 7.07372 0 7.50125 0C7.92878 0 8.34526 0.140196 8.69064 0.400372C9.03601 0.660548 9.29244 1.02726 9.42293 1.44762L10.2528 4.11815H12.9849C13.4103 4.11878 13.8246 4.25819 14.1687 4.51648C14.5127 4.77476 14.769 5.13871 14.9007 5.55633C15.0325 5.97396 15.0331 6.4239 14.9024 6.84188C14.7717 7.25987 14.5164 7.62452 14.173 7.88376H14.1755Z"></path>
                              </svg>

                             <span className='mt-[1px]'> {`${d.lab} `}</span>
                             <span className="text-[#606c82] ml-1 text-[11px]  border border-[#dfe1e6] text-gray-800 px-1  rounded-full ml-[4px] text-[10px]">
                                {
                                  taskListA?.filter(
                                    (d) =>
                                      searchKey.includes(d['sts']) ||
                                      searchKey.includes('upcoming')
                                  ).length
                                }
                              </span>
                            </>
                          )}{' '}
                          {d.val === 'personal_tasks' && (
                            <>

                              <img className="w-6 h-6 mr-1" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/meetings.svg'}></img>

<span className='mt-[1px]'> {`${d.lab} `}</span>

                              <span className="text-[#606c82] ml-1 text-[11px]  border border-[#dfe1e6] text-gray-800 px-1  rounded-full ml-[4px] text-[10px]">
                                {personalData_F.length}
                              </span>
                            </>
                          )}
                          {d.val === 'business_tasks' && (
                            <>
                              <img className="w-6 h-6 mr-1" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/deal-pipeline-properties.svg'}></img>

                              <span className='mt-[1px]'> {`${d.lab} `}</span>
                              <span className="text-[#606c82] ml-1 text-[11px]  border border-[#dfe1e6] text-gray-800 px-1  rounded-full ml-[4px] text-[10px]">
                                {businessData_F.length}
                              </span>
                            </>
                          )}
                        </section>


                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="flex flex-row">
                {['dept_tasks', 'business_tasks', 'personal_tasks'].includes(
                  isClicked
                ) && (
                  <button
                    className="w-[104px] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 sm:mt-0 inline-flex items-start justify-start px-2 mb-[4px] mr-2
                 focus:outline-none rounded-full hover:text-[#027576] hover:bg-gradient-to-r from-violet-200 to-pink-200 bg-gradient-to-r from-violet-200 to-pink-200 text-black-900 hover:text-[#025e5e] hover:scale-95 font-light "
                    onClick={() => openingTaskAddWindow()}
                  >
                    <PlusIcon className="w-[13px] h-[13px] mt-[9px] mr-[2px]" />
                    <p className="text-sm text-black-900 font-medium leading-none mt-2">
                      New Task
                    </p>
                  </button>
                )}
                <div className="flex flex-row mr-2 mt-">
                  <span
                    className="flex mt-[4px] mr-[0px] justify-center items-center w-6 h-6 bg-gradient-to-r from-violet-200 to-pink-200 rounded-full  cursor-pointer "
                    onClick={() => {
                      setShowSettings(!showSettings)
                    }}
                  >
                    <SearchIcon className=" w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>
            <div
              className={`${
                showSettings ? 'hidden' : ''
              } flex flex-row py-2 justify-between `}
            >
              <div className="flex flex-row w-full">
                <span className="flex ml-2 mr-2 h-[34px] bg-gray-50 border border-gray-300 border-solid box-border w-1/3 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4  mt-[9px] mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    id="globalSearch"
                    placeholder="Search Task title,status... "
                    onChange={(e) => setSearchText(e.target.value)}
                    autoComplete="off"
                    value={searchText}
                    className="w-52 bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900 w-4/5 relative"
                  />
                </span>
                <div className=" mr-2 w-[130px]">
                  <SlimSelectBox
                    name="Priority"
                    placeholder="Priority"
                    label=""
                    className="input "
                    onChange={(value) => {
                      console.log('sel valu s', value)
                      setSelPriority(value.value)

                    }}
                    value={selPriority}
                    options={[
                      { label: 'All Priority', value: '' },
                      { label: 'Low', value: 'low' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'High', value: 'high' },
                    ]}
                  />
                </div>

                <div className="ml-2 py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded max-h-[35px]">
                  <p>Sort By:</p>
                  <select
                    aria-label="select"
                    className="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
                    onChange={(e) => handleSortDrop(e)}
                    value={sortType}
                  >
                    <option className="text-sm text-indigo-800">Oldest</option>
                    <option className="text-sm text-indigo-800">Latest</option>
                  </select>
                </div>

                <div className="flex items-center ml-2 mb-2 h-[31px]">
                  <Checkbox
                    color="primary"
                    checked={showOnlyDone}
                    onClick={() => {
                      setShowCompletedTasks(true)
                      setShowOnlyDone(!showOnlyDone)
                    }}
                  />
                  <label
                    htmlFor="area"
                    className="label font-regular text-[10px] font-bodyLato"
                  >
                    Show Only Completed
                  </label>
                </div>

              </div>
              <span style={{ display: '' }}>
                <CSVDownloader
                  className="mr-6 h-[20px] w-[20px] mt-2"
                  downloadRows={businessData_F}
                  style={{ height: '20px', width: '20px' }}
                />
              </span>
            </div>
            {isClicked === 'dept_tasks' && (
              <div className=" rounded px-1 mt-4 mb-3">
                <div className="sm:flex items-center justify-between bg-white rounded">
                  <div className="flex items-center">
                    {[
                      {
                        lab: 'All',
                        val: 'dept_tasks',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Done',
                        val: '',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Todo',
                        val: 'upcoming',
                        match: ['pending'],
                      },
                    ].map((d, i) => {
                      return (
                        <a
                          key={i}
                          className="rounded-full focus:outline-none mr-2"
                          href="javascript:void(0)"
                          onClick={() => setSearchKey(d.match)}
                        >
                          <div
                            className={`px-3 rounded-full pt-[2px] pb-[4px] text-[14px]  ${
                              searchKey.includes(d.match)
                                ? 'bg-gradient-to-r from-violet-200 to-pink-200 scale-105  font-normal'
                                : 'hover:text-[#027576] hover:bg-[#E7DDFF] bg-[#F2F7FA] text-gray-800  hover:scale-95 font-light'
                            }`}
                          >
                            {d.lab}
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            {isClicked === 'business_tasks' && (
              <div className=" rounded px-1 mt-4 mb-3 flex flex-row justify-between">
                <div className="sm:flex items-center justify-between bg-white rounded">
                  <div className="flex items-center">
                    {[
                      {
                        lab: 'All',
                        val: 'all_business',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Assigned to me',
                        val: 'assigned_to_me',
                        match: ['completed', 'pending'],
                      },
                      {
                        lab: 'Created by me',
                        val: 'created_by_me',
                        match: ['pending'],
                      },
                      {
                        lab: 'Participants',
                        val: 'participants',
                        match: ['upcoming'],
                      },
                    ].map((d, i) => {
                      return (
                        <a
                          key={i}
                          className="rounded-full focus:outline-none mr-2"
                          href="javascript:void(0)"
                          onClick={() => setSubSection(d.val)}
                        >
                          <div
                            className={`px-3 rounded-full pt-[2px] pb-[4px] text-[14px]  ${
                              subSection === d.val
                                ? 'bg-gradient-to-r from-violet-200 to-pink-200 scale-105 text-black-900 font-normal'
                                : 'hover:text-[#027576] hover:bg-[#E7DDFF] bg-[#F2F7FA] text-gray-800 hover:scale-95 font-light'
                            }`}
                          >
                            <section className="flex flex-row">
                              {d.lab}
                              {d.val === 'all_business' && (
                                <section className="text-[11px]  ml-1 mt-[3px]">
                                  ({businessData_F.length})
                                </section>
                              )}
                              {d.val === 'assigned_to_me' && (
                                <section className="text-[11px]  ml-1 mt-[4px]">
                                  (
                                  {
                                    businessData_F.filter(
                                      (d) =>
                                        d.by_uid != user?.uid &&
                                        d.to_uid === user?.uid
                                    ).length
                                  }
                                  )
                                </section>
                              )}
                              {d.val === 'created_by_me' && (
                                <section className="text-[11px]  ml-1 mt-[4px]">
                                  (
                                  {
                                    businessData_F.filter(
                                      (d) =>
                                        d.by_uid === user?.uid &&
                                        d.to_uid != user?.uid
                                    ).length
                                  }
                                  ){' '}
                                </section>
                              )}
                              {d.val === 'participants' && (
                                <section className="text-[11px]  ml-1 mt-[4px]">
                                  ({ParticipantsData_D.length})
                                </section>
                              )}
                            </section>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
                <div className="flex flex-row">
                  <span className="text-[10px] mt-1 mr-1">Show Completed</span>
                  <Switch
                    checked={showCompletedTasks}
                    onChange={changeFun}
                    className={`${
                      showCompletedTasks ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        showCompletedTasks ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              </div>
            )}
            {((isClicked === 'dept_tasks' && taskListA.length === 0) ||
              (isClicked === 'personal_tasks' && personalData_D.length === 0) ||
              (isClicked === 'business_tasks' &&
                businessSection_D.length === 0)) && (
              <div
                className={`py-8 px-8 flex flex-col items-center bg-red-100 rounded ${
                  isClicked === 'personal_tasks' ? 'mt-[55px]' : ''
                }`}
              >
                <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                  <img
                    className="w-[180px] h-[180px] inline"
                    alt=""
                    src="../note-widget.svg"
                  />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  No Tasks Found
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  <span className="text-blue-600"> Add New Task</span>
                </time>
              </div>
            )}
            {isClicked === 'dept_tasks' && (
              <div className="overflow-x-auto mt-2">
                <table className="w-full whitespace-nowrap">
                  <tbody>
                    {
                      // [
                      //   {
                      //     title: 'Marketing Keynote Presentation1',
                      //     p: 'Urgent',
                      //     date: '04/07',
                      //     due: 'Today',
                      //   },
                      // ]
                      taskListA
                        ?.filter(
                          (d) =>
                            searchKey.includes(d['sts']) ||
                            searchKey.includes('upcoming')
                        )
                        .map((dat, i) => (
                          <tr
                            tabIndex={0}
                            className="focus:outline-none h-16 border border-gray-100 rounded"
                            key={i}
                            onClick={() => {
                              console.log('macho 1', dat?.leadUser, dat)
                              const y = dat.leadUser
                              y.id = dat?.uid
                              console.log('macho 1', y)
                              selUserProfileF('User Profile', y)
                            }}
                          >
                            <td>
                              <div className="ml-5">
                                <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center relative">

                                  {i + 1}

                                </div>
                              </div>
                            </td>
                            <td className=" max-w-[300px]">
                              <div className="flex items-center ">
                                <div className="flex flex-col">
                                  <p className="text-base max-w-[350px] overflow-ellipsis overflow-hidden font-semibold leading-none text-blue-800 mr-2 mt-2">
                                    {dat?.notes}
                                  </p>
                                  <div className="flex flex-row">
                                    <p className="text-[9px]   leading-none  pr-2 text-green-800  mt-[6px]  py-[4px]  rounded-full   mb-1 mr-2  ">
                                      {dat?.leadUser?.Project?.toUpperCase()}
                                    </p>


                                    <p className="text-[9px]  leading-none text-red-800  mt-[6px] font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                      {dat?.leadUser?.Status?.toUpperCase()}
                                    </p>
                                    <p className="text-[9px]  leading-none text-gray-600  mt-[6px] font-sanF  py-[4px]  rounded-full    mb-1 mr-2  ">
                                      {dat?.sts?.toUpperCase()}
                                    </p>
                                    <p
                                      className={`text-[9px]  leading-none ${
                                        user?.uid == dat?.leadUser?.assignedTo
                                          ? 'text-green-800'
                                          : 'text-red-800 '
                                      }   mt-[6px] font-sanF  py-[4px]  rounded-full    mb-1 mr-2  `}
                                    >
                                      {dat?.leadUser?.assignedToObj?.name?.toUpperCase()}
                                    </p>
                                  </div>
                                </div>

                              </div>
                            </td>
                            <td className="pl-24">

                            </td>
                            <td className="pl-5">
                              <div className="flex flex-col">
                                <p className="text-[12px] leading-none text-blue-600 ml-2">
                                  {dat?.status}
                                </p>
                                <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                  {dat?.leadUser?.Name}
                                </p>

                                <p className="text-sm leading-none text-gray-600 ml-2">
                                </p>
                              </div>
                            </td>
                            <td className="pl-5">
                              <div className="flex flex-row">

                                <button className="py-3 px-3 text-[13px] focus:outline-none leading-none text-red-700 rounded">
                                  {Math.abs(
                                    getDifferenceInMinutes(dat['schTime'], '')
                                  ) > 60
                                    ? Math.abs(
                                        getDifferenceInMinutes(
                                          dat['schTime'],
                                          ''
                                        )
                                      ) > 1440
                                      ? `${getDifferenceInDays(
                                          dat['schTime'],
                                          ''
                                        )} Days `
                                      : `${getDifferenceInHours(
                                          dat['schTime'],
                                          ''
                                        )} Hours `
                                    : `${getDifferenceInMinutes(
                                        dat['schTime'],
                                        ''
                                      )} Min`}
                                  {getDifferenceInMinutes(dat['schTime'], '') <
                                  0
                                    ? 'Due'
                                    : 'Left'}
                                  <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                    {prettyDateTime(dat['schTime'])}
                                  </p>
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))
                    }

                    <tr className="h-3"></tr>
                  </tbody>
                </table>
              </div>
            )}
            {['personal_tasks'].includes(isClicked) &&
              personalData_D?.length > 0 && (
                <div className="overflow-x-auto mt-2 rounded-xl">
                  <table className="w-full whitespace-nowrap">
                    <thead className="">
                      <tr className="tabHeader">
                        <th className="text-left pl-[1rem]">
                          {' '}
                          <span className="headTxt" tabIndex="0" role="button">
                            S.no{' '}
                          </span>
                        </th>
                        <th className="text-left">
                          {' '}
                          <span
                            className="max-w-[300px] headTxt"
                            tabIndex="0"
                            role="button"
                          >
                            Task{' '}
                          </span>
                        </th>
                        <th>
                          {' '}
                          <span
                            className="text-left headTxt"
                            tabIndex="0"
                            role="button"
                          >
                            Created By
                          </span>
                        </th>
                        <th className="pl-6 text-left headTxt">
                          {' '}
                          <span tabIndex="0" role="button">
                            Status{' '}
                          </span>
                        </th>
                        <th className=" text-left pl-[3rem] headTxt">
                          {' '}
                          <span className="" tabIndex="0" role="button">
                            Deadline{' '}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {personalData_D?.map((dat, i) => (
                        <tr
                          tabIndex={0}
                          className="focus:outline-none h-16 border border-gray-100 rounded"
                          key={i}
                          onClick={() => {
                            selTaskManObjF(dat)
                          }}
                        >
                          <td>
                            <div className="ml-5">
                              <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center relative">
                                {i + 1}
                              </div>
                            </div>
                          </td>
                          <td className=" max-w-[300px]">
                            <div className="flex items-center ">
                              <div className="flex flex-col">
                              <span className="relative flex flex-col  group">
                                  <div
                                    className="absolute bottom-0 flex-col items-center hidden mb-4 group-hover:flex"
                                    style={{ zIndex: '9' }}
                                  >
                                    <span
                                      className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                      style={{
                                        color: 'black',
                                        background: '#e2c062',
                                        wordWrap: 'break-word',
                                      }}
                                    >
                                      <p
                                        className="break-words"
                                        style={{ wordWrap: 'break-word' }}
                                      >
                                        {dat?.title}
                                      </p>
                                    </span>
                                    <div
                                      className="w-3 h-3  -mt-2 rotate-45 bg-black"
                                      style={{
                                        background: '#e2c062',
                                        marginRight: '12px',
                                      }}
                                    ></div>
                                  </div>
                                  <p className="text-base max-w-[350px] text-[13px] overflow-ellipsis overflow-hidden font-semibold leading-none text-blue-800 mr-2 mt-2">
                                    {dat?.title}
                                  </p>
                                </span>
                                <span className="relative flex flex-col  group">
                                {dat?.comments?.length > 0 && (
                                  <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px] max-w-[300px] min-w-[300px] overflow-ellipsis overflow-hidden   rounded-full   mb-1 mr-2  ">
                                    {dat?.comments[0]?.msg}
                                  </p>
                                )}
                                  <div
                                    className="absolute top-0 flex-col items-center hidden mt-6 group-hover:flex"
                                    // style={{  width: '300px' }}
                                    style={{ zIndex: '9' }}
                                  >
                                     <div
                                      className="w-3 h-3 absolute top-1 left-2 -mt-2 mt-2 rotate-45 bg-black"
                                      style={{
                                        background: '#e2c062',
                                        marginRight: '12px',

                                      }}
                                    ></div>
                                    <span
                                      className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                      style={{
                                        color: 'black',
                                        background: '#e2c062',
                                        wordWrap: 'break-word',
                                        // maxWidth: '400px',
                                      }}
                                    >
                                      <p
                                        className="break-words"
                                        style={{ wordWrap: 'break-word' }}
                                      >
                                       {dat?.comments?.length > 0 && (
                                  <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px]    rounded-full   mb-1 mr-2  ">
                                    {dat?.comments[0]?.msg}
                                  </p>
                                )}
                                      </p>
                                    </span>

                                  </div>

                                </span>
                                <div className="flex flex-row">
                                  <p className="text-[9px]   leading-none  pr-2 text-green-800  mt-[6px]  py-[4px]  rounded-full   mb-1 mr-2  ">
                                    {dat?.priority?.toUpperCase()}
                                  </p>
                                  <section>
                                    <PaperClipIcon className="w-3 h-3 mr-[2px] inline-block text-gray-400 " />
                                  </section>
                                  <p className="text-[9px]  leading-none text-red-800  mt-[6px] font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                    {dat?.attachmentsCount || 0}
                                  </p>
                                  <section>
                                    <UsersIcon className="w-3 h-3 mr-[2px]  inline-block text-gray-400  " />{' '}
                                  </section>
                                  <p className="text-[9px]  leading-none text-red-800  mt-[6px] font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                    {dat?.participantsA?.length || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text">
                            <p className="text-[13px] leading-none text-[#212b36] ">
                              {dat?.by_name}
                            </p>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-col">
                            <span className={`text-[12px] leading-none text-blue-600 ml-2 ${dat?.status == 'Done' ? 'text-green-600 ' : ''} `}>
                                {dat?.status}
                              </span>
                              <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                {dat?.to_name}
                              </p>

                              <p className="text-sm leading-none text-gray-600 ml-2">
                                {/* {prettyDateTime(dat['schTime'])} */}
                              </p>
                            </div>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-row">
                              <button className="py-3 px-3 text-[13px] focus:outline-none leading-none text-red-700 rounded">
                                {dat?.status != 'Done' && (
                                  <span>
                                    {' '}
                                    {Math.abs(
                                      getDifferenceInMinutes(
                                        dat['due_date'],
                                        ''
                                      )
                                    ) > 60
                                      ? Math.abs(
                                          getDifferenceInMinutes(
                                            dat['due_date'],
                                            ''
                                          )
                                        ) > 1440
                                        ? `${getDifferenceInDays(
                                            dat['due_date'],
                                            ''
                                          )} Days `
                                        : `${getDifferenceInHours(
                                            dat['due_date'],
                                            ''
                                          )} Hours `
                                      : `${getDifferenceInMinutes(
                                          dat['due_date'],
                                          ''
                                        )} Min`}
                                    {getDifferenceInMinutes(
                                      dat['due_date'],
                                      ''
                                    ) < 0
                                      ? 'Due'
                                      : 'Left'}
                                  </span>
                                )}
                                {dat?.status == 'Done' && (
                                  <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                    {prettyDateTime(dat['closedOn'])}
                                  </p>
                                )}
                                <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                  {prettyDateTime(dat['due_date'])}
                                </p>
                              </button>
                            </div>
                          </td>


                        </tr>
                      ))}

                      <tr className="h-3"></tr>
                    </tbody>
                  </table>
                </div>
              )}
            {['business_tasks'].includes(isClicked) &&
              businessSection_D.length > 0 && (
                <div className="overflow-x-auto mt-2 rounded-xl">
                  <table className="w-full whitespace-nowrap">
                    <thead className="">
                      <tr className="tabHeader">
                        <th className="text-left pl-[1rem]">
                          {' '}
                          <span className="headTxt" tabIndex="0" role="button">
                            S.no {businessSection_D.length}
                          </span>
                        </th>
                        <th className="text-left">
                          {' '}
                          <span
                            className="max-w-[300px] headTxt"
                            tabIndex="0"
                            role="button"
                          >
                            Task{' '}
                          </span>
                        </th>
                        <th>
                          {' '}
                          <span
                            className="text-left headTxt"
                            tabIndex="0"
                            role="button"
                          >
                            Created By
                          </span>
                        </th>
                        <th className="pl-6 text-left headTxt">
                          {' '}
                          <span tabIndex="0" role="button">
                            Status{' '}
                          </span>
                        </th>
                        <th className=" text-left pl-[3rem] headTxt">
                          {' '}
                          <span className="" tabIndex="0" role="button">
                            Deadline{' '}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessSection_D?.map((dat, i) => (
                        <tr
                          tabIndex={0}
                          className="focus:outline-none h-16 border border-gray-100 rounded"
                          key={i}
                          onClick={() => {
                            selTaskManObjF(dat)
                          }}
                        >
                          <td>
                            <div className="ml-5">
                              <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center relative">
                                {i + 1}
                              </div>
                            </div>
                          </td>
                          <td className=" max-w-[300px]">
                            <div className="flex items-center ">
                              <div className="flex flex-col">
                                <span className="relative flex flex-col  group">
                                  <div
                                    className="absolute bottom-0 flex-col items-center hidden mb-4 group-hover:flex"
                                    // style={{  width: '300px' }}
                                    style={{ zIndex: '9' }}
                                  >
                                    <span
                                      className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                      style={{
                                        color: 'black',
                                        background: '#e2c062',
                                        wordWrap: 'break-word',
                                        // maxWidth: '400px',
                                      }}
                                    >
                                      <p
                                        className="break-words"
                                        style={{ wordWrap: 'break-word' }}
                                      >
                                        {dat?.title}
                                      </p>
                                    </span>
                                    <div
                                      className="w-3 h-3  -mt-2 rotate-45 bg-black"
                                      style={{
                                        background: '#e2c062',
                                        marginRight: '12px',
                                      }}
                                    ></div>
                                  </div>
                                  <p className="text-base max-w-[350px] text-[13px] overflow-ellipsis overflow-hidden font-semibold leading-none text-blue-800 mr-2 mt-2">
                                    {dat?.title}
                                  </p>
                                </span>
                                <span className="relative flex flex-col  group">
                                {dat?.comments?.length > 0 && (
                                  <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px] max-w-[300px] min-w-[300px] overflow-ellipsis overflow-hidden   rounded-full   mb-1 mr-2  ">
                                    {dat?.comments[0]?.msg}
                                  </p>
                                )}
                                  <div
                                    className="absolute top-0 flex-col items-center hidden mt-6 group-hover:flex"
                                    style={{ zIndex: '9' }}
                                  >
                                     <div
                                      className="w-3 h-3 absolute top-1 left-2 -mt-2 mt-2 rotate-45 bg-black"
                                      style={{
                                        background: '#e2c062',
                                        marginRight: '12px',

                                      }}
                                    ></div>
                                    <span
                                      className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                      style={{
                                        color: 'black',
                                        background: '#e2c062',
                                        wordWrap: 'break-word',
                                      }}
                                    >
                                      <p
                                        className="break-words"
                                        style={{ wordWrap: 'break-word' }}
                                      >
                                       {dat?.comments?.length > 0 && (
                                  <p className="text-[11px]   leading-none  pr-2 text-green-800  mt-[6px]    rounded-full   mb-1 mr-2  ">
                                    {dat?.comments[0]?.msg}
                                  </p>
                                )}
                                      </p>
                                    </span>

                                  </div>

                                </span>
                                <div className="flex flex-row mt-[2px]">
                                  <p className="text-[9px]   leading-none  pr-2 text-green-800 ]  py-[4px]  rounded-full   mb-1 mr-2  ">
                                    {dat?.priority?.toUpperCase()}
                                  </p>
                                  <section>
                                    <PaperClipIcon className="w-3 h-3 mr-[2px] inline-block text-gray-400 mb-[10px]" />
                                  </section>
                                  <p className="text-[9px]  leading-none text-red-800   font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                    {dat?.attachmentsCount || 0}
                                  </p>
                                  <section>
                                    <UsersIcon className="w-3 h-3 mr-[2px]  inline-block text-gray-400 mb-[10px]  " />{' '}
                                  </section>
                                  <p className="text-[9px]  leading-none text-red-800   font-sanF  py-[4px]  rounded-full   mb-1 mr-4  ">
                                    {dat?.participantsA?.length || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text">
                            <p className="text-[13px] leading-none text-[#212b36]">
                              {dat?.by_name}
                            </p>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-col">
                              <span className={`text-[12px] leading-none text-blue-600 ml-2 ${dat?.status == 'Done' ? 'text-green-600 ' : ''} `}>
                                {dat?.status}
                              </span>
                              <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                {dat?.to_name}
                              </p>
                              <p className="text-sm leading-none text-gray-600 ml-2"></p>
                            </div>
                          </td>
                          <td className="pl-5">
                            <div className="flex flex-row">
                              <button className="py-3 px-3 text-[13px] focus:outline-none leading-none text-red-700 rounded">
                                {dat?.status != 'Done' && (
                                  <span>
                                    {' '}
                                    {Math.abs(
                                      getDifferenceInMinutes(
                                        dat['due_date'],
                                        ''
                                      )
                                    ) > 60
                                      ? Math.abs(
                                          getDifferenceInMinutes(
                                            dat['due_date'],
                                            ''
                                          )
                                        ) > 1440
                                        ? `${getDifferenceInDays(
                                            dat['due_date'],
                                            ''
                                          )} Days `
                                        : `${getDifferenceInHours(
                                            dat['due_date'],
                                            ''
                                          )} Hours `
                                      : `${getDifferenceInMinutes(
                                          dat['due_date'],
                                          ''
                                        )} Min`}
                                    {getDifferenceInMinutes(
                                      dat['due_date'],
                                      ''
                                    ) < 0
                                      ? 'Due'
                                      : 'Left'}
                                  </span>
                                )}
                                {dat?.status == 'Done' && (
                                  <p className="text-[11px] leading-none text-green-600 ml-2 mt-2">
                                    {prettyDateTime(dat['closedOn'])}
                                  </p>
                                )}
                                <p className="text-[11px] leading-none text-gray-600 ml-2 mt-2">
                                  {prettyDateTime(dat['due_date'])}
                                </p>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      <tr className="h-3"></tr>
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>

      </div>
      <SiderForm
        open={isImportLeadsOpen1}
        setOpen={setisImportLeadsOpen1}
        title={'Add Task'}
        widthClass="max-w-4xl"
      />
    </>
  )
}

export default TodoListView

