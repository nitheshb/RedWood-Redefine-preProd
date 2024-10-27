/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect, useState } from 'react'

import ReportSideWindow from 'src/components/SiderForm/ReportSideView'
import { streamMortgageList } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CSVDownloader from 'src/util/csvDownload'

const CrmMortgageSummaryTable = ({ projects }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [selectedOption, setSelectedOption] = useState('All')
  const [isOpenSideForm, setReportSideForm] = React.useState(false)
  const [isImportLeadsOpen, setisImportLeadsOpen] = React.useState(false)
  const [customerDetails, setCustomerDetails] = React.useState({})
  const [drillDownPayload, setDrillDownPayload] = React.useState([])
  const [subTitle, setSubTitle] = React.useState('false')
  const [selUnitStatus, seTUnitStatus] = React.useState('false')

  const [fetchMortUnitsList, setFetchMortUnitsList] = useState([])
  const showDrillDownFun = async (text, data, typeA) => {
    // Display sideForm
    setReportSideForm(true)
    setDrillDownPayload(data)
    setSubTitle(text)
    seTUnitStatus(typeA)
  }


  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => {
      return acc + (item[key] || 0)
    }, 0)
  }

  const totalUnitsSummary = calculateTotal(projects, 'totalUnitCount')
  const totalAvailableSummary = calculateTotal(projects, 'availableCount')
  const totalSoldSummary = calculateTotal(projects, 'soldUnitCount')
  const totalBlockedSummary = calculateTotal(projects, 'blockedUnitCount')
  const totalMortgagedSummary = calculateTotal(projects, 'mortgaged')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }



  const styles = {
    customTopBottomShadow: {
      boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    }


  };


  useEffect(() => {
  // get details from db for mortgage table

  const unsubscribe = streamMortgageList(
    orgId,
    (querySnapshot) => {
      const usersListA = querySnapshot.docs.map((docSnapshot) =>
        docSnapshot.data()
      )

      usersListA.map((user) => {
       const x =  projects.filter((data) => data.uid === user.pId)
        user.projectName = x[0]['projectName']

      })

      setFetchMortUnitsList(usersListA.sort((a, b) => {
         // First, compare project names (case-insensitive)
  const projectNameComparison = a.projectName.localeCompare(b.projectName, undefined, { sensitivity: 'base' });

  if (projectNameComparison !== 0) {
    // If project names are different, sort by projectName
    return projectNameComparison;
  }

  // If project names are the same, sort by unit_no
  return a.unit_no - b.unit_no;
      }))

      console.log('fetched users list is', usersListA)


    },
    () => setFetchMortUnitsList([])
  )

  return unsubscribe
  }, [projects])

  return (
    <div className="bg-white flex justify-start r">
      <div className="overflow-x-auto mx-4">
        <div className="">
          <div className="flex justify-between mb-4 mt-2">
            <div>
              <p className="font-bold text-black p-1 m-1">
                Project Mortgage Details
              </p>
            </div>

            <div>
            <select
              className="mr-2"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="All">Project Name</option>
              {/* <option value="Unit Type">Unit Type</option>
              <option value="Unit Facing">Unit Facing</option>
              <option value="Unit Status">Unit Status</option>
              <option value="Unit Area">Unit Area</option> */}
            </select>
            <Tooltip title={`Download ${fetchMortUnitsList?.length} Row`}>
            {/* <IconButton>
            <FileDownloadIcon />
            <CSVDownloader />
          </IconButton> */}

            <CSVDownloader
              className="mr-6 h-[20px] w-[20px]"
              downloadRows={fetchMortUnitsList}
              sourceTab="Mortgage Details"

              style={{ height: '20px', width: '20px' }}
            />
          </Tooltip>
            </div>
          </div>

          <div className="rounded my-3 overflow-x-auto">
            <table className=" border-collapse">
              <thead>
                <tr className="bg-[#F5F5F7] text-gray-900  text-sm leading-normal">
                  <th
                    className="py-1 px-2 text-center border border-gray-300"
                    colSpan="10"
                  >
                    Poject Mortgage Details
                  </th>
                </tr>
                <tr className="bg-[#DDD1F5] text-gray-900  text-sm leading-normal" >
                  <th className="py-1 px-3 text-left border border-gray-300">
                    Project Name
                  </th>
                  <th
                    className="py-1 px-3 text-left border border-gray-300"
                    colSpan="1"
                  >
                    Unit No
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    SY No
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    Land Owner Name
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    Doc Type
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    Registration Date
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    Registered To
                  </th><th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    Doc Number
                  </th><th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    Status
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-300"
                    colSpan="1"
                  >
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-900 text-sm font-light">
                {fetchMortUnitsList.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 text-[#33393d] font-[400]">
                    <td
                      className="py- px-3 text-left border border-gray-300  cursor-pointer "
                      onClick={() => {

                      }}
                    >
                      {item.projectName}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-300  cursor-pointer "
                      onClick={() => {

                      }}
                    >
                      {item.unit_no}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-300 cursor-pointer "
                      onClick={() => {

                      }}
                    >
                      {item.survey_no}
                    </td>
                    <td
                      className="py- px-6 text-left border border-gray-300  cursor-pointer "
                      onClick={() => {

                      }}
                    >
                      {item.land_owner_name}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-300  cursor-pointer  hover:underline-offset-4"
                      onClick={() => {

                      }}
                    >
                      {item?.doc_type}
                    </td>
                    <td className="py- px-6 text-right border border-gray-300 ">
                      {item.date_of_registration}
                    </td>  <td className="py- px-6 text-right border border-gray-300 ">
                      {item.to_whom}
                    </td>  <td className="py- px-6 text-right border border-gray-300 ">
                      {item.doc_no}
                    </td>  <td className="py- px-6 text-right border border-gray-300 ">
                      {item.status}
                    </td><td className="py- px-6 text-right border border-gray-300 ">
                      {item.remarks}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ReportSideWindow
        open={isOpenSideForm}
        setOpen={setReportSideForm}
        title="Unit Inventory"
        subtitle={subTitle}
        setCustomerDetails={setCustomerDetails}
        setisImportLeadsOpen={setisImportLeadsOpen}
        leadsLogsPayload={drillDownPayload}
        widthClass="max-w-7xl"
        unitsViewMode={undefined}
        setIsClicked={undefined}
        selUnitStatus={selUnitStatus}
      />
    </div>
  )
}

export default CrmMortgageSummaryTable
