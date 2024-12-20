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
import { Bold } from 'lucide-react'


// import pdfv1 from '../../public/pdfv1.png'
// import pdfv2 from '../../public/pdfv2.png'
// import pdfv3 from '../../public/pdfv3.png'
// import pdfv4 from '../../public/pdfv4.png'
// import pdfv5 from '../../public/pdfv5.png'
// import pdfv6 from '../../public/pdfv6.png'
// import pdfv7 from '../../public/pdfv7.png'
// import pdfv8 from '../../public/pdfv8.png'
// import pdfv9 from '../../public/pdfv9.png'
// import pdfv10 from '../../public/pdfv10.png'
// import pdfv11 from '../../public/pdfv11.png'
// import pdfv12 from '../../public/pdfv12.png'

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
  myObj,
  newPlotPS,
  myAdditionalCharges,
  netTotal,
  projectDetails,
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


        <View style={[ styles.fitternew, ]}>


        <View
          style={[
            styles.gridContainer,
            // styles.mb10,
            // styles.fitternew,
            styles.topBoderRadius,

            styles.dashBorder,
            styles.cellBgHead,
            styles.headFitter,
          ]}
        >
          <View
            style={[styles.col6, styles.smallFitter, styles.pr3, styles.ml1]}
          >
            <Image source="/ps_logo.png" style={{ width: 85, height: 35 }} />
            <Text style={[styles.h4, styles.ml1]}>
              {projectDetails?.projectName}
            </Text>
            {/* <Text>{myObj} </Text> */}
          </View>



<View
  style={[
    styles.col6,

    // styles.fitternew,
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
    Cost Sheet
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

    // styles.mb10,
  ]}
>

    {/* <View>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
    <Image src={pdfimg1} style={{  width: 12, height: 12,  marginRight: 8, marginBottom: 6 }} />
      <Text style={[styles.subtitle2, { fontWeight: 600 }]}>Applicant Name:</Text>
      <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>
        {user?.displayName || user?.name}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
    <Image src={pdfimg2} style={{ width: 12, height: 12,  marginRight: 8, marginBottom: 6 }} />
      <Text style={[styles.subtitle2, { fontWeight: 600 }]}>Customer ID:</Text>
      <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>
        {leadDetailsObj1?.Address}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
    <Image src={pdfimg3} style={{ width: 12, height: 12,  marginRight: 8,  marginBottom: 6 }} />
      <Text style={[styles.subtitle2, { fontWeight: 450 }]}>Phone number:</Text>
      <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>
       {user?.phone}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
    <Image src={pdfimg4} style={{ width: 12, height: 12,  marginRight: 8 , marginBottom:6 }} />
      <Text style={[styles.subtitle2, { fontWeight: 500 }]}>Email address:</Text>
      <Text style={[ { marginLeft: 15, color:'#6A6A6A' }]}>
        {leadDetailsObj1?.Mobile}
      </Text>
    </View>
  </View> */}







  <View>

  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg1} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Applicant Name:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}> {streamUnitDetails?.custObj1?.customerName1}</Text>
  </View>




  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg2} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Customer ID:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}> {streamUnitDetails?.custObj1?.address1}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg3} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Phone number:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}> {streamUnitDetails?.custObj1?.phoneNo1}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg5} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
    Email address:
    </Text>
    <Text style={[ { marginLeft: 15, color:'#6A6A6A' }]}>{streamUnitDetails?.custObj1?.email1}</Text>
  </View>
</View>



</View>











          <View style={[styles.col4, styles.cellBgHead, styles.AllsmallFitter]}>
            {/* <View>
              <Text style={[styles.subtitle2, styles.mb2]}>
                Date create:{' '}
                <Text style={styles.body2}>
                  {fDate(prettyDate(Timestamp.now().toMillis()))}
                </Text>
              </Text>
            </View> */}



            {/* <View >

            <View style={{ flexDirection: 'row' }}>

              <Text  style={[styles.subtitle2, { fontWeight: 'bold' }]}>
                Unit No:{' '}     </Text>
                <Text style={[ { marginLeft: 15 }]}>{selUnitDetails?.unit_no}</Text>

              </View>



              <View style={{ flexDirection: 'row' }}>

              <Text  style={[styles.subtitle2, { fontWeight: 'bold' }]}>
                Size:{' '} </Text>
                <Text  style={[ { marginLeft: 15 }]}>
                  {selUnitDetails?.size}
                  <Text  style={[ { marginLeft: 15 }]}>
                    {'('}
                    {selUnitDetails?.area}sqft{')'}
                  </Text>
                </Text>


              </View>


              <View style={{ flexDirection: 'row' }}>

              <Text style={[styles.subtitle2, { fontWeight: 'bold' }]}>
                Facing:{' '} </Text>
                <Text style={[ { marginLeft: 15 }]}>{selUnitDetails?.facing}</Text>

              </View>


             <View style={{ flexDirection: 'row' }}>
      <Text style={[styles.subtitle2, { fontWeight: 'bold' }]}>Email address:</Text>
      <Text style={[ { marginLeft: 15 }]}>
        {leadDetailsObj1?.Mobile}
      </Text>
    </View>



              <View style={{ flexDirection: 'row' }}>

              <Text style={[styles.subtitle2, { fontWeight: 'bold' }]}>
                type:{' '}         </Text>

            <Text style={[ { marginLeft: 15 }]}>
                {projectDetails?.projectType?.name === 'Apartment'
               ? (projectDetails?.projectType?.displayName || 'Flat')
               : (projectDetails?.projectType?.displayName || 'Plot')}{' '}
           </Text>
              </View>


            </View> */}

