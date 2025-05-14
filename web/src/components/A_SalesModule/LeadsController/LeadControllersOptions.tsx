/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  prettyDateTime,
} from 'src/util/dateConverter'
import {
  SlimDateSelectBox,
  SlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'
import CSVDownloader from '../../../util/csvDownload'
import { CheckCircle, XCircle } from 'lucide-react'
import LeadCreationSettings from './LeadCreationSettings'
import LeadCreationCPsettings from './LeadCreationCPsettings'
import ReEngageCriteria from './ReEngageCriteria'


const torrowDate = new Date(
  +new Date().setHours(0, 0, 0, 0) + 86400000
).getTime()

const LeadControllerOptions = ({
  leadsRawList,
  selUserProfileF,
  searchKey,
  setSearchKey,
  allProjectsA,
  setDateRange,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const [sortedList, setSortedList] = useState([])
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })

  const [uniqueLeadPh, setUniqueLeadPh]= useState(true)
  const [uniqueLeadPhPI, setUniqueLeadPhPI]= useState(true)


  useEffect(() => {
    console.log('yo yo ', leadsRawList)
    const filList = []
    const query = (item) => {
      if (selProjectIs?.value === 'allprojects') {
        return item?.currentStatus === 'unassigned'
      } else {
        return (
          item?.currentStatus === 'unassigned' &&
          item.label === selProjectIs?.label
        )
      }
    }

    const BinQuery = (item) => {
      if (selProjectIs?.value === 'allprojects') {
        return ['DUPLICATE_ENTRY', 'INVALID_DATA'].includes(item?.currentStatus)
      } else {
        return (
          ['DUPLICATE_ENTRY', 'INVALID_DATA'].includes(item?.currentStatus) &&
          item.label === selProjectIs?.label
        )
      }
    }

    if (searchKey.includes('unassigned')) {
      setSortedList(
        leadsRawList
          .filter((item) => query(item))
          .sort((a, b) => {
            return b.cT - a.cT
          })
      )
    } else if (searchKey.includes('DUPLICATE_ENTRY')) {
      setSortedList(
        leadsRawList
          .filter((item) => BinQuery(item))
          .sort((a, b) => {
            return b.cT - a.cT
          })
      )
    } else {
      if (selProjectIs?.value === 'allprojects') {
        setSortedList(
          leadsRawList.sort((a, b) => {
            return b.cT - a.cT
          })
        )
      } else {
        setSortedList(
          leadsRawList
            .filter((item) => item.label === selProjectIs?.label)
            .sort((a, b) => {
              return b.cT - a.cT
            })
        )
      }
    }
  }, [leadsRawList, searchKey, selProjectIs])

  return (
    <Box pb={4}>
      <div className=" w-full bg-white rounded-lg">
        <div className="flex items-center justify-between flex-wrap pb-5 px-4 py-4 bg-gray-50 rounded-t-md">
          <section className="flex flex-row items-center">
            <h2 className="ml-2 text-md font-semibold text-[#171717]">
              Leads Controller
            </h2>
          </section>
        </div>


        <LeadCreationSettings />

        <LeadCreationCPsettings/>

        <ReEngageCriteria />
      </div>
    </Box>
  )
}
export default LeadControllerOptions
