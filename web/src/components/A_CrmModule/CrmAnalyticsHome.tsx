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
<<<<<<< HEAD
    <div className='bg-white  border-[40px] border-white p-4 mx-1 mt-1'>
=======
    <div className='bg-white rounded-md border-[40px] border-white mx-1 mt-1'>
>>>>>>> 5eb404f7e8bed5cc56d1c9e92056523881e9979b

<div className='flex    w-[100%]  flex-row justify-between border-b '>
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
                          className={`px-4 py-2  ${
                            selCat === d.value
                              ? 'border-b-2 border-black text-black '
                              : 'text-gray-500 hover:text-black'
                          }`}
                          type="button"
                          role="tab"
                          onClick={() => {
                            setSelCat(d.value)
                          }}
                        >

<span
                  className={`flex items-center   text-sm   ${
                    selCat === d.value
                      ? 'font-semibold text-green-800 '
                      : 'font-medium text-black-100 '
                  }  rounded-full`}
                >
                  <img alt="" src="/temp2.png" className="h-5 w-5 mr-1" />
                  {d?.label}
                </span>

                        </button>
                      </li>
                    </ul>
                  )
                })}
              </ul>
              </div>
      {selCat === 'proj_summary' && (
<<<<<<< HEAD
        <section className=" mt-1 mr-1 py-8 mb-2 leading-7 text-gray-900 bg-[#fff]  rounded-lg  ">
=======
        <section className="  py-4 mb-2 leading-7 text-gray-900 bg-white  rounded-lg  ">
>>>>>>> 5eb404f7e8bed5cc56d1c9e92056523881e9979b


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
