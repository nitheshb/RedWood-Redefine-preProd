import React from 'react'
import HeadNavBar from 'src/components/HeadNavBar/HeadNavBar'
import HeadSideBar from 'src/components/HeadSideBar/HeadSideBar'
import Account from 'src/components/profile/account'
import CheckBox from 'src/components/profile/checkBox'
import PersonalDetails from 'src/components/profile/personalDetails'
import SiteVisitRegisterForm from './siteVisitRegisterForm'

const SiteVisitRegister = () => {
  return (
    <div>

      <div className="flex flex-row overflow-auto  text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
        {/* <HeadSideBar /> */}

        <div className="flex flex-col mx-auto my-[2%]">

          {' '}
          <h1 className="text-5xl text-[#2B2A35] ">Site Visit Entry</h1>
          <p className=" text-lg my-4 ">It’s awesome to have you with us.</p>
          {/* div for making the profile card */}
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-t-lg shadow-lg">
          <div className=" flex flex-col justify-between items-center h-[270px] min-w-[626px] rounded-t-md bg-gray-100">
              <img
                className="w-full relative mt-4"
                src="/Group7.png"
                alt="bg profile"
              />
              <div className=" w-32 h-32 absolute mt-4 bg-gray-400 rounded-full"></div>
              <div>
                {' '}
                <p className=" font-semibold text-2xl text-center ">
                  Maa Homes
                </p>
<div className="">
                <small className="font-medium  text-gray-500 mr-2 pr-2 ">
                  +91 96061 20156
                </small>
                <small className="font-medium  text-gray-500 ">
                  info@maahomes.in
                </small>
              </div>
              </div>

              <p className=" mb-4 font-medium text-gary-600 ">

              </p>
            </div>
          </div>
          <SiteVisitRegisterForm/>

        </div>
      </div>
    </div>
  )
}

export default SiteVisitRegister
