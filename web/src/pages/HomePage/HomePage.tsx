import { useState, useEffect } from 'react'
import { PencilIcon } from '@heroicons/react/outline'
import { usePageLoadingContext } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import MarkeingMessagesList from 'src/components/A_ProjModule/MarketingMessagesList'
import ProjectMastersSetupHome from 'src/components/A_ProjModule/ProjectMastersSetup'
import ProjectReportsBody from 'src/components/A_ProjModule/ProjectReports'
import ProjectsTaskHome from 'src/components/A_ProjModule/ProjTaskHome'
import SlimSideMenuBar from 'src/components/A_SideMenu/slimSideMenu'
import AllBankDetailsView from 'src/components/All_BankDetailsView'
import { CountUpComp } from 'src/components/comps/countUpComp'
import HeadNavBar2 from 'src/components/HeadNavBar/HeadNavBar2'
import ProjectsUnitInventory from 'src/components/projectUnitsInventory'
import { getAllProjects, getSalesReportsData } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import DummyBodyLayout from '../../components/DummyBodyLayout/DummyBodyLayout'
import ProjectsMHomeBody from '../../components/ProjectsMHomeBody/ProjectsMHomeBody'
import SiderForm from '../../components/SiderForm/SiderForm'
import ProfileSummary from 'src/components/A_SalesModule/Reports/profileSummary'





