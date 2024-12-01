import { CountUpRupeeComp } from 'src/components/comps/countUpRupeeComp'

const TransactionCard = ({ projectDetails }) => {
  const { soldValue, t_collect, t_mtd, totalValue, t_bal, t_refund } =
    projectDetails
  return (
    <div className="flex flex-col bg-white shadow rounded-md my-2  px-2  py-2">
      <h6 className="font-bodyLato font-semibold text-xs m-1 mb-4">
        {'Transactions'}
      </h6>
      <div className="flex flex-row justify-between px-1">
        {[
          { item: 'Total', value: totalValue || 0 },
          { item: 'Sale', value: soldValue || 0 },
          { item: 'Collected', value: t_collect || 0 },
        ].map((data, i) => (
          <div
            className=" w-1/4  mx-1"
            style={{ display: 'inline-block', alignSelf: 'flex-end' }}
            key={i}
          >
            <div className="flex flex-col  justify-center mr-1  mb-1 mt[2px]">
              <h6 className="font-bodyLato font-semibold text-xs mt-1">
                <CountUpRupeeComp value={data.value} />
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
          { item: 'MTD ', value: t_mtd || 0 },
          { item: 'Balance', value: t_bal || 0 },
          { item: 'Refunds', value: t_refund || 0 },
        ].map((data, i) => (
          <div
            key={i}
            className=" w-1/4  mx-1"
            style={{ display: 'inline-block', alignSelf: 'flex-end' }}
          >
            <div className="flex flex-col  justify-center mr-1  mb-1 mt[2px]">
              <h6 className="font-bodyLato font-semibold text-xs mt-1">
                <CountUpRupeeComp value={data.value} />
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

export default TransactionCard
