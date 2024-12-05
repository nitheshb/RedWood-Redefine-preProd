import React, { useEffect, useState } from 'react'


import {
  getBookedUnitsByProject,
  gretProjectionSum,
  steamUsersListByDept,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { getNextThreeMonths } from 'src/util/dateConverter'

import TableSkeleton from './_mock/comps/table/table-skeleton'
import EmpCollectionSummary from './empCollectionReport'



import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Calendar, ChevronRight, TrendingUp } from 'lucide-react';











{
  /* frist capitalize all letters */
}

const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase())
}

{
  /* date */
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

{
  /* dummy data */
}

const styles = {
  customTopBottomShadow: {
    boxShadow:
      'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
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





const progressData = [
  { name: 'completed', value: 50 },
  { name: 'inProgress', value: 30 },
  { name: 'remaining', value: 20 }
];

const COLORS = ['#0EA5E9', '#93C5FD', '#DBEAFE'];












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

const CrmCollectionReport = ({ projects }) => {
  const { user } = useAuth()
  const { orgId } = user

  const [filter, setFilter] = useState('')
  const [dataView, setDataView] = useState('monthly')
  const [monthsA, setMonthsA] = useState(getNextThreeMonths())
  const [projectAValues, setProjectWithValues] = useState([])
  const [loader, setLoaderIcon] = useState(false)
  const [selCat, setSelCat] = useState('project_collections')
  const [crmEmployeesA, setCRMEmployees] = useState([])
  useEffect(() => {
    getCRMemployees()
  }, [])
  const getCRMemployees = async () => {
    const unsubscribe = steamUsersListByDept(
      orgId,
      ['crm'],
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setCRMEmployees(usersListA)
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA)
        setCRMEmployees(usersListA)
      },
      (error) => setCRMEmployees([])
    )
    return unsubscribe
  }
  useEffect(() => {
    calMonthlyValueNew(projects)
  }, [projects])

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

      // Iterate over projects
      for (const projectData of projects) {
        //  const z = await projects.map((projectData) => {
        const newProjectData = { ...projectData }
        const projectMonthArray = []

        // Use Promise.all to execute asynchronous operations concurrently
        await Promise.all(
          monthsA.map(async (month) => {
            const payload = {
              pId: projectData.uid,
              monthNo: month.count,
              currentYear: month.currentYear,
            }

            // Fetch projection sum asynchronously
            const totalReceivableValue = await gretProjectionSum(orgId, payload)

            // Update month object with receivable value
            const updatedMonth = { ...month, receive: totalReceivableValue }
            console.log(
              'Value refreshed',
              updatedMonth,
              projectData?.projectName,
              '=>',
              updatedMonth.receive?.length
            )

            projectMonthArray.push(updatedMonth)
          })
        )

        // Update project data with month array
        newProjectData.months = projectMonthArray
        insideValues.push(newProjectData)
      }

      // After processing all projects, update state with updated project data
      setProjectWithValues(insideValues)
    } catch (error) {
      console.error('Error calculating monthly values:', error)
      // Handle error
    } finally {
      // Set loading state to false
      setLoaderIcon(false)
    }
  }

  const calMonthlyValue = (pId, monthNo, currentYear) => {
    const data = { pId, monthNo, currentYear }

    let totalReceivableValue = 0 // Declare variable to store the total receivable value

    gretProjectionSum(orgId, data)
      .then((payload) => {
        // Assign totalReceivable from the payload to the variable
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

    // get values matched to db
  }



  //const [selCat, setSelCat] = useState("project_collections");
  //const [dataView, setDataView] = useState("monthly");


  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });


  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue =
        sortConfig.key === "projectName"
          ? capitalizeFirstLetter(a[sortConfig.key])
          : a[sortConfig.key];
      const bValue =
        sortConfig.key === "projectName"
          ? capitalizeFirstLetter(b[sortConfig.key])
          : b[sortConfig.key];

      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };


  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = sortData(projectAValues);




  


  return (
    <div className="  bg-[#F1F1F1] ">












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




<div className='max-w-7xl mx-auto mt-6'>
<div className="grid grid-cols-2 gap-6 h-full items-end">
      
      <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
        <div className="pt-6 px-4">
          <h2 className="text-[#000000] text-[19px] ml-4">Total Collected</h2>
          <div className="flex items-center gap-3 mt-4 mb-4 ml-4">
            <span className="text-[30px] text-[#000000] font-semibold">&#8377; 387.75</span>
            <div className="flex items-center text-[#00A236]">
              <TrendingUp className="w-5 h-5 mx-3" />
              <span className="text-[18px]">23%</span>
            </div>
          </div>
        </div>





        <div className="flex ml-8  py-2 mb-4 gap-2 text-gray-600">
      <Calendar className="w-5 h-5" />
      <span>Jun 07, 2024</span>
      <ChevronRight className="w-5 h-5" />
      <i data-lucide="arrow-right"></i>
      <span>Jun 13, 2024</span>
    </div>



    
    <div className="flex ml-7 gap-4 mb-6 flex-row">


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

      <div className="w-full max-w-3xl mx-auto p-8  ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-normal">Collections</h1>
        <span className="text-gray-500">Month</span>
      </div>

      {/* Amount */}
      <div className="mb-6">
        <h2 className="text-4xl font-semibold">₹ 492,767.93</h2>
      </div>

      {/* Progress Bar Chart */}
      <div className="h-8 mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={progressData}
            layout="vertical"
            barSize={32}
          >
            <Bar
              dataKey="value"
              fill="#0EA5E9"
              background={false}
              radius={[4, 4, 4, 4]}
            >
              {progressData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Breakdown */}
      <div className="mb-12">
        <h3 className="text-xl font-normal mb-6">Project-wise Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Project 1</span>
            <span className="text-gray-500">₹ 123.45</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Project 2</span>
            <span className="text-gray-500">₹ 0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Project 3</span>
            <span className="text-gray-500">₹ 214.84</span>
          </div>
        </div>
      </div>

      {/* Employee Breakdown */}
      <div>
        <h3 className="text-xl font-normal mb-6">Employee-wise Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Person 1</span>
            <span className="text-gray-500">₹ 200.45</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Person 2</span>
            <span className="text-gray-500">₹ 0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Person 3</span>
            <span className="text-gray-500">₹ 214.84</span>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
</div>







<div className=''>
<div className="p-4 mt-6 rounded-[30px] bg-white w-full max-w-7xl mx-auto">
        <div className="flex items-center  mb-4">
          <div>
            <h2 className="text-xl font-medium text-gray-800">
              Collections
            </h2>
          </div>

          {[
            { label: 'Project Collections', value: 'project_collections' },
            { label: 'Employee Collections', value: 'employee_collections' },
          ].map((data, i) => {
            return (
              <section
                key={i}
                className="flex "
                onClick={() => {
                  console.log('am i clicked', data.value)
                  setSelCat(data.value)
                }}
              >
                <span
                  className={`flex ml-2 mt-1 items-center h-6 px-3 text-xs  ${
                    selCat === data.value
                      ? 'font-normal text-green-800 bg-[#FFEDEA]'
                      : 'font-normal text-black-100 bg-[#f0f8ff]'
                  }  rounded-full`}
                >
                  {/* <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" /> */}
                  <img alt="" src="/temp2.png" className="h-3 w-3 mr-1" />
                  {data?.label}
                </span>
              </section>
            )
          })}
        </div>
        {selCat === 'project_collections' && (
                  <section className=" w-full max-w-7xl mx-auto mt-6"> 
          <table className="rounded-[30px] w-full max-w-7xl mx-auto shadow-lg my-3 overflow-hidden border border-gray-200">
            <thead className="">
              <tr
                className={
                  dataView === 'monthly'
                    ? 'bg-[#E0E4EB] text-gray-600 text-sm leading-normal   border-gray-100 rounded-2xl'
                    : 'bg-[#E0E4EB] text-gray-600 text-sm leading-normal border  border-gray-100  rounded-2xl'
                }
              >
                <th
                  className="py-1 px-6 text-center  text-[#3D3D3D] text-[16px] font-semibold  border-gray-100"
                  colSpan="1"
                ></th>
                <th
                  className="py-1 px-6 text-center  text-[#3D3D3D] text-[16px] font-semibold  border-gray-100 "
                  colSpan="1"
                ></th>
                <th
                  className="py-1 px-6 text-center  text-[#3D3D3D] text-[16px] font-semibold  border-gray-100"
                  colSpan="1"
                ></th>
                {dataView === 'weekly' && (
                  <th
                    className="py-1 px-6 text-center  text-[#3D3D3D] text-[16px] font-semibold  border-gray-100"
                    colSpan="4"
                  >
                    Weekly
                  </th>
                )}
                {dataView === 'monthly' && (
                  <th
                    className="py-1 px-6 text-center  text-[#3D3D3D] text-[16px] font-semibold  border-gray-100"
                    colSpan="4"
                  >
                    Monthly
                  </th>
                )}
              </tr>
              <tr className="bg-[#F0F2F5] border-t border-b border-[#E8ECF4]">
                <th className="text-left pl-3 p-1 py-2 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]"
                onClick={() => requestSort("projectName")}
                >
                  Project Name
                </th>
                <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]"
                 onClick={() => requestSort("soldUnitCount")}
                >
                  Sold Units
                </th>
                <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]"
                 onClick={() => requestSort("totalAmount")}
                >
                  Total Amount
                </th>
                {dataView === 'monthly' ? (
                  <>
                    {monthsA.map((month, i) => {
                      return (
                        <th
                          key={i}
                          className="text-right p-1 pr-3 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]"
                        >
                          {month?.name}
                        </th>
                      )
                    })}
                  </>
                ) : (
                  <>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                      Week 1 <br /> ({getDateForWeek(1)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                      Week 2 <br /> ({getDateForWeek(2)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                      Week 3 <br /> ({getDateForWeek(3)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                      Week 4 <br /> ({getDateForWeek(4)})
                    </th>
                  </>
                )}
              </tr>
            </thead>

            {loader && [1, 2, 3].map((d, i) => <TableSkeleton key={i} />)}

            <tbody className="">
              {/* <tr className="bg-gray-100">
            <td
              colSpan={dataView === 'monthly' ? 7 : 6}
              className="border border-black"
            ></td>
          </tr> */}
              {sortedData?.map((data, index) => {
                console.log('final value is', data)
                let totalAmount = 0
                if (dataView === 'monthly') {
                  totalAmount =
                    data?.monthly?.june +
                    data?.monthly?.may +
                    data?.monthly?.april
                } else {
                  totalAmount =
                    data?.weekly?.week1 +
                    data?.weekly?.week2 +
                    data?.weekly?.week3 +
                    data?.weekly?.week4
                }
                const oldDue = 0
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-100 text-gray-700 font-[400]"
                  >
                    <td className="p-2 text-gray-700 border-r border-[#E8ECF4] ">
                      {capitalizeFirstLetter(data?.projectName)}
                    </td>
                    <td className="p-2 text-gray-700  text-right border-r border-[#E8ECF4]">
                      {data?.soldUnitCount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-gray-700  text-right border-r border-[#E8ECF4]">
                      {/* {totalAmount?.toLocaleString('en-IN')} */}
                      {data?.months
                        ?.reduce((accumulator, currentValue) => {
                          return accumulator + (currentValue?.receive || 0)
                        }, 0)
                        ?.toLocaleString('en-IN')}
                    </td>
                    {dataView === 'monthly' ? (
                      <>
                        {data?.months?.map((month, i) => {
                          console.log('what is this', month)
                          const x = month
                          console.log('what is this', month)
                          return (
                            <td
                              key={i}
                              className="py- px-3 text-right border-t border-l  border-gray-100"
                            >
                              {`${x?.receive?.toLocaleString('en-IN')}`}
                            </td>
                          )
                        })}
                        {/* <td className="py-3 px-6 text-right border border-black">
                      {data?.monthly?.june.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-6 text-right border border-black">
                      {data?.monthly?.may.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-6 text-right border border-black">
                      {data?.monthly?.april.toLocaleString('en-IN')}
                    </td> */}
                      </>
                    ) : (
                      <>
                        <td className="p-2 text-gray-700 border-r border-[#E8ECF4]">
                          {data?.weekly?.week1.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-gray-700 border-r border-[#E8ECF4]">
                          {data?.weekly?.week2.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-gray-700 border-r border-[#E8ECF4]">
                          {data?.weekly?.week3.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-gray-700 border-r border-[#E8ECF4]">
                          {data?.weekly?.week4.toLocaleString('en-IN')}
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
          </section>
        )}
        {selCat === 'employee_collections' && (
          <EmpCollectionSummary
            projects={projects}
            crmEmployeesA={crmEmployeesA}
          />
        )}
      </div>
</div>

      
    </div>
  )
}

export default CrmCollectionReport
