import { useEffect, useState } from 'react'
import { prettyDate } from 'src/util/dateConverter'

export default function CostSheetAndPaymentSchedule({
  selUnitDetails,
  setFeature,
  paymentScheduleTuned,
}) {
  const [costSheetItems, setCostSheetItems] = useState([])
  const [psItems, setPSItems] = useState([])

  const [checkedItems, setCheckedItems] = useState({
    unitCost: false,
    plc: false,
    legalCharges: false,
    bescom: false,
  })

  const handleCheckboxChange = (item) => {
    setCheckedItems({
      ...checkedItems,
      [item]: !checkedItems[item],
    })
  }

  let costSheetDummy = [
    { label: 'Charge Cost', value: selUnitDetails?.T_A },
    { label: 'Additional Charges', value: selUnitDetails?.T_B },
    { label: 'Construction Cost', value: selUnitDetails?.T_C },
    { label: 'Construction Additional Cost', value: selUnitDetails?.T_D },
    { label: 'Possession Charges', value: selUnitDetails?.T_E },
  ]

  const paymentScheduleItems = [
    { id: 'unitCost', label: 'Unit Cost', date: 'Mar-20-2025' },
    { id: 'plc', label: 'PLC', date: 'Mar-20-2025' },
    { id: 'legalCharges', label: 'Legal Charges', date: 'Mar-20-2025' },
    { id: 'bescom', label: 'BESCOM', date: 'Mar-20-2025' },
  ]

  useEffect(() => {
    setCostSheetItems(costSheetDummy)
  }, [selUnitDetails])
  useEffect(() => {
    setPSItems(paymentScheduleTuned)
  }, [paymentScheduleTuned])
  return (
    <div className="flex flex-col   md:flex-row gap-4 ">
      <div
        className="w-full md:w-1/2 bg-white p-6 rounded-2xl border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] cursor-pointer"
        onClick={() => setFeature('finance_info')}
      >


        <div className="flex justify-between items-center mb-4 overflow-visible">
          {/* Left section */}
          <div className="flex items-center">
            <div className="bg-[#FFFFFF] p-1.5 mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
              <img
                src="/COST_SHEET_CARD.svg"
                alt=""
                className="w-[18px] h-[18px]"
              />
            </div>
            <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] text-[#2B2B2B]">
              COST SHEET
            </span>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            <svg
              width="19"
              height="8"
              viewBox="0 0 32 12"
              fill="black"
              xmlns="http://www.w3.org/2000/svg"
              className="align-middle"
            >
              <path
                d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z"
                fill="black"
              ></path>
            </svg>
          </div>
        </div>



        <div className="space-y-0">
          {costSheetItems.map((item, index) => (
            <div
              key={index}
              className="py-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[14px] leading-[100%] tracking-[0%] font-outfit">
                  {item?.label}
                </span>
                <span className="font-normal text-[12px] leading-[100%] tracking-[0%] font-outfit">
                  ₹ {item?.value?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-full md:w-1/2 bg-white border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] p-6 rounded-2xl cursor-pointer"
        onClick={() => setFeature('finance_info')}
      >


<div className="flex justify-between items-center mb-4 overflow-visible">
          {/* Left section */}
          <div className="flex items-center">
            <div className="bg-[#FFFFFF] p-1.5  mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
              <img
                src="/PAYMENT_SCHEDULE_CARD_ICON.svg"
                alt=""
                className="w-[18px] h-[18px]"
              />
            </div>
            <span className="font-semibold text-[12px] leading-[100%] tracking-[6%] text-[#2B2B2B]">
            PAYMENT SCHEDULE
            </span>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            <svg
              width="19"
              height="8"
              viewBox="0 0 32 12"
              fill="black"
              xmlns="http://www.w3.org/2000/svg"
              className="align-middle"
            >
              <path
                d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z"
                fill="black"
              ></path>
            </svg>
          </div>
        </div>


        <div className="space-y-0">
          {psItems?.map((item, i) => (
            <div
              key={i}
              className="py-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="font-normal text-[12px] leading-[100%] text-[#606062] tracking-[0%] font-outfit">
                {prettyDate(item?.elgFrom)}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-normal text-[14px] leading-[100%] tracking-[0%] font-outfit">
                  {item?.label}
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-normal text-[12px] leading-[100%] text-[#960000] tracking-[0%] ">
                    {' '}
                    ₹ {item?.outStanding?.toLocaleString('en-IN')}
                  </span>
                  <span className="font-normal text-[12px] leading-[100%] text-[#1B6600] tracking-[0%] ">
                    ₹ {item?.value?.toLocaleString('en-IN')}
                  </span>
                  <div
                    className="relative w-4 h-4 border border-gray-300 rounded cursor-pointer"
                    onClick={() => handleCheckboxChange(item?.id)}
                  >
                    {checkedItems[item.id] && (
                      <svg
                        className="absolute inset-0 w-full h-full text-blue-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