const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { orgId } = user || {}
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
  const [project, setProject] = useState({})
  const handleNewProjectClose = () => setIsNewProjectOpen(false)
  const handleEditProjectClose = () => setIsEditProjectOpen(false)
  const [projects, setProjects] = useState([])
  const [salesReportsDbData, setSalesReportsDbData] = useState([])
  const [viewable, setViewable] = useState('ongoing_projects')
  const { loading } = usePageLoadingContext()
  const [selModule, setSelModule] = useState('Projects')

  const getProjects = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setProjects(projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }

  const getSalesReportsDataFun = async () => {
    const unsubscribe = getSalesReportsData(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setSalesReportsDbData(projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }

  const data = [
    {
      Lead_Status: 'NEW',
      'vertex aprtments': 151,
      'hot dogColor': 'hsl(17, 70%, 50%)',
      'subha EcoStone': 81,
      burgerColor: 'hsl(279, 70%, 50%)',
      'vertex villas': 126,
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Subha Gruha Kalpa Plots': 146,
      kebabColor: 'hsl(339, 70%, 50%)',
      'Vintage Villas': 165,
      friesColor: 'hsl(160, 70%, 50%)',
      'Dream Space': 37,
      donutColor: 'hsl(277, 70%, 50%)',
    },

    {
      Lead_Status: 'VISIT DONE',
      'vertex aprtments': 28,
      'hot dogColor': 'hsl(271, 70%, 50%)',
      'subha EcoStone': 54,
      burgerColor: 'hsl(262, 70%, 50%)',
      'vertex villas': 91,
      sandwichColor: 'hsl(199, 70%, 50%)',
      'Subha Gruha Kalpa Plots': 95,
      kebabColor: 'hsl(193, 70%, 50%)',
      'Vintage Villas': 76,
      friesColor: 'hsl(28, 70%, 50%)',
      'Dream Space': 49,
      donutColor: 'hsl(163, 70%, 50%)',
    },
    {
      Lead_Status: 'NEGOTIATION',
      'vertex aprtments': 59,
      'hot dogColor': 'hsl(92, 70%, 50%)',
      'subha EcoStone': 132,
      burgerColor: 'hsl(133, 70%, 50%)',
      'vertex villas': 86,
      sandwichColor: 'hsl(31, 70%, 50%)',
      'Subha Gruha Kalpa Plots': 60,
      kebabColor: 'hsl(161, 70%, 50%)',
      'Vintage Villas': 22,
      friesColor: 'hsl(352, 70%, 50%)',
      'Dream Space': 186,
      donutColor: 'hsl(199, 70%, 50%)',
    },
    {
      Lead_Status: 'RNR',
      'vertex aprtments': 97,
      'hot dogColor': 'hsl(343, 70%, 50%)',
      'subha EcoStone': 115,
      burgerColor: 'hsl(197, 70%, 50%)',
      'vertex villas': 38,
      sandwichColor: 'hsl(26, 70%, 50%)',
      'Subha Gruha Kalpa Plots': 147,
      kebabColor: 'hsl(184, 70%, 50%)',
      'Vintage Villas': 119,
      friesColor: 'hsl(68, 70%, 50%)',
      'Dream Space': 136,
      donutColor: 'hsl(38, 70%, 50%)',
    },
    {
      Lead_Status: 'NOT INTERESTED',
      'vertex aprtments': 130,
      'hot dogColor': 'hsl(70, 70%, 50%)',
      'subha EcoStone': 46,
      burgerColor: 'hsl(355, 70%, 50%)',
      'vertex villas': 145,
      sandwichColor: 'hsl(120, 70%, 50%)',
      'Subha Gruha Kalpa Plots': 168,
      kebabColor: 'hsl(338, 70%, 50%)',
      'Vintage Villas': 130,
      friesColor: 'hsl(204, 70%, 50%)',
      'Dream Space': 71,
      donutColor: 'hsl(28, 70%, 50%)',
    },
    {
      Lead_Status: 'DEAD',
      'vertex aprtments': 67,
      'hot dogColor': 'hsl(22, 70%, 50%)',
      'subha EcoStone': 38,
      burgerColor: 'hsl(26, 70%, 50%)',
      'vertex villas': 111,
      sandwichColor: 'hsl(345, 70%, 50%)',
      'Subha Gruha Kalpa Plots': 104,
      kebabColor: 'hsl(294, 70%, 50%)',
      'Vintage Villas': 180,
      friesColor: 'hsl(66, 70%, 50%)',
      'Dream Space': 72,
      donutColor: 'hsl(202, 70%, 50%)',
    },
    {
      Lead_Status: 'BOOKED',
      'vertex aprtments': 159,
      'hot dogColor': 'hsl(332, 70%, 50%)',
      'subha EcoStone': 113,
      burgerColor: 'hsl(268, 70%, 50%)',
      'vertex villas': 4,
      sandwichColor: 'hsl(209, 70%, 50%)',
      'Subha Gruha Kalpa Plots': 6,
      kebabColor: 'hsl(229, 70%, 50%)',
      'Vintage Villas': 55,
      friesColor: 'hsl(216, 70%, 50%)',
      'Dream Space': 88,
      donutColor: 'hsl(149, 70%, 50%)',
    },
  ]

  const data1 = [
    {
      Lead_Status: 'JAN',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'FEB',
      facebook: 15100,
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: 8100,
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': 126000,
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': 1460,
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': 1650,
      friesColor: 'hsl(160, 70%, 50%)',
      Others: 370,
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'MAR',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'APR',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'MAY',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'JUN',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'JUL',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'AUG',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'SEP',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'OCT',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'NOV',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
    {
      Lead_Status: 'DEC',
      facebook: Math.floor(Math.random() * 15100),
      'facebook dogColor': 'hsl(17, 70%, 50%)',
      Instagram: Math.floor(Math.random() * 8100),
      burgerColor: 'hsl(279, 70%, 50%)',
      'Google Adwords': Math.floor(Math.random() * 126000),
      sandwichColor: 'hsl(358, 70%, 50%)',
      'Housing.com': Math.floor(Math.random() * 1460),
      kebabColor: 'hsl(339, 70%, 50%)',
      'News Paper': Math.floor(Math.random() * 1650),
      friesColor: 'hsl(160, 70%, 50%)',
      Others: Math.floor(Math.random() * 370),
      donutColor: 'hsl(277, 70%, 50%)',
    },
  ]
  useEffect(() => {
    getProjects()
    getSalesReportsDataFun()
  }, [])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      <div className="flex w-screen h-screen text-gray-700">
        <div className="flex flex-col flex-grow">
          {/* <HeadNavBar /> */}
          <div className="flex overflow-y-hidden flex-row overflow-auto h-[100vh]   text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            {/* <HeadSideBar pgName={'home'} /> */}
            <SlimSideMenuBar
              pgName={'projectModule'}
              sourceLink={'projectModule'}
              showSideView1={undefined}
              setViewable={setViewable}
              viewable={viewable}
            />

            <div className="flex-grow   items-center overflow-y-auto no-scrollbar  h-[98%]  px-300  pt-300">
              <HeadNavBar2 selModule={selModule} setSelModule={setSelModule}   setViewable={setViewable}/>
             {viewable === 'userProfile' && <ProfileSummary />}

              {viewable === 'Setup' && (
                <>
                {/*Sales Executive Notifications border */}

                  <div className="mt-1 mx-1">
                    <section className="w-full py-4  leading-7 text-gray-900 bg-white  rounded-md">
                      <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-7xl mx-auto px-6 py-8 ">
                        <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
                          <ProjectMastersSetupHome
                            title={'WhatsApp Message Templates'}
                          />
                        </div>
                      </div>

                    </section>
                  </div>
                </>
              )}
                 {viewable === 'Marketing' && (
                <>
                {/*Sales Executive Notifications border */}
                  <div className="mt-1 mx-1">
                    <section className="w-full py-4  leading-7 text-gray-900 bg-white  rounded-md">
                      <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-7xl mx-auto px-6 py-8 ">
                        <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
                          <MarkeingMessagesList
                            title={'WhatsApp Message Templates'}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              )}
              {viewable === 'projectReports' && (
                <>
                  <div className="mt-1 mx-1">
                    <section className="w-full py-4  leading-7 text-gray-900 bg-white  rounded-md">
                      <div className="box-border px-2 mx-auto border-solid  max-w-full mx-auto px-6 py-8 ">
                        <div className="flex flex-col   leading-7  text-gray-900 border-0 border-gray-200 ">
                          <ProjectReportsBody
                            title={'WhatsApp Message Templates'}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              )}
              {(viewable === 'Bank Accounts' ||
                viewable === 'Virtual Accounts') && (
                <>
                  <div className="mt-1">
                    {/* <div className="flex items-center justify-between py-2  ">
                      <span className="relative z-10 flex items-center w-auto text-2xl font-bold leading-none pl-0">
                        {viewable}
                      </span>
                      <button className="flex items-center justify-center h-10 px-4  bg-transparent ml-auto text-sm font-medium rounded hover:bg-transparent"></button>
                    </div> */}
                  </div>

                  <div className='ml-1'>
                    <section className="w-full py-8 mb-8 leading-7 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-18 rounded-lg">
                      <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-7xl mx-auto px-6 py-8 ">
                        <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
                          <div className="flex items-center flex-shrink-0  px-0  pl-0 border-b border-grey  mb-2">
                            <span className="flex items-center">
                              <img
                                className="w-16 h-16"
                                alt=""
                                src="/apart.svg"
                              ></img>
                              <span className="relative z-10 flex items-center w-auto text-4xl font-bold leading-none pl-0 mt-[18px]">
                                {viewable}
                              </span>
                            </span>
                            <section className="flex ml-auto mt-[18px]">
                              <button>
                                <span className="flex ml-2 items-center h-7 px-3  text-xs font-medium text-[#fff] bg-[#0891B2] rounded-full">
                                  <PencilIcon
                                    className="h-5 w-4  font-medium mr-1"
                                    aria-hidden="true"
                                  />
                                  Edit
                                </span>
                              </button>
                            </section>
                          </div>
                          <AllBankDetailsView  title={'Bank Accounts'} />
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              )}
              {(viewable === 'Home' || viewable === 'MyProjectTasks') && (
                <ProjectsTaskHome leadsTyper={undefined} />
              )}
              {viewable != 'inProgress' &&
                viewable != 'Home' &&
                viewable != 'MyProjectTasks' &&
                viewable != 'Projects Lead Report' &&
                viewable != 'Campaign Budget Report' &&
                viewable != 'Bank Accounts' &&
                viewable != 'Virtual Accounts' &&
                viewable != 'unitsInventory' &&
                viewable != 'Setup' &&
                viewable != 'Marketing' &&
                viewable != 'projectReports' && viewable != 'userProfile' && (
                  <>
                    <div className="">
                      <div className="flex items-center justify-between mt-1   pb-8 ">
                        <div className="w-full flex-grow   items-center  bg-blue h-[98%]  py-300 ">
                          <div className="px-1">
                            {viewable != 'inProgress' &&
                              viewable != 'Projects Lead Report' &&
                              viewable != 'Campaign Budget Report' &&
                              viewable != 'Bank Accounts' &&
                              viewable != 'Virtual Accounts' &&
                              viewable != 'unitsInventory' && (
                                <>
                                  <section className="bg-white py-4 px-4 flex flex-row rounded-sm">
                                    <section className="w-[25%]">
                                      <span className="text-slate-600 text-lg font-medium">
                                        Projects
                                      </span>
                                      <div className="w-[299.02px] h-[0px] border border-stone-300 mt-2"></div>
                                      <section className="flex flex-row">
                                        <div className="text-sky-950 text-5xl font-semibold font-['Manrope'] leading-[80px]">
                                          {/* {projects?.length} */}
                                          <CountUpComp
                                            value={projects?.length}
                                          />
                                        </div>
                                        <div className="text-slate-400 text-lg font-medium  leading-[30px] mt-8 ml-2">
                                          Projects
                                        </div>
                                      </section>

                                      <section className="flex flex-row pl-1">
                                        <section className="flex flex-row pl-1">
                                          <section className="flex flex-col">
                                            <div className="w-[21px] h-[21px] bg-emerald-500" />
                                            <div className="w-[21px] h-[38px] bg-violet-500" />
                                            <div className="w-[21px] h-[70px] bg-cyan-400" />
                                          </section>

                                          <section className="ml-6">
                                            <div className="flex flex-row">
                                              <div className="w-3.5 h-3.5 bg-emerald-500 mt-[9px]" />
                                              <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                                <CountUpComp
                                                  value={
                                                    projects.filter(
                                                      (log) =>
                                                        log.status == 'ongoing'
                                                    ).length
                                                  }
                                                />
                                              </div>
                                              <div className="text-slate-400  font-medium  text-[12px] ml-[2px] mt-[10px]">
                                                On Going
                                              </div>
                                            </div>

                                            <div className="flex flex-row mt-3">
                                              <div className="w-3.5 h-3.5 bg-violet-500 mt-[9px]" />
                                              <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                                {
                                                  projects.filter(
                                                    (log) =>
                                                      log.status == 'completed'
                                                  ).length
                                                }
                                              </div>
                                              <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                                Completed
                                              </div>
                                            </div>
                                            <div className="flex flex-row mt-3">
                                              <div className="w-3.5 h-3.5 bg-cyan-400 mt-[9px]" />
                                              <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                                {
                                                  projects.filter(
                                                    (log) =>
                                                      log.status != 'ongoing'
                                                  ).length
                                                }
                                              </div>
                                              <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                                Coming Soon
                                              </div>
                                            </div>
                                          </section>
                                        </section>
                                      </section>
                                    </section>
                                    {/* Assets */}
                                    <section className="mx-3 w-[25%]">
                                      <span className="text-slate-600 text-lg font-medium ">
                                        Units
                                      </span>
                                      <div className="w-[299.02px] h-[0px] border border-stone-300 mt-2"></div>
                                      <section className="flex flex-row">
                                        <div className="text-sky-950 text-5xl font-semibold font-['Manrope'] leading-[80px]">
                                          <CountUpComp
                                            value={projects.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.totalUnitCount || 0),
                                              0
                                            )}
                                          />
                                        </div>
                                        <div className="text-slate-400 text-lg font-medium  leading-[30px] mt-8 ml-2">
                                          Units
                                        </div>
                                      </section>

                                      <section className="flex flex-row pl-1">
                                        <section className="flex flex-col">
                                          <div className="w-[21px] h-[21px] bg-emerald-500" />
                                          <div className="w-[21px] h-[38px] bg-violet-500" />
                                          <div className="w-[21px] h-[70px] bg-cyan-400" />
                                        </section>

                                        <section className="ml-6">
                                          <div className="flex flex-row">
                                            <div className="w-3.5 h-3.5 bg-emerald-500 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                              <CountUpComp
                                              value={projects.reduce(
                                                (acc, project) =>
                                                {
                                                  if (project?.projectType?.name === 'Plots') {
                                                    return acc + (project.totalUnitCount || 0);
                                                  }
                                                  return acc;
                                                },
                                                0
                                              )}
                                            />
                                            </div>
                                            <div className="text-slate-400  font-medium  text-[12px] ml-[2px] mt-[10px]">
                                              Plots
                                            </div>
                                          </div>

                                          <div className="flex flex-row mt-3">
                                            <div className="w-3.5 h-3.5 bg-violet-500 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                            <CountUpComp
                                              value={projects.reduce(
                                                (acc, project) =>
                                                {
                                                  if (project?.projectType?.name === 'Apartment') {
                                                    return acc + (project.totalUnitCount || 0);
                                                  }
                                                  return acc;
                                                },
                                                0
                                              )}
                                            />
                                            </div>
                                            <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                              Apartments
                                            </div>
                                          </div>
                                          <div className="flex flex-row mt-3">
                                            <div className="w-3.5 h-3.5 bg-cyan-400 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                            <CountUpComp
                                              value={projects.reduce(
                                                (acc, project) =>
                                                {
                                                  if (project?.projectType?.name === 'Villas') {
                                                    return acc + (project.totalUnitCount || 0);
                                                  }
                                                  return acc;
                                                },
                                                0
                                              )}
                                            />
                                            </div>
                                            <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                              Villas
                                            </div>
                                          </div>
                                        </section>
                                      </section>
                                    </section>
                                            {/* Assets */}
                                            <section className="mx-3 w-[25%]">
                                      <span className="text-slate-600 text-lg font-medium ">
                                      Inventory
                                      </span>
                                      <div className="w-[299.02px] h-[0px] border border-stone-300 mt-2"></div>
                                      <section className="flex flex-row">
                                        <div className="text-sky-950 text-5xl font-semibold font-['Manrope'] leading-[80px]">
                                          <CountUpComp
                                             value={projects.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.availableCount || 0),
                                              0
                                            )}
                                          />
                                        </div>
                                        <div className="text-slate-400 text-lg font-medium  leading-[30px] mt-8 ml-2">
                                          Available
                                        </div>
                                      </section>

                                      <section className="flex flex-row pl-1">
                                        <section className="flex flex-col">
                                          <div className="w-[21px] h-[21px] bg-emerald-500" />
                                          <div className="w-[21px] h-[38px] bg-violet-500" />
                                          <div className="w-[21px] h-[70px] bg-cyan-400" />
                                        </section>

                                        <section className="ml-6">
                                          <div className="flex flex-row">
                                            <div className="w-3.5 h-3.5 bg-emerald-500 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                            <CountUpComp
                                             value={projects.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.soldUnitCount || 0),
                                              0
                                            )}
                                            />
                                            </div>
                                            <div className="text-slate-400  font-medium  text-[12px] ml-[2px] mt-[10px]">
                                              Sold
                                            </div>
                                          </div>

                                          <div className="flex flex-row mt-3">
                                            <div className="w-3.5 h-3.5 bg-violet-500 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                            <CountUpComp
                                             value={projects.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.bookUnitCount || 0),
                                              0
                                            )}
                                            />
                                            </div>
                                            <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                              Booked
                                            </div>
                                          </div>
                                          <div className="flex flex-row mt-3">
                                            <div className="w-3.5 h-3.5 bg-cyan-400 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                            <CountUpComp
                                             value={projects.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.blockedUnitCount || 0),
                                              0
                                            )}
                                            />
                                            </div>
                                            <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                              Blocked
                                            </div>
                                          </div>
                                        </section>
                                      </section>
                                    </section>
                                    {/* Assets */}
                                    <section className="mx-3 w-[25%]">
                                      <span className="text-slate-600 text-lg font-medium ">
                                        Portfolio
                                      </span>
                                      <div className="w-[299.02px] h-[0px] border border-stone-300 mt-2"></div>
                                      <section className="flex flex-row">
                                        <div className="text-sky-950 text-5xl font-semibold font-['Manrope'] leading-[80px]">
                                        <CountUpComp
                                            value={projects.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.soldUnitCount || 0),
                                              0
                                            )}
                                          />
                                        </div>
                                        <div className="text-slate-400 text-lg font-medium  leading-[30px] mt-8 ml-2">
                                          Customers
                                        </div>
                                      </section>

                                      <section className="flex flex-row pl-1">
                                        <section className="flex flex-col">
                                          <div className="w-[21px] h-[21px] bg-emerald-500" />
                                          <div className="w-[21px] h-[38px] bg-violet-500" />
                                          <div className="w-[21px] h-[70px] bg-cyan-400" />
                                        </section>

                                        <section className="ml-6">
                                          <div className="flex flex-row">
                                            <div className="w-3.5 h-3.5 bg-emerald-500 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                              0
                                            </div>
                                            <div className="text-slate-400  font-medium  text-[12px] ml-[2px] mt-[10px]">
                                              Posession
                                            </div>
                                          </div>

                                          <div className="flex flex-row mt-3">
                                            <div className="w-3.5 h-3.5 bg-violet-500 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                              0
                                            </div>
                                            <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                              Released
                                            </div>
                                          </div>
                                          <div className="flex flex-row mt-3">
                                            <div className="w-3.5 h-3.5 bg-cyan-400 mt-[9px]" />
                                            <div className="text-sky-950 text-2xl font-semibold font-['Manrope'] ml-3">
                                            <CountUpComp
                                            value={salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.Total || 0),
                                              0
                                            )}
                                          />
                                            </div>
                                            <div className="text-slate-400  font-medium   text-[12px] ml-[2px] mt-[10px]">
                                              Leads
                                            </div>
                                          </div>
                                        </section>
                                      </section>
                                    </section>
                                  </section>

                                  {/* <section className="flex flex-row bg-indigo-100 rounded-bl-xl rounded-br-xl border border-white">
                                    <section className="flex flex-row px-4 py-4">
                                      <section className="w-[33%]">
                                        <section>
                                          <span className="text-slate-600 text-lg font-medium">
                                            Sales
                                          </span>
                                          <div className="w-[330.02px] h-[0px] border border-stone-300 mt-2"></div>
                                        </section>
                                        <section className="flex flex-row">
                                          <div className="w-[50%]">
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                  <CountUpComp
                                            value={salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.Total || 0),
                                              0
                                            )}
                                          />+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Leads
                                                  </div>
                                                </section>
                                              </section>
                                            </div>
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 ">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                  <CountUpComp
                                            value={salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.inprogress || 0),
                                              0
                                            )}
                                          />+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Active Leads
                                                  </div>
                                                </section>
                                              </section>
                                              <div className="mt-3">
                                                <section className="flex flex-row">
                                                  <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                    <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                  </div>
                                                  <section className="flex flex-col ml-2 mt-1">
                                                    <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    <CountUpComp
                                            value={salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.visitdone || 0),
                                              0
                                            )}
                                          />+
                                                    </div>
                                                    <div className="text-slate-400 text-[12px] font-medium  ">
                                                      Site Visits
                                                    </div>
                                                  </section>
                                                </section>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="w-[50%]">
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                  <CountUpComp
                                            value={salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.booked || 0),
                                              0
                                            )}
                                          />+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Booked
                                                  </div>
                                                </section>
                                              </section>
                                            </div>
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                  <CountUpComp
                                            value={salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.Total || 0),
                                              0
                                            )- salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.booked || 0),
                                              0
                                            )-salesReportsDbData.reduce(
                                              (acc, project) =>
                                                acc +
                                                (project?.inprogress || 0),
                                              0
                                            )}
                                          />+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Not Interested
                                                  </div>
                                                </section>
                                              </section>
                                              <div className="mt-3">
                                                <section className="flex flex-row">
                                                  <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                    <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                  </div>
                                                  <section className="flex flex-col ml-2 mt-1">
                                                    <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                      21
                                                    </div>
                                                    <div className="text-slate-400 text-[12px] font-medium  ">
                                                      Sales Team
                                                    </div>
                                                  </section>
                                                </section>
                                              </div>
                                            </div>
                                          </div>
                                        </section>
                                      </section>


                                      <section className="w-[33%] mx-3">
                                        <section>
                                          <span className="text-slate-600 text-lg font-medium">
                                            CRM
                                          </span>
                                          <div className="w-[330.02px] h-[0px] border border-stone-300 mt-2"></div>
                                        </section>
                                        <section className="flex flex-row">
                                          <div className="w-[50%]">
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Collected
                                                  </div>
                                                </section>
                                              </section>
                                            </div>
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Due
                                                  </div>
                                                </section>
                                              </section>
                                              <div className="mt-3">
                                                <section className="flex flex-row">
                                                  <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                    <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                  </div>
                                                  <section className="flex flex-col ml-2 mt-1">
                                                    <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                      10000+
                                                    </div>
                                                    <div className="text-slate-400 text-[12px] font-medium  ">
                                                      Projection
                                                    </div>
                                                  </section>
                                                </section>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="w-[50%]">
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Cancelled
                                                  </div>
                                                </section>
                                              </section>
                                            </div>
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Swapped
                                                  </div>
                                                </section>
                                              </section>
                                              <div className="mt-3">
                                                <section className="flex flex-row">
                                                  <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                    <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                  </div>
                                                  <section className="flex flex-col ml-2 mt-1">
                                                    <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                      28+
                                                    </div>
                                                    <div className="text-slate-400 text-[12px] font-medium  ">
                                                      Blocked
                                                    </div>
                                                  </section>
                                                </section>
                                              </div>
                                            </div>
                                          </div>
                                        </section>
                                      </section>


                                      <section className="w-[33%]">
                                        <section>
                                          <span className="text-slate-600 text-lg font-medium">
                                            Teams
                                          </span>
                                          <div className="w-[330.02px] h-[0px] border border-stone-300 mt-2"></div>
                                        </section>
                                        <section className="flex flex-row">
                                          <div className="w-[50%]">
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Leads
                                                  </div>
                                                </section>
                                              </section>
                                            </div>
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Active Visits
                                                  </div>
                                                </section>
                                              </section>
                                              <div className="mt-3">
                                                <section className="flex flex-row">
                                                  <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                    <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                  </div>
                                                  <section className="flex flex-col ml-2 mt-1">
                                                    <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                      10000+
                                                    </div>
                                                    <div className="text-slate-400 text-[12px] font-medium  ">
                                                      Site Visits
                                                    </div>
                                                  </section>
                                                </section>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="w-[50%]">
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Booked
                                                  </div>
                                                </section>
                                              </section>
                                            </div>
                                            <div className="mt-3">
                                              <section className="flex flex-row">
                                                <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                  <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                </div>
                                                <section className="flex flex-col ml-2 mt-1">
                                                  <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                    10000+
                                                  </div>
                                                  <div className="text-slate-400 text-[12px] font-medium  ">
                                                    Not Interested
                                                  </div>
                                                </section>
                                              </section>
                                              <div className="mt-3">
                                                <section className="flex flex-row">
                                                  <div className="w-[46px] h-[46px] px-[17px] pt-[13px] pb-3 bg-emerald-50 justify-center items-center inline-flex">
                                                    <div className="grow shrink basis-0 self-stretch pl-[2.61px] pr-[2.67px] py-[2.67px] justify-center items-center inline-flex" />
                                                  </div>
                                                  <section className="flex flex-col ml-2 mt-1">
                                                    <div className="text-sky-950 text-xl font-semibold font-['Manrope'] ">
                                                      28+
                                                    </div>
                                                    <div className="text-slate-400 text-[12px] font-medium  ">
                                                      Sales Team
                                                    </div>
                                                  </section>
                                                </section>
                                              </div>
                                            </div>
                                          </div>
                                        </section>
                                      </section>
                                    </section>
                                  </section> */}

                                  {projects.length > 0 ? (
                                    <section className="bg-white py-2 rounded-sm">
                                      <div className="px-4">
                                        <div className="flex items-center justify-between py-2 pb-4  ">
                                          <span className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 font-Playfair">
                                          ONGOING PROJECTS
                                            {/* {viewable} */}
                                          </span>
                                          <button
                                            onClick={() =>{
                                              setProject({})
                                              setIsNewProjectOpen(true)
                                            }}
                                            className="flex items-center justify-center h-8 px-4  bg-gray-200 ml-auto text-sm font-medium rounded hover:bg-gray-300"
                                          >
                                            <svg
                                              className="w-5 h-5"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                              />
                                            </svg>
                                            <span className="ml-2 leading-none">
                                              Add Project
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                      <section className="mx-2 rounded-xl bg-white shadow p-2">
                                        {projects.map((project) => (
                                          <ProjectsMHomeBody
                                            key={project.uid}
                                            project={project}
                                            setProject={setProject}
                                            onSliderOpen={() => {
                                              setProject(project)
                                              setIsEditProjectOpen(true)
                                            }}
                                            isEdit={false}
                                          />
                                        ))}
                                      </section>
                                    </section>
                                  ) : (
                                    <span onClick={() => setIsNewProjectOpen(true)}>
                                        <DummyBodyLayout />
                                    </span>
                                  )}
                                </>
                              )}
                          </div>

                          {viewable === 'Projects Lead Report' && (
                            <>
                              <div className="">
                                <div className="  flex items-center justify-between py-2  ">
                                  <span className="relative z-10 flex items-center w-auto text-2xl font-bold leading-none pl-0">
                                    Projects
                                  </span>
                                  <button
                                    onClick={() => setIsNewProjectOpen(true)}
                                    className="flex items-center justify-center h-10 px-4  bg-gray-200 ml-auto text-sm font-medium rounded hover:bg-gray-300"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                      />
                                    </svg>
                                    <span className="ml-2 leading-none">
                                      Add Project
                                    </span>
                                  </button>
                                </div>
                              </div>

                              <div>
                                <section className="py-8 mb-8 leading-7 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-18 rounded-lg">
                                  <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
                                    <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
                                      <div className="flex items-center flex-shrink-0  px-0  pl-0 border-b border-grey  mb-2">
                                        <span className="flex items-center">
                                          <img
                                            className="w-16 h-16"
                                            alt=""
                                            src="/apart.svg"
                                          ></img>
                                          <span className="relative z-10 flex items-center w-auto text-4xl font-bold leading-none pl-0 mt-[18px]">
                                            {'Projects vs Leads'}
                                          </span>
                                        </span>
                                        <section className="flex ml-auto mt-[18px]">
                                          <button>
                                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                              <PencilIcon
                                                className="h-3 w-3 mr-1"
                                                aria-hidden="true"
                                              />
                                              Edit
                                            </span>
                                          </button>
                                        </section>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1">
                                      <div className="min-h-[380px]">
                                        {/* <h1>hello</h1> */}

                                        <ResponsiveBar
                                          data={data}
                                          keys={[
                                            'vertex aprtments',
                                            'subha EcoStone',
                                            'vertex villas',
                                            'Subha Gruha Kalpa Plots',
                                            'Vintage Villas',
                                            'Dream Space',
                                          ]}
                                          indexBy="Lead_Status"
                                          margin={{
                                            top: 50,
                                            right: 130,
                                            bottom: 50,
                                            left: 60,
                                          }}
                                          padding={0.3}
                                          valueScale={{ type: 'linear' }}
                                          indexScale={{
                                            type: 'band',
                                            round: true,
                                          }}
                                          colors={{ scheme: 'nivo' }}
                                          defs={[
                                            {
                                              id: 'dots',
                                              type: 'patternDots',
                                              background: 'inherit',
                                              color: '#38bcb2',
                                              size: 4,
                                              padding: 1,
                                              stagger: true,
                                            },
                                            {
                                              id: 'lines',
                                              type: 'patternLines',
                                              background: 'inherit',
                                              color: '#eed312',
                                              rotation: -45,
                                              lineWidth: 6,
                                              spacing: 10,
                                            },
                                          ]}
                                          fill={[
                                            {
                                              match: {
                                                id: 'Vintage Villas',
                                              },
                                              id: 'dots',
                                            },
                                            {
                                              match: {
                                                id: 'vertex villas',
                                              },
                                              id: 'lines',
                                            },
                                          ]}
                                          borderColor={{
                                            from: 'color',
                                            modifiers: [['darker', 1.6]],
                                          }}
                                          axisTop={null}
                                          axisRight={null}
                                          axisBottom={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: 'Lead Status',
                                            legendPosition: 'middle',
                                            legendOffset: 32,
                                          }}
                                          axisLeft={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: 'Count',
                                            legendPosition: 'middle',
                                            legendOffset: -40,
                                          }}
                                          labelSkipWidth={12}
                                          labelSkipHeight={12}
                                          labelTextColor={{
                                            from: 'color',
                                            modifiers: [['darker', 1.6]],
                                          }}
                                          legends={[
                                            {
                                              dataFrom: 'keys',
                                              anchor: 'bottom-right',
                                              direction: 'column',
                                              justify: false,
                                              translateX: 120,
                                              translateY: 0,
                                              itemsSpacing: 2,
                                              itemWidth: 100,
                                              itemHeight: 20,
                                              itemDirection: 'left-to-right',
                                              itemOpacity: 0.85,
                                              symbolSize: 20,
                                              effects: [
                                                {
                                                  on: 'hover',
                                                  style: {
                                                    itemOpacity: 1,
                                                  },
                                                },
                                              ],
                                            },
                                          ]}
                                          role="application"
                                          ariaLabel="Nivo bar chart demo"
                                          barAriaLabel={function (e) {
                                            return (
                                              e.id +
                                              ': ' +
                                              e.formattedValue +
                                              ' in Lead_Status: ' +
                                              e.indexValue
                                            )
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </>
                          )}
                          {viewable === 'unitsInventory' && (
                            <ProjectsUnitInventory
                              project={{
                                projectName: 'Projects',
                              }}
                              isEdit={undefined}
                            />
                          )}

                          {viewable === 'Campaign Budget Report' && (
                            <>
                              <div className="">
                                <div className="flex items-center justify-between py-2  ">
                                  <span className="relative z-10 flex items-center w-auto text-2xl font-bold leading-none pl-0">
                                    Projects
                                  </span>
                                  <button
                                    onClick={() => setIsNewProjectOpen(true)}
                                    className="flex items-center justify-center h-10 px-4  bg-gray-200 ml-auto text-sm font-medium rounded hover:bg-gray-300"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                      />
                                    </svg>
                                    <span className="ml-2 leading-none">
                                      Add Project
                                    </span>
                                  </button>
                                </div>
                              </div>

                              <div>
                                <section className="py-8 mb-8 leading-7 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-18 rounded-lg">
                                  <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
                                    <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
                                      <div className="flex items-center flex-shrink-0  px-0  pl-0 border-b border-grey  mb-2">
                                        <span className="flex items-center">
                                          <img
                                            className="w-16 h-16"
                                            alt=""
                                            src="/apart.svg"
                                          ></img>
                                          <span className="relative z-10 flex items-center w-auto text-4xl font-bold leading-none pl-0 mt-[18px]">
                                            {'Campaign Budget Report'}
                                          </span>
                                        </span>
                                        <section className="flex ml-auto mt-[18px]">
                                          <button>
                                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                              <PencilIcon
                                                className="h-3 w-3 mr-1"
                                                aria-hidden="true"
                                              />
                                              Edit
                                            </span>
                                          </button>
                                        </section>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1">
                                      <div className="min-h-[380px]">
                                        {/* <h1>hello</h1> */}

                                        <ResponsiveBar
                                          data={data1}
                                          keys={[
                                            'facebook',
                                            'Instagram',
                                            'Google Adwords',
                                            'Housing.com',
                                            'News Paper',
                                            'Others',
                                          ]}
                                          indexBy="Lead_Status"
                                          margin={{
                                            top: 50,
                                            right: 130,
                                            bottom: 50,
                                            left: 60,
                                          }}
                                          padding={0.3}
                                          valueScale={{ type: 'linear' }}
                                          indexScale={{
                                            type: 'band',
                                            round: true,
                                          }}
                                          colors={{ scheme: 'nivo' }}
                                          defs={[
                                            {
                                              id: 'dots',
                                              type: 'patternDots',
                                              background: 'inherit',
                                              color: '#38bcb2',
                                              size: 4,
                                              padding: 1,
                                              stagger: true,
                                            },
                                            {
                                              id: 'lines',
                                              type: 'patternLines',
                                              background: 'inherit',
                                              color: '#eed312',
                                              rotation: -45,
                                              lineWidth: 6,
                                              spacing: 10,
                                            },
                                          ]}
                                          fill={[
                                            {
                                              match: {
                                                id: 'Vintage Villas',
                                              },
                                              id: 'dots',
                                            },
                                            {
                                              match: {
                                                id: 'vertex villas',
                                              },
                                              id: 'lines',
                                            },
                                          ]}
                                          borderColor={{
                                            from: 'color',
                                            modifiers: [['darker', 1.6]],
                                          }}
                                          axisTop={null}
                                          axisRight={null}
                                          axisBottom={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: 'Type',
                                            legendPosition: 'middle',
                                            legendOffset: 32,
                                          }}
                                          axisLeft={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: 'Spent',
                                            legendPosition: 'middle',
                                            legendOffset: -40,
                                          }}
                                          labelSkipWidth={12}
                                          labelSkipHeight={12}
                                          labelTextColor={{
                                            from: 'color',
                                            modifiers: [['darker', 1.6]],
                                          }}
                                          legends={[
                                            {
                                              dataFrom: 'keys',
                                              anchor: 'bottom-right',
                                              direction: 'column',
                                              justify: false,
                                              translateX: 120,
                                              translateY: 0,
                                              itemsSpacing: 2,
                                              itemWidth: 100,
                                              itemHeight: 20,
                                              itemDirection: 'left-to-right',
                                              itemOpacity: 0.85,
                                              symbolSize: 20,
                                              effects: [
                                                {
                                                  on: 'hover',
                                                  style: {
                                                    itemOpacity: 1,
                                                  },
                                                },
                                              ],
                                            },
                                          ]}
                                          role="application"
                                          ariaLabel="Nivo bar chart demo"
                                          barAriaLabel={function (e) {
                                            return (
                                              e.id +
                                              ': ' +
                                              e.formattedValue +
                                              ' in Lead_Status: ' +
                                              e.indexValue
                                            )
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </>
                          )}
                          <SiderForm
                            open={isNewProjectOpen}
                            setOpen={handleNewProjectClose}
                            title="Create Project"
                            data={project}
                            setProject={setProject}
                            widthClass="max-w-4xl"
                            onCloseDisabled={true}
                          />
                          <SiderForm
                            open={isEditProjectOpen}
                            setOpen={handleEditProjectClose}
                            title="Edit Project"
                            data={project}
                            widthClass="max-w-4xl"
                            onCloseDisabled={true}
                          />
                        </div>
                      </div>
                      <MetaTags
                        title="ExecutiveHome"
                        description="ExecutiveHome page"
                      />
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
