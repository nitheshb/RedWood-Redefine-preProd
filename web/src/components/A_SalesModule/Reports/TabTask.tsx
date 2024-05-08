import React, { useState } from 'react';

const TabTask = () => {
  const [searchParams, setSearchParams] = useState({
    where: '',
    checkIn: '',
    checkOut: '',
    guests: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search Params:', searchParams);
    // Implement the search logic or redirect to the search results page
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2 p-4">
      <input
        type="text"
        name="where"
        placeholder="Search destinations"
        value={searchParams.where}
        onChange={handleInputChange}
        className="w-1/4 h-10 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-400"
      />
      <input
        type="text"
        name="checkIn"
        placeholder="Add dates"
        value={searchParams.checkIn}
        onChange={handleInputChange}
        className="w-1/6 h-10 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-400"
      />
      <input
        type="text"
        name="checkOut"
        placeholder="Add dates"
        value={searchParams.checkOut}
        onChange={handleInputChange}
        className="w-1/6 h-10 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-400"
      />
      <input
        type="text"
        name="guests"
        placeholder="Add guests"
        value={searchParams.guests}
        onChange={handleInputChange}
        className="w-1/6 h-10 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-400"
      />
      <button
        type="submit"
        className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M19 10c0 1.105-.895 2-2 2H7c-1.105 0-2-.895-2-2s.895-2 2-2h10c1.105 0 2 .895 2 2z" />
        </svg>
      </button>
    </form>
  );
};





export default TabTask