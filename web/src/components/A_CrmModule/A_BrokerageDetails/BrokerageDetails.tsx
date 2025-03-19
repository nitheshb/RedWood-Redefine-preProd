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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-medium text-[#000000]">
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
                        <label className="block text-sm font-medium text-[#6A6A6A]">
                          Broker Name
                        </label>
                        <TextField2
                          name="brokerName"
                          type="text"
                           className="mt-1 block w-full border-0 border-b border-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
                        />
                      </div>









                      <div>
                        <label className="block text-sm font-medium text-[#6A6A6A]">
                          Brokerage Type
                        </label>
                        <select
                          name="brokerageType"
                        //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        className="mt-1.5 block w-full border-0 border-b border-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm"

                          onChange={(e) =>
                            formik.setFieldValue('brokerageType', e.target.value)
                          }
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-[#6A6A6A]">
                          Brokerage Amount
                        </label>
                        <TextField2
                          name="brokerageAmount"
                          type="number"
                        //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        className="mt-1 block w-full border-0 border-b border-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6A6A6A]">
                          Transaction Date
                        </label>
                        <CustomDatePicker
                          selected={formik.values.transactionDate}
                          onChange={(date) => {
                            formik.setFieldValue('transactionDate', date.getTime());
                          }}
                        //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        className="mt-1 block w-full border-0 border-b border-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
                          dateFormat="MMM dd, yyyy"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#E3BDFF] hover:bg-[#E3BDFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
                <h2 className="text-xl font-medium text-[#000000]  mb-4">
                  No Brokerage Details Found
                </h2>
                <p className="text-sm text-[#6A6A6A]">
                  No brokerage details have been added yet. Use the form above to add details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerageDetails;