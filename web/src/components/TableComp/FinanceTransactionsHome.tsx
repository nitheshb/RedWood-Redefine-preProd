/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// import { Link, routes } from '@redwoodjs/router'

import { useState, useEffect } from 'react'
import { AdjustmentsIcon } from '@heroicons/react/outline'
import { startOfDay } from 'date-fns'
import { MetaTags } from '@redwoodjs/web'
import {
  streamGetAllTransactions,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { supabase } from 'src/context/supabase'
import CSVDownloader from 'src/util/csvDownload'
import {
  SlimDateSelectBox,
  SlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'
import {
  timeConv,
  prettyDate

} from 'src/util/dateConverter'
import SiderForm from '../SiderForm/SiderForm'
import { CountUpComp } from '../comps/countUpComp'
import { TrendingDown, TrendingUp } from 'lucide-react'

const FinanceTransactionsHome = ({ leadsTyper }) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false)
  const [openTransactionDetails, setOpenTransactionDetails] = useState(false)


  const [ready, setReady] = useState(false)

  const [addLeadsTypes, setAddLeadsTypes] = useState('')
  const [selUserProfile, setSelUserProfile] = useState({})
  const [finFetchedData, setFinFetchedData] = useState([])
  const [finSelData, setFinSelData] = useState([])

  const [serialLeadsData, setSerialLeadsData] = useState([])
  const [showSettings, setShowSettings] = useState(true)
  const [transactionData, setTransactionData] = useState({})
  const [sourceDateRange, setSourceDateRange] = React.useState(
    startOfDay(d).getTime()
  )







  const sortTransactionsByDate = (transactions) => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.txt_dated)
      const dateB = new Date(b.txt_dated)
      return dateB - dateA
    })
  }








  useEffect(() => {
    if(value === 'all') {
      const sortedData = sortTransactionsByDate(finFetchedData)
      setFinSelData(sortedData)
    } else {
      const filteredData = finFetchedData.filter((d) => d.status === value)
      const sortedFilteredData = sortTransactionsByDate(filteredData)
      setFinSelData(sortedFilteredData)
    }
  }, [finFetchedData, value])





  const [value, setValue] = useState('review')
  const tabHeadFieldsA = [
    { lab: 'All Transactions', val: 'all' },
    { lab: 'Reviewing', val: 'review' },
    { lab: 'Received', val: 'received' },
    { lab: 'Rejected', val: 'rejected' },
  ]
  useEffect(() => {
    getLeadsDataFun()
  }, [])








  useEffect(() => {
    // getFinanceTransactionsByStatus(orgId, 'all')
    if(value === 'all'){
      setFinSelData(finFetchedData)
    }else{

    const x =  finFetchedData.filter((d) => d.status === value)
    setFinSelData(x)

    }
  }, [finFetchedData,value])

  useEffect(() => {
    // Subscribe to real-time changes in the `${orgId}_accounts` table
      const channel = supabase
        .channel('accounts-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: `${orgId}_accounts`,
          },
          (payload) => {
    // const subscription = supabase
    //   .from(`${orgId}_accounts`)
    //   .on('*', (payload) => {
        // When a change occurs, update the 'leadLogs' state with the latest data
        console.log('account records', payload)
        // Check if the updated data has the id 12
        const updatedData = payload.new
        const { id } = payload.old
        const updatedLeadLogs = [...finFetchedData]
        setFinFetchedData((prevLogs) => {
          const existingLog = prevLogs.find((log) => log.id === id)

          if (existingLog) {
            console.log('Existing record found!')
            const updatedLogs = prevLogs.map((log) =>
              log.id === id ? payload.new : log
            )
            return [...updatedLogs]
          } else {
            console.log('New record added!')
            return [payload.new,...prevLogs]
          }
        })

      })
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const rowsCounter = (parent, searchKey) => {
    return parent?.filter((item) => {
      if (searchKey === 'all') {
        return item
      } else if (item?.status?.toLowerCase() === searchKey.toLowerCase()) {
        console.log('All1', item)
        return item
      }
    })
  }

  const totalAmountCounter = (parent, searchKey) => {
    return searchKey === 'all' ? finFetchedData.reduce((a, b) => a + b.totalAmount, 0) : parent?.filter((item) => item?.status?.toLowerCase() === searchKey.toLowerCase()).reduce((a, b) => a + b.totalAmount, 0)

  }



  const getLeadsDataFun = async () => {
    const { access, uid } = user
    const steamLeadLogs = await streamGetAllTransactions(
      orgId,
      'snap',
      {
        uid,
      },
      (error) => []
    )
    const sortedData = sortTransactionsByDate(steamLeadLogs)
    setFinFetchedData(sortedData)
  }


  const serealizeData = (array) => {
    const x = [
      'new',
      'review',
      'received',
      'rejected',
      '',
    ].map((status) => {
      const items = array.filter((data) => data.Status.toLowerCase() == status)

      return { name: status, items }
    })
    setSerialLeadsData(x)
  }

  const selUserProfileF = (title, data) => {
    setAddLeadsTypes(title)
    setisImportLeadsOpen(true)
    setSelUserProfile(data)
  }

  const viewTransaction = (docData) => {
    setTransactionData(docData)
    setOpenTransactionDetails(!openTransactionDetails)
  }
  return (
    <>
      <div className=" ">




<div className='m-1 overflow-hidden'>
<div className="bg-[#F6F5F8] rounded-lg relative">
<img 
    src='/bgpayment.svg'
    alt="background"
    className="w-full h-[30vh] object-cover rounded-lg"
  />




<div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-between">
      {/* Your content that should appear over the image */}
      <div className="flex flex-row justify-between items-center">

      <div className="flex flex-row justify-between items-center">
                {/* <section className="min-w-[150px]">
                  <div className="flex flex-col ml-3">
                    <span className="text-[56px] text-black font-bold">0</span>
                    <span className="text-[18px] text-black">Todo Tasks</span>
                  </div>
                </section> */}
                <div className="flex flex-col">

                  <section className="flex flex-row justify-between">
                    <section className="flex flex-row mt-2 mr-1  mb-1 leading-7 text-gray-900  rounded-lg  ">
                      {[
    { lab: 'All Payments', val: 'all', icon: (
   
      <svg width="60" height="61" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.1">
<path d="M53.6934 33.2062C53.6934 34.0302 53.0234 34.7015 52.1988 34.7015H38.2707C38.3526 30.6685 38.6157 24.7381 39.0341 19.2806H48.3986C48.7588 19.2806 49.0521 18.9914 49.0521 18.6367V13.7777C49.0521 13.4121 48.7652 13.1247 48.3986 13.1247H45.7461C45.647 12.89 45.4993 12.5753 45.3583 12.3625C45.3316 12.3224 45.3403 12.3352 45.3381 12.3315C44.7292 11.2564 43.4202 10.2013 42.141 10.3923C-4.25692 9.85932 18.7239 10.1231 12.0795 10.0467C10.3484 10.2686 8.79068 11.2801 8.1125 13.1283H6.44563C6.08435 13.1283 5.79037 13.4175 5.79037 13.7741C5.79001 13.8687 5.78928 14.6218 5.78928 14.5272V18.6367C5.78928 19.0023 6.11382 19.2861 6.44563 19.2861H7.9315C8.02082 23.7212 8.0421 29.6188 7.93132 34.7015H5.76181C4.93738 34.7015 4.26739 34.0302 4.26739 33.2062V10.3469C4.26739 9.52278 4.93738 8.85332 5.76181 8.85332C20.5363 8.85332 37.7603 8.85332 52.1988 8.85332C53.0234 8.85332 53.6934 9.52278 53.6934 10.3469C53.6934 17.125 53.6934 26.2916 53.6934 33.2062ZM45.6221 15.3822C43.8515 15.4059 41.0749 15.4514 39.3999 15.4732C39.3217 12.8009 41.2349 10.8853 42.7748 10.9599C44.1911 11.0545 45.7303 12.9537 45.6221 15.3822ZM33.2466 59.8529H33.2457C30.3191 59.9802 28.0317 57.7718 27.7865 55.0722C27.7754 54.9503 27.6752 54.8576 27.5549 54.8576C19.5589 54.7775 15.3048 54.7247 7.47399 54.6465C7.47399 54.0571 8.07121 47.7102 8.36918 36.3296C8.3932 34.8816 8.4938 31.7508 8.47579 26.0915C8.47433 25.7622 8.38465 15.3277 8.2966 15.1185C8.2966 15.1094 8.28569 14.9947 8.28551 14.9929C8.20383 14.4053 8.48925 13.3757 8.72301 12.8827C9.4403 11.4583 10.7282 10.6943 12.1153 10.5142L40.9895 10.8507C39.534 11.8003 38.5322 13.8887 38.8145 16.119C37.8016 27.3012 37.4007 41.1212 37.9873 54.7484C37.9358 57.4644 35.9603 59.7347 33.2466 59.8529ZM24.2179 57.1733C24.2083 57.1733 24.2083 57.1733 24.2083 57.1733L10.6311 56.9987C10.3264 56.975 10.3135 56.5111 10.6409 56.5111L24.2179 56.6858C24.549 56.6858 24.5233 57.1733 24.2179 57.1733ZM52.9765 1.37302C52.6469 0.339748 51.5477 -0.238735 50.5134 0.0941696L24.4433 8.38218H5.76181C4.67833 8.38218 3.79678 9.26446 3.79678 10.3469V33.2062C3.79678 34.2885 4.67833 35.1708 5.76181 35.1708H7.92204L7.89857 36.3187C7.73594 42.5565 7.43433 48.6925 7.00447 54.5756L0.241633 54.5301C0.0504409 54.5301 -0.072168 54.7502 0.0471676 54.9085L2.53539 58.5522C3.35182 59.7474 4.71217 60.4678 6.17003 60.4678C34.7098 60.3677 33.0529 60.4878 33.2083 60.3259C36.2553 60.2149 38.4032 57.6954 38.4579 54.743C38.0323 44.8487 38.2578 35.2763 38.2584 35.1708H52.1988C53.2825 35.1708 54.1638 34.2885 54.1638 33.2062V27.0411L58.6251 25.6258C58.626 25.6258 58.626 25.6258 58.626 25.6258C59.6582 25.2965 60.2385 24.196 59.9063 23.1536L52.9765 1.37302Z" fill="#100F0D"/>
<path d="M41.4009 24.5863C45.4952 24.628 50.5949 24.6798 50.6919 24.6815C51.0037 24.6815 51.0018 24.2139 50.6946 24.2106C46.6002 24.1688 41.5006 24.1171 41.4036 24.1154C41.092 24.1154 41.0936 24.5829 41.4009 24.5863Z" fill="#100F0D"/>
<path d="M51.2238 27.1936H40.2519C39.9409 27.1936 39.9406 27.6641 40.2519 27.6641H51.2238C51.535 27.6641 51.5353 27.1936 51.2238 27.1936Z" fill="#100F0D"/>
<path d="M13.371 48.1991C13.4677 48.2006 11.9533 48.1747 11.7102 48.1702C11.5825 48.1702 11.4778 48.2722 11.475 48.4015L11.4364 50.3621C11.4233 50.8461 11.7989 51.251 12.2985 51.2647L13.7663 51.2936C13.7681 51.2936 13.7691 51.2936 13.7709 51.2936C13.8986 51.2936 14.0035 51.1916 14.0062 51.0638C14.0065 51.0501 14.0015 51.2662 14.0549 48.9115C14.0549 48.5325 13.7479 48.2128 13.371 48.1991Z" fill="#100F0D"/>
<path d="M14.1219 30.5957C14.1275 30.4142 14.0621 30.2409 13.937 30.1068C13.5937 29.7389 13.2369 29.9351 11.7938 29.8517C11.7917 29.8517 11.7902 29.8517 11.7881 29.8517C11.6604 29.8517 11.5567 29.9515 11.553 30.0806L11.5042 32.0429C11.4905 32.5498 11.9062 32.9456 12.3745 32.9456C12.5253 32.9488 11.829 32.9308 13.8478 32.9848C13.9782 32.9848 14.0814 32.8785 14.0832 32.7542C14.0851 32.6463 14.125 30.4584 14.1226 30.5974L14.1227 30.5957H14.1219Z" fill="#100F0D"/>
<path d="M16.0815 23.9563L16.086 24.2979C16.0879 24.4325 15.9806 24.5429 15.846 24.5446C15.8451 24.5446 15.8441 24.5446 15.8432 24.5446C15.7102 24.5446 15.6021 24.4377 15.6002 24.3048L15.595 23.9132C13.1822 23.5595 14.0852 21.7617 14.5457 22.2448C14.638 22.3431 14.6338 22.4967 14.5363 22.5881C14.3031 22.809 14.7358 23.1471 15.0562 23.28C15.6143 23.5129 16.4286 23.5405 16.9459 23.3473C17.3587 23.1903 17.5677 22.9125 17.4888 22.6192C17.2569 21.76 15.665 21.4029 14.9404 20.8801C14.0136 20.2107 14.1463 19.0513 15.6034 18.7856L15.6333 18.2525C15.6528 17.9143 16.1343 17.9695 16.1195 18.2801L16.0936 18.7373C17.6626 18.7321 18.0639 19.857 17.5076 19.8846C17.3605 19.8812 17.2601 19.7863 17.2535 19.6534C17.2495 19.5671 16.9431 19.3239 16.4543 19.248C15.2679 19.0634 14.2579 19.7897 15.2251 20.4867C15.614 20.7679 16.2226 20.9715 16.7285 21.2424C18.7904 22.3345 18.1557 23.9873 16.0815 23.9563ZM20.9429 19.386C19.5597 15.2367 13.9534 15.059 11.7781 19.0547C10.4262 21.5702 11.1365 24.7534 13.6633 26.0732C17.6993 28.1781 22.4276 23.7475 20.9429 19.386Z" fill="#100F0D"/>
<path d="M17.4094 31.0107C17.0886 30.983 17.0836 31.468 17.3892 31.481C20.9695 31.6324 31.9979 32.093 31.8867 32.093C32.1922 32.093 32.2012 31.6357 31.8968 31.6226L17.4094 31.0107Z" fill="#100F0D"/>
<path d="M34.3772 36.9926L16.3929 36.4698C16.068 36.4714 16.0773 36.9321 16.3801 36.94C22.71 37.1249 34.5044 37.4628 34.371 37.4628C34.6774 37.4628 34.6854 37.0022 34.3772 36.9926Z" fill="#100F0D"/>
<path d="M26.7093 44.3794C27.0149 44.3794 27.0242 43.9189 26.7175 43.9081L16.617 43.5623C16.2906 43.5685 16.3016 44.0228 16.6004 44.0321C19.0067 44.1158 26.8045 44.3794 26.7093 44.3794Z" fill="#100F0D"/>
<path d="M33.5953 50.3679L16.3579 49.4229C16.0291 49.4244 16.0359 49.8772 16.3322 49.8939C21.601 50.1832 33.6933 50.8389 33.5822 50.8389C33.8853 50.8389 33.8979 50.3861 33.5953 50.3679Z" fill="#100F0D"/>
<path d="M12.18 38.63C12.3297 38.6348 11.6377 38.6156 13.6441 38.6684C13.7718 38.6684 13.8755 38.5676 13.8793 38.4395C13.8819 38.3323 13.931 36.1462 13.9278 36.2854L13.9281 36.2838H13.9278L13.9281 36.2822C13.9281 36.2806 13.9275 36.2806 13.9275 36.2806C13.9283 36.2502 13.9163 36.2214 13.9131 36.191C13.8982 36.0454 13.8478 35.9046 13.7444 35.7925C13.4003 35.4212 12.9985 35.6165 11.589 35.5349C11.5871 35.5349 11.5855 35.5349 11.5836 35.5349C11.4557 35.5349 11.3511 35.6373 11.3482 35.7653C11.3464 35.8597 11.3293 36.7175 11.3312 36.6215L11.3096 37.7274C11.2978 38.1995 11.6671 38.6028 12.18 38.63Z" fill="#100F0D"/>
<path d="M12.2688 45.2562C12.4197 45.2609 11.7225 45.2422 13.7439 45.2952C13.8716 45.2952 13.9754 45.1938 13.9791 45.0644C13.9795 45.0504 13.9748 45.2687 14.0261 42.9037C14.0261 42.5218 13.7236 42.2115 13.333 42.1975L11.6861 42.1694C11.5308 42.1788 11.4499 42.2692 11.4471 42.4002L11.4095 44.3567C11.3964 44.8415 11.7843 45.2562 12.2688 45.2562Z" fill="#100F0D"/>
<path d="M26.9172 20.8228C27.0008 20.6227 27.1405 20.4005 27.2746 20.4005C27.2819 20.4005 27.2892 20.4006 27.2966 20.4039C27.3875 20.4175 27.4455 20.5481 27.4364 20.6532C27.3997 20.7549 27.4596 20.7583 27.2112 21.1415C26.9758 21.462 26.7425 21.7418 26.5053 21.9859C26.5716 21.5434 26.8161 21.0466 26.9172 20.8228ZM21.9255 24.8192C23.4504 24.6175 24.9355 23.9579 26.1487 22.9507C26.5881 24.0902 28.0605 24.1597 28.8829 23.0236C29.3434 23.7934 30.4153 23.7188 31.0915 23.1067C31.3535 22.8693 31.5454 22.5794 31.7064 22.2911C32.1101 22.6167 32.6942 22.3047 32.8377 21.8147C32.9452 21.5027 32.8965 21.1686 32.857 20.8974C32.8114 20.5803 32.3468 20.6634 32.3921 20.9652C32.4268 21.2076 32.4628 21.4569 32.3902 21.6706C32.2942 21.991 31.937 22.0588 31.937 21.7774C31.937 21.5485 31.5658 21.501 31.4849 21.7045C31.2899 22.0843 31.0878 22.4742 30.7753 22.7591C30.1624 23.3153 29.2361 23.2034 29.1881 22.476C29.26 22.3318 29.3256 22.1775 29.3885 21.9876C29.4656 21.7553 29.1786 21.5739 29.0053 21.7418C28.8354 21.8977 28.7459 22.1182 28.7291 22.359C28.7277 22.364 28.7231 22.3674 28.7221 22.3725C28.1088 23.6798 26.7841 23.6679 26.5357 22.6014C26.9738 22.2047 27.8564 21.2839 27.905 20.6939C27.9337 20.37 27.7416 19.9987 27.3784 19.9393C27.1652 19.9003 26.7754 19.941 26.4631 20.6837C26.1889 21.2924 25.9671 21.8011 26.0389 22.4149C24.8598 23.4611 23.3839 24.1512 21.865 24.353C21.5639 24.3936 21.6066 24.8481 21.9255 24.8192Z" fill="#100F0D"/>
</g>
</svg>

    ) },
    { lab: 'Reviewing', val: 'review' ,icon:  <img src="/Payment2.svg" alt="Reviewing" width={60} height={61} />
  },
    { lab: 'Received', val: 'received' ,icon: <img src="/Payment3.svg" alt="Reviewing" width={60} height={61} /> },
    { lab: 'Rejected', val: 'rejected' ,icon:<img src="/Payment4.svg" alt="Reviewing" width={60} height={61} /> },
  ].map((dat, i) => {
                        return (

                          <>


<div className="">



<div key={i}  onClick={() => setValue(dat?.val)}  className={`flex-1  min-w-64 gap-4 bg-white p-5 rounded-lg   shadow-sm  m-4  ${value === dat?.val ? ' bg-[#ffe4c4]': 'bg-white'}`} >






<div className='flex gap-4 flex-col  ' >
<div className={`flex justify-between items-start`}>
  <div className='flex gap-2 flex-col'>
    <div className="flex items-center gap-1">
      <span className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0%] uppercase">  {dat?.lab}</span>
      <span className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0%]">
  ({rowsCounter(finFetchedData, dat?.val)?.length})
</span>

    </div>

    <h3 className="font-outfit font-medium text-[24px] leading-[100%] tracking-[2%]">₹<CountUpComp value={totalAmountCounter(finFetchedData, dat?.val)} /></h3>
<p className="font-outfit font-normal text-[12px] leading-[1] tracking-[0]">InWord: 100cr</p>
  </div>
  <div className="h-12 w-12 flex items-center justify-center">
    {/* <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      className="w-10 h-10 text-gray-200"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={dat.icon} />
    </svg> */}
                                      {dat.icon}

  </div>
</div>


<div className="flex gap-6">
  <div className="flex items-center">
    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
    <span className="text-green-600 font-outfit font-normal text-[12px] leading-[100%] tracking-[0%]">12%</span>
    <span className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0%]">vs Last Week</span>
  </div>
  <div className="flex items-center">
    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
    <span className="text-red-600 font-outfit font-normal text-[12px] leading-[100%] tracking-[0%]">12%</span>
    <span className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0%]">vs Last Month</span>
  </div>
</div>
</div>

</div>
</div>
                          
                          </>
                        )
                      })}
                    </section>
                  </section>
                </div>
              </div>

      </div>
      
  
      <div className="mx-4 my-1 relative z-10">
        
      </div>
    </div>


          <div className="mx-4 my-1 relative z-10">
            <div className="items-center justify-between  py-2 px-2  pl-[1%] ">



              <div className="flex px-6">
                {leadsTyper == 'inProgress' && (
                  <span className="inline-flex p-1  bg-gray-200 ">
                    <button
                      className={`px-2 py-1  rounded ${
                        ready ? 'bg-white shadow' : ''
                      }`}
                      onClick={() => setReady(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                        />
                      </svg>
                    </button>
                    <button
                      className={`px-2 py-1  rounded ${
                        !ready ? 'bg-white shadow' : ''
                      }`}
                      onClick={() => setReady(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                <></>
              </div>
            </div>

            <MetaTags title="ExecutiveHome" description="ExecutiveHome page" />

            {!ready && (
              <div className="overflow-hidden  ">
                <div className="flex flex-col   pt-4 pb-10">
                  <div className="flex flex-row ">
                    <span className="text-lg font-bold text-[#000000]"></span>
                  </div>
                  <div className="">
                    <div className="flex flex-row justify-between ">
                      <ul
                        className="flex flex-wrap -mb-px "
                        id="myTab"
                        data-tabs-toggle="#myTabContent"
                        role="tablist"
                      >
                        {tabHeadFieldsA.map((fieldHead, i) => {
                          return (
                            <li key={i} className="mr-2 flex items-center" role="presentation">
                              <button
                                className={`inline-block pt-3 pb-2  mx-4 text-sm font-medium text-center text-black rounded-t-lg border-b-[3px]  hover:text-gray-800    ${
                                  value === fieldHead?.val
                                    ? 'border-black text-gray-800'
                                    : 'border-transparent'
                                }`}
                                type="button"
                                role="tab"
                                onClick={() => setValue(fieldHead?.val)}
                              >
                                <span
                                  className={` text-[14px]  ${
                                    value === fieldHead.val
                                      ? 'text-[#0E0A1F]'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {' '}
                                  {`${fieldHead.lab} `}
                                </span>

                                <span className={`px-1 py-1   ml-[4px] text-[14px] ${
      value === fieldHead?.val
        ? 'text-[#0E0A1F]'
        : 'text-gray-800'
    }`}>
      {rowsCounter(finFetchedData, fieldHead?.val)?.length}
    </span>
                   

                              </button>



                              {i !== tabHeadFieldsA.length - 1 && (
    <div className="w-px h-5 bg-gray-200 self-center"></div>
  )}
                            </li>
                          )
                        })}
                      </ul>
                      <div className="flex flex-row mr-4">
                        <span
                          className="flex mt-[4px] mr-[0px] justify-center items-center w-6 h-6  text-black cursor-pointer "
                          onClick={() => {
                            setShowSettings(!showSettings)
                          }}
                        >
                          <AdjustmentsIcon className=" w-4 h-4 text-black" />
                        </span>
                        {/* <button
                          onClick={() => setisImportLeadsOpen(true)}
                          className={`flex items-center ml-5 pl-2 mt-2 pr-4 py-1 max-h-[30px] mt-[2px]  text-sm font-medium text-white hover:text-black bg-[#E06349] rounded-[4px] hover:bg-[#ffe4c4]  `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 22 22"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>

                          <span className="ml-1 ">New</span>
                        </button> */}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${
                      showSettings ? 'hidden' : ''
                    } flex flex-row py-2 `}
                  >
                    <span className="flex ml-5 mr-5 bg-gray-50 border border-gray-300 border-solid box-border w-1/3 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4  mt-[10px] mx-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      <input
                        type="text"
                        id="globalSearch"
                        placeholder="Search Unit No, Customer name, Phone no, Dues..."
                        autoComplete="off"
                        className="w-52 bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900 w-4/5 relative"
                      />
                    </span>
                    <div className="mt-1 mr-2">
                      <SlimSelectBox
                        name="project"
                        label=""
                        className="input "
                        onChange={(value) => {

                        }}
                        value={'alltransactions'}
                        options={[
                          ...[
                            {
                              label: 'All Transactions',
                              value: 'alltransactions',
                            },
                            { label: 'Cheque', value: 'cheque' },
                            { label: 'Imps', value: 'imps' },
                            { label: 'Neft', value: 'neft' },
                            { label: 'Rtgs', value: 'rtgs' },
                            { label: 'Cash', value: 'cash' },
                          ],
                        ]}
                      />
                    </div>
                    <div>
                      <SlimDateSelectBox
                        onChange={async (value) => {
                          setSourceDateRange(value)
                        }}
                        label={sourceDateRange}
                        placeholder={undefined}
                      />
                    </div>
                    <span style={{ display: '' }}>
                      <CSVDownloader
                        className="mr-6 h-[20px] w-[20px] mt-2"
                        downloadRows={finFetchedData}
                        style={{ height: '20px', width: '20px' }}
                      />
                    </span>
                    <span className="mt-1"> clear</span>
                  </div>
                  <div className="flex flex-row  px-[4px] py-2 relative">
                    <div className="flex w-full  ">
                    <div className="w-full max-h-[600px] overflow-y-auto relative">

                    <table className="w-full rounded-2xl overflow-hidden border-collapse [border-radius:1rem!important]">
                        <thead className="bg-[#FEE4CD] sticky top-0 z-10">
                          <tr className="p-2">
                            <th className="w-2"></th>
                            <th className="text-left text-xs text-[#000000] py-2">
                              <span className="ml-4">From</span>
                            </th>
                            <th className="text-left text-xs text-[#000000] py-2">
                              <span className="ml-4">Dated as</span>
                            </th>
                            <th className="text-left text-xs text-[#000000] py-2">
                              Mode
                            </th>
                            <th className="text-left text-xs text-[#000000] py-2">
                              Details
                            </th>
                            <th className="text-right text-xs text-[#000000] py-2">
                              <span className="mr-10">Amount</span>
                            </th>
                            <th className="text-left text-xs text-[#000000] py-2">
                              <span className="mr-10">Assigned to</span>
                            </th>
                            <th className="text-left text-xs text-[#000000] py-2">
                              <span className="mr-10">Status</span>
                            </th>

                            <th className="text-center text-xs text-[#000000] py-2">
                              Comments
                            </th>

                            <th></th>
                          </tr>
                        </thead>
                        <tbody className="bg-[#FCFCFD] divide-y divide-[#E7E7E9]">
                          {finSelData?.map((finData, i) => (
                            <tr
                              className="border-b border-gray-200"
                              key={i}
                              onClick={() => viewTransaction(finData)}
                            >
                              <td className="pl-3">
                                <div className="flex justify-center text-right items-center rounded-md w-2 h-8 app-bg-yellow-2 app-color-yellow-1 text-xs font-semibold">
                                  {i + 1}
                                </div>

                              </td>
                              <td>
                                <div className="flex flex-row py-2 ml-4">
                                  <div className="mr-2 w-[3px] "></div>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-[#000000]">
                                      {finData?.customerName ||
                                        finData?.fromObj?.name ||
                                        'NA'}
                                    </span>
                                    <span className="font-normal text-xs app-color-gray-1">
                                      {finData?.towards}
                                    </span>
                                    <span className="font-normal text-xs app-color-gray-1">
                                      {finData?.fromObj?.bankName}
                                    </span>
                                    <span className="font-normal text-xs app-color-gray-1">
                                      {finData?.fromObj?.branch}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="flex flex-row ml-4 py-2">
                                  <span className="font-normal text-xs app-color-gray-1">
                                    {prettyDate(finData?.txt_dated)}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="flex flex-row py-2">
                                  {/* <div className="mr-2 w-[3px]  bg-gray-100 "></div> */}
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-[#000000]">
                                      {finData?.mode}
                                    </span>
                                    <span className="font-normal text-xs app-color-gray-1">
                                      {finData?.txt_id}
                                    </span>
                                    {/* <span className="font-normal text-xs app-color-gray-1">
                                      {timeConv(finData?.txt_dated)}
                                    </span> */}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="flex flex-row py-2">
                                  {/* <div className="mr-2 w-[3px]  bg-gray-100 "></div> */}
                                  <div className="flex flex-col">
                                    <span className="font-normal text-xs app-color-gray-1">
                                      {finData?.txt_id}
                                    </span>
                                    <span className="font-normal text-xs app-color-gray-1">
                                     {timeConv(finData?.txt_dated)}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-right">
                                <span className="text-right font-semibold text-sm app-color-gray-1 mr-10">
                                  ₹ {finData?.totalAmount?.toLocaleString('en-IN')}
                                </span>
                              </td>
                              <td className="text-left">
                                <span className="text-left font-semibold text-sm app-color-gray-1 mr-10">
                                  {finData?.assignedTo || 'NA'}
                                </span>
                              </td>

                              <td>
                                <span className=" text-left font-normal text-md app-color-gray-1">
                                  {finData?.status}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold text-left text-sm text-[#000000]">
                                  NA
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
</div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* {!ready && (
              <FinanceTableView
                leadsFetchedData={leadsFetchedData}
                setisImportLeadsOpen={setisImportLeadsOpen}
                selUserProfileF={selUserProfileF}
                leadsTyper={leadsTyper}
              />
            )} */}
          </div>










        </div>
       

</div>



      </div>
      <SiderForm
        open={openTransactionDetails}
        setOpen={setOpenTransactionDetails}
        title={'Transaction'}
        customerDetails={selUserProfile}
        widthClass="max-w-md"
        transactionData={transactionData}
      />
      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={'New Transaction'}
        customerDetails={selUserProfile}
        widthClass="max-w-2xl"
        transactionData={transactionData}
      />
    </>
  )
}

export default FinanceTransactionsHome
