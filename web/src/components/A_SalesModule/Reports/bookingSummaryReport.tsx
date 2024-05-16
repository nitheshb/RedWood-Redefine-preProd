import React, { useState } from 'react'

import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import '../../../styles/myStyles.css'
import { GoTrue } from '@redwoodjs/auth/dist/authClients/goTrue'

import PieChartComponent from './charts/salePieChart'
import BubbleChartComponent from './charts/salesBubbleChart'
import StackedLeadsChart from './charts/salesStackedChart'

const data = [
  { label: 'Desktop', value: 20, color: '#ff6347' }, // Red
  { label: 'Mobile', value: 30, color: '#4682b4' }, // Blue
  { label: 'Others', value: 40, color: '#32cd32' }, // Green
]

const data1 = ['Inprogress']
const data2 = ['Not Interested']
const data3 = ['Site Visits ']
const data4 = ['Followup']
const data5 = ['Booking']
const data6 = ['Highest volume(24h)']

const totalProfit = '98,6543.53'
const profitPercentage = '24.21%'
const performanceText = 'You have a great Performance'
const avgGrowingData = [
  {
    percentage: '2.34%',
    text: 'Booked',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#cfe5eb',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm1 5.75A.75.75 0 0 1 5.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    percentage: '3.45%',
    text: 'Site Visit',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e2d9f7',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M12 1.69a.494.494 0 0 0-.438-.494 32.352 32.352 0 0 0-7.124 0A.494.494 0 0 0 4 1.689v.567c-.811.104-1.612.24-2.403.406a.75.75 0 0 0-.595.714 4.5 4.5 0 0 0 4.35 4.622A3.99 3.99 0 0 0 7 8.874V10H6a1 1 0 0 0-1 1v2h-.667C3.597 13 3 13.597 3 14.333c0 .368.298.667.667.667h8.666a.667.667 0 0 0 .667-.667c0-.736-.597-1.333-1.333-1.333H11v-2a1 1 0 0 0-1-1H9V8.874a3.99 3.99 0 0 0 1.649-.876 4.5 4.5 0 0 0 4.35-4.622.75.75 0 0 0-.596-.714A30.897 30.897 0 0 0 12 2.256v-.567ZM4 3.768c-.49.066-.976.145-1.458.235a3.004 3.004 0 0 0 1.64 2.192A3.999 3.999 0 0 1 4 5V3.769Zm8 0c.49.066.976.145 1.458.235a3.004 3.004 0 0 1-1.64 2.192C11.936 5.818 12 5.416 12 5V3.769Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    percentage: '1.98%',
    text: 'LeadSources',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e2d9f7',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"
        />
        <path
          fillRule="evenodd"
          d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"
        />
      </svg>
    ),
  },
  {
    percentage: '2.87%',
    text: 'Cost per lead',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ffe0bb',
          padding: '8px',
        }}
      >
        <path
          fillRule="evenodd"
          d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z"
        />
      </svg>
    ),
  },
]

