const DummyBodyLayout = () => {
  return (
    <div>
      <div className="py-8 px-8 flex flex-col items-center bg-red-100 mt-5 rounded">
        <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
          <img
            className="w-[180px] h-[180px] inline"
            alt=""
            src="/note-widget.svg"
          />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-gray-900 ">No Data</h3>
        <button onClick={() => selFun()}>
          <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
            
            {/* <span className="text-"> Add Data</span> */}

            <span className="flex items-center gap-4 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
  Add Data
</span>

          </time>
        </button>
      </div>
    </div>
  )
}

export default DummyBodyLayout
