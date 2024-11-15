import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useParams } from '@redwoodjs/router'
import { InputAdornment, TextField as MuiTextField } from '@mui/material'
import Loader from 'src/components/Loader/Loader'
import { TextField } from 'src/util/formFields/TextField'
import { TextAreaField } from 'src/util/formFields/TextAreaField'
import { createBlock, updateBlock } from 'src/context/dbQueryFirebase'
import { CheckIcon } from '@heroicons/react/outline'

const AddBlockForm = ({ title, dialogOpen, data }) => {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { uid } = useParams()

  const onSubmit = async (formData, resetForm) => {
    console.log('it is ==>', data, data?.projectId)
    const updatedData = {
      ...formData,
      projectId:  uid || data?.phase?.projectId,
      phaseId: data?.phase?.uid,
      editMode: true,
    }
    setLoading(true)
    if (data?.block?.editMode) {
      await updateBlock(
        data?.block?.uid,
        {
          ...formData,
          editMode: true,
        },
        enqueueSnackbar
      )
    } else {
      await createBlock(updatedData, enqueueSnackbar, resetForm)
    }
    setLoading(false)
  }

  const initialState = {
    blockName: data?.block?.blockName || '',
    floors: data?.block?.floors || 0,
    units: data?.block?.units || 0,
    totalArea: data?.block?.totalArea || 0,
    remarks: data?.block?.remarks || '',
  }

  const createProjectSchema = Yup.object({
    blockName: Yup.string()
      .max(30, 'Must be 30 characters or less')
      .required('Required'),
  })
  return (
    <div className="h-full flex flex-col  rounded bg-white shadow-xl overflow-y-scroll">
      <div className="grid  gap-8 grid-cols-1">
        <div className="flex flex-col m-4">
          <div className="mt-0">
            <Formik
              initialValues={initialState}
              validationSchema={createProjectSchema}
              onSubmit={(values, { resetForm }) => {
                onSubmit(values, resetForm)
              }}
            >
              {(formik) => (
                <Form>
                  <div className="form">
                    <div className="flex flex-col mt-2 rounded-lg bg-white  ">
                      <div className="min-w-[96px]">
                        <TextField
                          label="Block Name*"
                          name="blockName"
                          type="text"
                        />
                      </div>
                      <div className=" flex justify-end mt-4 ">
                        {/* <button
                          onClick={() => dialogOpen(false)}
                          type="button"
                          className="mb-4  mt-5 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                        >
                          {' '}
                          Cancel{' '}
                        </button> */}
                        <button
                          className="flex items-center px-4 py-2 bg-green-400 text-white text-sm shadow-sm font-medium rounded-lg hover:bg-green-500 disabled:opacity-50 "
                          type="submit"
                          disabled={loading}
                        >
                          {loading && <Loader />}
                          <div className="align-center">
                            {' '}
                            {data?.block?.editMode ? (
                              'Update'
                            ) : (
                              <section className="flex  flex-row font-medium">
                                {' '}
                                <CheckIcon className="w-5 h-5   mr-2 " />
                                <span>Save</span>
                              </section>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBlockForm
