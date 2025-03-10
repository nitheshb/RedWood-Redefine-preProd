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

// import { prettyDate } from './dateConverter'
import { Bold, Download } from 'lucide-react'



// import pdfimg1 from '../../public/pdfimg1.png'
// import pdfimg2 from '../../public/pdfimg2.png'
// import pdfimg3 from '../../public/pdfimg3.png'
// import pdfimg4 from '../../public/pdfimg4.png'
// import pdfimg5 from '../../public/pdfimg5.png'
// import pdfimg6 from '../../public/pdfimg6.png'
// import pdfimg7 from '../../public/pdfimg7.png'
// import pdfimg8 from '../../public/pdfimg8.png'
// import pdfimg9 from '../../public/pdfimg9.png'
// import pdfimg10 from '../../public/pdfimg10.png'
// import pdfimg11 from '../../public/pdfimg11.png'
// import pdfimg12 from '../../public/pdfimg12.png'
import Loader from 'src/components/Loader/Loader'
import { getProject } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from 'src/util/computeCsTotals'
import { prettyDate } from 'src/util/dateConverter'




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
        pr10: { paddingRight: '15px' },
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
        mT15: { marginTop: 15 },
        mT5: { marginTop: 5 },
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
        bold: {fontWeight: 700, color: '#000' },
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
          // padding: '0px',
          padding: '10px 0px 40px 0px',
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

        tableCell_350: {
          width: '30%',
          // paddingRight: 16,
        },


        // tableCell_15: {
        //   width: '15%',

        // },
        

        tableCell_200: {
          width: '20%',
          // paddingRight: 3,

        },

        tableCell_2000: {
          width: '15%',
          paddingRight: 3,

        },

        tableCell_20: {
          width: '20%',
          paddingRight: 10,
        },

        tableCell_15: {
          width: '20%',
          paddingRight: 10,
        },

        tableCell_150: {
          width: '15%',
         
        },


        // tableCell_b1: {
        //   width: '5%',
        // },

        // tableCell_b2: {
        //   width: '5%',
        // },


        // tableCell_b3: {
        //   width: '5%',
        // },

        // tableCell_b4: {
        //   width: '5%',
        // },

        // tableCell_b5: {
        //   width: '15%',
        // },

        // tableCell_b6: {
        //   width: '5%',
        // },

        // tableCell_b7: {
        //   width: '5%',
        // },

        // tableCell_b8: {
        //   width: '5%',
        // },

        // tableCell_b9: {
        //   width: '10%',
        // },

        // tableCell_b10: {
        //   width: '10%',
        // },

        // tableCell_b11: {
        //   width: '10%',
        // },

        // tableCell_b12: {
        //   width: '10%',
        // },

        // tableCell_b13: {
        //   width: '10%',
        // },





        tableCell_b1: {
          width: '3%',
          // backgroundColor: '#FF5733', // Red-Orange
        },
        tableCell_b2: {
          width: '5%',
          // backgroundColor: '#33FF57', // Green
        },
        tableCell_b3: {
          width: '5%',
          // backgroundColor: '#3357FF', // Blue
        },
        tableCell_b4: {
          width: '5%',
          // backgroundColor: '#FF33A8', // Pink
        },
        tableCell_b5: {
          width: '15%',
          // backgroundColor: '#A833FF', // Purple
        },
        tableCell_b6: {
          width: '5%',
          // backgroundColor: '#FFD700', // Gold
        },
        tableCell_b7: {
          width: '5%',
          // backgroundColor: '#FF8C00', // Dark Orange
        },
        tableCell_b8: {
          width: '5%',
          // backgroundColor: '#40E0D0', // Turquoise
        },
        tableCell_b9: {
          width: '10%',
          // backgroundColor: '#8A2BE2', // Blue Violet
        },
        tableCell_b10: {
          width: '9%',
          // backgroundColor: '#DC143C', // Crimson
        },
        tableCell_b11: {
          width: '9%',
          // backgroundColor: '#228B22', // Forest Green
        },
        tableCell_b12: {
          width: '10%',
          // backgroundColor: '#20B2AA', // Light Sea Green
        },
        tableCell_b13: {
          width: '10%',
          // backgroundColor: '#FF4500', // Orange Red
        },

        tableCell_b14: {
          width: '5%',
          // backgroundColor: '#FF4500', // Orange Red
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
  selCustomerPayload,
  setNetTotal,
  partATotal,
  selPhaseObj,
  possessAdditionalCS,
  project,
  partBTotal,
  leadDetailsObj1,
  custObj1,
  customerDetailsObj,
  possessionAdditionalCostCS,
  customerInfo,
  setPartATotal,
  setPartBTotal,
  tableData,
}) => {
  const styles = useStyles();

  const [sectionDimensions, setSectionDimensions] = useState([]);
  const [tableDimensions, setTableDimensions] = useState([]);

  const [categorizedData, setCategorizedData] = useState<Record<string, any>>({
    booked: [],
    allotment: [],
    ATS: [],
    registered: [],
    construction: [],
    possession: [],
  });

  const keys = Object.keys(categorizedData || {});

  useEffect(() => {
    if (!tableData) return;

    const newCategorizedData = {
      booked: [],
      allotment: [],
      ATS: [],
      registered: [],
      construction: [],
      possession: [],
    };

    tableData.forEach((item) => {
      const status = item?.unitStatus?.toString() || item.status.toString();
      if (newCategorizedData.hasOwnProperty(status)) {
        newCategorizedData[status].push(item);
      }
    });

    setCategorizedData(newCategorizedData);
  }, [tableData]);

  const calculateTotals = (data) => {
    let totalSaleValue = 0;
    let totalReceived = 0;
    let totalBalance = 0;

    data.forEach((item) => {
      totalSaleValue += item?.T_A || 0;
      totalReceived += item?.T_approved || 0;
      totalBalance += item?.T_balance || 0;
    });

    return { totalSaleValue, totalReceived, totalBalance };
  };




  const toRoman = (num) => {
    const romanNumerals = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];
  
    let result = '';
    for (const { value, numeral } of romanNumerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };

  const renderTable = (data, status, index) => {
    const { totalSaleValue, totalReceived, totalBalance } = calculateTotals(data);

    
    return (

      
<View key={status}>
        <Text style={[styles.subtitle1, styles.mb5, styles.mT15, styles.col, styles.smallFitter, styles.ml2]}>
          {/* {status.toUpperCase()} */}
          {`${toRoman(index + 1)}. ${status.toUpperCase()}`}

        </Text>
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
                  { paddingBottom: '2px' },
                ]}
              >
                <View style={[styles.tableCell_b1, styles.p12]}>
                  <Text style={styles.subtitle2}>S.NO</Text>
                </View>
                <View style={[styles.tableCell_b2, styles.alignLeft, styles.p12, styles.pr4, styles.ml1]}>
                  <Text style={styles.subtitle2}>Unit No</Text>
                </View>
                <View style={[styles.tableCell_b3, styles.alignLeft, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Facing</Text>
                </View>
                <View style={[styles.tableCell_b4, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Plot Area</Text>
                </View>
                <View style={[styles.tableCell_b5, styles.alignLeft, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Customer Name</Text>
                </View>
                <View style={[styles.tableCell_b6, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>B Date</Text>
                </View>
                <View style={[styles.tableCell_b7, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>SU Date</Text>
                </View>
                <View style={[styles.tableCell_b14, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Ageing</Text>
                </View>
                <View style={[styles.tableCell_b8, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Price/sqft</Text>
                </View>
                <View style={[styles.tableCell_b9, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Sale Value</Text>
                </View>
                <View style={[styles.tableCell_b10, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Received</Text>
                </View>
                <View style={[styles.tableCell_b11, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Balance</Text>
                </View>
                <View style={[styles.tableCell_b12, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>Sales Person Name</Text>
                </View>
                <View style={[styles.tableCell_b13, styles.alignRight, styles.p12, styles.pr8, styles.ml1]}>
                  <Text style={styles.subtitle2}>CRM Name</Text>
                </View>
              </View>
            </View>
            <View style={[styles.bg1, styles.mb8]}>
              {data?.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    styles.textcolor,
                    styles.bg1,
                    index + 1 !== data.length ? styles.borderbottom : null,
                    { borderBottom: '1px solid #e5e7eb', marginTop: '2px', paddingTop: '4px', borderLeft: '0px' },
                  ]}
                  key={index}
                >
                  <View style={[styles.tableCell_b1, styles.bg1, styles.pl2, { borderLeftWidth: 0, borderRightWidth: 0 }, { marginTop: '-1px' }]}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={[styles.tableCell_b2, styles.alignLeft, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text style={styles.subtitle2}>{item?.unit_no}</Text>
                  </View>
                  <View style={[styles.tableCell_b3, styles.alignLeft, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{item?.facing}</Text>
                  </View>
                  <View style={[styles.tableCell_b4, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{item?.area}</Text>
                  </View>
                  <View style={[styles.tableCell_b5, styles.alignLeft, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{item?.customerDetailsObj?.customerName1}</Text>
                  </View>
                  <View style={[styles.tableCell_b6, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{prettyDate(item?.booked_on)}</Text>
                  </View>
                  <View style={[styles.tableCell_b7, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{prettyDate(item?.stsUpT)}</Text>
                  </View>
                  <View style={[styles.tableCell_b14, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>NA</Text>
                  </View>
                  <View style={[styles.tableCell_b8, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{item?.sqft_rate}</Text>
                  </View>
                  <View style={[styles.tableCell_b9, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>₹{item?.T_A?.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={[styles.tableCell_b10, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>₹{item?.T_approved?.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={[styles.tableCell_b11, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>₹{item?.T_balance?.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={[styles.tableCell_b12, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{item?.by}</Text>
                  </View>
                  <View style={[styles.tableCell_b13, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                    <Text>{item?.assignedToObj?.email}</Text>
                  </View>
                </View>
              ))}

              {/* Total Row */}
              <View
                style={[
                  styles.tableRow,
                  styles.textcolor,
                  styles.bg1,
                  { borderBottom: '1px solid #e5e7eb', marginTop: '2px', paddingTop: '4px', borderLeft: '0px' },
                ]}
              >
                <View style={[styles.tableCell_b1, styles.bg1, styles.pl2, { borderLeftWidth: 0, borderRightWidth: 0 }, { marginTop: '-1px' }]}>
                  <Text>Total</Text>
                </View>
                <View style={[styles.tableCell_b2, styles.alignLeft, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b3, styles.alignLeft, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b4, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b5, styles.alignLeft, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b6, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b7, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b14, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b8, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b9, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text>₹{totalSaleValue?.toLocaleString('en-IN')}</Text>
                </View>
                <View style={[styles.tableCell_b10, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text>₹{totalReceived?.toLocaleString('en-IN')}</Text>
                </View>
                <View style={[styles.tableCell_b11, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text>₹{totalBalance?.toLocaleString('en-IN')}</Text>
                </View>
                <View style={[styles.tableCell_b12, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell_b13, styles.alignRight, styles.p12, styles.pr8, styles.ml1, styles.bg1]}>
                  <Text></Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>


    );
  };





  return (
    <Document>
      <Page size="A3" orientation="landscape" style={styles.page}>
        <View style={[styles.fitternew]}>
          <View style={[styles.gridContainer, styles.mb10, styles.topBoderRadius, styles.bottomBorderRadius, styles.dashBorder, styles.cellBgHead, styles.headFitter]}>
            <View style={[styles.col6, styles.pr3]}>
              <Text style={[styles.h4, styles.pt3, styles.ml1]}>
                {projectDetails?.projName}
              </Text>
            </View>
            <View style={[styles.col6, { flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', height: '100%' }]}>
              <Text style={[styles.h4, styles.mT1, styles.pt5, styles.pr3]}>
                Summary by Stage
              </Text>
              <Text style={[styles.body2, styles.pr3, { color: '#3D3D3D' }]}>
                {fDate(prettyDate(Timestamp.now().toMillis()))}
              </Text>
            </View>
          </View>
        </View>





<View
  style={{
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6, 
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    margin: 20,
    backgroundColor: '#FFFFFF', 
  }}
>

  <View
    style={{
      backgroundColor: '#EDEDED',
      padding: 12,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,

    }}
  >
    <Text
      style={{
        color: '#000', 
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
      }}
    >
      Booking Summary
    </Text>
    <Text color='#6A6A6A'>Booked, ATS, SD</Text>
  </View>


  {Object.entries(categorizedData).map(([status, data], index) => renderTable(data, status, index))}
</View>



      </Page>
    </Document>
  );
};





const PdfBookingSummaryReport = ({
  user,
  selUnitDetails,
  streamUnitDetails,
  myBookingPayload,
  myObj,
  newPlotPS,
  myAdditionalCharges,
  possessionAdditionalCostCS,
  netTotal,
  setNetTotal,
  partATotal,
  partBTotal,
  setPartATotal,
  possessAdditionalCS,
  setPartBTotal,
  projectDetails,
  selPhaseObj,
  project,
  selCustomerPayload,
  leadDetailsObj1,
  custObj1,
  tableData,
}) => {
  return (
    <div>
      <PDFDownloadLink
        document={
          <MyDocument
            user={user || {}}
            selUnitDetails={selUnitDetails || {}}
            streamUnitDetails={streamUnitDetails || {}}
            myBookingPayload={myBookingPayload || {}}
            myObj={myObj || {}}
            newPlotPS={newPlotPS || {}}
            myAdditionalCharges={myAdditionalCharges || {}}
            netTotal={netTotal || {}}
            setNetTotal={setNetTotal || {}}
            partATotal={partATotal || {}}
            partBTotal={partBTotal || {}}
            project={project || {}}
            setPartATotal={setPartATotal || {}}
            setPartBTotal={setPartBTotal || {}}
            projectDetails={projectDetails || {}}
            selCustomerPayload={selCustomerPayload || {}}
            leadDetailsObj1={leadDetailsObj1 || {}}
            possessAdditionalCS={possessAdditionalCS || {}}
            possessionAdditionalCostCS={possessionAdditionalCostCS || {}}
            custObj1={custObj1 || {}}
            tableData={tableData || {}}
          />
        }
        fileName="Booking Summary.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? (
            <div className="flex items-center bg-white text-black px-3 py-1 text-sm tracking-wider rounded-md focus:outline-none">
              <Download style={{ height: '20px', width: '14px', strokeWidth: '2.5' }} className="mr-2 mb-0.5 font-semibold" />
              <p className="text-black text-[13px] font-semibold">Download</p>
            </div>
          ) : (
            <div className="flex items-center bg-white px-3 py-1 text-black text-sm tracking-wider rounded-md focus:outline-none">
              <Download style={{ height: '20px', width: '14px', strokeWidth: '2.5' }} className="mr-2 mb-0.5 font-semibold" />
              <p className="text-black text-[13px] font-semibold">Download</p>
            </div>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};



export default PdfBookingSummaryReport
