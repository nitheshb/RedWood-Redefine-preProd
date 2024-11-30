import React from 'react'
import { useTheme } from '@mui/material'
import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

const CircleProgress = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <section>
      <Chart
        type="radialBar"
        options={{
          colors: [theme.palette.primary.main],
          chart: {
            background: 'transparent',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '40%',
              },
              dataLabels: {
                name: {
                  show: false,
                },
                value: {
                  offsetY: 4,
                  fontSize: '10px',
                  fontWeight: 600,
                  formatter: (value) => `${value}%`,
                  fontFamily: theme.typography.fontFamily,
                },
              },
              track: {
                strokeWidth: '100%',
                background: theme.palette.divider,
              },
            },
          },
          states: {
            normal: {
              filter: {
                type: 'none',
              },
            },
            hover: {
              filter: {
                type: 'none',
              },
            },
            active: {
              filter: {
                type: 'none',
              },
            },
          },
          stroke: {
            curve: 'smooth',
            lineCap: 'round',
          },
          theme: {
            mode: theme.palette.mode,
          },
        }}
        height={98}
        width={90}
        series={[15]}
      />
    </section>
  )
}

export default CircleProgress
