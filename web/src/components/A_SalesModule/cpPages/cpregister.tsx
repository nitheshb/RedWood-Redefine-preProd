import axios from 'axios'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HeadNavBar from 'src/components/HeadNavBar/HeadNavBar'
import HeadSideBar from 'src/components/HeadSideBar/HeadSideBar'
import Loader from 'src/components/Loader/Loader'
import Account from 'src/components/profile/account'
import CheckBox from 'src/components/profile/checkBox'
import PersonalDetails from 'src/components/profile/personalDetails'
import { DEPARTMENT_LIST } from 'src/constants/userRoles'
import {
  addUserLog,
  checkIfUserAlreadyExists,
  createUserToWorkReport,
  steamUsersListCpExecutive,
  updateCPUserRole,
  updateUserRole,
} from 'src/context/dbQueryFirebase'
import { PhoneNoField } from 'src/util/formFields/phNoField'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { TextField } from 'src/util/formFields/TextField'
import { phoneRegExp } from 'src/util/phoneExpression'
import * as Yup from 'yup'
const CPRegister = () => {
  let orgId = 'maahomes'
  const formMethods = useForm()
  const [formMessage, setFormMessage] = useState({
    color: 'green',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [editMode, seteditMode] = useState(false)
  const [cpSourcingManagerA, setCpSourcingManagerA] = useState([])
  useEffect(() => {
    const unsubscribe1 = steamUsersListCpExecutive(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          console.log('cp user are', user)
          user.label = user.displayName || user.name
          user.value = user.uid
        })

        setCpSourcingManagerA(usersListA)
      },
      (error) => setCpSourcingManagerA([])
    )

    return
  }, [])

  const onSubmit = async (data1) => {
    console.log('insided submit')
    setLoading(true)
    const { empId, email, myRole, deptVal, name, offPh, perPh, userStatus } =
      data1

    const data = {
      empId: empId,
      email: email,
      name: name,
      password: 'redefine@123',
      dept: 'sales',
      role: 'cp-agent',
      orgName: 'maahomes',
      orgId: 'maahomes',
      userStatus: 'active',
      orgStatus: 'active',
      offPh: offPh,
      perPh: perPh,
      svCPsourcedBy: data1?.svCPsourcedBy || '',
      svCPsourcedByObj: data1?.svCPsourcedByObj || {},
    }

    //       Invalid Arguments {\"empId\":\"102\",\"uid\":\"71wQrhV54oeWxn5Ha9E8pm93XID3\",\"email\":\"nitheshreddy.email@gmail.com\",\"offPh\":\"\",\"perPh\":\"\",\"userStatus\":\"active\",\"orgStatus\":\"active\",\"orgId\":\"spark\",\"department\":[\"admin\"],\"roles\":[\"admin\"],\"name\":\"nitheshreddy\"}"
    // payload: "{\"code\":\"invalid-argument\",\"name\":\"FirebaseError\"}"

    const config = {
      method: 'post',

      url: 'https://asia-south1-redefine-erp.cloudfunctions.net/erpAddUser',
      headers: {
        'Content-Type': 'text/plain',
      },
      data,
    }
    // url: 'https://redefine-functions.azurewebsites.net/api/Redefine_addUser?code=Ojuk8KF6kkxJMoOF4/XZf2kh8WHN5aMtOMlv0bbveJYZrCbRU1C9CA==',
    axios(config)
      .then(async function (response) {
        if (response.data) {
          setLoading(false)
          const { success, msg, payload } = await response['data']
          // const { id } = payload
          console.log('user payload is ', response)

          if (success) {
            const docDetailsIs = await checkIfUserAlreadyExists('users', email)

            console.log('docDetailsIs', docDetailsIs, docDetailsIs[0]['uid'])
            updateCPUserRole(
              empId,
              'Maa Homes',
              orgId,
              docDetailsIs[0]['uid'],
              'sales',
              'cp-agent',
              email,
              offPh,
              perPh,
              'active',
              data1?.svCPsourcedByObj || {},
              data1?.svCPsourcedBy || '',
              'nitheshreddy.email@gmail.com'
            )
            const x = {
              name,
              empId,
              email,
              uid: docDetailsIs[0]['uid'],
              userStatus: 'active',
              orgStatus: 'active',
            }
            addUserLog(orgId, {
              s: 's',
              type: 'addUser',
              subtype: 'addUser',
              txt: `${email} as ${myRole}`,
              by: 'nitheshreddy.email@gmail.com',
            })
          }
          await formMethods.reset()
          setFormMessage({
            color: success ? 'green' : 'red',
            message: success
              ? `Email ${email} is added with password redefine@123`
              : `${email} already in Use`,
          })
        }
      })
      .catch(function (error) {
        console.log('error is ', error)
        setLoading(false)
        setFormMessage({
          color: 'red',
          message: error?.msg || 'Error in creation',
        })
      })
  }
  const validate = Yup.object({
    name: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Name is required'),

    email: Yup.string().email('Email is invalid').required('Email is required'),

    offPh: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'Phone no is to short')
      .max(10, 'Phone no is to long')
      .required('Phone no is required'),
    perPh: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'Phone no is to short')
      .max(10, 'Phone no is to long'),
    // .required('Phone no is required'),

    empId: Yup.string().required('Employee Id is required'),
  })
  return (
    <div>
      <div className="flex flex-row overflow-auto h-screen text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
        {/* <HeadSideBar /> */}

        <div className="flex flex-col ml-[10%] my-[2%]">
          {' '}
          <h1 className="text-5xl text-[#2B2A35] ">CP-Registration</h1>
          <p className=" text-lg my-4 ">It’s awesome to have you with us.</p>
          {/* div for making the profile card */}
          <div className="md:flex md:flex-row md:gap-x-6 w-full ">
            {' '}
            <div className=" flex flex-col justify-between items-center h-[270px] w-[520px] rounded-md bg-gray-100">
              <img
                className="w-full relative mt-4"
                src="/Group7.png"
                alt="bg profile"
              />
              <div className=" w-32 h-32 absolute mt-4 bg-gray-400 rounded-full"></div>
              <div>
                {' '}
                <p className=" font-semibold text-2xl text-center ">
                  Maa Homes
                </p>
                <div className="">
                  <small className="font-medium  text-gray-500 mr-2 pr-2 ">
                    +91 96061 20156
                  </small>
                  <small className="font-medium  text-gray-500 ">
                    info@maahomes.in
                  </small>
                </div>
              </div>

              <p className=" mb-4 font-medium text-gary-600 "></p>
            </div>
            {/* div for making change the details  */}
            <div className="flex flex-col gap-10  w-full">
              <div className="h-full flex flex-col py-6 bg-white shadow-xl rounded-md">
                {formMessage.message && (
                  <div className=" w-full bg-[#E9F6ED] ml-9 mr-9 ">
                    <p
                      className={`text-lg text-${formMessage.color}-500 text-left px-6 my-3`}
                    >
                      {formMessage.message}
                    </p>
                  </div>
                )}
                <div className="grid gap-8 grid-cols-1 mx-10 flex flex-col">
                  <Formik
                    initialValues={{
                      name: '',
                      email: '',
                      // deptVal:  '',
                      // myRole: '',
                      empId: '',
                      perPh: '',
                      offPh: '',
                      svCPsourcedBy: '',
                      svCPsourcedByObj: {},
                      // userStatus: 'active',
                    }}
                    enableReinitialize={true}
                    validationSchema={validate}
                    onSubmit={(values) => {
                      console.log('ami submitted', values)
                      onSubmit(values)
                    }}
                  >
                    {(formik) => (
                      <div className="mt-16">
                        <Form>
                          <TextField
                            label="CP Name*"
                            name="name"
                            type="text"
                            disabled={editMode}
                            onChange={(e) => {
                              const value = e.target.value

                              const validatedValue = value.replace(
                                /[^a-zA-Z\s]/g,
                                ''
                              )
                              e.target.value = validatedValue
                              formik.setFieldValue('name', validatedValue)
                            }}
                          />
                          <TextField
                            label="Email Id*"
                            name="email"
                            type="email"
                            disabled={editMode}
                          />

                          <PhoneNoField
                            name="offPh"
                            label={
                              <span className="text-[12px] font-regular  text-gray-700">
                                Official Phone Number*
                              </span>
                            }
                            className="input  text-[13px] placeholder-gray-700 placeholder:opacity-80 "
                            value={formik.values.offPh}
                            onChange={(value) => {
                              formik.setFieldValue('offPh', value.value)
                            }}
                          />
                          {/* <TextField
                  label="Personal Phone Number*"
                  name="perPh"
                  type="text"
                  disabled={editMode}
                /> */}
                          <PhoneNoField
                            name="perPh"
                            //label="Personal Phone Number*"
                            label={
                              <span className=" font-regular  text-gray-700 text-[12px]">
                                Alternate Phone Number*=
                              </span>
                            }
                            className="input  text-[13px] placeholder-gray-700 placeholder:opacity-80 mt-2"
                            value={formik.values.perPh}
                            onChange={(value) => {
                              formik.setFieldValue('perPh', value.value)
                            }}
                          />

                          {/* <CustomSelect
                  name="deptName"
                  label="Department*"
                  className="input mt-3"
                  onChange={(value) => {
                    changed(value)
                    formik.setFieldValue('deptVal', value.value)
                    formik.setFieldValue('myRole', '')
                  }}
                  value={formik.values.deptVal}
                  options={DEPARTMENT_LIST}
                />
                {formik.errors.deptVal ? (
                  <div className="error-message text-red-700 text-xs p-2">
                    {formik.errors.deptVal}
                  </div>
                ) : null} */}
                          {/* <CustomSelect
                  name="roleName"
                  label="Role*"
                  className="input mt-3"
                  onChange={(value) =>
                    formik.setFieldValue('myRole', value.value)
                  }
                  value={formik.values.myRole || ''}
                  options={roles}
                />
                {formik.errors.myRole ? (
                  <div className="error-message text-red-700 text-xs p-2">
                    {formik.errors.myRole}
                    {formik.values.myRole}
                  </div>
                ) : null} */}

                          {/*  */}

                          {/* <CustomSelect
                  name="userStatus"
                  label="User Status"
                  className="input mt-3"
                  onChange={(value) =>
                    formik.setFieldValue('userStatus', value.value)
                  }
                  value={formik.values.userStatus || ''}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                /> */}

                          <div className="md:flex md:flex-row md:space-x-4 w-full text-xs mt-5">
                            <div className="w-full flex flex-col mb-1">
                              <TextField
                                label="RERA No*"
                                name="empId"
                                type="text"
                                disabled={editMode}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="svCPsourcedBy"
                              className="block text-xs  text-gray-700 mb-1"
                            >
                              CP Sourced By
                            </label>

                            <CustomSelect
                              name="svCPsourcedBy"
                              placeHolder="Select CP POC"
                              // label="Assign To"
                              className="input mt-"
                              onChange={(value) => {
                                console.log('value is ', value, user)
                                formik.setFieldValue(
                                  'svCPsourcedBy',
                                  value.value
                                )
                                formik.setFieldValue(
                                  'svCPsourcedByObj',
                                  value
                                )
                              }}
                              value={formik.values.svCPsourcedBy}
                              options={cpSourcingManagerA}
                            />

                            <p
                              className="text-sm text-red-500 hidden mt-3"
                              id="error"
                            >
                              Please fill out this field.
                            </p>
                          </div>
                          <p className="text-xs text-red-500 text-right my-3">
                            Required fields are marked with an asterisk{' '}
                            <abbr title="Required field">*</abbr>
                          </p>
                          <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                            <button
                              className="mb-4 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded hover:shadow-lg hover:bg-gray-100"
                              type="reset"
                            >
                              Reset
                            </button>
                            <button
                              className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white  rounded hover:shadow-lg hover:bg-green-500"
                              type="submit"
                              disabled={loading}
                            >
                              {loading && <Loader />}
                              {editMode ? 'Save' : 'Register'}
                            </button>
                          </div>
                        </Form>
                      </div>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CPRegister
