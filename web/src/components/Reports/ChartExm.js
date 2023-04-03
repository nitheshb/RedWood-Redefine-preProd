import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AgChartsReact } from 'ag-charts-react';

export default function ChartExample  (props) {
  const [tableData, setTableData] = useState([...props.barData1])

  const [options, setOptions] = useState({
    autoSize: true,
    data: tableData,
    theme: {
      palette: {
        fills: ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921'],
        strokes: ['#4086a4', '#b1a235', '#6c8a2b', '#a03e24', '#af5517'],
      },
      overrides: {
        column: {
          series: {
            strokeWidth: 0,
            highlightStyle: {
              series: {
                strokeWidth: 1,
                dimOpacity: 0.3,
              },
            },
          },
        },
      },
    },
    title: {
      text: props.title,
      fontSize: 14,
    },
    subtitle: {
      text: '',
    },
    series: [...props.seriresData1],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: {
          rotation: 30,
        },
      },
      {
        type: 'number',
        position: 'left',
        label: {
          formatter: (params) => {
            return params.value / 1000 + 'k';
          },
        },
      },
    ],
    legend: {
      position: 'bottom',
    },
    padding: {
      bottom: 40,
    },
  });
  useEffect(() => {
    if(props.barData1.length)
    setOptions({...options, data:[...props.barData1]})
   }, [props.barData1])

  return <AgChartsReact options={options} />;
};

const numFormatter = new Intl.NumberFormat('en-US');
const tooltip = {
  renderer: ({ title, xValue, yValue }) => ({
    title,
    content: `${xValue}: ${numFormatter.format(yValue)}`,
  }),

};
