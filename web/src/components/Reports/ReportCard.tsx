import React, {useState, useEffect} from 'react'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
import ChartBar from './ChartExm'
import PieChart from './PieChart'
import LineChart from './LineChart'

const ReportCard = (props) => {
  const [formatLineData, setLineData] = useState([]);
  const [lineChartFilterBtn, setLineChartFilterBtn] = useState('total')
  const formattedLineChart = (data, value = 'total') => {
    console.log(data, 'formattedLineChart')
    if (data.length && value === 'total') {
      return data.map((item) => {
        return { name: item?.name, total: item?.total }
      })
    }if (data.length && value === 'inprogress') {
      return data.map((item) => {
        return { name: item?.name, total: item?.inprogress }
      })
    }if (data.length && value === 'archieve') {
      return data.map((item) => {
        return { name: item?.name, total: item?.archieve }
      })
    }
    return []
  }
  useEffect(() => {
   const arr = formattedLineChart(props.lineChartData, lineChartFilterBtn)
   setLineData([...arr])
  }, [props.lineChartData])
  const changeLineFilterData = (value)=>{
    setLineChartFilterBtn(value);
    const arr = formattedLineChart(props.lineChartData, value);
    setLineData([...arr])
  }
  return (
    <div style={{ display: 'flex' }} className={'dragMe'}>
      <div
        className=" flex flex-col overscroll-x-scroll p-10 max-w-[100%]"
        style={{ width: ' 100%' }}
      >
        <div
          className="flex m-1 justify-between"
          style={{
            position: 'sticky',
            top: '0px',
            background: 'white',
            zIndex: '1',
            paddingBottom: '10px',
            width: '100%',
          }}
        >
          <div className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 ml-1 mt-4 ">
            <div className="text-md font-bold leading-none">{props.title}</div>
          </div>

          <div
            className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 ml-1 mt-4"
            style={{ gap: '50px' }}
          >
             <div
                                      style={{
                                        backgroundColor: "#e8e8e9",
                                        padding: "2px",
                                        borderRadius: 8,
                                        // boxShadow: "0 0 5px #b7b3b3",
                                       width:"100px",
                                       display:"flex"
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "48%",
                                          display: "flex",
                                          marginLeft: "4%",
                                          minHeight: 23,
                                          cursor: "pointer",
                                          borderRadius: 8,
                                          textAlign: "center",
                                          paddingTop: '3px',
                                          backgroundColor: !props.chartOpen
                                            ? "#fff"
                                            : "transparent",
                                          boxShadow: !props.chartOpen
                                            ? "#898686 0px 0px 5px"
                                            : "none",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        onClick={() => props.chartOpenfn()}
                                      >
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
</svg>
                                      </div>
             <div
                                        style={{
                                          width: "48%",
                                          display: "flex",
                                          minHeight: 23,
                                          cursor: "pointer",
                                          borderRadius: 8,
                                          textAlign: "center",
                                          paddingTop: 6,
                                          backgroundColor: props.chartOpen
                                            ? "#fff"
                                            : "transparent",
                                          boxShadow: props.chartOpen
                                            ? "#898686 0px 0px 5px"
                                            : "none",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        onClick={() => props.chartOpenfn()}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
</svg>
                                      </div>

                                    </div>
<>
            {props.hasOwnProperty('employeeDataDropDown')
              ? props.employeeDataDropDown()
              : null}
            {props.sourceDropDown()}
            {props.DateComponent()}
</>
          </div>
        </div>
        <div style={{ overflowX: 'scroll' }}>
          {props.chartOpen ? (
            <div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  <ChartBar
                    barData1={props.barData1}
                    seriresData1={props.seriresData1}
                    title={props.title}
                  />
                </div>
                <div style={{ width: '50%' }}>
                  <PieChart data={props.pieChartdata} title={props.title}/>
                </div>
              </div>
              <div style={{display:"flex"}}>
              <LineChart data={formatLineData} title={props.title}/>{' '}
              <div  style={{display:"flex", flexDirection:'column', gap:"20px"}}>
                <button style={lineChartFilterBtn === 'total' ? {background:"rgb(69, 186, 102)", padding:"4px", borderRadius:"4px", color:'white'} : {background:"rgb(223, 223, 223)", padding:"4px", borderRadius:"4px", }} onClick={()=> changeLineFilterData('total')}>Total</button>
                <button style={lineChartFilterBtn === 'inprogress' ? {background:"rgb(69, 186, 102)", padding:"4px", borderRadius:"4px", color:'white'} : {background:"rgb(223, 223, 223)", padding:"4px", borderRadius:"4px", }} onClick={()=> changeLineFilterData('inprogress')}>InProgess</button>
                <button style={lineChartFilterBtn === 'archieve' ? {background:"rgb(69, 186, 102)", padding:"4px", borderRadius:"4px", color:'white'} : {background:"rgb(223, 223, 223)", padding:"4px", borderRadius:"4px", }} onClick={()=> changeLineFilterData('archieve')}>Archieve</button>
              </div>
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ background: 'rgb(229,229,229)' }}>
                  {props.headers.map((d, i) => {
                    return (
                      <th
                        style={{ padding: '10px', fontWeight: 'bold' }}
                        key={i}
                        className={`text-sm font-medium text-gray-900 px-6 py-2 ${
                          ['Source'].includes(d.label) ? 'text-left' : ''
                        }`}
                        style={{
                          display: props.viewSourceStats1A.includes(d.id)
                            ? ''
                            : 'none',
                          color:
                            ['inprogress'].includes(d.id) &&
                            props.showInproFSource
                              ? 'blue'
                              : ['archieve'].includes(d.id) &&
                                props.showArchiFSource
                              ? 'blue'
                              : 'rgb(146,146,146)',
                          border: '1px solid rgb(223,223,223)',
                        }}
                      >
                        <div
                          style={{ display: 'flex' }}
                          onClick={() => {
                            if (['inprogress', 'archieve'].includes(d.id))
                              props.showColumnsSourceFun(d.id)
                          }}
                        >
                          {d.label}
                          {d.id === 'inprogress' && !props.showInproFSource && (
                            <ChevronDoubleRightIcon
                              className="w-4 h-5 inline"
                              aria-hidden="true"
                            />
                          )}
                          {d.id === 'inprogress' && props.showInproFSource && (
                            <ChevronDoubleLeftIcon
                              className="w-4 h-5 inline"
                              aria-hidden="true"
                            />
                          )}
                          {d.id === 'archieve' && !props.showArchiFSource && (
                            <ChevronDoubleRightIcon
                              className="w-4 h-5 inline"
                              aria-hidden="true"
                            />
                          )}
                          {d.id === 'archieve' && props.showArchiFSource && (
                            <ChevronDoubleLeftIcon
                              className="w-4 h-5 inline"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {props.data.map((data, i) => {
                  return (
                    <tr
                      key={i}
                      className={` ${
                        i % 2 === 0 ? 'bg-white border-blue-200' : 'bg-gray-100'
                      }`}
                    >
                      <td
                        className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left"
                        style={{ border: '1px solid rgb(231,231,231)' }}
                      >
                        <div className="font-bold">{data?.label}</div>
                        <div
                          style={{ color: '#94A4C4', fontSize: '12px' }}
                        >{`${data?.Total?.length} Deals (${data.percetage})%`}</div>
                      </td>
                      <td style={{ border: '1px solid rgb(231,231,231)' }}>
                        <div style={{ width: '220px', marginLeft: '8px' }}>
                          {/* <div
                          className={`height-[30px]  opacity-100  rounded-lg `}
                          style={{
                            width: `${data.percetage}%`,
                            background:
                              'linear-gradient(to left, #4cb8c4, #3cd3ad)',
                          }}
                        >
                          <span className="pt-1 leading-normal text-red-900">
                            {`${data.percetage}%`}
                          </span>
                        </div> */}
                          <div
                            style={{
                              position: 'relative',
                              width: '210px',
                              height: '30px',
                              background: '#DFDFDF',
                              borderRadius: '5px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${data.percetage}%`,
                                height: '100%',
                                background: '#0078D4',
                                transition: 'all 0.2s',
                              }}
                            ></div>
                            <span
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '15px',
                                transform: 'translateY(-50%)',
                                font: 'bold 14px Quicksand, sans-serif',
                                color: '#ffffff',
                              }}
                            >
                              {data.percetage} %
                            </span>
                          </div>
                        </div>
                      </td>
                      <td
                        className="text-sm text-gray-900  px-6 py-2 font-bold text-center whitespace-nowrap"
                        style={{ border: '1px solid rgb(231,231,231)' }}
                      >
                        {data?.Total?.length}
                      </td>
                      <td
                        className="text-sm text-gray-900  px-6 py-2 font-bold text-center whitespace-nowrap"
                        style={{ border: '1px solid rgb(231,231,231)' }}
                      >
                        {data?.inprogress?.length}
                      </td>
                      {props.showInproFSource && (
                        <>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.new?.length}
                          </td>
                          <td
                            className="text-sm text-gray-900 font-light px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.followup?.length}
                          </td>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.visitfixed?.length}
                          </td>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.visitdone?.length}
                          </td>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.negotiation?.length}
                          </td>
                        </>
                      )}
                      <td
                        className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                        style={{ border: '1px solid rgb(231,231,231)' }}
                      >
                        {data?.booked?.length}
                      </td>
                      {props.showArchiFSource && (
                        <>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center  whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.notinterested?.length}
                          </td>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.dead?.length}
                          </td>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.blocked?.length}
                          </td>
                          <td
                            className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                            style={{ border: '1px solid rgb(231,231,231)' }}
                          >
                            {data?.junk?.length}
                          </td>
                        </>
                      )}
                      <td
                        className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                        style={{ border: '1px solid rgb(231,231,231)' }}
                      >
                        {data?.archieve?.length}
                      </td>
                      <td
                        className="text-sm text-gray-900 font-bold px-6 py-2 text-center whitespace-nowrap"
                        style={{ border: '1px solid rgb(231,231,231)' }}
                      >
                        {data?.others?.length}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
export default React.memo(ReportCard)
