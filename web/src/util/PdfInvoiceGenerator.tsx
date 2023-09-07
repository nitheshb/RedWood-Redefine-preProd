import React from 'react'
import { useMemo, useEffect } from 'react'

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
import { format, getTime, formatDistanceToNow } from 'date-fns'
import numeral from 'numeral'

import { computeTotal } from './computeCsTotals'

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
        mb4: { marginBottom: 4 },
        mb2: { marginBottom: 2 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        mb30: { marginBottom: 30 },
        mb20: { marginBottom: 20 },
        mb10: { marginBottom: 10 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        h1: {
          fontSize: 20,
          fontWeight: 400,
          marginLeft: '10px',
          paddingLeft: '20px',
        },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        alignLeft: { textAlign: 'left' },
        alignCenter: { textAlign: 'center' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '40px 24px 60px 24px',
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
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
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
        bg: {
          backgroundColor: '#F3FFF2',
          paddingHorizontal: '4px',
          paddingVertical: '8px',
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
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
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
  const format = number ? numeral(number).format('0,0.00') : ''

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
    projectName: 'PSP NIRVANA',
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
const MyDocument = ({ selUnitDetails, myObj, myAdditionalCharges, netTotal,
  setNetTotal,
  partATotal,
  partBTotal,
  setPartATotal,
  setPartBTotal }) => {
  const styles = useStyles()
  useEffect(() => {
    console.log('myObj', myObj, myAdditionalCharges)
  }, [myObj])

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb30]}>
          <Text style={styles.h1}>{invoiceDet[i].projectName}</Text>
          {/* <Text>{myObj} </Text> */}
          {/* <Image source="logo.png" style={{ width: 208, height: 38 }} /> */}
        </View>

        <View style={[styles.gridContainer, styles.mb20]}>
          <View style={styles.col4}>
            <Text style={[styles.subtitle2, styles.mb4]}>Invoice To</Text>
            <Text style={styles.body2}>{invoiceDet[i].invoiceTo.name}</Text>
            <Text style={styles.body2}>
              {invoiceDet[i].invoiceTo.fullAddress}
            </Text>
            <Text style={styles.body2}>
              {invoiceDet[i].invoiceTo.phoneNumber}
            </Text>
          </View>

          <View style={styles.col4}>
            <Text style={[styles.subtitle2, styles.mb4]}>Invoice From</Text>
            <Text style={styles.body2}>{invoiceDet[i].invoiceFrom.name}</Text>
            <Text style={styles.body2}>
              {invoiceDet[i].invoiceFrom.fullAddress}
            </Text>
            <Text style={styles.body2}>
              {invoiceDet[i].invoiceFrom.phoneNumber}
            </Text>
          </View>
          <View style={styles.col4}>
            <View style={styles.col8}>
              <Text style={[styles.subtitle2, styles.mb2]}>Date create</Text>
              <Text style={styles.body2}>
                {fDate(invoiceDet[i].createDate)}
              </Text>
            </View>
            <View style={styles.col8}>
              <Text style={[styles.subtitle2, styles.mb2]}>Due date</Text>
              <Text style={styles.body2}>{fDate(invoiceDet[i].dueDate)}</Text>
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

        <Text style={[styles.subtitle1, styles.bg, styles.borderbottom]}>
          {invoiceDet[i].invoiceName}
        </Text>

        <View style={styles.table}>
          <View>
            <View style={styles.bg2}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>PARTICULARS</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>RATE/SQFT</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>SALE VALUE</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>TOTAL</Text>
              </View>
            </View>
          </View>
          <View>
            {myObj?.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item?.component?.label}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item?.charges}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item?.TotalSaleValue)}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item?.TotalNetSaleValueGsT)}</Text>
                </View>
              </View>
            ))}
            <View style={styles.totalRow}>
              <View style={styles.tableCell_1}></View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>
                  {invoiceDet[i].itemTotal.title}
                </Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>{invoiceDet[i].itemTotal.RatePerSqft}</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>{fCurrency(partATotal)}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(setNetTotal)}</Text>
              </View>
            </View>

            {myAdditionalCharges?.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item?.component?.label}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item?.charges}</Text>
                </View>
                {/*
                <View style={styles.tableCell_3}>
                  <Text>{fCurrency(item?.TotalSaleValue )}</Text>
                </View> */}
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{item?.TotalNetSaleValueGsT}</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>
                    {fCurrency(
                      Number(
                        computeTotal(item, selUnitDetails?.area)
                      )?.toLocaleString('en-IN')
                    )}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.totalRow}>
              <View style={styles.tableCell_1}></View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>
                  {invoiceDet[i].chargeTotal.title}
                </Text>
              </View>

              <View style={styles.tableCell_3}></View>

              <View style={styles.tableCell_3}></View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(invoiceDet[i].chargeTotal.total)}</Text>
              </View>
            </View>
            <View style={[styles.totalRow, styles.mb20, styles.bg3]}>
              <View style={styles.tableCell_1}></View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>
                  {invoiceDet[i].totalSaleValue.title}
                </Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>{fCurrency(invoiceDet[i].totalSaleValue.total_A)}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignCenter]}>
                <Text>+</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>{fCurrency(invoiceDet[i].totalSaleValue.total_B)}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(invoiceDet[i].totalSaleValue.total)}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.subtitle1,
                styles.mb10,
                styles.col,
                styles.borderbottom,
              ]}
            >
              {invoiceDet[i].paymentHeader}
            </Text>
            <View>
              <View style={styles.bg2}>
                <View style={styles.tableCell_1}></View>

                <View style={styles.tableCell_4}>
                  <Text style={styles.subtitle2}>PARTICULARS</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>PAYMENT TIMELINE</Text>
                </View>

                <View style={[styles.tableCell_2, styles.alignRight]}>
                  <Text style={styles.subtitle2}>TOTAL INC GST</Text>
                </View>
              </View>
            </View>
            {invoiceDet[i].PaymentItems.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}></View>

                <View style={styles.tableCell_4}>
                  <Text style={styles.subtitle2}>{item.title}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text>{item.timeline}</Text>
                </View>

                <View style={[styles.tableCell_2, styles.alignRight]}>
                  <Text>{fCurrency(item.total)}</Text>
                </View>
              </View>
            ))}
            <View style={styles.totalRow}>
              <View style={styles.tableCell_1}></View>

              <View style={styles.tableCell_4}>
                <Text style={styles.subtitle2}>
                  {invoiceDet[i].payment.title}
                </Text>
              </View>

              <View style={styles.tableCell_3}></View>

              <View style={styles.tableCell_3}></View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(invoiceDet[i].payment.total)}</Text>
              </View>
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
  selUnitDetails,
  myObj,
  myAdditionalCharges,
  netTotal,
  setNetTotal,
  partATotal,
  partBTotal,
  setPartATotal,
  setPartBTotal,
}) => {
  return (
    <div>
      {' '}
      <PDFDownloadLink
        document={
          <MyDocument
            selUnitDetails={selUnitDetails}
            myObj={myObj}
            myAdditionalCharges={myAdditionalCharges}
            netTotal
            setNetTotal
            partATotal
            partBTotal
            setPartATotal
            setPartBTotal
          />
        }
        fileName="sample.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? (
            <button>Loading document...</button>
          ) : (
            <span
              className="mb-4 md:mb-0 hover:scale-110 focus:outline-none bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-sm hover:shadow-lg hover:bg-gray-100         hover:bg-teal-200
            bg-teal-100
            text-teal-700
            border duration-200 ease-in-out
            border-[#5671fc] transition"
            >
              Download Cost Sheet
            </span>
          )
        }
      </PDFDownloadLink>
    </div>
  )
}

export default PdfInvoiceGenerator
