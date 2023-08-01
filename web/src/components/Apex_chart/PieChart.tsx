import { Box, Card, CardHeader } from '@mui/material';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';


const PieChart:React.FC = () => {
  const [state, setState] = useState({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: 280,
        type: 'pie',
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: false,
        },
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
         legend: {
          show: false,
          showForSingleSeries: false,
          showForNullSeries: true,
          showForZeroSeries: true,
          position: 'bottom',
          horizontalAlign: 'center',
          floating: true,
          fontSize: '19px',
          fontFamily: 'Helvetica, Arial',
          fontWeight: 200,
          formatter: undefined,
          inverseOrder: true,
          width: undefined,
          height: undefined,
          tooltipHoverFormatter: undefined,
          customLegendItems: [],
          offsetX: 0,
          offsetY: 0,
      },dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex] + "%";
        },

      }
      }
    }]
    }
  });
  return (
    <div id="chart2">
        <Card  sx={{  borderRadius:4 }} >
      <CardHeader title="Current Visits" sx={{ mb: 5 }} />
      <Box sx={{ p: 3, pb: 1,height:380 }}>
      <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />

</Box>
      </Card>

  </div>
  )
}

export default PieChart