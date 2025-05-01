import React from 'react'
import { RadioGroup } from '@headlessui/react'

export const CustomRadioGroup = ({ label, value, onChange, options }) => {
  return (
    <>
      <div className="mb-1 mt-2">
        <label className="font-medium text-[12px] leading-[100%] tracking-[0.06em] uppercase text-[#606062] mb-1">
          {label}
        </label>
      </div>

      <RadioGroup value={value} onChange={onChange}>
        <div className="grid grid-cols-4 bg-white py-2 gap-2 rounded-md">
          {options.map((option) => {
            const isSelected = value === option.name
            const isYes = option.name.toLowerCase() === 'yes'
            const isNo = option.name.toLowerCase() === 'no'

            const getImageSrc = () => {
              if (isYes) return isSelected ? '/yes1.svg' : '/yesnotseleted.svg'
              if (isNo) return isSelected ? '/nossele.svg' : '/no.svg'
              return option.img || ''
            }

            return (
              <RadioGroup.Option
                key={option.name}
                value={option.name} // ⬅️ Only store string
                className={({ active }) =>
                  `
                  relative rounded-lg px-2 py-2 cursor-pointer flex focus:outline-none col-span-2
                  ${active ? 'ring-2 ring-offset-2 ring-white ring-opacity-60' : ''}
                  ${
                    isSelected
                      ? isYes
                        ? 'border border-[#1B6600] bg-opacity-75 text-black'
                        : isNo
                        ? 'border border-[#960000] bg-opacity-75 text-black'
                        : 'border border-blue-500 bg-opacity-75 text-black'
                      : 'border border-[#E7E7E9]'
                  }
                `
                }
              >
                <div className="w-full flex items-center justify-between">
                  <RadioGroup.Label as="p" className="font-medium flex items-center text-gray-900 w-full">
                    <section className="flex items-center">
                      {getImageSrc() && (
                        <img
                          className="w-5 h-5 mr-2"
                          alt={option.name}
                          src={getImageSrc()}
                        />
                      )}
                      <span className="text-sm font-light">{option.name}</span>
                    </section>
                  </RadioGroup.Label>
                </div>
              </RadioGroup.Option>
            )
          })}
        </div>
      </RadioGroup>
    </>
  )
}




