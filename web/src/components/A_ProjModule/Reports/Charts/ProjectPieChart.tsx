import React from 'react'
import { PieChart, Pie, Tooltip, Cell } from 'recharts'

const data = [
  { name: 'Desktop', value: 20 },
  { name: 'Mobile', value: 30 },
  { name: 'Others', value: 40 },
]

const COLORS = ['#4F46E5', '#E5E7EB', '#67E8F9']

const ProjectPieChart = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label={(entry) => `${entry.name} (${entry.percent}%)`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name, props) => [
          `${value} (${props?.payload?.percent?.toFixed(2)}%)`,
          name,
        ]}
      />
    </PieChart>
  )
}

export default ProjectPieChart
