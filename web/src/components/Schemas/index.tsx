import * as Yup from 'yup'

export const validate_capturePayment = Yup.object({
  payReason: Yup.string().required('Payment reason required'),
  bank_ref_no: Yup.string().required('Ref number is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be a positive number')
    .integer('Amount must be an integer'),
  towardsBankDocId: Yup.string().required('Paid Towards Account is required '),
})

export const validate_captureWalletPayment = Yup.object({
  payReason: Yup.string().required('Payment reason required'),
  bank_ref_no: Yup.string().required('Ref number is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be a positive number')
    .integer('Amount must be an integer'),
})

export const validate_AddUnit = Yup.object({
  unit_no: Yup.string().required('Unit no. is required'),
  area: Yup.number()
    .required('Area is required')
    .typeError('Area must be a valid number')
    .positive('Area must be a positive number'),
  sqft_rate: Yup.number()
    .required('Rate per Sqft is required')
    .typeError('Rate per sqft must be a valid number')
    .positive('Rate per sqft must be a positive number'),
  plc_per_sqft: Yup.number()
    .moreThan(-1, 'Value must be greater than or equal to 0')
    .required('Plc per sqft is required')
    .typeError('Plc per sqft must be a valid number'),
  facing: Yup.string().required('Facing is required field'),
  status: Yup.string().required('Status is required field'),
  release_status: Yup.string().required('Release status is required field'),
  mortgage_type: Yup.string().required('Mortage Type is required field'),
  construct_area: Yup.string().required('BUA Sqft Type is required field'),
  construct_price_sqft: Yup.string().required(
    'Price Sqft Type is required field'
  ),
})
