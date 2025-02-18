/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
// import { useState } from 'react'
// import ProjectStatsCard from '../ProjectStatsCard/ProjectStatsCard'
// import PhaseDetailsCard from '../PhaseDetailsCard/PhaseDetailsCard'
import { useState, useEffect } from 'react'

import {
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  getAllProjects,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import 'flowbite'

import '../../styles/myStyles.css'
import DummyBodyLayout from '../DummyBodyLayout/DummyBodyLayout'
import CrmCollectionReport from './Reports/collectionReport'
import CreditNoteSummaryHomePage from './Reports/creditNoteSummaryHome'
import CrmSummaryReport from './Reports/Crm_SummaryReport'
import CrmAnalyticsUnitHome from './Reports/CrmAnalyticsUnitHome'
import CrmProjectionReport from './Reports/CrmProjectionReport'
import CrmInventorySummaryTable from './Reports/CrmSummaryTable'
import CrmMortgageSummaryTable from './Reports/CrmMortgageSummary'
import UnitBookingSummaryHomePage1 from './Reports/bookingSummaryHomev1'

const CrmAnalyticsHome = ({ project }) => {
  const theme = useTheme()
  const { t } = useTranslation()

  const { user } = useAuth()

  const { orgId } = user
  const [projects, setProjects] = useState([])
  const [selCat, setSelCat] = useState('booking_summary-v1')

  useEffect(() => {
    getProjects()
  }, [])
  const getProjects = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projects.map((user) => {
          user.label = user?.projectName
          user.value = user?.uid
        })
        setProjects([...projects])
        console.log('project are ', projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }

  return (
    <div className='bg-[#F1F1F1] rounded-md border-[40px] border-white p-4 mx-1 mt-1'>

<div className='flex max-w-7xl mx-auto bg-white border-b border rounded-xl w-[100%] border-gray-200 flex-row justify-between shadow'>
      <ul
                className="flex flex-wrap -mb-px "
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                {[
          // { label: 'Booking Summary', value: 'booking_summary' },
          { label: 'Booking Summary', value: 'booking_summary-v1' },
          { label: 'Collections', value: 'collection_performance' },
          { label: 'CRM Inventory', value: 'crm_table' },
          {
            label: 'Collection Projections',
            value: 'crm_projection_report',
          },

          { label: 'Project Summary', value: 'proj_summary' },
          { label: 'Mortgage Details', value: 'mortgage_details' },
          { label: 'Credit Note', value: 'creditnote_summary' },].map((d, i) => {
                  return (
                    <ul
                      value={selCat}
                      key={i}
                      // onChange={handleChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                    >
                      <li key={i} className="mr-3 ml-3" role="presentation">
                        <button
                          className={`inline-block py-4 px-4 h-16 text-sm  text-center text-[#6e6e6e] rounded-t-lg border-b-[3px]  hover:text-gray-600 hover:border-black hover:border-b-[3px] dark:text-gray-400 dark:hover:text-gray-300  ${
                            selCat === d.value
                              ? 'border-[#144264] text-[#144264] '
                              : 'border-transparent'
                          }`}
                          type="button"
                          role="tab"
                          onClick={() => {
                            setSelCat(d.value)
                          }}
                        >
                          <span
                            className={`font-bold font-semibold text-gray-500 ${
                              selCat === d.value
                                ? 'text-[#0080ff] text-gray-800 '
                                : ''
                            }`}
                          >
                            {' '}
                            {`${d.label}`}

                          </span>
                        </button>
                      </li>
                    </ul>
                  )
                })}
              </ul>
              </div>
      {selCat === 'proj_summary' && (
        <section className=" mt-1 mr-1 py-8 mb-2 leading-7 text-gray-900 bg-[#F1F1F1]  rounded-lg  ">
          {/* <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
          <section className="flex flex-row justify-between">
            <div className="">
              <h3 className="h1MainText">Congratulations Nithesh! 🎉</h3>
              <p className="subText montF">
                You have done <span>76%</span> more sales today. <br></br>
                Check your inventory and update your stocks.
              </p>
              <div className="montF MuiBox-root cardBg">
                <div className="montF flex w-full">
                  <svg
                    className="svgIcon"
                    focusable="false"
                    viewBox="0 0 18 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M11.9995 16.5C16.1416 16.5 19.4995 13.1421 19.4995 9C19.4995 4.85786 16.1416 1.5 11.9995 1.5C7.85738 1.5 4.49951 4.85786 4.49951 9C4.49951 13.1421 7.85738 16.5 11.9995 16.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fillOpacity="0"
                    ></path>
                    <path
                      d="M11.9995 13.5C14.4848 13.5 16.4995 11.4853 16.4995 9C16.4995 6.51472 14.4848 4.5 11.9995 4.5C9.51423 4.5 7.49951 6.51472 7.49951 9C7.49951 11.4853 9.51423 13.5 11.9995 13.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fillOpacity="0"
                    ></path>
                    <path
                      d="M16.5 15V22.5005L11.9993 20.2505L7.5 22.5005V15.0007"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fillOpacity="0"
                    ></path>
                  </svg>
                  <div className="ml-2 w-full">
                    <div className="flex flex-row justify-between">
                      <span className="whiteSmallText">Star Seller</span>
                      <span className="whiteSmallText">76%</span>
                    </div>
                    <span
                      className="MuiLinearProgress-root MuiLinearProgress-colorPrimary MuiLinearProgress-determinate css-rr2k8m-MuiLinearProgress-root"
                      role="progressbar"
                      aria-valuenow="76"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span
                        className="MuiLinearProgress-bar MuiLinearProgress-barColorPrimary MuiLinearProgress-bar1Determinate css-1fakg6h-MuiLinearProgress-bar1"
                        style={{ transform: 'translateX(-24%)' }}
                      ></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="MuiBox-root css-0">
              <img src="/userDashboard.svg" width="100%" alt="User" />
            </div>
          </section>
        </div> */}

          <div className="px-2 mt-2">
            {projects.map((project) => (
              <CrmAnalyticsUnitHome
                key={project.uid}
                project={project}
                // onSliderOpen={() => {
                //   setProject(project)
                //   setIsEditProjectOpen(true)
                // }}
                // isEdit={false}
              />
            ))}
            {projects.length === 0 && <DummyBodyLayout />}
          </div>
        </section>
      )}
      {/* {selCat === 'booking_summary' && (
        <div className="">
          
          <UnitBookingSummaryHomePage />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )} */}
       {selCat === 'booking_summary-v1' && (
        <div className="">
          {/* <AdvancedDataTableTest /> */}
          <UnitBookingSummaryHomePage1 />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'crm_summary' && (
        <div className="">
          {/* <AdvancedDataTableTest /> */}
          <CrmSummaryReport />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'crm_table' && (
        <div className="">
          {/* <AdvancedDataTableTest /> */}
          <CrmInventorySummaryTable projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'mortgage_details' && (
        <div className="">
          {/* <AdvancedDataTableTest /> */}
          <CrmMortgageSummaryTable projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'crm_projection_report' && (
        <div className="">
          {/* <AdvancedDataTableTest /> */}
          <CrmProjectionReport projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}
      {selCat === 'collection_performance' && (
        <div className=" bg-[#F1F1F1]">
          {/* <AdvancedDataTableTest /> */}
          <CrmCollectionReport projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'creditnote_summary' && (
        <div className="">
          {/* <AdvancedDataTableTest /> */}
          <CreditNoteSummaryHomePage />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}
    </div>
  )
}

export default CrmAnalyticsHome
