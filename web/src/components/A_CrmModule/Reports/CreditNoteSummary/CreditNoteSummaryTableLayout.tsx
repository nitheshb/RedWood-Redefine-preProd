import { useEffect, useState } from 'react'

import {
  Box as Section,
  Card,
  Grid,
  Tooltip,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import DropCompUnitStatus from 'src/components/dropDownUnitStatus'
import LogSkelton from 'src/components/shimmerLoaders/logSkelton'
import CSVDownloader from 'src/util/csvDownload'

import CreditNoteSummaryTableBody from './CreditNoteSummaryTable'

const rowsCounter = (parent, searchKey) => {
  return searchKey === 'all'
    ? parent
    : parent.filter(
        (item) => item?.status?.toLowerCase() === searchKey.toLowerCase()
      )
}

const CreditNoteSummaryTableLayout = ({
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
  const [tableData, setTableData] = useState([])
  const [tabHeadFieldsA, settabHeadFieldsA] = useState([])

  const [statusSepA, setStatusSepA] = useState([])

  const [finalKeyA, setFinalKeyA] = useState([])

  useEffect(() => {


    const tabHeadFieldsA1 = [
      { value: 'all', lab: 'All', val: 'all' },

    ]

    settabHeadFieldsA(tabHeadFieldsA1)

    leadsTyper === 'inProgress'
      ? setValue('all')
      : leadsTyper === 'archieveLeads'
      ? setValue('archieve_all')
      : setValue('booked')
  }, [])
  const [val, setVal] = React.useState('one')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }

  const archieveTab = [
    { lab: 'Archieve', val: 'archieve_all' },
    { lab: 'Dead', val: 'dead' },
    { lab: 'Not Interested', val: 'notinterested' },
    { lab: 'Blocked', val: 'blocked' },
    { lab: 'Junk', val: 'junk' },
  ]
  const [activeAll, setactiveAll] = React.useState<boolean>(true)
  const [activeNew, setactiveNew] = React.useState<boolean>(false)
  const [activeFollow, setactiveFollow] = React.useState<boolean>(false)
  const [activeVisitFixed, setactiveVisitFixed] = React.useState<boolean>(false)
  const [activeNeg, setactiveNeg] = React.useState<boolean>(false)
  const [activeUn, setactiveUn] = React.useState<boolean>(false)
  const [activeArch, setactiveArch] = React.useState<boolean>(true)
  const [activeDead, setactiveDead] = React.useState<boolean>(false)
  const [activeBlock, setactiveBlock] = React.useState<boolean>(false)
  const [activeJunk, setactiveJunk] = React.useState<boolean>(false)
  const [activeNotIn, setactiveNotIn] = React.useState<boolean>(false)
  const [activeBook, setactiveBook] = React.useState<boolean>(true)
  const [newStatusA, setNewStatusA] = useState([])
  const [followupA, setfollowupA] = useState([])
  const [mySelRows, setmySelRows] = useState([])
  const [viewUnitStatusA, setViewUnitStatusA] = React.useState([
    'Phone No',
    'Last Activity',
  ])

  const newStatus = []
  const followup = []
  const all = leadsFetchedData
  const visitfixed = []
  const visitdone = []
  const vistcancel = []
  const negotiation = []
  const unassigned = []
  const others = []
  const findCount = (val) => {
    if (val === 'new') {
      return newStatus.length
    } else if (val === 'all') {
      return all.length
    } else if (val === 'followup') {
      return followupA.length
    } else if (val === 'visitfixed') {
      return visitfixed.length
    } else if (val === 'visitdone') {
      return visitdone.length
    } else if (val === 'negotiation') {
      return negotiation.length
    } else if (val === 'unassigned') {
      return unassigned.length
    }
  }



  const [filLeadsA, setFilLeadsA] = useState([])

  useEffect(() => {

    console.log('selected value is', value)
    setFetchLeadsLoader(false)
    setFilLeadsA(leadsFetchedData)

  }, [leadsFetchedData])

  const pickCustomViewer = (item) => {
    const newViewer = viewUnitStatusA
    if (viewUnitStatusA.includes(item)) {
      const filtered = newViewer.filter(function (value) {
        return value != item
      })
      setViewUnitStatusA(filtered)
      console.log('reviwed is ', viewUnitStatusA)
    } else {
      setViewUnitStatusA([...newViewer, item])
      console.log('reviwed is add ', viewUnitStatusA)
    }
  }
  return (
    <Section pb={4}>
      <Card
        sx={{
          boxShadow: 4,
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <div className="border-b border-gray-200 flex flex-row justify-between ">
              <ul
                className="flex flex-wrap -mb-px "
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
                            setmySelRows(rowsCounter(leadsFetchedData, d.val))
                          }}
                        >
                          <span
                            className={`font-PlayFair text-gray-450 ${
                              value === d.value
                                ? 'text-[#0080ff] text-gray-800 '
                                : ''
                            }`}
                          >
                            {' '}
                            {`${d.lab}`}
                            {
                              <span
                                className={` font-semibold px-2 py-1 rounded-md ml-[4px] active:bg-green-800  ${
                                  activeNew === true
                                    ? 'bg-green-400 text-black '
                                    : 'bg-green-200 text-green-700'
                                } `}
                              >
                                {rowsCounter(leadsFetchedData, d.value).length}
                              </span>
                            }
                          </span>
                        </button>
                      </li>
                    </ul>
                  )
                })}
              </ul>
              <section className="pt-1 mt-2 mx-3">
                <DropCompUnitStatus
                  type={'Show Fields'}
                  id={'id'}
                  setStatusFun={{}}
                  viewUnitStatusA={viewUnitStatusA}
                  pickCustomViewer={pickCustomViewer}
                />
                {filLeadsA.length > 0 && <Tooltip title={`Download ${filLeadsA?.length} Row`}>
                    <CSVDownloader
                      className="mr-6 h-[20px] w-[20px]"
                      downloadRows={leadsFetchedData}
                      style={{ height: '20px', width: '20px' }}
                    />
                  </Tooltip>}
              </section>
            </div>

            {fetchLeadsLoader &&
              [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}
            {statusSepA[0]?.[value].length === 0 && (
              <div className="flex items-center py-6">
                <span
                  className="text-xs text-gray-500"
                  style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    // width: '50%',
                  }}
                >
                  No Records
                </span>
              </div>
            )}
            {statusSepA[0]?.[value].length != 0 && (
              <CreditNoteSummaryTableBody
                // data={filterTable}
                fetchLeadsLoader={fetchLeadsLoader}
                selStatus={value}
                rowsParent={statusSepA[0]}
                selUserProfileF={selUserProfileF}
                viewUnitStatusA={viewUnitStatusA}
                newArray={statusSepA[0]?.[value]}
                leadsFetchedData={filLeadsA}
                mySelRows={mySelRows}
                searchVal={searchVal}
              />

            )}
          </Grid>
        </Grid>
      </Card>
    </Section>
  )
}

export default CreditNoteSummaryTableLayout
