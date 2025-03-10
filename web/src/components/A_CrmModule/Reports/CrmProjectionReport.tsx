import React, { useEffect, useState } from 'react'
import { useMemo } from 'react';
import { Add, Remove } from '@mui/icons-material'
import { gretProjectionSum } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ArrowUpDown, Download, MoveDown, MoveUp, TrendingUp } from 'lucide-react';


import TableSkeleton from './_mock/comps/table/table-skeleton'


const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase())
}

const getDateForWeek = (weekNumber) => {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstDayOfWeek = new Date(firstDayOfMonth)
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (weekNumber - 1) * 7)

  const day = String(firstDayOfWeek.getDate()).padStart(2, '0')
  const month = String(firstDayOfWeek.getMonth() + 1).padStart(2, '0')
  const year = firstDayOfWeek.getFullYear()

  return `${day}-${month}-${year}`
}

const getNextMonths = (startMonthOffset, monthCount) => {
  const months = []
  const today = new Date()
  today.setMonth(today.getMonth() + startMonthOffset)

  for (let i = 0; i < monthCount; i++) {
    const month = today.toLocaleString('default', { month: 'long' })
    const year = today.getFullYear()
    months.push({
      name: `${month} ${year}`,
      count: today.getMonth() + 1,
      currentYear: year,
    })
    today.setMonth(today.getMonth() + 1)
  }

  return months
}

