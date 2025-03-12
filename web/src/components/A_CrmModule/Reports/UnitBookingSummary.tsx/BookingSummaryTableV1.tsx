

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


import { Calendar, ChevronRight, SlidersHorizontal, X } from 'lucide-react';




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

import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import Highlighter from 'react-highlight-words'

import CSVDownloader from 'src/util/csvDownload'
import DropCompUnitStatus from 'src/components/dropDownUnitStatus'
import { computeTotal } from 'src/util/computeCsTotals'
import { getAllProjects, getBookedUnitsByProject, getUnitsAgreeByProject } from 'src/context/dbQueryFirebase'
import { Download, Filter } from 'lucide-react'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import PdfBookingSummaryReport from './PdfBookingSummaryReport'






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
  getProjectsListFun()
}, [])
useEffect(() => {
  boot()
}, [projectList])
useEffect(() => {

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






// useEffect(() => {
//   // unitsFetchData
//   console.log('values are', unitsFetchData.length, selProjectIs.uid);
//   switch (selProjectIs.value) {
//     case 'allprojects':
//       return setTableData(unitsFetchData);
//     default:
//       return setTableData(
//         unitsFetchData.filter((dat) => dat?.pId === selProjectIs.uid)
//       );
//   }
// }, [unitsFetchData, selProjectIs]);





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
    const date = new Date(record.Date);
    const month = monthNames[date.getUTCMonth()];
    const booking = projectBookingsData.find(entry => entry.time === month);
    if (booking) {
      booking.value += 1;
    }
  });
  setProjectBookingsData(projectBookingsData)
  console.log('booking details values are',projectBookingsData )
  return projectBookingsData;
}
function updateInventoryData(myDbDataIs) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
let x = []
let y = {available: 0, booked: 0, blocked: 0}
  myDbDataIs.map((record, i) => {

    console.log('project details are', record)



    y.available += record?.availableCount || 0;
    y.booked += record?.bookUnitCount || 0;
    y.blocked += record?.blockedUnitCount || 0;

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
    const newSelected = []


    selUserProfileF('User Profile', row)
    setSelected(newSelected)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const [selBlock, setSelBlock] = useState({})






  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [customDate, setCustomDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);



  const [selectedView, setSelectedView] = useState([]);





const [selectedUnitType, setSelectedUnitType] = useState([]);

const unitTypeOptions = ["Plot", "Villa", "Apartment"];









useEffect(() => {
  console.log("Selected Filters:", selectedFilters);
  console.log("Selected Unit Types:", selectedUnitType);
  console.log("Custom Date:", customDate);
  console.log("Original Data:", unitsFetchData);

  let filteredData = unitsFetchData;


  if (selectedFilters.length > 0) {
    filteredData = filteredData.filter((dat) =>
      selectedFilters.includes(dat.projName)
    );
    console.log("Filtered by Project:", filteredData);
  }


  filteredData = filterByUnitType(filteredData, selectedUnitType);
  console.log("Filtered by Unit Type:", filteredData);


  setTableData(filteredData);
}, [selectedFilters, selectedUnitType, unitsFetchData, customDate]);









const toggleUnitType = (item: string) => {
  setSelectedUnitType((prev) =>
    prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
  );
};



const filterByUnitType = (data, selectedUnitType) => {
  if (selectedUnitType.length === 0) {
    return data;
  }

  return data.filter((row) => selectedUnitType.includes(row.unit_type));
};




const [selectedCostView, setSelectedCostView] = useState([]);

// const costViewOptions = ["Plot Cost", "Construction Cost"];

const toggleCostView = (item) => {
  setSelectedCostView((prev) =>
    prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
  );
};


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

  // lkjhgghh






  {
    id: 'Project',
    numeric: false,
    disablePadding: false,
    align: 'left',
    label: 'Project',
  },
  // {
  //   id: 'Clientdetails',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'Status',
  // },

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
    id: 'AssignedOn',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Facing',
  },

  {
    id: 'share',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Sharing',
  },



  {
    id: 'releasestatus',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Release Status',
  },



  {
    id: 'releasestatus',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Unit Type',
  },

  {
    id: 'AssignedOn',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Plot Area',
  },



  {
    id: 'ratesqft',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Rate/sqft',
  },




  //  ...(selectedCostView.includes("Plot Cost")
  //  ? [
       {
         id: 'PlotCost',
         numeric: false,
         disablePadding: false,
         align: 'center',
         label: 'Plot Cost',
       },
       {
         id: 'PlotCollected',
         numeric: false,
         disablePadding: false,
         align: 'center',
         label: 'Plot Collected',
       },
       {
         id: 'PlotDue',
         numeric: false,
         disablePadding: false,
         align: 'center',
         label: 'Plot Due',
       },
  //    ]
  //  : []),


   {
    id: 'BUA',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'BUA',
  },
  {
    id: 'ConstRateSqft',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Const. Rate/Sqft',
  },



  //  ...(selectedCostView.includes("Construction Cost")
  //  ? [

       {
         id: 'ConstructionCost',
         numeric: false,
         disablePadding: false,
         align: 'center',
         label: 'Construction Cost',
       },
       {
         id: 'ConstCollected',
         numeric: false,
         disablePadding: false,
         align: 'center',
         label: 'Const Collected',
       },
       {
         id: 'ConstDue',
         numeric: false,
         disablePadding: false,
         align: 'center',
         label: 'Const Due',
       },
  //    ]
  //  : []),







  // {
  //   id: 'AssignedOn',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'BUA',
  // },





  // {
  //   id: 'AssignedOn',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'Const. Rate/Sqft',
  // },





  // {
  //   id: 'AssignedOn',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'Construction Cost',
  // },





  {
    id: 'AssignedOn',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'CRM',
  },





  {
    id: 'AssignedOn',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Sale Manager',
  },



  {
    id: 'AssignedOn',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Status Updated Date',
  },




  {
    id: 'Age',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Ageing',
  },











  // {
  //   id: 'bua',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'BUA',
  // },



  // {
  //   id: 'bua',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'BUA',
  // },





  // {
  //   id: 'crm Manager',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'Ageing',
  // },








  // {
  //   id: 'AssignedOn',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'Const Collected',
  // },

  // {
  //   id: 'AssignedOn',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'Const Due',
  // },


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










  const [projects, setProjects] = useState([]);


  useEffect(() => {
    if (unitsFetchData.length > 0) {
      setProjects([...new Set(unitsFetchData.map((item) => item.projName))]);
    }
  }, [unitsFetchData]);

  const amenities = projects;




  const bookingOptions = ["This Week", "This Month", "Last 6 Months", "Custom Date"];




  const toggleFilter = (item) => {
    setSelectedFilters((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );

    if (item === "Custom Date") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };



  const filterByBookingDate = (data, selectedFilters) => {
    const currentDate = new Date();

    return data.filter((row) => {
      const bookedDate = new Date(row.booked_on);


      if (selectedFilters.includes("This Week")) {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        return bookedDate >= startOfWeek && bookedDate <= currentDate;
      }

      if (selectedFilters.includes("This Month")) {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return bookedDate >= startOfMonth && bookedDate <= currentDate;
      }

      if (selectedFilters.includes("Last 6 Months")) {
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        return bookedDate >= sixMonthsAgo && bookedDate <= currentDate;
      }

      if (selectedFilters.includes("Custom Date") && customDate) {
        const customDateObj = new Date(customDate);
        return bookedDate.toDateString() === customDateObj.toDateString();
      }

      return true;
    });
  };


  useEffect(() => {
    let filteredData = unitsFetchData;


    if (selectedFilters.length > 0) {
      filteredData = filteredData.filter((dat) =>
        selectedFilters.includes(dat.projName)
      );
    }


    filteredData = filterByBookingDate(filteredData, selectedFilters);


    setTableData(filteredData);
  }, [selectedFilters, unitsFetchData, customDate]);







    const computeCosts = (row) => {
      const plotCost = row?.plotCS?.reduce((sum, val) => sum + val.TotalNetSaleValueGsT, 0) || 0;
      const constructionCost = row?.addChargesCS?.reduce((sum, obj) =>
        sum + Number(computeTotal(obj, row?.super_built_up_area || row?.area?.toString()?.replace(',', ''))),
        0
      ) || 0;

      return { plotCost, constructionCost };
    };


    const computeTotal = (obj, area) => {

      return obj.charges * Number(area);
    };


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
    console.log(payload);
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



  }
  return (


    <TableHead style={{ height: '10px', borderRadius: '2xl' ,  position: 'sticky', top: 0, backgroundColor: '#F0F2F5', zIndex: 10 }}>
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


            paddingLeft: '14px',
            paddingRight: '29px',
            marginRight: '10px',
          }}
        >




          <TableSortLabel style={{ color: '#000',fontWeight: '600' }}>S.No</TableSortLabel>
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


  //  /* Construction Table */








































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







