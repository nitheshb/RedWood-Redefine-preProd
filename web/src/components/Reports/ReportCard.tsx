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
            <button onClick={() => props.chartOpenfn()}>
              {!props.chartOpen ? 'Charts' : 'Table'}{' '}
            </button>
            {props.hasOwnProperty('employeeDataDropDown')
              ? props.employeeDataDropDown()
              : null}
            {props.sourceDropDown()}
            {props.DateComponent()}
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
