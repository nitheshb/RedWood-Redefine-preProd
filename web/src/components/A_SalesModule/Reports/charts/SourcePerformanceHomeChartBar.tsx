import React from 'react';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
// import { ChartContainer } from "src/components/ui/charts"
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from 'src/components/ui/charts'
export default function  SourcePerformanceStackedHbar () {
  // Sample data with 4 sources and their breakdown
  const data = [
    {
      source: "Website Traffic",
      total: 2450,
      segments: [
        { label: "Organic", value: 1200, color: "bg-blue-500" },
        { label: "Paid", value: 800, color: "bg-green-500" },
        { label: "Social", value: 350, color: "bg-purple-500" },
        { label: "Direct", value: 100, color: "bg-orange-500" }
      ]
    },
    {
      source: "Email Campaign",
      total: 1850,
      segments: [
        { label: "Newsletter", value: 750, color: "bg-blue-500" },
        { label: "Promotional", value: 600, color: "bg-green-500" },
        { label: "Transactional", value: 350, color: "bg-purple-500" },
        { label: "Welcome", value: 150, color: "bg-orange-500" }
      ]
    },
    {
      source: "Social Media",
      total: 1320,
      segments: [
        { label: "Facebook", value: 520, color: "bg-blue-500" },
        { label: "Instagram", value: 400, color: "bg-green-500" },
        { label: "Twitter", value: 250, color: "bg-purple-500" },
        { label: "LinkedIn", value: 150, color: "bg-orange-500" }
      ]
    },
    {
      source: "Mobile App",
      total: 980,
      segments: [
        { label: "iOS", value: 450, color: "bg-blue-500" },
        { label: "Android", value: 380, color: "bg-green-500" },
        { label: "Web App", value: 100, color: "bg-purple-500" },
        { label: "Other", value: 50, color: "bg-orange-500" }
      ]
    }
  ];

  const maxTotal = Math.max(...data.map(item => item.total));

  return (
        <Card className="border-0">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Source performance trend</CardTitle>
              <CardDescription>
                Showing total leads for the last 3 months
              </CardDescription>
            </div>
            <div className="flex">
              {['desktop', 'mobile', 'archieve'].map((key, i) => {

                return (
                  <button
                    key={i}

                    className={`relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 `}

                  >
                    <span className="text-xs text-muted-foreground">

                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">

                    </span>
                  </button>
                )
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
    <div className="">
      <div className="space-y-0">
        {data.map((item, index) => {
          // Calculate the overall width percentage based on the maximum total
          const overallWidthPercentage = (item.total / maxTotal) * 100;

          return (
            <div key={index} className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
              {/* Source Name */}
              <div className="w-36 flex-shrink-0">
                <h3 className="font-semibold text-gray-700">{item.source}</h3>
              </div>

              {/* Total Count */}
              <div className="w-20 flex-shrink-0 text-right">
                <span className="font-bold text-gray-800 text-lg">{item.total.toLocaleString()}</span>
              </div>

              {/* Container for the proportional bar */}
              <div className="flex-1 relative">
                {/* Background container showing the full possible width */}
                <div className="h-12 bg-gray-200 rounded-lg relative overflow-hidden">
                  {/* The actual stacked bar with proportional width */}
                  <div
                    className="h-full flex rounded-lg overflow-hidden"
                    style={{ width: `${overallWidthPercentage}%` }}
                  >
                    {item.segments.map((segment, segIndex) => {
                      const segmentWidth = (segment.value / item.total) * 100;
                      return (
                        <div
                          key={segIndex}
                          className={`${segment.color} relative group cursor-pointer transition-all hover:brightness-110 flex items-center justify-center`}
                          style={{ width: `${segmentWidth}%` }}
                        >
                          {/* Show value if segment is wide enough */}
                          {segmentWidth > 15 && (
                            <span className="text-white text-xs font-medium">
                              {segment.value}
                            </span>
                          )}

                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {segment.label}: {segment.value.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Percentage indicator */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 font-medium">
                    {overallWidthPercentage.toFixed(0)}%
                  </div>
                </div>


              </div>
            </div>
          );
        })}
      </div>


      {/* Color Legend */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-3">Segment Colors</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Secondary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600">Tertiary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Other</span>
          </div>
        </div>
      </div>


      {/* new section */}
      <div className="space-y-0">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-l">
            {/* Source Name */}
            <div className="w-32 flex-shrink-0">
              <h3 className="font-semibold text-gray-700 text-sm">{item.source}</h3>
            </div>

            {/* Total Count */}
            <div className="w-16 flex-shrink-0 text-right">
              <span className="font-bold text-gray-800">{item.total.toLocaleString()}</span>
            </div>

            {/* Stacked Bar */}
            <div className="flex-1">
              <div className="relative h-8 bg-gray-200 rounded- overflow-hidden">
                <div className="flex h-full">
                  {item.segments.map((segment, segIndex) => {
                    const width = (segment.value / item.total) * 100;
                    return (
                      <div
                        key={segIndex}
                        className={`${segment.color} relative group cursor-pointer transition-opacity hover:opacity-80`}
                        style={{ width: `${width}%` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {segment.label}: {segment.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>


    </div>
        </CardContent>
        </Card>
  );
};



