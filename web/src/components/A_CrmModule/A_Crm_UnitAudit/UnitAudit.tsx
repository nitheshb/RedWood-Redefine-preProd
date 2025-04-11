import { useState } from 'react'

import { useSnackbar } from 'notistack'

import Loader from 'src/components/Loader/Loader'
import {
  editPlotStatusAuditUnit,
  getAllUnitsByProject,
  streamGetAllUnitTransactions,
  unitAuditDbFun,
  updateProjectComputedData,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from 'src/util/computeCsTotals'
import { CheckCircleIcon } from 'lucide-react'

const UnitAudit = ({ title, dialogOpen, data, selUnitDetails }) => {
  const [loading, setLoading] = useState(false)
  const [unitDetailsA, setUnitDetailsA] = useState([])
  const [unitTransactionsA, setUnitTransactionsA] = useState([])

  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const { orgId } = user

  const auditFun = async () => {
    console.log('audit begin')
    setLoading(true)


    await setProjectComputedCounts()

  }

  const setInvalidUnitStatus = async () => {
    console.log('login role detials', user)
    const { access, uid } = user

    if (access?.includes('manage_leads')) {
      const unsubscribe = getAllUnitsByProject(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id

            return x
          })
          usersListA.sort((a, b) => {
            return b?.booked_on || 0 - b?.booked_on || 0
          })

          usersListA.map(async (data) => {
            if (data?.status === '') {
              const statusObj = { status: 'available' }
              try {
                await editPlotStatusAuditUnit(
                  orgId,
                  data?.id,
                  statusObj,
                  user?.email,
                  `Unit Status Marked by Audit`,
                  enqueueSnackbar
                )
              } catch (error) {
                enqueueSnackbar('Plot details Updation Failed', {
                  variant: 'success',
                })
              }
            }
          })
          setLoading(false)
        },
        {
          projectId: projectDetails?.uid,
        },
        () => {}
      )
      return unsubscribe
    }

  }

  const getAllTransactionsUnit = async () => {
    const { access, uid } = user

    const steamLeadLogs = await streamGetAllUnitTransactions(
      orgId,
      'snap',
      {
        unit_id: selUnitDetails?.id,
      },
      (error) => []
    )
    console.log('units are', steamLeadLogs)
    await setUnitTransactionsA(steamLeadLogs)
    return steamLeadLogs
  }
  const setProjectComputedCounts = async () => {
    console.log('login role detials', user)
    const { access, uid } = user


    const transactoinsA = await getAllTransactionsUnit()


    await computeAmoounts(transactoinsA)




    return
    const unsubscribe = await getAllUnitsByProject(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id

          return x
        })
        usersListA.sort((a, b) => {
          return b?.booked_on || 0 - b?.booked_on || 0
        })

        setUnitDetailsA(usersListA)

        setLoading(false)
      },
      {
        projectId: projectDetails?.uid,
      },
      () => {}
    )
    const yo = {
      totalUnitCount: 0,
      availableCount: 0,
      bookUnitCount: 0,
      soldUnitCount: 0,
      blockedUnitCount: 0,
      management_blocked: 0,
      soldArea: 0,
      custBlockArea: 0,
      mangBlockArea: 0,
      blockedArea: 0,
    }
    await unitDetailsA.map((data) => {
      yo.totalUnitCount = yo.totalUnitCount + 1
      if (data?.status == 'available') {
        yo.availableCount = yo.availableCount + 1
      } else if (data?.status == 'customer_blocked') {
        yo.blockedUnitCount = yo.blockedUnitCount + 1
        yo.custBlockArea = yo.custBlockArea + (data?.area || 0)
        yo.availableCount = yo.availableCount + 1
      } else if (data?.status == 'management_blocked') {
        yo.blockedUnitCount = yo.blockedUnitCount + 1
        yo.mangBlockArea = yo.mangBlockArea + (data?.area || 0)
        yo.management_blocked = yo.management_blocked + 1
      } else if (data?.status == 'booked') {
        yo.bookUnitCount = yo.bookUnitCount + 1
      }

      if (
        ['sold', 'ats_pipeline', 'agreement_pipeline', 'booked'].includes(
          data?.status
        )
      ) {
        yo.soldUnitCount = yo.soldUnitCount + 1
        yo.soldArea = yo.soldArea + (data?.area || 0)
      }

      if (['customer_blocked', 'management_blocked'].includes(data?.status)) {
        yo.blockedArea = yo.blockedArea + (data?.area || 0)
      }
    })

    await updateProjectComputedData(orgId, projectDetails?.uid, yo)
    return unsubscribe

    // await console.log('leadsData', leadsData)
  }
  const computeAmoounts = async (transactoinsA) => {
    console.log('values are', unitTransactionsA, selUnitDetails?.id)

    let T_E = (selUnitDetails?.possessionAdditionalCostCS?.reduce(function (
      _this,
      val
    ) {
      return (
        _this + (isNaN(val.TotalNetSaleValueGsT) ? 0 : val.TotalNetSaleValueGsT)
      )
    },
    0) || 0)
    let T_F =  (selUnitDetails?.addOnCS?.reduce(function (
      _this,
      val
    ) {
      return (
        _this + (isNaN(val.TotalNetSaleValueGsT) ? 0 : val.TotalNetSaleValueGsT)
      )
    },
    0) || 0)

    const totalUnitCost = (
      (selUnitDetails?.plotCS?.reduce(function (
        _this,
        val
      ) {
        return (
          _this + (isNaN(val.TotalNetSaleValueGsT) ? 0 : val.TotalNetSaleValueGsT)
        )
      },
      0) || 0)
       +

      (selUnitDetails?.addChargesCS?.reduce(function (
        _this,
        val
      ) {
        return (
          _this + (isNaN(val.TotalNetSaleValueGsT) ? 0 : val.TotalNetSaleValueGsT)
        )
      },
      0) || 0) +
        (selUnitDetails?.constructCS?.reduce(function (
          _this,
          val
        ) {
          return (
            _this + (isNaN(val.TotalNetSaleValueGsT) ? 0 : val.TotalNetSaleValueGsT)
          )
        },
        0) || 0) +
        (selUnitDetails?.constAdditionalChargesCS?.reduce(function (
          _this,
          val
        ) {
          return (
            _this + (isNaN(val.TotalNetSaleValueGsT) ? 0 : val.TotalNetSaleValueGsT)
          )
        },
        0) || 0) +
        T_E+
        (selUnitDetails?.addOnCS?.reduce(function (
          _this,
          val
        ) {
          return (
            _this + (isNaN(val.TotalNetSaleValueGsT) ? 0 : val.TotalNetSaleValueGsT)
          )
        },
        0) || 0)
    )
    console.log('elgible amount is x12',selUnitDetails?.fullPs)
    let InReviewAmount = 0
    let totalReceivedAmount = 0
    let totalApprovedAmount = 0
    let totalCancelledAmount = 0
    transactoinsA.map((d) => {
      totalReceivedAmount =
        totalReceivedAmount + (Number(d?.totalAmount) || Number(d?.amount))

      if (d.status === 'review') {
        InReviewAmount =
          InReviewAmount + (Number(d?.totalAmount) || Number(d?.amount))
      } else if (d.status === 'cancelled') {
        totalCancelledAmount =
          totalCancelledAmount + (Number(d?.totalAmount) || Number(d?.amount))
      } else if (d.status === 'received') {
        totalApprovedAmount =
          totalApprovedAmount + (Number(d?.totalAmount) || Number(d?.amount))
      }
      console.log('elgible amount is x1',selUnitDetails?.fullPs)

      const elgibleAmount = selUnitDetails?.fullPs.reduce((total, item) => {
        console.log('elgible amount is x',item.value)
        if (item.elgible) {
          console.log('elgible amount is ',item.value)
          return total + (isNaN(item.value) ? 0 : item.value)
        } else {
          console.log('elgible amount is ',item.value, total)

          return total
        }
      }, 0)
      console.log('elgible amount is ',selUnitDetails?.unit_no,'-->',totalUnitCost, elgibleAmount)
      unitAuditDbFun(
        orgId,
        selUnitDetails?.pId,
        selUnitDetails?.id,
        totalUnitCost,
        elgibleAmount,
        totalReceivedAmount,
        InReviewAmount,
        totalApprovedAmount,
        totalCancelledAmount,
        T_E,
        T_F

      )

      setLoading(false)
      console.log(
        'valueare a',
        totalUnitCost,
        InReviewAmount,
        totalReceivedAmount,
        totalApprovedAmount,
        totalCancelledAmount
      )
    })
  }
  return (





    <div className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
  <div className="relative min-h-screen mr-6">
    {/* Background image */}
    {/* <div className="">
      <img alt="CRM Background" src="/bgimgcrm.svg" className="w-full h-auto" />
    </div> */}



        <div className="relative z-0">



<h1 className="text-[#606062] font-outfit  mx-auto w-full tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
unit analayes
  </h1>
  

  <img
    alt="CRM Background"
    src="/bgimgcrm.svg"
    className="w-full h-auto object-cover"
  />


  <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Last Modified</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
      </div>
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">More info here</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
      </div>
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Audit Done By</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>

      </div>
    </div>
  </div>
</div>



    <div className="w-full h-full flex justify-center mt-[-70px] z-10 relative">
  <div className=" max-w-4xl mx-auto px-4 w-full">

  {/* <h1 className="text-[#606062] tracking-[0.06em]  font-medium text-[12px] uppercase  pl-4">Unit Analysis  </h1> */}

    <div className="flex flex-col mt-2 space-y-4">
      
   
      {/* <h2 className="text-xl font-semibold text-[#213343]">Unit Information</h2> */}

      <div className="grid gap-8 grid-cols-1">
        <div className="flex flex-col bg-[#FFFFFF] p-6 rounded-2xl  ">
          <div className="mt-0">
            <p className="text-gray-700 font-outfit">
              Review and recalculate unit details to ensure all data is accurate and up-to-date.
            </p>
            <button
              className="bg-[#E8E6FE] px-6 py-2 mt-4 text-sm shadow-sm font-medium tracking-wider text-black hover:text-black rounded-lg hover:shadow-md hover:bg-[#DBD3FD] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center"
              type="submit"
              onClick={() => auditFun()}
              disabled={loading}
            >
              {loading && <Loader />}
              <span>Audit Unit-{selUnitDetails?.unit_no}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  </div>
</div>
   




  )
}

export default UnitAudit
