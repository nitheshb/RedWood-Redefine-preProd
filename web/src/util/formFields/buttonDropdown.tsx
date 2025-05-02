import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/solid'
import { CatchingPokemonSharp } from '@mui/icons-material'

export default function ButtonDropDown({
  type,
  pickCustomViewer,
  dropDownItemsA,
  selProjectIs,
}) {
  console.log('value of drop down is ', selProjectIs)
  return (
    <div className="flex-shrink-0 z-10 inline-flex items-center text-sm font-medium text-center text-gray-900 bg-gray-100   rounded-[16px]  focus:ring-4 focus:outline-none focus:ring-gray-100 w-2/3">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-left w-full px-2 py-1 text-sm border border-gray-300 hover:bg-gray-200  font-semibold text-black-500 bg- rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <section className="w-[140px] flex justify-between">
              <span className=" text-[12px] text-left text-[#0091ae] text-ellipsis whitespace-nowrap ">
                {selProjectIs?.label}
              </span>
              <ChevronDownIcon className="w-5 h-5  mt-[px] inline text-[#058527] ml-5 " />
            </section>
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
              ['Facing'].includes(type) ? 'right-0' : 'left-[0px]'
            }  absolute  w-[140px] origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9000]`}
            style={{ zIndex: '9', marginTop: '2px' }}
          >
            <div className="px-1 py-1 ">
              <>
                {dropDownItemsA.map((viewData, i) => (
                  <Menu.Item key={i}>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? 'bg-violet-500 text-white rounded-sm'
                            : 'text-gray-900'
                        } group   items-center py-[2px] pl-[5px] text-sm flex flex-row w-full justify-between`}
                        onClick={() => pickCustomViewer(viewData)}
                      >
                        <span className="text-[12px] text-left  text-ellipsis whitespace-nowrap">
                          {' '}
                          {viewData?.label}
                        </span>
                        <span>
                          {' '}
                          {viewData?.value === selProjectIs?.value ? (
                            <CheckIcon
                              className="h-3 w-3 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <CheckIcon
                              className="w-3 h-3 mr-2 text-transparent"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