<View>

  <View style={{ flexDirection: 'row',  alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg5} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />
    <Text style={[styles.subtitle2, { fontWeight: 600, width: 40 }]}>
      Unit No:
    </Text>
    <Text style={{ flex: 1,  color:'#6A6A6A' }}>{selUnitDetails?.unit_no}</Text>
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
        {selUnitDetails?.area} sqft{')'}
      </Text>
    </Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg7} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />
    <Text style={[styles.subtitle2, { fontWeight: 600, width: 40 }]}>
      Facing:
    </Text>
    <Text style={{ flex: 1,  color:'#6A6A6A' }}>{selUnitDetails?.facing}</Text>
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
            {/* <Text style={styles.subtitle2}>Unit Cost:</Text>
            <Text style={styles.body2}>
              {user?.role[0]}
            </Text>
            <Text style={styles.subtitle2}>Current status:</Text>
            <Text style={styles.subtitle2}>Booked date:</Text>
            <Text style={styles.subtitle2}>Booked by</Text> */}

<View>

  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg9} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
      Unit Cost:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}> ₹{netTotal?.toLocaleString('en-IN')}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg10} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
      Current Status:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>{streamUnitDetails?.status}</Text>
  </View>


  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg11} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
      Issued Date:
    </Text>
    <Text style={[ { marginLeft: 15,  color:'#6A6A6A' }]}>{prettyDate(Timestamp.now().toMillis())}</Text>
  </View>

{/*
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
  <Image src={pdfimg12} style={{ width: 10, height: 10,  marginRight: 8 , marginBottom:5 }} />

    <Text style={[styles.subtitle2, { fontWeight: 600, width: 60 }]}>
      Booked By:
    </Text>
    <Text style={[ { marginLeft: 15, color:'#6A6A6A' }]}>{streamUnitDetails?.bookedBy}</Text>
  </View> */}
</View>


          </View>






        </View>


        </View>




        {/* <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Date create</Text>
            <Text style={styles.body2}>
              {fDate(invoiceDet[i].createDate)}
            </Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Due date</Text>
            <Text style={styles.body2}>{fDate(invoiceDet[i].dueDate)}</Text>
          </View>
        </View> */}


    <View style={[styles.bgb,]}
    onRender={(e) => handleTableRender(e, 1)}
    >

    <View style={[styles.topBoderRadius, styles.bottomBorderRadius, {border:'1px solid #CCCCCC',}]}>
          <View style={[ styles.topBoderRadiusnew,   { backgroundColor:'#EDEDED' }]}>
            <Text
              style={[
                // styles.subtitle1,
                // styles.mb5,
                styles.col,
                styles.smallFitter,
                // styles.pt2,
                styles.mT1,
                styles.ml2,
                { color:'#3D3D3D', fontWeight: 450 , fontSize: 10,}
              ]}
            >
              Cost Sheet
            </Text>
            <Text
              style={[
                // styles.subtitle1,
                styles.mb5,
                styles.col,
                styles.smallFitter,
                styles.ml2,
                {color: '#6A6A6A'}
              ]}
            >
              Know your charges
            </Text>

          </View>


{/* part-1 */}


{/* <View style={[{ border:'2px solid #CCCCCC',}]}> */}


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
              I. Plot charges
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
                  {/* <View style={[styles.tableCell_1, styles.p11]}>
                    <Text style={styles.subtitle2}></Text>
                  </View> */}

                  <View style={[styles.tableCell_35, styles.p12, { marginLeft:'20px' }]}>
                    <Text style={styles.subtitle2}>
                      {projectDetails?.projectType?.name === 'Apartment'
                        ? 'Flat'
                        : 'Plot'}{' '}
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
                    <Text style={styles.subtitle2}>Rate/Sqft</Text>
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
                    <Text style={styles.subtitle2}>Cost</Text>
                  </View>

                  <View
                    style={[styles.tableCell_200, styles.alignRight, styles.p12, styles.pr8, ]}
                  >
                    <Text style={styles.subtitle2}>Total Inc GST</Text>
                  </View>
                </View>


              </View>
              <View>
                {myObj?.map((item, index) => (
                  <View
                    style={[
                      styles.tableRow,
                      styles.textcolor,
                      index + 1 != myObj.length ? styles.borderbottom : null,

                      // {
                      //   backgroundColor:
                      //     index % 2 === 0 ? '#ffffff' : '#ffffff',
                      // },
                      {  borderBottom: '1px solid #e5e7eb',  marginTop: '2px', paddingTop: '4px' },
                    ]}
                    key={item.id}
                  >
                    <View
                      style={[
                        styles.tableCell_1,
                        styles.pl2,
                        { marginTop: '-1px' },
                      ]}
                    >
                      <Text>{index + 1}</Text>
                    </View>

                    <View style={[styles.tableCell_35]}>
                      <Text style={styles.subtitle2}>
                        {item?.component?.label}
                      </Text>
                    </View>

                    <View style={[styles.tableCell_20, styles.alignRight]}>
                      <Text>{item?.charges}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_20,
                        styles.alignRight,
                        styles.pr4,
                      ]}
                    >
                      <Text>{fCurrency(item?.TotalSaleValue)}</Text>
                    </View>

                    <View style={[styles.tableCell_20, styles.alignRight]}>
                      <Text>{fCurrency(item?.TotalNetSaleValueGsT)}</Text>
                    </View>
                  </View>
                ))}



<View
              style={[styles.tableRow, styles.textcolor, {  borderBottom: '1px solid #e5e7eb', marginTop: '2px', paddingTop: '4px'  }]}
            >
              <View style={[styles.tableCell_1, styles.pl2, styles.p10]}></View>

              <View style={[styles.tableCell_35, styles.p10]}></View>

              <View style={[styles.tableCell_20, styles.alignRight]}></View>

              <View
                style={[styles.tableCell_20, styles.alignRight, styles.pr4]}
              >
                <Text style={[styles.subtitle2, styles.pt2]}>{projectDetails?.projectType?.name === 'Apartment'
                        ? 'Flat'
                        : 'Plot'} Cost</Text>
              </View>

              <View
                style={[styles.tableCell_20, styles.alignRight, styles.pt2]}
              >
                <Text>{fCurrency(partATotal)}</Text>
              </View>
            </View>

                {/* part 2 */}
              </View>
            </View>

          </View>
          {/* part -2 */}

          <View style={[styles.ml2, styles.pt2, styles.mT1]}>
            <Text
              style={[
                styles.subtitle1,
                styles.mb5,
                styles.col,
                // styles.smallFitter,
                styles.ml1,
              ]}
            >
              II. Additional charges
            </Text>
          </View>

          <View style={[styles.fitter, { marginTop: '5px', marginBottom:'10px' }]}>
            <View style={[{  borderRadius: 8 }]}>
              <View
                style={[
                  styles.subtitle1,
                  styles.bg1,
                  {
                    backgroundColor: '#EDEDED',
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  },
                ]}
              >
                <View
                  style={[
                    styles.tableHeader,
                    styles.p4,
                    styles.textcolorhead,
                    { paddingBottom: '2px' },
                  ]}
                >
                  {/* <View style={[styles.tableCell_1, styles.p11]}>
                    <Text style={styles.subtitle2}></Text>
                  </View> */}

                  <View style={[  styles.ml1,styles.tableCell_35, styles.p12,  { marginLeft:'20px' } ]}>
                    <Text style={styles.subtitle2}>
                      Additional Charges
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_200,
                      styles.alignRight,
                      styles.p12,
                      styles.pr4,
                      styles.ml5,
                      // { backgroundColor:'#FCC737'}
                    ]}
                  >
                    <Text style={styles.subtitle2}>Rate/Sqft</Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_200,
                      styles.alignRight,
                      styles.p12,
                      styles.pr8,
                      styles.ml2,
                      // { backgroundColor:'#A7D477'}
                    ]}
                  >
                    <Text style={[styles.subtitle2 ]}>Cost</Text>
                  </View>

                  <View
                    style={[styles.tableCell_20, styles.alignRight, styles.p12,
                      styles.pr8,
                     { paddingLeft:'0px',}]}
                  >
                    <Text style={styles.subtitle2}>Total Inc GST</Text>
                  </View>
                </View>
              </View>


              {/* box1 */}
              {myAdditionalCharges?.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    styles.textcolor,
                    // styles.ml1,
                    index + 1 != myAdditionalCharges.length
                      ? styles.borderbottom
                      : null,

                    {   borderBottom: '1px solid #e5e7eb',
                      marginTop: '2px', paddingTop: '4px' },
                  ]}
                  key={item.id}
                >
                  <View
                    style={[
                      styles.tableCell_1,
                      styles.pl2,
                      { marginTop: '-1px' },
                    ]}
                  >
                    <Text>{index + 1}</Text>
                  </View>

                  <View style={[styles.tableCell_35]}>
                    <Text style={styles.subtitle2}>
                      {item?.component?.label}
                    </Text>
                  </View>

                  <View style={[styles.tableCell_200, styles.alignRight, ]}>
                    <Text style={[styles.alignRight]}>{fCurrency(item?.charges)}</Text>
                  </View>

                  <View
                    style={[styles.tableCell_20, styles.alignRight, styles.pr4 ,]}
                  >
                    <Text>{fCurrency(item?.TotalSaleValue)}</Text>
                  </View>

                  <View style={[styles.tableCell_20, styles.alignRight]}>
                    <Text>
                      {' '}
                      {fCurrency(
                        Number(
                          computeTotal(
                            item,
                            selUnitDetails?.area?.toString()?.replace(',', '')
                          )
                        )?.toLocaleString('en-IN')
                      )}
                    </Text>
                  </View>
                </View>
              ))}

