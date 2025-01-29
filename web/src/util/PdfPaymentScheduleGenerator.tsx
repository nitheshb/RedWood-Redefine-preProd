import React, { useState } from 'react'
import { useMemo, useEffect } from 'react'
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'

import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'

import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import numeral from 'numeral'
import { computeTotal } from './computeCsTotals'
import { prettyDate } from './dateConverter'
import { Bold, Download } from 'lucide-react'

import pdfimg1 from '../../public/pdfimg1.png'
import pdfimg2 from '../../public/pdfimg2.png'
import pdfimg3 from '../../public/pdfimg3.png'
import pdfimg4 from '../../public/pdfimg4.png'
import pdfimg5 from '../../public/pdfimg5.png'
import pdfimg6 from '../../public/pdfimg6.png'
import pdfimg7 from '../../public/pdfimg7.png'
import pdfimg8 from '../../public/pdfimg8.png'
import pdfimg9 from '../../public/pdfimg9.png'
import pdfimg10 from '../../public/pdfimg10.png'
import pdfimg11 from '../../public/pdfimg11.png'
import pdfimg12 from '../../public/pdfimg12.png'
import Loader from 'src/components/Loader/Loader'
import { useAuth } from 'src/context/firebase-auth-context'
import { getProject } from 'src/context/dbQueryFirebase'


Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
  ],
})
const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        fitter: {
          paddingLeft: '10px',
          marginLeft: '5px',
          marginRight: '5px',
          paddingRight: '10px',
        },

        fitternew: {
          marginLeft: '20px',
          marginRight: '20px',
          marginTop: '20px',

        },



        smallFitter: {
          paddingLeft: '10px',
        },
        headFitter: {
          padding: '10px',
        },
        AllsmallFitter: {
          padding: '10px',
        },
        col4: {
          width: '33%',
          paddingLeft: '20px',
          marginLeft: '10px',
          marginRight: '10px',
          paddingRight: '20px',
        },
        col: { width: '23%' },
        col8: { width: '75%' },
        col2: { width: '13%', marginTop: '10px' },
        col6: { width: '50%' },
        p4: { padding: '4px' },
        p10: { padding: '4px 6px' },
        p11: { padding: '0px 0px' },
        p12: { paddingTop: '4px', paddingBottom: '2px' },
        pr0: { paddingRight: '0px' },
        pr4: { paddingRight: '4px' },
        pr8: { paddingRight: '8px' },
        pr9: { paddingRight: '6px' },
        mb4: { marginBottom: 4 },
        mb2: { marginBottom: 2 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        mb30: { marginBottom: 30 },
        mb20: { marginBottom: 20 },
        mb10: { marginBottom: 10 },
        mb5: { marginBottom: 5 },
        mr5: { marginRight: 10 },
        mr15: { marginRight: 15 },
        mT0: { marginTop: 0 },
        mT1: { marginTop: 10 },
        mT4: { marginTop: 40 },
        ml1: { marginLeft: 5 },
        ml2: { marginLeft: 10 },
        ml3: { marginLeft: 15 },

        mr2: { marginRight: 10, paddingRight: 10 },
        ml4: { marginLeft: 20 },
        ml5: { marginLeft: 20 },
        pl1: { paddingLeft: 5 },
        pl2: { paddingLeft: 10 },
        pl3: { paddingLeft: 15 },
        pr1: { paddingRight: 5 },
        pr2: { paddingRight: 10 },
        pr3: { paddingRight: 15 },
        pt2: { paddingTop: 4 },
        pt3: { paddingTop: 5 },
        pt5: { paddingTop: 10 },
        h3: { fontSize: 16, fontWeight: 400 },
        h4: { fontSize: 13, fontWeight: 700 },
        h1: {
          fontSize: 20,
          fontWeight: 700,
        },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 8, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        alignLeft: { textAlign: 'left' },
        alignCenter: { textAlign: 'center' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#fff',
          textTransform: 'capitalize',
          padding: '0px',
          // padding: '40px 24px 60px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        contBorder: {
          border: 0.5,
          borderStyle: 'solid',
          // borderColor: '#DFE3E8',
        },
        dashBorder: {
          borderBottom: 1,
          borderStyle: 'dashed',
          borderColor: '#DFE3E8',
        },
        table: {
          display: 'flex',
          width: 'auto',
          border: 0.5,
          borderStyle: 'solid',
        },
        tableRow: {
          // padding: '8px 0',
          flexDirection: 'row',
          // borderBottomWidth: 0.5,
          // borderStyle: 'solid',
          // borderColor: '#DFE3E8',

        },
        borderbottom: {
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        totalRow: {
          padding: '6px 0',
          marginTop: '8px',
          flexDirection: 'row',
          borderRadius: 3,
          // borderWidth: 1,
          // borderStyle: 'solid',
          // borderColor: '#DFE3E8',
          // backgroundColor: '#DFF6DD',
        },
        totalRowNew: {
          // padding: '6px 0',
          // marginTop: '8px',

          flexDirection: 'row',
          borderRadius: 1,
          // borderWidth: 1,
          // borderStyle: 'solid',
          // borderColor: '#DFE3E8',
          // backgroundColor: '#DFF6DD',
        },
        topBoderRadius: {
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        },

        topBoderRadiusnew: {
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
        },

        bottomBorderRadius: {
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
        },



        tableHeader: {
          padding: '4px 0',
          flexDirection: 'row',
          alignItems:'flex-end'


        },
        bg: {
          backgroundColor: '#F3FFF2',
          paddingHorizontal: '4px',
          paddingVertical: '8px',
        },
        bg1: {
          backgroundColor: '#fff',
          // paddingHorizontal: '20px',
        },
        bgb: {
          backgroundColor: '#fff',
          paddingHorizontal: '20px',
        },

        bg2: {
          backgroundColor: '#F3FFF2',
          padding: '8px 0',
          flexDirection: 'row',
        },
        bg3: {
          backgroundColor: '#DFF6DD',
          padding: '8px 0',
          flexDirection: 'row',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '5%',
           paddingLeft: 10,
        },
        tableCell_35: {
          width: '35%',
          // paddingRight: 16,
        },

        tableCell_200: {
          width: '20%',
          paddingRight: 3,

        },

        tableCell_20: {
          width: '20%',
          paddingRight: 10,
        },

        tableCell_2000: {
          width: '20%',
        
        },
        tableCell_2: {
          width: '50%',
          // paddingRight: 16,
        },
        tableCell_5: {
          width: '30%',
          // paddingRight: 16,
        },
        tableCell_4: {
          width: '53%',
          paddingRight: 8,
          marginRight: 2,
        },
        tableCell_3: {
          width: '15%',
          paddingRight: 16,
        },
        cellBg0: {
          backgroundColor: '#fffaee',
        },
        cellBg1: {
          backgroundColor: '#f8f2e2',
        },
        cellBg2: {
          backgroundColor: '#f8efd2',
        },
        cellBg3: {
          backgroundColor: '#f6e8c2',
        },
        cellBgHead: {
          backgroundColor: '#EDEDED',
        },
        textcolor:{
          color: '#6A6A6A',
        },
        textcolorhead:{
          color: '#3D3D3D',
        },

        blockborder:{
          border: '1px solid 6A6A6A'
        },
        switchContainer: {
          padding: 4,
          alignItems: 'center',
          justifyContent: 'center'
        },
        switchText: {
          fontSize: 9,
          fontWeight: 'medium'
        }
      }),
    []
  )
