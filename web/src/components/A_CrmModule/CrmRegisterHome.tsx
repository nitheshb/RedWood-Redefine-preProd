/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react'
import {
  PuzzleIcon,
} from '@heroicons/react/outline'
import {
  ChartPieIcon,
  SearchIcon,
  NewspaperIcon,
  InformationCircleIcon,
} from '@heroicons/react/solid'
import { } from '@heroicons/react/solid'
import { Box, LinearProgress } from '@mui/material'
import { startOfDay } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { MetaTags } from '@redwoodjs/web'
import {
  getBookedUnitsByProject,
  getAllProjects,
  getUnassignedCRMunits,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from 'src/util/computeCsTotals'
import CSVDownloader from 'src/util/csvDownload'
import { prettyDate } from 'src/util/dateConverter'
import {
  VerySlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'
import DoughnutChartWithRoundedSegments from '../A_SalesModule/Reports/charts/piechartRounded'
import CrmSiderForm from '../SiderForm/CRM_SideForm'
import SiderForm from '../SiderForm/SiderForm'
import RoundedProgressBar from '../A_SalesModule/Reports/charts/horizontalProgressBar'
import { ToWords } from 'to-words'
import IndianCurrencyTooltip from '../A_CRMcomp/IndianCurrencyTooltip'
import { USER_ROLES } from 'src/constants/userRoles'
import PaymentDashboard from '../A_SalesModule/Reports/charts/PaymentDashboard'
import StageCostChart from '../A_SalesModule/Reports/charts/StageCostChart'
import HalfSemiCircleGauge from '../A_SalesModule/Reports/charts/GaugeChart'
import RadialChart from '../A_SalesModule/Reports/charts/RadialChart'
import { PhoneCall } from 'lucide-react'
import SemicircleProgressChart from '../A_SalesModule/Reports/charts/SemiCircleProgress'





const toWords = new ToWords({
  localeCode: 'en-IN',
})


const agreementItems = [
  {
    item: 'EC',
    status: 'completed',
  },
  {
    item: 'Customer Approve',
    status: 'completed',
  },
  {
    item: 'Franking Charges',
    status: 'pending',
  },
  {
    item: 'Purchase Stamp Duty',
    status: 'pending',
  },
  {
    item: 'Sign',
    status: 'pending',
  },
  {
    item: 'Save',
    status: 'completed',
  },
  {
    item: 'Share',
    status: 'completed',
  },
]
const loanItems = [
  {
    item: 'KYC',
    status: 'completed',
  },
  {
    item: 'Sanction Letter',
    status: 'completed',
  },
  {
    item: 'Builder Noc',
    status: 'pending',
  },
  {
    item: 'EC',
    status: 'pending',
  },
  {
    item: 'Demand Letter',
    status: 'pending',
  },
  {
    item: 'Receipt',
    status: 'completed',
  },
  {
    item: 'CS',
    status: 'completed',
  },
  {
    item: 'Agreement',
    status: 'completed',
  },
]
const modifyItems = [
  {
    item: 'New Modification',
    status: 'completed',
  },
  {
    item: 'Engineer Approval',
    status: 'completed',
  },
  {
    item: 'Quotation',
    status: 'pending',
  },
  {
    item: 'Cust Approval',
    status: 'pending',
  },
]
const CrmRegisterModeHome = ({ leadsTyper, customerDetails }) => {
  const d = new window.Date()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { orgId, access, projAccessA } = user
  const [isUnitDetailsOpen, setisUnitDetailsOpen] = useState(false)
  const [isSubTopicOpen, setIsSubTopicOpen] = useState(false)
  const [isSubTopic, setIsSubTopic] = useState('')
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })

  // kanban board
  const [ready, setReady] = useState(false)
  const [horizontalMode, setHorizontalMode] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [sourceDateRange, setSourceDateRange] = useState(
    startOfDay(d).getTime()
  )

  const [addLeadsTypes, setAddLeadsTypes] = useState('')
  const [selUnitDetails, setSelUnitDetails] = useState({})
  const [crmCustomersDBData, setCrmCustomerDBData] = useState([])
  const [crmDBData, setCrmCutomerDBData] = useState([])
  const [crmBookineReviewDBData, setBookingReviewDBData] = useState([])
  const [serialLeadsData, setSerialLeadsData] = useState([])
  const [projectList, setprojectList] = useState([])
  const [transactionData, setTransactionData] = useState({})
  const [selMenTitle, setSelMenuTitle] = useState('agreeement_home')
  const [selMenuItem, setSelMenuItem] = useState(agreementItems)
  const [selSubMenu, setSelSubMenu] = useState('summary')

  const [selSubMenu1, setSelSubMenu1] = useState('summary')
  const [unitTotal, setUnitTotal] = useState(0)


  const [assignerName, setAssignerName] = useState('')

  const DocumentationHeadA = [
    { lab: 'All Transactions', val: 'all' },
    { lab: 'For onBoarding', val: 'latest' },
    { lab: 'For Agreement', val: 'reviewing' },
    { lab: 'For Registration', val: 'cleared' },
    { lab: 'For Bank Loan', val: 'rejected' },
    { lab: 'For Position', val: 'rejected' },
  ]
  const perResisterTableHeadA = [
    { lab: 'Asset Details', val: 'all' },
    // { lab: 'Welcome Formalities', val: 'latest' },
    { lab: 'Payment Pending', val: 'reviewing' },
    { lab: 'Payment Review', val: 'cleared' },
    { lab: 'Agreement Payment', val: 'cleared' },
    { lab: 'Review Meeting', val: 'rejected' },
    { lab: 'Agreement Doc', val: 'rejected' },
    { lab: 'Agreement Schedule', val: 'rejected' },
    { lab: 'Bank Loan Approval ', val: 'rejected' },
    { lab: 'Modifications', val: 'rejected' },
    // { lab: 'Constuction Progress', val: 'rejected' },
    { lab: 'Legal Review', val: 'rejected' },
    { lab: '', val: 'rejected' },
    { lab: 'Comments', val: 'rejected' },
  ]

  const [tabHeadFieldsA, setTabHeadFields] = useState(DocumentationHeadA)
  const [tableHeadFieldsA, setTableHeadFieldsA] = useState(
    perResisterTableHeadA
  )
  const [tableData, setTableDataA] = useState([])
  const [bookingReviewA, setBookingReviewA] = useState([])
  const [agreePipeA, setAgreePipeA] = useState([])
  const [sdPipeA, setSdPipeA] = useState([])
  const [registeredA, setRegisteredA] = useState([])
  const [posessionA, setPosessionA] = useState([])
  const [unassignedA, setUnAssignedA] = useState([])
  const [unqueriesA, setQueriesA] = useState([])

  const [bookingReviewCo, setBookingReviewCo] = useState([])
  const [agreePipeCo, setAgreePipeCo] = useState([])
  const [sdPipeCo, setSdPipeCo] = useState([])
  const [registeredCo, setRegisteredCo] = useState([])
  const [posessionCo, setPosessionCo] = useState([])
  const [unassignedCo, setUnAssignedCo] = useState([])
  const [queryResult, setQueryResult] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isOpened, setIsOpened] = React.useState(false)
  const [selCategory, setSelCategory] = useState('booked')
  const [dateRange, setDateRange] = React.useState([null, null])
  const [startDate, endDate] = dateRange
  const [usersList, setusersList] = useState([])
  const [searchKeyField, setSearchKeyField] = useState('')
  const [filteredDataA, setFilteredDataA] = useState([])
  const [selLeadsOf, setSelLeadsOf] = useState({
    label: 'My Units',
    value: 'myunits',
  })
  useEffect(() => {
    // console.log(' crm units data is ', crmCustomersDBData)
  }, [crmCustomersDBData])

  useEffect(() => {
    bootFun()
  }, [])
  useEffect(() => {
    if (selMenTitle === 'agreeement_home') {
      setSelMenuItem(agreementItems)
    } else if (selMenTitle === 'loan_home') {
      setSelMenuItem(loanItems)
    } else {
      setSelMenuItem(modifyItems)
    }
  }, [selMenTitle])

  const bootFun = async () => {
    await getProjectsListFun()
  }





  useEffect(() => {
    getLeadsDataFun(projectList, ['booked', 'Booked'])
    getLeadsDataFun(projectList, ['agreement_pipeline'])
    getLeadsDataFun(projectList, ['agreement', 'ATS'])
    getLeadsDataFun(projectList, ['registered', 'Registered'])
    getLeadsDataFun(projectList, ['possession'])
    getLeadsDataFun(projectList, ['unassigned'])
  }, [projectList, selLeadsOf])

  useEffect(() => {
    filter_Leads_Projects_Users_Fun()
  }, [selProjectIs])

  const filter_Leads_Projects_Users_Fun = () => {

    getLeadsDataFun(projectList, ['booked', 'Booked'])
    getLeadsDataFun(projectList, ['agreement_pipeline'])
    getLeadsDataFun(projectList, ['agreement', 'ATS'])
    getLeadsDataFun(projectList, ['registered', 'Registered'])
    getLeadsDataFun(projectList, ['possession', 'Possession'])
    getLeadsDataFun(projectList, ['unassigned'])

  }

  const getProjectsListFun = () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        setprojectList(projectsListA)
      },
      (error) => setprojectList([])
    )
    return unsubscribe
  }

  useEffect(() => {

  }, [selCategory])

  const rowsCounter = (parent, searchKey) => {
    return parent.filter((item) => {
      if (searchKey === 'all') {
        return item
      } else if (item.status.toLowerCase() === searchKey.toLowerCase()) {
        return item
      }
    })
  }
  const getCustomerDataFun = async (projectList) => {
    const { access, uid } = user

    const unsubscribe = getUnassignedCRMunits(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          const y = projectList.filter((proj) => proj?.uid == x?.pId)
          if (y.length > 0) {
            x.projName = y[0].projectName
          }
          return x
        })

      },
      {
        status: [
          'latest',
          'reviewing',
          'review',
          'cleared',
          'rejected',
          '',

        ],
      },
      () => setCrmCustomerDBData([])
    )
    return unsubscribe
  }
  const getLeadsDataFun = async (projectList, statusFil) => {
    const { access, uid } = user
    const unsubscribe = getBookedUnitsByProject(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          const y = projectList.filter((proj) => proj?.uid == x?.pId)
          if (y.length > 0) {

            x.projName = y[0].projectName
          }
          return x
        })


        await usersListA.sort((a, b) => {
          return a.unit_no - b.unit_no
        })


        await usersListA.sort((a, b) => {
          const dateA = new Date(a.booked_on || a.ct || 0);
          const dateB = new Date(b.booked_on || b.ct || 0);
          return dateB - dateA;
        });



        if (statusFil.includes('booked')) {

          await setBookingReviewA(usersListA)
          await setBookingReviewCo(usersListA.length)

          await setQueryResult(usersListA)
          await setFilteredDataA(usersListA)
          await setSearchKeyField('')
        } else if (statusFil.includes('agreement_pipeline')) {
          await setAgreePipeA(usersListA)
          await setAgreePipeCo(usersListA.length)
        } else if (statusFil.includes('agreement')) {
          await setSdPipeA(usersListA)
          await setSdPipeCo(usersListA.length)
        } else if (statusFil.includes('registered')) {
          await setRegisteredA(usersListA)
          await setRegisteredCo(usersListA.length)
        } else if (statusFil.includes('possession')) {
          await setPosessionA(usersListA)
          await setPosessionCo(usersListA.length)
        } else if (statusFil.includes('unassigned')) {
          await setUnAssignedA(usersListA)
          await setUnAssignedCo(usersListA.length)
        }
        // await console.log('my Array data is set it', crmCustomersDBData)
      },
      {
        status: statusFil,
        projectId: selProjectIs?.uid,
        assignedTo: selLeadsOf?.value === 'myunits' ? uid : undefined,
      },
      () => setCrmCustomerDBData([])
    )
    return unsubscribe

  }

  useEffect(() => {
    searchBar(searchKeyField)
  }, [searchKeyField, selCategory])
  const searchLogic = async (searchKey, fetchedArray) => {
    if (!searchKey) return setFilteredDataA(fetchedArray)

    const lowerSearchKey = searchKey.toLowerCase()

    const z = fetchedArray.filter((item) => {
      return (
        (item?.customerDetailsObj?.customerName1 &&
          item?.customerDetailsObj?.customerName1 &&
          item?.customerDetailsObj?.AssignedBy
            ?.toLowerCase()
            ?.includes(lowerSearchKey)) ||
        (item?.unit_no &&
          item?.unit_no?.toString()?.toLowerCase()?.includes(lowerSearchKey))
      )
    })
    await setFilteredDataA(z)
  }
  const searchBar = async (searchKey) => {

    if (selCategory === 'booked') {
      searchLogic(searchKey, queryResult)
    }
    else if (selCategory === 'agreement_pipeline') {
      searchLogic(searchKey, agreePipeA)
    }
    else if (selCategory === 'agreement') {
      searchLogic(searchKey, sdPipeA)
    }
    else if (selCategory === 'registered') {
      searchLogic(searchKey, registeredA)
    }
    else if (selCategory === 'possession') {
      searchLogic(searchKey, posessionA)
    }
    else if (selCategory === 'unassigned') {
      // searchLogic(searchKey, unassignedA)
      searchLogic(searchKey, crmCustomersDBData)
    }

  }


  const serealizeData = (array) => {
    // let newData =
    const x = [
      'new',
      'review',
      'cleared',
      'rejected',
      '',
      // 'booked',
    ].map((status) => {
      const items = array.filter((data) => data.Status.toLowerCase() == status)

      return { name: status, items }
    })
    setSerialLeadsData(x)
  }

  const selUserProfileF = (title, data) => {
    setAddLeadsTypes(title)
    setisUnitDetailsOpen(true)
    setSelUnitDetails(data)
  }

  const viewTransaction = (docData, sideViewCategory, sideViewCategory1) => {
    setSelSubMenu(sideViewCategory)
    setSelSubMenu1(sideViewCategory1)
    setTransactionData(docData)
    setisUnitDetailsOpen(!isUnitDetailsOpen)
    setSelUnitDetails(docData)
  }



  function formatIndianNumber(num) {
    if (num >= 1_00_00_00_000) return (num / 1_00_00_00_000).toFixed(1) + 'Lcr+';
    if (num >= 1_00_00_000) return (num / 1_00_00_000).toFixed(1) + 'Cr+';
    if (num >= 1_00_000) return (num / 1_00_000).toFixed(1) + 'L+';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K+';
    return num.toString();
  }

  console.log(formatIndianNumber(25000000));
  useEffect(() => {

    setAssignerName(customerDetails?.assignedToObj?.label)
  }, [customerDetails])






  console.log("Assigner Name:", assignerName);





  return (
    <>
      <div className=" font-outfit mt-1 py-2 bg-[#F6F5F8] rounded-t-lg ">
        <div className=" max-w-8xl px-6 mx-auto">
          <div
            className="
            "
          >
            <div className="flex items-center flex-row flex-wrap justify-between py-1 pb-5  px-3 py-3 ">
              <h2 className="text-md font-semibold text-black leading-light font-Playfair">
                CRM
              </h2>

              <div className="flex  gap-2">
                <div className=" flex flex-col gap-2  w-40">
                  <VerySlimSelectBox
                    name="project"
                    label=""
                    className="input "
                    onChange={(value) => {
                      setSelProject(value)
                    }}
                    value={selProjectIs?.value}
                    options={[
                      ...[{ label: 'All Projects', value: 'allprojects' }],
                      ...projectList,
                    ]}
                  />
                </div>
                {(
                  <div className=" flex flex-col   w-40">
                    <VerySlimSelectBox
                      name="project"
                      label=""
                      placeholder="My Leads"
                      className="input "
                      onChange={(value) => {
                        setSelLeadsOf(value)
                      }}
                      value={selLeadsOf?.value}

                      options={[
                        ...[
                          { label: 'Team Units', value: 'teamunits' },
                          { label: 'My Units', value: 'myunits' },
                        ],
                        ...usersList,
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="  flex-col justify-between flex  my-4  ">

              <div className=" border-gray-900 flex items-center flex-row justify-between">
                <ul
                  className="flex  gap-x-4  rounded-t-lg "
                  id="myTab"
                  data-tabs-toggle="#myTabContent"
                  role="tablist"
                >
                  {[
                    { lab: 'Booked', val: 'booked' },
                    { lab: 'Allotment', val: 'agreement_pipeline' },
                    { lab: 'Agreement', val: 'agreement' },
                    { lab: 'Construction', val: 'construction' },
                    { lab: 'Registered', val: 'registered' },
                    { lab: 'Possession', val: 'possession' },
                    { lab: 'Unassigned', val: 'unAssigned_crm' },
                    { lab: 'Queries', val: 'queries' },
                  ].map((d, b, arr) => {
                    return (
                      <li
                        key={b}
                        // className="mr-2 ml-2 text-sm font-bodyLato"
                        className={`ml-2 text-sm font-bodyLato flex  items-center  h-4 ${b !== arr.length - 1 ? 'border-r border-gray-300' : ''
                          }`}
                        role="presentation"
                      >
                        <button
                          className={`inline-block py-2 mr-3 px-1 text-[16px] font-medium  font-outfit text-center text-black rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${selCategory === d.val
                            ? 'text-black border-black '
                            : 'text-gray-500  border-transparent'
                            }`}
                          type="button"
                          role="tab"
                          onClick={() => setSelCategory(d.val)}
                        >
                          {`${d.lab} `}
                          {/* <span className=" bg-[#E5E7EB] text-gray-800 px-1.5 py-1.5 rounded-full ml-[4px] text-[12px] "> */}
                          <span className={` ${selCategory === d.val ? 'bg-[#EDE9FE] text-[#0E0A1F]' : 'bg-[#E5E7EB] text-[#606062]'} px-1.5 py-1.5 rounded-full ml-[4px] text-[12px] `}>

                            {d.val === 'booked' && (
                              <span>{bookingReviewCo}</span>
                            )}
                            {d.val === 'agreement_pipeline' && (
                              <span>{agreePipeCo}</span>
                            )}
                            {d.val === 'agreement' && <span>{sdPipeCo}</span>}
                            {d.val === 'registered' && (
                              <span>{registeredCo}</span>
                            )}
                            {d.val === 'possession' && (
                              <span>{posessionCo}</span>
                            )}
                            {d.val === 'unAssigned_crm' && (
                              <span>{unassignedCo}</span>
                            )}
                            {d.val === 'queries' && <span>{unassignedCo}</span>}
                          </span>
                          {/* <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {/* {rowsCounter(leadsFetchedData, d.val).length} */}
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <div className="flex flex-row mr-4 mt-2">
                  <span
                    className="flex mt-[4px] mr-[8px] justify-center items-center w-6 h-6 bg-gradient-to-r from-violet-200 to-pink-200 rounded-full  cursor-pointer "
                    onClick={() => {
                      setHorizontalMode(!horizontalMode)
                    }}
                  >
                    <PuzzleIcon className=" w-3 h-3" />
                  </span>
                  <span
                    className="flex mt-[4px] mr-[0px] justify-center items-center w-6 h-6 bg-gradient-to-r from-violet-200 to-pink-200 rounded-full  cursor-pointer "
                    onClick={() => {
                      setSearchKeyField('')
                      setShowSettings(!showSettings)
                    }}
                  >
                    <SearchIcon className=" w-3 h-3" />
                  </span>
                </div>
              </div>
              <div
                className={`${showSettings ? 'hidden' : ''
                  } flex flex-row py-2 justify-between `}
              >
                <div className="flex flex-row w-full">
                  <span className="flex ml-2 mr-2 h-[34px]  border border-gray-300 border-solid box-border w-1/3 rounded-md">
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
                      placeholder="Search Unit No, Customer name"
                      onChange={(e) => setSearchKeyField(e.target.value)}
                      autoComplete="off"
                      value={searchKeyField}
                      className=" bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900 w-4/5 relative"
                    />
                  </span>


                  <span className="mt-2 ml-2 text-red-400 cursor-pointer text-xs" onClick={() => setSearchKeyField('')}>
                    {' '}
                    Clear
                  </span>
                </div>
                <span style={{ display: '' }}>
                  <CSVDownloader
                    className="mr-6 h-[20px] w-[20px] mt-2"
                    downloadRows={bookingReviewA}
                    style={{ height: '20px', width: '20px' }}
                  />
                </span>
              </div>
              <div className="flex px-6">
                {leadsTyper == 'inProgress' && (
                  <span className="inline-flex p-1 border bg-gray-200 rounded-md">
                    <button
                      className={`px-2 py-1  rounded ${ready ? 'bg-white shadow' : ''
                        }`}
                      onClick={() => setReady(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                        />
                      </svg>
                    </button>
                    <button
                      className={`px-2 py-1  rounded ${!ready ? 'bg-white shadow' : ''
                        }`}
                      onClick={() => setReady(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                <></>
              </div>
            </div>

            <MetaTags title="ExecutiveHome" description="ExecutiveHome page" />

            {!ready && (
              <div className="overflow-hidden  px-1 pb-1 rounded-md  ">
                <div className="flex flex-col   pb-[1px]">
                  <div className="flex flex-row pt-[1px]">
                    <span className="text-lg font-bold app-color-black"></span>
                  </div>

                  {selCategory === 'booked' && horizontalMode && (
                    <ul>
                      <li>
                        {queryResult.map((finData, c) => {
                          const {
                            uid,
                            assets,
                            customerDetailsObj,
                            selCustomerPayload,
                            assignedBy,
                            customerName1,
                            phoneNo1,
                            unit_no,
                            T_balance,
                            T_elgible,
                            T_review,
                            T_captured,
                            pId,
                            projName,
                          } = finData
                          // console.log('fin data is ', finData)
                          return (
                            <div
                              key={c}
                              className="w-3/12  relative  inline-block cursor-pointer"
                              onClick={() =>
                                viewTransaction(
                                  finData,
                                  'unit_information',
                                  'unit_information'
                                )
                              }
                            >
                              <div className="m-1  py-1 pb-3 bg-white rounded-lg border border-gray-200">
                                <section className="flex flex-row px-3  pt-2 justify-between">
                                  <div className="flex flex-row">
                                    <section className="bg-violet-100  items-center rounded-2xl shadow-xs flex flex-col px-2 py-1">
                                      <div className="font-semibold text-[#053219]  text-[22px]  mb-[1] tracking-wide">
                                        {unit_no}
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
                                        {customerDetailsObj?.customerName1 ||
                                          'NA'}
                                      </span>
                                      <div className="font text-[12px] text-gray-500 tracking-wide overflow-ellipsis overflow-hidden ">
                                        {projName}
                                      </div>
                                      <section>
                                        <span className="  text-[10px] h-[20px]  text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {finData?.area?.toLocaleString(
                                            'en-IN'
                                          )}{' '}
                                          sqft
                                        </span>

                                        <span className="  text-[10px] h-[20px] text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {finData?.facing}
                                        </span>

                                      </section>
                                    </div>
                                  </div>
                                </section>
                                <div className="flex flex-row justify-between px-4 pt-4">
                                  <section className="flex flex-col ">
                                    <div className="flex flex-row">
                                      <div className="self-stretch text-[#0E0A1F] text-sm font-medium font-outfit tracking-wide">
                                        Unit Cost
                                      </div>
                                      <div className="px-1  h-[19px] rounded justify-center items-center gap-2 flex">
                                        <div className="text-right">
                                          <span className="text-emerald-600 text-xs font-medium font-outfit tracking-wide">
                                            ▴{' '}
                                          </span>
                                          <span className="text-emerald-600 text-[9px] font-bold font-outfit tracking-wide">
                                            ₹{' '}
                                            {finData?.sqft_rate?.toLocaleString(
                                              'en-IN'
                                            )}
                                            /sqft{' '}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="self-stretch justify-start items-center gap-3 inline-flex">
                                      <div className="text-zinc-800 text-[20px] font-bold font-outfit tracking-wide">
                                        ₹
                                        {(
                                          (finData?.plotCS?.reduce(function (
                                            _this,
                                            val
                                          ) {
                                            return (
                                              _this + val.TotalNetSaleValueGsT
                                            )
                                          },
                                            0) || 0) +
                                          finData?.addChargesCS?.reduce(
                                            (partialSum, obj) =>
                                              partialSum +
                                              Number(
                                                computeTotal(
                                                  obj,
                                                  finData?.super_built_up_area ||
                                                  finData?.area
                                                    ?.toString()
                                                    ?.replace(',', '')
                                                )
                                              ),
                                            0
                                          ) || 0
                                        )?.toLocaleString('en-IN')}
                                      </div>
                                    </div>
                                  </section>

                                  <section className="flex flex-col mt-3">
                                    <div className=" text-[#0E0A1F] text-[12px]  font-normal font-outfit tracking-wide">
                                      Balance ₹
                                      {finData?.T_elgible_balance < 0 ? 0 : finData?.T_elgible_balance?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </div>
                                    <div className="text-[#0E0A1F] text-[11px] font-normal font-outfit tracking-wide">
                                      Paid: ₹
                                      {(
                                        (finData?.T_review || 0) +
                                        (finData?.T_approved || 0)
                                      )?.toLocaleString('en-IN')}
                                    </div>
                                  </section>
                                </div>

                                <div className="flex flex-row mx-3 ml-4 pt-3">
                                  {[{ item: 'Paid', value: 6 }].map(
                                    (data, i) => (
                                      <div
                                        className=" w-3/4  "
                                        style={{
                                          display: 'inline-block',
                                          alignSelf: 'flex-end',
                                        }}
                                        key={i}
                                      >
                                        <div className="">
                                          <LinearProgress
                                            sx={{
                                              backgroundColor: 'white',
                                              '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#cdc4f7',
                                              },
                                            }}
                                            variant="determinate"
                                            value={100}
                                            style={{
                                              backgroundColor: '#cdc4f7',
                                              borderRadius: '3px',
                                              borderTopRightRadius: '0px',
                                              borderBottomRightRadius: '0px',
                                              height: `${data.value}px`,
                                              width: `100%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                  {[{ item: 'Due', value: 6 }].map(
                                    (data, i) => (
                                      <div
                                        className=" w-2/4  "
                                        style={{
                                          display: 'inline-block',
                                          alignSelf: 'flex-end',
                                        }}
                                        key={i}
                                      >
                                        <div className="">
                                          <LinearProgress
                                            sx={{
                                              backgroundColor: 'white',
                                              '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#F0F4F8',
                                              },
                                            }}
                                            variant="determinate"
                                            value={100}
                                            style={{
                                              backgroundColor: '#F0F4F8',
                                              borderRadius: '3px',
                                              borderTopLeftRadius: '0px',
                                              borderBottomLeftRadius: '0px',
                                              height: `${data.value}px`,
                                              width: `100%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>

                                <div className="w-[253px] mx-4 left-[25px] mt-3 ml-4 justify-start items-center gap-2 inline-flex">
                                  <div
                                    className={`grow shrink basis-0 px-2.5 py-1.5 rounded-[16px] flex-col justify-center items-center gap-2 inline-flex ${finData?.man_cs_approval == 'approved'
                                      ? 'bg-[#CCC5F7]'
                                      : finData?.man_cs_approval == 'rejected'
                                        ? 'bg-[#ffdbdb]'
                                        : 'bg-[#F1F5F9] '
                                      }  px-1 py-1 mx-1 inline-block self-end`}
                                    style={{
                                      display: 'inline-block',
                                      alignSelf: 'flex-end',
                                    }}
                                  >
                                    <div
                                      className={`self-stretch h-4 text-center  text-xs font-medium tracking-wide`}
                                      onClick={() => {
                                        setSelUnitDetails(finData)
                                        setIsSubTopicOpen(true)
                                        setIsSubTopic('crm_cs_approval')
                                      }}
                                    >
                                      CS Approval
                                    </div>
                                  </div>
                                  <div
                                    className={`grow shrink basis-0 px-2.5 py-1.5 bg-gray-200 rounded-[16px] flex-col justify-center items-center gap-2 inline-flex ${finData?.kyc_status == 'approved'
                                      ? 'bg-[#CCC5F7]'
                                      : finData?.kyc_status == 'rejected'
                                        ? 'bg-[#ffdbdb]'
                                        : 'bg-[#F1F5F9] '
                                      }  px-1 py-1 mx-1 inline-block self-end`}
                                    style={{
                                      display: 'inline-block',
                                      alignSelf: 'flex-end',
                                    }}
                                    onClick={() => {
                                      setSelUnitDetails(finData)
                                      setIsSubTopicOpen(true)
                                      setIsSubTopic('crm_KYC')
                                    }}
                                  >
                                    <div className="self-stretch h-4 text-center text-zinc-800 text-xs font-medium font-outfit tracking-wide">
                                      KYC
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}{' '}
                      </li>
                    </ul>
                  )}
                  {['booked', 'agreement_pipeline', 'agreement', 'registered', 'construction', 'possession', 'unAssigned_crm', 'queries'].includes(selCategory) &&
                    !horizontalMode &&
                    filteredDataA.map((finData, c) => {
                      const {
                        uid,
                        assets,
                        customerDetailsObj,
                        selCustomerPayload,
                        assignedBy,
                        customerName1,
                        phoneNo1,
                        unit_no,
                        T_balance,
                        T_elgible_balance,
                        T_elgible,
                        T_review,
                        T_captured,
                        pId,
                        projName,
                      } = finData
                      return (
                        <section key={c} className=" bg-[#F6F5F8] ">

                          <section className="flex  flex-row items-center justify-center bg-[#FFFFFF] py-2 px-4 mb-2  rounded-2xl">

                            <div className=" w-[23%] ">
                              <div className="flex flex-row   ">
                                <div
                                  className="flex flex-col  text-black  py-1 rounded-sm  "
                                  onClick={() =>
                                    viewTransaction(
                                      finData,
                                      'unit_information',
                                      'unit_information'
                                    )
                                  }
                                >
                                  <section className="font-outfit flex flex-row w-[100%] justify-between">
                                    <section className="flex flex-col   w-[100%]">
                                      <section className="flex flex-row justify-between">

                                        <div className="flex flex-row w-full">
                                          <section className="bg-[#EDE9FE] items-center rounded-2xl shadow-xs flex flex-col px-2 py-1 min-w-[90px]">
                                            <div className="font-semibold text-[#053219]  text-[22px]  mb-[1] tracking-wide">
                                              {unit_no}
                                            </div>
                                            <span
                                              className={`items-center h-6   text-xs font-medium text-gray-500  rounded-full`}
                                            >
                                              Unit No
                                            </span>
                                          </section>
                                          <div className="flex flex-col w-full  ml-2 item-right  px-2  mr-2 rounded-lg">
                                            <span
                                              className={`text-[14px] font-semibold text-[#000000]`}
                                            >
                                              {customerDetailsObj?.customerName1 ||
                                                'NA'}
                                            </span>
                                            <div className="text-[12px] text-gray-500">
                                              {projName}
                                            </div>
                                            <section className="flex flex-col justify-between">
                                              {/* <span className="text-green-600 text-xs mt-1">
                                                {finData?.customerDetailsObj?.phoneNo1?.toLocaleString(
                                                  'en-IN'
                                                )}{' '}
                                              </span> */}
                                              <div className='flex gap-1 items-center text-green-600 text-[12px] mt-1'>
                                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M12.6605 13.1667H12.6668M12.6605 13.1667C12.2454 13.5783 11.493 13.4758 10.9655 13.4758C10.3178 13.4758 10.006 13.6025 9.54378 14.0647C9.15023 14.4583 8.62265 15.1667 8.00018 15.1667C7.37769 15.1667 6.85011 14.4583 6.45654 14.0647C5.99435 13.6025 5.68249 13.4758 5.03487 13.4758C4.50728 13.4758 3.75495 13.5783 3.33982 13.1667C2.92137 12.7517 3.02435 11.9963 3.02435 11.4653C3.02435 10.7943 2.8776 10.4857 2.39975 10.0079C1.68892 9.29709 1.33351 8.94164 1.3335 8.49999C1.3335 8.05835 1.68891 7.70294 2.39973 6.99212C2.8263 6.56555 3.02435 6.14286 3.02435 5.53471C3.02435 5.00711 2.92183 4.25477 3.3335 3.83964C3.74845 3.4212 4.5039 3.52418 5.03488 3.52418C5.64301 3.52418 6.06571 3.32615 6.49226 2.89959C7.20309 2.18876 7.55851 1.83334 8.00016 1.83334C8.44182 1.83334 8.79723 2.18876 9.50806 2.89959C9.93453 3.32605 10.3571 3.52418 10.9654 3.52418C11.493 3.52418 12.2454 3.42166 12.6605 3.83334C13.079 4.2483 12.976 5.00374 12.976 5.53471C12.976 6.20573 13.1227 6.51426 13.6006 6.99212C14.3114 7.70294 14.6668 8.05835 14.6668 8.49999C14.6668 8.94164 14.3114 9.29709 13.6006 10.0079C13.1227 10.4857 12.976 10.7943 12.976 11.4653C12.976 11.9963 13.079 12.7517 12.6605 13.1667Z" stroke="#1B6600" />
                                                  <path d="M6 9.09525L7.2 10.1667L10 6.83334" stroke="#1B6600" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>

                                                <span>
                                                  Booked On:{' '}
                                                  {prettyDate(
                                                    finData?.booked_on ||
                                                    finData?.ct ||
                                                    0
                                                  )}
                                                </span>
                                              </div>
                                            </section>
                                          </div>
                                        </div>
                                      </section>
                                    </section>
                                  </section>
                                </div>
                              </div>
                            </div>

                            {/* divider */}
                            <div className="h-12 border-r rounded-sm border-[#E7E7E9] mx-4"></div>



                            <div className=' w-[22%]  items-center'>




                              {/* <div className="flex flex-row mx-1 pt-">



<RoundedProgressBar
progress={
(finData?.T_approved / finData?.T_total) *
100
}

showLabels={true}
/>
</div> */}
                              <div className="flex flex-row  my-1   items-center justify-between mr-1">




                                 <RadialChart
                                 progress={
                                  (((finData?.T_review || 0) +
                                  (finData?.T_approved || 0))  / finData?.T_total) *
                                  100
                                }
                                />

                                <div className="flex  flex-col justify-between  mb-1">

                                  <section className=" flex gap-2 justify-between font-semibold text-xs m-1 w-full  ">
                                    <div className="text-[12px] text-[#0E0A1F] font-normal">
                                      Unit Cost:
                                    </div>


                                    <div className="relative flex flex-col items-center group" style={{ alignItems: 'start' }}>
                                      <div
                                        className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                        style={{ alignItems: 'start', width: '300px' }}
                                      >
                                        <span
                                          className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                          style={{
                                            color: 'white',
                                            background: '#213343',
                                            maxWidth: '300px',
                                          }}
                                        >
                                          <span className="italic">
                                          ₹{Math.round(finData?.T_total  || 0).toLocaleString('en-IN')}

                                          </span>
                                        </span>
                                        <div
                                          className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                                          style={{ background: '#213343', marginRight: '12px' }}
                                        ></div>
                                      </div>
                                      <span className="text-[#0E0A1F] font-medium text-[12px]  font-outfit tracking-wide">
                                        ₹{formatIndianNumber?.(Math.round(finData?.T_total || 0))}
                                      </span>
                                    </div>
                                  </section>



                                  <section className="flex gap-2 justify-between font-semibold text-xs m-1 w-full">

                                    <div className='flex'>

                                      <div className="h-3 w-3 bg-purple-300 mr-2"></div>

                                      <div className="text-[12px] text-[#0E0A1F] font-normal">
                                        Paid:
                                      </div>

                                    </div>



                                    <div className="relative flex flex-col items-center group" style={{ alignItems: 'start' }}>
                                      <div
                                        className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                        style={{ alignItems: 'start', width: '300px' }}
                                      >
                                        <span
                                          className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                          style={{
                                            color: 'white',
                                            background: '#213343',
                                            maxWidth: '300px',
                                          }}
                                        >
                                          <span className="italic">
                                            ₹{Math.round((finData?.T_review || 0) + (finData?.T_approved || 0)).toLocaleString('en-IN')}
                                          </span>
                                        </span>
                                        <div
                                          className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                                          style={{ background: '#213343', marginRight: '12px' }}
                                        ></div>
                                      </div>
                                      <span className="text-[#0E0A1F] font-medium text-[12px]  font-outfit tracking-wide">
                                         ₹{formatIndianNumber?.(Math.round((finData?.T_review || 0) + (finData?.T_approved || 0)))}
                                      </span>
                                    </div>

                                    {/* <div className="text-zinc-800 text-[12px]  font-outfit tracking-wide">
          ₹
          {finData?.T_elgible?.toLocaleString(
            'en-IN'
          )}
          {finData?.T_elgible && Math.round(finData.T_elgible).toLocaleString('en-IN')}

        </div> */}
                                  </section>
                                  {/* section- 3 */}
                                  <section className="flex gap-2 justify-between font-semibold text-xs m-1 w-full">

                                    <div className='flex'>
                                      <div className="h-3 w-3 bg-gray-300 mr-2"></div>

                                      <div className="text-[12px] text-[#0E0A1F] font-normal">
                                        Balance:
                                      </div>
                                    </div>

                                    <div className="relative flex flex-col items-center group" style={{ alignItems: 'start' }}>
                                      <div
                                        className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                        style={{ alignItems: 'start', width: '300px' }}
                                      >
                                        <span
                                          className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                          style={{
                                            color: 'white',
                                            background: '#213343',
                                            maxWidth: '300px',
                                          }}
                                        >
                                          <span className="italic">
                                          ₹{Math.round(finData?.T_balance || 0).toLocaleString('en-IN')}
                                          </span>
                                        </span>
                                        <div
                                          className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                                          style={{ background: '#213343', marginRight: '12px' }}
                                        ></div>
                                      </div>
                                      <span className="text-[#0E0A1F] font-medium text-[12px] font-bold  tracking-wide">
                                      ₹{formatIndianNumber?.(Math.round(finData?.T_balance || 0))}
                                      </span>
                                    </div>


                                  </section>

                                </div>


                              </div>
                            </div>




                            {/* divider */}
                            <div className="h-12 border-r  rounded-sm border-[#E7E7E9] mx-4"></div>

                            {/* other one */}

                            <div className='w-[22%] items-center '>
                              <div className="flex flex-row  my-1 items-center  justify-between mr-1">



                                {/* <RadialChart
  progress={
    (((finData?.T_review || 0) + (finData?.T_approved || 0)) / finData?.T_elgible) * 100
  }
/> */}




<SemicircleProgressChart
                                  progress={
                                    (((finData?.T_review || 0) +
                                      (finData?.T_approved || 0)) / finData?.T_elgible) *
                                    100
                                  }

                                />


                                <div className="flex flex-col justify-between  mb-1">


                                  <section className="flex gap-2 justify-between font-semibold text-xs m-1 w-full ">
                                    <div className="text-[12px] text-[#0E0A1F] font-normal">
                                      Stage Cost:
                                    </div>
                                    <div
                                      className="relative flex flex-col items-center group"
                                      style={{ alignItems: 'start' }}
                                    >
                                      <div
                                        className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                        style={{ alignItems: 'start', width: '300px' }}
                                      >
                                        <span
                                          className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                          style={{
                                            color: 'white',
                                            background: '#213343',
                                            maxWidth: '300px',
                                          }}
                                        >
                                          <span className="italic">
                                          ₹{Math.round(finData?.T_elgible || 0).toLocaleString('en-IN')}
                                          </span>
                                        </span>
                                        <div
                                          className="w-3 h-3 ml-1  -mt-2 rotate-45 bg-black"
                                          style={{ background: '#213343', marginRight: '12px' }}
                                        ></div>
                                      </div>
                                      <span className="text-[#0E0A1F] font-medium  text-[12px]  font-outfit tracking-wide ">
                                      ₹{formatIndianNumber?.(Math.round(finData?.T_elgible || 0))}

                                      </span>
                                    </div>
                                    {/* <div className="text-zinc-800 text-[12px]  font-outfit tracking-wide">
                                      ₹
                                      {finData?.T_elgible?.toLocaleString(
                                        'en-IN'
                                      )}
                                      {finData?.T_elgible && Math.round(finData.T_elgible).toLocaleString('en-IN')}

                                    </div> */}
                                  </section>

                                  <section className=" flex gap-2 justify-between font-semibold text-xs m-1 w-full  ">
                                    <div className='flex'>

                                      <div className="h-3 w-3 bg-purple-300 mr-2"></div>
                                      <div className="text-[12px] text-[#0E0A1F] font-normal">

                                        Paid:
                                        <span
                                          title={`₹ ${(
                                            finData?.T_review || 0
                                          )?.toLocaleString(
                                            'en-IN'
                                          )} is in accounts review`}
                                          className="ml-2 "
                                        >
                                          <InformationCircleIcon className="h-4 w-4 inline text-zinc-400" />
                                        </span>
                                      </div>

                                    </div>

                                    {/* <div className="text-zinc-800 text-[12px] font-bold font-outfit tracking-wide">
                                      ₹
                                      {(
                                        (finData?.T_review || 0) +
                                        (finData?.T_approved || 0)
                                      )?.toLocaleString('en-IN')}
                                    </div> */}


                                    <div className="relative flex flex-col items-center group" style={{ alignItems: 'start' }}>
                                      <div
                                        className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                        style={{ alignItems: 'start', width: '300px' }}
                                      >
                                        <span
                                          className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                          style={{
                                            color: 'white',
                                            background: '#213343',
                                            maxWidth: '300px',
                                          }}
                                        >
                                          <span className="italic">
                                        ₹{((finData?.T_review || 0) + (finData?.T_approved || 0)).toLocaleString('en-IN')}

                                          </span>
                                        </span>
                                        <div
                                          className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                                          style={{ background: '#213343', marginRight: '12px' }}
                                        ></div>
                                      </div>
                                      <span className="text-[#0E0A1F] font-medium text-[12px]  font-outfit tracking-wide">
                                      ₹{formatIndianNumber?.(Math.round((finData?.T_review || 0) + (finData?.T_approved || 0)))}
                                      </span>
                                    </div>
                                  </section>


                                  {/* section- 3 */}
                                  <section className="flex gap-2 justify-between font-semibold text-xs m-1 w-full">
                                    <div className='flex'>
                                      <div className="h-3 w-3 bg-gray-300 mr-2"></div>

                                      <div className="text-[12px] font-outfit text-[#0E0A1F] font-normal">
                                        Balance:
                                      </div>

                                    </div>

                                    <div className="text-zinc-800 text-[12px] font-bold font-outfit tracking-wide">
                                      {/* ₹ {finData?.T_elgible_balance < 0 ? 0 : Math.round(finData?.T_elgible_balance).toLocaleString('en-IN')} */}

                                      {/* <IndianCurrencyTooltip amount={(finData?.T_elgible_balance < 0 ? 0 : finData?.T_elgible_balance)?.toLocaleString("en-IN")} /> */}




                                    </div>

                                    <div className="relative flex flex-col items-center group" style={{ alignItems: 'start' }}>
                                      <div
                                        className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                        style={{ alignItems: 'start', width: '300px' }}
                                      >
                                        <span
                                          className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                          style={{
                                            color: 'white',
                                            background: '#213343',
                                            maxWidth: '300px',
                                          }}
                                        >
                                          <span className="italic">
                                            {/* {formatIndianNumber?.(Math.round((finData?.T_review || 0) + (finData?.T_approved || 0)))} */}
                                            ₹{finData?.T_elgible_balance < 0 ? 0 : Math.round(finData?.T_elgible_balance).toLocaleString('en-IN')}

                                          </span>
                                        </span>
                                        <div
                                          className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                                          style={{ background: '#213343', marginRight: '12px' }}
                                        ></div>
                                      </div>
                                      <span className="text-[#0E0A1F] font-medium text-[12px] font-outfit tracking-wide">

                                      ₹{formatIndianNumber(finData?.T_elgible_balance < 0 ? 0 : Math.round(finData?.T_elgible_balance))}

                                      </span>
                                    </div>
                                  </section>
                                </div>
                                {/* <div className="flex flex-row mx-1 pt-">
                                <RoundedProgressBar progress={
                                      (((finData?.T_review || 0) +
                                      (finData?.T_approved || 0) )/ finData?.T_elgible) *
                                      100
                                    }
                                    showLabels={true}
                                    />

                                </div> */}
                                {/*
                                <PaymentDashboard
                                progress={
                                  (((finData?.T_review || 0) +
                                  (finData?.T_approved || 0) )/ finData?.T_elgible) *
                                  100
                                }





                                /> */}

                                {/* <HalfSemiCircleGauge/> */}


                              </div>
                            </div>



                            {/* divider */}
                            <div className="h-12 border-r rounded-sm border-[#E7E7E9] mx-4"></div>

                            <div className='w-[33%]'>
                              <div className=' '>
                                <div className="">
                                <div className=' '>
                                    <div className="text-[12px]">
                                      <span className="font-medium text-[#0E0A1F]">Comments:</span>
                                      <span className="ml-2 text-[#0E0A1F] font-normal">Make a follow up call to Ram at 10am</span>
                                      <span className="ml-2 h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                                    </div>
                                    {/* <div className="text-[12px]">
                                      <span className="font-medium text-[#0E0A1F]">Last activity:</span>
                                      <span className="ml-2 text-[#0E0A1F] font-normal">180 Days</span>
                                    </div> */}
                                  </div>
                                  <div className="flex items-center mt-3  ">







                                    <div>

                                      <div className="flex">
                                        <div className="flex items-center justify-center">
                                          <div>
                                            <div className=" ">
                                              <div className="flex  items-center justify-center  h-full rounded-md ">
                                                <div className="flex items-center justify-center   pr-1">
                                                  {/* section 2 */}
                                                  {['booked', 'selCategory'].includes(selCategory) &&
                                                    <section className="flex gap-1 items-center">
                                                      {!(user?.role.includes('crm-executive')) && (
                                                        <div
                                                          className={`cursor-pointer border border-[#E7E7E9] rounded-[36px] p-[2px] pl-[3px] pr-[7px] inline-flex items-center gap-1 ${finData?.man_cs_approval == 'approved'
                                                            ? 'text-green-700'
                                                            : finData?.man_cs_approval == 'rejected'
                                                              ? 'text-red-700'
                                                              : 'text-black'
                                                            } `}
                                                          // style={{
                                                          //   display: 'inline-block',
                                                          //   alignSelf: 'flex-end',
                                                          // }}
                                                          onClick={() => {
                                                            setSelUnitDetails(finData)
                                                            setIsSubTopicOpen(true)
                                                            setIsSubTopic('crm_cs_approval')
                                                          }}
                                                        >
                                                          <div className="flex  items-center justify-center gap-1">
                                                            <div className="flex items-center justify-center">
                                                              {/* <ChartPieIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.man_cs_approval ===
                                        'approved'
                                          ? 'text-green-900'
                                          : 'text-gray-600 '
                                      }`}
                                      aria-hidden="true"
                                    /> */}                                                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                                ? 'bg-[#DFF6E0]'
                                                                : finData?.man_cs_approval == 'rejected'
                                                                  ? 'bg-[#F5E6E6]'
                                                                  : 'bg-gray-100'
                                                                }`}>


                                                                {/* <img
                                                                  alt="CRM Background"
                                                                  src="/timebox.svg"
                                                                  className="w-4 h-4"
                                                                /> */}


                                                                <img
                                                                  alt="CRM Status"
                                                                  src={
                                                                    finData?.man_cs_approval === 'approved'
                                                                      ? '/crmc.svg'
                                                                      : finData?.man_cs_approval === 'rejected'
                                                                        ? '/crmw.svg'
                                                                        : '/crmp.svg'
                                                                  }
                                                                  className="w-4 h-4"
                                                                />
                                                              </span>

                                                            </div>

                                                            <span className=" text-xs ">
                                                              Manager
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}

                                                      {/* section 3*/}
                                                      <div
                                                        className={`cursor-pointer border border-[#E7E7E9] rounded-[36px]  p-[2px] pl-[3px] pr-[7px] inline-flex items-center gap-1${finData?.kyc_status == 'approved'
                                                          ? 'text-green-700'
                                                          : finData?.kyc_status == 'rejected'
                                                            // ? 'bg-[#ffdbdb]'
                                                            // : 'bg-[#FFFFFF] '
                                                            ? 'text-red-700'
                                                            : 'text-black'
                                                          } `}
                                                        // style={{
                                                        //   display: 'inline-block',
                                                        //   alignSelf: 'flex-end',
                                                        // }}
                                                        onClick={() => {
                                                          setSelUnitDetails(finData)
                                                          setIsSubTopicOpen(true)
                                                          setIsSubTopic('crm_KYC')
                                                        }}
                                                      >
                                                        <div className="flex  items-center justify-center gap-1">
                                                          <div className="flex items-center justify-center ">
                                                            {/* <NewspaperIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.kyc_status == 'approved'
                                          ? 'bg-[#CCC5F7]'
                                          : finData?.kyc_status ==
                                            'rejected'
                                          ? 'bg-[#ffdbdb]'
                                          : 'bg-[#F1F5F9] '
                                      }`}
                                      aria-hidden="true"
                                    /> */}
                                                            {/* <img
alt="CRM Background"
src="/IconSets.svg"
className="w-4 h-4"
/> */}



                                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                              ? 'bg-[#DFF6E0]'
                                                              : finData?.man_cs_approval == 'rejected'
                                                                ? 'bg-[#F5E6E6]'
                                                                : 'bg-gray-100'
                                                              }`}>


                                                              {/* <img
                                                                alt="CRM Background"
                                                                src="/timebox.svg"
                                                                className="w-4 h-4"
                                                              /> */}

                                                              <img
                                                                alt="Status Icon"
                                                                src={
                                                                  finData?.man_cs_approval === 'approved'
                                                                    ? '/crmc.svg'
                                                                    : finData?.man_cs_approval === 'rejected'
                                                                      ? '/crmw.svg'
                                                                      : '/crmp.svg'
                                                                }
                                                                className="w-4 h-4"
                                                              />
                                                            </span>

                                                          </div>
                                                          <span className="text-xs">
                                                            KYC
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </section>}
                                                  {['agreement_pipeline'].includes(selCategory) &&
                                                    <section className='flex gap-2'>
                                                      <div
                                                        className={`cursor-pointer  border border-[#E7E7E9] rounded-[36px] p-[2px] pl-[3px] pr-[7px]  inline-flex items-center gap-1 ${finData?.man_ats_approval == 'approved'
                                                          ? 'text-green-700'
                                                          : finData?.man_ats_approval == 'rejected'
                                                            ? 'text-red-700'
                                                            : 'text-gray-600'
                                                          } `}
                                                        // style={{
                                                        //   display: 'inline-block',
                                                        //   alignSelf: 'flex-end',
                                                        // }}
                                                        onClick={() => {
                                                          setSelUnitDetails(finData)
                                                          setIsSubTopicOpen(true)
                                                          setIsSubTopic('crm_ATS_Draft')
                                                        }}
                                                      >
                                                        {/* <div className="flex flex-col items-center justify-center mr-1  mb-1 mt-[5px]">
                                  <div className="flex flex-none items-center justify-center  group-hover:bg-white">
                                  <ChartPieIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.man_ats_approval ==
                                        'approved'
                                          ? 'bg-[#CCC5F7]'
                                          : finData?.man_ats_approval ==
                                            'rejected'
                                          ? 'bg-[#ffdbdb]'
                                          : 'bg-[#F1F5F9] '
                                      }`}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <h6 className="font-bodyLato text-[#000000] text-xs mt-1 text-center">
                                  ATS Draft
                                  </h6>
                                </div> */}
                                                        <div className="flex  items-center justify-center gap-1">
                                                          <div className="flex items-center justify-center ">

                                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                              ? 'bg-[#DFF6E0]'
                                                              : finData?.man_cs_approval == 'rejected'
                                                                ? 'bg-[#F5E6E6]'
                                                                : 'bg-gray-100'
                                                              }`}>
                                                              {/* <img
                                                                alt="CRM Background"
                                                                src="/timebox.svg"
                                                                className="w-4 h-4"
                                                              /> */}

                                                              <img
                                                                alt="CRM Background"
                                                                src={
                                                                  finData?.man_cs_approval === 'approved'
                                                                    ? '/crmc.svg'
                                                                    : finData?.man_cs_approval === 'rejected'
                                                                      ? '/crmw.svg'
                                                                      : '/crmp.svg'
                                                                }
                                                                className="w-4 h-4"
                                                              />
                                                            </span>

                                                          </div>
                                                          <h6 className=" text-xs">
                                                            ATS Draft
                                                          </h6>
                                                        </div>
                                                      </div>
                                                      {/* section 3*/}
                                                      <div
                                                        className={`cursor-pointer border border-[#E7E7E9] rounded-[36px] p-[2px] pl-[3px] pr-[7px]  inline-flex items-center gap-1${finData?.kyc_status == 'approved'
                                                          ? 'text-green-700'
                                                          : finData?.kyc_status == 'rejected'
                                                            ? 'text-red-700'
                                                            : 'text-gray-600'
                                                          } `}
                                                        // style={{
                                                        //   display: 'inline-block',
                                                        //   alignSelf: 'flex-end',
                                                        // }}
                                                        onClick={() => {
                                                          setSelUnitDetails(finData)
                                                          setIsSubTopicOpen(true)
                                                          setIsSubTopic('crm_KYC')
                                                        }}
                                                      >
                                                        {/* <div className="flex flex-col items-center justify-center mr-1  mb-1 mt-[5px]">
                                  <div className="flex flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                    <NewspaperIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.kyc_status == 'approved'
                                          ? 'bg-[#CCC5F7]'
                                          : finData?.kyc_status ==
                                            'rejected'
                                          ? 'bg-[#ffdbdb]'
                                          : 'bg-[#F1F5F9] '
                                      }`}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <h6 className="font-bodyLato text-[#000000] text-xs mt-1">
                                    KYC
                                  </h6>
                                </div> */}

                                                        <div className="flex  items-center justify-center gap-1">
                                                          {/* <div className="flex items-center justify-center  p-1">
  <img
    alt="CRM Background"
    src="/manager.svg"
    className="block"
  />
</div> */}
                                                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                            ? 'bg-[#DFF6E0]'
                                                            : finData?.man_cs_approval == 'rejected'
                                                              ? 'bg-[#F5E6E6]'
                                                              : 'bg-gray-100'
                                                            }`}>
                                                            {/* <img
                                                              alt="CRM Background"
                                                              src="/timebox.svg"
                                                              className="w-4 h-4"
                                                            /> */}

                                                            <img
                                                              alt="CRM Status"
                                                              src={
                                                                finData?.man_cs_approval === 'approved'
                                                                  ? '/crmc.svg'
                                                                  : finData?.man_cs_approval === 'rejected'
                                                                    ? '/crmw.svg'
                                                                    : '/crmp.svg'
                                                              }
                                                              className="w-4 h-4"
                                                            />
                                                          </span>
                                                          <h6 className="font-bodyLato text-[#000000] text-xs">
                                                            KYC
                                                          </h6>
                                                        </div>
                                                      </div>
                                                    </section>}
                                                  {['agreement'].includes(selCategory) &&
                                                    <section className='flex gap-2 '>
                                                      <div
                                                        className={`cursor-pointer border border-[#E7E7E9] rounded-[36px] p-[2px] pl-[3px] pr-[7px] inline-flex items-center gap-1 ${finData?.both_sd_approval == 'approved'
                                                          ? 'text-green-700'
                                                          : finData?.both_sd_approval == 'rejected'
                                                            ? 'text-red-700'
                                                            : 'text-gray-600'
                                                          } `}
                                                        // style={{
                                                        //   display: 'inline-block',
                                                        //   alignSelf: 'flex-end',
                                                        // }}
                                                        onClick={() => {
                                                          setSelUnitDetails(finData)
                                                          setIsSubTopicOpen(true)
                                                          setIsSubTopic('crm_SD_Approval')
                                                        }}
                                                      >
                                                        {/* <div className="flex flex-col items-center justify-center mr-1  mb-1 mt-[5px]">
                                  <div className="flex flex-none items-center justify-center  group-hover:bg-white">
                                    <ChartPieIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.both_sd_approval ===
                                        'approved'
                                          ? 'text-green-900'
                                          : 'text-gray-600 '
                                      }`}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <h6 className="font-bodyLato text-[#000000] text-xs mt-1 text-center">
                                    SD Approval
                                  </h6>
                                </div> */}

                                                        <div className="flex  items-center justify-center gap-1">
                                                          {/* <div className="flex items-center justify-center  p-1">
  <img
    alt="CRM Background"
    src="/manager.svg"
    className="block"
  />
</div> */}
                                                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                            ? 'bg-[#DFF6E0]'
                                                            : finData?.man_cs_approval == 'rejected'
                                                              ? 'bg-[#F5E6E6]'
                                                              : 'bg-gray-100'
                                                            }`}>
                                                            {/* <img
                                                              alt="CRM Background"
                                                              src="/timebox.svg"
                                                              className="w-4 h-4"
                                                            /> */}

                                                            <img
                                                              alt="CRM Status"
                                                              src={
                                                                finData?.man_cs_approval === 'approved'
                                                                  ? '/crmc.svg'
                                                                  : finData?.man_cs_approval === 'rejected'
                                                                    ? '/crmw.svg'
                                                                    : '/crmp.svg'
                                                              }
                                                              className="w-4 h-4"
                                                            />
                                                          </span>
                                                          <h6 className="text-xs">
                                                            SD Approval
                                                          </h6>
                                                        </div>
                                                      </div>
                                                      {/* section 3*/}
                                                      <div
                                                        className={`cursor-pointer border border-[#E7E7E9] rounded-[36px] p-[2px] pl-[3px] pr-[7px]  inline-flex items-center gap-1${finData?.LpostStatus == 'Approved'
                                                          ? 'text-green-700'
                                                          : finData?.LpostStatus == 'Rejected'
                                                            ? 'text-red-700'
                                                            : 'text-gray-600'
                                                          }  `}
                                                        // style={{
                                                        //   display: 'inline-block',
                                                        //   alignSelf: 'flex-end',
                                                        // }}
                                                        onClick={() => {
                                                          setSelUnitDetails(finData)
                                                          setIsSubTopicOpen(true)
                                                          setIsSubTopic('crm_loan')
                                                        }}
                                                      >
                                                        {/* <div className="flex flex-col items-center justify-center mr-1  mb-1 mt-[5px]">
                                  <div className="flex flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                    <NewspaperIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.kyc_status == 'approved'
                                          ? 'bg-[#CCC5F7]'
                                          : finData?.kyc_status ==
                                            'rejected'
                                          ? 'bg-[#ffdbdb]'
                                          : 'bg-[#F1F5F9] '
                                      }`}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <h6 className="font-bodyLato text-[#000000] text-xs mt-1">
                                    Loan
                                  </h6>
                                </div> */}
                                                        <div className="flex  items-center justify-center gap-1">
                                                          {/* <div className="flex items-center justify-center  p-1">
  <img
    alt="CRM Background"
    src="/manager.svg"
    className="block"
  />
</div> */}


                                                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                            ? 'bg-[#DFF6E0]'
                                                            : finData?.man_cs_approval == 'rejected'
                                                              ? 'bg-[#F5E6E6]'
                                                              : 'bg-gray-100'
                                                            }`}>
                                                            {/* <img
                                                              alt="CRM Background"
                                                              src="/timebox.svg"
                                                              className="w-4 h-4"
                                                            /> */}

                                                            <img
                                                              alt="CRM Status"
                                                              src={
                                                                finData?.man_cs_approval === 'approved'
                                                                  ? '/crmc.svg'
                                                                  : finData?.man_cs_approval === 'rejected'
                                                                    ? '/crmw.svg'
                                                                    : '/crmp.svg'
                                                              }
                                                              className="w-4 h-4"
                                                            />
                                                          </span>
                                                          <h6 className="font-bodyLato text-[#000000] text-xs">
                                                            Loan
                                                          </h6>
                                                        </div>
                                                      </div>
                                                    </section>}
                                                  {['registered', 'possession'].includes(selCategory) &&
                                                    <section className='flex gap-2'>
                                                      <div
                                                        className={`cursor-pointer border border-[#E7E7E9] rounded-[36px] p-[2px] pl-[3px] pr-[7px]  inline-flex items-center gap-1${finData?.both_sd_approval == 'approved'
                                                          ? 'text-green-700'
                                                          : finData?.both_sd_approval == 'rejected'
                                                            ? 'text-red-700'
                                                            : 'text-gray-600'
                                                          } `}
                                                        // style={{
                                                        //   display: 'inline-block',
                                                        //   alignSelf: 'flex-end',
                                                        // }}
                                                        onClick={() => {
                                                          setSelUnitDetails(finData)
                                                          setIsSubTopicOpen(true)
                                                          setIsSubTopic('crm_posession')
                                                        }}
                                                      >
                                                        {/* <div className="flex flex-col items-center justify-center mr-1  mb-1 mt-[5px]">
                                  <div className="flex flex-none items-center justify-center  group-hover:bg-white">
                                    <ChartPieIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.both_sd_approval ===
                                        'approved'
                                          ? 'text-green-900'
                                          : 'text-gray-600 '
                                      }`}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <h6 className="font-bodyLato text-[#000000] text-xs mt-1">
                                  Posession
                                  </h6>
                                </div> */}
                                                        <div className="flex  items-center justify-center gap-1">
                                                          {/* <div className="flex items-center justify-center  p-1">
  <img
    alt="CRM Background"
    src="/manager.svg"
    className="block"
  />
</div> */}


                                                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                            ? 'bg-[#DFF6E0]'
                                                            : finData?.man_cs_approval == 'rejected'
                                                              ? 'bg-[#F5E6E6]'
                                                              : 'bg-gray-100'
                                                            }`}>
                                                            {/* <img
                                                              alt="CRM Background"
                                                              src="/timebox.svg"
                                                              className="w-4 h-4"
                                                            /> */}

                                                            <img
                                                              alt="CRM Status"
                                                              src={
                                                                finData?.man_cs_approval === 'approved'
                                                                  ? '/crmc.svg'
                                                                  : finData?.man_cs_approval === 'rejected'
                                                                    ? '/crmw.svg'
                                                                    : '/crmp.svg'
                                                              }
                                                              className="w-4 h-4"
                                                            />
                                                          </span>
                                                          <h6 className="font-bodyLato text-[#000000] text-xs">
                                                            Posession
                                                          </h6>
                                                        </div>
                                                      </div>
                                                      {/* section 3*/}
                                                      <div
                                                        className={`cursor-pointer border border-[#E7E7E9] rounded-[36px] p-[2px] pr-[7px] inline-flex items-center gap-1${finData?.kyc_status == 'approved'
                                                          ? 'text-green-700'
                                                          : finData?.kyc_status == 'rejected'
                                                            ? 'text-red-700'
                                                            : 'text-gray-600'
                                                          } `}
                                                        // style={{
                                                        //   display: 'inline-block',
                                                        //   alignSelf: 'flex-end',
                                                        // }}
                                                        onClick={() => {
                                                          setSelUnitDetails(finData)
                                                          setIsSubTopicOpen(true)
                                                          setIsSubTopic('crm_loan')
                                                        }}
                                                      >
                                                        {/* <div className="flex flex-col items-center justify-center mr-1  mb-1 mt-[5px]">
                                  <div className="flex flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                    <NewspaperIcon
                                      className={`h-4 w-4 text-gray-600 group-hover:text-indigo-600 hover:text-green-600 ${
                                        finData?.kyc_status == 'approved'
                                          ? 'bg-[#CCC5F7]'
                                          : finData?.kyc_status ==
                                            'rejected'
                                          ? 'bg-[#ffdbdb]'
                                          : 'bg-[#F1F5F9] '
                                      }`}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <h6 className="font-bodyLato text-[#000000] text-xs mt-1">
                                    Loan
                                  </h6>
                                </div> */}


                                                        <div className="flex  items-center justify-center gap-1">
                                                          {/* <div className="flex items-center justify-center  p-1">
  <img
    alt="CRM Background"
    src="/manager.svg"
    className="block"
  />
</div> */}
                                                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${finData?.man_cs_approval == 'approved'
                                                            ? 'bg-[#DFF6E0]'
                                                            : finData?.man_cs_approval == 'rejected'
                                                              ? 'bg-[#F5E6E6]'
                                                              : 'bg-gray-100'
                                                            }`}>
                                                            {/* <img
                                                              alt="CRM Background"
                                                              src="/timebox.svg"
                                                              className="w-4 h-4"
                                                            /> */}

                                                            <img
                                                              alt="CRM Status"
                                                              src={
                                                                finData?.man_cs_approval === 'approved'
                                                                  ? '/crmc.svg'
                                                                  : finData?.man_cs_approval === 'rejected'
                                                                    ? '/crmw.svg'
                                                                    : '/crmp.svg'
                                                              }
                                                              className="w-4 h-4"
                                                            />
                                                          </span>
                                                          <h6 className="font-bodyLato text-[#000000] text-xs">
                                                            Loan
                                                          </h6>
                                                        </div>
                                                      </div>
                                                    </section>}
                                                  {/* section 4*/}
                                                </div>
                                              </div>
                                            </div>
                                          </div>


                                          {/* <div className='flex items-center cursor-pointer border justify-center rounded-md'>
           Call
        </div> */}


                                        </div>

                                        {/* <div className="flex items-center cursor-pointer border justify-center py-[3px] px-2  rounded-md">
          <PhoneCall className="h-4 w-4" />
          <p className="ml-1 text-[12px]">Call</p>
        </div> */}


                                        <div
                                          className="cursor-pointer border border-[#E7E7E9] rounded-[36px] p-[2px] pl-[3px] pr-[7px]  inline-flex items-center gap-1"
                                          onClick={() => {
                                            setSelUnitDetails(finData);
                                            setIsSubTopicOpen(true);
                                            setIsSubTopic('crm_call');
                                          }}
                                        >
                                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                                            <img
                                              alt="CRM Background"
                                              src="/timebox.svg"
                                              className="w-4 h-4"
                                            />
                                          </span>
                                          <span className="font-bodyLato text-xs">Call</span>
                                        </div>


                                        {/*
<div className="flex items-center cursor-pointer border border-blue-500 bg-blue-50 justify-center  rounded-md">
  <PhoneCall className="h-3 w-3 text-blue-600" />
  <p className="ml-1 text-[11px] text-blue-600 font-medium">Call</p>
</div> */}
                                      </div>
                                    </div>

                                    <div className="flex items-center border border-[#E7E7E9] rounded-full p-[2px] pr-[7px] w-fit ml-1">
                                      {finData?.assignedToObj?.label ? (
                                        // Show first letter of name
                                        <div className="w-6 h-6 bg-[#ccc] rounded-full flex items-center justify-center text-white text-xs font-medium">
                                          {finData.assignedToObj.label.charAt(0).toUpperCase()}
                                        </div>
                                      ) : (
                                        // Show empty avatar for unassigned
                                        <div className="w-6 h-6 bg-[#ccc] rounded-full flex items-center justify-center text-white text-xs font-medium">
                                          NA
                                        </div>
                                      )}
                                      <span className="text-[#0E0A1F] font-medium text-[14px] ml-2 min-w-[80px]">
                                        {finData?.assignedToObj?.label || finData?.assignedBy || 'Unassigned'}
                                      </span>
                                    </div>
                                  </div>

                                </div>

                              </div>
                            </div>




                          </section>
                        </section>
                      )
                    })}
                  {selCategory === 'unAssigned_crm' &&
                    crmCustomersDBData.map((finData, t) => {
                      const {
                        uid,
                        assets,
                        customerDetailsObj,
                        customerName1,
                        phoneNo1,
                        AssignedBy,
                        unit_no,
                        T_balance,
                        T_elgible,
                        pId,
                        projName,
                      } = finData
                      return (
                        <section
                          key={t}
                          className="border mb-1 bg-[#f2f3f8] shadow rounded-md  shadow"
                        >
                          <section className="flex flex-row">
                            <div className="">
                              <div className="flex flex-row  mt- mr-[1px] py-1">
                                <div
                                  className="flex flex-col bg-gradient-to-r from-[#A798FF] to-[#c8c2f1] text-black p-2 rounded-sm py-4 w-[240px] h-[82px] ml-1"
                                  onClick={() =>
                                    viewTransaction(
                                      finData,
                                      'unit_information',
                                      'unit_information'
                                    )
                                  }
                                >
                                  <section className="flex flex-row">
                                    {/* <img
                                      className="w-10 h-10 mr-2"
                                      alt=""
                                      src="/apart.svg"
                                    ></img> */}
                                    <section className="flex flex-col ml-2">
                                      <span className="font-semibold text-sm app-color-black">
                                        {/* {finData?.[`${assets[0]}_unitDetails`]
                                          ?.unit_no || ''} */}
                                        {unit_no}
                                      </span>
                                      <span className="text-xs">
                                        {customerDetailsObj?.customerName1 ||
                                          'NA'}
                                      </span>
                                      <span className="font-normal text-xs app-color-gray-1">
                                        {projName}
                                      </span>
                                    </section>
                                  </section>
                                  {/* <span className="font-normal text-xs app-color-gray-1">
                                  {finData?.ph}
                                </span> */}
                                </div>
                              </div>
                            </div>
                            <div className="w-3/4 bg-[#f2f3f8] px-1">
                              {' '}
                              <Box>
                                <>
                                  <div className="flex flex-col bg-white shadow rounded-md my-1  px-2  py-2 min-w-[180px]">
                                    <div className="flex flex-row justify-between mx-1">
                                      <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
                                        {T_elgible}
                                      </h6>
                                      <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
                                        {T_balance}
                                      </h6>
                                    </div>
                                    <div className="flex flex-row mx-1">
                                      {[{ item: 'Total', value: 6 }].map(
                                        (data, u) => (
                                          <div
                                            className=" w-3/4  "
                                            style={{
                                              display: 'inline-block',
                                              alignSelf: 'flex-end',
                                            }}
                                            key={u}
                                          >
                                            <div className="">
                                              <LinearProgress
                                                sx={{
                                                  backgroundColor: 'white',
                                                  '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#A798FF',
                                                  },
                                                }}
                                                variant="determinate"
                                                value={100}
                                                style={{
                                                  backgroundColor: '#E5EAF2',
                                                  borderRadius: '3px',
                                                  borderTopRightRadius: '0px',
                                                  borderBottomRightRadius:
                                                    '0px',
                                                  height: `${data.value}px`,
                                                  width: `100%`,
                                                }}
                                              />
                                            </div>
                                            <div className="flex  justify-left mr-1  mb-1 mt-[4px]">
                                              <h6 className="font-bodyLato font-semibold text-xs mt-1">
                                                {data.item}
                                              </h6>
                                            </div>
                                          </div>
                                        )
                                      )}
                                      {[{ item: 'Due', value: 6 }].map(
                                        (data, v) => (
                                          <div
                                            className=" w-2/4  "
                                            style={{
                                              display: 'inline-block',
                                              alignSelf: 'flex-end',
                                            }}
                                            key={v}
                                          >
                                            <div className="">
                                              <LinearProgress
                                                sx={{
                                                  backgroundColor: 'white',
                                                  '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#E87F7F',
                                                  },
                                                }}
                                                variant="determinate"
                                                value={100}
                                                style={{
                                                  backgroundColor: '#E87F7F',
                                                  borderRadius: '3px',
                                                  borderTopLeftRadius: '0px',
                                                  borderBottomLeftRadius: '0px',
                                                  height: `${data.value}px`,
                                                  width: `100%`,
                                                }}
                                              />
                                            </div>
                                            <div className="flex  justify-end mr-1  mb-1 mt-[4px]">
                                              <h6 className="font-bodyLato font-semibold text-xs mt-1">
                                                {data.item}
                                              </h6>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </>
                              </Box>
                            </div>
                            <div className="w-2/4 bg-[#f2f3f8] px-1">
                              <div className="flex flex-col bg-white shadow rounded-md my-1  px-2  py-2">
                                <div className="flex flex-row justify-between px-1">
                                  <div
                                    className=" w-[100px] bg-[#F1F5F9] px-1 py-1 mx-1 inline-block self-end"
                                    style={{
                                      display: 'inline-block',
                                      alignSelf: 'flex-end',
                                    }}
                                  >
                                    <div className="flex flex-col items-center justify-center mr-1  mb-1 mt[2px]">
                                      <div className="flex flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <ChartPieIcon
                                          className="h-4 w-4 text-gray-600 group-hover:text-indigo-600"
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <h6 className="font-bodyLato text-[#000000] text-xs mt-1">
                                        {'Payment'}
                                      </h6>
                                    </div>
                                  </div>
                                  {[
                                    {
                                      item: 'Payment',
                                      value: 78,
                                      icon: ChartPieIcon,
                                    },
                                    {
                                      item: 'Manager',
                                      value: 78,
                                      icon: ChartPieIcon,
                                    },
                                    {
                                      item: 'KYC ',
                                      value: 38,
                                      icon: NewspaperIcon,
                                    },
                                    // {
                                    //   item: 'Welcome ',
                                    //   value: 58,
                                    //   icon: ChartPieIcon,
                                    // },
                                  ].map((data, w) => (
                                    <div
                                      className=" w-[100px] bg-[#F1F5F9] px-1 py-1 mx-1 inline-block self-end"
                                      style={{
                                        display: 'inline-block',
                                        alignSelf: 'flex-end',
                                      }}
                                      key={w}
                                    >
                                      <div className="flex flex-col items-center justify-center mr-1  mb-1 mt[2px]">
                                        <div className="flex flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                          <data.icon
                                            className="h-4 w-4 text-gray-600 group-hover:text-indigo-600"
                                            aria-hidden="true"
                                          />
                                        </div>
                                        <h6 className="font-bodyLato text-[#000000] text-xs mt-1">
                                          {data.item}
                                        </h6>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="w-2/4 bg-[#f2f3f8] px-1">
                              <div className="flex flex-col bg-white shadow rounded-md my-1  px-2  py-2">
                                <div className="flex flex-row justify-between px-1">
                                  {[
                                    {
                                      item: 'CS Customer Approval',
                                      value: 78,
                                      icon: ChartPieIcon,
                                    },

                                    {
                                      item: 'Loan',
                                      value: 38,
                                      icon: NewspaperIcon,
                                    },
                                  ].map((data, a) => (
                                    <div
                                      className=" w-[180px] bg-[#F1F5F9] px-1 py-1 mx-1 inline-block self-end"
                                      style={{
                                        display: 'inline-block',
                                        alignSelf: 'flex-end',
                                      }}
                                      key={a}
                                    >
                                      <div className="flex flex-col items-center justify-center mr-1  mb-1 mt[2px]">
                                        <div className="flex flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                          <data.icon
                                            className="h-4 w-4 text-gray-600 group-hover:text-indigo-600"
                                            aria-hidden="true"
                                          />
                                        </div>
                                        <h6 className="font-bodyLato text-[#000000] text-xs mt-1">
                                          {data.item}
                                        </h6>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </section>
                        </section>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SiderForm
        open={isUnitDetailsOpen}
        setOpen={setisUnitDetailsOpen}
        title={'unitDetails_crm_view'}
        customerDetails={selUnitDetails}
        setSelUnitDetails={setSelUnitDetails}
        widthClass="max-w-7xl"
        transactionData={transactionData}
        unitsViewMode={false}
        selCustomerPayload={selUnitDetails}
        selSubMenu={selSubMenu}
        selSubMenu2={selSubMenu1}
      />
      <CrmSiderForm
        open={isSubTopicOpen}
        setOpen={setIsSubTopicOpen}
        title={isSubTopic}
        customerDetails={selUnitDetails}
        widthClass="max-w-6xl"
        transactionData={transactionData}
        unitsViewMode={false}
        selUnitPayload={selUnitDetails}
        selSubMenu={selSubMenu}
        selSubMenu2={selSubMenu1}
      />
    </>
  )
}

export default CrmRegisterModeHome
