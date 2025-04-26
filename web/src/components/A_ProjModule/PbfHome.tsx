import React from 'react'

function PdfHome() {
  const plotCharges = [
    { description: 'Unit Cost', rate: 5000, cost: 6000000, sqft: 6720000 },
    { description: 'PLC', rate: 10, cost: 12000, sqft: 13440 },
  ]

  const additionalCharges = [
    { description: 'Maintenance', rate: 251, cost: 301200, sqft: 337344 },
  ]

  const constructionCharges = [
    {
      description: 'Villa construction cost',
      rate: 4000,
      cost: 4004000,
      sqft: 8564000,
    },
  ]

  const constructionAdditionalCharges = [
    { description: 'Car Parking', rate: 200000, cost: 200000, sqft: 210000 },
  ]

  const paymentSchedule = [
    { schedule: 'On Booking', timeline: 'Booking Advance', amount: 200000 },
    {
      schedule: 'On Execution of Agreement to Sell',
      timeline: 'On Agreement',
      amount: 1717696,
    },
    {
      schedule: 'On Execution of Sale Deed',
      timeline: 'On Sale Deed',
      amount: 5153088,
    },
  ]

  const constructionSchedule = [
    {
      schedule: 'On completion of Plinth Beam',
      timeline: 'On completion',
      amount: 2193500,
    },
    {
      schedule: 'On completion of First Floor Slab',
      timeline: 'On completion',
      amount: 2193500,
    },
    {
      schedule: 'On completion of Brick work',
      timeline: 'On completion',
      amount: 2193500,
    },
    {
      schedule: 'On completion of Plastering',
      timeline: 'On completion',
      amount: 2193500,
    },
  ]

  const renderChargesTable = (title, data) => {
    const total = data.reduce((acc, curr) => acc + curr.sqft, 0)

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold  text-gray-700 mb-3">{title}</h3>
        <div className="bg-white rounded-lg p-4">
          <div className="overflow-hidden rounded-xl">
            <table className="w-full ">
              <thead className="bg-gray-50 ">
                <tr className="text-left text-gray-600">
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 font-medium">Rate/Sqft</th>
                  <th className="py-2 font-medium">Cost</th>
                  <th className="py-2 font-medium">Sqft</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2">{item.description}</td>
                    <td className="py-2">₹ {item.rate.toLocaleString()}</td>
                    <td className="py-2">₹ {item.cost.toLocaleString()}</td>
                    <td className="py-2">₹ {item.sqft.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200 font-semibold">
                  <td colSpan={2} className="py-3">
                    {title.includes('Plot')
                      ? 'Plot cost'
                      : title.includes('Additional')
                      ? 'Additional charges'
                      : 'Construction cost'}
                  </td>
                  <td colSpan={2} className="py-3">
                    ₹ {total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderPaymentSchedule = (title, scheduleData) => {
    const total = scheduleData.reduce((acc, curr) => acc + curr.amount, 0)

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
        <div className="bg-white rounded-lg p-4">
          <div className="overflow-hidden rounded-xl">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="py-2 font-medium">Schedule</th>
                  <th className="py-2 font-medium">Payment Timeline</th>
                  <th className="py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2">{item.schedule}</td>
                    <td className="py-2">{item.timeline}</td>
                    <td className="py-2">₹ {item.amount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200 font-semibold">
                  <td colSpan={2} className="py-2">
                    Total Cost
                  </td>
                  <td className="py-2">₹ {total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl bg-gray-50 rounded-t-[30px] mx-auto space-y-6">
        <div className="  rounded-t-[30px] shadow-sm">
          <div className="bg-gray-50 rounded-t-[30px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Villa Test-1</h1>
              <div className="text-right">
                <h2 className="text-lg font-semibold text-gray-700">
                  Cost sheet
                </h2>
                <p className="text-sm text-gray-500">05/12/2024</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                {[
                  { label: 'Applicant Name', value: 'Charlie' },
                  { label: 'Customer ID', value: 'series.Neill7ZKhQ.short' },
                  { label: 'Phone number', value: '+91 1234567890' },
                  { label: 'Email address', value: 'hello@gmail.com' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Unit No', value: '123' },
                  { label: 'Size', value: '1234567890' },
                  { label: 'Facing', value: 'South' },
                  { label: 'Type', value: 'Villa' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Unit Cost', value: 'None' },
                  { label: 'Current status', value: 'Booked' },
                  { label: 'Booked date', value: 'dd/mm/yyyy' },
                  { label: 'Booked by', value: 'Villa' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white  p-6  rounded-[20px] drop-shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cost Sheet</h2>
            <p className="text-sm text-gray-500 mb-6">Know your charges</p>

            {renderChargesTable('I. Plot charges', plotCharges)}
            {renderChargesTable('II. Additional charges', additionalCharges)}
            {renderChargesTable(
              'III. Construction charges',
              constructionCharges
            )}
            {renderChargesTable(
              'IV. Construction Additional charges',
              constructionAdditionalCharges
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Payment Schedule
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                When to pay & what to pay
              </p>

              {renderPaymentSchedule('I. Payment Schedule', paymentSchedule)}
              {renderPaymentSchedule(
                'II. Construction Schedule',
                constructionSchedule
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfHome
