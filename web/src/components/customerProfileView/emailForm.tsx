import React, { useState } from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { useFormik } from 'formik'
const EmailForm = () => {
  const [uploadFile, setUploadFile] = useState()
  const formik = useFormik({
    initialValues: {
      fromEmail: '',
      toEmail: '',
      subject: '',
      message: '',
      attachFile: '',
    },

    onSubmit: (values) => {
      console.log('Email Form Data', values, null, 5)
    },
  })



  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="w-[100%] flex flex-col gap-4  pt-0 my-10 mt-[10px] rounded bg-[#FFFFFF] mx-2">
        {/* from */}
        <div className=" flex  border-b-[1.5px] border-gray-300 flex-row gap-4">
          <label className="text-gray-400">From:</label>
          <input
            name="fromEmail"
            id="fromEmail"
            value={formik.values.fromEmail}
            onChange={formik.handleChange}
            className=" w-full bg-transparent text-black border-transparent focus:outline-none focus:ring-0 focus:border-transparent "
          />
        </div>
        {/* to input  */}
        <div className="border-b-[1.5px] border-gray-300 flex    flex-row gap-4">
          <label className="text-gray-400">To:</label>
          <input
            id="toEmail"
            name="toEmail"
            value={formik.values.toEmail}
            onChange={formik.handleChange}
            className="w-full bg-transparent border-transparent focus:outline-none focus:ring-0 focus:border-transparent "
          />
        </div>
        {/* subject input  */}
        <div className="border-b-[1.5px] border-gray-300 flex   flex-row gap-4">
          <label className="text-gray-400">Subject:</label>
          <input
            id="subject"
            name="subject"
            value={formik.values.subject}
            onChange={formik.handleChange}
            className="w-full bg-transparent border-transparent focus:outline-none focus:ring-0 focus:border-transparent "
          />
        </div>
        {/* body */}
        <div className="border-b-[1.5px] border-gray-300 flex    flex-row gap-4">
          <textarea
            id="message"
            name="message"
            placeholder="Type your mail here"
            value={formik.values.message}
            onChange={formik.handleChange}
            className="w-full bg-transparent border-transparent focus:outline-none focus:ring-0 focus:border-transparent "
          />
        </div>
        {/* submit and file upload */}
        <div className="flex  flex-row justify-between">
          <span className="flex flex-row">
            <label className=" cursor-pointer  " htmlFor="attachFile">
              <FileUploadIcon />{' '}
            </label>
            <input
              id="attachFile"
              name="attachFile"
              type="file"
              value={formik.values.attachFile}
              onChange={formik.handleChange}
              className="w-full hidden bg-transparent border-transparent focus:outline-none focus:ring-0 focus:border-transparent "
            />
            <p>{formik.values.attachFile}</p>
          </span>
          <span>
            <button
              type="submit"
              className="w-[4rem] h-[36px] mt-2 rounded-lg text-sm font-medium text-black bg-[#7bd2ea] hover:bg-gray-700 hover:text-white flex items-center justify-center"
            >
              Send 
            </button>

          </span>
        </div>
      </div>
    </form>
  )
}

export default EmailForm
