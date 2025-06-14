/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState,useEffect } from 'react'
import {
  OfficeBuildingIcon,
} from '@heroicons/react/outline'
import {
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/solid'
import { USER_ROLES } from 'src/constants/userRoles'
import { useAuth } from 'src/context/firebase-auth-context'
import DocRow from '../LegalModule/Docu_row'
import BankSelectionSwitchDrop from './BankSelectionDroopDown'
import { updateBankLoanApprovals, updateUnitDocs } from 'src/context/dbQueryFirebase'
import { useSnackbar } from 'notistack'
import CrmActivityLog from '../A_CrmModule/CrmActivityLog'


export default function LoanApplyFlowHome({ type, setStatusFun , customerDetails,  setCustomerDetails}) {
  const [selLoanBank, setLoanBank] = useState({})
  const [preSanctionReview, SetPreSanctionReview] = useState('')
  const [postSanctionReview, SetPostSanctionReview] = useState('')
  const [S1, setS1] = useState(true)
  const [S2, setS2] = useState(true)
  const [S3, setS3] = useState(true)
  const [S4, setS4] = useState(true)
  const [S5, setS5] = useState(true)
  const [S6, setS6] = useState(true)


  const [rejectionReason, setRejectionReason] = useState('')
const [rejection, setRejection] = useState(false)
const [fillError, showFillError] = useState(false)
const [submittedReason, setSubmittedReason] = useState('')


const [postRejectionReason, setPostRejectionReason] = useState('')
const [postFillError, showPostFillError] = useState(false)


const [loanAmount, setLoanAmount] = useState('');
const [loanPercentage, setLoanPercentage] = useState('');





  const { user } = useAuth()
  const { orgId } = user
    const { enqueueSnackbar } = useSnackbar()


  useEffect(() => {


[
  {
    bName: 'State Bank Of India',
    value: 'sbi',
  },
  {
    bName: 'ICICI',
    value: 'icici',
  },
  {
    bName: 'HDFC',
    value: 'hdfc',
  },
  { bName: 'Bank of Baroda', value: 'bankofbaroda' },
  { bName: 'Axis Bank', value: 'axisbank' },
  { bName: 'Punjab National Bank', value: 'punjabnationalbank' },
  { bName: 'Tata Capital', value: 'tatacapital' },


 


 

].filter((d)=>d.value==customerDetails?.loanBank).map((d1)=>{

  setLoanBank(d1)
})
SetPreSanctionReview(customerDetails?.LpreStatus)

SetPostSanctionReview(customerDetails?.LpostStatus)
setRejectionReason(customerDetails?.loan_rejection_reason || '')

  }, [customerDetails])


  useEffect(() => {
    if(customerDetails?.loanBank != selLoanBank?.value ){

      if(selLoanBank?.value){

    const x1 ={'loanBank': selLoanBank?.value || '' }

    updateBankLoanApprovals(orgId, customerDetails?.id, x1, user.email, `${selLoanBank?.value}Saved..!`, `${status} Saved..!`, 'success', enqueueSnackbar)
    if (status === 'Rejected') {
      setSubmittedReason(rejectionReason)
      setRejectionReason('')
      setRejection(false)
    }
    // updateBankLoanApprovals(orgId,customerDetails?.id,x1,user.email,`${selLoanBank?.value}Saved..!`,'success',enqueueSnackbar )
}}
    }, [selLoanBank])


    const updatePerSancationFun = (status)=> {
      SetPreSanctionReview(status)
      const x1 ={'LpreStatus': status || '',
        'loan_rejection_reason': status === 'Rejected' ? rejectionReason : null
       }
      updateBankLoanApprovals(orgId,customerDetails?.id,x1,user.email,`${status} Saved..!`,'success',enqueueSnackbar )
    }

    const updatePostSancationFun = (status)=> {
      SetPostSanctionReview(status)
      const x1 ={'LpostStatus': status || '',
        'post_loan_rejection_reason': status === 'Rejected' ? postRejectionReason : null,
        loanAmount: loanAmount,
        loanPercentage: loanPercentage, 

       }
      updateBankLoanApprovals(orgId,customerDetails?.id,x1,user.email,`Banker Sanction ${status} Saved..!`,'success',enqueueSnackbar )
    }
     




    const handleSaveLoanDetails = async () => {
      if (!loanAmount || !loanPercentage) {
        enqueueSnackbar('Please fill both Loan Amount and Loan Percentage.', {
          variant: 'error',
        });
        return;
      }
  
      const data = {
        loanAmount: loanAmount,
        loanPercentage: loanPercentage,
      };
  
      try {
        await updateBankLoanApprovals(
          orgId,
          customerDetails?.id,
          data,
          user.email,
          'Loan details saved successfully!',
          'success',
          enqueueSnackbar
        );
  

  
        enqueueSnackbar('Loan details saved successfully!', {
          variant: 'success',
        });
      } catch (error) {
        console.error('Failed to save loan details:', error);
        enqueueSnackbar('Failed to save loan details.', {
          variant: 'error',
        });
      }
    };




  return (
    <div className='flex flex-row bg-white mx-2 rounded-lg border border-gray-100 h-[100%]'>


    <section className="bg-white w-full  md:px-10 md:mb-20 pb-[250px]  h-[100vh]  overflow-y-scroll">

      <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
{/* 
      <div>
        <section className='flex flex-row'>

                <h2 className="ml-2 mt-2 text-md font-semibold text-black leading-light font-Playfair">
                Loan Approval
                </h2>
                </section>
        </div> */}



    

        <div className="mt-1">
          <div className="p-2  bg-gradient-to-r from-violet-50 to-pink-50 rounded-md flex flex-row justify-between">
            <h2 className="font-medium flex-grow">Loan Approval</h2>
            <p className="text-md text-[10px] flex-grow text-right">
            

              <div>
             {customerDetails?.loan_rejection_reason && (
             <p>Pre Rejection Reason: {customerDetails.loan_rejection_reason}</p>
                 )}
                {customerDetails?.post_loan_rejection_reason && (

              <p>Post Loan Rejection Reason: {customerDetails.post_loan_rejection_reason}</p>
                )}
             {!customerDetails?.loan_rejection_reason &&

                    !customerDetails?.post_loan_rejection_reason && (
                  <p>Banker sanction is {postSanctionReview}
                  </p>
                  
                     )}

                      </div>

            </p>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
        <section className="flex flex-col">
          <section className=" ">
            <section className="flex flex-row justify-between">
              <section className="flex flex-row w-full">
                <div className="rounded-full font-bold bg-gradient-to-r from-violet-200 to-pink-200 h-7 w-7 flex items-center justify-center mr-2">
                  <span className="text-[14px] mb-[2px]">1</span>
                </div>
                <p className="mt- pb-2 font-semibold text-gray-600  mt-[4px] mb-2 border-b ">
                  Start your Loan journey by picking a bank
                </p>
              </section>
              {!S1 && (
                <p className="mt- pb-2 font-semibold text-blue-600  mt-[4px] mb-2 mr-2 border-b w-[300px] text-right">
                  {selLoanBank?.bName || 'NA'}
                </p>
              )}
              {S1 && (
                <ArrowUpIcon
                  className="w-[14px] h-[14px]  mt-[8px] text-blue-600"
                  onClick={() => setS1(!S1)}
                />
              )}
              {!S1 && (
                <ArrowDownIcon
                  className="w-[18px] h-[18px] mt-[7px]"
                  onClick={() => setS1(!S1)}
                />
              )}
            </section>
          </section>
          {S1 && (
            <section className="mt-1 ml-9 container">
              <BankSelectionSwitchDrop
                type={selLoanBank}
                setStatusFun={setLoanBank}
              />
            </section>
          )}
        </section>
      </div>
      <div className="max-w-3xl mx-auto py-3 text-sm text-gray-700">
        <section className="flex flex-col">
          <section className=" ">
            <section className="flex flex-row ">
              <div className="rounded-full font-bold bg-gradient-to-r from-violet-200 to-pink-200 h-7 w-7 flex items-center justify-center mr-2">
                <span className="text-[14px] mb-[2px]">2</span>
              </div>
              <section className=" w-full border-b">
                <section className="flex flex-row justify-between">
                  <section className="flex flex-row w-full">
                    <p className="mt- pb-2 font-semibold text-gray-600  mt-[4px]   w-full">
                      Upload Customer Documents
                    </p>
                  </section>
                  {!S2 && (
                    <p className="mt- pb-2 font-semibold text-blue-600  mt-[4px]  mr-2  w-[300px] text-right">
                      {'0 Docs Uploaded'}
                    </p>
                  )}
                  {S2 && (
                    <ArrowUpIcon
                      className="w-[14px] h-[14px]  mt-[6px] text-blue-600"
                      onClick={() => setS2(!S2)}
                    />
                  )}
                  {!S2 && (
                    <ArrowDownIcon
                      className="w-[18px] h-[18px] mt-[5px]"
                      onClick={() => setS2(!S2)}
                    />
                  )}
                </section>
              </section>
            </section>
          </section>
          {S2 && (
            <section className="mt-1 ml-5 container">
              {[
                { id: 1234764, name: 'EC', time: '22-Nov-2022' },
                {
                  id: 12350,
                  name: 'Agreement',
                  time: '24-Nov-2022',
                },
                {
                  id: 123678,
                  name: 'Register Doc',
                  time: '2-Dec-2022',
                },
              ].length === 0 ? (
                <div className="w-full text-center py-5">No documents</div>
              ) : (
                ''
              )}
              {[
                { id: 1234432, name: 'Payslips',type: 'pslips',
                  time: customerDetails?.pslipsDocUpDate, url: customerDetails?.pslipsDocUrl , filName: customerDetails?.pslipsFilName  },
                {
                  id: 1235789,
                  name: 'Bank Statement',
                  type: 'bankstmt',
                  time: customerDetails?.bankstmtDocUpDate, url: customerDetails?.bankstmtDocUrl , filName: customerDetails?.bankstmtFilName
                },
                {
                  id: 1236777,
                  name: 'ITR/Form-16',
                  type: 'form_16',
                  time: customerDetails?.form_16DocUpDate, url: customerDetails?.form_16DocUrl , filName: customerDetails?.form_16FilName
                },
                {
                  id: 1236666,
                  name: 'Present Address Proof',
                  type: 'addproof',
                  time: customerDetails?.addproofDocUpDate, url: customerDetails?.addproofDocUrl , filName: customerDetails?.addproofFilName
                },
                {
                  id: 1236999,
                  name: 'Appointment letter from HR',
                  type: 'hrletter',
                  time: customerDetails?.hrletterDocUpDate, url: customerDetails?.hrletterDocUrl , filName: customerDetails?.hrletterFilName
                },
              ]?.map((doc, i) => (
                <section
                  key={i}
                  onClick={() => {
                    // show sidebar and display the worddoc
                    setSliderInfo({
                      open: true,
                      title: 'viewDocx',
                      sliderData: {},
                      widthClass: 'max-w-xl',
                    })
                  }}
                >
                  <DocRow
                   id={customerDetails?.id}
                    fileName={doc?.name}
                    date={doc?.time}
                    data={doc}
                  />
                </section>
              ))}
            </section>
          )}
        </section>
      </div>
      <div className="max-w-3xl mx-auto py-3 text-sm text-gray-700">
        <section className="flex flex-col">
          <section className=" ">
            <section className="flex flex-row ">
              <div className="rounded-full font-bold bg-gradient-to-r from-violet-200 to-pink-200 h-7 w-7 flex items-center justify-center mr-2">
                <span className="text-[14px] mb-[2px]">3</span>
              </div>
              <section className=" w-full border-b">
                <section className="flex flex-row justify-between">
                  <section className="flex flex-row w-full">
                    <p className="mt- pb-2 font-semibold text-gray-600  mt-[4px]   w-full">
                      Banker Review
                    </p>
                  </section>
                  {!S3 && (
                    <p className="mt- pb-2 font-semibold text-blue-600  mt-[4px]  mr-2  w-[300px] text-right">
                      {preSanctionReview}
                    </p>
                  )}
                  {S3 && (
                    <ArrowUpIcon
                      className="w-[14px] h-[14px]  mt-[6px] text-blue-600"
                      onClick={() => setS3(!S3)}
                    />
                  )}
                  {!S3 && (
                    <ArrowDownIcon
                      className="w-[18px] h-[18px] mt-[5px]"
                      onClick={() => setS3(!S3)}
                    />
                  )}
                </section>
              </section>
            </section>
          </section>
          {S3 && (
            <section className="mt-3 ml-9 container">
              <div className="flex flex-row">
                <div
                  className={`border border-gray-200  group relative flex items-center gap-x-2 rounded-lg p-1 pr-4  text-sm leading-6 hover:bg-gray-50 ${
                    preSanctionReview === 'In-Review'
                      ? 'bg-gradient-to-r from-violet-100 to-pink-100'
                      : ''
                  }`}
                  onClick={() => {
                    updatePerSancationFun('In-Review')
                    updatePostSancationFun('In-Review')

                  }}
                >
                  <div
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 ${
                      preSanctionReview === 'In-Review'
                        ? 'group-hover:bg-white'
                        : ''
                    }  `}
                  >
                    <OfficeBuildingIcon
                      className={`h-6 w-6 text-gray-600 group-hover:text-indigo-600 ${
                        preSanctionReview === 'In-Review'
                          ? 'text-indigo-600'
                          : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-auto">
                    <a
                      className={`block font-semibold text-gray-900 ${
                        preSanctionReview === 'In-Review'
                          ? 'text-indigo-600'
                          : ''
                      } group-hover:text-indigo-600`}
                    >
                      {'In-Review'}
                      <span className="absolute inset-0" />
                    </a>
        
                  </div>
                </div>

                <div
                  className={`border border-gray-200 ml-2  group relative flex items-center gap-x-2 rounded-lg p-1 pr-4  text-sm leading-6 hover:bg-gray-50 ${
                    preSanctionReview === 'Approved'
                      ? 'bg-gradient-to-r from-violet-100 to-pink-100'
                      : ''
                  }`}
                  onClick={() => {
                    updatePerSancationFun('Approved')
                  }}
                >
                  <div
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 ${
                      preSanctionReview === 'Approved'
                        ? 'group-hover:bg-white'
                        : ''
                    }  `}
                  >
                    <OfficeBuildingIcon
                      className={`h-6 w-6 text-gray-600 group-hover:text-indigo-600 ${
                        preSanctionReview === 'Approved'
                          ? 'text-indigo-600'
                          : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-auto">
                    <a
                      className={`block font-semibold text-gray-900 ${
                        preSanctionReview === 'Approved'
                          ? 'text-indigo-600'
                          : ''
                      } group-hover:text-indigo-600`}
                    >
                      {'Approved'}
                      <span className="absolute inset-0" />
                    </a>

                  </div>
                </div>
                <div
                  className={`border border-gray-200 ml-2 group relative flex items-center gap-x-2 rounded-lg p-1 pr-4  text-sm leading-6 hover:bg-gray-50 ${
                    preSanctionReview === 'Rejected'
                      ? 'bg-gradient-to-r from-violet-100 to-pink-100'
                      : ''
                  }`}
                  onClick={() => {
                    updatePerSancationFun('Rejected')
                    updatePostSancationFun('Rejected')

                  }}
                >
                  <div
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 ${
                      preSanctionReview === 'Rejected'
                        ? 'group-hover:bg-white'
                        : ''
                    }  `}
                  >
                    <OfficeBuildingIcon
                      className={`h-6 w-6 text-gray-600 group-hover:text-indigo-600 ${
                        preSanctionReview === 'Rejected'
                          ? 'text-indigo-600'
                          : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-auto">



                    




                    <a
                      className={`block font-semibold text-gray-900 ${
                        preSanctionReview === 'Rejected'
                          ? 'text-indigo-600'
                          : ''
                      } group-hover:text-indigo-600`}
                    >
                      {'Rejected'}
                      <span className="absolute inset-0" />
                    </a>
          
                  </div>
                </div>
              </div>
              {preSanctionReview === 'In-Review' && (
                <div className="mt-2">
                  <div className="p-4 bg-gray-200 rounded-md">
                    Ideal Bank review time is 32 working days
                  </div>
                </div>
              )}
              {preSanctionReview === 'Approved' && (
                <div className="mt-2">
                  {[
                    { id: 1234562, name: 'Sanction Letter', type: 'sancletter',  time: customerDetails?.sancletterDocUpDate, url: customerDetails?.sancletterDocUrl , filName: customerDetails?.sancletterFilName
                    },
                  ]?.map((doc, i) => (
                    <section
                      key={i}
                      onClick={() => {
                      }}
                    >
                      <DocRow
                   id={customerDetails?.id}
                    fileName={doc?.name}
                    date={doc?.time}
                    data={doc}
                  />
                    </section>
                  ))}
                </div>
              )}


{preSanctionReview === 'Rejected' && (

    <div className="mt-2">
      <div className="mt-">
        <div className="flex justify-center border-2 py-2 px-6 px-10 mb-2 rounded-xl">
          <input
            type="text"
            name="blockReason"
            placeholder="Write Rejection Comments"
            className="w-full outline-none text-gray-700 text-lg"
            onChange={(e) => {
              setRejectionReason(e.target.value)
            }}
          />
          {fillError && (
            <div className="error-message text-red-700 text-xs p-1 mx-auto" />
          )}
          <button
            type="submit"
            className={`${rejectionReason.length>0 ? 'bg-[#ff9f87]' : 'bg-[#f9eeeb]'} text-gray-700 font-semibold px-6 py-2 rounded-xl text-md`}
            onClick={() => {
              if(rejectionReason !== '') {
                showFillError(false)
                updatePerSancationFun('Rejected')
              } else {
                showFillError(true)
              }
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )}
            </section>
          )}
        </section>
      </div>
      {preSanctionReview === 'Approved' && (
        <div className="max-w-3xl mx-auto py-3 text-sm text-gray-700">
          <section className="flex flex-col">
            <section className="flex flex-row ">
              <div className="rounded-full font-bold bg-gradient-to-r from-violet-200 to-pink-200 h-7 w-7 flex items-center justify-center mr-2">
                <span className="text-[14px] mb-[2px]">4</span>
              </div>
              <section className=" w-full border-b">
                <section className="flex flex-row justify-between">
                  <section className="flex flex-row w-full">
                    <p className="mt- pb-2 font-semibold text-gray-600  mt-[4px]   w-full">
                      Documents for post-sanction banker review
                    </p>
                  </section>
                  {!S4 && (
                    <p className="mt- pb-2 font-semibold text-blue-600  mt-[4px]  mr-2  w-[300px] text-right">
                      {'0 Docs Uploaded'}
                    </p>
                  )}
                  {S4 && (
                    <ArrowUpIcon
                      className="w-[14px] h-[14px]  mt-[6px] text-blue-600"
                      onClick={() => setS4(!S4)}
                    />
                  )}
                  {!S4 && (
                    <ArrowDownIcon
                      className="w-[18px] h-[18px] mt-[5px]"
                      onClick={() => setS4(!S4)}
                    />
                  )}
                </section>
              </section>
            </section>
            {S4 && (
              <section className="mt-1 ml-5 container">
                {[
                  {
                    id: 1235,
                    name: 'ATS',
                    type: 'agree',
                    time: customerDetails?.agreeDocUpDate, url: customerDetails?.agreeDocUrl , filName: customerDetails?.agreeFilName,
                  },

                  {
                    id: 12367,
                    name: 'Cost break-up',
                    type: 'cs',  time: customerDetails?.csDocUpDate, url: customerDetails?.csDocUrl , filName: customerDetails?.csFilName
                  },
                  {
                    id: 2,
                    name: 'Demand Letter',
                    type: 'demandLet',  time: customerDetails?.demandLetDocUpDate, url: customerDetails?.demandLetDocUrl , filName: customerDetails?.demandLetFilName
                  },
       
                  {
                    id: 3,
                    name: 'Builder Noc',
                    type: 'bilderNoc',  time: customerDetails?.bilderNocDocUpDate, url: customerDetails?.bilderNocDocUrl , filName: customerDetails?.bilderNocFilName
                  },
                  {
                    id: 4,
                    name: 'ATB',
                    type: 'atb',  time: customerDetails?.atbDocUpDate, url: customerDetails?.atbDocUrl , filName: customerDetails?.atbFilName
                  },
                  {
                    id: 5,
                    name: 'TPA',
                    type: 'TPA',  time: customerDetails?.TPADocUpDate, url: customerDetails?.TPADocUrl , filName: customerDetails?.TPAFilName
                  },
                ]?.map((doc, i) => (
                  <section
                    key={i}
                    onClick={() => {
                      setSliderInfo({
                        open: true,
                        title: 'viewDocx',
                        sliderData: {},
                        widthClass: 'max-w-xl',
                      })
                    }}
                  >
                    <DocRow
                      id={customerDetails?.id}
                      fileName={doc?.name}
                      date={doc?.time}
                      data={doc}

                    />
                  </section>
                ))}
              </section>
            )}
          </section>
        </div>
      )}
      {preSanctionReview === 'Approved' && (
        <div className="max-w-3xl mx-auto py-3 text-sm text-gray-700">
          <section className="flex flex-col">
            <section className=" ">
              <section className=" ">
                <section className="flex flex-row ">
                  <div className="rounded-full font-bold bg-gradient-to-r from-violet-200 to-pink-200 h-7 w-7 flex items-center justify-center mr-2">
                    <span className="text-[14px] mb-[2px]">5</span>
                  </div>
                  <section className=" w-full border-b">
                    <section className="flex flex-row justify-between">
                      <section className="flex flex-row w-full">
                        <p className="mt- pb-2 font-semibold text-gray-600  mt-[4px]   w-full">
                          Post-Sanction Banker Review
                        </p>
                      </section>
                      {!S5 && (
                        <p className="mt- pb-2 font-semibold text-blue-600  mt-[4px]  mr-2  w-[300px] text-right">
                          {postSanctionReview}
                        </p>
                      )}
                      {S5 && (
                        <ArrowUpIcon
                          className="w-[14px] h-[14px]  mt-[6px] text-blue-600"
                          onClick={() => setS5(!S5)}
                        />
                      )}
                      {!S5 && (
                        <ArrowDownIcon
                          className="w-[18px] h-[18px] mt-[5px]"
                          onClick={() => setS5(!S5)}
                        />
                      )}
                    </section>
                  </section>
                </section>
              </section>
            </section>
            {S5 && (
              <section className="mt-1 ml-9 container">
                <div className="flex flex-row">
                  <div
                    className={`border border-gray-200  group relative flex items-center gap-x-2 rounded-lg p-1 pr-4  text-sm leading-6 hover:bg-gray-50 ${
                      postSanctionReview === 'In-Review'
                        ? 'bg-gradient-to-r from-violet-100 to-pink-100'
                        : ''
                    }`}
                    onClick={() => {
                      updatePostSancationFun('In-Review')
                    }}
                  >
                    <div
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 ${
                        postSanctionReview === 'In-Review'
                          ? 'group-hover:bg-white'
                          : ''
                      }  `}
                    >
                      <OfficeBuildingIcon
                        className={`h-6 w-6 text-gray-600 group-hover:text-indigo-600 ${
                          postSanctionReview === 'In-Review'
                            ? 'text-indigo-600'
                            : ''
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        className={`block font-semibold text-gray-900 ${
                          postSanctionReview === 'In-Review'
                            ? 'text-indigo-600'
                            : ''
                        } group-hover:text-indigo-600`}
                      >
                        {'In-Review'}
                        <span className="absolute inset-0" />
                      </a>
        
                    </div>
                  </div>

                  <div
                    className={`border border-gray-200 ml-2  group relative flex items-center gap-x-2 rounded-lg p-1 pr-4  text-sm leading-6 hover:bg-gray-50 ${
                      postSanctionReview === 'Approved'
                        ? 'bg-gradient-to-r from-violet-100 to-pink-100'
                        : ''
                    }`}
                    onClick={() => {
                      updatePostSancationFun('Approved')
                    }}
                  >
                    <div
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 ${
                        postSanctionReview === 'Approved'
                          ? 'group-hover:bg-white'
                          : ''
                      }  `}
                    >
                      <OfficeBuildingIcon
                        className={`h-6 w-6 text-gray-600 group-hover:text-indigo-600 ${
                          postSanctionReview === 'Approved'
                            ? 'text-indigo-600'
                            : ''
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        className={`block font-semibold text-gray-900 ${
                          postSanctionReview === 'Approved'
                            ? 'text-indigo-600'
                            : ''
                        } group-hover:text-indigo-600`}
                      >
                        {'Approved'}
                        <span className="absolute inset-0" />
                      </a>
          
                    </div>
                  </div>
                  <div
                    className={`border border-gray-200 ml-2 group relative flex items-center gap-x-2 rounded-lg p-1 pr-4  text-sm leading-6 hover:bg-gray-50 ${
                      postSanctionReview === 'Rejected'
                        ? 'bg-gradient-to-r from-violet-100 to-pink-100'
                        : ''
                    }`}
                    onClick={() => {
                      updatePostSancationFun('Rejected')
                    }}
                  >
                    <div
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 ${
                        postSanctionReview === 'Rejected'
                          ? 'group-hover:bg-white'
                          : ''
                      }  `}
                    >
                      <OfficeBuildingIcon
                        className={`h-6 w-6 text-gray-600 group-hover:text-indigo-600 ${
                          postSanctionReview === 'Rejected'
                            ? 'text-indigo-600'
                            : ''
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        className={`block font-semibold text-gray-900 ${
                          postSanctionReview === 'Rejected'
                            ? 'text-indigo-600'
                            : ''
                        } group-hover:text-indigo-600`}
                      >
                        {'Rejected'}
                        <span className="absolute inset-0" />
                      </a>
           
                    </div>
                  </div>
                </div>
                {postSanctionReview === 'In-Review' && (
                  <div className="mt-4">
                    <div className="p-4 bg-gray-200 rounded-md">
                      Ideal Bank review time is 32 working days
                    </div>
                  </div>
                )}
                {postSanctionReview === 'Approved' && (
                  <>

<div className="mt-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Loan Amount</label>
            <input
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter Loan Amount"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Loan Percentage</label>
            <input
              type="text"
              value={loanPercentage}
              onChange={(e) => setLoanPercentage(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter Loan Percentage"
            />
          </div>
        </div>
   
        <div className="mt-4">
          <button
            onClick={handleSaveLoanDetails}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save Loan Details
          </button>
        </div>
      </div>


      <div className="mt-4">
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Loan Amount:</strong> {customerDetails?.loanAmount || 'N/A'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Loan Percentage:</strong> {customerDetails?.loanPercentage || 'N/A'}
            </p>
          </div>
        </div>
                    <div className="mt-4">
                      {[
                        {
                          id: 123466677,
                          name: 'Loan Approval',
                          type: 'lApp',  time: customerDetails?.lAppDocUpDate, url: customerDetails?.lAppDocUrl , filName: customerDetails?.lAppFilName
                        },
                      ]?.map((doc, i) => (
                        <section
                          key={i}
                          onClick={() => {
                          }}
                        >
                          <DocRow
                            id={customerDetails?.id}
                            fileName={doc?.name}
                            date={doc?.time}
                            data={doc}
                          />
                        </section>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="p-4 bg-gradient-to-r from-violet-100 to-pink-100 rounded-md">
                        {'Congrulations on Loan Approval  :-)'}
                      </div>
                    </div>
                  </>
                )}



{postSanctionReview === 'Rejected' && (
    <div className="mt-2">
      <div className="mt-">
        <div className="flex justify-center border-2 py-2 px-6 px-10 mb-2 rounded-xl">
          <input
            type="text"
            name="postBlockReason"
            placeholder="Write Post-Sanction Rejection Comments"
            className="w-full outline-none text-gray-700 text-lg"
            onChange={(e) => {
              setPostRejectionReason(e.target.value)
            }}
          />
          {postFillError && (
            <div className="error-message text-red-700 text-xs p-1 mx-auto">
              Please enter rejection reason
            </div>
          )}
          <button
            type="submit"
            className={`${
              postRejectionReason.length > 0 ? 'bg-[#ff9f87]' : 'bg-[#f9eeeb]'
            } text-gray-700 font-semibold px-6 py-2 rounded-xl text-md`}
            onClick={() => {
              if (postRejectionReason !== '') {
                showPostFillError(false)
                updatePostSancationFun('Rejected')
              } else {
                showPostFillError(true)
              }
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )}
              </section>
            )}
          </section>
        </div>
      )}
    </section>
    <CrmActivityLog selUnitPayload={customerDetails} title="Loan Activity" type={['loan_approval']}/>

</div>
  )
}
