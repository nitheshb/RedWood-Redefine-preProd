import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label,   PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

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

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"


type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;





const chartData = [
  { browser: "safari", visitors: 1260, fill: "#3b82f680" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: ""
  },
  safari: {
    label: "Safari",
    color: "#3b82f680",
  },
} 

export default function HotColdRadialShape() {
  return (
    <Card className="flex flex-col  border-0">

      <CardContent className="flex-1 pb-0 p-0 border-0 shadow-none">
        <ChartContainer
          config={chartConfig}
          className=" border-0 max-h-[250px] shadow-none"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-[#f1f5f9] last:fill-[#ffffff]"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Hot
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm m">
        <div className="flex items-center gap-2 font-medium leading-none">
          120:80 <TrendingUp className="h-4 w-4" />
        </div>
        <section className="flex flex-row w-full justify-between border-b border-[#F3F2F9] pb-2">
        <div className="leading-none text-muted-foreground">
          Hot
        </div>
        <span className="leading-none text-muted-foreground">
          120
        </span>
        </section>
        <section className="flex flex-row w-full justify-between">
        <div className="leading-none text-muted-foreground">
          Cols
        </div>
        <span className="leading-none text-muted-foreground">
          80
        </span>
        </section>

      </CardFooter>
    </Card>
  )
}

