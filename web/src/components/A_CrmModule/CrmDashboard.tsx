/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getAllProjects } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import 'flowbite'
import '../../styles/myStyles.css'
import ApexChart from '../Apex_chart/ApexChart'
import PieChart from '../Apex_chart/PieChart'
import Conversion_rates from '../Apex_chart/Conversion_rates'
import RadarChart from '../Apex_chart/RadarChart'

const CrmDashboardHome = ({ project }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { projectName } = project
  const { user } = useAuth()

  const { orgId } = user
  const [projects, setProjects] = useState([])

  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [isDocViewOpenSideView, setIsDocViewOpenSideView] = useState(false)
  const [projectDetails, setProjectDetails] = useState({})
  const [viewDocData, setViewDocData] = useState({})
  const [seriesData, setSeriesData] = useState('Month')

  const handleChangeSeriesData = (event) => {
    setSeriesData(event.target.value)
  }
  const chartData = [
    {
      title: 'Month',
      data: [
        {
          name: 'Earning',
          data: [
            15000, 4500, 12000, 5000, 7500, 13000, 3000, 12000, 7500, 10000,
            5500, 15000,
          ],
        },
      ],
    },
    {
      title: 'Week',
      data: [
        {
          name: 'Earning',
          data: [
            10000, 4500, 14000, 6000, 7500, 13000, 7000, 12000, 11500, 10000,
            5500, 11000,
          ],
        },
      ],
    },
    {
      title: 'Day',
      data: [
        {
          name: 'Earning',
          data: [
            15000, 4500, 15000, 5000, 9500, 13000, 3000, 12000, 10500, 10000,
            5500, 11000,
          ],
        },
      ],
    },
  ]
  const chartCategories = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

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
  const selProjctFun = (project) => {
    setIsOpenSideView(!isOpenSideView)
    setProjectDetails(project)
  }

  const dispDoc = (docData) => {
    setViewDocData(docData)
    setIsDocViewOpenSideView(!isDocViewOpenSideView)
  }

  const chartSeries = chartData.find((item) => item.title === seriesData)?.data
  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: chartCategories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: 15000,
      tickAmount: 4,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 500,
        },
        formatter: (value) => numeral(value).format('0a'),
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val) => `$${val}`,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
      },
    },
    responsive: [
      {
        breakpoint: 550,
        options: {
          chart: {
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            min: 0,
            max: 15000,
            tickAmount: 4,
            labels: {
              show: true,
              style: {
                colors: theme.palette.text.disabled,
                fontFamily: theme.typography.fontFamily,
                fontWeight: 500,
              },
              formatter: (value) => numeral(value).format('0a'),
            },
          },
          yaxis: {
            show: true,
            labels: {
              style: {
                colors: theme.palette.text.disabled,
                fontFamily: theme.typography.fontFamily,
                fontWeight: 500,
              },
            },
          },
        },
      },
    ],
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
      </section>

      <section className="  mr-1  mb-2 leading-7 text-gray-900 bg-white  rounded-lg  ">
        <Container
          maxWidth={'xl'}
          sx={{ backgroundColor: 'common.white', borderRadius: 3 }}
          className="px-2"
        >
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <Stack
                alignItems="center"
                sx={{
                  py: 5,
                  height: 210,
                  borderRadius: 5,
                  textAlign: 'center',
                  color: '#4a4a4a',
                  m: 2,
                  mt: 3,
                  background:
                    'linear-gradient(to right bottom, #b4edcb, #82ffa1)',
                }}
                className=" w-100"
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  {<img alt="icon" src="/assets/ic_glass_bag.png" />}
                </Typography>
                <Typography variant="h4">714K</Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  Weekly Sales
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Stack
                alignItems="center"
                sx={{
                  py: 5,
                  height: 210,
                  borderRadius: 5,
                  textAlign: 'center',
                  // backgroundColor: 'common.white',
                  color: '#4a4a4a',
                  m: 2,
                  mt: 3,
                  background:
                    'linear-gradient(to right bottom, #9bdfe8, #c5f4fa)',
                }}
                className=" w-100"
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  {<img alt="icon" src="/assets/ic_glass_users.png" />}
                </Typography>
                <Typography variant="h4">1.35m</Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  New Users
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Stack
                alignItems="center"
                sx={{
                  py: 5,
                  height: 210,
                  borderRadius: 5,
                  textAlign: 'center',
                  // backgroundColor: 'common.white',
                  color: '#4a4a4a',
                  m: 2,
                  mt: 3,
                  background:
                    'linear-gradient(to right bottom, #ebdac5, #edcda6)',
                }}
                className=" w-100"
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  {<img alt="icon" src="/assets/ic_glass_buy.png" />}
                </Typography>
                <Typography variant="h4">1.72m</Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  item Orders{' '}
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Stack
                alignItems="center"
                sx={{
                  py: 5,
                  height: 210,
                  borderRadius: 5,
                  textAlign: 'center',
                  // backgroundColor: 'common.white',
                  color: '#4a4a4a',
                  m: 2,
                  mt: 3,
                  background:
                    'linear-gradient(to right bottom, #f5a287, #ffc2ad)',
                }}
                className=" w-100"
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  {<img alt="icon" src="/assets/ic_glass_message.png" />}
                </Typography>
                <Typography variant="h4">234</Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
                  Bug Reports
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={6} lg={7} sx={{ m: 3, borderRadius: 5 }}>
              <ApexChart />
            </Grid>

            <Grid xs={12} md={6} lg={4} sx={{ m: 3, borderRadius: 5 }}>
              <PieChart />
            </Grid>
            <Grid xs={12} md={6} lg={7} sx={{ m: 3, borderRadius: 5 }}>
              <Conversion_rates />
            </Grid>

            <Grid xs={12} md={6} lg={4} sx={{ m: 3, borderRadius: 5 }}>
              <RadarChart />
            </Grid>

            <Grid xs={12} md={6} lg={7} sx={{ m: 3, borderRadius: 5 }}>
              <Card>
                <CardHeader title="News" />
              </Card>
            </Grid>

            <Grid xs={12} md={6} lg={4} sx={{ m: 3, borderRadius: 5 }}>
              <Card>
                <CardHeader title="Order Timeline" />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  )
}

export default CrmDashboardHome
