import React, { useEffect, useState } from 'react'

import {
  getBookedUnitsByProject,
  getUnitsAgreeByProject,
  gretProjectionSum,
  steamCollectionsReport,
  steamUsersListByDept,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  getLastSevenMonths,
  getLastSevenWeeks,
  getLastSixYears,
  getNextThreeMonths,
} from 'src/util/dateConverter'

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
import PeriodSelctorWizard from './PeriodSelcectorWizard'
import { CustomTooltip } from './collectionReport'
const timeSeriesData = [
  { time: 'Week-1', value: 5, prevValue: 5 },
  { time: 'Week-2', value: 5, prevValue: 5 },
  { time: 'Week-3', value: 20, prevValue: 5 },
  { time: 'Week-4', value: 5, prevValue: 5 },
  { time: 'Week-5', value: 5, prevValue: 5 },
  { time: 'Week-6', value: 90, prevValue: 30 },
  { time: 'Week-7', value: 5, prevValue: 5 },
]
const CRMCollectionTotalWizard = ({ projects }) => {
  const { user } = useAuth()
  const { orgId } = user

  const [timeLineTC, setTimeLineTC] = useState('W')
  const [totalCollecionR, setTotalCollecionR] = useState([])
  const [load, setLoad] = useState(false)

  useEffect(() => {
    console.log('matched value i', timeLineTC)
    setLoad(false)
    if (timeLineTC === 'W') {
      console.log('matched value i')
      let x = getLastSevenWeeks()
      console.log('month name  is', x)
      weekFun('W', x)
      // console.log('week data is ', x)
    } else if (timeLineTC === 'M') {
      let x = getLastSevenMonths()
      weekFun('M', x)
      return
      console.log('month name  is', x)
      x.map((data, i) => {
        data.time = data.name
        data.value = timeSeriesData[i]?.value || 0
        data.prevValue = timeSeriesData[i]?.prevValue || 0
        return data
      })
      setTotalCollecionR(x)
      setLoad(true)
    } else if (timeLineTC === 'Y') {
      let x = getLastSixYears()
      weekFun('Y', x)
      return
      console.log('month name  is', x)
      x.map((data, i) => {
        data.time = data.year
        data.value = timeSeriesData[i]?.value || 0
        data.prevValue = timeSeriesData[i]?.prevValue || 0
        return data
      })
      setTotalCollecionR(x)
      setLoad(true)
    }
  }, [timeLineTC])
  const weekFun = async (datePayload, x) => {
    console.log('matched value i', datePayload)

    const projectMonthArray = []

    setLoad(false)
    const promises = x.map(async (data, i) => {
      let z = {}
      data.time = data.name
      const unsubscribe = await steamCollectionsReport(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })
          await console.log('matched value i', i, data, usersListA)

          const value = usersListA.length > 0 ? usersListA[0]?.received : 0
          z = { ...data, value, prevValue: value * 0.9 }
          projectMonthArray.push(z)
          setTotalCollecionR(projectMonthArray)
          await setLoad(i == x.length - 1 ? true : false)
          await console.log('matched value i vvvv', projectMonthArray)
          return z
          await console.log('my Array data is set it')
        },
        {
          type: timeLineTC,
          ...data,
        },
        (error) => {}
      )
      return z
      return await getCollectionsReport(data)
    })
  }
  const getCollectionsReport = async (datePayload) => {
    const { access, uid } = user

    const unsubscribe = await steamCollectionsReport(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        await console.log('matched value i', usersListA)

        return usersListA.length > 0 ? usersListA[0] : []
        await console.log('my Array data is set it')
      },
      {
        weekNumber: datePayload?.weekNumber,
        year: datePayload?.year,
      },
      (error) => {}
    )
    await console.log('matched value i', unsubscribe)
    return await unsubscribe

    // await console.log('leadsData', leadsData)
  }
  return (
    <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
      <section className="flex flex-row justify-between">
        <div className="pt-6 px-4">
          <h2 className="text-[#000000] text-[19px] ml-4">Total Collected</h2>
          <div className="flex items-center gap-3 mt-4 mb-4 ml-4">
            <span className="text-[30px] text-[#000000] font-semibold">
              &#8377;{' '}
              {totalCollecionR
                ?.reduce((a, b) => a + b.value, 0)
                ?.toLocaleString('en-US')}
            </span>
            <div className="flex items-center text-[#00A236]">
              <TrendingUp className="w-5 h-5 mx-3" />
              <span className="text-[18px]">23%</span>
            </div>
          </div>
        </div>

        <PeriodSelctorWizard
          timeLine={timeLineTC}
          setTimeLine={setTimeLineTC}
        />
      </section>
      {load && (
        <div className="h-96 px-4 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={totalCollecionR}
              margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#CCCCCC" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                stroke="#3D3D3D"
                tick={{ dy: 10 }}
                interval={0}
              />
              <YAxis axisLine={false} tickLine={false} stroke="#3D3D3D" />

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
      )}
    </div>
  )
}

export default CRMCollectionTotalWizard
