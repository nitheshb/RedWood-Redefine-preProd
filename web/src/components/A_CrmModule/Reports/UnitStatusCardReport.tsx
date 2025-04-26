const UnitStatusCardReport = ({ project }) => {
  const { totalUnitCount, availableCount, soldUnitCount, blockUnitCount } =
    project
  return (
    <div className="flex flex-col bg-white shadow rounded-md my-2  px-2  py-2">
      <h6 className="font-bodyLato font-semibold text-xs m-1 mb-4">
        {'Status'}
      </h6>
      <div className="flex flex-row justify-between px-1">
        {[
          { item: 'Booked', value: soldUnitCount || 0 },
          { item: 'Agreement', value: 0 },
          { item: 'Registered', value: 0 },
        ].map((data, i) => (
          <div
            className=" w-1/4  mx-1"
            style={{ display: 'inline-block', alignSelf: 'flex-end' }}
            key={i}
          >
            <div className="flex flex-col  justify-center mr-1  mb-1 mt[2px]">
              <h6 className="font-bodyLato font-semibold text-xs mt-1">
                {data.value}
              </h6>
              <h6 className="font-bodyLato text-[#828d9e] text-xs mt-1">
                {data.item}
              </h6>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between px-1 mt-3">
        {[
          { item: 'Construction', value: 0 },
          { item: 'Possession', value: 0 },
          { item: '', value: '' },
        ].map((data, i) => (
          <div
            className=" w-1/4  mx-1"
            style={{ display: 'inline-block', alignSelf: 'flex-end' }}
            key={i}
          >
            <div className="flex flex-col  justify-center mr-1  mb-1 mt[2px]">
              <h6 className="font-bodyLato font-semibold text-xs mt-1">
                {data.value}
              </h6>
              <h6 className="font-bodyLato text-[#828d9e] text-xs mt-1">
                {data.item}
              </h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UnitStatusCardReport
