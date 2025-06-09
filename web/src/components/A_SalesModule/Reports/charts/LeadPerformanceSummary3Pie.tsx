import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

// Custom tooltip with shadcn/ui styling
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="text-sm font-medium text-foreground">
          {data.name}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {data.value}% completion
      </div>
    </div>
  );
};

// Custom legend that looks like shadcn/ui components
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-col gap-2 mt- absolute bottom-0 left-0 right-0">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-foreground">{entry.value}</span>
          <span className="text-xs text-muted-foreground ml-auto">{entry.completion}%</span>
        </div>
      ))}
    </div>
  );
};

export default function LeadSummary3Pie({pieVals}) {
  // Data for each semi-circle
  const [data, setData] = useState([
    // Inner semi-circle
    [
      { name: "Opportunity to Bookings", value: 75, color: "#BDDCFE" },
      { name: "Project A Remaining", value: 25, color: "#e2e8f0" }
    ],
    // Middle semi-circle
    [
      { name: "Project B", value: 60, color: "#90C6FE" },
      { name: "Project B Remaining", value: 40, color: "#e2e8f0" }
    ],
    // Outer semi-circle
    [
      { name: "Project C", value: 90, color: "#2463EB" },
      { name: "Project C Remaining", value: 10, color: "#e2e8f0" }
    ]
  ])
  useEffect(() => {
    setData([
      // Inner semi-circle
      [
        { name: "Opportunity to Bookings", value: pieVals?.val3, color: "#BDDCFE" },
        { name: "Dead & Opporturnity", value: 100-pieVals?.val3, color: "#e2e8f0" }
      ],
      // Middle semi-circle
      [
        { name: "Project B", value: pieVals?.val2, color: "#90C6FE" },
        { name: "Project B Remaining", value: 100-pieVals?.val2, color: "#e2e8f0" }
      ],
      // Outer semi-circle
      [
        { name: "New lead to Opportunity", value: pieVals?.val1, color: "#2463EB" },
        { name: "Project C Remaining", value: 100-pieVals?.val1, color: "#e2e8f0" }
      ]
    ])
  }, [pieVals])

  const data1 = [
    // Inner semi-circle
    [
      { name: "Opportunity to Bookings", value: 75, color: "#BDDCFE" },
      { name: "Project A Remaining", value: 25, color: "#e2e8f0" }
    ],
    // Middle semi-circle
    [
      { name: "Project B", value: 60, color: "#90C6FE" },
      { name: "Project B Remaining", value: 40, color: "#e2e8f0" }
    ],
    // Outer semi-circle
    [
      { name: "Project C", value: 90, color: "#2463EB" },
      { name: "Project C Remaining", value: 10, color: "#e2e8f0" }
    ]
  ];

  // Only display active segments in legend (not the "remaining" parts)
  const legendData = [
    { name: "New lead to Opportunity", value: "New lead to Opportunity", color: "#10b981", completion: pieVals?.val1 },
    { name: "New lead to Junk", value: "New lead to Junk", color: "#8b5cf6", completion: pieVals?.val2 },
    { name: "Opportunity to Bookings", value: "Opportunity to Bookings", color: "#0ea5e9", completion: pieVals?.val3 },
  ];

  // Calculate radii for each semi-circle
  const innerRadius1 = "30%";
  const outerRadius1 = "45%";

  const innerRadius2 = "50%";
  const outerRadius2 = "65%";

  const innerRadius3 = "70%";
  const outerRadius3 = "85%";

  return (
    <div className="w-full rounded-lg border bg-card p-6 shadow-sm">
      <div className="relative w-full" style={{ height: "300px" }}>
      <div className="relative h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart             margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            {/* Inner semi-circle */}

            <Pie
              data={data[0]}
              dataKey="value"
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={innerRadius1}
              outerRadius={outerRadius1}
              paddingAngle={0}
              nameKey="name"
            >
              {data[0].map((entry, index) => (
                <Cell
                  key={`cell-inner-${index}`}
                  fill={entry.color}
                  stroke="none"
                />
              ))}
            </Pie>

            {/* Middle semi-circle */}
            <Pie
              data={data[1]}
              dataKey="value"
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={innerRadius2}
              outerRadius={outerRadius2}
              paddingAngle={0}
              nameKey="name"
            >
              {data[1].map((entry, index) => (
                <Cell
                  key={`cell-middle-${index}`}
                  fill={entry.color}
                  stroke="none"
                />
              ))}
            </Pie>

            {/* Outer semi-circle */}
            <Pie
              data={data[2]}
              dataKey="value"
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={innerRadius3}
              outerRadius={outerRadius3}
              paddingAngle={0}
              nameKey="name"
            >
              {data[2].map((entry, index) => (
                <Cell
                  key={`cell-outer-${index}`}
                  fill={entry.color}
                  stroke="none"
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Value labels removed as requested */}
      </div>

      <CustomLegend payload={legendData} />
    </div>
    </div>
  );
}