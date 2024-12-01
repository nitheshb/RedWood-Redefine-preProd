/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  FireIcon,
  PlusIcon,
  PencilIcon,
  CurrencyRupeeIcon,
  DotsVerticalIcon,
  CheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/solid'

import { uniTypes } from 'src/constants/projects'

export default function DropDownUnitBlocks({
  type,
  id,
  setStatusFun,
  viewUnitStatusA,
  pickCustomViewer,
  selProject,
  setOpenEditBlock,
  totalunits: totalUnits,
  filteredUnits,
  pickedValue,
}) {
  return (
    <div className="text-right inline-block ml-7 mt-[-5px] bg-white rounded px-2">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-0 py-0 text-sm font-semibold text-black-500 bg- rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {type === 'View' && (
              <>
                <span className=" text-[12px] tracking-wide text-black ">
                  {/* {type?.toLocaleUpperCase()} */}
                  {'.'}
                </span>
                <ChevronDownIcon className="w-5 h-5 mr-3 mt-[1px] inline text-white" />
              </>
            )}
            {type != 'unitMode' && type != 'View' && (
              <>
                <span className=" text-[11px] tracking-wide text-[#0091ae] mt-[5px]">
                  {type?.toLocaleUpperCase()}
                </span>
                <ChevronDownIcon className="w-5 h-5 mr- ml-1 mt-[5px] inline text-[#058527]" />
              </>
            )}
            {type === 'unitMode' && (
              <>
                <DotsVerticalIcon className="w-3 h-3  mt-[1px] inline " />
              </>
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`${
              ['Facing', 'show'].includes(type) ? 'right-0' : 'left-0'
            }  absolute  w-52 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9000]`}
            style={{ 'z-index': '12' }}
          >
            <div className="px-1 py-1 ">
              {type === 'Price' && (
                <>
                  {['Any', 10, 20, 30, 40, 50, 60, 70, 80].map(
                    (viewData, i) => (
                      <Menu.Item key={i}>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-violet-500 text-white rounded-md'
                                : 'text-gray-900'
                            } group flex  items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setStatusFun(id, viewData)}
                          >
                            {active ? (
                              <CurrencyRupeeIcon
                                className="w-5 h-5 mr-2"
                                aria-hidden="true"
                              />
                            ) : (
                              <CurrencyRupeeIcon
                                className="w-5 h-5 mr-2 text-violet-500"
                                aria-hidden="true"
                              />
                            )}
                            {`< ${viewData} lakhs`}
                          </button>
                        )}
                      </Menu.Item>
                    )
                  )}
                </>
              )}
              {type === 'Size' && (
                <>
                  {['Any', 35397, 59895].map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() => setStatusFun(id, viewData)}
                        >
                          {active ? (
                            <DuplicateActiveIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <DuplicateInactiveIcon
                              className="w-5 h-5 mr-2 text-violet-500"
                              aria-hidden="true"
                            />
                          )}
                          {`${viewData} sqft`}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
              {type === 'bedrooms' && (
                <>
                  {['Any', 1, 2, 3, 4].map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() => setStatusFun(id, viewData)}
                        >
                          {active ? (
                            <DuplicateActiveIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <DuplicateInactiveIcon
                              className="w-5 h-5 mr-2 text-violet-500"
                              aria-hidden="true"
                            />
                          )}
                          {viewData} Bhk
                          <div className="absolute right-0 pr-4">
                            {viewData === 'Any'
                              ? filteredUnits?.length
                              : filteredUnits?.filter(
                                  (dat) => dat['bed_rooms'] === viewData
                                ).length}
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
              {type === 'blocks' && (
                <>
                  {filteredUnits.sort((a, b) => a.blockName - b.blockName).map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <section className="flex flex-row justify-between">
                          <button
                            className={`${
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setStatusFun(viewData)}
                          >
                            {active ? (
                              <DuplicateActiveIcon
                                className="w-5 h-5 mr-2"
                                aria-hidden="true"
                              />
                            ) : (
                              <DuplicateInactiveIcon
                                className="w-5 h-5 mr-2 text-violet-500"
                                aria-hidden="true"
                              />
                            )}
                            {viewData?.blockName}
                          </button>
                          <div
                            className={`${
                              active ? ' text-white' : 'text-gray-900'
                            } group flex rounded-md items-center px- py-2 text-sm`}
                            onClick={() =>
                              setOpenEditBlock({
                                open: true,
                                title: 'Edit Block',
                                sliderData: {
                                  data: viewData,
                                },
                                widthClass: 'max-w-2xl',
                              })
                            }
                          >
                            <PencilIcon className="w-5 h-5 mt-[3px] text-gray-500 cursor-pointer mr-2" />
                          </div>
                        </section>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <section className="flex flex-row ">
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900'
                          }  flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() =>
                            setOpenEditBlock({
                              open: true,
                              title: 'Add Block',
                              sliderData: {
                                data: {projectId: selProject?.uid },
                              },
                              widthClass: 'max-w-2xl',
                            })
                          }
                        >
                          <PlusIcon
                            className={`h-3 w-3 mr-1 ${
                              active ? 'text-white' : 'text-gray-900 '
                            }`}
                            aria-hidden="true"
                          />
                          Add New Block
                        </button>
                      </section>
                    )}
                  </Menu.Item>
                </>
              )}
              {type === 'bathrooms' && (
                <>
                  {['Any', 1, 2, 3, 4].map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() => setStatusFun(id, viewData)}
                        >
                          {active ? (
                            <DuplicateActiveIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <DuplicateInactiveIcon
                              className="w-5 h-5 mr-2 text-violet-500"
                              aria-hidden="true"
                            />
                          )}
                          {viewData} Bathroom
                          <div className="absolute right-0 pr-4">
                            {viewData === 'Any'
                              ? filteredUnits.length
                              : filteredUnits.filter(
                                  (dat) => dat['bath_rooms'] === viewData
                                ).length}
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}

              {type === 'Status' && (
                <>
                  {['Any', 'Available', 'Booked', 'Blocked'].map(
                    (viewData, i) => (
                      <Menu.Item key={i}>
                        {({ active }) => (
                          <button
                            className={`${
                              active ||
                              (pickedValue.length != 3 &&
                                pickedValue.includes(
                                  viewData?.toLocaleLowerCase()
                                )) ||
                              (pickedValue.length === 3 && viewData === 'Any')
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setStatusFun(id, viewData)}
                          >
                            {active ||
                            (pickedValue.length != 3 &&
                              pickedValue.includes(
                                viewData?.toLocaleLowerCase()
                              )) ||
                            (pickedValue.length === 3 && viewData === 'Any') ? (
                              <FireIcon
                                className="w-5 h-5 mr-2"
                                aria-hidden="true"
                              />
                            ) : (
                              <FireIcon
                                className="w-5 h-5 mr-2 text-violet-500"
                                aria-hidden="true"
                              />
                            )}{' '}
                            {viewData}{' '}
                            <div className="absolute right-0 pr-4">
                              {viewData === 'Any'
                                ? filteredUnits.length
                                : filteredUnits.filter(
                                    (dat) =>
                                      dat['Status'] ===
                                      viewData?.toLocaleLowerCase()
                                  ).length}
                            </div>
                          </button>
                        )}
                      </Menu.Item>
                    )
                  )}
                </>
              )}
              {type === 'Show Fields' && (
                <>
                  {[
                    'Phone No',
                    'Cost Split',
                    'CRM Executive',
                    'Sales Executive',
                    'Remarks',
                  ].map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white rounded-sm'
                              : 'text-gray-900'
                          } group flex  items-center w-full px-2 py-2 text-sm`}
                          onClick={() => pickCustomViewer(viewData)}
                        >
                          {viewUnitStatusA.includes(viewData) ? (
                            <CheckIcon
                              className="h-5 w-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <CheckIcon
                              className="w-5 h-5 mr-2 text-transparent"
                              aria-hidden="true"
                            />
                          )}
                          {viewData}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
              {type === 'show' && (
                <>
                  {[
                    'Phone No',
                    'Email Id',
                    'Assigned To',
                    'Last Activity',
                    'Next Sch',
                  ].map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white rounded-sm'
                              : 'text-gray-900'
                          } group flex  items-center w-full px-2 py-2 text-sm`}
                          onClick={() => pickCustomViewer(viewData)}
                        >
                          {viewUnitStatusA.includes(viewData) ? (
                            <CheckIcon
                              className="h-5 w-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <CheckIcon
                              className="w-5 h-5 mr-2 text-transparent"
                              aria-hidden="true"
                            />
                          )}
                          {viewData}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
              {type === 'View' && (
                <>
                  {['Available', 'Blocked', 'Booked', 'Total'].map(
                    (viewData, i) => (
                      <Menu.Item key={i}>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-violet-500 text-white rounded-sm'
                                : 'text-gray-900'
                            } group flex  items-center w-full px-2 py-2 text-sm`}
                            onClick={() => pickCustomViewer(viewData)}
                          >
                            {viewUnitStatusA.includes(viewData) ? (
                              <CheckIcon
                                className="h-5 w-5 mr-2"
                                aria-hidden="true"
                              />
                            ) : (
                              <CheckIcon
                                className="w-5 h-5 mr-2 text-transparent"
                                aria-hidden="true"
                              />
                            )}
                            {viewData}
                          </button>
                        )}
                      </Menu.Item>
                    )
                  )}
                </>
              )}
              {type === 'Facing' && (
                <>
                  {[
                    'Any',
                    'East',
                    'West',
                    'South',
                    'North',
                    'South-East',
                    'South-West',
                    'North-East',
                    'North-West',
                  ].map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ||
                            (pickedValue.length != 8 &&
                              pickedValue.includes(
                                viewData?.toLocaleLowerCase()
                              )) ||
                            (pickedValue.length === 8 && viewData === 'Any')
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() =>
                            setStatusFun(id, viewData?.toLocaleLowerCase())
                          }
                        >
                          {active ||
                          (pickedValue.length != 8 &&
                            pickedValue.includes(
                              viewData?.toLocaleLowerCase()
                            )) ||
                          (pickedValue.length === 8 && viewData === 'Any') ? (
                            <FireIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <FireIcon
                              className="w-5 h-5 mr-2 text-violet-500"
                              aria-hidden="true"
                            />
                          )}{' '}
                          {viewData}
                          <div className="absolute right-0 pr-4">
                            {viewData === 'Any'
                              ? filteredUnits.length
                              : filteredUnits.filter(
                                  (dat) =>
                                    dat['facing']?.toLocaleLowerCase() ===
                                    viewData?.toLocaleLowerCase()
                                ).length}
                            /
                            {viewData === 'Any'
                              ? totalUnits.length
                              : totalUnits.filter(
                                  (dat) =>
                                    dat['facing']?.toLocaleLowerCase() ===
                                    viewData?.toLocaleLowerCase()
                                ).length}
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
              {type === 'Type' && (
                <>
                  {uniTypes.map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ||
                            (pickedValue.length != 8 &&
                              pickedValue.includes(
                                viewData?.toLocaleLowerCase()
                              )) ||
                            (pickedValue.length === 8 && viewData === 'Any')
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() =>
                            setStatusFun(id, viewData?.toLocaleLowerCase())
                          }
                        >
                          {active ||
                          (pickedValue.length != 8 &&
                            pickedValue.includes(
                              viewData?.toLocaleLowerCase()
                            )) ||
                          (pickedValue.length === 8 && viewData === 'Any') ? (
                            <FireIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <FireIcon
                              className="w-5 h-5 mr-2 text-violet-500"
                              aria-hidden="true"
                            />
                          )}{' '}
                          {viewData}
                          <div className="absolute right-0 pr-4">
                            {viewData === 'Any'
                              ? filteredUnits.length
                              : filteredUnits.filter(
                                  (dat) =>
                                    dat['size']?.toLocaleLowerCase() ===
                                    viewData?.toLocaleLowerCase()
                                ).length}
                            /
                            {viewData === 'Any'
                              ? totalUnits.length
                              : totalUnits.filter(
                                  (dat) =>
                                    dat['size']?.toLocaleLowerCase() ===
                                    viewData?.toLocaleLowerCase()
                                ).length}
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
              {type === 'unitMode' && (
                <>
                  {[
                    'Unit Details',
                    'Quotation',
                    'Block',
                    'Book',
                    'Detail View',
                    'Edit',
                  ].map((viewData, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-violet-500 text-white rounded-sm'
                              : 'text-gray-900'
                          } group flex  items-center w-full px-2 py-2 text-sm`}
                          onClick={() => pickCustomViewer(viewData)}
                        >
                          {[
                            'Unit Details',
                            'Quotation',
                            'Block',
                            'Book',
                            'Detail View',
                            'Edit',
                          ]?.includes(viewData) ? (
                            <DocumentTextIcon
                              className="h-5 w-5 mr-2 text-violet-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <DocumentTextIcon
                              className="w-5 h-5 mr-2 text-transparent"
                              aria-hidden="true"
                            />
                          )}
                          {viewData}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

function EditInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  )
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  )
}

function DuplicateInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  )
}

function DuplicateActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  )
}
