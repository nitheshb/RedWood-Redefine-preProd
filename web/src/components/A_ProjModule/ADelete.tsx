import React, { useState } from 'react';

const TabNavigation = () => {
  const [selFeature, setFeature] = useState('summary');

  const tabItems = [
    {  
      icon: (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.64648 6.53467C2.64648 4.64905 2.64648 3.70624 3.23227 3.12046C3.81805 2.53467 4.76086 2.53467 6.64648 2.53467C8.5321 2.53467 9.47491 2.53467 10.0607 3.12046C10.6465 3.70624 10.6465 4.64905 10.6465 6.53467V8.53467C10.6465 10.4203 10.6465 11.3631 10.0607 11.9489C9.47491 12.5347 8.5321 12.5347 6.64648 12.5347C4.76086 12.5347 3.81805 12.5347 3.23227 11.9489C2.64648 11.3631 2.64648 10.4203 2.64648 8.53467V6.53467Z" 
            stroke={selFeature === 'summary' ? '#484848' : '#A6A6A6'} 
            strokeWidth="1.5"/>
          <path d="M2.64648 19.5347C2.64648 18.6028 2.64648 18.1369 2.79872 17.7693C3.00171 17.2793 3.39106 16.8899 3.88111 16.6869C4.24866 16.5347 4.7146 16.5347 5.64648 16.5347H7.64648C8.57836 16.5347 9.0443 16.5347 9.41185 16.6869C9.9019 16.8899 10.2913 17.2793 10.4942 17.7693C10.6465 18.1369 10.6465 18.6028 10.6465 19.5347C10.6465 20.4666 10.6465 20.9325 10.4942 21.3001C10.2913 21.7901 9.9019 22.1795 9.41185 22.3825C9.0443 22.5347 8.57836 22.5347 7.64648 22.5347H5.64648C4.7146 22.5347 4.24866 22.5347 3.88111 22.3825C3.39106 22.1795 3.00171 21.7901 2.79872 21.3001C2.64648 20.9325 2.64648 20.4666 2.64648 19.5347Z" 
            stroke={selFeature === 'summary' ? '#484848' : '#A6A6A6'} 
            strokeWidth="1.5"/>
          {/* Other paths for the summary icon */}
        </svg>
      ), 
      lab: 'Summary', 
      val: 'summary' 
    },
    { 
      icon: (
        <svg width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.14648 4.28467C8.14648 3.31817 8.92999 2.53467 9.89648 2.53467H15.3965C16.363 2.53467 17.1465 3.31817 17.1465 4.28467C17.1465 5.25117 16.363 6.03467 15.3965 6.03467H9.89648C8.92999 6.03467 8.14648 5.25117 8.14648 4.28467Z" 
            stroke={selFeature === 'applicant_info' ? '#484848' : '#A6A6A6'} 
            strokeWidth="1.5" strokeLinejoin="round"/>
          {/* Other paths for the applicant details icon */}
        </svg>
      ), 
      lab: 'Applicant details', 
      val: 'applicant_info' 
    },
    { 
      icon: (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6465 6.53467H21.6465" 
            stroke={selFeature === 'unit_information' ? '#484848' : '#A6A6A6'} 
            strokeWidth="1.5" strokeLinecap="round"/>
          {/* Other paths for the unit details icon */}
        </svg>
      ), 
      lab: 'Unit details', 
      val: 'unit_information' 
    },
    // Add other tab items following the same pattern
  ];

  return (
    <div className="border-gray-900 py-4 bg-[#F9F9FA] rounded-t-lg">
      <ul 
        className="flex flex-col rounded-t-lg"
        id="myTab"
        data-tabs-toggle="#myTabContent"
        role="tablist"
      >
        {tabItems.map((item, index) => (
          <li
            key={index}
            className="mr-2 ml-2 text-sm font-bodyLato"
            role="presentation"
          >
            <div 
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer w-60 ${
                selFeature === item.val 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setFeature(item.val)}
            >
              {React.cloneElement(item.icon, {
                stroke: selFeature === item.val ? '#484848' : '#A6A6A6'
              })}
              <button
                className={`inline-block py-3 mr-3 px-1 text-sm font-medium text-center rounded-lg border-b-2 hover:text-[#484848] ${
                  selFeature === item.val
                    ? 'text-[#484848]'
                    : 'text-[#A6A6A6]'
                }`}
                type="button"
                role="tab"
              >
                {item.lab}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabNavigation;