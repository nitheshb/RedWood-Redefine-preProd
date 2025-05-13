import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  addNotificationSupabase,
  getAllProjects,
  getWbNotifyTemplate,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { sendWhatAppTextSms1 } from 'src/util/axiosWhatAppApi'
import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'

const WhatsAppTextQuillForm = ({ wbPayload }) => {
  const { user } = useAuth()
  const { orgId, access } = user
  const { enqueueSnackbar } = useSnackbar()
  const [richText, setRichText] = useState(null)
  const [editorState, setEditorState] = useState('')
  const [testPhNo, setTestPhNo] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [projNam, setProjNam] = useState('')
  const [saleExecutiveNam, setSaleExecutive] = useState('')
  const [projBroucherLink, setProjBroucherLink] = useState('')
  const [projContactNo, setProjContactNo] = useState('')
  const [projLocLink, setProjLocLink] = useState('')
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allProjects',
  })
  const [projectList, setprojectList] = useState([])

  useEffect(() => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.uid
        })
        console.log('fetched projects list is', projectsListA)
        setprojectList(projectsListA)
      },
      (error) => setprojectList([])
    )

    return
  }, [])

  useEffect(() => {
    const { label, value } = selProjectIs
    console.log(
      'sel poroject details are',
      selProjectIs,
      value === 'allProjects',
      value
    )

    if (value === 'allProjects') {
      setProjNam('')
    } else {
      setProjNam(label)
    }

    fetchDbValue()
  }, [selProjectIs])

  useEffect(() => {
    console.log('retrieve this value ', wbPayload)
    fetchDbValue()
  }, [])

  const fetchDbValue = async () => {
    wbPayload.scope = [selProjectIs.value, 'allProjects']
    console.log('scope is ', wbPayload.scope)
    const data = await getWbNotifyTemplate(wbPayload)

    if (data.length > 0) {
      console.log('check it ', data)
      // data.id ==
      const x = data.filter((data) => {
        // return data
        return data.scope === selProjectIs.value
      })
      setEditorState(x[0].template)
    }
    await console.log('fetched fields are ', data)
  }

  const checkIt = () => {
    // save it in db

    const x = wbPayload
    x.scope = selProjectIs.value
    x.template = editorState

    addNotificationSupabase(x, enqueueSnackbar)
  }

  const phKeyFieldFun = (e) => {
    setTestPhNo(e.target.value)
  }
  const projFieldFun = (e) => {
    setProjNam(e.target.value)
  }
  const saleExecutiveFun = (e) => {
    setSaleExecutive(e.target.value)
  }

  const customerNameFun = (e) => {
    setCustomerName(e.target.value)
  }
  const whatsAppTesting = () => {
    const variableRegex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g
    const replacedText = editorState.replace(
      variableRegex,
      (match, variableName) => {
        if (variableName === 'PROJECT_NAME') {
          return projNam
        } else if (variableName === 'CUSTOMER_NAME') {
          return customerName
        } else if (variableName === 'EXECUTIVE_NAME') {
          return saleExecutiveNam
        } else if (variableName === 'PROJECT_BROUCHER_LINK') {
          return projBroucherLink
        } else if (variableName === 'PROJECT_LOCATOIN_LINK') {
          return projLocLink
        } else if (variableName === 'PROJECT_CONTACT_NO') {
          return projContactNo
        } else {
          return match
        }
      }
    )
    console.log('data is ', replacedText)

    const formatMapping = {
      '<strong>': '*',
      '</strong>': '*',
      '<em>': '_',
      '</em>': '_',
      '<u>': '',
      '</u>': '',
      '<s>': '~~',
      '</s>': '~~',
      '<br>': '\n',
      '<div>': '',
      '</div>': '\n',
      '<p>': '',
      '</p>': '\n',
      '<ul>': '',
      '</ul>': '\n',
      '<li>': '- ',
      '</li>': '\n',
    }
    let plainText = replacedText
    for (const tag in formatMapping) {
      plainText = plainText.split(tag).join(formatMapping[tag])
    }
    console.log(plainText)
    sendWhatAppTextSms1(`${testPhNo}`, `${plainText}`)
  }

  return (
    <div className="h-full flex flex-col pt-6 bg-white shadow-xl">
      <section className="flex flex-row ml-4">
        <div className=" flex flex-col  mr-5 w-40">
          <SlimSelectBox
            name="project"
            label=""
            className="input "
            onChange={(value) => {
              console.log('zoro condition changed one  is', value)
              setSelProject(value)
              // formik.setFieldValue('project', value.value)
            }}
            value={selProjectIs?.value}
            // options={aquaticCreatures}
            options={[
              ...[{ label: 'All Projects', value: 'allProjects' }],
              ...projectList,
            ]}
          />
        </div>
      </section>
      <span className="text-gray-600 text-xs mt-3 ml-4 mb-3">
        Filling below fields & see these values will be replaced in testing
        message
      </span>
      <section className="flex flex-row">
        <span className="text-gray-300 text-xs mt-3 ml-2 ml-4 bg-gray-50 border border-gray-300 border-solid box-border w-[200px] rounded-md flex">
          <input
            type="text"
            id="tstPhKey"
            placeholder="Enter Target WhatsApp No..."
            onChange={phKeyFieldFun}
            autoComplete="on"
            // value={customerName}
            className=" ml-3 w-[200px] bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900  relative"
          />
        </span>
        <span className="text-gray-300 text-xs mt-3 ml-2 ml-4 bg-gray-50 border border-gray-300 border-solid box-border w-[200px] rounded-md flex">
          <input
            type="text"
            id="tstPhKey"
            placeholder="{{CUSTOMER_NAME}}"
            onChange={customerNameFun}
            autoComplete="on"
            value={customerName}
            className=" ml-3 w-[200px] bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900  relative"
          />
        </span>
      </section>
      <section className="flex flex-row">
        <span className="text-gray-300 text-xs mt-3 ml-2 ml-4 bg-gray-50 border border-gray-300 border-solid box-border w-[200px] rounded-md flex">
          <input
            type="text"
            id="tstPhKey"
            placeholder="{{PROJECT_NAME}}"
            onChange={projFieldFun}
            autoComplete="on"
            value={projNam}
            className=" ml-3 w-[200px] bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900  relative"
          />
        </span>

        <span className="text-gray-300 text-xs mt-3 ml-4 bg-gray-50 border border-gray-300 border-solid box-border w-[200px] rounded-md flex">
          <input
            type="text"
            id="tstPhKey"
            placeholder="{{EXECUTIVE_NAME}}"
            onChange={saleExecutiveFun}
            autoComplete="on"
            value={saleExecutiveNam}
            className=" ml-3 w-[200px] bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900  relative"
          />
        </span>
      </section>
      <section className="flex flex-row">
        <span className="text-gray-300 text-xs mt-3 ml-2 ml-4 bg-gray-50 border border-gray-300 border-solid box-border w-[200px] rounded-md flex">
          <input
            type="text"
            id="tstPhKey"
            placeholder="{{PROJECT_BROUCHER_LINK}}"
            onChange={(e) => setProjBroucherLink(e.target.value)}
            autoComplete="on"
            value={projBroucherLink}
            className=" ml-3 w-[200px] bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900  relative"
          />
        </span>

        <span className="text-gray-300 text-xs mt-3 ml-4 bg-gray-50 border border-gray-300 border-solid box-border w-[200px] rounded-md flex">
          <input
            type="text"
            id="tstPhKey"
            placeholder="{{PROJECT_LOCATOIN_LINK}}"
            onChange={(e) => setProjLocLink(e.target.value)}
            autoComplete="on"
            value={projLocLink}
            className=" ml-3 w-[200px] bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900  relative"
          />
        </span>
      </section>
      <section className="flex flex-row">
        <span className="text-gray-300 text-xs mt-3 ml-2 ml-4 bg-gray-50 border border-gray-300 border-solid box-border w-[200px] rounded-md flex">
          <input
            type="text"
            id="tstPhKey"
            placeholder="{{PROJECT_CONTACT_NO}}"
            onChange={(e) => setProjContactNo(e.target.value)}
            autoComplete="on"
            value={projContactNo}
            className=" ml-3 w-[200px] bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none text-sm leading-7 text-gray-900  relative"
          />
        </span>
      </section>
      <section className="bg-teal-50 mt-2 h-[400px]  rounded-md">
        <ReactQuill
          theme="snow"
          value={editorState}
          onChange={setEditorState}
        />
      </section>

      <div className="sticky bottom-0 bg-white p-4 shadow-lg z-10">
        <div className="flex justify-end space-x-3">
          <button
            className="mb-2 md:mb-0 bg-green-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500"
            onClick={() => checkIt()}
          >
            Save
          </button>
          <button
            className="mb-2 md:mb-0 bg-green-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500"
            onClick={() => whatsAppTesting()}
          >
            Test
          </button>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppTextQuillForm
