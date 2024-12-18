

/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import {useState, useEffect} from 'react'
import Section from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import PropTypes from 'prop-types'





import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip
} from 'recharts';


import { Calendar, ChevronRight } from 'lucide-react';




import { TrendingUp } from 'lucide-react';



import { useAuth } from 'src/context/firebase-auth-context'
import {
  prettyDate,
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
} from 'src/util/dateConverter'

import 'react-datepicker/dist/react-datepicker.css'
import TableSortLabel from '@mui/material/TableSortLabel'
// import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import Highlighter from 'react-highlight-words'

import CSVDownloader from 'src/util/csvDownload'
import DropCompUnitStatus from 'src/components/dropDownUnitStatus'
import { computeTotal } from 'src/util/computeCsTotals'
import { getAllProjects, getBookedUnitsByProject, getUnitsAgreeByProject } from 'src/context/dbQueryFirebase'
import { Download, Filter } from 'lucide-react'
// import { prettyDate } from '../../util/dateConverter'
// import DropCompUnitStatus from '../dropDownUnitStatus'



// function createData(
//   Date,
//   Name,
//   Mobile,
//   Email,
//   Project,
//   Source,
//   Empmobile,
//   Note
// ) {
//   return {
//     Date,
//     Name,
//     Mobile,
//     Email,
//     Project,
//     Source,
//     Empmobile,
//     Note,
//   }
// }

function descendingComparator(a, b, orderBy) {
  if ((b[orderBy] || b['stsUpT'] || b['Date']) < (a[orderBy] || a['stsUpT'] || a['Date'])) {
    return -1
  }
  if ((b[orderBy] || b['stsUpT'] || b['Date']) > (a[orderBy] || a['stsUpT'] || a['Date'])) {
    return 1
  }
  return 0
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  // {
  //   id: 'S.No',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'S.No',
  // },
  {
    id: 'Date',
    numeric: false,
    disablePadding: true,
    align: 'left',
    label: 'Customer Details',
  },
  {
    id: 'AssignedOn',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Unit',
  },
  {
    id: 'Project',
    numeric: false,
    disablePadding: false,
    align: 'left',
    label: 'Project',
  },
  {
    id: 'Clientdetails',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Status',
  },

  // {
  //   id: 'bmrda_strr',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'BMRDA/STRR',
  // },

  {
    id: 'booked',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Booked',
  },
  {
    id: 'partA',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Land',
  },{
    id: 'partB',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Charges-I',
  },{
    id: 'partC',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Construction',
  },{
    id: 'partD',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Charges-II',
  },
  // {
  //   id: 'infra',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'Infrastructure',
  // },
  // {
  //   id: 'club',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'ClubHouse Charges',
  // },
  // {
  //   id: 'maintenance',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'Maintenance Charges',
  // },
  // {
  //   id: 'legal',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'Legal Charges',
  // },
  {
    id: 'sale',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Sale Value',
  },
  {
    id: 'avgsft',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Sft Cost',
  },
  {
    id: 'sv_sft',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Sv/Sft',
  },
  {
    id: 'received',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Received',
  },
  {
    id: 'balance',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Balance',
  },
  {
    id: 'partE',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Possession',
  },
  {
    id: 'crm_executive',
    numeric: false,
    disablePadding: true,
    align: 'left',
    label: 'CRM Executive',
  },
  {
    id: 'sale_executive',
    numeric: false,
    disablePadding: true,
    align: 'left',
    label: 'Sale Executive',
  },
  {
    id: 'Notes',
    numeric: true,
    disablePadding: false,
    label: 'Comments',
  },
]



const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    selStatus,
    filteredData,
    setSearchKey,
    rows,
    viewUnitStatusA,
    pickCustomViewer,
    setViewUnitStatusA,
    startDate,
    endDate,
    setDateRange,
    leadsFetchedData,
    searchVal,
    searchKey,
  } = props
  const d = new window.Date()
  const [rowsAfterSearchKey, setRowsAfterSearchKey] = useState(rows)
  const [projectList, setprojectList] = useState([])

  const [downloadFormatRows, setDownloadFormatRows] = useState([])
  const [cutOffDate, setCutOffDate] = useState(d.getTime() + 60000)

  const [isOpened, setIsOpened] = useState(false)
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })

  useEffect(() => {
    setRowsAfterSearchKey(rows)
  }, [rows])
  // useEffect(() => {
  //  console.log('calendar state', isOpened, startDate?.getTime())
  //  if(startDate !== null && endDate !=null){
  //   console.log('inside you1')
  //   let rowsR = rows.filter((item) => {
  //    return item.Date >=startDate.getTime() && item.Date <=endDate.getTime()
  //   })
  //   setRowsAfterSearchKey(rowsR)
  //  }else if(startDate !==null) {
  //   console.log('inside you')
  //   let rowsR = rows.filter((item) => {
  //     console.log('inside you wjat os tjo filter', item.Date>= startDate.getTime() && item.Date <= startDate.getTime()+ 86400000,startDate.getTime()+ 86399999,startDate.getTime(),   item.Name)
  //     return item.Date>= startDate.getTime() && item.Date <= startDate.getTime()+ 86400000
  //    })
  //    console.log('inside you wjat os tjo filter', rowsR.length)
  //    setRowsAfterSearchKey(rowsR)
  //    console.log('inside you wjat os tjo filter 1', rowsAfterSearchKey)
  //  }
  // }, [startDate,endDate ])

  useEffect(() => {
    const downRows = []
    rowsAfterSearchKey?.map((data) => {
      const row = {}
      let remark
      if (data?.Remarks) {
        remark =
          data?.Remarks?.charAt(0) == '-'
            ? data?.Remarks.substring(1)
            : data?.Remarks
      } else {
        remark = data?.Remarks
      }
      row.Date = prettyDate(data?.Date).toLocaleString()
      row.Name = data?.Name
      row.CountryCode = data['Country Code']
      row.Mobile = data?.Mobile
      row.Email = data?.Email
      row.AssignedTo = data?.assignedToObj?.name
      row.Source = data?.Source
      row.Status = data?.Status
      row.Project = data?.Project
      row.Remarks = remark

      downRows.push(row)
    })

    setDownloadFormatRows(downRows)
  }, [rowsAfterSearchKey])
useEffect(()=>{
  setSearchKey(searchVal)
  // searchKeyField({target:{value:searchVal}})
},[searchVal])
  const searchKeyField = (e) => {
    // console.log('searched values is ', e.target.value)
    setSearchKey(e.target.value)
    const searchString = e.target.value

    const rowsR = leadsFetchedData.filter((item) => {
      if (searchString == '' || !searchString) {
        console.log('ami here')
        return item
      } else if (
        // item.Assignedto.toLowerCase().includes(searchString.toLowerCase()) ||
        // item.Date.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Email.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Mobile.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Project.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Source.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Status.toLowerCase().includes(searchString.toLowerCase())
      ) {
        return item
      }
    })
    setRowsAfterSearchKey(rowsR)
    // setRows(rowsR)
  }




  return (
    <section className="flex flex-row justify-between pb pt-1 px-3 ">
      {/* <span className="flex flex-row">
        <span className="relative  p- border rounded h-7">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 absolute left-0 ml-1 mt-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={`Search...${selStatus}`}
            // onChange={searchKeyField}
            value={searchKey}
            className="ml-6 bg-transparent text-xs focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none"
          />
        </span>

      </span> */}


      <span style={{ display: 'flex' }}>
        <section className="pt-1">
          <DropCompUnitStatus
            type={'Show Fields'}
            id={'id'}
            setStatusFun={{}}
            viewUnitStatusA={viewUnitStatusA}
            pickCustomViewer={pickCustomViewer}
          />
        </section>
        {/* <Tooltip title={`Download ${rowsAfterSearchKey.length} Rows`}>

          <IconButton className="bg-gray-200 ">
            <EventNoteTwoToneIcon
              className="h-[20px] w-[20px]"
              style={{ height: '20px', width: '20px' }}
            />
          </IconButton>
        </Tooltip> */}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton className="bg-gray-200">
              <DeleteIcon
                className="h-[20px] w-[20px]"
                style={{ height: '20px', width: '20px' }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={`Download ${leadsFetchedData?.length} Row`}>
            {/* <IconButton>
            <FileDownloadIcon />
            <CSVDownloader />
          </IconButton> */}

            <CSVDownloader
              className="mr-6 h-[20px] w-[20px]"
              downloadRows={leadsFetchedData}
              sourceTab="Booking Summary"
              style={{ height: '20px', width: '20px' }}
            />
          </Tooltip>
        )}
      </span>
    </section>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selStatus: PropTypes.string.isRequired,
  filteredData: PropTypes.array.isRequired,
  searchKey: PropTypes.string || PropTypes.number,
}

