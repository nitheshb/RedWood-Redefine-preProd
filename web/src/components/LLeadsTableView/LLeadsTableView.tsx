// // import { useEffect, useState } from 'react'
// // import { Box as Section, Card, Grid } from '@mui/material'
// // import { useTranslation } from 'react-i18next'
// // import LLeadsTableBody from '../LLeadsTableBody/LLeadsTableBody'
// // import LogSkelton from '../shimmerLoaders/logSkelton'

// // const rowsCounter = (parent, searchKey) => {
// //   return searchKey === 'all'
// //     ? parent
// //     : searchKey === 'archieve_all'
// //     ? parent.filter((item) =>
// //         ['notinterested', 'blocked', 'junk', 'dead'].includes(
// //           item.Status.toLowerCase()
// //         )
// //       )
// //     : parent.filter(
// //         (item) => item?.Status?.toLowerCase() === searchKey.toLowerCase()
// //       )
// // }

// // const LLeadsTableView = ({
// //   setFetchLeadsLoader,
// //   setisImportLeadsOpen,
// //   fetchLeadsLoader,
// //   selUserProfileF,
// //   leadsFetchedData,
// //   leadsTyper,
// //   searchVal,
// // }) => {
// //   const { t } = useTranslation()
// //   const [value, setValue] = useState('all')
// //   const [tableData, setTableData] = useState([])
// //   const [tabHeadFieldsA, settabHeadFieldsA] = useState([])

// //   const [statusSepA, setStatusSepA] = useState([])

// //   const [finalKeyA, setFinalKeyA] = useState([])

// //   useEffect(() => {
// //     const tabHeadFieldsA1 =
// //       leadsTyper === 'inProgress'
// //         ? [
// //             { lab: 'In Progress', val: 'all' },
// //             { lab: 'New', val: 'new' },
// //             { lab: 'Follow Up', val: 'followup' },
// //             { lab: 'Visit Fixed', val: 'visitfixed' },
// //             { lab: 'Negotiation', val: 'negotiation' },
// //             { lab: 'Un Assigned', val: 'unassigned' },
// //             ,
// //           ]
// //         : leadsTyper === 'archieveLeads'
// //         ? archieveTab
// //         : [{ lab: 'Booked', val: 'booked' }]
// //     settabHeadFieldsA(tabHeadFieldsA1)

// //     leadsTyper === 'inProgress'
// //       ? setValue('all')
// //       : leadsTyper === 'archieveLeads'
// //       ? setValue('archieve_all')
// //       : setValue('booked')
// //   }, [])
// //   const [val, setVal] = React.useState('one')

// //   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
// //     setVal(newValue)
// //   }

// //   const archieveTab = [
// //     { lab: 'Archieve', val: 'archieve_all' },
// //     { lab: 'Dead', val: 'dead' },
// //     { lab: 'Not Interested', val: 'notinterested' },
// //     { lab: 'Blocked', val: 'blocked' },
// //     { lab: 'Junk', val: 'junk' },
// //   ]
// //   const [activeAll, setactiveAll] = React.useState<boolean>(true)
// //   const [activeNew, setactiveNew] = React.useState<boolean>(false)
// //   const [activeFollow, setactiveFollow] = React.useState<boolean>(false)
// //   const [activeVisitFixed, setactiveVisitFixed] = React.useState<boolean>(false)
// //   const [activeNeg, setactiveNeg] = React.useState<boolean>(false)
// //   const [activeUn, setactiveUn] = React.useState<boolean>(false)
// //   const [activeArch, setactiveArch] = React.useState<boolean>(true)
// //   const [activeDead, setactiveDead] = React.useState<boolean>(false)
// //   const [activeBlock, setactiveBlock] = React.useState<boolean>(false)
// //   const [activeJunk, setactiveJunk] = React.useState<boolean>(false)
// //   const [activeNotIn, setactiveNotIn] = React.useState<boolean>(false)
// //   const [activeBook, setactiveBook] = React.useState<boolean>(true)
// //   const [newStatusA, setNewStatusA] = useState([])
// //   const [followupA, setfollowupA] = useState([])
// //   const [mySelRows, setmySelRows] = useState([])

// //   const newStatus = []
// //   const followup = []
// //   const all = leadsFetchedData
// //   const visitfixed = []
// //   const visitdone = []
// //   const vistcancel = []
// //   const negotiation = []
// //   const unassigned = []
// //   const others = []
// //   const findCount = (val) => {
// //     if (val === 'new') {
// //       return newStatus.length
// //     } else if (val === 'all') {
// //       return all.length
// //     } else if (val === 'followup') {
// //       return followupA.length
// //     } else if (val === 'visitfixed') {
// //       return visitfixed.length
// //     } else if (val === 'visitdone') {
// //       return visitdone.length
// //     } else if (val === 'negotiation') {
// //       return negotiation.length
// //     } else if (val === 'unassigned') {
// //       return unassigned.length
// //     }
// //   }
// //   const CheckActive = () => {}
// //   useEffect(() => {
// //     // split data as per
// //     console.time('query Fetch Time')
// //     console.timeLog('query Fetch Time')
// //     return
// //     for (let i = 0; i < leadsFetchedData.length; i++) {
// //       // your operations

// //       switch (leadsFetchedData[i].Status.toLowerCase()) {
// //         case 'new':
// //           return newStatus.push(leadsFetchedData[i])
// //         case 'followup':
// //           console.log('loop for followup')
// //           followup.push(leadsFetchedData[i])
// //           return setNewStatusA(followup)
// //         case 'visitfixed':
// //           return visitfixed.push(leadsFetchedData[i])
// //         case 'visitdone':
// //           return visitdone.push(leadsFetchedData[i])
// //         case 'vistcancel':
// //           return vistcancel.push(leadsFetchedData[i])
// //         case 'negotiation':
// //           return negotiation.push(leadsFetchedData[i])
// //         case 'unassigned':
// //           return unassigned.push(leadsFetchedData[i])
// //         default:
// //           return others.push(leadsFetchedData[i])
// //       }
// //     }
// //     return
// //     const leadsHeadA =
// //       leadsTyper === 'inProgress'
// //         ? [
// //             { lab: 'In Progress', val: 'all' },
// //             { lab: 'New', val: 'new' },
// //             { lab: 'Follow Up', val: 'followup' },
// //             { lab: 'Visit Fixed', val: 'visitfixed' },
// //             { lab: 'Visit Done', val: 'visitdone' },
// //             { lab: 'Visit Cancel', val: 'visitcancel' },
// //             { lab: 'Negotiation', val: 'negotiation' },

// //             { lab: 'Un Assigned', val: 'unassigned' },
// //             ,
// //           ]
// //         : leadsTyper === 'archieveLeads'
// //         ? archieveTab
// //         : [{ lab: 'Booked', val: 'booked' }]
// //     const y = {}

// //     const z1 = []
// //     const whole = {
// //       new: [],
// //       followup: [],
// //       all: [],
// //       visitfixed: [],
// //       visitdone: [],
// //       vistcancel: [],
// //       negotiation: [],
// //       unassigned: [],
// //       others: [],
// //     }
// //     const bookedArr = {
// //       booked: [],
// //       all: [],
// //       others: [],
// //     }

// //     const archieveArr = {
// //       archieve_all: [],
// //       all: [],
// //       dead: [],
// //       notinterested: [],
// //       blocked: [],
// //       junk: [],
// //       others: [],
// //     }
// //     if (leadsTyper === 'inProgress') {
// //       console.log('my Array data is delayer z2', new Date())
// //       const z2 = leadsFetchedData
// //         .sort((a, b) => b.Date - a.Date)
// //         .map((fil) => {
// //           const { Status } = fil

// //           if (!Status) {
// //             return
// //           }

// //           const statusLowerCase = Status.toLowerCase()

// //           whole.all.push(fil)

// //           switch (statusLowerCase) {
// //             case 'new':
// //               return whole.new.push(fil)
// //             case 'followup':
// //               return whole.followup.push(fil)
// //             case 'visitfixed':
// //               return whole.visitfixed.push(fil)
// //             case 'visitdone':
// //               return whole.visitdone.push(fil)
// //             case 'vistcancel':
// //               return whole.vistcancel.push(fil)
// //             case 'negotiation':
// //               return whole.negotiation.push(fil)
// //             case 'unassigned':
// //               return whole.unassigned.push(fil)
// //             default:
// //               return whole.others.push(fil)
// //           }
// //         })

// //       console.log('my Array data is delayer z2', z2, z1, whole, new Date())
// //       setStatusSepA([whole])
// //     } else if (leadsTyper === 'archieveLeads') {
// //       const z2 = leadsFetchedData
// //         .sort((a, b) => b.Date - a.Date)
// //         .map((fil) => {
// //           const { Status } = fil

// //           if (!Status) {
// //             return
// //           }

// //           const statusLowerCase = Status.toLowerCase()

// //           archieveArr.archieve_all.push(fil)

// //           switch (statusLowerCase) {
// //             case 'dead':
// //               return archieveArr.dead.push(fil)
// //             case 'notinterested':
// //               return archieveArr.notinterested.push(fil)
// //             case 'blocked':
// //               return archieveArr.blocked.push(fil)
// //             case 'junk':
// //               return archieveArr.junk.push(fil)
// //             default:
// //               return archieveArr.others.push(fil)
// //           }
// //         })

// //       console.log('filter stroke z2', z2, z1, archieveArr)
// //       setStatusSepA([archieveArr])
// //     } else {
// //       const z2 = leadsFetchedData
// //         .sort((a, b) => b.Date - a.Date)
// //         .map((fil) => {
// //           const { Status } = fil

// //           if (!Status) {
// //             return
// //           }

// //           const statusLowerCase = Status.toLowerCase()

// //           bookedArr.all.push(fil)

// //           switch (statusLowerCase) {
// //             case 'booked':
// //               return bookedArr.booked.push(fil)
// //             default:
// //               return bookedArr.others.push(fil)
// //           }
// //         })

// //       console.log('filter stroke z2', z2, z1, bookedArr)
// //       setStatusSepA([bookedArr])
// //     }

// //     console.log('filter stroke', leadsFetchedData, leadsHeadA, statusSepA)
// //     console.timeEnd('query Fetch Time')
// //   }, [leadsFetchedData, tabHeadFieldsA])

// //   const [filLeadsA, setFilLeadsA] = useState([])

// //   useEffect(() => {
// //     switch (value) {
// //       case 'all':
// //         return setFilLeadsA(leadsFetchedData)
// //       case 'followup':
// //         return setFilLeadsA(
// //           leadsFetchedData.filter((dat) => dat?.Status === value)
// //         )
// //       case 'visitfixed':
// //         return setFilLeadsA(
// //           leadsFetchedData.filter((dat) => dat?.Status === value)
// //         )
// //       case 'negotiation':
// //         return setFilLeadsA(
// //           leadsFetchedData.filter((dat) => dat?.Status === value)
// //         )
// //       case 'unassigned':
// //         return setFilLeadsA(
// //           leadsFetchedData.filter((dat) => dat?.Status === value)
// //         )
// //       default:
// //         return setFilLeadsA(
// //           leadsFetchedData.filter((dat) => dat?.Status === value)
// //         )
// //     }
// //   }, [value, leadsFetchedData])
// //   useEffect(() => {}, [leadsFetchedData])
// //   return (
// //     <Section pb={4} pt={2}>
// //       <Card
// //         sx={{
// //           boxShadow: 0,
// //         }}
// //       >
// //         <Grid container>
// //           <Grid item xs={12}>
// //             <div className="mb-1 border-b mx-4  border-[#e7eaee] ">
// //               <ul
// //                 className="flex flex-wrap"
// //                 id="myTab"
// //                 data-tabs-toggle="#myTabContent"
// //                 role="tablist"
// //               >
// //                 {tabHeadFieldsA.map((d, i) => {
// //                   return (
// //                     <ul
// //                       value={value}
// //                       onChange={handleChange}
// //                       textColor="secondary"
// //                       indicatorColor="secondary"
// //                       aria-label="secondary tabs example"
// //                       key={i}
// //                     >
// //                       <li
// //                         key={i}
// //                         className=" flex items-center"
// //                         role="presentation"
// //                       >
// //                         <button
// //                           className={`inline-flex items-center  py-2 text-sm font-medium transition-all border-b-2 ${
// //                             value === d.val
// //                               ? 'border-black text-gray-900 font-medium'
// //                               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// //                           }`}
// //                           type="button"
// //                           role="tab"
// //                           onClick={() => {
// //                             setFetchLeadsLoader(true)
// //                             setValue(d.val)
// //                             setFetchLeadsLoader(false)
// //                             setmySelRows(rowsCounter(leadsFetchedData, d.val))
// //                           }}
// //                         >
// //                           <span
// //                             className={` mr-2  ${
// //                               value === d.val ? 'font-medium' : ''
// //                             }`}
// //                           >
// //                             {d.lab}
// //                           </span>

// //                           <span
// //                             className={`flex items-center justify-center min-w-6 h-6 px-2 text-xs font-medium rounded-full ${
// //                               value === d.val
// //                                 ? 'bg-[#EDE9FE] text-[#0E0A1F]'
// //                                 : 'bg-gray-200 text-gray-600'
// //                             }`}
// //                           >
// //                             {rowsCounter(leadsFetchedData, d.val).length}
// //                           </span>
// //                         </button>

// //                         {i !== tabHeadFieldsA.length - 1 && (
// //                           <div className="w-px h-5 mx-4 bg-gray-200"></div>
// //                         )}
// //                       </li>
// //                     </ul>
// //                   )
// //                 })}
// //               </ul>
// //             </div>

// //             {fetchLeadsLoader &&
// //               [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}
// //             {statusSepA[0]?.[value].length === 0 && (
// //               <div className="flex items-center py-6">
// //                 <span
// //                   className="text-xs text-gray-500"
// //                   style={{
// //                     display: 'block',
// //                     marginLeft: 'auto',
// //                     marginRight: 'auto',
// //                   }}
// //                 >
// //                   No Records
// //                 </span>
// //               </div>
// //             )}

// //             {!fetchLeadsLoader && statusSepA[0]?.[value].length != 0 && (
// //               <LLeadsTableBody
// //                 leadsTyper={leadsTyper}
// //                 fetchLeadsLoader={fetchLeadsLoader}
// //                 selStatus={value}
// //                 rowsParent={statusSepA[0]}
// //                 selUserProfileF={selUserProfileF}
// //                 newArray={statusSepA[0]?.[value]}
// //                 leadsFetchedData={filLeadsA}
// //                 mySelRows={mySelRows}
// //                 searchVal={searchVal}
// //               />
// //             )}
// //           </Grid>
// //         </Grid>
// //       </Card>
// //     </Section>
// //   )
// // }

// // export default LLeadsTableView

// import { useEffect, useState, useRef } from 'react'
// import { Box as Section, Card, Grid } from '@mui/material'
// import { useTranslation } from 'react-i18next'
// import { VariableSizeList as List } from 'react-window'
// import AutoSizer from 'react-virtualized-auto-sizer'
// import LLeadsTableBody from '../LLeadsTableBody/LLeadsTableBody'
// import LogSkelton from '../shimmerLoaders/logSkelton'

// const rowsCounter = (parent, searchKey) => {
//   return searchKey === 'all'
//     ? parent
//     : searchKey === 'archieve_all'
//     ? parent.filter((item) =>
//         ['notinterested', 'blocked', 'junk', 'dead'].includes(
//           item.Status.toLowerCase()
//         )
//       )
//     : parent.filter(
//         (item) => item?.Status?.toLowerCase() === searchKey.toLowerCase()
//       )
// }

// const LLeadsTableView = ({
//   setFetchLeadsLoader,
//   setisImportLeadsOpen,
//   fetchLeadsLoader,
//   selUserProfileF,
//   leadsFetchedData,
//   leadsTyper,
//   searchVal,
// }) => {
//   const { t } = useTranslation()
//   const [value, setValue] = useState('all')
//   const [tableData, setTableData] = useState([])
//   const [tabHeadFieldsA, settabHeadFieldsA] = useState([])
//   const [statusSepA, setStatusSepA] = useState([])
//   const [finalKeyA, setFinalKeyA] = useState([])
//   const listRef = useRef(null)

//   useEffect(() => {
//     const tabHeadFieldsA1 =
//       leadsTyper === 'inProgress'
//         ? [
//             { lab: 'In Progress', val: 'all' },
//             { lab: 'New', val: 'new' },
//             { lab: 'Follow Up', val: 'followup' },
//             { lab: 'Visit Fixed', val: 'visitfixed' },
//             { lab: 'Negotiation', val: 'negotiation' },
//             { lab: 'Un Assigned', val: 'unassigned' },
//           ]
//         : leadsTyper === 'archieveLeads'
//         ? archieveTab
//         : [{ lab: 'Booked', val: 'booked' }]
//     settabHeadFieldsA(tabHeadFieldsA1)

//     leadsTyper === 'inProgress'
//       ? setValue('all')
//       : leadsTyper === 'archieveLeads'
//       ? setValue('archieve_all')
//       : setValue('booked')
//   }, [])
//   const [val, setVal] = useState('one')

//   const handleChange = (event, newValue) => {
//     setVal(newValue)
//   }

//   const archieveTab = [
//     { lab: 'Archieve', val: 'archieve_all' },
//     { lab: 'Dead', val: 'dead' },
//     { lab: 'Not Interested', val: 'notinterested' },
//     { lab: 'Blocked', val: 'blocked' },
//     { lab: 'Junk', val: 'junk' },
//   ]
//   const [activeAll, setactiveAll] = useState(true)
//   const [activeNew, setactiveNew] = useState(false)
//   const [activeFollow, setactiveFollow] = useState(false)
//   const [activeVisitFixed, setactiveVisitFixed] = useState(false)
//   const [activeNeg, setactiveNeg] = useState(false)
//   const [activeUn, setactiveUn] = useState(false)
//   const [activeArch, setactiveArch] = useState(true)
//   const [activeDead, setactiveDead] = useState(false)
//   const [activeBlock, setactiveBlock] = useState(false)
//   const [activeJunk, setactiveJunk] = useState(false)
//   const [activeNotIn, setactiveNotIn] = useState(false)
//   const [activeBook, setactiveBook] = useState(true)
//   const [newStatusA, setNewStatusA] = useState([])
//   const [followupA, setfollowupA] = useState([])
//   const [mySelRows, setmySelRows] = useState([])

//   useEffect(() => {
//     // Initialize status separation arrays
//     const whole = {
//       new: [],
//       followup: [],
//       all: [],
//       visitfixed: [],
//       visitdone: [],
//       vistcancel: [],
//       negotiation: [],
//       unassigned: [],
//       others: [],
//     }

//     const bookedArr = {
//       booked: [],
//       all: [],
//       others: [],
//     }

//     const archieveArr = {
//       archieve_all: [],
//       all: [],
//       dead: [],
//       notinterested: [],
//       blocked: [],
//       junk: [],
//       others: [],
//     }

//     if (leadsTyper === 'inProgress') {
//       leadsFetchedData
//         .sort((a, b) => b.Date - a.Date)
//         .forEach((fil) => {
//           const { Status } = fil

//           if (!Status) {
//             return
//           }

//           const statusLowerCase = Status.toLowerCase()

//           whole.all.push(fil)

//           switch (statusLowerCase) {
//             case 'new':
//               whole.new.push(fil)
//               break
//             case 'followup':
//               whole.followup.push(fil)
//               break
//             case 'visitfixed':
//               whole.visitfixed.push(fil)
//               break
//             case 'visitdone':
//               whole.visitdone.push(fil)
//               break
//             case 'vistcancel':
//               whole.vistcancel.push(fil)
//               break
//             case 'negotiation':
//               whole.negotiation.push(fil)
//               break
//             case 'unassigned':
//               whole.unassigned.push(fil)
//               break
//             default:
//               whole.others.push(fil)
//               break
//           }
//         })

//       setStatusSepA([whole])
//       setmySelRows(whole[value] || [])
//     } else if (leadsTyper === 'archieveLeads') {
//       leadsFetchedData
//         .sort((a, b) => b.Date - a.Date)
//         .forEach((fil) => {
//           const { Status } = fil

//           if (!Status) {
//             return
//           }

//           const statusLowerCase = Status.toLowerCase()

//           archieveArr.archieve_all.push(fil)

//           switch (statusLowerCase) {
//             case 'dead':
//               archieveArr.dead.push(fil)
//               break
//             case 'notinterested':
//               archieveArr.notinterested.push(fil)
//               break
//             case 'blocked':
//               archieveArr.blocked.push(fil)
//               break
//             case 'junk':
//               archieveArr.junk.push(fil)
//               break
//             default:
//               archieveArr.others.push(fil)
//               break
//           }
//         })

//       setStatusSepA([archieveArr])
//       setmySelRows(archieveArr[value] || [])
//     } else {
//       leadsFetchedData
//         .sort((a, b) => b.Date - a.Date)
//         .forEach((fil) => {
//           const { Status } = fil

//           if (!Status) {
//             return
//           }

//           const statusLowerCase = Status.toLowerCase()

//           bookedArr.all.push(fil)

//           switch (statusLowerCase) {
//             case 'booked':
//               bookedArr.booked.push(fil)
//               break
//             default:
//               bookedArr.others.push(fil)
//               break
//           }
//         })

//       setStatusSepA([bookedArr])
//       setmySelRows(bookedArr[value] || [])
//     }
//   }, [leadsFetchedData, leadsTyper])

//   const [filLeadsA, setFilLeadsA] = useState([])

//   useEffect(() => {
//     switch (value) {
//       case 'all':
//         setFilLeadsA(leadsFetchedData)
//         break
//       case 'followup':
//         setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//         break
//       case 'visitfixed':
//         setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//         break
//       case 'negotiation':
//         setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//         break
//       case 'unassigned':
//         setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//         break
//       default:
//         setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//         break
//     }

//     if (statusSepA[0]?.[value]) {
//       setmySelRows(statusSepA[0][value])
//     }
//   }, [value, leadsFetchedData, statusSepA])

//   // Virtual row renderer for react-window
//   const Row = ({ index, style }) => {
//     const item = mySelRows[index]

//     return (
//       <div style={style}>
//         <div className="virtualized-row">
//           {/* We'll wrap the existing row content in a virtualized container */}
//           <div className="lead-row-content">
//             {item && (
//               <LLeadsTableBody
//                 leadsTyper={leadsTyper}
//                 fetchLeadsLoader={fetchLeadsLoader}
//                 selStatus={value}
//                 rowsParent={statusSepA[0]}
//                 selUserProfileF={selUserProfileF}
//                 newArray={[item]} // Pass single item as an array
//                 leadsFetchedData={[item]}
//                 mySelRows={[item]}
//                 searchVal={searchVal}
//                 virtualizedRow={true} // Flag to handle virtualized row rendering
//                 index={index}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Calculate row height - you may need to adjust this based on your actual row content
//   const getRowHeight = index => {
//     // Default row height - adjust based on your UI needs
//     return 72; // Typical row height in pixels
//   }

//   return (
//     <Section pb={4} pt={2}>
//       <Card
//         sx={{
//           boxShadow: 0,
//         }}
//       >
//         <Grid container>
//           <Grid item xs={12}>
//             <div className="mb-1 border-b mx-4 border-[#e7eaee]">
//               <ul
//                 className="flex flex-wrap"
//                 id="myTab"
//                 data-tabs-toggle="#myTabContent"
//                 role="tablist"
//               >
//                 {tabHeadFieldsA.map((d, i) => {
//                   return (
//                     <ul
//                       value={value}
//                       onChange={handleChange}
//                       textColor="secondary"
//                       indicatorColor="secondary"
//                       aria-label="secondary tabs example"
//                       key={i}
//                     >
//                       <li
//                         key={i}
//                         className="flex items-center"
//                         role="presentation"
//                       >
//                         <button
//                           className={`inline-flex items-center py-2 text-sm font-medium transition-all border-b-2 ${
//                             value === d.val
//                               ? 'border-black text-gray-900 font-medium'
//                               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                           }`}
//                           type="button"
//                           role="tab"
//                           onClick={() => {
//                             setFetchLeadsLoader(true)
//                             setValue(d.val)
//                             setFetchLeadsLoader(false)
//                             setmySelRows(rowsCounter(leadsFetchedData, d.val))

//                             // Reset list position when changing tabs
//                             if (listRef.current) {
//                               listRef.current.scrollTo(0)
//                             }
//                           }}
//                         >
//                           <span
//                             className={`mr-2 ${
//                               value === d.val ? 'font-medium' : ''
//                             }`}
//                           >
//                             {d.lab}
//                           </span>

//                           <span
//                             className={`flex items-center justify-center min-w-6 h-6 px-2 text-xs font-medium rounded-full ${
//                               value === d.val
//                                 ? 'bg-[#EDE9FE] text-[#0E0A1F]'
//                                 : 'bg-gray-200 text-gray-600'
//                             }`}
//                           >
//                             {rowsCounter(leadsFetchedData, d.val).length}
//                           </span>
//                         </button>

//                         {i !== tabHeadFieldsA.length - 1 && (
//                           <div className="w-px h-5 mx-4 bg-gray-200"></div>
//                         )}
//                       </li>
//                     </ul>
//                   )
//                 })}
//               </ul>
//             </div>

//             {fetchLeadsLoader &&
//               [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}

//             {!fetchLeadsLoader && mySelRows.length === 0 && (
//               <div className="flex items-center py-6">
//                 <span
//                   className="text-xs text-gray-500"
//                   style={{
//                     display: 'block',
//                     marginLeft: 'auto',
//                     marginRight: 'auto',
//                   }}
//                 >
//                   No Records
//                 </span>
//               </div>
//             )}

//             {!fetchLeadsLoader && mySelRows.length > 0 && (
//               <div style={{ height: 'calc(100vh - 250px)', width: '100%' }}>
//                 <AutoSizer>
//                   {({ height, width }) => (
//                     <List
//                       ref={listRef}
//                       height={height}
//                       itemCount={mySelRows.length}
//                       itemSize={getRowHeight}
//                       width={width}
//                     >
//                       {Row}
//                     </List>
//                   )}
//                 </AutoSizer>
//               </div>
//             )}
//           </Grid>
//         </Grid>
//       </Card>
//     </Section>
//   )
// }

// export default LLeadsTableView
// import { useEffect, useState } from 'react'
// import { Box as Section, Card, Grid } from '@mui/material'
// import { useTranslation } from 'react-i18next'
// import LLeadsTableBody from '../LLeadsTableBody/LLeadsTableBody'
// import LogSkelton from '../shimmerLoaders/logSkelton'

// const rowsCounter = (parent, searchKey) => {
//   return searchKey === 'all'
//     ? parent
//     : searchKey === 'archieve_all'
//     ? parent.filter((item) =>
//         ['notinterested', 'blocked', 'junk', 'dead'].includes(
//           item.Status.toLowerCase()
//         )
//       )
//     : parent.filter(
//         (item) => item?.Status?.toLowerCase() === searchKey.toLowerCase()
//       )
// }

// const LLeadsTableView = ({
//   setFetchLeadsLoader,
//   setisImportLeadsOpen,
//   fetchLeadsLoader,
//   selUserProfileF,
//   leadsFetchedData,
//   leadsTyper,
//   searchVal,
// }) => {

//   const { t } = useTranslation()
//   const [value, setValue] = useState('all')
//   const [tableData, setTableData] = useState([])
//   const [tabHeadFieldsA, settabHeadFieldsA] = useState([])

//   const [statusSepA, setStatusSepA] = useState([])

//   const [finalKeyA, setFinalKeyA] = useState([])

//   useEffect(() => {

//     const tabHeadFieldsA1 =
//       leadsTyper === 'inProgress'
//         ? [
//             { lab: 'In Progress', val: 'all' },
//             { lab: 'New', val: 'new' },
//             { lab: 'Follow Up', val: 'followup' },
//             { lab: 'Visit Fixed', val: 'visitfixed' },
//             { lab: 'Negotiation', val: 'negotiation' },
//             { lab: 'Un Assigned', val: 'unassigned' },
// ,
//           ]
//         : leadsTyper === 'archieveLeads'
//         ? archieveTab
//         : [
//             { lab: 'Booked', val: 'booked' },

//           ]
//     settabHeadFieldsA(tabHeadFieldsA1)

//     leadsTyper === 'inProgress'
//       ? setValue('all')
//       : leadsTyper === 'archieveLeads'
//       ? setValue('archieve_all')
//       : setValue('booked')
//   }, [])
//   const [val, setVal] = React.useState('one')

//   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
//     setVal(newValue)
//   }

//   const archieveTab = [
//     { lab: 'Archieve', val: 'archieve_all' },
//     { lab: 'Dead', val: 'dead' },
//     { lab: 'Not Interested', val: 'notinterested' },
//     { lab: 'Blocked', val: 'blocked' },
//     { lab: 'Junk', val: 'junk' },
//   ]
//   const [activeAll, setactiveAll] = React.useState<boolean>(true)
//   const [activeNew, setactiveNew] = React.useState<boolean>(false)
//   const [activeFollow, setactiveFollow] = React.useState<boolean>(false)
//   const [activeVisitFixed, setactiveVisitFixed] = React.useState<boolean>(false)
//   const [activeNeg, setactiveNeg] = React.useState<boolean>(false)
//   const [activeUn, setactiveUn] = React.useState<boolean>(false)
//   const [activeArch, setactiveArch] = React.useState<boolean>(true)
//   const [activeDead, setactiveDead] = React.useState<boolean>(false)
//   const [activeBlock, setactiveBlock] = React.useState<boolean>(false)
//   const [activeJunk, setactiveJunk] = React.useState<boolean>(false)
//   const [activeNotIn, setactiveNotIn] = React.useState<boolean>(false)
//   const [activeBook, setactiveBook] = React.useState<boolean>(true)
//   const [newStatusA, setNewStatusA] = useState([])
//   const [followupA, setfollowupA] = useState([])
//   const [mySelRows, setmySelRows] = useState([])

//   const newStatus = []
//   const followup = []
//   const all = leadsFetchedData
//   const visitfixed = []
//   const visitdone = []
//   const vistcancel = []
//   const negotiation = []
//   const unassigned = []
//   const others = []
//   const findCount = (val) => {
//     if (val === 'new') {
//       return newStatus.length
//     } else if (val === 'all') {
//       return all.length
//     } else if (val === 'followup') {
//       return followupA.length
//     } else if (val === 'visitfixed') {
//       return visitfixed.length
//     } else if (val === 'visitdone') {
//       return visitdone.length
//     } else if (val === 'negotiation') {
//       return negotiation.length
//     } else if (val === 'unassigned') {
//       return unassigned.length
//     }
//   }
//   const CheckActive = () => {}
//   useEffect(() => {
//     // split data as per
//     console.time('query Fetch Time')
//     console.timeLog('query Fetch Time')
//     return
//     for (let i = 0; i < leadsFetchedData.length; i++) {
//       // your operations

//       switch (leadsFetchedData[i].Status.toLowerCase()) {
//         case 'new':
//           return newStatus.push(leadsFetchedData[i])
//         case 'followup':
//           console.log('loop for followup')
//           followup.push(leadsFetchedData[i])
//           return setNewStatusA(followup)
//         case 'visitfixed':
//           return visitfixed.push(leadsFetchedData[i])
//         case 'visitdone':
//           return visitdone.push(leadsFetchedData[i])
//         case 'vistcancel':
//           return vistcancel.push(leadsFetchedData[i])
//         case 'negotiation':
//           return negotiation.push(leadsFetchedData[i])
//         case 'unassigned':
//           return unassigned.push(leadsFetchedData[i])
//         default:
//           return others.push(leadsFetchedData[i])
//       }
//     }
//     return
//     const leadsHeadA =
//       leadsTyper === 'inProgress'
//         ? [
//             { lab: 'In Progress', val: 'all' },
//             { lab: 'New', val: 'new' },
//             { lab: 'Follow Up', val: 'followup' },
//             { lab: 'Visit Fixed', val: 'visitfixed' },
//             { lab: 'Visit Done', val: 'visitdone' },
//             { lab: 'Visit Cancel', val: 'visitcancel' },
//             { lab: 'Negotiation', val: 'negotiation' },

//             { lab: 'Un Assigned', val: 'unassigned' },
// ,
//           ]
//         : leadsTyper === 'archieveLeads'
//         ? archieveTab
//         : [
//             { lab: 'Booked', val: 'booked' },

//           ]
//     const y = {}

//     const z1 = []
//     const whole = {
//       new: [],
//       followup: [],
//       all: [],
//       visitfixed: [],
//       visitdone: [],
//       vistcancel: [],
//       negotiation: [],
//       unassigned: [],
//       others: [],
//     }
//     const bookedArr = {
//       booked: [],
//       all: [],
//       others: [],
//     }

//     const archieveArr = {
//       archieve_all: [],
//       all: [],
//       dead: [],
//       notinterested: [],
//       blocked: [],
//       junk: [],
//       others: [],
//     }
//     if (leadsTyper === 'inProgress') {
//       console.log('my Array data is delayer z2', new Date())
//       const z2 = leadsFetchedData
//         .sort((a, b) => b.Date - a.Date)
//         .map((fil) => {
//           const { Status } = fil

//           if (!Status) {
//             return
//           }

//           const statusLowerCase = Status.toLowerCase()

//           whole.all.push(fil)

//           switch (statusLowerCase) {
//             case 'new':
//               return whole.new.push(fil)
//             case 'followup':
//               return whole.followup.push(fil)
//             case 'visitfixed':
//               return whole.visitfixed.push(fil)
//             case 'visitdone':
//               return whole.visitdone.push(fil)
//             case 'vistcancel':
//               return whole.vistcancel.push(fil)
//             case 'negotiation':
//               return whole.negotiation.push(fil)
//             case 'unassigned':
//               return whole.unassigned.push(fil)
//             default:
//               return whole.others.push(fil)
//           }
//         })

//       console.log('my Array data is delayer z2', z2, z1, whole, new Date())
//       setStatusSepA([whole])
//     } else if (leadsTyper === 'archieveLeads') {
//       const z2 = leadsFetchedData
//         .sort((a, b) => b.Date - a.Date)
//         .map((fil) => {
//           const { Status } = fil

//           if (!Status) {
//             return
//           }

//           const statusLowerCase = Status.toLowerCase()

//           archieveArr.archieve_all.push(fil)

//           switch (statusLowerCase) {
//             case 'dead':
//               return archieveArr.dead.push(fil)
//             case 'notinterested':
//               return archieveArr.notinterested.push(fil)
//             case 'blocked':
//               return archieveArr.blocked.push(fil)
//             case 'junk':
//               return archieveArr.junk.push(fil)
//             default:
//               return archieveArr.others.push(fil)
//           }
//         })

//       console.log('filter stroke z2', z2, z1, archieveArr)
//       setStatusSepA([archieveArr])
//     } else {
//       const z2 = leadsFetchedData
//         .sort((a, b) => b.Date - a.Date)
//         .map((fil) => {
//           const { Status } = fil

//           if (!Status) {
//             return
//           }

//           const statusLowerCase = Status.toLowerCase()

//           bookedArr.all.push(fil)

//           switch (statusLowerCase) {
//             case 'booked':
//               return bookedArr.booked.push(fil)
//             default:
//               return bookedArr.others.push(fil)
//           }
//         })

//       console.log('filter stroke z2', z2, z1, bookedArr)
//       setStatusSepA([bookedArr])
//     }

//     console.log('filter stroke', leadsFetchedData, leadsHeadA, statusSepA)
//     console.timeEnd('query Fetch Time')
//   }, [leadsFetchedData, tabHeadFieldsA])

//   const [filLeadsA, setFilLeadsA] = useState([])

//   useEffect(() => {
//     switch (value) {
//       case 'all':
//         return setFilLeadsA(leadsFetchedData)
//       case 'followup':
//         return setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//       case 'visitfixed':
//         return setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//       case 'negotiation':
//         return setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//       case 'unassigned':
//         return setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//       default:
//         return setFilLeadsA(
//           leadsFetchedData.filter((dat) => dat?.Status === value)
//         )
//     }
//   }, [value, leadsFetchedData])
//   useEffect(() => {}, [leadsFetchedData])
//   return (
//     <Section pb={4} pt={2}>
//       <Card
//         sx={{
//           boxShadow: 0,
//         }}
//       >
//         <Grid container>
//           <Grid item xs={12}>
//             <div className="mb-1 border-b  border-[#e7eaee] ">
//               {/* bg-[#fdb7b7] */}
//               <ul
//                 className="flex flex-wrap  "
//                 id="myTab"
//                 data-tabs-toggle="#myTabContent"
//                 role="tablist"
//               >
//                 {tabHeadFieldsA.map((d, i) => {
//                   return (
//                     <ul
//                       value={value}
//                       onChange={handleChange}
//                       textColor="secondary"
//                       indicatorColor="secondary"
//                       aria-label="secondary tabs example"
//                       key={i}
//                     >
//                       <li key={i} className="mr-2" role="presentation">
//                         {/* <button
//                           className={`inline-block   pl-3  text-sm font-medium text-center text-gray-700 rounded-t-lg border-b-2   hover:text-gray-600 hover:border-black hover:border-b-2 dark:text-gray-400 dark:hover:text-gray-300  ${
//                             value === d.val
//                               ? 'border-black text-gray-900 '
//                               : 'border-transparent'
//                           }`}
//                           type="button"
//                           role="tab"
//                           onClick={() => {
//                             setFetchLeadsLoader(true)
//                             setValue(d.val)
//                             setFetchLeadsLoader(false)
//                             setmySelRows(rowsCounter(leadsFetchedData, d.val))
//                           }}
//                         >
//                           <span
//                             className={`font-PlayFair tems-center  flex  text-sm ${
//                               value === d.val
//                                 ? 'font-semibold text-green-800'
//                                 : ''
//                             }`}
//                           >
//                          <img alt="" src="/temp2.png" className="h-5 w-5 mr-1" />

//                             {' '}
//                             {`${d.lab} `}
//                             <span
//                               className={`  text-zinc-900 border border-gray-400  text-[9px] p-1   rounded-full ml-[4px]  ${
//                                 activeNeg === true
//                                   ? 'bg-gray-950  font-semibold '
//                                   : 'bg-gray-100 font-normal '
//                               } `}
//                             >
//                               {rowsCounter(leadsFetchedData, d.val).length}
//                             </span>
//                           </span>

//                         </button> */}

// <button
//   className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-700 border-b-2 rounded-t-lg transition-all hover:text-gray-600 hover:border-black dark:text-gray-400 dark:hover:text-gray-300 ${
//     value === d.val ? 'border-black text-gray-900' : 'border-transparent'
//   }`}
//   type="button"
//   role="tab"
//   onClick={() => {
//     setFetchLeadsLoader(true);
//     setValue(d.val);
//     setFetchLeadsLoader(false);
//     setmySelRows(rowsCounter(leadsFetchedData, d.val));
//   }}
// >
//   <img alt="" src="/temp2.png" className="h-4 w-4" />
//   <span
//     className={`font-PlayFair text-sm ${
//       value === d.val ? 'font-semibold text-green-800' : ''
//     }`}
//   >
//     {d.lab}
//   </span>
//   {/* <span
//     className={`text-[8px] px-1 py-0.5 rounded-full border ${
//       activeNeg ? 'bg-gray-950 text-white font-semibold' : 'bg-gray-100 text-zinc-900 font-normal'
//     }`}
//   >
//     {rowsCounter(leadsFetchedData, d.val).length}
//   </span> */}
//   <span
//   className={`flex items-center justify-center text-[9px] w-5 h-5 rounded-full border ${
//     activeNeg ? 'bg-gray-950 text-white font-semibold' : 'bg-gray-100 text-zinc-900 font-normal'
//   }`}
// >
//   {rowsCounter(leadsFetchedData, d.val).length}
// </span>

// </button>

//                       </li>
//                     </ul>
//                   )
//                 })}
//               </ul>

//             </div>

//             {fetchLeadsLoader &&
//               [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}
//             {statusSepA[0]?.[value].length === 0 && (
//               <div className="flex items-center py-6">
//                 <span
//                   className="text-xs text-gray-500"
//                   style={{
//                     display: 'block',
//                     marginLeft: 'auto',
//                     marginRight: 'auto',
//                   }}
//                 >
//                   No Records
//                 </span>
//               </div>
//             )}

//             {!fetchLeadsLoader && statusSepA[0]?.[value].length != 0 && (
//               <LLeadsTableBody
//                 leadsTyper={leadsTyper}
//                 fetchLeadsLoader={fetchLeadsLoader}
//                 selStatus={value}
//                 rowsParent={statusSepA[0]}
//                 selUserProfileF={selUserProfileF}
//                 newArray={statusSepA[0]?.[value]}
//                 leadsFetchedData={filLeadsA}
//                 mySelRows={mySelRows}
//                 searchVal={searchVal}
//               />
//             )}
//           </Grid>
//         </Grid>
//       </Card>
//     </Section>
//   )
// }

// export default LLeadsTableView

// import { useEffect, useState } from 'react'
// import { Box as Section, Card, Grid } from '@mui/material'
// import { useTranslation } from 'react-i18next'
// import LLeadsTableBody from '../LLeadsTableBody/LLeadsTableBody'
// import LogSkelton from '../shimmerLoaders/logSkelton'

// const rowsCounter = (parent, searchKey) => {
//   return searchKey === 'all'
//     ? parent
//     : searchKey === 'archieve_all'
//     ? parent.filter((item) =>
//         ['notinterested', 'blocked', 'junk', 'dead'].includes(
//           item.Status.toLowerCase()
//         )
//       )
//     : parent.filter(
//         (item) => item?.Status?.toLowerCase() === searchKey.toLowerCase()
//       )
// }

// const LLeadsTableView = ({
//   setFetchLeadsLoader,
//   setisImportLeadsOpen,
//   fetchLeadsLoader,
//   selUserProfileF,
//   leadsFetchedData,
//   leadsTyper,
//   searchVal,
// }) => {

//   const { t } = useTranslation()
//   const [value, setValue] = useState('all')
//   const [tableData, setTableData] = useState([])
//   const [tabHeadFieldsA, settabHeadFieldsA] = useState([])

//   const [statusSepA, setStatusSepA] = useState([])

//   const [finalKeyA, setFinalKeyA] = useState([])

//   const archieveTab = [
//     { lab: 'Archieve', val: 'archieve_all' },
//     { lab: 'Dead', val: 'dead' },
//     { lab: 'Not Interested', val: 'notinterested' },
//     { lab: 'Blocked', val: 'blocked' },
//     { lab: 'Junk', val: 'junk' },
//   ]

//   useEffect(() => {
//     const tabHeadFieldsA1 =
//       leadsTyper === 'inProgress'
//         ? [
//             { lab: 'In Progress', val: 'all' },
//             { lab: 'New', val: 'new' },
//             { lab: 'Follow Up', val: 'followup' },
//             { lab: 'Visit Fixed', val: 'visitfixed' },
//             { lab: 'Negotiation', val: 'negotiation' },
//             { lab: 'Un Assigned', val: 'unassigned' },
//           ]
//         : leadsTyper === 'archieveLeads'
//         ? archieveTab
//         : [
//             { lab: 'Booked', val: 'booked' },
//           ]
//     settabHeadFieldsA(tabHeadFieldsA1)

//     leadsTyper === 'inProgress'
//       ? setValue('all')
//       : leadsTyper === 'archieveLeads'
//       ? setValue('archieve_all')
//       : setValue('booked')
//   }, [leadsTyper])

//   const [val, setVal] = useState('one')

//   const handleChange = (event, newValue) => {
//     setVal(newValue)
//   }

//   const [activeAll, setactiveAll] = useState(true)
//   const [activeNew, setactiveNew] = useState(false)
//   const [activeFollow, setactiveFollow] = useState(false)
//   const [activeVisitFixed, setactiveVisitFixed] = useState(false)
//   const [activeNeg, setactiveNeg] = useState(false)
//   const [activeUn, setactiveUn] = useState(false)
//   const [activeArch, setactiveArch] = useState(true)
//   const [activeDead, setactiveDead] = useState(false)
//   const [activeBlock, setactiveBlock] = useState(false)
//   const [activeJunk, setactiveJunk] = useState(false)
//   const [activeNotIn, setactiveNotIn] = useState(false)
//   const [activeBook, setactiveBook] = useState(true)
//   const [mySelRows, setmySelRows] = useState([])

//   useEffect(() => {
//     // Initialize data structure for different lead status categories
//     const archieveArr = {
//       archieve_all: [],
//       all: [],
//       dead: [],
//       notinterested: [],
//       blocked: [],
//       junk: [],
//       others: [],
//     }

//     const inProgressArr = {
//       new: [],
//       followup: [],
//       all: [],
//       visitfixed: [],
//       negotiation: [],
//       unassigned: [],
//       others: [],
//     }

//     const bookedArr = {
//       booked: [],
//       all: [],
//       others: [],
//     }

//     // Process data based on lead type
//     if (leadsFetchedData && leadsFetchedData.length > 0) {
//       if (leadsTyper === 'inProgress') {
//         leadsFetchedData
//           .sort((a, b) => b.Date - a.Date)
//           .forEach((fil) => {
//             const { Status } = fil
//             if (!Status) return

//             const statusLowerCase = Status.toLowerCase()
//             inProgressArr.all.push(fil)

//             switch (statusLowerCase) {
//               case 'new':
//                 inProgressArr.new.push(fil)
//                 break
//               case 'followup':
//                 inProgressArr.followup.push(fil)
//                 break
//               case 'visitfixed':
//                 inProgressArr.visitfixed.push(fil)
//                 break
//               case 'negotiation':
//                 inProgressArr.negotiation.push(fil)
//                 break
//               case 'unassigned':
//                 inProgressArr.unassigned.push(fil)
//                 break
//               default:
//                 inProgressArr.others.push(fil)
//             }
//           })
//         setStatusSepA([inProgressArr])
//         setmySelRows(inProgressArr.all)
//       }
//       else if (leadsTyper === 'archieveLeads') {
//         leadsFetchedData
//           .sort((a, b) => b.Date - a.Date)
//           .forEach((fil) => {
//             const { Status } = fil
//             if (!Status) return

//             const statusLowerCase = Status.toLowerCase()

//             // Add to archieve_all if status matches any archive category
//             if (['dead', 'notinterested', 'blocked', 'junk'].includes(statusLowerCase)) {
//               archieveArr.archieve_all.push(fil)

//               switch (statusLowerCase) {
//                 case 'dead':
//                   archieveArr.dead.push(fil)
//                   break
//                 case 'notinterested':
//                   archieveArr.notinterested.push(fil)
//                   break
//                 case 'blocked':
//                   archieveArr.blocked.push(fil)
//                   break
//                 case 'junk':
//                   archieveArr.junk.push(fil)
//                   break
//                 default:
//                   archieveArr.others.push(fil)
//               }
//             }
//           })
//         setStatusSepA([archieveArr])
//         setmySelRows(archieveArr.archieve_all)
//       }
//       else {
//         leadsFetchedData
//           .sort((a, b) => b.Date - a.Date)
//           .forEach((fil) => {
//             const { Status } = fil
//             if (!Status) return

//             const statusLowerCase = Status.toLowerCase()
//             bookedArr.all.push(fil)

//             if (statusLowerCase === 'booked') {
//               bookedArr.booked.push(fil)
//             } else {
//               bookedArr.others.push(fil)
//             }
//           })
//         setStatusSepA([bookedArr])
//         setmySelRows(bookedArr.booked)
//       }
//     } else {
//       // Handle case when no data is available
//       if (leadsTyper === 'inProgress') {
//         setStatusSepA([inProgressArr])
//       } else if (leadsTyper === 'archieveLeads') {
//         setStatusSepA([archieveArr])
//       } else {
//         setStatusSepA([bookedArr])
//       }
//     }
//   }, [leadsFetchedData, leadsTyper])

//   const [filLeadsA, setFilLeadsA] = useState([])

//   useEffect(() => {
//     if (!leadsFetchedData) return

//     if (value === 'all') {
//       setFilLeadsA(leadsFetchedData)
//     } else if (value === 'archieve_all') {
//       setFilLeadsA(
//         leadsFetchedData.filter((dat) =>
//           ['notinterested', 'blocked', 'junk', 'dead'].includes(
//             dat?.Status?.toLowerCase()
//           )
//         )
//       )
//     } else {
//       setFilLeadsA(
//         leadsFetchedData.filter(
//           (dat) => dat?.Status?.toLowerCase() === value.toLowerCase()
//         )
//       )
//     }
//   }, [value, leadsFetchedData])

//   return (
//     <Section pb={4} pt={2}>
//       <Card
//         sx={{
//           boxShadow: 0,
//         }}
//       >
//         <Grid container>
//           <Grid item xs={12}>
//             <div className="mb-1 border-b border-[#e7eaee]">
//               <ul
//                 className="flex flex-wrap"
//                 id="myTab"
//                 data-tabs-toggle="#myTabContent"
//                 role="tablist"
//               >
//                 {tabHeadFieldsA.map((d, i) => {
//                   return (
//                     <li key={i} className="mr-2" role="presentation">
//                       <button
//                         className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-700 border-b-2 rounded-t-lg transition-all hover:text-gray-600 hover:border-black dark:text-gray-400 dark:hover:text-gray-300 ${
//                           value === d.val ? 'border-black text-gray-900' : 'border-transparent'
//                         }`}
//                         type="button"
//                         role="tab"
//                         onClick={() => {
//                           setFetchLeadsLoader(true)
//                           setValue(d.val)
//                           setFetchLeadsLoader(false)
//                           setmySelRows(rowsCounter(leadsFetchedData, d.val))
//                         }}
//                       >
//                         <img alt="" src="/temp2.png" className="h-4 w-4" />
//                         <span
//                           className={`font-PlayFair text-sm ${
//                             value === d.val ? 'font-semibold text-green-800' : ''
//                           }`}
//                         >
//                           {d.lab}
//                         </span>
//                         <span
//                           className={`flex items-center justify-center text-[9px] w-5 h-5 rounded-full border ${
//                             activeNeg ? 'bg-gray-950 text-white font-semibold' : 'bg-gray-100 text-zinc-900 font-normal'
//                           }`}
//                         >
//                           {rowsCounter(leadsFetchedData, d.val).length}
//                         </span>
//                       </button>
//                     </li>
//                   )
//                 })}
//               </ul>
//             </div>

//             {fetchLeadsLoader &&
//               [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}

//             {statusSepA[0] && statusSepA[0][value]?.length === 0 && (
//               <div className="flex items-center py-6">
//                 <span
//                   className="text-xs text-gray-500"
//                   style={{
//                     display: 'block',
//                     marginLeft: 'auto',
//                     marginRight: 'auto',
//                   }}
//                 >
//                   No Records
//                 </span>
//               </div>
//             )}

//             {!fetchLeadsLoader && statusSepA[0] && statusSepA[0][value]?.length > 0 && (
//               <LLeadsTableBody
//                 leadsTyper={leadsTyper}
//                 fetchLeadsLoader={fetchLeadsLoader}
//                 selStatus={value}
//                 rowsParent={statusSepA[0]}
//                 selUserProfileF={selUserProfileF}
//                 newArray={statusSepA[0][value]}
//                 leadsFetchedData={filLeadsA}
//                 mySelRows={mySelRows}
//                 searchVal={searchVal}
//               />
//             )}
//           </Grid>
//         </Grid>
//       </Card>
//     </Section>
//   )
// }

// export default LLeadsTableView

// import { useEffect, useState, useRef } from 'react'
// import { Box as Section, Card, Grid } from '@mui/material'
// import { useTranslation } from 'react-i18next'
// import { VariableSizeList as List } from 'react-window'
// import AutoSizer from 'react-virtualized-auto-sizer'
// import LogSkelton from '../shimmerLoaders/logSkelton'

// // Row counter function from original code
// const rowsCounter = (parent, searchKey) => {
//   return searchKey === 'all'
//     ? parent
//     : searchKey === 'archieve_all'
//     ? parent.filter((item) =>
//         ['notinterested', 'blocked', 'junk', 'dead'].includes(
//           item.Status.toLowerCase()
//         )
//       )
//     : parent.filter(
//         (item) => item?.Status?.toLowerCase() === searchKey.toLowerCase()
//       )
// }

// // Individual row component
// const LeadRow = ({ data, index, style }) => {
//   const { items, searchVal } = data;
//   const item = items[index];

//   // Skip rendering if the item doesn't match search criteria
//   if (searchVal && !JSON.stringify(item).toLowerCase().includes(searchVal.toLowerCase())) {
//     return null;
//   }

//   return (
//     <div className="lead-row" style={style}>
//       <div className="flex border-b border-gray-200 hover:bg-gray-50">
//         <div className="w-16 py-4 pl-4">{index + 1}</div>
//         <div className="w-32 py-4">
//           {new Date(item.Date).toLocaleDateString()}
//         </div>
//         <div className="w-32 py-4">
//           {item.AssignedDate ? new Date(item.AssignedDate).toLocaleDateString() : '-'}
//         </div>
//         <div className="flex-1 py-4">
//           <div>{item.Name || 'N/A'}</div>
//           <div className="text-sm text-gray-500">{item.Phone || 'N/A'}</div>
//         </div>
//         <div className="w-48 py-4">{item.Project || 'N/A'}</div>
//         <div className="w-32 py-4">{item.Source || 'N/A'}</div>
//         <div className="w-32 py-4">
//           <span className={`px-2 py-1 text-xs rounded-full ${
//             item.Status?.toLowerCase() === 'new' ? 'bg-blue-100 text-blue-800' :
//             item.Status?.toLowerCase() === 'visitfixed' ? 'bg-green-100 text-green-800' :
//             'bg-gray-100 text-gray-800'
//           }`}>
//             {item.Status || 'N/A'}
//           </span>
//         </div>
//         <div className="w-32 py-4">
//           {item.LastActivity ? `${item.LastActivity} ago` : 'N/A'}
//         </div>
//         <div className="w-48 py-4">{item.Comments || 'N/A'}</div>
//       </div>
//     </div>
//   );
// };

// // Table header component
// const TableHeader = () => (
//   <div className="flex font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
//     <div className="w-16 py-3 pl-4">S.No</div>
//     <div className="w-32 py-3">Created On</div>
//     <div className="w-32 py-3">Assigned On</div>
//     <div className="flex-1 py-3">Client Details</div>
//     <div className="w-48 py-3">Project</div>
//     <div className="w-32 py-3">Source</div>
//     <div className="w-32 py-3">Status</div>
//     <div className="w-32 py-3">Last Activity</div>
//     <div className="w-48 py-3">Comments</div>
//   </div>
// );

// // Main component
// const VirtualizedLeadsTable = ({
//   setFetchLeadsLoader,
//   setisImportLeadsOpen,
//   fetchLeadsLoader,
//   selUserProfileF,
//   leadsFetchedData,
//   leadsTyper,
//   searchVal,
// }) => {
//   const { t } = useTranslation();
//   const [value, setValue] = useState('all');
//   const [tabHeadFieldsA, settabHeadFieldsA] = useState([]);
//   const [statusSepA, setStatusSepA] = useState([]);
//   const [mySelRows, setmySelRows] = useState([]);
//   const listRef = useRef();

//   // Define tab fields based on lead type
//   useEffect(() => {
//     const archieveTab = [
//       { lab: 'Archieve', val: 'archieve_all' },
//       { lab: 'Dead', val: 'dead' },
//       { lab: 'Not Interested', val: 'notinterested' },
//       { lab: 'Blocked', val: 'blocked' },
//       { lab: 'Junk', val: 'junk' },
//     ];

//     const tabHeadFieldsA1 =
//       leadsTyper === 'inProgress'
//         ? [
//             { lab: 'In Progress', val: 'all' },
//             { lab: 'New', val: 'new' },
//             { lab: 'Follow Up', val: 'followup' },
//             { lab: 'Visit Fixed', val: 'visitfixed' },
//             { lab: 'Negotiation', val: 'negotiation' },
//             { lab: 'Un Assigned', val: 'unassigned' },
//           ]
//         : leadsTyper === 'archieveLeads'
//         ? archieveTab
//         : [
//             { lab: 'Booked', val: 'booked' },
//           ];
//     settabHeadFieldsA(tabHeadFieldsA1);

//     leadsTyper === 'inProgress'
//       ? setValue('all')
//       : leadsTyper === 'archieveLeads'
//       ? setValue('archieve_all')
//       : setValue('booked');
//   }, [leadsTyper]);

//   // Process and organize data based on lead status
//   useEffect(() => {
//     // Initialize data structure for different lead status categories
//     const archieveArr = {
//       archieve_all: [],
//       all: [],
//       dead: [],
//       notinterested: [],
//       blocked: [],
//       junk: [],
//       others: [],
//     };

//     const inProgressArr = {
//       new: [],
//       followup: [],
//       all: [],
//       visitfixed: [],
//       negotiation: [],
//       unassigned: [],
//       others: [],
//     };

//     const bookedArr = {
//       booked: [],
//       all: [],
//       others: [],
//     };

//     // Process data based on lead type
//     if (leadsFetchedData && leadsFetchedData.length > 0) {
//       if (leadsTyper === 'inProgress') {
//         leadsFetchedData
//           .sort((a, b) => b.Date - a.Date)
//           .forEach((fil) => {
//             const { Status } = fil;
//             if (!Status) return;

//             const statusLowerCase = Status.toLowerCase();
//             inProgressArr.all.push(fil);

//             switch (statusLowerCase) {
//               case 'new':
//                 inProgressArr.new.push(fil);
//                 break;
//               case 'followup':
//                 inProgressArr.followup.push(fil);
//                 break;
//               case 'visitfixed':
//                 inProgressArr.visitfixed.push(fil);
//                 break;
//               case 'negotiation':
//                 inProgressArr.negotiation.push(fil);
//                 break;
//               case 'unassigned':
//                 inProgressArr.unassigned.push(fil);
//                 break;
//               default:
//                 inProgressArr.others.push(fil);
//             }
//           });
//         setStatusSepA([inProgressArr]);
//         setmySelRows(inProgressArr.all);
//       }
//       else if (leadsTyper === 'archieveLeads') {
//         leadsFetchedData
//           .sort((a, b) => b.Date - a.Date)
//           .forEach((fil) => {
//             const { Status } = fil;
//             if (!Status) return;

//             const statusLowerCase = Status.toLowerCase();

//             // Add to archieve_all if status matches any archive category
//             if (['dead', 'notinterested', 'blocked', 'junk'].includes(statusLowerCase)) {
//               archieveArr.archieve_all.push(fil);

//               switch (statusLowerCase) {
//                 case 'dead':
//                   archieveArr.dead.push(fil);
//                   break;
//                 case 'notinterested':
//                   archieveArr.notinterested.push(fil);
//                   break;
//                 case 'blocked':
//                   archieveArr.blocked.push(fil);
//                   break;
//                 case 'junk':
//                   archieveArr.junk.push(fil);
//                   break;
//                 default:
//                   archieveArr.others.push(fil);
//               }
//             }
//           });
//         setStatusSepA([archieveArr]);
//         setmySelRows(archieveArr.archieve_all);
//       }
//       else {
//         leadsFetchedData
//           .sort((a, b) => b.Date - a.Date)
//           .forEach((fil) => {
//             const { Status } = fil;
//             if (!Status) return;

//             const statusLowerCase = Status.toLowerCase();
//             bookedArr.all.push(fil);

//             if (statusLowerCase === 'booked') {
//               bookedArr.booked.push(fil);
//             } else {
//               bookedArr.others.push(fil);
//             }
//           });
//         setStatusSepA([bookedArr]);
//         setmySelRows(bookedArr.booked);
//       }
//     } else {
//       // Handle case when no data is available
//       if (leadsTyper === 'inProgress') {
//         setStatusSepA([inProgressArr]);
//       } else if (leadsTyper === 'archieveLeads') {
//         setStatusSepA([archieveArr]);
//       } else {
//         setStatusSepA([bookedArr]);
//       }
//     }
//   }, [leadsFetchedData, leadsTyper]);

//   // Function to handle tab changes
//   const handleTabChange = (tabVal) => {
//     setFetchLeadsLoader(true);
//     setValue(tabVal);

//     if (leadsFetchedData) {
//       setmySelRows(rowsCounter(leadsFetchedData, tabVal));
//     }

//     setFetchLeadsLoader(false);

//     // Reset scroll position when changing tabs
//     if (listRef.current) {
//       listRef.current.scrollTo(0);
//     }
//   };

//   // Calculate row height based on content
//   const getRowHeight = (index) => {
//     // Simple implementation - you might want to adjust this based on your data
//     return 72; // Default height for rows
//   };

//   return (
//     <Section pb={4} pt={2}>
//       <Card
//         sx={{
//           boxShadow: 0,
//         }}
//       >
//         <Grid container>
//           <Grid item xs={12}>
//             {/* Tab Headers */}
//             <div className="mb-1 border-b border-[#e7eaee]">
//               <ul
//                 className="flex flex-wrap"
//                 id="myTab"
//                 data-tabs-toggle="#myTabContent"
//                 role="tablist"
//               >
//                 {tabHeadFieldsA.map((d, i) => (
//                   <li key={i} className="mr-2" role="presentation">
//                     <button
//                       className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-700 border-b-2 rounded-t-lg transition-all hover:text-gray-600 hover:border-black dark:text-gray-400 dark:hover:text-gray-300 ${
//                         value === d.val ? 'border-black text-gray-900' : 'border-transparent'
//                       }`}
//                       type="button"
//                       role="tab"
//                       onClick={() => handleTabChange(d.val)}
//                     >
//                       <img alt="" src="/temp2.png" className="h-4 w-4" />
//                       <span
//                         className={`font-PlayFair text-sm ${
//                           value === d.val ? 'font-semibold text-green-800' : ''
//                         }`}
//                       >
//                         {d.lab}
//                       </span>
//                       <span
//                         className={`flex items-center justify-center text-[9px] w-5 h-5 rounded-full border ${
//                           value === d.val ? 'bg-gray-950 text-white font-semibold' : 'bg-gray-100 text-zinc-900 font-normal'
//                         }`}
//                       >
//                         {rowsCounter(leadsFetchedData || [], d.val).length}
//                       </span>
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Loading Skeleton */}
//             {fetchLeadsLoader &&
//               [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}

//             {/* No Records Message */}
//             {!fetchLeadsLoader && statusSepA[0] && statusSepA[0][value]?.length === 0 && (
//               <div className="flex items-center py-6">
//                 <span
//                   className="text-xs text-gray-500"
//                   style={{
//                     display: 'block',
//                     marginLeft: 'auto',
//                     marginRight: 'auto',
//                   }}
//                 >
//                   No Records
//                 </span>
//               </div>
//             )}

//             {/* Virtualized Table */}
//             {!fetchLeadsLoader && statusSepA[0] && statusSepA[0][value]?.length > 0 && (
//               <div className="leads-table">
//                 <TableHeader />
//                 <div style={{ height: 'calc(100vh - 300px)', width: '100%' }}>
//                   <AutoSizer>
//                     {({ height, width }) => (
//                       <List
//                         ref={listRef}
//                         height={height}
//                         itemCount={statusSepA[0][value].length}
//                         itemSize={getRowHeight}
//                         width={width}
//                         itemData={{
//                           items: statusSepA[0][value],
//                           searchVal: searchVal
//                         }}
//                       >
//                         {LeadRow}
//                       </List>
//                     )}
//                   </AutoSizer>
//                 </div>
//               </div>
//             )}
//           </Grid>
//         </Grid>
//       </Card>
//     </Section>
//   );
// };

// export default VirtualizedLeadsTable;

import { useEffect, useState, useRef } from 'react'

import { Box as Section, Card, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'

import LogSkelton from '../shimmerLoaders/logSkelton'
import { prettyDate } from 'src/util/dateConverter'

// Row counter function
const rowsCounter = (parent, searchKey) => {
  if (!parent || parent.length === 0) return []

  return searchKey === 'all'
    ? parent
    : searchKey === 'archieve_all'
    ? parent.filter((item) =>
        ['notinterested', 'blocked', 'junk', 'dead'].includes(
          item.Status?.toLowerCase() || ''
        )
      )
    : parent.filter(
        (item) => item?.Status?.toLowerCase() === searchKey.toLowerCase()
      )
}

// Format date safely
const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

// Individual row component with improved data handling
const LeadRow = ({ data, index, style }) => {
  const { items, searchVal } = data
  const item = items[index]

  // Skip rendering if the item doesn't match search criteria
  if (
    searchVal &&
    !JSON.stringify(item).toLowerCase().includes(searchVal.toLowerCase())
  ) {
    return null
  }

  // Status styling
  const getStatusStyle = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'

    const statusLower = status.toLowerCase()
    if (statusLower === 'new') return 'bg-blue-100 text-blue-800'
    if (statusLower === 'visitfixed') return 'bg-green-100 text-green-800'
    if (statusLower === 'followup') return 'bg-yellow-100 text-yellow-800'
    if (statusLower === 'negotiation') return 'bg-purple-100 text-purple-800'
    if (statusLower === 'booked') return 'bg-indigo-100 text-indigo-800'
    if (['dead', 'notinterested', 'blocked', 'junk'].includes(statusLower))
      return 'bg-red-100 text-red-800'

    return 'bg-gray-100 text-gray-800'
  }
console.log('item is', item)
  return (
    <div className="lead-row" style={style}>
      <div className="flex border-b border-gray-200 hover:bg-gray-50">
        <div className="w-16 py-4 pl-4">{index + 1}</div>
        <div className="w-32 py-4">{formatDate(item.Date)}</div>
        <div className="w-32 py-4">{item.assignT != undefined
                              ? prettyDate(item?.assignT)
                              : prettyDate(item?.Date)}</div>
        <div className="flex-1 py-4">
          <div>{item.Name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{item.Phone || 'N/A'}</div>
        </div>
        <div className="w-48 py-4">{item.Project || 'N/A'}</div>
        <div className="w-32 py-4">{item.Source || 'N/A'}</div>
        <div className="w-32 py-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(
              item.Status
            )}`}
          >
            {item.Status || 'N/A'}
          </span>
        </div>
        <div className="w-32 py-4">
          {item.LastActivity ? `${item.LastActivity} ago` : 'N/A'}
        </div>
        <div className="w-48 py-4 truncate">
          {item.Comments || 'No comments'}
        </div>
      </div>
    </div>
  )
}

// Table header component
const TableHeader = () => (
  <div className="flex font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
    <div className="w-16 py-3 pl-4">S.No</div>
    <div className="w-32 py-3">Created On</div>
    <div className="w-32 py-3">Assigned On</div>
    <div className="flex-1 py-3">Client Details</div>
    <div className="w-48 py-3">Project</div>
    <div className="w-32 py-3">Source</div>
    <div className="w-32 py-3">Status</div>
    <div className="w-32 py-3">Last Activity</div>
    <div className="w-48 py-3">Comments</div>
  </div>
)

// Main component
const VirtualizedLeadsTable = ({
  setFetchLeadsLoader,
  setisImportLeadsOpen,
  fetchLeadsLoader,
  selUserProfileF,
  leadsFetchedData,
  leadsTyper,
  searchVal,
}) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('all')
  const [tabHeadFieldsA, settabHeadFieldsA] = useState([])
  const [statusSepA, setStatusSepA] = useState([])
  const [mySelRows, setmySelRows] = useState([])
  const listRef = useRef()

  // Define tab fields based on lead type
  useEffect(() => {
    const archieveTab = [
      { lab: 'Archieve', val: 'archieve_all' },
      { lab: 'Dead', val: 'dead' },
      { lab: 'Not Interested', val: 'notinterested' },
      { lab: 'Blocked', val: 'blocked' },
      { lab: 'Junk', val: 'junk' },
    ]

    const tabHeadFieldsA1 =
      leadsTyper === 'inProgress'
        ? [
            { lab: 'In Progress', val: 'all' },
            { lab: 'New', val: 'new' },
            { lab: 'Follow Up', val: 'followup' },
            { lab: 'Visit Fixed', val: 'visitfixed' },
            { lab: 'Negotiation', val: 'negotiation' },
            { lab: 'Un Assigned', val: 'unassigned' },
          ]
        : leadsTyper === 'archieveLeads'
        ? archieveTab
        : [{ lab: 'Booked', val: 'booked' }]
    settabHeadFieldsA(tabHeadFieldsA1)

    leadsTyper === 'inProgress'
      ? setValue('all')
      : leadsTyper === 'archieveLeads'
      ? setValue('archieve_all')
      : setValue('booked')
  }, [leadsTyper])

  // Process and organize data based on lead status
  useEffect(() => {
    // Initialize data structure for different lead status categories
    const archieveArr = {
      archieve_all: [],
      all: [],
      dead: [],
      notinterested: [],
      blocked: [],
      junk: [],
      others: [],
    }

    const inProgressArr = {
      new: [],
      followup: [],
      all: [],
      visitfixed: [],
      negotiation: [],
      unassigned: [],
      others: [],
    }

    const bookedArr = {
      booked: [],
      all: [],
      others: [],
    }

    // Default empty array if leadsFetchedData is not available
    const dataToProcess = leadsFetchedData || []

    // Process data based on lead type
    if (dataToProcess.length > 0) {
      // Create a sorted copy of the data to avoid mutation
      const sortedData = [...dataToProcess].sort((a, b) => {
        // Safely handle date comparison
        const dateA = a.Date ? new Date(a.Date).getTime() : 0
        const dateB = b.Date ? new Date(b.Date).getTime() : 0
        return dateB - dateA
      })

      if (leadsTyper === 'inProgress') {
        sortedData.forEach((fil) => {
          const { Status } = fil
          const statusLowerCase = Status?.toLowerCase() || ''
          inProgressArr.all.push(fil)

          switch (statusLowerCase) {
            case 'new':
              inProgressArr.new.push(fil)
              break
            case 'followup':
              inProgressArr.followup.push(fil)
              break
            case 'visitfixed':
              inProgressArr.visitfixed.push(fil)
              break
            case 'negotiation':
              inProgressArr.negotiation.push(fil)
              break
            case 'unassigned':
              inProgressArr.unassigned.push(fil)
              break
            default:
              inProgressArr.others.push(fil)
          }
        })
        setStatusSepA([inProgressArr])
        setmySelRows(inProgressArr.all)
      } else if (leadsTyper === 'archieveLeads') {
        sortedData.forEach((fil) => {
          const { Status } = fil
          const statusLowerCase = Status?.toLowerCase() || ''

          // Add to archieve_all if status matches any archive category
          if (
            ['dead', 'notinterested', 'blocked', 'junk'].includes(
              statusLowerCase
            )
          ) {
            archieveArr.archieve_all.push(fil)

            switch (statusLowerCase) {
              case 'dead':
                archieveArr.dead.push(fil)
                break
              case 'notinterested':
                archieveArr.notinterested.push(fil)
                break
              case 'blocked':
                archieveArr.blocked.push(fil)
                break
              case 'junk':
                archieveArr.junk.push(fil)
                break
              default:
                archieveArr.others.push(fil)
            }
          }
        })
        setStatusSepA([archieveArr])
        setmySelRows(archieveArr.archieve_all)
      } else {
        sortedData.forEach((fil) => {
          const { Status } = fil
          const statusLowerCase = Status?.toLowerCase() || ''
          bookedArr.all.push(fil)

          if (statusLowerCase === 'booked') {
            bookedArr.booked.push(fil)
          } else {
            bookedArr.others.push(fil)
          }
        })
        setStatusSepA([bookedArr])
        setmySelRows(bookedArr.booked)
      }
    } else {
      // Handle case when no data is available
      if (leadsTyper === 'inProgress') {
        setStatusSepA([inProgressArr])
        setmySelRows([])
      } else if (leadsTyper === 'archieveLeads') {
        setStatusSepA([archieveArr])
        setmySelRows([])
      } else {
        setStatusSepA([bookedArr])
        setmySelRows([])
      }
    }
  }, [leadsFetchedData, leadsTyper])

  // Function to handle tab changes
  const handleTabChange = (tabVal) => {
    setFetchLeadsLoader(true)
    setValue(tabVal)

    if (leadsFetchedData) {
      setmySelRows(rowsCounter(leadsFetchedData, tabVal))
    }

    setFetchLeadsLoader(false)

    // Reset scroll position when changing tabs
    if (listRef.current) {
      listRef.current.scrollTo(0)
    }
  }

  // Calculate row height based on content
  const getRowHeight = (index) => {
    // Simple implementation - you might want to adjust this based on your data
    return 72 // Default height for rows
  }

  // Get the current data set based on selected tab
  const currentData =
    statusSepA[0] && statusSepA[0][value] ? statusSepA[0][value] : []

  // Apply search filter directly to the displayed data
  const filteredData = searchVal
    ? currentData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchVal.toLowerCase())
      )
    : currentData

  console.log('Filtered Data 1:', filteredData)

  return (
    <Section pb={4} pt={2}>
      <Card
        sx={{
          boxShadow: 0,
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            {/* Tab Headers */}
            <div className="mb-1 border-b border-[#e7eaee]">
              <ul
                className="flex flex-wrap"
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                {tabHeadFieldsA.map((d, i) => (
                  <li key={i} className="mr-2" role="presentation">
                    <button
                      className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-700 border-b-2 rounded-t-lg transition-all hover:text-gray-600 hover:border-black dark:text-gray-400 dark:hover:text-gray-300 ${
                        value === d.val
                          ? 'border-black text-gray-900'
                          : 'border-transparent'
                      }`}
                      type="button"
                      role="tab"
                      onClick={() => handleTabChange(d.val)}
                    >
                      <img alt="" src="/temp2.png" className="h-4 w-4" />
                      <span
                        className={`font-PlayFair text-sm ${
                          value === d.val ? 'font-semibold text-green-800' : ''
                        }`}
                      >
                        {d.lab}
                      </span>
                      <span
                        className={`flex items-center justify-center text-[9px] w-5 h-5 rounded-full border ${
                          value === d.val
                            ? 'bg-gray-950 text-white font-semibold'
                            : 'bg-gray-100 text-zinc-900 font-normal'
                        }`}
                      >
                        {rowsCounter(leadsFetchedData || [], d.val).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Loading Skeleton */}
            {fetchLeadsLoader &&
              [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}

            {/* No Records Message */}
            {!fetchLeadsLoader && filteredData.length === 0 && (
              <div className="flex items-center justify-center py-6">
                <span className="text-sm text-gray-500">
                  {searchVal &&
                  statusSepA[0] &&
                  statusSepA[0][value]?.length > 0
                    ? 'No matching records found'
                    : 'No Records'}
                </span>
              </div>
            )}

            {/* Virtualized Table */}
            {!fetchLeadsLoader && filteredData.length > 0 && (
              <div className="leads-table">
                <TableHeader />
                <div style={{ height: 'calc(100vh - 300px)', width: '100%' }}>
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        ref={listRef}
                        height={height}
                        itemCount={filteredData.length}
                        itemSize={getRowHeight}
                        width={width}
                        itemData={{
                          items: filteredData,
                          searchVal: searchVal,
                        }}
                      >
                        {LeadRow}
                      </List>
                    )}
                  </AutoSizer>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </Card>
    </Section>
  )
}

export default VirtualizedLeadsTable
