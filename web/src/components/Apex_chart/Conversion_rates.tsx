import { Box, Card, CardHeader } from '@mui/material'
import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const Conversion_rates = () => {
  const [state, setState] = useState({
    series: [
      {
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          barHeight: '30%',
          borderRadius: 5,
          borderRadiusApplication: 'right',
          horizontal: true,
        },
      },
      fill: {
        colors: ['#48a854'],

        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      grid: {

        strokeDashArray: 4,
      }, stroke: {
        width: 0,
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          'South Korea',
          'Canada',
          'United Kingdom',
          'Netherlands',
          'Italy',
          'France',
          'Japan',
          'United States',
          'China',
          'Germany',
        ],
      },
    },
  })
  return (
    <div id="chart3">
       <Card sx={{  borderRadius:4 }}>
      <CardHeader title="Conversion Rates" subheader="(+43%) than last year" />

      <Box sx={{ mx: 3 }}>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
      </Box>
    </Card>
    </div>
  )
}

export default Conversion_rates