const BookingSummaryReport = () => {
  const [isClicked, setisClicked] = useState('business_tasks')
  return (
    <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  ">
      <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg ">
        <div className="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row flex-wrap">
              <div className="bg-[#fff] rounded-lg shadow-xl  ">
                {/* Block 1 */}
                <div className="flex flex-col h-full">
                  <div className="card-block1 flex justify-between mb-8">
                    <div className="flex-1 mr-4  p-4">
                      <div>
                        <section className="text-black  font-weight-[600] mt-1 mb-2">
                          Total Leads
                        </section>

                        <span>12 January 2023 - 12 January 2024</span>
                      </div>
                      <div className="inline-flex mt-8">
                        <p className="text-3xl font-bold">₹{totalProfit}</p>
                        <span className="p-3 pl-4 font-medium">
                          {profitPercentage}
                        </span>
                      </div>
                      <p className="p-0 cursor-pointer">
                        <span className="border p-1 border-gray-300 text-black m-1 rounded-tl-2xl rounded-br-2xl rounded-tr-2xl font-medium text-sm">
                          {performanceText}
                        </span>
                      </p>
                    </div>
                    <div className="flex-1 bg-green-200 rounded-lg p-4">
                      <p>Graph</p>
                    </div>
                  </div>

                  {/*  card-block2 */}
                  <div className=" flex flex-wrap">
                    {avgGrowingData.map((data, index) => (
                      <div
                        key={index}
                        className={`flex-1 p-4 ${
                          index !== avgGrowingData.length - 1
                            ? 'border-r border-gray-300'
                            : ''
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {data.icon}
                          <p className="ml-2">{data.text}</p>
                        </div>
                        <p className="font-bold text-xl">{data.percentage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* section 2 */}

            </div>

            {/* section - 2 */}
            <section className="w-full border-[#e7e5eb] bg-white rounded-lg p-4">
              <div className="flex flex-col"></div>
              <section className="flex flex-row justify-between">
                <article className="flex flex-col">
                  <div className="text-[#1f2937]">Revenue</div>
                  <div className="text-[#1f2937] font-[700] text-2xl mt-2">
                    ₹62,820.59
                  </div>
                  <div className="text-[#EF4444] text-xs mt-1">
                    0.2% less than the previous 30 days
                  </div>
                </article>
                <article>date</article>
              </section>

              <div className="w-full h-[400px] mt-4">
                <section className="flex flex-row justify-between">
                  <article></article>
                  <article className="flex flex-row mr-2 mb-3">
                    <section className="flex flex-row">
                      <div className="text-[#1f2937] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#9333ea]"></div>
                      <div className="text-[#4b5563] text-xs"> This month</div>
                    </section>
                    <section className="flex flex-row">
                      <div className="text-[#2563eb] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#2563eb]"></div>
                      <div className="text-[#4b5563] text-xs"> Last month</div>
                    </section>
                  </article>
                </section>
                <StackedLeadsChart />
              </div>
            </section>
            {/* section - 3 */}
            <section className="flex flex-row flex-wrap gap-2">
              <section className="w-[49%] border-[#e7e5eb] bg-white rounded-lg p-4">
                <div className="flex flex-col"></div>
                <section className="flex flex-row justify-between">
                  <article className="flex flex-col">
                    <div className="text-[#1f2937]">Revenue</div>
                    <div className="text-[#1f2937] font-[700] text-2xl mt-2">
                      ₹62,820.59
                    </div>
                    <div className="text-[#EF4444] text-xs mt-1">
                      0.2% less than the previous 30 days
                    </div>
                  </article>
                  <article>date</article>
                </section>

                <div className="w-full h-[400px] mt-4">
                  <section className="flex flex-row justify-between">
                    <article></article>
                    <article className="flex flex-row mr-2 mb-3">
                      <section className="flex flex-row">
                        <div className="text-[#1f2937] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#9333ea]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          This month
                        </div>
                      </section>
                      <section className="flex flex-row">
                        <div className="text-[#2563eb] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#2563eb]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          Last month
                        </div>
                      </section>
                    </article>
                  </section>
                  <StackedLeadsChart />
                </div>
                {/* bottom sheet */}
                <section className="mt-3 ml-4">
                  <div className="text-[#1f2937] font-[600] text-xl">
                    Conversion funnel
                  </div>
                  <div className="flex flex-row border-b border-gray-200">
                    <ul
                      className="flex flex-wrap -mb-px mt-1"
                      id="myTab"
                      data-tabs-toggle="#myTabContent"
                      role="tablist"
                    >
                      {[
                        {
                          lab: 'First-Time',
                          val: 'business_tasks',
                          color: '#4F46E5',
                        },
                        {
                          lab: 'Returning',
                          val: 'personal_tasks',
                          color: '#9333EA',
                        },
                      ].map((d, i) => {
                        return (
                          <li key={i} className="mr-4">
                            {' '}
                            <button
                              className={`inline-block pb-[6px] mr-3 text-sm  text-center text-black rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${
                                isClicked === d.val
                                  ? 'border-black'
                                  : 'border-transparent'
                              }`}
                              type="button"
                              role="tab"
                              onClick={() => setisClicked(d.val)}
                            >
                              <section className="flex flex-row text-[15px] mb-1ss ">
                                <div
                                  className={`w-3 h-3 bg-[${d.color}] mt-1 mr-1 rounded-sm`}
                                ></div>
                                {d.lab}
                              </section>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </section>
                <article className="text-[#4f46e5] text-center font-[500] text-[13px]">
                  View full Report
                </article>
              </section>
              <section className="w-[49%] border-[#e7e5eb] bg-white rounded-lg p-4">
                <div className="flex flex-col"></div>
                <section className="flex flex-row justify-between">
                  <article className="flex flex-col">
                    <div className="text-[#1f2937]">Revenue</div>
                    <div className="text-[#1f2937] font-[700] text-2xl mt-2">
                      ₹62,820.59
                    </div>
                    <div className="text-[#EF4444] text-xs mt-1">
                      0.2% less than the previous 30 days
                    </div>
                  </article>
                  <article>date</article>
                </section>

                <div className="w-full h-[400px] mt-4">
                  <section className="flex flex-row justify-between">
                    <article></article>
                    <article className="flex flex-row mr-2 mb-3">
                      <section className="flex flex-row">
                        <div className="text-[#1f2937] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#9333ea]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          This month
                        </div>
                      </section>
                      <section className="flex flex-row">
                        <div className="text-[#2563eb] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#2563eb]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          Last month
                        </div>
                      </section>
                    </article>
                  </section>
                  <PieChartComponent />
                </div>
              </section>
            </section>
            {/* section-4 */}
            <section className="flex flex-row flex-wrap gap-2">
              <section className="w-[49%] border-[#e7e5eb] bg-white rounded-lg p-4">
                <div className="text-[#1f2937] font-[600] text-xl mb-2 ml-2">
                  Location
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Product name
                      </th>
                      <th scope="col" className="px-6 py-3 w-[200px]">
                        Color
                      </th>

                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        Apple MacBook Pro 17
                      </th>
                      <td className="px-6 py-4 flex justify-end">
                        <div className="w-full mt-2 h-[6px] rounded-md bg-[#6366F1]"></div>
                      </td>

                      <td className="px-6 py-4 ">$2999</td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        Microsoft Surface Pro
                      </th>
                      <td className="px-6 py-4 flex justify-end">
                        <div className="w-[50%] mt-2 h-[6px] rounded-md bg-[#6366F1]"></div>
                      </td>
                      <td className="px-6 py-4 ">$1999</td>
                    </tr>
                    <tr className="bg-white ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        Magic Mouse 2
                      </th>
                      <td className="px-6 py-4 flex justify-end">
                        <div className=" w-[25%] mt-2 h-[6px] rounded-md bg-[#6366F1]"></div>
                      </td>
                      <td className="px-6 py-4">$99</td>
                    </tr>
                  </tbody>
                </table>
              </section>
              <section className="w-[49%] border-[#e7e5eb] bg-white rounded-lg p-4">
                <div className="">
                  <ul className="divide-y divide-gray-200">
                    {/* Table Header */}
                    <li className="flex items-center py-2">
                      <div className="w-2/4 px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Header 1
                      </div>
                      <div className="w-1/4 px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Header 2
                      </div>
                      <div className="w-1/4 px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Header 3
                      </div>
                      <div className="w-1/4 px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Header 4
                      </div>
                    </li>
                    {/* Table Rows */}
                    <li className="flex items-center py-2">
                      <div className="relative w-full raxhy truncate">
                        <span
                          className="block text-blue-300  relative truncate w-full"
                          style={{ zIndex: '1' }}
                        >
                          preiline.co
                        </span>
                        <div
                          className="absolute bg-[$e0e7ff] dark:bg-indigo-500/20"
                          style={{ width: '100%', top: '0px', bottom: '0px' }}
                        ></div>
                      </div>
                      <div className="w-1/4 px-6 py-4 bg-white text-sm text-gray-500">
                        Row 1, Column 2
                      </div>
                      <div className="w-1/4 px-6 py-4 bg-white text-sm text-gray-500">
                        Row 1, Column 3
                      </div>
                      <div className="w-1/4 px-6 py-4 bg-white text-sm text-gray-500">
                        Row 1, Column 4
                      </div>
                    </li>
                    {/* Add more rows as needed */}
                  </ul>
                </div>
              </section>
            </section>
            {/* section-5 */}
        
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingSummaryReport
