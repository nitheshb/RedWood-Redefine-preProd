import { useState } from 'react'
import { useSnackbar } from 'notistack'
import Loader from 'src/components/Loader/Loader'
import {
  editPlotStatusAuditUnit,
  getAllUnitsByProject,
  updateProjectComputedData,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

const ProjectAuditHome = ({ title, dialogOpen, data, projectDetails }) => {
  const [loading, setLoading] = useState(false)
  const [unitDetailsA, setUnitDetailsA] = useState([])

  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const { orgId } = user

  const auditFun = async () => {
    console.log('audit begin')
    setLoading(true)


    await setInvalidUnitStatus()
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

    // await console.log('leadsData', leadsData)
  }

  const setProjectComputedCounts = async () => {
    console.log('login role detials', user)
    const { access, uid } = user

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
      blockedArea:0
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
        yo.mangBlockArea = yo.mangBlockArea  + (data?.area || 0)
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

      if (
        ['customer_blocked', 'management_blocked'].includes(
          data?.status
        )
      ) {
        yo.blockedArea = yo.blockedArea + (data?.area || 0)
      }
    })

    await updateProjectComputedData(orgId, projectDetails?.uid, yo)
    return unsubscribe

  }
  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-4   z-10">

        <div className="flex flex-row ">
          <div className="mr-4 templateList flex flex-row">
            <button
              className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500"
              type="submit"
              onClick={() => auditFun()}
              disabled={loading}
            >
              {loading && <Loader />}
              Project Audit
            </button>
            <div className=" flex">
              <div className="flex flex-col">
                <button
                  className="templateItem flex"
                  tabIndex="0"
                  type="button"
                >
                  <span className="pr-1">
                    <svg
                      className="tempalteIcon"
                      focusable="false"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M14.9729 13.3132L12.9893 9.34558C13.6386 8.38794 14.0183 7.2334 14.0183 5.9917C14.0183 2.68787 11.3305 0 8.02663 0C4.7228 0 2.03493 2.68787 2.03493 5.9917C2.03493 7.2334 2.41469 8.38806 3.0641 9.34583L1.08022 13.3132C1.00759 13.4586 1.0154 13.6311 1.10073 13.7693C1.18618 13.9075 1.33705 13.9917 1.49953 13.9917H3.77553L5.14113 15.8125C5.23024 15.9312 5.3694 16 5.51613 16C5.71059 16 5.86379 15.884 5.93544 15.7408L7.8163 11.9792C7.88613 11.9817 7.95619 11.9834 8.02663 11.9834C8.09706 11.9834 8.16713 11.9817 8.23696 11.9792L10.1178 15.7408C10.1892 15.8838 10.3425 16 10.5371 16C10.6837 16 10.823 15.9312 10.912 15.8125L12.2777 13.9917H14.5537C14.7162 13.9917 14.8671 13.9075 14.9524 13.7693C15.0379 13.6311 15.0457 13.4586 14.9729 13.3132ZM5.43618 14.6432L4.38491 13.2417C4.2964 13.1237 4.15749 13.0542 4.00991 13.0542H2.25795L3.71254 10.1453C4.53847 11.0027 5.6166 11.6156 6.82643 11.8625L5.43618 14.6432ZM2.97243 5.9917C2.97243 3.20483 5.23976 0.9375 8.02663 0.9375C10.8135 0.9375 13.0808 3.20483 13.0808 5.9917C13.0808 8.77856 10.8135 11.0459 8.02663 11.0459C5.23976 11.0459 2.97243 8.77856 2.97243 5.9917ZM12.0432 13.0542C11.8958 13.0542 11.7569 13.1237 11.6682 13.2417L10.6171 14.6432L9.2267 11.8625C10.4367 11.6155 11.5149 11.0027 12.3408 10.145L13.7952 13.0541H12.0432V13.0542Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M10.4193 6.7691L11.7283 5.2066C11.8321 5.08283 11.8648 4.91437 11.8149 4.7608C11.765 4.60712 11.6395 4.49005 11.4829 4.45087L9.50544 3.95624L8.42378 2.22833C8.33808 2.09137 8.18794 2.00824 8.02644 2.00824C7.86494 2.00824 7.71479 2.09137 7.6291 2.22833L6.54768 3.95624L4.57038 4.45087C4.41365 4.49005 4.28816 4.60712 4.23823 4.76068C4.18843 4.91437 4.22102 5.08283 4.32478 5.2066L5.63386 6.7691L5.49299 8.80243C5.48188 8.96356 5.55439 9.11908 5.68501 9.21405C5.88337 9.35822 6.08515 9.28998 6.13581 9.26959L8.02644 8.50763L9.91706 9.26972C10.0668 9.33002 10.2371 9.30902 10.3677 9.21417C10.4985 9.1192 10.571 8.96369 10.5599 8.80255L10.4193 6.7691ZM9.5793 6.31183C9.50141 6.40485 9.4626 6.52423 9.47102 6.6452L9.57295 8.12018L8.20173 7.56745C8.04975 7.50617 7.91645 7.54108 7.85127 7.56745L6.48005 8.12018L6.58222 6.64533C6.59053 6.52435 6.55171 6.40485 6.47383 6.31183L5.52436 5.17865L6.95857 4.81989C7.07624 4.79047 7.17781 4.71661 7.24214 4.61383L8.02656 3.36054L8.81111 4.61383C8.87544 4.71661 8.977 4.79047 9.09468 4.81989L10.5289 5.17865L9.5793 6.31183Z"
                          fill="currentColor"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="16" height="16" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>

                  <span className="pt-[5px]">Unit Status</span>
                </button>
                <button className="templateItem" tabIndex="0" type="button">
                  <span className="pr-1">
                    <svg
                      className="tempalteIcon"
                      focusable="false"
                      viewBox="0 0 18 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M0.0873592 4.7591C0.0883085 4.76037 0.0891522 4.7618 0.0901366 4.76302C0.0902773 4.76318 0.0903827 4.76339 0.0905234 4.76359L8.73922 15.8656C8.80366 15.9484 8.90133 16 8.99998 16C9.09831 16 9.1958 15.9489 9.26074 15.8656L17.9094 4.76359C17.9096 4.76343 17.9097 4.76322 17.9098 4.76302C17.9108 4.76175 17.9116 4.76037 17.9126 4.7591C18.0253 4.61029 18.0282 4.39171 17.926 4.23943C17.925 4.23796 17.9242 4.23629 17.9232 4.23482L15.1106 0.153184C15.0439 0.0563673 14.9429 0 14.8361 0C13.4028 0 4.33007 0 3.16387 0C3.05706 0 2.95605 0.0563673 2.88933 0.153184L0.0767417 4.23482C0.0757222 4.23629 0.075019 4.23792 0.0739994 4.23943C-0.0293278 4.39331 -0.0240542 4.61196 0.0873592 4.7591ZM7.08957 0.816326H10.9104L12.5979 4.08163H5.40202L7.08957 0.816326ZM5.32045 4.89796H12.6794L8.99994 14.5807L5.32045 4.89796ZM13.448 4.89796H16.8567L10.2017 13.4407L13.448 4.89796ZM4.55191 4.89796L7.79823 13.4407L1.14324 4.89796H4.55191ZM16.9172 4.08163H13.4179L11.7303 0.816326H14.6671L16.9172 4.08163ZM3.3328 0.816326H6.26956L4.58201 4.08163H1.08273L3.3328 0.816326Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>

                  <span className="pt-[5px]">Unit Commercials Count</span>
                </button>
                <button
                  className="templateItem hightlightItem"
                  tabIndex="0"
                  type="button"
                >
                  <span className="pr-1">
                    <svg
                      className="tempalteIcon tempalteIcon"
                      focusable="false"
                      viewBox="0 0 17 21"
                      aria-hidden="true"
                    >
                      <path
                        d="M11.4766 9.90449C12.7564 8.97117 13.5897 7.4607 13.5897 5.75906C13.5897 2.93137 11.2892 0.630859 8.46152 0.630859C5.63383 0.630859 3.33332 2.93137 3.33332 5.75906C3.33332 7.4607 4.16664 8.97117 5.44641 9.90449C2.26516 11.1219 0 14.2063 0 17.8104C0 19.3656 1.26527 20.6309 2.82051 20.6309H14.1025C15.6578 20.6309 16.923 19.3656 16.923 17.8104C16.923 14.2063 14.6579 11.1219 11.4766 9.90449ZM4.8718 5.75906C4.8718 3.77969 6.48215 2.16934 8.46152 2.16934C10.4409 2.16934 12.0512 3.77969 12.0512 5.75906C12.0512 7.73844 10.4409 9.34883 8.46152 9.34883C6.48215 9.34883 4.8718 7.73844 4.8718 5.75906ZM14.1025 19.0924H2.82051C2.11359 19.0924 1.53848 18.5173 1.53848 17.8103C1.53848 13.9929 4.6441 10.8872 8.46156 10.8872C12.279 10.8872 15.3846 13.9929 15.3846 17.8103C15.3846 18.5173 14.8095 19.0924 14.1025 19.0924Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>

                  <span className="pt-[5px]"> CRM Counts</span>
                </button>
                <button className="templateItem" tabIndex="0" type="button">
                  <span className="pr-1">
                    <svg
                      className="tempalteIcon"
                      focusable="false"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M8.50206 16H7.49791C6.68575 16 6.02497 15.3393 6.02497 14.5271V14.1874C5.67969 14.0771 5.34422 13.9378 5.02194 13.771L4.78119 14.0118C4.19809 14.5956 3.26406 14.5785 2.69791 14.0116L1.98819 13.3019C1.42103 12.7353 1.40472 11.8016 1.98837 11.2186L2.22894 10.978C2.06216 10.6558 1.92294 10.3203 1.81259 9.975H1.47291C0.660781 9.975 0 9.31425 0 8.50209V7.49791C0 6.68575 0.660781 6.025 1.47294 6.025H1.81263C1.92297 5.67969 2.06219 5.34425 2.22897 5.02197L1.98822 4.78125C1.40491 4.19856 1.421 3.26475 1.98841 2.69797L2.69819 1.98822C3.26566 1.41997 4.19947 1.40578 4.78144 1.98841L5.02197 2.22894C5.34425 2.06219 5.67972 1.92294 6.025 1.81259V1.47291C6.025 0.66075 6.68575 0 7.49794 0H8.50209C9.31425 0 9.975 0.66075 9.975 1.47291V1.81263C10.3203 1.92294 10.6558 2.06219 10.978 2.22897L11.2188 1.98822C11.8019 1.40441 12.7359 1.42153 13.3021 1.98844L14.0118 2.69812C14.5789 3.26466 14.5953 4.19838 14.0116 4.78141L13.771 5.02197C13.9378 5.34425 14.077 5.67966 14.1874 6.025H14.5271C15.3392 6.025 16 6.68575 16 7.49791V8.50209C16 9.31425 15.3392 9.975 14.5271 9.975H14.1874C14.077 10.3203 13.9378 10.6558 13.771 10.978L14.0118 11.2188C14.5951 11.8015 14.579 12.7353 14.0116 13.3021L13.3018 14.0118C12.7343 14.5801 11.8005 14.5943 11.2186 14.0116L10.978 13.7711C10.6558 13.9378 10.3203 14.0771 9.975 14.1874V14.5272C9.975 15.3392 9.31425 16 8.50206 16ZM5.17866 12.7866C5.62637 13.0513 6.10825 13.2514 6.61088 13.3811C6.81787 13.4345 6.9625 13.6212 6.9625 13.835V14.5271C6.9625 14.8223 7.20272 15.0625 7.49794 15.0625H8.50209C8.79731 15.0625 9.03753 14.8223 9.03753 14.5271V13.835C9.03753 13.6212 9.18216 13.4345 9.38916 13.3811C9.89178 13.2514 10.3737 13.0513 10.8214 12.7866C11.0056 12.6776 11.2401 12.7073 11.3915 12.8586L11.8817 13.3489C12.0931 13.5605 12.4325 13.5556 12.6387 13.3491L13.3489 12.6389C13.5546 12.4335 13.5615 12.094 13.3491 11.8819L12.8587 11.3914C12.7073 11.2401 12.6777 11.0055 12.7866 10.8213C13.0514 10.3737 13.2514 9.89178 13.3811 9.38912C13.4346 9.18213 13.6213 9.03753 13.835 9.03753H14.5271C14.8223 9.03753 15.0625 8.79734 15.0625 8.50212V7.49794C15.0625 7.20272 14.8223 6.96253 14.5271 6.96253H13.835C13.6212 6.96253 13.4346 6.81791 13.3811 6.61094C13.2514 6.10828 13.0514 5.62641 12.7866 5.17872C12.6777 4.99453 12.7073 4.75997 12.8587 4.60866L13.3489 4.11837C13.5609 3.90669 13.5553 3.56731 13.3491 3.36134L12.639 2.65119C12.4331 2.44506 12.0936 2.43903 11.8819 2.651L11.3915 3.14147C11.2402 3.29281 11.0056 3.32244 10.8214 3.2135C10.3737 2.94872 9.89181 2.74869 9.38919 2.61897C9.18219 2.56556 9.03756 2.37888 9.03756 2.16509V1.47291C9.03756 1.17769 8.79734 0.9375 8.50212 0.9375H7.49797C7.20275 0.9375 6.96253 1.17769 6.96253 1.47291V2.16503C6.96253 2.37881 6.81791 2.5655 6.61091 2.61891C6.10828 2.74863 5.62641 2.94866 5.17869 3.21344C4.99444 3.32234 4.75991 3.29272 4.60859 3.14141L4.11834 2.65112C3.90697 2.4395 3.5675 2.44441 3.36134 2.65091L2.65112 3.36109C2.44544 3.56653 2.43856 3.906 2.65094 4.11812L3.14141 4.60859C3.29272 4.75991 3.32234 4.99447 3.21344 5.17866C2.94866 5.62634 2.74866 6.10822 2.61894 6.61088C2.5655 6.81787 2.37881 6.96247 2.16506 6.96247H1.47294C1.17772 6.9625 0.9375 7.20269 0.9375 7.49791V8.50209C0.9375 8.79731 1.17772 9.0375 1.47294 9.0375H2.16503C2.37881 9.0375 2.56547 9.18213 2.61891 9.38909C2.74863 9.89175 2.94866 10.3736 3.21341 10.8213C3.32231 11.0055 3.29269 11.2401 3.14138 11.3914L2.65109 11.8817C2.43916 12.0933 2.44469 12.4327 2.65091 12.6387L3.36106 13.3488C3.56691 13.555 3.90641 13.561 4.11809 13.349L4.60853 12.8586C4.72003 12.7471 4.952 12.6525 5.17866 12.7866Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M8.00005 11.4812C6.08045 11.4812 4.5188 9.91949 4.5188 7.99993C4.5188 6.08036 6.08045 4.51868 8.00005 4.51868C9.91964 4.51868 11.4813 6.08036 11.4813 7.99993C11.4813 9.91949 9.91964 11.4812 8.00005 11.4812ZM8.00005 5.45618C6.59739 5.45618 5.4563 6.5973 5.4563 7.99993C5.4563 9.40255 6.59742 10.5437 8.00005 10.5437C9.40267 10.5437 10.5438 9.40255 10.5438 7.99993C10.5438 6.5973 9.4027 5.45618 8.00005 5.45618Z"
                          fill="currentColor"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="16" height="16" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>

                  <span className="pt-[5px]">Sales Counts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid  gap-8 grid-cols-1">
          <div className="flex flex-col m-4">
            <div className="mt-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectAuditHome
