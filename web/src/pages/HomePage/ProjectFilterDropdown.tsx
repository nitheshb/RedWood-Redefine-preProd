import React from 'react';

const ProjectFilterDropdown = ({ selectedFilter, setSelectedFilter }) => {
  const filterOptions = ['All', 'Apartment', 'Plots', 'Villas','WeekendVillas'];
  
  return (
    <div className="flex items-center">
      <select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
        className="h-8 px-3 mr-4 text-sm bg-white border border-gray-300 rounded-md "
      >
        {filterOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

    </div>
  );
};

export default ProjectFilterDropdown;