import { Box, Card, CardHeader } from '@mui/material';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
const PieChart = () => {
  const [state, setState] = useState({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  });
  return (
    <div id="chart2">
        <Card>
      <CardHeader title="Current Visits" sx={{ mb: 5 }} />
      <Box sx={{ p: 3, pb: 1,height:380 }}>
      <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />

</Box>
      </Card>

  </div>
  )
}

export default PieChart