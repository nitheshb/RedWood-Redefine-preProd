import React from 'react'
import Profileimg from '../../../../public/Profileimg.png'
import imagebox from '../../../../public/imagebox.png'
const ProfileCard = ({ data }) => {
  const defaultData = {
    name: 'ABC',
    dob: 'Nov-13-2024',
    maritalStatus: 'Single',
    phoneNo: '888888888',
    panCard: 'SDJUDBJEO',
    aadharCard: '44548484649',
    profileImage: imagebox,
  }

  const mergedData = { ...defaultData, ...data }

  return (
    <div className="max-w-sm bg-white rounded-3xl shadow-lg  mx-auto">
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-blue-100 rounded-t-3xl">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${Profileimg})`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        <div className="absolute top-4 left-4">
          <span className="bg-red-400 text-white px-3 py-1 rounded-full text-sm">
            Primary
          </span>
        </div>

        <div className="relative top-10  pt-12 flex justify-center">
          <div className="bg-[#CCEAFF] p-1 rounded-2xl shadow-md">
            <img
              src={mergedData.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Test</h2>
      </div>

      <div className="space-y-6 p-4">
        <h3 className="text-lg font-semibold">Details</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900">{mergedData.name}</p>
              <p className="text-gray-400 text-sm">Name</p>
            </div>
            <div className="text-right">
              <p className="text-gray-900">{mergedData.dob}</p>
              <p className="text-gray-400 text-sm">D.O.B</p>
            </div>
          </div>

          <hr />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900">{mergedData.maritalStatus}</p>
              <p className="text-gray-400 text-sm">Marital Status </p>
            </div>
            <div className="text-right">
              <p className="text-gray-900">{mergedData.phoneNo}</p>
              <p className="text-gray-400 text-sm">Phone no</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Documents</h3>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900">{mergedData.panCard}</p>
              <p className="text-gray-400 text-sm">Pan Card</p>
            </div>
            <div className="text-right">
              <p className="text-gray-900">{mergedData.aadharCard}</p>
              <p className="text-gray-400 text-sm">Aadhar Card</p>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex justify-end px-4 py-2">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ProfileCard
