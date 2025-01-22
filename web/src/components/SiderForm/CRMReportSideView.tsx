
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useDispatch } from 'react-redux'
import {
  searchValue as searchedVal,
  searchData as searchResponse,
} from 'src/state/actions/search'
import SideVisitLeadsBody from '../A_SalesModule/Reports/SideVisitsLeadsBody'
import ProjectInventorySummaryReport from '../A_CrmModule/Reports/InventorySummary.tsx/ProjectInventorySummaryReport'
import BookedLeadsSideViewBody from '../A_SalesModule/Reports/BookedLeadsSideViewBody'
import SourceBookedLeadsSideViewBody from '../A_SalesModule/Reports/SourceBookedLeadsSideViewBody'
import SalesCompletedTasksBody from '../A_SalesModule/Reports/SalesCompletedTasksBody'
import EmpBookingSideBody from '../A_SalesModule/Reports/EmpBookingsSideBody'
import CollectionsDrillI from '../A_CrmModule/Reports/ColletionsDrill1'

const CRMReportSideWindow = ({
  open,
  setOpen,
  title,
  subtitle,
  filterPaylod,
  leadsLogsPayload,
  onCloseDisabled = false,
  widthClass,
  unitsViewMode,
  setIsClicked,
  setCustomerDetails,
  setisImportLeadsOpen,
  selUnitStatus
}) => {
  // dont write too many here
  //  this is for customerProfileSideView
  const dispatch = useDispatch()
  return (
    <Transition.Root show={open || false} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={onCloseDisabled ? () => {} : () => setOpen()}
        style={{ zIndex: '1000' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div
                className={`relative w-screen ${
                  title === 'Add Lead' ||
                  title === 'Create Project' ||
                  title === 'Edit Project' ||
                  title === 'upload_legal_docs'
                    ? 'max-w-2xl'
                    : widthClass
                }
                 ${unitsViewMode ? 'max-w-7xl' : widthClass}`}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => {
                        setOpen(false)
                        setIsClicked(false)
                        dispatch(searchedVal(''))
                        dispatch(searchResponse({}))
                      }}
                    >
                      <span className="sr-only">Close panel</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                {title === 'Site Visit Leads' && (
                  <SideVisitLeadsBody
                    title={title}
                    subtitle={subtitle}
                    dialogOpen={setOpen}
                    leadsLogsPayload={leadsLogsPayload}
                    setCustomerDetails= {setCustomerDetails}
                    setisImportLeadsOpen={setisImportLeadsOpen}

                  />
                )}

{title === 'project_collections' && (
                  <CollectionsDrillI
                    title={title}
                    subtitle={subtitle}
                    dialogOpen={setOpen}
                    filterPaylod={filterPaylod}
                    leadsLogsPayload={leadsLogsPayload}
                    setCustomerDetails= {setCustomerDetails}
                    setisImportLeadsOpen={setisImportLeadsOpen}

                  />
                )}

                   {title === 'Bookings' && (
                  <BookedLeadsSideViewBody
                    title={title}
                    subtitle={subtitle}
                    dialogOpen={setOpen}
                    leadsLogsPayload={leadsLogsPayload}
                    setCustomerDetails= {setCustomerDetails}
                    setisImportLeadsOpen={setisImportLeadsOpen}

                  />
                )}


                  {title === 'Source Bookings' && (
                  <SourceBookedLeadsSideViewBody
                    title={title}
                    subtitle={subtitle}
                    dialogOpen={setOpen}
                    leadsLogsPayload={leadsLogsPayload}
                    setCustomerDetails= {setCustomerDetails}
                    setisImportLeadsOpen={setisImportLeadsOpen}

                  />
                )}







                  {title === 'Employee Tasks' && (
                  <SalesCompletedTasksBody
                    title={title}
                    subtitle={subtitle}
                    dialogOpen={setOpen}
                    leadsLogsPayload={leadsLogsPayload}
                    setCustomerDetails= {setCustomerDetails}
                    setisImportLeadsOpen={setisImportLeadsOpen}

                  />
                )}
                {title === 'Employee Bookings' && (
                  <EmpBookingSideBody
                    title={title}
                    subtitle={subtitle}
                    dialogOpen={setOpen}
                    leadsLogsPayload={leadsLogsPayload}
                    setCustomerDetails= {setCustomerDetails}
                    setisImportLeadsOpen={setisImportLeadsOpen}

                  />
                )}

                {title === 'Unit Inventory' && (
                  <ProjectInventorySummaryReport
                    title={title}
                    subtitle={subtitle}
                    dialogOpen={setOpen}
                    leadsLogsPayload={leadsLogsPayload}
                    setCustomerDetails= {setCustomerDetails}
                    setisImportLeadsOpen={setisImportLeadsOpen}
                    selUnitStatus={selUnitStatus}

                  />
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CRMReportSideWindow
