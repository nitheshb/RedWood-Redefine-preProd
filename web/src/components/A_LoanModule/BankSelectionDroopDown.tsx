/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import {
  OfficeBuildingIcon,
} from '@heroicons/react/outline'
import {
  ChevronDownIcon,
} from '@heroicons/react/solid'


import { USER_ROLES } from 'src/constants/userRoles'
import { useAuth } from 'src/context/firebase-auth-context'





const BankLogos = {
  sbi: '/state_bank_of_india_symbol.svg',
  icici: '/icici_bank_symbol.svg',
  hdfc: '/hdfc_bank_logo.svg',
  bankofbaroda: '/logos/bob-logo.png',
  axisbank: '/axis_bank_symbol.svg',
  punjabnationalbank: '/kotak_mahindra_bank_logo.svg',
  tatacapital: '/logos/tata-capital-logo.png'
}



export default function BankSelectionSwitchDrop({ type, setStatusFun }) {
  const { user } = useAuth()


  return (
    <div className="text-right inline-block w-full  mt-[px]">
      <Menu as="div" className="relative w-full text-left">
        <div className='container px-4'>
          <Menu.Button className=" inline-flex w-full border border-[#E7E7E9] justify-between px-0 py-0 text-sm font-medium text-black-500  rounded-md  hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  dark:highlight-white/5 flex font-semibold  items-center leading-5 px-3 py-1 rounded-full space-x-2 text-xs px-2.5 py-1.5 ">
            <span className=" w-[100%] text-[12px] leading-[10px] tracking-wide text-[#616162]  ">
              <span className="flex flex-row ">
                <span>{`${type?.bName || 'Select Bank'} `} </span>{' '}
                <span className="ml-[2px]"></span>
              </span>
            </span>
            <ChevronDownIcon className="w-5 h-5 mr-3 mt-[2px] inline text-[#606062]" />
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
            }  absolute  w-full  mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9000]`}
   
          >
            <div className="px-1 py-1 ">
              <>
                {[
                  {
                    bName: 'State Bank Of India',
                    value: 'sbi',
                  },
                  {
                    bName: 'ICICI',
                    value: 'icici',
                  },
                  {
                    bName: 'HDFC',
                    value: 'hdfc',
                  },
                  { bName: 'Bank of Baroda', value: 'bankofbaroda' },
                  { bName: 'Axis Bank', value: 'axisbank' },
                  { bName: 'Punjab National Bank', value: 'punjabnationalbank' },
                  { bName: 'Tata Capital', value: 'tatacapital' },
  
                ].map((data, i) => (
                  <Menu.Item key={i}>
                    {({ active }) => (
                        <div
                          className="group relative flex items-center gap-x-6 rounded-lg p-2 pb-0 text-sm leading-6 hover:bg-gray-50"
                          onClick={() => {
                            setStatusFun(data)
                          }}
                        >
                          {/* <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <OfficeBuildingIcon
                              className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                          </div> */}

<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <img src={BankLogos[data.value]} className="h-6 w-6" alt={`${data.bName} logo`} />
                          </div>
                          <div className="flex-auto">
                            <a className="block font-semibold text-gray-900">
                              {data.bName}
                              <span className="absolute inset-0" />
                            </a>
            
                          </div>
                        </div>

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
