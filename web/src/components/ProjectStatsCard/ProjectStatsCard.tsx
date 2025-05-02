import { ToWords } from 'to-words'

const toWords = new ToWords({
  localeCode: 'en-IN',
})
const ProjectStatsCard = ({ kind, iconP, feedData, bg, currency }) => {
  return (
    <div
      className="drop-shadow-md min-w-full z-10 flex flex-col  max-w-md p-4 mx-auto my-0 rounded-lg "
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center flex-shrink-0  px-0  pl-0 mb-2 justify-center">
        <img className="w-8 h-8" alt="" src={iconP}></img>
        <span className="relative z-10 flex items-center w-auto text-xl font-bold leading-none pl-0 ml-1 ">
          {kind}
        </span>
      </div>

      <ul className="flex-1 p-0 mt-4 ml-2 mr-2 leading-7 text-gray-900 border-0 border-gray-200">
        {feedData.map((data, i) => {
          return (
            <li
              key={i}
              className="flex justify-between  w-full mb-2  font-semibold text-left border-dotted border-b border-gray-300 "
            >
              <span className="inline-flex">
                <span className="text-[16px] text-gray-900 font-light  text-gray-900">
                  {' '}
                  {data.k}
                </span>
              </span>

              <div
                className="relative flex flex-col items-center group"
                style={{ alignItems: 'end' }}
              >
                <div
                  className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex"
                  style={{ alignItems: 'end', width: '300px' }}
                >
                  <span
                    className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                    style={{
                      color: 'black',
                      background: '#e2c062',
                      maxWidth: '300px',
                    }}
                  >
                    <span className="italic">
                      {toWords?.convert(data?.v || 0, { currency: currency })}
                    </span>
                  </span>
                  <div
                    className="w-3 h-3  -mt-2 rotate-45 bg-black"
                    style={{ background: '#e2c062', marginRight: '12px' }}
                  ></div>
                </div>
                <span className="text-[16px] font-medium text-gray-900">
                  {data?.v?.toLocaleString('en-IN')}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ProjectStatsCard
