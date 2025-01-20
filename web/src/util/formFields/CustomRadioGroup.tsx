import React from 'react'
import { RadioGroup } from '@headlessui/react'

export const CustomRadioGroup = ({ label, value, onChange, options }) => {
  return (
    <>
      {/* <label className="font-semibold text-[#053219] py-2 text-sm mb-2 mt-0">
        {label}
        <abbr title="required"></abbr>
      </label> */}
      <div className="mb-4  mt-2">
          <div className="inline">
            <div className="">
              <label className="font-semibold text-[#053219]  text-sm  mb-1  ">
              {label}<abbr title="required"></abbr>
              </label>
            </div>

            <div className="border-t-4 rounded-xl w-16 mt-1 border-[#57C0D0]"></div>
          </div>
        </div>

      <RadioGroup value={value} onChange={onChange}>
        <div className="grid grid-cols-4 bg-white shadow-md p-2 rounded-md gap-4">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.name}
              value={option}
              className={({ active }) =>
                `${
                  active
                    ? 'ring-2 ring-offset-2  ring-white ring-opacity-60 col-span-2'
                    : ''
                }
${
  value.name == option.name
    ? 'ring-1  ring-[#57c0d0] bg-opacity-75 text-black'
    : 'bg-[#f7f9f8]'
}
relative rounded-lg px-5 py-2 cursor-pointer flex focus:outline-none col-span-2`
              }
            >
              {() => (
                <>
                  <div className="w-full flex justify-between ">
                    <div className="w-full">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium flex flex-col  ${
                            value.name == option.name
                              ? 'text-gray-900'
                              : 'text-gray-900'
                          }`}
                        >
                          <section className=" col-span-2 flex flex-row justify-center ">
                            {option.img && (
                              <img
                                className="w-5 h-5 inline"
                                alt=""
                                src={option.img}
                              ></img>
                            )}
                            <div
                              className={`${
                                option.name == value.name
                                  ? 'flex-shrink-0 text-white ml-auto'
                                  : 'flex-shrink-0 text-black ml-auto'
                              } mt-1 font-light`}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-4 h-4"
                              >
                                <circle
                                  cx={11}
                                  cy={11}
                                  r={11}
                                  fill={
                                    value.name == option.name ? '#57c0d0' : ''
                                  }
                                />
                                <path
                                  d="M6 11l3 3 7-7"
                                  stroke={
                                    value.name == option.name ? '#fff' : ''
                                  }
                                  strokeWidth={1.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </section>{' '}
                          <div className="mt-1 mr-2 inline text-sm text-b font-light ">
                            {option.name}
                          </div>
                        </RadioGroup.Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  )
}
