import { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useParams } from '@redwoodjs/router'
import Loader from 'src/components/Loader/Loader'
import { TextField } from 'src/util/formFields/TextField'
import { createBlock, updateBlock } from 'src/context/dbQueryFirebase'
import { CheckIcon } from '@heroicons/react/outline'
import { useAuth } from 'src/context/firebase-auth-context'

const AddBlockForm = ({ title, dialogOpen, data }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { uid } = useParams()

  useEffect(() => {
    console.log('block data is ', data)
  }, [])
  const onSubmit = async (formData, resetForm) => {
    console.log('it is ==>', data, data?.projectId)
    const updatedData = {
      ...formData,
      projectId:  data?.phase?.projectId || data?.data?.projectId,
      uid:  data?.uid || data?.data?.uid,
      editMode: true,
    }
    setLoading(true)
    if ((data?.block?.editMode || data?.data?.editMode) && title === 'Edit Block') {
      await updateBlock(orgId,
        data?.block?.uid || data?.data?.uid,
        {
          ...formData,
          editMode: true,
        },
        enqueueSnackbar
      )
    }  else if ( title === 'Add Block') {
      await createBlock(orgId,updatedData, enqueueSnackbar, resetForm)
    }else {
      enqueueSnackbar(`Cannot Edit Block ${title} ${data?.block?.editMode || data?.data?.editMode}`, {
        variant: 'warning',
      })
    }
    setLoading(false)
  }

  const initialState = {
    blockName: data?.block?.blockName || data?.blockName ||data?.data?.blockName || '',
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
