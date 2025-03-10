/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react'
import { MetaTags } from '@redwoodjs/web'
import TodayLeadsActivityListHomeView from './TodayLeadsAcivityListHome'


const TodayLeadsHomePage = ({ taskType }) => {
  const [, setisImportLeadsOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [addLeadsTypes, setAddLeadsTypes] = useState('')

  const selUserProfileF = (title) => {
    setAddLeadsTypes(title)
    setisImportLeadsOpen(true)
  }
  return (
    <>
      <div className="flex  flex-row  text-gray-700">
        <div className="flex-1 overflow-auto">
          <div className="px-1">


            <MetaTags title="ExecutiveHome" description="ExecutiveHome page" />
            {!ready && (
              <TodayLeadsActivityListHomeView
                setisImportLeadsOpen={setisImportLeadsOpen}
                selUserProfileF={selUserProfileF}
                taskType={taskType}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default TodayLeadsHomePage