<View
                style={[
                  styles.tableRow,
                  styles.textcolor,
                  {     borderBottom: '1px solid #e5e7eb',  marginTop: '2px', paddingTop: '4px'  },
                ]}
              >
                <View
                  style={[styles.tableCell_1, styles.pl2, styles.p10]}
                ></View>

                <View style={[styles.tableCell_35, styles.p10]}></View>

                <View style={[styles.tableCell_20, styles.alignRight]}></View>

                <View
                  style={[styles.tableCell_20, styles.alignRight, styles.pr4]}
                >
                  <Text style={[styles.subtitle2]}>Additonal Charges</Text>
                </View>

                <View style={[styles.tableCell_20, styles.alignRight]}>
                  <Text>{fCurrency(partBTotal)}</Text>

                </View>
              </View>



            </View>
            <View>





            </View>
          </View>
          {/* part-3 */}



          <View style={[styles.ml2, styles.pt2, styles.mT1]}>
            <Text
              style={[
                styles.subtitle1,
                styles.mb5,
                styles.col,
                // styles.smallFitter,
                styles.ml1,
              ]}
            >
              III. Construction charges
            </Text>
          </View>





          {projectDetails?.projectType?.name === 'Villas' &&
          <View style={[styles.fitter]}>
            <View style={[{ borderRadius: 8 }]}>
              <View
                style={[
                  styles.subtitle1,
                  styles.bg1,
                  styles.textcolorhead,
                  {
                    backgroundColor: '#EDEDED',
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  },
                ]}
              >
                <View
                  style={[
                    styles.tableHeader,
                    styles.p4,
                    styles.ml1,
                    { paddingBottom: '2px' },
                  ]}
                >
                  {/* <View style={[styles.tableCell_1, styles.p11]}>
                    <Text style={styles.subtitle2}></Text>
                  </View> */}

                  <View style={[  styles.ml1, styles.tableCell_35, styles.p12,  { marginLeft:'20px' }]}>
                    <Text style={styles.subtitle2}>
                     Construction Charges
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_200,
                      styles.alignRight,
                      styles.p12,
                      styles.pr4,
                      styles.ml5,
                    ]}
                  >
                    <Text style={styles.subtitle2}>Rate/Sqft</Text>
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
                    <Text style={styles.subtitle2}>Cost</Text>
                  </View>

                  <View
                    style={[styles.tableCell_20, styles.alignRight, styles.p12, styles.pr8,]}
                  >
                    <Text style={styles.subtitle2}>Total Inc GST</Text>
                  </View>
                </View>
              </View>
              <View>
                {myBookingPayload?.constructCS?.map((item, index) => (
                  <View
                    style={[
                      styles.tableRow,
                      styles.textcolor,
                      index + 1 != myObj.length ? styles.borderbottom : null,

                      // {
                      //   backgroundColor:
                      //     index % 2 === 0 ? '#ffffff' : '#ffffff',
                      // },
                      {     borderBottom: '1px solid #e5e7eb',
                        marginTop: '2px', paddingTop: '4px' },
                    ]}
                    key={item.id}
                  >
                    <View
                      style={[
                        styles.tableCell_1,
                        styles.pl2,
                        { marginTop: '-1px' },
                      ]}
                    >
                      <Text>{index + 1}</Text>
                    </View>

                    <View style={[styles.tableCell_35]}>
                      <Text style={styles.subtitle2}>
                        {item?.component?.label}
                      </Text>
                    </View>

                    <View style={[styles.tableCell_200, styles.alignRight]}>
                      <Text>{item?.charges}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_20,
                        styles.alignRight,
                        styles.pr4,
                      ]}
                    >
                      <Text>{fCurrency(item?.TotalSaleValue)}</Text>
                    </View>

                    <View style={[styles.tableCell_20, styles.alignRight]}>
                      <Text>{fCurrency(item?.TotalNetSaleValueGsT)}</Text>
                    </View>
                  </View>
                ))}





<View
              style={[styles.tableRow,  styles.textcolor, {   borderBottom: '1px solid #e5e7eb',    marginTop: '2px', paddingTop: '4px' }]}
            >
              <View style={[styles.tableCell_1, styles.pl2, styles.p10]}></View>

              <View style={[styles.tableCell_35, styles.p10]}></View>

              <View style={[styles.tableCell_20, styles.alignRight]}></View>

              <View
                style={[styles.tableCell_20, styles.alignRight, styles.pr4]}
              >
                <Text style={[styles.subtitle2, styles.pt2]}>Construction Cost</Text>
              </View>

              <View
                style={[styles.tableCell_20, styles.alignRight, styles.pt2]}
              >
                <Text>{fCurrency(myBookingPayload?.T_C)}</Text>
              </View>
            </View>

                {/* part 2 */}
              </View>
            </View>

          </View>}
          {/* part -4 */}


          <View style={[styles.ml2, styles.pt2, styles.mT1]}>
            <Text
              style={[
                styles.subtitle1,
                // styles.mb5,
                styles.col8,
                // styles.smallFitter,
                styles.ml1,
              ]}
            >
              IV. Construction Additional charges
            </Text>
          </View>
          {projectDetails?.projectType?.name === 'Villas' &&
           <View style={[styles.fitter, { marginTop: '5px' }]}>
            <View style={[ styles.mb20, {    borderRadius: 8 }]}>
              <View
                style={[
                  styles.subtitle1,
                  styles.bg1,
                  styles.textcolorhead,
                  {
                    backgroundColor: '#EDEDED',
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,


                  },
                ]}
              >
                <View
                  style={[
                    styles.tableHeader,
                    styles.p4,
                    styles.ml1,

                    { paddingBottom: '2px' },
                  ]}
                >
                  {/* <View style={[styles.tableCell_1, styles.p11]}>
                    <Text style={styles.subtitle2}></Text>
                  </View> */}

                  <View style={[styles.ml1, styles.tableCell_35, styles.p12,  { marginLeft:'18px' }]}>
                    <Text style={styles.subtitle2}>
                      Construction Additonal Charges
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_200,
                      styles.alignRight,
                      styles.p12,
                      styles.pr4,
                      styles.ml5,
                    ]}
                  >
                    <Text style={styles.subtitle2}>Rate/Sqft</Text>
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
                    <Text style={styles.subtitle2}>Cost</Text>
                  </View>

                  <View
                    style={[styles.tableCell_20, styles.alignRight, styles.p12, styles.pr8,]}
                  >
                    <Text style={styles.subtitle2}>Total Inc GST</Text>
                  </View>
                </View>
              </View>
              {myBookingPayload?.constAdditionalChargesCS?.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    styles.textcolor,
                    // styles.ml1,
                    index + 1 != myAdditionalCharges.length
                      ? styles.borderbottom
                      : null,

                    {   borderBottom: '1px solid #e5e7eb',
                      marginTop: '2px', paddingTop: '4px' },
                  ]}
                  key={item.id}
                >
                  <View
                    style={[
                      styles.tableCell_1,
                      styles.pl2,
                      { marginTop: '-1px' },
                    ]}
                  >
                    <Text>{index + 1}</Text>
                  </View>

                  <View style={[styles.tableCell_35]}>
                    <Text style={styles.subtitle2}>
                      {item?.component?.label}
                    </Text>
                  </View>

                  <View style={[styles.tableCell_200, styles.alignRight]}>
                    <Text>{fCurrency(item?.charges)}</Text>
                  </View>

                  <View
                    style={[styles.tableCell_20, styles.alignRight, styles.pr4]}
                  >
                    <Text>{fCurrency(item?.TotalSaleValue)}</Text>
                  </View>

                  <View style={[styles.tableCell_20, styles.alignRight]}>
                    <Text>
                      {' '}
                      {fCurrency(
                        Number(
                          computeTotal(
                            item,
                            selUnitDetails?.area?.toString()?.replace(',', '')
                          )
                        )?.toLocaleString('en-IN')
                      )}
                    </Text>
                  </View>
                </View>
              ))}

