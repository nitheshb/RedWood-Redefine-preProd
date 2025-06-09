"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Tooltip } from "recharts"

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "src/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "src/components/ui/charts"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "#2463EB" },
  { browser: "safari", visitors: 200, fill: "#BDDCFE" },
  { browser: "firefox", visitors: 287, fill: "#90C6FE" },
  { browser: "edge", visitors: 173, fill: "#3A87F7" },
  { browser: "other", visitors: 190, fill: "#90C6FE" },
]


export default function LeadSummaryPie({leadsData,  showDrillDownFun}) {
  const totalVisitors = React.useMemo(() => {
    if(leadsData.length>0) {
    return leadsData[0]?.count
    return leadsData.reduce((acc, curr) => acc + curr.visitors, 0)
    }
  }, [])

  return (
    <Card className="flex flex-col">
      {/* <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="flex pb-0 flex-row">
        <ChartContainer
          // config={chartConfig}
          className=" aspect-square rounded-0 border-0"
        >
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={leadsData}
              dataKey="count"
              nameKey="stausTitle"
              innerRadius={60}
              strokeWidth={0}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Leads
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* leadsData */}
        <div className="flex flex-col w-full justify-between p-4 py-6">
        {leadsData.map((d, i)=>

        <section className="flex flex-row w-full justify-between border-b border-[#F3F2F9] cursor-pointer" onClick={()=> showDrillDownFun(`Total ${d?.stausTitle}`, d?.data)}>
        <section className="flex flex-row" >
                        <div className={`text-[#1f2937] w-3 h-3 mt-[2px] mx-2 rounded-full `}  style={{ backgroundColor: d?.fill }}></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          {d?.stausTitle}
                        </div>
                      </section> <span>{d?.count}</span>
        </section>
        )}</div>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
