import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CheckCircle, Phone, Search } from 'lucide-react';
import { checkIfLeadAlreadyExists } from 'src/context/dbQueryFirebase';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes } from 'date-fns'

export default function SiteVisitRegisterForm() {
  const [step, setStep] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  // Mock data for demonstration purposes
  const [existingLeads, setExistingLeads] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-123-4567',
      email: 'john.doe@example.com',
      propertyType: 'House',
      budget: '$500,000',
      location: 'Downtown',
      bedrooms: '3',
      bathrooms: '2',
      additionalRequirements: 'Needs a garage and backyard',
      assignedAgent: 'Jane Smith',
      priorityLevel: 'High',
      notes: 'Interested in quick closing',
      referenceNumber: 'REF-2025-001'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '555-987-6543',
      email: 'jane.smith@example.com'
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      phone: '555-222-3333',
      email: 'bob.johnson@example.com'
    }
  ]);

  const [formData, setFormData] = useState({
    // Search leads
    searchPhone: '',


    title: 'Mr', // default value

    // Personal details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Property requirements
    propertyType: '',
    budget: '',
    // location: '',
    address: '',
    Pincode: '',
    customerdesignation: '',
    PurposeofPurchase: '',
    bedrooms: '',
    bathrooms: '',
    additionalRequirements: '',
    customercompany: '',
    remarks: '',

    // Office use only
    // assignedAgent: '',
    // priorityLevel: 'Medium',
    notes: '',
    // referenceNumber: '',
    attendedByManager: '',
    siteVisitDateTime: '',
    scheduledBy: '',
    referenceName: '',
    
  });

  // Validation schemas for each step
  const personalDetailsSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
  });

  const propertyRequirementsSchema = Yup.object({
    propertyType: Yup.string().required('Property type is required'),
    budget: Yup.string().required('Budget is required'),
    address: Yup.string().required('Address is required'),
    Pincode: Yup.string().required('Pincode is required'),
    remarks: Yup.string().required('This Is required'),
    PurposeofPurchase: Yup.string().required('Purpose of Purchase is required'),
    customerdesignation: Yup.string().required('Customer Designation is required'),
    bathrooms: Yup.string().required('Property configuration is required'),
    customercompany: Yup.string().required('Customer Company is required'),
    referenceName: Yup.string().required('this is required'),
  });

  const officeUseSchema = Yup.object({
    // assignedAgent: Yup.string().required('Assigned agent is required'),
    // priorityLevel: Yup.string().required('Priority level is required'),
    // referenceNumber: Yup.string().required('Reference number is required'),
    attendedByManager: Yup.string().required('This required'),
    scheduledBy: Yup.string().required('This is required '),
    siteVisitDateTime: Yup.string().required('this is required'),
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
      `${'maahomes'}_leads`,
      phoneNumber,
      'NA'
    )

    if (foundLeads?.length > 0) {
      toast.success('Lead exists!',)
      setSearchResults(foundLeads);
      setIsSearching(false);
    } else {
      setIsSearching(false);
    }


  };

  const selectLead = (lead) => {
    setSelectedLead(lead);
    setFormData({
      ...formData,
      title: lead.title || '',
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      propertyType: lead.propertyType || '',
      budget: lead.budget || '',
      // location: lead.location || '',
      address: lead.address || '',
      Pincode: lead.Pincode || '',
      remarks: lead.remarks || '',
      referenceName: lead.referenceName || '',
      PurposeofPurchase: lead.PurposeofPurchase || '',
      customerdesignation: lead.customerdesignation || '',
      bedrooms: lead.bedrooms || '',
      bathrooms: lead.bathrooms || '',
      additionalRequirements: lead.additionalRequirements || '',
      // assignedAgent: lead.assignedAgent || '',
      // priorityLevel: lead.priorityLevel || 'Medium',
      notes: lead.notes || '',
      // referenceNumber: lead.referenceNumber || '',
      scheduledBy: lead.scheduledBy || '',
      attendedByManager: lead.attendedByManager || '',
      customercompany: lead.customercompany || '',
      siteVisitDateTime: lead.siteVisitDateTime || '',
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

  const handleSubmit = (values) => {
    const finalData = { ...formData, ...values };
    setFormData(finalData);
    // In a real application, you would submit the data to your backend here
    console.log('Form submitted with:', finalData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-4xl  p-6 bg-white rounded-b-lg shadow-lg min-w-[626px]">
      {/* Progress steps */}

      <div className="mb-8">
        <div className="flex items-center justify-between">

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 0 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              <Search className="w-5 h-5" />
            </div>
            <div className="text-xs mt-1">Search Leads</div>
          </div>

          <div className={`flex-1 h-1 mx-2 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              {step > 1 ? <CheckCircle className="w-6 h-6" /> : 1}
            </div>
            <div className="text-xs mt-1">Personal Details</div>
          </div>

          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              {step > 2 ? <CheckCircle className="w-6 h-6" /> : 2}
            </div>
            <div className="text-xs mt-1">Property Requirements</div>
          </div>

          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

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
        validationSchema={getValidationSchema()}
        onSubmit={(values) => {
          // if (step === 3) {
          //   handleSubmit(values);
          // } else {
          //   nextStep(values);
          // }
          if (step === 0) {
            nextStep(values);
          } else if (step === 3) {
            handleSubmit(values);
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
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Search Results ({searchResults.length})
                    </h3>
                    <div className="border rounded-md divide-y">
                      {searchResults.map(lead => (
                        <div
                          key={lead.id}
                          className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 ${selectedLead && selectedLead.id === lead.id ? 'bg-blue-50' : ''}`}
                          onClick={() => selectLead(lead)}
                        >
                          <div>
                            <div className="font-medium">{lead.Name} </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" /> {lead.Mobile}
                            </div>
                            <div className="text-sm text-gray-500">{lead.Status}</div>
                          </div>
                          <div>
                            <button
                              type="button"
                              className={`px-3 py-1 ${selectedLead && selectedLead.id === lead.id ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-md text-sm`}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectLead(lead);
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

                <div className="grid grid-cols-2 gap-4">


                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <Field
                      as="select"
                      id="title"
                      name="title"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>

                    </Field>
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                  </div>



                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            )}

            {/* Step 2: Property Requirements */}
            {step === 2 && (
              <div className="space-y-4">


                <h2 className="text-xl font-semibold text-gray-800">Please specify your requirements</h2>



                <div className="grid grid-cols-2 gap-4">


                  <div>


                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                      <Field
                        as="select"
                        id="propertyType"
                        name="propertyType"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select property type</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Condo">Condo</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Land">Land</option>
                        <option value="Commercial">Commercial</option>
                      </Field>
                      <ErrorMessage name="propertyType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>


                  </div>






                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Property configuration</label>
                    <Field
                      as="select"
                      id="bathrooms"
                      name="bathrooms"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="1">1 Bhk</option>
                      <option value="1.5">2 Bhk</option>
                      <option value="2">3 Bhk</option>
                      <option value="2.5">4 Bhk</option>
                      {/* <option value="3">5 Bhk</option> */}
                      <option value="3+">Studio</option>
                      <option value="3+">Penthouse</option>
                    </Field>
                    <ErrorMessage name="bathrooms" component="div" className="text-red-500 text-sm mt-1" />
                  </div>









                </div>








                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <Field
                      as="select"
                      id="budget"
                      name="budget"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Budget</option>
                      <option value="under_50k">Below 1cr</option>
                      <option value="50k_100k">1cr to 1.25cr</option>
                      <option value="100k_200k">1.25cr to 1.50cr</option>
                      <option value="200k_500k">1.50cr to 2cr</option>
                      <option value="500k_plus">2cr to 2.50cr</option>
                      <option value="500k_plus">2.50cr to 2.50cr</option>
                      <option value="500k_plus">2.50cr to 3cr</option>
                      <option value="500k_plus">3cr to 3.50cr</option>
                      <option value="500k_plus">3.50cr to 4cr</option>
                      <option value="500k_plus">4cr</option>
                    </Field>
                    <ErrorMessage name="budget" component="div" className="text-red-500 text-sm mt-1" />
                  </div>



                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>


                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <Field
                      as="select"
                      id="bedrooms"
                      name="bedrooms"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </Field>
                    <ErrorMessage name="bedrooms" component="div" className="text-red-500 text-sm mt-1" />
                  </div> */}


                </div>




                <div className="grid grid-cols-2 gap-4">


                  <div>
                    <label htmlFor="Pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <Field
                      type="number"
                      id="Pincode"
                      name="Pincode"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      title="Please enter exactly 6 digits"
                      inputMode="numeric"
                    />
                    <ErrorMessage name="Pincode" component="div" className="text-red-500 text-sm mt-1" />
                  </div>



                  <div>
                    <label htmlFor="customercompany" className="block text-sm font-medium text-gray-700 mb-1">Customer Company*:</label>
                    <Field
                      type="text"
                      id="customercompany"
                      name="customercompany"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="customercompany" component="div" className="text-red-500 text-sm mt-1" />
                  </div>


                </div>


                <div className="grid grid-cols-2 gap-4">


                  <div>
                    <label htmlFor="PurposeofPurchase" className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose of Purchase*:
                    </label>
                    <Field
                      as="select"
                      id="PurposeofPurchase"
                      name="PurposeofPurchase"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Purpose</option>
                      <option value="self_funding">Own Use</option>
                      <option value="bank_loan">Investment</option>
                    </Field>
                    <ErrorMessage name="PurposeofPurchase" component="div" className="text-red-500 text-sm mt-1" />
                  </div>



                  <div>
                    <label htmlFor="customerdesignation" className="block text-sm font-medium text-gray-700 mb-1">Customer Designation*:</label>
                    <Field
                      type="text"
                      id="customerdesignation"
                      name="customerdesignation"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="customerdesignation" component="div" className="text-red-500 text-sm mt-1" />
                  </div>


                </div>


                <div>
                  <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Requirements
                  </label>
                  <Field
                    as="textarea"
                    id="additionalRequirements"
                    name="additionalRequirements"
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                    placeholder="Pool, garden, garage, etc."
                  />
                </div>


                <div>
                  <label htmlFor="referenceName" className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Name
                  </label>
                  <Field
                    type="text"
                    id="referenceName"
                    name="referenceName"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Who referred this client?"
                  />
                  <ErrorMessage name="referenceName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* New Remarks field */}
                <div>
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <Field
                    as="textarea"
                    id="remarks"
                    name="remarks"
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                    placeholder="Any special notes or comments"
                  />
                  <ErrorMessage name="remarks" component="div" className="text-red-500 text-sm mt-1" />
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


                {/* <div>
                  <label htmlFor="assignedAgent" className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Agent
                  </label>
                  <Field
                    as="select"
                    id="assignedAgent"
                    name="assignedAgent"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select agent</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Williams">Sarah Williams</option>
                  </Field>
                  <ErrorMessage name="assignedAgent" component="div" className="text-red-500 text-sm mt-1" />
                </div> */}

                <div>
                  <label htmlFor="scheduledBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Visit Activity Scheduled by*
                  </label>
                  <Field
                    as="select"
                    id="scheduledBy"
                    name="scheduledBy"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select scheduler</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Williams">Sarah Williams</option>
                  </Field>
                  <ErrorMessage name="scheduledBy" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="attendedByManager" className="block text-sm font-medium text-gray-700 mb-1">
                    Attended by sales manager*
                  </label>
                  <Field
                    as="select"
                    id="attendedByManager"
                    name="attendedByManager"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select manager</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Williams">Sarah Williams</option>
                  </Field>
                  <ErrorMessage name="attendedByManager" component="div" className="text-red-500 text-sm mt-1" />
                </div>


                <div>
                  <label htmlFor="siteVisitDateTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Visit Date And Time*
                  </label>
                  <Field name="siteVisitDateTime">
                    {({ field, form }) => (
                      <DatePicker
                        id="siteVisitDateTime"
                        selected={field.value || null}
                        onChange={(date) => form.setFieldValue(field.name, date)}
                        className="w-full p-2 border border-gray-300 rounded-md font-outfit font-normal text-sm leading-tight tracking-tight"
                        showTimeSelect
                        timeFormat="HH:mm"
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
                  <ErrorMessage name="siteVisitDateTime" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="priorityLevel"
                        value="Low"
                        className="mr-2"
                      />
                      Low
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="priorityLevel"
                        value="Medium"
                        className="mr-2"
                      />
                      Medium
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="priorityLevel"
                        value="High"
                        className="mr-2"
                      />
                      High
                    </label>
                  </div>
                </div> */}

                {/* <div>
                  <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <Field
                    type="text"
                    id="referenceNumber"
                    name="referenceNumber"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="referenceNumber" component="div" className="text-red-500 text-sm mt-1" />
                </div> */}

                {/* <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Notes
                  </label>
                  <Field
                    as="textarea"
                    id="notes"
                    name="notes"
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                  />
                </div> */}


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
                  disabled={isSubmitting || !isValid}
                  className={`px-4 py-2 ${isValid ? 'bg-green-500 hover:bg-green-600' : 'bg-green-300'} text-white rounded-md ml-auto`}
                >
                  Submit
                </button>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}