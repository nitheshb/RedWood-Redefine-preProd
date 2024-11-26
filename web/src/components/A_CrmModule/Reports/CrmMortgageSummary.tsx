/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Tooltip from '@mui/material/Tooltip'
import { ChevronDown } from 'lucide-react'
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


    <div className='bg-white'>



<div className='max-w-7xl mx-auto mt-6'>
<div className="grid grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-xl p-6  shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Sold Units</h3>
    <p className="text-2xl font-bold mb-2"></p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">157 Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md ">
    <h3 className="text-gray-600 mb-2">Sales</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Balance</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Recieved</h3>
    <p className="text-2xl font-bold mb-2">₹</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">Units</span>
    </div>
  </div>
</div>
</div>














          <div className=" w-full max-w-7xl mx-auto">
      <div className="">
        <div className="">
          {/* <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xl font-medium text-gray-800">
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
 
            </select>
            <Tooltip title={`Download ${fetchMortUnitsList?.length} Row`}>

            <CSVDownloader
              className="mr-6 h-[20px] w-[20px]"
              downloadRows={fetchMortUnitsList}
              sourceTab="Mortgage Details"

              style={{ height: '20px', width: '20px' }}
            />
          </Tooltip>
            </div>
          </div> */}



          {/* <div className=" my-3 overflow-x-auto">
            <table className=" border-collapse">
              <thead className=''>
                <tr className="bg-[#E0E4EB]   text-gray-900  text-sm leading-normal">
                  <th
                    className="py-4 px-2  text-center border border-gray-300"
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
          </div> */}











          <div className=" w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800">Project Mortgage Details</h1>


        <div className='flex gap-6'>


        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-600">
          {/* <ChevronDown className="w-4 h-4" /> */}
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

        </button>


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

      <div className="w-full bg-white rounded-lg overflow-hidden shadow-md">
        <div className="bg-[#F8F9FC] p-4 rounded-t-lg">
          <h2 className="text-lg text-center font-medium text-[#000000]" >
          Project Mortgage Details
          </h2>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#F8F9FC] border-t border-b border-[#E8ECF4]">
                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                    Project Name
                  </th>
                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                  Unit No	
                  </th>
                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                  SY No	
                  </th>
                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                  Land Owner Name	
                  </th>
                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4]">
                  Doc Type	
                  </th>
                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap">
                  Registration Date	
                  </th>


                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap">
                  Registered To	
                  </th>


                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap">
                  Doc Number	
                  </th>


                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap">
                  Status	
                  </th>


                  <th className="text-left p-1 font-medium text-[#000000] whitespace-nowrap">
                  Remarks
                  </th>

                </tr>
              </thead>
              <tbody>
              {fetchMortUnitsList.map((item, index) => (
                  <tr
                  key={index}
                    className="hover:bg-gray-50 border-b border-[#E8ECF4]"
                  >
                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                     onClick={() => {
                     }}
                     >
                    {item.projectName}

                    </td>
                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                  onClick={() => {
                    }}
                    >
                       {item.unit_no}
                    </td>
                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                    onClick={() => {
                    }}
                    >
                            {item.survey_no}
                    </td>
                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                     onClick={() => {
                    }}
                    >
                            {item.land_owner_name}
                    </td>
                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                    onClick={() => {
                   }}
                    >
                           {item?.doc_type}
                    </td>




                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                    onClick={() => {
                   }}
                    >
                            {item.date_of_registration}
                    </td>


                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                    onClick={() => {
                   }}
                    >
                                 {item.to_whom}
                    </td>




                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                    onClick={() => {
                   }}
                    >
                             {item.doc_no}
                    </td>


                    <td className="p-4 text-gray-700 border-r border-[#E8ECF4]"
                    onClick={() => {
                   }}
                    >
                              {item.status}
                    </td>



                    <td className="p-4 text-gray-700"> {item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
    </div>

  )
}

export default CrmMortgageSummaryTable
