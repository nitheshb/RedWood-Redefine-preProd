import React, { useEffect, useState } from 'react'

import {
  getBookedUnitsByProject,
  getUnitsAgreeByProject,
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
} from 'recharts'
import { Calendar, ChevronRight, TrendingUp } from 'lucide-react'

{
}

const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase())
}

{
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
}

const styles = {
  customTopBottomShadow: {
    boxShadow:
      'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const time = payload[0].payload.time

    return (
      <div className="bg-white p-3 rounded-md">
        <p className="text-black">Time: {time}</p>

        {payload.map((entry, index) => {
          const { value, prevValue } = entry.payload
          const strokeColor = entry.stroke

          return (
            <div key={index} className="flex items-center gap-2">
              <div
                style={{ backgroundColor: strokeColor }}
                className="w-4 h-4 "
              ></div>

              <p className="text-black">
                {entry.dataKey === 'value'
                  ? `Current Value: ${value}`
                  : entry.dataKey === 'prevValue'
                  ? `Previous Value: ${prevValue}`
                  : null}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return null
}

const timeSeriesData = [
  { time: '12', value: 5, prevValue: 5 },
  { time: '13', value: 5, prevValue: 5 },
  { time: '14', value: 20, prevValue: 5 },
  { time: '15', value: 5, prevValue: 5 },
  { time: '16', value: 5, prevValue: 5 },
  { time: '17', value: 90, prevValue: 30 },
  { time: '18', value: 5, prevValue: 5 },
]

const channelData = [
  { name: 'Make an offer', value1: 80, value2: 120, value3: 0 },
  { name: 'Online store', value1: 20, value2: 0, value3: 0 },
]

const progressData = [
  { name: 'completed', value: 50 },
  { name: 'inProgress', value: 30 },
  { name: 'remaining', value: 20 },
]

const COLORS = ['#0EA5E9', '#93C5FD', '#DBEAFE']

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

const CRMCollectionReportKPI = ({ projects }) => {
  const { user } = useAuth()
  const { orgId } = user

  const [filter, setFilter] = useState('')
  const [dataView, setDataView] = useState('monthly')
  const [monthsA, setMonthsA] = useState(getNextThreeMonths())
  const [projectAValues, setProjectWithValues] = useState([])
  const [loader, setLoaderIcon] = useState(false)
  const [selCat, setSelCat] = useState('project_collections')
  const [crmEmployeesA, setCRMEmployees] = useState([])
  const [leadsFetchedData, setLeadsFetchedData] = useState([])
  const [tableData, setTableData] = useState([])
  const [unitsFetchData, setUnitsFetchData] = useState([])

  const [totalSaleValue, setTotalSaleValue] = useState(0)
  const [totalReceived, setTotalReceived] = useState(0)
  const [selTotalBalance, setTotalBalance] = useState(0)
  const [projectList, setprojectList] = useState([])

  const [totalLandValue, setTotalLandValue] = useState(0)

  const [totalChargesIValue, setTotalChargesIValue] = useState(0)

  const [totalChargesIIValue, setTotalChargesIIValue] = useState(0)
  const [totalPossessionValue, setTotalPossessionValue] = useState(0)
  const [totalConstructValue, setTotalConstructValue] = useState(0)
  const [projectsPayload, setProjectsPayload] = useState([])
  const [projectBookingsData, setProjectBookingsData] = useState([
    { time: 'Jan', value: 0, prevValue: 7 },
    { time: 'Feb', value: 0, prevValue: 7 },
    { time: 'Mar', value: 0, prevValue: 7 },
    { time: 'Apr', value: 0, prevValue: 7 },
    { time: 'Jun', value: 0, prevValue: 7 },
    { time: 'July', value: 0, prevValue: 5 },
    { time: 'Aug', value: 0, prevValue: 5 },
    { time: 'Sep', value: 0, prevValue: 7 },
    { time: 'Oct', value: 0, prevValue: 7 },
    { time: 'Nov', value: 0, prevValue: 7 },
    { time: 'Dec', value: 0, prevValue: 7 },
  ])

  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [unitStatusPayload, setUnitStatusPayload] = useState([
    { day: 'Booked', count: 10 },
    { day: 'Allotment', count: 10 },
    { day: 'ATS', count: 10 },
  ])
  const rowsCounter = (parent, searchKey) => {
    return searchKey === 'all'
      ? parent
      : parent.filter(
          (item) =>
            (item?.unitStatus?.toLowerCase() || item?.status?.toLowerCase()) ===
            searchKey.toLowerCase()
        )
  }
  useEffect(() => {
    getCRMemployees()
  }, [])

  useEffect(() => {
    setLeadsFetchedData(tableData)
  }, [tableData])
  useEffect(() => {
    // unitsFetchData
    console.log('values are', unitsFetchData.length, selProjectIs.uid)
    switch (selProjectIs.value) {
      case 'allprojects':
        return setTableData(unitsFetchData)
      default:
        return setTableData(
          unitsFetchData.filter((dat) => dat?.pId === selProjectIs.uid)
        )
    }
  }, [unitsFetchData, selProjectIs])
  const [inventoryPayload, setInventoryPayload] = useState([
    { day: 'Available', count: 0 },
    { day: 'Booked', count: 0 },
    { day: 'Blocked', count: 0 },
  ])

  useEffect(() => {
    boot()
  }, [projectList])
  useEffect(() => {
    console.log('valure are', leadsFetchedData)
    const totalSale = leadsFetchedData.reduce(
      (total, row) => total + Number(row?.T_total || 0),
      0
    )
    setTotalSaleValue(totalSale)

    const totalLand = leadsFetchedData.reduce(
      (total, row) => total + Number(row?.T_A || 0),
      0
    )
    setTotalLandValue(totalLand)
    const totalChargesI = leadsFetchedData.reduce(
      (total, row) => total + Number(row?.T_B || 0),
      0
    )
    setTotalChargesIValue(totalChargesI)
    const totalConstruction = leadsFetchedData.reduce(
      (total, row) => total + Number(row?.T_C || 0),
      0
    )
    setTotalConstructValue(totalConstruction)
    const totalChargesII = leadsFetchedData.reduce(
      (total, row) => total + Number(row?.T_D || 0),
      0
    )
    setTotalChargesIIValue(totalChargesII)
    const totalPossessionII = leadsFetchedData.reduce(
      (total, row) => total + Number(row?.T_E || 0),
      0
    )
    setTotalPossessionValue(totalPossessionII)

    const totalReceived = leadsFetchedData.reduce(
      (total, row) => total + Number(row.T_approved || 0),
      0
    )
    setTotalReceived(totalReceived)
    const totalBalance = leadsFetchedData.reduce(
      (total, row) => total + Number(row.T_balance || 0),
      0
    )
    setTotalBalance(totalBalance)

    const bookedCount = rowsCounter(leadsFetchedData, 'booked').length
    const allotment = rowsCounter(leadsFetchedData, 'allotment').length
    const ATS = rowsCounter(leadsFetchedData, 'ATS').length
    const registered = rowsCounter(leadsFetchedData, 'registered').length
    const construction = rowsCounter(leadsFetchedData, 'construction').length
    const possession = rowsCounter(leadsFetchedData, 'possession').length

    const x = [
      { day: 'Booked', count: bookedCount },
      { day: 'Allotment', count: allotment },
      { day: 'Agreement', count: ATS },
      { day: 'Registered', count: registered },
      { day: 'Construction', count: construction },
      { day: 'Possession', count: possession },
    ]

    setUnitStatusPayload(x)
  }, [leadsFetchedData])
  function updateInventoryData(myDbDataIs) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    let x = []
    let y = { available: 0, booked: 0, blocked: 0 }
    myDbDataIs.map((record, i) => {
      console.log('project details are', record)

      y.available += record?.availableCount || 0
      y.booked += record?.bookUnitCount || 0
      y.blocked += record?.blockedUnitCount || 0
    })
    setInventoryPayload([
      { day: 'Available', count: y.available },
      { day: 'Booked', count: y.booked },
      { day: 'Blocked', count: y.blocked },
    ])
    console.log('booking details values are', projectBookingsData)
    return projectBookingsData
  }
  function updateBookingData(myDbDataIs) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    myDbDataIs.forEach((record) => {
      const date = new Date(record.Date)
      const month = monthNames[date.getUTCMonth()]
      const booking = projectBookingsData.find((entry) => entry.time === month)
      if (booking) {
        booking.value += 1
      }
    })
    setProjectBookingsData(projectBookingsData)
    console.log('booking details values are', projectBookingsData)
    return projectBookingsData
  }
  const boot = async () => {
    const unsubscribe = await getBookedUnitsByProject(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          const y = projectList.filter((proj) => proj?.uid == x?.pId)
          console.log(',my prject sel is  ===> ', projectList)
          if (y.length > 0) {
            console.log(',my prject sel is ', y)
            x.projName = y[0].projectName
          }
          return x
        })

        console.log('booking details values are', usersListA)
        await setUnitsFetchData(usersListA)
        await updateBookingData(usersListA)
      },
      {
        status: [
          'booked',
          'Booked',
          'agreement_pipeline',
          'ATS',
          'sd_pipeline',
          'Registered',
          'agreement',
          'registered',
          'construction',
          'possession',
        ],
      },
      () => setTableData([])
    )

    const unsubscribe1 = await getUnitsAgreeByProject(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id

          return x
        })
        console.log('projects details values are', usersListA)
        await setProjectsPayload(usersListA)
        await updateInventoryData(usersListA)
      },
      {
        status: [],
      },
      () => setProjectsPayload([])
    )
    return unsubscribe
  }

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

            const totalReceivableValue = await gretProjectionSum(orgId, payload)

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

  return (
    <div className="  bg-white ">
      <div className="max-w-7xl  mt-4 mx-auto">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6  shadow-inner drop-shadow-md">
            <h3 className="text-gray-600 mb-2">Sold Units</h3>
            <p className="text-2xl font-bold mb-2">
              {' '}
              {unitsFetchData?.length?.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2 text-red-500">
              <span className="text-gray-500">
                {leadsFetchedData?.length} Units
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md ">
            <h3 className="text-gray-600 mb-2">Sales</h3>
            <p className="text-2xl font-bold mb-2">
              ₹ {Math.round(totalSaleValue)?.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2 text-red-500">
              <span className="text-gray-500">
                {leadsFetchedData?.length} Units
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
            <h3 className="text-gray-600 mb-2">Recieved</h3>
            <p className="text-2xl font-bold mb-2">
              ₹ {Math.round(totalReceived)?.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2 text-red-500">
              <span className="text-gray-500">
                {leadsFetchedData?.length} Units
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
            <h3 className="text-gray-600 mb-2">Balance</h3>
            <p className="text-2xl font-bold mb-2">
              ₹ {Math.round(selTotalBalance)?.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2 text-red-500">
              <span className="text-gray-500">
                {leadsFetchedData?.length} Units
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CRMCollectionReportKPI