const HighlighterStyle = (props) => {
  const { searchKey, source } = props
  return (
    <Highlighter
      highlightStyle={{
        backgroundColor: '#ffc069',
        padding: 0,
      }}
      searchWords={[searchKey]}
      autoEscape
      textToHighlight={source}
    />
  )
}
export default function UnitSummaryTableBodyV1({
  leadsTyper,
  // fetchLeadsLoader,
  selStatus,
  rowsParent,
  selUserProfileF,
  newArray,
  // leadsFetchedData,
  // mySelRows,
  searchVal,
  viewUnitStatusA,

}) {
  const { user } = useAuth()
  const { orgId, access, projAccessA } = user

  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('Date')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState([])
  const [searchKey, setSearchKey] = useState(searchVal?searchVal:'')
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [projectList, setprojectList] = useState([])
  const [fetchLeadsLoader, setFetchLeadsLoader] = useState(true)
  const [value, setValue] = useState('all')
  const [mySelRows, setmySelRows] = useState([])
  const [tableData, setTableData] = useState([])
  const [leadsFetchedData, setLeadsFetchedData] = useState([])
  const [filLeadsA, setFilLeadsA] = useState([])
  const [tabHeadFieldsA, settabHeadFieldsA] = useState([])
  const [unitsFetchData, setUnitsFetchData] = useState([])
  const [projectsPayload, setProjectsPayload] = useState([])


const [totalSaleValue, setTotalSaleValue] = useState(0);
const [totalLandValue, setTotalLandValue] = useState(0);

const [totalChargesIValue, setTotalChargesIValue] = useState(0);

const [totalChargesIIValue, setTotalChargesIIValue] = useState(0);
const [totalPossessionValue, setTotalPossessionValue] = useState(0);

const [totalConstructValue, setTotalConstructValue] = useState(0);

const [totalReceived, setTotalReceived] = useState(0);
const [selTotalBalance, setTotalBalance] = useState(0);

const [totalSETSaleValue, setSETTotalSaleValue] = useState(0);
const [totalSETLandValue, setSETTotalLandValue] = useState(0);

const [totalSETChargesIValue, setSETTotalChargesIValue] = useState(0);

const [totalSETChargesIIValue, setSETTotalChargesIIValue] = useState(0);
const [totalSETPossessionValue, setSETTotalPossessionValue] = useState(0);
const [timeLine, setTimeLine] = useState('W');
const [totalSETConstructValue, setSETTotalConstructValue] = useState(0);
const [projectBookingsData, setProjectBookingsData] = useState([
  { time: 'Jan', value: 0, prevValue: 7 },
  { time: 'Feb', value: 0, prevValue: 7 },
  { time: 'Mar', value: 0, prevValue: 7 },
  { time: 'Apr', value: 0, prevValue: 7 },
  { time: 'Jun', value: 0, prevValue: 7 },
  { time: 'July', value: 0, prevValue: 5 },
  { time: 'Aug', value: 0, prevValue: 5 },
  { time: 'Sep', value: 0, prevValue: 7 },
  { time: 'Oct', value: 0, prevValue: 7 },
  { time: 'Nov', value: 0, prevValue: 7 },
  { time: 'Dec', value: 0, prevValue: 7 },]);
const [inventoryPayload, setInventoryPayload] = useState([
  { day: 'Available', count: 0 },
  { day: 'Booked', count: 0 },
  { day: 'Blocked', count: 0 },
  // { day: '8', 'Available': 108, 'Sold': 165, 'Blocked': 52 },
  // { day: '9', 'Available': 108, 'Sold': 165, 'Blocked': 52 },
  // { day: '10', 'Available': 108, 'Sold': 165, 'Blocked': 52 },
  // { day: '11', 'Available': 108, 'Sold': 165, 'Blocked': 52 },
  // { day: '12', 'Available': 108, 'Sold': 165, 'Blocked': 52 },
  // { day: '13', 'Available': 108, 'Sold': 165, 'Blocked': 52 },
]);

const [unitStatusPayload, setUnitStatusPayload] = useState([
  { day: 'Booked', count: 10 },
  { day: 'Allotment', count: 10 },
  { day: 'ATS', count: 10 },])

const [totalSETReceived, setSETTotalReceived] = useState(0);
const [selSETTotalBalance, setSETTotalBalance] = useState(0);
const rowsCounter = (parent, searchKey) => {
  return searchKey === 'all'
    ? parent
    : parent.filter(
        (item) =>
          (item?.unitStatus?.toLowerCase() || item?.status?.toLowerCase()) ===
          searchKey.toLowerCase()
      )
}
useEffect(() => {
  boot()
}, [projectList])
useEffect(() => {
  // axios
  //   .get('/api/tableData1/all')
  //   .then(({ data }) => {
  //     setTableData(tableData1)
  //   })
  //   .catch((error) => {
  //     // setTableData(tableData1)
  //     console.log(error)
  //   })

  const tabHeadFieldsA1 = [
    { value: 'all', lab: 'All', val: 'all' },
    { value: 'booked', lab: 'Booked' },
    { value: 'allotment', lab: 'Allotment' },
    { value: 'ATS', lab: 'Agreement' },
    { value: 'registered', lab: 'Registered' },
    { value: 'construction', lab: 'Construction' },
    { value: 'possession', lab: 'Possession' },
  ]

  settabHeadFieldsA(tabHeadFieldsA1)

  leadsTyper === 'inProgress'
    ? setValue('all')
    : leadsTyper === 'archieveLeads'
    ? setValue('archieve_all')
    : setValue('booked')
}, [])
useEffect(() => {
  setLeadsFetchedData(tableData)
}, [tableData])
useEffect(() => {
  console.log('selected value is', value)
  setFetchLeadsLoader(false)
  switch (value) {
    case 'all':
      return setFilLeadsA(leadsFetchedData)
    default:
      return setFilLeadsA(
        leadsFetchedData.filter((dat) => {
          console.log(
            'filtre value is ',
            dat?.unitStatus,
            value,
            (dat?.unitStatus?.toLowerCase() || dat?.status?.toLowerCase()) ==
              'booked'
          )
          return (
            (dat?.unitStatus?.toLowerCase() || dat?.status?.toLowerCase()) ===
            value?.toLowerCase()
          )
        })
      )
  }
}, [value, leadsFetchedData])
useEffect(() => {
  // unitsFetchData
  console.log('values are', unitsFetchData.length, selProjectIs.uid)
  switch (selProjectIs.value) {
    case 'allprojects':
      return setTableData(unitsFetchData)
    default:
      return setTableData(
        unitsFetchData.filter((dat) => dat?.pId === selProjectIs.uid)
      )
  }
}, [unitsFetchData, selProjectIs])
const boot = async () => {
  // await getProjectsListFun()
  const unsubscribe = await getBookedUnitsByProject(
    orgId,
    async (querySnapshot) => {
      const usersListA = querySnapshot.docs.map((docSnapshot) => {
        const x = docSnapshot.data()
        x.id = docSnapshot.id
        const y = projectList.filter((proj) => proj?.uid == x?.pId)
        console.log(',my prject sel is  ===> ', projectList)
        if (y.length > 0) {
          console.log(',my prject sel is ', y)
          x.projName = y[0].projectName
        }
        return x
      })
      // setBoardData
      // console.log('my Array data is ', usersListA, crmCustomersDBData)
      // await serealizeData(usersListA)
      console.log('booking details values are', usersListA)
      await setUnitsFetchData(usersListA)
      await updateBookingData(usersListA)

    },
    {
      status: [
        'booked',
        'Booked',
        'agreement_pipeline',
        'ATS',
        'sd_pipeline',
        'Registered',
        'agreement',
        'registered',
        'construction',
        'possession',
      ],
    },
    () => setTableData([])
  )

  const unsubscribe1 = await getUnitsAgreeByProject(
    orgId,
    async (querySnapshot) => {
      const usersListA = querySnapshot.docs.map((docSnapshot) => {
        const x = docSnapshot.data()
        x.id = docSnapshot.id

        return x
      })
      console.log('projects details values are', usersListA)
      await setProjectsPayload(usersListA)
      await updateInventoryData(usersListA)
    },
    {
      status: [

      ],
    },
    () => setProjectsPayload([])
  )
  return unsubscribe
}


function updateBookingData(myDbDataIs) {
  // Month mapping for easy lookup
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  myDbDataIs.forEach(record => {
    // Convert the timestamp to a Date object
    const date = new Date(record.Date);
    // Get the month name
    const month = monthNames[date.getUTCMonth()];
    // Find the corresponding month in projectBookingsData
    const booking = projectBookingsData.find(entry => entry.time === month);
    if (booking) {
      booking.value += 1; // Increment the value
    }
  });
  setProjectBookingsData(projectBookingsData)
  console.log('booking details values are',projectBookingsData )
  return projectBookingsData;
}
function updateInventoryData(myDbDataIs) {
  // Month mapping for easy lookup
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
let x = []
let y = {available: 0, booked: 0, blocked: 0}
  myDbDataIs.map((record, i) => {
    // Convert the timestamp to a Date object
    // const date = new Date(record.Date);
    // // Get the month name
    // const month = monthNames[date.getUTCMonth()];
    // // Find the corresponding month in projectBookingsData
    // const booking = projectBookingsData.find(entry => entry.time === month);
    // if (booking) {
    //   booking.value += 1; // Increment the value
    // }
    console.log('project details are', record)

    // y.day = record?.projectName;
    // y.Available= record?.availableCount || 0;
    // y.Sold= record?.bookUnitCount || 0;
    // y.Blocked= record?.blockedUnitCount || 0;

    y.available += record?.availableCount || 0;
    y.booked += record?.bookUnitCount || 0;
    y.blocked += record?.blockedUnitCount || 0;

    // x.push(y)
  });
  setInventoryPayload([{day: 'Available', count: y.available}, {day: 'Booked', count: y.booked}, {day: 'Blocked', count: y.blocked}])
  console.log('booking details values are',projectBookingsData )
  return projectBookingsData;
}
const getProjectsListFun = () => {
  const unsubscribe = getAllProjects(
    orgId,
    (querySnapshot) => {
      const projectsListA = querySnapshot.docs.map((docSnapshot) =>
        docSnapshot.data()
      )
      projectsListA.map((user) => {
        user.label = user.projectName
        user.value = user.projectName
      })
      console.log('fetched proejcts list is', projectsListA)
      const z = [...projectsListA]
      setprojectList(z)
    },
    (error) => setprojectList([])
  )
  return unsubscribe
}
useEffect(() => {


  console.log('valure are', leadsFetchedData)
  const totalSale = leadsFetchedData.reduce((total, row) => total + Number(row?.T_total || 0), 0);
  setTotalSaleValue(totalSale);

  const totalLand = leadsFetchedData.reduce((total, row) => total + Number(row?.T_A || 0), 0);
  setTotalLandValue(totalLand);
  const totalChargesI = leadsFetchedData.reduce((total, row) => total + Number(row?.T_B || 0), 0);
  setTotalChargesIValue(totalChargesI);
  const totalConstruction = leadsFetchedData.reduce((total, row) => total + Number(row?.T_C || 0), 0);
  setTotalConstructValue(totalConstruction);
  const totalChargesII = leadsFetchedData.reduce((total, row) => total + Number(row?.T_D || 0), 0);
  setTotalChargesIIValue(totalChargesII);
  const totalPossessionII = leadsFetchedData.reduce((total, row) => total + Number(row?.T_E || 0), 0);
  setTotalPossessionValue(totalPossessionII);

  const totalReceived = leadsFetchedData.reduce((total, row) => total + Number(row.T_approved || 0), 0);
  setTotalReceived(totalReceived);
  const totalBalance = leadsFetchedData.reduce((total, row) => total + Number(row.T_balance || 0), 0);
  setTotalBalance(totalBalance);

  const bookedCount = rowsCounter(leadsFetchedData, 'booked').length
  const allotment = rowsCounter(leadsFetchedData, 'allotment').length
  const ATS = rowsCounter(leadsFetchedData, 'ATS').length
  const registered = rowsCounter(leadsFetchedData, 'registered').length
  const construction = rowsCounter(leadsFetchedData, 'construction').length
  const possession = rowsCounter(leadsFetchedData, 'possession').length

  const x = [{day:'Booked', count:bookedCount}, {day:'Allotment', count:allotment}, {day:'Agreement', count:ATS}, {day:'Registered', count:registered}, {day:'Construction', count:construction}, {day:'Possession', count:possession}]

  setUnitStatusPayload(x)
}, [leadsFetchedData]);

useEffect(() => {

  console.log('valure are', leadsFetchedData)
  const totalSale = filLeadsA.reduce((total, row) => total + Number(row?.T_total || 0), 0);
  setSETTotalSaleValue(totalSale);

  const totalLand = filLeadsA.reduce((total, row) => total + Number(row?.T_A || 0), 0);
  setSETTotalLandValue(totalLand);
  const totalChargesI = filLeadsA.reduce((total, row) => total + Number(row?.T_B || 0), 0);
  setSETTotalChargesIValue(totalChargesI);
  const totalConstruction = filLeadsA.reduce((total, row) => total + Number(row?.T_C || 0), 0);
  setSETTotalConstructValue(totalConstruction);
  const totalChargesII = filLeadsA.reduce((total, row) => total + Number(row?.T_D || 0), 0);
  setSETTotalChargesIIValue(totalChargesII);
  const totalPossessionII = filLeadsA.reduce((total, row) => total + Number(row?.T_E || 0), 0);
  setSETTotalPossessionValue(totalPossessionII);

  const totalReceived = filLeadsA.reduce((total, row) => total + Number(row.T_approved || 0), 0);
  setSETTotalReceived(totalReceived);
  const totalBalance = filLeadsA.reduce((total, row) => total + Number(row.T_balance || 0), 0);
  setSETTotalBalance(totalBalance);
}, [filLeadsA]);










  useEffect(() => {
  }, [selStatus, rowsParent])
  console.log(searchKey, "cdsvfeg", leadsFetchedData)
  useEffect(() => {
    filterSearchString(rows)
  }, [searchKey])

  const filterStuff = async (parent) => {
    console.log('filter value stuff', parent)


    const x = selStatus === 'all'
      ? parent['all'] : selStatus === 'archieve_all' ? parent['archieve_all'] : parent[selStatus]

    await setRows(newArray)
  }
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }
  const filterByDate = () => {
    rows.filter((item) => {
      {
        /* console.log('inside xxxx ==>', item?.Date>= startDate.getTime() && item.Date <= startDate.getTime()+ 86400000,startDate.getTime()+ 86399999,startDate.getTime(),   item.Name) */
      }
      if (startDate !== null && endDate != null) {
        console.log('inside you1', startDate, endDate, item)
        const x = rows.filter((item) => {
          return (
            item?.Date >= startDate?.getTime() &&
            item?.Date <= endDate?.getTime()
          )
        })
        setRows(x)
      } else if (startDate !== null) {
        console.log('inside you1 x')
        console.log(
          'iinside you1 x',
          item?.Date >= startDate?.getTime() &&
          item?.Date <= startDate?.getTime() + 86400000,
          startDate?.getTime() + 86399999,
          startDate?.getTime(),
          item.Name
        )

        const x = rows.filter((item) => {
          console.log(
            'inside you wjat os tjo filter',
            item?.Date >= startDate?.getTime() &&
            item?.Date <= startDate?.getTime() + 86400000,
            startDate?.getTime() + 86399999,
            startDate?.getTime(),
            item.Name
          )
          return (
            item?.Date >= startDate?.getTime() &&
            item?.Date <= startDate?.getTime() + 86400000
          )
        })
        setRows(x)
      } else {
        return item
      }
    })
  }
  const filterSearchString = async (parent) => {
    return
    const x = await parent.filter((item) => {
      if (item.Source.toLowerCase().includes(selStatus.toLowerCase())) {
        return item
      }
      //  else if (item.Status.toLowerCase() === selStatus.toLowerCase()) {
      //   console.log('All1', item)
      //   return item
      // } else if (item.Source.toLowerCase().includes(selStatus.toLowerCase())) {
      //   return item
      // }
    })
    await setRows(x)
    await console.log('xo', x)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    console.log('property is', property)
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, row) => {
    // const selectedIndex = selected.indexOf(name)
    const newSelected = []

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name)
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1))
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1))
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1)
    //   )
    // }
    selUserProfileF('User Profile', row)
    setSelected(newSelected)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const [selBlock, setSelBlock] = useState({})



  {/* today */}








  const channelData = [
    { name: 'Make an offer', value1: 80, value2: 120, value3: 0 },
    { name: 'Online store', value1: 20, value2: 0, value3: 0 },
  ];




  const data = [
    { day: '7', 'Available': 110, 'Sales': 165, 'Blocked': 52 },
    { day: '8', 'Available': 108, 'Sales': 165, 'Blocked': 52 },
    { day: '9', 'Available': 108, 'Sales': 165, 'Blocked': 52 },
    { day: '10', 'Available': 108, 'Sales': 165, 'Blocked': 52 },
    { day: '11', 'Available': 108, 'Sales': 165, 'Blocked': 52 },
    { day: '12', 'Available': 108, 'Sales': 165, 'Blocked': 52 },
    { day: '13', 'Available': 108, 'Sales': 165, 'Blocked': 52 },
  ];




  const customTooltipone = ({ payload, label }) => {
    console.log(payload); // Add this line to see if payload is populated correctly
    if (!payload || payload.length === 0) return null;
  
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-item-${index}`} className="flex items-center space-x-2 mb-2">
            <div
              className="w-3 h-3 "
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700">{`${entry.name}: ₹  ${entry.value}`}</span>
          </div>
        ))}
      </div>
    );
  };
  


  // const customTooltipone = ({ payload, label }) => {
  //   if (!payload || payload.length === 0) return null;

  //   return (
  //     <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg text-sm">
  //       <p className="font-semibold text-gray-800">{label}</p>
  //       {payload.map((entry, index) => (
  //         <div key={`tooltip-item-${index}`} className="flex items-center space-x-2 mb-2">
  //           <div
  //             className="w-3 h-3 "
  //             style={{ backgroundColor: entry.color }}
  //           ></div>
  //           <span className="text-gray-700">{`${entry.name}: ₹  ${entry.value}`}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };





// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const time = payload[0].payload.time;

//     return (
//       <div className="bg-white p-3 rounded-md">
//         <p className="text-black">Time: {time}</p>

//         {payload.map((entry, index) => {
//           const { value, prevValue } = entry.payload;
//           const strokeColor = entry.stroke;


//           return (
//             <div key={index} className="flex items-center gap-2">

//               <div
//                 style={{ backgroundColor: strokeColor }}
//                 className="w-4 h-4 "
//               ></div>

//               <p className="text-black">
//                 {entry.dataKey === "value"
//                   ? `Current Value: ${value}`
//                   : entry.dataKey === "prevValue"
//                   ? `Previous Value: ${prevValue}`
//                   : null}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   return null;
// };







  const getRandomColor = () => {
    const red = Math.floor(Math.random() * 156) + 100;
    const green = Math.floor(Math.random() * 156) + 100;
    const blue = Math.floor(Math.random() * 156) + 100;

    return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
  };

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    searchKey,
    viewUnitStatusA,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }




  

  const displayHeadersFun = (headCell) => {

    if(['partA','partB','partC','partD','partE', 'legal', 'maintenance', 'club', 'infra'].includes(headCell)){
      return viewUnitStatusA.includes('Cost Split') ? '' : 'none'
    }  else if(['avgsft', 'sv_sft', 'bmrda_strr'].includes(headCell)){
      return viewUnitStatusA.includes('Avg sqft Cost') ? '' : 'none'
    } else if(['crm_executive'].includes(headCell)){
      return viewUnitStatusA.includes('CRM Executive') ? '' : 'none'
    }else if(['sale_executive'].includes(headCell)){
      return viewUnitStatusA.includes('Sales Executive') ? '' : 'none'
    }else if(['Notes'].includes(headCell)){
      return viewUnitStatusA.includes('Remarks') ? '' : 'none'
    }
    else {
      return ''
    }

    //   if(viewUnitStatusA.includes('Assigned To') &&
    //   headCell === 'Assigned'){
    //   return ''
    //   }else{
    //     return 'none'
    //   }
    // }else {
    //   return ''
    // }


  }
  return (


    <TableHead style={{ height: '10px', borderRadius: '2xl' }}>
      <TableRow selected={true}>
        <TableCell
          align="center"
          component="th"
          scope="row"
          padding="none"
          size="small"
          style={{
            backgroundColor: '#F0F2F5',
            color: '#1a91eb',
            maxHeight: '10px',
            height: '10px',
            lineHeight: '10px',
            maxWidth: '52px',
            minWidth: '25px',
            padding: '10px',
            borderRadius: '2xl',
            borderBottom: '0.2px solid #d3c5f1',
            borderRight: '0.2px solid #d3c5f1',

            paddingLeft: '14px',
            paddingRight: '29px',
            marginRight: '10px',
          }}
        >
          {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          /> */}



          <TableSortLabel style={{borderRight: '0.2px solid #d3c5f1', color: '#000',fontWeight: '600' }}>S.No</TableSortLabel>
        </TableCell>
        {headCells.map((headCell) => (
          <>
            <TableCell
              key={headCell.id}
              align={headCell?.align ||  'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{
                backgroundColor: '#F0F2F5',
                color: '#000',

                fontWeight: '600',
                height: '10px',
                maxHeight: '10px',
                lineHeight: '7px',
                padding: '8px 7px 8px 10px',
                borderRight: '0.2px solid #d3c5f1',
                borderBottom: '0.2px solid #d3c5f1',

                display: displayHeadersFun(headCell.id)
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                style={{
                  backgroundColor: '#F0F2F5',
                  color: '#33393d',
                  fontFamily: 'inherit',
                }}
              >
                <span className="text-[#000] whitespace-nowrap">
                  {headCell.label}
                </span>
                {orderBy === headCell.id ? (
                  <Section component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Section>
                ) : null}
              </TableSortLabel>
            </TableCell>
          </>
        ))}
      </TableRow>  <TableRow selected={true}>
        <TableCell
          align="center"
          component="th"
          scope="row"
          padding="none"
          size="small"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1a91eb',
            maxHeight: '12px',
            height: '12px',
            lineHeight: '12px',
            maxWidth: '52px',
            minWidth: '25px',

            padding: '10px 0',

            paddingLeft: '14px',
            paddingRight: '29px',
            marginRight: '10px',
          }}
        >

          <TableSortLabel style={{backgroundColor: '#FFFFFF', color: '#000',fontWeight: '500' }}></TableSortLabel>
        </TableCell>
        {headCells.map((headCell) => (
          <>
            <TableCell
              key={headCell.id}
              align={headCell?.align ||  'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{
                backgroundColor: ['partA','partB','partC','partD','partE', 'sale', 'received', 'balance'].includes(headCell.id) ? '#FFFFFF': '#FFFFFF',
                color: '#33393d',
                height: '6px',
                maxHeight: '10px',
                lineHeight: '7px',
                fontWeight: '600',
                padding: '6px 1px 6px 10px',


                borderRight: '0.2px solid #d3c5f1',

                display: displayHeadersFun(headCell.id)
              }}
            >



              {headCell.id === 'partA' && (

<div style={{  }}>
<div className="bg-[#FFFFFF]  flex items-center justify-end py-2 pr-1">
  <span className="text-[#000] text-[14px] ">₹{totalSETLandValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}
                 {headCell.id === 'partB' && (

<div style={{  }}>
<div className="bg-[#FFFFFF]  flex items-center justify-end py-2 pr-1">
  <span className="text-[#000] text-[14px] ">₹{totalSETChargesIValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}

               {headCell.id === 'partC' && (

<div style={{  }}>
<div className="bg-[#FFFFFF]  flex items-center justify-end py-2 pr-1">
  <span className="text-[#000] text-[14px] ">₹{totalSETConstructValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}

{headCell.id === 'partD' && (

<div style={{  }}>
<div className="bg-[#FFFFFF]  flex items-center justify-end py-1 pr-1">
  <span className="text-[#000] text-[14px] ">₹{totalSETChargesIIValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}
              {headCell.id === 'partE' && (

<div style={{  }}>
<div className="bg-[#FFFFFF]  flex items-center justify-end py-1 pr-1">
  <span className="text-[#000] text-[14px] ">₹{totalSETPossessionValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}


              {headCell.id === 'sale' && (

<div className="bg-[#FFFFFF] flex items-center justify-end py-1 pr-1">
  <span className="text-[#000] text-[14px] ">₹{totalSETSaleValue.toLocaleString('en-IN')}</span>
</div>



  )}


            {headCell.id === 'received' && (

<div style={{  }}>
<div className="bg-[#FFFFFF]  flex items-center justify-end py-1 pr-1">
  <span className="text-[#000] text-[14px] ">₹{totalSETReceived.toLocaleString('en-IN')}</span>
</div>
</div>



              )}

{headCell.id === 'balance' && (

<div style={{  }}>
<div className="bg-[#FFFFFF] flex items-center justify-end py-1 pr-1">
  <span className="text-[#000] text-[14px] ">₹{selSETTotalBalance.toLocaleString('en-IN')}</span>
</div>
</div>



              )}









            </TableCell>
          </>
        ))}
      </TableRow>
    </TableHead>




































  )
}


EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  searchkey: PropTypes.number.isRequired || PropTypes.string.isRequired,
}

{ /* today */}





const customTooltip = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg text-sm">
      <p className="font-semibold text-gray-800">{label}</p>
      {payload.map((entry, index) => (
        <div key={`tooltip-item-${index}`} className="flex items-center space-x-2 mb-2">
          <div
            className="w-3 h-3 "
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-gray-700">{`${entry.name}: ₹  ${entry.value}`}</span>
        </div>
      ))}
    </div>
  );
};





  return (

    <section>
      {/* <div className="col-span-2 px-2">
         <div className="border rounded-xl   border-gray-200 flex flex-row  bg-white shadow ">

        <div className="bg-warm-white-100 rounded-lg p-6">
          <dt className="text-gray-700 text-xs font-semibold leading-loose">Sale box</dt>

          <dd>
            <div className="flex items-end font-semibold">
              <div className="text-3xl font-heading leading-normal">
                <span className="text-xl">₹</span>{totalSaleValue?.toLocaleString('en-IN')}</div>
                </div>
          </dd>
         <div className="flex items-center ml-2">
          <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
          <div className="font-semibold text-orange-600">50%</div><span className="ml-2">{leadsFetchedData?.length}units</span>
          </div>

        </div>

        <div className="bg-warm-white-100 rounded-lg p-6">
          <dt className="text-gray-700 text-xs font-semibold leading-loose">Received</dt>

          <dd>
            <div className="flex items-end font-semibold">
              <div className="text-3xl font-heading leading-normal">
                <span className="text-xl">₹</span>{totalReceived?.toLocaleString('en-IN')}</div>
                </div>
          </dd>
         <div className="flex items-center ml-2">
          <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
         <div className="font-semibold text-orange-600">50%</div><span className="ml-2">{leadsFetchedData?.length}units</span></div>

        </div>

        <div className="bg-warm-white-100 rounded-lg p-6">
          <dt className="text-gray-700 text-xs font-semibold leading-loose">Balance</dt>

          <dd>
            <div className="flex items-end font-semibold">
              <div className="text-3xl font-heading leading-normal">
                <span className="text-xl">₹</span>{selTotalBalance?.toLocaleString('en-IN')}</div>
                </div>
          </dd>
         <div className="flex items-center ml-2">
          <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
          <div className="font-semibold text-orange-600">50%</div>
          <span className="ml-2">{leadsFetchedData?.length}units</span></div>

        </div>

        </div>

        </div> */}

















<div className='max-w-7xl  mt-4 mx-auto'>
<div className="grid grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-xl p-6  shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Sold Units</h3>
    <p className="text-2xl font-bold mb-2">  {unitsFetchData?.length?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">157 Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md ">
    <h3 className="text-gray-600 mb-2">Sales</h3>
    <p className="text-2xl font-bold mb-2">₹ {totalSaleValue?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">{leadsFetchedData?.length} Units</span>
    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Recieved</h3>
    <p className="text-2xl font-bold mb-2">₹ {totalReceived?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">{leadsFetchedData?.length} Units</span>
    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Balance</h3>
    <p className="text-2xl font-bold mb-2">₹ {selTotalBalance?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">{leadsFetchedData?.length} Units</span>
    </div>
  </div>
</div>
</div>












<div className="grid grid-cols-2 gap-6 h-full items-end">

      <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
        <div className="pt-6 px-4">
          <h2 className="text-[#6A6A6A] text-[19px] ml-4">Sales Trend</h2>
          <div className="flex items-center gap-3 mt-1 mb-2 ml-4">
            <span className="text-[30px] text-[#000000] font-semibold"> {unitsFetchData?.length?.toLocaleString('en-IN')}</span>
            <div className="flex items-center text-[#00A236]">
              <TrendingUp className="w-5 h-5 mx-3" />
              <span className="text-[18px]">23%</span>
            </div>
          </div>
        </div>

        <span className=" ml-8 py-1 px-1 mb-4 gap-2 text-gray-600 bg-[#f1f1f1] rounded-full  w-[240px] flex items-center justify-between">
      <span className={`px-4  rounded-full cursor-pointer text-sm ${timeLine === 'W' ? 'bg-blue-100' : '}'}`} onClick={() => setTimeLine('W')}>Week</span>
      <span className={`px-4  rounded-full cursor-pointer text-sm ${timeLine === 'M' ? 'bg-blue-100' : 'bg-[#f1f1f1]'}`} onClick={() => setTimeLine('M')}>Month</span>
      <span className={`px-4  rounded-full cursor-pointer text-sm ${timeLine === 'Y' ? 'bg-blue-100' : 'bg-[#f1f1f1]'}`} onClick={() => setTimeLine('Y')}>Year</span>



    </span>

    <div className="flex ml-8  py-2 mb-4 gap-2 text-gray-600">
      <Calendar className="w-5 h-5" />
      <span>Jun 07, 2024</span>
      <ChevronRight className="w-5 h-5" />
      <i data-lucide="arrow-right"></i>
      <span>Jun 13, 2024</span>
    </div>




    <div className="flex ml-7 gap-4 mb-6 flex-row">


<button className="flex items-center px-6 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 relative">
          <div className="flex items-center pl-3">
            <div className="w-7 h-[2px] bg-[#29AAE3] mr-2"></div>
            Nov 18, 2024
          </div>
        </button>
        <button className="flex items-center px-6 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 relative">
          <div className="flex items-center pl-3">
            <div className="w-7 h-[2px] border-t-4 font-medium border-[#CCCCCC] border-dotted mr-2"></div>
            Nov 17, 2024
          </div>
        </button>
      </div>


        <div className="h-80 px-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectBookingsData} margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#CCCCCC" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                stroke="#3D3D3D"
                tick={{ dy: 10 }}
                interval={0}
              />
              <YAxis
                // domain={[5, 100]}
                // ticks={[5, 25, 50, 75, 100]}
                axisLine={false}
                tickLine={false}
                stroke="#3D3D3D"
              />


{/* 
<Tooltip content={<customTooltipone />} /> */}


<Tooltip
          content={({ payload, label }) => {
            if (!payload || payload.length === 0) return null;
            return (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg text-sm">
                <p className="font-semibold text-gray-800">{label}</p>
                {payload.map((entry, index) => (
                  <div key={`tooltip-item-${index}`} className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-gray-700">{`${entry.name}: ₹ ${entry.value}`}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />





              <Line
                type="monotone"
                dataKey="prevValue"
                stroke="#CCCCCC"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>






      </div>








      {/* <div className="flex flex-col  rounded-[30px] py-5 h-full bg-white shadow">
      <div className="w-full max-w-4xl p-6 bg-white ">

  <div className="mb-6">
    <h2 className="text-[18px] text-[#6A6A6A] font-medium">Collections</h2>
    <div className="flex items-center justify-between mt-1">
      <div className="text-[30px] font-semibold text-[#00000]">&#8377; 708.84</div>

    </div>


    <div className="flex items-center gap-2 mt-4 text-gray-600">
      <Calendar className="w-5 h-5" />
      <span>Jun 07, 2024</span>
      <ChevronRight className="w-5 h-5" />
      <i data-lucide="arrow-right"></i>
      <span>Jun 13, 2024</span>
    </div>
  </div>









  <div className="flex gap-6 mb-6">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-indigo-600 rounded"></div>
      <span>Available</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-sky-400 rounded"></div>
      <span>Sales</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-gray-400 rounded"></div>
      <span>Blocked</span>
    </div>
  </div>


  <div className="h-80  ">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis
          tickFormatter={(value) => `$ ${value}`}
          ticks={[0, 50, 100, 150, 200, 250]}
        />
         <Tooltip
          formatter={(value) => [`$ ${value}`, '']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '8px'
          }}
        />

        <Tooltip content={customTooltipone} />

        <Bar dataKey="Available" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Sales" fill="#38bdf8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Blocked" fill="#9ca3af" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
      </div> */}


<div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
  <div className="w-full max-w-4xl p-6 bg-white flex flex-col justify-between h-full">
    <div className="mb-6">
      <h2 className="text-[18px] text-[#6A6A6A] font-medium">Units</h2>
      <div className="flex items-center justify-between mt-1">
        <div className="text-[30px] font-semibold text-[#00000]">{inventoryPayload.reduce((acc, curr) => acc + curr.count, 0)?.toLocaleString('en-IN')}</div>
        {/* <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <span className="text-gray-600">View:</span>
          <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v10H7V7zm4 0h2v10h-2V7zm4 0h2v10h-2V7z" />
          </svg>
          <span className="text-gray-600">Bar Line Chart</span>
        </div> */}
      </div>

      <div className="flex items-center gap-2 mt-4 text-gray-600">
        <Calendar className="w-5 h-5" />
        <span>Jun 07, 2024</span>
        <ChevronRight className="w-5 h-5" />
        <i data-lucide="arrow-right"></i>
        <span>Jun 13, 2024</span>
      </div>
    </div>

    <div className="flex gap-6 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-indigo-600 rounded"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-sky-400 rounded"></div>
        <span>Sales</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-400 rounded"></div>
        <span>Blocked</span>
      </div>
    </div>

    {/* Graph Section */}
    <div className="mt-auto h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={inventoryPayload} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(value) => `Units ${value}`}
          // ticks={[0, 50, 100, 150, 200, 250]}
           />
          <Tooltip content={customTooltipone} />
          {/* <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} /> */}
<Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          {/* <Bar dataKey="Blocked" fill="#9ca3af" radius={[4, 4, 0, 0]} /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>




    </div>








    <div className="flex flex-col rounded-[30px] mt-6 py-5 h-full bg-white shadow">
  <div className="w-full max-w-4xl p-6 bg-white flex flex-col justify-between h-full">
    <div className="mb-6">
      <h2 className="text-[18px] text-[#6A6A6A] font-medium">Units</h2>
      <div className="flex items-center justify-between mt-1">
        <div className="text-[30px] font-semibold text-[#00000]">{inventoryPayload.reduce((acc, curr) => acc + curr.count, 0)?.toLocaleString('en-IN')}</div>
        {/* <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <span className="text-gray-600">View:</span>
          <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v10H7V7zm4 0h2v10h-2V7zm4 0h2v10h-2V7z" />
          </svg>
          <span className="text-gray-600">Bar Line Chart</span>
        </div> */}
      </div>


    </div>

    <div className="flex gap-6 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-indigo-600 rounded"></div>
        <span>Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-sky-400 rounded"></div>
        <span>Allotment</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-400 rounded"></div>
        <span>Agreement</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-400 rounded"></div>
        <span>Registered</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-400 rounded"></div>
        <span>Construction</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-400 rounded"></div>
        <span>Possession</span>
      </div>
    </div>

    {/* Graph Section */}
    <div className="mt-auto h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={unitStatusPayload} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(value) => `${value}`}
          // ticks={[0, 50, 100, 150, 200, 250]}
           />
          <Tooltip content={customTooltipone} />
          {/* <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} /> */}
<Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          {/* <Bar dataKey="Blocked" fill="#9ca3af" radius={[4, 4, 0, 0]} /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

<div className="p-6 mt-6 rounded-t-[30px] bg-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Booking Summary</h3>
          <div className="flex gap-4">
            <Filter className="text-gray-500" />
            <Download className="text-gray-500" />
          </div>
        </div>

        {/* <div className="flex  max-w-7xl mx-auto justify-between my-2 items-center h-10 m-2 mt-6">
          <h3 className="text-xl font-bold">Booking Summary</h3>
          <section className="cursor-pointer leading-snug rounded border border-solid border-transparent no-underline font-sans font-semibold transition duration-200 hover:no-underline focus:no-underline focus:outline-none align-middle text-center inline-flex items-center justify-center text-sm py-2 px-4 h-10 rounded-[10px] text-gray-800 bg-transparent hover:bg-gray-900 hover:bg-opacity-[0.06] focus:outline-blue">Go to subscribers

         </section>










         <div className="flex">
                <div className=" flex flex-col   w-40">
                  <SlimSelectBox
                    name="project"
                    label=""
                    className="input "
                    onChange={(value) => {
                      console.log('changed value is ', value.value)
                      setSelProject(value)
                      // formik.setFieldValue('project', value.value)
                    }}
                    value={selProjectIs?.value}
                    // options={aquaticCreatures}
                    options={[
                      ...[{ label: 'All Projects', value: 'allprojects' }],
                      ...projectList,
                    ]}
                  />
                </div>
              </div>

         </div> */}




           <div className="flex  bg-white  items-center flex-row flex-wrap py-1 pb-2 px-2 justify-between">
              {/* <h2 className="text-lg font-semibold text-black leading-light">
                Booked Units Summary
              </h2> */}

              <div className="border rounded-xl  w-[100%]   border-gray-200 flex flex-row justify-between  shadow ">
                <ul
                  className="flex flex-wrap -mb-px  "
                  id="myTab"
                  data-tabs-toggle="#myTabContent"
                  role="tablist"
                >
                  {tabHeadFieldsA.map((d, i) => {
                    return (
                      <ul
                        value={value}
                        key={i}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                      >
                        <li key={i} className="mr-2" role="presentation">
                          <button
                            className={`inline-block py-4 px-4 text-sm font-medium text-center text-gray-700 rounded-t-lg border-b-2   hover:text-gray-600 hover:border-black hover:border-b-2 dark:text-gray-400 dark:hover:text-gray-300  ${
                              value === d.value
                                ? 'border-black text-gray-900 '
                                : 'border-transparent'
                            }`}
                            type="button"
                            role="tab"
                            onClick={() => {
                              setFetchLeadsLoader(true)
                              setValue(d.value)
                              setFetchLeadsLoader(false)
                              setmySelRows(rowsCounter(tableData, d.val))
                            }}
                          >
                            <span
                              className={`font-PlayFair  text-gray-500 ${
                                value === d.value ? ' text-gray-800 ' : ''
                              }`}
                            >
                              {' '}
                              {`${d.lab}`}
                              {
                                <span
                                  className={` font-semibold px-2 py-1 rounded-md ml-[4px] active:bg-green-800  ${
                                    false === true
                                      ? 'bg-[#FFF6F0] text-black '
                                      : 'bg-[#f3f3f3] text-[#61787B]'
                                  } `}
                                >
                                  {
                                    rowsCounter(leadsFetchedData, d.value)
                                      .length
                                  }
                                </span>
                              }
                            </span>
                          </button>
                        </li>
                      </ul>
                    )
                  })}
                </ul>
              </div>

            </div>
    <div className=" max-w-7xl mx-auto rounded-2xl  ">
      {/* <EnhancedTableToolbar
        numSelected={selected.length}
        selStatus={selStatus}
        filteredData={rows}
        searchKey={searchKey}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        setSearchKey={setSearchKey}
        rows={rows}
        viewUnitStatusA={viewUnitStatusA}
        pickCustomViewer={pickCustomViewer}
        setViewUnitStatusA={setViewUnitStatusA}
        leadsFetchedData={leadsFetchedData}
        searchVal={searchVal}
      /> */}
      <section
        style={{background: '#fff', borderRadius: '15px', }}
      >




{/* scroll  */}

{/*
className='max-h-[30px] overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  white:[&::-webkit-scrollbar-track]:bg-neutral-700
  light-gray:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ' */}

<TableContainer sx={{ maxHeight: 640, borderRadius: '15px'  }} className='max-h-[30px] overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  white:[&::-webkit-scrollbar-track]:bg-neutral-700
  light-gray:[&::-webkit-scrollbar-thumb]:bg-neutral-500 '>
        {/* <TableContainer> */}
          <Table
            sx={{  borderRadius: '15px' }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            stickyHeader
            aria-label="sticky table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              searchkey={searchKey}
              viewUnitStatusA={viewUnitStatusA}
            />
               {/* <EnhancedTotalTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              searchkey={searchKey}
              viewUnitStatusA={viewUnitStatusA}
            /> */}

            <TableBody>
              {

              filLeadsA
                  ?.filter((item) => {
                    if (searchKey == '' || !searchKey) {
                      return item
                    }
                    else if (
                      item.Email.toLowerCase().includes(
                        searchKey.toLowerCase()
                      ) ||
                      item.Mobile.toLowerCase().includes(
                        searchKey.toLowerCase()
                      ) ||
                      item.Name.toLowerCase().includes(searchKey.toLowerCase()) ||
                      item.Source.toLowerCase().includes(
                        searchKey.toLowerCase()
                      )
                    ) {
                      return item
                    }
                  })


                  .sort(getComparator(order, orderBy))
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.Name)
                    const labelId = `enhanced-table-checkbox-${index}`
                    const legalCharge = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === '83d81de3-1294-4e96-84bf-07294011b15e') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)
                    const clubHouseCharges = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === 'eceb862f-3977-4e0f-a256-8c372af8cd71') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)
                    const maintenanceCharges = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === '27ee5bf1-0a4e-4b01-90db-39f23b7af804') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)
                    const infraCharges = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === '38bdfbbf-e4df-4b83-b7c1-086f084f8696') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)

                    const partACost =
                    row?.plotCS?.reduce(function (_this, val) {
                        return _this + val.TotalNetSaleValueGsT
                      }, 0) || 0

                    const partBCost =
                    row?.addChargesCS?.reduce(
                        (partialSum, obj) =>
                          partialSum +
                          Number(
                            computeTotal(obj, row?.super_built_up_area || row?.area?.toString()?.replace(',', ''))
                          ),
                        0
                      ) || 0
                      const partCCost =
                      row?.addOnCS?.reduce(
                        (partialSum, obj) =>
                          partialSum +
                          Number(
                            computeTotal(
                              obj,
                              row?.super_built_up_area ||
                              row?.area?.toString()?.replace(',', '')
                            )
                          ),
                        0
                      ) || 0
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                        style={{ cursor: 'pointer' }}

                      >
                        <TableCell
                          align="center"
                          component="th"
                          className='py-3'
                          id={labelId}
                          scope="row"
                          padding="none"
                          size="small"

                          sx={{width: '60px', whiteSpace: 'nowrap', background: '#fff', borderLeft: '0.2px solid #fff',padding: '10px 0',  }}
                        >
                          {index + 1}
                        </TableCell>

                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ width: '142px',whiteSpace: 'nowrap', background: '#fff',  paddingRight: '6px' , paddingLeft: '6px',   borderLeft: '0.2px solid #e7e5e4' , }}

                        >
                          <section>
                            <article className='flex flex-row'>
                            <span className="bg-[#ff7647] text-[#ffffff] w-5 h-5 mr-2 text-[9px] flex items-center justify-center rounded-full flex-shrink-0 font-semibold capitalize" aria-hidden="true"     style={{ backgroundColor: getRandomColor() }} > {row?.customerDetailsObj?.customerName1?.toString()?.charAt(0)}</span>
                            <div className="font-bodyLato text-[#33393d] font-medium">
                            {row?.customerDetailsObj?.customerName1?.toString()}
                            </div>
                            </article>
                            {/* <div className="font-bodyLato">
                            {row?.customerDetailsObj?.email1?.toString()}
                            </div> */}

                          </section>
                        </TableCell>


                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                          sx={{width: '142px',background: '#fff', paddingTop: '4px', paddingBottom:'4px',  borderLeft: '0.2px solid #e7e5e4' , }}

                        >
                          <section>
                            <span className="font-bodyLato">
                            {row?.unit_no}
                            </span>
                          </section>
                        </TableCell>
                          <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',  borderLeft: '0.2px solid #e7e5e4' , textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >

                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>{row.projName}</span>
                        </TableCell>
                        <TableCell align="center" sx={{width: '142px',background: "#FFFF",  borderLeft: '0.2px solid #e7e5e4', }} padding="none">
                        <span className="px-2 uppercase inline-flex text-[10px] leading-5 font-semibold rounded-full  text-[#115e59]">
                          <HighlighterStyle
                            searchKey={searchKey}
                            source={row?.unitStatus?.toString() || row.status.toString()}
                          />
                        </span>
                        </TableCell>

                        <TableCell align="center" sx={{width: '142px', whiteSpace: 'nowrap', background: "#fff", borderLeft: '0.2px solid #e7e5e4' , fontSize:'13px'  }} padding="none">
          {prettyDate(row?.booked_on)}
        </TableCell>
        {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', borderLeft: '0.2px solid #e7e5e4' , fontSize: '13px', paddingRight: '6px', color: '#0ea5e9',    '& span': {
      display: 'inline-block',
      borderBottom: '1px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          <span

  >
    ₹{row?.T_A?.toLocaleString('en-IN')}
  </span>
        </TableCell>)} {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', paddingRight: '6px', color: '#0ea5e9',borderLeft: '0.2px solid #e7e5e4'  , fontSize: '13px',   '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    }  }} padding="none">

  <span

  >
    ₹{row?.T_B?.toLocaleString('en-IN')}
  </span>
        </TableCell>)} {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '1px solid #e0e0e0' , fontSize: '13px',  '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          <span>₹{row?.T_C?.toLocaleString('en-IN')}</span>
        </TableCell>)} {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '1px solid #e0e0e0' ,fontSize: '13px',    '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          <span>₹{row?.T_D?.toLocaleString('en-IN')}</span>
        </TableCell>)}

        {/* {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px' }} padding="none">
        ₹{infraCharges?.toLocaleString('en-IN')}
        </TableCell>)}
       {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px' }} padding="none">
        ₹{clubHouseCharges?.toLocaleString('en-IN')}
        </TableCell>)}
        {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px' }} padding="none">
        ₹{maintenanceCharges?.toLocaleString('en-IN')}
        </TableCell>)}
        {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px'  }} padding="none">
        ₹{legalCharge?.toLocaleString('en-IN')}
        </TableCell>)} */}
       <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap', background: "#fff", borderLeft: '0.2px solid #e7e5e4', paddingRight: '6px', fontSize: '13px' }} padding="none" >
        ₹{row?.T_total?.toLocaleString('en-IN')}
        </TableCell>
        {viewUnitStatusA.includes('Avg sqft Cost') && (<TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.sqft_rate?.toLocaleString('en-IN')}
        </TableCell>)}
        {viewUnitStatusA.includes('Avg sqft Cost') && (<TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.sqft_rate?.toLocaleString('en-IN')}
        </TableCell>)}
        <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#fff", borderLeft: '0.2px solid #e7e5e4', paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.T_approved?.toLocaleString('en-IN')}


        </TableCell>
      <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap',  borderLeft: '0.2px solid #e7e5e4', paddingRight: '6px', fontSize: '13px' ,'& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    }, '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
        ₹{row?.T_balance?.toLocaleString('en-IN')}
        </TableCell>
        {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '0.2px solid #e7e5e4', borderRight: '0.2px solid #e7e5e4' ,fontSize: '13px',   '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          ₹{row?.T_E?.toLocaleString('en-IN')}
        </TableCell>)}

        {viewUnitStatusA.includes('CRM Executive') && <TableCell sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb", fontSize: '13px' }} padding="none">{row?.assignedToObj?.email}</TableCell>}

       {viewUnitStatusA.includes('Sales Executive') && <TableCell sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb",fontSize: '13px'  }} padding="none">{row?.by}</TableCell>}

                        {viewUnitStatusA.includes('Remarks') && (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb",fontSize: '13px'  }}
                          >
                            <>
                              {/* <span className="font-bodyLato">
                          {prettyDate(row?.stsUpT || row.Date).toLocaleString()}
                        </span> */}
                              <span className="px- py-[1px]  min-w-[100px] inline-flex text-xs leading-5 tracking-wide  rounded-full  text-green-800">
                                {Math.abs(
                                  getDifferenceInMinutes(
                                    (row?.leadUpT || row?.stsUpT),
                                    ''
                                  )
                                ) > 60
                                  ? Math.abs(
                                    getDifferenceInMinutes(
                                      (row?.leadUpT || row?.stsUpT),
                                      ''
                                    )
                                  ) > 1440
                                    ? `${Math.abs(getDifferenceInDays(
                                      (row?.leadUpT || row?.stsUpT),
                                      ''
                                    ))} Days `
                                    : `${Math.abs(getDifferenceInHours(
                                      (row?.leadUpT || row?.stsUpT),
                                      ''
                                    ))} Hours `
                                  : `${Math.abs(getDifferenceInMinutes(
                                    (row?.leadUpT || row?.stsUpT),
                                    ''
                                  )) || 0} Min`}{' '}
                                  {/* in above line I have added 0 to take Nan value */}
                                {getDifferenceInMinutes(
                                  (row?.leadUpT || row?.stsUpT),
                                  ''
                                ) < 0
                                  ? 'ago'
                                  : 'Left'}
                              </span>
                            </>
                          </TableCell>)}
                        {viewUnitStatusA.includes('Next Sch') && <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb", fontSize: '13px' }}
                        >
                          <>
                            {/* <span className="font-bodyLato">
                          {prettyDate(row?.stsUpT || row.Date).toLocaleString()}
                        </span> */}
                            <span className="px- py-[1px]  min-w-[100px] inline-flex text-xs leading-5 tracking-wide  rounded-full  text-green-800">
                              {Math.abs(
                                getDifferenceInMinutes(
                                  (row?.schTime),
                                  ''
                                )
                              ) > 60
                                ? Math.abs(
                                  getDifferenceInMinutes(
                                    (row?.schTime),
                                    ''
                                  )
                                ) > 1440
                                  ? `${Math.abs(getDifferenceInDays(
                                    (row?.schTime),
                                    ''
                                  ))} Days `
                                  : `${Math.abs(getDifferenceInHours(
                                    (row?.schTime),
                                    ''
                                  ))} Hours `
                                : `${Math.abs(getDifferenceInMinutes(
                                  (row?.schTime),
                                  ''
                                ))} Min`}{' '}
                              {getDifferenceInMinutes(
                                (row?.schTime),
                                ''
                              ) < 0
                                ? 'ago'
                                : 'Left'}
                            </span>
                          </>
                        </TableCell>
                        }

                      </TableRow>
                    )
                  })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </div>
    </section>
  )
}
