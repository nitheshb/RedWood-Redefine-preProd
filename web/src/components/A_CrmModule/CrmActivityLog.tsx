/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { useState, useEffect } from 'react'
import { supabase } from 'src/context/supabase'
import { Card, CardHeader, Container, Grid, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getAllProjects, steamUnitActivityLog, steamUnitSubTypeActivityLog } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import 'flowbite'
import '../../styles/myStyles.css'
import { ClockIcon } from '@heroicons/react/outline'


import { crmActivieLogNamer } from 'src/util/CrmActivityLogHelper'
import { timeConv } from 'src/util/dateConverter'


const CrmActivityLog = ({ selUnitPayload, title, type }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { user } = useAuth()

  const { orgId } = user

  const [unitFetchedActivityData, setUnitFetchedActivityData] = useState([])

console.log('account records', selUnitPayload?.id)
 const boot = async () => {
    const unsubscribe = steamUnitSubTypeActivityLog(orgId, {
      uid: selUnitPayload?.id,
      pId: selUnitPayload?.pId,
      subtype: type
    })

    const y = await unsubscribe
    setUnitFetchedActivityData(y)
    await console.log('new setup ', unitFetchedActivityData)
    await console.log('new setup ', y)
  }
  useEffect(() => {
    boot()
console.log('account records', selUnitPayload?.id, orgId)
    const channel = supabase
        .channel('unit-logs-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: `${orgId}_unit_logs`,
          },
          (payload) => {
    // const subscription = supabase
    //   .from(`${orgId}_unit_logs`)
    //   .on('*', (payload) => {
        console.log('account records', payload)
        const updatedData = payload.new
        const { uid } = payload.old
        const eventType = payload.eventType
        console.log('account records', updatedData.Uuid, selUnitPayload?.id)

        if (updatedData.Uuid === selUnitPayload?.id) {
          if (updatedData.Uuid === selUnitPayload?.id) {
            console.log('account records', updatedData.Uuid, selUnitPayload?.id)
            setUnitFetchedActivityData((prevLogs) => {
              const existingLog = prevLogs.find((log) => log.uid === uid)
              console.log(
                'account records',
                prevLogs,
                existingLog,
                uid,
                payload.old,
                uid
              )
              if (existingLog) {
                console.log('Existing record found!')
                if (payload.new.status === 'Done') {
                  const updatedLogs = prevLogs.filter((log) => log.uid != uid)
                  return [...updatedLogs]
                } else {
                  const updatedLogs = prevLogs.map((log) =>
                    log.uid === uid ? payload.new : log
                  )
                  return [...updatedLogs]
                }
              } else {
                console.log('New record added!')
                return [payload.new,...prevLogs]
              }
            })
          } else {
            if (
              updatedData.by_uid === user?.uid ||
              updatedData?.to_uid === user?.uid
            ) {
              setUnitFetchedActivityData((prevLogs) => {
                const existingLog = prevLogs.find((log) => log.uid === uid)

                if (existingLog) {
                  console.log('Existing record found!')
                  if (payload.new.status === 'Done') {
                    const updatedLogs = prevLogs.filter((log) => log.uid != uid)
                    return [...updatedLogs]
                  } else {
                    const updatedLogs = prevLogs.map((log) =>
                      log.id === uid ? payload.new : log
                    )
                    return [...updatedLogs]
                  }
                } else {
                  console.log('New record added!')
                  return [payload.new,...prevLogs, ]
                }
              })
            }
          }
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selUnitPayload])
  return (
    <div className="rounded w-[420px]  flex flex-col overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300" style={{ height: `calc(100vh - 60px)` }}>
    <div className="flex flex-col bg-[#EDE9FE] rounded-lg p-3">
    <div className="flex flex-row ">
          <img
            src="https://static.ambitionbox.com/static/benefits/WFH.svg"
            alt=""
          />
          <h1 className="text-bodyLato text-left text-[#1E223C] font-medium text-[14px] mb-2 mt-3 ml-1">
            {title}
          </h1>
        </div>

      <div className="relative col-span-12 pl-6 space-y-2 sm:col-span-9 mt-3">
        {unitFetchedActivityData?.length == 0 && (
          <div className="py-8 px-8 flex flex-col items-center">
            <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
              <img
                className="w-[200px] h-[200px] inline"
                alt=""
                src="/templates.svg"
              />
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-900 ">
              Timeline is Empty
            </h3>
            <time className="block mb-2 text-[11px] font-normal leading-none text-gray-400 ">
              This scenario is very rare to view
            </time>
          </div>
        )}
        <div className="col-span-12 space-y-2 relative pl-4 sm:col-span-8  sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:bg-gray-200">
          {unitFetchedActivityData?.map((data, i) => {
            return (
              <div
                key={i}
                className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:bg-violet-200 bg-white p-3 rounded-lg"
              >
                <section>
                <span className="text-[11px]  font-bold    py-[2px] rounded-lg   ">
                {crmActivieLogNamer(data)}:
                  </span>
                <span className="text-[10px] ml-1 text-[#398A58] font-bold  bg-[#D9d8ff] px-[6px] py-[2px] rounded-lg   ">
               {data?.to} {'  '}
                  </span>






                </section>
                <span className="text-[12px] font- text-[#151F2B] flex flex-row">
                    {/* {data?.type?.toUpperCase()} */}
                   By: {data?.by}
                  </span>
                <span className="inline-flex flex-row items-center text-[12px] font-normal text-gray-500 ">
                  <ClockIcon className=" w-3 h-3 text-gray-300" />
                  <span className="text-gray-500 ml-1 mr-4">
                    {data?.type == 'ph'
                      ? timeConv(Number(data?.time)).toLocaleString()
                      : timeConv(data?.T).toLocaleString()}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    </div>
  )
}

export default CrmActivityLog


