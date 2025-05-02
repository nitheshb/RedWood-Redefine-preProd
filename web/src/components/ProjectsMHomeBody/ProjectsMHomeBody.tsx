/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// import { useState } from 'react'
// import PhaseDetailsCard from '../PhaseDetailsCard/PhaseDetailsCard'
import { useState } from 'react'
import { Box, LinearProgress, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from '@redwoodjs/router'
import SiderForm from '../SiderForm/SiderForm'
import { CheckCircle, XCircle } from 'lucide-react'

const ProjectsMHomeBody = ({
  project,
  setProject,
  onSliderOpen = () => {},
  isEdit,
}) => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const handleNewProjectClose = () => setIsNewProjectOpen(false)

  const {
    totalEstValue,
    totalPlotArea,
    totalValue,
    soldValue,
    availValue,
    bookValue,
    blockValue,
    holdValue,
    totalArea,
    soldArea,
    availArea,
    bookArea,
    blockArea,
    holdArea,
    totalUnitCount,
    soldUnitCount,
    blockedUnitCount,
    custBlockCount,
    mangBlockCount,
    custBlockValue,
    mangBlockValue,
    availableCount,
    bookUnitCount,
    blockUnitCount,
    area,
    builderName,
    location,
    projectName,
    projectType,
    uid = 0,
    s_agreeCount,
    s_registerCount,
    s_constCount,
    s_possCount,
    t_collect,
    t_mtd,
    t_bal,
    t_refund,
  } = project

  const data = {
    series: [
      {
        name: 'Spent',
        data: [22, 80, 36, 50, 60, 30],
      },
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
  }
  const theme = useTheme()
  const { t } = useTranslation()
  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    colors: ['#5928E5'],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
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
      categories: data.categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '60%',
        rangeBarOverlap: false,
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
            labels: {
              show: false,
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

  function formatIndianNumber(num) {
    if (num >= 1_00_00_00_000) return (num / 1_00_00_00_000).toFixed(1) + 'Lcr+'
    if (num >= 1_00_00_000) return (num / 1_00_00_000).toFixed(1) + 'Cr+'
    if (num >= 1_00_000) return (num / 1_00_000).toFixed(1) + 'L+'
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K+'
    return num.toString()
  }

  const chartSeries = data.series
  return (
    <>
      <div onClick={() => setIsNewProjectOpen(true)} className="cursor-pointer">
        <div className="flex flex-row bg-white rounded-2xl w-full h-full shadow-sm mb-4 ">
          {/* <div className="w-64 flex">
            <div className="w-full">
              <div className="MuiPaper-elevation  MuiPaper-elevation1 MuiCard-root css-1fwf2za-MuiPaper-root-MuiCard-root bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-r-xl">
                <div  className='flex flex-col items-center mb-4'>
                  <div className="flex flex-col align-middle justify-between">
                    <Link
                      className="flex flex-col items-center"
                    >
                      <img className="w-10 h-10" alt="" src="/apart.svg"></img>
                      <span className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 mt-[8px]">
                        {projectName}
                      </span>
                    </Link>
                  </div>


                  <section className="flex flex-row justify-between mt-2">
                    <span className="text-sm  font-light  font text-gray-800 ">
                      {projectType?.name}
                    </span>
                    <section>
                      <span className="text-sm  font-light  font text-gray-800 ">
                        {area}
                      </span>
                      <span className="text-[10px]  font-light ml-1 font text-gray-600 ">
                        sqft
                      </span>
                    </section>
                  </section>
                </div>
              </div>
            </div>
          </div> */}

          <div className="w-[25%] px-2 py-4 pl-4 ">
            {/* Right - Property Details */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                {/* <div>
    <img
      alt="CRM Background"
      src="/Apartment.svg"
      className="w-[72px] h-auto object-cover"
    />
  </div> */}

                <div>
                  <img
                    alt="CRM Background"
                    src={
                      projectType?.name === 'Plots'
                        ? '/Plots.svg'
                        : projectType?.name === 'Villas'
                        ? '/Villas.svg'
                        : projectType?.name === 'WeekendVillas'
                        ? '/WeekendVillas.svg'
                        : '/Apartment.svg' // default
                    }
                    className="w-[72px] h-auto object-cover"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="font-[Outfit] text-[#000000] font-medium text-base leading-none tracking-normal">
                    {' '}
                    {projectName}
                  </h2>
                  <p className="font-[Outfit] text-[#606062] font-normal text-xs leading-none tracking-normal">
                    HSR Layout
                  </p>
                  <p className="font-[Outfit] text-[#606062] font-normal text-xs leading-none tracking-normal">
                    Bangalore-560042
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <span className="py-1 px-3 border  rounded-full  border-[#E7E7E9]  text-[12px]">
                  {' '}
                  {projectType?.name || 'No Data'}{' '}
                </span>
                <span className="py-1 px-3 border  rounded-full  border-[#E7E7E9]  text-[12px]">
                  {' '}
                  {area || 'No Data'}
                </span>
              </div>

              <div className="flex gap-2 mt-1">
                <div className="flex items-center gap-1 border  rounded-full  border-[#E7E7E9]  px-3 py-1 rounded-full">
                  <span className="text-[12px]">Planning Approval</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>

                <div className="flex items-center gap-1 border  rounded-full  border-[#E7E7E9]  px-3 py-1 rounded-full">
                  <span className="text-[12px]">Rera Approval</span>
                  <XCircle size={16} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="h-24 border-r rounded-sm border-[#E7E7E9] mx-2 self-center"></div>

          <div className="w-[35%] my-4">
            {/* {' '}
            <div>
              <> */}
            {/* <div className="flex flex-col w-full h-full justify-between"> */}
            <h6 className="text-[#606062] text-[12px] font-medium  leading-[100%] tracking-[0.06em] uppercase">
              {'Units'}
            </h6>
            <div className="flex items-end justify-between h-40">
              {[
                { item: 'Total', value: totalUnitCount || 0 },
                { item: 'Available', value: availableCount || 0 },
                { item: 'Sold', value: soldUnitCount || 0 },
                { item: 'Blocked', value: blockedUnitCount || 0 },
                { item: 'Cust B', value: custBlockCount || 0 },
                { item: 'Mang B', value: mangBlockCount || 0 },
              ].map((data, i) => (
                <div
                  className="w-1/4 mx-1"
                  style={{
                    display: 'inline-block',
                    alignSelf: 'flex-end',
                  }}
                  key={i}
                >
                  <h6 className="text-[#000000] font-[500] text-[12px] leading-[100%] tracking-[0.06em] text-center font-[Outfit] mb-1 mt-1">
                    {t(data?.value)}
                  </h6>

                  <div className="">
                    <LinearProgress
                      sx={{
                        backgroundColor: 'white',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#78D0EA',
                        },
                      }}
                      variant="determinate"
                      value={100}
                      style={{
                        backgroundColor: '#22D3EE',
                        borderRadius: '3px',
                        height: `${58 * (data.value / totalUnitCount)}px`,
                        width: `100%`,
                      }}
                    />
                  </div>
                  <div className="flex  justify-center mr-1  mb-1 mt[2px]">
                    <h6 className="font-bodyLato  text-xs mt-1">
                      {t(data.item)}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
            {/* </div> */}
            {/* </>
            </div> */}
          </div>

          <div className="h-24 border-r rounded-sm border-[#E7E7E9] mx-2 self-center"></div>

          <div className="w-1/4  ">
            <div className="flex flex-col  my-2  px-2  py-2">
              <h6 className="text-[#606062] text-[12px] font-medium  leading-[100%] tracking-[0.06em] uppercase m-1 mb-4">
                {'Status Pipeline'}
              </h6>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col justify-between px-1">
                  {[
                    { item: 'Total', value: soldUnitCount || 0 },
                    { item: 'Booked', value: bookUnitCount || 0 },
                    { item: 'Allotment', value: project?.s_agreeCount || 0 },
                  ].map((data, i) => (
                    <div
                      className=" w-1/4  mx-1"
                      style={{
                        display: 'inline-block',
                        alignSelf: 'flex-start',
                      }}
                      key={i}
                    >
                      <div className="flex flex-col gap-2 justify-center mr-1  mb-1 mt[2px]">
                        <h6 className="font-normal text-[12px] leading-[100%] tracking-[0em] text-[#606062] mt-1">
                          {t(data.item)}
                        </h6>
                        <h6 className="font-bodyLato font-semibold text-xs mt-1">
                          {t(data.value)}
                        </h6>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-between px-1">
                  {[
                    { item: 'Agreement', value: project?.atsCount || 0 },
                    { item: 'Registration', value: project?.s_regisCount || 0 },
                    { item: 'Possession', value: s_possCount || 0 },
                  ].map((data, i) => (
                    <div
                      className=" w-1/4  mx-1"
                      style={{
                        display: 'inline-block',
                        alignSelf: 'flex-start',
                      }}
                      key={i}
                    >
                      <div className="flex flex-col gap-2 justify-center mr-1  mb-1 mt[2px]">
                        <h6 className="font-normal text-[12px] leading-[100%] tracking-[0em] text-[#606062] mt-1">
                          {t(data.item)}
                        </h6>
                        <h6 className="font-bodyLato font-semibold text-xs mt-1">
                          {t(data.value)}
                        </h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="h-24 border-r rounded-sm border-[#E7E7E9] mx-2 self-center"></div>

          <div className="w-1/4  px-1">
            <div className="flex flex-col  my-2  px-2  py-2">
              <h6 className=" text-[#606062] text-[12px] font-medium  leading-[100%] tracking-[0.06em] uppercase m-1 mb-4">
                {'Transactions'}
              </h6>
              <div className=" flex flex-row justify-between ">
                <div className="flex flex-col justify-between px-1">
                  {[
                    { item: 'Total', value: totalValue || 0 },
                    { item: 'Sale', value: soldValue || 0 },
                    { item: 'Collected', value: t_collect || 0 },
                  ].map((data, i) => (
                    <div
                      className=" w-1/4  mx-1"
                      style={{
                        display: 'inline-block',
                        alignSelf: 'flex-start',
                      }}
                      key={i}
                    >
                      <div className="flex flex-col  gap-2 justify-center mr-1  mb-2 mt[2px]">
                        <h6 className="font-normal text-[12px] leading-[100%] tracking-[0em] text-[#606062] mt-1">
                          {t(data.item)}
                        </h6>
                        {/* <h6 className="font-bodyLato font-semibold text-xs mt-1">
                        ₹{t(data?.value?.toLocaleString('en-IN'))}
                      </h6> */}

                        <div
                          className="relative flex flex-col gap-2 items-center group"
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
                                {/* {formatIndianNumber?.(Math.round((finData?.T_review || 0) + (finData?.T_approved || 0)))} */}
                                {/* {formatIndianNumber(data?.value?.toLocaleString('en-IN'))} */}
                                ₹{t(data?.value?.toLocaleString('en-IN'))}
                              </span>
                            </span>
                            <div
                              className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                              style={{
                                background: '#213343',
                                marginRight: '12px',
                              }}
                            ></div>
                          </div>
                          <span className="text-[#0E0A1F] font-medium text-[12px] font-outfit tracking-wide">
                            {/* ₹{finData?.T_elgible_balance < 0 ? 0 : Math.round(finData?.T_elgible_balance).toLocaleString('en-IN')} */}
                            ₹{t(formatIndianNumber(data?.value))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-between px-1">
                  {[
                    { item: 'MTD ', value: t_mtd || 0 },
                    { item: 'Balance', value: t_bal || 0 },
                    { item: 'Refunds', value: t_refund || 0 },
                  ].map((data, i) => (
                    <div
                      key={i}
                      className=" w-1/4  mx-1"
                      style={{
                        display: 'inline-block',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <div className="flex flex-col gap-2  justify-center mr-1  mb-1 mt[2px]">
                        <h6 className="font-normal text-[12px] leading-[100%] tracking-[0em] text-[#606062] mt-1">
                          {t(data.item)}
                        </h6>
                        {/* <h6 className="font-bodyLato font-semibold text-xs mt-1">
                        ₹{t(data?.value?.toLocaleString('en-IN'))}
                      </h6> */}

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
                                {/* {formatIndianNumber?.(Math.round((finData?.T_review || 0) + (finData?.T_approved || 0)))} */}
                                {/* {formatIndianNumber(data?.value?.toLocaleString('en-IN'))} */}
                                ₹{t(data?.value?.toLocaleString('en-IN'))}
                              </span>
                            </span>
                            <div
                              className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                              style={{
                                background: '#213343',
                                marginRight: '12px',
                              }}
                            ></div>
                          </div>
                          <span className="text-[#0E0A1F] font-medium text-[12px] font-outfit tracking-wide">
                            {/* ₹{finData?.T_elgible_balance < 0 ? 0 : Math.round(finData?.T_elgible_balance).toLocaleString('en-IN')} */}
                            ₹{t(formatIndianNumber(data?.value))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiderForm
        open={isNewProjectOpen}
        setOpen={handleNewProjectClose}
        title="project_details"
        data={project}
        setProject={setProject}
        widthClass="max-w-4xl"
      />
    </>
  )
}

export default ProjectsMHomeBody
