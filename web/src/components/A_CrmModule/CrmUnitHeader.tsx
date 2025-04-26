import { useEffect } from 'react'
import { useAuth } from 'src/context/firebase-auth-context'

const CrmUnitHeader = ({ projectDetails }) => {
  const { user } = useAuth()
  const { orgId } = user

  useEffect(() => {
    console.log('projectDetails', projectDetails)
  }, [projectDetails])

  return (
    <>
      <div className="flex flex-row justify-between ">
        <img className="w-[80px]" src={'/nirvana_logo.png'} alt="" />

        <div className="pt-2 flex flex-row">
          <img
            className="w-[98px] h-[51px] mt-[8px]"
            alt="barcode"
            src="/ps_logo.png"
          />
          <img
            className="w-[89px] h-[42px] ml-4 mt-[15px]"
            alt="barcode"
            src="/maahomes_logo.png"
          />
        </div>
      </div>
    </>
  )
}

export default CrmUnitHeader
