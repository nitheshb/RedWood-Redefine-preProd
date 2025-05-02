import React, { useState } from 'react'
import '../../../styles/myStyles.css'
import PieChartComponent from './charts/salePieChart'
import StackedLeadsChart from './charts/salesStackedChart'

const data = [
  { label: 'Desktop', value: 20, color: '#ff6347' },
  { label: 'Mobile', value: 30, color: '#4682b4' },
  { label: 'Others', value: 40, color: '#32cd32' },
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
        width="30"
        height="31"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#FFEBF3',
          padding: '8px',
        }}
      >
        <path
          d="M10 23.3057H20V20.8057H10V23.3057ZM10 18.3057H20V15.8057H10V18.3057ZM7.5 28.3057C6.8125 28.3057 6.22396 28.0609 5.73438 27.5713C5.24479 27.0817 5 26.4932 5 25.8057V5.80566C5 5.11816 5.24479 4.52962 5.73438 4.04004C6.22396 3.55046 6.8125 3.30566 7.5 3.30566H17.5L25 10.8057V25.8057C25 26.4932 24.7552 27.0817 24.2656 27.5713C23.776 28.0609 23.1875 28.3057 22.5 28.3057H7.5ZM16.25 12.0557V5.80566H7.5V25.8057H22.5V12.0557H16.25Z"
          fill="#353535"
        />
      </svg>
    ),
  },
  {
    percentage: '3.45%',
    text: 'Site Visit',
    icon: (
      <svg
        width="31"
        height="31"
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#EBFFF3',
          padding: '8px',
        }}
      >
        <path
          d="M8.82373 27.0557V24.5557H13.8237V20.6807C12.8029 20.4515 11.8914 20.0192 11.0894 19.3838C10.2873 18.7484 9.69873 17.9515 9.32373 16.9932C7.76123 16.8057 6.45394 16.1234 5.40186 14.9463C4.34977 13.7692 3.82373 12.389 3.82373 10.8057V9.55566C3.82373 8.86816 4.06852 8.27962 4.55811 7.79004C5.04769 7.30046 5.63623 7.05566 6.32373 7.05566H8.82373V4.55566H21.3237V7.05566H23.8237C24.5112 7.05566 25.0998 7.30046 25.5894 7.79004C26.0789 8.27962 26.3237 8.86816 26.3237 9.55566V10.8057C26.3237 12.389 25.7977 13.7692 24.7456 14.9463C23.6935 16.1234 22.3862 16.8057 20.8237 16.9932C20.4487 17.9515 19.8602 18.7484 19.0581 19.3838C18.256 20.0192 17.3446 20.4515 16.3237 20.6807V24.5557H21.3237V27.0557H8.82373ZM8.82373 14.3057V9.55566H6.32373V10.8057C6.32373 11.5973 6.5529 12.3109 7.01123 12.9463C7.46956 13.5817 8.07373 14.0348 8.82373 14.3057ZM15.0737 18.3057C16.1154 18.3057 17.0008 17.9411 17.73 17.2119C18.4591 16.4827 18.8237 15.5973 18.8237 14.5557V7.05566H11.3237V14.5557C11.3237 15.5973 11.6883 16.4827 12.4175 17.2119C13.1466 17.9411 14.0321 18.3057 15.0737 18.3057ZM21.3237 14.3057C22.0737 14.0348 22.6779 13.5817 23.1362 12.9463C23.5946 12.3109 23.8237 11.5973 23.8237 10.8057V9.55566H21.3237V14.3057Z"
          fill="#353535"
        />
      </svg>
    ),
  },
  {
    percentage: '1.98%',
    text: 'LeadSources',
    icon: (
      <svg
        width="31"
        height="31"
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#FFF3D4',
          padding: '8px',
        }}
      >
        <path
          d="M9.39404 23.3057V20.8057M15.644 23.3057V19.5557M21.894 23.3057V17.0557M3.76904 15.8057C3.76904 10.2077 3.76904 7.40878 5.50809 5.66971C7.24716 3.93066 10.0461 3.93066 15.644 3.93066C21.2419 3.93066 24.0409 3.93066 25.78 5.66971C27.519 7.40878 27.519 10.2077 27.519 15.8057C27.519 21.4035 27.519 24.2025 25.78 25.9417C24.0409 27.6807 21.2419 27.6807 15.644 27.6807C10.0461 27.6807 7.24716 27.6807 5.50809 25.9417C3.76904 24.2025 3.76904 21.4035 3.76904 15.8057Z"
          stroke="#141B34"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.13428 15.1633C10.8282 15.253 16.9367 14.8464 20.4112 9.33207M18.1344 8.66586L20.4788 8.28854C20.7645 8.25215 21.184 8.47774 21.2872 8.74665L21.907 10.7947"
          stroke="#141B34"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    percentage: '2.87%',
    text: 'Cost per lead',
    icon: (
      <svg
        width="31"
        height="31"
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#EBFFF3',
          padding: '8px',
        }}
      >
        <path
          d="M4.46434 23.5296L2.46777 21.5405L12.0093 11.944L17.0093 16.944L23.1356 10.8652H19.9678V8.02148H27.9759V16.0221H25.1321V12.8546L17.0093 20.9849L12.0093 15.9849L4.46434 23.5296Z"
          fill="#353535"
        />
      </svg>
    ),
  },
]

const SalesSummaryReport = () => {
  const [isClicked, setisClicked] = useState('business_tasks')
  return (
    <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  px-4">
      <div className="flex flex-col  mt-4 drop-shadow-md rounded-lg  px-4">
        <div className="m-2">
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
              <div className="bg-[#fff]  rounded-lg shadow-xl min-h-[340px] min-w-[200px] ml-2">
                {/* Block 2 */}
                <div className="w-full flex">
                  <div className="bg-[#fff] rounded-lg  min-h-[175px] min-w-[100px] row-span-1">
                    {/* Block Blue 1 */}
                    <p
                      className="crnsr-text pl-2 py-2"
                      style={{ fontWeight: '600', fontSize: '1.1rem' }}
                    >
                      Leads
                    </p>
                    <div className="flex flex-row gap-3 p-4 pt-2">
                      {/* inner block1 */}
                      <div className="bg-[#ffe0bb] rounded-lg shadow-xl min-h-[150px] min-w-[100px]">
                        {data1.map((item, index) => (
                          <div
                            key={index}
                            className="relative flex flex-col justify-between h-full"
                          >
                            <div className="flex justify-between p-2">
                              <p className="text-black">Leads</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4 absolute right-2 top-2"
                                style={{
                                  backgroundColor: 'white',
                                  borderRadius: '50%',
                                }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="flex justify-start p-2">
                              <p>$16,987 6</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Row 2 */}
                      <div className="grid grid-cols-1 gap-x-2 gap-y-2 grid-rows-1 grid-flow-row-dense">
                        <div className="bg-[#F2D2BD] rounded-lg shadow-xl min-h-[150px] min-w-[100px]">
                          {data1.map((item, index) => (
                            <div
                              key={index}
                              className="relative flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$16,987 6</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#cfe5eb] rounded-lg shadow-xl min-h-[130px] min-w-[100px]">
                          {data2.map((item, index) => (
                            <div
                              key={index}
                              className=" flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 mt-1 ml-2 right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$6,000</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* inner block2 */}
                      <div className="grid gap-x-2 gap-y-2">
                        <div className="bg-[#e2d9f7] rounded-lg shadow-xl min-h-[80px] min-w-[100px]">
                          {data3.map((item, index) => (
                            <div
                              key={index}
                              className="relative flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$11,000</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-[#d2f2fa] rounded-lg shadow-xl min-h-[80px] min-w-[100px]">
                          {data4.map((item, index) => (
                            <div
                              key={index}
                              className=" flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$3,765</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-[#f7f6b9] rounded-lg shadow-xl min-h-[80px] min-w-[100px]">
                          {data5.map((item, index) => (
                            <div
                              key={index}
                              className="relative flex flex-col justify-between h-full"
                            >
                              <div className="flex justify-between p-2">
                                <p className="text-black">{item}</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="w-4 h-4 absolute right-2 top-2"
                                  style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.75.75 0 0 1 .75.75v8.69l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V2.75A.75.75 0 0 1 8 2Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex justify-start p-2">
                                <p>$2,567</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <section className="flex flex-col flex-wrap gap-2">
              <ul
                className="flex flex-wrap -mb-px mt-1"
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                {[
                  {
                    lab: 'Users',
                    val: 'business_tasks',
                    color: '#4F46E5',
                    digit: 54382,
                  },
                  {
                    lab: 'New users',
                    val: 'new_users',
                    color: '#9333EA',
                    digit: '3.301',
                  },
                  {
                    lab: 'Returning users',
                    val: 'returning_users',
                    color: '#9333EA',
                    digit: '50,402',
                  },
                  {
                    lab: 'Avg. engagement time',
                    val: 'avg_engagement_time',
                    color: '#9333EA',
                    digit: '2m 25s',
                  },
                ].map((d, i) => {
                  return (
                    <li key={i} className="border ">
                      {' '}
                      <button
                        className={`inline-block pb-[6px]  text-sm  text-center text-black rounded-t-lg border-t-[4px]  hover:text-black hover:border-gray-300   ${
                          isClicked === d.val
                            ? 'border-[#4f46e5]'
                            : 'border-transparent'
                        }`}
                        type="button"
                        role="tab"
                        onClick={() => setisClicked(d.val)}
                      >
                        <div>
                          {/* <section className={` border-t border-2 ${
                                isClicked === d.val
                                  ? 'border-black'
                                  : 'border-transparent'
                              }`} ></section> */}
                        </div>
                        <div className=" px-[24px] py-[14px]">
                          <section className="flex flex-row text-[15px] mb-1ss ">
                            <div
                              className={`w-3 h-3 bg-[${d.color}] mt-1 mr-1 rounded-sm`}
                            ></div>
                            {d.lab}
                          </section>
                          <section className="flex flex-row text-[15px] mb-1ss ">
                            {d.digit}
                          </section>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <article className="flex flex-row">
                <div className="w-[70%]">
                  {/* <svg
                    width={863}
                    data-width={863}
                    className="datamap"
                    height={430}
                    style={{
                      overflow: 'hidden',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <g id className="datamaps-subunits">
                      <path
                        d="M578.4378937893789,242.7792215120154L580.8573357335733,243.9264048521731L582.6719171917192,243.52801371140873L583.1903690369037,242.17847239647614L585.0913591359136,241.72689985402909L586.3874887488748,240.82112740347816L586.9059405940594,238.4391941032182L588.8933393339335,237.8781237762032L589.3253825382538,236.80311695018457L590.448694869487,237.57150008042237L591.1399639963997,237.67375408025734L592.522502250225,237.72486377772208L594.2506750675068,238.33728417896813L595.0283528352836,238.6937697952079L596.7565256525653,237.72486377772208L597.534203420342,238.33728417896813L598.3118811881188,236.957003071408L599.7808280828083,237.00827509630642L600.1264626462646,236.54640600461357L600.385688568857,235.31008385367886L601.4225922592259,234.27454749297607L602.7187218721872,234.9481956145293L602.459495949595,235.87758012468234L603.2371737173717,236.03210189316206L602.9779477947795,238.59197360541032L603.9284428442844,239.55721361339045L604.7925292529253,238.948061983043L605.8294329432944,238.64287737513382L607.2983798379838,237.26446054443414L608.9401440144015,237.52035575870585L611.4459945994599,237.52035575870585L611.8780378037804,238.38824483973042L610.495499549955,238.6937697952079L609.2857785778579,239.2528400502007L606.5207020702071,239.60790335623693L603.9284428442844,240.2658568848806L602.545904590459,241.52592092589464L603.0643564356435,242.7792215120154L603.4099909990999,244.2744511763563L602.2002700270027,245.51336037361273L602.2866786678668,246.59836320713907L601.595409540954,247.67855645877006L599.3487848784878,247.58055349839282L600.2992799279928,249.4846406613292L598.7439243924393,250.21312539240745L597.7070207020702,251.90479583691797L597.8798379837983,253.63321112749537L596.9293429342935,254.39771451509282L596.0652565256526,254.15904735492995L594.1642664266427,254.5408105776118L593.9050405040504,255.30267816270882L592.1768676867687,255.30267816270882L590.7943294329433,256.91442165476747L590.7079207920792,259.2672783679322L587.5972097209722,260.3895326549146L585.9554455445544,260.1561029416788L585.43699369937,260.76261528789513L584.0544554455446,260.4361951907736L581.6350135013502,260.8092157167879L577.5738073807381,259.4078088178081L579.7340234023402,256.91442165476747L579.561206120612,255.1124174592241L577.7466246624663,254.63616464395594L577.5738073807381,252.81845739421783L576.7961296129613,250.55236413664764L577.8330333033304,248.9978035402437L576.7961296129613,248.5588348783482L577.40099009901,246.45069345859156Z"
                        className="datamaps-subunit AFG"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M480.8825382538254,223.69138044149412L480.62331233123314,224.77930687232373L480.96894689468945,226.13124556934008L481.91944194419443,226.9382306056289L481.91944194419443,227.74213069424871L481.1417641764176,228.22300628834452L480.96894689468945,229.2346248808514L479.8456345634564,230.76949996013565L479.4135913591359,230.50564765039223L479.4135913591359,229.8181128008698L478.1174617461746,228.8092662814073L477.8582358235824,227.26015862886953L478.03105310531055,225.10457373083807L478.3766876687669,224.12723827306885L478.03105310531055,223.58227190117566L477.8582358235824,222.59768065087977L478.8951395139514,221.00135588701113L478.9815481548155,221.60833184589683L479.67281728172816,221.27747884748675L480.1912691269127,222.15856181760955L480.7961296129613,222.4879892969014Z"
                        className="datamaps-subunit ALB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M555.2803780378038,274.468570403091L555.7124212421242,274.3348759497841L555.7988298829883,275.0472983026221L557.6998199819982,274.6467466927177L559.6872187218722,274.7357993723551L561.1561656165617,274.78031686496604L562.7979297929793,273.03971541276604L564.526102610261,271.3348142788504L566.0814581458146,269.6660122271381L566.513501350135,270.5691593292017L566.8591359135913,272.6815318525448L565.6494149414941,272.6815318525448L565.3901890189019,274.4240115216798L565.8222322232224,274.78031686496604L564.7853285328533,275.31406884234235L564.7853285328533,276.37906535762045L564.0940594059406,277.4407803665858L564.0076507650765,278.4992870815444L563.489198919892,279.02735993806823L556.3172817281728,277.7498396732203L555.3667866786678,275.09177467328874Z"
                        className="datamaps-subunit ARE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M270.8231323132313,492.7971091786498L269.3541854185419,492.6558538262634L266.7619261926193,492.6558538262634L266.7619261926193,483.58379402266326L267.71242124212426,485.40069293404406L268.9221422142215,488.47223570114977L272.03285328532854,490.9000867622026L275.40279027902795,491.95135068849515L274.2794779477948,494.07378436328406L272.03285328532854,494.21623923457116ZM281.0193519351935,389.2800971845194L285.42619261926194,393.5190953580064L287.4135913591359,393.9191735734901L290.3514851485149,395.88201669840856L292.85733573357334,396.91271882863924L293.2029702970297,398.08183207099023L290.78352835283533,402.16270046974626L293.2029702970297,402.89392138305607L295.9680468046805,403.3060197377872L297.86903690369036,402.8481677898551L300.02925292529255,400.79640868992067L300.37488748874887,398.44242185830615L301.5846084608461,397.9467162822101L302.7943294329433,399.48141768627113L302.7079207920792,401.61544677947313L300.72052205220524,403.122794564653L299.0787578757876,404.22384831960653L296.4000900090009,406.8556006620346L293.2029702970297,410.63795613666446L292.5981098109811,412.85676786706307L291.9932493249325,415.7643559534585L291.9932493249325,418.55952529799515L291.47479747974796,419.23885603988646L291.3019801980198,421.0921225122647L291.12916291629165,422.61437727788075L294.1534653465347,425.08994294164773L293.8078307830783,427.1392701193911L295.3631863186319,428.4481831817982L295.1903690369037,429.91690795551597L292.9437443744374,433.75987913498085L289.3145814581458,435.41985885715434L284.5621062106211,436.0455891832038L281.8834383438344,435.7325008913707L282.4018901890189,437.61780413090435L281.8834383438344,439.9446067093137L282.3154815481548,441.54572871332596L280.93294329432945,442.6199274841205L278.42709270927094,443.0511518324523L276.1804680468047,441.9210744319632L275.22997299729974,442.7276502933398L275.5756075607561,445.93083179997024L277.13096309630964,446.9180627024345L278.513501350135,445.87612485530246L279.20477047704776,447.5788780444028L276.9581458145815,448.57414870962293L275.0571557155716,450.6355350739491L274.7115211521152,453.9673578555186L274.10666066606666,455.7983300085858L271.8600360036004,455.7983300085858L269.9590459045905,457.58868543042524L269.2677767776778,460.1587917345721L271.6872187218722,462.70449288970224L273.9338433843385,463.4211017602707L273.1561656165617,466.6194622843432L270.3046804680468,468.6391968253873L268.74932493249327,472.998949782457L266.5891089108911,474.4547302916885L265.55220522052207,476.2431390309372L266.32988298829883,480.2029862899299L267.9716471647165,482.4495397629062L266.93474347434744,482.2501447300632L264.68811881188117,481.6533278838017L258.89873987398744,481.12453566502484L257.94824482448246,478.8948426994924L257.94824482448246,475.98654967644325L256.3928892889289,476.2431390309372L255.52880288028805,474.9001536047705L255.2695769576958,470.9305764562033L257.1705670567057,469.31741460859655L257.94824482448246,467.0460421695982L257.60261026102614,465.22473127825486L258.89873987398744,462.1688243551142L259.7628262826283,457.58868543042524L259.503600360036,455.5685162900913L260.54050405040505,454.9379235780011L260.2812781278128,453.6828097258257L259.1579657965797,453.0015694421944L260.0220522052206,451.589822130393L258.89873987398744,450.35572877123536L258.38028802880285,446.58845620540126L259.33078307830783,445.93083179997024L258.89873987398744,442.02843907925876L259.503600360036,438.7780548586412L260.10846084608465,436.0455891832038L261.5774077407741,434.89977437848563L260.79972997299734,431.90708182744277L260.79972997299734,429.1560533758104L262.61431143114316,427.2396952999032L262.5279027902791,424.74182247163424L263.91044104410446,421.92573470465595L263.91044104410446,419.23885603988646L263.3055805580558,418.704941842031L262.1822682268227,413.8065428157493L263.65121512151217,410.96726708190704L263.478397839784,408.2505105314511L264.34248424842485,405.7907806952052L265.8978397839784,403.214393052709L267.6260126012602,401.5698868822427L266.84833483348336,400.4784844934676L267.3667866786679,399.6171930797827L267.2803780378038,395.21156248522436L269.87263726372635,393.9191735734901L270.73672367236725,391.172495473247L270.477497749775,390.55526369305693L272.46489648964894,388.18440160012364L275.5756075607561,388.84142550056L276.9581458145815,390.687437153064L277.9086408640864,388.6222870185767L280.67371737173715,388.7099266887062Z"
                        className="datamaps-subunit ARG"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M536.0976597659766,226.13124556934008L539.467596759676,225.6455572656958L539.8996399639964,226.45441230783504L540.8501350135014,226.99191948475269L540.3316831683168,227.79561530898147L541.6278127812782,228.91568555615723L540.9365436543654,229.87107836093622L541.9734473447345,230.7167553369713L543.0967596759676,231.24362248576415L543.0967596759676,233.39051134765538L542.2326732673267,233.49470008194294L541.2821782178219,231.71670822582587L541.2821782178219,231.1909935487232L540.2452745274527,231.24362248576415L539.467596759676,230.40001613752176L539.0355535553556,230.45283837555564L538.0850585058506,229.5530883439298L536.2704770477047,228.75603668706526L536.529702970297,227.26015862886953Z"
                        className="datamaps-subunit ARM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M596.9293429342935,468.39319420545996L598.484698469847,469.56466497336714L600.7313231323133,469.9981616372483L600.8177317731772,470.68146408978924L600.2128712871287,472.3696629941975L596.4972997299731,472.6211138767953L596.4108910891089,470.68146408978924L596.7565256525653,469.1321963811587Z"
                        className="datamaps-subunit ATF"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M542.2326732673267,233.49470008194294L540.5909090909091,233.0776480629225L539.3811881188119,231.6641940980943L539.0355535553556,230.45283837555564L539.467596759676,230.40001613752176L540.2452745274527,231.24362248576415L541.2821782178219,231.1909935487232L541.2821782178219,231.71670822582587ZM548.1084608460847,223.85493503551055L549.404590459046,225.53747289852942L550.6143114311432,227.79561530898147L551.7376237623762,227.9025439746682L552.4288928892889,228.75603668706526L550.441494149415,229.0220516875774L550.0094509450945,231.45401034448065L549.6638163816382,232.55521395940397L548.7133213321332,233.23413548638487L548.7997299729973,234.79292001306695L548.1948694869487,234.9481956145293L546.7259225922593,233.33839843896453L547.5900090009001,231.7692096507719L546.8123312331234,230.87495052474L545.9482448244825,231.08569723206944L543.0967596759676,233.39051134765538L543.0967596759676,231.24362248576415L541.9734473447345,230.7167553369713L540.9365436543654,229.87107836093622L541.6278127812782,228.91568555615723L540.3316831683168,227.79561530898147L540.8501350135014,226.99191948475269L539.8996399639964,226.45441230783504L539.467596759676,225.6455572656958L539.9860486048605,225.10457373083807L541.8006300630063,226.02341235125272L543.0967596759676,226.23902323830328L543.442394239424,225.86155816170253L542.2326732673267,224.12723827306885L542.8375337533754,223.6368333940317L543.528802880288,223.74591305596806L545.1705670567057,225.69957845155324L546.2938793879388,225.91552348906498L546.6395139513952,225.10457373083807Z"
                        className="datamaps-subunit AZE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M501.8798379837983,345.2802271842749L501.79342934293425,342.389121934674L501.1885688568857,341.29067203858693L502.65751575157515,341.49405385738396L503.34878487848783,340.1113368472148L504.6449144914492,340.27397722000717L504.73132313231326,341.20932350226053L505.2497749774978,341.7788142502916L505.3361836183619,342.55189643327014L504.73132313231326,343.04028861142166L503.7808280828083,344.3024826338234L502.91674167416744,345.1987283393365Z"
                        className="datamaps-subunit BDI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M439.492799279928,190.39758995502177L441.2209720972097,190.72250612088013L443.467596759676,189.9416975355112L444.93654365436544,191.56449789869453L446.3190819081908,192.46679734886973L445.9734473447345,195.01984746894044L445.3685868586859,195.14654702258565L445.1093609360936,197.2242956834936L443.0355535553556,195.58929185082798L441.8258325832583,195.84179950955343L440.09765976597663,194.06673103029038L438.97434743474344,192.59532314766125L437.85103510351036,192.53107188317767L437.50540054005404,191.17638517767415Z"
                        className="datamaps-subunit BEL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M437.93744374437443,319.44233429338095L435.95004500450045,319.728380259031L435.3451845184519,318.05202292908825L435.51800180018006,312.472587276008L434.9995499549955,311.9786865132691L434.9131413141314,310.7838915478312L434.04905490549055,309.917592931093L433.35778577857786,309.2155978515829L433.6170117011701,307.93379779658045L434.481098109811,307.6440472917341L434.9995499549955,306.5667898792521L436.12286228622867,306.3594330526645L436.64131413141314,305.6124225516313L437.50540054005404,304.90614114093785L438.3694869486949,304.90614114093785L440.1840684068407,306.3179541320746L440.09765976597663,307.1056258782106L440.61611161116116,308.5543015279961L440.09765976597663,309.54602851471327L440.35688568856887,310.2064646945968L439.2335733573358,311.7316285707737L438.45589558955896,312.472587276008L438.0238523852385,313.99370507354917L438.1102610261026,315.5533495826275Z"
                        className="datamaps-subunit BEN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M424.71692169216925,311.2372934699761L423.0751575157516,310.61895509840036L421.95184518451845,310.7014275577109L421.0877587758776,311.31970315369324L420.0508550855086,310.7838915478312L419.6188118811881,310.00013861308787L418.495499549955,309.4634342730827L418.40909090909093,308.05794087805197L419.0139513951395,306.9813162193567L418.9275427542754,306.15201313455344L420.91494149414945,304.157474859422L421.26057605760576,302.4488361196906L421.86543654365437,301.8642966481263L423.0751575157516,302.19838940855743L424.02565256525656,301.697179478319L424.3712871287129,301.0282327911496L426.2722772277228,299.939528992598L426.7043204320432,299.1425980338207L428.95094509450945,298.13428216180716L430.24707470747074,297.7556734404679L430.85193519351935,298.2604251146023L432.40729072907294,298.2604251146023L432.2344734473448,299.43633799633096L432.493699369937,300.5678820268165L433.8762376237624,302.19838940855743L433.96264626462647,303.36625470774885L436.7277227722772,303.9493558212628L436.64131413141314,305.6124225516313L436.12286228622867,306.3594330526645L434.9995499549955,306.5667898792521L434.481098109811,307.6440472917341L433.6170117011701,307.93379779658045L431.5432043204321,307.89241202412506L430.4198919891989,307.685447397249L429.64221422142214,308.05794087805197L428.60531053105314,307.89241202412506L424.457695769577,308.0165622196603L424.3712871287129,309.3808311025374Z"
                        className="datamaps-subunit BFA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M653.8726372637265,280.21270356471524L653.8726372637265,282.09262087340875L653.0085508550856,281.699932368943L653.1813681368137,283.74619146786944L652.4900990099011,282.4413352911356L652.4036903690369,281.08826548878324L651.8852385238524,279.8618937170424L650.9347434743474,278.3671467176862L648.6881188118812,278.2349572137974L648.9473447344735,279.3350439385881L648.1696669666967,280.7382898463729L647.1327632763275,280.21270356471524L646.7871287128712,280.69451961874006L646.0958595859586,280.43178911870723L645.1453645364536,280.21270356471524L644.7997299729973,278.05862785906305L643.9356435643565,276.0687836307547L644.3676867686768,274.51312335543673L642.8987398739874,273.7995615618312L643.4171917191719,272.8158966615364L644.9725472547254,271.82926304524875L643.2443744374438,270.43385203525384L644.0220522052205,268.624159400664L645.9230423042304,269.801649753812L647.1327632763275,269.93722863840793L647.3055805580557,271.7843445575986L649.5522052205221,272.14351756989356L651.7988298829882,272.0986427648963L653.1813681368137,272.5471116903262L652.0580558055806,274.78031686496604L651.0211521152115,274.91383401931057L650.2434743474347,276.4233684882481L651.6260126012601,277.7939688285213L651.9716471647164,276.11312675188935L652.6629162916292,276.11312675188935Z"
                        className="datamaps-subunit BGD"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M485.89423942394245,215.85178828224014L486.5855085508551,217.26433301556375L487.53600360036006,216.98262906523132L489.3505850585059,217.48940882322177L492.89333933393345,217.7142301725887L494.01665166516653,216.81341445486936L496.8681368136814,216.0784748062713L498.5963096309631,217.26433301556375L500.06525652565256,217.60185124960697L498.76912691269126,219.0020591462873L497.9050405040504,221.3326584153413L498.6827182718272,223.19993593550527L496.60891089108907,222.76210758741297L494.1894689468947,223.74591305596806L494.1894689468947,225.37524117940615L491.9428442844284,225.6455572656958L490.3010801080108,224.56217871242924L488.4000900090009,225.42933245756075L486.5855085508551,225.32113584678396L486.4126912691269,223.19993593550527L485.20297029702976,222.15856181760955L485.63501350135016,221.7184967350675L485.3757875787579,221.3326584153413L485.72142214221424,220.28167058639386L486.6719171917192,219.2809289100042L485.462196219622,217.826545703045L485.28937893789384,216.64405520072734Z"
                        className="datamaps-subunit BGR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M245.41899189918993,275.7582209219447L244.81413141314133,275.89135374951906L244.20927092709272,274.3794467057347L243.34518451845187,273.62093153636886L243.8636363636364,271.91908125416774L244.55490549054906,272.05376173647153L245.41899189918993,274.24571659596296ZM244.72772277227725,268.2609525756655L242.13546354635466,268.71489430383036L241.9626462646265,267.71533546953316L243.08595859585964,267.4877071279977L244.64131413141317,267.57877887549296ZM246.71512151215123,268.2609525756655L246.2830783078308,270.1630635568817L245.85103510351038,269.801649753812L245.85103510351038,268.397205341141L244.81413141314133,267.3510483593058L244.81413141314133,267.0319383671599Z"
                        className="datamaps-subunit BHS"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M477.08055805580557,213.74244368469778L477.94464446444647,213.74244368469778L477.3397839783978,215.227051746106L478.5495049504951,216.53106848566486L478.20387038703876,218.10705791243697L477.59900990099015,218.21915243888168L477.16696669666965,218.55505907785067L476.3892889288929,219.2809289100042L476.04365436543657,221.1118501473778L473.8834383438344,219.83751015755396L473.0193519351935,218.49911382282218L472.0688568856886,217.77039585496163L471.03195319531955,216.53106848566486L470.5135013501351,215.4544582594538L469.3037803780378,213.91432114098706L469.8222322232224,212.4773480040127L470.68631863186323,213.28336112598296L471.2047704770477,212.5926979953514L472.32808280828084,212.4773480040127L474.40189018901896,213.05341295303234L476.04365436543657,212.99588336202294Z"
                        className="datamaps-subunit BIH"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M487.8816381638164,180.28801468337343L490.21467146714673,180.28801468337343L492.8069306930694,178.764150087509L493.32538253825385,176.3817611728889L495.31278127812783,175.03559341527992L495.05355535553554,173.17575244202493L496.522502250225,172.45487089233887L499.11476147614763,170.78487647501893L501.6206120612061,171.87590744308633L501.96624662466246,172.95981554235448L503.26237623762376,172.45487089233887L505.5954095409541,173.4632337235406L505.8546354635464,175.39089652644353L505.3361836183619,176.52283749107943L506.8051305130513,179.25050176813875L507.8420342034203,180.0119633025049L507.66921692169217,180.7700299489325L509.31098109810983,181.45626751637045L510.0022502250225,182.54854746833615L509.0517551755176,183.43092695796432L507.06435643564356,183.29547105711728L506.63231323132317,183.6339108970224L507.2371737173717,184.98105768197576L507.75562556255625,187.44595760673127L505.76822682268227,187.71035136624752L504.9905490549055,188.5668752606199L504.81773177317734,190.5276283381772L503.86723672367236,190.13722467886652L501.70702070207017,190.33253473488938L501.1021602160216,189.41922565142605L500.15166516651664,190.07207311663834L499.2875787578758,189.5499894361011L497.38658865886595,189.4846197226698L494.7079207920792,188.50113765938917L492.2884788478848,188.23793981936265L490.3874887488749,188.30377644338114L489.09135913591365,189.35380719849897L487.96804680468045,189.4846197226698L487.8816381638164,187.77638721086763L487.1903690369037,185.9845668156412L488.65931593159314,185.18222568535637L488.65931593159314,183.5662762031185L487.96804680468045,182.07153267704655Z"
                        className="datamaps-subunit BLR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M217.5954095409541,291.0191846096612L217.50900090009003,290.6776840390847L217.85463546354637,290.54955400821433L218.2866786678668,290.8484668787757L219.15076507650767,289.30904269245235L219.5828082808281,289.30904269245235L219.5828082808281,289.6516035316055L220.0148514851485,289.69440470597397L220.0148514851485,290.3786565339333L219.5828082808281,291.4456959736185L219.84203420342035,291.8292135192885L219.5828082808281,292.72284401166075L219.75562556255628,292.97785149355417L219.40999099909993,294.25083067462964L218.9779477947795,294.9283781529434L218.5459045904591,294.97069369569016L218.02745274527453,295.8584855131079L217.33618361836184,295.8584855131079L217.50900090009003,293.0203392515218Z"
                        className="datamaps-subunit BLZ"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M270.477497749775,390.55526369305693L268.74932493249327,390.90783573287536L267.79882988298834,387.31017927510555L266.50270027002705,384.4394420862687L267.2803780378038,381.9768883376785L265.98424842484246,380.90146772806304L265.63861386138615,379.05808757032196L264.515301530153,377.3502437769836L265.98424842484246,374.63085082059115L264.9473447344735,372.5591392421723L265.55220522052207,371.7159834186058L265.1201620162017,370.7900865924981L265.98424842484246,369.5300796295362L266.07065706570654,367.4363995413364L266.1570657065707,365.72517855342534L266.6755175517552,364.89217508756894L264.6017101710171,360.9084644246293L266.4162916291629,361.11538168482326L267.6260126012602,361.0739934821398L268.14446444644466,360.32940891756346L270.3046804680468,359.33778957672126L271.51440144014407,358.4299282687077L274.7115211521152,358.01760771187406L274.452295229523,359.8334363022385L274.7115211521152,360.7843424636527L274.53870387038705,362.4410836991853L277.13096309630964,364.64248934532657L279.8096309630963,365.0170549157643L280.7601260126013,365.9752982243804L282.4018901890189,366.4341176682595L283.3523852385239,367.14389206485504L284.9077407740774,367.14389206485504L286.2902790279028,367.85452166010094L286.37668766876686,369.27842669366237L286.89513951395145,370.0337312614373L286.89513951395145,371.08451378462854L286.2038703870387,371.1265881692086L287.1543654365437,374.0380473223267L291.7340234023402,374.12268950671745L291.3883888388839,375.6063250707283L291.6476147614761,376.58381336307826L292.9437443744374,377.26502149859533L293.462196219622,378.8442482556006L293.11656165616563,380.8585081499098L292.42529252925294,381.9768883376785L292.6845184518452,383.40074587806043L291.9068406840684,383.91975583539465L291.82043204320433,383.14149192499474L289.6602160216022,381.8476913675458L287.4135913591359,381.8046346548857L283.1795679567957,382.5372097330533L282.0562556255626,384.7862794089101L281.9698469846985,386.17672105100155L281.0193519351935,389.2800971845194L280.67371737173715,388.7099266887062L277.9086408640864,388.6222870185767L276.9581458145815,390.687437153064L275.5756075607561,388.84142550056L272.46489648964894,388.18440160012364Z"
                        className="datamaps-subunit BOL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M293.2029702970297,410.63795613666446L296.4000900090009,406.8556006620346L299.0787578757876,404.22384831960653L300.72052205220524,403.122794564653L302.7079207920792,401.61544677947313L302.7943294329433,399.48141768627113L301.5846084608461,397.9467162822101L300.37488748874887,398.44242185830615L300.8933393339334,396.91271882863924L301.1525652565257,395.34554442321894L301.23897389738977,393.9191735734901L300.37488748874887,393.43025313311716L299.42439243924395,393.83022643376495L298.5603060306031,393.74130268419754L298.21467146714673,392.72034676060156L298.0418541854186,390.3350836221725L297.6098109810981,389.5435545294515L295.9680468046805,388.84142550056L295.01755175517553,389.36789502315446L292.42529252925294,388.88526893994526L292.5981098109811,385.3505453906298L291.9068406840684,383.91975583539465L292.6845184518452,383.40074587806043L292.42529252925294,381.9768883376785L293.11656165616563,380.8585081499098L293.462196219622,378.8442482556006L292.9437443744374,377.26502149859533L291.6476147614761,376.58381336307826L291.3883888388839,375.6063250707283L291.7340234023402,374.12268950671745L287.1543654365437,374.0380473223267L286.2038703870387,371.1265881692086L286.89513951395145,371.08451378462854L286.89513951395145,370.0337312614373L286.37668766876686,369.27842669366237L286.2902790279028,367.85452166010094L284.9077407740774,367.14389206485504L283.3523852385239,367.14389206485504L282.4018901890189,366.4341176682595L280.7601260126013,365.9752982243804L279.8096309630963,365.0170549157643L277.13096309630964,364.64248934532657L274.53870387038705,362.4410836991853L274.7115211521152,360.7843424636527L274.452295229523,359.8334363022385L274.7115211521152,358.01760771187406L271.51440144014407,358.4299282687077L270.3046804680468,359.33778957672126L268.14446444644466,360.32940891756346L267.6260126012602,361.0739934821398L266.4162916291629,361.11538168482326L264.6017101710171,360.9084644246293L263.3055805580558,361.36376108198704L262.1822682268227,361.0739934821398L262.3550855085509,357.3583288944243L260.3676867686769,358.8011990033918L258.2938793879388,358.71867932438465L257.3433843384339,357.44070995639504L255.78802880288032,357.27595596704026L256.22007200720077,356.24696836668306L254.92394239423945,354.7673318918452L253.97344734473447,352.5931649999934L254.5783078307831,352.1425039673459L254.5783078307831,351.1189678679645L256.04725472547256,350.42349027695195L255.78802880288032,349.1154422455509L256.3928892889289,348.29858897769503L256.5657065706571,347.1558037088216L259.33078307830783,345.52474654538446L261.2317731773178,345.07648710612983L261.5774077407741,344.70981314592694L263.73762376237624,344.7912898844294L264.8609360936093,338.2008407840457L264.8609360936093,337.1849351469639L264.515301530153,335.8035294259748L263.478397839784,334.9097584226606L263.478397839784,333.20348664502285L264.77452745274525,332.7972122622501L265.29297929792983,333.04097843048265L265.3793879387939,332.1065101451691L263.99684968496854,331.8627195114611L263.91044104410446,330.3591327957204L268.5765076507651,330.44041874154277L269.44059405940595,329.5868404459358L270.04545454545456,330.3591327957204L270.5639063906391,331.78145417486365L270.9959495949595,331.45638311117534L272.2920792079208,332.7565840732769L274.19306930693074,332.5940697751281L274.62511251125113,331.8627195114611L276.43969396939696,331.29384135138497L277.3901890189019,330.88746696452745L277.73582358235825,329.8713858746248L279.3775877587759,329.180310320915L279.29117911791184,328.6924127067622L277.2173717371737,328.48910088291484L276.9581458145815,326.9841568507281L277.04455445544556,325.3561748646022L275.9212421242124,324.74536437442055L276.3532853285329,324.5009871343153L278.1678667866787,324.82681659427334L280.06885688568855,325.43760241746253L280.7601260126013,324.86754143407273L282.488298829883,324.5009871343153L285.16696669666965,323.5639093460155L286.03105310531055,322.6671009307114L285.7718271827183,321.9737710443482L286.9815481548155,321.8921823072838L287.5864086408641,322.4224313793385L287.24077407740776,323.4824010253562L288.0184518451846,323.84915851124083L288.62331233123314,324.98971091603585L287.93204320432045,325.8039876275651L287.5864086408641,327.87908506012536L288.19126912691274,329.0989988506312L288.3640864086409,330.19655655407723L289.83303330333035,331.3344772001046L291.04275427542757,331.45638311117534L291.3019801980198,330.96874423980347L291.9932493249325,330.84682785774913L293.11656165616563,330.44041874154277L293.8942394239424,329.7900892479935L295.1903690369037,329.9933278025533L295.79522952295235,329.9120335819811L297.0913591359136,330.11526620139097L297.3505850585059,329.6274910474851L296.91854185418543,329.13965481918393L297.17776777677767,328.44843696100673L298.12826282628265,328.6517513682111L299.2515751575158,328.40777251173984L300.6341134113411,328.9363702370143L301.67101710171016,329.4242337273416L302.448694869487,328.7737338694691L302.96714671467146,328.8957118809595L303.31278127812783,329.54618941670407L304.4360936093609,329.38358095180655L305.3865886588659,328.48910088291484L306.07785778577863,326.6993422157759L307.54680468046803,324.5009871343153L308.3244824482448,324.37878675991925L308.92934293429346,325.72257410046717L310.31188118811883,329.9120335819811L311.521602160216,330.31848928439024L311.6080108010801,331.9846158097146L309.7934293429343,333.93475477806925L310.57110711071107,334.6660074137216L314.8051305130514,335.0316343823962L314.89153915391546,337.46937147746013L316.7061206120612,335.8847835347974L319.7304230423042,336.73798665711286L323.7052205220522,338.2008407840457L324.91494149414945,339.62346203198115L324.482898289829,340.9246219611086L327.3343834383438,340.19265603573217L332.0004500450045,341.49405385738396L335.5432043204321,341.3720229556088L339.08595859585955,343.36594292247247L342.1966696669667,346.0546590696561L344.01125112511255,346.7478816005202L346.08505850585055,346.8702467682865L346.9491449144915,347.6046466491383L347.7268226822683,350.7098132415199L348.15886588658867,352.1425039673459L347.20837083708375,356.1647022907197L345.9986498649865,357.7703161578406L342.6287128712871,361.1567722706002L341.0733573357336,363.93557484882285L339.2587758775878,366.05869417174387L338.65391539153916,366.10039642424454L338.0490549054906,367.89635046101796L338.22187218721876,372.5591392421723L337.530603060306,376.41366838385767L337.2713771377138,378.07528092914885L336.493699369937,379.05808757032196L336.06165616561657,382.4509567149681L333.64221422142214,385.78515403524773L333.21017101710174,388.44707038629593L331.3091809180918,389.58748273363017L330.7043204320432,391.1283717271881L328.11206120612064,391.1283717271881L324.31008100810084,392.1446257578582L322.66831683168317,393.2970332740244L319.98964896489645,394.09713819697726L317.1381638163817,396.1953639085939L315.1507650765077,398.80342273111484L314.7187218721873,400.79640868992067L315.1507650765077,402.29966892359204L314.7187218721873,405.05235025085835L314.2002700270027,406.3458455062494L312.472097209721,407.8778602053269L309.7934293429343,412.7619765847186L307.7196219621962,414.998586187109L306.07785778577863,416.2921374696235L304.9545454545455,419.04457411025487L303.39918991899196,420.65193858909504L302.7079207920792,419.04457411025487L303.83123312331236,417.68877807087034L302.448694869487,415.7643559534585L300.547704770477,414.1874088398214L298.0418541854186,412.38314716749915L297.17776777677767,412.47780427863256L294.7583258325833,410.3090416949177Z"
                        className="datamaps-subunit BRA"
                        data-info='{"active":{"value":"5,101","percent":"42.2","isGrown":false},"new":{"value":"444","percent":"41.2","isGrown":false},"fillKey":"MAJOR","short":"br"}'
                        style={{
                          fill: 'rgb(79, 70, 229)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M705.6314131413142,323.6046620690135L706.5819081908191,322.7078755409154L708.5693069306931,321.40255604468575L708.4828982898289,322.58554859758885L708.3100810081007,324.09362140801085L707.1867686768677,324.05287988844174L706.6683168316832,324.86754143407273Z"
                        className="datamaps-subunit BRN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M651.5396039603961,265.06421872855356L652.576507650765,265.9352755251389L652.4036903690369,267.57877887549296L650.4162916291629,267.66982340047275L648.428892889289,267.4877071279977L646.8735373537354,267.8973159295031L644.7133213321333,266.8950738927365L644.6269126912691,266.34699369601685L646.2686768676867,264.3286991423005L647.564806480648,263.63746616321293L649.2929792979298,264.2826678754727L650.502700270027,264.3286991423005Z"
                        className="datamaps-subunit BTN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M502.1390639063907,388.88526893994526L498.76912691269126,390.77558013698217L496.60891089108907,392.72034676060156L495.7448244824482,394.49790311742527L495.05355535553554,395.4795806639901L493.7574257425743,395.6583803809497L493.32538253825385,396.95760621988904L493.0661566156616,397.7666509102497L491.5972097209721,398.3973257141869L489.6098109810981,398.26207576335764L488.486498649865,397.4967428514031L487.449594959496,397.1821368118497L486.23987398739877,397.8116577332938L485.72142214221424,399.0744449403692L484.511701170117,399.8889215322039L483.3883888388839,401.0691774580174L481.6602160216022,401.3421897230364L481.1417641764176,400.4330935440524L481.3145814581459,398.80342273111484L479.93204320432045,396.2849468527171L479.24077407740776,395.88201669840856L479.24077407740776,388.2281667555567L481.5738073807381,388.1406416231473L481.6602160216022,379.05808757032196L483.47479747974796,378.97253936947817L487.1903690369037,378.07528092914885L488.05445544554453,379.10086792185115L489.6098109810981,378.1179665418575L490.3874887488749,378.1179665418575L491.6836183618362,377.56336935315176L492.11566156615663,377.73394198601494L493.0661566156616,379.785924236368L493.498199819982,380.214635291968L494.27587758775877,381.67549128347173L497.0409540954096,384.48278006122416L498.0778577857786,384.7862794089101L498.0778577857786,385.6547201625664L498.76912691269126,387.31017927510555L500.58370837083714,387.703325560188Z"
                        className="datamaps-subunit BWA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M468.18046804680466,316.6190703014121L470.1678667866787,316.4551842741819L470.59990999099915,315.79938314600554L471.03195319531955,315.88138108740003L471.63681368136815,316.41420879772693L474.5747074707471,315.4713250494035L475.6116111611161,314.52755226457225L476.9077407740774,313.70612237498625L476.6485148514851,312.84282783232254L477.3397839783978,312.59601824536446L479.67281728172816,312.7605656906063L481.91944194419443,311.64925978626377L483.6476147614762,308.9676802383657L484.85733573357334,307.9751811937975L486.4126912691269,307.5612398694367L486.6719171917192,308.6369956830621L488.05445544554453,310.1239407782893L488.05445544554453,311.15487551520073L487.62241224122414,312.1433517689263L487.7952295229523,312.8839560211516L488.65931593159314,313.62393937573074L490.473897389739,314.6507050807019L491.77002700270026,315.63536742332326L491.77002700270026,316.41420879772693L493.4117911791179,317.68372510101665L494.448694869487,318.74737880690753L495.05355535553554,320.1777530725302L496.78172817281734,321.1576812828948L497.21377137713773,321.8921823072838L496.4360936093609,322.1777237382834L494.8807380738074,322.0961459252538L493.0661566156616,321.85138628295397L492.2020702070207,322.0553553900851L491.77002700270026,322.62632528413985L490.9923492349235,322.7078755409154L490.12826282628265,322.2185110233796L487.449594959496,323.4008888477961L486.32628262826285,323.15632888542063L485.98064806480653,323.3601313036705L485.28937893789384,324.7860909089192L483.47479747974796,324.33805153645113L481.7466246624663,324.09362140801085L480.1912691269127,323.19709134076993L478.20387038703876,322.3816494386972L476.9077407740774,323.15632888542063L476.04365436543657,324.37878675991925L475.7844284428443,326.0482100952928L474.22907290729074,325.9261022308678L472.5873087308731,325.5190268033198L471.2047704770477,326.8214096440656L469.90864086408646,329.0583424116974L469.6494149414941,328.32644201687725L469.56300630063004,327.22825805860606L468.43969396939696,326.45518888114617L467.5756075607561,325.23402753444884L467.4027902790279,324.37878675991925L466.2794779477948,323.1155654370103L466.452295229523,322.3816494386972L466.19306930693074,321.36174647693116L466.3658865886589,319.5240682735643L466.9707470747075,319.0744654601174Z"
                        className="datamaps-subunit CAF"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M454.5279027902791,204.5257923092684L454.61431143114316,205.12641160334098L454.26867686768674,206.02373953113874L455.30558055805585,206.67906352719456L456.6017101710171,206.73852538817283L456.34248424842485,208.16001880900257L455.30558055805585,208.74917261344615L453.57740774077405,208.33695701839747L453.0589558955896,209.7465661237165L451.84923492349236,209.86356446648728L451.41719171917197,209.27785454764384L450.1210621062106,210.4474852967532L448.9977497749775,210.6223150645166L447.9608460846085,209.86356446648728L447.09675967596763,208.3958997711311L445.9734473447345,208.92556312682575L445.9734473447345,207.3321146046066L447.7880288028803,205.36611977013166L447.70162016201624,204.46562391102202L448.73852385238524,204.76627196833377L449.42979297929793,204.16449012926705L451.50360036003605,204.22475585048542L451.93564356435644,203.4397739184806Z"
                        className="datamaps-subunit CHE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M266.7619261926193,483.58379402266326L266.7619261926193,492.6558538262634L269.3541854185419,492.6558538262634L270.8231323132313,492.7971091786498L269.9590459045905,494.5015132779839L267.9716471647165,495.7913086485339L266.7619261926193,495.6475047028915L265.3793879387939,495.28853654168967L263.5648064806481,494.00260235310856L261.0589558955896,493.4342322765591L258.03465346534654,491.10981644973424L255.61521152115213,488.8859808707565L252.33168316831686,484.3889431359534L254.31908190819087,485.19786686478756L257.6890189018902,487.92213437481786L260.79972997299734,489.3699593010323L262.0958595859586,487.5107196063702L262.8735373537354,484.72553335621035L265.0337533753376,483.11584888487255ZM270.477497749775,390.55526369305693L270.73672367236725,391.172495473247L269.87263726372635,393.9191735734901L267.2803780378038,395.21156248522436L267.3667866786679,399.6171930797827L266.84833483348336,400.4784844934676L267.6260126012602,401.5698868822427L265.8978397839784,403.214393052709L264.34248424842485,405.7907806952052L263.478397839784,408.2505105314511L263.65121512151217,410.96726708190704L262.1822682268227,413.8065428157493L263.3055805580558,418.704941842031L263.91044104410446,419.23885603988646L263.91044104410446,421.92573470465595L262.5279027902791,424.74182247163424L262.61431143114316,427.2396952999032L260.79972997299734,429.1560533758104L260.79972997299734,431.90708182744277L261.5774077407741,434.89977437848563L260.10846084608465,436.0455891832038L259.503600360036,438.7780548586412L258.89873987398744,442.02843907925876L259.33078307830783,445.93083179997024L258.38028802880285,446.58845620540126L258.89873987398744,450.35572877123536L260.0220522052206,451.589822130393L259.1579657965797,453.0015694421944L260.2812781278128,453.6828097258257L260.54050405040505,454.9379235780011L259.503600360036,455.5685162900913L259.7628262826283,457.58868543042524L258.89873987398744,462.1688243551142L257.60261026102614,465.22473127825486L257.94824482448246,467.0460421695982L257.1705670567057,469.31741460859655L255.2695769576958,470.9305764562033L255.52880288028805,474.9001536047705L256.3928892889289,476.2431390309372L257.94824482448246,475.98654967644325L257.94824482448246,478.8948426994924L258.89873987398744,481.12453566502484L264.68811881188117,481.6533278838017L266.93474347434744,482.2501447300632L264.77452745274525,482.2501447300632L263.65121512151217,483.18262082843034L261.49099909991,484.6581627296149L261.0589558955896,488.40337583699466L260.10846084608465,488.47223570114977L257.3433843384339,487.1686293909845L254.5783078307831,484.3889431359534L251.64041404140417,482.11734169147013L250.86273627362738,479.67855773119163L251.5540054005401,477.40240613134335L250.34428442844285,474.9001536047705L249.99864986498653,468.57766518487995L251.03555355535553,465.1039446109886L253.62781278127812,462.40671101429444L249.91224122412243,461.3385765006043L252.24527452745275,458.28621078739604L253.02295229522952,452.6618302268728L255.7016201620162,453.853489115136L256.99774977497754,446.97304888226586L255.3559855985599,446.1498055336874L254.5783078307831,450.1880326436122L253.10936093609362,449.74152784671975L253.88703870387045,445.1117518377819L254.6647164716472,439.2015202899779L255.78802880288032,437.0924689361396L255.09675967596763,434.0701788274374L254.92394239423945,430.68029923901554L255.8744374437444,430.57836602102583L257.3433843384339,425.7378072413296L259.0715571557156,421.0921225122647L260.0220522052206,416.82100178237516L259.503600360036,412.5724948473714L260.19486948694873,410.262086147576L259.93564356435644,406.9019872078559L261.31818181818187,403.535210136634L261.75022502250226,398.35223598749553L262.5279027902791,392.853342139991L263.3055805580558,387.0483104909043L263.13276327632764,382.8824039500498L262.61431143114316,379.27203110814435L263.8240324032404,378.6305125963344L264.515301530153,377.3502437769836L265.63861386138615,379.05808757032196L265.98424842484246,380.90146772806304L267.2803780378038,381.9768883376785L266.50270027002705,384.4394420862687L267.79882988298834,387.31017927510555L268.74932493249327,390.90783573287536Z"
                        className="datamaps-subunit CHL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M424.6305130513052,322.4632122619344L423.59360936093606,322.50399209009913L421.86543654365437,322.0145637643229L420.31008100810084,322.0553553900851L417.45859585958596,322.4632122619344L415.8168316831683,323.19709134076993L413.483798379838,324.05287988844174L412.9653465346535,324.01213745504555L413.1381638163817,322.0145637643229L413.3973897389739,321.72899154332293L413.31098109810983,320.749462666724L412.27407740774083,319.76923874847057L411.5828082808281,319.60579699000334L410.8915391539154,318.9109330997238L411.40999099909993,317.8474276739415L411.15076507650764,316.70100383965064L411.2371737173717,315.96337245508226L411.66921692169217,315.96337245508226L411.75562556255625,314.9380003984413L411.5828082808281,314.4454415620307L411.8420342034203,314.1169275031476L412.7061206120612,313.829383074746L412.10126012601256,311.8963419039466L411.5828082808281,310.86634709928506L411.75562556255625,310.04140817869467L412.18766876687675,309.8763168070371L412.53330333033307,309.62861385818866L413.22457245724576,310.00013861308787L415.0391539153915,310.04140817869467L415.471197119712,309.29821897230147L415.90324032403237,309.3395261593049L416.5945094509451,309.09164924595234L416.9401440144015,310.1239407782893L417.5450045004501,309.835038489162L418.495499549955,309.4634342730827L419.6188118811881,310.00013861308787L420.0508550855086,310.7838915478312L421.0877587758776,311.31970315369324L421.95184518451845,310.7014275577109L423.0751575157516,310.61895509840036L424.71692169216925,311.2372934699761L425.32178217821786,314.69175250429987L424.3712871287129,316.7419682528651L423.68001800180025,319.44233429338095L424.71692169216925,321.5249778711305Z"
                        className="datamaps-subunit CIV"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M462.90954095409546,329.0583424116974L462.5639063906391,328.8957118809595L461.18136813681366,329.22096535938346L459.7124212421242,328.8957118809595L458.5891089108911,329.0583424116974L454.70072007200724,329.0176854988232L455.04635463546356,327.1062103574799L454.0958595859586,325.5190268033198L452.9725472547255,325.11187291720574L452.45409540954097,324.01213745504555L451.84923492349236,323.6861646583548L451.93564356435644,323.0340355465803L452.54050405040505,321.3209357569959L453.6638163816382,318.9927020068327L454.3550855085508,318.951818236836L455.8240324032403,317.5609326350502L456.68811881188117,317.51999883414493L458.07065706570654,318.5020057317099L459.7124212421242,317.68372510101665L459.8852385238524,316.660037857065L460.490099009901,315.71737860121266L460.83573357335734,314.48649779830373L462.1318631863187,313.45955116353656L462.5639063906391,311.7728099278592L463.0823582358236,311.2372934699761L463.42799279927993,309.9588668651651L464.03285328532854,308.4302429075607L466.10666066606666,306.5253235376995L466.19306930693074,305.6954648104521L466.452295229523,305.28014941867906L465.501800180018,304.2823134485892L465.5882088208821,303.4912509288797L466.2794779477948,303.36625470774885L467.22997299729974,304.9477082107094L467.4027902790279,306.5667898792521L467.3163816381638,308.18206268721565L468.6125112511251,310.4127366969683L467.3163816381638,310.3714865998627L466.62511251125113,310.53647413936085L465.501800180018,310.2889799582491L464.98334833483347,311.44330223758607L466.3658865886589,312.8839560211516L467.48919891989203,313.29513313282695L467.74842484248427,314.28119884215266L468.52610261026103,315.96337245508226L468.18046804680466,316.6190703014121L466.9707470747075,319.0744654601174L466.3658865886589,319.5240682735643L466.19306930693074,321.36174647693116L466.452295229523,322.3816494386972L466.2794779477948,323.1155654370103L467.4027902790279,324.37878675991925L467.5756075607561,325.23402753444884L468.43969396939696,326.45518888114617L469.56300630063004,327.22825805860606L469.6494149414941,328.32644201687725L469.90864086408646,329.0583424116974L469.7358235823582,330.31848928439024L467.83483348334835,329.7494403216065L465.9338433843385,329.13965481918393Z"
                        className="datamaps-subunit CMR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M505.50900090009003,326.0482100952928L505.3361836183619,328.8550530367241L506.2866786678668,329.180310320915L505.50900090009003,330.0339743228801L504.6449144914492,330.6842682201536L503.6944194419442,331.9439839331172L503.1759675967597,333.04097843048265L503.0895589558956,334.99100901930524L502.484698469847,335.8847835347974L502.484698469847,337.7131841698428L501.79342934293425,338.36340307534385L501.70702070207017,339.7860794810307L501.3613861386139,339.9893617441696L501.1885688568857,341.29067203858693L501.79342934293425,342.389121934674L501.8798379837983,345.2802271842749L502.31188118811883,347.5230286128799L502.1390639063907,348.7477963209511L502.57110711071107,350.17812538989386L503.95364536453644,351.52826911866543L505.2497749774978,354.5620149130788L504.29927992799287,354.3156931569377L501.1021602160216,354.7262649185417L500.49729972997307,355.01377158404534L499.8060306030603,356.5761102319515L500.3244824482448,357.64669839950244L499.8924392439244,360.53616194192864L499.6332133213321,362.98037649971513L500.2380738073807,363.43703863840494L501.8798379837983,364.39290143721166L502.57110711071107,363.93557484882285L502.7439243924392,366.60104752622334L500.92934293429346,366.5593107122541L499.9788478847885,365.2252430869009L499.11476147614763,364.18498562750017L497.21377137713773,363.810905288339L496.69531953195326,362.5240240179135L495.22637263726375,363.3124634095327L493.32538253825385,362.98037649971513L492.46129612961295,361.860780613325L490.9923492349235,361.6122271109172L489.8690369036904,361.69506851750384L489.6962196219622,360.9084644246293L488.9185418541854,360.867088079139L487.7952295229523,360.7429731858979L486.32628262826285,361.0739934821398L485.28937893789384,361.0326076586635L484.6845184518452,361.2395606069855L484.77092709270926,358.34744721829026L483.9932493249325,357.44070995639504L483.82043204320433,355.959070703926L484.16606660666065,354.47990059065233L483.73402340234026,353.5360872725712L483.6476147614762,352.0196293456433L480.7097209720972,352.06058600066615L480.96894689468945,351.15989133427223L479.7592259225923,351.2008162704942L479.5864086408641,351.61014728745295L478.1174617461746,351.6920314978683L477.5126012601261,353.12601423859246L477.16696669666965,353.70016344023503L475.7844284428443,353.37203805472956L475.0067506750675,353.70016344023503L473.4513951395139,353.9052969106959L472.500900090009,352.6341437050245L471.98244824482447,351.85581816152785L471.29117911791184,350.42349027695195L470.68631863186323,348.6252703829472L463.6008100810081,348.58443089466124L462.73672367236725,348.87033354514296L462.0454545454545,348.8294865436545L461.0949594959496,349.1562981782208L460.74932493249327,348.42108529969926L461.3541854185419,348.13527752729453L461.44059405940595,347.11500655196414L461.78622862286227,346.46240037402265L462.65031503150317,345.9731231017092L463.34158415841586,346.2177432118308L464.1192619261926,345.2802271842749L465.4153915391539,345.3209780243845L465.5882088208821,346.01389058009516L466.53870387038705,346.42162157416044L467.9212421242124,344.9135117745364L469.3037803780378,343.7323635921589L469.90864086408646,342.9588825936857L469.8222322232224,341.00596238971406L470.8591359135914,338.6479002690637L471.98244824482447,337.4287369620882L473.537803780378,336.2504334919118L473.79702970297035,335.51914349039464L473.8834383438344,334.6253823222288L474.3154815481548,333.7722528158941L474.14266426642666,332.43155283909584L474.48829882988304,330.31848928439024L474.92034203420343,328.8143937007476L475.6116111611161,327.5130139920178L475.7844284428443,326.0482100952928L476.04365436543657,324.37878675991925L476.9077407740774,323.15632888542063L478.20387038703876,322.3816494386972L480.1912691269127,323.19709134076993L481.7466246624663,324.09362140801085L483.47479747974796,324.33805153645113L485.28937893789384,324.7860909089192L485.98064806480653,323.3601313036705L486.32628262826285,323.15632888542063L487.449594959496,323.4008888477961L490.12826282628265,322.2185110233796L490.9923492349235,322.7078755409154L491.77002700270026,322.62632528413985L492.2020702070207,322.0553553900851L493.0661566156616,321.85138628295397L494.8807380738074,322.0961459252538L496.4360936093609,322.1777237382834L497.21377137713773,321.8921823072838L498.6827182718272,323.889904635921L499.71962196219624,324.17510172005484L500.4108910891089,323.7676634628299L501.447794779478,323.93064983238304L502.83033303330336,323.44164542049015L503.34878487848783,324.4602545552579Z"
                        className="datamaps-subunit COD"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M462.65031503150317,345.9731231017092L461.78622862286227,345.1579803273072L461.0949594959496,345.56550313888994L460.0580558055806,346.5847430934354L458.1570657065706,344.0581258361918L459.9716471647165,342.71468222629375L459.0211521152116,341.12797731809127L459.8852385238524,340.5179530323017L461.52700270027003,340.23331637661937L461.6998199819982,339.1763004133898L462.99594959495954,340.31463856945703L465.06975697569754,340.39596280078945L465.8474347434743,339.29824846321276L466.10666066606666,337.67254803667635L465.8474347434743,335.8035294259748L464.72412241224123,334.38163191058413L465.76102610261023,331.61892064327094L465.1561656165617,331.1312951366785L463.34158415841586,331.3344772001046L462.73672367236725,330.07462045464104L462.90954095409546,329.0583424116974L465.9338433843385,329.13965481918393L467.83483348334835,329.7494403216065L469.7358235823582,330.31848928439024L469.90864086408646,329.0583424116974L471.2047704770477,326.8214096440656L472.5873087308731,325.5190268033198L474.22907290729074,325.9261022308678L475.7844284428443,326.0482100952928L475.6116111611161,327.5130139920178L474.92034203420343,328.8143937007476L474.48829882988304,330.31848928439024L474.14266426642666,332.43155283909584L474.3154815481548,333.7722528158941L473.8834383438344,334.6253823222288L473.79702970297035,335.51914349039464L473.537803780378,336.2504334919118L471.98244824482447,337.4287369620882L470.8591359135914,338.6479002690637L469.8222322232224,341.00596238971406L469.90864086408646,342.9588825936857L469.3037803780378,343.7323635921589L467.9212421242124,344.9135117745364L466.53870387038705,346.42162157416044L465.5882088208821,346.01389058009516L465.4153915391539,345.3209780243845L464.1192619261926,345.2802271842749L463.34158415841586,346.2177432118308Z"
                        className="datamaps-subunit COG"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M250.6035103510351,334.82850797509315L249.56660666066608,334.25975663347293L248.35688568856887,333.48787185799L247.7520252025203,333.8535039068273L245.67821782178217,333.5284979412632L245.0733573357336,332.51281165103745L244.64131413141317,332.55344079729036L242.22187218721874,331.1719321204308L241.9626462646265,330.44041874154277L242.82673267326734,330.2372011671228L242.74032403240327,329.0583424116974L243.2587758775878,328.163774542058L244.46849684968498,328.0010982303567L245.505400540054,326.4958828383475L246.36948694869488,325.23402753444884L245.505400540054,324.6639087436285L245.93744374437446,323.27861328670906L245.41899189918993,321.0760470384269L245.93744374437446,320.4228010696259L245.5918091809181,318.3793002435429L244.55490549054906,317.11057795960267L244.9005400540054,315.9223775911002L245.67821782178217,316.08634724580537L246.11026102610262,315.38929379391766L245.5918091809181,313.95262730555527L245.85103510351038,313.58284510502307L247.06075607560757,313.665031797801L248.87533753375342,311.9786865132691L249.91224122412243,311.7316285707737L249.91224122412243,310.9075717200465L250.34428442844285,308.84369072469195L251.72682268226825,307.7268451041974L253.1957695769577,307.685447397249L253.45499549954997,307.14705751964664L255.2695769576958,307.35417906621785L257.1705670567057,306.11052153672887L258.1210621062106,305.5708975323853L259.33078307830783,304.40712754413653L260.10846084608465,304.53191725368043L260.79972997299734,305.19705495289327L260.2812781278128,306.02753069541444L258.7259225922592,306.4423833267952L258.1210621062106,307.6440472917341L257.25697569756977,308.34752552355957L256.5657065706571,309.2569095376777L256.22007200720077,310.99001467069877L255.52880288028805,312.4314397164847L256.8249324932493,312.59601824536446L257.0841584158416,313.70612237498625L257.60261026102614,314.24013369979497L257.8618361836184,315.22521099716494L257.51620162016206,316.127335587997L257.60261026102614,316.6190703014121L258.2074707470747,316.82389238596147L258.81233123312336,317.64279576480527L261.9230423042304,317.4381267418701L263.3055805580558,317.7246529563571L264.9473447344735,319.81009594387325L265.8978397839784,319.5649332879261L267.6260126012602,319.687520471906L269.00855085508556,319.4014653202552L269.87263726372635,319.81009594387325L269.44059405940595,321.11686474763684L268.9221422142215,321.9329772265418L268.74932493249327,323.6454138385928L269.1813681368137,325.274744116062L269.87263726372635,325.9668055963335L269.9590459045905,326.4958828383475L268.74932493249327,327.7163927348266L269.6134113411341,328.24510936982017L270.3046804680468,329.0989988506312L270.9959495949595,331.45638311117534L270.5639063906391,331.78145417486365L270.04545454545456,330.3591327957204L269.44059405940595,329.5868404459358L268.5765076507651,330.44041874154277L263.91044104410446,330.3591327957204L263.99684968496854,331.8627195114611L265.3793879387939,332.1065101451691L265.29297929792983,333.04097843048265L264.77452745274525,332.7972122622501L263.478397839784,333.20348664502285L263.478397839784,334.9097584226606L264.515301530153,335.8035294259748L264.8609360936093,337.1849351469639L264.8609360936093,338.2008407840457L263.73762376237624,344.7912898844294L262.5279027902791,343.52878862321484L261.83663366336634,343.4880760192477L263.3919891989199,341.00596238971406L261.5774077407741,339.90804742042275L260.10846084608465,340.1113368472148L259.24437443744375,339.7047698440631L257.94824482448246,340.31463856945703L256.1336633663367,340.03001962596784L254.7511251125113,337.510006253589L253.62781278127812,336.90051037606514L252.85013501350136,335.7629025462649L251.20837083708375,334.6253823222288Z"
                        className="datamaps-subunit COL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M232.3712871287129,314.69175250429987L231.07515751575158,314.1169275031476L230.55670567056708,313.62393937573074L230.90234023402343,313.212912860377L230.81593159315935,312.6782958383447L230.12466246624666,312.1021884409193L229.17416741674168,311.60807235125156L228.31008100810084,311.27849934381504L228.22367236723676,310.577715683256L227.53240324032404,310.16520381993905L227.7052205220522,310.86634709928506L227.27317731773178,311.44330223758607L226.66831683168317,310.74266060951174L225.8906390639064,310.53647413936085L225.54500450045006,310.04140817869467L225.63141314131414,309.29821897230147L225.8906390639064,308.51295097676496L225.19936993699372,308.18206268721565L225.80423042304233,307.685447397249L226.14986498649864,307.39559607073056L227.7052205220522,308.0165622196603L228.31008100810084,307.7268451041974L229.0877587758776,307.93379779658045L229.43339333933397,308.4302429075607L230.12466246624666,308.59564976213903L230.72952295229524,308.05794087805197L231.33438343834385,309.3808311025374L232.2848784878488,310.3714865998627L233.4081908190819,311.40210459677746L232.457695769577,311.64925978626377L232.457695769577,312.59601824536446L232.9761476147615,312.9662066535948L232.63051305130514,313.25402393782616L232.71692169216925,313.70612237498625L232.54410441044107,314.19906676500244Z"
                        className="datamaps-subunit CRI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M234.0994599459946,277.264052628148L236.0868586858686,277.4407803665858L237.9878487848785,277.4407803665858L240.23447344734473,278.3671467176862L241.18496849684973,279.29110516147404L243.43159315931595,279.02735993806823L244.29567956795682,279.598564508048L246.36948694869488,281.21942135516304L247.83843384338437,282.3977635008181L248.61611161116116,282.3541867170055L250.0850585058506,282.87677963901945L249.91224122412243,283.6159041020866L251.64041404140417,283.7027671937737L253.45499549954997,284.74362339032353L253.1957695769577,285.34952703734854L251.5540054005401,285.6521353207278L249.99864986498653,285.7817550482006L248.35688568856887,285.60891949239203L244.9005400540054,285.8249523873804L246.45589558955896,284.44032473614294L245.505400540054,283.74619146786944L243.95004500450048,283.5724652747463L243.17236723672372,282.8332575120236L242.56750675067508,281.3942240746126L241.18496849684973,281.48159476641683L238.93834383438346,280.78205489061077L238.24707470747077,280.25653114353366L235.13636363636368,279.818018757571L234.2722772277228,279.3350439385881L235.22277227722776,278.6753980356719L232.80333033303333,278.5433229737369L231.07515751575158,279.90576339161817L230.12466246624666,279.9496277863994L229.77902790279032,280.5631777849671L228.5693069306931,280.8695694490849L227.53240324032404,280.6069635930904L228.82853285328534,279.818018757571L229.3469846984699,278.8514222108283L230.470297029703,278.27902585043034L231.6800180018002,277.7939688285213L233.49459945994602,277.52911079587096Z"
                        className="datamaps-subunit CUB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M510.0886588658866,244.32413067064925L510.26147614761476,244.2744511763563L510.60711071107113,243.57784914105767L512.3352835283529,243.62767411409862L514.495499549955,242.72921758279176L512.8537353735373,243.9761568731035L513.0265526552655,244.5227454704352L512.7673267326733,244.42345868877953L512.3352835283529,244.67159847512755L511.98964896489656,244.62199108447567L511.8168316831683,244.72119559964625L511.8168316831683,244.42345868877953L511.64401440144013,244.22476134707028L511.1255625562556,244.22476134707028L510.52070207020705,244.47310722986026Z"
                        className="datamaps-subunit -99"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M513.0265526552655,244.5227454704352L513.1129612961296,244.770782466607L510.6935193519352,245.95781217810702L509.483798379838,245.56278428011788L508.8789378937894,244.42345868877953L510.0886588658866,244.32413067064925L510.52070207020705,244.47310722986026L511.1255625562556,244.22476134707028L511.64401440144013,244.22476134707028L511.8168316831683,244.42345868877953L511.8168316831683,244.72119559964625L511.98964896489656,244.62199108447567L512.3352835283529,244.67159847512755L512.7673267326733,244.42345868877953Z"
                        className="datamaps-subunit CYP"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M455.30558055805585,175.81626896330872L455.39198919891993,177.43696350688433L457.8114311431143,178.41589916065436L457.7250225022502,179.87376938798988L460.23087308730874,179.11168646526593L461.52700270027003,177.99704962180653L464.2920792079208,179.59704395630703L465.4153915391539,180.90749849234447L465.9338433843385,182.95636327010317L465.24257425742576,184.03916174647378L466.19306930693074,185.45008614205764L466.71152115211527,187.51209365328424L466.53870387038705,188.89519332920125L467.5756075607561,191.30585083054652L466.452295229523,191.6936796812061L465.8474347434743,191.30585083054652L465.24257425742576,192.01622216210387L463.514401440144,192.7237559569143L462.65031503150317,193.68405600223292L460.83573357335734,194.51215093854924L461.26777677767774,195.58929185082798L461.52700270027003,197.1616842737648L462.73672367236725,198.09858804680016L464.1192619261926,199.6494283773862L463.2551755175518,201.3096708027947L462.39108910891093,201.79872392147445L462.73672367236725,204.10420488986387L462.5639063906391,204.70618110816244L461.78622862286227,203.98357578483464L460.6629162916292,203.86286839185172L458.93474347434744,204.5257923092684L456.7745274527453,204.3452288099114L456.42889288928893,205.30622151861914L455.2191719171918,204.3452288099114L454.5279027902791,204.5257923092684L451.93564356435644,203.4397739184806L451.50360036003605,204.22475585048542L449.42979297929793,204.16449012926705L449.68901890189017,201.6154812623737L450.89873987398744,199.15459555440424L447.44239423942395,198.4719976493268L446.3190819081908,197.47452470287533L446.49189918991897,195.84179950955343L445.9734473447345,195.01984746894044L446.3190819081908,192.46679734886973L445.88703870387036,188.4353753390054L447.35598559855987,188.4353753390054L447.9608460846085,186.982300737606L448.479297929793,183.36321235296296L448.04725472547256,182.00327908942825L448.5657065706571,181.1134937391507L450.5531053105311,180.90749849234447L450.9851485148515,181.79835479243144L452.6269126912691,179.80463027379963L452.10846084608465,178.27639788658968L451.93564356435644,175.8870596735955L453.75022502250226,176.45231412209648Z"
                        className="datamaps-subunit DEU"
                        data-info='{"active":{"value":"8,408","percent":"5.4","isGrown":false},"new":{"value":"1001","percent":"5.1","isGrown":true},"fillKey":"MAJOR","short":"de"}'
                        style={{
                          fill: 'rgb(79, 70, 229)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M534.8879387938794,303.7411679466829L535.492799279928,304.53191725368043L535.4063906390639,305.5293699146505L534.0238523852386,306.11052153672887L535.0607560756076,306.77408410487055L534.1966696669667,308.0993171728546L533.5918091809181,307.6440472917341L533.0733573357336,307.85102387254597L531.6908190819082,307.8096333379568L531.6908190819082,307.064191783622L531.5180018001801,306.3594330526645L532.2956795679568,305.2386035008484L533.1597659765977,304.157474859422L534.1966696669667,304.365525560489Z"
                        className="datamaps-subunit DJI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M461.9590459045904,173.17575244202493L460.490099009901,176.59333131078128L457.98424842484246,174.25126258609936L457.63861386138615,172.45487089233887L461.18136813681366,171.07652102896424ZM455.30558055805585,175.81626896330872L453.75022502250226,176.45231412209648L451.93564356435644,175.8870596735955L450.9851485148515,173.60678870779194L450.89873987398744,169.1715702501287L451.3307830783079,167.98826162005219L452.0220522052205,166.72158733145804L454.0958595859586,166.42211829917568L454.9599459945995,165.21872741419523L456.8609360936094,163.93032289795607L456.7745274527453,166.19715635658685L456.0832583258326,167.69109912042688L456.42889288928893,168.8765396335069L457.7250225022502,169.53961744935208L457.1201620162016,171.14935199845146L456.42889288928893,170.7118849943711L454.70072007200724,173.75022027168097Z"
                        className="datamaps-subunit DNK"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M259.4171917191719,286.21352154213275L259.6764176417642,285.7817550482006L261.5774077407741,285.7817550482006L262.9599459945995,286.4292332039805L263.65121512151217,286.38609997863284L264.0832583258326,287.2909497232137L265.3793879387939,287.247906484716L265.29297929792983,287.97903950328083L266.32988298829883,288.06497157564934L267.53960396039605,289.0090798224342L266.6755175517552,290.0366635864691L265.465796579658,289.4803568271549L264.42889288928893,289.6087981611001L263.65121512151217,289.4803568271549L263.2191719171917,289.9511238883894L262.26867686768685,290.0794272004491L261.9230423042304,289.4803568271549L261.0589558955896,289.8227830978232L260.10846084608465,291.57357105284063L259.503600360036,291.14718035335085L259.4171917191719,290.4213870696054L259.4171917191719,289.73720168876304L258.81233123312336,289.0090798224342L259.4171917191719,288.5801985415083L259.5900090009001,287.59212805229816Z"
                        className="datamaps-subunit DOM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M515.2731773177318,260.34286232570224L514.6683168316831,261.41431995696695L514.1498649864986,263.49902214735056L513.4585958595859,264.926448848473L512.9401440144014,265.38543209892214L512.0760576057606,264.51275184951135L511.0391539153915,263.31432710778085L509.31098109810983,259.360973278154L509.0517551755176,259.5950716981583L510.0886588658866,262.5280505691161L511.55760576057605,265.2478119416387L513.3721872187218,269.4398189393372L514.2362736273627,270.8846520112987L515.0139513951394,272.41263602357657L517.1741674167416,275.31406884234235L516.6557155715572,275.7582209219447L516.7421242124212,277.4849483635056L519.5936093609361,279.818018757571L519.9392439243925,280.3441705889919L510.434293429343,280.3441705889919L501.1885688568857,280.3441705889919L491.510801080108,280.3441705889919L491.510801080108,270.65933209570005L491.510801080108,261.0421019919397L490.81953195319534,258.8452567163381L491.42439243924395,257.10340230007955L490.9923492349235,255.92008382534104L491.85643564356434,254.5408105776118L495.05355535553554,254.5408105776118L497.38658865886595,255.25512581952438L499.8060306030603,256.1097667781612L500.92934293429346,256.53606148034714L502.7439243924392,255.6353057624882L503.6944194419442,254.82676909864315L505.8546354635464,254.58849193677943L507.5828082808281,254.96963195084413L508.18766876687675,256.3466810473674L508.7925292529253,255.44528396263235L510.6935193519352,256.1097667781612L512.5945094509451,256.25194054605834L513.7178217821782,255.5403118766621Z"
                        className="datamaps-subunit EGY"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M533.1597659765977,304.157474859422L532.2956795679568,303.3245836869599L531.3451845184519,301.90606854296516L530.3082808280828,301.1118932953508L529.6170117011701,300.23284757766777L527.5432043204321,299.2685058390104L525.9014401440145,299.2265397858414L525.2965796579658,298.72269527842633L523.9140414041404,299.3104686824917L522.445094509451,298.1763331295432L521.7538253825383,300.023349957816L518.9023402340234,299.47828804257557L518.6431143114312,298.51262176817727L519.6800180018002,294.8437361252425L519.9392439243925,293.19025190486883L520.7169216921692,292.4251589884678L522.445094509451,291.99956244508917L523.6548154815482,290.54955400821433L525.0373537353736,293.4874519679961L525.7286228622862,295.77400201152255L527.0247524752475,296.9976363879038L530.3082808280828,299.3104686824917L531.6908190819082,300.73532516045975L532.9869486948695,302.1566380848784L533.6782178217823,302.99111389462183L534.8879387938794,303.7411679466829L534.1966696669667,304.365525560489Z"
                        className="datamaps-subunit ERI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M409.85463546354634,223.58227190117566L409.9410441044105,221.27747884748675L408.9905490549055,219.89308373463686L412.3604860486049,217.48940882322177L415.2983798379838,218.10705791243697L418.495499549955,218.05098702873687L421.0877587758776,218.61098869081326L423.0751575157516,218.44315291209037L426.96354635463547,218.55505907785067L427.91404140414045,219.83751015755396L432.32088208820886,221.3326584153413L433.1849684968497,220.6141510344711L435.8636363636364,222.10360556423382L438.6287128712871,221.6634217406686L438.8015301530153,223.58227190117566L436.55490549054906,225.69957845155324L433.44419441944194,226.34674545293296L433.2713771377138,227.42093833329136L431.71602160216025,229.18150143811766L430.85193519351935,231.71670822582587L431.80243024302433,233.49470008194294L430.4198919891989,234.8446906200661L429.90144014401443,236.85442400814117L428.0868586858686,237.41803242324445L426.35868586858686,239.7599055987588L423.3343834383438,239.81055071537847L421.0013501350135,239.7599055987588L419.532403240324,240.82112740347816L418.5819081908191,241.927706221976L417.45859585958596,241.67667132205662L416.50810081008103,240.66982188575406L415.8168316831683,238.948061983043L413.57020702070207,238.49013197897327L413.3973897389739,237.46919987621135L414.26147614761476,236.3408258707995L414.60711071107113,235.5166132288013L413.82943294329436,234.63753563108133L414.4342934293429,232.60751359149975L413.483798379838,230.7167553369713L414.52070207020705,230.45283837555564L414.60711071107113,229.0220516875774L415.0391539153915,228.5429849993089L415.0391539153915,226.07733590986854L416.1624662466247,225.21288297000444L415.471197119712,223.58227190117566L414.0886588658866,223.47310552959894L413.65661566156615,223.90942442532793L412.27407740774083,223.90942442532793L411.66921692169217,222.3233419182442L410.71872187218725,222.76210758741297Z"
                        className="datamaps-subunit ESP"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M489.8690369036904,163.6256809293397L490.12826282628265,160.93537001067378L489.2641764176418,161.55425169747997L487.7088208820882,159.9245988158033L487.53600360036006,157.25062271056012L490.5603060306031,155.89671675537193L493.58460846084614,155.25559145840228L496.1768676867687,156.05659642530702L498.6827182718272,155.89671675537193L499.02835283528356,156.69451978115663L497.3001800180018,159.37769990307382L497.9914491449145,163.6256809293397L496.9545454545455,165.0676780737706L495.05355535553554,165.0676780737706L492.97974797479753,163.39682411337174L491.85643564356434,162.8615671547083Z"
                        className="datamaps-subunit EST"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M533.1597659765977,304.157474859422L532.2956795679568,305.2386035008484L531.5180018001801,306.3594330526645L531.6908190819082,307.064191783622L531.6908190819082,307.8096333379568L533.0733573357336,307.85102387254597L533.5918091809181,307.6440472917341L534.1966696669667,308.0993171728546L533.6782178217823,308.9676802383657L534.542304230423,310.2889799582491L535.4063906390639,311.4844978296393L536.3568856885688,312.34913872016864L544.1336633663366,315.22521099716494L546.2074707470747,315.22521099716494L539.3811881188119,322.4632122619344L536.2704770477047,322.58554859758885L534.1102610261025,324.25657841994723L532.6413141314131,324.29731542432523L531.9500450045005,325.07115307536833L530.3082808280828,325.07115307536833L529.3577857785779,324.25657841994723L527.1111611161116,325.274744116062L526.419891989199,326.2517084898851L524.8645364536453,326.08891123594555L524.3460846084608,325.8039876275651L523.7412241224123,325.84469325006415L522.9635463546355,325.84469325006415L519.9392439243925,323.8084114547435L518.2974797479749,323.8084114547435L517.433393339334,322.99326909734657L517.433393339334,321.64738945848205L516.2236723672368,321.23931084607364L514.7547254725473,318.62469855317346L513.7178217821782,318.05202292908825L513.2857785778577,317.11057795960267L512.0760576057606,315.9223775911002L510.60711071107113,315.75838170088974L511.3847884788479,314.3633237645243L512.6809180918092,314.28119884215266L513.0265526552655,313.54174898192446L513.0265526552655,311.3609049034134L513.7178217821782,308.80235631188236L514.8411341134113,308.14069110794924L515.1003600360036,307.14705751964664L516.1372637263727,305.28014941867906L517.6062106210621,304.03261166891684L518.5567056705671,301.6136030822035L518.9023402340234,299.47828804257557L521.7538253825383,300.023349957816L522.445094509451,298.1763331295432L523.9140414041404,299.3104686824917L525.2965796579658,298.72269527842633L525.9014401440145,299.2265397858414L527.5432043204321,299.2685058390104L529.6170117011701,300.23284757766777L530.3082808280828,301.1118932953508L531.3451845184519,301.90606854296516L532.2956795679568,303.3245836869599Z"
                        className="datamaps-subunit ETH"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M859.6116111611161,376.7540208800583L860.3892889288929,377.4781071208766L860.0436543654366,378.8014928494531L858.574707470747,379.14365244684757L857.1921692169217,378.8442482556006L857.0193519351935,377.73394198601494L857.8834383438343,376.8391481788948L859.0067506750675,377.1798151392356ZM863.5,374.8005218376685L861.9446444644464,375.3940959664654L860.475697569757,375.9460898395909L860.1300630063006,374.9699211061252L861.3397839783977,374.4614047786636L862.1174617461745,374.3343590007092L863.5,373.5730137607437L863.5,374.8005218376685ZM-0.49999999999994316,373.5730137607437L-0.4995679999999538,373.57277507509986L-0.49999999999994316,374.80035617027465L-0.49999999999994316,374.80035617027465L-0.49999999999994316,374.8005218376685L-0.49999999999994316,373.5730137607437ZM-0.49999999999994316,373.57277507509986L0.01845184518458609,373.4459584563L-0.3271827182717857,374.63085082059115L-0.49999999999994316,374.80035617027465Z"
                        className="datamaps-subunit FJI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M284.6485148514852,480.531553592038L287.5,478.17949261582453L289.5738073807381,479.1556927049538L290.9563456345635,477.5963574596491L292.85733573357334,479.3515846404194L292.16606660666065,480.7289907072187L288.96894689468945,481.8520394683434L287.8456345634564,480.531553592038L285.8582358235824,482.2501447300632Z"
                        className="datamaps-subunit FLK"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M300.6341134113411,328.9363702370143L301.23897389738977,327.91975668937704L301.498199819982,326.8214096440656L301.8438343834384,325.7632812455599L300.9797479747975,324.37878675991925L300.72052205220524,322.7078755409154L302.01665166516653,320.626973717632L302.7943294329433,320.9127643894524L304.6089108910891,321.48417173815943L307.11476147614763,323.5231556659971L307.54680468046803,324.5009871343153L306.07785778577863,326.6993422157759L305.3865886588659,328.48910088291484L304.4360936093609,329.38358095180655L303.31278127812783,329.54618941670407L302.96714671467146,328.8957118809595L302.448694869487,328.7737338694691L301.67101710171016,329.4242337273416Z"
                        className="datamaps-subunit GUF"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M416.5945094509451,180.42587260960426L414.7799279927993,179.59704395630703L413.31098109810983,179.66626758694102L413.82943294329436,177.43696350688433L413.31098109810983,175.17780506255204L415.2983798379838,175.03559341527992L417.8906390639064,177.64721360018515ZM424.2848784878488,159.8465840415022L421.6926192619262,164.68944141052734L424.1984698469847,164.0824301242317L426.7907290729073,164.15843043764266L426.1858685868587,167.76544016881257L424.02565256525656,171.65827475229395L426.531503150315,171.94838831548083L426.7043204320432,172.38261066600018L428.86453645364537,177.29665107354873L430.506300630063,177.99704962180653L431.9752475247525,182.6165841513609L432.6665166516652,184.24143009837903L435.51800180018006,184.98105768197576L435.2587758775878,187.51209365328424L434.04905490549055,188.63258816700693L434.9995499549955,190.59261154799617L432.83933393339333,192.59532314766125L429.64221422142214,192.59532314766125L425.494599459946,193.62019691342388L424.3712871287129,192.85209595586358L422.8159315931593,194.63921016200442L420.5693069306931,194.1941072292995L418.9275427542754,195.65245204808235L417.63141314131417,194.89305825524312L421.1741674167417,190.91716871271413L423.3343834383438,190.07207311663834L423.24797479747974,190.07207311663834L419.532403240324,189.4846197226698L418.84113411341133,187.90838395877094L421.34698469846984,186.71679818728148L420.0508550855086,184.57801749870941L420.482898289829,181.9349982646004L424.11206120612064,182.34427520833L424.457695769577,179.94288038793093L422.8159315931593,177.43696350688433L422.8159315931593,177.366821880901L419.87803780378044,176.66379561210152L419.2731773177318,175.53280720092366L420.1372637263727,173.60678870779194L419.35958595859586,172.45487089233887L418.06345634563456,174.46553593008264L417.9770477047705,170.34644379945428L416.76732673267327,168.1366415443619L417.63141314131417,163.54943113764202L419.44599459945994,159.8465840415022L421.433393339334,160.15841672440285Z"
                        className="datamaps-subunit GBR"
                        data-info='{"active":{"value":"4,889","percent":"9.1","isGrown":false},"new":{"value":"2,001","percent":"3.2","isGrown":true},"fillKey":"MAJOR","short":"gb"}'
                        style={{
                          fill: 'rgb(79, 70, 229)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M531.2587758775878,224.72504614395L531.6044104410441,223.30924732093465L530.9995499549955,221.1118501473778L529.6170117011701,219.89308373463686L528.2344734473447,219.55941202153366L527.3703870387039,218.49911382282218L527.7160216021603,218.16311304457287L529.7034203420342,218.72280104501982L533.2461746174617,219.22518594324208L536.529702970297,220.78018659295853L536.9617461746175,221.38782300537295L538.4306930693069,220.89080140364553L540.5909090909091,221.60833184589683L541.368586858686,222.9264027136926L542.8375337533754,223.6368333940317L542.2326732673267,224.12723827306885L543.442394239424,225.86155816170253L543.0967596759676,226.23902323830328L541.8006300630063,226.02341235125272L539.9860486048605,225.10457373083807L539.467596759676,225.6455572656958L536.0976597659766,226.13124556934008L533.7646264626462,224.56217871242924Z"
                        className="datamaps-subunit GEO"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M434.04905490549055,320.218597528098L430.24707470747074,321.64738945848205L428.95094509450945,322.4632122619344L426.7907290729073,323.15632888542063L424.6305130513052,322.4632122619344L424.71692169216925,321.5249778711305L423.68001800180025,319.44233429338095L424.3712871287129,316.7419682528651L425.32178217821786,314.69175250429987L424.71692169216925,311.2372934699761L424.3712871287129,309.3808311025374L424.457695769577,308.0165622196603L428.60531053105314,307.89241202412506L429.64221422142214,308.05794087805197L430.4198919891989,307.685447397249L431.5432043204321,307.89241202412506L431.37038703870394,308.6369956830621L432.40729072907294,309.8763168070371L432.40729072907294,311.64925978626377L432.5801080108011,313.58284510502307L433.1849684968497,314.4454415620307L432.6665166516652,316.660037857065L432.83933393339333,317.8474276739415L433.530603060306,319.3605950202363Z"
                        className="datamaps-subunit GHA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M411.2371737173717,315.96337245508226L410.54590459045903,315.9223775911002L410.11386138613864,316.9058102859088L409.42259225922595,316.8648521132321L408.9041404140414,316.3732317260135L409.0769576957696,315.38929379391766L408.1264626462646,313.91154771892144L407.4351935193519,314.19906676500244L406.91674167416744,314.24013369979497L406.31188118811883,314.3633237645243L406.31188118811883,313.5006510026806L405.96624662466246,312.84282783232254L405.96624662466246,312.1433517689263L405.447794779478,311.11366342665417L404.8429342934294,310.247723406091L402.85553555355534,310.247723406091L402.33708370837087,310.7014275577109L401.6458145814582,310.74266060951174L401.3001800180018,311.27849934381504L400.9545454545455,311.9786865132691L399.7448244824482,313.04844965086556L398.62151215121514,311.60807235125156L397.7574257425743,310.61895509840036L397.0661566156616,310.33023435489787L396.547704770477,309.835038489162L396.2020702070207,308.7610196051781L395.85643564356434,308.2234319145327L395.16516651665165,307.8096333379568L396.2884788478848,306.6082537167683L396.97974797479753,306.69117389537394L397.58460846084614,306.2764726838982L398.1030603060306,306.2764726838982L398.53510351035106,305.9445296336415L398.27587758775877,305.11394995076876L398.53510351035106,304.86457140932856L398.62151215121514,304.03261166891684L399.7448244824482,304.07423547255405L401.47299729973,304.6566826847359L401.9914491449145,304.61509689869473L402.2506750675068,304.3239208633018L403.54680468046803,304.53191725368043L403.8924392439244,304.365525560489L403.9788478847885,305.28014941867906L404.4108910891089,305.28014941867906L405.01575157515754,304.9477082107094L405.447794779478,305.0308343806119L406.0526552655266,305.65394497633764L407.0895589558956,305.8615183199075L407.7808280828083,305.3216927103439L408.5585058505851,304.9892726226117L409.0769576957696,304.6566826847359L409.5954095409541,304.6982657851031L410.11386138613864,305.2386035008484L410.3730873087309,305.9445296336415L411.40999099909993,306.9398747418618L410.8915391539154,307.602644783761L410.8051305130513,308.3888853818458L411.3235823582358,308.14069110794924L411.5828082808281,308.4302429075607L411.496399639964,309.1329677095734L412.18766876687675,309.8763168070371L411.75562556255625,310.04140817869467L411.5828082808281,310.86634709928506L412.10126012601256,311.8963419039466L412.7061206120612,313.829383074746L411.8420342034203,314.1169275031476L411.5828082808281,314.4454415620307L411.75562556255625,314.9380003984413L411.66921692169217,315.96337245508226Z"
                        className="datamaps-subunit GIN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M391.1039603960396,302.65746197417343L391.36318631863185,301.5300147685302L394.0418541854186,301.48821613242563L394.5603060306031,300.9027192505624L395.33798379837987,300.8608753115152L396.2884788478848,301.4464145047085L396.97974797479753,301.48821613242563L397.7574257425743,301.07006455947453L398.27587758775877,301.7807439894446L397.23897389738977,302.3236258607376L396.2020702070207,302.28188329243534L395.16516651665165,301.73896321747094L394.3010801080108,302.3236258607376L393.8690369036904,302.3653655186822L393.2641764176418,302.69917849488496Z"
                        className="datamaps-subunit GMB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M395.16516651665165,307.8096333379568L393.8690369036904,306.81553548099606L392.9185418541854,306.6497150541689L392.3136813681368,305.9445296336415L392.4000900090009,305.5708975323853L391.62241224122414,305.0308343806119L391.449594959496,304.53191725368043L392.7457245724572,304.1158565347247L393.52340234023404,304.1990904506382L394.21467146714673,303.9077237692529L398.62151215121514,304.03261166891684L398.53510351035106,304.86457140932856L398.27587758775877,305.11394995076876L398.53510351035106,305.9445296336415L398.1030603060306,306.2764726838982L397.58460846084614,306.2764726838982L396.97974797479753,306.69117389537394L396.2884788478848,306.6082537167683Z"
                        className="datamaps-subunit GNB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M454.26867686768674,332.0658789121919L453.83663366336634,331.7001878949318L454.70072007200724,329.0176854988232L458.5891089108911,329.0583424116974L458.5891089108911,331.9439839331172L455.13276327632764,331.90335183488236Z"
                        className="datamaps-subunit GNQ"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M215.26237623762378,301.1955416861159L214.05265526552657,300.777178270563L212.5837083708371,300.73532516045975L211.46039603960398,300.23284757766777L210.16426642664268,299.2265397858414L210.2506750675068,298.47059722874L210.50990099009906,297.92397740323224L210.16426642664268,297.4189039547114L211.28757875787582,295.393649545L214.3982898289829,295.393649545L214.484698469847,294.5473736808648L214.05265526552657,294.37794273952727L213.7934293429343,293.8692933814825L212.92934293429343,293.2751852660139L211.9788478847885,292.4251589884678L213.1021602160216,292.4251589884678L213.1021602160216,291.0191846096612L215.34878487848786,291.0191846096612L217.5954095409541,291.0191846096612L217.50900090009003,293.0203392515218L217.33618361836184,295.8584855131079L218.02745274527453,295.8584855131079L218.89153915391543,296.3228917715097L219.0643564356436,295.94295480948L219.75562556255628,296.238485975063L218.63231323132317,297.2083128598469L217.50900090009003,297.88190643814306L217.33618361836184,298.38653827903084L217.50900090009003,298.8487001853856L217.0769576957696,299.47828804257557L216.472097209721,299.64605637961927L216.64491449144919,299.939528992598L216.12646264626466,300.19095429927967L215.34878487848786,300.8190283195482Z"
                        className="datamaps-subunit GTM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M288.10486048604866,314.32226219581594L289.6602160216022,315.22521099716494L291.12916291629165,316.78293110040386L291.2155715571557,318.05202292908825L292.07965796579657,318.09293762207335L293.3757875787579,319.27885042490385L294.32628262826285,320.1369073593779L293.9806480648065,322.3000823688197L292.511701170117,322.9117331728024L292.5981098109811,323.4824010253562L292.16606660666065,324.74536437442055L293.2893789378938,326.45518888114617L294.06705670567055,326.4958828383475L294.32628262826285,327.838412853611L295.79522952295235,329.9120335819811L295.1903690369037,329.9933278025533L293.8942394239424,329.7900892479935L293.11656165616563,330.44041874154277L291.9932493249325,330.84682785774913L291.3019801980198,330.96874423980347L291.04275427542757,331.45638311117534L289.83303330333035,331.3344772001046L288.3640864086409,330.19655655407723L288.19126912691274,329.0989988506312L287.5864086408641,327.87908506012536L287.93204320432045,325.8039876275651L288.62331233123314,324.98971091603585L288.0184518451846,323.84915851124083L287.24077407740776,323.4824010253562L287.5864086408641,322.4224313793385L286.9815481548155,321.8921823072838L285.7718271827183,321.9737710443482L284.13006300630065,320.1369073593779L284.73492349234925,319.48320194326647L284.73492349234925,318.3793002435429L286.2038703870387,317.97018919609746L286.80873087308726,317.51999883414493L285.94464446444647,316.6190703014121L286.2038703870387,315.75838170088974Z"
                        className="datamaps-subunit GUY"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M221.91584158415844,303.0328075365083L221.483798379838,302.28188329243534L220.79252925292528,302.07312665377077L220.96534653465346,301.07006455947453L220.61971197119712,300.8190283195482L220.10126012601262,300.65160974049195L219.0643564356436,300.9445601407871L218.9779477947795,300.6097474224203L218.2866786678668,300.19095429927967L217.7682268226823,299.68799052261227L217.0769576957696,299.47828804257557L217.50900090009003,298.8487001853856L217.33618361836184,298.38653827903084L217.50900090009003,297.88190643814306L218.63231323132317,297.2083128598469L219.75562556255628,296.238485975063L220.0148514851485,296.36508941117444L220.53330333033304,295.9007219348039L221.22457245724578,295.8584855131079L221.483798379838,296.0696321941922L221.82943294329436,295.94295480948L222.95274527452747,296.1962778097472L224.0760576057606,296.11185092358375L224.85373537353738,295.8584855131079L225.11296129612964,295.5627308846969L225.8906390639064,295.68950427044024L226.4090909090909,295.8584855131079L227.10036003600362,295.816245540109L227.53240324032404,295.6049922555498L228.65571557155718,295.94295480948L229.00135013501352,295.98518414141734L229.77902790279032,296.44947419470844L230.470297029703,296.9976363879038L231.33438343834385,297.3767925405311L231.93924392439246,298.09222787167465L231.16156615661566,298.00810930743376L230.81593159315935,298.3445038603901L229.95184518451848,298.6806871207075L229.3469846984699,298.6806871207075L228.82853285328534,299.0166612292211L228.31008100810084,298.8906953128771L227.96444644464447,298.51262176817727L227.7052205220522,298.5966609971274L227.3595859585959,299.1845705188301L227.10036003600362,299.1425980338207L227.10036003600362,299.64605637961927L226.23627362736275,300.3585087420144L225.80423042304233,300.65160974049195L225.54500450045006,300.9445601407871L224.85373537353738,300.4422673337334L224.33528352835287,301.1118932953508L223.81683168316832,301.07006455947453L223.29837983798382,301.15371900286846L223.29837983798382,302.3653655186822L222.95274527452747,302.3653655186822L222.6935193519352,302.9494174069906Z"
                        className="datamaps-subunit HND"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M476.6485148514851,210.1557475159096L477.2533753375337,211.49408512672883L478.03105310531055,212.4773480040127L477.08055805580557,213.74244368469778L476.04365436543657,212.99588336202294L474.40189018901896,213.05341295303234L472.32808280828084,212.4773480040127L471.2047704770477,212.5926979953514L470.68631863186323,213.28336112598296L469.8222322232224,212.4773480040127L469.3037803780378,213.91432114098706L470.5135013501351,215.4544582594538L471.03195319531955,216.53106848566486L472.0688568856886,217.77039585496163L473.0193519351935,218.49911382282218L473.8834383438344,219.83751015755396L476.04365436543657,221.1118501473778L475.7844284428443,221.6634217406686L473.537803780378,220.44797915054784L472.1552655265527,219.2809289100042L469.90864086408646,218.27517610908632L467.9212421242124,215.85178828224014L468.43969396939696,215.56806297570245L467.3163816381638,214.14325582039305L467.22997299729974,213.05341295303234L465.76102610261023,212.4773480040127L464.98334833483347,213.97157998779835L464.2920792079208,212.82319223252546L464.2920792079208,211.61002336414242L464.3784878487849,211.55206296176797L466.10666066606666,211.66796634938794L466.53870387038705,211.14585115837173L467.3163816381638,211.66796634938794L468.2668766876688,211.72589193302372L468.2668766876688,210.79698567997087L469.13096309630964,210.4474852967532L469.3037803780378,209.04306602586445L471.29117911791184,208.1010027002984L471.98244824482447,208.51373040012103L473.79702970297035,210.03892784016455L475.7844284428443,210.6805562655026Z"
                        className="datamaps-subunit HRV"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M259.4171917191719,286.21352154213275L259.5900090009001,287.59212805229816L259.4171917191719,288.5801985415083L258.81233123312336,289.0090798224342L259.4171917191719,289.73720168876304L259.4171917191719,290.4213870696054L257.7754275427543,289.9938958172963L256.65211521152116,290.2076931566124L255.1831683168317,289.9938958172963L254.05985598559855,290.4641134908627L252.76372637263728,289.69440470597397L253.02295229522952,288.8804604271483L255.1831683168317,289.22336024735495L256.99774977497754,289.437534626484L257.8618361836184,288.8804604271483L256.8249324932493,287.76413266933827L256.8249324932493,286.7741358168229L255.2695769576958,286.38609997863284L255.8744374437444,285.69534651963323L257.3433843384339,285.8249523873804Z"
                        className="datamaps-subunit HTI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M470.42709270927094,206.91679843593926L471.2047704770477,204.64607089008197L470.68631863186323,203.86286839185172L472.0688568856886,203.86286839185172L472.24167416741676,202.40822050536664L473.4513951395139,203.31871244433887L474.3154815481548,203.6816601976355L476.3892889288929,203.2581520600709L476.56210621062104,202.52987867316017L477.5126012601261,202.40822050536664L478.72232223222323,201.85976431783374L478.9815481548155,202.10372395249425L480.1048604860486,201.6154812623737L480.62331233123314,200.81931315665636L481.40099009900996,200.57364209817123L483.9932493249325,201.6765824125055L484.511701170117,201.3096708027947L485.8078307830783,202.28648215269843L485.98064806480653,203.2581520600709L484.511701170117,203.98357578483464L483.3883888388839,206.3814721168209L481.91944194419443,208.74917261344615L480.01845184518453,209.39514043065594L478.5495049504951,209.27785454764384L476.6485148514851,210.1557475159096L475.7844284428443,210.6805562655026L473.79702970297035,210.03892784016455L471.98244824482447,208.51373040012103L471.29117911791184,208.1010027002984L470.7727272727273,206.91679843593926Z"
                        className="datamaps-subunit HUN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M721.1849684968497,359.1726452716185L720.2344734473447,359.25521300566277L717.0373537353735,357.5230991833262L719.2839783978399,357.0700590382014L720.4936993699371,357.81152621551536L721.3577857785779,358.5124178497364ZM731.4675967596759,355.91795011695706L731.640414041404,356.3703819762227L731.7268226822682,357.11123439461056L730.1714671467148,358.9662643969398L728.0976597659767,359.50296935280664L727.8384338433843,359.1726452716185L728.0112511251125,358.34744721829026L729.0481548154817,356.8642122868634ZM714.445094509451,353.98736229781684L715.3091809180918,354.64413634573964L716.7781278127813,354.43884608643447L717.38298829883,355.46574832115454L714.6179117911792,355.959070703926L712.9761476147614,356.28810430001147L711.6800180018001,356.24696836668306L712.5441044104409,354.84947123096293L713.8402340234024,354.84947123096293ZM726.455895589559,353.98736229781684L726.1102610261026,355.3013673670035L722.4810981098109,356.00019319600256L719.2839783978399,355.7123756269734L719.2839783978399,354.8084006614049L721.1849684968497,354.3156931569377L722.7403240324032,355.05485120975266L724.2956795679568,354.84947123096293ZM692.2380738073807,350.79163261329535L696.8177317731772,351.0371253303842L697.3361836183617,350.014576484149L701.7430243024303,351.2008162704942L702.6071107110711,352.7570894513726L706.2362736273628,353.2080155488388L709.1741674167417,354.64413634573964L706.495499549955,355.58905355343126L703.8168316831683,354.60307473876105L701.6566156615661,354.64413634573964L699.1507650765077,354.47990059065233L696.9041404140414,354.0283975774783L694.1390639063907,353.12601423859246L692.3244824482448,352.8800497223774L691.3739873987399,353.1670140682511L686.9671467146716,352.1834652863886L686.5351035103511,351.15989133427223L684.3748874887489,350.9552886283437L686.0166516651666,348.66611111433036L688.9545454545455,348.7886408034715L690.8555355535555,349.7284183952303L691.8924392439244,349.93281024908373ZM754.7979297929792,349.4423260443185L753.5882088208821,351.078045867894L753.3289828982898,349.2380139186111L753.7610261026102,348.3802519723111L754.2794779477947,347.5638370566932L754.8843384338434,348.25775930319423ZM736.9113411341134,342.79607942975315L735.9608460846084,343.56950201900963L734.3190819081908,343.1624032632836L733.8870387038704,342.10429305105197L736.3064806480647,341.9822335996645ZM744.6017101710172,341.9008639173341L745.465796579658,343.7323635921589L743.4783978397841,342.75538046612985L741.49099909991,342.55189643327014L740.1084608460847,342.71468222629375L738.4666966696669,342.6332879036723L738.9851485148515,341.29067203858693L742.0094509450945,341.20932350226053ZM769.9194419441944,340.7212806810403L769.9194419441944,348.58443089466124L770.0058505850584,356.4526674236639L767.8456345634563,354.47990059065233L765.4261926192619,353.98736229781684L764.8213321332133,354.6851997377533L761.7970297029702,354.7262649185417L762.8339333933393,352.7570894513726L764.3028802880289,352.1015442066695L763.6980198019803,349.48319240289953L762.488298829883,347.441415156644L757.9086408640864,345.40248255788885L755.9212421242125,345.1987283393365L752.2920792079208,342.9995852299233L751.6008100810081,344.13957470996826L750.6503150315032,344.3432117557937L750.1318631863186,343.4880760192477L750.1318631863186,342.42981451298704L748.3172817281729,341.24999747462056L750.8231323132313,340.39596280078945L752.5513051305131,340.436625689796L752.378487848785,339.7860794810307L748.8357335733574,339.7860794810307L747.8852385238524,338.36340307534385L745.7250225022502,337.91636913757634L744.7745274527454,336.73798665711286L747.9716471647164,336.1691769568174L749.1813681368137,335.35663930963904L753.0697569756976,336.37231946068414L753.4153915391539,337.2662014371728L754.1066606660665,341.12797731809127L756.6125112511252,342.55189643327014L758.5999099909991,340.03001962596784L761.3649864986498,338.56661359107375L763.5252025202522,338.56661359107375L765.512601260126,339.4202002988427L767.3271827182718,340.27397722000717ZM732.0724572457245,331.0906578602908L730.1714671467148,333.447245687879L728.3568856885688,333.93475477806925L726.0238523852386,333.447245687879L722.0490549054906,333.5691239412447L719.9752475247525,333.8941293681367L719.6296129612962,335.7222757782939L721.7034203420342,337.87573155860633L722.9995499549956,336.77861728266896L727.492799279928,335.9660381331353L727.3199819981998,337.06303747210086L726.2830783078308,336.6973562284308L725.2461746174617,338.11956160066615L723.0859585958596,339.0543560533509L725.4189918991899,342.1449808632426L724.9869486948694,342.9588825936857L727.1471647164716,345.72853926404105L727.0607560756075,347.31900349638806L725.8510351035104,348.01280654647877L724.9005400540054,347.1966019780707L726.0238523852386,345.1987283393365L723.6908190819082,346.13619909673844L723.0859585958596,345.48399091978433L723.3451845184519,344.5468703912562L721.6170117011701,343.12169762452123L721.8762376237623,340.8026155323587L720.2344734473447,341.5347320459139L720.4072907290729,344.3432117557937L720.4936993699371,347.76789657777937L719.0247524752475,348.13527752729453L717.9878487848785,347.4006101369704L718.6791179117912,345.1987283393365L718.3334833483349,342.87747954267417L717.2965796579658,342.83677912074177L716.518901890189,341.20932350226053L717.5558055805582,339.62346203198115L717.9014401440145,337.7131841698428L719.1111611161117,334.09725597494946L719.543204320432,333.1222327752647L721.6170117011701,331.3344772001046L723.5180018001801,332.0658789121919L726.542304230423,332.3909231663118L729.3073807380738,332.2690330381322L731.640414041404,330.5217032752719ZM740.3676867686768,331.78145417486365L740.1948694869486,333.8535039068273L738.9851485148515,333.6097498614808L738.6395139513951,335.0722597933941L739.5900090009001,336.37231946068414L738.8987398739874,336.6567259930748L737.9482448244825,335.112885255845L737.2569756975697,332.0658789121919L737.7754275427543,330.15591156668484L738.5531053105311,329.26161993814827L738.7259225922593,330.56234502148476L740.1084608460847,330.7655486881522ZM694.6575157515751,329.6681412249088L695.0895589558957,331.2532052242332L696.7313231323133,332.6346985880982L698.2866786678669,332.14714117070343L699.8420342034203,332.30966326937784L701.2245724572458,331.0906578602908L702.347884788479,330.88746696452745L704.594509450945,331.5782866441684L706.5819081908191,331.05002028771656L707.7916291629163,327.7163927348266L708.7421242124212,326.86209744191234L709.606210621062,324.13436201734976L712.3712871287128,324.13436201734976L714.445094509451,324.54171883908884L713.0625562556256,326.6993422157759L714.7907290729073,328.97702810844885L714.3586858685869,330.11526620139097L717.1237623762377,332.30966326937784L714.2722772277228,332.5940697751281L713.4081908190819,334.21913150690256L713.5810081008101,336.41294844209926L711.2479747974799,338.03828368757604L711.1615661566157,340.436625689796L710.2974797479749,344.13957470996826L709.8654365436544,343.28452475139426L707.1867686768677,344.3432117557937L706.2362736273628,342.87747954267417L704.508100810081,342.75538046612985L703.2983798379838,341.9822335996645L700.4468946894689,342.83677912074177L699.5828082808281,341.65677032528504L698.0274527452746,341.8194968298739L696.0400540054005,341.5347320459139L695.6944194419442,338.32276200307075L694.484698469847,337.6319121820182L693.3613861386139,335.60039610934905L693.0157515751575,333.48787185799L693.2749774977497,331.2532052242332ZM685.4981998199819,348.5435926458327L682.8195319531953,348.58443089466124L680.7457245724573,346.5847430934354L677.7214221422142,344.62833999112155L676.6845184518452,343.1624032632836L674.8699369936994,341.20932350226053L673.6602160216021,339.4202002988427L671.8456345634563,336.0472932493627L669.7718271827183,334.056630735065L668.9941494149415,331.9846158097146L668.1300630063006,330.11526620139097L665.9698469846985,328.6110895201128L664.7601260126013,326.5365760968764L662.9455445544554,325.19331014315924L660.4396939693969,322.5447708674462L660.1804680468047,321.3209357569959L661.7358235823582,321.40255604468575L665.4513951395139,321.8921823072838L667.6116111611161,324.2158405197221L669.426192619262,325.84469325006415L670.8087308730874,326.86209744191234L673.0553555355535,329.4242337273416L675.4747974797481,329.4648860609644L677.462196219622,331.1312951366785L678.8447344734473,333.1222327752647L680.7457245724573,334.21913150690256L679.7088208820882,336.20980514898736L681.0913591359136,337.0224053690702L681.9554455445544,337.103669800394L682.3874887488748,338.76983302313903L683.2515751575158,340.1113368472148L684.9797479747974,340.31463856945703L686.1894689468947,341.8194968298739L685.5846084608461,344.8320296065553Z"
                        className="datamaps-subunit IDN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M618.2722772277227,243.27867940783585L620.8645364536453,246.6967600079055L620.6053105310532,249.04653004064585L621.6422142214221,250.50392937739107L621.5558055805582,251.95296445891069L619.8276327632763,251.61559337467162L620.4324932493249,254.73148413152495L622.8519351935194,256.48872892556545L626.1354635463547,258.4225857448806L624.6665166516652,259.68865566608855L623.7160216021603,262.25002594419277L626.0490549054906,263.31432710778085L628.2956795679568,264.65071557781954L631.4063906390639,266.1640778005812L634.6899189918992,266.52979808279315L636.0724572457245,267.8973159295031L637.9734473447345,268.1246393667461L640.8249324932494,268.76025176752876L642.8123312331232,268.71489430383036L643.1579657965797,267.66982340047275L642.8123312331232,265.9352755251389L642.9851485148515,264.7886145211277L644.454095409541,264.1905835897123L644.6269126912691,266.34699369601685L644.7133213321333,266.8950738927365L646.8735373537354,267.8973159295031L648.428892889289,267.4877071279977L650.4162916291629,267.66982340047275L652.4036903690369,267.57877887549296L652.576507650765,265.9352755251389L651.5396039603961,265.06421872855356L653.52700270027,264.69668908223446L655.6872187218721,262.66696166380046L658.452295229523,260.9489706292379L660.4396939693969,261.6002451860995L662.1678667866787,260.482849939953L663.2911791179117,262.157290898293L662.513501350135,263.31432710778085L665.1057605760576,263.7297254770336L665.2785778577858,264.74265539458366L664.414491449145,265.2478119416387L664.5873087308731,266.8950738927365L662.9455445544554,266.4384098035354L659.8348334833483,268.3063768721625L659.8348334833483,269.801649753812L658.538703870387,272.05376173647153L658.452295229523,273.3528053817492L657.3289828982898,275.4917992811663L655.514401440144,274.91383401931057L655.42799279928,277.6174189879573L654.8231323132313,278.4992870815444L655.0823582358234,279.598564508048L653.8726372637265,280.21270356471524L652.6629162916292,276.11312675188935L651.9716471647164,276.11312675188935L651.6260126012601,277.7939688285213L650.2434743474347,276.4233684882481L651.0211521152115,274.91383401931057L652.0580558055806,274.78031686496604L653.1813681368137,272.5471116903262L651.7988298829882,272.0986427648963L649.5522052205221,272.14351756989356L647.3055805580557,271.7843445575986L647.1327632763275,269.93722863840793L645.9230423042304,269.801649753812L644.0220522052205,268.624159400664L643.2443744374438,270.43385203525384L644.9725472547254,271.82926304524875L643.4171917191719,272.8158966615364L642.8987398739874,273.7995615618312L644.3676867686768,274.51312335543673L643.9356435643565,276.0687836307547L644.7997299729973,278.05862785906305L645.1453645364536,280.21270356471524L644.7997299729973,281.13198924730904L643.1579657965797,281.08826548878324L640.2200720072008,281.6562750143876L640.3928892889289,283.5724652747463L639.0967596759676,285.0899667200645L635.6404140414041,286.81722831537905L632.9617461746175,289.77999448452834L631.1471647164716,291.4030629402358L628.7277227722773,293.0203392515218L628.7277227722773,294.16607072859745L627.6044104410441,294.80140963164126L625.3577857785779,295.68950427044024L624.3208820882088,295.816245540109L623.543204320432,297.7135890597495L624.0616561656166,300.9445601407871L624.1480648064806,302.99111389462183L623.1975697569757,305.3216927103439L623.1975697569757,309.5047325080895L621.9014401440145,309.5873222967985L620.8645364536453,311.4844978296393L621.5558055805582,312.2668298623004L619.3955895589559,312.9662066535948L618.5315031503151,314.60965590203693L617.5810081008101,315.30725578642404L615.3343834383439,313.04844965086556L614.2110711071107,309.62861385818866L613.2605760576057,307.14705751964664L612.482898289829,305.98603144405376L611.1867686768677,303.6578734106521L610.5819081908191,300.5678820268165L610.1498649864986,299.0166612292211L607.9896489648966,295.6049922555498L606.9527452745274,290.720385868719L606.2614761476148,287.50609925806634L606.2614761476148,284.3969773406244L605.8294329432944,282.0053920862605L602.2866786678668,283.5290215865715L600.6449144914491,283.22477925569206L597.534203420342,280.1250326695044L598.6575157515751,279.15925670079196L597.9662466246625,278.14680350849244L595.1147614761477,275.93571984004893L596.7565256525653,274.15653341637864L602.0274527452746,274.20112798713313L601.50900090009,271.91908125416774L600.2128712871287,270.5691593292017L599.8672367236724,268.488007017713L598.3118811881188,267.30548177300454L600.9905490549055,264.46674951414343L603.7556255625562,264.65071557781954L606.2614761476148,261.8324802911767L607.8168316831683,259.032901761816L610.1498649864986,256.2045576993334L610.0634563456346,254.20679819344048L612.1372637263727,252.5783346615425L610.1498649864986,251.1811738659054L609.3721872187218,249.2413408244666L608.508100810081,246.6967600079055L609.7178217821782,245.46392634579416L613.3469846984699,246.15508476667708L616.0256525652566,245.71099535627584Z"
                        className="datamaps-subunit IND"
                        data-info='{"active":{"value":"1,408","percent":"19.2","isGrown":true},"new":{"value":"392","percent":"11.1","isGrown":true},"fillKey":"MAJOR","short":"in"}'
                        style={{
                          fill: 'rgb(79, 70, 229)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M416.5945094509451,180.42587260960426L417.02655265526556,183.29547105711728L415.2119711971197,186.84960013718097L410.9779477947795,189.15740531044366L407.521602160216,188.5668752606199L409.50900090009003,184.44346135789445L408.2128712871287,180.3569576029453L411.496399639964,177.15622179301212L413.31098109810983,175.17780506255204L413.82943294329436,177.43696350688433L413.31098109810983,179.66626758694102L414.7799279927993,179.59704395630703Z"
                        className="datamaps-subunit IRL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M548.0220522052205,259.17355163791206L546.6395139513952,259.032901761816L544.9977497749776,258.798325431388L543.2695769576958,261.41431995696695L538.7763276327632,261.22827236602114L532.0364536453645,255.6353057624882L528.493699369937,253.6810582685901L525.5558055805581,252.9144439529478L524.6053105310531,249.43599964205254L529.8762376237623,246.40145029650307L530.8267326732673,242.87919758724533L530.5675067506751,240.720268022137L531.9500450045005,239.96241930304438L533.1597659765977,238.08230958149008L534.1966696669667,237.6226328510471L536.9617461746175,238.03128033623335L537.8258325832583,238.7955206243992L538.9491449144915,238.28631211138128L540.504500450045,241.8273245719792L542.0598559855986,242.72921758279176L542.2326732673267,244.42345868877953L541.0229522952295,245.46392634579416L540.504500450045,247.7275433012918L542.1462646264627,250.45548532497523L545.0841584158416,252.00112401883987L546.3802880288029,254.15904735492995L545.9482448244825,256.2045576993334L546.7259225922593,256.2045576993334L546.7259225922593,257.66955186391897Z"
                        className="datamaps-subunit IRQ"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M396.7205220522052,118.7784291270101L396.11566156615663,122.69459803733355L398.7943294329433,126.6082218639014L395.6836183618362,130.89356297630133L388.77092709270926,134.69583412777206L386.6971197119712,135.6090756832232L383.5864086408641,134.8789175750227L376.84653465346537,133.1307337296701L379.2659765976598,130.70564394621056L373.99504950495054,127.95443326427161L378.22907290729074,126.80127083985937L378.14266426642666,125.1524587424176L373.13096309630964,123.78098894388685L374.7727272727273,119.9943070289809L378.40189018901896,119.08332330616975L382.1174617461746,123.09055509485802L385.7466246624663,119.89335911921725L388.77092709270926,121.60032130462253L392.65931593159314,118.37093699514227Z"
                        className="datamaps-subunit ISL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M517.2605760576057,251.3260627536166L516.8285328532853,252.24178615370852L515.9644464446445,251.85661814524474L515.4459945994599,253.72889661796776L516.0508550855086,254.063519516773L515.4459945994599,254.44542187408098L515.3595859585959,255.15999547501275L516.482898289829,254.77913092649854L516.482898289829,255.8726419808113L515.2731773177318,260.34286232570224L513.7178217821782,255.5403118766621L514.409090909091,254.63616464395594L514.2362736273627,254.44542187408098L514.9275427542755,253.15425453916754L515.3595859585959,250.9878600612271L515.7052205220522,250.26161602769292L515.7916291629163,250.26161602769292L516.5693069306931,250.26161602769292L516.8285328532853,249.7277040432548L517.433393339334,249.7277040432548L517.519801980198,250.89114789662545L517.1741674167416,251.3260627536166Z"
                        className="datamaps-subunit ISR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M245.33258325832583,289.30904269245235L246.9743474347435,289.5231748134375L248.1840684068407,290.16494198098474L248.61611161116116,290.8484668787757L246.9743474347435,290.8911524041947L246.19666966696673,291.31778483616085L244.9005400540054,290.8911524041947L243.51800180018006,289.9938958172963L243.7772277227723,289.39470820685705L244.81413141314133,289.22336024735495Z"
                        className="datamaps-subunit JAM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M516.8285328532853,252.24178615370852L517.2605760576057,251.3260627536166L519.9392439243925,252.48222287613595L524.6053105310531,249.43599964205254L525.5558055805581,252.9144439529478L525.1237623762377,253.29803434862254L520.2848784878488,254.73148413152495L522.7043204320432,257.5281254908747L521.9266426642664,257.9992604549728L521.494599459946,258.93909524428454L519.6800180018002,259.31412979712314L519.0751575157516,260.29618419645794L518.0382538253825,261.1817412999035L515.3595859585959,260.71600711890767L515.2731773177318,260.34286232570224L516.482898289829,255.8726419808113L516.482898289829,254.77913092649854L516.8285328532853,253.96795674804744Z"
                        className="datamaps-subunit JOR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M754.625112511251,247.1881501194394L754.9707470747076,248.16798722036958L753.5882088208821,249.92198516564514L752.6377137713771,248.9978035402437L751.3415841584158,249.67911023576022L750.7367236723671,251.3260627536166L749.1813681368137,250.55236413664764L749.1813681368137,249.19265239523764L750.477497749775,247.43347574692382L751.8600360036003,247.7765203962486L752.8969396939694,246.5491499055878ZM769.8330333033302,238.33728417896813L768.9689468946895,240.720268022137L769.3145814581458,242.22859348303308L768.1048604860487,244.32413067064925L765.0805580558056,245.66160176300423L760.8465346534654,245.85911564460275L757.3901890189019,249.14395446016871L755.7484248424844,248.07017872315078L755.6620162016202,245.90846893828586L751.514401440144,246.5491499055878L748.6629162916292,247.87444537606672L745.8978397839784,247.97233146335788L748.3172817281729,250.0675974150222L746.6755175517551,254.9220196035472L745.1201620162017,256.0623586894658L743.9968496849685,254.96963195084413L744.6017101710172,252.43415351920828L743.0463546354636,251.61559337467162L742.0958595859587,249.63050700172533L744.3424842484249,248.75402781229096L745.6386138613861,246.9425785499454L748.0580558055806,245.46392634579416L749.7862286228624,243.42831144731343L754.538703870387,242.57914212234385L757.1309630963095,243.17887218363438L759.6368136813682,237.8781237762032L761.2785778577858,239.30359701310263L764.7349234923493,236.28940139717628L766.1174617461745,235.10336270947369L767.6728172817282,231.34884197139766L767.2407740774077,227.79561530898147L768.1912691269129,225.80757888761468L770.7835283528352,225.21288297000444L772.0796579657966,229.60611949326386L771.9932493249325,232.13636484696855L769.8330333033302,235.20674729301194ZM776.9185418541855,216.0784748062713L778.560306030603,216.7569774604645L780.2884788478848,215.34078788814253L780.8069306930693,219.11365355770454L777.2641764176418,220.0041849451904L775.1039603960396,223.25459889450934L771.3883888388839,221.00135588701113L770.0922592259226,224.56217871242924L767.413591359136,224.6164820761823L767.0679567956795,221.38782300537295L768.2776777677768,218.8345509942593L770.7835283528352,218.66690267533332L771.4747974797481,214.02882204007753L772.2524752475248,211.3780770964276L775.0175517551756,214.94242288282865Z"
                        className="datamaps-subunit JPN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M531.3451845184519,338.5259707888353L529.6170117011701,339.50150367324767L529.0121512151215,340.4772890991126L528.1480648064806,340.63994801073295L527.8024302430243,342.34843004795914L527.0247524752475,343.3252334499781L526.5927092709271,344.9135117745364L525.5558055805581,345.72853926404105L522.0994599459947,343.3252334499781L522.0130513051306,341.9008639173341L513.2857785778577,337.0224053690702L512.8537353735373,336.77861728266896L512.8537353735373,334.21913150690256L513.5450045004501,333.2441134106345L514.7547254725473,331.6595543923422L515.6188118811881,329.9120335819811L514.495499549955,327.1468935648297L514.2362736273627,325.9261022308678L513.1129612961296,324.25657841994723L514.5819081908191,322.8301931894328L516.2236723672368,321.23931084607364L517.433393339334,321.64738945848205L517.433393339334,322.99326909734657L518.2974797479749,323.8084114547435L519.9392439243925,323.8084114547435L522.9635463546355,325.84469325006415L523.7412241224123,325.84469325006415L524.3460846084608,325.8039876275651L524.8645364536453,326.08891123594555L526.419891989199,326.2517084898851L527.1111611161116,325.274744116062L529.3577857785779,324.25657841994723L530.3082808280828,325.07115307536833L531.9500450045005,325.07115307536833L529.8762376237623,327.7977400662675L529.8762376237623,336.5348364114826Z"
                        className="datamaps-subunit KEN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M601.7682268226822,222.3782391077354L602.3730873087309,220.94608617971846L603.9284428442844,220.44797915054784L607.9032403240324,221.60833184589683L608.2488748874888,219.6706973793992L609.6314131413142,219.0020591462873L613.0013501350135,220.33712198308336L613.8654365436544,220.0041849451904L617.8402340234024,220.11522498612277L621.469396939694,220.44797915054784L622.6791179117912,221.60833184589683L624.1480648064806,222.10360556423382L623.8024302430243,222.81688725827823L620.0004500450045,224.56217871242924L619.1363636363636,225.80757888761468L616.1120612061206,226.18514134153347L615.1615661566157,228.22300628834452L612.6557155715572,227.79561530898147L610.9275427542755,228.43637901049277L608.6809180918092,229.92403083647056L609.0265526552655,230.66399780534675L608.3352835283529,231.34884197139766L603.7556255625562,231.82169838365655L600.8177317731772,230.82223168575644L598.2254725472548,231.0330298307764L598.484698469847,229.2346248808514L601.0769576957696,229.7651341451784L601.9410441044105,228.8092662814073L603.7556255625562,229.12836476581654L606.8663366336634,226.83081170368717L604.0148514851485,225.15873540175107L602.2866786678668,225.96947488161462L600.4720972097209,224.77930687232373L602.545904590459,222.65250429633835Z"
                        className="datamaps-subunit KGZ"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M677.7214221422142,305.0308343806119L677.1165616561656,302.0313665382305L678.6719171917191,299.9814410448529L681.7826282628263,299.52023489988204L684.0292529252926,299.8556954536953L686.0166516651666,300.8190283195482L687.0535553555355,299.1425980338207L689.2137713771376,300.023349957816L689.7322232223223,301.697179478319L689.47299729973,304.6566826847359L685.4117911791179,306.5253235376995L686.5351035103511,308.0165622196603L683.9428442844285,308.18206268721565L681.8690369036904,309.1742839101657L679.8816381638163,308.80235631188236L678.9311431143115,307.5612398694367Z"
                        className="datamaps-subunit KHM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M739.503600360036,233.85897237062568L741.577407740774,237.46919987621135L742.1822682268227,239.40507726790904L742.1822682268227,242.82921484388245L741.3181818181819,244.47310722986026L739.1579657965797,245.01856323768098L737.2569756975697,246.2536609558732L735.0967596759676,246.4999266588448L734.8375337533753,244.91948160778827L735.2695769576958,242.67920304735145L734.1462646264627,239.60790335623693L735.9608460846084,239.1005017066666L734.3190819081908,236.49502861550656L734.491899189919,236.23796512770764L735.5288028802879,236.3408258707995L736.4792979297929,234.9481956145293L738.2074707470748,234.8446906200661L739.1579657965797,234.63753563108133Z"
                        className="datamaps-subunit KOR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M480.8825382538254,223.69138044149412L480.7961296129613,222.4879892969014L480.1912691269127,222.15856181760955L479.67281728172816,221.27747884748675L480.1048604860486,220.55877557126573L480.7097209720972,220.33712198308336L481.05535553555353,219.22518594324208L481.48739873987404,219.05786411197755L481.83303330333035,219.50374625079763L482.2650765076508,219.72631699325888L482.52430243024304,220.28167058639386L482.9563456345635,220.39255816674108L483.3883888388839,221.00135588701113L483.73402340234026,221.00135588701113L483.47479747974796,221.77355684195598L483.2155715571557,222.15856181760955L483.3019801980198,222.43312156305626L482.7835283528353,222.5428423219529L481.3145814581459,223.03585973790848L481.2281728172817,223.69138044149412Z"
                        className="datamaps-subunit -99"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M546.6395139513952,259.032901761816L547.1579657965797,260.2494982604986L546.8987398739874,260.85580841222225L547.6764176417641,262.9445822895875L546.0346534653465,262.9908263404219L545.429792979298,261.6931620463284L543.2695769576958,261.41431995696695L544.9977497749776,258.798325431388Z"
                        className="datamaps-subunit KWT"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M684.0292529252926,299.8556954536953L684.8069306930693,298.7647001723307L684.8933393339333,296.66037512687933L682.9923492349235,294.4626655974121L682.8195319531953,291.99956244508917L681.0049504950495,289.9511238883894L679.1903690369037,289.77999448452834L678.6719171917191,290.63497812212995L677.2893789378937,290.720385868719L676.5981098109811,290.29318310125205L674.0058505850584,291.7866163832672L674.0058505850584,289.5231748134375L674.6107110711071,286.86031631227974L672.9689468946896,286.7310388119086L672.7961296129613,285.1765055409517L671.7592259225923,284.3969773406244L672.2776777677768,283.48557303268143L674.3514851485149,281.7872318640726L674.5243024302431,282.3977635008181L675.8204320432044,282.4849020929044L675.4747974797481,279.510745635121L676.6845184518452,279.11529648697467L678.1534653465346,281.17570786776156L679.1903690369037,283.5290215865715L682.1282628262827,283.5290215865715L683.0787578757877,285.7817550482006L681.523402340234,286.4292332039805L680.8321332133213,287.3339885116369L683.7700270027003,288.8804604271483L685.7574257425742,291.8718066890269L687.2263726372637,294.0812958864044L689.0409540954095,295.816245540109L689.6458145814581,297.5452178504536L689.2137713771376,300.023349957816L687.0535553555355,299.1425980338207L686.0166516651666,300.8190283195482Z"
                        className="datamaps-subunit LAO"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M517.433393339334,249.7277040432548L516.8285328532853,249.7277040432548L516.5693069306931,250.26161602769292L515.7916291629163,250.26161602769292L516.6557155715572,247.87444537606672L517.8654365436544,245.85911564460275L517.8654365436544,245.7603788620154L518.9887488748875,245.90846893828586L519.3343834383438,247.04083675664495L518.0382538253825,248.11908781302827Z"
                        className="datamaps-subunit LBN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M412.9653465346535,324.01213745504555L412.3604860486049,324.01213745504555L409.85463546354634,322.8709636902753L407.6944194419442,321.03522815163456L405.62061206120615,319.728380259031L404.06525652565256,318.1747626793895L404.58370837083714,317.397188443135L404.7565256525653,316.70100383965064L405.7934293429343,315.3482756360314L406.91674167416744,314.24013369979497L407.4351935193519,314.19906676500244L408.1264626462646,313.91154771892144L409.0769576957696,315.38929379391766L408.9041404140414,316.3732317260135L409.42259225922595,316.8648521132321L410.11386138613864,316.9058102859088L410.54590459045903,315.9223775911002L411.2371737173717,315.96337245508226L411.15076507650764,316.70100383965064L411.40999099909993,317.8474276739415L410.8915391539154,318.9109330997238L411.5828082808281,319.60579699000334L412.27407740774083,319.76923874847057L413.31098109810983,320.749462666724L413.3973897389739,321.72899154332293L413.1381638163817,322.0145637643229Z"
                        className="datamaps-subunit LBR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M627.7772277227723,316.3732317260135L627.4315931593159,318.9109330997238L626.3946894689469,319.5649332879261L624.3208820882088,320.1369073593779L623.1975697569757,318.2156730510652L622.7655265526553,314.7327981765633L623.8888388838884,310.7838915478312L625.530603060306,312.1433517689263L626.6539153915392,313.8704663099009Z"
                        className="datamaps-subunit LKA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M501.01575157515754,407.1340334096518L501.8798379837983,407.9709764912618L501.1021602160216,409.32465387986423L500.7565256525653,410.21513863716905L499.37398739873987,410.63795613666446L498.9419441944195,411.53272943818314L498.0778577857786,411.81590394332244L496.26327632763275,409.65239290580894L497.5594059405941,407.92441449805017L498.85553555355534,406.8556006620346L499.9788478847885,406.29954912795677Z"
                        className="datamaps-subunit LSO"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M486.0670567056706,178.55528551397697L485.89423942394245,177.5070759818769L486.1534653465347,176.3817611728889L485.0301530153015,175.67459792920863L482.52430243024304,174.96444229485041L482.0058505850585,171.36765305359071L484.77092709270926,170.0535081961751L488.8321332133213,170.34644379945428L491.16516651665165,169.906845406289L491.510801080108,170.78487647501893L492.8069306930694,171.07652102896424L495.05355535553554,173.17575244202493L495.31278127812783,175.03559341527992L493.32538253825385,176.3817611728889L492.8069306930694,178.764150087509L490.21467146714673,180.28801468337343L487.8816381638164,180.28801468337343L487.27677767776777,178.97275742386273Z"
                        className="datamaps-subunit LTU"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M445.9734473447345,195.01984746894044L446.49189918991897,195.84179950955343L446.3190819081908,197.47452470287533L445.6278127812781,197.59950952683076L445.1093609360936,197.2242956834936L445.3685868586859,195.14654702258565Z"
                        className="datamaps-subunit LUX"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M482.0058505850585,171.36765305359071L482.09225922592265,168.1366415443619L483.3019801980198,165.3696370371969L485.5486048604861,163.85421590530973L487.449594959496,167.16976674235488L489.3505850585059,167.09515523640712L489.8690369036904,163.6256809293397L491.85643564356434,162.8615671547083L492.97974797479753,163.39682411337174L495.05355535553554,165.0676780737706L496.9545454545455,165.0676780737706L498.1642664266427,166.12210023616785L498.33708370837087,168.21078130379325L499.11476147614763,170.78487647501893L496.522502250225,172.45487089233887L495.05355535553554,173.17575244202493L492.8069306930694,171.07652102896424L491.510801080108,170.78487647501893L491.16516651665165,169.906845406289L488.8321332133213,170.34644379945428L484.77092709270926,170.0535081961751Z"
                        className="datamaps-subunit LVA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M426.2722772277228,244.22476134707028L427.2227722772277,246.1057816583686L427.3091809180918,247.87444537606672L428.1732673267327,250.89114789662545L428.7781278127813,251.51911971143045L428.3460846084609,252.62637710510907L425.2353735373538,253.0583569776233L424.11206120612064,254.1112877984921L422.7295229522952,254.34999847486364L422.64311431143113,256.44138800653593L419.87803780378044,257.57527581550335L418.9275427542754,258.93909524428454L416.9401440144015,259.68865566608855L414.52070207020705,260.10939354542825L410.71872187218725,262.157290898293L410.71872187218725,265.38543209892214L410.3730873087309,265.38543209892214L410.3730873087309,266.8037964389212L408.9041404140414,266.8950738927365L408.1264626462646,267.53324640756443L407.0031503150315,267.53324640756443L406.1390639063907,267.1687409394708L404.15166516651664,267.4421610307784L403.37398739873987,269.5303159009955L402.5963096309631,269.7564437684735L401.47299729973,273.08446082368596L398.1894689468947,275.93571984004893L397.4117911791179,279.510745635121L396.37488748874887,280.69451961874006L396.11566156615663,281.6126125818517L390.6719171917192,281.83087401462006L390.7583258325833,280.65074420266325L391.7088208820882,279.90576339161817L392.486498649865,278.587353426699L392.3136813681368,277.70570498485364L393.1777677767777,275.84698190323724L394.47389738973897,274.15653341637864L395.25157515751573,273.7549130864114L395.9428442844284,272.1883861571048L395.9428442844284,270.79454321642123L396.80693069306926,269.1228725473835L398.448694869487,268.17008382891186L400.0040504050405,265.43129127922435L400.0040504050405,265.38543209892214L401.21377137713773,264.3286991423005L403.46039603960395,264.05240268620287L405.3613861386139,262.157290898293L406.57110711071107,261.41431995696695L408.5585058505851,259.1266763234917L407.95364536453644,255.6827899627977L408.81773177317734,253.2501166065658L409.1633663366337,251.7602355223604L410.71872187218725,249.82486341019836L413.1381638163817,248.5100126402673L414.95274527452744,247.2863098259046L416.50810081008103,244.2744511763563L417.2857785778578,242.4790386659629L419.0139513951395,242.4790386659629L420.482898289829,243.7272927252854L422.7295229522952,243.52801371140873L425.2353735373538,244.1750611741516Z"
                        className="datamaps-subunit MAR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M495.3991899189919,202.04276429907836L495.91764176417644,201.49321807684308L497.5594059405941,201.12594008049876L499.2875787578758,202.28648215269843L500.3244824482448,202.40822050536664L501.3613861386139,203.379253057747L501.1885688568857,204.58594129636606L502.1390639063907,205.12641160334098L502.484698469847,206.61958288195913L503.26237623762376,207.5098279435517L503.0895589558956,208.04196821117407L503.521602160216,208.3958997711311L502.91674167416744,208.63148797035848L501.534203420342,208.57261830935175L501.27497749774983,208.04196821117407L500.7565256525653,208.33695701839747L500.92934293429346,208.98432364310668L500.3244824482448,210.0973465913762L499.8924392439244,211.2619991486097L499.2875787578758,211.61002336414242L498.85553555355534,210.03892784016455L499.11476147614763,208.57261830935175L499.02835283528356,207.0355535251789L497.6458145814582,204.94642857834404L496.8681368136814,203.4397739184806L496.0904590459046,202.40822050536664Z"
                        className="datamaps-subunit MDA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M550.441494149415,364.64248934532657L551.0463546354636,365.68350184097085L551.6512151215121,367.31102134997786L551.9968496849685,370.2857317531935L552.6017101710171,371.4633042676155L552.4288928892889,372.64353117172215L551.9968496849685,373.40369342720487L551.1327632763276,371.92664313998495L550.7007200720072,372.68573239092774L551.1327632763276,374.50376074425174L550.9599459945995,375.563871653056L550.2686768676867,376.15856755358334L550.1822682268227,378.28874973167405L549.2317731773178,381.24530193173223L548.0220522052205,384.74290801935877L546.5531053105311,389.6314162791099L545.6026102610261,393.25263822697667L544.5657065706571,396.32974754769486L542.578307830783,396.95760621988904L540.504500450045,398.08183207099023L539.1219621962197,397.40682398235475L537.2209720972097,396.46418659150913L536.529702970297,395.07763470086246L536.3568856885688,392.72034676060156L535.492799279928,390.64337386948193L535.3199819981999,388.79758731561435L535.7520252025203,386.9174443165291L536.8753375337534,386.4815501451123L536.8753375337534,385.6112519920561L537.9986498649864,383.6601668376971L538.1714671467147,382.0630420581251L537.6530153015301,380.8585081499098L537.2209720972097,379.22923403544166L537.0481548154816,376.9242912186565L537.8258325832583,375.5214220381783L538.1714671467147,373.9111113803502L539.3811881188119,373.82650559171526L540.6773177317732,373.31917410898956L541.6278127812782,372.896791201957L542.6647164716471,372.8545723968501L544.0472547254725,371.4212029499969L546.0346534653465,369.9077748530909L546.7259225922593,368.6497914113513L546.3802880288029,367.6036123089233L547.4171917191719,367.89635046101796L548.7133213321332,366.18380950703886L548.7997299729973,364.6840968184076L549.5774077407741,363.60317539735587Z"
                        className="datamaps-subunit MDG"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M480.8825382538254,223.69138044149412L481.2281728172817,223.69138044149412L481.3145814581459,223.03585973790848L482.7835283528353,222.5428423219529L483.3019801980198,222.43312156305626L484.07965796579657,222.21350328590796L485.20297029702976,222.15856181760955L486.4126912691269,223.19993593550527L486.5855085508551,225.32113584678396L486.1534653465347,225.42933245756075L485.72142214221424,226.02341235125272L484.42529252925294,225.91552348906498L483.47479747974796,226.61580899719505L481.91944194419443,226.9382306056289L480.96894689468945,226.13124556934008L480.62331233123314,224.77930687232373Z"
                        className="datamaps-subunit MKD"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M668.0436543654366,310.53647413936085L667.7844284428443,308.71968060071606L668.5621062106211,306.8569843765939L667.6980198019803,305.40477143100486L667.9572457245724,302.69917849488496L666.9203420342035,301.4464145047085L666.1426642664267,298.47059722874L665.7106210621062,295.30908730118597L664.6737173717372,293.2327204955719L663.1183618361836,294.5050214837721L660.3532853285328,296.2806906275613L659.0571557155715,296.0696321941922L657.5882088208821,295.4781973947013L658.3658865886589,292.3826169756648L657.8474347434743,289.9938958172963L656.0328532853287,287.0756889363871L656.2920792079208,286.170365525586L654.9095409540953,285.8681451161657L653.1813681368137,283.74619146786944L653.0085508550856,281.699932368943L653.8726372637265,282.09262087340875L653.8726372637265,280.21270356471524L655.0823582358234,279.598564508048L654.8231323132313,278.4992870815444L655.42799279928,277.6174189879573L655.514401440144,274.91383401931057L657.3289828982898,275.4917992811663L658.452295229523,273.3528053817492L658.538703870387,272.05376173647153L659.8348334833483,269.801649753812L659.8348334833483,268.3063768721625L662.9455445544554,266.4384098035354L664.5873087308731,266.8950738927365L664.414491449145,265.2478119416387L665.2785778577858,264.74265539458366L665.1057605760576,263.7297254770336L666.488298829883,263.49902214735056L667.2659765976598,265.1101277294084L668.3028802880289,265.7521073008528L668.3892889288929,267.85183097496935L668.3028802880289,270.0275820601293L666.0562556255625,272.2781047007171L665.7106210621062,275.40294569168566L668.3028802880289,274.95832798106153L668.8213321332133,277.35242765804594L670.3766876687669,277.8822105608749L669.6854185418541,280.0373407569689L671.5,281.00080253740884L672.5369036903691,281.48159476641683L674.2650765076507,280.7382898463729L674.3514851485149,281.7872318640726L672.2776777677768,283.48557303268143L671.7592259225923,284.3969773406244L670.3766876687669,285.0034091329505L668.9941494149415,286.1272049366049L667.2659765976598,286.21352154213275L666.2290729072906,288.96621096154576L665.1921692169217,289.437534626484L666.4018901890188,291.6588011329222L667.8708370837085,293.4874519679961L668.9077407740774,295.13991949345274L667.9572457245724,297.29255951343384L667.1795679567956,297.7556734404679L667.6980198019803,299.0166612292211L669.3397839783978,300.9863979862847L669.5990099009902,302.3653655186822L669.5990099009902,303.4912509288797L670.549504950495,305.7369820579214L669.1669666966696,308.0165622196603Z"
                        className="datamaps-subunit MMR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M478.03105310531055,223.58227190117566L477.5126012601261,223.36388122727345L476.82133213321333,222.3233419182442L475.7844284428443,221.6634217406686L476.04365436543657,221.1118501473778L476.3892889288929,219.2809289100042L477.16696669666965,218.55505907785067L477.59900990099015,218.21915243888168L478.29027902790284,218.77868381346823L478.63591359135916,219.2809289100042L479.4135913591359,219.6150623932769L480.27767776777677,220.28167058639386L480.1048604860486,220.55877557126573L479.67281728172816,221.27747884748675L478.9815481548155,221.60833184589683L478.8951395139514,221.00135588701113L477.8582358235824,222.59768065087977Z"
                        className="datamaps-subunit MNE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M642.1210621062106,198.09858804680016L644.6269126912691,197.47452470287533L649.2065706570658,194.2577612749597L652.8357335733574,192.46679734886973L654.9095409540953,193.62019691342388L657.4153915391539,193.68405600223292L659.0571557155715,195.4629047643903L661.4765976597661,195.58929185082798L664.9329432943294,196.5343731221679L667.2659765976598,193.93926387588618L666.3154815481548,191.6936796812061L668.7349234923493,187.71035136624752L671.413591359136,189.28836433998674L673.6602160216021,189.74595266776618L676.4252925292529,190.72250612088013L676.9437443744374,193.556314932557L680.3136813681368,195.14654702258565L682.560306030603,194.44858745717025L685.67101710171,194.0030088334122L688.0040504050405,194.44858745717025L690.423492349235,196.28283636048786L691.8060306030603,198.16087635849604L694.0526552655265,198.09858804680016L697.0769576957696,198.72051156280753L699.3235823582359,197.7868251138115L702.4342934293429,197.2242956834936L705.9770477047705,194.57569183296442L707.4459945994599,194.9564640802955L708.655715571557,196.2198972408838L711.507200720072,195.90487102356238L710.3838883888388,198.72051156280753L708.655715571557,202.3473613614042L709.2605760576057,203.8024852924284L710.6431143114312,203.31871244433887L712.9761476147614,203.92323188332202L714.8771377137714,202.59067773398576L716.7781278127813,203.74208256703542L718.9383438343834,206.20269097005612L718.6791179117912,207.45060873365776L716.7781278127813,207.0355535251789L713.3217821782177,207.5098279435517L711.5936093609362,208.51373040012103L709.8654365436544,210.79698567997087L706.2362736273628,212.130885073413L703.8168316831683,213.91432114098706L701.3109810981098,213.22589958123842L700.0148514851486,212.9383367216942L698.7187218721872,215.1132497174353L699.496399639964,216.41801720216205L699.9284428442844,217.48940882322177L698.2002700270027,218.61098869081326L696.4720972097209,220.39255816674108L693.7070207020702,221.55322703787675L690.0778577857786,221.6634217406686L686.1894689468947,222.76210758741297L683.424392439244,224.5078611125041L682.3874887488748,223.5276959505081L679.4495949594959,223.5276959505081L675.9068406840685,221.55322703787675L673.4873987398739,221.05661053855752L670.3766876687669,221.49810730371934L665.3649864986498,220.78018659295853L662.7727272727273,220.83550154574561L661.3037803780379,218.8904026009599L660.2668766876687,215.85178828224014L658.7115211521152,215.4544582594538L655.8600360036003,213.34080569683266L652.6629162916292,212.8807730169119L649.8114311431144,212.30419408285155L648.9473447344735,210.85517392502516L649.8114311431144,206.73852538817283L648.1696669666967,203.92323188332202L644.7133213321333,202.59067773398576L642.7259225922593,200.6350907325153Z"
                        className="datamaps-subunit MNG"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M514.409090909091,362.3166920216113L516.2236723672368,362.10942243236076L519.1615661566157,362.8143945901939L519.7664266426643,362.48255260256633L521.4081908190819,362.4410836991853L522.2722772277228,361.69506851750384L523.7412241224123,361.7364928752734L526.3334833483348,360.7843424636527L528.2344734473447,359.3790811857325L528.6665166516651,360.45345377292966L528.580108010801,362.8973804424284L528.8393339333933,365.0586870269138L528.9257425742575,368.9011608722646L529.3577857785779,370.1177184086722L528.6665166516651,371.92664313998495L527.7160216021603,373.6573374735668L526.1606660666066,375.18196149387296L524.0004500450045,376.15856755358334L521.3217821782179,377.3502437769836L518.5567056705671,380.0859771139604L517.6926192619262,380.55791297142696L515.9644464446445,382.36472183577735L515.0139513951394,382.9255737965037L514.7547254725473,384.74290801935877L515.9644464446445,386.6994346250542L516.3964896489649,388.2281667555567L516.3964896489649,388.9729716023868L516.8285328532853,388.84142550056L516.7421242124212,391.3931972274459L516.3964896489649,392.63171174844206L516.9149414941494,393.07511575859104L516.5693069306931,394.18615576764756L515.6188118811881,395.1222712877749L513.6314131413142,396.0162716470745L510.6935193519352,397.4517802682784L509.65661566156615,398.3973257141869L509.91584158415844,399.52666958620597L510.52070207020705,399.7077428706881L510.26147614761476,401.11466255778134L508.446894689469,401.11466255778134L508.27407740774083,399.93423270678966L507.9284428442844,398.7131338120501L507.66921692169217,397.7666509102497L508.10126012601256,394.8099409977897L507.496399639964,392.9420343627203L506.3730873087309,389.2800971845194L508.8789378937894,386.35087930126565L509.483798379838,384.48278006122416L509.91584158415844,384.26613768009L510.1750675067507,382.7529218838071L509.7430243024303,382.01996295407093L509.82943294329436,380.12885888853594L510.34788478847884,378.37416583305793L510.34788478847884,375.18196149387296L509.0517551755176,374.37670391123L507.9284428442844,374.20734630991586L507.40999099909993,373.57277507509986L506.2866786678668,373.0657017651249L504.29927992799287,373.1079382629955L504.1264626462646,372.1795481118854L503.95364536453644,370.4117760618112L511.21197119711974,368.35666831932144L512.5945094509451,369.5300796295362L513.2857785778577,369.32036090469853L514.2362736273627,369.9497570864253L514.3226822682269,370.9162496811498L513.8042304230423,372.09523266962486L513.9770477047705,373.8688066716421L515.6188118811881,375.3940959664654L516.3100810081008,373.6573374735668L517.3469846984699,373.15017831226095L517.1741674167416,369.9497570864253L516.1372637263727,368.14738709303344L515.2731773177318,367.35281109959647L514.409090909091,367.3946038286916L513.8042304230423,364.18498562750017Z"
                        className="datamaps-subunit MOZ"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M514.409090909091,362.3166920216113L513.8042304230423,364.18498562750017L514.409090909091,367.3946038286916L515.2731773177318,367.35281109959647L516.1372637263727,368.14738709303344L517.1741674167416,369.9497570864253L517.3469846984699,373.15017831226095L516.3100810081008,373.6573374735668L515.6188118811881,375.3940959664654L513.9770477047705,373.8688066716421L513.8042304230423,372.09523266962486L514.3226822682269,370.9162496811498L514.2362736273627,369.9497570864253L513.2857785778577,369.32036090469853L512.5945094509451,369.5300796295362L511.21197119711974,368.35666831932144L509.91584158415844,367.7290534116755L510.6935193519352,365.4335005967313L511.471197119712,364.5592825480118L510.95274527452744,362.5240240179135L511.471197119712,360.53616194192864L511.90324032403237,359.8747548144718L511.2983798379838,357.81152621551536L510.0886588658866,356.7407281243047L512.508100810081,357.1935911438838L512.9401440144014,357.8527383486462L513.8042304230423,359.00753619174225Z"
                        className="datamaps-subunit MWI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M676.5981098109811,319.5240682735643L677.2029702970298,319.728380259031L678.5855085508551,321.1984966478306L679.6224122412241,322.8301931894328L679.7952295229524,324.41952109832357L679.53600360036,325.5190268033198L679.7088208820882,326.37379885642224L679.8816381638163,327.7977400662675L680.7457245724573,328.44843696100673L681.6962196219622,330.56234502148476L681.6098109810981,331.3751127739426L679.9680468046805,331.53765239148487L677.6350135013502,329.7494403216065L674.8699369936994,327.838412853611L674.5243024302431,326.6179605322192L673.1417641764177,325.03043240950757L672.7961296129613,323.0340355465803L671.9320432043205,321.72899154332293L672.2776777677768,319.97351185806093L671.6728172817282,318.951818236836L672.1048604860487,318.5020057317099L674.0922592259226,319.5649332879261L674.2650765076507,320.7902898982864L675.8204320432044,320.5044738105789ZM714.445094509451,324.54171883908884L712.3712871287128,324.13436201734976L709.606210621062,324.13436201734976L708.7421242124212,326.86209744191234L707.7916291629163,327.7163927348266L706.5819081908191,331.05002028771656L704.594509450945,331.5782866441684L702.347884788479,330.88746696452745L701.2245724572458,331.0906578602908L699.8420342034203,332.30966326937784L698.2866786678669,332.14714117070343L696.7313231323133,332.6346985880982L695.0895589558957,331.2532052242332L694.6575157515751,329.6681412249088L696.4720972097209,330.48106118314223L698.2866786678669,330.0339743228801L698.8051305130514,328.0010982303567L699.8420342034203,327.5536909450456L702.6935193519353,327.02484200400073L704.4216921692168,325.11187291720574L705.6314131413142,323.6046620690135L706.6683168316832,324.86754143407273L707.1867686768677,324.05287988844174L708.3100810081007,324.09362140801085L708.4828982898289,322.58554859758885L708.5693069306931,321.40255604468575L710.470297029703,319.728380259031L711.6800180018001,317.8065042391414L712.6305130513051,317.8065042391414L713.8402340234024,319.03358441337355L713.9266426642664,320.0960603849984L715.568406840684,320.749462666724L717.5558055805582,321.48417173815943L717.38298829883,322.4224313793385L715.7412241224122,322.5447708674462L716.1732673267327,323.7269145319004Z"
                        className="datamaps-subunit MYS"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M829.3685868586858,386.26379025807245L831.3559855985598,387.83446635775704L832.5657065706571,389.06069534367094L831.7016201620162,389.67535517102533L830.3190819081908,388.9729716023868L828.6773177317732,387.7907476270818L827.1219621962196,386.43798822004004L825.480198019802,384.6128225594944L825.1345634563456,383.74667778167486L826.1714671467147,383.7899402672008L827.5540054005401,384.65617959949105L828.590909090909,385.52433030224796Z"
                        className="datamaps-subunit NCL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M451.93564356435644,323.0340355465803L449.42979297929793,323.889904635921L448.479297929793,323.7676634628299L447.61521152115216,324.29731542432523L445.6278127812781,324.25657841994723L444.33168316831683,322.74864911836306L443.55400540054006,320.9944080836291L441.9122412241224,319.4014653202552L440.09765976597663,319.44233429338095L437.93744374437443,319.44233429338095L438.1102610261026,315.5533495826275L438.0238523852385,313.99370507354917L438.45589558955896,312.472587276008L439.2335733573358,311.7316285707737L440.35688568856887,310.2064646945968L440.09765976597663,309.54602851471327L440.61611161116116,308.5543015279961L440.09765976597663,307.1056258782106L440.1840684068407,306.3179541320746L440.35688568856887,304.1158565347247L441.04815481548155,303.11618629915336L441.3937893789379,301.697179478319L441.9986498649865,301.15371900286846L444.5909090909091,300.8608753115152L447.01035103510355,301.7807439894446L447.8744374437444,302.74089214162575L449.0841584158416,302.78260291843196L450.2074707470747,302.1566380848784L453.14536453645366,303.4495883246943L454.3550855085508,303.36625470774885L455.73762376237624,302.3236258607376L457.2065706570657,302.4071022703175L457.8978397839784,302.07312665377077L459.19396939693974,302.19838940855743L461.0085508550855,302.9077180695863L462.90954095409546,301.5300147685302L463.42799279927993,301.65539276792L465.06975697569754,304.3239208633018L465.501800180018,304.2823134485892L466.452295229523,305.28014941867906L466.19306930693074,305.6954648104521L466.10666066606666,306.5253235376995L464.03285328532854,308.4302429075607L463.42799279927993,309.9588668651651L463.0823582358236,311.2372934699761L462.5639063906391,311.7728099278592L462.1318631863187,313.45955116353656L460.83573357335734,314.48649779830373L460.490099009901,315.71737860121266L459.8852385238524,316.660037857065L459.7124212421242,317.68372510101665L458.07065706570654,318.5020057317099L456.68811881188117,317.51999883414493L455.8240324032403,317.5609326350502L454.3550855085508,318.951818236836L453.6638163816382,318.9927020068327L452.54050405040505,321.3209357569959Z"
                        className="datamaps-subunit NGA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M225.80423042304233,307.685447397249L224.94014401440145,306.9398747418618L223.81683168316832,305.9445296336415L223.29837983798382,305.11394995076876L222.2614761476148,304.3239208633018L221.13816381638162,303.2412332006669L221.39738973897394,302.86601587837924L221.74302430243029,303.2412332006669L221.91584158415844,303.0328075365083L222.6935193519352,302.9494174069906L222.95274527452747,302.3653655186822L223.29837983798382,302.3653655186822L223.29837983798382,301.15371900286846L223.81683168316832,301.07006455947453L224.33528352835287,301.1118932953508L224.85373537353738,300.4422673337334L225.54500450045006,300.9445601407871L225.80423042304233,300.65160974049195L226.23627362736275,300.3585087420144L227.10036003600362,299.64605637961927L227.10036003600362,299.1425980338207L227.3595859585959,299.1845705188301L227.7052205220522,298.5966609971274L227.96444644464447,298.51262176817727L228.31008100810084,298.8906953128771L228.82853285328534,299.0166612292211L229.3469846984699,298.6806871207075L229.95184518451848,298.6806871207075L230.81593159315935,298.3445038603901L231.16156615661566,298.00810930743376L231.93924392439246,298.09222787167465L231.76642664266427,298.30246614031L231.5936093609361,298.8487001853856L231.85283528352835,299.77184930805794L231.33438343834385,300.6097474224203L231.07515751575158,301.6136030822035L230.9887488748875,302.69917849488496L231.07515751575158,303.3245836869599L231.16156615661566,304.448726818229L230.81593159315935,304.6982657851031L230.55670567056708,305.7369820579214L230.72952295229524,306.3594330526645L230.21107110711074,307.0227552319735L230.3838883888389,307.685447397249L230.72952295229524,308.05794087805197L230.12466246624666,308.59564976213903L229.43339333933397,308.4302429075607L229.0877587758776,307.93379779658045L228.31008100810084,307.7268451041974L227.7052205220522,308.0165622196603L226.14986498649864,307.39559607073056Z"
                        className="datamaps-subunit NIC"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M448.04725472547256,182.00327908942825L448.479297929793,183.36321235296296L447.9608460846085,186.982300737606L447.35598559855987,188.4353753390054L445.88703870387036,188.4353753390054L446.3190819081908,192.46679734886973L444.93654365436544,191.56449789869453L443.467596759676,189.9416975355112L441.2209720972097,190.72250612088013L439.492799279928,190.39758995502177L440.70252025202524,189.35380719849897L442.77632763276324,183.5662762031185L446.0598559855986,181.8666901748513Z"
                        className="datamaps-subunit NLD"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M642.9851485148515,264.7886145211277L642.8123312331232,265.9352755251389L643.1579657965797,267.66982340047275L642.8123312331232,268.71489430383036L640.8249324932494,268.76025176752876L637.9734473447345,268.1246393667461L636.0724572457245,267.8973159295031L634.6899189918992,266.52979808279315L631.4063906390639,266.1640778005812L628.2956795679568,264.65071557781954L626.0490549054906,263.31432710778085L623.7160216021603,262.25002594419277L624.6665166516652,259.68865566608855L626.1354635463547,258.4225857448806L627.1723672367236,257.7637951576312L629.0733573357336,258.61051999215397L631.492799279928,260.4361951907736L632.8753375337533,260.8092157167879L633.6530153015301,262.157290898293L635.5540054005401,262.66696166380046L637.45499549955,263.8680595297587L640.2200720072008,264.51275184951135Z"
                        className="datamaps-subunit NPL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M846.7367236723671,442.29709084340476L847.2551755175518,443.5914371457059L848.9833483348335,442.29709084340476L849.6746174617462,443.64554278010274L849.6746174617462,445.0027868242228L848.8105310531054,446.4787053843123L847.2551755175518,448.9069962336091L846.0454545454545,450.2439157467582L846.9095409540953,451.8150268714646L845.0085508550856,451.87136799081225L843.0211521152114,453.1149459726447L842.3298829882988,455.3389736785037L840.9473447344735,458.8110229635413L839.1327632763275,460.3352925648879L837.9230423042304,461.3385765006043L835.6764176417641,461.27941248527463L834.1210621062106,460.0999945121647L831.5288028802879,459.8649871246707L831.0967596759676,458.57759568672304L832.3928892889289,456.0859798680269L835.4171917191718,452.7184128485052L836.9725472547254,452.0968926244889L838.7007200720072,450.85966258033005L840.7745274527454,449.129199995282L842.1570657065706,447.4134730495905L843.2803780378038,445.0027868242228L844.1444644464448,444.18737478656016L844.576507650765,442.4046478534844L846.2182718271827,440.95724521745274ZM850.538703870387,427.6418281523396L852.2668766876687,430.8332847143522L852.3532853285328,428.7512905531047L853.4765976597661,429.56152874127935L853.8222322232223,431.85583285909723L855.7232223222322,432.8315646631406L857.3649864986498,433.0890429717737L858.7475247524753,431.95834244433775L859.9572457245724,432.26615131312104L859.3523852385238,435.0036931031187L858.6611161116111,436.7778767089275L856.7601260126013,436.72548885720505L856.1552655265527,437.67040775361943L856.414491449145,438.98968307328704L856.0688568856885,439.57274046634524L855.1183618361836,441.2780330467194L853.9086408640864,443.4832680290702L852.0940594059406,444.7306255744366L851.6620162016202,443.9162821944523L850.625112511251,443.42920452280583L852.0076507650765,440.85042389866663L851.2299729972997,439.0955755120873L848.6377137713772,437.8809502443953L848.7241224122413,436.72548885720505L850.4522952295229,435.6803629564705L850.8843384338434,433.2952393188868L850.7979297929793,431.3439817020893L849.7610261026102,429.30802288041497L849.8474347434743,428.8018471015333L848.7241224122413,427.5412299750513L846.8231323132313,424.94068620110136L845.7862286228623,422.86079385682467L846.7367236723671,422.6636406028965L848.0328532853287,424.294983353059L849.8474347434743,425.04018030188433Z"
                        className="datamaps-subunit NZL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M611.8780378037804,238.38824483973042L613.6926192619262,239.7599055987588L614.3838883888388,242.07819810189355L618.2722772277227,243.27867940783585L616.0256525652566,245.71099535627584L613.3469846984699,246.15508476667708L609.7178217821782,245.46392634579416L608.508100810081,246.6967600079055L609.3721872187218,249.2413408244666L610.1498649864986,251.1811738659054L612.1372637263727,252.5783346615425L610.0634563456346,254.20679819344048L610.1498649864986,256.2045576993334L607.8168316831683,259.032901761816L606.2614761476148,261.8324802911767L603.7556255625562,264.65071557781954L600.9905490549055,264.46674951414343L598.3118811881188,267.30548177300454L599.8672367236724,268.488007017713L600.2128712871287,270.5691593292017L601.50900090009,271.91908125416774L602.0274527452746,274.20112798713313L596.7565256525653,274.15653341637864L595.1147614761477,275.93571984004893L593.3865886588659,275.26962168171605L592.6089108910892,273.3528053817492L590.7943294329433,271.3348142788504L586.3874887488748,271.8741752755511L582.499099909991,271.91908125416774L579.1291629162916,272.2781047007171L579.9932493249325,269.1681703670599L583.4495949594959,267.8063392507885L583.2767776777678,266.57548180208425L582.1534653465346,266.11833135759406L582.0670567056707,263.7297254770336L579.7340234023402,262.5280505691161L578.7835283528353,260.85580841222225L577.5738073807381,259.4078088178081L581.6350135013502,260.8092157167879L584.0544554455446,260.4361951907736L585.43699369937,260.76261528789513L585.9554455445544,260.1561029416788L587.5972097209722,260.3895326549146L590.7079207920792,259.2672783679322L590.7943294329433,256.91442165476747L592.1768676867687,255.30267816270882L593.9050405040504,255.30267816270882L594.1642664266427,254.5408105776118L596.0652565256526,254.15904735492995L596.9293429342935,254.39771451509282L597.8798379837983,253.63321112749537L597.7070207020702,251.90479583691797L598.7439243924393,250.21312539240745L600.2992799279928,249.4846406613292L599.3487848784878,247.58055349839282L601.595409540954,247.67855645877006L602.2866786678668,246.59836320713907L602.2002700270027,245.51336037361273L603.4099909990999,244.2744511763563L603.0643564356435,242.7792215120154L602.545904590459,241.52592092589464L603.9284428442844,240.2658568848806L606.5207020702071,239.60790335623693L609.2857785778579,239.2528400502007L610.495499549955,238.6937697952079Z"
                        className="datamaps-subunit PAK"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M244.55490549054906,317.11057795960267L243.7772277227723,316.41420879772693L243.2587758775878,315.1021310323409L243.8636363636364,314.4454415620307L243.2587758775878,314.28119884215266L242.82673267326734,313.45955116353656L241.61701170117016,312.8016977233973L240.5801080108011,312.9662066535948L240.06165616561657,313.7882980097083L239.11116111611162,314.4043835520165L238.59270927092712,314.48649779830373L238.33348334833485,315.0200691583979L239.45679567956796,316.3322530553405L238.85193519351938,316.6190703014121L238.50630063006304,316.9877219822506L237.3829882988299,317.11057795960267L236.95094509450948,315.67637384326156L236.60531053105314,316.08634724580537L235.82763276327637,315.9223775911002L235.39558955895595,314.9380003984413L234.3586858685869,314.814884282012L233.75382538253825,314.52755226457225L232.71692169216925,314.52755226457225L232.63051305130514,315.0611009542583L232.3712871287129,314.69175250429987L232.54410441044107,314.19906676500244L232.71692169216925,313.70612237498625L232.63051305130514,313.25402393782616L232.9761476147615,312.9662066535948L232.457695769577,312.59601824536446L232.457695769577,311.64925978626377L233.4081908190819,311.40210459677746L234.2722772277228,312.3079852758184L234.18586858685867,312.8016977233973L235.13636363636368,312.9250822936531L235.39558955895595,312.71943173017917L236.0868586858686,313.29513313282695L237.21017101710171,313.1306850430892L238.24707470747077,312.51373288147823L239.71602160216023,312.01985581687654L240.49369936993702,311.31970315369324L241.8762376237624,311.44330223758607L241.7898289828983,311.6904451915064L243.08595859585964,311.7728099278592L244.12286228622864,312.1845131126366L244.9869486948695,312.9250822936531L245.85103510351038,313.58284510502307L245.5918091809181,313.95262730555527L246.11026102610262,315.38929379391766L245.67821782178217,316.08634724580537L244.9005400540054,315.9223775911002Z"
                        className="datamaps-subunit PAN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M264.515301530153,377.3502437769836L263.8240324032404,378.6305125963344L262.61431143114316,379.27203110814435L260.19486948694873,377.86191374906775L260.0220522052206,376.79658256408214L255.2695769576958,374.29201776653844L250.94914491449146,371.5475170638613L249.04815481548158,370.0337312614373L248.09765976597663,367.98001716455263L248.443294329433,367.26923457576413L246.45589558955896,364.0602682595048L244.03645364536456,359.5442698679931L241.7898289828983,354.6851997377533L240.8393339333934,353.5771037786453L240.06165616561657,351.8148692060419L238.24707470747077,350.2190160617719L236.51890189018903,349.2380139186111L237.2965796579658,348.1761035816288L236.0868586858686,345.8508266975219L236.86453645364537,344.18030041350937L238.76552655265527,342.67398470666706L239.02475247524754,343.6509312004201L238.33348334833485,344.22102696627206L238.41989198919893,345.1172332507714L239.45679567956796,344.9135117745364L240.40729072907294,345.1987283393365L241.44419441944197,346.3808438215802L242.74032403240327,345.40248255788885L243.2587758775878,343.7730810008654L244.72772277227725,341.69745100156763L247.57920792079207,340.76194783229107L250.1714671467147,338.24148086097426L250.94914491449146,336.6567259930748L250.6035103510351,334.82850797509315L251.20837083708375,334.6253823222288L252.85013501350136,335.7629025462649L253.62781278127812,336.90051037606514L254.7511251125113,337.510006253589L256.1336633663367,340.03001962596784L257.94824482448246,340.31463856945703L259.24437443744375,339.7047698440631L260.10846084608465,340.1113368472148L261.5774077407741,339.90804742042275L263.3919891989199,341.00596238971406L261.83663366336634,343.4880760192477L262.5279027902791,343.52878862321484L263.73762376237624,344.7912898844294L261.5774077407741,344.70981314592694L261.2317731773178,345.07648710612983L259.33078307830783,345.52474654538446L256.5657065706571,347.1558037088216L256.3928892889289,348.29858897769503L255.78802880288032,349.1154422455509L256.04725472547256,350.42349027695195L254.5783078307831,351.1189678679645L254.5783078307831,352.1425039673459L253.97344734473447,352.5931649999934L254.92394239423945,354.7673318918452L256.22007200720077,356.24696836668306L255.78802880288032,357.27595596704026L257.3433843384339,357.44070995639504L258.2938793879388,358.71867932438465L260.3676867686769,358.8011990033918L262.3550855085509,357.3583288944243L262.1822682268227,361.0739934821398L263.3055805580558,361.36376108198704L264.6017101710171,360.9084644246293L266.6755175517552,364.89217508756894L266.1570657065707,365.72517855342534L266.07065706570654,367.4363995413364L265.98424842484246,369.5300796295362L265.1201620162017,370.7900865924981L265.55220522052207,371.7159834186058L264.9473447344735,372.5591392421723L265.98424842484246,374.63085082059115Z"
                        className="datamaps-subunit PER"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M734.8375337533753,314.19906676500244L735.0103510351034,315.8403829402719L735.1831683168316,317.1924742761119L734.4054905490549,319.4014653202552L733.45499549955,316.9467669076843L732.3316831683169,318.1747626793895L733.1093609360937,319.93265980233406L732.4180918091809,321.0760470384269L729.6530153015302,319.6466593834466L728.9617461746175,317.92927014874334L729.6530153015302,316.78293110040386L728.1840684068407,315.63536742332326L727.4063906390638,316.6190703014121L726.2830783078308,316.5371304561167L724.4684968496849,317.8883496425833L724.1228622862286,317.1924742761119L725.0733573357336,315.1431593963704L726.542304230423,314.4454415620307L727.8384338433843,313.54174898192446L728.7025202520251,314.6507050807019L730.5171017101711,313.95262730555527L730.9491449144914,312.8839560211516L732.590909090909,312.84282783232254L732.504500450045,310.9487942425807L734.4054905490549,312.1021884409193L734.6647164716471,313.3362404491395ZM729.0481548154817,309.669903202726L728.1840684068407,310.49523046289517L727.4063906390638,312.01985581687654L726.7151215121512,312.71943173017917L725.2461746174617,311.0724492589267L725.6782178217823,310.4127366969683L726.2830783078308,309.71119033425214L726.542304230423,308.2234319145327L727.9248424842483,308.05794087805197L727.492799279928,309.71119033425214L729.3073807380738,307.35417906621785ZM715.9140414041403,312.01985581687654L712.7169216921691,314.32226219581594L713.9266426642664,312.63715801133077L715.6548154815481,311.11366342665417L717.0373537353735,309.42213380584747L718.3334833483349,307.0227552319735L718.7655265526553,309.0090055142047L717.2101710171016,310.3714865998627ZM724.0364536453644,305.7369820579214L725.4189918991899,306.4838546881883L726.9743474347434,306.4838546881883L726.9743474347434,307.51983254486714L725.8510351035104,308.5543015279961L724.2956795679568,309.29821897230147L724.2092709270926,308.14069110794924L724.382088208821,306.8984307955782ZM732.6773177317732,305.07239348867597L733.3685868586858,307.8096333379568L731.5540054005401,307.14705751964664L731.5540054005401,307.9751811937975L732.1588658865887,309.5047325080895L731.0355535553556,310.04140817869467L730.9491449144914,308.30616332882846L730.1714671467148,308.18206268721565L729.8258325832584,306.69117389537394L731.2083708370837,306.8984307955782L731.2083708370837,305.98603144405376L729.7394239423943,304.1158565347247L732.0724572457245,304.157474859422ZM723.1723672367237,302.82431082933863L722.5675067506751,304.9477082107094L721.530603060306,303.7411679466829L720.2344734473447,301.8642966481263L722.3082808280827,301.9478374868877ZM722.653915391539,289.2662035885282L724.1228622862286,289.9938958172963L724.9005400540054,289.3518775637039L725.0733573357336,289.9938958172963L724.7277227722773,291.0191846096612L725.5054005400541,292.8503651220789L724.9005400540054,294.9283781529434L723.5180018001801,295.7317549230623L723.0859585958596,297.7556734404679L723.6908190819082,299.72992149737917L724.9005400540054,300.023349957816L726.0238523852386,299.72992149737917L728.9617461746175,301.07006455947453L728.7889288928893,302.4071022703175L729.5666066606661,303.0328075365083L729.3073807380738,304.157474859422L727.4063906390638,302.9494174069906L726.542304230423,301.65539276792L725.9374437443745,302.57402029468625L724.382088208821,301.07006455947453L722.2218721872188,301.4464145047085L721.0121512151215,300.9027192505624L721.0985598559855,299.8556954536953L721.8762376237623,299.2265397858414L721.1849684968497,298.6806871207075L720.8393339333934,299.56217857239585L719.6296129612962,298.13428216180716L719.2839783978399,297.03977853785193L719.1975697569757,294.67440817991553L720.1480648064806,295.4781973947013L720.4072907290729,291.57357105284063L721.1849684968497,289.2662035885282Z"
                        className="datamaps-subunit PHL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M805.606210621062,350.8734577324437L804.9149414941494,351.1189678679645L803.8780378037803,350.2190160617719L802.8411341134114,348.66611111433036L802.3226822682268,346.82945729680193L802.6683168316832,346.5847430934354L802.9275427542755,347.31900349638806L803.6188118811881,347.8495285282108L804.8285328532852,349.40146100175184L805.9518451845186,350.2190160617719ZM796.2740774077407,347.645457393842L794.9779477947794,347.8495285282108L794.6323132313231,348.5435926458327L793.3361836183617,349.1154422455509L792.0400540054005,349.6875440638541L790.8303330333033,349.6875440638541L788.8429342934294,348.9520313466098L787.4603960396039,348.29858897769503L787.633213321332,347.5638370566932L789.7934293429344,347.89034626265635L791.0895589558957,347.72708235453445L791.521602160216,346.5439611300462L791.8672367236724,346.50318022478L792.0400540054005,347.76789657777937L793.4225922592259,347.6046466491383L794.1138613861385,346.7886689087523L795.4963996399639,345.9323566308901L795.1507650765076,344.5061369154412L796.6197119711971,344.4654043175801L797.1381638163816,344.8320296065553L797.0517551755175,346.1769706414784ZM770.0058505850584,356.4526674236639L769.9194419441944,348.58443089466124L769.9194419441944,340.7212806810403L774.0670567056704,342.389121934674L778.473897389739,343.7730810008654L780.1156615661566,344.9949975981349L781.4981998199819,346.2177432118308L781.8438343834384,347.6046466491383L785.8186318631863,349.1154422455509L786.423492349235,350.38259264093006L784.2632763276328,350.66890570171904L784.7817281728172,352.2653926143499L786.9419441944194,353.8642667957847L788.497299729973,356.4115237266523L789.7934293429344,356.3292421686004L789.7070207020702,357.44070995639504L791.6080108010801,357.8527383486462L790.8303330333033,358.30620988251184L793.4225922592259,359.33778957672126L793.1633663366335,360.0400515716279L791.6080108010801,360.20538484712523L791.0031503150315,359.5442698679931L788.9293429342933,359.29650018464514L786.5099009900991,358.9249947845354L784.6089108910891,357.3583288944243L783.2263726372637,356.04131759695287L782.0166516651666,353.9052969106959L778.9059405940594,352.83906134535073L776.8321332133213,353.5360872725712L775.363186318632,354.3567423733116L775.7088208820883,356.1235721405432L773.8078307830783,356.9465449964085L772.4252925292529,356.5761102319515ZM799.0391539153916,345.2802271842749L798.2614761476148,345.9323566308901L797.8294329432943,344.5061369154412L797.3109810981098,343.56950201900963L796.1876687668768,342.79607942975315L794.8051305130513,341.7788142502916L793.0769576957696,341.04663345754466L793.7682268226822,340.4772890991126L795.0643564356436,341.16865011793976L795.8420342034204,341.69745100156763L796.8789378937894,342.26704833502424L797.8294329432943,343.28452475139426L798.7799279927993,344.0581258361918Z"
                        className="datamaps-subunit PNG"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M272.46489648964894,289.2662035885282L273.67461746174615,289.4803568271549L274.10666066606666,289.9938958172963L273.501800180018,290.63497812212995L271.6872187218722,290.59226811334406L270.2182718271827,290.6776840390847L270.13186318631864,289.6087981611001L270.477497749775,289.22336024735495Z"
                        className="datamaps-subunit PRI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M745.0337533753376,221.9386479659898L745.3793879387939,222.4879892969014L744.428892889289,222.3233419182442L743.3919891989199,223.4185006260058L742.7007200720072,224.5078611125041L742.7871287128712,226.7770816574697L741.577407740774,227.47450434078058L741.1453645364537,228.06283573613533L740.1948694869486,228.96887525914525L738.6395139513951,229.50004404334697L737.6026102610261,230.347180925312L737.5162016201621,231.6641940980943L737.2569756975697,232.03152660871427L738.2074707470748,232.50290179491725L739.503600360036,233.85897237062568L739.1579657965797,234.63753563108133L738.2074707470748,234.8446906200661L736.4792979297929,234.9481956145293L735.5288028802879,236.3408258707995L734.491899189919,236.23796512770764L734.3190819081908,236.49502861550656L733.1957695769577,235.92909924288492L732.8501350135014,236.49502861550656L732.1588658865887,236.75179819493886L732.0724572457245,236.18651705248953L731.4675967596759,235.92909924288492L730.7763276327632,235.41337247211146L731.4675967596759,234.06685777108623L732.0724572457245,233.7029295093189L731.8132313231322,233.12982295062488L732.4180918091809,231.50657539079555L732.2452745274527,230.98034958636924L730.8627362736274,230.61122735433526L729.7394239423943,229.8181128008698L731.7268226822682,227.79561530898147L734.3190819081908,226.07733590986854L735.9608460846084,223.80043124984667L737.0841584158416,224.8335534132432L739.1579657965797,224.9420039813054L738.8123312331232,223.25459889450934L742.527902790279,221.82860207418366L743.4783978397841,220.0041849451904Z"
                        className="datamaps-subunit PRK"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M409.85463546354634,223.58227190117566L410.71872187218725,222.76210758741297L411.66921692169217,222.3233419182442L412.27407740774083,223.90942442532793L413.65661566156615,223.90942442532793L414.0886588658866,223.47310552959894L415.471197119712,223.58227190117566L416.1624662466247,225.21288297000444L415.0391539153915,226.07733590986854L415.0391539153915,228.5429849993089L414.60711071107113,229.0220516875774L414.52070207020705,230.45283837555564L413.483798379838,230.7167553369713L414.4342934293429,232.60751359149975L413.82943294329436,234.63753563108133L414.60711071107113,235.5166132288013L414.26147614761476,236.3408258707995L413.3973897389739,237.46919987621135L413.57020702070207,238.49013197897327L412.61971197119715,239.2528400502007L411.40999099909993,238.84637905249122L410.11386138613864,239.15129240639573L410.54590459045903,236.80311695018457L410.2866786678668,234.9481956145293L409.2497749774978,234.63753563108133L408.6449144914492,233.49470008194294L408.81773177317734,231.45401034448065L409.76822682268227,230.347180925312L409.9410441044105,229.07521485271707L410.45949594959495,227.15290397489412L410.3730873087309,225.80757888761468L409.9410441044105,224.67077121596074Z"
                        className="datamaps-subunit PRT"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M281.0193519351935,389.2800971845194L281.9698469846985,386.17672105100155L282.0562556255626,384.7862794089101L283.1795679567957,382.5372097330533L287.4135913591359,381.8046346548857L289.6602160216022,381.8476913675458L291.82043204320433,383.14149192499474L291.9068406840684,383.91975583539465L292.5981098109811,385.3505453906298L292.42529252925294,388.88526893994526L295.01755175517553,389.36789502315446L295.9680468046805,388.84142550056L297.6098109810981,389.5435545294515L298.0418541854186,390.3350836221725L298.21467146714673,392.72034676060156L298.5603060306031,393.74130268419754L299.42439243924395,393.83022643376495L300.37488748874887,393.43025313311716L301.23897389738977,393.9191735734901L301.1525652565257,395.34554442321894L300.8933393339334,396.91271882863924L300.37488748874887,398.44242185830615L300.02925292529255,400.79640868992067L297.86903690369036,402.8481677898551L295.9680468046805,403.3060197377872L293.2029702970297,402.89392138305607L290.78352835283533,402.16270046974626L293.2029702970297,398.08183207099023L292.85733573357334,396.91271882863924L290.3514851485149,395.88201669840856L287.4135913591359,393.9191735734901L285.42619261926194,393.5190953580064Z"
                        className="datamaps-subunit PRY"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M553.465796579658,273.129200134502L553.2929792979298,271.1998322169732L553.8978397839784,269.801649753812L554.5891089108911,269.5303159009955L555.2803780378038,270.34361500919874L555.3667866786678,271.91908125416774L554.8483348334834,273.4868956846177L554.1570657065706,273.66559807920237Z"
                        className="datamaps-subunit QAT"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M485.98064806480653,203.2581520600709L487.01755175517553,202.46905960311594L488.486498649865,202.8943735453394L490.0418541854186,202.8943735453394L491.16516651665165,203.74208256703542L492.02925292529255,203.19757188673648L493.7574257425743,202.8943735453394L494.3622862286229,202.04276429907836L495.3991899189919,202.04276429907836L496.0904590459046,202.40822050536664L496.8681368136814,203.4397739184806L497.6458145814582,204.94642857834404L499.02835283528356,207.0355535251789L499.11476147614763,208.57261830935175L498.85553555355534,210.03892784016455L499.2875787578758,211.61002336414242L500.3244824482448,212.24644166550814L501.447794779478,211.72589193302372L502.57110711071107,212.30419408285155L502.57110711071107,213.16842104754699L501.447794779478,213.91432114098706L500.6701170117012,213.57041454175823L500.06525652565256,217.60185124960697L498.5963096309631,217.26433301556375L496.8681368136814,216.0784748062713L494.01665166516653,216.81341445486936L492.89333933393345,217.7142301725887L489.3505850585059,217.48940882322177L487.53600360036006,216.98262906523132L486.5855085508551,217.26433301556375L485.89423942394245,215.85178828224014L485.462196219622,215.28392804570342L485.98064806480653,214.7144220805843L485.3757875787579,214.314780902415L484.6845184518452,215.0563239593227L483.2155715571557,214.08604731266695L483.04275427542757,212.65034724998924L481.5738073807381,211.84169095745563L481.3145814581459,210.79698567997087L480.01845184518453,209.39514043065594L481.91944194419443,208.74917261344615L483.3883888388839,206.3814721168209L484.511701170117,203.98357578483464Z"
                        className="datamaps-subunit ROU"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M504.472097209721,337.22556817233885L505.42259225922595,338.56661359107375L505.3361836183619,339.9893617441696L504.6449144914492,340.27397722000717L503.34878487848783,340.1113368472148L502.65751575157515,341.49405385738396L501.1885688568857,341.29067203858693L501.3613861386139,339.9893617441696L501.70702070207017,339.7860794810307L501.79342934293425,338.36340307534385L502.484698469847,337.7131841698428L503.0895589558956,337.95700701636036Z"
                        className="datamaps-subunit RWA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M410.71872187218725,265.38543209892214L410.71872187218725,265.56882629053024L410.63231323132317,266.07257791469544L410.63231323132317,270.1630635568817L402.76912691269126,269.98240859552766L402.85553555355534,276.77758908341997L400.60891089108907,276.9987931885593L400.0040504050405,278.32308901665897L400.4360936093609,282.09262087340875L391.1039603960396,282.0490089964143L390.5855085508551,282.9202968267899L390.6719171917192,281.83087401462006L396.11566156615663,281.6126125818517L396.37488748874887,280.69451961874006L397.4117911791179,279.510745635121L398.1894689468947,275.93571984004893L401.47299729973,273.08446082368596L402.5963096309631,269.7564437684735L403.37398739873987,269.5303159009955L404.15166516651664,267.4421610307784L406.1390639063907,267.1687409394708L407.0031503150315,267.53324640756443L408.1264626462646,267.53324640756443L408.9041404140414,266.8950738927365L410.3730873087309,266.8037964389212L410.3730873087309,265.38543209892214Z"
                        className="datamaps-subunit ESH"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M534.1966696669667,294.7167456633066L533.8510351035104,293.6147664269167L533.1597659765977,292.8928644332396L532.9869486948695,291.8718066890269L531.6908190819082,290.9765112651398L530.3946894689469,288.83757874445075L529.7898289828984,286.7741358168229L528.0616561656166,285.0466902746833L527.0247524752475,284.6136667290999L525.469396939694,282.1798295477855L525.1237623762377,280.3879824657816L525.2965796579658,278.8514222108283L523.9140414041404,275.93571984004893L522.7907290729073,274.91383401931057L521.494599459946,274.3794467057347L520.6305130513051,272.86067265659494L520.8033303330333,272.2781047007171L520.1120612061206,270.8846520112987L519.4207920792079,270.2984868298198L518.470297029703,268.3063768721625L517.0013501350135,266.11833135759406L515.7916291629163,264.2826678754727L514.5819081908191,264.2826678754727L515.0139513951394,262.75953169068833L515.1003600360036,261.8324802911767L515.3595859585959,260.71600711890767L518.0382538253825,261.1817412999035L519.0751575157516,260.29618419645794L519.6800180018002,259.31412979712314L521.494599459946,258.93909524428454L521.9266426642664,257.9992604549728L522.7043204320432,257.5281254908747L520.2848784878488,254.73148413152495L525.1237623762377,253.29803434862254L525.5558055805581,252.9144439529478L528.493699369937,253.6810582685901L532.0364536453645,255.6353057624882L538.7763276327632,261.22827236602114L543.2695769576958,261.41431995696695L545.429792979298,261.6931620463284L546.0346534653465,262.9908263404219L547.6764176417641,262.9445822895875L548.6269126912691,265.29369243633386L549.8366336633663,265.8894940211824L550.2686768676867,266.84943861696024L551.8240324032403,267.9882655535586L551.9968496849685,269.0775681241523L551.7376237623762,269.98240859552766L552.0832583258326,270.8846520112987L552.7745274527454,271.6046079201593L553.1201620162017,272.50229264272616L553.465796579658,273.129200134502L554.1570657065706,273.66559807920237L554.8483348334834,273.4868956846177L555.2803780378038,274.468570403091L555.3667866786678,275.09177467328874L556.3172817281728,277.7498396732203L563.489198919892,279.02735993806823L564.0076507650765,278.4992870815444L565.1309630963096,280.3441705889919L563.489198919892,285.47924418314324L556.3172817281728,288.0220077249087L549.404590459046,289.0090798224342L547.1579657965797,290.1221866637753L545.429792979298,292.765354915702L544.3064806480648,293.19025190486883L543.7016201620162,292.3400710543493L542.7511251125113,292.46769709718876L540.418091809181,292.21240979499476L539.9860486048605,291.99956244508917L537.2209720972097,292.04213979423076L536.6161116111612,292.25496746844954L535.5792079207921,291.616188087176L534.9743474347434,292.8503651220789L535.2335733573358,293.9117013741304Z"
                        className="datamaps-subunit SAU"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M513.0265526552655,311.64925978626377L512.6809180918092,311.60807235125156L512.6809180918092,310.4127366969683L512.421692169217,309.5873222967985L511.21197119711974,308.59564976213903L510.86633663366337,306.8569843765939L511.21197119711974,305.0308343806119L510.0886588658866,304.86457140932856L509.91584158415844,305.40477143100486L508.446894689469,305.5293699146505L509.0517551755176,306.23498870420616L509.22457245724576,307.7268451041974L507.9284428442844,309.0503285154481L506.71872187218725,310.82512037648434L505.50900090009003,311.0724492589267L503.521602160216,309.669903202726L502.57110711071107,310.16520381993905L502.31188118811883,310.86634709928506L501.1021602160216,311.31970315369324L501.01575157515754,311.8139892665556L498.5963096309631,311.8139892665556L498.33708370837087,311.31970315369324L496.60891089108907,311.2372934699761L495.7448244824482,311.64925978626377L495.05355535553554,311.44330223758607L493.8438343834384,310.04140817869467L493.4117911791179,309.3395261593049L491.6836183618362,309.71119033425214L490.9923492349235,310.82512037648434L490.3874887488749,313.0073291047436L489.52340234023404,313.45955116353656L488.8321332133213,313.70612237498625L488.65931593159314,313.62393937573074L487.7952295229523,312.8839560211516L487.62241224122414,312.1433517689263L488.05445544554453,311.15487551520073L488.05445544554453,310.1239407782893L486.6719171917192,308.6369956830621L486.4126912691269,307.5612398694367L486.4126912691269,306.9813162193567L485.5486048604861,306.2764726838982L485.462196219622,304.822999011912L485.0301530153015,303.8660889597904L484.16606660666065,304.03261166891684L484.42529252925294,303.11618629915336L485.0301530153015,302.07312665377077L484.77092709270926,301.07006455947453L485.5486048604861,300.3166247949171L485.0301530153015,299.72992149737917L485.63501350135016,298.21838077907717L486.7583258325833,296.36508941117444L488.8321332133213,296.53384501225815L488.7457245724572,286.55860563453746L488.7457245724572,285.47924418314324L491.510801080108,285.47924418314324L491.510801080108,280.3441705889919L501.1885688568857,280.3441705889919L510.434293429343,280.3441705889919L519.9392439243925,280.3441705889919L520.7169216921692,282.87677963901945L520.1984698469847,283.31173006226936L520.544104410441,285.9545167615629L521.494599459946,289.0090798224342L522.3586858685869,289.6087981611001L523.6548154815482,290.54955400821433L522.445094509451,291.99956244508917L520.7169216921692,292.4251589884678L519.9392439243925,293.19025190486883L519.6800180018002,294.8437361252425L518.6431143114312,298.51262176817727L518.9023402340234,299.47828804257557L518.5567056705671,301.6136030822035L517.6062106210621,304.03261166891684L516.1372637263727,305.28014941867906L515.1003600360036,307.14705751964664L514.8411341134113,308.14069110794924L513.7178217821782,308.80235631188236L513.0265526552655,311.3609049034134Z"
                        className="datamaps-subunit SDN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M513.0265526552655,311.64925978626377L513.0265526552655,313.54174898192446L512.6809180918092,314.28119884215266L511.3847884788479,314.3633237645243L510.60711071107113,315.75838170088974L512.0760576057606,315.9223775911002L513.2857785778577,317.11057795960267L513.7178217821782,318.05202292908825L514.7547254725473,318.62469855317346L516.2236723672368,321.23931084607364L514.5819081908191,322.8301931894328L513.1129612961296,324.25657841994723L511.64401440144013,325.3968890386999L509.91584158415844,325.3561748646022L508.0148514851485,325.9261022308678L506.45949594959495,325.3968890386999L505.50900090009003,326.0482100952928L503.34878487848783,324.4602545552579L502.83033303330336,323.44164542049015L501.447794779478,323.93064983238304L500.4108910891089,323.7676634628299L499.71962196219624,324.17510172005484L498.6827182718272,323.889904635921L497.21377137713773,321.8921823072838L496.78172817281734,321.1576812828948L495.05355535553554,320.1777530725302L494.448694869487,318.74737880690753L493.4117911791179,317.68372510101665L491.77002700270026,316.41420879772693L491.77002700270026,315.63536742332326L490.473897389739,314.6507050807019L488.8321332133213,313.70612237498625L489.52340234023404,313.45955116353656L490.3874887488749,313.0073291047436L490.9923492349235,310.82512037648434L491.6836183618362,309.71119033425214L493.4117911791179,309.3395261593049L493.8438343834384,310.04140817869467L495.05355535553554,311.44330223758607L495.7448244824482,311.64925978626377L496.60891089108907,311.2372934699761L498.33708370837087,311.31970315369324L498.5963096309631,311.8139892665556L501.01575157515754,311.8139892665556L501.1021602160216,311.31970315369324L502.31188118811883,310.86634709928506L502.57110711071107,310.16520381993905L503.521602160216,309.669903202726L505.50900090009003,311.0724492589267L506.71872187218725,310.82512037648434L507.9284428442844,309.0503285154481L509.22457245724576,307.7268451041974L509.0517551755176,306.23498870420616L508.446894689469,305.5293699146505L509.91584158415844,305.40477143100486L510.0886588658866,304.86457140932856L511.21197119711974,305.0308343806119L510.86633663366337,306.8569843765939L511.21197119711974,308.59564976213903L512.421692169217,309.5873222967985L512.6809180918092,310.4127366969683L512.6809180918092,311.60807235125156Z"
                        className="datamaps-subunit SSD"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M391.36318631863185,301.5300147685302L390.4126912691269,299.6041190642607L389.20297029702976,298.72269527842633L390.23987398739877,298.2604251146023L391.449594959496,296.53384501225815L391.96804680468045,295.22451062882436L392.8321332133213,294.4203060174445L394.0418541854186,294.63206702460064L395.16516651665165,294.1236851716981L396.547704770477,294.0812958864044L397.6710171017102,294.80140963164126L399.22637263726375,295.4781973947013L400.69531953195326,297.29255951343384L402.2506750675068,299.0166612292211L402.42349234923495,300.5678820268165L402.85553555355534,301.9896034839559L403.8060306030603,302.65746197417343L403.9788478847885,303.61622197243446L403.8924392439244,304.365525560489L403.54680468046803,304.53191725368043L402.2506750675068,304.3239208633018L401.9914491449145,304.61509689869473L401.47299729973,304.6566826847359L399.7448244824482,304.07423547255405L398.62151215121514,304.03261166891684L394.21467146714673,303.9077237692529L393.52340234023404,304.1990904506382L392.7457245724572,304.1158565347247L391.449594959496,304.53191725368043L391.1039603960396,302.65746197417343L393.2641764176418,302.69917849488496L393.8690369036904,302.3653655186822L394.3010801080108,302.3236258607376L395.16516651665165,301.73896321747094L396.2020702070207,302.28188329243534L397.23897389738977,302.3236258607376L398.27587758775877,301.7807439894446L397.7574257425743,301.07006455947453L396.97974797479753,301.48821613242563L396.2884788478848,301.4464145047085L395.33798379837987,300.8608753115152L394.5603060306031,300.9027192505624L394.0418541854186,301.48821613242563Z"
                        className="datamaps-subunit SEN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M820.5549054905491,359.7921200531166L821.2461746174617,360.6188794260568L819.6044104410441,360.6188794260568L818.6539153915392,359.09008634387675L820.1228622862286,359.7094943287935ZM817.530603060306,358.30620988251184L816.580108010801,358.34744721829026L815.1111611161117,358.1000549452375L814.6791179117912,357.7291081718165L814.7655265526552,356.78188752996874L816.4072907290729,357.1524117619077L817.1849684968497,357.64669839950244ZM819.51800180018,357.64669839950244L819.1723672367236,358.1000549452375L817.3577857785779,355.959070703926L816.9257425742574,354.52095686495494L817.7034203420342,354.52095686495494L818.5675067506751,356.4526674236639ZM815.1975697569757,354.5620149130788L815.2839783978399,355.05485120975266L813.3829882988299,354.0283975774783L812.0868586858685,353.1670140682511L811.2227722772277,352.3473262201138L811.568406840684,352.1015442066695L812.6917191719172,352.67512401279623L814.6791179117912,353.7822117046376ZM809.5810081008101,352.1834652863886L809.1489648964896,352.3063586306586L808.0256525652565,351.73297587789966L807.0751575157516,350.75072221082183L807.1615661566157,350.3416964050659L808.6305130513051,351.36453078809257Z"
                        className="datamaps-subunit SLB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M404.06525652565256,318.1747626793895L403.37398739873987,317.97018919609746L401.6458145814582,316.9877219822506L400.4360936093609,315.71737860121266L400.0040504050405,314.814884282012L399.7448244824482,313.04844965086556L400.9545454545455,311.9786865132691L401.3001800180018,311.27849934381504L401.6458145814582,310.74266060951174L402.33708370837087,310.7014275577109L402.85553555355534,310.247723406091L404.8429342934294,310.247723406091L405.447794779478,311.11366342665417L405.96624662466246,312.1433517689263L405.96624662466246,312.84282783232254L406.31188118811883,313.5006510026806L406.31188118811883,314.3633237645243L406.91674167416744,314.24013369979497L405.7934293429343,315.3482756360314L404.7565256525653,316.70100383965064L404.58370837083714,317.397188443135Z"
                        className="datamaps-subunit SLE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M220.79252925292528,302.07312665377077L220.53330333033304,302.65746197417343L219.15076507650767,302.6157425754535L218.2866786678668,302.3653655186822L217.24977497749776,301.8642966481263L215.9536453645365,301.73896321747094L215.26237623762378,301.1955416861159L215.34878487848786,300.8190283195482L216.12646264626466,300.19095429927967L216.64491449144919,299.939528992598L216.472097209721,299.64605637961927L217.0769576957696,299.47828804257557L217.7682268226823,299.68799052261227L218.2866786678668,300.19095429927967L218.9779477947795,300.6097474224203L219.0643564356436,300.9445601407871L220.10126012601262,300.65160974049195L220.61971197119712,300.8190283195482L220.96534653465346,301.07006455947453Z"
                        className="datamaps-subunit SLV"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M546.2074707470747,315.22521099716494L544.1336633663366,315.22521099716494L536.3568856885688,312.34913872016864L535.4063906390639,311.4844978296393L534.542304230423,310.2889799582491L533.6782178217823,308.9676802383657L534.1966696669667,308.0993171728546L535.0607560756076,306.77408410487055L535.8384338433843,307.2299134586849L536.2704770477047,308.2647987937781L537.393789378938,309.2569095376777L538.6035103510351,309.29821897230147L540.8501350135014,308.6369956830621L543.442394239424,308.34752552355957L545.6026102610261,307.602644783761L546.7259225922593,307.4370106494108L547.5900090009001,306.9813162193567L548.9725472547254,306.8984307955782L548.9725472547254,306.9398747418618L548.9725472547254,307.9751811937975L548.9725472547254,310.4127366969683L548.9725472547254,311.6904451915064L547.8492349234923,313.1717998967187Z"
                        className="datamaps-subunit -99"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M531.3451845184519,338.5259707888353L529.8762376237623,336.5348364114826L529.8762376237623,327.7977400662675L531.9500450045005,325.07115307536833L532.6413141314131,324.29731542432523L534.1102610261025,324.25657841994723L536.2704770477047,322.58554859758885L539.3811881188119,322.4632122619344L546.2074707470747,315.22521099716494L547.8492349234923,313.1717998967187L548.9725472547254,311.6904451915064L548.9725472547254,310.4127366969683L548.9725472547254,307.9751811937975L548.9725472547254,306.9398747418618L548.9725472547254,306.8984307955782L549.7502250225023,306.8569843765939L550.8735373537354,306.4838546881883L552.0832583258326,306.23498870420616L553.2929792979298,305.40477143100486L554.1570657065706,305.40477143100486L554.2434743474348,306.06902739166077L553.9842484248425,307.51983254486714L553.9842484248425,308.80235631188236L553.465796579658,309.669903202726L552.8609360936093,312.3079852758184L551.6512151215121,315.0200691583979L550.1822682268227,318.09293762207335L548.1084608460847,321.64738945848205L546.1210621062106,324.33805153645113L543.2695769576958,327.63504303726614L540.8501350135014,329.5868404459358L537.2209720972097,331.9439839331172L535.0607560756076,333.7722528158941L532.3820882088208,336.6973562284308L531.8636363636364,337.95700701636036Z"
                        className="datamaps-subunit SOM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M485.89423942394245,215.85178828224014L485.28937893789384,216.64405520072734L485.462196219622,217.826545703045L486.6719171917192,219.2809289100042L485.72142214221424,220.28167058639386L485.3757875787579,221.3326584153413L485.63501350135016,221.7184967350675L485.20297029702976,222.15856181760955L484.07965796579657,222.21350328590796L483.3019801980198,222.43312156305626L483.2155715571557,222.15856181760955L483.47479747974796,221.77355684195598L483.73402340234026,221.00135588701113L483.3883888388839,221.00135588701113L482.9563456345635,220.39255816674108L482.52430243024304,220.28167058639386L482.2650765076508,219.72631699325888L481.83303330333035,219.50374625079763L481.48739873987404,219.05786411197755L481.05535553555353,219.22518594324208L480.7097209720972,220.33712198308336L480.1048604860486,220.55877557126573L480.27767776777677,220.28167058639386L479.4135913591359,219.6150623932769L478.63591359135916,219.2809289100042L478.29027902790284,218.77868381346823L477.59900990099015,218.21915243888168L478.20387038703876,218.10705791243697L478.5495049504951,216.53106848566486L477.3397839783978,215.227051746106L477.94464446444647,213.74244368469778L477.08055805580557,213.74244368469778L478.03105310531055,212.4773480040127L477.2533753375337,211.49408512672883L476.6485148514851,210.1557475159096L478.5495049504951,209.27785454764384L480.01845184518453,209.39514043065594L481.3145814581459,210.79698567997087L481.5738073807381,211.84169095745563L483.04275427542757,212.65034724998924L483.2155715571557,214.08604731266695L484.6845184518452,215.0563239593227L485.3757875787579,214.314780902415L485.98064806480653,214.7144220805843L485.462196219622,215.28392804570342Z"
                        className="datamaps-subunit SRB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M294.32628262826285,320.1369073593779L297.2641764176418,320.58614163768095L297.43699369936996,320.1777530725302L299.42439243924395,320.014362637984L302.01665166516653,320.626973717632L300.72052205220524,322.7078755409154L300.9797479747975,324.37878675991925L301.8438343834384,325.8039876275651L301.498199819982,326.8214096440656L301.23897389738977,327.91975668937704L300.6341134113411,328.9363702370143L299.2515751575158,328.40777251173984L298.12826282628265,328.6517513682111L297.17776777677767,328.44843696100673L296.91854185418543,329.13965481918393L297.3505850585059,329.6274910474851L297.0913591359136,330.11526620139097L295.79522952295235,329.9120335819811L294.32628262826285,327.838412853611L294.06705670567055,326.4958828383475L293.2893789378938,326.45518888114617L292.16606660666065,324.74536437442055L292.5981098109811,323.4824010253562L292.511701170117,322.9117331728024L293.9806480648065,322.3000823688197Z"
                        className="datamaps-subunit SUR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M464.63771377137715,208.1010027002984L466.62511251125113,208.33695701839747L467.83483348334835,207.56902860609387L469.90864086408646,207.5098279435517L470.42709270927094,206.91679843593926L470.7727272727273,206.91679843593926L471.29117911791184,208.1010027002984L469.3037803780378,209.04306602586445L469.13096309630964,210.4474852967532L468.2668766876688,210.79698567997087L468.2668766876688,211.72589193302372L467.3163816381638,211.66796634938794L466.53870387038705,211.14585115837173L466.10666066606666,211.66796634938794L464.3784878487849,211.55206296176797L464.98334833483347,211.2619991486097L464.3784878487849,209.80507424850086Z"
                        className="datamaps-subunit SVN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M508.446894689469,401.11466255778134L508.0148514851485,402.29966892359204L506.54590459045903,402.57379301703475L505.1633663366337,401.11466255778134L505.1633663366337,400.2062388849163L505.76822682268227,399.21004377420496L506.02745274527456,398.44242185830615L506.71872187218725,398.2170052544007L507.9284428442844,398.7131338120501L508.27407740774083,399.93423270678966Z"
                        className="datamaps-subunit SWZ"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M524.6053105310531,249.43599964205254L519.9392439243925,252.48222287613595L517.2605760576057,251.3260627536166L517.1741674167416,251.3260627536166L517.519801980198,250.89114789662545L517.433393339334,249.7277040432548L518.0382538253825,248.11908781302827L519.3343834383438,247.04083675664495L518.9887488748875,245.90846893828586L517.8654365436544,245.7603788620154L517.6926192619262,243.52801371140873L518.2974797479749,242.27870387436013L518.9023402340234,241.6264319960627L519.507200720072,240.97233438432102L519.6800180018002,239.30359701310263L520.457695769577,239.9118075582141L523.1363636363636,239.04969974248854L524.3460846084608,239.65858192851942L526.3334833483348,239.60790335623693L529.0985598559856,238.49013197897327L530.3946894689469,238.541058476529L533.1597659765977,238.08230958149008L531.9500450045005,239.96241930304438L530.5675067506751,240.720268022137L530.8267326732673,242.87919758724533L529.8762376237623,246.40145029650307Z"
                        className="datamaps-subunit SYR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M435.95004500450045,319.728380259031L434.04905490549055,320.218597528098L433.530603060306,319.3605950202363L432.83933393339333,317.8474276739415L432.6665166516652,316.660037857065L433.1849684968497,314.4454415620307L432.5801080108011,313.58284510502307L432.40729072907294,311.64925978626377L432.40729072907294,309.8763168070371L431.37038703870394,308.6369956830621L431.5432043204321,307.89241202412506L433.6170117011701,307.93379779658045L433.35778577857786,309.2155978515829L434.04905490549055,309.917592931093L434.9131413141314,310.7838915478312L434.9995499549955,311.9786865132691L435.51800180018006,312.472587276008L435.3451845184519,318.05202292908825Z"
                        className="datamaps-subunit TGO"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M677.7214221422142,305.0308343806119L675.561206120612,303.8660889597904L673.4873987398739,303.9493558212628L673.8330333033302,301.9896034839559L671.7592259225923,301.9896034839559L671.5864086408642,304.6982657851031L670.2902790279028,308.30616332882846L669.426192619262,310.45398465003825L669.5990099009902,312.22567247583373L671.1543654365437,312.3079852758184L672.1912691269127,314.48649779830373L672.6233123312331,316.6190703014121L673.9194419441944,317.97018919609746L675.3883888388839,318.256581989648L676.5981098109811,319.5240682735643L675.8204320432044,320.5044738105789L674.2650765076507,320.7902898982864L674.0922592259226,319.5649332879261L672.1048604860487,318.5020057317099L671.6728172817282,318.951818236836L670.7223222322232,318.0111067883209L670.3766876687669,316.82389238596147L669.0805580558057,315.4303102638022L667.8708370837085,314.28119884215266L667.5252025202522,315.71737860121266L667.0931593159316,314.3633237645243L667.3523852385238,312.84282783232254L668.0436543654366,310.53647413936085L669.1669666966696,308.0165622196603L670.549504950495,305.7369820579214L669.5990099009902,303.4912509288797L669.5990099009902,302.3653655186822L669.3397839783978,300.9863979862847L667.6980198019803,299.0166612292211L667.1795679567956,297.7556734404679L667.9572457245724,297.29255951343384L668.9077407740774,295.13991949345274L667.8708370837085,293.4874519679961L666.4018901890188,291.6588011329222L665.1921692169217,289.437534626484L666.2290729072906,288.96621096154576L667.2659765976598,286.21352154213275L668.9941494149415,286.1272049366049L670.3766876687669,285.0034091329505L671.7592259225923,284.3969773406244L672.7961296129613,285.1765055409517L672.9689468946896,286.7310388119086L674.6107110711071,286.86031631227974L674.0058505850584,289.5231748134375L674.0058505850584,291.7866163832672L676.5981098109811,290.29318310125205L677.2893789378937,290.720385868719L678.6719171917191,290.63497812212995L679.1903690369037,289.77999448452834L681.0049504950495,289.9511238883894L682.8195319531953,291.99956244508917L682.9923492349235,294.4626655974121L684.8933393339333,296.66037512687933L684.8069306930693,298.7647001723307L684.0292529252926,299.8556954536953L681.7826282628263,299.52023489988204L678.6719171917191,299.9814410448529L677.1165616561656,302.0313665382305Z"
                        className="datamaps-subunit THA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M601.9410441044105,228.8092662814073L601.0769576957696,229.7651341451784L598.484698469847,229.2346248808514L598.2254725472548,231.0330298307764L600.8177317731772,230.82223168575644L603.7556255625562,231.82169838365655L608.3352835283529,231.34884197139766L608.9401440144015,234.2226433713703L609.7178217821782,233.91096210165557L611.1867686768677,234.5857166161699L611.1003600360036,235.77450625231603L611.4459945994599,237.52035575870585L608.9401440144015,237.52035575870585L607.2983798379838,237.26446054443414L605.8294329432944,238.64287737513382L604.7925292529253,238.948061983043L603.9284428442844,239.55721361339045L602.9779477947795,238.59197360541032L603.2371737173717,236.03210189316206L602.459495949595,235.87758012468234L602.7187218721872,234.9481956145293L601.4225922592259,234.27454749297607L600.385688568857,235.31008385367886L600.1264626462646,236.54640600461357L599.7808280828083,237.00827509630642L598.3118811881188,236.957003071408L597.534203420342,238.33728417896813L596.7565256525653,237.72486377772208L595.0283528352836,238.6937697952079L594.2506750675068,238.33728417896813L595.633213321332,235.25842157116114L595.1147614761477,232.97326099552868L593.3865886588659,232.2411526161266L593.9914491449144,230.87495052474L595.9788478847885,231.0330298307764L597.1021602160216,229.28773510523803L597.8798379837983,227.26015862886953L601.0769576957696,226.56202389743072L600.5585058505851,228.0094186319501L600.9041404140414,228.91568555615723Z"
                        className="datamaps-subunit TJK"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M731.4675967596759,355.91795011695706L731.7268226822682,355.3424598287105L733.8006300630063,354.8084006614049L735.442394239424,354.7262649185417L736.2200720072008,354.3977933485658L737.0841584158416,354.7262649185417L736.2200720072008,355.38355413913564L733.7142214221423,356.4115237266523L731.7268226822682,357.11123439461056L731.640414041404,356.3703819762227Z"
                        className="datamaps-subunit TLS"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M283.43879387938796,308.51295097676496L284.82133213321333,308.18206268721565L285.33978397839786,308.2647987937781L285.2533753375337,310.08267556581796L283.2659765976598,310.3714865998627L282.83393339333935,310.1239407782893L283.52520252025204,309.4634342730827Z"
                        className="datamaps-subunit TTO"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M454.26867686768674,258.09338954479756L453.23177317731773,253.0583569776233L451.7628262826283,251.90479583691797L451.7628262826283,251.2294793361798L449.77542754275424,249.53327222242092L449.516201620162,247.33537494319046L451.0715571557156,245.71099535627584L451.5900090009001,243.27867940783585L451.24437443744375,240.46792748795588L451.6764176417642,238.948061983043L454.3550855085508,237.72486377772208L455.99684968496854,238.08230958149008L455.9104410441044,239.60790335623693L457.98424842484246,238.49013197897327L458.1570657065706,239.1005017066666L456.94734473447346,240.56889667568646L456.94734473447346,241.927706221976L457.7250225022502,242.67920304735145L457.465796579658,245.21660409056375L455.8240324032403,246.64756657181L456.34248424842485,248.26575701983444L457.55220522052207,248.314627428137L458.1570657065706,249.67911023576022L459.10756075607566,250.11611609390872L458.93474347434744,252.28989150088023L457.7250225022502,253.1063101988989L457.03375337533754,254.01574250241305L455.39198919891993,255.1124174592241L455.65121512151217,256.25194054605834L455.39198919891993,257.4338002059172Z"
                        className="datamaps-subunit TUN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M723.7772277227723,274.06732636714105L722.3082808280827,278.27902585043034L721.2713771377138,280.43178911870723L720.0616561656166,278.2349572137974L719.7160216021603,276.29044200029125L721.1849684968497,273.710258594042L723.0859585958596,271.6944887875898L724.2092709270926,272.50229264272616Z"
                        className="datamaps-subunit TWN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M512.8537353735373,336.77861728266896L513.2857785778577,337.0224053690702L522.0130513051306,341.9008639173341L522.0994599459947,343.3252334499781L525.5558055805581,345.72853926404105L524.518901890189,348.70695309245133L524.6053105310531,350.05546165064294L526.1606660666066,350.9552886283437L526.2470747074708,351.569207449698L525.5558055805581,353.04401951721854L525.7286228622862,353.7822117046376L525.5558055805581,354.9316177850456L526.419891989199,356.4526674236639L527.3703870387039,358.8424620915924L528.2344734473447,359.3790811857325L526.3334833483348,360.7843424636527L523.7412241224123,361.7364928752734L522.2722772277228,361.69506851750384L521.4081908190819,362.4410836991853L519.7664266426643,362.48255260256633L519.1615661566157,362.8143945901939L516.2236723672368,362.10942243236076L514.409090909091,362.3166920216113L513.8042304230423,359.00753619174225L512.9401440144014,357.8527383486462L512.508100810081,357.1935911438838L510.0886588658866,356.7407281243047L508.7925292529253,356.00019319600256L507.2371737173717,355.58905355343126L506.2866786678668,355.17810103666886L505.2497749774978,354.5620149130788L503.95364536453644,351.52826911866543L502.57110711071107,350.17812538989386L502.1390639063907,348.7477963209511L502.31188118811883,347.5230286128799L501.8798379837983,345.2802271842749L502.91674167416744,345.1987283393365L503.7808280828083,344.3024826338234L504.73132313231326,343.04028861142166L505.3361836183619,342.55189643327014L505.2497749774978,341.7788142502916L504.73132313231326,341.20932350226053L504.6449144914492,340.27397722000717L505.3361836183619,339.9893617441696L505.42259225922595,338.56661359107375L504.472097209721,337.22556817233885L505.3361836183619,336.90051037606514L508.0148514851485,336.94114182460106Z"
                        className="datamaps-subunit TZA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M504.472097209721,337.22556817233885L503.0895589558956,337.95700701636036L502.484698469847,337.7131841698428L502.484698469847,335.8847835347974L503.0895589558956,334.99100901930524L503.1759675967597,333.04097843048265L503.6944194419442,331.9439839331172L504.6449144914492,330.6842682201536L505.50900090009003,330.0339743228801L506.2866786678668,329.180310320915L505.3361836183619,328.8550530367241L505.50900090009003,326.0482100952928L506.45949594959495,325.3968890386999L508.0148514851485,325.9261022308678L509.91584158415844,325.3561748646022L511.64401440144013,325.3968890386999L513.1129612961296,324.25657841994723L514.2362736273627,325.9261022308678L514.495499549955,327.1468935648297L515.6188118811881,329.9120335819811L514.7547254725473,331.6595543923422L513.5450045004501,333.2441134106345L512.8537353735373,334.21913150690256L512.8537353735373,336.77861728266896L508.0148514851485,336.94114182460106L505.3361836183619,336.90051037606514Z"
                        className="datamaps-subunit UGA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M507.75562556255625,187.44595760673127L508.7061206120612,187.64429050826692L509.31098109810983,186.71679818728148L510.0022502250225,186.91596309351337L512.508100810081,186.58389468654332L514.0634563456346,188.76393999232982L513.4585958595859,189.5499894361011L513.6314131413142,190.72250612088013L515.532403240324,190.91716871271413L516.3964896489649,192.59532314766125L516.3964896489649,193.3645314174878L519.4207920792079,194.63921016200442L521.2353735373538,194.06673103029038L522.7043204320432,195.84179950955343L524.0868586858686,195.77870585634722L527.6296129612962,196.9737197450178L527.7160216021603,198.09858804680016L526.6791179117912,199.95801893220224L527.2839783978397,201.98178448794098L526.8519351935194,203.19757188673648L524.518901890189,203.4397739184806L523.3091809180918,204.46562391102202L523.2227722772277,206.02373953113874L521.3217821782179,206.32189729391033L519.7664266426643,207.45060873365776L517.519801980198,207.6282107380623L515.4459945994599,208.92556312682575L515.532403240324,211.08775085823763L516.7421242124212,211.89956442920467L519.1615661566157,211.66796634938794L518.7295229522953,212.8807730169119L516.0508550855086,213.51303771629102L512.8537353735373,215.4544582594538L511.471197119712,214.7714471488057L511.98964896489656,213.16842104754699L509.3973897389739,212.18867200081195L509.82943294329436,211.49408512672883L512.0760576057606,210.38917326640626L511.3847884788479,209.57093414771043L507.66921692169217,208.69033939958243L507.496399639964,207.3913709596148L505.3361836183619,207.86475429510148L504.38568856885695,209.7465661237165L502.57110711071107,212.30419408285155L501.447794779478,211.72589193302372L500.3244824482448,212.24644166550814L499.2875787578758,211.61002336414242L499.8924392439244,211.2619991486097L500.3244824482448,210.0973465913762L500.92934293429346,208.98432364310668L500.7565256525653,208.33695701839747L501.27497749774983,208.04196821117407L501.534203420342,208.57261830935175L502.91674167416744,208.63148797035848L503.521602160216,208.3958997711311L503.0895589558956,208.04196821117407L503.26237623762376,207.5098279435517L502.484698469847,206.61958288195913L502.1390639063907,205.12641160334098L501.1885688568857,204.58594129636606L501.3613861386139,203.379253057747L500.3244824482448,202.40822050536664L499.2875787578758,202.28648215269843L497.5594059405941,201.12594008049876L495.91764176417644,201.49321807684308L495.3991899189919,202.04276429907836L494.3622862286229,202.04276429907836L493.7574257425743,202.8943735453394L492.02925292529255,203.19757188673648L491.16516651665165,203.74208256703542L490.0418541854186,202.8943735453394L488.486498649865,202.8943735453394L487.01755175517553,202.46905960311594L485.98064806480653,203.2581520600709L485.8078307830783,202.28648215269843L484.511701170117,201.3096708027947L484.9437443744374,199.83464526086013L485.63501350135016,198.90667434981555L486.1534653465347,199.09264689151505L485.5486048604861,197.47452470287533L487.7088208820882,194.32139264703167L488.9185418541854,193.93926387588618L489.1777677767777,192.85209595586358L487.96804680468045,189.4846197226698L489.09135913591365,189.35380719849897L490.3874887488749,188.30377644338114L492.2884788478848,188.23793981936265L494.7079207920792,188.50113765938917L497.38658865886595,189.4846197226698L499.2875787578758,189.5499894361011L500.15166516651664,190.07207311663834L501.1021602160216,189.41922565142605L501.70702070207017,190.33253473488938L503.86723672367236,190.13722467886652L504.81773177317734,190.5276283381772L504.9905490549055,188.5668752606199L505.76822682268227,187.71035136624752Z"
                        className="datamaps-subunit UKR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M293.2029702970297,410.63795613666446L294.7583258325833,410.3090416949177L297.17776777677767,412.47780427863256L298.0418541854186,412.38314716749915L300.547704770477,414.1874088398214L302.448694869487,415.7643559534585L303.83123312331236,417.68877807087034L302.7079207920792,419.04457411025487L303.39918991899196,420.65193858909504L302.3622862286229,422.515880555565L299.68361836183624,424.09665548618545L297.86903690369036,423.55209635554513L296.57290729072906,423.8489758100361L294.32628262826285,422.61437727788075L292.77092709270926,422.6636406028965L291.3019801980198,421.0921225122647L291.47479747974796,419.23885603988646L291.9932493249325,418.55952529799515L291.9932493249325,415.7643559534585L292.5981098109811,412.85676786706307Z"
                        className="datamaps-subunit URY"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M591.1399639963997,237.67375408025734L591.2263726372637,235.82604913115125L588.0292529252926,234.53388547381718L585.523402340234,233.02546074804985L583.9680468046804,231.55912769132823L581.2029702970297,229.393915943798L579.9932493249325,226.13124556934008L579.2155715571557,225.59152208534493L576.6233123312331,225.69957845155324L575.6728172817282,225.0503979451879L575.4135913591359,222.4879892969014L572.2164716471648,220.78018659295853L570.2290729072907,222.65250429633835L568.1552655265527,223.80043124984667L568.500900090009,225.37524117940615L565.8222322232224,225.42933245756075L565.7358235823583,213.28336112598296L571.8708370837085,211.2619991486097L572.3892889288929,211.55206296176797L576.1048604860487,214.02882204007753L578.0058505850585,215.28392804570342L580.3388838883889,218.27517610908632L583.1039603960396,217.826545703045L587.2515751575158,217.54563798127873L590.1030603060306,219.94864199275256L589.9302430243024,223.25459889450934L591.1399639963997,223.25459889450934L591.57200720072,225.86155816170253L594.6827182718272,225.96947488161462L595.2875787578758,227.47450434078058L596.2380738073807,227.47450434078058L597.2749774977498,225.21288297000444L600.4720972097209,222.9264027136926L601.7682268226822,222.3782391077354L602.545904590459,222.65250429633835L600.4720972097209,224.77930687232373L602.2866786678668,225.96947488161462L604.0148514851485,225.15873540175107L606.8663366336634,226.83081170368717L603.7556255625562,229.12836476581654L601.9410441044105,228.8092662814073L600.9041404140414,228.91568555615723L600.5585058505851,228.0094186319501L601.0769576957696,226.56202389743072L597.8798379837983,227.26015862886953L597.1021602160216,229.28773510523803L595.9788478847885,231.0330298307764L593.9914491449144,230.87495052474L593.3865886588659,232.2411526161266L595.1147614761477,232.97326099552868L595.633213321332,235.25842157116114L594.2506750675068,238.33728417896813L592.522502250225,237.72486377772208Z"
                        className="datamaps-subunit UZB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M690.8555355535555,281.48159476641683L687.6584158415842,283.7027671937737L685.5846084608461,286.1272049366049L685.0661566156615,287.89308992879904L686.9671467146716,290.54955400821433L689.1273627362737,293.82688163427457L691.3739873987399,295.393649545L692.8429342934294,297.3767925405311L693.8798379837983,301.9478374868877L693.6206120612062,306.2764726838982L691.5468046804681,307.89241202412506L688.8681368136813,309.4634342730827L686.8807380738074,311.4844978296393L683.8564356435644,313.7472111110384L682.9923492349235,312.22567247583373L683.6836183618362,310.577715683256L681.8690369036904,309.1742839101657L683.9428442844285,308.18206268721565L686.5351035103511,308.0165622196603L685.4117911791179,306.5253235376995L689.47299729973,304.6566826847359L689.7322232223223,301.697179478319L689.2137713771376,300.023349957816L689.6458145814581,297.5452178504536L689.0409540954095,295.816245540109L687.2263726372637,294.0812958864044L685.7574257425742,291.8718066890269L683.7700270027003,288.8804604271483L680.8321332133213,287.3339885116369L681.523402340234,286.4292332039805L683.0787578757877,285.7817550482006L682.1282628262827,283.5290215865715L679.1903690369037,283.5290215865715L678.1534653465346,281.17570786776156L676.6845184518452,279.11529648697467L677.9806480648065,278.4992870815444L679.8816381638163,278.4992870815444L682.2146714671467,278.1908831015543L684.2884788478848,276.82184118133875L685.4117911791179,277.7939688285213L687.6584158415842,278.27902585043034L687.2263726372637,279.7741385081002L688.4360936093609,280.82581475650017Z"
                        className="datamaps-subunit VNM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M834.2938793879388,374.54612040354067L833.516201620162,374.8851311725104L832.7385238523852,373.78420813625564L832.8249324932493,373.1079382629955ZM832.5657065706571,370.74803887179144L832.9113411341134,372.7279371187748L832.3064806480647,372.43257755606027L831.7880288028803,372.5591392421723L831.442394239424,371.8845043484372L831.442394239424,369.9917425544862Z"
                        className="datamaps-subunit VUT"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M516.8285328532853,252.24178615370852L516.8285328532853,253.96795674804744L516.482898289829,254.77913092649854L515.3595859585959,255.15999547501275L515.4459945994599,254.44542187408098L516.0508550855086,254.063519516773L515.4459945994599,253.72889661796776L515.9644464446445,251.85661814524474Z"
                        className="datamaps-subunit PSE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M470.68631863186323,406.1144382692969L471.8960396039604,404.72987605878063L472.84653465346537,405.51364864761325L473.1921692169217,406.67012991022835L474.3154815481548,406.8556006620346L475.7844284428443,407.36626933084256L477.08055805580557,407.1804653902014L479.24077407740776,405.7907806952052L479.24077407740776,395.88201669840856L479.93204320432045,396.2849468527171L481.3145814581459,398.80342273111484L481.1417641764176,400.4330935440524L481.6602160216022,401.3421897230364L483.3883888388839,401.0691774580174L484.511701170117,399.8889215322039L485.72142214221424,399.0744449403692L486.23987398739877,397.8116577332938L487.449594959496,397.1821368118497L488.486498649865,397.4967428514031L489.6098109810981,398.26207576335764L491.5972097209721,398.3973257141869L493.0661566156616,397.7666509102497L493.32538253825385,396.95760621988904L493.7574257425743,395.6583803809497L495.05355535553554,395.4795806639901L495.7448244824482,394.49790311742527L496.60891089108907,392.72034676060156L498.76912691269126,390.77558013698217L502.1390639063907,388.88526893994526L503.0895589558956,388.88526893994526L504.29927992799287,389.3239934485607L505.07695769576964,389.0168308356261L506.3730873087309,389.2800971845194L507.496399639964,392.9420343627203L508.10126012601256,394.8099409977897L507.66921692169217,397.7666509102497L507.9284428442844,398.7131338120501L506.71872187218725,398.2170052544007L506.02745274527456,398.44242185830615L505.76822682268227,399.21004377420496L505.1633663366337,400.2062388849163L505.1633663366337,401.11466255778134L506.54590459045903,402.57379301703475L508.0148514851485,402.29966892359204L508.446894689469,401.11466255778134L510.26147614761476,401.11466255778134L509.65661566156615,403.07700587909676L509.3973897389739,405.3290412913001L508.7925292529253,406.57743970226966L507.15076507650764,407.9709764912618L506.71872187218725,408.3437504490942L505.6818181818182,409.74610406060714L504.9905490549055,411.20273325464586L503.6080108010801,413.18880300004525L500.92934293429346,416.1000921625049L499.2011701170117,417.83369508053056L497.38658865886595,419.09313049203706L494.8807380738074,420.2125363478824L493.6710171017102,420.35891727108594L493.4117911791179,421.1900479097998L491.9428442844284,420.74968947854074L490.73312331233126,421.2880122656947L488.1408640864086,420.74968947854074L486.6719171917192,421.0921225122647L485.63501350135016,420.9453073204338L483.2155715571557,422.07313746472346L481.1417641764176,422.5651239315498L479.67281728172816,423.6510155294981L478.5495049504951,423.7004903453148L477.59900990099015,422.6636406028965L476.73492349234925,422.61437727788075L475.6980198019802,421.3370090734104L475.6116111611161,421.72933572863235L475.2659765976598,420.9453073204338L475.2659765976598,419.2874500496144L474.48829882988304,417.35095895218507L475.2659765976598,416.82100178237516L475.2659765976598,414.6642678787686L473.6242124212422,412.0521099399101L472.4144914491449,409.699244505661L472.4144914491449,409.65239290580894ZM501.01575157515754,407.1340334096518L499.9788478847885,406.29954912795677L498.85553555355534,406.8556006620346L497.5594059405941,407.92441449805017L496.26327632763275,409.65239290580894L498.0778577857786,411.81590394332244L498.9419441944195,411.53272943818314L499.37398739873987,410.63795613666446L500.7565256525653,410.21513863716905L501.1021602160216,409.32465387986423L501.8798379837983,407.9709764912618Z"
                        className="datamaps-subunit ZAF"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M510.0886588658866,356.7407281243047L511.2983798379838,357.81152621551536L511.90324032403237,359.8747548144718L511.471197119712,360.53616194192864L510.95274527452744,362.5240240179135L511.471197119712,364.5592825480118L510.6935193519352,365.4335005967313L509.91584158415844,367.7290534116755L511.21197119711974,368.35666831932144L503.95364536453644,370.4117760618112L504.1264626462646,372.1795481118854L502.31188118811883,372.51694852330104L501.01575157515754,373.48822707111503L500.6701170117012,374.37670391123L499.8060306030603,374.54612040354067L497.73222322232226,376.6263593683284L496.4360936093609,378.24604781436324L495.57200720072007,378.331455736402L494.7943294329433,378.0325993813339L492.11566156615663,377.73394198601494L491.6836183618362,377.56336935315176L491.6836183618362,377.3502437769836L490.73312331233126,376.79658256408214L489.1777677767777,376.6263593683284L487.1903690369037,377.22241633126777L485.63501350135016,375.6487822955825L483.9932493249325,373.57277507509986L484.16606660666065,365.68350184097085L489.1777677767777,365.72517855342534L488.9185418541854,364.89217508756894L489.2641764176418,363.97713666374057L488.8321332133213,362.8143945901939L489.1777677767777,361.6122271109172L488.9185418541854,360.867088079139L489.6962196219622,360.9084644246293L489.8690369036904,361.69506851750384L490.9923492349235,361.6122271109172L492.46129612961295,361.860780613325L493.32538253825385,362.98037649971513L495.22637263726375,363.3124634095327L496.69531953195326,362.5240240179135L497.21377137713773,363.810905288339L499.11476147614763,364.18498562750017L499.9788478847885,365.2252430869009L500.92934293429346,366.5593107122541L502.7439243924392,366.60104752622334L502.57110711071107,363.93557484882285L501.8798379837983,364.39290143721166L500.2380738073807,363.43703863840494L499.6332133213321,362.98037649971513L499.8924392439244,360.53616194192864L500.3244824482448,357.64669839950244L499.8060306030603,356.5761102319515L500.49729972997307,355.01377158404534L501.1021602160216,354.7262649185417L504.29927992799287,354.3156931569377L505.2497749774978,354.5620149130788L506.2866786678668,355.17810103666886L507.2371737173717,355.58905355343126L508.7925292529253,356.00019319600256Z"
                        className="datamaps-subunit ZMB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M506.3730873087309,389.2800971845194L505.07695769576964,389.0168308356261L504.29927992799287,389.3239934485607L503.0895589558956,388.88526893994526L502.1390639063907,388.88526893994526L500.58370837083714,387.703325560188L498.76912691269126,387.31017927510555L498.0778577857786,385.6547201625664L498.0778577857786,384.7862794089101L497.0409540954096,384.48278006122416L494.27587758775877,381.67549128347173L493.498199819982,380.214635291968L493.0661566156616,379.785924236368L492.11566156615663,377.73394198601494L494.7943294329433,378.0325993813339L495.57200720072007,378.331455736402L496.4360936093609,378.24604781436324L497.73222322232226,376.6263593683284L499.8060306030603,374.54612040354067L500.6701170117012,374.37670391123L501.01575157515754,373.48822707111503L502.31188118811883,372.51694852330104L504.1264626462646,372.1795481118854L504.29927992799287,373.1079382629955L506.2866786678668,373.0657017651249L507.40999099909993,373.57277507509986L507.9284428442844,374.20734630991586L509.0517551755176,374.37670391123L510.34788478847884,375.18196149387296L510.34788478847884,378.37416583305793L509.82943294329436,380.12885888853594L509.7430243024303,382.01996295407093L510.1750675067507,382.7529218838071L509.91584158415844,384.26613768009L509.483798379838,384.48278006122416L508.8789378937894,386.35087930126565Z"
                        className="datamaps-subunit ZWE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: 1,
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                        }}
                      />
                      <path
                        d="M578.4378937893789,242.7792215120154L578.1786678667867,240.31639108715353L576.3640864086409,240.2153116328802L573.6854185418542,237.52035575870585L571.7844284428443,237.2132467124593L569.1057605760576,235.67138479878568L567.3775877587759,235.36173415064036L566.3406840684069,235.92909924288492L564.6989198919891,235.87758012468234L563.0571557155715,237.57150008042237L560.8969396939694,238.18433371749092L560.4648964896489,236.03210189316206L560.8105310531053,232.81658700714448L558.9095409540954,231.7692096507719L559.6008100810081,229.6591375024948L557.9590459045904,229.4469865803587L558.477497749775,226.83081170368717L560.7241224122413,227.58159558428656L562.8843384338434,226.56202389743072L561.1561656165617,224.67077121596074L560.4648964896489,222.81688725827823L558.477497749775,223.6368333940317L558.2182718271828,225.96947488161462L557.52700270027,223.90942442532793L558.5639063906391,222.81688725827823L561.3289828982898,222.15856181760955L562.8843384338434,223.09056636972855L564.6125112511252,225.59152208534493L565.8222322232224,225.42933245756075L568.500900090009,225.37524117940615L568.1552655265527,223.80043124984667L570.2290729072907,222.65250429633835L572.2164716471648,220.78018659295853L575.4135913591359,222.4879892969014L575.6728172817282,225.0503979451879L576.6233123312331,225.69957845155324L579.2155715571557,225.59152208534493L579.9932493249325,226.13124556934008L581.2029702970297,229.393915943798L583.9680468046804,231.55912769132823L585.523402340234,233.02546074804985L588.0292529252926,234.53388547381718L591.2263726372637,235.82604913115125L591.1399639963997,237.67375408025734L590.448694869487,237.57150008042237L589.3253825382538,236.80311695018457L588.8933393339335,237.8781237762032L586.9059405940594,238.4391941032182L586.3874887488748,240.82112740347816L585.0913591359136,241.72689985402909L583.1903690369037,242.17847239647614L582.6719171917192,243.52801371140873L580.8573357335733,243.9264048521731Z"
                        className="datamaps-subunit TKM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M560.8969396939694,238.18433371749092L563.0571557155715,237.57150008042237L564.6989198919891,235.87758012468234L566.3406840684069,235.92909924288492L567.3775877587759,235.36173415064036L569.1057605760576,235.67138479878568L571.7844284428443,237.2132467124593L573.6854185418542,237.52035575870585L576.3640864086409,240.2153116328802L578.1786678667867,240.31639108715353L578.4378937893789,242.7792215120154L577.40099009901,246.45069345859156L576.7961296129613,248.5588348783482L577.8330333033304,248.9978035402437L576.7961296129613,250.55236413664764L577.5738073807381,252.81845739421783L577.7466246624663,254.63616464395594L579.561206120612,255.1124174592241L579.7340234023402,256.91442165476747L577.5738073807381,259.4078088178081L578.7835283528353,260.85580841222225L579.7340234023402,262.5280505691161L582.0670567056707,263.7297254770336L582.1534653465346,266.11833135759406L583.2767776777678,266.57548180208425L583.4495949594959,267.8063392507885L579.9932493249325,269.1681703670599L579.1291629162916,272.2781047007171L574.549504950495,271.46973946197454L571.9572457245724,270.8846520112987L569.2785778577858,270.5240633228766L568.2416741674167,267.21432806912276L567.1183618361836,266.7581473525461L565.2173717371737,267.25990834495474L562.7979297929793,268.5333978236878L559.8600360036004,267.6243045377936L557.440594059406,265.56882629053024L555.1075607560756,264.7886145211277L553.5522052205221,262.20366218949636L551.7376237623762,258.5165689969688L550.441494149415,258.98600250094034L548.9725472547254,258.0463290664668L548.0220522052205,259.17355163791206L546.7259225922593,257.66955186391897L546.7259225922593,256.2045576993334L545.9482448244825,256.2045576993334L546.3802880288029,254.15904735492995L545.0841584158416,252.00112401883987L542.1462646264627,250.45548532497523L540.504500450045,247.7275433012918L541.0229522952295,245.46392634579416L542.2326732673267,244.42345868877953L542.0598559855986,242.72921758279176L540.504500450045,241.8273245719792L538.9491449144915,238.28631211138128L537.6530153015301,235.82604913115125L538.0850585058506,234.8964491505041L537.393789378938,231.34884197139766L539.0355535553556,230.45283837555564L539.3811881188119,231.6641940980943L540.5909090909091,233.0776480629225L542.2326732673267,233.49470008194294L543.0967596759676,233.39051134765538L545.9482448244825,231.08569723206944L546.8123312331234,230.87495052474L547.5900090009001,231.7692096507719L546.7259225922593,233.33839843896453L548.1948694869487,234.9481956145293L548.7997299729973,234.79292001306695L549.5774077407741,237.00827509630642L551.8240324032403,237.67375408025734L553.5522052205221,239.15129240639573L556.9221422142214,239.65858192851942L560.7241224122413,238.8972261688836Z"
                        className="datamaps-subunit IRN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M558.9959495949595,293.9541056165839L558.2182718271828,292.21240979499476L556.3172817281728,288.0220077249087L563.489198919892,285.47924418314324L565.1309630963096,280.3441705889919L564.0076507650765,278.4992870815444L564.0940594059406,277.4407803665858L564.7853285328533,276.37906535762045L564.7853285328533,275.31406884234235L565.8222322232224,274.78031686496604L565.3901890189019,274.4240115216798L565.6494149414941,272.6815318525448L566.8591359135913,272.6815318525448L567.8960396039604,274.468570403091L569.2785778577858,275.4473753912091L571.0067506750675,275.802604295836L572.4756975697569,276.24612176291953L573.5126012601261,277.7498396732203L574.2038703870387,278.6313784456164L575.0679567956796,278.9394018597754L575.0679567956796,279.510745635121L574.2038703870387,281.08826548878324L573.7718271827183,281.7872318640726L572.7349234923493,282.615572616344L571.8708370837085,284.3969773406244L570.7475247524753,284.2669065233038L570.3154815481548,284.87353748165214L569.8834383438344,286.170365525586L570.2290729072907,287.8501085666576L569.9698469846985,288.15088618301996L568.8465346534654,288.15088618301996L567.3775877587759,289.0948047545462L567.1183618361836,290.33592187932385L566.5999099909991,290.8484668787757L565.0445544554456,290.8484668787757L564.1804680468047,291.48832500053186L564.1804680468047,292.51023130625634L562.9707470747074,293.19025190486883L561.6746174617462,292.97785149355417L560.0328532853285,293.7844661281393ZM566.513501350135,270.5691593292017L566.0814581458146,269.6660122271381L566.7727272727273,268.76025176752876L567.0319531953195,268.98693944349833L566.8591359135913,270.11790953500434Z"
                        className="datamaps-subunit OMN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M460.3172817281728,276.51195768008284L452.10846084608465,281.4379119720011L445.1093609360936,286.51548602721317L441.73942394239424,287.63513582099665L439.0607560756076,287.89308992879904L439.0607560756076,286.2566729909796L437.93744374437443,285.8249523873804L436.468496849685,285.13323847388966L435.8636363636364,283.9198401995544L427.7412241224123,278.27902585043034L419.7052205220522,272.5471116903262L410.63231323132317,266.07257791469544L410.71872187218725,265.56882629053024L410.71872187218725,265.38543209892214L410.71872187218725,262.157290898293L414.52070207020705,260.10939354542825L416.9401440144015,259.68865566608855L418.9275427542754,258.93909524428454L419.87803780378044,257.57527581550335L422.64311431143113,256.44138800653593L422.7295229522952,254.34999847486364L424.11206120612064,254.1112877984921L425.2353735373538,253.0583569776233L428.3460846084609,252.62637710510907L428.7781278127813,251.51911971143045L428.1732673267327,250.89114789662545L427.3091809180918,247.87444537606672L427.2227722772277,246.1057816583686L426.2722772277228,244.22476134707028L428.60531053105314,242.62917789682712L431.19756975697567,242.07819810189355L432.6665166516652,240.87154066676334L434.9995499549955,239.96241930304438L439.0607560756076,239.40507726790904L443.0355535553556,239.20207185110138L444.24527452745275,239.60790335623693L446.49189918991897,238.4391941032182L449.0841584158416,238.4391941032182L450.03465346534654,239.1005017066666L451.6764176417642,238.948061983043L451.24437443744375,240.46792748795588L451.5900090009001,243.27867940783585L451.0715571557156,245.71099535627584L449.516201620162,247.33537494319046L449.77542754275424,249.53327222242092L451.7628262826283,251.2294793361798L451.7628262826283,251.90479583691797L453.23177317731773,253.0583569776233L454.26867686768674,258.09338954479756L455.04635463546356,260.5294969091218L455.13276327632764,261.8324802911767L454.70072007200724,264.05240268620287L454.8735373537354,265.29369243633386L454.61431143114316,266.7581473525461L454.7871287128713,268.44260952550866L453.83663366336634,269.57555455271165L455.30558055805585,271.51470190988624L455.39198919891993,272.63673128963006L456.2560756075608,274.11193287821163L457.37938793879385,273.62093153636886L459.2803780378038,274.86933418300254Z"
                        className="datamaps-subunit DZA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M468.78532853285327,235.05165238388872L467.9212421242124,237.41803242324445L468.2668766876688,238.38824483973042L467.74842484248427,239.9118075582141L465.9338433843385,238.7955206243992L464.72412241224123,238.4391941032182L461.3541854185419,236.90571937861614L461.6998199819982,235.36173415064036L464.464896489649,235.67138479878568L466.8843384338434,235.31008385367886ZM453.57740774077405,225.753585654877L455.04635463546356,228.0094186319501L454.70072007200724,232.13636484696855L453.57740774077405,231.92663781608832L452.6269126912691,232.97326099552868L451.7628262826283,232.13636484696855L451.5900090009001,228.38305594009785L451.0715571557156,226.56202389743072L452.3676867686769,226.72333786546926ZM464.63771377137715,208.1010027002984L464.3784878487849,209.80507424850086L464.98334833483347,211.2619991486097L463.0823582358236,210.79698567997087L461.0949594959496,211.95742056124925L461.18136813681366,213.68511751101488L460.9221422142214,214.65738040954162L461.6998199819982,216.36146731183177L463.94644464446446,217.99490037972066L465.1561656165617,220.72485653221054L467.83483348334835,223.36388122727345L469.7358235823582,223.36388122727345L470.34068406840686,224.0728063432L469.6494149414941,224.67077121596074L471.8096309630963,225.86155816170253L473.537803780378,226.83081170368717L475.6116111611161,228.43637901049277L475.87083708370835,229.0220516875774L475.43879387938796,230.18859733368825L474.0562556255626,228.70279377300693L471.98244824482447,228.16962955288992L470.94554455445547,230.24147153439958L472.67371737173715,231.34884197139766L472.4144914491449,232.97326099552868L471.46399639964,233.18198542162597L470.1678667866787,235.77450625231603L469.13096309630964,236.03210189316206L469.13096309630964,235.10336270947369L469.6494149414941,233.44261189184445L470.1678667866787,232.81658700714448L469.2173717371737,230.98034958636924L468.52610261026103,229.4469865803587L467.48919891989203,229.0220516875774L466.79792979297935,227.68863254290756L465.24257425742576,227.09925615771954L464.2056705670567,225.80757888761468L462.39108910891093,225.59152208534493L460.5765076507651,224.1816558687484L458.3298829882989,222.04863451302197L456.68811881188117,220.17072210112838L455.99684968496854,216.9262402431878L454.7871287128713,216.53106848566486L452.7997299729973,215.39763128790406L451.7628262826283,215.85178828224014L450.38028802880285,217.43316376153965L449.34338433843385,217.65804864208798L449.6026102610261,216.24831896305488L448.30648064806485,215.7950759044311L447.70162016201624,213.16842104754699L448.5657065706571,212.130885073413L447.7880288028803,210.85517392502516L447.9608460846085,209.86356446648728L448.9977497749775,210.6223150645166L450.1210621062106,210.4474852967532L451.41719171917197,209.27785454764384L451.84923492349236,209.86356446648728L453.0589558955896,209.7465661237165L453.57740774077405,208.33695701839747L455.30558055805585,208.74917261344615L456.34248424842485,208.16001880900257L456.6017101710171,206.73852538817283L457.98424842484246,207.27283965179765L458.3298829882989,206.5600834353999L460.6629162916292,205.96405112837758L461.18136813681366,207.2135460843336Z"
                        className="datamaps-subunit ITA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M531.2587758775878,224.72504614395L533.7646264626462,224.56217871242924L536.0976597659766,226.13124556934008L536.529702970297,227.26015862886953L536.2704770477047,228.75603668706526L538.0850585058506,229.5530883439298L539.0355535553556,230.45283837555564L537.393789378938,231.34884197139766L538.0850585058506,234.8964491505041L537.6530153015301,235.82604913115125L538.9491449144915,238.28631211138128L537.8258325832583,238.7955206243992L536.9617461746175,238.03128033623335L534.1966696669667,237.6226328510471L533.1597659765977,238.08230958149008L530.3946894689469,238.541058476529L529.0985598559856,238.49013197897327L526.3334833483348,239.60790335623693L524.3460846084608,239.65858192851942L523.1363636363636,239.04969974248854L520.457695769577,239.9118075582141L519.6800180018002,239.30359701310263L519.507200720072,240.97233438432102L518.9023402340234,241.6264319960627L518.2974797479749,242.27870387436013L517.3469846984699,240.92194299066304L518.2974797479749,239.81055071537847L516.8285328532853,240.063609486005L514.8411341134113,239.40507726790904L513.1993699369937,241.1234430751654L509.483798379838,241.42536657121568L507.5828082808281,239.86118469875987L504.9905490549055,239.7599055987588L504.472097209721,240.97233438432102L502.7439243924392,241.324768859593L500.49729972997307,239.7599055987588L497.81863186318634,239.81055071537847L496.4360936093609,236.80311695018457L494.62151215121514,235.10336270947369L495.8312331233123,232.7120753007722L494.27587758775877,231.24362248576415L496.9545454545455,228.27636959042235L500.6701170117012,228.1162393726326L501.70702070207017,225.69957845155324L506.2866786678668,226.13124556934008L509.1381638163817,224.0728063432L511.90324032403237,223.1452584314175L515.8780378037804,223.09056636972855L520.1120612061206,225.37524117940615L523.5684068406841,226.56202389743072L526.3334833483348,226.07733590986854L528.4072907290729,226.4005857944443ZM494.01665166516653,226.99191948475269L494.62151215121514,226.61580899719505L495.31278127812783,224.6164820761823L494.1894689468947,223.74591305596806L496.60891089108907,222.76210758741297L498.6827182718272,223.19993593550527L498.9419441944195,224.45352926419702L501.1021602160216,225.48340969326637L500.6701170117012,226.23902323830328L497.81863186318634,226.4005857944443L496.78172817281734,227.42093833329136L494.7943294329433,229.07521485271707L494.01665166516653,227.63512084343233Z"
                        className="datamaps-subunit TUR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M488.4000900090009,242.62917789682712L489.6962196219622,243.62767411409862L491.5972097209721,243.4781678164102L493.32538253825385,243.67748863926556L493.32538253825385,244.1750611741516L494.62151215121514,243.82686961475412L494.27587758775877,244.72119559964625L490.81953195319534,244.96902753012847L490.9059405940594,244.47310722986026L487.96804680468045,243.8766424356201ZM494.01665166516653,226.99191948475269L492.547704770477,226.88452801583838L491.33798379837987,226.56202389743072L488.4000900090009,227.42093833329136L490.0418541854186,229.18150143811766L488.8321332133213,229.7121423827581L487.53600360036006,229.7121423827581L486.23987398739877,228.06283573613533L485.8078307830783,228.75603668706526L486.32628262826285,230.66399780534675L487.53600360036006,232.08395204180448L486.6719171917192,232.76433739905136L487.96804680468045,234.17072705070098L489.1777677767777,235.10336270947369L489.1777677767777,236.80311695018457L487.01755175517553,235.98060649572554L487.7088208820882,237.52035575870585L486.1534653465347,237.8781237762032L487.1039603960396,240.51841758362764L485.462196219622,240.56889667568646L483.47479747974796,239.2528400502007L482.6107110711071,236.85442400814117L482.1786678667867,234.79292001306695L481.2281728172817,233.39051134765538L480.01845184518453,231.61166725684313L479.8456345634564,230.76949996013565L480.96894689468945,229.2346248808514L481.1417641764176,228.22300628834452L481.91944194419443,227.74213069424871L481.91944194419443,226.9382306056289L483.47479747974796,226.61580899719505L484.42529252925294,225.91552348906498L485.72142214221424,226.02341235125272L486.1534653465347,225.42933245756075L486.5855085508551,225.32113584678396L488.4000900090009,225.42933245756075L490.3010801080108,224.56217871242924L491.9428442844284,225.6455572656958L494.1894689468947,225.37524117940615L494.1894689468947,223.74591305596806L495.31278127812783,224.6164820761823L494.62151215121514,226.61580899719505Z"
                        className="datamaps-subunit GRC"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M402.2506750675068,299.0166612292211L400.69531953195326,297.29255951343384L399.22637263726375,295.4781973947013L397.6710171017102,294.80140963164126L396.547704770477,294.0812958864044L395.16516651665165,294.1236851716981L394.0418541854186,294.63206702460064L392.8321332133213,294.4203060174445L391.96804680468045,295.22451062882436L391.7952295229523,293.8692933814825L392.486498649865,292.63781057979605L392.7457245724572,290.29318310125205L392.486498649865,287.76413266933827L392.22727272727275,286.51548602721317L392.4000900090009,285.21976792604147L391.7952295229523,284.0066356146732L390.5855085508551,282.9202968267899L391.1039603960396,282.0490089964143L400.4360936093609,282.09262087340875L400.0040504050405,278.32308901665897L400.60891089108907,276.9987931885593L402.85553555355534,276.77758908341997L402.76912691269126,269.98240859552766L410.63231323132317,270.1630635568817L410.63231323132317,266.07257791469544L419.7052205220522,272.5471116903262L415.98964896489645,272.59192457075847L417.1993699369937,283.8330254969187L418.32268226822686,294.75907947910525L418.75472547254725,295.0553138605807L418.2362736273627,296.82903338317686L408.5585058505851,296.87118930358116L408.2128712871287,297.4189039547114L407.26237623762376,297.25043789206546L405.96624662466246,297.7135890597495L404.2380738073807,297.03977853785193L403.46039603960395,297.0819172557848L403.11476147614763,298.5546430229129Z"
                        className="datamaps-subunit MRT"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M467.14356435643566,278.10271842940017L465.4153915391539,279.0713309011173L464.1192619261926,277.6174189879573L460.3172817281728,276.51195768008284L459.2803780378038,274.86933418300254L457.37938793879385,273.62093153636886L456.2560756075608,274.11193287821163L455.39198919891993,272.63673128963006L455.30558055805585,271.51470190988624L453.83663366336634,269.57555455271165L454.7871287128713,268.44260952550866L454.61431143114316,266.7581473525461L454.8735373537354,265.29369243633386L454.70072007200724,264.05240268620287L455.13276327632764,261.8324802911767L455.04635463546356,260.5294969091218L454.26867686768674,258.09338954479756L455.39198919891993,257.4338002059172L455.65121512151217,256.25194054605834L455.39198919891993,255.1124174592241L457.03375337533754,254.01574250241305L457.7250225022502,253.1063101988989L458.93474347434744,252.28989150088023L459.10756075607566,250.11611609390872L461.87263726372635,251.08453536371533L462.90954095409546,250.8427779716883L464.8969396939694,251.3260627536166L468.0940594059406,252.5783346615425L469.2173717371737,255.1124174592241L471.3775877587759,255.6353057624882L474.7475247524753,256.81988155621934L477.3397839783978,258.18748612962935L478.463096309631,257.48096695667164L479.5864086408641,256.2045576993334L479.0679567956796,254.063519516773L479.8456345634564,252.67441059263336L481.5738073807381,251.3260627536166L483.2155715571557,250.9395085905577L486.4126912691269,251.51911971143045L487.27677767776777,252.81845739421783L488.1408640864086,252.81845739421783L488.9185418541854,253.29803434862254L491.33798379837987,253.63321112749537L491.85643564356434,254.5408105776118L490.9923492349235,255.92008382534104L491.42439243924395,257.10340230007955L490.81953195319534,258.8452567163381L491.510801080108,261.0421019919397L491.510801080108,270.65933209570005L491.510801080108,280.3441705889919L491.510801080108,285.47924418314324L488.7457245724572,285.47924418314324L488.7457245724572,286.55860563453746L479.1543654365437,281.6562750143876L469.56300630063004,276.6890679351335Z"
                        className="datamaps-subunit LBY"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M458.1570657065706,344.0581258361918L455.65121512151217,341.616090276295L454.0958595859586,339.62346203198115L452.6269126912691,337.14430235749865L452.7133213321332,336.37231946068414L453.23177317731773,335.60039610934905L453.83663366336634,333.8535039068273L454.26867686768674,332.0658789121919L455.13276327632764,331.90335183488236L458.5891089108911,331.9439839331172L458.5891089108911,329.0583424116974L459.7124212421242,328.8957118809595L461.18136813681366,329.22096535938346L462.5639063906391,328.8957118809595L462.90954095409546,329.0583424116974L462.73672367236725,330.07462045464104L463.34158415841586,331.3344772001046L465.1561656165617,331.1312951366785L465.76102610261023,331.61892064327094L464.72412241224123,334.38163191058413L465.8474347434743,335.8035294259748L466.10666066606666,337.67254803667635L465.8474347434743,339.29824846321276L465.06975697569754,340.39596280078945L462.99594959495954,340.31463856945703L461.6998199819982,339.1763004133898L461.52700270027003,340.23331637661937L459.8852385238524,340.5179530323017L459.0211521152116,341.12797731809127L459.9716471647165,342.71468222629375Z"
                        className="datamaps-subunit GAB"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M488.9185418541854,360.867088079139L489.1777677767777,361.6122271109172L488.8321332133213,362.8143945901939L489.2641764176418,363.97713666374057L488.9185418541854,364.89217508756894L489.1777677767777,365.72517855342534L484.16606660666065,365.68350184097085L483.9932493249325,373.57277507509986L485.63501350135016,375.6487822955825L487.1903690369037,377.22241633126777L482.7835283528353,378.24604781436324L476.9941494149415,377.86191374906775L475.3523852385239,376.6689092866186L465.5882088208821,376.79658256408214L465.24257425742576,376.96686865249524L463.7736273627363,375.8186493546327L462.2182718271828,375.73370818439594L460.83573357335734,376.15856755358334L459.62601260126013,376.6689092866186L459.45319531953197,375.0547260059924L459.79882988298834,372.896791201957L460.5765076507651,370.57988108804676L460.74932493249327,369.5300796295362L461.52700270027003,367.31102134997786L462.0454545454545,366.30895063621733L463.42799279927993,364.6840968184076L464.2056705670567,363.60317539735587L464.464896489649,361.7779196745639L464.3784878487849,360.37075488809324L463.6008100810081,359.50296935280664L462.99594959495954,358.01760771187406L462.39108910891093,356.5761102319515L462.5639063906391,356.08244391054376L463.2551755175518,355.09593265792705L462.5639063906391,352.7570894513726L462.0454545454545,351.15989133427223L460.83573357335734,349.6057994112496L461.0949594959496,349.1562981782208L462.0454545454545,348.8294865436545L462.73672367236725,348.87033354514296L463.6008100810081,348.58443089466124L470.68631863186323,348.6252703829472L471.29117911791184,350.42349027695195L471.98244824482447,351.85581816152785L472.500900090009,352.6341437050245L473.4513951395139,353.9052969106959L475.0067506750675,353.70016344023503L475.7844284428443,353.37203805472956L477.16696669666965,353.70016344023503L477.5126012601261,353.12601423859246L478.1174617461746,351.6920314978683L479.5864086408641,351.61014728745295L479.7592259225923,351.2008162704942L480.96894689468945,351.15989133427223L480.7097209720972,352.06058600066615L483.6476147614762,352.0196293456433L483.73402340234026,353.5360872725712L484.16606660666065,354.47990059065233L483.82043204320433,355.959070703926L483.9932493249325,357.44070995639504L484.77092709270926,358.34744721829026L484.6845184518452,361.2395606069855L485.28937893789384,361.0326076586635L486.32628262826285,361.0739934821398L487.7952295229523,360.7429731858979ZM460.74932493249327,348.42108529969926L460.0580558055806,346.5847430934354L461.0949594959496,345.56550313888994L461.78622862286227,345.1579803273072L462.65031503150317,345.9731231017092L461.78622862286227,346.46240037402265L461.44059405940595,347.11500655196414L461.3541854185419,348.13527752729453Z"
                        className="datamaps-subunit AGO"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M558.9959495949595,293.9541056165839L557.1813681368137,294.63206702460064L556.7493249324932,295.7317549230623L556.6629162916292,296.5760251944363L554.3298829882989,297.62941020081246L550.441494149415,298.80670180659337L548.3676867686769,300.52601354957335L547.2443744374438,300.65160974049195L546.5531053105311,300.52601354957335L545.1705670567057,301.57181041709794L543.6152115211521,302.0313665382305L541.6278127812782,302.1566380848784L541.0229522952295,302.28188329243534L540.504500450045,302.9494174069906L539.8132313231323,303.11618629915336L539.467596759676,303.7411679466829L538.2578757875788,303.69952206739947L537.4801980198021,304.03261166891684L535.8384338433843,303.9077237692529L535.2335733573358,302.4488361196906L535.3199819981999,301.1118932953508L534.8879387938794,300.400389586915L534.455895589559,298.5546430229129L533.7646264626462,297.5452178504536L534.1966696669667,297.4189039547114L534.0238523852386,296.2806906275613L534.2830783078308,295.77400201152255L534.1966696669667,294.7167456633066L535.2335733573358,293.9117013741304L534.9743474347434,292.8503651220789L535.5792079207921,291.616188087176L536.6161116111612,292.25496746844954L537.2209720972097,292.04213979423076L539.9860486048605,291.99956244508917L540.418091809181,292.21240979499476L542.7511251125113,292.46769709718876L543.7016201620162,292.3400710543493L544.3064806480648,293.19025190486883L545.429792979298,292.765354915702L547.1579657965797,290.1221866637753L549.404590459046,289.0090798224342L556.3172817281728,288.0220077249087L558.2182718271828,292.21240979499476Z"
                        className="datamaps-subunit YEM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M476.73492349234925,197.3494534761862L476.9077407740774,197.59950952683076L477.8582358235824,197.09905116112768L479.0679567956796,198.4098160266351L480.53690369036906,197.59950952683076L481.6602160216022,197.97394720902736L483.3883888388839,197.47452470287533L485.63501350135016,198.90667434981555L484.9437443744374,199.83464526086013L484.511701170117,201.3096708027947L483.9932493249325,201.6765824125055L481.40099009900996,200.57364209817123L480.62331233123314,200.81931315665636L480.1048604860486,201.6154812623737L478.9815481548155,202.10372395249425L478.72232223222323,201.85976431783374L477.5126012601261,202.40822050536664L476.56210621062104,202.52987867316017L476.3892889288929,203.2581520600709L474.3154815481548,203.6816601976355L473.4513951395139,203.31871244433887L472.24167416741676,202.40822050536664L471.98244824482447,201.12594008049876L472.24167416741676,200.69651877427788L472.5873087308731,199.89634250865038L473.6242124212422,199.95801893220224L474.40189018901896,199.52584597657037L474.48829882988304,199.21652315803857L474.92034203420343,199.03067714963268L475.0931593159316,198.2231432922396L475.6980198019802,198.03627833702694L476.04365436543657,197.3494534761862Z"
                        className="datamaps-subunit SVK"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M454.441494149415,222.7073132709725L453.6638163816382,225.21288297000444L452.54050405040505,224.56217871242924L452.0220522052205,222.3782391077354L452.45409540954097,221.1670747264791L454.0094509450945,219.94864199275256ZM445.1093609360936,197.2242956834936L445.6278127812781,197.59950952683076L446.3190819081908,197.47452470287533L447.44239423942395,198.4719976493268L450.89873987398744,199.15459555440424L449.68901890189017,201.6154812623737L449.42979297929793,204.16449012926705L448.73852385238524,204.76627196833377L447.70162016201624,204.46562391102202L447.7880288028803,205.36611977013166L445.9734473447345,207.3321146046066L445.9734473447345,208.92556312682575L447.09675967596763,208.3958997711311L447.9608460846085,209.86356446648728L447.7880288028803,210.85517392502516L448.5657065706571,212.130885073413L447.70162016201624,213.16842104754699L448.30648064806485,215.7950759044311L449.6026102610261,216.24831896305488L449.34338433843385,217.65804864208798L447.1831683168317,219.55941202153366L442.4306930693069,218.66690267533332L438.97434743474344,219.72631699325888L438.6287128712871,221.6634217406686L435.8636363636364,222.10360556423382L433.1849684968497,220.6141510344711L432.32088208820886,221.3326584153413L427.91404140414045,219.83751015755396L426.96354635463547,218.55505907785067L428.1732673267327,216.5875699071758L428.60531053105314,209.80507424850086L426.1858685868587,206.14305943472505L424.3712871287129,204.3452288099114L420.7421242124213,202.9550529378535L420.482898289829,200.3276412510745L423.59360936093606,199.58764763785328L427.6548154815482,200.51217285206764L426.8771377137714,196.3457534875794L429.12376237623766,197.91159464262796L434.74032403240324,195.01984746894044L435.431593159316,191.95176065768703L437.50540054005404,191.17638517767415L437.85103510351036,192.53107188317767L438.97434743474344,192.59532314766125L440.09765976597663,194.06673103029038L441.8258325832583,195.84179950955343L443.0355535553556,195.58929185082798Z"
                        className="datamaps-subunit FRA"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M260.2812781278128,306.02753069541444L260.19486948694873,306.6082537167683L258.81233123312336,306.8984307955782L259.5900090009001,307.9751811937975L259.5900090009001,309.2569095376777L258.55310531053107,310.7014275577109L259.4171917191719,312.63715801133077L260.45409540954097,312.472587276008L260.9725472547255,310.7014275577109L260.2812781278128,309.835038489162L260.10846084608465,307.9751811937975L263.13276327632764,306.9813162193567L262.7871287128713,305.8615183199075L263.65121512151217,305.07239348867597L264.515301530153,306.77408410487055L266.1570657065707,306.81553548099606L267.71242124212426,308.18206268721565L267.79882988298834,309.0090055142047L269.9590459045905,309.0090055142047L272.551305130513,308.7610196051781L273.9338433843385,309.8763168070371L275.74842484248427,310.16520381993905L277.13096309630964,309.42213380584747L277.13096309630964,308.80235631188236L280.06885688568855,308.6369956830621L283.00675067506756,308.59564976213903L280.93294329432945,309.3395261593049L281.79702970297035,310.49523046289517L283.6980198019802,310.6601923886127L285.512601260126,311.85516659065445L285.8582358235824,313.829383074746L287.1543654365437,313.7472111110384L288.10486048604866,314.32226219581594L286.2038703870387,315.75838170088974L285.94464446444647,316.6190703014121L286.80873087308726,317.51999883414493L286.2038703870387,317.97018919609746L284.73492349234925,318.3793002435429L284.73492349234925,319.48320194326647L284.13006300630065,320.1369073593779L285.7718271827183,321.9737710443482L286.03105310531055,322.6671009307114L285.16696669666965,323.5639093460155L282.488298829883,324.5009871343153L280.7601260126013,324.86754143407273L280.06885688568855,325.43760241746253L278.1678667866787,324.82681659427334L276.3532853285329,324.5009871343153L275.9212421242124,324.74536437442055L277.04455445544556,325.3561748646022L276.9581458145815,326.9841568507281L277.2173717371737,328.48910088291484L279.29117911791184,328.6924127067622L279.3775877587759,329.180310320915L277.73582358235825,329.8713858746248L277.3901890189019,330.88746696452745L276.43969396939696,331.29384135138497L274.62511251125113,331.8627195114611L274.19306930693074,332.5940697751281L272.2920792079208,332.7565840732769L270.9959495949595,331.45638311117534L270.3046804680468,329.0989988506312L269.6134113411341,328.24510936982017L268.74932493249327,327.7163927348266L269.9590459045905,326.4958828383475L269.87263726372635,325.9668055963335L269.1813681368137,325.274744116062L268.74932493249327,323.6454138385928L268.9221422142215,321.9329772265418L269.44059405940595,321.11686474763684L269.87263726372635,319.81009594387325L269.00855085508556,319.4014653202552L267.6260126012602,319.687520471906L265.8978397839784,319.5649332879261L264.9473447344735,319.81009594387325L263.3055805580558,317.7246529563571L261.9230423042304,317.4381267418701L258.81233123312336,317.64279576480527L258.2074707470747,316.82389238596147L257.60261026102614,316.6190703014121L257.51620162016206,316.127335587997L257.8618361836184,315.22521099716494L257.60261026102614,314.24013369979497L257.0841584158416,313.70612237498625L256.8249324932493,312.59601824536446L255.52880288028805,312.4314397164847L256.22007200720077,310.99001467069877L256.5657065706571,309.2569095376777L257.25697569756977,308.34752552355957L258.1210621062106,307.6440472917341L258.7259225922592,306.4423833267952Z"
                        className="datamaps-subunit VEN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M238.76552655265527,342.67398470666706L240.06165616561657,340.8432837848077L239.54320432043204,339.8267349927436L238.59270927092712,340.9246219611086L237.21017101710171,339.86739097135444L237.64221422142214,339.21694934861324L237.2965796579658,337.0224053690702L238.0742574257426,336.6567259930748L238.50630063006304,335.15351077329484L239.45679567956796,333.6097498614808L239.2839783978398,332.6346985880982L240.5801080108011,332.1065101451691L242.22187218721874,331.1719321204308L244.64131413141317,332.55344079729036L245.0733573357336,332.51281165103745L245.67821782178217,333.5284979412632L247.7520252025203,333.8535039068273L248.35688568856887,333.48787185799L249.56660666066608,334.25975663347293L250.6035103510351,334.82850797509315L250.94914491449146,336.6567259930748L250.1714671467147,338.24148086097426L247.57920792079207,340.76194783229107L244.72772277227725,341.69745100156763L243.2587758775878,343.7730810008654L242.74032403240327,345.40248255788885L241.44419441944197,346.3808438215802L240.40729072907294,345.1987283393365L239.45679567956796,344.9135117745364L238.41989198919893,345.1172332507714L238.33348334833485,344.22102696627206L239.02475247524754,343.6509312004201Z"
                        className="datamaps-subunit ECU"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M780.461296129613,441.8674126454957L782.7943294329434,442.9972001409528L784.0904590459046,442.5660868456948L785.9914491449144,441.9210744319632L787.3739873987399,442.13585857023605L787.5468046804681,445.93083179997024L786.7691269126913,447.0830657257279L786.5099009900991,449.68578454787104L785.6458145814581,448.7959860824151L784.0040504050405,451.0840421167474L783.485598559856,450.9157338022477L782.0166516651666,450.8036071102718L780.547704770477,448.02061744844923L780.2020702070207,445.87612485530246L778.8195319531953,443.0511518324523L778.9059405940594,441.5993086188872ZM776.0544554455445,367.85452166010094L776.9185418541855,369.78184751983423L778.473897389739,368.8592581583475L779.2515751575157,369.9077748530909L780.3748874887489,370.8741919929819L780.1156615661566,371.9687853636388L780.6341134113411,374.12268950671745L781.0661566156616,375.35166151892815L781.67101710171,375.6487822955825L782.2758775877587,377.819252458281L782.0166516651666,379.10086792185115L782.7943294329434,380.81555293346884L785.47299729973,382.14921374800474L787.1147614761476,383.3575253160162L788.7565256525652,384.48278006122416L788.4108910891089,385.0900136076621L789.7934293429344,386.6994346250542L790.7439243924393,389.49963166144215L791.6944194419442,388.9291176388575L792.6449144914491,390.07104663646754L793.2497749774977,389.67535517102533L793.6818181818182,392.454510109813L795.3235823582357,394.0526382345274L796.446894689469,395.03300411447617L798.3478847884788,397.1821368118497L799.0391539153916,399.345701303675L799.1255625562557,400.8418532965476L798.9527452745275,402.52808829547973L800.0760576057605,404.82197517234454L799.9032403240324,407.2269049660531L799.471197119712,408.53032345974657L798.8663366336634,410.96726708190704L798.9527452745275,412.5724948473714L798.4342934293429,414.6165429634143L797.397389738974,417.15812016933114L795.5828082808281,418.55952529799515L794.7187218721872,420.79857941899706L793.9410441044104,422.2206292108033L793.2497749774977,424.74182247163424L792.2992799279928,426.23737298013504L791.6944194419442,428.4481831817982L791.3487848784879,430.5274165130252L791.521602160216,431.4462592902638L790.1390639063907,432.52298083564705L787.4603960396039,432.6257949404204L785.2137713771376,433.8632642343005L784.0904590459046,435.05567083636805L782.6215121512153,436.41142589596916L780.6341134113411,435.0036931031187L779.1651665166517,434.4845878629196L779.597209720972,432.88303663352065L778.3010801080109,433.450011657038L776.1408640864087,435.6803629564705L774.0670567056704,434.8478333664976L772.7709270927093,434.380912919558L771.3883888388839,434.1737084832637L769.0553555355535,433.2952393188868L767.5,431.3951147205267L767.0679567956795,429.10541915358056L766.4630963096308,427.59152363944827L765.3397839783978,426.387449124351L763.0067506750675,426.0374199029494L763.7844284428443,424.64245270442325L763.1795679567956,422.4666471415941L762.0562556255625,424.49347548115304L759.8960396039604,425.04018030188433L761.1057605760576,423.4037936116649L761.537803780378,421.72933572863235L762.4018901890188,420.3101140387216L762.2290729072906,418.17215686862806L760.3280828082808,420.60307762393916L758.7727272727273,421.63119525125694L757.9086408640864,423.94801705264183L756.0076507650765,422.71291391494293L756.0940594059407,421.1900479097998L754.538703870387,419.09313049203706L753.3289828982898,418.02704649145466L753.7610261026102,417.35095895218507L750.6503150315032,415.6685112304793L749.0085508550856,415.57270191275796L746.6755175517551,414.1874088398214L742.3550855085508,414.4734203203982L739.2443744374438,415.476927940722L736.5657065706571,416.43626538476144L734.2326732673267,416.2441127386344L731.7268226822682,417.68877807087034L729.6530153015302,418.36576686124096L729.1345634563456,419.87131571414227L728.2704770477048,421.0431744025235L726.2830783078308,421.0921225122647L724.7277227722773,421.3370090734104L722.653915391539,420.8474790340639L720.9257425742574,421.1410803453106L719.2839783978399,421.2880122656947L717.8150315031503,422.8114905335443L717.1237623762377,422.71291391494293L715.9140414041403,423.50265198044826L714.7907290729073,424.44383701959475L712.9761476147614,424.34459096414105L711.420792079208,424.34459096414105L708.8285328532852,422.4666471415941L707.532403240324,421.92573470465595L707.6188118811881,420.2613204003299L708.8285328532852,419.87131571414227L709.1741674167417,419.1902714489728L709.0877587758775,418.17215686862806L709.4333933393339,416.1960969487959L709.1741674167417,414.5211191915526L707.8780378037803,411.6742795897692L707.532403240324,410.12126769977647L707.6188118811881,408.53032345974657L706.6683168316832,406.76285021283644L706.5819081908191,405.92944654871803L705.54500450045,404.86803562745695L705.1993699369937,402.71094898598244L703.8168316831683,400.6146974835933L703.471197119712,399.43617234310227L704.594509450945,400.6146974835933L703.7304230423042,398.1268834139615L704.9401440144013,398.89373752792187L705.6314131413142,399.93423270678966L705.6314131413142,398.57774885289035L704.4216921692168,396.46418659150913L704.1624662466246,395.6583803809497L703.6440144014401,394.854541664092L703.9032403240324,393.34143410380784L704.4216921692168,392.6760264006727L704.7673267326732,391.3931972274459L704.508100810081,389.8511643058338L705.458595859586,388.0093927125336L705.6314131413142,389.9830775465273L706.6683168316832,388.18440160012364L708.5693069306931,387.31017927510555L709.7790279027904,386.2202531774863L711.5936093609362,385.2636820907085L712.7169216921691,385.0900136076621L713.3217821782177,385.3939843222441L715.2227722772277,384.4394420862687L716.6917191719172,384.17951390570556L717.0373537353735,383.61691836967555L717.7286228622863,383.3575253160162L719.0247524752475,383.4439710791691L721.530603060306,382.6666233532141L722.8267326732674,381.54638796364503L723.4315931593159,380.214635291968L724.9005400540054,378.92977151107505L724.9869486948694,377.9045790822747L725.0733573357336,376.5412712664357L726.7151215121512,374.4190525024359L727.7520252025201,376.58381336307826L728.7889288928893,376.0735649056938L727.9248424842483,374.8851311725104L728.7025202520251,373.6573374735668L729.7394239423943,374.20734630991586L729.9986498649866,372.3060472175877L731.2947794779477,371.08451378462854L731.8996399639964,370.1177184086722L733.1093609360937,369.69791206169833L733.1093609360937,368.9849756976049L734.2326732673267,369.27842669366237L734.2326732673267,368.6497914113513L735.2695769576958,368.3148059352417L736.4792979297929,367.98001716455263L738.2074707470748,369.1107214912946L739.5900090009001,370.57988108804676L741.0589558955895,370.57988108804676L742.614311431143,370.8321376314967L742.0958595859587,369.4461825890985L743.2191719171917,367.47819824160536L744.3424842484249,366.8515295861L743.9104410441043,366.2255203453985L744.9473447344735,364.8089355831935L746.4162916291629,363.93557484882285L747.6260126012601,364.226563425874L749.6998199819982,363.7693540497222L749.6134113411342,362.5240240179135L747.8852385238524,361.7364928752734L749.1813681368137,361.36376108198704L750.7367236723671,361.9850904305108L752.0328532853287,362.98037649971513L754.0202520252025,363.60317539735587L754.7115211521152,363.3539858898826L756.1804680468047,364.1018380482871L757.6494149414942,363.395510964857L758.513501350135,363.60317539735587L759.1183618361836,363.1463993554372L760.1552655265526,364.35131290374926L759.5504050405041,365.68350184097085L758.5999099909991,366.68452987739875L757.8222322232224,366.76802388655284L758.0814581458146,367.7290534116755L757.3901890189019,368.9849756976049L756.5261026102611,370.2017185614696L756.6989198919892,370.9162496811498L758.5999099909991,372.26387738438115L760.414491449145,373.0657017651249L761.7106210621062,373.9111113803502L763.438793879388,375.3940959664654L764.1300630063006,375.3940959664654L765.3397839783978,376.0310693673032L765.6854185418541,376.8391481788948L768.0184518451847,377.69129279556404L769.5738073807381,376.8391481788948L770.0922592259226,375.47897622170944L770.5243024302431,374.37670391123L770.8699369936994,372.981239406438L771.561206120612,371.0003750543267L771.2155715571557,369.82382007395523L771.3883888388839,369.1107214912946L771.1291629162918,367.68723670001845L771.4747974797481,365.8085404474214L771.9068406840685,365.30853774215575L771.561206120612,364.47608658926066L772.1660666066607,363.1879114967565L772.5981098109811,361.860780613325L772.6845184518452,361.1567722706002L773.548604860486,360.246723900945L774.2398739873988,361.4465734243421L774.412691269127,362.98037649971513L775.0175517551756,363.27094351985926L775.1039603960396,364.30972706002336L775.9680468046805,365.55848859355615L776.1408640864087,366.9350470084764Z"
                        className="datamaps-subunit AUS"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M696.2992799279928,288.83757874445075L694.2254725472546,290.0366635864691L692.2380738073807,289.2662035885282L692.2380738073807,287.0756889363871L693.3613861386139,285.9545167615629L696.0400540054005,285.21976792604147L697.4225922592259,285.2630256339473L697.9410441044104,286.2566729909796L696.9041404140414,287.37702285466133ZM745.0337533753376,221.9386479659898L743.4783978397841,220.0041849451904L742.527902790279,221.82860207418366L738.8123312331232,223.25459889450934L739.1579657965797,224.9420039813054L737.0841584158416,224.8335534132432L735.9608460846084,223.80043124984667L734.3190819081908,226.07733590986854L731.7268226822682,227.79561530898147L729.7394239423943,229.8181128008698L726.3694869486949,230.7167553369713L724.6413141314131,232.13636484696855L722.0490549054906,233.02546074804985L723.3451845184519,231.55912769132823L722.8267326732674,230.347180925312L724.7277227722773,228.22300628834452L723.4315931593159,226.61580899719505L721.3577857785779,227.68863254290756L718.5927092709271,229.87107836093622L717.1237623762377,231.92663781608832L714.7907290729073,232.03152660871427L713.5810081008101,233.49470008194294L714.8771377137714,235.56821568410635L716.7781278127813,236.08358544514311L716.8645364536453,237.41803242324445L718.7655265526553,238.28631211138128L721.4441944194419,236.13505716160864L723.6044104410441,237.31566276707196L725.1597659765978,237.41803242324445L725.5054005400541,238.99888650442796L722.1354635463546,239.81055071537847L721.0121512151215,241.42536657121568L718.6791179117912,242.92916975094911L717.469396939694,244.96902753012847L720.0616561656166,246.59836320713907L721.0121512151215,249.43599964205254L722.4810981098109,252.04927452431636L724.0364536453644,254.20679819344048L724.0364536453644,256.2993149930327L722.5675067506751,257.05616956513865L723.0859585958596,258.56354852324034L724.5549054905491,259.4078088178081L724.1228622862286,261.64670742361136L723.5180018001801,263.82195549278606L722.2218721872188,264.05240268620287L720.4072907290729,266.986323761773L718.506300630063,270.5240633228766L716.2596759675966,273.66559807920237L712.9761476147614,276.11312675188935L709.606210621062,278.32308901665897L706.9275427542755,278.587353426699L705.458595859586,279.7741385081002L704.594509450945,278.8954147342147L703.2983798379838,280.21270356471524L699.9284428442844,281.48159476641683L697.4225922592259,281.8745111071338L696.558505850585,284.6136667290999L695.2623762376238,284.74362339032353L694.5711071107112,282.87677963901945L695.1759675967597,281.9181431465939L691.9788478847885,281.08826548878324L690.8555355535555,281.48159476641683L688.4360936093609,280.82581475650017L687.2263726372637,279.7741385081002L687.6584158415842,278.27902585043034L685.4117911791179,277.7939688285213L684.2884788478848,276.82184118133875L682.2146714671467,278.1908831015543L679.8816381638163,278.4992870815444L677.9806480648065,278.4992870815444L676.6845184518452,279.11529648697467L675.4747974797481,279.510745635121L675.8204320432044,282.4849020929044L674.5243024302431,282.3977635008181L674.3514851485149,281.7872318640726L674.2650765076507,280.7382898463729L672.5369036903691,281.48159476641683L671.5,281.00080253740884L669.6854185418541,280.0373407569689L670.3766876687669,277.8822105608749L668.8213321332133,277.35242765804594L668.3028802880289,274.95832798106153L665.7106210621062,275.40294569168566L666.0562556255625,272.2781047007171L668.3028802880289,270.0275820601293L668.3892889288929,267.85183097496935L668.3028802880289,265.7521073008528L667.2659765976598,265.1101277294084L666.488298829883,263.49902214735056L665.1057605760576,263.7297254770336L662.513501350135,263.31432710778085L663.2911791179117,262.157290898293L662.1678667866787,260.482849939953L660.4396939693969,261.6002451860995L658.452295229523,260.9489706292379L655.6872187218721,262.66696166380046L653.52700270027,264.69668908223446L651.5396039603961,265.06421872855356L650.502700270027,264.3286991423005L649.2929792979298,264.2826678754727L647.564806480648,263.63746616321293L646.2686768676867,264.3286991423005L644.6269126912691,266.34699369601685L644.454095409541,264.1905835897123L642.9851485148515,264.7886145211277L640.2200720072008,264.51275184951135L637.45499549955,263.8680595297587L635.5540054005401,262.66696166380046L633.6530153015301,262.157290898293L632.8753375337533,260.8092157167879L631.492799279928,260.4361951907736L629.0733573357336,258.61051999215397L627.1723672367236,257.7637951576312L626.1354635463547,258.4225857448806L622.8519351935194,256.48872892556545L620.4324932493249,254.73148413152495L619.8276327632763,251.61559337467162L621.5558055805582,251.95296445891069L621.6422142214221,250.50392937739107L620.6053105310532,249.04653004064585L620.8645364536453,246.6967600079055L618.2722772277227,243.27867940783585L614.3838883888388,242.07819810189355L613.6926192619262,239.7599055987588L611.8780378037804,238.38824483973042L611.4459945994599,237.52035575870585L611.1003600360036,235.77450625231603L611.1867686768677,234.5857166161699L609.7178217821782,233.91096210165557L608.9401440144015,234.2226433713703L608.3352835283529,231.34884197139766L609.0265526552655,230.66399780534675L608.6809180918092,229.92403083647056L610.9275427542755,228.43637901049277L612.6557155715572,227.79561530898147L615.1615661566157,228.22300628834452L616.1120612061206,226.18514134153347L619.1363636363636,225.80757888761468L620.0004500450045,224.56217871242924L623.8024302430243,222.81688725827823L624.1480648064806,222.10360556423382L623.9752475247525,220.22620396347816L625.6170117011702,219.39236845879068L623.456795679568,213.57041454175823L628.2092709270926,212.18867200081195L629.4189918991899,211.43608984347202L631.1471647164716,205.1863674527563L635.8996399639964,206.3814721168209L637.1957695769577,204.76627196833377L637.3685868586858,201.18720406928364L639.3559855985599,200.81931315665636L641.1705670567057,198.4098160266351L642.1210621062106,198.09858804680016L642.7259225922593,200.6350907325153L644.7133213321333,202.59067773398576L648.1696669666967,203.92323188332202L649.8114311431144,206.73852538817283L648.9473447344735,210.85517392502516L649.8114311431144,212.30419408285155L652.6629162916292,212.8807730169119L655.8600360036003,213.34080569683266L658.7115211521152,215.4544582594538L660.2668766876687,215.85178828224014L661.3037803780379,218.8904026009599L662.7727272727273,220.83550154574561L665.3649864986498,220.78018659295853L670.3766876687669,221.49810730371934L673.4873987398739,221.05661053855752L675.9068406840685,221.55322703787675L679.4495949594959,223.5276959505081L682.3874887488748,223.5276959505081L683.424392439244,224.5078611125041L686.1894689468947,222.76210758741297L690.0778577857786,221.6634217406686L693.7070207020702,221.55322703787675L696.4720972097209,220.39255816674108L698.2002700270027,218.61098869081326L699.9284428442844,217.48940882322177L699.496399639964,216.41801720216205L698.7187218721872,215.1132497174353L700.0148514851486,212.9383367216942L701.3109810981098,213.22589958123842L703.8168316831683,213.91432114098706L706.2362736273628,212.130885073413L709.8654365436544,210.79698567997087L711.5936093609362,208.51373040012103L713.3217821782177,207.5098279435517L716.7781278127813,207.0355535251789L718.6791179117912,207.45060873365776L718.9383438343834,206.20269097005612L716.7781278127813,203.74208256703542L714.8771377137714,202.59067773398576L712.9761476147614,203.92323188332202L710.6431143114312,203.31871244433887L709.2605760576057,203.8024852924284L708.655715571557,202.3473613614042L710.3838883888388,198.72051156280753L711.507200720072,195.90487102356238L714.445094509451,197.3494534761862L717.8150315031503,194.9564640802955L717.7286228622863,193.30055764813022L719.9752475247525,189.28836433998674L721.2713771377138,188.0402809491433L721.2713771377138,185.85110116197947L719.8888388838884,184.9139496067136L721.8762376237623,182.95636327010317L724.9005400540054,182.2079582513111L728.0976597659767,182.07153267704655L731.640414041404,183.29547105711728L733.8006300630063,184.77965518838667L735.2695769576958,188.69827640282813L736.1336633663366,190.39758995502177L736.9977497749776,192.7237559569143L737.8618361836184,196.4086486430101L742.0958595859587,197.59950952683076L744.8609360936093,200.20451677231728L745.8978397839784,203.56075645455982L749.52700270027,203.56075645455982L751.6008100810081,202.16466346682822L755.575607560756,201.12594008049876L754.2794779477947,204.3452288099114L753.3289828982898,205.60552130820957L752.5513051305131,209.45375633448378L750.9095409540953,212.82319223252546L748.0580558055806,212.18867200081195L745.9842484248425,213.39823330882354L746.5891089108911,216.30490123686508L746.2434743474347,220.17072210112838L745.0337533753376,220.28167058639386Z"
                        className="datamaps-subunit CHN"
                        data-info='{"active":{"value":"10,101","percent":"13.7","isGrown":true},"new":{"value":"509","percent":"0.1","isGrown":false},"fillKey":"MAJOR","short":"cn"}'
                        style={{
                          fill: 'rgb(79, 70, 229)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgb(79, 70, 229)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M601.7682268226822,222.3782391077354L600.4720972097209,222.9264027136926L597.2749774977498,225.21288297000444L596.2380738073807,227.47450434078058L595.2875787578758,227.47450434078058L594.6827182718272,225.96947488161462L591.57200720072,225.86155816170253L591.1399639963997,223.25459889450934L589.9302430243024,223.25459889450934L590.1030603060306,219.94864199275256L587.2515751575158,217.54563798127873L583.1039603960396,217.826545703045L580.3388838883889,218.27517610908632L578.0058505850585,215.28392804570342L576.1048604860487,214.02882204007753L572.3892889288929,211.55206296176797L571.8708370837085,211.2619991486097L565.7358235823583,213.28336112598296L565.8222322232224,225.42933245756075L564.6125112511252,225.59152208534493L562.8843384338434,223.09056636972855L561.3289828982898,222.15856181760955L558.5639063906391,222.81688725827823L557.52700270027,223.90942442532793L557.3541854185419,223.1452584314175L557.9590459045904,221.77355684195598L557.52700270027,220.6141510344711L554.7619261926193,219.50374625079763L553.6386138613861,216.53106848566486L552.3424842484249,215.68160215230455L552.2560756075608,214.6003221210255L554.5891089108911,214.94242288282865L554.6755175517552,212.41964723679575L556.6629162916292,211.89956442920467L558.8231323132313,212.41964723679575L559.2551755175517,209.04306602586445L558.8231323132313,206.91679843593926L556.4036903690369,207.0355535251789L554.3298829882989,206.20269097005612L551.564806480648,207.74651947729683L549.3181818181818,208.45482422620682L548.1084608460847,207.92384402521225L548.3676867686769,206.08340896083368L546.8123312331234,203.74208256703542L545.0841584158416,203.86286839185172L543.0103510351036,201.4320560037886L544.3928892889289,198.6584149311214L543.7016201620162,197.91159464262796L545.6026102610261,193.8117055915315L548.1084608460847,195.96792041940682L548.3676867686769,193.23656087644645L553.3793879387938,189.09188909145388L557.0949594959495,188.96078312490587L562.3658865886589,191.62910058349624L565.2173717371737,193.17254108029948L567.8096309630963,191.56449789869453L571.6116111611161,191.49987160392146L574.6359135913591,193.42848220662862L575.3271827182718,192.3381783808509L578.6971197119711,192.46679734886973L579.3019801980198,190.65757080112292L575.4135913591359,188.0402809491433L577.7466246624663,186.1179298013777L577.3145814581459,185.0481397027937L579.561206120612,184.03916174647378L577.8330333033304,181.25068585439408L578.9563456345635,179.87376938798988L587.9428442844285,178.41589916065436L589.0661566156616,177.43696350688433L595.1147614761477,175.8870596735955L597.2749774977498,174.1797770576441L601.595409540954,175.03559341527992L602.3730873087309,179.3198668409216L604.8789378937894,178.34616290360157L607.9032403240324,179.7354630164375L607.7304230423042,181.9349982646004L610.0634563456346,181.72999208955326L616.0256525652566,177.85720215219297L615.1615661566157,179.18110831934936L618.1858685868588,182.34427520833L623.543204320432,192.27383390210363L624.8393339333934,190.26745546447327L628.2092709270926,192.46679734886973L631.5792079207921,191.43522167626907L632.9617461746175,192.14507484232848L634.0850585058506,194.32139264703167L635.8132313231323,195.08320844257904L636.7637263726374,196.66000996426268L639.8744374437445,196.15693610788995L641.1705670567057,198.4098160266351L639.3559855985599,200.81931315665636L637.3685868586858,201.18720406928364L637.1957695769577,204.76627196833377L635.8996399639964,206.3814721168209L631.1471647164716,205.1863674527563L629.4189918991899,211.43608984347202L628.2092709270926,212.18867200081195L623.456795679568,213.57041454175823L625.6170117011702,219.39236845879068L623.9752475247525,220.22620396347816L624.1480648064806,222.10360556423382L622.6791179117912,221.60833184589683L621.469396939694,220.44797915054784L617.8402340234024,220.11522498612277L613.8654365436544,220.0041849451904L613.0013501350135,220.33712198308336L609.6314131413142,219.0020591462873L608.2488748874888,219.6706973793992L607.9032403240324,221.60833184589683L603.9284428442844,220.44797915054784L602.3730873087309,220.94608617971846Z"
                        className="datamaps-subunit KAZ"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M500.15166516651664,102.22494747933351L499.8060306030603,106.92578933754027L503.4351935193519,111.16100955566156L501.1885688568857,115.90242527803471L504.0400540054005,122.69459803733355L502.3982898289829,127.66696311076589L504.5585058505851,131.73634608360481L503.6080108010801,135.33567306188502L507.15076507650764,138.9417050136512L506.2002700270027,141.6795898958228L504.0400540054005,144.62793771916705L498.85553555355534,150.94156345058235L494.53510351035106,151.35360048154402L490.3010801080108,153.07253602425138L486.4126912691269,154.1273779665349L485.0301530153015,151.51811506750954L482.6971197119712,149.8652083485807L483.2155715571557,144.97116286566657L482.0058505850585,140.3608495785834L483.2155715571557,137.23936072790164L485.3757875787579,133.86924326697212L490.81953195319534,127.85867034189619L492.46129612961295,126.70477708272244L492.2020702070207,124.27222979257652L488.8321332133213,121.50044620130856L488.05445544554453,119.18481716501225L487.96804680468045,109.65455160915099L484.2524752475247,105.2640501024834L481.05535553555353,101.99731565110304L482.52430243024304,100.1634687538521L485.1165616561657,103.80859539613601L488.3136813681368,103.47067204937625L490.9059405940594,105.04106606382928L493.1525652565257,102.11117556481904L494.3622862286229,97.01596333710182L498.0778577857786,94.64009879011499L501.1021602160216,97.48654441743284Z"
                        className="datamaps-subunit FIN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M457.98424842484246,158.7503874794753L459.0211521152116,156.05659642530702L461.0085508550855,152.82811246882906L461.78622862286227,147.01483813330282L460.3172817281728,144.5420133792097L460.14446444644466,137.59931373138457L461.6998199819982,132.5745037594359L464.03285328532854,132.66734932717293L464.8969396939694,130.4233304242646L464.03285328532854,128.52774640847545L467.74842484248427,120.39742175078939L470.1678667866787,113.60324038324165L471.72322232223223,109.11280391084321L474.0562556255626,109.22131186509304L474.6611161116112,105.59789615859665L479.24077407740776,106.59493245629673L479.5864086408641,102.22494747933351L481.05535553555353,101.99731565110304L484.2524752475247,105.2640501024834L487.96804680468045,109.65455160915099L488.05445544554453,119.18481716501225L488.8321332133213,121.50044620130856L484.77092709270926,123.18938213903996L482.43789378937896,127.18663298108413L482.7835283528353,130.61159751557585L478.9815481548155,135.0617828723692L474.3154815481548,139.5641834467814L472.5873087308731,146.8455471758586L474.3154815481548,150.28006039302053L476.56210621062104,152.9911033419013L474.40189018901896,158.35706989618083L471.8960396039604,159.45594217909368L470.94554455445547,167.02050975547152L469.6494149414941,171.07652102896424L466.71152115211527,170.63886130741355L465.32898289828984,174.0367141857193L462.5639063906391,174.25126258609936L461.78622862286227,170.20004090002067L459.79882988298834,165.21872741419523Z"
                        className="datamaps-subunit SWE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M776.2272727272726,192.65955116476732L778.6467146714672,199.27842972213284L775.1039603960396,198.09858804680016L773.6350135013502,203.31871244433887L775.9680468046805,206.97618533016657L775.8816381638163,209.39514043065594L774.0670567056704,207.27283965179765L772.511701170117,209.9804912462863L772.0796579657966,207.0355535251789L772.3388838883889,203.62121816617017L772.0796579657966,199.7111882147185L772.5981098109811,196.91102140042665L772.7709270927093,191.8872756801371L771.3019801980199,188.10619209672868L771.561206120612,182.75257657623843L773.7214221422141,180.83877807739805L772.7709270927093,178.97275742386273L773.8942394239423,178.41589916065436L774.499099909991,181.1134937391507L775.363186318632,184.98105768197576L775.2767776777678,188.82957895972652ZM486.0670567056706,178.55528551397697L481.6602160216022,178.62493566968908L478.72232223222323,178.1367814533438L479.24077407740776,176.31117861246875L482.52430243024304,174.96444229485041L485.0301530153015,175.67459792920863L486.1534653465347,176.3817611728889L485.89423942394245,177.5070759818769ZM-0.49999999999994316,102.90573912525576L5.375787578757922,107.91394432109536L11.683618361836182,114.23381237771585L11.424392439244002,118.06458937379628L13.066156615661612,119.59010764049665L12.547704770477083,115.17470057584575L19.0283528352835,116.00609721821178L23.78082808280834,121.70013018788524L21.36138613861391,124.27222979257652L17.38658865886589,124.85961817895404L17.38658865886589,130.32910960356827L16.436093609360967,131.54946268093758L14.189468946894692,131.36235024071556L12.288478847884846,129.38368210983484L9.177767776777728,127.76284698562742L8.57290729072912,125.2499464005038L6.153465346534688,124.3702865399388L3.474797479747963,125.05490821260955L2.0922592259225894,123.09055509485802L2.6107110711071186,120.89979953322779L-0.2407740774077638,122.29759825358528L0.8825382538254303,125.05490821260955L-0.49999999999994316,127.47501346561134ZM863.5,87.35357249231086L863.499568,89.89297627843101L860.9077407740774,90.26367794786566L860.475697569757,87.8997917875736L863.5,84.8582191296691L863.5,87.35357249231086ZM-0.49999999999994316,84.8582191296691L-0.4995679999999538,84.85779365646746L-0.49999999999994316,84.85779365646746L-0.49999999999994316,87.35357249231086L-0.49999999999994316,84.8582191296691ZM-0.49999999999994316,84.85779365646746L-0.15436543654362822,84.47302012194604L1.83303330333041,84.47302012194604L5.289378937893844,86.64002966019768L5.116561656165629,87.6487117122511L2.6107110711071186,89.39723440365054L-0.49999999999994316,89.89297627843101ZM776.1408640864087,71.30483685270832L772.511701170117,71.44547033079346L767.5864086408642,70.45813147096237L767.1543654365437,70.03289875190751L769.4873987398739,66.73020866938424L772.4252925292529,65.85597033798092L775.8816381638163,69.17863426207384ZM793.2497749774977,54.92531096481713L790.484698469847,58.50890711573891L786.6827182718273,57.7374963766207L782.1894689468947,54.13418730923979L782.7943294329434,50.92492898194155L787.2011701170118,52.378068774327346ZM779.6836183618362,50.27428656090939L777.7826282628263,57.27263775250236L768.9689468946895,57.117347241974926L764.9941494149415,59.276166366306086L760.2416741674167,53.17899419632067L761.537803780378,46.64143677727503L764.7349234923493,44.78950128071148L771.0427542754276,45.128022286887926ZM569.6242124212422,90.7564835487866L568.1552655265527,91.37015564282055L560.2920792079208,90.38703575378364L559.6872187218722,87.14524623946826L555.3667866786678,85.11374323616369L555.0211521152115,80.96327165134028L557.440594059406,79.24252744188917L557.3541854185419,74.91732006623096L562.1066606660667,67.88762074391292L559.9464446444645,66.87539758004675L565.6494149414941,59.12304441145642L565.0445544554456,54.92531096481713L570.4018901890189,49.947843928078726L578.2650765076507,43.59826466433884L586.3010801080108,41.70582892382953L590.448694869487,37.84324765875374L595.1147614761477,36.41207210466666L596.7565256525653,40.48823605752807L595.1147614761477,43.76905613496268L586.6467146714672,48.634513756226625L579.3019801980198,53.17899419632067L571.8708370837085,62.00463036272953L568.2416741674167,70.31652716251199L564.526102610261,78.17332601472697L564.9581458145815,84.60139147082123ZM863.5,127.47535017383447L860.3892889288929,129.95164261287022L857.2785778577858,129.57323781268514L859.438793879388,132.4816017843505L860.9077407740774,136.96884301857588L862.0310531053105,138.40614876700386L862.2902790279027,140.53733117064297L861.6854185418542,141.94199811799896L857.1921692169217,140.80167720759556L850.4522952295229,144.62793771916705L848.2920792079208,145.22808756138275L844.6629162916292,148.7814535187021L841.2065706570658,151.7645665686366L840.2560756075609,153.965549690451L836.8861386138615,150.61115838012927L830.578307830783,154.3698120508261L829.5414041404141,152.5833116356258L827.2083708370837,154.69248399396577L824.0112511251125,154.04648441640708L823.2335733573357,157.0919332523111L820.382088208821,161.63144555693657L820.4684968496849,163.47314554575206L823.1471647164716,164.4620772876646L822.8015301530153,170.8578357841184L820.6413141314131,171.00365802645854L819.6044104410441,174.53689940530018L820.5549054905491,176.3817611728889L816.4072907290729,178.48560668753217L815.543204320432,183.0920867546629L812.0004500450045,184.1066109182031L811.2227722772277,188.10619209672868L807.7664266426642,191.6936796812061L806.9023402340234,189.02634837096042L805.8654365436544,183.29547105711728L804.5693069306931,174.1797770576441L805.6926192619262,168.21078130379325L807.6800180018001,165.595740181191L807.8528352835283,163.47314554575206L811.568406840684,162.4781566117464L815.8888388838884,156.61491846188594L819.9500450045005,151.7645665686366L824.2704770477048,147.77439406787843L826.2578757875788,140.62549663165396L823.3199819981999,141.06557317460832L821.8510351035104,145.3136353150068L815.8024302430243,150.7764473197942L813.8150315031503,144.62793771916705L807.5936093609361,146.336574049487L801.6314131413142,154.5312297893944L803.6188118811881,157.40915504598962L798.2614761476148,158.67180098730142L794.545904590459,159.14274447956856L794.7187218721872,155.73667680202476L791.0031503150315,155.01450334864876L787.9788478847885,157.32990849571965L780.6341134113411,156.53527749284393L772.7709270927093,157.96278615221473L764.9941494149415,166.79636908768475L755.8348334833483,176.87501171410923L759.5504050405041,177.43696350688433L760.7601260126013,180.0119633025049L763.0931593159316,180.90749849234447L764.6485148514852,178.83371440880947L767.2407740774077,179.11168646526593L770.6971197119713,183.5662762031185L770.7835283528352,186.91596309351337L768.9689468946895,190.78741753056084L768.7097209720971,195.33642861416087L767.6728172817282,201.18720406928364L764.0436543654366,206.3814721168209L763.2659765976598,208.80798762835374L759.9824482448245,212.82319223252546L756.6989198919892,216.70052438045127L755.1435643564357,218.66690267533332L751.9464446444645,220.55877557126573L750.477497749775,220.6141510344711L749.0085508550856,219.0020591462873L745.7250225022502,221.442972630523L745.3793879387939,222.4879892969014L745.0337533753376,221.9386479659898L745.0337533753376,220.28167058639386L746.2434743474347,220.17072210112838L746.5891089108911,216.30490123686508L745.9842484248425,213.39823330882354L748.0580558055806,212.18867200081195L750.9095409540953,212.82319223252546L752.5513051305131,209.45375633448378L753.3289828982898,205.60552130820957L754.2794779477947,204.3452288099114L755.575607560756,201.12594008049876L751.6008100810081,202.16466346682822L749.52700270027,203.56075645455982L745.8978397839784,203.56075645455982L744.8609360936093,200.20451677231728L742.0958595859587,197.59950952683076L737.8618361836184,196.4086486430101L736.9977497749776,192.7237559569143L736.1336633663366,190.39758995502177L735.2695769576958,188.69827640282813L733.8006300630063,184.77965518838667L731.640414041404,183.29547105711728L728.0976597659767,182.07153267704655L724.9005400540054,182.2079582513111L721.8762376237623,182.95636327010317L719.8888388838884,184.9139496067136L721.2713771377138,185.85110116197947L721.2713771377138,188.0402809491433L719.9752475247525,189.28836433998674L717.7286228622863,193.30055764813022L717.8150315031503,194.9564640802955L714.445094509451,197.3494534761862L711.507200720072,195.90487102356238L708.655715571557,196.2198972408838L707.4459945994599,194.9564640802955L705.9770477047705,194.57569183296442L702.4342934293429,197.2242956834936L699.3235823582359,197.7868251138115L697.0769576957696,198.72051156280753L694.0526552655265,198.09858804680016L691.8060306030603,198.16087635849604L690.423492349235,196.28283636048786L688.0040504050405,194.44858745717025L685.67101710171,194.0030088334122L682.560306030603,194.44858745717025L680.3136813681368,195.14654702258565L676.9437443744374,193.556314932557L676.4252925292529,190.72250612088013L673.6602160216021,189.74595266776618L671.413591359136,189.28836433998674L668.7349234923493,187.71035136624752L666.3154815481548,191.6936796812061L667.2659765976598,193.93926387588618L664.9329432943294,196.5343731221679L661.4765976597661,195.58929185082798L659.0571557155715,195.4629047643903L657.4153915391539,193.68405600223292L654.9095409540953,193.62019691342388L652.8357335733574,192.46679734886973L649.2065706570658,194.2577612749597L644.6269126912691,197.47452470287533L642.1210621062106,198.09858804680016L641.1705670567057,198.4098160266351L639.8744374437445,196.15693610788995L636.7637263726374,196.66000996426268L635.8132313231323,195.08320844257904L634.0850585058506,194.32139264703167L632.9617461746175,192.14507484232848L631.5792079207921,191.43522167626907L628.2092709270926,192.46679734886973L624.8393339333934,190.26745546447327L623.543204320432,192.27383390210363L618.1858685868588,182.34427520833L615.1615661566157,179.18110831934936L616.0256525652566,177.85720215219297L610.0634563456346,181.72999208955326L607.7304230423042,181.9349982646004L607.9032403240324,179.7354630164375L604.8789378937894,178.34616290360157L602.3730873087309,179.3198668409216L601.595409540954,175.03559341527992L597.2749774977498,174.1797770576441L595.1147614761477,175.8870596735955L589.0661566156616,177.43696350688433L587.9428442844285,178.41589916065436L578.9563456345635,179.87376938798988L577.8330333033304,181.25068585439408L579.561206120612,184.03916174647378L577.3145814581459,185.0481397027937L577.7466246624663,186.1179298013777L575.4135913591359,188.0402809491433L579.3019801980198,190.65757080112292L578.6971197119711,192.46679734886973L575.3271827182718,192.3381783808509L574.6359135913591,193.42848220662862L571.6116111611161,191.49987160392146L567.8096309630963,191.56449789869453L565.2173717371737,193.17254108029948L562.3658865886589,191.62910058349624L557.0949594959495,188.96078312490587L553.3793879387938,189.09188909145388L548.3676867686769,193.23656087644645L548.1084608460847,195.96792041940682L545.6026102610261,193.8117055915315L543.7016201620162,197.91159464262796L544.3928892889289,198.6584149311214L543.0103510351036,201.4320560037886L545.0841584158416,203.86286839185172L546.8123312331234,203.74208256703542L548.3676867686769,206.08340896083368L548.1084608460847,207.92384402521225L549.3181818181818,208.45482422620682L548.2812781278128,210.50577959598039L545.9482448244825,211.08775085823763L543.528802880288,214.6003221210255L545.6890189018902,217.77039585496163L545.5162016201621,220.0041849451904L548.1084608460847,223.85493503551055L546.6395139513952,225.10457373083807L546.2938793879388,225.91552348906498L545.1705670567057,225.69957845155324L543.528802880288,223.74591305596806L542.8375337533754,223.6368333940317L541.368586858686,222.9264027136926L540.5909090909091,221.60833184589683L538.4306930693069,220.89080140364553L536.9617461746175,221.38782300537295L536.529702970297,220.78018659295853L533.2461746174617,219.22518594324208L529.7034203420342,218.72280104501982L527.7160216021603,218.16311304457287L527.3703870387039,218.49911382282218L524.3460846084608,215.73834719923872L521.5810081008101,214.42904740387854L519.507200720072,212.4773480040127L521.2353735373538,211.89956442920467L523.2227722772277,209.04306602586445L521.9266426642664,207.6282107380623L525.469396939694,206.20269097005612L525.3829882988299,205.42599885737494L523.2227722772277,206.02373953113874L523.3091809180918,204.46562391102202L524.518901890189,203.4397739184806L526.8519351935194,203.19757188673648L527.2839783978397,201.98178448794098L526.6791179117912,199.95801893220224L527.7160216021603,198.09858804680016L527.6296129612962,196.9737197450178L524.0868586858686,195.77870585634722L522.7043204320432,195.84179950955343L521.2353735373538,194.06673103029038L519.4207920792079,194.63921016200442L516.3964896489649,193.3645314174878L516.3964896489649,192.59532314766125L515.532403240324,190.91716871271413L513.6314131413142,190.72250612088013L513.4585958595859,189.5499894361011L514.0634563456346,188.76393999232982L512.508100810081,186.58389468654332L510.0022502250225,186.91596309351337L509.31098109810983,186.71679818728148L508.7061206120612,187.64429050826692L507.75562556255625,187.44595760673127L507.2371737173717,184.98105768197576L506.63231323132317,183.6339108970224L507.06435643564356,183.29547105711728L509.0517551755176,183.43092695796432L510.0022502250225,182.54854746833615L509.31098109810983,181.45626751637045L507.66921692169217,180.7700299489325L507.8420342034203,180.0119633025049L506.8051305130513,179.25050176813875L505.3361836183619,176.52283749107943L505.8546354635464,175.39089652644353L505.5954095409541,173.4632337235406L503.26237623762376,172.45487089233887L501.96624662466246,172.95981554235448L501.6206120612061,171.87590744308633L499.11476147614763,170.78487647501893L498.33708370837087,168.21078130379325L498.1642664266427,166.12210023616785L496.9545454545455,165.0676780737706L497.9914491449145,163.6256809293397L497.3001800180018,159.37769990307382L499.02835283528356,156.69451978115663L498.6827182718272,155.89671675537193L501.3613861386139,153.23527613062217L498.85553555355534,150.94156345058235L504.0400540054005,144.62793771916705L506.2002700270027,141.6795898958228L507.15076507650764,138.9417050136512L503.6080108010801,135.33567306188502L504.5585058505851,131.73634608360481L502.3982898289829,127.66696311076589L504.0400540054005,122.69459803733355L501.1885688568857,115.90242527803471L503.4351935193519,111.16100955566156L499.8060306030603,106.92578933754027L500.15166516651664,102.22494747933351L502.0526552655266,101.65520645108609L506.11386138613864,98.88929153577837L508.61971197119715,96.54386571374357L512.5945094509451,100.62407917843029L519.1615661566157,102.22494747933351L528.2344734473447,109.65455160915099L530.0490549054905,112.65235124958517L530.2218721872187,116.83289503523793L527.5432043204321,119.9943070289809L523.6548154815482,121.50044620130856L512.9401440144014,117.03888240877046L511.1255625562556,117.75761419487577L515.0139513951394,122.09870544644716L515.1867686768677,124.85961817895404L515.3595859585959,130.61159751557585L518.470297029703,132.2956283051853L520.3712871287129,133.68494947449162L520.6305130513051,131.08125076146936L519.1615661566157,128.62308865089773L520.7169216921692,126.51160509661162L526.506300630063,130.04609707786514L528.580108010801,128.62308865089773L526.9383438343834,124.46827969300094L532.554905490549,118.67665985920965L534.7151215121512,119.08332330616975L536.9617461746175,121.10028165133346L538.3442844284428,117.03888240877046L536.3568856885688,113.39245557575583L537.5666066606661,109.54636023391643L535.7520252025203,105.59789615859665L542.491899189919,107.58529173646741L543.8744374437443,111.26803135407317L540.8501350135014,112.01503467470823L540.8501350135014,115.48701678368161L542.7511251125113,117.55261404138665L546.4666966696669,116.21322564095416L547.0715571557156,112.22777693341473L552.0832583258326,109.22131186509304L560.4648964896489,103.69604031688769L562.1930693069307,104.03344815059697L559.8600360036004,107.91394432109536L562.8843384338434,108.67797625114179L564.526102610261,106.37394927136842L569.0193519351935,106.2633337010464L572.6485148514852,103.47067204937625L575.3271827182718,107.47557855136589L578.0922592259226,103.13197225045968L575.5864086408641,99.12178413928535L576.7961296129613,96.89808151434988L583.8816381638164,99.00558387473714L587.2515751575158,101.08325075265583L595.8924392439244,108.67797625114179L597.534203420342,105.2640501024834L595.1147614761477,101.76933124095805L595.0283528352836,100.27875678068375L592.0904590459046,99.5856675638093L592.9545454545455,96.30724493071665L591.6584158415842,90.7564835487866L591.57200720072,88.40065454872118L595.9788478847885,81.61967953828972L597.534203420342,74.36742477857928L599.3487848784878,72.84428565579111L605.7430243024303,74.91732006623096L606.1750675067507,79.37562253581532L603.9284428442844,85.62429130500988L605.3973897389739,88.02516935547044L606.1750675067507,93.07482286591505L605.6566156615662,102.5657366842442L608.3352835283529,106.59493245629673L607.2983798379838,110.94673448038645L602.545904590459,119.69125952529154L605.3109810981098,120.49803169925082L606.2614761476148,118.37093699514227L608.9401440144015,116.83289503523793L609.5450045004501,113.81372751148439L611.6188118811881,110.73214996190384L610.2362736273627,107.14595020389925L611.3595859585959,102.79249215574663L608.6809180918092,102.22494747933351L608.1624662466247,98.4231983060663L610.0634563456346,91.37015564282055L606.9527452745274,85.36924189403595L611.2731773177318,80.17162770597562L610.6683168316831,74.50509568141615L611.8780378037804,74.22962204915558L613.1741674167416,78.70891674486143L612.2236723672368,86.1330490403715L614.7295229522953,87.52300880819757L613.6926192619262,82.01209906472877L617.6674167416743,78.9759686355373L622.6791179117912,78.5752052929609L627.0859585958596,83.05337814467993L624.9257425742574,76.5545176988901L624.7529252925292,67.74345448224187L628.9005400540054,66.00204792351968L634.6899189918992,66.29375671334054L639.8744374437445,65.2701646512092L637.8870387038704,60.64691793964789L640.7385238523852,54.609389169807L643.4171917191719,54.29276435917882L648.0832583258325,49.620648934698636L654.477497749775,48.3042731572657L655.2551755175518,45.63429186776841L661.56300630063,44.61993690029527L663.5504050405041,46.97556770751652L668.9077407740774,41.532527556050354L673.3145814581458,41.70582892382953L674.0058505850584,37.30825529512572L676.2524752475248,32.76931573850999L681.9554455445544,28.07935428495199L686.1030603060306,31.657882585203026L682.8195319531953,34.42020705565261L688.2632763276328,36.05199975791999L688.8681368136813,41.1852865099537L691.0283528352836,38.73042298696788L698.1138613861385,38.90719144927493L703.471197119712,43.93964182140621L705.458595859586,47.641476524448024L704.8537353735373,52.53861527685086L702.1750675067508,55.39788255123415L695.8672367236724,60.495260856981076L694.0526552655265,63.05177778944369L697.0769576957696,64.23919819262431L700.6197119711971,66.43938854853667L702.7799279927993,64.82923131547L703.9896489648964,70.31652716251199L705.0265526552655,68.17551896740838L708.8285328532852,66.73020866938424L716.6053105310532,68.17551896740838L717.1237623762377,72.14657999700836L727.1471647164716,73.40002243297448L727.3199819981998,66.87539758004675L732.4180918091809,68.4628401424111L736.2200720072008,68.3192515350915L740.1084608460847,72.84428565579111L741.2317731773177,77.90478329965237L739.7628262826283,81.22619246991087L742.7871287128712,87.27127627172709L746.5891089108911,90.26367794786566L748.9221422142216,82.4034571326967L752.7241224122413,85.75164806382554L756.8717371737174,83.70039501642853L761.4513951395139,86.00602672497931L763.2659765976598,83.95839471979716L767.1543654365437,84.98582491658496L765.4261926192619,77.77032425132091L768.6233123312331,74.36742477857928L790.3118811881188,79.50859507414287L792.3856885688568,84.08722249877451L798.6071107110711,89.76919900881015L808.2848784878488,88.40065454872118L813.1237623762377,89.64531640007687L815.1111611161117,92.58980426468537L814.7655265526552,97.83849123548279L817.7898289828984,99.70140978577146L820.9869486948696,98.30644324431648L825.2209720972098,98.18959516512626L829.7142214221423,99.46983404264645L834.2938793879388,98.77290696621208L838.527902790279,104.70595726686062L841.465796579658,102.5657366842442L839.4783978397841,98.30644324431648L840.6017101710172,95.1183683539723L848.2056705670568,97.1337503764262L853.2173717371737,96.66203286626069L860.1300630063006,100.04809019351964L863.5,102.90536428702057L863.5,127.47535017383447ZM-0.49999999999994316,102.90536428702057L-0.4995679999999538,102.90573912525576L-0.49999999999994316,127.47501346561134L-0.49999999999994316,127.47501346561134L-0.49999999999994316,127.47535017383447L-0.49999999999994316,102.90536428702057ZM683.6836183618362,21.038745762906615L670.1174617461746,25.577392567312245L674.5243024302431,9.767860756727146L676.511701170117,8.23812145427496L678.3262826282628,9.114304581553768L684.3748874887489,16.140962573700165ZM554.2434743474348,-8.304578019269343L551.0463546354636,-6.339560943422214L548.8861386138615,-5.367339435195049L548.540504050405,-2.9660226373887326L545.6890189018902,-0.6053267670230298L543.0967596759676,-3.921595656569707L544.479297929793,-8.552164000437187L539.1219621962197,-9.048659141916119L543.7880288028803,-11.558018634970779L547.503600360036,-11.811458190092367L547.9356435643564,-7.810721317822754L549.3181818181818,-11.305039297064582L551.564806480648,-13.85574840431292L555.1939693969397,-10.548845729096058ZM671.3271827182718,14.048640740920575L666.1426642664267,15.724989041685944L659.4027902790278,12.138463909159668L655.42799279928,7.135120042323024L653.6134113411341,-2.4906786898123983L650.3298829882989,-5.367339435195049L656.5513051305131,-15.408904000346126L661.7358235823582,-19.10178233996811L666.4018901890188,-11.305039297064582L671.9320432043205,2.4050963733646427Z"
                        className="datamaps-subunit RUS"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M506.11386138613864,98.88929153577837L502.0526552655266,101.65520645108609L500.15166516651664,102.22494747933351L501.1021602160216,97.48654441743284L498.0778577857786,94.64009879011499L494.3622862286229,97.01596333710182L493.1525652565257,102.11117556481904L490.9059405940594,105.04106606382928L488.3136813681368,103.47067204937625L485.1165616561657,103.80859539613601L482.52430243024304,100.1634687538521L481.05535553555353,101.99731565110304L479.5864086408641,102.22494747933351L479.24077407740776,106.59493245629673L474.6611161116112,105.59789615859665L474.0562556255626,109.22131186509304L471.72322232223223,109.11280391084321L470.1678667866787,113.60324038324165L467.74842484248427,120.39742175078939L464.03285328532854,128.52774640847545L464.8969396939694,130.4233304242646L464.03285328532854,132.66734932717293L461.6998199819982,132.5745037594359L460.14446444644466,137.59931373138457L460.3172817281728,144.5420133792097L461.78622862286227,147.01483813330282L461.0085508550855,152.82811246882906L459.0211521152116,156.05659642530702L457.98424842484246,158.7503874794753L456.34248424842485,155.89671675537193L451.5900090009001,161.32244873840847L448.3928892889289,162.32453809096788L445.1093609360936,160.00257582550321L444.24527452745275,155.01450334864876L443.467596759676,143.59370798680075L445.7142214221422,140.272533317593L452.0220522052205,135.88199268320187L456.7745274527453,130.2348304925676L461.18136813681366,122.29759825358528L466.8843384338434,110.40969085467435L470.94554455445547,105.59789615859665L477.5126012601261,97.1337503764262L482.7835283528353,94.04005277766885L486.7583258325833,94.40037595556083L490.3874887488749,88.40065454872118L494.7943294329433,88.77517259648562L499.11476147614763,87.27127627172709L506.63231323132317,92.58980426468537L503.521602160216,94.52028651983065ZM490.81953195319534,26.351977277935703L485.462196219622,30.912027140264513L481.2281728172817,28.46035315327748L482.8699369936994,25.383077929911394L481.48739873987404,21.639124452066937L486.4126912691269,19.4250706229285L487.36318631863185,23.818816089547738ZM475.2659765976598,3.545895049444823L483.2155715571557,13.202886892215531L477.16696669666965,17.997723780750334L475.87083708370835,26.737675835029563L473.71062106210627,28.840323520492575L472.5873087308731,37.84324765875374L469.6494149414941,38.19878668824049L464.5513051305131,31.657882585203026L466.71152115211527,27.697321198781538L463.0823582358236,24.40745598984421L458.41629162916297,14.259284010857641L456.6017101710171,4.225931057366836L463.0823582358236,-0.6053267670230298L464.464896489649,3.9996198051040324L467.83483348334835,3.9996198051040324L468.78532853285327,-0.8396080448014231L472.24167416741676,-1.309353283852488ZM492.547704770477,-6.339560943422214L497.3001800180018,-1.309353283852488L493.7574257425743,6.023352124608152L486.7583258325833,7.577364698749761L479.67281728172816,5.352024135857391L479.24077407740776,1.716119568488864L475.7844284428443,1.485703504138712L473.1921692169217,-4.883758170608985L480.62331233123314,-9.048659141916119L484.07965796579657,-5.609760208352327L486.499099909991,-9.796733814227366Z"
                        className="datamaps-subunit NOR"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M319.2983798379838,-42.6392616361893L327.3343834383438,-54.191345884147836L335.71602160216025,-53.50462820045061L338.8267326732673,-60.89088010390651L347.2947794779478,-63.07571593665426L366.477497749775,-60.53007116125622L381.5126012601261,-44.552471794014366L377.0193519351935,-37.3575914564106L367.8600360036004,-36.446053916069445L354.89873987398744,-34.94000576154417L356.1084608460846,-31.683120582970048L364.6629162916292,-33.746824306841745L371.83483348334835,-27.645500849250027L376.500900090009,-32.85862096516229L378.48829882988304,-26.795356205834253L375.8960396039604,-17.507106374100715L382.03105310531055,-23.44584903051657L393.6962196219622,-29.938320425881898L400.8681368136814,-26.513126626993312L402.16426642664266,-19.637428628011378L392.4000900090009,-8.80019051059162L391.01755175517553,-5.367339435195049L383.4135913591359,-2.9660226373887326L388.9437443744374,-2.2536124399313735L386.1786678667867,7.577364698749761L384.1912691269127,15.724989041685944L384.27767776777677,28.840323520492575L387.12916291629165,35.87161852983587L383.4135913591359,36.41207210466666L379.43879387938796,39.787732028589346L383.93204320432045,45.128022286887926L384.4504950495049,53.338639253694794L381.8582358235824,54.29276435917882L384.96894689468945,62.00463036272953L379.6980198019802,62.753375061120096L382.463096309631,66.29375671334054L381.68541854185423,69.17863426207384L378.3154815481548,70.59959623242543L374.94554455445547,70.59959623242543L377.9698469846985,76.1469593536072L377.9698469846985,79.64144529395017L373.2173717371737,76.41879294901162L372.0076507650765,78.44136984867151L375.2047704770477,80.43599111553758L378.40189018901896,85.11374323616369L379.2659765976598,91.1249968271672L375.03195319531955,92.46829731521316L373.13096309630964,89.76919900881015L370.19306930693074,85.49682265105972L371.0571557155716,90.51028916446842L368.2056705670567,94.28036692540937L374.513501350135,94.52028651983065L377.8834383438344,94.87942913411615L371.4027902790279,100.96859222479239L364.9221422142214,106.15263530092079L357.9230423042304,108.46008314524991L355.24437443744375,108.46008314524991L352.73852385238524,110.94673448038645L349.45499549954997,117.45000863985007L344.2704770477048,121.70013018788524L342.6287128712871,121.89954967986736L339.431593159316,123.38684221811101L335.9752475247525,124.66407557994071L333.9014401440145,128.24136027247295L333.9014401440145,132.1094282742811L332.60531053105314,135.7001018786601L328.71692169216925,139.9187636522995L329.6674167416742,144.02547109823846L328.6305130513052,148.1107981942393L327.4207920792079,152.90962884012495L324.0508550855086,153.23527613062217L320.50810081008103,149.1991655091159L315.66921692169217,149.1991655091159L313.3361836183619,146.5064155904285L311.7808280828083,141.50440434310832L307.54680468046803,134.97037745594807L306.33708370837087,131.36235024071556L306.07785778577863,126.31818656860551L302.7079207920792,121.00007399381485L303.57200720072007,116.52338125598175L302.01665166516653,114.3386489662148L304.34968496849683,106.92578933754027L307.97884788478854,104.48212797006283L308.92934293429346,101.65520645108609L309.447794779478,96.30724493071665L306.6827182718272,98.77290696621208L305.3865886588659,99.8170608624294L303.22637263726375,100.73900658765578L300.2884788478848,98.53986050852572L300.11566156615663,93.79934269259098L301.0661566156616,90.01664839871455L303.22637263726375,89.89297627843101L308.15166516651664,91.73712249367975L304.0040504050405,87.14524623946826L301.93024302430246,84.60139147082123L299.5108010801081,85.62429130500988L297.52340234023404,83.70039501642853L300.2020702070207,76.41879294901162L298.73312331233126,73.40002243297448L296.83213321332136,67.59914304848292L293.8942394239424,58.35495857569475L290.8699369936994,54.76743774220171L290.8699369936994,50.76254762682453L284.475697569757,45.128022286887926L279.3775877587759,44.280197880476805L272.98334833483347,44.78950128071148L267.1075607560756,45.465736271323635L264.34248424842485,42.224462824787054L260.10846084608465,35.69100645934918L266.4162916291629,32.214694726022L271.2551755175518,31.657882585203026L260.9725472547255,28.840323520492575L255.61521152115213,24.211516469973105L255.8744374437444,19.627797361374974L265.0337533753376,13.837680370951603L273.76102610261023,7.577364698749761L274.7115211521152,2.862534015676772L268.23087308730874,-2.2536124399313735L270.3046804680468,-7.810721317822754L278.6863186318632,-18.30215988968348L282.14266426642666,-20.17514535932304L281.10576057605766,-27.36154094200839L286.80873087308726,-31.976063984058555L294.23987398739877,-34.64074742905217L301.5846084608461,-34.94000576154417L304.1768676867687,-29.361557795832255L310.57110711071107,-39.1988321630987L316.27407740774083,-32.56381151639624L319.64401440144013,-31.099081343730802L324.6557155715572,-25.669860852447187L318.9527452745275,-34.94000576154417Z"
                        className="datamaps-subunit GRL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M198.32628262826285,270.1630635568817L197.462196219622,272.50229264272616L197.03015301530158,274.4240115216798L196.8573357335734,277.9263231483944L196.5981098109811,279.2032115477175L197.03015301530158,280.6069635930904L197.80783078307834,281.8745111071338L198.23987398739877,283.8330254969187L199.8816381638164,285.7385530938708L200.4000900090009,287.2048587914658L201.35058505850586,288.45145030699507L203.85643564356437,289.13766083494556L204.89333933393343,290.2076931566124L206.96714671467146,289.4803568271549L208.7817281728173,289.22336024735495L210.59630963096313,288.75180252507084L212.15166516651666,288.32266315105466L213.62061206120615,287.2909497232137L214.22547254725472,285.8249523873804L214.3982898289829,283.6593380734705L214.83033303330336,282.9202968267899L216.472097209721,282.22342635509415L218.9779477947795,281.6562750143876L221.13816381638162,281.7435846505087L222.60711071107113,281.5252724628635L223.12556255625566,282.0490089964143L223.03915391539155,283.31173006226936L221.74302430243029,284.83023750651057L221.22457245724578,286.38609997863284L221.6566156615662,286.81722831537905L221.31098109810986,287.9360669061252L220.7061206120612,289.9083477952055L220.10126012601262,289.2662035885282L219.5828082808281,289.30904269245235L219.15076507650767,289.30904269245235L218.2866786678668,290.8484668787757L217.85463546354637,290.54955400821433L217.50900090009003,290.6776840390847L217.5954095409541,291.0191846096612L215.34878487848786,291.0191846096612L213.1021602160216,291.0191846096612L213.1021602160216,292.4251589884678L211.9788478847885,292.4251589884678L212.92934293429343,293.2751852660139L213.7934293429343,293.8692933814825L214.05265526552657,294.37794273952727L214.484698469847,294.5473736808648L214.3982898289829,295.393649545L211.28757875787582,295.393649545L210.16426642664268,297.4189039547114L210.50990099009906,297.92397740323224L210.2506750675068,298.47059722874L210.16426642664268,299.2265397858414L207.3991899189919,296.53384501225815L206.1894689468947,295.7317549230623L204.2020702070207,295.0553138605807L202.90594059405944,295.2668007707269L201.0049504950495,296.1962778097472L199.79522952295233,296.44947419470844L198.06705670567058,295.77400201152255L196.25247524752479,295.30908730118597L194.00585058505854,294.16607072859745L192.19126912691272,293.82688163427457L189.51260126012605,292.63781057979605L187.52520252025204,291.4456959736185L186.92034203420343,290.7630836155415L185.53780378037806,290.63497812212995L183.11836183618365,289.8227830978232L182.08145814581462,288.6660091363698L179.489198919892,287.2048587914658L178.27947794779482,285.60891949239203L177.7610261026103,284.3536251765347L178.53870387038705,284.13679265824646L178.27947794779482,283.39866130822077L178.8843384338434,282.70266144646223L178.8843384338434,281.83087401462006L178.02025202520255,280.65074420266325L177.8474347434744,279.64246596861074L177.0697569756976,278.32308901665897L174.9095409540954,275.7138317761899L172.49009900990103,273.66559807920237L171.3667866786679,272.0088744789745L169.29297929792983,270.9296968402844L168.86093609360938,270.2984868298198L169.20657065706575,268.624159400664L167.99684968496848,268.0337302350355L166.52790279027903,266.71249135175793L165.92304230423048,264.8345664681231L164.7133213321332,264.6047348750741L163.2443744374438,263.1757283409104L162.12106210621067,261.8324802911767L162.03465346534654,260.9489706292379L160.73852385238524,258.89217998502625L159.8744374437444,256.7725990383251L159.96084608460848,255.6827899627977L158.2326732673268,254.58849193677943L157.3685868586859,254.68382870643998L156.0724572457246,253.9201622463055L155.6404140414042,255.06483087143016L156.0724572457246,256.39403871616827L156.24527452745275,258.5165689969688L157.10936093609365,259.641867632512L158.92394239423942,261.55377532723946L159.2695769576958,262.20366218949636L159.6152115211521,262.38907205416496L159.96084608460848,263.31432710778085L160.39288928892893,263.2681349092083L160.9113411341134,265.018302585601L161.6026102610261,265.7062976373846L162.12106210621067,266.66682843047556L163.59000900090012,268.0337302350355L164.45409540954097,270.5240633228766L165.1453645364537,271.6944887875898L165.83663366336634,272.95020626833093L165.92304230423048,274.3348759497841L167.04635463546356,274.4240115216798L168.08325832583262,275.62503614757924L168.94734473447346,276.77758908341997L168.86093609360938,277.264052628148L167.82403240324032,278.1908831015543L167.39198919891987,278.1908831015543L166.78712871287132,276.6005241481915L165.2317731773178,275.13624519111244L163.50360036003605,273.8442040258185L162.29387938793877,273.1739333507812L162.38028802880285,271.24483256696675L161.94824482448246,269.801649753812L160.82493249324932,268.94161517430217L159.1831683168317,267.7608407509734L158.83753375337534,268.1246393667461L158.2326732673268,267.39660810988846L156.76372637263728,266.7581473525461L155.3811881188119,265.20192432973L155.55400540054006,264.97237929431935L156.50450045004504,265.15602959439286L157.45499549954997,264.1445305581696L157.5414041404141,262.8983308056272L155.6404140414042,260.9489706292379L154.25787578757883,260.1561029416788L153.39378937893792,258.46958140647274L152.44329432943294,256.630701525501L151.4063906390639,254.39771451509282L150.36948694869488,251.80843137626846L153.1345634563457,251.61559337467162L156.15886588658867,251.27777562951687L155.9860486048605,251.85661814524474L159.52880288028803,253.2501166065658L165.05895589558958,255.20756492603508L169.81143114311436,255.20756492603508L171.71242124212426,255.20756492603508L171.71242124212426,254.063519516773L175.86003600360038,254.063519516773L176.72412241224126,255.01723570438668L178.02025202520255,255.92008382534104L179.40279027902793,257.15062676247123L180.1804680468047,258.61051999215397L180.7853285328533,260.10939354542825L182.08145814581462,260.9489706292379L184.0688568856886,261.786048473569L185.53780378037806,259.5950716981583L187.52520252025204,259.5482678562728L189.1669666966697,260.6693912031846L190.3766876687669,262.5280505691161L191.24077407740774,264.1445305581696L192.62331233123314,265.7062976373846L193.14176417641764,267.57877887549296L193.83303330333032,268.8509467487108L195.73402340234026,269.6660122271381L197.462196219622,270.2533521984983Z"
                        className="datamaps-subunit MEX"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M278.6863186318632,207.92384402521225L280.414491449145,208.3958997711311L282.6611161116112,208.33695701839747L281.451395139514,209.7465661237165L280.58730873087313,209.9804912462863L277.56300630063004,208.51373040012103L276.9581458145815,207.3321146046066L277.82223222322233,206.26230358405002ZM283.1795679567957,198.84464125228448L281.9698469846985,198.90667434981555L278.8591359135914,197.7244081109242L276.61251125112517,195.96792041940682L277.47659765976596,195.65245204808235L280.67371737173715,196.59720248747035L283.09315931593164,198.16087635849604ZM135.07515751575158,201.00335076400177L133.86543654365443,201.49321807684308L129.8906390639064,199.83464526086013L129.19936993699372,198.53415799432338L127.03915391539158,197.2242956834936L126.60711071107113,196.2198972408838L124.18766876687675,195.52610942998513L123.23717371737172,193.49241003763376L123.40999099909993,192.59532314766125L126.00225022502258,193.42848220662862L127.47119711971203,194.0030088334122L129.71782178217825,194.385001367212L130.495499549955,195.71559004288517L131.70522052205223,197.47452470287533L134.1246624662466,198.96868630899496ZM296.7457245724572,192.91623120736088L295.1903690369037,196.2198972408838L296.7457245724572,194.9564640802955L298.38748874887494,195.71559004288517L297.52340234023404,197.0363963250609L299.68361836183624,198.03627833702694L300.72052205220524,197.1616842737648L303.1399639963997,198.2853888681308L302.448694869487,200.9420253982747L304.0904590459046,200.3276412510745L304.4360936093609,202.28648215269843L305.12736273627365,204.46562391102202L304.1768676867687,207.56902860609387L303.0535553555356,207.6873743562166L301.498199819982,207.0355535251789L302.01665166516653,204.16449012926705L301.32538253825385,203.6816601976355L298.5603060306031,206.797968481941L297.0913591359136,206.67906352719456L298.81953195319534,205.00644218372824L296.486498649865,204.16449012926705L293.8942394239424,204.3452288099114L289.22817281728175,204.22475585048542L288.8825382538254,203.19757188673648L290.3514851485149,201.92078450042072L289.3145814581458,200.9420253982747L291.3883888388839,198.72051156280753L293.8078307830783,192.7879375464925L295.3631863186319,190.65757080112292L297.43699369936996,189.28836433998674L298.5603060306031,189.4846197226698L298.0418541854186,190.5276283381772ZM112.9545454545455,179.7354630164375L115.28757875787585,179.3892035669444L114.59630963096316,183.97168615157028L116.67011701170117,187.18116204715534L115.71962196219619,187.18116204715534L114.25067506750685,185.38315990157727L113.38658865886583,183.5662762031185L112.17686768676867,182.27613029319136L111.74482448244828,180.49475973195345L111.8312331233123,179.18110831934936ZM241.2713771377138,142.6395940909346L240.3208820882088,145.3136353150068L239.2839783978398,144.88542729226944L238.59270927092712,143.42066714553062L238.76552655265527,143.07400747364125L239.62961296129615,141.50440434310832L240.66651665166518,141.59202183547336ZM234.9635463546355,139.83019475338008L232.11206120612061,142.6395940909346L230.470297029703,142.55256562499795L229.95184518451848,141.15343878182364L231.6800180018002,138.76339253683832L234.9635463546355,138.76339253683832ZM227.10036003600362,123.5840442389619L227.53240324032404,126.12452080088647L228.82853285328534,125.2499464005038L230.21107110711074,126.70477708272244L232.80333033303333,128.62308865089773L235.5684068406841,130.4233304242646L235.74122412241226,133.03816905340136L237.55580558055806,132.5745037594359L239.2839783978398,134.4207986451304L237.12376237623764,136.06366851656676L233.4081908190819,134.78740315665638L232.02565256525654,132.38864332521663L229.69261926192624,135.24443060274933L226.23627362736275,138.04807630264312L225.45859585958598,134.8789175750227L222.1750675067507,135.42686134687065L224.24887488748877,132.66734932717293L224.5945094509451,128.33688230286094L225.37218721872188,123.09055509485802ZM249.39378937893792,114.65271742891628L246.71512151215123,114.96612629147057L246.11026102610262,111.90854935783597L247.14716471647165,108.2418691660688L249.39378937893792,107.36578398789467L251.20837083708375,109.22131186509304L251.29477947794783,111.90854935783597L250.94914491449146,112.75830588755073ZM201.95544554455446,101.99731565110304L200.486498649865,104.37008587703673L197.20297029702974,102.3386315404804L195.30198019801983,103.01889910903097L192.01845184518456,100.04809019351964L194.09225922592262,97.83849123548279L195.73402340234026,94.87942913411615L198.32628262826285,96.78010474519738L199.79522952295233,98.07265390995067L200.486498649865,99.35390906800723ZM270.39108910891093,212.82319223252546L268.8357335733574,210.91334454964527L268.8357335733574,206.14305943472505L267.71242124212426,205.12641160334098L266.1570657065707,205.72510744072298L265.29297929792983,204.76627196833377L263.478397839784,207.45060873365776L262.7871287128713,210.1557475159096L261.9230423042304,211.72589193302372L260.8861386138614,212.24644166550814L260.10846084608465,212.41964723679575L259.84923492349236,213.28336112598296L255.44239423942398,213.28336112598296L251.81323132313233,213.28336112598296L250.7763276327633,213.91432114098706L248.1840684068407,216.30490123686508L247.92484248424844,216.5875699071758L247.14716471647165,217.8826797306623L244.9005400540054,217.8826797306623L242.56750675067508,217.8826797306623L241.53060306030605,218.44315291209037L241.8762376237624,219.05786411197755L242.04905490549058,220.0597126052263L242.04905490549058,220.39255816674108L238.93834383438346,222.04863451302197L236.43249324932495,222.5428423219529L233.66741674167417,224.23605914253358L233.06255625562557,224.23605914253358L232.19846984698472,223.74591305596806L231.93924392439246,223.30924732093465L232.02565256525654,222.98113852341493L232.54410441044107,221.82860207418366L233.66741674167417,220.0041849451904L234.3586858685869,218.05098702873687L233.92664266426644,215.17015897485402L233.4081908190819,212.130885073413L230.90234023402343,210.50577959598039L231.16156615661566,209.86356446648728L230.81593159315935,209.45375633448378L230.12466246624666,209.45375633448378L229.69261926192624,208.92556312682575L229.51980198019805,208.1010027002984L229.0877587758776,208.45482422620682L228.48289828982902,208.33695701839747L228.5693069306931,207.98291532502103L228.05085508550854,207.6282107380623L227.79162916291634,206.73852538817283L225.97704770477048,205.60552130820957L223.98964896489653,204.40543608383908L221.6566156615662,203.01571244994744L219.40999099909993,201.73766329261505L217.24977497749776,202.77295504568906L216.472097209721,202.77295504568906L213.53420342034207,201.85976431783374L211.54680468046806,202.3473613614042L209.21377137713773,201.18720406928364L206.7943294329433,200.6350907325153L205.1525652565257,200.38917244775467L204.3748874887489,199.77292716937572L203.94284428442847,197.7868251138115L203.1651665166517,197.7868251138115L203.0787578757876,199.21652315803857L198.15346534653466,199.21652315803857L189.94464446444647,199.21652315803857L181.82223222322233,199.21652315803857L174.5639063906391,199.21652315803857L167.39198919891987,199.21652315803857L160.30648064806485,199.21652315803857L152.96174617461753,199.21652315803857L150.62871287128718,199.21652315803857L143.5432043204321,199.21652315803857L136.71692169216925,199.21652315803857L136.37128712871288,199.21652315803857L131.70522052205223,195.58929185082798L129.97704770477054,193.93926387588618L125.65661566156615,192.4024995222622L124.36048604860491,188.96078312490587L124.61971197119715,186.58389468654332L121.59540954095417,184.9139496067136L121.16336633663366,181.66160203839132L118.22547254725475,178.6945571843274L118.22547254725475,176.59333131078128L119.52160216021599,174.53689940530018L119.52160216021599,171.87590744308633L115.37398739873987,169.1715702501287L112.9545454545455,164.0824301242317L111.48559855985599,160.85784281518409L109.23897389738977,158.7503874794753L107.59720972097216,156.85360365591134L106.38748874887489,154.3698120508261L103.96804680468045,155.97667660220924L101.63501350135016,158.59317602746808L99.47479747974796,155.49631551407913L97.83303330333035,153.3978495582968L95.50000000000006,152.09257269143393L93.08055805580557,151.92865458465414L93.08055805580557,121.50044620130856L93.1669666966697,97.83849123548279L97.57380738073812,99.46983404264645L101.37578757875792,102.79249215574663L103.88163816381643,103.35785857810501L105.9554455445545,100.62407917843029L108.8933393339334,98.4231983060663L112.43609360936097,99.2378924852338L116.06525652565256,96.18879097054199L119.9536453645365,94.52028651983065L121.68181818181819,97.36904075463906L123.40999099909993,95.71401413984279L123.9284428442844,92.46829731521316L125.65661566156615,93.19582610696096L129.71782178217825,99.46983404264645L132.91494149414945,94.75981293787069L133.17416741674174,100.04809019351964L136.11206120612064,98.88929153577837L137.06255625562557,96.89808151434988L140.00045004500453,97.25144279488649L143.62961296129617,100.1634687538521L149.2461746174618,102.67915805676978L152.52970297029702,103.80859539613601L154.9491449144915,103.35785857810501L158.14626462646265,106.70530033696673L154.77632763276335,109.87069798552847L159.09675967596763,111.26803135407317L165.5774077407741,110.5172550300284L167.65121512151217,109.32974048682388L170.15706570657068,113.18137217205646L172.83573357335734,109.97865323482782L170.32988298829883,107.25590791564395L171.88523852385242,105.04106606382928L174.82313231323133,104.70595726686062L176.72412241224126,104.03344815059697L178.71152115211524,105.59789615859665L181.13096309630964,109.11280391084321L183.80963096309634,108.569069743614L188.04365436543654,111.4818440740012L191.7592259225923,110.5172550300284L195.21557155715576,110.62474135844963L194.95634563456346,106.59493245629673L197.11656165616566,105.48669795842281L200.83213321332133,107.69492367330474L200.83213321332133,113.70852110011779L202.30108010801084,108.67797625114179L204.2884788478848,108.7868027949512L205.32538253825385,102.22494747933351L202.73312331233126,98.07265390995067L199.96804680468048,95.23769171744331L200.14086408640867,87.27127627172709L202.99234923492352,81.75060436140228L206.1894689468947,82.9236271517785L208.60891089108915,86.2599602867408L211.8924392439244,94.52028651983065L209.73222322232226,97.95561931984875L214.22547254725472,99.35390906800723L214.13906390639065,106.15263530092079L217.42259225922595,100.96859222479239L220.27407740774078,105.2640501024834L219.496399639964,110.08653002316433L221.82943294329436,114.3386489662148L224.33528352835287,109.7626641516147L226.14986498649864,104.14574610679003L226.23627362736275,96.66203286626069L229.69261926192624,97.25144279488649L233.23537353735375,98.18959516512626L236.43249324932495,101.65520645108609L236.60531053105314,104.9294476340483L234.79072907290734,108.35101632863746L236.51890189018903,111.80198775814932L236.1732673267327,114.86172977331586L231.507200720072,119.08332330616975L228.13726372637268,119.9943070289809L225.63141314131414,118.16677483753779L224.94014401440145,121.2004226034673L222.60711071107113,126.12452080088647L221.91584158415844,128.62308865089773L219.15076507650767,132.38864332521663L215.6944194419442,132.76013856411132L213.7934293429343,135.0617828723692L213.62061206120615,138.49553723013628L210.8555355535554,139.11981193561206L207.91764176417644,143.33407456794544L205.32538253825385,149.0322137356178L204.3748874887489,152.82811246882906L204.2884788478848,158.35706989618083L207.74482448244825,159.14274447956856L208.8681368136814,163.39682411337174L209.9914491449145,166.79636908768475L213.36138613861388,165.89672492184766L217.7682268226823,167.8397475769472L220.1876687668767,169.46607369145212L221.91584158415844,171.51302755647907L224.94014401440145,172.74359827231496L227.44599459945997,174.46553593008264L231.42079207920793,174.75080736359024L234.01305130513052,175.17780506255204L233.66741674167417,178.764150087509L234.3586858685869,182.82053237272552L236.1732673267327,187.24739869283366L239.71602160216023,190.91716871271413L241.53060306030605,189.68065588485547L242.82673267326734,185.65070973083473L241.61701170117016,179.3198668409216L239.88883888388838,177.15622179301212L243.7772277227723,175.17780506255204L246.45589558955896,172.2379959206738L247.83843384338437,169.24524544343944L247.57920792079207,166.27217804849602L245.93744374437446,162.4781566117464L243.08595859585964,159.0643496600015L245.85103510351038,154.1273779665349L244.81413141314133,149.69896141506527L244.03645364536456,141.85457797387886L245.67821782178217,140.62549663165396L249.82583258325835,142.02936908293034L252.33168316831686,142.55256562499795L254.31908190819087,141.24125463837663L256.479297929793,142.98722178389264L259.503600360036,145.91116224906284L260.19486948694873,147.85856268294975L264.515301530153,148.194786771787L264.42889288928893,152.3381321652593L265.20657065706575,158.27829061951684L267.3667866786679,159.0643496600015L269.1813681368137,161.7857228370921L272.63771377137715,159.22110109725077L274.88433843384337,154.04648441640708L276.5261026102611,151.7645665686366L278.34068406840686,156.05659642530702L281.451395139514,161.939853144234L284.13006300630065,167.31888797890934L283.1795679567957,170.0535081961751L286.37668766876686,172.45487089233887L288.53690369036906,174.8932609340563L292.33888388838886,175.9578205545133L293.8942394239424,177.29665107354873L294.8447344734474,180.7700299489325L296.7457245724572,181.31924058174354L297.6962196219622,182.82053237272552L297.86903690369036,187.31361015137935L296.14086408640867,188.76393999232982L294.4126912691269,190.13722467886652L290.43789378937896,191.49987160392146L287.4135913591359,194.57569183296442L283.3523852385239,195.2098632303084L278.2542754275428,194.385001367212L274.62511251125113,194.385001367212L272.1192619261926,194.63921016200442L270.13186318631864,197.3494534761862L267.1075607560756,198.96868630899496L263.65121512151217,203.74208256703542L260.8861386138614,206.97618533016657L262.8735373537354,206.44102806994624L266.7619261926193,201.73766329261505L271.7736273627363,198.72051156280753L275.40279027902795,198.34761310624552L277.47659765976596,200.14292345163105L275.22997299729974,202.59067773398576L276.0076507650765,206.3814721168209L276.7853285328533,209.04306602586445L279.8960396039604,210.73877979872245L283.87083708370835,210.27249594880587L286.2902790279028,206.32189729391033L286.46309630963094,208.86678446069115L287.93204320432045,210.1557475159096L284.9941494149415,212.36192926817532L279.72322232223223,214.42904740387854L277.3037803780378,215.73834719923872L274.62511251125113,218.16311304457287L272.8105310531053,217.93879795162252L272.72412241224123,215.1132497174353L276.8717371737174,212.30419408285155L273.0697569756976,212.41964723679575ZM157.5414041404141,72.14657999700836L156.33168316831689,75.87461193804097L161.6026102610261,73.53862170932712L164.9725472547255,77.50102954615505L167.65121512151217,73.40002243297448L169.89783978397844,76.1469593536072L171.88523852385242,83.8294522975142L173.09495949594958,80.56799168752309L171.3667866786679,72.42606880333335L173.44059405940595,71.16406553718451L175.86003600360038,72.42606880333335L178.53870387038705,75.73824491017422L180.0076507650765,83.4419350128758L180.7853285328533,88.6504403821528L184.84653465346537,92.346689088495L189.1669666966697,95.71401413984279L188.90774077407744,98.77290696621208L184.93294329432945,99.2378924852338L186.488298829883,101.8833675919972L185.7106210621062,104.37008587703673L181.30378037803783,103.35785857810501L177.15616561656168,101.5409930751241L174.39108910891093,101.8833675919972L169.89783978397844,104.14574610679003L163.84923492349236,105.15260017430174L159.52880288028803,105.82004178197963L158.2326732673268,102.67915805676978L154.9491449144915,100.85384421972327L152.8753375337534,101.5409930751241L149.85103510351036,96.07024107745488L151.49279927992802,95.35691780912947L155.20837083708375,94.16025925703863L158.5783078307831,94.52028651983065L161.68901890189022,93.19582610696096L157.02295229522952,91.6149028153809L151.92484248424847,92.10316808443827L148.55490549054906,91.9812549464871L147.25877587758782,89.27303463388316L152.78892889288937,86.38676066921369L149.15976597659767,86.51345039236074L144.92574257425747,84.47302012194604L146.91314131413145,78.70891674486143L148.64131413141314,75.46512293268114L155.03555355535553,70.45813147096237ZM180.69891989198922,69.60640230582152L178.62511251125116,75.0544662946611L174.82313231323133,69.32136538743885L175.68721872187223,68.03164213783572L178.8843384338434,67.74345448224187ZM248.2704770477048,72.28639234105367L248.52970297029708,74.50509568141615L245.93744374437446,74.22962204915558L243.34518451845187,74.09168722839212L240.75292529252926,75.19148200860235L240.06165616561657,74.78004306243793L237.3829882988299,70.31652716251199L237.46939693969398,67.31008344260772L238.6791179117912,66.73020866938424L244.12286228622864,67.59914304848292ZM223.73042304230424,71.86654655532868L225.63141314131414,76.82558436600965L227.87803780378042,70.31652716251199L233.92664266426644,66.87539758004675L238.0742574257426,75.46512293268114L237.72862286228627,80.56799168752309L242.481098109811,78.30741017011763L244.72772277227725,75.19148200860235L250.0850585058506,79.24252744188917L253.36858685868586,82.9236271517785L253.62781278127812,86.1330490403715L258.1210621062106,84.47302012194604L260.6269126912691,89.27303463388316L266.4162916291629,92.10316808443827L268.49009900990103,94.99894754943438L270.73672367236725,101.42669096545634L266.32988298829883,104.59408505378525L272.03285328532854,108.7868027949512L275.83483348334835,110.19432847390695L279.29117911791184,116.00609721821178L283.09315931593164,116.31668234041575L282.3154815481548,120.5985743531044L278.0814581458146,127.37894752506176L275.14356435643566,124.85961817895404L271.34158415841586,119.18481716501225L268.23087308730874,119.9943070289809L267.9716471647165,123.38684221811101L270.477497749775,126.70477708272244L273.76102610261023,129.28881564692577L274.7115211521152,130.79963240658066L276.2668766876688,136.15442599752217L275.48919891989203,140.0072818926068L272.46489648964894,138.58487396776283L266.4162916291629,134.3290104405887L269.78622862286227,138.9417050136512L272.2920792079208,142.02936908293034L272.72412241224123,143.85290937742442L266.1570657065707,141.7671085875366L261.0589558955896,138.76339253683832L258.1210621062106,136.15442599752217L258.9851485148515,134.60421041515195L255.3559855985599,131.82970209129917L251.89963996399644,129.09890508802636L251.89963996399644,130.79963240658066L244.9869486948695,131.64293297283842L242.9995499549955,129.76255776315708L244.55490549054906,125.5420330383906L249.04815481548158,125.4447334592777L253.97344734473447,124.76187849520778L253.1957695769577,122.69459803733355L254.05985598559855,119.69125952529154L257.1705670567057,113.81372751148439L256.479297929793,110.94673448038645L255.52880288028805,108.7868027949512L251.89963996399644,105.59789615859665L246.9743474347435,103.35785857810501L248.52970297029708,101.65520645108609L246.02385238523854,97.48654441743284L243.8636363636364,97.01596333710182L241.9626462646265,94.64009879011499L240.75292529252926,96.78010474519738L236.34608460846087,97.60395394461179L227.61881188118812,96.07024107745488L222.52070207020705,94.04005277766885L218.63231323132317,92.95371923868422L216.64491449144919,90.38703575378364L219.15076507650767,87.01910676373177L215.7808280828083,87.01910676373177L215.0031503150315,79.24252744188917L216.81773177317734,72.00663149433285L219.32358235823585,68.6062850899632L225.54500450045006,66.29375671334054ZM190.63591359135916,66.00204792351968L193.48739873987398,67.74345448224187L197.80783078307834,66.73020866938424L198.41269126912692,69.17863426207384L196.16606660666068,73.12242252057968L199.79522952295233,76.69011475393376L199.3631863186319,83.70039501642853L195.47479747974802,86.64002966019768L193.14176417641764,86.00602672497931L191.50000000000003,83.05337814467993L185.53780378037806,77.09614226507028L185.53780378037806,74.50509568141615L190.46309630963097,75.46512293268114L187.78442844284427,70.17478301910836ZM207.83123312331236,74.91732006623096L205.23897389738977,80.96327165134028L202.47389738973902,80.56799168752309L201.0049504950495,73.53862170932712L201.0913591359136,69.46395463729124L202.30108010801084,65.85597033798092L204.72052205220524,63.49821697655409L209.73222322232226,63.79507041281346L214.31188118811883,65.85597033798092L210.6827182718272,73.40002243297448ZM142.41989198919896,85.75164806382554L136.11206120612064,89.39723440365054L134.8159315931593,86.1330490403715L129.2857785778578,82.14266939493498L130.32268226822686,78.84250444555624L131.96444644464447,72.98342134310013L134.03825382538258,67.45468613734988L131.70522052205223,62.15469356785934L139.82763276327637,60.64691793964789L143.19756975697567,62.603939702666935L149.33258325832583,63.05177778944369L151.66561656165618,65.5633672009127L154.25787578757883,69.17863426207384L151.23357335733573,71.30483685270832L145.35778577857786,76.96092678625303L142.41989198919896,82.53367498648157ZM206.7943294329433,55.86889039463239L205.49819981998203,59.42912410807497L202.0418541854186,58.662689598707004L199.1039603960396,56.338345177320775L200.4000900090009,52.056430681465145L203.85643564356437,49.456768181688574L205.93024302430246,52.859165312470054ZM195.12916291629168,38.73042298696788L196.94374437443747,43.42726689750168L197.03015301530158,48.634513756226625L195.90684068406844,55.712060867757714L191.93204320432045,56.650457447336294L189.3397839783979,55.08300924006062L189.42619261926197,49.620648934698636L185.53780378037806,50.27428656090939L185.36498649864987,42.7412025608694L187.95724572457246,43.08465041757478L191.50000000000003,39.436173887565985L194.95634563456346,40.13841793884279ZM171.79882988298834,44.11002223381979L172.74932493249327,47.641476524448024L174.9095409540954,45.97080272813918L177.41539153915392,46.306516403057344L177.8474347434744,51.08712490274121L176.3784878487849,55.55505838517013L168.25607560756077,57.117347241974926L162.20747074707475,60.94974955122109L158.49189918991902,61.251940115610296L158.2326732673268,58.20084360609826L163.15796579657967,54.13418730923979L152.35688568856887,55.240532968972786L148.9869486948695,53.65739268146342L152.2704770477048,44.11002223381979L154.51710171017106,41.1852865099537L161.25697569756977,44.61993690029527L165.5774077407741,50.43722685731814L169.72502250225023,51.249135826384986L166.2686768676868,41.70582892382953L168.515301530153,38.02112904084447L171.02115211521158,39.26006633402744ZM204.2884788478848,34.784462128303915L206.88073807380738,38.19878668824049L211.63321332133216,38.19878668824049L213.70702070207022,41.532527556050354L213.18856885688572,45.29697990889622L215.9536453645365,47.641476524448024L217.42259225922595,49.947843928078726L220.7061206120612,50.27428656090939L224.1624662466247,51.08712490274121L227.96444644464447,48.963987477848605L232.8897389738974,48.13886412540597L236.7781278127813,48.963987477848605L239.37038703870388,52.53861527685086L239.88883888388838,56.338345177320775L238.41989198919893,58.81630639584239L234.79072907290734,60.79841405288141L231.76642664266427,59.58191800192367L224.85373537353738,61.10092478805183L219.92844284428443,61.251940115610296L216.04005400540058,60.039320229561156L209.64581458145815,57.117347241974926L208.8681368136814,52.056430681465145L208.52250225022507,47.30891302274853L206.1894689468947,42.91303067091155L201.17776777677767,41.70582892382953L198.41269126912692,38.37622117851777L199.27677767776777,34.05500890486098ZM152.61611161116116,28.65046654406558L152.2704770477048,37.129473153845026L150.45589558955896,40.6628210731206L148.20927092709275,41.1852865099537L143.71602160216025,45.63429186776841L139.91404140414045,47.14233832877517L136.63051305130512,44.958862909897505L140.69171917191727,37.30825529512572L145.6170117011701,30.162201800801313L149.33258325832583,30.350032682557128ZM206.2758775877588,30.162201800801313L205.1525652565257,30.537613412350368L200.65931593159317,29.785786840534286L200.05445544554456,26.544958751612228L204.89333933393343,26.737675835029563L206.53510351035104,28.840323520492575ZM167.04635463546356,28.07935428495199L162.55310531053112,31.285448405469026L159.01035103510355,27.697321198781538L160.99774977497754,24.01530343049899L164.45409540954097,22.832237262740307L167.82403240324032,24.798517581731574ZM168.34248424842485,17.587229104963114L165.40459045904595,19.83023171936935L161.42979297929793,19.83023171936935L161.42979297929793,18.202521576380605L163.93564356435644,14.469611150944445L165.1453645364537,15.098705427840684ZM201.52340234023401,24.01530343049899L197.9806480648065,26.351977277935703L195.99324932493252,23.818816089547738L194.95634563456346,19.222050640478983L194.7835283528353,14.259284010857641L197.89423942394242,14.679623126947547L199.27677767776777,15.516538552340023L202.12826282628268,19.83023171936935ZM191.32718271827187,20.8380477633184L192.2776777677768,25.77143906650889L188.38928892889288,24.40745598984421L184.41449144914495,20.637062485927515L179.05715571557158,20.23422672931514L181.3901890189019,16.555705726380722L178.45229522952297,13.626401926325343L178.27947794779482,8.895772565068L183.03195319531957,10.634549259543462L189.51260126012605,15.098705427840684ZM222.6935193519352,3.9996198051040324L225.54500450045006,8.45768209395419L222.2614761476148,12.138463909159668L217.85463546354637,21.43928327518205L213.53420342034207,22.236947575529314L208.60891089108915,20.637062485927515L206.01665166516653,15.724989041685944L206.01665166516653,11.281062834364661L207.91764176417644,7.797963864918131L203.59720972097213,7.797963864918131L200.91854185418543,3.545895049444823L199.3631863186319,-2.7281482904044196L201.0913591359136,-9.048659141916119L202.73312331233126,-13.598565124665697L205.1525652565257,-14.630160551300037L204.11566156615663,-18.30215988968348L209.73222322232226,-19.10178233996811L212.75652565256527,-10.800454520653886L216.81773177317734,-7.810721317822754L220.79252925292528,-5.125339248583771ZM267.1075607560756,-51.80258520778045L273.501800180018,-50.45585107405776L278.6863186318632,-47.801032537077106L283.09315931593164,-42.6392616361893L282.92034203420343,-37.662772939158685L277.13096309630964,-30.227602389158847L271.2551755175518,-26.795356205834253L269.09495949594964,-22.895361430835237L274.3658865886589,-23.17033277984524L268.6629162916292,-13.598565124665697L264.77452745274525,-9.297571495201282L260.6269126912691,2.175814738810459L255.7016201620162,4.451876502864081L254.14626462646265,7.135120042323024L246.88793879387939,8.45768209395419L250.25787578757877,10.201875711284174L248.52970297029708,12.35199654493124L250.51710171017103,18.407020866030678L248.2704770477048,22.6340875056502L244.55490549054906,25.77143906650889L243.43159315931595,30.350032682557128L240.06165616561657,33.50543240579816L240.40729072907294,36.05199975791999L244.55490549054906,35.51016293905769L244.55490549054906,38.19878668824049L238.1606660666067,44.280197880476805L231.85283528352835,41.532527556050354L224.85373537353738,43.08465041757478L221.22457245724578,41.87891823595106L216.73132313231326,41.3590135972247L216.38568856885692,36.23215074863646L220.87893789378938,33.87205460665001L219.6692169216922,25.77143906650889L221.13816381638162,24.993641201006255L227.53240324032404,29.974120082563218L224.24887488748877,22.6340875056502L220.36048604860486,20.43578908954629L222.3478847884789,15.724989041685944L226.5819081908191,12.778087751675855L227.27317731773178,8.23812145427496L223.90324032403245,3.090692514555826L222.8663366336634,-4.161514925145241L229.43339333933397,-3.44299118939864L231.33438343834385,-2.0169481522523256L235.0499549954996,-7.07320091656868L229.69261926192624,-8.80019051059162L221.22457245724578,-7.810721317822754L216.99054905490553,-12.829852717968379L215.0031503150315,-19.10178233996811L212.23807380738074,-23.721912370907603L211.71962196219624,-29.6496397345706L215.26237623762378,-32.85862096516229L218.02745274527453,-33.45012464999462L222.77992799279932,-36.14353390341654L226.32268226822683,-42.956302183349635L229.26057605760582,-42.00734703316715L231.85283528352835,-37.05307976173958L233.66741674167417,-47.145200223008146L236.86453645364537,-50.12120337800428L241.18496849684973,-52.48089449177297L248.52970297029708,-53.16254212638472L249.73942394239427,-51.127581500227336L256.73852385238524,-54.53598599716298L261.9230423042304,-53.16254212638472Z"
                        className="datamaps-subunit CAN"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M467.5756075607561,191.30585083054652L466.53870387038705,188.89519332920125L466.71152115211527,187.51209365328424L466.19306930693074,185.45008614205764L465.24257425742576,184.03916174647378L465.9338433843385,182.95636327010317L465.4153915391539,180.90749849234447L467.0571557155716,179.66626758694102L470.7727272727273,177.78723497798995L473.79702970297035,176.3817611728889L476.2164716471647,177.08596325885685L476.3892889288929,178.0669299773324L478.72232223222323,178.1367814533438L481.6602160216022,178.62493566968908L486.0670567056706,178.55528551397697L487.27677767776777,178.97275742386273L487.8816381638164,180.28801468337343L487.96804680468045,182.07153267704655L488.65931593159314,183.5662762031185L488.65931593159314,185.18222568535637L487.1903690369037,185.9845668156412L487.8816381638164,187.77638721086763L487.96804680468045,189.4846197226698L489.1777677767777,192.85209595586358L488.9185418541854,193.93926387588618L487.7088208820882,194.32139264703167L485.5486048604861,197.47452470287533L486.1534653465347,199.09264689151505L485.63501350135016,198.90667434981555L483.3883888388839,197.47452470287533L481.6602160216022,197.97394720902736L480.53690369036906,197.59950952683076L479.0679567956796,198.4098160266351L477.8582358235824,197.09905116112768L476.9077407740774,197.59950952683076L476.73492349234925,197.3494534761862L475.6116111611161,195.52610942998513L473.8834383438344,195.33642861416087L473.6242124212422,194.13043048832668L471.98244824482447,193.74789222095453L471.63681368136815,194.7027059472309L470.34068406840686,193.93926387588618L470.5135013501351,192.85209595586358L468.6989198919892,192.53107188317767Z"
                        className="datamaps-subunit POL"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M472.24167416741676,200.69651877427788L471.1183618361836,199.95801893220224L469.99504950495054,200.14292345163105L468.0940594059406,199.03067714963268L467.22997299729974,199.34031526637787L465.9338433843385,200.81931315665636L464.1192619261926,199.6494283773862L462.73672367236725,198.09858804680016L461.52700270027003,197.1616842737648L461.26777677767774,195.58929185082798L460.83573357335734,194.51215093854924L462.65031503150317,193.68405600223292L463.514401440144,192.7237559569143L465.24257425742576,192.01622216210387L465.8474347434743,191.30585083054652L466.452295229523,191.6936796812061L467.5756075607561,191.30585083054652L468.6989198919892,192.53107188317767L470.5135013501351,192.85209595586358L470.34068406840686,193.93926387588618L471.63681368136815,194.7027059472309L471.98244824482447,193.74789222095453L473.6242124212422,194.13043048832668L473.8834383438344,195.33642861416087L475.6116111611161,195.52610942998513L476.73492349234925,197.3494534761862L476.04365436543657,197.3494534761862L475.6980198019802,198.03627833702694L475.0931593159316,198.2231432922396L474.92034203420343,199.03067714963268L474.48829882988304,199.21652315803857L474.40189018901896,199.52584597657037L473.6242124212422,199.95801893220224L472.5873087308731,199.89634250865038Z"
                        className="datamaps-subunit CZE"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M472.24167416741676,202.40822050536664L472.0688568856886,203.86286839185172L470.68631863186323,203.86286839185172L471.2047704770477,204.64607089008197L470.42709270927094,206.91679843593926L469.90864086408646,207.5098279435517L467.83483348334835,207.56902860609387L466.62511251125113,208.33695701839747L464.63771377137715,208.1010027002984L461.18136813681366,207.2135460843336L460.6629162916292,205.96405112837758L458.3298829882989,206.5600834353999L457.98424842484246,207.27283965179765L456.6017101710171,206.73852538817283L455.30558055805585,206.67906352719456L454.26867686768674,206.02373953113874L454.61431143114316,205.12641160334098L454.5279027902791,204.5257923092684L455.2191719171918,204.3452288099114L456.42889288928893,205.30622151861914L456.7745274527453,204.3452288099114L458.93474347434744,204.5257923092684L460.6629162916292,203.86286839185172L461.78622862286227,203.98357578483464L462.5639063906391,204.70618110816244L462.73672367236725,204.10420488986387L462.39108910891093,201.79872392147445L463.2551755175518,201.3096708027947L464.1192619261926,199.6494283773862L465.9338433843385,200.81931315665636L467.22997299729974,199.34031526637787L468.0940594059406,199.03067714963268L469.99504950495054,200.14292345163105L471.1183618361836,199.95801893220224L472.24167416741676,200.69651877427788L471.98244824482447,201.12594008049876Z"
                        className="datamaps-subunit AUT"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M470.68631863186323,406.1144382692969L468.9581458145814,404.040054249886L468.0076507650765,402.07142271964966L467.48919891989203,399.43617234310227L466.8843384338434,397.54171173741855L466.10666066606666,393.4746713434185L466.0202520252026,390.3350836221725L465.76102610261023,388.9291176388575L464.8105310531053,387.83446635775704L463.514401440144,385.7416711792652L462.30468046804685,382.6666233532141L461.78622862286227,381.0733497505554L459.79882988298834,378.58777785327294L459.62601260126013,376.6689092866186L460.83573357335734,376.15856755358334L462.2182718271828,375.73370818439594L463.7736273627363,375.8186493546327L465.24257425742576,376.96686865249524L465.5882088208821,376.79658256408214L475.3523852385239,376.6689092866186L476.9941494149415,377.86191374906775L482.7835283528353,378.24604781436324L487.1903690369037,377.22241633126777L489.1777677767777,376.6263593683284L490.73312331233126,376.79658256408214L491.6836183618362,377.3502437769836L491.6836183618362,377.56336935315176L490.3874887488749,378.1179665418575L489.6098109810981,378.1179665418575L488.05445544554453,379.10086792185115L487.1903690369037,378.07528092914885L483.47479747974796,378.97253936947817L481.6602160216022,379.05808757032196L481.5738073807381,388.1406416231473L479.24077407740776,388.2281667555567L479.24077407740776,395.88201669840856L479.24077407740776,405.7907806952052L477.08055805580557,407.1804653902014L475.7844284428443,407.36626933084256L474.3154815481548,406.8556006620346L473.1921692169217,406.67012991022835L472.84653465346537,405.51364864761325L471.8960396039604,404.72987605878063Z"
                        className="datamaps-subunit NAM"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M466.2794779477948,303.36625470774885L466.53870387038705,302.19838940855743L464.98334833483347,302.1566380848784L464.98334833483347,300.5678820268165L464.03285328532854,299.64605637961927L465.06975697569754,296.36508941117444L468.0940594059406,293.9965061132064L468.18046804680466,290.720385868719L469.13096309630964,285.56569902986115L469.6494149414941,284.48366736792195L468.6989198919892,283.6159041020866L468.6125112511251,282.78973044088144L467.74842484248427,282.13622772221095L467.14356435643566,278.10271842940017L469.56300630063004,276.6890679351335L479.1543654365437,281.6562750143876L488.7457245724572,286.55860563453746L488.8321332133213,296.53384501225815L486.7583258325833,296.36508941117444L485.63501350135016,298.21838077907717L485.0301530153015,299.72992149737917L485.5486048604861,300.3166247949171L484.77092709270926,301.07006455947453L485.0301530153015,302.07312665377077L484.42529252925294,303.11618629915336L484.16606660666065,304.03261166891684L485.0301530153015,303.8660889597904L485.462196219622,304.822999011912L485.5486048604861,306.2764726838982L486.4126912691269,306.9813162193567L486.4126912691269,307.5612398694367L484.85733573357334,307.9751811937975L483.6476147614762,308.9676802383657L481.91944194419443,311.64925978626377L479.67281728172816,312.7605656906063L477.3397839783978,312.59601824536446L476.6485148514851,312.84282783232254L476.9077407740774,313.70612237498625L475.6116111611161,314.52755226457225L474.5747074707471,315.4713250494035L471.63681368136815,316.41420879772693L471.03195319531955,315.88138108740003L470.59990999099915,315.79938314600554L470.1678667866787,316.4551842741819L468.18046804680466,316.6190703014121L468.52610261026103,315.96337245508226L467.74842484248427,314.28119884215266L467.48919891989203,313.29513313282695L466.3658865886589,312.8839560211516L464.98334833483347,311.44330223758607L465.501800180018,310.2889799582491L466.62511251125113,310.53647413936085L467.3163816381638,310.3714865998627L468.6125112511251,310.4127366969683L467.3163816381638,308.18206268721565L467.4027902790279,306.5667898792521L467.22997299729974,304.9477082107094Z"
                        className="datamaps-subunit TCD"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M436.64131413141314,305.6124225516313L436.7277227722772,303.9493558212628L433.96264626462647,303.36625470774885L433.8762376237624,302.19838940855743L432.493699369937,300.5678820268165L432.2344734473448,299.43633799633096L432.40729072907294,298.2604251146023L433.96264626462647,298.13428216180716L434.8267326732673,297.25043789206546L438.1102610261026,297.03977853785193L440.2704770477048,296.66037512687933L440.44329432943294,295.097618491361L441.73942394239424,293.44500623300223L441.73942394239424,287.63513582099665L445.1093609360936,286.51548602721317L452.10846084608465,281.4379119720011L460.3172817281728,276.51195768008284L464.1192619261926,277.6174189879573L465.4153915391539,279.0713309011173L467.14356435643566,278.10271842940017L467.74842484248427,282.13622772221095L468.6125112511251,282.78973044088144L468.6989198919892,283.6159041020866L469.6494149414941,284.48366736792195L469.13096309630964,285.56569902986115L468.18046804680466,290.720385868719L468.0940594059406,293.9965061132064L465.06975697569754,296.36508941117444L464.03285328532854,299.64605637961927L464.98334833483347,300.5678820268165L464.98334833483347,302.1566380848784L466.53870387038705,302.19838940855743L466.2794779477948,303.36625470774885L465.5882088208821,303.4912509288797L465.501800180018,304.2823134485892L465.06975697569754,304.3239208633018L463.42799279927993,301.65539276792L462.90954095409546,301.5300147685302L461.0085508550855,302.9077180695863L459.19396939693974,302.19838940855743L457.8978397839784,302.07312665377077L457.2065706570657,302.4071022703175L455.73762376237624,302.3236258607376L454.3550855085508,303.36625470774885L453.14536453645366,303.4495883246943L450.2074707470747,302.1566380848784L449.0841584158416,302.78260291843196L447.8744374437444,302.74089214162575L447.01035103510355,301.7807439894446L444.5909090909091,300.8608753115152L441.9986498649865,301.15371900286846L441.3937893789379,301.697179478319L441.04815481548155,303.11618629915336L440.35688568856887,304.1158565347247L440.1840684068407,306.3179541320746L438.3694869486949,304.90614114093785L437.50540054005404,304.90614114093785Z"
                        className="datamaps-subunit NER"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M402.2506750675068,299.0166612292211L403.11476147614763,298.5546430229129L403.46039603960395,297.0819172557848L404.2380738073807,297.03977853785193L405.96624662466246,297.7135890597495L407.26237623762376,297.25043789206546L408.2128712871287,297.4189039547114L408.5585058505851,296.87118930358116L418.2362736273627,296.82903338317686L418.75472547254725,295.0553138605807L418.32268226822686,294.75907947910525L417.1993699369937,283.8330254969187L415.98964896489645,272.59192457075847L419.7052205220522,272.5471116903262L427.7412241224123,278.27902585043034L435.8636363636364,283.9198401995544L436.468496849685,285.13323847388966L437.93744374437443,285.8249523873804L439.0607560756076,286.2566729909796L439.0607560756076,287.89308992879904L441.73942394239424,287.63513582099665L441.73942394239424,293.44500623300223L440.44329432943294,295.097618491361L440.2704770477048,296.66037512687933L438.1102610261026,297.03977853785193L434.8267326732673,297.25043789206546L433.96264626462647,298.13428216180716L432.40729072907294,298.2604251146023L430.85193519351935,298.2604251146023L430.24707470747074,297.7556734404679L428.95094509450945,298.13428216180716L426.7043204320432,299.1425980338207L426.2722772277228,299.939528992598L424.3712871287129,301.0282327911496L424.02565256525656,301.697179478319L423.0751575157516,302.19838940855743L421.86543654365437,301.8642966481263L421.26057605760576,302.4488361196906L420.91494149414945,304.157474859422L418.9275427542754,306.15201313455344L419.0139513951395,306.9813162193567L418.40909090909093,308.05794087805197L418.495499549955,309.4634342730827L417.5450045004501,309.835038489162L416.9401440144015,310.1239407782893L416.5945094509451,309.09164924595234L415.90324032403237,309.3395261593049L415.471197119712,309.29821897230147L415.0391539153915,310.04140817869467L413.22457245724576,310.00013861308787L412.53330333033307,309.62861385818866L412.18766876687675,309.8763168070371L411.496399639964,309.1329677095734L411.5828082808281,308.4302429075607L411.3235823582358,308.14069110794924L410.8051305130513,308.3888853818458L410.8915391539154,307.602644783761L411.40999099909993,306.9398747418618L410.3730873087309,305.9445296336415L410.11386138613864,305.2386035008484L409.5954095409541,304.6982657851031L409.0769576957696,304.6566826847359L408.5585058505851,304.9892726226117L407.7808280828083,305.3216927103439L407.0895589558956,305.8615183199075L406.0526552655266,305.65394497633764L405.447794779478,305.0308343806119L405.01575157515754,304.9477082107094L404.4108910891089,305.28014941867906L403.9788478847885,305.28014941867906L403.8924392439244,304.365525560489L403.9788478847885,303.61622197243446L403.8060306030603,302.65746197417343L402.85553555355534,301.9896034839559L402.42349234923495,300.5678820268165Z"
                        className="datamaps-subunit MLI"
                        data-info="{}"
                        style={{
                          fill: 'rgba(189, 197, 208, 0.7)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgba(189, 197, 208, 0.7)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                      <path
                        d="M58.17146714671469,287.80712281505373L57.825832583258375,288.2367833624731L57.22097209720971,287.89308992879904L57.307380738073846,287.161806638783L56.96174617461753,286.2566729909796L57.04815481548155,285.9545167615629L57.480198019802,285.5224739283681L57.307380738073846,285.0466902746833L57.39378937893787,284.7869328110043L57.65301530153022,284.83023750651057L58.51710171017106,285.2630256339473L58.9491449144914,285.47924418314324L59.381188118811906,285.8249523873804L59.986048604860514,286.7310388119086L59.899639963996435,286.86031631227974L58.9491449144914,287.42005275696056ZM56.875337533753395,283.8330254969187L56.09765976597669,284.0066356146732L55.66561656165618,283.48557303268143L55.40639063906394,283.2682571065064L55.40639063906394,283.09431628394617L55.66561656165618,282.87677963901945L56.443294329433,283.13780884931384L57.13456345634569,283.5290215865715ZM55.319981998199864,282.4413352911356L55.233573357335786,282.74619842066966L53.93744374437449,282.65911951333067L54.11026102610265,282.3541867170055ZM53.15976597659767,282.09262087340875L52.98694869486951,282.22342635509415L52.8141314131413,282.1798295477855L52.03645364536453,282.09262087340875L51.69081908190822,281.5252724628635L51.60441044104414,281.4379119720011L52.209270927092746,281.08826548878324L52.46849684968498,281.21942135516304ZM49.098559855985684,280.3879824657816L48.75292529252931,280.65074420266325L47.97524752475249,280.16887074173275L48.061656165616625,279.99348690648446L48.49369936993702,279.73025296352324L49.01215121512155,279.7741385081002ZM270.39108910891093,212.82319223252546L270.8231323132313,213.91432114098706L268.23087308730874,215.56806297570245L265.7250225022502,216.70052438045127L263.2191719171917,217.7142301725887L261.9230423042304,219.6706973793992L261.5774077407741,220.39255816674108L261.49099909991,222.10360556423382L262.3550855085509,223.85493503551055L263.3055805580558,223.90942442532793L263.04635463546356,222.76210758741297L263.73762376237624,223.47310552959894L263.5648064806481,224.39918315528647L261.9230423042304,224.88778577885796L260.79972997299734,224.8335534132432L259.0715571557156,225.37524117940615L258.03465346534654,225.53747289852942L256.5657065706571,225.69957845155324L254.5783078307831,226.61580899719505L258.1210621062106,226.02341235125272L258.81233123312336,226.61580899719505L255.44239423942398,227.58159558428656L253.97344734473447,227.58159558428656L253.97344734473447,227.20653812806495L253.28217821782178,228.06283573613533L253.97344734473447,228.22300628834452L253.45499549954997,230.50564765039223L251.72682268226825,232.86882413557868L251.5540054005401,232.08395204180448L251.03555355535553,231.92663781608832L250.25787578757877,231.13835180110334L250.6899189918992,232.81658700714448L251.29477947794783,233.33839843896453L251.3811881188119,234.53388547381718L250.6035103510351,235.722951478192L249.22097209720977,238.13332737204522L249.04815481548158,237.98023962667412L249.73942394239427,235.92909924288492L248.52970297029708,234.79292001306695L248.2704770477048,232.2411526161266L247.83843384338437,233.54677592835236L248.2704770477048,235.5166132288013L246.71512151215123,234.99993002228092L248.35688568856887,235.98060649572554L248.443294329433,238.8972261688836L249.13456345634566,239.1005017066666L249.39378937893792,240.11418794270128L249.73942394239427,243.0790228524438L248.2704770477048,245.26608885202867L245.7646264626463,246.15508476667708L244.20927092709272,247.82548775179188L242.9995499549955,248.02125994263145L241.7898289828983,249.09524701129504L241.44419441944197,250.0675974150222L238.76552655265527,251.90479583691797L237.3829882988299,253.2501166065658L236.2596759675968,254.9220196035472L235.91404140414045,256.91442165476747L236.34608460846087,258.8452567163381L237.12376237623764,261.22827236602114L238.24707470747077,263.12951395838576L238.24707470747077,264.3286991423005L239.37038703870388,267.4877071279977L239.2839783978398,269.25874621925414L239.1975697569757,270.2984868298198L238.59270927092712,271.91908125416774L237.90144014401443,272.2781047007171L236.6917191719172,271.9639809867571L236.34608460846087,270.79454321642123L235.39558955895595,270.1630635568817L234.0994599459946,267.85183097496935L232.9761476147615,265.7979099151987L232.63051305130514,264.74265539458366L233.14896489648967,262.9445822895875L232.457695769577,261.41431995696695L230.55670567056708,259.1266763234917L229.69261926192624,258.704438785349L227.27317731773178,259.96921832887534L226.84113411341136,259.828972429628L225.63141314131414,258.5165689969688L224.1624662466247,257.85800575227256L221.39738973897394,258.18748612962935L219.32358235823585,257.85800575227256L217.50900090009003,258.09338954479756L216.472097209721,258.5165689969688L216.90414041404142,259.22041898379285L216.90414041404142,260.34286232570224L217.33618361836184,260.90239338082995L216.90414041404142,261.2747957581986L216.04005400540058,260.85580841222225L215.08955895589563,261.36781954708835L213.36138613861388,261.2747957581986L211.63321332133216,259.828972429628L209.47299729973,260.2028045111364L207.74482448244825,259.5482678562728L206.2758775877588,259.7354358056375L204.2020702070207,260.3895326549146L202.0418541854186,262.435405727736L199.70882088208825,263.59132550363904L198.32628262826285,264.8805112418222L197.80783078307834,266.11833135759406L197.80783078307834,267.9882655535586L197.89423942394242,269.25874621925414L198.32628262826285,270.1630635568817L197.462196219622,270.2533521984983L195.73402340234026,269.6660122271381L193.83303330333032,268.8509467487108L193.14176417641764,267.57877887549296L192.62331233123314,265.7062976373846L191.24077407740774,264.1445305581696L190.3766876687669,262.5280505691161L189.1669666966697,260.6693912031846L187.52520252025204,259.5482678562728L185.53780378037806,259.5950716981583L184.0688568856886,261.786048473569L182.08145814581462,260.9489706292379L180.7853285328533,260.10939354542825L180.1804680468047,258.61051999215397L179.40279027902793,257.15062676247123L178.02025202520255,255.92008382534104L176.72412241224126,255.01723570438668L175.86003600360038,254.063519516773L171.71242124212426,254.063519516773L171.71242124212426,255.20756492603508L169.81143114311436,255.20756492603508L165.05895589558958,255.20756492603508L159.52880288028803,253.2501166065658L155.9860486048605,251.85661814524474L156.15886588658867,251.27777562951687L153.1345634563457,251.61559337467162L150.36948694869488,251.80843137626846L150.0238523852385,250.35856930947273L148.46849684968498,248.70524396549297L147.34518451845184,248.36348818626135L147.0859585958596,247.53153736420148L145.70342034203418,247.38443024746218L144.83933393339333,246.59836320713907L142.59270927092712,246.302934053486L141.9878487848785,245.85911564460275L141.72862286228627,244.2744511763563L139.39558955895592,241.27445372225873L137.40819081908194,237.11078418153932L137.49459945994602,236.39223855847285L136.37128712871288,235.41337247211146L134.5567056705671,232.81658700714448L134.21107110711074,230.29433272793767L132.91494149414945,228.59626794046213L133.43339333933397,225.96947488161462L133.3469846984699,223.19993593550527L132.6557155715572,220.72485653221054L133.51980198019805,217.60185124960697L133.86543654365443,214.6003221210255L134.1246624662466,211.49408512672883L133.69261926192627,206.85739282552703L132.91494149414945,203.8024852924284L132.22367236723676,202.16466346682822L132.56930693069307,201.4320560037886L136.02565256525656,202.65145680405732L137.3217821782178,206.02373953113874L137.9266426642664,205.12641160334098L137.49459945994602,202.16466346682822L136.71692169216925,199.21652315803857L143.5432043204321,199.21652315803857L150.62871287128718,199.21652315803857L152.96174617461753,199.21652315803857L160.30648064806485,199.21652315803857L167.39198919891987,199.21652315803857L174.5639063906391,199.21652315803857L181.82223222322233,199.21652315803857L189.94464446444647,199.21652315803857L198.15346534653466,199.21652315803857L203.0787578757876,199.21652315803857L203.1651665166517,197.7868251138115L203.94284428442847,197.7868251138115L204.3748874887489,199.77292716937572L205.1525652565257,200.38917244775467L206.7943294329433,200.6350907325153L209.21377137713773,201.18720406928364L211.54680468046806,202.3473613614042L213.53420342034207,201.85976431783374L216.472097209721,202.77295504568906L217.24977497749776,202.77295504568906L219.40999099909993,201.73766329261505L221.6566156615662,203.01571244994744L223.98964896489653,204.40543608383908L225.97704770477048,205.60552130820957L227.79162916291634,206.73852538817283L228.05085508550854,207.6282107380623L228.5693069306931,207.98291532502103L228.48289828982902,208.33695701839747L229.0877587758776,208.45482422620682L229.51980198019805,208.1010027002984L229.69261926192624,208.92556312682575L230.12466246624666,209.45375633448378L230.81593159315935,209.45375633448378L231.16156615661566,209.86356446648728L230.90234023402343,210.50577959598039L233.4081908190819,212.130885073413L233.92664266426644,215.17015897485402L234.3586858685869,218.05098702873687L233.66741674167417,220.0041849451904L232.54410441044107,221.82860207418366L232.02565256525654,222.98113852341493L231.93924392439246,223.30924732093465L232.19846984698472,223.74591305596806L233.06255625562557,224.23605914253358L233.66741674167417,224.23605914253358L236.43249324932495,222.5428423219529L238.93834383438346,222.04863451302197L242.04905490549058,220.39255816674108L242.04905490549058,220.0597126052263L241.8762376237624,219.05786411197755L241.53060306030605,218.44315291209037L242.56750675067508,217.8826797306623L244.9005400540054,217.8826797306623L247.14716471647165,217.8826797306623L247.92484248424844,216.5875699071758L248.1840684068407,216.30490123686508L250.7763276327633,213.91432114098706L251.81323132313233,213.28336112598296L255.44239423942398,213.28336112598296L259.84923492349236,213.28336112598296L260.10846084608465,212.41964723679575L260.8861386138614,212.24644166550814L261.9230423042304,211.72589193302372L262.7871287128713,210.1557475159096L263.478397839784,207.45060873365776L265.29297929792983,204.76627196833377L266.1570657065707,205.72510744072298L267.71242124212426,205.12641160334098L268.8357335733574,206.14305943472505L268.8357335733574,210.91334454964527ZM64.30648064806485,166.64677141228677L61.88703870387042,168.35896060037396L60.67731773177326,167.24434431073473L60.33168316831683,165.14322022812456L62.491899189919025,163.54943113764202L63.78802880288032,162.8615671547083L65.3433843384339,163.1676443693674L66.38028802880291,164.53790059748084ZM34.14986498649864,153.80355651492872L32.59450945094511,154.5312297893944L31.03915391539158,153.6413980468964L29.57020702070207,152.3381321652593L31.989648964896503,151.51811506750954L33.890639063906406,152.01063485112758ZM19.37398739873987,134.05331566301498L20.84293429342938,135.15313389708368L22.31188118811889,134.60421041515195L24.299279927992814,135.9728574355547L26.632313231323167,136.69784925691877L26.45949594959501,137.32942783375248L24.644914491449185,138.40614876700386L22.83033303330336,137.23936072790164L21.87983798379838,136.24512994956885L19.80603060306032,136.60741188691037L19.201170117011714,136.15442599752217ZM93.1669666966697,97.83849123548279L93.08055805580557,121.50044620130856L93.08055805580557,151.92865458465414L95.50000000000006,152.09257269143393L97.83303330333035,153.3978495582968L99.47479747974796,155.49631551407913L101.63501350135016,158.59317602746808L103.96804680468045,155.97667660220924L106.38748874887489,154.3698120508261L107.59720972097216,156.85360365591134L109.23897389738977,158.7503874794753L111.48559855985599,160.85784281518409L112.9545454545455,164.0824301242317L115.37398739873987,169.1715702501287L119.52160216021599,171.87590744308633L119.52160216021599,174.53689940530018L118.22547254725475,176.59333131078128L116.92934293429346,175.03559341527992L114.76912691269132,173.67851990088724L114.07785778577863,169.906845406289L110.96714671467146,166.42211829917568L109.67101710171016,162.1707737597266L107.424392439244,161.86280634142318L103.62241224122408,161.70860258952416L100.77092709270931,160.39189591956682L95.84563456345637,155.57647618758088L93.51260126012602,154.69248399396577L89.27857785778582,152.9911033419013L85.99504950495054,153.3978495582968L81.24257425742576,151.18891454517768L78.39108910891093,149.1157117565898L75.79882988298829,150.11425050138854L76.2308730873088,153.47907389196195L74.93474347434744,153.80355651492872L72.1696669666967,154.7730498920545L70.00945094509456,156.37587641946058L67.41719171917191,157.40915504598962L67.0715571557156,154.61187730919906L68.1084608460846,149.8652083485807L70.70072007200724,148.3626293697089L70.00945094509456,147.0994151021256L66.98514851485146,149.8652083485807L65.3433843384339,153.07253602425138L61.88703870387042,156.45559682755334L63.61521152115216,158.7503874794753L61.368586858685944,162.01686328717588L58.77632763276324,163.93032289795607L56.356885688568866,165.29419967092517L55.75202520252026,167.24434431073473L52.03645364536453,169.53961744935208L51.258775877587766,171.58566705066457L48.49369936993702,173.39140986668713L46.76552655265533,173.03182561687834L44.605310531053135,174.25126258609936L42.099459945994624,175.67459792920863L40.11206120612064,177.08596325885685L36.0508550855086,178.20660407979304L35.61881188118815,177.57715933621324L38.29747974797482,175.60371754257298L40.63051305130517,174.32271755276403L43.13636363636368,171.94838831548083L46.160666066606666,171.51302755647907L47.370387038703825,169.68660669199826L50.653915391539215,167.09515523640712L51.17236723672369,166.19715635658685L52.98694869486951,164.61368862529224L53.41899189918996,161.24510715165468L54.62871287128718,158.5145125554284L51.863636363636374,159.9245988158033L51.08595859585961,159.0643496600015L49.78982898289837,160.7802783706589L48.23447344734484,158.43581052656324L47.54320432043215,160.08051511394518L46.67911791179125,157.80480087164793L44.25967596759676,159.61231269651714L42.79072907290731,159.61231269651714L42.531503150315075,156.85360365591134L42.963546354635525,155.17526926931174L41.494599459946016,153.3978495582968L38.29747974797482,154.3698120508261L36.31008100810084,152.09257269143393L34.66831683168323,150.94156345058235L34.66831683168323,148.1107981942393L32.76732673267327,145.99633717663949L33.717821782178305,143.07400747364125L35.70522052205223,140.184166659801L36.569306930693074,137.5094042662724L38.47029702970298,137.14924093647625L40.11206120612064,137.95842819328908L42.099459945994624,135.42686134687065L43.82763276327637,135.88199268320187L45.64221422142214,134.14526902352728L45.210171017101686,131.64293297283842L43.82763276327637,130.70564394621056L45.64221422142214,128.52774640847545L44.173267326732685,128.62308865089773L41.58100810081015,129.85712953498367L40.889738973897465,131.08125076146936L38.98874887488745,129.85712953498367L35.61881188118815,130.4233304242646L32.07605760576058,129.09890508802636L31.03915391539158,126.80127083985937L28.01485148514854,123.48547543934819L31.384788478847895,121.00007399381485L36.74212421242129,118.06458937379628L38.72952295229527,118.06458937379628L38.383888388838955,121.10028165133346L43.48199819982,120.89979953322779L41.494599459946016,117.14176987179627L38.55670567056711,114.75726018962382L36.828532853285424,111.69534975696266L34.58190819081915,109.00421649841681L31.29837983798376,106.92578933754027L32.59450945094511,103.47067204937625L36.828532853285424,103.24495869258473L39.85283528352841,100.1634687538521L40.45769576957696,96.78010474519738L42.87713771377139,93.43753213736974L45.29657965796582,92.71121011604933L49.78982898289837,89.39723440365054L52.03645364536453,89.89297627843101L55.66561656165618,86.00602672497931L59.29477947794783,87.52300880819757L61.109360936093594,90.87942489551403L62.14626462646271,89.52132826195157L66.20747074707475,89.89297627843101L66.0346534653466,91.6149028153809L69.75022502250226,92.8325150479788L72.1696669666967,92.10316808443827L77.2677767776778,94.28036692540937L81.84743474347437,94.99894754943438L83.66201620162019,95.95159508557842L86.85913591359139,94.75981293787069L90.48829882988304,96.89808151434988Z"
                        className="datamaps-subunit USA"
                        data-info='{"active":{"value":"392","percent":"0.9","isGrown":true},"new":{"value":"1,408","percent":"2.2","isGrown":true},"fillKey":"MAJOR","short":"us","customName":"United States"}'
                        style={{
                          fill: 'rgb(79, 70, 229)',
                          strokeWidth: '1px',
                          strokeOpacity: 1,
                          stroke: 'rgba(0, 0, 0, 0.09)',
                          fillOpacity: 1,
                        }}
                        data-previousattributes='{"fill":"rgb(79, 70, 229)","stroke":"rgba(0, 0, 0, 0.09)","stroke-width":"1px","fill-opacity":"1"}'
                      />
                    </g>
                    <g id className="update" />
                  </svg> */}

                  <svg
                    width="1440"
                    height="1024"
                    viewBox="0 0 1440 1024"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="1440" height="1024" fill="white" />
                    <path
                      d="M93.7787 609.918C92.6317 609.853 91.666 610.766 91.666 611.915V703.435L152.944 709.546L153.404 674.253L153.878 637.801L154.196 613.328L93.7787 609.918Z"
                      fill="#FFC6C6"
                    />
                    <path
                      d="M153.404 674.253L218.219 680.743L219.57 645.746L153.878 637.801L153.404 674.253Z"
                      fill="#FFF6C6"
                    />
                    <path
                      d="M152.944 709.546L214.747 715.709C215.893 715.824 216.899 714.948 216.944 713.796L218.219 680.743L153.404 674.253L152.944 709.546Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M154.196 613.328L153.878 637.801L219.57 645.746L220.677 617.081L187.437 615.205L154.196 613.328Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M258.859 619.266L257.381 650.042L308.071 655.923V622.081L258.859 619.266Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M369.802 663.251L372.229 625.751L308.071 622.081V655.923L369.802 663.251Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M369.802 663.251L308.071 655.923L305.296 691.644L367.548 698.082L369.802 663.251Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M308.071 655.923L257.381 650.042L255.676 685.582L305.296 691.644L308.071 655.923Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M254.06 719.236C254.009 720.295 254.793 721.209 255.847 721.321L303.178 726.334L305.296 691.644L255.676 685.582L254.06 719.236Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M363.221 732.694C364.352 732.814 365.354 731.969 365.428 730.834L367.548 698.082L305.296 691.644L303.178 726.334L363.221 732.694Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M468.987 675.344L476.617 631.994L409.654 627.99L407.603 668.408L468.987 675.344Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M468.987 675.344L407.603 668.408L403.442 705.169L461.358 710.718L468.987 675.344Z"
                      fill="#FFC6C6"
                    />
                    <path
                      d="M461.358 710.718L403.442 705.169L401.81 735.188C401.753 736.247 402.532 737.167 403.586 737.284L452.954 742.769C453.981 742.883 454.927 742.195 455.134 741.182L461.358 710.718Z"
                      fill="#FFF6C6"
                    />
                    <path
                      d="M337.609 845.504L341.453 777.268L293.399 771.501L291.157 821.156L337.609 845.504Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M291.157 821.156L293.399 771.501L229.328 765.094V791.684L291.157 821.156Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M229.328 791.684V765.094L158.85 759.007L206.887 800.765C207.482 801.282 208.324 801.402 209.039 801.071L229.328 791.684Z"
                      fill="#FFC6C6"
                    />
                    <path
                      d="M384.381 868.569L391.429 782.393L341.453 777.268L337.609 845.504L384.381 868.569Z"
                      fill="#FFF6C6"
                    />
                    <path
                      d="M426.988 882.665L445.249 788.677L391.429 782.393L384.381 868.569L426.988 882.665Z"
                      fill="#D3FFB8"
                    />
                    <path
                      d="M220.677 617.081L219.57 645.746M220.677 617.081L258.859 619.266M220.677 617.081L187.437 615.205L154.196 613.328M91.666 703.435V611.915C91.666 610.766 92.6317 609.853 93.7787 609.918L154.196 613.328M91.666 703.435L152.944 709.546M91.666 703.435L158.85 759.007M154.196 613.328L153.878 637.801M152.944 709.546L214.747 715.709C215.893 715.824 216.899 714.948 216.944 713.796L218.219 680.743M152.944 709.546L153.404 674.253M153.404 674.253L218.219 680.743M153.404 674.253L153.878 637.801M218.219 680.743L219.57 645.746M153.878 637.801L219.57 645.746M372.229 625.751L369.802 663.251M372.229 625.751L308.071 622.081M372.229 625.751L409.654 627.99M258.859 619.266L257.381 650.042M258.859 619.266L308.071 622.081M308.071 655.923L257.381 650.042M308.071 655.923L369.802 663.251M308.071 655.923V622.081M308.071 655.923L305.296 691.644M257.381 650.042L255.676 685.582M369.802 663.251L367.548 698.082M305.296 691.644L367.548 698.082M305.296 691.644L303.178 726.334M305.296 691.644L255.676 685.582M367.548 698.082L365.428 730.834C365.354 731.969 364.352 732.814 363.221 732.694L303.178 726.334M303.178 726.334L255.847 721.321C254.793 721.209 254.009 720.295 254.06 719.236L255.676 685.582M476.617 631.994L468.987 675.344M476.617 631.994L409.654 627.99M476.617 631.994C479.148 632.009 481.61 632.021 484.012 632.027M468.987 675.344L407.603 668.408M468.987 675.344L461.358 710.718M407.603 668.408L409.654 627.99M407.603 668.408L403.442 705.169M403.442 705.169L461.358 710.718M403.442 705.169L401.81 735.188C401.753 736.247 402.532 737.167 403.586 737.284L452.954 742.769C453.981 742.883 454.927 742.195 455.134 741.182L461.358 710.718M484.012 632.027C523.554 632.141 546.671 630.396 584.198 628.598L603.957 627.99M484.012 632.027L461.848 740.571C461.595 741.81 462.542 742.971 463.807 742.971H569.409C570.301 742.971 571.085 742.38 571.331 741.523L603.957 627.99M603.957 627.99L640.6 629.697M713.013 625.065L664.273 610.989M713.013 625.065L712.201 673.956M713.013 625.065L748.088 635.428M640.6 629.697L642.691 629.794C643.597 629.836 644.418 629.263 644.691 628.399L650.78 609.122C651.106 608.087 652.199 607.502 653.242 607.803L664.273 610.989M640.6 629.697L627.884 673.956M664.273 610.989V673.956M664.273 673.956H627.884M664.273 673.956H712.201M664.273 673.956V708.765M627.884 673.956L617.969 708.464M712.201 673.956L711.629 708.464M664.273 708.765L617.969 708.464M664.273 708.765V742.971M664.273 708.765L711.629 708.464M617.969 708.464L608.788 740.418C608.421 741.697 609.381 742.971 610.711 742.971H664.273M664.273 742.971H709.089C710.18 742.971 711.07 742.095 711.088 741.004L711.629 708.464M748.088 635.428H795.651M748.088 635.428L747.08 672.511M843.214 635.428H795.651M843.214 635.428L841.745 671.968M843.214 635.428L878.949 634.766M795.651 635.428V671.968M795.651 671.968L794.056 706.374M795.651 671.968H841.745M795.651 671.968L747.08 672.511M794.056 706.374L792.933 742.06M794.056 706.374H840.362M794.056 706.374H746.159M792.933 742.06C778.9 742.328 764.945 742.594 747.261 742.931C746.12 742.953 745.191 742.017 745.222 740.877L746.159 706.374M792.933 742.06C806.443 741.802 820.025 741.543 837.076 741.218C838.135 741.198 838.995 740.357 839.038 739.299L840.362 706.374M840.362 706.374L841.745 671.968M747.08 672.511L746.159 706.374M972.351 633.036L925.65 633.901M972.351 633.036L970.28 670.324M972.351 633.036H1007.16M878.949 634.766L925.65 633.901M878.949 634.766L877.172 670.939M925.65 633.901L923.872 670.939M923.872 670.939H877.172M923.872 670.939L970.28 670.324M923.872 670.939L921.841 706.374M877.172 670.939L875.431 706.374M970.28 670.324L968.334 705.353M921.841 706.374L968.334 705.353M921.841 706.374H875.431M921.841 706.374L920.151 738.96M968.334 705.353L966.609 736.399C966.551 737.447 965.692 738.272 964.642 738.288L920.151 738.96M875.431 706.374L873.901 737.53C873.844 738.683 874.774 739.645 875.929 739.628L920.151 738.96M1007.16 633.036H1044.94H1054.38M1007.16 633.036L1006.34 664.964M1006.34 664.964H1052.95M1006.34 664.964L1004.31 698.906M1052.95 664.964L1051.15 698.906M1052.95 664.964L1053.28 657.482M1054.38 633.036L1053.28 657.482M1054.38 633.036L1054.82 622.428M1051.15 698.906H1004.31M1051.15 698.906L1050.08 721.972M1004.31 698.906L1000.84 738.259M1000.84 738.259L1050.08 721.972M1000.84 738.259L989.331 780.252C989.071 781.201 989.54 782.198 990.437 782.603L998.265 786.138M1050.08 721.972L1108.78 701.223C1109.52 700.962 1110.03 700.291 1110.1 699.509L1113.71 657.482M1113.71 657.482H1053.28M1113.71 657.482L1116.86 622.428M1057.86 549.455H1123.4M1057.86 549.455L1056.34 585.941M1057.86 549.455L1067.73 513.931C1067.95 513.13 1068.64 512.55 1069.47 512.474L1077.47 511.747C1078.5 511.653 1079.29 510.789 1079.29 509.755V500.588M1057.86 549.455H1032.95C1032.09 549.455 1031.32 548.9 1031.05 548.079L1015.98 502.217M1123.4 549.455L1120.13 585.941M1123.4 549.455L1127.75 500.588M1116.86 622.428H1054.82M1116.86 622.428L1120.13 585.941M1054.82 622.428L1056.34 585.941M1056.34 585.941H1120.13M1079.29 500.588H1093.75M1079.29 500.588H1057.86M1127.75 500.588L1132.23 451.874C1132.34 450.702 1131.41 449.691 1130.24 449.691H1096.6M1127.75 500.588H1093.75M1096.6 449.691L1093.75 500.588M1096.6 449.691L1057.86 450.709M1057.86 450.709V500.588M1057.86 450.709H1015.98M1057.86 500.588L1015.98 502.217M1015.98 502.217V450.709M1015.98 502.217L999.346 451.775M1015.98 450.709L1017.78 413.365M1015.98 450.709L999.346 451.775M1170.07 312.347L1177.49 282.239M1170.07 312.347L1158.47 311.273M1170.07 312.347L1139.86 360.039M1017.78 413.365L1021.56 360.039M1017.78 413.365L988.92 412.873C987.852 412.855 986.986 412 986.955 410.932L985.509 362.098C985.476 360.971 986.381 360.039 987.508 360.039H1021.56M1017.78 413.365H1027.51M1021.56 360.039H1030.07M1030.07 360.039L1027.51 413.365M1030.07 360.039H1068.1M1027.51 413.365H1063.39M1063.39 413.365L1068.1 360.039M1063.39 413.365H1099.92M1068.1 360.039H1102.66M1102.66 360.039L1099.92 413.365M1102.66 360.039H1139.86M1099.92 413.365H1135.11C1136.18 413.365 1137.05 412.533 1137.11 411.471L1139.86 360.039M1139.86 360.039L1133.59 353.922C1132.91 353.264 1132.79 352.226 1133.29 351.428L1158.47 311.273M1177.49 282.239L1124.98 275.512C1124.79 275.488 1124.6 275.435 1124.42 275.357L1065.13 249.1C1064.25 248.707 1063.77 247.734 1064 246.791L1073.85 206.967M1177.49 282.239L1183.16 283.482C1184.19 283.707 1185.21 283.1 1185.51 282.093L1230.72 128.422M1073.85 206.967L1146.46 232.516C1147.46 232.87 1148.57 232.373 1148.97 231.386L1192 126.028M1073.85 206.967L1106.2 88.1538C1106.43 87.3167 1107.17 86.722 1108.03 86.6813L1157.52 84.3592C1158.15 84.3293 1158.77 84.6066 1159.17 85.1054L1192 126.028M1192 126.028L1230.72 128.422M1230.72 128.422L1278.38 133.812M1278.38 133.812L1263.02 188.425M1278.38 133.812L1333.6 138.476M1284.17 322.928L1227.31 325.068C1225.95 325.119 1224.94 323.834 1225.31 322.528L1239.96 270.438M1284.17 322.928L1288.18 272.597C1288.27 271.433 1287.36 270.438 1286.19 270.438H1239.96M1284.17 322.928L1321.79 321.925M1239.96 270.438L1251.3 230.098M1321.79 321.925L1324.63 270.438L1327.19 230.098M1321.79 321.925H1338.08M1327.19 230.098H1251.3M1327.19 230.098L1330.07 190.054M1251.3 230.098L1263.02 188.425M1263.02 188.425L1330.07 190.054M1330.07 190.054L1333.6 138.476M1333.6 138.476H1346.22C1347.37 138.476 1348.28 139.441 1348.22 140.588L1338.08 321.925M1338.08 321.925L1333.37 415.719C1333.32 416.737 1332.51 417.553 1331.49 417.615L1315.59 418.573M1284.17 362.176H1316.65C1317.8 362.176 1318.71 363.142 1318.65 364.289L1315.59 418.573M1284.17 362.176H1236.05M1284.17 362.176L1280.76 411.269M1315.59 418.573L1282.37 420.574C1281.17 420.646 1280.17 419.643 1280.26 418.438L1280.76 411.269M1236.05 362.176L1233.84 408.812M1236.05 362.176L1191.87 364.539C1190.88 364.592 1190.08 365.358 1189.98 366.342L1184.98 417.507M1233.84 408.812L1280.76 411.269M1233.84 408.812V417.507M1184.98 417.507H1233.84M1184.98 417.507L1181.8 456.676M1233.84 417.507V456.676M1233.84 456.676H1181.8M1233.84 456.676L1236.3 494.475M1181.8 456.676L1178.12 494.475M1178.12 494.475H1236.3M1178.12 494.475L1174.2 531.539M1236.3 494.475L1238.26 531.539M1238.26 531.539H1174.2M1238.26 531.539V568.602M1174.2 531.539L1171.74 568.602M1171.74 568.602H1238.26M1171.74 568.602L1167.32 604.929M1238.26 568.602L1241.45 603.211M1241.45 603.211L1167.32 604.929M1241.45 603.211L1246.36 639.538M1167.32 604.929L1164.87 639.538M1164.87 639.538H1246.36M1164.87 639.538L1159.71 674.637M1246.36 639.538L1238.26 674.637M1238.26 674.637H1159.71M1238.26 674.637L1225.83 707.393C1225.62 707.946 1225.17 708.377 1224.62 708.572L1154.56 733.055M1159.71 674.637L1154.56 733.055M1154.56 733.055L1001.6 787.033C1001.11 787.204 1000.58 787.182 1000.11 786.97L998.265 786.138M998.265 786.138L992.016 885.529M992.016 885.529L1015.74 901.522C1016.41 901.973 1016.74 902.781 1016.58 903.572L1012.49 924.031C1012.29 925.025 1011.38 925.713 1010.37 925.632L988.631 923.893M992.016 885.529L988.631 923.893M988.631 923.893L956.125 921.296M865.556 914.06L867.479 882.024M865.556 914.06L911.688 917.746M865.556 914.06L834.494 909.492M867.479 882.024H911.688M867.479 882.024L868.917 850.592M911.688 882.024V917.746M911.688 882.024H957.819M911.688 882.024L913.61 850.592M911.688 917.746L956.125 921.296M957.819 882.024L956.125 921.296M957.819 882.024L959.463 850.592M868.917 850.592H913.61M868.917 850.592L870.44 817.294M913.61 850.592H959.463M913.61 850.592L916.173 817.633M959.463 850.592L961.204 817.294M916.173 817.633L961.204 817.294M916.173 817.633L916.186 817.294M961.204 817.294L962.835 786.099C962.895 784.955 961.983 783.995 960.838 783.995H917.454M917.454 783.995H873.874C872.805 783.995 871.925 784.836 871.876 785.904L870.44 817.294M917.454 783.995L916.186 817.294M870.44 817.294H916.186M832.88 862.162V907.623C832.88 908.56 833.567 909.356 834.494 909.492V909.492M832.88 862.162H789.632M832.88 862.162L834.494 829.806L836.31 788.278C836.361 787.12 835.421 786.162 834.263 786.191L789.632 787.3M789.632 862.162L788.03 899.964M789.632 862.162L743.18 863.764M788.03 899.964L834.494 909.492M788.03 899.964L743.18 891.955M743.18 891.955V863.764M743.18 891.955L708.983 887.033M743.18 863.764L745.165 829.806M745.165 829.806H787.632C788.736 829.806 789.632 828.911 789.632 827.806V787.3M745.165 829.806V789.3C745.165 788.196 746.06 787.3 747.165 787.3H789.632M708.983 887.033V843.215M708.983 887.033L635.45 878.759M708.983 843.215L710.611 790.739C710.646 789.61 709.741 788.677 708.612 788.677H664.412M708.983 843.215H664.412M635.45 843.215V878.759M635.45 843.215H664.412M635.45 843.215H630.116C629.011 843.215 628.116 842.319 628.116 841.215V839.737M635.45 878.759L627.067 877.703M664.412 788.677V843.215M664.412 788.677H628.116M628.116 788.677H594.855M628.116 788.677V839.737M627.067 877.703L605.439 937.872C605.075 938.886 603.973 939.429 602.948 939.101L432.434 884.587M627.067 877.703H619.018C617.914 877.703 617.018 876.807 617.018 875.703V857.572C617.018 856.453 616.101 855.552 614.983 855.572L549.591 856.727C548.472 856.747 547.555 855.846 547.555 854.728V788.677M432.434 884.587L452.617 788.677M432.434 884.587L426.988 882.665M452.617 788.677H547.555M452.617 788.677H445.249M563.987 788.677V837.737C563.987 838.842 564.882 839.737 565.987 839.737H594.855M563.987 788.677H594.855M563.987 788.677H547.555M594.855 839.737V788.677M594.855 839.737H628.116M426.988 882.665L445.249 788.677M426.988 882.665L384.381 868.569M445.249 788.677L391.429 782.393M384.381 868.569L391.429 782.393M384.381 868.569L337.609 845.504M391.429 782.393L341.453 777.268M337.609 845.504L341.453 777.268M337.609 845.504L291.157 821.156M341.453 777.268L293.399 771.501M293.399 771.501L291.157 821.156M293.399 771.501L229.328 765.094M291.157 821.156L229.328 791.684M229.328 765.094V791.684M229.328 765.094L158.85 759.007M229.328 791.684L209.039 801.071C208.324 801.402 207.482 801.282 206.887 800.765L158.85 759.007M1158.47 311.273L1078.46 303.861C1078.3 303.846 1078.14 303.812 1077.99 303.76L875.947 234.007C874.214 233.409 872.668 235.28 873.564 236.88C910.079 302.091 937.121 337.835 982.533 401.08C982.652 401.245 982.746 401.431 982.81 401.624L999.346 451.775"
                      stroke="black"
                    />
                    <path
                      d="M482.906 642.481L484.781 632.897L518.979 632.716L517.318 642.481H482.906Z"
                      stroke="black"
                      stroke-dasharray="2 2"
                    />
                    <path
                      d="M565.434 643.118L566.043 630.599C580.138 630.076 587.555 629.521 602.389 629.244L598.573 642.631L565.434 643.118Z"
                      stroke="black"
                      stroke-dasharray="2 2"
                    />
                    <path
                      d="M518.424 689.14C517.92 689.14 517.463 689.037 517.052 688.832C516.651 688.617 516.329 688.323 516.086 687.95C515.843 687.577 515.708 687.152 515.68 686.676V684.674C515.708 684.189 515.843 683.764 516.086 683.4C516.338 683.027 516.665 682.737 517.066 682.532C517.477 682.317 517.929 682.21 518.424 682.21C519.031 682.21 519.577 682.364 520.062 682.672C520.557 682.98 520.944 683.395 521.224 683.918C521.504 684.441 521.644 685.029 521.644 685.682C521.644 686.335 521.504 686.923 521.224 687.446C520.944 687.969 520.557 688.384 520.062 688.692C519.577 688.991 519.031 689.14 518.424 689.14ZM514.924 691.786V682.35H516.184V684.1L515.946 685.71L516.184 687.334V691.786H514.924ZM518.214 687.95C518.634 687.95 519.003 687.852 519.32 687.656C519.637 687.46 519.889 687.194 520.076 686.858C520.263 686.513 520.356 686.116 520.356 685.668C520.356 685.229 520.263 684.837 520.076 684.492C519.889 684.147 519.637 683.881 519.32 683.694C519.003 683.498 518.639 683.4 518.228 683.4C517.808 683.4 517.439 683.498 517.122 683.694C516.805 683.881 516.557 684.147 516.38 684.492C516.203 684.837 516.114 685.234 516.114 685.682C516.114 686.121 516.198 686.513 516.366 686.858C516.543 687.194 516.791 687.46 517.108 687.656C517.435 687.852 517.803 687.95 518.214 687.95ZM525.9 689.14C525.294 689.14 524.743 688.991 524.248 688.692C523.754 688.384 523.362 687.969 523.072 687.446C522.792 686.923 522.652 686.335 522.652 685.682C522.652 685.029 522.792 684.441 523.072 683.918C523.362 683.395 523.749 682.98 524.234 682.672C524.729 682.364 525.284 682.21 525.9 682.21C526.404 682.21 526.852 682.317 527.244 682.532C527.646 682.737 527.968 683.027 528.21 683.4C528.453 683.764 528.588 684.189 528.616 684.674V686.676C528.588 687.152 528.453 687.577 528.21 687.95C527.977 688.323 527.66 688.617 527.258 688.832C526.866 689.037 526.414 689.14 525.9 689.14ZM526.11 687.95C526.736 687.95 527.24 687.74 527.622 687.32C528.005 686.891 528.196 686.345 528.196 685.682C528.196 685.225 528.108 684.828 527.93 684.492C527.762 684.147 527.52 683.881 527.202 683.694C526.885 683.498 526.516 683.4 526.096 683.4C525.676 683.4 525.303 683.498 524.976 683.694C524.659 683.89 524.407 684.161 524.22 684.506C524.043 684.842 523.954 685.229 523.954 685.668C523.954 686.116 524.043 686.513 524.22 686.858C524.407 687.194 524.664 687.46 524.99 687.656C525.317 687.852 525.69 687.95 526.11 687.95ZM528.112 689V687.208L528.35 685.584L528.112 683.974V682.35H529.386V689H528.112ZM531.221 689V682.35H532.481V689H531.221ZM532.481 685.206L532.005 684.996C532.005 684.147 532.201 683.47 532.593 682.966C532.985 682.462 533.55 682.21 534.287 682.21C534.623 682.21 534.926 682.271 535.197 682.392C535.468 682.504 535.72 682.695 535.953 682.966L535.127 683.82C534.987 683.671 534.833 683.563 534.665 683.498C534.497 683.433 534.301 683.4 534.077 683.4C533.61 683.4 533.228 683.549 532.929 683.848C532.63 684.147 532.481 684.599 532.481 685.206ZM541.096 689L537.988 685.598L541.068 682.35H542.594L539.164 685.934L539.22 685.206L542.72 689H541.096ZM536.84 689V679.004H538.1V689H536.84Z"
                      fill="black"
                    />
                    <path
                      d="M219.424 917.884C218.92 917.884 218.463 917.782 218.052 917.576C217.651 917.362 217.329 917.068 217.086 916.694C216.843 916.321 216.708 915.896 216.68 915.42V913.418C216.708 912.933 216.843 912.508 217.086 912.144C217.338 911.771 217.665 911.482 218.066 911.276C218.477 911.062 218.929 910.954 219.424 910.954C220.031 910.954 220.577 911.108 221.062 911.416C221.557 911.724 221.944 912.14 222.224 912.662C222.504 913.185 222.644 913.773 222.644 914.426C222.644 915.08 222.504 915.668 222.224 916.19C221.944 916.713 221.557 917.128 221.062 917.436C220.577 917.735 220.031 917.884 219.424 917.884ZM215.924 920.53V911.094H217.184V912.844L216.946 914.454L217.184 916.078V920.53H215.924ZM219.214 916.694C219.634 916.694 220.003 916.596 220.32 916.4C220.637 916.204 220.889 915.938 221.076 915.602C221.263 915.257 221.356 914.86 221.356 914.412C221.356 913.974 221.263 913.582 221.076 913.236C220.889 912.891 220.637 912.625 220.32 912.438C220.003 912.242 219.639 912.144 219.228 912.144C218.808 912.144 218.439 912.242 218.122 912.438C217.805 912.625 217.557 912.891 217.38 913.236C217.203 913.582 217.114 913.978 217.114 914.426C217.114 914.865 217.198 915.257 217.366 915.602C217.543 915.938 217.791 916.204 218.108 916.4C218.435 916.596 218.803 916.694 219.214 916.694ZM226.9 917.884C226.294 917.884 225.743 917.735 225.248 917.436C224.754 917.128 224.362 916.713 224.072 916.19C223.792 915.668 223.652 915.08 223.652 914.426C223.652 913.773 223.792 913.185 224.072 912.662C224.362 912.14 224.749 911.724 225.234 911.416C225.729 911.108 226.284 910.954 226.9 910.954C227.404 910.954 227.852 911.062 228.244 911.276C228.646 911.482 228.968 911.771 229.21 912.144C229.453 912.508 229.588 912.933 229.616 913.418V915.42C229.588 915.896 229.453 916.321 229.21 916.694C228.977 917.068 228.66 917.362 228.258 917.576C227.866 917.782 227.414 917.884 226.9 917.884ZM227.11 916.694C227.736 916.694 228.24 916.484 228.622 916.064C229.005 915.635 229.196 915.089 229.196 914.426C229.196 913.969 229.108 913.572 228.93 913.236C228.762 912.891 228.52 912.625 228.202 912.438C227.885 912.242 227.516 912.144 227.096 912.144C226.676 912.144 226.303 912.242 225.976 912.438C225.659 912.634 225.407 912.905 225.22 913.25C225.043 913.586 224.954 913.974 224.954 914.412C224.954 914.86 225.043 915.257 225.22 915.602C225.407 915.938 225.664 916.204 225.99 916.4C226.317 916.596 226.69 916.694 227.11 916.694ZM229.112 917.744V915.952L229.35 914.328L229.112 912.718V911.094H230.386V917.744H229.112ZM232.221 917.744V911.094H233.481V917.744H232.221ZM233.481 913.95L233.005 913.74C233.005 912.891 233.201 912.214 233.593 911.71C233.985 911.206 234.55 910.954 235.287 910.954C235.623 910.954 235.926 911.015 236.197 911.136C236.468 911.248 236.72 911.44 236.953 911.71L236.127 912.564C235.987 912.415 235.833 912.308 235.665 912.242C235.497 912.177 235.301 912.144 235.077 912.144C234.61 912.144 234.228 912.294 233.929 912.592C233.63 912.891 233.481 913.344 233.481 913.95ZM242.096 917.744L238.988 914.342L242.068 911.094H243.594L240.164 914.678L240.22 913.95L243.72 917.744H242.096ZM237.84 917.744V907.748H239.1V917.744H237.84Z"
                      fill="black"
                    />
                    <path
                      d="M493.303 902.575L516.854 790.156C516.984 789.534 516.51 788.95 515.875 788.95L488.228 788.95C487.74 788.95 487.323 789.303 487.242 789.785L469.513 895.421C469.43 895.915 469.724 896.393 470.202 896.542L492.027 903.325C492.59 903.5 493.182 903.152 493.303 902.575Z"
                      stroke="#858585"
                      stroke-miterlimit="16"
                      stroke-linecap="round"
                    />
                    <path
                      d="M1144.44 258.728C1143.94 258.728 1143.48 258.625 1143.07 258.42C1142.67 258.205 1142.35 257.911 1142.1 257.538C1141.86 257.165 1141.73 256.74 1141.7 256.264V254.262C1141.73 253.777 1141.86 253.352 1142.1 252.988C1142.36 252.615 1142.68 252.325 1143.08 252.12C1143.49 251.905 1143.95 251.798 1144.44 251.798C1145.05 251.798 1145.59 251.952 1146.08 252.26C1146.57 252.568 1146.96 252.983 1147.24 253.506C1147.52 254.029 1147.66 254.617 1147.66 255.27C1147.66 255.923 1147.52 256.511 1147.24 257.034C1146.96 257.557 1146.57 257.972 1146.08 258.28C1145.59 258.579 1145.05 258.728 1144.44 258.728ZM1140.94 261.374V251.938H1142.2V253.688L1141.96 255.298L1142.2 256.922V261.374H1140.94ZM1144.23 257.538C1144.65 257.538 1145.02 257.44 1145.34 257.244C1145.65 257.048 1145.91 256.782 1146.09 256.446C1146.28 256.101 1146.37 255.704 1146.37 255.256C1146.37 254.817 1146.28 254.425 1146.09 254.08C1145.91 253.735 1145.65 253.469 1145.34 253.282C1145.02 253.086 1144.66 252.988 1144.25 252.988C1143.83 252.988 1143.46 253.086 1143.14 253.282C1142.82 253.469 1142.57 253.735 1142.4 254.08C1142.22 254.425 1142.13 254.822 1142.13 255.27C1142.13 255.709 1142.22 256.101 1142.38 256.446C1142.56 256.782 1142.81 257.048 1143.13 257.244C1143.45 257.44 1143.82 257.538 1144.23 257.538ZM1151.92 258.728C1151.31 258.728 1150.76 258.579 1150.27 258.28C1149.77 257.972 1149.38 257.557 1149.09 257.034C1148.81 256.511 1148.67 255.923 1148.67 255.27C1148.67 254.617 1148.81 254.029 1149.09 253.506C1149.38 252.983 1149.77 252.568 1150.25 252.26C1150.75 251.952 1151.3 251.798 1151.92 251.798C1152.42 251.798 1152.87 251.905 1153.26 252.12C1153.66 252.325 1153.99 252.615 1154.23 252.988C1154.47 253.352 1154.61 253.777 1154.63 254.262V256.264C1154.61 256.74 1154.47 257.165 1154.23 257.538C1153.99 257.911 1153.68 258.205 1153.28 258.42C1152.88 258.625 1152.43 258.728 1151.92 258.728ZM1152.13 257.538C1152.75 257.538 1153.26 257.328 1153.64 256.908C1154.02 256.479 1154.21 255.933 1154.21 255.27C1154.21 254.813 1154.13 254.416 1153.95 254.08C1153.78 253.735 1153.54 253.469 1153.22 253.282C1152.9 253.086 1152.53 252.988 1152.11 252.988C1151.69 252.988 1151.32 253.086 1150.99 253.282C1150.68 253.478 1150.42 253.749 1150.24 254.094C1150.06 254.43 1149.97 254.817 1149.97 255.256C1149.97 255.704 1150.06 256.101 1150.24 256.446C1150.42 256.782 1150.68 257.048 1151.01 257.244C1151.33 257.44 1151.71 257.538 1152.13 257.538ZM1154.13 258.588V256.796L1154.37 255.172L1154.13 253.562V251.938H1155.4V258.588H1154.13ZM1157.24 258.588V251.938H1158.5V258.588H1157.24ZM1158.5 254.794L1158.02 254.584C1158.02 253.735 1158.22 253.058 1158.61 252.554C1159 252.05 1159.57 251.798 1160.3 251.798C1160.64 251.798 1160.94 251.859 1161.21 251.98C1161.49 252.092 1161.74 252.283 1161.97 252.554L1161.14 253.408C1161 253.259 1160.85 253.151 1160.68 253.086C1160.51 253.021 1160.32 252.988 1160.09 252.988C1159.63 252.988 1159.25 253.137 1158.95 253.436C1158.65 253.735 1158.5 254.187 1158.5 254.794ZM1167.11 258.588L1164.01 255.186L1167.09 251.938H1168.61L1165.18 255.522L1165.24 254.794L1168.74 258.588H1167.11ZM1162.86 258.588V248.592H1164.12V258.588H1162.86Z"
                      fill="black"
                    />
                    <path
                      d="M185.22 766.435L185.953 767.914C186.053 768.119 186.319 768.317 186.544 768.355L187.873 768.577C188.723 768.72 188.923 769.342 188.311 769.955L187.278 770.997C187.103 771.173 187.007 771.514 187.061 771.757L187.357 773.047C187.59 774.068 187.053 774.462 186.157 773.929L184.911 773.185C184.686 773.051 184.315 773.051 184.086 773.185L182.841 773.929C181.949 774.462 181.407 774.063 181.641 773.047L181.937 771.757C181.991 771.514 181.895 771.173 181.72 770.997L180.687 769.955C180.078 769.342 180.274 768.72 181.124 768.577L182.453 768.355C182.674 768.317 182.941 768.119 183.041 767.914L183.774 766.435C184.174 765.633 184.824 765.633 185.22 766.435Z"
                      fill="black"
                      stroke="black"
                      stroke-width="0.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <g clip-path="url(#clip0_9_487)">
                      <path
                        d="M100.72 616.199L101.453 617.678C101.553 617.884 101.819 618.081 102.044 618.119L103.373 618.342C104.223 618.485 104.423 619.106 103.811 619.72L102.778 620.761C102.603 620.938 102.507 621.278 102.561 621.522L102.857 622.811C103.09 623.832 102.553 624.227 101.657 623.693L100.411 622.95C100.186 622.815 99.8155 622.815 99.5863 622.95L98.3406 623.693C97.4491 624.227 96.9074 623.828 97.1408 622.811L97.4366 621.522C97.4907 621.278 97.3949 620.938 97.2199 620.761L96.1867 619.72C95.5784 619.106 95.7742 618.485 96.6241 618.342L97.9532 618.119C98.174 618.081 98.4406 617.884 98.5406 617.678L99.2738 616.199C99.6738 615.397 100.324 615.397 100.72 616.199Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip1_9_487)">
                      <path
                        d="M163.72 618.435L164.453 619.914C164.553 620.12 164.819 620.317 165.044 620.355L166.373 620.578C167.223 620.72 167.423 621.342 166.811 621.955L165.778 622.997C165.603 623.174 165.507 623.514 165.561 623.757L165.857 625.047C166.09 626.068 165.553 626.463 164.657 625.929L163.411 625.186C163.186 625.051 162.815 625.051 162.586 625.186L161.341 625.929C160.449 626.463 159.907 626.064 160.141 625.047L160.437 623.757C160.491 623.514 160.395 623.174 160.22 622.997L159.187 621.955C158.578 621.342 158.774 620.72 159.624 620.578L160.953 620.355C161.174 620.317 161.441 620.12 161.541 619.914L162.274 618.435C162.674 617.633 163.324 617.633 163.72 618.435Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip2_9_487)">
                      <path
                        d="M242.72 771.435L243.453 772.914C243.553 773.119 243.819 773.317 244.044 773.355L245.373 773.577C246.223 773.72 246.423 774.342 245.811 774.955L244.778 775.997C244.603 776.173 244.507 776.514 244.561 776.757L244.857 778.047C245.09 779.068 244.553 779.462 243.657 778.929L242.411 778.185C242.186 778.051 241.815 778.051 241.586 778.185L240.341 778.929C239.449 779.462 238.907 779.063 239.141 778.047L239.437 776.757C239.491 776.514 239.395 776.173 239.22 775.997L238.187 774.955C237.578 774.342 237.774 773.72 238.624 773.577L239.953 773.355C240.174 773.317 240.441 773.119 240.541 772.914L241.274 771.435C241.674 770.633 242.324 770.633 242.72 771.435Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip3_9_487)">
                      <path
                        d="M302.72 778.435L303.454 779.914C303.554 780.12 303.82 780.317 304.045 780.355L305.374 780.578C306.224 780.72 306.424 781.342 305.812 781.955L304.779 782.997C304.604 783.174 304.508 783.514 304.562 783.757L304.858 785.047C305.091 786.068 304.554 786.463 303.658 785.929L302.412 785.186C302.187 785.051 301.816 785.051 301.587 785.186L300.342 785.929C299.45 786.463 298.908 786.064 299.142 785.047L299.438 783.757C299.492 783.514 299.396 783.174 299.221 782.997L298.188 781.955C297.579 781.342 297.775 780.72 298.625 780.578L299.954 780.355C300.175 780.317 300.442 780.12 300.542 779.914L301.275 778.435C301.675 777.633 302.325 777.633 302.72 778.435Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip4_9_487)">
                      <path
                        d="M351.72 783.435L352.454 784.914C352.554 785.12 352.82 785.317 353.045 785.355L354.374 785.578C355.224 785.72 355.424 786.342 354.812 786.955L353.779 787.997C353.604 788.174 353.508 788.514 353.562 788.757L353.858 790.047C354.091 791.068 353.554 791.463 352.658 790.929L351.412 790.186C351.187 790.051 350.816 790.051 350.587 790.186L349.342 790.929C348.45 791.463 347.908 791.064 348.142 790.047L348.438 788.757C348.492 788.514 348.396 788.174 348.221 787.997L347.188 786.955C346.579 786.342 346.775 785.72 347.625 785.578L348.954 785.355C349.175 785.317 349.442 785.12 349.542 784.914L350.275 783.435C350.675 782.633 351.325 782.633 351.72 783.435Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <path
                      d="M400.32 790.582L401.053 792.061C401.153 792.267 401.42 792.464 401.645 792.502L402.974 792.725C403.824 792.867 404.024 793.489 403.411 794.102L402.378 795.144C402.203 795.321 402.107 795.661 402.162 795.904L402.457 797.194C402.691 798.215 402.153 798.61 401.258 798.076L400.012 797.333C399.787 797.198 399.416 797.198 399.187 797.333L397.941 798.076C397.05 798.61 396.508 798.211 396.741 797.194L397.037 795.904C397.091 795.661 396.995 795.321 396.82 795.144L395.787 794.102C395.179 793.489 395.375 792.867 396.225 792.725L397.554 792.502C397.775 792.464 398.041 792.267 398.141 792.061L398.874 790.582C399.274 789.78 399.924 789.78 400.32 790.582Z"
                      fill="black"
                      stroke="black"
                      stroke-width="0.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <g clip-path="url(#clip5_9_487)">
                      <path
                        d="M266.72 623.435L267.453 624.914C267.553 625.12 267.819 625.317 268.044 625.355L269.373 625.578C270.223 625.72 270.423 626.342 269.811 626.955L268.778 627.997C268.603 628.174 268.507 628.514 268.561 628.757L268.857 630.047C269.09 631.068 268.553 631.463 267.657 630.929L266.411 630.186C266.186 630.051 265.815 630.051 265.586 630.186L264.341 630.929C263.449 631.463 262.907 631.064 263.141 630.047L263.437 628.757C263.491 628.514 263.395 628.174 263.22 627.997L262.187 626.955C261.578 626.342 261.774 625.72 262.624 625.578L263.953 625.355C264.174 625.317 264.441 625.12 264.541 624.914L265.274 623.435C265.674 622.633 266.324 622.633 266.72 623.435Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip6_9_487)">
                      <path
                        d="M316.72 626.199L317.453 627.678C317.553 627.884 317.819 628.081 318.044 628.119L319.373 628.342C320.223 628.485 320.423 629.106 319.811 629.72L318.778 630.761C318.603 630.938 318.507 631.278 318.561 631.522L318.857 632.811C319.09 633.832 318.553 634.227 317.657 633.693L316.411 632.95C316.186 632.815 315.815 632.815 315.586 632.95L314.341 633.693C313.449 634.227 312.907 633.828 313.141 632.811L313.437 631.522C313.491 631.278 313.395 630.938 313.22 630.761L312.187 629.72C311.578 629.106 311.774 628.485 312.624 628.342L313.953 628.119C314.174 628.081 314.441 627.884 314.541 627.678L315.274 626.199C315.674 625.397 316.324 625.397 316.72 626.199Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip7_9_487)">
                      <path
                        d="M417.72 633.312L418.453 634.791C418.553 634.997 418.819 635.194 419.044 635.232L420.373 635.455C421.223 635.598 421.423 636.219 420.811 636.833L419.778 637.874C419.603 638.051 419.507 638.391 419.561 638.635L419.857 639.924C420.09 640.945 419.553 641.34 418.657 640.806L417.411 640.063C417.186 639.928 416.815 639.928 416.586 640.063L415.341 640.806C414.449 641.34 413.907 640.941 414.141 639.924L414.437 638.635C414.491 638.391 414.395 638.051 414.22 637.874L413.187 636.833C412.578 636.219 412.774 635.598 413.624 635.455L414.953 635.232C415.174 635.194 415.441 634.997 415.541 634.791L416.274 633.312C416.674 632.51 417.324 632.51 417.72 633.312Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip8_9_487)">
                      <path
                        d="M415.72 673.149L416.453 674.627C416.553 674.833 416.819 675.031 417.044 675.069L418.373 675.291C419.223 675.434 419.423 676.056 418.811 676.669L417.778 677.711C417.603 677.887 417.507 678.227 417.561 678.471L417.857 679.761C418.09 680.781 417.553 681.176 416.657 680.643L415.411 679.899C415.186 679.765 414.815 679.765 414.586 679.899L413.341 680.643C412.449 681.176 411.907 680.777 412.141 679.761L412.437 678.471C412.491 678.227 412.395 677.887 412.22 677.711L411.187 676.669C410.578 676.056 410.774 675.434 411.624 675.291L412.953 675.069C413.174 675.031 413.441 674.833 413.541 674.627L414.274 673.149C414.674 672.347 415.324 672.347 415.72 673.149Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip9_9_487)">
                      <path
                        d="M412.72 709.435L413.453 710.914C413.553 711.119 413.819 711.317 414.044 711.355L415.373 711.577C416.223 711.72 416.423 712.342 415.811 712.955L414.778 713.997C414.603 714.173 414.507 714.514 414.561 714.757L414.857 716.047C415.09 717.068 414.553 717.462 413.657 716.929L412.411 716.185C412.186 716.051 411.815 716.051 411.586 716.185L410.341 716.929C409.449 717.462 408.907 717.063 409.141 716.047L409.437 714.757C409.491 714.514 409.395 714.173 409.22 713.997L408.187 712.955C407.578 712.342 407.774 711.72 408.624 711.577L409.953 711.355C410.174 711.317 410.441 711.119 410.541 710.914L411.274 709.435C411.674 708.633 412.324 708.633 412.72 709.435Z"
                        fill="black"
                        stroke="black"
                        stroke-width="0.625"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <path
                      d="M210.422 789V779.284H211.724V789H210.422ZM208.434 780.46V779.284H211.584V780.46H208.434ZM213.316 785.654L216.858 779.284H218.342L214.73 785.654H213.316ZM213.316 786.466V785.654L213.876 785.29H220.764V786.466H213.316ZM218.062 789V782.574H219.364V789H218.062Z"
                      fill="black"
                    />
                    <path
                      d="M131.12 700.854C130.392 700.854 129.725 700.649 129.118 700.238C128.521 699.827 128.045 699.249 127.69 698.502C127.335 697.746 127.158 696.859 127.158 695.842C127.158 694.825 127.331 693.943 127.676 693.196C128.031 692.449 128.507 691.875 129.104 691.474C129.701 691.063 130.359 690.858 131.078 690.858C131.815 690.858 132.483 691.063 133.08 691.474C133.677 691.875 134.149 692.449 134.494 693.196C134.849 693.943 135.026 694.829 135.026 695.856C135.026 696.873 134.849 697.76 134.494 698.516C134.149 699.263 133.677 699.841 133.08 700.252C132.492 700.653 131.839 700.854 131.12 700.854ZM131.092 699.608C131.605 699.608 132.053 699.468 132.436 699.188C132.828 698.899 133.136 698.474 133.36 697.914C133.584 697.354 133.696 696.663 133.696 695.842C133.696 695.021 133.584 694.335 133.36 693.784C133.136 693.224 132.828 692.804 132.436 692.524C132.044 692.235 131.591 692.09 131.078 692.09C130.574 692.09 130.126 692.235 129.734 692.524C129.342 692.804 129.034 693.224 128.81 693.784C128.595 694.335 128.488 695.021 128.488 695.842C128.488 696.663 128.595 697.354 128.81 697.914C129.034 698.474 129.342 698.899 129.734 699.188C130.126 699.468 130.579 699.608 131.092 699.608ZM138.11 700.714V690.998H139.412V700.714H138.11ZM136.122 692.174V690.998H139.272V692.174H136.122Z"
                      fill="black"
                    />
                    <path
                      d="M273.085 805.265V795.549H274.387V805.265H273.085ZM271.097 796.725V795.549H274.247V796.725H271.097ZM278.989 805.405C278.326 805.405 277.733 805.288 277.211 805.055C276.697 804.812 276.263 804.462 275.909 804.005L276.805 803.109C277.019 803.435 277.313 803.697 277.687 803.893C278.069 804.079 278.494 804.173 278.961 804.173C279.399 804.173 279.782 804.089 280.109 803.921C280.445 803.753 280.706 803.519 280.893 803.221C281.089 802.913 281.187 802.549 281.187 802.129C281.187 801.699 281.093 801.335 280.907 801.037C280.72 800.738 280.468 800.514 280.151 800.365C279.843 800.206 279.502 800.127 279.129 800.127C278.746 800.127 278.396 800.173 278.079 800.267C277.771 800.36 277.477 800.519 277.197 800.743L277.211 799.903C277.369 799.707 277.551 799.548 277.757 799.427C277.962 799.305 278.195 799.212 278.457 799.147C278.718 799.081 279.021 799.049 279.367 799.049C280.039 799.049 280.608 799.189 281.075 799.469C281.541 799.749 281.896 800.127 282.139 800.603C282.391 801.079 282.517 801.611 282.517 802.199C282.517 802.815 282.363 803.365 282.055 803.851C281.756 804.336 281.341 804.719 280.809 804.999C280.277 805.269 279.67 805.405 278.989 805.405ZM277.197 800.743L276.483 800.029L276.917 795.549H278.121L277.631 800.155L277.197 800.743ZM277.183 796.725L276.917 795.549H282.027V796.725H277.183Z"
                      fill="black"
                    />
                    <path
                      d="M318.739 818.169V808.453H320.041V818.169H318.739ZM316.751 809.629V808.453H319.901V809.629H316.751ZM325.119 818.309C324.475 818.309 323.896 818.16 323.383 817.861C322.879 817.563 322.478 817.161 322.179 816.657C321.88 816.153 321.731 815.593 321.731 814.977C321.731 814.119 322.03 813.265 322.627 812.415L325.483 808.453H327.009L324.083 812.443L323.607 812.695C323.719 812.499 323.854 812.336 324.013 812.205C324.172 812.065 324.368 811.958 324.601 811.883C324.834 811.809 325.11 811.771 325.427 811.771C325.996 811.771 326.51 811.907 326.967 812.177C327.434 812.448 327.807 812.821 328.087 813.297C328.376 813.764 328.521 814.31 328.521 814.935C328.521 815.551 328.367 816.116 328.059 816.629C327.76 817.143 327.35 817.553 326.827 817.861C326.314 818.16 325.744 818.309 325.119 818.309ZM325.119 817.077C325.511 817.077 325.861 816.984 326.169 816.797C326.486 816.601 326.734 816.345 326.911 816.027C327.098 815.701 327.191 815.337 327.191 814.935C327.191 814.534 327.098 814.175 326.911 813.857C326.734 813.531 326.486 813.274 326.169 813.087C325.861 812.901 325.511 812.807 325.119 812.807C324.727 812.807 324.372 812.901 324.055 813.087C323.747 813.274 323.5 813.531 323.313 813.857C323.136 814.175 323.047 814.534 323.047 814.935C323.047 815.337 323.136 815.701 323.313 816.027C323.5 816.354 323.747 816.611 324.055 816.797C324.372 816.984 324.727 817.077 325.119 817.077Z"
                      fill="black"
                    />
                    <path
                      d="M367.554 846.957V837.241H368.856V846.957H367.554ZM365.566 838.417V837.241H368.716V838.417H365.566ZM371.85 846.957L375.49 838.011L376.792 838.053L373.236 846.957H371.85ZM370.324 838.417V837.241H376.792V838.053L376.218 838.417H370.324Z"
                      fill="black"
                    />
                    <path
                      d="M411.457 864.957V855.241H412.759V864.957H411.457ZM409.469 856.417V855.241H412.619V856.417H409.469ZM417.739 865.097C417.095 865.097 416.525 864.976 416.031 864.733C415.545 864.491 415.167 864.155 414.897 863.725C414.626 863.296 414.491 862.811 414.491 862.269C414.491 861.831 414.575 861.429 414.743 861.065C414.911 860.701 415.158 860.393 415.485 860.141C415.811 859.88 416.194 859.693 416.633 859.581L416.675 859.959C416.301 859.857 415.984 859.693 415.723 859.469C415.461 859.236 415.261 858.965 415.121 858.657C414.99 858.34 414.925 858.004 414.925 857.649C414.925 857.145 415.046 856.702 415.289 856.319C415.531 855.937 415.863 855.638 416.283 855.423C416.712 855.199 417.197 855.087 417.739 855.087C418.289 855.087 418.775 855.199 419.195 855.423C419.615 855.638 419.946 855.937 420.189 856.319C420.431 856.702 420.553 857.145 420.553 857.649C420.553 858.004 420.483 858.34 420.343 858.657C420.212 858.965 420.016 859.236 419.755 859.469C419.503 859.693 419.19 859.857 418.817 859.959L418.845 859.581C419.293 859.693 419.675 859.88 419.993 860.141C420.319 860.393 420.567 860.701 420.735 861.065C420.912 861.429 421.001 861.831 421.001 862.269C421.001 862.811 420.865 863.296 420.595 863.725C420.324 864.155 419.941 864.491 419.447 864.733C418.961 864.976 418.392 865.097 417.739 865.097ZM417.739 863.907C418.131 863.907 418.471 863.833 418.761 863.683C419.059 863.525 419.293 863.31 419.461 863.039C419.638 862.769 419.727 862.456 419.727 862.101C419.727 861.756 419.638 861.448 419.461 861.177C419.293 860.907 419.059 860.697 418.761 860.547C418.471 860.389 418.131 860.309 417.739 860.309C417.356 860.309 417.015 860.389 416.717 860.547C416.418 860.697 416.18 860.907 416.003 861.177C415.835 861.448 415.751 861.756 415.751 862.101C415.751 862.456 415.835 862.769 416.003 863.039C416.18 863.31 416.418 863.525 416.717 863.683C417.015 863.833 417.356 863.907 417.739 863.907ZM417.739 859.287C418.205 859.287 418.588 859.143 418.887 858.853C419.185 858.564 419.335 858.191 419.335 857.733C419.335 857.285 419.185 856.921 418.887 856.641C418.588 856.352 418.205 856.207 417.739 856.207C417.281 856.207 416.903 856.352 416.605 856.641C416.306 856.921 416.157 857.285 416.157 857.733C416.157 858.191 416.306 858.564 416.605 858.853C416.903 859.143 417.281 859.287 417.739 859.287Z"
                      fill="black"
                    />
                    <path
                      d="M291.472 649.064C290.745 649.037 290.085 648.808 289.494 648.375C288.912 647.943 288.458 647.347 288.131 646.588C287.804 645.82 287.659 644.927 287.696 643.91C287.733 642.894 287.938 642.019 288.31 641.285C288.692 640.552 289.189 639.996 289.8 639.616C290.412 639.228 291.077 639.047 291.796 639.073C292.532 639.1 293.192 639.329 293.774 639.762C294.356 640.185 294.806 640.775 295.124 641.534C295.451 642.293 295.596 643.186 295.558 644.212C295.521 645.229 295.312 646.108 294.929 646.851C294.557 647.584 294.065 648.145 293.453 648.534C292.851 648.913 292.19 649.09 291.472 649.064ZM291.49 647.818C292.003 647.836 292.456 647.713 292.848 647.447C293.251 647.172 293.574 646.759 293.818 646.208C294.063 645.656 294.2 644.97 294.23 644.149C294.26 643.328 294.173 642.639 293.969 642.08C293.766 641.513 293.473 641.082 293.092 640.787C292.711 640.484 292.264 640.323 291.751 640.304C291.247 640.286 290.794 640.414 290.392 640.689C289.99 640.954 289.666 641.363 289.422 641.914C289.188 642.457 289.055 643.138 289.025 643.959C288.995 644.78 289.077 645.474 289.271 646.041C289.475 646.609 289.767 647.045 290.148 647.348C290.53 647.642 290.977 647.799 291.49 647.818ZM299.506 649.358C298.844 649.333 298.256 649.195 297.742 648.943C297.238 648.682 296.817 648.316 296.48 647.846L297.408 646.983C297.61 647.318 297.895 647.589 298.261 647.799C298.636 648 299.057 648.108 299.523 648.125C299.962 648.141 300.347 648.071 300.68 647.915C301.022 647.76 301.292 647.536 301.489 647.245C301.696 646.944 301.807 646.584 301.823 646.164C301.838 645.735 301.758 645.368 301.583 645.063C301.407 644.757 301.163 644.524 300.852 644.363C300.55 644.194 300.212 644.102 299.839 644.088C299.457 644.074 299.105 644.108 298.785 644.19C298.474 644.272 298.174 644.42 297.886 644.633L297.931 643.794C298.096 643.604 298.284 643.452 298.494 643.339C298.703 643.225 298.94 643.14 299.203 643.084C299.467 643.029 299.771 643.007 300.116 643.02C300.788 643.044 301.352 643.205 301.808 643.502C302.264 643.799 302.605 644.189 302.83 644.674C303.064 645.159 303.171 645.695 303.149 646.283C303.127 646.898 302.953 647.443 302.627 647.917C302.311 648.391 301.882 648.758 301.34 649.018C300.799 649.269 300.187 649.382 299.506 649.358ZM297.886 644.633L297.199 643.894L297.796 639.432L298.999 639.476L298.341 644.061L297.886 644.633ZM298.019 640.617L297.796 639.432L302.903 639.619L302.86 640.794L298.019 640.617Z"
                      fill="black"
                    />
                    <path
                      d="M289.355 682.564C288.628 682.537 287.968 682.308 287.377 681.875C286.795 681.443 286.34 680.847 286.013 680.088C285.687 679.32 285.542 678.427 285.579 677.41C285.616 676.394 285.821 675.519 286.193 674.785C286.575 674.052 287.072 673.496 287.683 673.116C288.295 672.728 288.96 672.547 289.678 672.573C290.415 672.6 291.075 672.829 291.657 673.262C292.239 673.685 292.689 674.275 293.007 675.034C293.334 675.793 293.479 676.686 293.441 677.712C293.404 678.729 293.194 679.608 292.812 680.351C292.44 681.084 291.948 681.645 291.336 682.034C290.734 682.413 290.073 682.59 289.355 682.564ZM289.373 681.318C289.886 681.336 290.338 681.213 290.731 680.947C291.133 680.672 291.457 680.259 291.701 679.708C291.945 679.156 292.083 678.47 292.113 677.649C292.143 676.828 292.056 676.139 291.852 675.58C291.649 675.013 291.356 674.582 290.975 674.287C290.593 673.984 290.146 673.823 289.633 673.804C289.13 673.786 288.677 673.914 288.274 674.189C287.872 674.454 287.549 674.863 287.305 675.414C287.07 675.957 286.938 676.638 286.908 677.459C286.878 678.28 286.96 678.974 287.154 679.541C287.357 680.109 287.65 680.545 288.031 680.848C288.412 681.142 288.86 681.299 289.373 681.318ZM297.865 682.875C297.221 682.851 296.649 682.681 296.146 682.364C295.654 682.047 295.267 681.631 294.987 681.117C294.707 680.602 294.578 680.037 294.601 679.421C294.632 678.563 294.962 677.721 295.59 676.894L298.589 673.039L300.114 673.095L297.044 676.975L296.559 677.209C296.678 677.018 296.819 676.859 296.983 676.735C297.146 676.601 297.346 676.5 297.582 676.434C297.818 676.368 298.094 676.341 298.412 676.353C298.981 676.373 299.489 676.527 299.936 676.815C300.392 677.102 300.752 677.489 301.014 677.975C301.286 678.452 301.411 679.003 301.388 679.628C301.365 680.243 301.191 680.802 300.864 681.304C300.547 681.806 300.122 682.201 299.588 682.49C299.064 682.769 298.49 682.898 297.865 682.875ZM297.91 681.644C298.302 681.658 298.655 681.578 298.969 681.402C299.294 681.218 299.55 680.971 299.739 680.66C299.938 680.34 300.044 679.98 300.059 679.579C300.073 679.178 299.993 678.815 299.818 678.491C299.653 678.158 299.415 677.893 299.105 677.695C298.804 677.497 298.458 677.391 298.066 677.377C297.674 677.362 297.316 677.443 296.992 677.618C296.678 677.793 296.421 678.04 296.223 678.36C296.034 678.671 295.932 679.026 295.918 679.427C295.903 679.829 295.978 680.196 296.144 680.528C296.318 680.862 296.556 681.127 296.857 681.325C297.167 681.523 297.518 681.629 297.91 681.644Z"
                      fill="black"
                    />
                    <path
                      d="M287.473 717.299C286.746 717.273 286.086 717.043 285.495 716.611C284.913 716.178 284.459 715.583 284.132 714.824C283.805 714.055 283.66 713.163 283.697 712.146C283.734 711.129 283.939 710.254 284.311 709.521C284.693 708.787 285.19 708.231 285.801 707.852C286.413 707.463 287.078 707.282 287.797 707.309C288.533 707.335 289.193 707.565 289.775 707.997C290.357 708.42 290.807 709.011 291.125 709.77C291.452 710.529 291.597 711.421 291.559 712.447C291.522 713.464 291.313 714.344 290.93 715.086C290.558 715.82 290.066 716.381 289.454 716.769C288.852 717.149 288.191 717.326 287.473 717.299ZM287.491 716.053C288.004 716.072 288.457 715.948 288.849 715.683C289.252 715.408 289.575 714.995 289.819 714.443C290.064 713.892 290.201 713.206 290.231 712.385C290.261 711.564 290.174 710.874 289.97 710.316C289.767 709.748 289.474 709.317 289.093 709.023C288.712 708.72 288.265 708.558 287.752 708.54C287.248 708.521 286.795 708.649 286.393 708.924C285.991 709.19 285.667 709.598 285.423 710.15C285.189 710.692 285.056 711.374 285.026 712.195C284.996 713.015 285.078 713.709 285.272 714.277C285.476 714.845 285.768 715.28 286.149 715.584C286.531 715.878 286.978 716.034 287.491 716.053ZM293.469 717.379L297.433 708.571L298.733 708.661L294.854 717.429L293.469 717.379ZM292.256 708.788L292.299 707.613L298.762 707.85L298.733 708.661L298.146 709.004L292.256 708.788Z"
                      fill="black"
                    />
                    <path
                      d="M347.923 722.299C347.196 722.273 346.537 722.043 345.945 721.611C345.363 721.178 344.909 720.583 344.582 719.824C344.255 719.055 344.11 718.163 344.147 717.146C344.184 716.129 344.389 715.254 344.762 714.521C345.143 713.787 345.64 713.231 346.252 712.852C346.864 712.463 347.529 712.282 348.247 712.309C348.984 712.335 349.643 712.565 350.225 712.997C350.807 713.42 351.257 714.011 351.575 714.77C351.902 715.529 352.047 716.421 352.009 717.447C351.972 718.464 351.763 719.344 351.381 720.086C351.008 720.82 350.516 721.381 349.904 721.769C349.302 722.149 348.642 722.326 347.923 722.299ZM347.941 721.053C348.454 721.072 348.907 720.948 349.299 720.683C349.702 720.408 350.025 719.995 350.269 719.443C350.514 718.892 350.651 718.206 350.681 717.385C350.711 716.564 350.624 715.874 350.42 715.316C350.217 714.748 349.924 714.317 349.543 714.023C349.162 713.72 348.715 713.558 348.202 713.54C347.698 713.521 347.245 713.649 346.843 713.924C346.441 714.19 346.118 714.598 345.873 715.15C345.639 715.692 345.506 716.374 345.476 717.195C345.446 718.015 345.528 718.709 345.722 719.277C345.926 719.845 346.218 720.28 346.599 720.584C346.981 720.878 347.428 721.034 347.941 721.053ZM356.335 722.607C355.692 722.583 355.127 722.441 354.642 722.181C354.166 721.921 353.8 721.571 353.545 721.132C353.291 720.693 353.173 720.203 353.193 719.662C353.209 719.224 353.307 718.826 353.489 718.468C353.67 718.111 353.928 717.812 354.264 717.572C354.6 717.323 354.989 717.15 355.432 717.054L355.46 717.434C355.09 717.317 354.779 717.142 354.526 716.909C354.274 716.666 354.083 716.389 353.954 716.076C353.835 715.754 353.782 715.416 353.795 715.061C353.814 714.557 353.951 714.119 354.208 713.745C354.464 713.372 354.806 713.085 355.234 712.886C355.671 712.678 356.16 712.584 356.701 712.604C357.251 712.624 357.732 712.753 358.144 712.993C358.556 713.222 358.876 713.533 359.104 713.924C359.333 714.316 359.438 714.763 359.42 715.267C359.407 715.621 359.324 715.954 359.173 716.266C359.031 716.569 358.825 716.833 358.556 717.056C358.296 717.271 357.977 717.423 357.6 717.512L357.642 717.135C358.086 717.263 358.461 717.464 358.769 717.737C359.086 718 359.322 718.317 359.477 718.687C359.641 719.057 359.715 719.462 359.699 719.9C359.679 720.441 359.526 720.921 359.24 721.34C358.953 721.759 358.559 722.081 358.056 722.306C357.562 722.53 356.988 722.631 356.335 722.607ZM356.379 721.418C356.771 721.432 357.114 721.37 357.408 721.231C357.713 721.084 357.954 720.878 358.131 720.613C358.318 720.349 358.419 720.04 358.431 719.686C358.444 719.341 358.367 719.029 358.199 718.753C358.041 718.476 357.816 718.257 357.523 718.097C357.24 717.928 356.902 717.836 356.51 717.822C356.128 717.808 355.785 717.875 355.48 718.023C355.176 718.161 354.931 718.362 354.744 718.626C354.566 718.89 354.471 719.195 354.458 719.54C354.445 719.895 354.518 720.21 354.676 720.487C354.843 720.764 355.073 720.987 355.366 721.157C355.659 721.317 355.996 721.404 356.379 721.418ZM356.548 716.801C357.014 716.818 357.402 716.687 357.711 716.409C358.02 716.131 358.183 715.763 358.199 715.306C358.216 714.859 358.08 714.489 357.792 714.199C357.504 713.899 357.127 713.74 356.66 713.723C356.203 713.706 355.82 713.837 355.511 714.115C355.202 714.384 355.04 714.742 355.023 715.19C355.007 715.647 355.142 716.026 355.43 716.326C355.718 716.626 356.091 716.784 356.548 716.801Z"
                      fill="black"
                    />
                    <path
                      d="M348.582 686.69C347.854 686.664 347.195 686.434 346.604 686.002C346.022 685.569 345.567 684.974 345.24 684.214C344.913 683.446 344.768 682.553 344.805 681.537C344.843 680.52 345.047 679.645 345.42 678.912C345.802 678.178 346.298 677.622 346.91 677.243C347.522 676.854 348.187 676.673 348.905 676.699C349.642 676.726 350.301 676.956 350.883 677.388C351.465 677.811 351.915 678.402 352.233 679.161C352.56 679.92 352.705 680.812 352.668 681.838C352.631 682.855 352.421 683.735 352.039 684.477C351.666 685.211 351.174 685.772 350.562 686.16C349.96 686.54 349.3 686.717 348.582 686.69ZM348.599 685.444C349.112 685.463 349.565 685.339 349.958 685.073C350.36 684.799 350.683 684.386 350.928 683.834C351.172 683.283 351.309 682.597 351.339 681.776C351.369 680.955 351.282 680.265 351.079 679.707C350.875 679.139 350.583 678.708 350.201 678.414C349.82 678.11 349.373 677.949 348.86 677.931C348.356 677.912 347.903 678.04 347.501 678.315C347.099 678.581 346.776 678.989 346.532 679.541C346.297 680.083 346.165 680.765 346.135 681.585C346.105 682.406 346.187 683.1 346.381 683.668C346.584 684.236 346.876 684.671 347.257 684.975C347.639 685.269 348.086 685.425 348.599 685.444ZM355.208 686.792L358.278 682.912L358.763 682.678C358.644 682.86 358.503 683.018 358.339 683.152C358.175 683.287 357.975 683.387 357.74 683.453C357.513 683.519 357.236 683.546 356.91 683.534C356.35 683.514 355.838 683.36 355.372 683.072C354.915 682.784 354.556 682.398 354.294 681.912C354.032 681.417 353.912 680.866 353.934 680.26C353.957 679.635 354.131 679.076 354.457 678.584C354.784 678.082 355.209 677.691 355.733 677.411C356.257 677.122 356.832 676.989 357.457 677.012C358.091 677.035 358.659 677.205 359.161 677.523C359.663 677.84 360.054 678.256 360.334 678.77C360.615 679.276 360.744 679.841 360.721 680.466C360.689 681.324 360.36 682.166 359.732 682.993L356.733 686.848L355.208 686.792ZM357.256 682.51C357.647 682.525 358.001 682.444 358.315 682.269C358.64 682.085 358.896 681.837 359.085 681.527C359.283 681.207 359.39 680.851 359.404 680.46C359.419 680.049 359.339 679.682 359.164 679.358C358.999 679.025 358.761 678.76 358.451 678.561C358.15 678.364 357.803 678.258 357.412 678.243C357.02 678.229 356.662 678.309 356.338 678.484C356.024 678.659 355.767 678.907 355.569 679.227C355.37 679.537 355.264 679.897 355.249 680.308C355.234 680.709 355.314 681.071 355.489 681.395C355.664 681.719 355.907 681.985 356.217 682.192C356.527 682.39 356.873 682.496 357.256 682.51Z"
                      fill="black"
                    />
                    <path
                      d="M350.154 653.07L350.509 643.36L351.81 643.408L351.455 653.117L350.154 653.07ZM348.479 644.463L348.522 643.287L351.67 643.403L351.627 644.578L348.479 644.463ZM357.196 653.467C356.468 653.441 355.809 653.211 355.217 652.778C354.636 652.346 354.181 651.751 353.854 650.991C353.527 650.223 353.382 649.33 353.419 648.314C353.457 647.297 353.661 646.422 354.034 645.688C354.415 644.955 354.912 644.399 355.524 644.02C356.136 643.631 356.801 643.45 357.519 643.476C358.256 643.503 358.915 643.733 359.497 644.165C360.079 644.588 360.529 645.179 360.847 645.938C361.174 646.697 361.319 647.589 361.282 648.615C361.244 649.632 361.035 650.512 360.653 651.254C360.28 651.988 359.788 652.549 359.176 652.937C358.574 653.317 357.914 653.493 357.196 653.467ZM357.213 652.221C357.726 652.24 358.179 652.116 358.572 651.85C358.974 651.576 359.297 651.162 359.542 650.611C359.786 650.06 359.923 649.373 359.953 648.553C359.983 647.732 359.896 647.042 359.692 646.484C359.489 645.916 359.197 645.485 358.815 645.191C358.434 644.887 357.987 644.726 357.474 644.708C356.97 644.689 356.517 644.817 356.115 645.092C355.713 645.358 355.39 645.766 355.146 646.318C354.911 646.86 354.779 647.542 354.749 648.362C354.719 649.183 354.801 649.877 354.995 650.445C355.198 651.013 355.49 651.448 355.871 651.752C356.253 652.046 356.7 652.202 357.213 652.221Z"
                      fill="black"
                    />
                    <path
                      d="M451.154 660.183L451.509 650.473L452.81 650.521L452.455 660.23L451.154 660.183ZM449.479 651.576L449.522 650.401L452.67 650.516L452.627 651.691L449.479 651.576ZM456.004 660.36L456.359 650.651L457.66 650.698L457.305 660.408L456.004 660.36ZM454.33 651.753L454.373 650.578L457.52 650.693L457.477 651.868L454.33 651.753Z"
                      fill="black"
                    />
                    <path
                      d="M446.548 700.514L446.903 690.805L448.205 690.852L447.85 700.562L446.548 700.514ZM444.874 691.907L444.917 690.732L448.065 690.847L448.022 692.022L444.874 691.907ZM449.469 699.822L453.189 696.176C453.566 695.816 453.863 695.505 454.078 695.242C454.293 694.97 454.447 694.718 454.54 694.488C454.641 694.258 454.697 694.018 454.706 693.766C454.724 693.271 454.58 692.879 454.273 692.587C453.966 692.296 453.561 692.141 453.057 692.122C452.563 692.104 452.124 692.21 451.743 692.439C451.361 692.658 451.017 693.01 450.709 693.494L449.814 692.69C450.22 692.07 450.699 691.611 451.251 691.314C451.804 691.007 452.435 690.867 453.144 690.893C453.741 690.915 454.254 691.05 454.684 691.299C455.123 691.549 455.456 691.888 455.684 692.317C455.911 692.745 456.014 693.239 455.994 693.799C455.979 694.2 455.915 694.557 455.8 694.871C455.696 695.184 455.511 695.504 455.247 695.831C454.992 696.149 454.638 696.528 454.183 696.969L451.178 699.843L449.469 699.822ZM449.44 700.62L449.469 699.822L450.602 699.486L456.003 699.683L455.96 700.858L449.44 700.62Z"
                      fill="black"
                    />
                    <path
                      d="M440.381 731.457L440.736 721.747L442.038 721.795L441.683 731.504L440.381 731.457ZM438.707 722.85L438.75 721.675L441.898 721.79L441.855 722.965L438.707 722.85ZM446.262 731.812C445.628 731.789 445.054 731.651 444.54 731.399C444.036 731.137 443.615 730.772 443.277 730.302L444.205 729.439C444.408 729.774 444.692 730.045 445.058 730.255C445.424 730.455 445.836 730.564 446.293 730.58C446.722 730.596 447.093 730.53 447.407 730.383C447.73 730.227 447.986 730.002 448.174 729.71C448.371 729.419 448.477 729.077 448.492 728.685C448.506 728.284 448.426 727.936 448.25 727.64C448.083 727.335 447.84 727.097 447.519 726.927C447.199 726.756 446.814 726.663 446.367 726.646C446.199 726.64 446.03 726.648 445.862 726.67C445.693 726.682 445.529 726.709 445.368 726.75L445.956 726.015C446.136 725.937 446.329 725.879 446.536 725.84C446.743 725.801 446.949 725.785 447.154 725.793C447.677 725.812 448.139 725.95 448.54 726.207C448.951 726.465 449.27 726.818 449.496 727.265C449.732 727.713 449.839 728.226 449.818 728.804C449.796 729.419 449.627 729.96 449.311 730.424C449.004 730.88 448.59 731.234 448.067 731.486C447.545 731.728 446.943 731.837 446.262 731.812ZM445.368 726.75L445.397 725.952L448.356 722.824L449.923 722.868L446.878 726.077L445.368 726.75ZM444.005 723.044L444.048 721.868L449.952 722.084L449.923 722.868L448.762 723.218L444.005 723.044Z"
                      fill="black"
                    />
                    <path
                      d="M199.924 673.404C199.196 673.404 198.528 673.199 197.922 672.788C197.324 672.378 196.848 671.799 196.494 671.052C196.139 670.296 195.962 669.41 195.962 668.392C195.962 667.375 196.134 666.493 196.48 665.746C196.834 665 197.31 664.426 197.908 664.024C198.505 663.614 199.163 663.408 199.882 663.408C200.619 663.408 201.286 663.614 201.884 664.024C202.481 664.426 202.952 665 203.298 665.746C203.652 666.493 203.83 667.38 203.83 668.406C203.83 669.424 203.652 670.31 203.298 671.066C202.952 671.813 202.481 672.392 201.884 672.802C201.296 673.204 200.642 673.404 199.924 673.404ZM199.896 672.158C200.409 672.158 200.857 672.018 201.24 671.738C201.632 671.449 201.94 671.024 202.164 670.464C202.388 669.904 202.5 669.214 202.5 668.392C202.5 667.571 202.388 666.885 202.164 666.334C201.94 665.774 201.632 665.354 201.24 665.074C200.848 664.785 200.395 664.64 199.882 664.64C199.378 664.64 198.93 664.785 198.538 665.074C198.146 665.354 197.838 665.774 197.614 666.334C197.399 666.885 197.292 667.571 197.292 668.392C197.292 669.214 197.399 669.904 197.614 670.464C197.838 671.024 198.146 671.449 198.538 671.738C198.93 672.018 199.382 672.158 199.896 672.158ZM207.949 673.404C207.315 673.404 206.736 673.288 206.213 673.054C205.7 672.812 205.266 672.462 204.911 672.004L205.807 671.108C206.022 671.435 206.316 671.696 206.689 671.892C207.063 672.079 207.478 672.172 207.935 672.172C208.365 672.172 208.733 672.093 209.041 671.934C209.359 671.766 209.606 671.533 209.783 671.234C209.97 670.936 210.063 670.59 210.063 670.198C210.063 669.797 209.97 669.452 209.783 669.162C209.606 668.864 209.354 668.635 209.027 668.476C208.701 668.318 208.313 668.238 207.865 668.238C207.697 668.238 207.529 668.252 207.361 668.28C207.193 668.299 207.03 668.332 206.871 668.378L207.431 667.622C207.609 667.538 207.8 667.473 208.005 667.426C208.211 667.38 208.416 667.356 208.621 667.356C209.144 667.356 209.611 667.478 210.021 667.72C210.441 667.963 210.773 668.304 211.015 668.742C211.267 669.181 211.393 669.69 211.393 670.268C211.393 670.884 211.244 671.43 210.945 671.906C210.656 672.373 210.255 672.742 209.741 673.012C209.228 673.274 208.631 673.404 207.949 673.404ZM206.871 668.378V667.58L209.713 664.346L211.281 664.332L208.355 667.65L206.871 668.378ZM205.373 664.724V663.548H211.281V664.332L210.133 664.724H205.373Z"
                      fill="black"
                    />
                    <path
                      d="M199.924 636.14C199.196 636.14 198.528 635.935 197.922 635.524C197.324 635.114 196.848 634.535 196.494 633.788C196.139 633.032 195.962 632.146 195.962 631.128C195.962 630.111 196.134 629.229 196.48 628.482C196.834 627.736 197.31 627.162 197.908 626.76C198.505 626.35 199.163 626.144 199.882 626.144C200.619 626.144 201.286 626.35 201.884 626.76C202.481 627.162 202.952 627.736 203.298 628.482C203.652 629.229 203.83 630.116 203.83 631.142C203.83 632.16 203.652 633.046 203.298 633.802C202.952 634.549 202.481 635.128 201.884 635.538C201.296 635.94 200.642 636.14 199.924 636.14ZM199.896 634.894C200.409 634.894 200.857 634.754 201.24 634.474C201.632 634.185 201.94 633.76 202.164 633.2C202.388 632.64 202.5 631.95 202.5 631.128C202.5 630.307 202.388 629.621 202.164 629.07C201.94 628.51 201.632 628.09 201.24 627.81C200.848 627.521 200.395 627.376 199.882 627.376C199.378 627.376 198.93 627.521 198.538 627.81C198.146 628.09 197.838 628.51 197.614 629.07C197.399 629.621 197.292 630.307 197.292 631.128C197.292 631.95 197.399 632.64 197.614 633.2C197.838 633.76 198.146 634.185 198.538 634.474C198.93 634.754 199.382 634.894 199.896 634.894ZM204.953 632.654L208.495 626.284H209.979L206.367 632.654H204.953ZM204.953 633.466V632.654L205.513 632.29H212.401V633.466H204.953ZM209.699 636V629.574H211.001V636H209.699Z"
                      fill="black"
                    />
                    <path
                      d="M274.64 589.761L277.566 585.771L278.042 585.519C277.93 585.706 277.795 585.869 277.636 586.009C277.477 586.149 277.281 586.256 277.048 586.331C276.824 586.406 276.549 586.443 276.222 586.443C275.662 586.443 275.144 586.308 274.668 586.037C274.201 585.766 273.828 585.393 273.548 584.917C273.268 584.432 273.128 583.886 273.128 583.279C273.128 582.654 273.282 582.089 273.59 581.585C273.898 581.072 274.309 580.666 274.822 580.367C275.335 580.059 275.905 579.905 276.53 579.905C277.165 579.905 277.739 580.054 278.252 580.353C278.765 580.652 279.171 581.053 279.47 581.557C279.769 582.052 279.918 582.612 279.918 583.237C279.918 584.096 279.619 584.95 279.022 585.799L276.166 589.761H274.64ZM276.53 585.407C276.922 585.407 277.272 585.314 277.58 585.127C277.897 584.931 278.145 584.674 278.322 584.357C278.509 584.03 278.602 583.671 278.602 583.279C278.602 582.868 278.509 582.504 278.322 582.187C278.145 581.86 277.897 581.604 277.58 581.417C277.272 581.23 276.922 581.137 276.53 581.137C276.138 581.137 275.783 581.23 275.466 581.417C275.158 581.604 274.911 581.86 274.724 582.187C274.537 582.504 274.444 582.868 274.444 583.279C274.444 583.68 274.537 584.04 274.724 584.357C274.911 584.674 275.163 584.931 275.48 585.127C275.797 585.314 276.147 585.407 276.53 585.407ZM282.542 589.761L285.468 585.771L285.944 585.519C285.832 585.706 285.697 585.869 285.538 586.009C285.38 586.149 285.184 586.256 284.95 586.331C284.726 586.406 284.451 586.443 284.124 586.443C283.564 586.443 283.046 586.308 282.57 586.037C282.104 585.766 281.73 585.393 281.45 584.917C281.17 584.432 281.03 583.886 281.03 583.279C281.03 582.654 281.184 582.089 281.492 581.585C281.8 581.072 282.211 580.666 282.724 580.367C283.238 580.059 283.807 579.905 284.432 579.905C285.067 579.905 285.641 580.054 286.154 580.353C286.668 580.652 287.074 581.053 287.372 581.557C287.671 582.052 287.82 582.612 287.82 583.237C287.82 584.096 287.522 584.95 286.924 585.799L284.068 589.761H282.542ZM284.432 585.407C284.824 585.407 285.174 585.314 285.482 585.127C285.8 584.931 286.047 584.674 286.224 584.357C286.411 584.03 286.504 583.671 286.504 583.279C286.504 582.868 286.411 582.504 286.224 582.187C286.047 581.86 285.8 581.604 285.482 581.417C285.174 581.23 284.824 581.137 284.432 581.137C284.04 581.137 283.686 581.23 283.368 581.417C283.06 581.604 282.813 581.86 282.626 582.187C282.44 582.504 282.346 582.868 282.346 583.279C282.346 583.68 282.44 584.04 282.626 584.357C282.813 584.674 283.065 584.931 283.382 585.127C283.7 585.314 284.05 585.407 284.432 585.407ZM289.419 589.901C289.157 589.901 288.938 589.812 288.761 589.635C288.593 589.448 288.509 589.229 288.509 588.977C288.509 588.716 288.593 588.501 288.761 588.333C288.938 588.156 289.157 588.067 289.419 588.067C289.68 588.067 289.895 588.156 290.063 588.333C290.24 588.501 290.329 588.716 290.329 588.977C290.329 589.229 290.24 589.448 290.063 589.635C289.895 589.812 289.68 589.901 289.419 589.901ZM291.911 588.963L295.495 585.183C295.859 584.81 296.144 584.488 296.349 584.217C296.555 583.937 296.699 583.68 296.783 583.447C296.877 583.214 296.923 582.971 296.923 582.719C296.923 582.224 296.765 581.837 296.447 581.557C296.13 581.277 295.719 581.137 295.215 581.137C294.721 581.137 294.287 581.258 293.913 581.501C293.54 581.734 293.209 582.098 292.919 582.593L291.995 581.823C292.378 581.188 292.84 580.712 293.381 580.395C293.923 580.068 294.548 579.905 295.257 579.905C295.855 579.905 296.373 580.022 296.811 580.255C297.259 580.488 297.605 580.815 297.847 581.235C298.09 581.655 298.211 582.145 298.211 582.705C298.211 583.106 298.16 583.466 298.057 583.783C297.964 584.1 297.791 584.427 297.539 584.763C297.297 585.09 296.956 585.482 296.517 585.939L293.619 588.921L291.911 588.963ZM291.911 589.761V588.963L293.031 588.585H298.435V589.761H291.911ZM299.947 589.761V583.111H301.207V589.761H299.947ZM304.441 589.761V585.743C304.441 585.248 304.287 584.861 303.979 584.581C303.681 584.292 303.303 584.147 302.845 584.147C302.537 584.147 302.262 584.212 302.019 584.343C301.777 584.474 301.581 584.656 301.431 584.889C301.282 585.122 301.207 585.402 301.207 585.729L300.689 585.477C300.689 584.973 300.797 584.534 301.011 584.161C301.235 583.788 301.539 583.498 301.921 583.293C302.304 583.078 302.733 582.971 303.209 582.971C303.676 582.971 304.096 583.074 304.469 583.279C304.852 583.484 305.151 583.774 305.365 584.147C305.589 584.52 305.701 584.964 305.701 585.477V589.761H304.441ZM308.935 589.761V585.743C308.935 585.248 308.781 584.861 308.473 584.581C308.175 584.292 307.801 584.147 307.353 584.147C307.045 584.147 306.765 584.212 306.513 584.343C306.271 584.474 306.075 584.656 305.925 584.889C305.776 585.122 305.701 585.402 305.701 585.729L304.987 585.477C305.015 584.964 305.151 584.525 305.393 584.161C305.645 583.788 305.967 583.498 306.359 583.293C306.751 583.078 307.181 582.971 307.647 582.971C308.133 582.971 308.567 583.074 308.949 583.279C309.332 583.484 309.635 583.774 309.859 584.147C310.093 584.52 310.209 584.968 310.209 585.491V589.761H308.935Z"
                      fill="black"
                    />
                    <path
                      d="M519.649 605.927V596.211H520.951V605.927H519.649ZM517.661 597.387V596.211H520.811V597.387H517.661ZM523.944 605.927L527.584 596.981L528.886 597.023L525.33 605.927H523.944ZM522.418 597.387V596.211H528.886V597.023L528.312 597.387H522.418ZM530.413 606.067C530.151 606.067 529.932 605.978 529.755 605.801C529.587 605.614 529.503 605.395 529.503 605.143C529.503 604.881 529.587 604.667 529.755 604.499C529.932 604.321 530.151 604.233 530.413 604.233C530.674 604.233 530.889 604.321 531.057 604.499C531.234 604.667 531.323 604.881 531.323 605.143C531.323 605.395 531.234 605.614 531.057 605.801C530.889 605.978 530.674 606.067 530.413 606.067ZM536.681 606.067C535.953 606.067 535.285 605.861 534.679 605.451C534.081 605.04 533.605 604.461 533.251 603.715C532.896 602.959 532.719 602.072 532.719 601.055C532.719 600.037 532.891 599.155 533.237 598.409C533.591 597.662 534.067 597.088 534.665 596.687C535.262 596.276 535.92 596.071 536.639 596.071C537.376 596.071 538.043 596.276 538.641 596.687C539.238 597.088 539.709 597.662 540.055 598.409C540.409 599.155 540.587 600.042 540.587 601.069C540.587 602.086 540.409 602.973 540.055 603.729C539.709 604.475 539.238 605.054 538.641 605.465C538.053 605.866 537.399 606.067 536.681 606.067ZM536.653 604.821C537.166 604.821 537.614 604.681 537.997 604.401C538.389 604.111 538.697 603.687 538.921 603.127C539.145 602.567 539.257 601.876 539.257 601.055C539.257 600.233 539.145 599.547 538.921 598.997C538.697 598.437 538.389 598.017 537.997 597.737C537.605 597.447 537.152 597.303 536.639 597.303C536.135 597.303 535.687 597.447 535.295 597.737C534.903 598.017 534.595 598.437 534.371 598.997C534.156 599.547 534.049 600.233 534.049 601.055C534.049 601.876 534.156 602.567 534.371 603.127C534.595 603.687 534.903 604.111 535.295 604.401C535.687 604.681 536.139 604.821 536.653 604.821ZM545.084 605.927V599.277H546.344V605.927H545.084ZM549.578 605.927V601.909C549.578 601.414 549.424 601.027 549.116 600.747C548.817 600.457 548.439 600.313 547.982 600.313C547.674 600.313 547.399 600.378 547.156 600.509C546.913 600.639 546.717 600.821 546.568 601.055C546.419 601.288 546.344 601.568 546.344 601.895L545.826 601.643C545.826 601.139 545.933 600.7 546.148 600.327C546.372 599.953 546.675 599.664 547.058 599.459C547.441 599.244 547.87 599.137 548.346 599.137C548.813 599.137 549.233 599.239 549.606 599.445C549.989 599.65 550.287 599.939 550.502 600.313C550.726 600.686 550.838 601.129 550.838 601.643V605.927H549.578ZM554.072 605.927V601.909C554.072 601.414 553.918 601.027 553.61 600.747C553.311 600.457 552.938 600.313 552.49 600.313C552.182 600.313 551.902 600.378 551.65 600.509C551.407 600.639 551.211 600.821 551.062 601.055C550.913 601.288 550.838 601.568 550.838 601.895L550.124 601.643C550.152 601.129 550.287 600.691 550.53 600.327C550.782 599.953 551.104 599.664 551.496 599.459C551.888 599.244 552.317 599.137 552.784 599.137C553.269 599.137 553.703 599.239 554.086 599.445C554.469 599.65 554.772 599.939 554.996 600.313C555.229 600.686 555.346 601.134 555.346 601.657V605.927H554.072Z"
                      fill="black"
                    />
                    <path
                      d="M597.498 606.328V598H598.614V606.328H597.498ZM595.794 599.008V598H598.494V599.008H595.794ZM602.966 606.448C602.414 606.448 601.918 606.32 601.478 606.064C601.046 605.808 600.702 605.464 600.446 605.032C600.19 604.6 600.062 604.12 600.062 603.592C600.062 602.856 600.318 602.124 600.83 601.396L603.278 598H604.586L602.078 601.42L601.67 601.636C601.766 601.468 601.882 601.328 602.018 601.216C602.154 601.096 602.322 601.004 602.522 600.94C602.722 600.876 602.958 600.844 603.23 600.844C603.718 600.844 604.158 600.96 604.55 601.192C604.95 601.424 605.27 601.744 605.51 602.152C605.758 602.552 605.882 603.02 605.882 603.556C605.882 604.084 605.75 604.568 605.486 605.008C605.23 605.448 604.878 605.8 604.43 606.064C603.99 606.32 603.502 606.448 602.966 606.448ZM602.966 605.392C603.302 605.392 603.602 605.312 603.866 605.152C604.138 604.984 604.35 604.764 604.502 604.492C604.662 604.212 604.742 603.9 604.742 603.556C604.742 603.212 604.662 602.904 604.502 602.632C604.35 602.352 604.138 602.132 603.866 601.972C603.602 601.812 603.302 601.732 602.966 601.732C602.63 601.732 602.326 601.812 602.054 601.972C601.79 602.132 601.578 602.352 601.418 602.632C601.266 602.904 601.19 603.212 601.19 603.556C601.19 603.9 601.266 604.212 601.418 604.492C601.578 604.772 601.79 604.992 602.054 605.152C602.326 605.312 602.63 605.392 602.966 605.392ZM608.095 606.448C607.871 606.448 607.683 606.372 607.531 606.22C607.387 606.06 607.315 605.872 607.315 605.656C607.315 605.432 607.387 605.248 607.531 605.104C607.683 604.952 607.871 604.876 608.095 604.876C608.319 604.876 608.503 604.952 608.647 605.104C608.799 605.248 608.875 605.432 608.875 605.656C608.875 605.872 608.799 606.06 608.647 606.22C608.503 606.372 608.319 606.448 608.095 606.448ZM609.845 603.46L612.881 598H614.153L611.057 603.46H609.845ZM609.845 604.156V603.46L610.325 603.148H616.229V604.156H609.845ZM613.913 606.328V600.82H615.029V606.328H613.913ZM619.909 606.328V600.628H620.989V606.328H619.909ZM623.761 606.328V602.884C623.761 602.46 623.629 602.128 623.365 601.888C623.109 601.64 622.785 601.516 622.393 601.516C622.129 601.516 621.893 601.572 621.685 601.684C621.477 601.796 621.309 601.952 621.181 602.152C621.053 602.352 620.989 602.592 620.989 602.872L620.545 602.656C620.545 602.224 620.637 601.848 620.821 601.528C621.013 601.208 621.273 600.96 621.601 600.784C621.929 600.6 622.297 600.508 622.705 600.508C623.105 600.508 623.465 600.596 623.785 600.772C624.113 600.948 624.369 601.196 624.553 601.516C624.745 601.836 624.841 602.216 624.841 602.656V606.328H623.761ZM627.613 606.328V602.884C627.613 602.46 627.481 602.128 627.217 601.888C626.961 601.64 626.641 601.516 626.257 601.516C625.993 601.516 625.753 601.572 625.537 601.684C625.329 601.796 625.161 601.952 625.033 602.152C624.905 602.352 624.841 602.592 624.841 602.872L624.229 602.656C624.253 602.216 624.369 601.84 624.577 601.528C624.793 601.208 625.069 600.96 625.405 600.784C625.741 600.6 626.109 600.508 626.509 600.508C626.925 600.508 627.297 600.596 627.625 600.772C627.953 600.948 628.213 601.196 628.405 601.516C628.605 601.836 628.705 602.22 628.705 602.668V606.328H627.613Z"
                      fill="black"
                    />
                    <path
                      d="M56.7547 676.446L53.0343 672.8C52.667 672.43 52.3498 672.14 52.0825 671.931C51.806 671.721 51.5517 671.572 51.3198 671.484C51.088 671.387 50.8462 671.336 50.5942 671.332C50.0996 671.324 49.7097 671.476 49.4245 671.789C49.1393 672.101 48.9926 672.51 48.9843 673.014C48.9761 673.508 49.0903 673.944 49.3267 674.321C49.5539 674.699 49.9124 675.036 50.4022 675.333L49.6171 676.244C48.9888 675.851 48.5205 675.382 48.2121 674.835C47.8944 674.288 47.7414 673.661 47.7531 672.951C47.763 672.354 47.8882 671.838 48.1287 671.403C48.3694 670.959 48.7017 670.619 49.1256 670.384C49.5496 670.148 50.0415 670.035 50.6014 670.044C51.0027 670.05 51.3612 670.108 51.6768 670.216C51.9925 670.314 52.3163 670.492 52.6481 670.75C52.9707 670.998 53.357 671.345 53.8071 671.791L56.7409 674.738L56.7547 676.446ZM57.5526 676.459L56.7547 676.446L56.3952 675.32L56.4843 669.917L57.6602 669.936L57.5526 676.459ZM56.8796 668.873L53.1592 665.227C52.792 664.857 52.4747 664.567 52.2074 664.357C51.9309 664.147 51.6766 663.999 51.4447 663.911C51.2129 663.814 50.9711 663.763 50.7191 663.759C50.2245 663.751 49.8346 663.903 49.5494 664.216C49.2642 664.528 49.1175 664.936 49.1092 665.44C49.101 665.935 49.2152 666.371 49.4516 666.748C49.6788 667.125 50.0373 667.463 50.5271 667.76L49.742 668.671C49.1137 668.278 48.6454 667.808 48.337 667.262C48.0193 666.715 47.8663 666.087 47.878 665.378C47.8879 664.781 48.0131 664.265 48.2536 663.83C48.4943 663.386 48.8266 663.046 49.2506 662.81C49.6745 662.575 50.1664 662.461 50.7264 662.471C51.1276 662.477 51.4861 662.535 51.8017 662.642C52.1174 662.741 52.4412 662.919 52.773 663.177C53.0956 663.425 53.4819 663.772 53.932 664.218L56.8658 667.165L56.8796 668.873ZM57.6775 668.886L56.8796 668.873L56.5201 667.747L56.6093 662.344L57.7851 662.363L57.6775 668.886ZM57.9683 659.748C57.9639 660.009 57.8717 660.227 57.6914 660.401C57.502 660.566 57.2813 660.646 57.0294 660.642C56.7681 660.638 56.5548 660.55 56.3896 660.38C56.2152 660.199 56.1302 659.979 56.1345 659.717C56.1388 659.456 56.231 659.243 56.4111 659.078C56.582 658.903 56.7981 658.818 57.0594 658.822C57.3114 658.827 57.5292 658.919 57.7129 659.099C57.8875 659.27 57.9726 659.486 57.9683 659.748ZM58.0716 653.481C58.0596 654.209 57.8433 654.872 57.4227 655.472C57.0022 656.063 56.4158 656.529 55.6634 656.871C54.9016 657.214 54.0122 657.376 52.995 657.359C51.9778 657.343 51.0987 657.155 50.3579 656.798C49.6172 656.431 49.0511 655.946 48.6597 655.342C48.2589 654.738 48.0644 654.076 48.0763 653.358C48.0884 652.621 48.3048 651.957 48.7252 651.366C49.1364 650.776 49.718 650.314 50.4703 649.981C51.2227 649.639 52.1122 649.476 53.1387 649.493C54.1559 649.51 55.0395 649.701 55.7896 650.069C56.5305 650.426 57.1013 650.907 57.502 651.511C57.8936 652.106 58.0835 652.762 58.0716 653.481ZM56.8253 653.488C56.8338 652.975 56.7012 652.525 56.4276 652.137C56.1447 651.741 55.7252 651.426 55.169 651.192C54.6127 650.959 53.924 650.836 53.1028 650.822C52.2816 650.809 51.5938 650.909 51.0395 651.124C50.4759 651.339 50.0509 651.64 49.7645 652.027C49.4687 652.415 49.3166 652.865 49.3081 653.378C49.2998 653.882 49.4371 654.332 49.7199 654.729C49.9934 655.126 50.4083 655.441 50.9645 655.674C51.5115 655.897 52.1957 656.016 53.0169 656.03C53.8381 656.043 54.5305 655.947 55.0939 655.742C55.6575 655.527 56.0872 655.226 56.383 654.839C56.6694 654.452 56.8169 654.001 56.8253 653.488ZM58.0702 645.076L51.4211 644.966L51.4419 643.706L58.091 643.816L58.0702 645.076ZM58.1443 640.582L54.1269 640.516C53.6323 640.508 53.2425 640.656 52.9574 640.959C52.6632 641.253 52.5123 641.628 52.5048 642.086C52.4997 642.394 52.5605 642.67 52.6871 642.915C52.8138 643.16 52.9925 643.359 53.2234 643.512C53.4542 643.665 53.7329 643.744 54.0596 643.75L53.7991 644.263C53.2951 644.255 52.8583 644.14 52.4885 643.92C52.119 643.69 51.8347 643.381 51.6357 642.995C51.4273 642.609 51.3271 642.178 51.335 641.702C51.3426 641.236 51.4522 640.817 51.6637 640.448C51.8753 640.068 52.1695 639.774 52.5463 639.566C52.9233 639.348 53.3684 639.244 53.8817 639.252L58.1651 639.323L58.1443 640.582ZM58.2185 636.089L54.201 636.023C53.7064 636.015 53.3166 636.162 53.0315 636.466C52.7373 636.759 52.5865 637.13 52.5791 637.578C52.5741 637.886 52.6348 638.167 52.7613 638.421C52.8879 638.666 53.0666 638.865 53.2975 639.018C53.5283 639.171 53.8071 639.251 54.1337 639.256L53.8699 639.966C53.3571 639.929 52.9208 639.787 52.5608 639.538C52.1917 639.28 51.9077 638.953 51.7089 638.558C51.5007 638.163 51.4004 637.732 51.4081 637.265C51.4161 636.78 51.526 636.347 51.7376 635.968C51.9492 635.589 52.2435 635.29 52.6205 635.073C52.9976 634.845 53.4475 634.736 53.9701 634.745L58.2395 634.815L58.2185 636.089Z"
                      fill="black"
                    />
                    <path
                      d="M110.003 770.09C109.524 769.674 109.164 769.206 108.922 768.687C108.693 768.168 108.595 767.619 108.627 767.041L109.891 766.952C109.839 767.339 109.889 767.729 110.043 768.122C110.203 768.507 110.455 768.85 110.8 769.15C111.125 769.431 111.455 769.613 111.792 769.695C112.141 769.776 112.481 769.762 112.811 769.653C113.148 769.55 113.444 769.35 113.701 769.054C113.964 768.751 114.12 768.429 114.169 768.088C114.231 767.746 114.19 767.408 114.048 767.074C113.905 766.74 113.664 766.427 113.326 766.133C113.199 766.023 113.063 765.923 112.918 765.834C112.779 765.738 112.634 765.656 112.484 765.587L113.402 765.383C113.591 765.436 113.778 765.512 113.964 765.611C114.15 765.711 114.32 765.828 114.475 765.962C114.87 766.305 115.143 766.703 115.294 767.155C115.452 767.614 115.479 768.088 115.375 768.578C115.278 769.075 115.039 769.542 114.66 769.979C114.256 770.444 113.786 770.758 113.248 770.922C112.724 771.085 112.179 771.1 111.614 770.968C111.055 770.829 110.518 770.536 110.003 770.09ZM112.484 765.587L113.007 764.985L117.273 764.405L118.466 765.422L114.082 766.01L112.484 765.587ZM113.747 761.846L114.518 760.958L118.98 764.83L118.466 765.422L117.342 764.966L113.747 761.846ZM115.703 775.036C115.203 774.602 114.832 774.126 114.59 773.607C114.361 773.087 114.263 772.538 114.295 771.96L115.559 771.871C115.507 772.258 115.558 772.648 115.711 773.041C115.878 773.433 116.137 773.782 116.49 774.088C116.821 774.375 117.165 774.563 117.522 774.65C117.886 774.743 118.236 774.738 118.573 774.635C118.923 774.531 119.235 774.32 119.511 774.003C119.792 773.679 119.96 773.343 120.015 772.995C120.07 772.647 120.026 772.313 119.884 771.992C119.756 771.67 119.551 771.387 119.269 771.142C118.98 770.891 118.685 770.697 118.384 770.56C118.09 770.428 117.764 770.355 117.406 770.341L117.967 769.716C118.215 769.672 118.457 769.671 118.691 769.714C118.926 769.757 119.163 769.84 119.403 769.962C119.644 770.084 119.894 770.258 120.155 770.484C120.662 770.924 121.001 771.403 121.17 771.921C121.338 772.438 121.359 772.956 121.23 773.475C121.108 773.999 120.855 774.484 120.469 774.928C120.065 775.393 119.588 775.708 119.037 775.872C118.494 776.043 117.929 776.06 117.344 775.923C116.765 775.778 116.218 775.483 115.703 775.036ZM117.406 770.341L117.334 769.334L120.599 766.235L121.508 767.024L118.119 770.181L117.406 770.341ZM120.029 767.297L120.599 766.235L124.458 769.584L123.687 770.472L120.029 767.297ZM120.035 778.796C119.838 778.625 119.73 778.414 119.712 778.164C119.708 777.913 119.788 777.692 119.953 777.502C120.125 777.304 120.329 777.197 120.566 777.181C120.816 777.163 121.04 777.24 121.237 777.411C121.435 777.582 121.539 777.79 121.549 778.034C121.573 778.277 121.499 778.497 121.328 778.695C121.163 778.885 120.952 778.993 120.696 779.017C120.453 779.041 120.232 778.967 120.035 778.796ZM124.251 782.455C123.764 782.033 123.425 781.541 123.233 780.979C123.048 780.423 123.008 779.857 123.113 779.28C123.218 778.704 123.472 778.183 123.876 777.718C124.439 777.069 125.224 776.62 126.232 776.37L130.986 775.25L132.138 776.25L127.313 777.346L126.789 777.224C127.002 777.149 127.211 777.115 127.416 777.12C127.628 777.118 127.846 777.166 128.072 777.262C128.297 777.359 128.529 777.511 128.769 777.719C129.199 778.092 129.498 778.531 129.666 779.035C129.841 779.545 129.878 780.072 129.777 780.615C129.69 781.157 129.441 781.664 129.032 782.137C128.628 782.602 128.141 782.927 127.572 783.113C127.01 783.305 126.431 783.346 125.834 783.236C125.251 783.125 124.723 782.865 124.251 782.455ZM125.058 781.524C125.354 781.781 125.68 781.94 126.035 782.001C126.403 782.061 126.758 782.029 127.1 781.906C127.455 781.782 127.764 781.568 128.027 781.265C128.29 780.962 128.455 780.629 128.522 780.267C128.602 779.904 128.584 779.548 128.467 779.199C128.356 778.856 128.153 778.557 127.857 778.3C127.561 778.043 127.232 777.881 126.87 777.814C126.515 777.753 126.16 777.784 125.805 777.909C125.463 778.032 125.161 778.246 124.897 778.549C124.634 778.852 124.463 779.185 124.383 779.548C124.309 779.917 124.328 780.273 124.438 780.616C124.556 780.965 124.762 781.268 125.058 781.524ZM128.666 786.102L133.491 785.006L134.016 785.128C133.809 785.196 133.6 785.23 133.388 785.232C133.177 785.234 132.958 785.186 132.733 785.09C132.515 784.999 132.283 784.847 132.036 784.633C131.613 784.266 131.311 783.824 131.128 783.308C130.953 782.797 130.916 782.271 131.017 781.728C131.123 781.178 131.376 780.674 131.773 780.215C132.183 779.743 132.67 779.418 133.232 779.239C133.802 779.053 134.378 779.016 134.961 779.127C135.551 779.23 136.082 779.487 136.554 779.897C137.033 780.313 137.369 780.802 137.561 781.364C137.753 781.926 137.796 782.495 137.692 783.072C137.593 783.641 137.339 784.162 136.929 784.634C136.366 785.283 135.581 785.732 134.573 785.982L129.819 787.102L128.666 786.102ZM132.948 784.052C133.244 784.309 133.569 784.468 133.924 784.529C134.292 784.589 134.647 784.557 134.989 784.434C135.344 784.31 135.65 784.099 135.907 783.803C136.176 783.493 136.345 783.157 136.412 782.795C136.492 782.432 136.473 782.076 136.356 781.727C136.246 781.384 136.043 781.085 135.746 780.828C135.45 780.571 135.121 780.409 134.759 780.342C134.404 780.281 134.049 780.312 133.694 780.437C133.345 780.554 133.036 780.768 132.767 781.078C132.504 781.381 132.339 781.714 132.272 782.076C132.205 782.438 132.227 782.797 132.338 783.153C132.455 783.502 132.659 783.802 132.948 784.052ZM135.977 792.447L140.336 787.425L141.288 788.251L136.929 793.273L135.977 792.447ZM139.371 795.393L142.005 792.358C142.329 791.985 142.467 791.591 142.418 791.178C142.382 790.764 142.191 790.407 141.846 790.107C141.613 789.905 141.362 789.774 141.093 789.713C140.825 789.653 140.557 789.662 140.291 789.74C140.026 789.819 139.786 789.981 139.572 790.228L139.346 789.698C139.676 789.317 140.045 789.056 140.451 788.915C140.865 788.78 141.284 788.76 141.708 788.856C142.137 788.945 142.532 789.145 142.891 789.457C143.244 789.763 143.494 790.116 143.641 790.516C143.796 790.922 143.831 791.336 143.749 791.759C143.673 792.187 143.467 792.596 143.131 792.983L140.323 796.219L139.371 795.393ZM142.765 798.338L145.399 795.304C145.723 794.93 145.861 794.537 145.812 794.123C145.776 793.709 145.589 793.355 145.25 793.062C145.018 792.86 144.763 792.726 144.487 792.659C144.219 792.599 143.951 792.608 143.685 792.686C143.42 792.764 143.18 792.927 142.966 793.174L142.592 792.515C142.949 792.146 143.339 791.903 143.761 791.787C144.196 791.671 144.629 791.663 145.059 791.765C145.496 791.86 145.891 792.06 146.243 792.366C146.61 792.684 146.87 793.046 147.025 793.452C147.179 793.858 147.218 794.275 147.143 794.704C147.074 795.139 146.869 795.554 146.526 795.949L143.727 799.173L142.765 798.338Z"
                      fill="black"
                    />
                    <path
                      d="M277.217 842.766L283.163 838.551L284.501 839.192L278.492 843.376L277.217 842.766ZM276.866 843.498L277.217 842.766L277.879 842.679L284.091 845.655L283.583 846.715L276.866 843.498ZM280.052 847.833L282.828 842.038L284.002 842.6L281.226 848.396L280.052 847.833ZM283.502 848.601L288.367 846.74C288.857 846.561 289.253 846.393 289.555 846.238C289.861 846.074 290.102 845.905 290.279 845.731C290.464 845.561 290.611 845.362 290.72 845.135C290.933 844.689 290.957 844.271 290.792 843.881C290.627 843.492 290.317 843.188 289.863 842.97C289.416 842.757 288.973 842.679 288.531 842.736C288.094 842.785 287.637 842.97 287.163 843.292L286.662 842.198C287.281 841.791 287.904 841.561 288.529 841.509C289.158 841.448 289.793 841.571 290.433 841.877C290.971 842.135 291.388 842.464 291.683 842.864C291.986 843.268 292.157 843.712 292.194 844.196C292.231 844.679 292.129 845.174 291.887 845.679C291.714 846.041 291.512 846.342 291.283 846.584C291.061 846.83 290.765 847.05 290.392 847.244C290.032 847.434 289.556 847.641 288.962 847.864L285.061 849.301L283.502 848.601ZM283.157 849.321L283.502 848.601L284.675 848.744L289.549 851.078L289.041 852.139L283.157 849.321ZM291.342 853.396C291.106 853.283 290.947 853.109 290.864 852.872C290.793 852.631 290.812 852.397 290.921 852.17C291.033 851.934 291.202 851.777 291.426 851.698C291.663 851.615 291.899 851.629 292.134 851.742C292.37 851.855 292.525 852.028 292.6 852.26C292.688 852.488 292.675 852.72 292.562 852.956C292.453 853.183 292.278 853.343 292.038 853.435C291.81 853.522 291.578 853.509 291.342 853.396ZM296.646 855.937C296.065 855.658 295.604 855.303 295.263 854.87C294.93 854.442 294.734 853.976 294.675 853.472C294.617 852.967 294.704 852.471 294.938 851.983C295.128 851.587 295.377 851.262 295.685 851.006C295.994 850.75 296.35 850.579 296.754 850.493C297.161 850.399 297.587 850.396 298.031 850.484L297.906 850.843C297.613 850.589 297.398 850.305 297.259 849.99C297.124 849.667 297.06 849.336 297.066 848.998C297.086 848.655 297.172 848.324 297.325 848.004C297.543 847.549 297.844 847.202 298.228 846.961C298.612 846.721 299.04 846.595 299.511 846.583C299.995 846.566 300.482 846.675 300.97 846.909C301.466 847.147 301.856 847.457 302.138 847.841C302.424 848.216 302.594 848.628 302.647 849.078C302.701 849.528 302.619 849.98 302.401 850.435C302.248 850.755 302.039 851.028 301.776 851.253C301.525 851.475 301.232 851.634 300.895 851.732C300.571 851.825 300.218 851.837 299.837 851.768L300.026 851.44C300.382 851.734 300.646 852.068 300.819 852.44C301.005 852.809 301.095 853.193 301.089 853.594C301.092 853.999 300.999 854.399 300.809 854.795C300.575 855.283 300.244 855.663 299.814 855.933C299.385 856.203 298.894 856.341 298.343 856.346C297.801 856.355 297.235 856.219 296.646 855.937ZM297.16 854.863C297.513 855.033 297.853 855.112 298.178 855.103C298.516 855.089 298.819 854.996 299.088 854.824C299.365 854.657 299.58 854.413 299.733 854.093C299.882 853.782 299.935 853.466 299.892 853.145C299.858 852.828 299.738 852.538 299.533 852.274C299.341 852.006 299.068 851.788 298.714 851.618C298.369 851.453 298.027 851.377 297.689 851.391C297.356 851.397 297.05 851.484 296.773 851.651C296.505 851.823 296.296 852.064 296.147 852.376C295.994 852.696 295.934 853.014 295.969 853.331C296.012 853.651 296.134 853.948 296.335 854.22C296.54 854.484 296.815 854.698 297.16 854.863ZM299.155 850.697C299.576 850.898 299.984 850.933 300.378 850.801C300.773 850.669 301.069 850.397 301.266 849.984C301.46 849.58 301.482 849.188 301.334 848.806C301.189 848.416 300.907 848.12 300.486 847.919C300.073 847.721 299.67 847.688 299.276 847.82C298.885 847.944 298.594 848.208 298.4 848.612C298.202 849.024 298.176 849.425 298.32 849.815C298.465 850.205 298.743 850.499 299.155 850.697ZM303.636 859.129L306.508 853.132L307.645 853.676L304.772 859.674L303.636 859.129ZM307.689 861.071L309.424 857.447C309.638 857.001 309.667 856.585 309.51 856.199C309.365 855.809 309.087 855.516 308.675 855.318C308.397 855.185 308.12 855.125 307.845 855.138C307.57 855.151 307.314 855.23 307.079 855.376C306.843 855.522 306.655 855.743 306.514 856.037L306.156 855.586C306.373 855.132 306.66 854.782 307.014 854.538C307.378 854.298 307.776 854.168 308.21 854.149C308.648 854.12 309.081 854.209 309.511 854.415C309.932 854.616 310.266 854.89 310.514 855.237C310.771 855.587 310.915 855.977 310.947 856.407C310.988 856.84 310.898 857.288 310.676 857.751L308.825 861.615L307.689 861.071ZM311.742 863.012L313.478 859.388C313.691 858.942 313.72 858.526 313.563 858.141C313.418 857.751 313.144 857.459 312.74 857.265C312.462 857.132 312.182 857.07 311.898 857.079C311.623 857.092 311.367 857.172 311.132 857.318C310.896 857.464 310.708 857.684 310.567 857.978L310.032 857.443C310.279 856.992 310.59 856.655 310.966 856.431C311.355 856.203 311.77 856.082 312.213 856.066C312.659 856.041 313.092 856.13 313.513 856.332C313.951 856.541 314.298 856.821 314.555 857.172C314.811 857.522 314.96 857.914 315 858.348C315.05 858.785 314.961 859.24 314.735 859.711L312.891 863.562L311.742 863.012Z"
                      fill="black"
                    />
                    <path
                      d="M384.771 909.718L387.994 900.552L389.222 900.984L385.999 910.15L384.771 909.718ZM385.728 901.002L386.118 899.892L389.09 900.937L388.7 902.047L385.728 901.002ZM388.611 907.521L394.065 902.686L395.465 903.179L389.945 907.99L388.611 907.521ZM388.341 908.287L388.611 907.521L389.26 907.363L395.758 909.648L395.368 910.757L388.341 908.287ZM391.978 912.252L394.11 906.19L395.338 906.621L393.206 912.684L391.978 912.252ZM396.285 913.915C396.039 913.828 395.861 913.672 395.753 913.445C395.656 913.214 395.65 912.979 395.733 912.741C395.82 912.495 395.97 912.32 396.185 912.217C396.411 912.109 396.647 912.098 396.894 912.184C397.14 912.271 397.313 912.426 397.413 912.649C397.525 912.866 397.537 913.098 397.45 913.345C397.367 913.583 397.21 913.76 396.981 913.877C396.764 913.989 396.532 914.001 396.285 913.915ZM401.551 915.766C400.944 915.553 400.447 915.22 400.062 914.768C399.686 914.319 399.44 913.807 399.326 913.233C399.211 912.658 399.256 912.08 399.46 911.499C399.745 910.689 400.31 909.982 401.155 909.379L405.164 906.589L406.604 907.095L402.52 909.889L401.987 909.968C402.158 909.821 402.34 909.712 402.533 909.641C402.729 909.561 402.949 909.525 403.194 909.532C403.439 909.539 403.711 909.595 404.011 909.7C404.548 909.889 404.987 910.187 405.329 910.594C405.679 911.004 405.908 911.48 406.014 912.022C406.132 912.559 406.087 913.122 405.88 913.712C405.676 914.293 405.343 914.774 404.882 915.156C404.43 915.542 403.907 915.793 403.311 915.91C402.728 916.022 402.141 915.974 401.551 915.766ZM401.96 914.604C402.33 914.734 402.691 914.762 403.043 914.688C403.408 914.608 403.726 914.448 403.999 914.208C404.283 913.961 404.492 913.649 404.625 913.27C404.758 912.892 404.789 912.522 404.719 912.161C404.66 911.794 404.511 911.469 404.274 911.188C404.045 910.91 403.746 910.706 403.376 910.576C403.007 910.446 402.641 910.416 402.28 910.487C401.927 910.561 401.609 910.721 401.324 910.967C401.052 911.208 400.849 911.517 400.716 911.896C400.583 912.275 400.546 912.647 400.605 913.014C400.672 913.384 400.82 913.709 401.049 913.987C401.287 914.268 401.59 914.474 401.96 914.604ZM406.2 917.252L408.406 910.979L409.594 911.397L407.389 917.67L406.2 917.252ZM410.44 918.743L411.772 914.952C411.936 914.486 411.92 914.069 411.722 913.703C411.536 913.331 411.227 913.069 410.796 912.917C410.505 912.815 410.224 912.785 409.952 912.828C409.68 912.871 409.434 912.978 409.216 913.148C408.998 913.319 408.834 913.558 408.726 913.866L408.321 913.457C408.488 912.981 408.735 912.603 409.061 912.322C409.396 912.044 409.779 911.872 410.208 911.805C410.64 911.73 411.08 911.771 411.53 911.929C411.97 912.083 412.332 912.32 412.616 912.637C412.909 912.958 413.095 913.33 413.173 913.753C413.261 914.18 413.219 914.635 413.049 915.119L411.628 919.161L410.44 918.743ZM414.679 920.233L416.012 916.443C416.176 915.976 416.159 915.56 415.961 915.193C415.776 914.821 415.471 914.561 415.049 914.413C414.758 914.31 414.472 914.279 414.191 914.319C413.919 914.362 413.674 914.468 413.456 914.639C413.237 914.809 413.074 915.049 412.966 915.357L412.376 914.882C412.572 914.407 412.845 914.039 413.195 913.776C413.557 913.507 413.956 913.341 414.394 913.277C414.835 913.205 415.276 913.246 415.716 913.401C416.174 913.562 416.55 913.802 416.842 914.123C417.135 914.444 417.325 914.817 417.413 915.244C417.509 915.673 417.471 916.135 417.297 916.628L415.881 920.656L414.679 920.233Z"
                      fill="black"
                    />
                    <path
                      d="M199.924 708.14C199.196 708.14 198.528 707.935 197.922 707.524C197.324 707.113 196.848 706.535 196.494 705.788C196.139 705.032 195.962 704.145 195.962 703.128C195.962 702.111 196.134 701.229 196.48 700.482C196.834 699.735 197.31 699.161 197.908 698.76C198.505 698.349 199.163 698.144 199.882 698.144C200.619 698.144 201.286 698.349 201.884 698.76C202.481 699.161 202.952 699.735 203.298 700.482C203.652 701.229 203.83 702.115 203.83 703.142C203.83 704.159 203.652 705.046 203.298 705.802C202.952 706.549 202.481 707.127 201.884 707.538C201.296 707.939 200.642 708.14 199.924 708.14ZM199.896 706.894C200.409 706.894 200.857 706.754 201.24 706.474C201.632 706.185 201.94 705.76 202.164 705.2C202.388 704.64 202.5 703.949 202.5 703.128C202.5 702.307 202.388 701.621 202.164 701.07C201.94 700.51 201.632 700.09 201.24 699.81C200.848 699.521 200.395 699.376 199.882 699.376C199.378 699.376 198.93 699.521 198.538 699.81C198.146 700.09 197.838 700.51 197.614 701.07C197.399 701.621 197.292 702.307 197.292 703.128C197.292 703.949 197.399 704.64 197.614 705.2C197.838 705.76 198.146 706.185 198.538 706.474C198.93 706.754 199.382 706.894 199.896 706.894ZM204.926 707.202L208.51 703.422C208.874 703.049 209.159 702.727 209.364 702.456C209.569 702.176 209.714 701.919 209.798 701.686C209.891 701.453 209.938 701.21 209.938 700.958C209.938 700.463 209.779 700.076 209.462 699.796C209.145 699.516 208.734 699.376 208.23 699.376C207.735 699.376 207.301 699.497 206.928 699.74C206.555 699.973 206.223 700.337 205.934 700.832L205.01 700.062C205.393 699.427 205.855 698.951 206.396 698.634C206.937 698.307 207.563 698.144 208.272 698.144C208.869 698.144 209.387 698.261 209.826 698.494C210.274 698.727 210.619 699.054 210.862 699.474C211.105 699.894 211.226 700.384 211.226 700.944C211.226 701.345 211.175 701.705 211.072 702.022C210.979 702.339 210.806 702.666 210.554 703.002C210.311 703.329 209.971 703.721 209.532 704.178L206.634 707.16L204.926 707.202ZM204.926 708V707.202L206.046 706.824H211.45V708H204.926Z"
                      fill="black"
                    />
                    <path
                      d="M106.233 124V113.818H109.793C110.502 113.818 111.087 113.941 111.548 114.186C112.008 114.428 112.351 114.754 112.577 115.165C112.802 115.573 112.915 116.026 112.915 116.523C112.915 116.96 112.837 117.321 112.681 117.607C112.529 117.892 112.326 118.117 112.075 118.283C111.826 118.448 111.556 118.571 111.264 118.651V118.75C111.576 118.77 111.889 118.879 112.204 119.078C112.519 119.277 112.782 119.562 112.994 119.933C113.206 120.304 113.312 120.759 113.312 121.295C113.312 121.806 113.196 122.265 112.964 122.673C112.732 123.08 112.366 123.403 111.866 123.642C111.365 123.881 110.714 124 109.912 124H106.233ZM107.466 122.906H109.912C110.717 122.906 111.289 122.75 111.627 122.439C111.969 122.124 112.139 121.743 112.139 121.295C112.139 120.951 112.051 120.633 111.876 120.341C111.7 120.046 111.45 119.811 111.125 119.635C110.8 119.456 110.416 119.366 109.972 119.366H107.466V122.906ZM107.466 118.293H109.753C110.124 118.293 110.459 118.22 110.757 118.074C111.059 117.928 111.297 117.723 111.473 117.457C111.652 117.192 111.741 116.881 111.741 116.523C111.741 116.075 111.586 115.696 111.274 115.384C110.963 115.069 110.469 114.912 109.793 114.912H107.466V118.293ZM123.929 118.909C123.929 119.983 123.735 120.911 123.348 121.693C122.96 122.475 122.428 123.079 121.752 123.503C121.076 123.927 120.303 124.139 119.435 124.139C118.567 124.139 117.794 123.927 117.118 123.503C116.442 123.079 115.91 122.475 115.522 121.693C115.135 120.911 114.941 119.983 114.941 118.909C114.941 117.835 115.135 116.907 115.522 116.125C115.91 115.343 116.442 114.74 117.118 114.315C117.794 113.891 118.567 113.679 119.435 113.679C120.303 113.679 121.076 113.891 121.752 114.315C122.428 114.74 122.96 115.343 123.348 116.125C123.735 116.907 123.929 117.835 123.929 118.909ZM122.736 118.909C122.736 118.027 122.589 117.283 122.294 116.677C122.002 116.07 121.606 115.611 121.105 115.3C120.608 114.988 120.051 114.832 119.435 114.832C118.819 114.832 118.26 114.988 117.76 115.3C117.262 115.611 116.866 116.07 116.571 116.677C116.28 117.283 116.134 118.027 116.134 118.909C116.134 119.791 116.28 120.535 116.571 121.141C116.866 121.748 117.262 122.207 117.76 122.518C118.26 122.83 118.819 122.986 119.435 122.986C120.051 122.986 120.608 122.83 121.105 122.518C121.606 122.207 122.002 121.748 122.294 121.141C122.589 120.535 122.736 119.791 122.736 118.909ZM134.593 118.909C134.593 119.983 134.4 120.911 134.012 121.693C133.624 122.475 133.092 123.079 132.416 123.503C131.74 123.927 130.967 124.139 130.099 124.139C129.231 124.139 128.458 123.927 127.782 123.503C127.106 123.079 126.574 122.475 126.186 121.693C125.799 120.911 125.605 119.983 125.605 118.909C125.605 117.835 125.799 116.907 126.186 116.125C126.574 115.343 127.106 114.74 127.782 114.315C128.458 113.891 129.231 113.679 130.099 113.679C130.967 113.679 131.74 113.891 132.416 114.315C133.092 114.74 133.624 115.343 134.012 116.125C134.4 116.907 134.593 117.835 134.593 118.909ZM133.4 118.909C133.4 118.027 133.253 117.283 132.958 116.677C132.666 116.07 132.27 115.611 131.77 115.3C131.272 114.988 130.716 114.832 130.099 114.832C129.483 114.832 128.924 114.988 128.424 115.3C127.926 115.611 127.53 116.07 127.235 116.677C126.944 117.283 126.798 118.027 126.798 118.909C126.798 119.791 126.944 120.535 127.235 121.141C127.53 121.748 127.926 122.207 128.424 122.518C128.924 122.83 129.483 122.986 130.099 122.986C130.716 122.986 131.272 122.83 131.77 122.518C132.27 122.207 132.666 121.748 132.958 121.141C133.253 120.535 133.4 119.791 133.4 118.909ZM136.667 124V113.818H137.9V118.869H138.019L142.593 113.818H144.203L139.928 118.412L144.203 124H142.712L139.172 119.267L137.9 120.699V124H136.667ZM145.799 124V113.818H151.944V114.912H147.032V118.352H151.626V119.446H147.032V122.906H152.024V124H145.799ZM157.309 124H154.167V113.818H157.448C158.435 113.818 159.281 114.022 159.983 114.43C160.686 114.834 161.225 115.416 161.599 116.175C161.974 116.93 162.161 117.835 162.161 118.889C162.161 119.95 161.972 120.863 161.594 121.629C161.216 122.391 160.666 122.978 159.944 123.388C159.221 123.796 158.343 124 157.309 124ZM155.4 122.906H157.229C158.071 122.906 158.769 122.744 159.322 122.419C159.876 122.094 160.288 121.632 160.56 121.032C160.832 120.432 160.968 119.718 160.968 118.889C160.968 118.067 160.833 117.36 160.565 116.766C160.297 116.17 159.895 115.712 159.362 115.394C158.828 115.073 158.164 114.912 157.368 114.912H155.4V122.906Z"
                      fill="black"
                    />
                    <path
                      d="M106.651 154H105.358L109.097 143.818H110.369L114.108 154H112.815L109.773 145.429H109.693L106.651 154ZM107.128 150.023H112.338V151.116H107.128V150.023ZM115.154 143.818L118.177 152.389H118.297L121.319 143.818H122.612L118.873 154H117.6L113.862 143.818H115.154ZM123.74 154H122.448L126.186 143.818H127.459L131.198 154H129.905L126.863 145.429H126.783L123.74 154ZM124.218 150.023H129.428V151.116H124.218V150.023ZM134.017 143.818V154H132.784V143.818H134.017ZM136.489 154V143.818H137.722V152.906H142.455V154H136.489ZM145.424 154H144.131L147.87 143.818H149.143L152.881 154H151.589L148.546 145.429H148.467L145.424 154ZM145.901 150.023H151.112V151.116H145.901V150.023ZM154.467 154V143.818H158.027C158.736 143.818 159.321 143.941 159.782 144.186C160.243 144.428 160.586 144.754 160.811 145.165C161.036 145.573 161.149 146.026 161.149 146.523C161.149 146.96 161.071 147.321 160.915 147.607C160.763 147.892 160.561 148.117 160.309 148.283C160.06 148.448 159.79 148.571 159.499 148.651V148.75C159.81 148.77 160.123 148.879 160.438 149.078C160.753 149.277 161.017 149.562 161.229 149.933C161.441 150.304 161.547 150.759 161.547 151.295C161.547 151.806 161.431 152.265 161.199 152.673C160.967 153.08 160.601 153.403 160.1 153.642C159.6 153.881 158.948 154 158.146 154H154.467ZM155.7 152.906H158.146C158.952 152.906 159.523 152.75 159.862 152.439C160.203 152.124 160.374 151.743 160.374 151.295C160.374 150.951 160.286 150.633 160.11 150.341C159.934 150.046 159.684 149.811 159.359 149.635C159.035 149.456 158.65 149.366 158.206 149.366H155.7V152.906ZM155.7 148.293H157.987C158.358 148.293 158.693 148.22 158.991 148.074C159.293 147.928 159.532 147.723 159.707 147.457C159.886 147.192 159.976 146.881 159.976 146.523C159.976 146.075 159.82 145.696 159.509 145.384C159.197 145.069 158.703 144.912 158.027 144.912H155.7V148.293ZM163.573 154V143.818H164.806V152.906H169.539V154H163.573ZM171.448 154V143.818H177.593V144.912H172.681V148.352H177.275V149.446H172.681V152.906H177.672V154H171.448Z"
                      fill="black"
                    />
                    <path
                      d="M111.801 176.364C111.741 175.86 111.5 175.469 111.075 175.19C110.651 174.912 110.131 174.773 109.514 174.773C109.063 174.773 108.669 174.846 108.331 174.991C107.996 175.137 107.734 175.338 107.545 175.593C107.36 175.848 107.267 176.138 107.267 176.463C107.267 176.735 107.332 176.969 107.461 177.164C107.594 177.356 107.763 177.517 107.968 177.646C108.174 177.772 108.389 177.877 108.614 177.96C108.84 178.039 109.047 178.104 109.236 178.153L110.27 178.432C110.535 178.501 110.83 178.598 111.155 178.72C111.483 178.843 111.796 179.01 112.094 179.222C112.396 179.431 112.645 179.7 112.84 180.028C113.036 180.356 113.134 180.759 113.134 181.236C113.134 181.786 112.989 182.283 112.701 182.727C112.416 183.171 111.998 183.524 111.448 183.786C110.901 184.048 110.237 184.179 109.455 184.179C108.725 184.179 108.094 184.061 107.56 183.826C107.03 183.591 106.612 183.263 106.308 182.842C106.006 182.421 105.835 181.932 105.795 181.375H107.068C107.101 181.759 107.231 182.078 107.456 182.33C107.685 182.578 107.973 182.764 108.321 182.886C108.672 183.006 109.05 183.065 109.455 183.065C109.925 183.065 110.348 182.989 110.722 182.837C111.097 182.681 111.393 182.465 111.612 182.19C111.831 181.912 111.94 181.587 111.94 181.216C111.94 180.878 111.846 180.603 111.657 180.391C111.468 180.179 111.219 180.006 110.911 179.874C110.603 179.741 110.27 179.625 109.912 179.526L108.659 179.168C107.864 178.939 107.234 178.612 106.77 178.188C106.306 177.764 106.074 177.209 106.074 176.523C106.074 175.953 106.228 175.455 106.536 175.031C106.848 174.604 107.265 174.272 107.789 174.037C108.316 173.798 108.904 173.679 109.554 173.679C110.21 173.679 110.794 173.797 111.304 174.032C111.814 174.264 112.219 174.582 112.517 174.987C112.819 175.391 112.978 175.85 112.994 176.364H111.801ZM123.752 178.909C123.752 179.983 123.558 180.911 123.17 181.693C122.782 182.475 122.25 183.079 121.574 183.503C120.898 183.927 120.126 184.139 119.257 184.139C118.389 184.139 117.617 183.927 116.941 183.503C116.264 183.079 115.732 182.475 115.345 181.693C114.957 180.911 114.763 179.983 114.763 178.909C114.763 177.835 114.957 176.907 115.345 176.125C115.732 175.343 116.264 174.74 116.941 174.315C117.617 173.891 118.389 173.679 119.257 173.679C120.126 173.679 120.898 173.891 121.574 174.315C122.25 174.74 122.782 175.343 123.17 176.125C123.558 176.907 123.752 177.835 123.752 178.909ZM122.558 178.909C122.558 178.027 122.411 177.283 122.116 176.677C121.824 176.07 121.428 175.611 120.928 175.3C120.431 174.988 119.874 174.832 119.257 174.832C118.641 174.832 118.082 174.988 117.582 175.3C117.085 175.611 116.689 176.07 116.394 176.677C116.102 177.283 115.956 178.027 115.956 178.909C115.956 179.791 116.102 180.535 116.394 181.141C116.689 181.748 117.085 182.207 117.582 182.518C118.082 182.83 118.641 182.986 119.257 182.986C119.874 182.986 120.431 182.83 120.928 182.518C121.428 182.207 121.824 181.748 122.116 181.141C122.411 180.535 122.558 179.791 122.558 178.909ZM125.825 184V173.818H127.058V182.906H131.791V184H125.825ZM136.842 184H133.7V173.818H136.981C137.969 173.818 138.814 174.022 139.517 174.43C140.219 174.834 140.758 175.416 141.132 176.175C141.507 176.93 141.694 177.835 141.694 178.889C141.694 179.95 141.505 180.863 141.127 181.629C140.749 182.391 140.199 182.978 139.477 183.388C138.754 183.796 137.876 184 136.842 184ZM134.933 182.906H136.762C137.604 182.906 138.302 182.744 138.855 182.419C139.409 182.094 139.821 181.632 140.093 181.032C140.365 180.432 140.501 179.718 140.501 178.889C140.501 178.067 140.367 177.36 140.098 176.766C139.83 176.17 139.429 175.712 138.895 175.394C138.361 175.073 137.697 174.912 136.901 174.912H134.933V182.906Z"
                      fill="black"
                    />
                    <rect
                      width="49"
                      height="19"
                      transform="matrix(0 -1 1 0 160.5 683.764)"
                      fill="white"
                    />
                    <path
                      d="M174.5 680L171.08 677.492L170.864 677.084C171.024 677.18 171.164 677.296 171.284 677.432C171.404 677.568 171.496 677.736 171.56 677.936C171.624 678.128 171.656 678.364 171.656 678.644C171.656 679.124 171.54 679.568 171.308 679.976C171.076 680.376 170.756 680.696 170.348 680.936C169.932 681.176 169.464 681.296 168.944 681.296C168.408 681.296 167.924 681.164 167.492 680.9C167.052 680.636 166.704 680.284 166.448 679.844C166.184 679.404 166.052 678.916 166.052 678.38C166.052 677.836 166.18 677.344 166.436 676.904C166.692 676.464 167.036 676.116 167.468 675.86C167.892 675.604 168.372 675.476 168.908 675.476C169.644 675.476 170.376 675.732 171.104 676.244L174.5 678.692V680ZM170.768 678.38C170.768 678.044 170.688 677.744 170.528 677.48C170.36 677.208 170.14 676.996 169.868 676.844C169.588 676.684 169.28 676.604 168.944 676.604C168.592 676.604 168.28 676.684 168.008 676.844C167.728 676.996 167.508 677.208 167.348 677.48C167.188 677.744 167.108 678.044 167.108 678.38C167.108 678.716 167.188 679.02 167.348 679.292C167.508 679.556 167.728 679.768 168.008 679.928C168.28 680.088 168.592 680.168 168.944 680.168C169.288 680.168 169.596 680.088 169.868 679.928C170.14 679.768 170.36 679.552 170.528 679.28C170.688 679.008 170.768 678.708 170.768 678.38ZM174.62 674.106C174.62 674.33 174.544 674.518 174.392 674.67C174.232 674.814 174.044 674.886 173.828 674.886C173.604 674.886 173.42 674.814 173.276 674.67C173.124 674.518 173.048 674.33 173.048 674.106C173.048 673.882 173.124 673.698 173.276 673.554C173.42 673.402 173.604 673.326 173.828 673.326C174.044 673.326 174.232 673.402 174.392 673.554C174.544 673.698 174.62 673.882 174.62 674.106ZM174.62 668.734C174.62 669.358 174.444 669.93 174.092 670.45C173.74 670.962 173.244 671.37 172.604 671.674C171.956 671.978 171.196 672.13 170.324 672.13C169.452 672.13 168.696 671.982 168.056 671.686C167.416 671.382 166.924 670.974 166.58 670.462C166.228 669.95 166.052 669.386 166.052 668.77C166.052 668.138 166.228 667.566 166.58 667.054C166.924 666.542 167.416 666.138 168.056 665.842C168.696 665.538 169.456 665.386 170.336 665.386C171.208 665.386 171.968 665.538 172.616 665.842C173.256 666.138 173.752 666.542 174.104 667.054C174.448 667.558 174.62 668.118 174.62 668.734ZM173.552 668.758C173.552 668.318 173.432 667.934 173.192 667.606C172.944 667.27 172.58 667.006 172.1 666.814C171.62 666.622 171.028 666.526 170.324 666.526C169.62 666.526 169.032 666.622 168.56 666.814C168.08 667.006 167.72 667.27 167.48 667.606C167.232 667.942 167.108 668.33 167.108 668.77C167.108 669.202 167.232 669.586 167.48 669.922C167.72 670.258 168.08 670.522 168.56 670.714C169.032 670.898 169.62 670.99 170.324 670.99C171.028 670.99 171.62 670.898 172.1 670.714C172.58 670.522 172.944 670.258 173.192 669.922C173.432 669.586 173.552 669.198 173.552 668.758ZM174.5 660.283L172.004 662.059L171.812 662.263L168.8 664.507V663.199L171.02 661.579L171.188 661.375L174.5 658.975V660.283ZM174.5 664.615L171.332 662.263L172.124 661.651L174.5 663.343V664.615ZM171.8 661.291L171.032 661.915L168.8 660.343V659.083L171.8 661.291ZM174.5 656.696H166.172V655.58H174.5V656.696ZM167.18 658.4H166.172V655.7H167.18V658.4ZM174.62 651.636C174.62 652.204 174.52 652.712 174.32 653.16C174.112 653.6 173.812 653.972 173.42 654.276L172.652 653.508C172.932 653.324 173.156 653.072 173.324 652.752C173.484 652.424 173.564 652.06 173.564 651.66C173.564 651.284 173.492 650.956 173.348 650.676C173.204 650.388 173.004 650.164 172.748 650.004C172.484 649.836 172.172 649.752 171.812 649.752C171.444 649.752 171.132 649.832 170.876 649.992C170.62 650.152 170.428 650.368 170.3 650.64C170.164 650.904 170.096 651.196 170.096 651.516C170.096 651.844 170.136 652.144 170.216 652.416C170.296 652.68 170.432 652.932 170.624 653.172L169.904 653.16C169.736 653.024 169.6 652.868 169.496 652.692C169.392 652.516 169.312 652.316 169.256 652.092C169.2 651.868 169.172 651.608 169.172 651.312C169.172 650.736 169.292 650.248 169.532 649.848C169.772 649.448 170.096 649.144 170.504 648.936C170.912 648.72 171.368 648.612 171.872 648.612C172.4 648.612 172.872 648.744 173.288 649.008C173.704 649.264 174.032 649.62 174.272 650.076C174.504 650.532 174.62 651.052 174.62 651.636ZM170.624 653.172L170.012 653.784L166.172 653.412V652.38L170.12 652.8L170.624 653.172ZM167.18 653.184L166.172 653.412V649.032H167.18V653.184ZM174.62 646.72C174.62 646.944 174.544 647.132 174.392 647.284C174.232 647.428 174.044 647.5 173.828 647.5C173.604 647.5 173.42 647.428 173.276 647.284C173.124 647.132 173.048 646.944 173.048 646.72C173.048 646.496 173.124 646.312 173.276 646.168C173.42 646.016 173.604 645.94 173.828 645.94C174.044 645.94 174.232 646.016 174.392 646.168C174.544 646.312 174.62 646.496 174.62 646.72ZM174.62 641.347C174.62 641.971 174.444 642.543 174.092 643.063C173.74 643.575 173.244 643.983 172.604 644.287C171.956 644.591 171.196 644.743 170.324 644.743C169.452 644.743 168.696 644.595 168.056 644.299C167.416 643.995 166.924 643.587 166.58 643.075C166.228 642.563 166.052 641.999 166.052 641.383C166.052 640.751 166.228 640.179 166.58 639.667C166.924 639.155 167.416 638.751 168.056 638.455C168.696 638.151 169.456 637.999 170.336 637.999C171.208 637.999 171.968 638.151 172.616 638.455C173.256 638.751 173.752 639.155 174.104 639.667C174.448 640.171 174.62 640.731 174.62 641.347ZM173.552 641.371C173.552 640.931 173.432 640.547 173.192 640.219C172.944 639.883 172.58 639.619 172.1 639.427C171.62 639.235 171.028 639.139 170.324 639.139C169.62 639.139 169.032 639.235 168.56 639.427C168.08 639.619 167.72 639.883 167.48 640.219C167.232 640.555 167.108 640.943 167.108 641.383C167.108 641.815 167.232 642.199 167.48 642.535C167.72 642.871 168.08 643.135 168.56 643.327C169.032 643.511 169.62 643.603 170.324 643.603C171.028 643.603 171.62 643.511 172.1 643.327C172.58 643.135 172.944 642.871 173.192 642.535C173.432 642.199 173.552 641.811 173.552 641.371Z"
                      fill="black"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M267.425 584.176C265.85 583.035 260.395 581.543 257.201 578.275C256.18 577.229 255.723 576.96 255.409 577.217C254.624 577.858 255.672 579.567 258.752 581.619C260.483 582.775 248.235 581.148 220.29 579.895C216.44 579.788 203.697 579.171 202.825 579.123C201.03 578.994 89.7699 574.101 90.5017 575.288C91.2891 576.572 186.964 580.948 221.129 582.364C223.499 582.498 260.145 585.722 260.132 585.851C260.129 585.877 259.443 586.319 258.607 586.811C255.389 588.727 254.966 589.286 255.782 590.547C256.507 591.668 257.348 591.648 259.034 590.508C261.692 588.693 264.442 587.398 267.048 586.744C268.914 586.29 269.063 585.336 267.425 584.176Z"
                      fill="#858585"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M107.692 761.996C107.462 761.242 106.062 759.426 105.828 757.589C105.754 757.001 105.671 756.802 105.507 756.808C105.097 756.824 105.018 757.633 105.512 759.049C105.789 759.846 102.227 756.327 93.4961 749.091C92.2771 748.115 88.3074 744.802 88.0371 744.573C87.4882 744.092 69.8258 729.754 69.7723 730.316C69.2369 731.746 83.6262 742.607 93.2432 750.906C94.9671 752.578 104.96 760.716 104.924 760.755C104.917 760.763 104.587 760.738 104.197 760.693C102.688 760.526 102.414 760.603 102.37 761.211C102.33 761.75 102.607 761.949 103.431 761.993C104.734 762.055 105.94 762.309 106.943 762.734C107.657 763.044 107.938 762.771 107.692 761.996Z"
                      fill="#858585"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M269.316 837.577C268.905 836.904 267.096 835.496 266.41 833.775C266.191 833.225 266.061 833.053 265.904 833.1C265.51 833.218 265.636 834.021 266.469 835.268C266.936 835.971 262.607 833.454 252.345 828.63C250.921 827.99 246.249 825.774 245.93 825.62C245.278 825.292 225.359 816.293 225.447 816.851C225.286 818.369 241.168 824.82 252.554 830.451C254.641 831.639 266.351 837.021 266.326 837.067C266.321 837.076 265.995 837.135 265.606 837.189C264.103 837.404 263.858 837.548 263.967 838.147C264.063 838.679 264.381 838.803 265.19 838.639C266.467 838.374 267.698 838.318 268.775 838.479C269.544 838.6 269.748 838.266 269.316 837.577Z"
                      fill="#858585"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M330.392 869.025C330.835 869.677 332.707 871 333.472 872.687C333.717 873.226 333.854 873.392 334.009 873.338C334.397 873.202 334.234 872.406 333.343 871.198C332.844 870.518 337.286 872.831 347.761 877.171C349.214 877.744 353.984 879.741 354.31 879.88C354.976 880.177 382.246 890.391 382.131 889.837C382.221 888.314 359.104 880.457 347.468 875.362C345.328 874.273 333.38 869.442 333.403 869.395C333.408 869.385 333.73 869.312 334.116 869.239C335.607 868.954 335.846 868.8 335.709 868.206C335.588 867.679 335.265 867.571 334.465 867.772C333.201 868.096 331.974 868.209 330.891 868.098C330.117 868.013 329.928 868.356 330.392 869.025Z"
                      fill="#858585"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M395.145 893.934C394.844 893.543 393.622 892.787 393.078 891.762C392.904 891.434 392.812 891.335 392.717 891.375C392.48 891.475 392.613 891.967 393.216 892.688C393.554 893.094 390.687 891.818 383.968 889.507C383.038 889.204 379.977 888.139 379.768 888.064C379.34 887.904 373.434 885.926 373.527 886.267C373.53 887.224 376.747 887.888 384.221 890.627C385.602 891.226 393.261 893.788 393.248 893.818C393.246 893.824 393.047 893.883 392.808 893.943C391.886 894.178 391.743 894.284 391.851 894.65C391.947 894.975 392.154 895.031 392.646 894.874C393.424 894.623 394.187 894.505 394.869 894.532C395.357 894.556 395.461 894.334 395.145 893.934Z"
                      fill="#858585"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M414.919 900.927C415.216 901.321 416.429 902.09 416.961 903.122C417.131 903.452 417.222 903.551 417.318 903.512C417.556 903.415 417.429 902.922 416.834 902.194C416.5 901.784 419.353 903.092 426.045 905.48C426.972 905.793 430.02 906.893 430.229 906.969C430.655 907.134 433.128 907.896 433.039 907.553C433.048 906.597 433.247 907.18 425.805 904.357C424.431 903.742 416.802 901.094 416.815 901.063C416.817 901.057 417.017 901.001 417.256 900.944C418.181 900.719 418.325 900.614 418.221 900.247C418.128 899.921 417.923 899.863 417.428 900.014C416.647 900.257 415.883 900.366 415.202 900.331C414.715 900.302 414.607 900.523 414.919 900.927Z"
                      fill="#858585"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M147.997 800.375C148.263 801.116 149.749 802.863 150.071 804.687C150.174 805.27 150.266 805.465 150.429 805.451C150.839 805.415 150.878 804.604 150.316 803.213C150.001 802.43 153.729 805.774 162.799 812.58C164.063 813.495 168.188 816.614 168.469 816.83C169.041 817.283 187.374 830.753 187.4 830.189C187.866 828.735 172.97 818.58 162.964 810.754C161.161 809.168 150.788 801.521 150.822 801.48C150.828 801.472 151.159 801.481 151.551 801.507C153.066 801.602 153.336 801.511 153.351 800.902C153.364 800.361 153.078 800.176 152.253 800.172C150.949 800.172 149.732 799.977 148.71 799.601C147.981 799.326 147.714 799.612 147.997 800.375Z"
                      fill="#858585"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M316.94 586.815C318.66 585.908 324.271 585.204 327.896 582.42C329.054 581.53 329.546 581.328 329.82 581.627C330.506 582.373 329.227 583.916 325.887 585.511C324.01 586.411 336.364 586.534 364.205 589.251C368.032 589.69 380.734 590.884 381.604 590.959C383.399 591.086 492.725 601.389 491.832 602.461C490.871 603.62 397.047 595.012 363.026 591.576C360.66 591.373 323.927 589.376 323.922 589.506C323.921 589.532 324.538 590.066 325.295 590.672C328.21 593.024 328.549 593.638 327.563 594.77C326.686 595.777 325.857 595.638 324.349 594.271C321.975 592.098 319.436 590.427 316.949 589.41C315.165 588.697 315.154 587.731 316.94 586.815Z"
                      fill="#858585"
                    />
                    <g clip-path="url(#clip10_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M91.2987 551.372C91.0665 551.736 90.8075 552.965 90.1249 553.717C89.9065 553.957 89.8529 554.062 89.9139 554.128C90.0664 554.294 90.4316 554.039 90.846 553.329C91.0797 552.93 90.8802 555.667 90.9705 561.88C90.9974 562.735 91.0285 565.569 91.0292 565.763C89.954 570.603 91.5852 610.946 91.8463 608.469C93.1527 609.492 92.6763 570.473 91.5069 561.661C91.5054 561.134 91.7374 552.966 91.7663 552.967C91.7721 552.967 91.8791 553.114 91.9992 553.292C92.4664 553.981 92.5961 554.067 92.8649 553.87C93.1039 553.694 93.0884 553.508 92.8134 553.149C92.376 552.583 92.0526 551.991 91.8732 551.421C91.748 551.014 91.5344 550.993 91.2987 551.372Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip11_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M490.825 579.488C490.593 579.852 490.334 581.081 489.651 581.832C489.433 582.073 489.379 582.178 489.44 582.244C489.593 582.41 489.958 582.155 490.372 581.444C490.606 581.046 490.407 583.783 490.497 589.996C490.524 590.851 490.555 593.685 490.556 593.879C489.48 598.719 491.112 639.062 491.373 636.585C492.679 637.608 492.203 598.589 491.033 589.777C491.032 589.25 491.264 581.082 491.293 581.083C491.298 581.083 491.405 581.229 491.526 581.408C491.993 582.097 492.122 582.183 492.391 581.986C492.63 581.81 492.615 581.624 492.34 581.265C491.902 580.699 491.579 580.107 491.4 579.537C491.274 579.13 491.061 579.109 490.825 579.488Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip12_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M642.365 583.092C642.135 583.388 641.885 584.389 641.207 584.999C640.991 585.194 640.938 585.28 640.999 585.334C641.153 585.47 641.516 585.263 641.925 584.686C642.156 584.361 641.974 586.593 642.105 591.659C642.137 592.357 642.186 594.667 642.188 594.825C641.145 598.768 643.034 631.669 643.279 629.651C644.591 630.49 643.864 598.672 642.639 591.483C642.634 591.053 642.813 584.393 642.842 584.394C642.848 584.395 642.956 584.514 643.077 584.661C643.548 585.224 643.678 585.295 643.946 585.135C644.183 584.992 644.166 584.841 643.889 584.547C643.449 584.084 643.122 583.6 642.939 583.135C642.811 582.802 642.598 582.784 642.365 583.092Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip13_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M30.5534 701.794C30.9137 702.032 32.1386 702.311 32.8785 703.006C33.115 703.229 33.2192 703.284 33.2864 703.224C33.4545 703.074 33.2056 702.705 32.5024 702.279C32.1074 702.039 34.841 702.283 41.0547 702.296C41.9103 702.283 44.7441 702.298 44.9382 702.301C49.76 703.456 90.124 702.49 87.6518 702.188C88.6967 700.899 49.6746 700.732 40.8451 701.756C40.3178 701.748 32.1544 701.382 32.1561 701.353C32.1564 701.347 32.3045 701.243 32.4852 701.125C33.1812 700.67 33.2698 700.541 33.0767 700.269C32.905 700.027 32.7187 700.04 32.3553 700.309C31.7827 700.737 31.1848 701.051 30.6125 701.221C30.2027 701.339 30.1788 701.552 30.5534 701.794Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip14_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M55.4659 749.811C55.8735 749.668 56.8369 748.862 57.8378 748.693C58.158 748.639 58.265 748.59 58.258 748.5C58.2404 748.276 57.7958 748.25 57.0311 748.553C56.6009 748.722 58.4494 746.693 62.2183 741.753C62.7257 741.064 64.4525 738.817 64.5719 738.664C68.4086 735.523 92.0591 702.8 90.3231 704.585C89.9286 702.973 66.188 733.943 61.6615 741.593C61.3369 742.009 56.1061 748.287 56.0841 748.268C56.0797 748.264 56.0861 748.083 56.1021 747.868C56.1603 747.038 56.1117 746.89 55.7783 746.879C55.4819 746.87 55.3791 747.026 55.3735 747.478C55.3679 748.193 55.2558 748.858 55.045 749.417C54.8914 749.815 55.0467 749.963 55.4659 749.811Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip15_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M172.518 848.811C172.925 848.668 173.889 847.862 174.89 847.693C175.21 847.639 175.317 847.59 175.31 847.5C175.292 847.276 174.848 847.25 174.083 847.553C173.653 847.722 175.501 845.693 179.27 840.753C179.777 840.064 181.504 837.817 181.624 837.664C185.46 834.523 209.111 801.8 207.375 803.585C206.98 801.973 183.24 832.943 178.713 840.593C178.389 841.009 173.158 847.287 173.136 847.268C173.131 847.264 173.138 847.083 173.154 846.868C173.212 846.038 173.163 845.89 172.83 845.879C172.534 845.87 172.431 846.026 172.425 846.478C172.42 847.193 172.308 847.858 172.097 848.417C171.943 848.815 172.098 848.963 172.518 848.811Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip16_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M222.103 849.413C222.382 849.084 222.804 847.9 223.582 847.248C223.83 847.039 223.898 846.942 223.846 846.869C223.717 846.684 223.321 846.887 222.815 847.535C222.53 847.899 223.096 845.214 223.843 839.045C223.931 838.194 224.282 835.382 224.307 835.189C226.024 830.538 229.838 790.343 229.246 792.762C228.089 791.572 223.309 830.301 223.282 839.189C223.212 839.712 221.883 847.775 221.854 847.77C221.849 847.769 221.762 847.609 221.667 847.416C221.297 846.671 221.18 846.568 220.887 846.727C220.627 846.869 220.617 847.056 220.841 847.448C221.199 848.068 221.439 848.698 221.54 849.287C221.61 849.708 221.818 849.757 222.103 849.413Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip17_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M376.887 926.236C377.166 925.907 377.588 924.724 378.366 924.071C378.615 923.862 378.682 923.766 378.63 923.692C378.501 923.507 378.105 923.711 377.599 924.358C377.314 924.722 377.88 922.037 378.627 915.868C378.715 915.017 379.066 912.205 379.091 912.013C380.808 907.361 384.622 867.166 384.03 869.585C382.873 868.395 378.093 907.124 378.066 916.012C377.996 916.535 376.667 924.598 376.638 924.593C376.633 924.592 376.546 924.432 376.451 924.239C376.081 923.494 375.964 923.391 375.671 923.551C375.411 923.693 375.401 923.879 375.625 924.272C375.983 924.891 376.223 925.522 376.325 926.11C376.394 926.531 376.603 926.58 376.887 926.236Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip18_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M422.894 943.049C423.215 942.759 423.792 941.643 424.65 941.101C424.925 940.928 425.004 940.841 424.963 940.761C424.86 940.56 424.44 940.709 423.852 941.283C423.52 941.605 424.441 939.02 426.008 933.007C426.21 932.175 426.934 929.436 426.985 929.249C429.31 924.869 438.477 885.548 437.566 887.866C436.579 886.532 426.651 924.27 425.433 933.075C425.294 933.584 422.896 941.395 422.868 941.387C422.863 941.385 422.799 941.215 422.73 941.011C422.463 940.223 422.361 940.105 422.05 940.224C421.773 940.33 421.738 940.513 421.908 940.932C422.179 941.594 422.333 942.251 422.354 942.848C422.366 943.274 422.566 943.351 422.894 943.049Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip19_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M582.168 579.642C581.936 580.006 581.677 581.235 580.994 581.986C580.776 582.226 580.722 582.332 580.783 582.398C580.936 582.563 581.301 582.308 581.715 581.598C581.949 581.199 581.749 583.937 581.84 590.15C581.867 591.005 581.898 593.839 581.898 594.033C580.823 598.873 582.454 639.216 582.715 636.739C584.022 637.762 583.545 598.743 582.376 589.931C582.374 589.404 582.607 581.236 582.635 581.237C582.641 581.237 582.748 581.383 582.868 581.562C583.336 582.25 583.465 582.337 583.734 582.139C583.973 581.964 583.958 581.778 583.683 581.419C583.245 580.853 582.922 580.261 582.742 579.691C582.617 579.283 582.404 579.263 582.168 579.642Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip20_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M32.3337 610.555C32.694 610.794 33.9188 611.073 34.6588 611.768C34.8953 611.99 34.9994 612.045 35.0667 611.985C35.2347 611.836 34.9859 611.466 34.2827 611.04C33.8877 610.8 36.6212 611.045 42.835 611.057C43.6906 611.044 46.5243 611.06 46.7184 611.062C51.5403 612.217 91.9043 611.251 89.432 610.95C90.477 609.66 51.4549 609.493 42.6254 610.517C42.0981 610.51 33.9347 610.143 33.9363 610.114C33.9367 610.108 34.0848 610.004 34.2655 609.887C34.9615 609.431 35.05 609.303 34.8569 609.031C34.6853 608.789 34.499 608.801 34.1356 609.07C33.563 609.498 32.9651 609.812 32.3928 609.982C31.983 610.1 31.9591 610.313 32.3337 610.555Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip21_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M525.918 603.252C526.28 603.487 527.508 603.755 528.254 604.443C528.493 604.663 528.597 604.717 528.664 604.657C528.831 604.506 528.578 604.139 527.871 603.719C527.474 603.482 530.21 603.702 536.423 603.656C537.279 603.636 540.113 603.625 540.307 603.626C545.139 604.736 585.492 603.397 583.018 603.118C584.051 601.819 545.029 602.013 536.209 603.118C535.682 603.116 527.515 602.825 527.516 602.796C527.517 602.79 527.664 602.684 527.843 602.566C528.535 602.103 528.623 601.974 528.427 601.704C528.253 601.464 528.067 601.478 527.706 601.75C527.137 602.184 526.542 602.503 525.972 602.678C525.563 602.8 525.541 603.014 525.918 603.252Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip22_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M612.235 602.72C612.047 602.488 611.393 602.228 611.014 601.547C610.893 601.33 610.838 601.276 610.8 601.337C610.704 601.488 610.828 601.852 611.195 602.266C611.401 602.499 609.93 602.297 606.567 602.378C606.104 602.403 604.57 602.43 604.465 602.431C601.891 601.353 580.016 602.919 581.345 603.183C580.739 604.482 601.853 604.064 606.664 602.912C606.949 602.911 611.356 603.154 611.354 603.183C611.354 603.189 611.27 603.295 611.169 603.415C610.778 603.879 610.726 604.008 610.822 604.276C610.908 604.514 611.009 604.499 611.214 604.226C611.537 603.791 611.87 603.47 612.185 603.292C612.411 603.168 612.43 602.955 612.235 602.72Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip23_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M615.248 602.601C615.419 602.831 616.017 603.086 616.362 603.764C616.472 603.981 616.522 604.034 616.558 603.973C616.645 603.821 616.534 603.458 616.198 603.047C616.01 602.816 617.356 603.008 620.434 602.905C620.858 602.876 622.261 602.839 622.357 602.838C624.709 603.898 644.73 602.186 643.515 601.932C644.072 600.629 624.751 601.188 620.346 602.371C620.085 602.374 616.054 602.161 616.055 602.132C616.056 602.126 616.132 602.019 616.225 601.899C616.584 601.433 616.632 601.303 616.545 601.036C616.467 600.799 616.374 600.815 616.186 601.089C615.889 601.526 615.584 601.849 615.295 602.029C615.088 602.154 615.07 602.367 615.248 602.601Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip24_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M55.5811 656.898C55.8177 656.608 56.0922 655.613 56.7835 655.02C57.0047 654.83 57.0596 654.746 56.9995 654.69C56.8493 654.551 56.4814 654.749 56.0584 655.316C55.82 655.635 56.0545 653.409 56.0444 648.343C56.0285 647.646 56.034 645.335 56.0358 645.177C57.1719 641.262 56.0631 608.338 55.7705 610.349C54.4792 609.479 54.4518 641.293 55.5059 648.507C55.5007 648.936 55.1636 655.587 55.1348 655.586C55.129 655.585 55.024 655.463 54.9064 655.314C54.4488 654.74 54.3204 654.666 54.0494 654.82C53.8085 654.956 53.8216 655.108 54.0916 655.408C54.5211 655.881 54.8363 656.373 55.0081 656.842C55.1279 657.178 55.3409 657.2 55.5811 656.898Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip25_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M546.913 602.743C546.551 602.978 545.323 603.246 544.577 603.934C544.338 604.154 544.234 604.208 544.167 604.148C544 603.996 544.253 603.629 544.96 603.21C545.357 602.973 542.621 603.193 536.408 603.147C535.552 603.127 532.718 603.116 532.524 603.117C527.692 604.227 487.339 602.888 489.814 602.609C488.781 601.31 527.803 601.504 536.622 602.609C537.15 602.607 545.316 602.316 545.315 602.287C545.314 602.281 545.167 602.175 544.988 602.056C544.296 601.594 544.208 601.465 544.404 601.195C544.578 600.955 544.764 600.969 545.125 601.241C545.694 601.675 546.289 601.994 546.859 602.169C547.268 602.291 547.29 602.505 546.913 602.743Z"
                        fill="#858585"
                      />
                    </g>
                    <g clip-path="url(#clip26_9_487)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M55.187 650.762C55.4149 651.093 55.6597 652.206 56.3334 652.889C56.549 653.108 56.6014 653.203 56.5396 653.263C56.3853 653.411 56.0232 653.178 55.6171 652.534C55.3882 652.171 55.5563 654.647 55.395 660.262C55.3584 661.034 55.2949 663.595 55.292 663.771C56.3113 668.153 54.2201 704.603 53.9876 702.362C52.6701 703.279 53.592 668.016 54.8614 660.06C54.869 659.584 54.7303 652.2 54.7014 652.2C54.6956 652.201 54.587 652.332 54.4649 652.493C53.9902 653.112 53.8595 653.189 53.5931 653.009C53.3563 652.848 53.3739 652.68 53.6529 652.358C54.0965 651.85 54.4264 651.316 54.6123 650.803C54.7421 650.435 54.9557 650.418 55.187 650.762Z"
                        fill="#858585"
                      />
                    </g>
                    <path
                      d="M617.845 877.346L596.215 936.592"
                      stroke="black"
                      stroke-miterlimit="16"
                      stroke-linecap="round"
                      stroke-dasharray="2 2"
                    />
                    <path
                      d="M607.712 931.591L495.452 895.276M470.089 888.503L434.351 877.407M441.844 887.35L463.028 788.781"
                      stroke="black"
                      stroke-miterlimit="16"
                      stroke-linecap="round"
                      stroke-dasharray="2 2"
                    />
                    <defs>
                      <clipPath id="clip0_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(95 614.764)"
                        />
                      </clipPath>
                      <clipPath id="clip1_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(158 617)"
                        />
                      </clipPath>
                      <clipPath id="clip2_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(237 770)"
                        />
                      </clipPath>
                      <clipPath id="clip3_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(297 777)"
                        />
                      </clipPath>
                      <clipPath id="clip4_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(346 782)"
                        />
                      </clipPath>
                      <clipPath id="clip5_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(261 622)"
                        />
                      </clipPath>
                      <clipPath id="clip6_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(311 624.764)"
                        />
                      </clipPath>
                      <clipPath id="clip7_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(412 631.877)"
                        />
                      </clipPath>
                      <clipPath id="clip8_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(410 671.714)"
                        />
                      </clipPath>
                      <clipPath id="clip9_9_487">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(407 708)"
                        />
                      </clipPath>
                      <clipPath id="clip10_9_487">
                        <rect
                          width="33.7499"
                          height="3.55414"
                          fill="white"
                          transform="translate(92.5781 575.043) rotate(87.5176)"
                        />
                      </clipPath>
                      <clipPath id="clip11_9_487">
                        <rect
                          width="34.7961"
                          height="3.55414"
                          fill="white"
                          transform="translate(492.06 602.114) rotate(87.5176)"
                        />
                      </clipPath>
                      <clipPath id="clip12_9_487">
                        <rect
                          width="28.3837"
                          height="3.55414"
                          fill="white"
                          transform="translate(643.828 601.532) rotate(87.5176)"
                        />
                      </clipPath>
                      <clipPath id="clip13_9_487">
                        <rect
                          width="33.9927"
                          height="3.55414"
                          fill="white"
                          transform="translate(54 700.912) rotate(-1.53739)"
                        />
                      </clipPath>
                      <clipPath id="clip14_9_487">
                        <rect
                          width="33.9927"
                          height="3.55414"
                          fill="white"
                          transform="translate(68.9482 730.608) rotate(-54.31)"
                        />
                      </clipPath>
                      <clipPath id="clip15_9_487">
                        <rect
                          width="33.9927"
                          height="3.55414"
                          fill="white"
                          transform="translate(186 829.608) rotate(-54.31)"
                        />
                      </clipPath>
                      <clipPath id="clip16_9_487">
                        <rect
                          width="25.4783"
                          height="3.55414"
                          fill="white"
                          transform="translate(224.779 817.548) rotate(-84.7469)"
                        />
                      </clipPath>
                      <clipPath id="clip17_9_487">
                        <rect
                          width="20.2145"
                          height="3.55414"
                          fill="white"
                          transform="translate(380.045 889.13) rotate(-84.7469)"
                        />
                      </clipPath>
                      <clipPath id="clip18_9_487">
                        <rect
                          width="20.71"
                          height="3.55414"
                          fill="white"
                          transform="translate(430.887 907.183) rotate(-77.0443)"
                        />
                      </clipPath>
                      <clipPath id="clip19_9_487">
                        <rect
                          width="33.9927"
                          height="3.55414"
                          fill="white"
                          transform="translate(583.437 603.07) rotate(87.5176)"
                        />
                      </clipPath>
                      <clipPath id="clip20_9_487">
                        <rect
                          width="33.9927"
                          height="3.55414"
                          fill="white"
                          transform="translate(55.7803 609.673) rotate(-1.53739)"
                        />
                      </clipPath>
                      <clipPath id="clip21_9_487">
                        <rect
                          width="23.8551"
                          height="3.55414"
                          fill="white"
                          transform="translate(559.485 601.787) rotate(-2.06778)"
                        />
                      </clipPath>
                      <clipPath id="clip22_9_487">
                        <rect
                          width="12.9104"
                          height="3.55414"
                          fill="white"
                          transform="translate(594.052 604.175) rotate(179.726)"
                        />
                      </clipPath>
                      <clipPath id="clip23_9_487">
                        <rect
                          width="11.8139"
                          height="3.55414"
                          fill="white"
                          transform="translate(631.889 601.046) rotate(-0.225488)"
                        />
                      </clipPath>
                      <clipPath id="clip24_9_487">
                        <rect
                          width="19.4513"
                          height="3.55414"
                          fill="white"
                          transform="translate(54.3809 629.517) rotate(-91.1228)"
                        />
                      </clipPath>
                      <clipPath id="clip25_9_487">
                        <rect
                          width="23.9342"
                          height="3.55414"
                          fill="white"
                          transform="matrix(-0.999349 -0.0360818 -0.0360818 0.999349 514.047 601.636)"
                        />
                      </clipPath>
                      <clipPath id="clip26_9_487">
                        <rect
                          width="21.637"
                          height="3.55414"
                          fill="white"
                          transform="matrix(-0.052558 0.998618 0.998618 0.052558 53.1367 681)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div style={{ position: 'absolute', right: 0 }}>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Product name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Color
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Category
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
                          <td className="px-6 py-4">Silver</td>
                          <td className="px-6 py-4">Laptop</td>
                          <td className="px-6 py-4">$2999</td>
                        </tr>
                        <tr className="bg-white border-b ">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                          >
                            Microsoft Surface Pro
                          </th>
                          <td className="px-6 py-4">White</td>
                          <td className="px-6 py-4">Laptop PC</td>
                          <td className="px-6 py-4">$1999</td>
                        </tr>
                        <tr className="bg-white ">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                          >
                            Magic Mouse 2
                          </th>
                          <td className="px-6 py-4">Black</td>
                          <td className="px-6 py-4">Accessories</td>
                          <td className="px-6 py-4">$99</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesSummaryReport
