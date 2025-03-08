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

import { Bold, Download } from 'lucide-react'



import Loader from 'src/components/Loader/Loader'
import { getProject } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { prettyDate } from 'src/util/dateConverter'
import { computeTotal } from 'src/util/computeCsTotals'




Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
  ],
})
// const useStyles = () =>
//   useMemo(
//     () =>
//       StyleSheet.create({
//         fitter: {
//           paddingLeft: '10px',
//           marginLeft: '5px',
//           marginRight: '5px',
//           paddingRight: '10px',
//         },

//         fitternew: {
//           marginLeft: '20px',
//           marginRight: '20px',
//           marginTop: '20px',

//         },



//         smallFitter: {
//           paddingLeft: '10px',
//         },
//         headFitter: {
//           padding: '10px',
//         },
//         AllsmallFitter: {
//           padding: '10px',
//         },
//         col4: {
//           width: '33%',
//           paddingLeft: '20px',
//           marginLeft: '10px',
//           marginRight: '10px',
//           paddingRight: '20px',
//         },
//         col: { width: '23%' },
//         col8: { width: '75%' },
//         col2: { width: '13%', marginTop: '10px' },
//         col6: { width: '50%' },
//         p4: { padding: '4px' },
//         p10: { padding: '4px 6px' },
//         p11: { padding: '0px 0px' },
//         p12: { paddingTop: '4px', paddingBottom: '2px' },
//         pr0: { paddingRight: '0px' },
//         pr4: { paddingRight: '4px' },
//         pr8: { paddingRight: '8px' },
//         pr10: { paddingRight: '15px' },
//         pr9: { paddingRight: '6px' },
//         mb4: { marginBottom: 4 },
//         mb2: { marginBottom: 2 },
//         mb8: { marginBottom: 8 },
//         mb40: { marginBottom: 40 },
//         mb30: { marginBottom: 30 },
//         mb20: { marginBottom: 20 },
//         mb10: { marginBottom: 10 },
//         mb5: { marginBottom: 5 },
//         mr5: { marginRight: 10 },
//         mr15: { marginRight: 15 },
//         mT0: { marginTop: 0 },
//         mT1: { marginTop: 10 },
//         ml1: { marginLeft: 5 },
//         ml2: { marginLeft: 10 },
//         ml3: { marginLeft: 15 },

//         mr2: { marginRight: 10, paddingRight: 10 },
//         ml4: { marginLeft: 20 },
//         ml5: { marginLeft: 20 },
//         pl1: { paddingLeft: 5 },
//         pl2: { paddingLeft: 10 },
//         pl3: { paddingLeft: 15 },
//         pr1: { paddingRight: 5 },
//         pr2: { paddingRight: 10 },
//         pr3: { paddingRight: 15 },
//         pt2: { paddingTop: 4 },
//         pt3: { paddingTop: 5 },
//         pt5: { paddingTop: 10 },
//         h3: { fontSize: 16, fontWeight: 400 },
//         h4: { fontSize: 13, fontWeight: 700 },
//         bold: {fontWeight: 700, color: '#000' },
//         h1: {
//           fontSize: 20,
//           fontWeight: 700,
//         },
//         body1: { fontSize: 10 },
//         body2: { fontSize: 9 },
//         subtitle1: { fontSize: 10, fontWeight: 700 },
//         subtitle2: { fontSize: 8, fontWeight: 700 },
//         alignRight: { textAlign: 'right' },
//         alignLeft: { textAlign: 'left' },
//         alignCenter: { textAlign: 'center' },
//         page: {
//           fontSize: 9,
//           lineHeight: 1.6,
//           fontFamily: 'Roboto',
//           backgroundColor: '#fff',
//           textTransform: 'capitalize',
//           padding: '0px',
//           // padding: '40px 24px 60px 24px',
//         },
//         footer: {
//           left: 0,
//           right: 0,
//           bottom: 0,
//           padding: 24,
//           margin: 'auto',
//           borderTopWidth: 1,
//           borderStyle: 'solid',
//           position: 'absolute',
//           borderColor: '#DFE3E8',
//         },
//         gridContainer: {
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         },
//         contBorder: {
//           border: 0.5,
//           borderStyle: 'solid',
//           // borderColor: '#DFE3E8',
//         },
//         dashBorder: {
//           borderBottom: 1,
//           borderStyle: 'dashed',
//           borderColor: '#DFE3E8',
//         },
//         table: {
//           display: 'flex',
//           width: 'auto',
//           border: 0.5,
//           borderStyle: 'solid',
//         },
//         tableRow: {
//           // padding: '8px 0',
//           flexDirection: 'row',
//           // borderBottomWidth: 0.5,
//           // borderStyle: 'solid',
//           // borderColor: '#DFE3E8',

//         },
//         borderbottom: {
//           borderBottomWidth: 1,
//           borderStyle: 'solid',
//           borderColor: '#DFE3E8',
//         },
//         totalRow: {
//           padding: '6px 0',
//           marginTop: '8px',
//           flexDirection: 'row',
//           borderRadius: 3,

//         },
//         totalRowNew: {


//           flexDirection: 'row',
//           borderRadius: 1,

//         },
//         topBoderRadius: {
//           borderTopLeftRadius: '16px',
//           borderTopRightRadius: '16px',
//         },

//         topBoderRadiusnew: {
//           borderTopLeftRadius: '15px',
//           borderTopRightRadius: '15px',
//         },

//         bottomBorderRadius: {
//           borderBottomLeftRadius: '16px',
//           borderBottomRightRadius: '16px',
//         },



//         tableHeader: {
//           padding: '4px 0',
//           flexDirection: 'row',
//           alignItems:'flex-end'


//         },
//         bg: {
//           backgroundColor: '#F3FFF2',
//           paddingHorizontal: '4px',
//           paddingVertical: '8px',
//         },
//         bg1: {
//           backgroundColor: '#fff',
//           // paddingHorizontal: '20px',
//         },
//         bgb: {
//           backgroundColor: '#fff',
//           paddingHorizontal: '20px',
//         },

//         bg2: {
//           backgroundColor: '#F3FFF2',
//           padding: '8px 0',
//           flexDirection: 'row',
//         },
//         bg3: {
//           backgroundColor: '#DFF6DD',
//           padding: '8px 0',
//           flexDirection: 'row',
//         },
//         noBorder: {
//           paddingTop: 8,
//           paddingBottom: 0,
//           borderBottomWidth: 0,
//         },
//         tableCell_1: {
//           width: '5%',
//            paddingLeft: 10,
//         },
//         tableCell_35: {
//           width: '35%',
//           // paddingRight: 16,
//         },

//         tableCell_350: {
//           width: '30%',
//           // paddingRight: 16,
//         },


//         // tableCell_15: {
//         //   width: '15%',

//         // },
        

//         tableCell_200: {
//           width: '20%',
//           // paddingRight: 3,

//         },

//         tableCell_2000: {
//           width: '15%',
//           paddingRight: 3,

//         },

//         tableCell_20: {
//           width: '20%',
//           paddingRight: 10,
//         },

//         tableCell_15: {
//           width: '20%',
//           paddingRight: 10,
//         },

//         tableCell_150: {
//           width: '15%',
         
//         },





//         tableCell_2: {
//           width: '50%',
//           // paddingRight: 16,
//         },
//         tableCell_5: {
//           width: '30%',
//           // paddingRight: 16,
//         },
//         tableCell_4: {
//           width: '53%',
//           paddingRight: 8,
//           marginRight: 2,
//         },
//         tableCell_3: {
//           width: '15%',
//           paddingRight: 16,
//         },
//         cellBg0: {
//           backgroundColor: '#fffaee',
//         },
//         cellBg1: {
//           backgroundColor: '#f8f2e2',
//         },
//         cellBg2: {
//           backgroundColor: '#f8efd2',
//         },
//         cellBg3: {
//           backgroundColor: '#f6e8c2',
//         },
//         cellBgHead: {
//           backgroundColor: '#EDEDED',
//         },
//         textcolor:{
//           color: '#6A6A6A',
//         },
//         textcolorhead:{
//           color: '#3D3D3D',
//         },

//         blockborder:{
//           border: '1px solid 6A6A6A'
//         }
//       }),
//     []
//   )
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
}) => {
  // const styles = useStyles()

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


  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: 'Helvetica',
      size: 'A4', // Set page size to A4
    },
    heading: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: '#2E86C1', // Blue color for heading
    },
    secondHeading: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'left',
      color: '#E74C3C', // Red color for second heading
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    header: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#8E44AD', // Purple color for headers
    },
    table: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1, // Bottom border for every row
      borderBottomColor: '#000',
    },
    tableHeader: {
      backgroundColor: '#F4D03F', // Yellow background for table header
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      padding: 5,
      fontSize: 10,
      fontWeight: 'bold',
    },
    tableCell: {
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#000',
      textAlign: 'center',
      fontSize: 9,
      flex: 1,
    },
    lastCell: {
      padding: 5,
      textAlign: 'center',
      fontSize: 9,
      borderRightWidth: 0, // No border for the last cell
      flex: 1,
    },
    emptySpace: {
      height: 20, // Empty space height
      marginBottom: 10,
    },
    textInEmptySpace: {
      fontSize: 12,
      color: '#2ECC71', // Green color for text in empty space
      textAlign: 'left',
    },
  });
  


  const dummyData = [
    {
      id: 1,
      customerDetails: 'John Doe',
      unit: 'Unit 101',
      project: 'Project A',
      status: 'Booked',
      booked: 'Yes',
      faceing: 'North',
      sharing: 'No',
      releaseStatus: 'Released',
      unitType: '2BHK',
      plotArea: '1200 sqft',
      ratePerSqft: '₹5000',
      plotCost: '₹60,00,000',
      plotCollected: '₹30,00,000',
      plotDue: '₹30,00,000',
      bua: '1000 sqft',
      constRatePerSqft: '₹2000',
      constructionCost: '₹20,00,000',
      constCollected: '₹10,00,000',
      constDue: '₹10,00,000',
      crm: 'CRM001',
      saleManager: 'Manager A',
      statusUpdatedDate: '2023-10-01',
      ageing: '30 days',
      construction: 'Ongoing',
      saleValue: '₹80,00,000',
      sftCost: '₹8000',
      crmExecutive: 'Executive A',
      saleExecutive: 'Executive B',
      comments: 'No comments',
    },
    {
      id: 2,
      customerDetails: 'Jane Smith',
      unit: 'Unit 102',
      project: 'Project B',
      status: 'Pending',
      booked: 'No',
      faceing: 'South',
      sharing: 'Yes',
      releaseStatus: 'Not Released',
      unitType: '3BHK',
      plotArea: '1500 sqft',
      ratePerSqft: '₹5500',
      plotCost: '₹82,50,000',
      plotCollected: '₹41,25,000',
      plotDue: '₹41,25,000',
      bua: '1200 sqft',
      constRatePerSqft: '₹2500',
      constructionCost: '₹30,00,000',
      constCollected: '₹15,00,000',
      constDue: '₹15,00,000',
      crm: 'CRM002',
      saleManager: 'Manager B',
      statusUpdatedDate: '2023-09-15',
      ageing: '45 days',
      construction: 'Not Started',
      saleValue: '₹90,00,000',
      sftCost: '₹7500',
      crmExecutive: 'Executive C',
      saleExecutive: 'Executive D',
      comments: 'Follow up required',
    },
    // Add more rows as needed
  ];


  return (
    <Document>
    <Page size="A3" orientation="landscape"  style={styles.page}>
      {/* Heading */}
      <Text style={styles.heading}>Ecostone Plot Booking Summary - 08-Mar-25</Text>

      {/* Second Heading with Empty Space and Text */}
      <View style={styles.emptySpace} />
      <Text style={styles.secondHeading}>Facng [~}; Shering [</Text>

      {/* Three Headers */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Header 1</Text>
        <Text style={styles.header}>Header 2</Text>
        <Text style={styles.header}>Header 3</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        {/* <View style={[styles.tableRow, ]}>
          <Text style={styles.tableCell}>S.No</Text>
            <Text style={styles.tableCell}>Customer Details</Text>
            <Text style={styles.tableCell}>Unit</Text>
            <Text style={styles.tableCell}>Project</Text>
            <Text style={styles.tableCell}>Status</Text>
            <Text style={styles.tableCell}>Booked</Text>
            <Text style={styles.tableCell}>Faceing</Text>
            <Text style={styles.tableCell}>Sharing</Text>
            <Text style={styles.tableCell}>Release Status</Text>
            <Text style={styles.tableCell}>Unit Type</Text>
            <Text style={styles.tableCell}>Plot Area</Text>
            <Text style={styles.tableCell}>Rate/sqft</Text>
            <Text style={styles.tableCell}>Additional 1</Text>
            <Text style={styles.tableCell}>Additional 2</Text>
            <Text style={styles.tableCell}>Additional 3</Text>
            <Text style={styles.tableCell}>Additional 4</Text>
            <Text style={styles.tableCell}>Additional 5</Text>
            <Text style={styles.tableCell}>Additional 6</Text>
            <Text style={styles.tableCell}>Additional 7</Text>
            <Text style={styles.tableCell}>Additional 8</Text>
            <Text style={styles.tableCell}>Additional 9</Text>
            <Text style={styles.lastCell}>Additional 10</Text>
          

        </View> */}

<View  style={styles.tableRow}>
<Text style={styles.tableCell}>Customer Details</Text>
        <Text style={styles.tableCell}>Unit</Text>
        <Text style={styles.tableCell}>Project</Text>
        <Text style={styles.tableCell}>Status</Text>
        <Text style={styles.tableCell}>Booked</Text>
        <Text style={styles.tableCell}>Faceing</Text>
        <Text style={styles.tableCell}>Sharing</Text>
        <Text style={styles.tableCell}>Release Status</Text>
        <Text style={styles.tableCell}>Unit Type</Text>
        <Text style={styles.tableCell}>Plot Area</Text>
        <Text style={styles.tableCell}>Rate/sqft</Text>
        <Text style={styles.tableCell}>BUA</Text>
        <Text style={styles.tableCell}>Const. Rate/Sqft</Text>
        <Text style={styles.tableCell}>CRM</Text>
        <Text style={styles.tableCell}>Sale Manager</Text>
        <Text style={styles.tableCell}>Status Updated Date</Text>
        <Text style={styles.tableCell}>Ageing</Text>
        <Text style={styles.tableCell}>Construction</Text>
        <Text style={styles.tableCell}>Sale Value</Text>
        <Text style={styles.tableCell}>Sft Cost</Text>
        <Text style={styles.tableCell}>CRM Executive</Text>
        <Text style={styles.tableCell}>Sale Executive</Text>
        <Text style={styles.lastCell}>Comments</Text>
          </View>

        {/* Table Rows */}
        {dummyData.map((row, index) => (
          <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{row.customerDetails}</Text>
          <Text style={styles.tableCell}>{row.unit}</Text>
          <Text style={styles.tableCell}>{row.project}</Text>
          <Text style={styles.tableCell}>{row.status}</Text>
          <Text style={styles.tableCell}>{row.booked}</Text>
          <Text style={styles.tableCell}>{row.faceing}</Text>
          <Text style={styles.tableCell}>{row.sharing}</Text>
          <Text style={styles.tableCell}>{row.releaseStatus}</Text>
          <Text style={styles.tableCell}>{row.unitType}</Text>
          <Text style={styles.tableCell}>{row.plotArea}</Text>
          <Text style={styles.tableCell}>{row.ratePerSqft}</Text>
          <Text style={styles.tableCell}>{row.bua}</Text>
          <Text style={styles.tableCell}>{row.constRatePerSqft}</Text>
          <Text style={styles.tableCell}>{row.crm}</Text>
          <Text style={styles.tableCell}>{row.saleManager}</Text>
          <Text style={styles.tableCell}>{row.statusUpdatedDate}</Text>
          <Text style={styles.tableCell}>{row.ageing}</Text>
          <Text style={styles.tableCell}>{row.construction}</Text>
          <Text style={styles.tableCell}>{row.saleValue}</Text>
          <Text style={styles.tableCell}>{row.sftCost}</Text>
          <Text style={styles.tableCell}>{row.crmExecutive}</Text>
          <Text style={styles.tableCell}>{row.saleExecutive}</Text>
          <Text style={styles.lastCell}>{row.comments}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
  )
}
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

}) => {
  // console.log('overall cost sheet is ', newPlotPS, selUnitDetails)







            
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
            project={project}
            setPartATotal={setPartATotal}
            setPartBTotal={setPartBTotal}
            projectDetails={projectDetails}
            selCustomerPayload={selCustomerPayload}
            leadDetailsObj1={leadDetailsObj1}
            possessAdditionalCS={possessAdditionalCS}
            possessionAdditionalCostCS={possessionAdditionalCostCS}
            custObj1={custObj1} selPhaseObj={undefined} customerDetailsObj={undefined} customerInfo={undefined}        />
      }


      fileName={`${selUnitDetails?.unit_no || 'unit_no'}_${projectDetails?.projectName || 'project_name'}_${selUnitDetails?.customerDetailsObj?.customerName1 || 'customer_Name'}_CostSheet.pdf`}


    >



             {({ blob, url, loading, error }) =>
                loading ? (

                <div
                className="flex items-center  bg-white text-black     px-3 py-1    text-sm  tracking-wider rounded-md transition duration-200 ease-in-out focus:outline-none"
              >
                <Download style={{ height: '20px', width: '14px',strokeWidth: '2.5' }} className="mr-2 mb-0.5 font-semibold" />
                <p className="text-black text-[13px] font-semibold">Download</p>
              </div>
              
                ) : (
                <div
  className="flex items-center  bg-white px-3 py-1 text-black      text-sm  tracking-wider rounded-md transition duration-200 ease-in-out focus:outline-none"
>
  <Download style={{ height: '20px', width: '14px', strokeWidth: '2.5' }} className="mr-2 mb-0.5   font-semibold" />
  <p className="text-black text-[13px] font-semibold">Download</p>
</div>

                )
              }
      
    </PDFDownloadLink>
  </div>
        )
      }


export default PdfBookingSummaryReport


