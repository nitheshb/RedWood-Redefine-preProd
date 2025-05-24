import * as React from 'react'

import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart, Tooltip } from 'recharts'

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from 'src/components/ui/charts'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]
type ChartConfig = Record<
  string,
  {
    label: string
    color: string
  }
>
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563EB',
  },
  mobile: {
    label: 'Mobile',
    color: '#60A8FB',
  },
}

export default function LeadStagePerformanceOverSalesTeam() {
  return (
    <Card className="border-0">
      <CardContent className="border-0">
        <ChartContainer config={chartConfig} className="border-0">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="#e9e9f4"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="#2563EB" radius={4} />
            <Bar dataKey="mobile" fill="#60A8FB" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
