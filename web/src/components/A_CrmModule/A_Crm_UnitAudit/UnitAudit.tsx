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
   

<div className="h-full flex bg-white mx-2 rounded-lg border border-gray-100 flex-col py-6 bg-gray-50 overflow-y-scroll">
  <div className="px-6 max-w-5xl mx-auto w-full">
    <div className="flex flex-col space-y-4">
      
   
      <h2 className="text-xl font-semibold text-gray-800">Unit Information</h2>

      <div className="grid gap-8 grid-cols-1">
        <div className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mt-0">
            <p className="text-gray-700">
              Review and recalculate unit details to ensure all data is accurate and up-to-date.
            </p>
            <button
              className="bg-[#00ADB4] px-6 py-2 mt-4 text-sm shadow-sm font-medium tracking-wider text-white rounded-lg hover:shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center"
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


  )
}

export default UnitAudit
