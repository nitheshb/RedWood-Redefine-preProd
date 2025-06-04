import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CheckCircle, Phone, Search } from 'lucide-react';
import { addLead, addSiteVisitEntry, checkIfLeadAlreadyExists, getMyProjects, steamUsersListByRole, steamUsersListCpAgents, steamUsersListCpManagers, updateLeadData } from 'src/context/dbQueryFirebase';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes } from 'date-fns'
import { useAuth } from 'src/context/firebase-auth-context';
import { CustomSelect } from 'src/util/formFields/selectBoxField';
import ConstructHomeList from 'src/components/A_ProjModule/ConstructHomeList';
import { arrayUnion, Timestamp } from 'firebase/firestore';
import { sv } from 'date-fns/locale';
import { sourceListItems } from 'src/constants/projects';

export default function SiteVisitRegisterForm() {
  const { user } = useAuth()
  const { orgId } = user
  const [step, setStep] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [usersList, setusersList] = useState([])
  const [cpSourcingManagerA, setCpSourcingManagerA] = useState([])

  const [projectList, setprojectList] = useState([])
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [cPUsersList, setCPUsersList] = useState([])
  const [selCPUser, setSelCPUser] = useState([])

  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA)

        setusersList(usersListA)
      },
      (error) => setusersList([])
    )

    return
  }, [])
  useEffect(() => {
    const unsubscribe1 = steamUsersListCpAgents(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })

        setCPUsersList(usersListA)
      },
      (error) => setCPUsersList([])
    )

    return



  }, [])
  useEffect(() => {
    const unsubscribe1 = steamUsersListCpManagers(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        setCpSourcingManagerA(usersListA)
      },
      (error) => setCpSourcingManagerA([])
    )
    return
  }, [])
  useEffect(() => {
    const unsubscribe = getMyProjects(
      orgId,
      { projAccessA: '' },
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })

        setprojectList(projectsListA)

      },
      (error) => {
        console.log('error at bro', error)
        setprojectList([])
      }
    )

    return
  }, [])

  const [formData, setFormData] = useState({
    // Search leads
    searchPhone: '',
    title: 'Mr', // default value
    // Personal details
    firstName: '',
    // lastName: '',
    email: '',
    mobile: '',
    secondaryPhone: '',
    // Property requirements
    propertyType: '',
    budget: '',
    // location: '',
    address: '',
    SourceCat: '',
    Source: '',
    pincode: '',
    customerdesignation: '',
    purposeofPurchase: '',
    bedrooms: '',
    // additionalRequirements: '',
    customercompany: '',
    siteVistRemarks: '',
    cpName: '',
    projectName: '',
    projectUnitNumber: '',
    referralLeadName: '',
    // Office use only
    // assignedAgent: '',
    // priorityLevel: 'Medium',
    notes: '',
    // referenceNumber: '',
    svAttendedBy: '',
    svHappendOn: '',
    svSchBy: '',
    svCPsourceManager: '',
    // referenceName: '',
    svAttendedByObj: {},
    svSchByObj: {},
    svCPsourceManagerObj: {}


  });

  // Validation schemas for each step
  const personalDetailsSchema = Yup.object({
    // title: Yup.string().required('This field is required.'),
    firstName: Yup.string().required('This field is required.'),
    // lastName: Yup.string().required('Last name is required'),
    // email: Yup.string().email('Invalid email ').required('Email is required'),
    phone: Yup.string().required('This field is required.'),
  });

  const propertyRequirementsSchema = Yup.object({
    // propertyType: Yup.string().required('Property type is required'),
    budget: Yup.string().required('This field is required.'),
    // address: Yup.string().required('Address is required'),
    pincode: Yup.string().required('This field is required.'),
    // siteVistRemarks: Yup.string().required('This Is required'),
    purposeofPurchase: Yup.string().required('This field is required.'),
    customerdesignation: Yup.string().required('This field is required.'),
    // bedrooms: Yup.string().required('Property configuration is required'),
    customercompany: Yup.string().required('This field is required.'),
    // Source: Yup.string().required('This is required'),
    // projectUnitNumber: Yup.string().required('This is required'),
    // projectName: Yup.string().required('This is required'),
    // cpName: Yup.string().required('This is required'),
    // subSource: Yup.string().required('This is required'),
    // referenceName: Yup.string().required('this is required'),
  });

  const officeUseSchema = Yup.object({
    // assignedAgent: Yup.string().required('Assigned agent is required'),
    // priorityLevel: Yup.string().required('Priority level is required'),
    // referenceNumber: Yup.string().required('Reference number is required'),
    svAttendedBy: Yup.string().required('This field is required.'),
    svSchBy: Yup.string().required('This field is required.'),
    svHappendOn: Yup.string().required('This field is required.'),
  });

  // Get the current validation schema based on the step
  const getValidationSchema = () => {
    switch (step) {
      case 1:
        return personalDetailsSchema;
      case 2:
        return propertyRequirementsSchema;
      case 3:
        return officeUseSchema;
      default:
        return Yup.object({});
    }
  };



  const searchLeads = async (phoneNumber) => {
    setIsSearching(true);
    const foundLeads = await checkIfLeadAlreadyExists(
      `${orgId}_leads`,
      phoneNumber,
      'NA'
    );

    if (foundLeads?.length > 0) {
      toast.success('Lead exists!');
      setSearchResults(foundLeads);
    } else {

      setSelectedLead(null);

      setFormData({
        ...formData,
        mobile: phoneNumber,
        searchPhone: phoneNumber
      });
      setSearchResults([]);
      toast('No lead found - will create new one');
    }
    setIsSearching(false);
  };


  const selectLead = (lead) => {
    setSelectedLead(lead);
    console.log('Selected lead is', lead);


    setFormData({
      ...formData,
      title: lead.title || '',
      firstName: lead.Name || '',
      // lastName: lead.lastName || '',
      email: lead.Email || '',
      mobile: lead.Mobile || '',
      secondaryPhone: lead.secondaryPhone || '',
      cpName: lead.cpName || '',
      projectName: lead.projectName || '',
      projectUnitNumber: lead.projectUnitNumber || '',
      referralLeadName: lead.referralLeadName || '',
      propertyType: lead.propertyType || '',
      budget: lead.budget || '',
      SourceCat: lead.SourceCat || '',
      Source: lead.Source || '',
      // location: lead.location || '',
      address: lead.address || '',
      pincode: lead.pincode || '',
      siteVistRemarks: lead.siteVistRemarks || '',
      // referenceName: lead.referenceName || '',
      purposeofPurchase: lead.purposeofPurchase || '',
      customerdesignation: lead.customerdesignation || '',
      // bedrooms: lead.bedrooms || '',
      bedrooms: lead.bedrooms || '',
      // additionalRequirements: lead.additionalRequirements || '',
      // assignedAgent: lead.assignedAgent || '',
      // priorityLevel: lead.priorityLevel || 'Medium',
      notes: lead.notes || '',
      // referenceNumber: lead.referenceNumber || '',
      svSchBy: lead.svSchBy || lead.assignedTo || '',
      svAttendedBy: lead.svAttendedBy || lead.assignedToObj || '',
      customercompany: lead.customercompany || '',
      svAttendedByObj: lead.svAttendedByObj || {},
      svSchByObj: lead.svSchByObj || {},
      svCPsourceManagerObj: lead?.svCPsourceManagerObj || {},
      svCPsourceManager: lead?.svCPsourceManager || '',
      svHappendOn: lead.svHappendOn || '',
    });
  };


  const nextStep = (values) => {
    setFormData({ ...formData, ...values });
    setStep(step + 1);
  };

  const prevStep = (values) => {
    setFormData({ ...formData, ...values });
    setStep(step - 1);
  };







  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const finalData = { ...formData, ...values };
    setFormData(finalData);

    try {
      let newData = {
        ...finalData,
        ...selProjectIs,
        ...selCPUser,
      };

      let siteVisitDoc = await addSiteVisitEntry(orgId, newData, user);
      newData.svId = siteVisitDoc.id;

      let x = {
        siteVisitA: arrayUnion(siteVisitDoc.id),
        svSchBy: newData.svSchBy,
        svSchByObj: newData.svSchByObj,
        svAttendedBy: newData.svAttendedBy,
        svHappendOn: newData.svHappendOn,
        svCPsourceManagerObj: newData.svCPsourceManagerObj || {},
        svCPsourceManager: newData.svCPsourceManager || '',
        coveredA: arrayUnion('visitdone'),
        VisitDoneNotes: newData.siteVistRemarks,
      };

      if (selectedLead?.id) {
        await updateLeadData(orgId, selectedLead.id, x, user?.email);
      } else {

        const newLeadData = {
          Mobile: newData?.mobile || values?.searchPhone,
          Name: newData?.firstName,
          Email: newData?.email,
          Status: 'new',
          intype: 'sitevisit',
          Date: Timestamp.now().toMillis(),
          by: user?.email,
          Project: newData?.projectName,
          ProjectId: selProjectIs?.value === 'allprojects' ? '' : selProjectIs?.value,
          assignedTo: newData?.svAttendedByObj?.value || user?.uid,
          assignedToObj: newData?.svAttendedByObj,
          SourceCat: newData?.SourceCat,
          Source: newData?.Source,
          cpName: newData?.cpName,
          title: newData?.title,
          secondaryPhone: newData?.secondaryPhone,
          propertyType: newData?.propertyType,
          budget: newData?.budget,
          bedrooms: newData?.bedrooms,
          address: newData?.address,
          pincode: newData?.pincode,
          customercompany: newData?.customercompany,
          customerdesignation: newData?.customerdesignation,
          purposeofPurchase: newData?.purposeofPurchase,
          ...x
        };

        const createdLead = await addLead(orgId, newLeadData, user?.email, 'New Lead from Site Visit');


        await updateLeadData(orgId, createdLead.id, x, user?.email);
      }


      resetForm({
        values: {

          searchPhone: '',
          title: 'Mr',
          firstName: '',
          email: '',
          mobile: '',
          secondaryPhone: '',
          propertyType: '',
          budget: '',
          address: '',
          Source: '',
          SourceCat: '',
          pincode: '',
          customerdesignation: '',
          purposeofPurchase: '',
          bedrooms: '',
          customercompany: '',
          siteVistRemarks: '',
          cpName: '',
          projectName: '',
          projectUnitNumber: '',
          referralLeadName: '',
          notes: '',
          svAttendedBy: '',
          svHappendOn: '',
          svSchBy: '',
          svCPsourceManager: '',
          svAttendedByObj: {},
          svSchByObj: {},
          svCPsourceManagerObj: {}
        }
      });

      resetForm();
      setStep(0);
      setSearchResults([]);
      setSelectedLead(null);
      setSelProject({
        label: 'All Projects',
        value: 'allprojects',
      });
      setSelCPUser([]);

      toast.success('Site visit registered successfully!');

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to register site visit. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectLeadFun = (leadPayload)=> {
    if(selectedLead && selectedLead.id === leadPayload.id){
    selectLead({})
    }else{
    selectLead(leadPayload)

    }
  }





  return (
    <div className="max-w-4xl  p-6 bg-white rounded-b-lg shadow-lg min-w-[626px]">
      {/* Progress steps */}

      <div className="mb-8">
        <div className="flex justify-between">

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 0 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              <Search className="w-5 h-5" />
            </div>
            <div className="text-xs mt-1">Search Leads</div>
          </div>

          <div className={`flex-1 h-1 mx-2 mt-[16px] ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              {step > 1 ? <CheckCircle className="w-6 h-6" /> : 1}
            </div>
            <div className="text-xs mt-1">Personal Details</div>
          </div>

          <div className={`flex-1 h-1 mt-[16px]  mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              {step > 2 ? <CheckCircle className="w-6 h-6" /> : 2}
            </div>
            <div className="text-xs mt-1">Property Requirements</div>
          </div>

          <div className={`flex-1 h-1 mt-[16px]  mx-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 3 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              3
            </div>
            <div className="text-xs mt-1">Office Use Only</div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={formData}
        // validationSchema={getValidationSchema()}
        enableReinitialize={true}
        onSubmit={(values, formikHelpers) => {
          // const { resetForm } = formikHelpers;

          // if (step === 3) {
          //   handleSubmit(values);
          // } else {
          //   nextStep(values);
          // }
          console.log('iam at step ', step)
          if (step === 0) {
            nextStep(values);
          } else if (step === 3) {
            handleSubmit(values, formikHelpers);
          } else {
            nextStep(values);
          }
        }}
      >
        {({ values, isSubmitting, isValid, handleSubmit, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Step 0: Search Leads */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Search Existing Leads</h2>

                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label htmlFor="searchPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex">
                      <Field
                        type="tel"
                        id="searchPhone"
                        name="searchPhone"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md"
                        placeholder="Enter phone number to search"
                      />
                      <button
                        type="button"
                        onClick={() => searchLeads(values.searchPhone)}
                        disabled={isSearching || !values.searchPhone}
                        className={`flex items-center justify-center px-4 py-2 ${values.searchPhone ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300'} text-white rounded-r-md`}
                      >
                        <Search className="w-4 h-4 mr-1" />
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                {isSearching && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
                    <p className="mt-2 text-gray-600">Searching for leads...</p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="mt-4">
                    <section className='flex flex-row justify-between '>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Search Results ({searchResults.length})
                    </h3>
                    <span className="text-sm font-medium text-gray-700 mb-2" onClick={()=> {
                      selectLead({})
                    }}>
                      Clear slection ({selectedLead?.id?.length>0? 1: 0})
                    </span>
                    </section>
                    <div className="border rounded-md divide-y">
                      {searchResults.map(lead => (
                        <div
                          key={lead.id}
                          className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 ${selectedLead && selectedLead.id === lead.id ? 'bg-blue-50' : ''}`}
                          onClick={() =>
                            selectLeadFun(lead)
                            }
                        >
                          <div>
                            <div className="font-medium">{lead.Name} </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" /> {lead.Mobile}
                            </div>
                            <section className='flex flex-row'>
                            <div className="text-sm text-gray-500">{lead.Status}</div>
                            <div className="text-sm text-gray-500 ml-3">{lead.Source}</div>
                            </section>
                          </div>
                          <div>
                            <button
                              type="button"
                              className={`px-3 py-1 ${selectedLead && selectedLead.id === lead.id ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-md text-sm`}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectLeadFun(lead);
                              }}
                            >
                              {selectedLead && selectedLead.id === lead.id ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isSearching && searchResults.length === 0 && values.searchPhone && (
                  <div className="bg-yellow-50 p-4 rounded-md mt-4">
                    <p className="text-yellow-700">No leads found with this phone number. You can create a new lead.</p>
                  </div>
                )}

                <div className="flex justify-between pt-4 mt-4">
                  <div></div>
                  <button
                    type="submit"
                    className={`px-4 py-2 ${selectedLead || (values.searchPhone && searchResults.length === 0) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300'} text-white rounded-md`}
                    disabled={!selectedLead && !(values.searchPhone && searchResults.length === 0)}
                  >
                    {selectedLead ? 'Continue with Selected Lead' : 'Create New Lead'}
                  </button>
                </div>
              </div>
            )}
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>

                <div className="grid grid-cols-4 gap-4">

                  <div className="col-span-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Name</label>

                    <CustomSelect
                      name="title"
                      className="input mt-"
                      onChange={(value) => setFieldValue('title', value.value)}
                      value={values.title}
                      options={[
                        { value: 'Mr', label: 'Mr' },
                        { value: 'Mrs', label: 'Mrs' },
                        { value: 'Miss', label: 'Miss' },
                        { value: 'Ms', label: 'Ms' },
                        { value: 'Dr', label: 'Dr' }
                      ]}
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1"></label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-2 py-1.5 mt-6 border border-gray-300 rounded-md text-sm"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/*
                    <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                  </div> */}




                </div>



                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile No*:
                      </label>
                      <Field
                        type="tel"
                        id="mobile"
                        name="mobile"
                        className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                      />
                      <ErrorMessage name="mobile" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="secondaryPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Second Mobile No:
                      </label>
                      <Field
                        type="tel"
                        id="secondaryPhone"
                        name="secondaryPhone"
                        className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                      />
                      <ErrorMessage name="secondaryPhone" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                </div>


                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Mail id*:</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>

              </div>
            )}

            {/* Step 2: Property Requirements */}
            {step === 2 && (
              <div className="space-y-4">


                <h2 className="text-xl font-semibold text-gray-800">Please specify your requirements</h2>

                <div className='grid grid-cols-2 gap-4'>
                  {/* Left Column */}
                  <div>

                    {/* Project Name (moved next to Source) */}

                    <div className="mt-3">
                      <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
                      <CustomSelect
                        name="projectName"
                        className="input mt-"
                        onChange={(value) => {
                          // setFieldValue('Source', value.value);
                          // // Clear dependent fields
                          // setFieldValue('subSource', '');
                          // setFieldValue('cpName', '');
                          // setFieldValue('projectName', '');
                          // setFieldValue('projectUnitNumber', '');
                          // setFieldValue('referralLeadName', '');
                          console.log('projectName', value)
                          let x = { label: value?.label, value: value?.value, projectName: value?.label, projectId: value?.uid }
                          setSelProject(x)
                        }}
                        value={selProjectIs?.value}
                        options={projectList}
                      />
                      <ErrorMessage name="projectName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                  </div>
                  {/* Source Field */}
                  <div className="mt-3">
                    <label htmlFor="Source" className="block text-sm font-medium text-gray-700 mb-1">Source*</label>

                    <CustomSelect
                      name="SourceCat"
                      className="input mt-"
                      onChange={(value) => {
                        setFieldValue('SourceCat', value.value);
                        // Clear dependent fields
                        setFieldValue('subSource', value.Source);
                        setFieldValue('cpName', '');
                        setFieldValue('projectName', '');
                        setFieldValue('projectUnitNumber', '');
                        setFieldValue('referralLeadName', '');
                      }}
                      value={values.SourceCat}
                      options={[
                        { value: 'Referral', label: 'Referral' },
                        { value: 'Direct', label: 'Direct' },
                        { value: 'CP', label: 'CP' }
                      ]}
                    />
                    <ErrorMessage name="SourceCat" component="div" className="text-red-500 text-xs mt-1" />
                  </div>




                  {/* Direct - Sub SourceCat */}
                  {values.SourceCat === 'Direct' && (
                    <div className="">
                      <label htmlFor="Source" className="block text-sm font-medium text-gray-700 mb-1">Sub Source*</label>

                      <CustomSelect
                        name="Source"
                        className="input "
                        onChange={(value) => {
                          setFieldValue('Source', value.value);
                        }}
                        placeHolder="Select sub Source"
                        value={values.Source}
                        options={sourceListItems}
                      />

                      <ErrorMessage name="Source" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  )}

                  {/* CP - Search Field */}
                  {values.SourceCat === 'CP' && (
                    <div className="min-w-[300px]">
                      <label htmlFor="cpName" className="block text-sm font-medium text-gray-700 mb-1">Search CP Name*</label>
                      <div className="flex">
                        <CustomSelect
                          name="cpName"
                          className="input mt- w-[100%] flex"
                          onChange={(value) => {
                            console.log('cpName', value)
                            let x = { label: value?.label, value: value?.value, cpName: value?.label, cpId: value?.uid, email: value?.email, cpPh: value?.offPh }
                            setSelCPUser(value)
                          }}

                          value={selCPUser?.value}
                          options={cPUsersList}
                          placeHolder={"CP Name"}
                        />

                      </div>
                      <ErrorMessage name="cpName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  )}
                  {/* Right Column - Other Referral Fields */}
                  {(values.SourceCat === 'Referral' || !values.SourceCat) && (
                    <div className="space-y-4  ">

                      <div>
                        <label htmlFor="referralLeadName" className="block text-sm font-medium text-gray-700 mb-1">Lead Name*</label>
                        <Field
                          type="text"
                          id="referralLeadName"
                          name="referralLeadName"
                          className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                        />
                        <ErrorMessage name="referralLeadName" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className=''>
                        <label htmlFor="projectUnitNumber" className="block text-sm font-medium text-gray-700 mb-1">Project Unit Number*</label>
                        <Field
                          type="text"
                          id="projectUnitNumber"
                          name="projectUnitNumber"
                          className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                        />
                        <ErrorMessage name="projectUnitNumber" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                    </div>
                  )}
                </div>



                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className='mt-1'>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>

                      <CustomSelect
                        name="propertyType"
                        className="input mt-"
                        onChange={(value) => setFieldValue('propertyType', value.value)}
                        value={values.propertyType}
                        options={[
                          { value: '', label: 'Select property type' },
                          { value: 'House', label: 'House' },
                          { value: 'Apartment', label: 'Apartment' },
                          { value: 'Condo', label: 'Condo' },
                          { value: 'Townhouse', label: 'Townhouse' },
                          { value: 'Land', label: 'Land' },
                          { value: 'Commercial', label: 'Commercial' }
                        ]}
                      />
                      <ErrorMessage name="propertyType" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Property configuration</label>

                    <CustomSelect
                      name="bedrooms"
                      className="input mt-2"
                      onChange={(value) => {
                        setFieldValue('bedrooms', value.value);
                      }}
                      value={values.bedrooms}
                      options={[
                        { value: '', label: 'Select' },
                        { value: '1', label: '1 Bhk' },
                        { value: '2', label: '2 Bhk' },
                        { value: '3', label: '3 Bhk' },
                        { value: '4', label: '4 Bhk' },
                        // { value: '3', label: '5 Bhk' }, // Uncomment if needed
                        { value: 'studio', label: 'Studio' },
                        { value: 'penthouse', label: 'Penthouse' }
                      ]}
                    />

                    <ErrorMessage name="bedrooms" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Preferred Budget Range*:</label>

                    <CustomSelect
                      name="budget"
                      className="input mt-2"
                      onChange={(value) => {
                        setFieldValue('budget', value.value);
                      }}
                      value={values.budget}
                      options={[
                        { value: '', label: 'Select Budget' },
                        { value: 'under_1cr', label: 'Below 1cr' },
                        { value: '1cr_1.25cr', label: '1cr to 1.25cr' },
                        { value: '1.25cr_1.5cr', label: '1.25cr to 1.50cr' },
                        { value: '1.5cr_2cr', label: '1.50cr to 2cr' },
                        { value: '2cr_2.5cr', label: '2cr to 2.50cr' },
                        { value: '2.5cr_2.5cr', label: '2.50cr to 2.50cr' },  // Consider if this is a valid range
                        { value: '2.5cr_3cr', label: '2.50cr to 3cr' },
                        { value: '3cr_3.5cr', label: '3cr to 3.50cr' },
                        { value: '3.5cr_4cr', label: '3.50cr to 4cr' },
                        { value: 'above_4cr', label: '4cr and above' }
                      ]}
                      placeHolder={"Budget"}
                    />

                    <ErrorMessage name="budget" component="div" className="text-red-500 text-xs mt-1" />
                  </div>


                  <div>
                    <label htmlFor="purposeofPurchase" className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose of Purchase*:
                    </label>

                    <CustomSelect
                      name="purposeofPurchase"
                      className="input mt-2"
                      onChange={(value) => {
                        setFieldValue('purposeofPurchase', value.value);
                      }}
                      value={values.purposeofPurchase}
                      options={[
                        { value: '', label: 'Select Purpose' },
                        { value: 'self_funding', label: 'Own Use' },
                        { value: 'bank_loan', label: 'Investment' }
                      ]}
                    />

                    <ErrorMessage name="purposeofPurchase" component="div" className="text-red-500 text-xs mt-1" />
                  </div>



                </div>

                <div className="grid grid-cols-2 gap-4">



                </div>




                <div className="grid grid-cols-2 gap-4">


                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <Field
                      type="number"
                      id="pincode"
                      name="pincode"
                      className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      title="Please enter exactly 6 digits"
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        console.log('pincode entered is', e.target.value)
                        setFieldValue(
                          'pincode',
                          e.target.value
                        )
                        if (e.target.value.length == 6) {
                          fetch(
                            `https://api.postalpincode.in/pincode/${e.target.value}`
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              console.log('data is', data)
                              if (data.length > 0) {


                                setFieldValue(
                                  'city',
                                  data[0]?.PostOffice[0]?.Block
                                )
                                setFieldValue(
                                  'areaofresidence',
                                  data[0]?.PostOffice[0]?.Name
                                )


                              }
                            })
                        }
                      }}
                    />
                    <ErrorMessage name="pincode" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Field
                      type="text"
                      id="city"
                      name="city"
                      className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                    />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="areaofresidence" className="block text-sm font-medium text-gray-700 mb-1">Area of Residence</label>
                    <Field
                      type="text"
                      id="areaofresidence"
                      name="areaofresidence"
                      className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                    />
                    <ErrorMessage name="areaofresidence" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="customercompany" className="block text-sm font-medium text-gray-700 mb-1">Customer Company*:</label>
                    <Field
                      type="text"
                      id="customercompany"
                      name="customercompany"
                      className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                    />
                    <ErrorMessage name="customercompany" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="customerdesignation" className="block text-sm font-medium text-gray-700 mb-1">Customer Designation*:</label>
                    <Field
                      type="text"
                      id="customerdesignation"
                      name="customerdesignation"
                      className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                    />
                    <ErrorMessage name="customerdesignation" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div>
                  <label htmlFor="siteVistRemarks" className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <Field
                    as="textarea"
                    id="siteVistRemarks"
                    name="siteVistRemarks"
                    className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm h-24"
                    placeholder="Any special notes or comments"
                  />
                  <ErrorMessage name="siteVistRemarks" component="div" className="text-red-500 text-xs mt-1" />
                </div>


              </div>
            )}

            {/* Step 3: Office Use Only */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">To be filled by Office Staff only</h2>
                <div className="bg-yellow-50 p-3 rounded-md mb-4">
                  <p className="text-yellow-700 text-sm">This section is restricted to office staff only.</p>
                </div>




                <div>
                  <label htmlFor="svSchBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Visit Activity Scheduled by*
                  </label>

                  <CustomSelect
                    name="svSchBy"
                    placeHolder="Select Site visit by"
                    // label="Assign To"
                    className="input mt-"
                    onChange={(value) => {
                      console.log('value is ', value, user)
                      setFieldValue(
                        'svSchBy',
                        value.value
                      )
                      setFieldValue('svSchByObj', value)
                    }}
                    value={values.svSchBy}
                    options={usersList}
                  />

                  <p
                    className="text-sm text-red-500 hidden mt-3"
                    id="error"
                  >
                    Please fill out this field.
                  </p>
                  <ErrorMessage name="svSchBy" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="svAttendedBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Attended by sales manager*
                  </label>

                  <CustomSelect
                    name="svAttendedBy"
                    placeHolder="Select Attended By"
                    // label="Assign To"
                    className="input mt-"
                    onChange={(value) => {
                      console.log('value is ', value, user)
                      setFieldValue(
                        'svAttendedBy',
                        value.value
                      )
                      setFieldValue('svAttendedByObj', value)
                    }}
                    value={values.svAttendedBy}
                    options={usersList}
                  />

                  <p
                    className="text-sm text-red-500 hidden mt-3"
                    id="error"
                  >
                    Please fill out this field.
                  </p>
                  <ErrorMessage name="svAttendedBy" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {values.SourceCat === 'CP' && (
                   <div>
                  <label htmlFor="svAttendedBy" className="block text-sm font-medium text-gray-700 mb-1">
                    CP Sourcing Manager 
                  </label>

                  <CustomSelect
                    name="svAttendedBy"
                    placeHolder="Select CP POC"
                    // label="Assign To"
                    className="input mt-"
                    onChange={(value) => {
                      console.log('value is ', value, user)
                      setFieldValue(
                        'svCPsourceManager',
                        value.value
                      )
                      setFieldValue('svCPsourceManagerObj', value)
                    }}
                    value={values.svAttendedBy}
                    options={cpSourcingManagerA}
                  />

                  <p
                    className="text-sm text-red-500 hidden mt-3"
                    id="error"
                  >
                    Please fill out this field.
                  </p>
                  <ErrorMessage name="svAttendedBy" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                )
                  }
                <div>
                  <label htmlFor="svHappendOn" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Visit Date And Time*
                  </label>
                  <Field name="svHappendOn">
                    {({ field, form }) => (
                      <DatePicker
                        id="svHappendOn"
                        selected={field.value ? new Date(field.value) : null} // convert ms -> Date
                        onChange={(date) => {
                          const milliseconds = date ? date.getTime() : null;
                          setFieldValue('svHappendOn', milliseconds); // store as ms
                        }}
                        className="w-full px-2 py-1  border border-gray-300 rounded-md text-sm font-outfit font-normal text-sm leading-tight tracking-tight"
                        showTimeSelect
                        timeFormat="HH:mm"
                        placeholderText="dd/mm/yy hh:mm"
                        injectTimes={[
                          setHours(setMinutes(new Date(), 1), 0),
                          setHours(setMinutes(new Date(), 5), 12),
                          setHours(setMinutes(new Date(), 59), 23),
                        ]}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        required
                      />
                    )}
                  </Field>

                  <ErrorMessage name="svHappendOn" component="div" className="text-red-500 text-xs mt-1" />
                </div>


              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => prevStep(values)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
              )}

              {step < 3 && step > 0 ? (
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`px-4 py-2 ${isValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300'} text-white rounded-md ml-auto`}
                >
                  Next
                </button>
              ) : step === 3 ? (
                <button
                  type="submit"
                  // disabled={ !isValid}
                  disabled={!isValid || isSubmitting}
                  className={`px-4 py-2 ${isValid ? 'bg-green-500 hover:bg-green-600 cursor-pointer' : 'bg-green-300'} text-white rounded-md ml-auto`}
                >
                  {isSubmitting ? 'Submit' : 'Submit'}
                </button>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}