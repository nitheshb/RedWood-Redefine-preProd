/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
// import { useState } from 'react'
// import ProjectStatsCard from '../ProjectStatsCard/ProjectStatsCard'
// import PhaseDetailsCard from '../PhaseDetailsCard/PhaseDetailsCard'
import { useState, useEffect } from 'react'

import {
  Box,
  Card,
  CardHeader,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Link } from '@redwoodjs/router'

import SiderForm from 'src/components/SiderForm/SiderForm'
import { getAllProjects } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import 'flowbite'

import '../../styles/myStyles.css'
// import Chart from 'react-apexcharts'
import ApexChart from '../Apex_chart/ApexChart'
import Conversion_rates from '../Apex_chart/Conversion_rates'
import PieChart from '../Apex_chart/PieChart'
import RadarChart from '../Apex_chart/RadarChart'
import DummyBodyLayout from '../DummyBodyLayout/DummyBodyLayout'

import CircleBar from './Reports/CircleBar'
import CrmAnalyticsUnitHome from './Reports/CrmAnalyticsUnitHome'
import ReportBars from './Reports/ReportBars'
import TransactionCard from './Reports/TransactionCard'
import UnitStatusCardReport from './Reports/UnitStatusCardReport'

const CrmAnalyticsHome = ({ project }) => {
  const theme = useTheme()
  const { t } = useTranslation()

  const { user } = useAuth()

  const { orgId } = user
  const [projects, setProjects] = useState([])

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
    <div>
      <section className=" mt-1 mr-1 py-8 mb-2 leading-7 text-gray-900 bg-white  rounded-lg  ">
        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
          <section className="flex flex-row justify-between">
            <div className="">
              <h3 className="h1MainText">Congratulations Nithesh! 🎉</h3>
              <p className="subText montF">
                You have done <span>76%</span> more sales today. <br></br>
                Check your inventory and update your stocks.
              </p>

              {/* <p className=" MuiBox-root css-1veg4n0">You have done */}
              {/* <span className=" MuiBox-root css-1sej3o2">76%</span> more sales today. <br>
            Check your inventory and update your stocks.</p> */}
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
        </div>
        <div className='px-2 mt-2'>
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


    </div>
  )
}

export default CrmAnalyticsHome