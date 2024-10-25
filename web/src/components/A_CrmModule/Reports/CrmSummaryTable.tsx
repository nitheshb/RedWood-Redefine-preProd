/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'

import ReportSideWindow from 'src/components/SiderForm/ReportSideView'

const CrmInventorySummaryTable = ({ projects }) => {
  const [selectedOption, setSelectedOption] = useState('All')
  const [isOpenSideForm, setReportSideForm] = React.useState(false)
  const [isImportLeadsOpen, setisImportLeadsOpen] = React.useState(false)
  const [customerDetails, setCustomerDetails] = React.useState({})
  const [drillDownPayload, setDrillDownPayload] = React.useState([])
  const [subTitle, setSubTitle] = React.useState('false')
  const [selUnitStatus, seTUnitStatus] = React.useState('false')

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


  // const styles = {
  //   customTopShadow: {
  //     boxShadow: `rgba(60, 64, 67, 0.3) 0px -2px 2px 0px, rgba(60, 64, 67, 0.15) 0px -1px 5px 0px`,

  //   },
  // };

  // const styles = {
  //   customTopBottomShadow: {
  //     boxShadow: `
  //       rgba(60, 64, 67, 0.3) 0px -2px 2px 0px,
  //       rgba(60, 64, 67, 0.15) 0px -1px 5px 0px,
  //       rgba(60, 64, 67, 0.3) 0px 2px 2px 0px,
  //       rgba(60, 64, 67, 0.15) 0px 1px 5px 0px
  //     `,
  //   },
  // };




  const styles = {
    customTopBottomShadow: {
      boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    }


  };




  const totalUnitsSummary = calculateTotal(projects, 'totalUnitCount')
  const totalAvailableSummary = calculateTotal(projects, 'availableCount')
  const totalSoldSummary = calculateTotal(projects, 'soldUnitCount')
  const totalBlockedSummary = calculateTotal(projects, 'blockedUnitCount')
  const totalMortgagedSummary = calculateTotal(projects, 'mortgaged')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div className="bg-white flex justify-start ">
      <div className="overflow-x-auto mx-4">
        <div className="">
          <div className="flex justify-between mb-4 mt-2">
            <div>
              <p className="font-bold text-black p-1 m-1">
                CRM Inventory Report
              </p>
            </div>

            <select
              className="mr-2"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="All">Project Name</option>
              <option value="Unit Type">Unit Type</option>
              <option value="Unit Facing">Unit Facing</option>
              <option value="Unit Status">Unit Status</option>
              <option value="Unit Area">Unit Area</option>
            </select>
          </div>

          <div className="rounded my-3 overflow-x-auto">
            <table className=" border-collapse">
              <thead>
                <tr className="bg-[#fff] text-gray-900   text-sm leading-normal">
                  <th
                    className="py-1 px-2 text-center border bg-[#F5F5F7]  border-gray-200"
                    colSpan="6"
                  >
                    Inventory Summary Report By Project
                  </th>
                </tr>
                <tr className="bg-[#FFF6F0] text-gray-900   text-sm leading-normal"
                >
                  <th className="py-1 px-3 text-left border border-gray-200">
                    Project Name
                  </th>
                  <th
                    className="py-1 px-3 text-left border border-gray-200"
                    colSpan="1"
                  >
                    Total Units
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-200"
                    colSpan="1"
                  >
                    Available
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-200"
                    colSpan="1"
                  >
                    Sold
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-200"
                    colSpan="1"
                  >
                    Blocked
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-gray-200"
                    colSpan="1"
                  >
                    Mortgaged
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-900 text-sm font-light">
                {projects.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 text-[#33393d] font-[400]">
                    <td
                      className="py- px-3 text-left border border-gray-200 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                          'available',
                          'booked',
                          'blockedUnitCount',
                          'blocked',
                          'management_blocked',
                        ])
                      }}
                    >
                      {item.projectName}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-200 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                          'available',
                          'booked',
                          'blockedUnitCount',
                          'blocked',
                          'management_blocked',
                        ])
                      }}
                    >
                      {item.totalUnitCount}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-200 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                          'available',

                        ])
                      }}
                    >
                      {item.availableCount}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-200 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [

                          'booked',
                          'allotment',
                          'agreement_pipeline',
                          'agreement',
                          'registered',
                          'construction',
                          'possession'

                        ])
                      }}
                    >
                      {item.soldUnitCount}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-200 text-black cursor-pointer hover:underline-offset-4"
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [

                          'blockedUnitCount',
                          'blocked',
                          'management_blocked',
                        ])
                      }}
                    >
                      {item?.blockedUnitCount ||
                        0 + item.management_blocked ||
                        0}
                    </td>
                    <td className="py- px-6 text-right border border-gray-200 font-semibold">
                      {item.mortgaged}
                    </td>
                  </tr>
                ))}
                <tr className="bg-white text-gray-900  text-sm leading-normal text-[#33393d] font-[400]">
                  <td className="py- px-3 text-left border border-gray-200">
                    Totals:
                  </td>
                  <td className="py- px-6 text-right border border-gray-200">
                    {totalUnitsSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-200">
                    {totalAvailableSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-200">
                    {totalSoldSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-200">
                    {totalBlockedSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-200">
                    {totalMortgagedSummary}
                  </td>
                </tr>
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

export default CrmInventorySummaryTable