const styles = {
  customTopBottomShadow: {
    boxShadow:
      'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
}








const timeSeriesData = [
  { time: '12', value: 5, prevValue: 5 },
  { time: '13', value: 5, prevValue: 5 },
  { time: '14', value: 20, prevValue: 5 },
  { time: '15', value: 5, prevValue: 5 },
  { time: '16', value: 5, prevValue: 5 },
  { time: '17', value: 90, prevValue: 30 },
  { time: '18', value: 5, prevValue: 5 },
];

const channelData = [
  { name: 'Make an offer', value1: 80, value2: 120, value3: 0 },
  { name: 'Online store', value1: 20, value2: 0, value3: 0 },
];







const reportData = [
  {
    id: 1,
    projectName: 'Eco stone',
    soldUnits: 3,
    totalAmount: 1001010,
    monthly: {
      april: 25000,
      may: 25000,
      june: 10925500,
    },
    weekly: {
      week1: 5000,
      week2: 6000,
      week3: 7000,
      week4: 8000,
      week5: 9000,
    },
    oldDue: 150000,
  },
  {
    id: 2,
    projectName: 'green gardens',
    soldUnits: 5,
    totalAmount: 2002020,
    monthly: {
      april: 35000,
      may: 45000,
      june: 11925500,
    },
    weekly: {
      week1: 7000,
      week2: 8000,
      week3: 9000,
      week4: 10000,
      week5: 11000,
    },
    oldDue: 200000,
  },
]

const CrmProjectionReport = ({ projects }) => {
  const { user } = useAuth()
  const { orgId } = user

  const [filter, setFilter] = useState('')
  const [dataView, setDataView] = useState('monthly')
  const [monthCount, setMonthCount] = useState(3)
  const [startMonthOffset, setStartMonthOffset] = useState(0)
  const [monthsA, setMonthsA] = useState(
    getNextMonths(startMonthOffset, monthCount)
  )
  const [projectAValues, setProjectWithValues] = useState([])
  const [loader, setLoaderIcon] = useState(false)

  useEffect(() => {
    setMonthsA(getNextMonths(startMonthOffset, monthCount))
  }, [monthCount, startMonthOffset])

  useEffect(() => {
    calMonthlyValueNew(projects)
  }, [projects, monthsA])

  const handleIncreaseMonth = () => {
    setMonthCount((prevCount) => prevCount + 1)
  }

  const handleDecreaseMonth = () => {
    setStartMonthOffset((prevOffset) => prevOffset - 1)
  }

  const filteredData = reportData.filter((item) => {
    return (
      (!filter || item.soldUnits === parseInt(filter)) &&
      (dataView === 'monthly' || dataView === 'weekly')
    )
  })

  const handleChangeView = (view) => {
    setDataView(view)
  }

  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => {
      return acc + (item[key] || 0)
    }, 0)
  }

  const totalSoldSummary = calculateTotal(projects, 'soldUnitCount')

  const calMonthlyValueNew = async (projects) => {
    try {
      setLoaderIcon(true)
      const insideValues = []
      for (const projectData of projects) {
        const newProjectData = { ...projectData }
        const projectMonthArray = []

        await Promise.all(
          monthsA.map(async (month) => {
            const payload = {
              pId: projectData.uid,
              monthNo: month.count,
              currentYear: month.currentYear,
            }

            const totalReceivableValue = await gretProjectionSum(orgId, payload)
            const updatedMonth = { ...month, receive: totalReceivableValue }

            projectMonthArray.push(updatedMonth)
          })
        )

        newProjectData.months = projectMonthArray
        insideValues.push(newProjectData)
      }

      setProjectWithValues(insideValues)
    } catch (error) {
      console.error('Error calculating monthly values:', error)
    } finally {
      setLoaderIcon(false)
    }
  }

  const calMonthlyValue = (pId, monthNo, currentYear) => {
    const data = { pId, monthNo, currentYear }

    let totalReceivableValue = 0

    gretProjectionSum(orgId, data)
      .then((payload) => {
        totalReceivableValue = payload
        console.log(
          'Total receivable stored in variable:',
          totalReceivableValue
        )
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    return totalReceivableValue
  }








  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const time = payload[0].payload.time; 
  
      return (
        <div className="bg-white p-3 rounded-md">
          <p className="text-black">Time: {time}</p>
  
          {payload.map((entry, index) => {
            const { value, prevValue } = entry.payload; 
            const strokeColor = entry.stroke; 
  
        
            return (
              <div key={index} className="flex items-center gap-2">
              
                <div
                  style={{ backgroundColor: strokeColor }}
                  className="w-4 h-4 "
                ></div>
            
                <p className="text-black">
                  {entry.dataKey === "value"
                    ? `Current Value: ${value}`
                    : entry.dataKey === "prevValue"
                    ? `Previous Value: ${prevValue}`
                    : null}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
  
    return null;
  };








  const data = [
    { name: 'week 1', current: 15000, previous: 40000 },
    { name: 'week 2', current: 8000, previous: 12000 },
    { name: 'week 3', current: 15000, previous: 55000 },

    { name: 'week 4', current: 9000, previous: 55000 },


    { name: 'week 5', current: 16000, previous: 55000 },
    { name: 'week 6', current: 12000, previous: 55000 },


  ];

  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `${value / 1000}K`;
    }
    return value;
  };

  // Custom Legend Component
  const CustomLegend = ({ payload }) => {
    if (!payload.length) return null;
    
    return (

      <>
      </>

    );
  };

   






  
  const CustomTooltipone = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center mt-2">
            
              <div
                className="w-4 h-4  mr-2"
                style={{ backgroundColor: item.stroke }}
              />
              <span className="font-medium">{item.name}</span>
              <span className="ml-auto font-semibold text-gray-800">{`${formatYAxis(item.value)}`}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };





  const [sortConfig, setSortConfig] = useState({
    key: 'projectName', 
    direction: 'ascending',
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };




  const sortedData = useMemo(() => {
    return [...projectAValues].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [projectAValues, sortConfig]);
  
















  return (
    <div className="bg-[#F1F1F1]">






            
<div className='max-w-7xl mx-auto mt-6'>
<div className="grid grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-xl p-6  shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Sold Units</h3>
    <p className="text-2xl font-bold mb-2">0</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">157 Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md ">
    <h3 className="text-gray-600 mb-2">Sales</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Balance</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Recieved</h3>
    <p className="text-2xl font-bold mb-2">₹</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">Units</span>
    </div>
  </div>
</div>
</div>







<div className="max-w-7xl mx-auto mt-6 mb-4">



        <div className="grid grid-cols-2 gap-6 h-full items-end">
      
          <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
            <div className="pt-6 px-4">
              <h2 className="text-[#000000] text-[19px] ml-4">Booking Trend</h2>
              <div className="flex items-center gap-3 mt-4 mb-4 ml-4">
                <span className="text-[30px] text-[#000000] font-semibold">&#8377; 387.75</span>
                <div className="flex items-center text-[#00A236]">
                  <TrendingUp className="w-5 h-5 mx-3" />
                  <span className="text-[18px]">23%</span>
                </div>
              </div>
            </div>
            <div className="h-96 px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="#CCCCCC" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    stroke="#3D3D3D"
                    tick={{ dy: 10 }}
                    interval={0}
                  />
                  <YAxis
                    domain={[5, 100]}
                    ticks={[5, 25, 50, 75, 100]}
                    axisLine={false}
                    tickLine={false}
                    stroke="#3D3D3D"
                  />


             
                  {/* <Tooltip contentStyle={{ backgroundColor: '#333333', color: 'white' }} /> */}


                  <Tooltip content={<CustomTooltip />} />


                  <Line
                    type="monotone"
                    dataKey="prevValue"
                    stroke="#CCCCCC"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        
          <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">

          <div className="w-full max-w-4xl p-6 relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[19px] font-normal text-[#000000]">Project collections</h1>
          <div className="text-[30px] font-semibold mt-2 text-[#000000]">&#8377;  2613</div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Download className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
 


<LineChart
  data={data}
  margin={{ top: 0, right: 0, left: 0, bottom: 30 }}
>

<CartesianGrid vertical={false} stroke="#CCCCCC" />

  <XAxis
    dataKey="name"
    axisLine={{ stroke: '#E5E7EB' }}
    tick={{ fill: '#6B7280', fontSize: 14 }}
    tickLine={false}
    dy={10}
  />
  <YAxis
    tickFormatter={formatYAxis}
    axisLine={false}
    tickLine={false}
    tick={{ fill: '#6B7280', fontSize: 14 }}
    domain={[0, 100000]}
    ticks={[1000, 10000, 50000, 100000]}
    
  />


    
    <Tooltip content={<CustomTooltipone />} />
    <Legend content={<CustomLegend payload={undefined} />} />

  <Line
    type="monotone"
    dataKey="current"
    stroke="#2196F3" 
    strokeWidth={2}
    dot={false} 
    activeDot={{ r: 6 }}  
    name="current"
  />

  <Line
    type="monotone"
    dataKey="previous"
    stroke="#E5E7EB"  
    strokeWidth={2}
    strokeDasharray="5 5" 
    dot={false}  
    activeDot={{ r: 6 }}  
    name="previous"
  />
</LineChart>

        </ResponsiveContainer>
      </div>


      <div className="flex flex-row items-end gap-2 absolute bottom-0 right-8">


<button className="flex items-center px-6 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 relative">
          <div className="flex items-center pl-3">
            <div className="w-7 h-[2px] bg-[#29AAE3] mr-2"></div>
            Nov 18, 2024
          </div>
        </button>
        <button className="flex items-center px-6 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 relative">
          <div className="flex items-center pl-3">
            <div className="w-7 h-[2px] border-t-4 font-medium border-[#CCCCCC] border-dotted mr-2"></div>
            Nov 17, 2024
          </div>
        </button>
      </div>
    </div>
          </div>
        </div>
      </div>



































      <section className="p-4 w-full rounded-[30px] bg-white mt-6 max-w-7xl mx-auto">

        <div className='border-2 rounded-[30px] border-[#f1f1f1] p-4'>


      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800">CRM Inventory Report</h1>


        <div className="flex mb-2 space-x-2">
            <button
              onClick={handleDecreaseMonth}
              className="flex items-center space-x-2  bg-gray-200 text-gray-800 px-4 py-2 rounded"
            >
              <Remove /> <span>Previous Month</span>
            </button>
            <button
              onClick={handleIncreaseMonth}
              className="flex items-center space-x-2  bg-gray-200 text-gray-800 px-4 py-2 rounded"
            >
              <Add /> <span>Next Month</span>
            </button>
          </div>
      </div>








        <section className="rounded-t-[30px]  my-3  overflow-x-auto">
     
          <table className="min-w-full  bg-white ">
            <thead className=''>
              <tr
                className={
                  dataView === 'monthly'
                    ? 'bg-[#E0E4EB] py-2 text-gray-600 text-sm leading-normal border  border-gray-100'
                    : 'bg-[#E0E4EB] py-2 text-gray-600 text-sm leading-normal border  border-gray-100'
                }
              >
                <th
                  className="py-1 px-6 text-center  text-[#3D3D3D] text-[16px] font-semibold  border-gray-100"
                  colSpan="1"
                ></th>
                <th
                  className="py-1 px-6 text-center  text-[#3D3D3D] text-[16px] font-semibold   border-gray-100"
                  colSpan="1"
                ></th>
                <th
                  className="py-1 px-6 text-center text-[#3D3D3D]  text-[16px] font-semibold  border-gray-100"
                  colSpan="1"
                ></th>
                {dataView === 'weekly' && (
                  <th
                    className="py-1 px-6 text-center text-[#3D3D3D] text-[16px] font-semibold  border-gray-100"
                    colSpan="4"
                  >
                    Weekly
                  </th>
                )}
                {dataView === 'monthly' && (
                  <th
                    className="py-2 px-6 text-center text-[#3D3D3D] text-[16px] font-semibold  border-gray-100"
                    colSpan="4"
                  >
                    Monthly
                  </th>
                )}
              </tr>
              <tr className="bg-[#F0F2F5] border-t border-b border-[#E8ECF4]">
                <th className="text-left p-1 pl-3 py-2 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]"
                 onClick={() => handleSort('projectName')}
                >
                  Project Name


                  <span className="inline-block ml-2">
    {sortConfig.key === 'projectName' ? (
      sortConfig.direction === 'ascending' ? (
        <MoveUp className="w-4 h-4 text-gray-600" />
      ) : (
        <MoveDown className="w-4 h-4 text-gray-600" />
      )
    ) : (
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
    )}
  </span>




                </th>
                <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap "
                onClick={() => handleSort('soldUnitCount')}

                >
                  Sold Units

                  <span className="inline-block ml-2">
  {sortConfig.key === 'soldUnitCount' ? (
    sortConfig.direction === 'ascending' ? (
      <MoveUp className="w-4 h-4 text-gray-600" />
    ) : (
      <MoveDown className="w-4 h-4 text-gray-600" />
    )
  ) : (
    <ArrowUpDown className="w-4 h-4 text-gray-400" />
  )}
</span>


                </th>
                <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap "
                onClick={() => handleSort('totalAmount')}
                >
                  Total Amount 

                  <span className="inline-block ml-2">
  {sortConfig.key === 'totalAmount' ? (
    sortConfig.direction === 'ascending' ? (
      <MoveUp className="w-4 h-4 text-gray-600" />
    ) : (
      <MoveDown className="w-4 h-4 text-gray-600" />
    )
  ) : (
    <ArrowUpDown className="w-4 h-4 text-gray-400" />
  )}
</span>

 
                </th>
                {dataView === 'monthly' ? (
                  <>
                    {monthsA.map((month, i) => {
                      return (
                        <th
                          key={i}
                          className="text-right p-1 font-medium text-[#000000] whitespace-nowrap "
                        >
                          {month?.name}
                        </th>
                      )
                    })}
                  </>
                ) : (
                  <>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap ">
                      Week 1 <br /> ({getDateForWeek(1)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap ">
                      Week 2 <br /> ({getDateForWeek(2)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap ">
                      Week 3 <br /> ({getDateForWeek(3)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap ">
                      Week 4 <br /> ({getDateForWeek(4)})
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="">


              {loader && <TableSkeleton rows={3} columns={7} />}
              {sortedData?.map((data, index) => {
                const monthlyData = data?.monthly
                let totalReceived = 0
                let totalOutstanding = 0
                const week1 = data?.weekly?.week1
                const week2 = data?.weekly?.week2
                const week3 = data?.weekly?.week3
                const week4 = data?.weekly?.week4

                const getMonthlyValues = (data, dataView) => {
                  const monthly = data.monthly
                  const weekly = data.weekly
                  const total = 0
                  if (dataView === 'weekly') {
                    return (
                      weekly?.week1 +
                      weekly?.week2 +
                      weekly?.week3 +
                      weekly?.week4
                    )
                  } else {
                    return monthly?.april + monthly?.may + monthly?.june
                  }
                }

                if (dataView === 'weekly') {
                  totalReceived = week1 + week2 + week3 + week4
                  totalOutstanding =
                    data?.totalAmount - totalReceived - data?.oldDue
                } else {
                  totalReceived = getMonthlyValues(data, 'monthly')
                  totalOutstanding =
                    data?.totalAmount - totalReceived - data?.oldDue
                }
                const monthData = () => {
                  if (dataView === 'monthly') {
                    return (
                      <>
                        {data?.months?.map((month, i) => {
                          return (
                            <td
                              key={i}
                              className="p-2 text-right text-gray-700 "
                            >
                              {`${month?.receive?.toLocaleString('en-IN')}`}
                            </td>
                          )
                        })}
                      </>
                    )
                  } else {
                    return (
                      <>
                        <td className="p-2 text-right text-gray-700 ">
                          {data?.weekly?.week1.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-right text-gray-700 ">
                          {data?.weekly?.week2.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-right text-gray-700 ">
                          {data?.weekly?.week3.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-right text-gray-700 ">
                          {data?.weekly?.week4.toLocaleString('en-IN')}
                        </td>
                      </>
                    )
                  }
                }

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-100 text-gray-700 font-[400]"
                  >
                    <td className="py-1 px-3 text-left whitespace-nowrap   font-medium   p-4 text-gray-700 ">
                      {capitalizeFirstLetter(data?.projectName)}
                    </td>
                    <td className="p-2 text-right text-gray-700 ">
                      {data?.soldUnitCount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-right text-gray-700 ">
                      {data?.months
                        ?.reduce((accumulator, currentValue) => {
                          return accumulator + (currentValue?.receive || 0)
                        }, 0)
                        ?.toLocaleString('en-IN')}
                    </td>
                    {monthData()}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>


        </div>

        
      </section>
    </div>
  )
}

export default CrmProjectionReport
