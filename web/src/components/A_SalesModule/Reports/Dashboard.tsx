

import React from 'react';

const Dashboard = () => {
  const teamMembers = [
    { name: 'Andrew T.', image: 'https://picsum.photos/seed/andrew/100' },
    { name: 'Anna T.', image: 'https://picsum.photos/seed/anna/100' },
    { name: 'John L.', image: 'https://picsum.photos/seed/john/100' },
    { name: 'Mark S.', image: 'https://picsum.photos/seed/mark/100' },
  ];

  return (
    <div className="w-[800px] p-6 shadow-lg  bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <select className="border rounded px-2 py-1 text-sm text-gray-600">
          <option>All time</option>
        </select>
      </div>

      <div className="grid bg-gray-100 rounded-lg p-2  grid-cols-2 gap-4 mb-6">
        <div className="bg-[#fff] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Customers</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">6%</span>
          </div>
          <div className="text-3xl font-bold">10.382</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Income</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">3%</span>
          </div>
          <div className="text-4xl font-bold">$1.384.328,00</div>
        </div>
      </div>

      <div className="mb-6">

      <p className="text-sm text-gray-600">
  Welcome to our new 
  <span className="font-bold text-black"> online experience</span>
</p>

     
      </div>

      <div className="flex justify-between">
        {teamMembers.map((member, index) => (
        <div key={index}  className="max-w-sm mx-auto  rounded-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-4">
          <img className="h-16 w-16 rounded-full border-4 border-[#8a8a8b]" src={member.image} alt={member.name}  />
          <div className="ml-4 text-center">
            <h2 className="text-md font-bold text-gray-800 py-1">{member.name}</h2>
            <p className="text-gray-600 ">@User</p>
          </div>
        </div>
        <div className="px-6 ">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600">Add contact</button>
        </div>
      </div>

          




        ))}
      </div>
    </div>
  );
};

export default Dashboard;