export type IInvoice = {
  id: number
  invoiceName: string
  projectName: string
  sent: number
  dueDate: Date
  taxes: number
  payment: chargeTotal
  totalSaleValue: totalsalevalue
  status: string
  PaymentItems: paymentItems[]
  subTotal: number
  createDate: Date
  discount: number
  charges: Charges[]
  paymentHeader: string
  shipping: number
  totalAmount: number
  chargeTotal: chargeTotal
  invoiceNumber: string
  items: IInvoiceItem[]
  itemTotal: ItemTotal
  invoiceTo: IAddressItem
  invoiceFrom: IAddressItem
}
export type IAddressItem = {
  id?: number
  name: string
  company?: string
  primary?: boolean
  fullAddress: string
  phoneNumber?: string
  addressType?: string
}
export type ItemTotal = {
  title: string
  RatePerSqft: number
  total: number
  SaleValue: number
}
export type chargeTotal = {
  title: string
  total: number
}
export type IInvoiceItem = {
  id: number
  title: string
  RatePerSqft: number
  total: number
  SaleValue: number
  service: string
  quantity: number
}
export type Charges = {
  id: number
  title: string
  description: string
  total: number
}
export type totalsalevalue = {
  title: string
  total_A: number
  total_B: number
  total: number
}
export type paymentItems = {
  id: number
  title: string
  timeline: string
  total: number
}