<View>
              <View
                style={[
                  styles.tableRow,
                  styles.textcolor,
                  {  borderBottom: '1px solid #e5e7eb', marginTop: '2px', paddingTop: '4px' },
                ]}
              >
                <View
                  style={[styles.tableCell_1, styles.pl2, styles.p10]}
                ></View>

                <View style={[styles.tableCell_35, styles.p10]}></View>

                <View style={[styles.tableCell_20, styles.alignRight]}></View>

                <View
                  style={[styles.tableCell_20, styles.alignRight, styles.pr4]}
                >
                  <Text style={[styles.subtitle2]}>Additonal Charges</Text>
                </View>

                <View style={[styles.tableCell_20, styles.alignRight]}>
                  <Text>{fCurrency(myBookingPayload?.T_D)}</Text>
                </View>
              </View>
            </View>




            </View>


          </View>}
          {/* part -5 */}


          {myBookingPayload?.possessionAdditionalCostCS?.length >0 &&
           <View style={[styles.fitter, { marginTop: '10px' }]}>
            <View style={[{ border: '1 solid #e5e7eb ', borderRadius: 8 }]}>
              <View
                style={[
                  styles.subtitle1,
                  styles.bg1,
                  styles.textcolorhead,
                  {
                    backgroundColor: '#EDEDED',
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  },
                ]}
              >
                <View
                  style={[
                    styles.tableHeader,
                    // styles.p4,
                    { paddingBottom: '2px' },
                  ]}
                >
                  <View style={[styles.tableCell_1, styles.p11]}>
                    <Text style={styles.subtitle2}></Text>
                  </View>

                  <View style={[styles.tableCell_35, styles.p12]}>
                    <Text style={styles.subtitle2}>
                      Possession Charges
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_20,
                      styles.alignRight,
                      styles.p12,
                      // styles.pr4,
                    ]}
                  >
                    <Text style={styles.subtitle2}>Rate/Sqft</Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell_20,
                      styles.alignRight,
                      styles.p12,
                      styles.pr4,
                    ]}
                  >
                    <Text style={styles.subtitle2}>Cost</Text>
                  </View>

                  <View
                    style={[styles.tableCell_20, styles.alignRight, styles.p12]}
                  >
                    <Text style={styles.subtitle2}>Total Inc GST</Text>
                  </View>
                </View>
              </View>
              {myBookingPayload?.constAdditionalChargesCS?.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    styles.ml1,
                    index + 1 != myAdditionalCharges.length
                      ? styles.borderbottom
                      : null,

                    { marginTop: '2px', paddingTop: '4px' },
                  ]}
                  key={item.id}
                >
                  <View
                    style={[
                      styles.tableCell_1,
                      styles.pl2,
                      { marginTop: '-1px' },
                    ]}
                  >
                    <Text>{index + 1}</Text>
                  </View>

                  <View style={[styles.tableCell_35]}>
                    <Text style={styles.subtitle2}>
                      {item?.component?.label}
                    </Text>
                  </View>

                  <View style={[styles.tableCell_20, styles.alignRight]}>
                    <Text>{fCurrency(item?.charges)}</Text>
                  </View>

                  <View
                    style={[styles.tableCell_20, styles.alignRight, styles.pr4]}
                  >
                    <Text>{fCurrency(item?.TotalSaleValue)}</Text>
                  </View>

                  <View style={[styles.tableCell_20, styles.alignRight]}>
                    <Text>
                      {' '}
                      {fCurrency(
                        Number(
                          computeTotal(
                            item,
                            selUnitDetails?.area?.toString()?.replace(',', '')
                          )
                        )?.toLocaleString('en-IN')
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View>
              <View
                style={[
                  styles.tableRow,
                  styles.textcolor,
                  { marginTop: '2px', paddingTop: '8px' },
                ]}
              >
                <View
                  style={[styles.tableCell_1, styles.pl2, styles.p10]}
                ></View>

                <View style={[styles.tableCell_35, styles.p10]}></View>

                <View style={[styles.tableCell_20, styles.alignRight]}></View>

                <View
                  style={[styles.tableCell_20, styles.alignRight, styles.pr4]}
                >
                  <Text style={[styles.subtitle2]}>Possession Charges</Text>
                </View>

                <View style={[styles.tableCell_20, styles.alignRight]}>
                  <Text>{fCurrency(myBookingPayload?.T_E)}</Text>
                </View>
              </View>

              {/* summary section */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    border: '1 solid #e5e7eb ',
                    borderRadius: 8,
                    paddingTop: 10,
                    minWidth: 180,
                    // Adjust as needed
                  }}
                >
                  {[
                    { label: `${projectDetails?.projectType?.name === 'Apartment'
                      ? 'Flat'
                      : 'Plot'} cost`, value: myBookingPayload?.T_A },
                    { label: 'Additional Charges', value: partBTotal },
                  ].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      <Text style={{ fontSize: 9, fontWeight: 'normal' }}>
                        {item.label}
                      </Text>
                      <Text style={{ fontSize: 9, fontWeight: 'semibold' }}>
                        ₹{item.value?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))}
                  {/* part c and D */}
                  {projectDetails?.projectType?.name === 'Villas' &&
                        [
                    { label: `Construction cost`, value: myBookingPayload?.T_C },
                    { label: 'Construction additional Charges', value: myBookingPayload?.T_D },
                  ].map((item, index) => (
                    <View
                      key={index}

                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,

                      }}
                    >
                      <Text style={{ fontSize: 9, fontWeight: 'normal' }}>
                        {item.label}
                      </Text>
                      <Text style={{ fontSize: 9, fontWeight: 'semibold' }}>
                        ₹{item.value?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))}
                  <View
                   style={[styles.textcolor]}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#EDEDED',
                      padding: 8,
                      borderBottomLeftRadius: 6,
                      borderBottomRightRadius: 6,


                    }}
                  >
                    <Text style={{ fontSize: 9, fontWeight: 'medium' }}>
                      Total Cost
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: 'medium',
                        color: '#0D027D',
                        marginRight: 2,
                      }}
                    >
                      ₹{netTotal?.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>

            </View>
          </View>}


          {/* </View> */}

          </View>

             {/*Payment Schedule box  */}













              {/* payment end */}





    </View>





      <View style={[styles.bgb, ]}
        // break={index === myBookingPayload.plotPS.length - 1 ? 'after' : null}
      >


      <View style={[styles.topBoderRadius, styles.bottomBorderRadius, { border:'1px solid #CCCCCC', backgroundColor: '#fff', marginTop: '10px' }]} >




<View style={[ styles.topBoderRadius,  {  backgroundColor:'#EDEDED'}]}>
    <Text
      style={[
        // styles.subtitle1,
        // styles.mb5,
        styles.col,
        styles.smallFitter,
        styles.ml1,
        styles.mT1,
        { color:'#3D3D3D', fontWeight: 450 , fontSize: 10,}
      ]}


      onRender={(e) => handleSectionRender(e, 2)}
    >
      Payment Schedule
    </Text>
    <Text
      style={[
        // styles.subtitle1,
        styles.mb5,
        styles.col,
        styles.smallFitter,
        styles.ml1,
        {color: '#6A6A6A'}
      ]}
    >
      When to pay & what to pay
    </Text>

  </View>



<View style={[styles.ml2, styles.pt2, styles.mT1]}>
<Text
style={[
styles.subtitle1,
styles.mb5,
// styles.col,
// styles.smallFitter,
styles.ml1,
]}
>
I. Payment Schedule
</Text>
</View>
<View style={[styles.fitter]}>
<View
style={[
{   borderTopLeftRadius: 8,
borderTopRightRadius: 8,  borderBottom: '1 solid #e5e7eb '  },
styles.mb20,
]}
>
<View
style={[
styles.subtitle1,
{
backgroundColor: '#EDEDED',
borderTopLeftRadius: 6,
borderTopRightRadius: 6,
},
]}
>
<View
style={[
styles.tableHeader,
//  styles.p4,
styles.textcolorhead,
{ paddingBottom: '2px' },
]}
>
<View style={[styles.tableCell_1, styles.p11]}>
<Text style={styles.subtitle2}></Text>
</View>

<View style={[styles.tableCell_4, styles.p12]}>
<Text style={[styles.subtitle2]}>Schedule</Text>
</View>
<View style={[styles.tableCell_5, styles.p12]}>
<Text style={styles.subtitle2}>Payment Timeline</Text>
</View>
<View
style={[
 styles.tableCell_3,
 styles.alignRight,
 styles.p12,
]}
>
<Text style={styles?.subtitle2}>Total</Text>
</View>
</View>
</View>
{myBookingPayload?.plotPS?.map((item, index) => (
<View
style={[
styles.tableRow,
styles.borderbottom,
styles.textcolor,
{
 marginTop: '2px', paddingTop: '4px' },
]}
key={item.id}
break={index === myBookingPayload.plotPS.length - 1 ? 'after' : null}
>
<View
style={[
 styles.tableCell_1,
 styles.pl2,
 { marginTop: '-1px' },
]}
>
<Text>{index + 1}</Text>
</View>

<View style={styles.tableCell_4}>
<Text style={styles.subtitle2}>{item.stage?.label}</Text>
</View>

<View style={styles.tableCell_5}>
<Text>{item.description}</Text>
</View>

<View style={[styles.tableCell_3, styles.alignRight]}>
<Text>{fCurrency(item.value)}</Text>
</View>
</View>
))}
<View style={[styles.totalRow, styles.mT0 ,  styles.textcolor, ]}>
<View style={styles.tableCell_1}></View>

