/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react'
import { useAuth } from 'src/context/firebase-auth-context'
import PaymentScheduleForm from './PaymentScheduleForm/PaymentScheduleForm'
const PaymentScheduleSetup = ({ phase, source }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [blocksViewFeature, setBlocksViewFeature] = useState(
    'Plot_Payment_Schedule'
  )
  const [otherChargesA, setOtherChargesA] = useState([
    { lab: 'Plot Payment Schedule', val: 'Plot_Payment_Schedule' },
    {
      lab: 'Construction Payment Schedule',
      val: 'Construction_Payment_Schedule',
    },
  ])
  useEffect(() => {
    console.log('values of it ', phase, source, phase?.projectType?.name)
    // projectType.name != 'Plots'
    if (phase?.phase?.projectType?.name === 'Plots') {
      setOtherChargesA([
        { lab: 'Plot Payment Schedule', val: 'Plot_Payment_Schedule' },
      ])
    }
  }, [])

  return (
    <div className="lg:col-span-10  w-full   ">
   

      <PaymentScheduleForm
        blocksViewFeature={blocksViewFeature}
        title={'Payment Schedule'}
        data={{ phase: phase }}
        source={source}
      />
    </div>
  )
}

export default PaymentScheduleSetup
