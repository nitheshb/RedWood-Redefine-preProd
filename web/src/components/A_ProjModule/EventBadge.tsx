import React from 'react';

const EventBadge = () => {
  const eventData = {
    edition: '16th',
    name: 'Poultry India',
    date: '27 - 28 - 29 November 2024',
    location: 'Nashik, India',
    registrationId: 'PIV-IN-2024-402995',
    logoUrl: '/path/to/event-logo.png',
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center">
          <img src={eventData.logoUrl} alt="Event Logo" className="w-20 mb-4" />
          <h2 className="text-3xl font-bold mb-2">{eventData.name}</h2>
          <p className="text-gray-600 mb-4">{eventData.edition} Edition</p>
          <p className="text-gray-600 mb-4">{eventData.date}</p>
          <p className="text-gray-600 mb-4">{eventData.location}</p>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-600 font-bold">Reg Id</p>
            <p className="text-gray-800">{eventData.registrationId}</p>
          </div>
          <img src="/path/to/qr-code.png" alt="QR Code" className="w-24 mt-4" />
        </div>
      </div>
    </div>
  );
};

export default EventBadge;