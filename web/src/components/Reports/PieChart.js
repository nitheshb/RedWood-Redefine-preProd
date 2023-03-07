import React, { useState, useEffect } from 'react';
import { AgChartsReact } from 'ag-charts-react';

const ChartExample = (props) =>{
  const [total, setTotal] = useState(0)
  const [options, setOptions] = useState({
    autoSize: true,
    data:[],
    title: {
      text: props.title,
      fontSize: 18,
    },
    subtitle: {
      text: '',
    },
    series: [
      {
        type: 'pie',
        calloutLabelKey: 'type',
        fillOpacity: 0.9,
        strokeWidth: 0,
        angleKey: 'value',
        sectorLabelKey: 'value',
        calloutLabel: {
          enabled: false,
        },
        sectorLabel: {
          color: 'white',
          fontWeight: 'bold',
          formatter: ({ datum, sectorLabelKey }) => {
            const value = datum[sectorLabelKey];
            return numFormatter.format(value);
          },
        },
        title: {
          text: 'value',
        },
        fills: [
          '#fb7451',
          '#f4b944',
          '#57cc8b',
          '#49afda',
          '#3988dc',
          '#72508c',
          '#b499b5',
          '#b7b5ba',
        ],
        innerRadiusRatio: 0.5,

        highlightStyle: {
          item: {
            fillOpacity: 0,
            stroke: '#535455',
            strokeWidth: 1,
          },
        },
        tooltip: {
          renderer: ({ datum, calloutLabelKey, title, sectorLabelKey }) => {
            return {
              title,
              content: `${datum[calloutLabelKey]}: ${numFormatter.format(
                datum[sectorLabelKey]
              )}`,
            };
          },
        },
      },
    ],
  });
  useEffect(() => {
    if(props.data.length){
    const total1 = props.data.reduce((sum, d) => sum + d['value'], 0);
    console.log(total1,'total1')
    setTotal(total1)
    setOptions({...options, data:[...props.data]})
    }
   }, [props.data])
  return <AgChartsReact options={options} />;
};
export default React.memo(ChartExample)
// const data = [
//   { type: 'House - single occupancy', '2018/19': 15349 },
//   { type: 'Bungalow - single occupancy', '2018/19': 1656 },
//   { type: 'Converted Flat/Maisonette - single occupancy', '2018/19': 2147 },
//   { type: 'Purpose Built Low Rise (1-3) Flats/Maisonettes', '2018/19': 4954 },
//   { type: 'Purpose Built Medium Rise (4-9) Flats', '2018/19': 1887 },
//   { type: 'Purpose Built High Rise (10+) Flats', '2018/19': 820 },
//   { type: 'Dwelling - multiple occupancy', '2018/19': 610 },
//   { type: 'Other dwelling', '2018/19': 2147 },
// ];
const numFormatter = new Intl.NumberFormat('en-US');
// const total = data.reduce((sum, d) => sum + d['value'], 0);

// render(<ChartExample />, document.querySelector('#root'));
