"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"
// import { ChartContainer } from "src/components/ui/charts"
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "src/components/ui/charts"
import { getLeadTrends } from "src/context/dbQueryFirebase"
import { useAuth } from "src/context/firebase-auth-context"

export const description = "An interactive bar chart"

const chartData1 = [
  { date: "2024-04-01", new: 222, mobile: 150 },
  { date: "2024-04-02", new: 97, mobile: 180 },
  { date: "2024-04-03", new: 167, mobile: 120 },
  { date: "2024-04-04", new: 242, mobile: 260 },
  { date: "2024-04-05", new: 373, mobile: 290 },
  { date: "2024-04-06", new: 301, mobile: 340 },
  { date: "2024-04-07", new: 245, mobile: 180 },
  { date: "2024-04-08", new: 409, mobile: 320 },
  { date: "2024-04-09", new: 59, mobile: 110 },
  { date: "2024-04-10", new: 261, mobile: 190 },
  { date: "2024-04-11", new: 327, mobile: 350 },
  { date: "2024-04-12", new: 292, mobile: 210 },
  { date: "2024-04-13", new: 342, mobile: 380 },
  { date: "2024-04-14", new: 137, mobile: 220 },
  { date: "2024-04-15", new: 120, mobile: 170 },
  { date: "2024-04-16", new: 138, mobile: 190 },
  { date: "2024-04-17", new: 446, mobile: 360 },
  { date: "2024-04-18", new: 364, mobile: 410 },
  { date: "2024-04-19", new: 243, mobile: 180 },
  { date: "2024-04-20", new: 89, mobile: 150 },
  { date: "2024-04-21", new: 137, mobile: 200 },
  { date: "2024-04-22", new: 224, mobile: 170 },
  { date: "2024-04-23", new: 138, mobile: 230 },
  { date: "2024-04-24", new: 387, mobile: 290 },
  { date: "2024-04-25", new: 215, mobile: 250 },
  { date: "2024-04-26", new: 75, mobile: 130 },
  { date: "2024-04-27", new: 383, mobile: 420 },
  { date: "2024-04-28", new: 122, mobile: 180 },
  { date: "2024-04-29", new: 315, mobile: 240 },
  { date: "2024-04-30", new: 454, mobile: 380 },
  { date: "2024-05-01", new: 165, mobile: 220 },
  { date: "2024-05-02", new: 293, mobile: 310 },
  { date: "2024-05-03", new: 247, mobile: 190 },
  { date: "2024-05-04", new: 385, mobile: 420 },
  { date: "2024-05-05", new: 481, mobile: 390 },
  { date: "2024-05-06", new: 498, mobile: 520 },
  { date: "2024-05-07", new: 388, mobile: 300 },
  { date: "2024-05-08", new: 149, mobile: 210 },
  { date: "2024-05-09", new: 227, mobile: 180 },
  { date: "2024-05-10", new: 293, mobile: 330 },
  { date: "2024-05-11", new: 335, mobile: 270 },
  { date: "2024-05-12", new: 197, mobile: 240 },
  { date: "2024-05-13", new: 197, mobile: 160 },
  { date: "2024-05-14", new: 448, mobile: 490 },
  { date: "2024-05-15", new: 473, mobile: 380 },
  { date: "2024-05-16", new: 338, mobile: 400 },
  { date: "2024-05-17", new: 499, mobile: 420 },
  { date: "2024-05-18", new: 315, mobile: 350 },
  { date: "2024-05-19", new: 235, mobile: 180 },
  { date: "2024-05-20", new: 177, mobile: 230 },
  { date: "2024-05-21", new: 82, mobile: 140 },
  { date: "2024-05-22", new: 81, mobile: 120 },
  { date: "2024-05-23", new: 252, mobile: 290 },
  { date: "2024-05-24", new: 294, mobile: 220 },
  { date: "2024-05-25", new: 201, mobile: 250 },
  { date: "2024-05-26", new: 213, mobile: 170 },
  { date: "2024-05-27", new: 420, mobile: 460 },
  { date: "2024-05-28", new: 233, mobile: 190 },
  { date: "2024-05-29", new: 78, mobile: 130 },
  { date: "2024-05-30", new: 340, mobile: 280 },
  { date: "2024-05-31", new: 178, mobile: 230 },
  { date: "2024-06-01", new: 178, mobile: 200 },
  { date: "2024-06-02", new: 470, mobile: 410 },
  { date: "2024-06-03", new: 103, mobile: 160 },
  { date: "2024-06-04", new: 439, mobile: 380 },
  { date: "2024-06-05", new: 88, mobile: 140 },
  { date: "2024-06-06", new: 294, mobile: 250 },
  { date: "2024-06-07", new: 323, mobile: 370 },
  { date: "2024-06-08", new: 385, mobile: 320 },
  { date: "2024-06-09", new: 438, mobile: 480 },
  { date: "2024-06-10", new: 155, mobile: 200 },
  { date: "2024-06-11", new: 92, mobile: 150 },
  { date: "2024-06-12", new: 492, mobile: 420 },
  { date: "2024-06-13", new: 81, mobile: 130 },
  { date: "2024-06-14", new: 426, mobile: 380 },
  { date: "2024-06-15", new: 307, mobile: 350 },
  { date: "2024-06-16", new: 371, mobile: 310 },
  { date: "2024-06-17", new: 475, mobile: 520 },
  { date: "2024-06-18", new: 107, mobile: 170 },
  { date: "2024-06-19", new: 341, mobile: 290 },
  { date: "2024-06-20", new: 408, mobile: 450 },
  { date: "2024-06-21", new: 169, mobile: 210 },
  { date: "2024-06-22", new: 317, mobile: 270 },
  { date: "2024-06-23", new: 480, mobile: 530 },
  { date: "2024-06-24", new: 132, mobile: 180 },
  { date: "2024-06-25", new: 141, mobile: 190 },
  { date: "2024-06-26", new: 434, mobile: 380 },
  { date: "2024-06-27", new: 448, mobile: 490 },
  { date: "2024-06-28", new: 149, mobile: 200 },
  { date: "2025-06-29", new: 103, mobile: 160 },
  { date: "2025-06-30", new: 446, mobile: 400 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  new: {
    label: "Leads",
    color: "#2563EB",
  },
  mobile: {
    label: "Booked",
    color: "#E76E50",
  },
  archieve: {
    label: "Archieve",
    color: "#E76E50",
  },
}

export default function LeadHomeChartBar() {
    const { user } = useAuth()
    const { orgId, access } = user
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("new")

    const [chartData, setActiveChartData] = React.useState<any[]>([])

  const total = React.useMemo(
    () => ({
      new: chartData.reduce((acc, curr) => acc + curr.new, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
      archieve: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )

  React.useEffect(() => {
    getRecords()
  }, [])
const getRecords = async () => {
    let x = await getLeadTrends(orgId, {})
    setActiveChartData(x)
    console.log('reeceived values are', x)
}

  return (
    <Card className="border-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Leads Trend</CardTitle>
          <CardDescription>
            Showing total leads for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["new", "mobile", "archieve"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className={`relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 ${activeChart === chart && 'bg-[#E8F6FF]'}`}
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full border-0"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#94B5ED" />
      <stop offset="100%" stopColor="#AEECF6" />
    </linearGradient>
  </defs>
   <Tooltip
                cursor={false}
                content={<ChartTooltipContent  />}
              />
            <CartesianGrid vertical={false} stroke="#e9e9f4" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            {/* <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            /> */}
            <Bar dataKey={activeChart} fill="url(#colorUv)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
