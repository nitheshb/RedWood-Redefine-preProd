import React from 'react'

const ProjectFilterDropdown = ({ selectedFilter, setSelectedFilter }) => {
  const filterOptions = ['All', 'Apartment', 'Plots', 'Villas', 'WeekendVillas']

  return (
    <div className="flex  mr-4 border border-gray-300 rounded-md items-center hover:border-1 hover:border-gray-400">
      <select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
        className="h-8 px-1 mr-1 text-sm    rounded-md focus:outline-none focus:ring-0 "
      >
        {filterOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProjectFilterDropdown
