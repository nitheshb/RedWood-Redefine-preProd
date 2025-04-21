import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import Loader from 'src/components/Loader/Loader';
import { useAuth } from 'src/context/firebase-auth-context';
import CustomDatePicker from 'src/util/formFields/CustomDatePicker';
import { TextField2 } from 'src/util/formFields/TextField2';
import {
  fetchBrokerageDetails,
  updateBrokerageDetails,
} from 'src/context/dbQueryFirebase';

const BrokerageDetails = ({ selUnitDetails }) => {
  const { user } = useAuth();
  const { orgId } = user;
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [existingBrokerage, setExistingBrokerage] = useState(null);

  console.log('Selected Unit Details:', selUnitDetails);
  console.log('Existing Brokerage Details:', existingBrokerage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching brokerage details...');
        const details = await fetchBrokerageDetails(orgId, selUnitDetails?.pId, selUnitDetails?.id);
        console.log('Fetched details:', details);
        setExistingBrokerage(details);
      } catch (error) {
        console.error('Error fetching brokerage details:', error);
        enqueueSnackbar('Failed to fetch brokerage details.', { variant: 'error' });
      }
    };
    fetchData();
  }, [selUnitDetails]);

  const onSubmitFun = async (data, resetForm) => {
    setLoading(true);
    try {
      console.log('Submitting form with data:', data);
      await updateBrokerageDetails(
        orgId,
        selUnitDetails?.pId,
        selUnitDetails?.id,
        data,
        user?.email,
        enqueueSnackbar,
        resetForm
      );
      console.log('Refreshing brokerage details...');
      const updatedDetails = await fetchBrokerageDetails(orgId, selUnitDetails?.pId, selUnitDetails?.id);
      console.log('Updated details:', updatedDetails);
      setExistingBrokerage(updatedDetails);
    } catch (error) {
      console.error('Error updating brokerage details:', error);
    } finally {
      setLoading(false);
    }
  };

  const datee = new Date().getTime();
  const initialState = {
    brokerName: existingBrokerage?.brokerName || '',
    brokerageType: existingBrokerage?.brokerageType || 'percentage',
    brokerageAmount: existingBrokerage?.brokerageAmount || 0,
    transactionDate: existingBrokerage?.transactionDate || datee,
  };

  console.log('Initial form values:', initialState);

  const validate = Yup.object({
    brokerName: Yup.string().required('Broker Name is Required'),
    brokerageAmount: Yup.number()
      .required('Brokerage Amount is Required')
      .positive('Brokerage Amount must be positive'),
    transactionDate: Yup.date().required('Transaction Date is Required'),
  });

  return (



    
<div className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
  <div className="relative min-h-screen mr-6">
    {/* Background image */}
    {/* <div className="">
      <img alt="CRM Background" src="/crmfinal.svg" className="w-full h-auto" />
    </div> */}


<div className="relative z-0">



<h1 className="text-[#606062] font-outfit  mb-1  mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
Brokerage Details
  </h1>
  
  {/* Background image */}
  <img
    alt="CRM Background"
    src="/crmfinal.svg"
    className="w-full h-auto object-cover"
  />

  {/* Heading at very top of image */}

  {/* Centered 3-column grid inside image */}
  <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Eligible /Not</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
      </div>
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Payable amount</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>

      </div>
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Payable before</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>

      </div>
    </div>
  </div>
</div>



    <div className="w-full h-full flex justify-center mt-[-70px] z-10 relative">
      

    <div className="min-h-screen  mx-2 ">
      <div className=" max-w-xl	mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-[20px] font-medium text-[#000000]    mb-[2px] ">
              {existingBrokerage ? 'Edit Brokerage Details' : 'Add Brokerage Details'}
            </h1>
          </div>
          <div className="p-6">
            <Formik
              enableReinitialize={true}
              initialValues={initialState}
              validationSchema={validate}
              onSubmit={(values, { resetForm }) => onSubmitFun(values, resetForm)}
            >
              {(formik) => (
                <Form>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-[12px] mb-3 font-outfit font-medium text-[#616162]">
                          Broker Name
                        </label>
                        <TextField2
                        
                          name="brokerName"
                          type="text"
                           className="mt-1 block w-full border-0 border-b-[1.6px] border-[#E7E7E9] focus:border-[#E7E7E9] focus:ring-0 focus:outline-none sm:text-sm"
                        />
                      </div>






                      <div className='flex flex-col'>

                      <label className="block text-[12px]   font-outfit font-medium text-[#616162]  mb-1">
  Brokerage Type
</label>
<div className="flex space-x-2">
  <button
    type="button"
    onClick={() => formik.setFieldValue('brokerageType', 'percentage')}
    className={`px-6 py-1  rounded-md text-sm border ${
      formik.values.brokerageType === 'percentage'
        ? 'bg-[#E8E6FE] text-[##0E0A1F] font-medium border-[#A59EFF] border-2'
        : 'bg-white text-[#0E0A1F] font-medium border-[#0E0A1F] border-2'
    }`}
  >
    Percentage
  </button>
  <button
    type="button"
    onClick={() => formik.setFieldValue('brokerageType', 'fixed')}
    className={`px-6 py-1  rounded-md text-sm border ${
      formik.values.brokerageType === 'fixed'
        ? 'bg-[#E8E6FE] text-black font-medium border-[#A59EFF] border-2'
        : 'bg-white text-[#0E0A1F] font-medium border-[#0E0A1F] border-2'
    }`}
  >
    Fixed
  </button>
</div>

                      </div>







                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-[12px] mb-4  font-outfit font-medium text-[#616162]">
                          Brokerage Amount
                        </label>
                        <TextField2
                          name="brokerageAmount"
                          type="number"
                        //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        className="mt-1 block w-full border-0 border-b-[1.6px] border-[#E7E7E9] focus:border-[#E7E7E9] focus:ring-0 focus:outline-none sm:text-sm"
                        />
                      </div>
                      {/* <div>
                        <label className="block text-[10px] font-medium text-[#6A6A6A]">
                          Transaction Date
                        </label>
                        <CustomDatePicker
                          selected={formik.values.transactionDate}
                          
                          onChange={(date) => {
                            formik.setFieldValue('transactionDate', date.getTime());
                          }}
                        className="mt-1 block w-full border-0 border-b border-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
                          dateFormat="MMM dd, yyyy"
                        />
                      </div> */}

<div>
  <label className="block text-[12px] mb-3 font-medium text-[#616162]  font-outfit">
    Transaction Date
  </label>
  <div className="relative w-full border-0 border-b-[1.6px] border-[#E7E7E9]   focus-within:border-[#E7E7E9]">
    <CustomDatePicker
      selected={formik.values.transactionDate}
      onChange={(date) => {
        formik.setFieldValue('transactionDate', date.getTime());
      }}
      className="w-full bg-transparent outline-none text-sm"
      dateFormat="MMM dd, yyyy"
    />
  </div>
</div>

                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base   shadow-sm text-Black  bg-[#E8E6FE] px-6 py-2 mt-4 text-sm shadow-sm font-medium tracking-wider text-[#0E0A1F] hover:text-[#0E0A1F] rounded-lg hover:shadow-md hover:bg-[#DBD3FD] transition-all duration-200 focus:outline-none  flex items-center justify-center"
                      >
                        {loading ? (
                          <Loader className="w-5 h-5 mr-2" />
                        ) : (
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                        )}
                        {existingBrokerage ? 'Update Brokerage Details' : 'Add Brokerage Details'}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Display Saved Data Section */}
            {existingBrokerage ? (
              <div className="mt-10">
                <h2 className="text-xl  font-outfit font-semibold text-gray-800 mb-4">
                  Saved Brokerage Details
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Broker Name</p>
                      <p className="text-lg font-medium text-gray-900">
                        {existingBrokerage.brokerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Brokerage Type</p>
                      <p className="text-lg font-medium text-gray-900">
                        {existingBrokerage.brokerageType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Brokerage Amount</p>
                      <p className="text-lg font-medium text-gray-900">
                        {existingBrokerage.brokerageAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transaction Date</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(existingBrokerage.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-10">
                <h2 className="text-xl  font-outfit font-medium text-[#000000]  mb-4">
                  No Brokerage Details Found
                </h2>
                <p className="text-[#6A6A6A]  font-outfit font-normal  mt-2 text-[12px]">
                  No brokerage details have been added yet. Use the form above to add details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    </div>


  </div>
</div>





    




  );
};

export default BrokerageDetails;