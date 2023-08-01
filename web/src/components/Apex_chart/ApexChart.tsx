import { Box, Card, CardHeader } from '@mui/material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';


const ApexChart: React.FC = () => {
  const state = {
    series: [
      {
        name: 'TEAM A',
        color:"#48a854",
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: 'TEAM B',
        color:"#e0b775",
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: 'TEAM C',
        color:"#4d8bf7",
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        color:"red"
      },
      stroke: {
        width: [0, 3, 3],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '17%',

          borderRadius: 5,


          borderRadiusApplication: 'right',
        },

      },
      fill: {
        colors: ['#48a854', '#e0b775', '#4d8bf7'],

        opacity: [0.85, 0.15, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        '01/01/2003',
        '02/01/2003',
        '03/01/2003',
        '04/01/2003',
        '05/01/2003',
        '06/01/2003',
        '07/01/2003',
        '08/01/2003',
        '09/01/2003',
        '10/01/2003',
        '11/01/2003',
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
      },  grid: {

        strokeDashArray: 4,
      },
      yaxis: {

        title: {
          // text: 'Points',
        },
        min: 0,
        tickAmount: 4,
        max:80,
      },
      tooltip: {
        shared: true,
        intersect: false,
        // y: {
        //   formatter: function (y: number) {
        //     if (typeof y !== 'undefined') {
        //       return y.toFixed(0) + ' points';
        //     }
        //     return y;
        //   },
        // },
      },
    },
  };

  return (
    <div id="chart" className='font-extrabold	'>
      <Card sx={{  borderRadius:4 }} className='font-extrabold	'>
      <CardHeader title="Website Visits" subheader="(+43%) than last year" className='font-extrabold 	' sx={{fontWeight:300}}/>
      <Box sx={{ p: 3, pb: 1 }}>
      <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
      </Box>

      </Card>
    </div>
  );
};

export default ApexChart;
