import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

export default function AssigedToDropCompCrm({
  assignerName,
  id,
  setAssigner,
  usersList,
  align,
}) {
  return (
    <div className="text-right inline-block ">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-0 py-0 mt-4 text-[12px] font-semibold text-black-500 bg- rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {id === 'id' ? (
              <span className="tracking-wide text-black-600 text-[14px] font-bold whitespace-nowrap">
                {assignerName}
              </span>
            ) : (
              <span className="font-medium tracking-wide text-[14px] text-[#053219] whitespace-nowrap">
                {assignerName}
              </span>
            )}
            {id === 'id' ? (
              <ChevronDownIcon className="w-5 h-5 mr-3  mb-[12px]  mt-[0px] inline " />
            ) : (
              <ChevronDownIcon className="w-5 h-5  mb-[12px] mt-[0px] inline " />
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
            className={`absolute ${
              align === 'right'
                ? 'right-0 origin-top-right'
                : 'left-0 origin-top-left'
            }  w-52 mt-2  bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9000]`}
          >
            <div className="px-1 py-1 ">
              {usersList.map((dat, i) => {
                return (
                  <Menu.Item key={i}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } text-left group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => setAssigner(id, dat)}
                      >
                        {active ? (
                          <EditActiveIcon
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                        ) : (
                          <EditInactiveIcon
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                        )}
                        <span className="text-left"> {dat?.label}</span>
                      </button>
                    )}
                  </Menu.Item>
                )
              })}
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
