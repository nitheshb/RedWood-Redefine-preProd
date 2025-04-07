

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react'
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline'
import { useSnackbar } from 'notistack'
import {
  deleteBankAccount,
  steamBankDetailsList,
  steamVirtualAccountsList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import SiderForm from './SiderForm/SiderForm'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import TaskManagementDashboard from './A_CrmModule/ToDoList'
const AllBankDetailsView = ({ title, pId, data }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [bankDetialsA, setGetBankDetailsA] = useState([])
  const [visibleAccounts, setVisibleAccounts] = useState({})

  const [sliderInfo, setSliderInfo] = useState({
    open: false,
    title: 'Bank Account',
    sliderData: {},
    widthClass: 'max-w-xl',
  })

  const handleSliderClose = () => {
    setSliderInfo({
      open: false,
      title: '',
      sliderData: {},
      widthClass: 'max-w-xl',
    })
  }

  useEffect(() => {
    getBankDetails()
  }, [])
  const getBankDetails = async () => {
    const { orgId } = user
    if (title === 'Bank Accounts') {
      const unsubscribe = steamBankDetailsList(
        orgId,
        (querySnapshot) => {
          const response = querySnapshot.docs.map((docSnapshot) => {
            return { ...docSnapshot.data(), ...{ docId: docSnapshot.id } }
          })
          console.log('bank_details data is ', response)
          setGetBankDetailsA(response)
        },
        (e) => {
          console.log('error', e)
        }
      )
      return unsubscribe
    } else if (title === 'Virtual Accounts') {
      const unsubscribe = steamVirtualAccountsList(
        orgId,
        (querySnapshot) => {
          const response = querySnapshot.docs.map((docSnapshot) => {
            return { ...docSnapshot.data(), ...{ docId: docSnapshot.id } }
          })
          console.log('bank_details data is ', response)
          setGetBankDetailsA(response)
        },
        (e) => {
          console.log('error', e)
        }
      )
      return unsubscribe
    }
  }
  const deleteAssetFun = async (docId, accountName, usedIn) => {
    console.log('assert details ', docId, accountName, usedIn)
    if (usedIn > 0) {
      enqueueSnackbar(
        `${accountName} Account Cannot be deleted. Remove the linked projects`,
        {
          variant: 'error',
        }
      )
    } else {
      deleteBankAccount(orgId, docId, '', '', '', enqueueSnackbar)
    }
  }


  const [isDialogOpen, setIsDialogOpen] = useState(false);

  
  const [accountToDelete, setAccountToDelete] = useState(null);


  const [selectedBankDe, setSelectedBankDe] = useState<any>(null);


  const toggleAccountVisibility = (accountId) => {
    setVisibleAccounts(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }))
  }


  const openDeleteDialog = (bankDe: any) => {
    setSelectedBankDe(bankDe);
    setIsDialogOpen(true);  
  };
  


  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setAccountToDelete(null);
  };

  
  const confirmDelete = () => {
    if (accountToDelete) {
      deleteAssetFun(
        accountToDelete.docId,
        accountToDelete.accountName,
        accountToDelete.usedInA?.length || 0
      );
    }
    closeDeleteDialog();
  };




  const maskAccountNumber = (accountNo) => {
    if (!accountNo) return "••••••••";
    
    const accountStr = String(accountNo);
    
    if (accountStr.length <= 4) return "•".repeat(accountStr.length);
    
    const lastFour = accountStr.slice(-4);
    const maskedPart = "•".repeat(accountStr.length - 4);
    return maskedPart + lastFour;
  }



  // const getBankIcon = (bankName) => {
  //   return (
  //     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M3 21H21V17H3V21ZM3 3V7H21V3H3ZM3 15H21V9H3V15Z" fill="currentColor"/>
  //     </svg>
  //   );
  // }
  




  return (
    <>
      <div className="mr-10 mt-4">
        <div className="max-w-7xl">
          <section className="flex flex-row justify-between items-center p-4  rounded-lg mb-6">
            {/* <h2 className="text-lg font-semibold ml-5 text-black">{title}</h2> */}
              {/* <span className="flex gap-2 items-center">
                              <img
                                className="w-12 h-12"
                                alt=""
                                src="/paymentsbank.svg"
                              ></img>
                              <span className="relative z-10 flex items-center w-auto text-2xl font-bold leading-none pl-0 mt-[18px]">
                                {title}
                              </span>
              </span> */}

                 <section className='flex flex-row'>
                <img className="w-11 h-11" alt=""                    
                src="/paymentsbank.svg"
                ></img>

                <h2 className="ml-2 mt-2  text-2xl text-[#33475B] font-semibold leading-light font-Playfair">
                  {title}
                </h2>
                </section>

            <button
                 className="flex items-center  bg-[#E5E7EB] hover:bg-gray-100 text-black px-4 py-2 rounded-lg transition duration-200 shadow-sm"
                onClick={() => {
                  setSliderInfo({
                    open: true,
                    title: title,
                    sliderData: {},
                    widthClass: 'max-w-xl',
                  })
                }}
              >
                {bankDetialsA.length > 0 && (
                  <time className="block text-sm font-normal leading-none">
                    <span className="flex items-center">
                      {' '}
                      <PlusCircleIcon
                        className="h-5 w-5 mr-2"
                        aria-hidden="true"
                      />
                      <span>Add New</span>
                    </span>
                  </time>
                )}
              </button>
          </section>


          
          <div className="p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bankDetialsA.map((bankDe, i) => {
              return (
                <section className="inline-block" key={i}>
                  <div className="bg-[#F5F8FA] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <div className=" justify-between mb-4">
                      <div>
                        <div className="flex flex-row justify-between items-center border-b pb-3">

                          <div>

                          {/* <div className="bg-blue-50 p-2 rounded-full mr-3 text-blue-600">
                              {getBankIcon(bankDe?.bank)}
                            </div> */}

                          <p className="text-lg font-semibold text-gray-800">
                            {bankDe?.accountName}
                          </p>
                          <p className="mt-0.5  text-neutral-400 text-sm">
                          {bankDe?.aliasName}
                        </p>

                          </div>


                          <div className="flex items-center">
                            {/* <span className="bg-green-50 text-green-700 px-2 py-1 text-xs rounded-full mr-2">
                              {bankDe?.preferredtype || 'Standard'}
                            </span> */}
                            <TrashIcon
                              onClick={() => openDeleteDialog(bankDe)}
                              className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                              aria-hidden="true"
                            />
                          </div>





                          {/* <span
            
                          >
                            <TrashIcon
                             onClick={() => openDeleteDialog(bankDe)}
                              className="h-4 w-4 mr-1  mt-3 inline cursor-pointer text-red-500 hover:text-red-700"
                              aria-hidden="true"
                            />
                          </span> */}
                        </div>
            
                      </div>
                      {/* <div className="text-right">
                        <p className="text-lg  text-transparent">
                          <span>{'h'}</span>
                        </p>
             
                        <span className="text-green-600  text-sm  rounded-lg font">
                          {bankDe?.preferredtype}
                        </span>
                      </div> */}
                    </div>

  
                    <div className="space-y-4 py-3">
                      <div className="grid grid-cols-2 gap-4">

                        

                      <div>
                        <span className="">
                       
                            </span>
                        </div>


                        <div>
                        <span className="bg-green-50 text-green-700 px-2 py-1 text-xs rounded-full mr-2">
                              {bankDe?.preferredtype || 'Standard'}
                            </span>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Account No</p>
                          {/* <p className="text-sm text-neutral-600 group-hover:text-red-600 duration-150">
                            {bankDe?.accountNo}
                          </p> */}

<div className="flex items-center">
                            <p className="text-sm font-medium text-gray-700">
                              {visibleAccounts[bankDe.docId] 
                                ? bankDe?.accountNo 
                                // : bankDe?.accountNo?.replace(/\d(?=\d{4})/g, "•")}
                                : maskAccountNumber(bankDe?.accountNo)}

                            </p>
                            <button 
                              onClick={() => toggleAccountVisibility(bankDe.docId)} 
                              className="ml-2 text-gray-400 hover:text-gray-700"
                            >
                              {visibleAccounts[bankDe.docId] 
                                ? <EyeOffIcon className="h-4 w-4" /> 
                                : <EyeIcon className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>



                        <div>
                          <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                          <p className="text-sm font-medium text-gray-700">
                            {bankDe?.ifsccode}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Branch Name
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {bankDe?.branchName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Bank</p>
                          <p className="text-sm font-medium text-gray-700 min-h-[24px]">
                            {bankDe?.bank}
                          </p>
                        </div>
                      </div>
                      {/* <div className="flex justify-between group duration-150 cursor-pointer"> */}
                        <div>
                          <p className="text-xs text-neutral-400">GST/PAN NO</p>
                          <p className="text-sm text-neutral-600 ">
                            {bankDe?.gstNo}
                          </p>
                        </div>
                      {/* </div> */}
                    </div>

                    <div className="mt-4 border-t border-gray-100 space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Linked In</p>
                          <p className="text-sm font-medium text-indigo-600">
                            {bankDe?.usedInA?.length || 0} Projects
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Total Transaction
                          </p>
                          <p className="text-sm font-medium text-indigo-600">
                            Rs. 0
                          </p>
                        </div>
                      </div>
                    </div>
        
                  </div>
                </section>



              )
            })}

{/* {isDialogOpen && ( */}
      {isDialogOpen && selectedBankDe && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Are you sure you want to delete this account?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 bg-gray-200 text-neutral-700 rounded-md"
              >
                Cancel
              </button>




<button
          onClick={() => {
            confirmDelete();  
            deleteAssetFun(
              selectedBankDe?.docId,
              selectedBankDe?.accountName,
              selectedBankDe?.usedInA?.length || 0
            );  
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Delete
        </button>



            </div>
          </div>
        </div>
      )}


        
  
          </div>
        </div>
        {bankDetialsA.length === 0 && (
          <div className="py-8 px-8 flex flex-col items-center mt-5 w-full">
            <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
              <img
                className="w-[180px] h-[180px] inline"
                alt=""
                src="/note-widget.svg"
              />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
              No {title} Available
            </h3>
            <button
              onClick={() => {
                setSliderInfo({
                  open: true,
                  title: title,
                  sliderData: {},
                  widthClass: 'max-w-xl',
                })
              }}
            >
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                Better always attach a string
                <span className="text-blue-600"> Add {title}</span>
              </time>
            </button>
          </div>
        )}
      </div>



{/* 
      <TaskManagementDashboard/> */}



      <SiderForm
        open={sliderInfo.open}
        setOpen={handleSliderClose}
        title={sliderInfo.title}
        data={sliderInfo.sliderData}
        widthClass={sliderInfo.widthClass}
        pId={pId}
        phaseDetails={data}
      />
    </>
  )
}

export default AllBankDetailsView
