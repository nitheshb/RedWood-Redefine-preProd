import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { useSnackbar } from 'notistack'
import { updateUnitStatus } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from 'src/util/computeCsTotals'
import { prettyDate } from 'src/util/dateConverter'
import SiderForm from '../SiderForm/SiderForm'
import CrmConfirmationDialog from './CrmConfirmationDialog'
import PdfPaymentScheduleGenerator from 'src/util/PdfPaymentScheduleGenerator'

const CrmUnitPaymentSchedule = ({ selCustomerPayload,  assets, totalIs }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [partATotal, setPartA] = useState(0)
  const [partBTotal, setPartB] = useState(0)
  const [unitTotal, setUnitTotal] = useState(0)
  const [unitReceivedTotal, setReceivedTotal] = useState(0)
  const [PSa, setPSa] = useState([])



  // const [isOpenSideView, setIsOpenSideView] = useState(false);
  // const [isSwitchOn, setIsSwitchOn] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);


  // const toggleSiderForm = () => {
  //   setIsOpenSideView((prev) => !prev);
  // };


  // const handleConfirm = () => {
  //   console.log('Confirm button clicked');
  //   setIsSwitchOn(true);
  //   setIsDialogOpen(false);
  //   setIsOpenSideView(false);
  // };


  // const handleCancel = () => {
  //   console.log('Cancel button clicked');
  //   setIsSwitchOn(false);
  //   setIsDialogOpen(false);
  //   setIsOpenSideView(false);
  // };








  const [isOpenSideView, setIsOpenSideView] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [switchOn, setSwitchOn] = useState(false);


  const toggleSiderForm = () => {
    setIsOpenSideView((prev) => !prev);
  };


  const handleConfirm = () => {
    if (selectedItem) {
      setSwitchOn(true);
      triggerPaymentScheudlefun(selectedItem);
    }
    setIsDialogOpen(false);
    setIsOpenSideView(false);
  };


  const handleCancel = () => {
    setSwitchOn(false);
    setIsDialogOpen(false);
    setIsOpenSideView(false);
  };
















  console.log('payload is ', selCustomerPayload)
  useEffect(() => {
    const a = selCustomerPayload?.plotCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    const b = selCustomerPayload?.addChargesCS?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selCustomerPayload?.super_built_up_area || selCustomerPayload?.area?.toString()?.replace(',', '')
          )
        ),
      0
    )
    const c = selCustomerPayload?.addOnCS?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selCustomerPayload?.super_built_up_area || selCustomerPayload?.area?.toString()?.replace(',', '')
          )
        ),
      0
    ) || 0
    setPartA(a)
    setPartB(b)
    setUnitTotal(a + b + c)
    setReceivedTotal(((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0))?.toLocaleString('en-IN'))
    const paidAmount = (selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0)
    let bal = 0
    let leftOver = paidAmount
    let newPaidAmount = paidAmount
    let outStanding = 0
    const z = selCustomerPayload?.fullPs?.map((d1, inx) => {
      console.log('left over stuff',inx, leftOver, d1.value)
      bal = leftOver >= d1?.value ? d1?.value : leftOver

      leftOver = newPaidAmount - d1?.value > 0 ? newPaidAmount - d1?.value : 0
      newPaidAmount = newPaidAmount - d1?.value
      outStanding =  d1?.value - bal
      return { ...d1, amt: bal, leftOver, outStanding }
    })

    setPSa(z)
  }, [selCustomerPayload])

  const triggerPaymentScheudlefun = (selItem) => {
    // PSa.map((d1))
    console.log('d1 is ', selItem)
    const updatedArray = PSa.map((item) => {
      if (item.myId === selItem?.myId) {
        return { ...item, elgible: true }
      } else {
        return item
      }
    })
    setPSa(updatedArray)

    const sum = updatedArray.reduce((total, item) => {
      if (item.elgible) {
        return total + item.value
      } else {
        return total
      }
    }, 0)
    const dataObj = {
      fullPs: updatedArray,
      status: selCustomerPayload?.status,
      T_elgible_new: sum,
      T_elgible_balance: selCustomerPayload?.T_elgible_balance || 0  + selItem?.value
    }
    updateUnitStatus(
      orgId,
      selCustomerPayload?.id,
      dataObj,
      user.email,
      enqueueSnackbar
    )
    return true
  }

  return (
    <>

      

      
      <PdfPaymentScheduleGenerator
      user={user}
      PSa={PSa}
      selCustomerPayload={selCustomerPayload}


      
       />     



      <div className="mt-2">
        <section className="flex flex-col  ">
          <div>
            <div className="border border-[#e5e7f8] bg-[#fff] rounded-md p-3 pb-4">
              <div className="flex flex-row ">
                <img
                  src="https://static.ambitionbox.com/static/benefits/JobTraining.svg"
                  alt=""
                />
                <h1 className=" text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-1 ml-1">
                  Payment Schedule box
                </h1>
              </div>
              <table className="w-full mb- ">
                <thead>
                  {' '}
                  <tr className="  h-8 ">
                    <th className="w-[40%] text-[12px] px-3 text-left   tracking-wide   text-[#3D3D3D]   rounded-tl-[10px]  bg-[#EDEDED] ">
                    Charges
                    </th>
                    {/* <th className="w-[10%] text-[10px] text-right text-gray-400  text-[#823d00]  tracking-wide uppercase">
                      Payment Timeline
                    </th> */}
                    <th className="w-[15%] text-[12px] text-center  tracking-wide   text-[#3D3D3D]     bg-[#EDEDED] ">
                      Eligible
                    </th>
                    <th className="w-[15%] text-[12px]  px-2  text-right tracking-wide    text-[#3D3D3D]     bg-[#EDEDED] ">
                      Total inc GST
                    </th>
                    <th className="w-[15%] text-[12px]  px-2 text-right    tracking-wide    text-[#3D3D3D]     bg-[#EDEDED] ">
                      Received
                    </th>
                    <th className="w-[15%] text-[12px]  px-2 text-right  tracking-wide    text-[#3D3D3D] rounded-tr-[10px]     bg-[#EDEDED]  ">
                      Balance
                    </th>
                    {/* <th className="w-[15%] text-[10px] text-right text-gray-400 text-[#823d00]  tracking-wide uppercase ">
                      Status
                    </th> */}
                  </tr>
                </thead>

                <tbody>
                  {PSa?.map((d1, inx) => {
                    totalIs = selCustomerPayload?.T_review

                    //      {[].map((d1, inx) => {
                    // totalIs = 0
                    // selCustomerPayload?.[`${assets[0]}_T_review`] - d1?.value
                    return (
                      <tr
                        key={inx}
                        className={`border-b-[0.05px] border-gray-300 py-3 h-[51px] ${
                          !d1?.elgible ? '' : ''
                        } `}
                      >
                        <th className=" text-[12px] text-left text-[#6A6A6A] bg-[#fff] tracking-wide pl-3 ">
                          <div>
                            {d1?.stage?.label}
                            <div className="text-[9px] text-left text-[#6A6A6A] bg-[#fff] tracking-wider ">
                              {' '}
                              {d1?.description}-{prettyDate(d1?.schDate)}
                            </div>
                          </div>
                        </th>

                        <td className="text-[10px] text-center  font-bold text-[#6A6A6A] bg-[#fff]">
                          <span
                          // className={`text-[10px] px-2 py-[2px] rounded-2xl  ${
                          //   !d1?.elgible ? '' : 'bg-[#98ebc9]  '
                          // } `}
                          >
                            <div className="">
                              {/* <span className="text-[10px] mt-1 mr-1">Yes</span> */}
                              <Switch
                                checked={d1?.elgible}
                                onChange={() => triggerPaymentScheudlefun(d1)}
                                className={`${
                                  d1?.elgible ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span
                                  className={`${
                                    d1?.elgible
                                      ? 'translate-x-6'
                                      : 'translate-x-1'
                                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>
                          </span>
                        </td>
                        <td className="text-[12px] text-right text-[#6A6A6A] bg-[#fff] px-2 ">
                          ₹{d1?.value?.toLocaleString('en-IN')}
                        </td>

                        <td className="text-[12px] text-right text-green-600 bg-[#fff] px-2 font-bold">
                          {/* {totalIs > d1?.value?.toLocaleString('en-IN')
                          ? d1?.value?.toLocaleString('en-IN')
                          : 0} */}
                          {/* ₹{d1?.elgible ? totalIs?.toLocaleString('en-IN') : 0} */}
                          ₹{d1?.amt?.toLocaleString('en-IN')}
                        </td>
                        <td className="text-[12px] text-right text-[#6A6A6A] bg-[#fff] px-2 ">
                          {/* ₹{d1?.leftOver?.toLocaleString('en-IN')} */}₹
                          {d1?.outStanding?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}

                  <tr className=" py-3 h-[51px] ">
                    <td className="text-[10px] text-right text-gray-400  bg-[#fff]"></td>
                    {/* <td className="text-[10px] text-right text-gray-400 "></td> */}
                    <th className="text-[12px] text-left font-semibold text-[#6A6A6A]  ">
                      Total Value:
                    </th>
                    <th className="text-[10px] text-right text-gray-800 bg-[#fff] ">
                      <section className="py-1 d-md  font-semibold text-[#6A6A6A] text-[12px]leading-none px-2 ">
                        ₹{unitTotal?.toLocaleString('en-IN')}
                      </section>
                    </th>
                    <th className="text-[10px] text-right text-gray-800 bg-[#fff] ">
                      <section className="py-1 d-md  font-semibold text-[#6A6A6A] text-[12px] leading-none px-2 ">
                        ₹{unitReceivedTotal?.toLocaleString('en-IN')}
                      </section>
                    </th>
                    <th className="text-[10px] text-right text-gray-800 bg-[#fff] ">
                      <section className="py-1 d-md font-semibold text-[#6A6A6A] text-[12px] leading-none px-2 ">
                        {/* ₹{unitReceivedTotal?.toLocaleString('en-IN')} */}
                      </section>
                    </th>
                    {/* <th className="text-[10px] text-right text-gray-800 ">
                    <section className="py-1 d-md font-bold text-[14px] text-[#000000e6] leading-none">
                    ₹{unitTotal?.toLocaleString('en-IN')}
                  </section>
                    </th> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>




{/*
        <Switch
        checked={isOpenSideView}
        onChange={toggleSiderForm}
        className={`${
          isOpenSideView ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            isOpenSideView ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch> */}

      {isOpenSideView && (
        <SiderForm
          open={isOpenSideView}
          setOpen={setIsOpenSideView}
          title={'confirmationDialog'}
          unitsViewMode={false}
          widthClass="max-w-xl"
          selUnitDetails={selCustomerPayload}
        />
      )}

      {isDialogOpen && (
        <CrmConfirmationDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}


















      </div>
    </>
  )
}

export default CrmUnitPaymentSchedule
