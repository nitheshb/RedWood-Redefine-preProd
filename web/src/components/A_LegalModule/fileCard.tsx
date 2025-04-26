import React, { useState, useEffect } from 'react'
import './fileCard.css'
import 'react-circular-progressbar/dist/styles.css'

const FileCardAnim = (props) => {
  const { count, title, projectDetails } = props
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    console.log('projectDetails ', projectDetails)
  }, [])

  return (
    <div>
      <div className=" border border-green rounded-xl hover:shadow-lg ml-2 mb-2 mr-2 mt-5 ">
        <section className=" m-2 flex flex-col w-[250px] px-2">
          <div>
            <img className="h-12 w-12 " src={projectDetails.img} alt="" />
          </div>
          <br />
          <div className="text-md  ml-2  text-gray-700 leading-normal ">
            {projectDetails?.name}
          </div>
        </section>
      </div>
    </div>
  )
}

export default FileCardAnim
