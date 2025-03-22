/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */

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
    <div className='bg-white rounded-md border-[40px] border-white mx-1 mt-1'>

<div className='flex max-w-7xl mx-auto bg-white border-b border rounded-xl w-[100%] border-gray-200 flex-row justify-between shadow'>
      <ul
                className="flex flex-wrap -mb-px "
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                {[
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
        <section className="  py-4 mb-2 leading-7 text-gray-900 bg-white  rounded-lg  ">


          <div className="">
            {projects.map((project) => (
              <CrmAnalyticsUnitHome
                key={project.uid}
                project={project}

              />
            ))}
            {projects.length === 0 && <DummyBodyLayout />}
          </div>
        </section>
      )}

       {selCat === 'booking_summary-v1' && (
        <div className="">
          <UnitBookingSummaryHomePage1 />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'crm_summary' && (
        <div className="">
          <CrmSummaryReport />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'crm_table' && (
        <div className="">
          <CrmInventorySummaryTable projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'mortgage_details' && (
        <div className="">
          <CrmMortgageSummaryTable projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'crm_projection_report' && (
        <div className="">
          <CrmProjectionReport projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}
      {selCat === 'collection_performance' && (
        <div className=" bg-white">
          <CrmCollectionReport projects={projects} />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}

      {selCat === 'creditnote_summary' && (
        <div className="">
          <CreditNoteSummaryHomePage />

          {projects.length === 0 && <DummyBodyLayout />}
        </div>
      )}
    </div>
  )
}

export default CrmAnalyticsHome
