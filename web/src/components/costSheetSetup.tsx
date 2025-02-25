/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react'
import { useAuth } from 'src/context/firebase-auth-context'
import AdditionalChargesForm from './AdditionalChargesForm/AdditionalChargesForm'

const CostSheetSetup = ({ phase, source }) => {
  const { user } = useAuth()

  const { orgId } = user

  const [blocksViewFeature, setBlocksViewFeature] =
    useState('Plot_Other_Charges')

  const [otherChargesA, setOtherChargesA] = useState([
    { lab: 'Cost Sheet Setup', val: 'Plot_Other_Charges' },
    {
      lab: 'Construction Charges',
      val: 'Construction_Other_Charges',
    },
  ])

  useEffect(() => {
    console.log('values of it ', phase, source, phase?.projectType?.name )
    if (phase?.phase?.projectType?.name === 'Plots') {
      setOtherChargesA([
        { lab: 'Plot Other Charges', val: 'Plot_Other_Charges' },
      ])
    }
  }, [])

  return (
    <div className="lg:col-span-10 border w-full bg-[#F0F1FF]">

      <AdditionalChargesForm
        blocksViewFeature={blocksViewFeature}
        title={''}
        data={phase}
        source={source}
      />
    </div>
  )
}

export default CostSheetSetup
