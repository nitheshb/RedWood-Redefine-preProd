import React, { useEffect, useState } from 'react'


import {
  getBookedUnitsByProject,
  gretProjectCollectionSum,
  gretProjectionSum,
  steamCollectionsReport,
  steamUsersListByDept,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { getLastSevenMonths, getLastSevenWeeks, getLastSixYears, getLastThreeMonths, getNextThreeMonths } from 'src/util/dateConverter'

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
import CRMCollectionReportKPI from './collectionReportKPI'
import CRMReportSideWindow from 'src/components/SiderForm/CRMReportSideView'
import PeriodSelctorWizard from './PeriodSelcectorWizard'
import CRMCollectionTotalWizard from './collectionTotalWizard'
import CRMCollectionToppersWizard from './collectionToppersWizard'
import CRMCollectionTopEmpWizard from './collectionToppersEmployeeWizard'











{
  /* frist capitalize all letters */
}

export const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase())
}

{
  /* date */
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













export const CustomTooltip = ({ active, payload }) => {
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
  { time: 'Week-1', value: 5, prevValue: 2505 },
  { time: 'Week-2', value: 5, prevValue: 5 },
  { time: 'Week-3', value: 20, prevValue: 5 },
  { time: 'Week-4', value: 5, prevValue: 5 },
  { time: 'Week-5', value: 5, prevValue: 5 },
  { time: 'Week-6', value: 90, prevValue: 30 },
  { time: 'Week-7', value: 5, prevValue: 5 },
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


const CrmCollectionReport = ({ projects, unitsFetchData }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [timeLineTC, setTimeLineTC] = useState('W');


  const [monthsA, setMonthsA] = useState(getNextThreeMonths())
  const [last7MonthsA, setLast7MonthsA] = useState(getLastSevenMonths())

  const [totalCollecionR, setTotalCollecionR] = useState([])
  const [projectAValues, setProjectWithValues] = useState([])
  const [projectCollections, setProjectCollections] = useState([])

  const [loader, setLoaderIcon] = useState(false)
  const [crmEmployeesA, setCRMEmployees] = useState([])













  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => {
      return acc + (item[key] || 0)
    }, 0)
  }
  const totalSoldSummary = calculateTotal(projects, 'soldUnitCount')





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
<<<<<<< HEAD
    <div className="  bg-[#fff] ">
=======
    <div className="bg-white ">
>>>>>>> 5eb404f7e8bed5cc56d1c9e92056523881e9979b












<CRMCollectionReportKPI projects={projects}  />




<div className='max-w-7xl mx-auto mt-6'>
<div className="grid grid-cols-2 gap-6 h-full items-end">



<CRMCollectionTotalWizard />
<CRMCollectionToppersWizard projects={projects} />
{/* <CRMCollectionTopEmpWizard projects={projects} /> */}

    </div>
</div>














    </div>
  )
}

export default CrmCollectionReport
