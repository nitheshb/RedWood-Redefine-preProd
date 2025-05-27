import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  PlusCircle,
  ChevronRight,
  FileText,
  MessageSquare,
} from 'lucide-react'
import SemicircleProgressChart from './Reports/charts/SemiCircleProgress'

export default function ProjectManagement() {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false)
  const [isAssignedExpanded, setIsAssignedExpanded] = useState(false)

  const projectData = {
    projects: [
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
      {
        name: 'Shuba Ecoston Ph 2',
        date: 'Apr 22, 2025',
      },
    ],
    assignedTo: [
      {
        name: 'Vishal Kumar',
        date: 'Apr 22, 2025',
        isActive: true,
      },
      {
        name: 'Priya Sharma',
        date: 'Apr 21, 2025',
        isActive: false,
      },
      {
        name: 'Rajiv Mehta',
        date: 'Apr 20, 2025',
        isActive: false,
      },
      {
        name: 'Deepak Gupta',
        date: 'Apr 18, 2025',
        isActive: false,
      },
    ],
    siteVisit: {
      date: '27 Mar 2025',
      inCharge: 'Chaithanya',
      count: 4,
    },
    taskLogs: {
      priceQuotations: 1,
      completedTasks: 12,
      totalComments: 10,
    },
  }

  const toggleProjectsExpand = () => {
    setIsProjectsExpanded(!isProjectsExpanded)
  }

  const toggleAssignedExpand = () => {
    setIsAssignedExpanded(!isAssignedExpanded)
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 p-4">
        <div>
          <div className=" bg-[#F9F9FB] rounded-lg p-6 ">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                <img
                  src="/quill_clock.svg"
                  alt=""
                  className="w-[18px] h-[18px]"
                />
              </div>

              <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                UPCOMING TASK
              </span>
            </div>

            <h2 className="font-medium text-[16px]  text-[#0E0A1F] font-outfit">
              Get into Introduction Call with customer
            </h2>

            <div className="flex flex-wrap text-gray-600 mt-2 mb-4">
              <div className="flex items-center mr-6 mb-2">
                <span className="font-normal text-[14px] text-[#606062] font-outfit">
                  20 Mar 2025, 10:57 am
                </span>
                <span className="mx-3 text-gray-300">|</span>
              </div>

              <div className="flex items-center mr-6 mb-2">
                <span className="font-normal text-[14px]  text-[#606062] font-outfit">
                  Assigned to:{' '}
                  <span className="font-normal text-[14px] text-[#606062] font-outfit">
                    vishal@gmail.com
                  </span>
                </span>
                <span className="mx-3 text-gray-300">|</span>
              </div>

              <div className="flex items-center mb-2">
                <span className="font-normal text-[14px]  text-[#606062] font-outfit">
                  Created by: Vishal Kumar
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-gray-400 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-1.008c-.417.18-.875.327-1.356.43A.75.75 0 013.75 16.5v-2.87c0-.642.225-1.255.635-1.725A6.922 6.922 0 003 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="font-normal text-[14px]  text-[#606062] font-outfit">
                <span className="font-medium">Recent Comments:</span> Villa is
                nice and good infrastructure
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            {/* Left Column */}
            <div className="space-y-4">
                  {/* Site Visit Section */}
                  <div className="bg-[#F9F9FB] p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                    {/* <Clock className="text-purple-600" size={20} /> */}
                    <img
                      src="/quill_clock.svg"
                      alt=""
                      className="w-[18px] h-[18px]"
                    />
                  </div>
                  <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                    SITE VISIT ({projectData.siteVisit.count})
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2 flex-col">
                    <div className="font-normal text-[14px] leading-[100%] tracking-[0%] text-[#606062]">
                      Visit Date: {projectData.siteVisit.date}
                    </div>
                    <div className="font-normal text-[14px] leading-[100%] tracking-[0%] text-[#606062]">
                      Site In-charge: {projectData.siteVisit.inCharge}
                    </div>
                  </div>
                  <button className="font-semibold text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F]">
                    Review emoji
                  </button>
                </div>
              </div>
              {/* Lead Strength Card */}
              <div className="bg-[#F9F9FB] p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                    {/* <Clock className="text-purple-500 w-5 h-5" /> */}
                    <img
                      src="/quill_clock.svg"
                      alt=""
                      className="w-[18px] h-[18px]"
                    />
                  </div>
                  <h2 className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                    LEAD STRENGTH
                  </h2>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <p className="font-normal text-[14px] leading-[100%] tracking-[0%] text-[#606062] mb-1">
                      Total Questions: 2/3
                    </p>
                    <p className="font-normal text-[14px] leading-[100%] tracking-[0%] text-[#606062]">
                      Last Updated: 27 Mar, 4:30 pm
                    </p>
                  </div>
                  {/* <div className="relative w-20 h-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">50%</span>
        </div>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#e6e6f0"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#6366f1"
            strokeWidth="8"
            strokeDasharray="226"
            strokeDashoffset="113"
          />
        </svg>
      </div> */}

                  <div>
                    <SemicircleProgressChart progress={0} />
                  </div>
                </div>
              </div>



              {/* Task Logs Section */}
              <div className="bg-[#F9F9FB] p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                    <img
                      src="/quill_clock.svg"
                      alt="Clock Icon"
                      className="w-[18px] h-[18px]"
                    />
                  </div>
                  <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                    TASK LOGS
                  </span>
                  <div className="ml-auto">
                    <img
                      src="/arrowright.svg"
                      alt="Arrow Right Icon"
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                <div className="space-y-4 px-4">
                  {[
                    {
                      label: 'Price Quotations',
                      value: projectData.taskLogs.priceQuotations,
                    },
                    {
                      label: 'Completed Tasks',
                      value: projectData.taskLogs.completedTasks,
                    },
                    {
                      label: 'Total Comments',
                      value: projectData.taskLogs.totalComments,
                    },
                  ].map((item, index, array) => (
                    <div
                      key={item.label}
                      className={`${
                        index !== array.length - 1 ? 'border-b pb-3 mb-3' : ''
                      }`}
                    >
                      <div className="flex justify-between  items-center">
                        <div className="flex gap-2 items-center">
                          <img
                            src="/fileicon.svg"
                            alt="File Icon"
                            className="w-5 h-5"
                          />
                          <span className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                            {item.label}
                          </span>
                        </div>
                        <span className="font-outfit font-normal text-xs leading-tight tracking-tight text-[#606062]">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Projects Card */}
              <div className="bg-[#F9F9FB] p-4 rounded-lg shadow-sm">
                {!isProjectsExpanded && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                        {/* <Clock className="text-purple-600" size={20} /> */}
                        <img
                          src="/quill_clock.svg"
                          alt=""
                          className="w-[18px] h-[18px]"
                        />
                      </div>
                      <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                        PROJECTS (3)
                      </span>
                      <div className="ml-auto">
                        <button className="bg-purple-600 p-2 rounded-lg text-white">
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-[12px] leading-[100%] tracking-normal text-[#404040]">
                            {projectData.projects[0].name}
                          </span>
                          <span className="font-normal text-[12px] leading-[100%] tracking-normal text-[#666666] ml-2">
                            {projectData.projects[0].date}
                          </span>
                        </div>
                        <div className="flex items-center ml-auto">
                          <button className="font-outfit text-[#7746E0] font-normal text-[12px] leading-[100%] tracking-[0em] underline decoration-solid decoration-[0px] underline-offset-[0%]">
                            View units
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={toggleProjectsExpand}
                      className="flex items-center font-medium text-[12px] leading-[100%] tracking-[0em] text-[#7746E0] mt-2"
                    >
                      +7 more <ChevronDown size={16} className="ml-1" />
                    </button>
                  </div>
                )}
                {/* Expanded View */}
                {isProjectsExpanded && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                        {/* <Clock className="text-purple-600" size={20} /> */}
                        <img
                          src="/quill_clock.svg"
                          alt=""
                          className="w-[18px] h-[18px]"
                        />
                      </div>
                      <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                        PROJECTS (3)
                      </span>
                      <div className="ml-auto">
                        <button className="bg-purple-600 p-2 rounded-lg text-white">
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>

                    {projectData.projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-gray-800 font-medium">
                              {project.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {project.date}
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-gray-400" />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={toggleProjectsExpand}
                      className="flex items-center text-purple-600 mt-2 font-medium"
                    >
                      Less <ChevronUp size={16} className="ml-1" />
                    </button>
                  </div>
                )}
              </div>

              {/* Assigned To Section */}
              <div className="bg-[#F9F9FB] p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                    {/* <Clock className="text-purple-600" size={20} /> */}

                    <img
                      src="/quill_clock.svg"
                      alt=""
                      className="w-[18px] h-[18px]"
                    />
                  </div>
                  <span className="font-semibold text-[12px] text-[#696990] leading-[100%] tracking-[0.06em] uppercase">
                    ASSIGNED TO
                  </span>
                </div>

                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={toggleAssignedExpand}
                >
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-[12px] leading-[100%] tracking-[0em] text-[#404040]">
                      {projectData.assignedTo[0].name}
                    </div>
                    <div className="font-normal text-[12px] leading-[100%] tracking-[0em] text-[#666666]">
                      {projectData.assignedTo[0].date}
                    </div>
                  </div>
                  {isAssignedExpanded ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>
              </div>

              {/* More Details Card */}
              {/* <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="bg-purple-100 p-2 rounded-full mr-3">
          <Clock className="text-purple-500 w-5 h-5" />
        </div>
        <h2 className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">MORE DETAILS</h2>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>

    <div className="flex justify-between">
      <div>
        <p className="font-outfit font-normal text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F] mb-4">updated on : 27 Mar 2025</p>
        <p className="font-outfit font-normal text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F]">Assigned on : 27 Mar 2025</p>
      </div>
      <div>
        <p className="font-outfit font-normal text-[14px] leading-[100%] tracking-[0em] text-[#0E0A1F] text-right">Created on: 27 Mar 2025</p>
      </div>
    </div>
  </div> */}
              {/* Call Activity Card */}
              <div className="bg-[#F9F9FB] p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
                      <img
                        src="/quill_clock.svg"
                        alt="Clock Icon"
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                    <h2 className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                      CALL ACTIVITY
                    </h2>
                  </div>
                  <img
                    src="/arrowright.svg"
                    alt="Arrow Icon"
                    className="w-5 h-5"
                  />
                </div>

                <div className="space-y-4 px-4">
                  {[
                    {
                      label: 'Total Talk time',
                      value: '102 hrs, 32 mins',
                    },
                    {
                      label: 'No of time Contacted',
                      value: '30 times',
                    },
                    {
                      label: 'RNR',
                      value: '20 times',
                    },
                  ].map((item, index, array) => (
                    <div
                      key={item.label}
                      className={`flex justify-between items-center ${
                        index !== array.length - 1
                          ? 'pb-3 border-b border-gray-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <img
                            src="/fileicon.svg"
                            alt="Icon"
                            className="w-5 h-5"
                          />
                        </div>
                        <p className="font-outfit font-normal text-sm leading-tight tracking-tight text-[#606062]">
                          {item.label}
                        </p>
                      </div>
                      <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0em] text-[#616162]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