type InputValue = string | number | null
type InputValue2 = Date | string | number | null | undefined
const createDate: Date = new Date('2023-08-19T12:00:00')
const dueDate: Date = new Date('2023-08-21T12:00:00')
function result(format: string, key = '.00', currencySymbol: string) {
  const isInteger = format.includes(key)

  return isInteger
    ? currencySymbol + format.replace(key, '')
    : currencySymbol + format
}
export function fCurrency(number: InputValue) {
  const format = number ? numeral(number).format('0,0.00') : '0'

  // Format the currency symbol using Intl.NumberFormat
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  })
  const formatedValue = currencyFormatter.format(parseFloat(format))

  return result(format, '.00', '₹')
}
export function fDate(date: InputValue2, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy'

  return date ? format(new Date(date), fm) : ''
}
const i = 0

const invoiceDet: IInvoice[] = [
  {
    id: 1,
    projectName: 'PSP NIRVANA1',
    invoiceName: 'COST SHEET',
    sent: 1,
    paymentHeader: 'PAYMENT SCHEDULE',
    payment: {
      title: 'Plot Value Total Rs.:',
      total: 9873341,
    },
    dueDate: dueDate,
    taxes: 2000,
    status: 'pending',
    subTotal: 200000,
    createDate: createDate,
    discount: 500,
    shipping: 200,
    totalAmount: 201300,
    PaymentItems: [
      {
        id: 1,
        title: 'On Booking',
        timeline: 'Booking Advance',
        total: 200000,
      },
      {
        id: 2,
        title: 'On Execution of Agreement to sell ',
        timeline: '15 Days from Booking',
        total: 2418335,
      },
      {
        id: 3,
        title: 'On Execution of Sale Deed for registration',
        timeline: 'Booking Advance',
        total: 7255006,
      },
    ],
    totalSaleValue: {
      title: 'Total Plot Sale Value(A+B)',
      total_A: 8877330,
      total_B: 996011,
      total: 9873341,
    },
    invoiceNumber: '14321',
    charges: [
      {
        id: 1,
        title: 'Legal Charges on sale Deed',
        description: 'Before Sale Deed Execution',
        total: 50000,
      },
      {
        id: 2,
        title: 'Club House Charges',
        description: 'Before SD',
        total: 236000,
      },
      {
        id: 3,
        title: 'Infrastructure charges',
        description: 'Before SD',
        total: 647820,
      },
      {
        id: 4,
        title: 'Maintenance Charges',
        description: 'Before SD',
        total: 62191,
      },
    ],
    chargeTotal: {
      title: 'Total (B)',
      total: 996011,
    },
    items: [
      {
        id: 1,
        title: 'UNIT COST',
        RatePerSqft: 3650,
        SaleValue: 8015400,
        total: 8416170,
        service: 'sell',
        quantity: 2196,
      },
      {
        id: 2,
        title: 'PLC',
        RatePerSqft: 1,
        SaleValue: 2196,
        total: 461160,
        service: 'sell',
        quantity: 2,
      },
    ],
    itemTotal: {
      title: 'Total (A)',
      RatePerSqft: 3651,
      SaleValue: 8017596,
      total: 8877330,
    },
    invoiceTo: {
      id: 2,
      name: 'kunal',
      company: 'ensaar',
      primary: true,
      fullAddress: 'shalimar bagh delhi-110088',
      phoneNumber: '7838103717',
      addressType: 'permanent',
    },
    invoiceFrom: {
      id: 2,
      name: 'kunal',
      company: 'ensaar',
      primary: true,
      fullAddress: 'shalimar bagh',
      phoneNumber: '7838103717',
      addressType: 'permanent',
    },
  },
]




const MyDocument = ({
  user,
  selUnitDetails,
  streamUnitDetails,
  myBookingPayload,
  selCustomerPayload,
  totalIs,
  unitTotal,
  myObj,
  newPlotPS,
  myAdditionalCharges,
  unitReceivedTotal,
  project,
  netTotal,
  projectDetails,
  PSa,
  setNetTotal,
  partATotal,
  partBTotal,
  leadDetailsObj1,
  custObj1,
  customerDetailsObj,
  customerInfo,

  setPartATotal,
  setPartBTotal,
}) => {
  const styles = useStyles()

  useEffect(() => {
    console.log('myObj', myObj, myAdditionalCharges)
  }, [myObj])



  const renderSwitchStatus = (isEnabled) => (
    <View style={[styles.switchContainer]}>
      <Text style={[
        styles.switchText,
        { color: isEnabled ? '#2563eb' : '#6b7280' }
      ]}>
        {isEnabled ? 'Yes' : 'No'}
      </Text>
    </View>
  );




  const [sectionDimensions, setSectionDimensions] = useState([]);
  const [tableDimensions, setTableDimensions] = useState([]);

  // This function handles the section rendering
  const handleSectionRender = (e, sectionIndex) => {
    const { width, height } = e.source;
    setSectionDimensions((prev) => [
      ...prev,
      { sectionIndex, width, height },
    ]);
    console.log(`Section ${sectionIndex} rendered with dimensions:`, width, height);
  };

  // This function handles the table rendering
  const handleTableRender = (e, tableIndex) => {
    const { width, height } = e.source;
    setTableDimensions((prev) => [
      ...prev,
      { tableIndex, width, height },
    ]);
    console.log(`Table ${tableIndex} rendered with dimensions:`, width, height);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* <View style={[styles.mT4]}> */}



        <View style={[ styles.fitternew, ]}>


        <View
          style={[
            styles.gridContainer,
            styles.topBoderRadius,
            styles.dashBorder,
            styles.cellBgHead,
            styles.headFitter,
          ]}
        >
          <View
            style={[styles.col6, styles.smallFitter, styles.pr3, styles.ml1]}
          >
           

         <Image src={project?.projectLogoUrl} style={{ width: 85, height: 35 }} />
           

            {/* <Image source="/ps_logo.png" style={{ width: 85, height: 35 }} /> */}
            <Text style={[styles.h4, styles.ml1]}>
              {projectDetails?.projectName}
            </Text>
          </View>



<View
  style={[
    styles.col6,
    {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      height: '100%',

    },
  ]}
>
  <Text
    style={[
      styles.h4,
      styles.mT1,
      styles.pt5,
      styles.pr3,
    ]}
  >
    Payment Schedule
  </Text>

  <Text style={[styles.body2, styles.pr3, {color:'#3D3D3D'}]}>
    {fDate(prettyDate(Timestamp.now().toMillis()))}
  </Text>
</View>






        </View>

        <View style={[styles.gridContainer, styles.bottomBorderRadius, styles.pt3,    styles.mb10, { backgroundColor:'#EDEDED'}]}>

          <View
  style={[
    styles.col4,
    styles.ml3,
    styles.cellBgHead,
    styles.AllsmallFitter,
  ]}
>









  <View>

  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg1} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Applicant Name:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>{selCustomerPayload?.customerDetailsObj?.customerName1}</Text>
  </View>




  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg2} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Customer ID:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>NA</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg3} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Phone number:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}> {selCustomerPayload?.customerDetailsObj?.phoneNo1}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg5} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Email:
    </Text>
    <Text style={[ { marginLeft: 15, color:'#6A6A6A' }]}>{selCustomerPayload?.customerDetailsObj?.email1}</Text>
  </View>
</View>



</View>











          <View style={[styles.col4, styles.cellBgHead, styles.AllsmallFitter]}>




<View>

  <View style={{ flexDirection: 'row',  alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg5} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />
    <Text style={[styles.subtitle2, { fontWeight: 600, width: 40 }]}>
      Unit No:
    </Text>
    <Text style={{ flex: 1,  color:'#6A6A6A' }}>{selCustomerPayload?.unit_no}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg6} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />
    <Text style={[styles.subtitle2, { fontWeight: 600, width: 40 }]}>
      Size:
    </Text>
    <Text style={{ flex: 1,  color:'#6A6A6A' }}>
      {selUnitDetails?.size}{' '}
      <Text>
        {'('}
        {selCustomerPayload?.area}sqft{')'}
      </Text>
    </Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg7} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />
    <Text style={[styles.subtitle2, { fontWeight: 600, width: 40 }]}>
      Facing:
    </Text>
    <Text style={{ flex: 1,  color:'#6A6A6A' }}>{selCustomerPayload?.facing}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg8} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />
    <Text style={[styles.subtitle2, { fontWeight: 600, width: 40 }]}>
      Type:
    </Text>
    <Text style={{ flex: 1,  color:'#6A6A6A' }}>
      {projectDetails?.projectType?.name === 'Apartment'
        ? 'Flat'
        :projectDetails?.projectType?.name === 'Plots'
        ? 'Plot'
        : projectDetails?.projectType?.name === 'Villas'
        ? 'Villa'
        : ''}
    </Text>
  </View>
</View>





          </View>





          <View style={[styles.col4, styles.cellBgHead, styles.mr15, styles.AllsmallFitter]}>


<View>

  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg9} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
      Unit Cost:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}> ₹{selCustomerPayload?.T_total?.toLocaleString('en-IN')} </Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg10} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
      Current Status:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>{selCustomerPayload?.status}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg11} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
      Issued Date:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>{prettyDate(Timestamp.now().toMillis())}</Text>
  </View>


</View>


          </View>






        </View>


        </View>







    <View style={[styles.bgb,]}
    onRender={(e) => handleTableRender(e, 1)}
    >

    <View style={[styles.topBoderRadius, styles.bottomBorderRadius, {border:'1px solid #CCCCCC',}]}>
          <View style={[ styles.topBoderRadiusnew,   { backgroundColor:'#EDEDED' }]}>
            <Text
              style={[
     
                styles.col,
                styles.smallFitter,

                styles.mT1,
                styles.ml2,
                { color:'#3D3D3D', fontWeight: 450 , fontSize: 10,}
              ]}
            >
              Payment Schedule
            </Text>
            <Text
              style={[
     
                styles.mb5,
                styles.col,
                styles.smallFitter,
                styles.ml2,
                {color: '#6A6A6A'}
              ]}
            >
              When To Pay & What To Pay
            </Text>

          </View>




<View style={[  styles.pt2, styles.mT1]}>
            <Text
              style={[
                styles.subtitle1,
                styles.mb5,
                styles.col,
                styles.smallFitter,
                styles.ml2,

              ]}
            >
             Payment Schedule
              
            </Text>
          </View>
          <View style={[styles.fitter]}>
            <View style={[{ borderRadius: 8 }]}>
              <View
                style={[
                  styles.subtitle1,
                  styles.bg1,
                  {
                    backgroundColor: '#EDEDED',
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    border: '1 solid #e5e7eb ',
                  },
                ]}
              >
                <View
                  style={[
                    styles.tableHeader,
                    styles.p4,
                    styles.textcolorhead,
                    {   paddingBottom: '2px' },
                  ]}
                >


                  <View style={[styles.tableCell_35, styles.p12, { marginLeft:'20px' }]}>
                    <Text style={styles.subtitle2}>
                      {/* {projectDetails?.projectType?.name === 'Apartment'
                        ? 'Flat'
                        : 'Plot'}{' '} */}

                        Charges
                      
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_200,
                      styles.alignRight,
                      styles.p12,
                      styles.pr4,
                      styles.ml1,
                    ]}
                  >
                    <Text style={styles.subtitle2}>
                    Eligible
                    </Text>
                  </View>



                  <View
                    style={[
                      styles.tableCell_200,
                      styles.alignRight,
                      styles.p12,
                      styles.pr8,
                      styles.ml2,
                    ]}
                  >
                    <Text style={styles.subtitle2}>
                    Total inc GST

                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_200,
                      styles.alignRight,
                      styles.p12,
                      styles.pr8,
                      styles.ml2,
                    ]}
                  >
                    <Text style={styles.subtitle2}>
                    Received
                    </Text>
                  </View>

                  <View
                    style={[styles.tableCell_200, styles.alignRight, styles.p12, styles.pr8, ]}
                  >
                    <Text style={styles.subtitle2}>Balance</Text>
                  </View>
                </View>


              </View>


              <View>


              {PSa?.map((d1, inx) => (
  <View
    style={[
      styles.tableRow,
      styles.textcolor,
      inx + 1 !== selCustomerPayload.length ? styles.borderbottom : null,
      { borderBottom: '1px solid #e5e7eb', marginTop: '2px', paddingTop: '4px' },
    ]}
    key={d1.id}
  >
    <View style={[styles.tableCell_1, styles.pl2, { marginTop: '-1px' }]}>
      <Text>{inx + 1}</Text>
    </View>

    <View style={[styles.tableCell_35]}>
      <Text style={styles.subtitle2}>
      <View style={[styles.tableCell_35]}>
  <Text style={styles.subtitle2}>
    {d1?.stage?.label}{' '}
    <Text>

      {d1?.description}
    </Text>
    <br/>
    <Text>
    {prettyDate(d1?.schDate)}
    </Text>
  </Text>
</View>

      </Text>
    </View>

    <View style={[styles.tableCell_20, styles.alignRight]}>
      <Text>

      {renderSwitchStatus(d1?.elgible)}

       
      </Text>
    </View>

    <View style={[styles.tableCell_20, styles.alignRight, styles.pr4]}>
      <Text>
      ₹{d1?.value?.toLocaleString('en-IN')}
      </Text>
    </View>

    <View style={[styles.tableCell_20, styles.alignRight]}>
      <Text>                          ₹{d1?.amt?.toLocaleString('en-IN')}
      </Text>
    </View>

    <View style={[styles.tableCell_20, styles.alignRight]}>
      <Text>                          {d1?.outStanding?.toLocaleString('en-IN')}
      </Text>
    </View>
  </View>
))}


              



<View
              style={[styles.tableRow, styles.textcolor, {  borderBottom: '1px solid #e5e7eb', marginTop: '2px', paddingTop: '4px'  }]}
            >
  

              <View style={[styles.tableCell_35, styles.p10]}></View>





              <View style={[styles.tableCell_20, styles.alignRight]}>
              <Text style={[styles.subtitle2,]}>
                Total Value:
                        </Text>
              </View>

              <View
                style={[styles.tableCell_2000, styles.ml2]}
              >


<Text>
                ₹{unitTotal?.toLocaleString('en-IN')}
              
                </Text>

              </View>

              <View
                style={[styles.tableCell_2000, ]}
              >

<Text>
                ₹{unitReceivedTotal?.toLocaleString('en-IN')}
                
                </Text>

              </View>


            </View>

                
              </View>


            </View>

          </View>









          </View>
    </View>
      <View style={[styles.bgb, ]}

      >

      </View>

      {/* </View> */}


      </Page>
    </Document>
  )
}





const PdfPaymentScheduleGenerator = ({
  user,
  selUnitDetails,
  myObj,
  selCustomerPayload,
  unitReceivedTotal,
  newPlotPS,
  myAdditionalCharges,
  streamUnitDetails,
  myBookingPayload,
  netTotal,
  setNetTotal,
  unitTotal,
  partATotal,
  partBTotal,
  setPartATotal,
  setPartBTotal,
  projectDetails,
  leadDetailsObj1,
  PSa,
  totalIs,
  custObj1,
  customerDetails,
}) => {
  console.log('overall cost sheet is ', newPlotPS)

        const { user: authUser } = useAuth()
     const [project, setProject] = useState({})
     const { orgId } = authUser


               useEffect(() => {
                 getProjectFun()
               }, [])
     
               const getProjectFun = async () => {
       
         
                 const steamLeadLogs = await getProject(
                   orgId,
                   selCustomerPayload?.pId
                 )
                 
                 await setProject(steamLeadLogs)
               
                 return}








  return (
    <div>
      {' '}
      <PDFDownloadLink
        document={
          <MyDocument

            user={user}
            selUnitDetails={selUnitDetails}
            streamUnitDetails={streamUnitDetails}
            myBookingPayload={myBookingPayload}
            myObj={myObj}
            selCustomerPayload={selCustomerPayload}
            newPlotPS={newPlotPS}
            myAdditionalCharges={myAdditionalCharges}
            netTotal={netTotal}
            setNetTotal={setNetTotal}
            partATotal={partATotal}
            partBTotal={partBTotal}
            project={project}
            setPartATotal={setPartATotal}
            setPartBTotal={setPartBTotal}
            projectDetails={projectDetails}
            leadDetailsObj1={leadDetailsObj1}
            custObj1={custObj1} 
            totalIs={totalIs}
            PSa={PSa}
            unitTotal={unitTotal}
            unitReceivedTotal={unitReceivedTotal}
          />
        }


        fileName={`${selCustomerPayload?.unit_no || 'unit_no'}_${projectDetails?.projectName || 'project_name'}_${selCustomerPayload?.customerDetailsObj?.customerName1 || 'customer_Name'}_Payment_Schedule.pdf`}

        // fileName={`${projectDetails?.projectName || 'project_name'}_unit_${selCustomerPayload?.unit_no || 'unit_no'}_${selCustomerPayload?.customerDetailsObj?.customerName1 || 'customer_Name'}_Payment_Schedule.pdf`}

        // fileName="sample.pdf"
        // fileName={`${projectDetails?.projectName || 'project_name'}_unit_${selUnitDetails?.unit_no || 'unit_no'}_${streamUnitDetails?.custObj1?.customerName1 || 'customer_Name'}_CostSheet.pdf`}

      >
        {/* {({ blob, url, loading, error }) =>
          loading ? (
            <button className="flex items-center justify-center">
            <Loader texColor="text-blue-600" size="h-5 w-5" />Payment Schedule
          </button>
          ) : (
            <span
              className=" px-1 py-1 pb-[5px] text-sm font-bold 

            

             duration-200 ease-in-out
             transition"
            >
          <Download style={{ height: '20px', width: '14px' }} className='mr-1'/>
          
            </span>
          )
        } */}

                {({ blob, url, loading, error }) =>
                  loading ? (
                  //   <button className="flex items-center justify-center px-1 py-1 mt-4">
                  //   <Loader texColor="text-blue-600" size="h-[20px] w-[14px]" />Cost Sheet
                  // </button>
                    <div
                    className=" focus:outline-none px-1 py-1 mt-4  text-sm font-bold tracking-wider rounded-sm flex flex-row
        
        
        
                   duration-200 ease-in-out
                   transition"
                  >
                     <Download style={{ height: '20px', width: '14px' }} className='mr-1 text-gray-200'/>
        
                  </div>
                  ) : (
                  //   <button className="flex items-center justify-center  px-1 py-1 mt-4">
                  //   <Loader texColor="text-blue-600" size="h-[20px] w-[14px]"  />Cost Sheet
                  // </button>
                    <div
                      className=" focus:outline-none px-1 py-1 mt-4 text-sm font-bold tracking-wider rounded-sm
        
        
        
                     duration-200 ease-in-out
                     transition"
                    >
                  <Download style={{ height: '20px', width: '14px' }} className='mr-1'/>
        
                    </div>
                  )
                }
      </PDFDownloadLink>
    </div>
  )
}

export default PdfPaymentScheduleGenerator
