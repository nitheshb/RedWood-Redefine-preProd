import { useEffect, useState } from 'react'

const UnitOverView = ({ data }) => {
  const [customerDetails, setCustomerDetails] = useState({})
  useEffect(() => {
    const { unitDetail } = data
    const { customerDetailsObj } = unitDetail
    setCustomerDetails(customerDetailsObj)
    console.log(
      'customerDetails?.customerName1',
      customerDetails?.customerName1,
      customerDetailsObj?.customerName1,
      customerDetailsObj,
      data?.customerDetailsObj
    )

  }, [data])

  return (
 
    <div className="w-full px-1 mt-1 mb-1 bg-white   pt-2 ">
      <div className="relative z-10 my-1 bg-white">
        <div className="py-3 grid grid-cols-2 mb-4">
          <section className="flex flex-col bg-[#FCF4F0] p-3 border border-[#e8e1e1] rounded-md">
            <section className="flex flow-row justify-between mb-1">
              <div className="font-md text-xs text-gray-700 tracking-wide">
                Primary Owner
              </div>
              <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                {customerDetails?.customerName1}
              </div>
            </section>
            <section className="flex flow-row justify-between mb-1">
              <div className="font-md text-xs text-gray-500  tracking-wide">
                Phone
              </div>
              <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                {customerDetails?.phone1}
              </div>
            </section>
            <section className="flex flow-row justify-between mb-1">
              <div className="font-md text-xs text-gray-500  tracking-wide">
                Email
              </div>
              <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                {customerDetails?.email1}
              </div>
            </section>
            <section className="flex flow-row justify-between mb-1">
              <div className="font-md text-xs text-gray-500  tracking-wide">
                Dob
              </div>
              <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                {customerDetails?.Dob1}
              </div>
            </section>
            <section className="flex flow-row justify-between mb-1">
              <div className="font-md text-xs text-gray-500  tracking-wide">
              Aadhar no
              </div>
              <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
              {customerDetails?.aadharNo1 || '-'}
              </div>
            </section>

            <section className="flex flow-row justify-between mb-1">
              <div className="font-md text-xs text-gray-500  tracking-wide">
                Pancard
              </div>
              <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                {customerDetails?.panNo1 || '-'}
              </div>
            </section>
          </section>


        </div>

      </div>
    </div>
  )
}

export default UnitOverView