<View style={[styles.tableCell_4]}>
<Text style={styles.subtitle2}>Total Cost</Text>
</View>

<View style={styles.tableCell_3}></View>

<View style={styles.tableCell_3}></View>

<View style={[styles.tableCell_3, styles.alignRight]}>
<Text>{fCurrency(myBookingPayload?.T_A + myBookingPayload?.T_B)}</Text>
</View>
</View>
</View>





<View style={[ styles.pt2, styles.mT1]}>
<Text
style={[
styles.subtitle1,
styles.mb5,
// styles.col,
// styles.smallFitter,
// styles.ml2,
]}
>
II. Construction Schedule
</Text>
</View>




{projectDetails?.projectType?.name === 'Villas' &&  <View
style={[
{   borderTopLeftRadius: 8,
borderTopRightRadius: 8,  borderBottom: '1 solid #e5e7eb ' },
styles.mb20,
]}
>
<View
style={[
styles.subtitle1,
{
backgroundColor: '#EDEDED',
borderTopLeftRadius: 6,
borderTopRightRadius: 6,
},
]}
>
<View
style={[
styles.tableHeader,
//  styles.p4,
styles.textcolorhead,
{ paddingBottom: '2px' },
]}
>
<View style={[styles.tableCell_1, styles.p11]}>
<Text style={styles.subtitle2}></Text>
</View>

<View style={[styles.tableCell_4, styles.p12]}>
<Text style={[styles.subtitle2]}>Construction Schedule</Text>
</View>
<View style={[styles.tableCell_5, styles.p12]}>
<Text style={styles.subtitle2}>Payment Timeline</Text>
</View>
<View
style={[
 styles.tableCell_3,
 styles.alignRight,
 styles.p12,
]}
>
<Text style={styles?.subtitle2}>Total</Text>
</View>
</View>
</View>
{myBookingPayload?.constructPS?.map((item, index) => (
<View
style={[
styles.tableRow,
styles.borderbottom,
styles.textcolor,
{   marginTop: '2px', paddingTop: '4px' },
]}
key={item.id}
>
<View
style={[
 styles.tableCell_1,
 styles.pl2,
 styles.textcolor,
 { marginTop: '-1px' },
]}
>
<Text>{index + 1}</Text>
</View>

<View style={styles.tableCell_4}>
<Text style={styles.subtitle2}>{item.stage?.label}</Text>
</View>

<View style={styles.tableCell_5}>
<Text>{item.description}</Text>
</View>

<View style={[styles.tableCell_3, styles.alignRight]}>
<Text>{fCurrency(item.value)}</Text>
</View>
</View>
))}
<View style={[styles.totalRow, styles.mT0,   styles.textcolor,  ]}>
<View style={styles.tableCell_1}></View>

<View style={[styles.tableCell_4]}>
<Text style={styles.subtitle2}>Total Cost</Text>
</View>

<View style={styles.tableCell_3}></View>

<View style={styles.tableCell_3}></View>

<View style={[styles.tableCell_3, styles.alignRight]}>
<Text>{fCurrency(myBookingPayload?.T_C + myBookingPayload?.T_D)}</Text>
</View>
</View>
</View> }
</View>


</View>



      </View>



        {/* <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text style={{ fontSize: 9 }}>
              We appreciate your business. Should you need us to add VAT or
              extra notes let us know!
            </Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Have a Question?</Text>
            <Text style={{ fontSize: 9 }}>support@abcapp.com</Text>
          </View>
        </View> */}
      </Page>
    </Document>
  )
}
const PdfInvoiceGenerator = ({
  user,
  selUnitDetails,
  streamUnitDetails,
  myBookingPayload,
  myObj,
  newPlotPS,
  myAdditionalCharges,
  netTotal,
  setNetTotal,
  partATotal,
  partBTotal,
  setPartATotal,
  setPartBTotal,
  projectDetails,
  leadDetailsObj1,
  custObj1,

}) => {
  console.log('overall cost sheet is ', newPlotPS, selUnitDetails)
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
            newPlotPS={newPlotPS}
            myAdditionalCharges={myAdditionalCharges}
            netTotal={netTotal}
            setNetTotal={setNetTotal}
            partATotal={partATotal}
            partBTotal={partBTotal}
            setPartATotal={setPartATotal}
            setPartBTotal={setPartBTotal}
            projectDetails={projectDetails}
            leadDetailsObj1={leadDetailsObj1}
            custObj1={custObj1}