const customTooltip = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="bg-white  rounded-lg p-4 shadow-lg text-sm">
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

















<div className='max-w-7xl  mt-4 mx-auto'>
<div className="grid grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-xl p-6  shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Sold Units</h3>
    <p className="text-2xl font-bold mb-2">  {unitsFetchData?.length?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">

      <span className="text-gray-500">{leadsFetchedData?.length} Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md ">
    <h3 className="text-gray-600 mb-2">Sales</h3>
    <p className="text-2xl font-bold mb-2">₹ {Math.round(totalSaleValue)?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">

      <span className="text-gray-500">{leadsFetchedData?.length} Units</span>
    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Recieved</h3>
    <p className="text-2xl font-bold mb-2">₹ {Math.round(totalReceived)?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">

      <span className="text-gray-500">{leadsFetchedData?.length} Units</span>
    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Balance</h3>
    <p className="text-2xl font-bold mb-2">₹ {Math.round(selTotalBalance)?.toLocaleString('en-IN')}</p>
    <div className="flex items-center gap-2 text-red-500">

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
            {/* <div className="flex items-center text-[#00A236]">
              <TrendingUp className="w-5 h-5 mx-3" />
              <span className="text-[18px]">23%</span>
            </div> */}
          </div>
        </div>


    <div className="flex ml-8  py-2 mb-4 gap-2 text-gray-600">
      <Calendar className="w-5 h-5" />
      <span>Jan 01, 2024</span>
      <ChevronRight className="w-5 h-5" />
      <i data-lucide="arrow-right"></i>
      <span>Dec 31, 2024</span>
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

                axisLine={false}
                tickLine={false}
                stroke="#3D3D3D"
              />




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





<div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
  <div className="w-full max-w-4xl p-6 bg-white flex flex-col justify-between h-full">
    <div className="mb-6">
      <h2 className="text-[18px] text-[#6A6A6A] font-medium">Units</h2>
      <div className="flex items-center justify-between mt-1">
        <div className="text-[30px] font-semibold text-[#00000]">{inventoryPayload.reduce((acc, curr) => acc + curr.count, 0)?.toLocaleString('en-IN')}</div>

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
           />
          <Tooltip content={customTooltipone} />
<Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />

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

           />
          <Tooltip content={customTooltipone} />

<Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>









<div className='p-4 mt-6 rounded-t-[30px] bg-white  rounded-[30px]'>
<div className='border-2 rounded-[30px] border-[#f1f1f1] p-4'>




<div className=" px-4 py-2 rounded-t-[30px] bg-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Booking Summary</h3>



<div className="relative flex gap-4">





<button
  className="relative flex items-center gap-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
  onClick={() => setIsOpen(!isOpen)}
>

  <SlidersHorizontal className="w-4 h-4 text-gray-500" />
  <span className="text-gray-700 text-sm">Filters</span>


  {selectedFilters.length + selectedUnitType.length > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#38BDF8] text-white text-xs font-bold flex items-center justify-center rounded-full">
      {selectedFilters.length  + selectedUnitType.length}
    </span>
  )}


  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition">
    Sorting
  </span>
</button>







<button
  className="relative flex items-center gap-2  rounded-md border border-gray-300 hover:bg-gray-100 transition"
>

  {/* <Download className="w-4 h-4 text-gray-500" />
  <span className="text-gray-700 text-sm"> */}
  <PdfBookingSummaryReport/>
  {/* </span> */}





  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition">
    Download
  </span>
</button>













      <div
        className={`absolute right-20 top-full mt-2 bg-white w-[500px] max-h-[70vh] flex flex-col rounded-xl shadow-lg border border-gray-200 z-50 transition-all ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500">
            <X/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[60vh]">
          <h3 className="mt-4 text-sm font-semibold">Projects</h3>


<div className="flex flex-wrap gap-2 mt-2">
  {projectList.slice(0, showMore ? projectList.length : 6).map((item) => (
    <button
      key={item.id}
      className={`relative px-3 py-1 border rounded-full text-[12px] text-gray-700 hover:bg-gray-100 border-gray-300 ${
        selectedFilters.includes(item.projectName) ? "bg-gray-200" : ""
      }`}
      onClick={() => toggleFilter(item.projectName)}
    >
      {selectedFilters.includes(item.projectName) && (
        <span className="absolute top-[-2px] left-1 w-2 h-2 bg-[#38BDF8] rounded-full"></span>
      )}
      {item.projectName}
    </button>
  ))}
</div>

          <button onClick={() => setShowMore(!showMore)} className="mt-2 text-blue-600 text-sm underline">
            {showMore ? "Show less" : "Show more"}
          </button>


          <h3 className="mt-4 text-sm font-semibold">Booking Dates</h3>


<div className="flex flex-wrap gap-2 mt-2">
  {bookingOptions.map((option) =>
    option === "Custom Date" && showDatePicker ? (
      <div
        key={option}
        className="relative flex items-center border border-gray-300 rounded-full px-3 py-1 text-sm"
      >
        <CustomDatePicker
          selected={customDate}
          onChange={(date) => {
            setCustomDate(date);
            if (date && !selectedFilters.includes("Custom Date")) {
              setSelectedFilters([...selectedFilters, "Custom Date"]);
            }
          }}
          placeholder="Pick a date"
        />
        {customDate && (
          <span className="absolute top-0 left-1 w-2 h-2 bg-[#38BDF8] rounded-full"></span>
        )}
        <Calendar className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
        <button
          onClick={() => {
            setCustomDate(null);
            setShowDatePicker(false);
            setSelectedFilters((prev) => prev.filter((i) => i !== "Custom Date"));
          }}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ) : (
      <button
        key={option}
        onClick={() => toggleFilter(option)}
        className={`relative px-3 py-1 border rounded-full text-gray-700 hover:bg-gray-100 border-gray-300 text-[12px] ${
          selectedFilters.includes(option) ? "bg-gray-200" : ""
        }`}
      >
        {selectedFilters.includes(option) && (
          <span className="absolute top-0 left-1 w-2 h-2 bg-green-500 rounded-full"></span>
        )}
        {option}
      </button>
    )
  )}
</div>





<h3 className="text-sm font-semibold mt-4">Unit Type</h3>


<div className="flex flex-wrap gap-2 mt-2">
  {unitTypeOptions.map((option) => (
    <button
      key={option}
      className={`relative px-3 py-1 border rounded-full text-gray-700 hover:bg-gray-100 border-gray-300 text-[12px] ${
        selectedUnitType.includes(option) ? "bg-gray-200" : ""
      }`}
      onClick={() => toggleUnitType(option)}
    >
      {selectedUnitType.includes(option) && (
        <span className="absolute top-0 left-1 w-2 h-2 bg-[#38BDF8] rounded-full"></span>
      )}
      {option}
    </button>
  ))}
</div>



{/* <h3 className="text-sm font-semibold mt-4">Cost View</h3> */}



{/* <div className="flex flex-wrap gap-2 mt-2">
        {costViewOptions.map((view) => (
          <button
            key={view}
            className={`relative px-3 py-1 border rounded-full text-gray-700 hover:bg-gray-100 border-gray-300 text-[12px] ${
              selectedCostView.includes(view) ? "bg-gray-200" : ""
            }`}
            onClick={() => toggleCostView(view)}
          >
            {selectedCostView.includes(view) && (
              <span className="absolute top-0 left-1 w-2 h-2 bg-[#38BDF8] rounded-full"></span>
            )}
            {view}
          </button>
        ))}
      </div> */}






        </div>

        <div className="px-4 py-3 border-t flex justify-between items-center bg-gray-50 rounded-b-xl text-sm">
          <button className="text-gray-500" onClick={() => {setSelectedFilters([]);  setSelectedUnitType([]); setCustomDate(null); setShowDatePicker(false); }}>
            Clear all
          </button>
          <button className=" text-[#38BDF8] px-4 py-2 rounded-lg text-sm">
            {selectedFilters.length  + selectedUnitType.length> 0 ? `Count ${selectedFilters.length  + selectedUnitType.length} showing` : "showing"}
          </button>
        </div>
      </div>
</div>










        </div>







<div className="flex  bg-white  items-center flex-row flex-wrap py-1 pb-2 px-2 justify-between">

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

      <section
        style={{background: '#fff', borderRadius: '15px', }}
      >





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
                          sx={{ width: '142px',whiteSpace: 'nowrap', background: '#fff',  paddingRight: '6px' , paddingLeft: '6px',   }}

                        >
                          <section>
                            <article className='flex flex-row'>
                            <span className="bg-[#ff7647] text-[#ffffff] w-5 h-5 mr-2 text-[9px] flex items-center justify-center rounded-full flex-shrink-0 font-semibold capitalize" aria-hidden="true"     style={{ backgroundColor: getRandomColor() }} > {row?.customerDetailsObj?.customerName1?.toString()?.charAt(0)}</span>
                            <div className="font-bodyLato text-[#33393d] font-medium">
                            {row?.customerDetailsObj?.customerName1?.toString()}
                            </div>
                            </article>


                          </section>
                        </TableCell>


                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                          sx={{width: '142px',background: '#fff', paddingTop: '4px', paddingBottom:'4px',  }}

                        >
                          <section>
                            <span className="font-bodyLato">
                            {row?.unit_no}

                            </span>
                          </section>
                        </TableCell>



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {row?.projName}


                          </span>
                        </TableCell>



                        {/* <TableCell align="center" sx={{width: '142px',background: "#FFFF",  }} padding="none">
                        <span className="px-2 uppercase inline-flex text-[10px] leading-5 font-semibold rounded-full  text-[#115e59]">
                          <HighlighterStyle
                            searchKey={searchKey}
                            source={row?.unitStatus?.toString() || row.status.toString()}
                          />
                        </span>
                        </TableCell> */}

                        <TableCell align="center" sx={{width: '142px', whiteSpace: 'nowrap', background: "#fff",  fontSize:'13px'  }} padding="none">
          {prettyDate(row?.booked_on)}
        </TableCell>



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {row?.facing}


                          </span>
                        </TableCell>

                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {row?.sharing}


                          </span>
                        </TableCell>


                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {row?.release_status}


                          </span>
                        </TableCell>


                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {row?.unit_type}


                          </span>
                        </TableCell>


                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {row?.area}


                          </span>
                        </TableCell>






                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {row?.sqft_rate}


                          </span>
                        </TableCell>

{/*
                        {selectedCostView.includes("Plot Cost") && (

                          <> */}



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                            {/* {row?.T_A} */}
                            {Math.round(row?.T_A)}



                          </span>
                        </TableCell>






                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       NA


                          </span>
                        </TableCell>



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       NA


                          </span>
                        </TableCell>
{/*
                          </>

                   )} */}





<TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       {row?.construct_area}


                          </span>
                        </TableCell>


                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                          {row?.construct_price_sqft}








                          </span>
                        </TableCell>











                        {/* {selectedCostView.includes("Construction Cost") && (


                         <> */}



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       NA


                          </span>
                        </TableCell>



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       NA


                          </span>
                        </TableCell>





                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       NA


                          </span>
                        </TableCell>
                         {/* </>






)} */}

                        {/* <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       Ageing


                          </span>
                        </TableCell> */}



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                       NA


                          </span>
                        </TableCell>



                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                           NA


                          </span>
                        </TableCell>


                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                           NA


                          </span>
                        </TableCell>


                        <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',   textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >



                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>
                           NA


                          </span>
                        </TableCell>











        {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap',  fontSize: '13px', paddingRight: '6px', color: '#0ea5e9',    '& span': {
      display: 'inline-block',
      borderBottom: '1px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4',
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
      borderBottom: '0.2px solid #e7e5e4',
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
      borderBottom: '0.2px solid #e7e5e4',
    } }} padding="none">
          <span>₹{row?.T_C?.toLocaleString('en-IN')}</span>
        </TableCell>)} {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '1px solid #e0e0e0' ,fontSize: '13px',    '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4',
    } }} padding="none">
          <span>₹{row?.T_D?.toLocaleString('en-IN')}</span>
        </TableCell>)}


       <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap', background: "#fff",  paddingRight: '6px', fontSize: '13px' }} padding="none" >
        ₹{row?.T_total?.toLocaleString('en-IN')}
        </TableCell>
        {viewUnitStatusA.includes('Avg sqft Cost') && (<TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.sqft_rate?.toLocaleString('en-IN')}
        </TableCell>)}
        {viewUnitStatusA.includes('Avg sqft Cost') && (<TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.sqft_rate?.toLocaleString('en-IN')}
        </TableCell>)}
        <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#fff",  paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.T_approved?.toLocaleString('en-IN')}


        </TableCell>
      <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap',   paddingRight: '6px', fontSize: '13px' ,'& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    }, '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4',
    } }} padding="none">
        ₹{row?.T_balance?.toLocaleString('en-IN')}
        </TableCell>
        {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '0.2px solid #e7e5e4', borderRight: '0.2px solid #e7e5e4' ,fontSize: '13px',   '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4',
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




</div>
</div>






    </section>
  )
}
