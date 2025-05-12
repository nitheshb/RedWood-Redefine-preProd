import { useState,useEffect, useRef } from 'react';
import { DeviceMobileIcon, MailIcon, TrashIcon } from '@heroicons/react/outline'
import AssigedToDropComp from '../assignedToDropComp';
import { USER_ROLES } from 'src/constants/userRoles';
import { currentStatusDispFun } from 'src/util/leadStatusDispFun';
import { prettyDateTime } from 'src/util/dateConverter';
import { useAuth } from 'src/context/firebase-auth-context';
import SiderForm from '../SiderForm/SiderForm';
export default function DuplicateLeadCard( {leadDetailsO,usersList,  projectList}) {
  const { user } = useAuth()
  const { orgId } = user
  const [value, setValue] = useState(50);
  const [labelPosition, setLabelPosition] = useState(50);
  const sliderRef = useRef(null);
  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false);
  const {
    id,
    Name,
    Project,
    ProjectId,
    Source,
    Status,
    by,
    Mobile,
    Date,
    Email,
    Assigned,
    AssignedBy,
    Notes,
    Timeline,
    documents,
    Remarks,
    notInterestedReason,
    notInterestedNotes,
    stsUpT,
    assignT,
    leadDetailsObj,
    assignedToObj,
    CT,
  } = leadDetailsO
  return (
    <>
      <div
                                    key={leadDetailsO?.id}
                                    className=" pb-[2px] px-3  mt-0 rounded-md  mb-1  bg-[#F2F5F8] cursor-pointer"
                                    onClick={() => {
                                      setisImportLeadsOpen(true)
                                    }}
                                  >
                                    <div className="-mx-3 flex flex-col sm:-mx-4 px-3">
                                      <div className=" w-full px-1  ">
                                        <div className="">
                                          <div className="font-semibold flex  flex-row justify-between text-[#053219]  text-sm  mt-3 mb-1  tracking-wide font-bodyLato">
                                            <div className="mb-[4px] text-xl uppercase">
                                              {Name}
                                            </div>

                                            <div className="mt-1">
                                              <div className="font-md text-sm text-gray-500 mb-[2] tracking-wide">
                                                <MailIcon className="w-4 h-4 inline text-[#058527] " />{' '}
                                                {Email}
                                              </div>
                                            </div>

                                            <div className="font-md mt-1 text-sm text-gray-500 mb-[2] tracking-wide ">
                                              <DeviceMobileIcon className="w-4 h-4 inline text-[#058527] " />{' '}
                                              {Mobile?.replace(
                                                /(\d{3})(\d{3})(\d{4})/,
                                                '$1-$2-$3'
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="w-full px-1  mt-1 mb-1 bg-white  pl-3 pt-2 ">
                                        <div className="relative z-10 my-1 bg-white">
                                          <div className="grid grid-cols-3 gap-5">
                                            <section className="">
                                              <div className="flex flex-row  cursor-pointer">
                                                <div className="font-md text-xs text-gray-500 mb-[2px] tracking-wide mr-4">
                                                  Project {}
                                                </div>
                                              </div>
                                              <div className="font-semibold text-sm text-slate-900 tracking-wide overflow-ellipsis">
                                                {/* projectList */}

                                                {!user?.role?.includes(
                                                  USER_ROLES.CP_AGENT
                                                ) &&
                                                  [
                                                    'junk',
                                                    'notinterested',
                                                    'dead',
                                                  ].includes(Status) && (
                                                    <AssigedToDropComp
                                                      assignerName={Project}
                                                      id={id}
                                                      align="right"
                                                      // setAssigner={setNewProject}
                                                      usersList={projectList}
                                                    />
                                                  )}
                                                {!user?.role?.includes(
                                                  USER_ROLES.CP_AGENT
                                                ) &&
                                                  ![
                                                    'junk',
                                                    'notinterested',
                                                    'dead',
                                                  ].includes(Status) && (
                                                    <div className="font-semibold text-[#053219] text-sm  mt- px-[3px] pt-[2px] rounded ">
                                                      {Project}{' '}
                                                    </div>
                                                  )}
                                              </div>
                                            </section>

                                            <section>
                                              <div className="font-md text-xs text-gray-500 mb-[px] tracking-wide mr-4">
                                                Assigned To {}
                                              </div>
                                              {!user?.role?.includes(
                                                USER_ROLES.CP_AGENT
                                              ) &&
                                                [
                                                  'junk',
                                                  'notinterested',
                                                  'dead',
                                                ].includes(Status) && (
                                                  <div>
                                                    <AssigedToDropComp
                                                      assignerName={
                                                        assignedToObj?.label
                                                      }
                                                      id={id}
                                                      usersList={usersList}
                                                      align={undefined}
                                                    />
                                                  </div>
                                                )}
                                              {!user?.role?.includes(
                                                USER_ROLES.CP_AGENT
                                              ) &&
                                                ![
                                                  'junk',
                                                  'notinterested',
                                                  'dead',
                                                ].includes(Status) && (
                                                  <div className="font-semibold text-[#053219] text-sm  mt- px-[3px] pt-[2px] rounded ">
                                                    {assignedToObj?.label}{' '}
                                                  </div>
                                                )}
                                              {user?.role?.includes(
                                                USER_ROLES.CP_AGENT
                                              ) && (
                                                <span className="text-left text-sm">
                                                  {' '}
                                                  {assignedToObj?.label}
                                                </span>
                                              )}
                                            </section>
                                            <section>
                                              <div className="font-md text-xs text-gray-500 mb-[0px] tracking-wide mr-4">
                                                Current Status {}
                                              </div>
                                              <div className="font-semibold text-[#053219] text-sm  mt- px-[3px] pt-[2px] rounded ">
                                                {currentStatusDispFun(Status)}{' '}
                                              </div>
                                            </section>
                                          </div>
                                          <div className="w-full border-b border-[#ebebeb] mt-4"></div>
                                          <div className=" w-full  pt-1 font-md text-xs text-gray-500 mb-[2px] tracking-wide mr-4 grid grid-cols-3 gap-5">
                                            {' '}
                                            <section>
                                              <span className="font-thin   font-bodyLato text-[9px]  py-[6px]">
                                                Created On
                                                <span className="text-[#867777] ck ml-2">
                                                  {CT != undefined
                                                    ? prettyDateTime(CT)
                                                    : prettyDateTime(Date)}
                                                </span>
                                              </span>
                                            </section>
                                            <section>
                                              <span className="font-thin   font-bodyLato text-[9px]  py-[6px]">
                                                Updated On :
                                                <span className="text-[#867777] ck ml-2">
                                                  {stsUpT === undefined
                                                    ? 'NA'
                                                    : prettyDateTime(stsUpT) ||
                                                      'NA'}
                                                </span>
                                              </span>
                                            </section>
                                            <section>
                                              <span className="font-thin text-[#867777]   font-bodyLato text-[9px]  py-[6px]">
                                                Assigned On
                                                <span className="text-[#867777] ck ml-2">
                                                  {assignT != undefined
                                                    ? prettyDateTime(assignT)
                                                    : prettyDateTime(Date)}
                                                </span>
                                              </span>
                                            </section>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                      <div className="px-3 py-2 flex flex-row  text-xs  border-t border-[#ebebeb] font-thin   font-bodyLato text-[12px]  py-[6px] ">
                                        Recent Comments:{' '}
                                        <span className="text-[#867777] ml-1 ">
                                          {' '}
                                          {Remarks || 'NA'}
                                        </span>
                                      </div>
                                      <div
                                        className="relative flex flex-col  group"
                                        // style={{ alignItems: 'end' }}
                                      >
                                        <div
                                          className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
                                          // style={{  width: '300px' }}
                                          style={{ zIndex: '9999' }}
                                        >
                                          <span
                                            className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                            style={{
                                              color: 'black',
                                              background: '#e2c062',
                                              maxWidth: '300px',
                                            }}
                                          >
                                            <div className="italic flex flex-col">
                                              <div className="font-bodyLato">
                                                {Source?.toString() || 'NA'}
                                              </div>
                                            </div>
                                          </span>
                                          <div
                                            className="w-3 h-3  -mt-2 rotate-45 bg-black"
                                            style={{
                                              background: '#e2c062',
                                              marginRight: '12px',
                                            }}
                                          ></div>
                                        </div>
                                        <span className="font-bodyLato text-[#867777] text-xs mt-2">
                                          {Source?.toString() || 'NA'}
                                        </span>
                                      </div>
                                    </div>
     </div>
     <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={'Lead Profile'}
        widthClass="max-w-4xl"
        customerDetails={leadDetailsO}
        unitsViewMode={false}
        // setUnitsViewMode={setUnitsViewMode}
        // setIsClicked={setIsClicked}
      />
</>

  );
}