import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AgChartsReact } from 'ag-charts-react';

const ChartExample = (props) => {
  const [options, setOptions] = useState({
    autoSize: true,
    title: {
      text: props.title,
    },
    subtitle: {
      text: '',
    },
    data: [],
    series: [
      {
        xKey: 'name',
        yKey: 'total',
      },
    ],
  });
  console.log(props.data,'data')
  useEffect(() => {
    if(props.data.length){
    setOptions({...options, data:[...props.data]})
    }
   }, [props.data])
  return <div style={{width:"92%"}}><AgChartsReact options={options} /> </div>;
};

export default React.memo(ChartExample)
