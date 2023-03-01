/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react'

import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline'
import { useSnackbar } from 'notistack'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'

import {
  deleteBankAccount,
  steamBankDetailsList,
  steamVirtualAccountsList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import SiderForm from '../SiderForm/SiderForm'
import PencilIcon from '@heroicons/react/solid/PencilIcon'
import { sendWhatAppTextSms1 } from 'src/util/axiosWhatAppApi'

const MarkeingMessagesList = ({ title, pId, data }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [testPhNo, setTestPhNo] = useState("")

  const [sliderInfo, setSliderInfo] = useState({
    open: false,
    title: 'Bank Account',
    sliderData: {},
    widthClass: 'max-w-xl',
  })


  const phKeyFieldFun = (e)=>{
  setTestPhNo(e.target.value)
  }
const triggerFun = (txt)=>{
  const {btnTxt,target}=txt
  console.log(btnTxt, btnTxt==='On Payment', target === 'Sales Executive')
  if (btnTxt === 'On Payment' && target==='Customer') {

    console.log(txt)
    sendWhatAppTextSms1(
      `${testPhNo}`,
      `Dear {CustomerName},\nGreetings from Excel Dwellings.\n
      This is an acknowledgement for your payment of a sum of Rs. {AmountPaid} on {PaidDate} as {PaymentMode}, for unit {UnitName} in {Project Name}.\n
      Please feel to contact us for any clarifications.\n
      Best Regards,\n
      {CompanyName} URL`

  )} else   if (btnTxt === 'On Payment' && target==='Sales Executive') {
    sendWhatAppTextSms1(
      `${testPhNo}`,
      `Dear Executive,\n
      {CustomerName} has paid Rs/- {AmountPaid} on {PaidDate} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name}.\n
      eEstate Alert Service`
    )
  } else if  (btnTxt === 'On Payment' && target==='Manager') {
    sendWhatAppTextSms1(
      `${testPhNo}`,
      `Dear Manager,\n
      {CustomerName} has paid Rs/- {AmountPaid} on {PaidDate} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name}.\n
      eEstate Alert Service
      `
    )
  }
  else if  (btnTxt === 'On Payment' && target==='Administrator') {
    sendWhatAppTextSms1(
      `${testPhNo}`,
      `Dear Manager,\n
      {CustomerName} has paid Rs/- {AmountPaid} on {PaidDate} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name}.\n
      eEstate Alert Service
      `
      )
    }
    else if (btnTxt === 'On Delete' && target === 'Customer') {
      sendWhatAppTextSms1(
        `${testPhNo}`,
        `Dear {CustomerName},\n
        your payment of Rs/- {AmountPaid} paid as {PaymentMode}, for unit {UnitName} has been deleted .\n
        eEstate Alert Service
        `
      )
}
else if  (btnTxt === 'On Delete' && target==='Sales Executive') {
  sendWhatAppTextSms1(
    `${testPhNo}`,
    `Dear Executive,\n
    {CustomerName} has paid Rs/- {AmountPaid} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name} is deleted.\n
    eEstate Alert Service
    `
  )
}
else if  (btnTxt === 'On Delete' && target==='Manager') {
  sendWhatAppTextSms1(
    `${testPhNo}`,
    `Dear Manager,\n
    {CustomerName} has paid Rs/- {AmountPaid} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name} is deleted.\n
    eEstate Alert Service
    `
  )
}
else if  (btnTxt === 'On Delete' && target==='Administrator') {
  sendWhatAppTextSms1(
    `${testPhNo}`,
    `Dear Administrator,\n
    {CustomerName} has paid Rs/- {AmountPaid} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name} is deleted.\n
    eEstate Alert Service

    `
  )
}
else if  (btnTxt === 'On Refund Pay' && target==='Customer') {
  sendWhatAppTextSms1(
    `${testPhNo}`,
    `Dear Administrator,\n
    {CustomerName} has paid Rs/- {AmountPaid} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name} is deleted.\n
    eEstate Alert Service

    `
  )
}
else if (btnTxt === 'On Refund Pay' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  {CustomerName}'s excess pay amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Refund Pay' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  {CustomerName}'s excess pay amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Refund Pay' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  {CustomerName}'s excess pay amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Creation' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {customername},\nGreetings From Excel Dwellings.\n
  Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                 Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
  Best regards,\n
  {companyname} URL`)
}
else if (btnTxt === 'On Creation' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {Executive Name} -\n
  {CustomerName} contact is assigned\n
  to you, on {ContactDate}.\n
  Regards,\n
  {AttendantName}\n
  {CompanyName}`)
}
else if (btnTxt === 'On Creation' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ManagerName},\n
  {CustomerName}  contact is created ,\n
  on {ContactDate} by {ExecutiveName}.\n
  Regards,\n
  {AttendantName}\n
  {CompanyName}`)
}
else if (btnTxt === 'On Creation' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Dear {Administrator Name},\n
  {CustomerName} contact is created ,\n
  on {ContactDate} by {ExecutveName}.\n
  Regards,\n
  {AttendantName}\n
  {CompanyName}`)
}
else if (btnTxt === 'On Update' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {customername},\n
  Greetings From Excel Dwellings.\nYour (Enq.no {BaseURL}) information has been updated. Please feel to contact us for any clarifications.\n
  Best regards,\n
  {companyname} URL\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Update' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  {CustomerName}s (Enq.no {BaseURL}) information has been updated.\n
  eEstate Alert Service

  `)
}
else if (btnTxt === 'On Update' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  {CustomerName}s (Enq.no {BaseURL}) information\n
  has been updated.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Update' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  {contactname}'s (Enq.no <a href=""{base_URL}/contacts/eno={enquiryno}"">{enquiryno}</a>) information has been updated.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Info' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},\n
  Due to wrong information, we are
  stopping all the services to you.\n
  Please contact us.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Info' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {executivename},\n
  {contactname} is a wrong entry in our database, hence it was removed. Please stop all follow ups with this contact.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Info' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  {CustomerName} is a wrong entry
  in our database, hence it was removed.\n
  So, we are  stopping all follow
  ups with this contact.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Info' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  {contactname}'s (Enq.no <a href=""{base_URL}/contacts/eno={enquiryno}"">{enquiryno}</a>) is deleted.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Assignment' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName},\n                                                       Greetings from Excel Dwellings.
  {ToExecutive} has been assigned to you.\n
 Please feel to contact us fot any clarification.\n
 Best regards,\n
 {companyname} URL   `)
}
else if (btnTxt === 'On Assignment' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {toexecutive},\n
  A new contact {contactname} has been assigned to you on {assigneddate} and you need to follow up with the contact on {firstfollowupdate}\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Assignment' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  A new contact {ContactName} has been
  assigned to {ToExecutive}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Assignment' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  A new contact {ContactName} has been assigned to {ToExecutive}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Transfer' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName},\nGreetings from Excel Dwellings.\n
  This is to inform you that ,
  your followup is transferred from
  {FromExecutive}  to {ToExecutive}.\n
  And next followup date is on {NextFollowupdate}.\n
  Please feel to contact us fot any clarification.\n
  Best regards,\n
  {companyname} URLeEstate Alert Service`)
}
else if (btnTxt === 'On Transfer' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ToExecutive},\n
  This is to inform you that , {ContactName},
  assignment is transferred from {FromExecutive}
  to you on {AssignedDate}.And next followup date
  is on {NextFollowupdate}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Transfer' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that , {ContactName}, assignment is transferred from {FromExecutive}  to {ToExecutive}.\n
  The reason for transfer is {Reason}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Transfer' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that , {ContactName}, assignment is transferred from {FromExecutive} to {ToExecutive}.\n
  The reason for transfer is {Reason}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On De-assignment' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName}, \n                                                  Greetings from Excel Dwellings.
  Your followup is de-assigned on {DeassignedDate}.Sorry for the inconvenience.\n
  The reason is {Reason} .\n
  Please feel to contact us fot any clarification.\n
  Best regards,\n
  {companyname} URL                                                        eEstate Alert Service
  `)
}
else if (btnTxt === 'On De-assignment' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {FromExecutive},\n
  {ContactName} is de-assigned on {DeassignedDate} ,from your followup list.The reason is {Reason}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On De-assignment' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  {ContactName} is de-assigned on {DeassignedDate}.The reason is {Reason}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On De-assignment' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  {ContactName} is de-assigned on {DeassignedDate}.The reason is {Reason}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Re-assignment' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName},\n                                                Greetings from Excel Dwellings.
  Our executive {ToExecutive} is re-assigned to you.\n
  Please feel to contact us fot any clarification.\n
  Best regards,\n
  {companyname} URL\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Re-assignment' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ToExecutive},\n
  A new contact {ContactName} has been assigned to you on {AssignedDate} and you need to follow up with the contact on {NextFollowupdate}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Re-assignment' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  A new contact {ContactName} has been re-assigned to {ToExecutive}.And the next followup date is {NextFollowupdate}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Re-assignment' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  A new contact {ContactName} has been Re-assigned to {ToExecutive}.And the next followup date is {NextFollowupdate}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On First Follow Up' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName},\n                                                  Greetings from Excel Dwellings.
  This is to inform you that your first follow Up dated on {FirstFollowupdate} has been initialized and assigned to  {ExecutiveName}.{ExecutiveName} will keep following and updating you regarding your interested property.\n
  Please feel to contact us fot any clarification.\n
  Best regards,\n
  {companyname} URL
  `)
}
else if (btnTxt === 'On First Follow Up' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that you have been assigned a new follow up on {FirstFollowupdate} for {ContactName}.\n
  Keep following and updating the {ContactName}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On First Follow Up' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that {ExecutiveName} of your team have been assigned a new follow up on {FirstFollowupdate} for {ContactName}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On First Follow Up' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that {ExecutiveName} working under you have been assigned a new follow up on {FirstFollowupdate} for {ContactName}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Next Follow Up' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName},\n Greetings from Excel Dwellings.\n
  This is to inform you that your next follow Up dated on {NextFollowupdate} has been initialized and assigned to {ExecutiveName}.\n
  Please feel to contact us fot any clarification.\n
  Best regards,\n
  {companyname} URL`)
}
else if (btnTxt === 'On Next Follow Up' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that you have next follow up on {NextFollowupdate} for {ContactName}.\n
  Keep following and updating {ContactName}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Next Follow Up' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that {ExecutiveName} of your team have next follow up on {NextFollowupdate} for {ContactName}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Next Follow Up' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that {ExecutiveName} working under you have next follow up on {NextFollowupdate} for {ContactName}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Follow Up' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName},\nGreetings from Excel Dwellings.\n
  This is to inform you that your next follow Up dated on {NextFollowupdate} handled by {ExecutiveName} has been deleted as you do not seem to be interested in our projects.\n
  Please feel to contact us fot any clarification.\n
  Best regards,\n
  {companyname} URL`)
}
else if (btnTxt === 'On Delete Follow Up' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that your next follow Up dated on {NextFollowupdate} for {ContactName} has been deleted as {ContactName}  do not seem to be interested in our projects.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Follow Up' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that your next follow Up dated on {NextFollowupdate} for {ContactName} handled by {ExecutiveName} of your team has been deleted as {ContactName}.  do not seem to be interested in our projects.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Follow Up' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that your next follow Up dated on {NextFollowupdate} for {ContactName} handled by {ExecutiveName} working under you has been deleted as {ContactName}  do not seem to be interested in our projects.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Dead Status' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ContactName} \n Greetings from Excel Dwellings\n
  We regret that we were unable to serve you at this time. We will be glad to help you in future for assisting you in selecting a suitable property.\n
  Please feel to contact us fot any clarification.\n
  Best regards,\n
  {companyname} URL
  `)
}
else if (btnTxt === 'On Dead Status' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  {ContactName} is no longer interested with us. Please stop all follow ups in this contact.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Dead Status' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  {ContactName} is no longer interested with us. So, we are stopping all follow ups with this contact.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Dead Status' && target==='Administrative'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  {ContactName} is no longer interested with us. So, we are stopping all follow ups with this contact.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Booking' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},\n
  Greetings from Excel Dwellings.\nThis is to inform you that site visit to {ProjectName} has been scheduled on {SiteVisitDateTime} for you.\n
  {ExecutiveName} will be attending you during the visit.\n
  Cab Status : {CabRequired}.Please feel to contact us for any clarifications.\n
  Best Regards,\n
  {CompanyName} URL
  `)
}
else if (btnTxt === 'On Booking' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that you have a site visit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. : {EnquiryNo}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Booking' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that {ExecutiveName} of your team have a sitevisit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. : {EnquiryNo}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Booking' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that {ExecutiveName} have a site
  visit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. : {EnquiryNo}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Prepone' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},\nGreetings from Excel Dwellings.\n
  This is to inform you that site visit to {ProjectName} has been Preponed to {SiteVisitDateTime} for you.
  {ExecutiveName} will be attending you during the visit.\n
  Cab Status : {CabRequired}.Please feel to contact us for any clarifications.\n
  Best Regards,\n
  {CompanyName} URL
  `)
}
else if (btnTxt === 'On Prepone' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that site
  visit to {ProjectName} for {CustomerName} ref. no. : {EnquiryNo} has been Preponed to {SiteVisitDateTime}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Prepone' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that site visit to {ProjectName} for {CustomerName} ref. no. : {EnquiryNo} handled by {ExecutiveName} of your team has been Preponed to {SiteVisitDateTime}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Prepone' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that site visit to {ProjectName} for {CustomerName} ref. no. : {EnquiryNo} handled by  {ExecutiveName} has been Preponed to {SiteVisitDateTime}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Postpone' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName}, \n Greetings from Excel Dwellings.\n
  This is to inform you that site visit to {ProjectName} has been Postponed to {SiteVisitDateTime} for you.\n
  {ExecutiveName} will be attending you during the visit.\n
  Cab Status : {CabRequired}.Please feel to contact us for any clarifications.\n
  Best Regards,\n
  {CompanyName} URL
  `)
}
else if (btnTxt === 'On Postpone' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that site
  visit to {ProjectName} for {CustomerName} ref. no. : {EnquiryNo} has been Postponed to {SiteVisitDateTime}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Postpone' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that site
  visit to {ProjectName} for {CustomerName} ref. no. : {EnquiryNo} has been Postponed to {SiteVisitDateTime}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Postpone' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that site visit to {ProjectName} for{CustomerName} ref. no. : {EnquiryNo} handled by  {ExecutiveName} hasbeen Postponed to {SiteVisitDateTime}.\n
  Cab Status : {CabRequired}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Cancel' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},\nGreetings from Excel Dwellings.\n
  This is to inform you that the site visit to {ProjectName} on {SiteVisitDateTime} has been called off.\n
  Please feel to contact us for any clarifications.\n
  Best Regards,\n
  {CompanyName} URL`)
}
else if (btnTxt === 'On Cancel' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that site visit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. :{EnquiryNo} has been Cancelled.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Cancel' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that site visit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. : {EnquiryNo} handled by {ExecutiveName} of your team has been Cancelled.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Cancel' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that site visit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. : {EnquiryNo} handled by{ExecutiveName} has been Cancelled.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Complete' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName}, \n Greetings from Excel Dwellings.\n
  This is to inform you that your site visit to {ProjectName} has been completed on {SiteVisitDateTime}. Please give {ExecutiveName} your valuable feedback.\n
  Please feel to contact us for any clarifications.\n
  Best Regards,\n
  {CompanyName} URL`)
}
else if (btnTxt === 'On Complete' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  This is to inform you that sitevisit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. : {EnquiryNo} has been Completed.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Complete' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  This is to inform you that site visit to {ProjectName} dated on {SiteVisitDateTime} for {CustomerName} ref. no. : {EnquiryNo} handled by  {ExecutiveName} of your team has been Completed.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Complete' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  This is to inform you that site visit to {ProjectName} {ExecutiveName} has been Completed.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'Bring To Live' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},\n
  your contact has been again brought to live and assigned to {ExecutiveName}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'Bring To Live' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},\n
  {CustomerName} contact has been again brought to live and assigned to you.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'Bring To Live' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  {CustomerName} contact has been again brought to live and assigned to {ExecutiveName}.\n
  eEstate Alert Service
  `)
}
else if (btnTxt === 'Bring To Live' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,\n
  {CustomerName} contact has been again brought to live and assigned to {ExecutiveName}.\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Creation' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName}, \n Greetings from Excel Dwellings.\n
  Thank you and Welcome to the Excel Family on your Booking {UnitType} in {ProjectName} on {BookingDate}. UnitNumber: {UnitName}.\n
  We appreciate you sincerely for the business you brought to us. And we hope that your journey with us will be wonderful and fruitful for both of us. We assure our best to deliver outstanding results. \n                                         Please feel to contact us for any clarifications.
  Best Regards,\n
  {CompanyName} URL`)
}
else if (btnTxt === 'On Creation' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {AttendantName},\n
  {CustomerName}  booking done on Project: {ProjectName} and UnitNumber : {UnitName}\n
  eEstate Alert Service`)
}
else if (btnTxt === 'On Creation' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,\n
  {CustomerName}  Booking is created , on {BookingDate}. Booked UnitNumber: {UnitName} in Project: {ProjectName} .\n
  Yours truly,\n
  {AttendantName}\n
  {CompanyName}`)
}
else if (btnTxt === 'On Creation' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear sir,\n
  {CustomerName}  Booking is created , on {BookingDate}. Booked UnitNumber: {UnitName} in Project: {ProjectName}.\n
  Yours truly,\n
  {AttendantName}\n
  {CompanyName}
  `)
}
else if (btnTxt === 'On Update' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                      Greetings from Excel Dwellings.
  Your information with booked UnitNumber: {UnitName} in Project: {ProjectName} is updated.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL
  `)
}
else if (btnTxt === 'On Update' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {AttendantName},
  {CustomerName} information with booked Project:
  {ProjectName} and UnitNumber :
  {UnitName} is updated.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Update' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} information with booked
  UnitNumber: {UnitName} in Project:
  {ProjectName} is updated.
  Yours truly,
  {AttendantName}
  {CompanyName}

  `)
}
else if (btnTxt === 'On Update' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear sir,
  {CustomerName} information  booking
  with booked UnitNumber: {UnitName}
  in Project: {ProjectName} is Updated.
  Yours truly,
  {AttendantName}
  {CompanyName}`)
}
else if (btnTxt === 'On Transfer Charge' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName} ,                                      Greetings from Excel Dwellings.
  This is to inform you that ,your booking is transferred from {OldInterestedProject}, {OldUnitName} to {NewInterestedProject},{NewUnitName}.
  The charges for transferring will be {Charges}.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL
  `)
}
else if (btnTxt === 'On Transfer Charge' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Executive,
  This is to inform you that ,{CustomerName} booking is transferred from {OldInterestedProject}, {OldUnitName} to {NewInterestedProject},{NewUnitName}.
  The charges for transferring is {Charges}.
  eEstate Alert Service

  `)
}
else if (btnTxt === 'On Transfer Charge' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  This is to inform you that ,{CustomerName} booking is transferred from {OldInterestedProject}, {OldUnitName} to {NewInterestedProject},{NewUnitName}.
  The charges for transferring is {Charges}.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Transfer Charge' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,
  This is to inform you that ,{CustomerName} booking is transferred from {OldInterestedProject}, {OldUnitName} to {NewInterestedProject},{NewUnitName}.
  The charges for transferring is {Charges}.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Delete Booking' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                     Greetings from Excel Dwellings.
  Your booking in {ProjectName} {UnitName} has been deleted due to some wrong information. Apoligies for the inconvenience  caused.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL`)
}
else if (btnTxt === 'On Delete Booking' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Executive,
  {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} is deleted.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Delete Booking' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} is deleted .
  Yours truly,
  {AttendantName}
  {CompanyName}
  `)
}
else if (btnTxt === 'On Delete Booking' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear sir,
  {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} is deleted.
  Yours truly,
  {AttendantName}
  {CompanyName}`)
}
else if (btnTxt === 'On Cancel Booking' && target===''){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                  Greetings from Excel Dwellings.
  This is to inform you that for your booking in {ProjectName} Unit Number: {UnitName} a cancellation ticket has been raised. The resaon being - {ReasonForCancellation}.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL`)
}
else if (btnTxt === 'On Cancel Booking' && target===''){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Executive,
  For {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} cancellation ticket has been raised. The resaon is {ReasonForCancellation}.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Cancel Booking' && target===''){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  For {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} cancellation ticket has been raised. The resaon is {ReasonForCancellation}.
  Yours truly,
  {AttendantName}
  {CompanyName}`)
}
else if (btnTxt === 'On Cancel Booking' && target===''){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear sir,
  For {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} cancellation ticket has been raised. The resaon is {ReasonForCancellation}.
  Yours truly,
  {AttendantName}
  {CompanyName}`)
}
else if (btnTxt === 'On Block' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                           Greetings from Excel Dwellings.
  This is to inform you that your booking In {Project Name}, UnitNumber: {UnitName} has been blocked up to {BlockedUpToDate} with the reason {BlockReason}.
  At Excel Dwellings we value your time and your money. We understand that not only should your home be a refuge from the storms of life but also give you excellent return on investment. We also take great pride to bring a customer focused organization.                        Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL`)
    }

else if (btnTxt === 'On Block' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Executive,
  {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} has been blocked up to {BlockedUpToDate} with the reason {BlockReason}.
  eEstate Alert Service`)
    }

else if (btnTxt === 'On Block' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} has been blocked up to {BlockedUpToDate} with the reason {BlockReason}.
  Yours truly,
  {AttendantName}
  {CompanyName}

  `)
    }

else if (btnTxt === 'On Block' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear sir,
  {CustomerName} booking with booked UnitNumber: {UnitName} in Project: {ProjectName} has been blocked up to {BlockedUpToDate} with the reason {BlockReason}.
  Yours truly,
  {AttendantName}
  {CompanyName}`)
}
else if (btnTxt === 'On Initialize Approve Reject' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                      Greetings from Excel Dwellings.
  Your cancellation request for the Booked UnitNumber: {UnitName} in Project: {ProjectName} has been {StatusofCancellation}.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL
  `)
}
else if (btnTxt === 'On Initialize Approve Reject' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Executive,
  {CustomerName} cancellation request for the Booked UnitNumber: {UnitName} in Project: {ProjectName} has been {StatusofCancellation}.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Initialize Approve Reject' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} cancellation request for the Booked UnitNumber: {UnitName} in Project: {ProjectName} has been {StatusofCancellation}.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Initialize Approve Reject' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,
  {CustomerName} cancellation request for the Booked UnitNumber: {UnitName} in Project: {ProjectName} has been {StatusofCancellation}.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Payment' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                     Greetings from Excel Dwellings.
  This is an acknowledgement for your payment of a sum of Rs. {AmountPaid} on {PaidDate} as {PaymentMode}, for unit {UnitName} in {Project Name}.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} UR`)
}
else if (btnTxt === 'On Payment' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Executive,
  {CustomerName} has paid Rs/- {AmountPaid} on {PaidDate} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name}.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Payment' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} has paid Rs/- {AmountPaid} on {PaidDate} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name}.
  eEstate Alert Service

  `)
}
else if (btnTxt === 'On Payment' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,
  {CustomerName} has paid Rs/- {AmountPaid} on {PaidDate} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name}.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Delete Payment' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},
  your payment of Rs/- {AmountPaid} paid as {PaymentMode}, for unit {UnitName} has been deleted .
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Delete Payment' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Executive,
  {CustomerName} has paid Rs/- {AmountPaid} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name} is deleted.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Delete Payment' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} has paid Rs/- {AmountPaid} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name} is deleted.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Delete Payment' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,
  {CustomerName} has paid Rs/- {AmountPaid} as {PaymentMode} towards {Booking / Registration}, for unit {UnitName} in {Project Name} is deleted.
  eEstate Alert Service
  `)
}
else if (btnTxt === 'On Refund Pay' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                     Greetings from Excel Dwellings.
  This is to inform that your excess paid amount of Rs. {AmountPaid}/- will be refunded to you on {RefundDate}, through {ModeofPayment}.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL`)
}
else if (btnTxt === 'On Refund Pay' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},
  {CustomerName}'s excess pay amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Refund Pay' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName}'s excess pay amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Refund Pay' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,
  {CustomerName}'s excess pay amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.
  eEstate Alert Service`)
    }

else if (btnTxt === 'On Refund Delete' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},
  your returned excess pay amount of about {AmountPaid}/- ,through {ModeofPayment} is deleted due to some wrong entries.
  Please contact us for more information.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Refund Delete' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},
  {CustomerName} returned excess pay amount of about {AmountPaid}/- ,through {ModeofPayment} is deleted due to some wrong entries.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Refund Delete' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} returned excess pay amount of about {AmountPaid}/- ,through {ModeofPayment} is deleted due to some wrong entries.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Refund Delete' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,
  {CustomerName} returned excess pay amount of about {AmountPaid}/- ,through {ModeofPayment} is deleted due to some wrong entries.
  eEstate Alert Service`)
}
else if (btnTxt === 'On Refund Pay' && target==='Customer'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {CustomerName},                                      Greetings from Excel Dwellings.
  This is to inform you that your Booking Cancellation excess paid amount of Rs. {AmountPaid}/- will be returned to you on {RefundDate}, through {ModeofPayment}.
  Please feel to contact us for any clarifications.
  Best Regards,
  {CompanyName} URL
  `)
}
else if (btnTxt === 'On Refund Pay' && target==='Sales Executive'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear {ExecutiveName},
{CustomerName} Booking Cancellation excess paid amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.
eEstate Alert Service
`)
}
else if (btnTxt === 'On Refund Pay' && target==='Manager'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Manager,
  {CustomerName} Booking Cancellation excess paid amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.
  eEstate Alert Service

  `)
}
else if (btnTxt === 'On Refund Pay' && target==='Administrator'){
  sendWhatAppTextSms1(`${testPhNo}`,
  `Dear Administrator,
  {CustomerName} Booking Cancellation excess paid amount of {AmountPaid}/- in {Project Name} is returned on {RefundDate}, through {ModeofPayment}.
  eEstate Alert Service`)
    }
    else if (btnTxt === 'On Enquiry Receival' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Sales Agent Assign' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Site Visit fix' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Site Visit Completion' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On NotInterested' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Booking' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Request' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Receival' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payament Accepted' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On CostSheet Approval' && target==='Sales Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Enquiry Receival' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                 Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Sales Agent Assign' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit fix' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit Completion' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On NotInterested' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Booking' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Request' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Receival' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Accepted' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,
      {companyname} URL`)
    }

    else if (btnTxt === 'On CostSheet Approval' && target==='Sales Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Enquiry Receival' && target==='Sales Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Sales Agent Assign' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit fix' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit Completion' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On NotInterested' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Booking' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Request' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Receival' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payament' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Customer Assign' && target==='Sales  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Construction Update' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Approval' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Rejected' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      ``)
    }
    else if (btnTxt === 'On Payment' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Deletion' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {CustomerName},\n
      Due to wrong information, we are
      stopping all the services to you.
      Please contact us.\n
      eEstate Alert Service`)
    }
    else if (btnTxt === 'On Booking' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Request' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Receival' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payament Accepted' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On CostSheet Approval' && target==='CRM Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Customer Assign' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {ContactName},Greetings from Excel Dwellings.\n
      {ToExecutive} has been assigned to you.\n
     Please feel to contact us fot any clarification.\n
     Best regards,
     {companyname} URL    `)
    }
    else if (btnTxt === 'On Construction Update' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Approval' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Rejected' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Booking' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Request' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Receival' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Accepted' && target==='CRM  Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On CostSheet Approval' && target==='CRM Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment' && target==='CRM Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Customer Assign' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {ContactName},Greetings from Excel Dwellings.\n
      {ToExecutive} has been assigned to you.\n
     Please feel to contact us fot any clarification.\n
     Best regards,
     {companyname} URL`)
    }
    else if (btnTxt === 'On Construction Update' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Approval' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Rejected' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      ``)
    }
    else if (btnTxt === 'On Booking' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment ' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Receival' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payament Accepted' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On CostSheet Request' && target==='CRM  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Enquiry Receival' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Sales Agent Assign' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {ContactName},Greetings from Excel Dwellings.\n
      {ToExecutive} has been assigned to you.\n
     Please feel to contact us fot any clarification.\n
     Best regards,
     {companyname} URL`)
    }
    else if (btnTxt === 'On Site Visit fix' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Site Visit Completion' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On NotInterested' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                 Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Booking' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Request' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Receival' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payament Accepted' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On CostSheet Approval' && target==='Finance Customer'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Enquiry Receival' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Sales Agent Assign' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {ContactName},Greetings from Excel Dwellings.\n
      {ToExecutive} has been assigned to you.\n
     Please feel to contact us fot any clarification.\n
     Best regards,
     {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit fix' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit Completion' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On NotInterested' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\n                                                                 Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Booking' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }
    else if (btnTxt === 'On Payment Request' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Receival' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Accepted' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On CostSheet Approval' && target==='Finance Executive'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Enquiry Receival' && target==='Finance Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Sales Agent Assign' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {ContactName},Greetings from Excel Dwellings.\n
      {ToExecutive} has been assigned to you.\n
     Please feel to contact us fot any clarification.\n
     Best regards,
     {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit fix' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Site Visit Completion' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On NotInterested' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Booking' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Request' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payment Receival' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername},  Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.                                                                  Our {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On Payament Accepted' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)
    }

    else if (btnTxt === 'On CostSheet Approval' && target==='Finance  Manager'){
      sendWhatAppTextSms1(`${testPhNo}`,
      `Dear {customername}, Greetings From Excel Dwellings.\n
      Thank you for contacting us. Here at Excel Dwellings we constantly strive to provide our customers with the best possible service and products.\nOur {executivename} will contact you soon. Please feel to contact us for any clarifications.
      Best regards,\n
      {companyname} URL`)

  }
}

//input textbox color
const inputField: HTMLInputElement = document.getElementById('inputbox') as HTMLInputElement;
const phoneRegex = /^[0-9+\-() ]*$/;

inputField.addEventListener('input', (event) => {
  const inputValue = (event.target as HTMLInputElement).value;
  if (phoneRegex.test(inputValue)) {
    inputField.style.borderColor = 'green';
  } else {
    inputField.style.borderColor = 'red';
  }
});


  return (
    <>
<section className='flex flex-row'>
<div className=" ml-5 relative" >
<input type="tel" id="inputbox" name="input" className="block w-full px-3 py-2 leading-5 text-gray-700 bg-white border-2 border-blue-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out" />
  <label htmlFor="input" className="block bg-white absolute left-3 -top-3 text-gray-600 text-sm">Whatsapp Number</label>
  </div>
      <span className='text-gray-300 text-xs mt-3 ml-2'>Hint: This is playground to test whatsapp notifiaction templates</span>
      </section>
      <div className="w-full  flex flex-row">
      <div className="lg:col-span-2 mr-4">
          <div>
            <section className="m-4 inline-block">
              <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Sales Customer Notifications"}</h2>

                <div className=" justify-between mb-4">
                  {[{ 'btnTxt': 'On Enquiry Receival', 'target': 'Sales Customer' },{ 'btnTxt': 'On Sales Agent Assign', 'target': 'Sales Customer' },{ 'btnTxt': 'On Site Visit fix', 'target': 'Sales Customer' },{ 'btnTxt': 'On Site Visit Completion', 'target': 'Sales Customer' },{ 'btnTxt': 'On NotInterested', 'target': 'Sales Customer' },{ 'btnTxt': 'On Booking', 'target': 'Sales Customer' },{ 'btnTxt': 'On Payment Request', 'target': 'Sales Customer' },{ 'btnTxt': 'On Payment Receival', 'target': 'Sales Customer' },{ 'btnTxt': 'On Payament Accepted', 'target': 'Sales Customer' },{ 'btnTxt': 'On CostSheet Approval', 'target': 'Sales Customer' } ].map((data, i) => (
                    <section>
                      <div className='flex flex-row justify-between'>
                        <section className="flex  mt-[18px]">
                          <button onClick={() => triggerFun(data)}>
                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              <PencilIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              {data?.btnTxt}
                            </span>
                          </button>
                        </section>

                        <section className="flex  mt-[18px]">
                          <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                            {data?.target}
                          </span>
                        </section>
                      </div>
                    </section>))}

                </div>
              </div>
            </section>
          </div>
          <div>

          </div>
        </div>

        <div className="lg:col-span-2 mr-4">
          <div>
            <section className="m-4 inline-block">
              <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Sales Executive Notifications"}</h2>

                <div className=" justify-between mb-4">
                  {[{ 'btnTxt': 'On Enquiry Receival', 'target': 'Sales Executive' },{ 'btnTxt': 'On Sales Agent Assign', 'target': 'Sales Executive' },{ 'btnTxt': 'On Site Visit fix', 'target': 'Sales Executive' },{ 'btnTxt': 'On Site Visit Completion', 'target': 'Sales Executive' },{ 'btnTxt': 'On NotInterested', 'target': 'Sales Executive' },{ 'btnTxt': 'On Booking', 'target': 'Sales Executive' },{ 'btnTxt': 'On Payment Request', 'target': 'Sales Executive' },{ 'btnTxt': 'On Payment Receival', 'target': 'Sales Executive' },{ 'btnTxt': 'On Payament Accepted', 'target': 'Sales Executive' },{ 'btnTxt': 'On CostSheet Approval', 'target': 'Sales Executive' } ].map((data, i) => (
                    <section>
                      <div className='flex flex-row justify-between'>
                        <section className="flex  mt-[18px]">
                          <button onClick={() => triggerFun(data)}>
                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              <PencilIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              {data?.btnTxt}
                            </span>
                          </button>
                        </section>

                        <section className="flex  mt-[18px]">
                          <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                            {data?.target}
                          </span>
                        </section>
                      </div>
                    </section>))}

                </div>
              </div>
            </section>
          </div>
          <div>

          </div>
        </div>

        <div className="lg:col-span-2 mr-4">
          <div>
            <section className="m-4 inline-block">
              <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Sales Manager Notifications"}</h2>

                <div className=" justify-between mb-4">
                  {[ { 'btnTxt': 'On Enquiry Receival', 'target': 'Sales Manager' },{ 'btnTxt': 'On Sales Agent Assign', 'target': 'Sales Manager' },{ 'btnTxt': 'On Site Visit fix', 'target': 'Sales Manager' },{ 'btnTxt': 'On Site Visit Completion', 'target': 'Sales Manager' },{ 'btnTxt': 'On NotInterested', 'target': 'Sales Manager' },{ 'btnTxt': 'On Booking', 'target': 'Sales Manager' },{ 'btnTxt': 'On Payment Request', 'target': 'Sales Manager' },{ 'btnTxt': 'On Payment Receival', 'target': 'Sales Manager' },{ 'btnTxt': 'On Payament Accepted', 'target': 'Sales Manager' },{ 'btnTxt': 'On CostSheet Approval', 'target': 'Sales Manager' }].map((data, i) => (
                    <section>
                      <div className='flex flex-row justify-between'>
                        <section className="flex  mt-[18px]">
                          <button onClick={() => triggerFun(data)}>
                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              <PencilIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              {data?.btnTxt}
                            </span>
                          </button>
                        </section>

                        <section className="flex  mt-[18px]">
                          <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                            {data?.target}
                          </span>
                        </section>
                      </div>
                    </section>))}

                </div>
              </div>
            </section>
          </div>
          <div>

          </div>
        </div>

      </div>
      {/* Crm block */}
      <div className="w-full  flex flex-row">

      <div className="lg:col-span-2 mr-4">
          <div>
            <section className="m-4 inline-block">
              <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"CRM Customer Notifications"}</h2>

                <div className=" justify-between mb-4">
                  {[{ 'btnTxt': 'On Payment', 'target': 'CRM Customer' },{ 'btnTxt': 'On Customer Assign', 'target': 'CRM Customer' },{ 'btnTxt': 'On Construction Update', 'target': 'CRM Customer' },{ 'btnTxt': 'On Payment Approval', 'target': 'CRM Customer' },{ 'btnTxt': 'On Payment Rejected', 'target': 'CRM Customer' },{ 'btnTxt': 'On Payment', 'target': 'CRM Customer' },{ 'btnTxt': 'On Payment', 'target': 'CRM Customer' },{ 'btnTxt': 'On Deletion', 'target': 'CRM Customer' },{ 'btnTxt': 'On Booking', 'target': 'CRM Customer' },{ 'btnTxt': 'On Payment Request', 'target': 'CRM Customer' }, ].map((data, i) => (
                    <section>
                      <div className='flex flex-row justify-between'>
                        <section className="flex  mt-[18px]">
                          <button onClick={() => triggerFun(data)}>
                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              <PencilIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              {data?.btnTxt}
                            </span>
                          </button>
                        </section>

                        <section className="flex  mt-[18px]">
                          <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                            {data?.target}
                          </span>
                        </section>
                      </div>
                    </section>))}

                </div>
              </div>
            </section>
          </div>
          <div>

          </div>
        </div>

        <div className="lg:col-span-2 mr-4">
          <div>
            <section className="m-4 inline-block">
              <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"CRM Customer Notifications"}</h2>

                <div className=" justify-between mb-4">
                  {[{ 'btnTxt': 'On Payment', 'target': 'CRM Executive' },{ 'btnTxt': 'On Customer Assign', 'target': 'CRM Executive' },{ 'btnTxt': 'On Construction Update', 'target': 'CRM Executive' },{ 'btnTxt': 'On Payment Approval', 'target': 'CRM Executive' },{ 'btnTxt': 'On Payment Rejected', 'target': 'CRM Executive' },{ 'btnTxt': 'On Booking', 'target': 'CRM Customer' },{ 'btnTxt': 'On Payment Request', 'target': 'CRM Executive' },{ 'btnTxt': 'On Payment Receival', 'target': 'CRM Executive' },{ 'btnTxt': 'On Payment Accepted', 'target': 'CRM Customer' },{ 'btnTxt': 'On CostSheet Approval', 'target': 'CRM Executive' }, ].map((data, i) => (
                    <section>
                      <div className='flex flex-row justify-between'>
                        <section className="flex  mt-[18px]">
                          <button onClick={() => triggerFun(data)}>
                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              <PencilIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              {data?.btnTxt}
                            </span>
                          </button>
                        </section>

                        <section className="flex  mt-[18px]">
                          <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                            {data?.target}
                          </span>
                        </section>
                      </div>
                    </section>))}

                </div>
              </div>
            </section>
          </div>
          <div>

          </div>
        </div>
        <div className="lg:col-span-2 mr-4">
          <div>
            <section className="m-4 inline-block">
              <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"CRM Manager Notifications"}</h2>

                <div className=" justify-between mb-4">
                  {[{ 'btnTxt': 'On Payment', 'target': 'CRM Manager' },{ 'btnTxt': 'On Customer Assign', 'target': 'CRM Manager' },{ 'btnTxt': 'On Construction Update', 'target': 'CRM Manager' },{ 'btnTxt': 'On Payment Approval', 'target': 'CRM Manager' },{ 'btnTxt': 'On Payment Rejected', 'target': 'CRM Manager' },{ 'btnTxt': 'On Payment', 'target': 'CRM Manager' },{ 'btnTxt': 'On Booking', 'target': 'CRM Manager' },{ 'btnTxt': 'On Payment Receival', 'target': 'CRM Manager' },{ 'btnTxt': 'On Payment Accepted', 'target': 'CRM Manager' },{ 'btnTxt': 'On Payment Request', 'target': 'CRM Manager' }, ].map((data, i) => (
                    <section>
                      <div className='flex flex-row justify-between'>
                        <section className="flex  mt-[18px]">
                          <button onClick={() => triggerFun(data)}>
                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              <PencilIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              {data?.btnTxt}
                            </span>
                          </button>
                        </section>

                        <section className="flex  mt-[18px]">
                          <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                            {data?.target}
                          </span>
                        </section>
                      </div>
                    </section>))}

                </div>
              </div>
            </section>
          </div>
          <div>

          </div>
        </div>
        </div>

       {/* Finance Block */}
      <div className="w-full  flex flex-row">

<div className="lg:col-span-2 mr-4">
    <div>
      <section className="m-4 inline-block">
        <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
          <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Finance Customer Notifications"}</h2>

          <div className=" justify-between mb-4">
            {[{ 'btnTxt': 'On Enquiry Receival', 'target': 'Finance Customer' },{ 'btnTxt': 'On Sales Agent Assign', 'target': 'Finance Customer' },{ 'btnTxt': 'On Site Visit fix', 'target': 'Finance Customer' },{ 'btnTxt': 'On Site Visit Completion', 'target': 'Finance Customer' },{ 'btnTxt': 'On NotInterested', 'target': 'Finance Customer' },{ 'btnTxt': 'On Booking', 'target': 'Finance Customer' },{ 'btnTxt': 'On Payment Request', 'target': 'Finance Customer' },{ 'btnTxt': 'On Payment Receival', 'target': 'Finance Customer' },{ 'btnTxt': 'On Payament Accepted', 'target': 'Finance Customer' },{ 'btnTxt': 'On CostSheet Approval', 'target': 'Finance Customer' }  ].map((data, i) => (
              <section>
                <div className='flex flex-row justify-between'>
                  <section className="flex  mt-[18px]">
                    <button onClick={() => triggerFun(data)}>
                      <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                        <PencilIcon
                          className="h-3 w-3 mr-1"
                          aria-hidden="true"
                        />
                        {data?.btnTxt}
                      </span>
                    </button>
                  </section>

                  <section className="flex  mt-[18px]">
                    <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                      {data?.target}
                    </span>
                  </section>
                </div>
              </section>))}

          </div>
        </div>
      </section>
    </div>
    <div>

    </div>
  </div>

  <div className="lg:col-span-2 mr-4">
    <div>
      <section className="m-4 inline-block">
        <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
          <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Finance Executive Notifications"}</h2>

          <div className=" justify-between mb-4">
            {[{ 'btnTxt': 'On Enquiry Receival', 'target': 'Finance Executive' },{ 'btnTxt': 'On Sales Agent Assign', 'target': 'Finance Executive' },{ 'btnTxt': 'On Site Visit fix', 'target': 'Finance Executive' },{ 'btnTxt': 'On Site Visit Completion', 'target': 'Finance Executive' },{ 'btnTxt': 'On NotInterested', 'target': 'Finance Executive' },{ 'btnTxt': 'On Booking', 'target': 'Finance Executive' },{ 'btnTxt': 'On Payment Request', 'target': 'Finance Executive' },{ 'btnTxt': 'On Payment Receival', 'target': 'Finance Executive' },{ 'btnTxt': 'On Payament Accepted', 'target': 'Finance Executive' },{ 'btnTxt': 'On CostSheet Approval', 'target': 'Finance Executive' }  ].map((data, i) => (
              <section>
                <div className='flex flex-row justify-between'>
                  <section className="flex  mt-[18px]">
                    <button onClick={() => triggerFun(data)}>
                      <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                        <PencilIcon
                          className="h-3 w-3 mr-1"
                          aria-hidden="true"
                        />
                        {data?.btnTxt}
                      </span>
                    </button>
                  </section>

                  <section className="flex  mt-[18px]">
                    <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                      {data?.target}
                    </span>
                  </section>
                </div>
              </section>))}

          </div>
        </div>
      </section>
    </div>
    <div>

    </div>
  </div>

  <div className="lg:col-span-2 mr-4">
    <div>
      <section className="m-4 inline-block">
        <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
          <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Finace Manager Notifications"}</h2>

          <div className=" justify-between mb-4">
            {[{ 'btnTxt': 'On Enquiry Receival', 'target': 'Finance Manager' },{ 'btnTxt': 'On Sales Agent Assign', 'target': 'Finance Manager' },{ 'btnTxt': 'On Site Visit fix', 'target': 'Finance Manager' },{ 'btnTxt': 'On Site Visit Completion', 'target': 'Finance Manager' },{ 'btnTxt': 'On NotInterested', 'target': 'Finance Manager' },{ 'btnTxt': 'On Booking', 'target': 'Finance Manager' },{ 'btnTxt': 'On Payment Request', 'target': 'Finance Manager' },{ 'btnTxt': 'On Payment Receival', 'target': 'Finance Manager' },{ 'btnTxt': 'On Payament Accepted', 'target': 'Finance Manager' },{ 'btnTxt': 'On CostSheet Approval', 'target': 'Finance Manager' }  ].map((data, i) => (
              <section>
                <div className='flex flex-row justify-between'>
                  <section className="flex  mt-[18px]">
                    <button onClick={() => triggerFun(data)}>
                      <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                        <PencilIcon
                          className="h-3 w-3 mr-1"
                          aria-hidden="true"
                        />
                        {data?.btnTxt}
                      </span>
                    </button>
                  </section>

                  <section className="flex  mt-[18px]">
                    <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                      {data?.target}
                    </span>
                  </section>
                </div>
              </section>))}

          </div>
        </div>
      </section>
    </div>
    <div>

    </div>
  </div>

  </div>

      <div className="w-full  flex flex-row">



        <div className="lg:col-span-2 mr-4">
          <div>
            <section className="m-4 inline-block">
              <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
                <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Sales Templates"}</h2>

                    <div className=" justify-between mb-4">
                      {[{'btnTxt': 'On Payment', 'target': 'Sales Executive' },{'btnTxt': 'On testing', 'target': 'Executive' },{'btnTxt': 'On Lead Assign', 'target': 'Sales Executive' },{'btnTxt': 'On Creation', 'target': 'Customer' },{'btnTxt': 'On Creation', 'target': 'Sales Executive' },{'btnTxt': 'On Creation', 'target': 'Manager' },{'btnTxt': 'On Creation', 'target': 'Administrator' },{'btnTxt': 'On Assignment', 'target': 'Customer' },{'btnTxt': 'On Assignment', 'target': 'Sales Executive' },{'btnTxt': 'On Assignment', 'target': 'Manager' },{'btnTxt': 'On Assignment', 'target': 'Administrator' },{'btnTxt': 'On Transfer', 'target': 'Customer' },{'btnTxt': 'On Transfer', 'target': 'Sales Executive' },{'btnTxt': 'On Transfer', 'target': 'Manager' },{'btnTxt': 'On Transfer', 'target': 'Administrator' },{'btnTxt': 'On De-assignment', 'target': 'Customer' },

                  { 'btnTxt': 'On De-assignment', 'target': 'Sales Executive' },

                  { 'btnTxt': 'On De-assignment', 'target': 'Manager' },

                  { 'btnTxt': 'On De-assignment', 'target': 'Administrator' }, { 'btnTxt': 'On Next Follow Up', 'target': 'Customer' }, { 'btnTxt': 'On Next Follow Up', 'target': 'Sales Executive' }, { 'btnTxt': 'On Next Follow Up', 'target': 'Manager' }, { 'btnTxt': 'On Next Follow Up', 'target': 'Administrator' }, { 'btnTxt': 'On Delete Follow Up', 'target': 'Customer' }, { 'btnTxt': 'On Delete Follow Up', 'target': 'Sales Executive' }, { 'btnTxt': 'On Delete Follow Up', 'target': 'Manager' }, { 'btnTxt': 'On Delete Follow Up', 'target': 'Administrator' }, { 'btnTxt': 'On Cancel', 'target': 'Customer' }, { 'btnTxt': 'On Cancel', 'target': 'Sales Executive' }, { 'btnTxt': 'On Cancel', 'target': 'Manager' }, { 'btnTxt': 'On Cancel', 'target': 'Administrator' }, { 'btnTxt': 'On Complete', 'target': 'Customer' }, { 'btnTxt': 'On Complete', 'target': 'Sales Executive' }, { 'btnTxt': 'On Complete', 'target': 'Manager' }, { 'btnTxt': 'On Complete', 'target': 'Administrator' }, { 'btnTxt': 'On Creation', 'target': 'Customer' }, { 'btnTxt': 'On Creation', 'target': 'Sales Executive' }, { 'btnTxt': 'On Creation', 'target': 'Manager' }, { 'btnTxt': 'On Creation', 'target': 'Administrator' },
                  { 'btnTxt': 'On Update', 'target': 'Customer' },
                  { 'btnTxt': 'On Update', 'target': 'Sales Executive' },
                  { 'btnTxt': 'On Update', 'target': 'Manager' },
                  { 'btnTxt': 'On Update', 'target': 'Administrator' },
                  { 'btnTxt': 'On Transfer Charge', 'target': 'Customer' },
                  { 'btnTxt': 'On Transfer Charge', 'target': 'Sales Executive' },
                  { 'btnTxt': 'On Transfer Charge', 'target': 'Manager' },
                  { 'btnTxt': 'On Transfer Charge', 'target': 'Administrator' },
                  { 'btnTxt': 'On Block', 'target': 'Customer' },
                  { 'btnTxt': 'On Block', 'target': 'Sales Executive' },
                  { 'btnTxt': 'On Block', 'target': 'Manager' }, { 'btnTxt': 'On Block', 'target': 'Administrator' },].map((data, i) => (
                    <section>
                      <div className='flex flex-row justify-between'>
                        <section className="flex  mt-[18px]">
                          <button onClick={() => triggerFun(data)}>
                            <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              <PencilIcon
                                className="h-3 w-3 mr-1"
                                aria-hidden="true"
                              />
                              {data?.btnTxt}
                            </span>
                          </button>
                        </section>

                        <section className="flex  mt-[18px]">
                          <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                            {data?.target}
                          </span>
                        </section>
                      </div>
                    </section>))}

                </div>
              </div>
            </section>
          </div>
          <div>

          </div>
        </div>
        <section className="m-4 inline-block">
          <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
            <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"CRM Templates"}</h2>

            <div className=" justify-between mb-4">
              {[{ 'btnTxt': 'On Booking', 'target': 'CRM Customer' }, { 'btnTxt': 'On Payment Request', 'target': 'CRM Customer' }, , { 'btnTxt': 'On Payment Receival', 'target': 'CRM Customer' }, { 'btnTxt': 'On Payment Receival', 'target': 'Customer' }, { 'btnTxt': 'On Creation', 'target': 'Customer' }, { 'btnTxt': 'On Creation', 'target': 'Sales Executive' }, { 'btnTxt': 'On Creation', 'target': 'Manager' }, { 'btnTxt': 'On Creation', 'target': 'Administrator' }, { 'btnTxt': 'On Update', 'target': 'Customer' }, { 'btnTxt': 'On Update', 'target': 'Sales Executive' }, { 'btnTxt': 'On Update', 'target': 'Manager' }, { 'btnTxt': 'On Update', 'target': 'Administrator' }, { 'btnTxt': 'On Delete Info', 'target': 'Customer' }, { 'btnTxt': 'On Delete Info', 'target': 'Sales Executive' }, { 'btnTxt': 'On Delete Info', 'target': 'Manager' }, { 'btnTxt': 'On Delete Info', 'target': 'Administrator' }, { 'btnTxt': 'On Status Change', 'target': 'Customer' }, { 'btnTxt': 'On Status Change', 'target': 'Sales Executive' }, { 'btnTxt': 'On Status Change', 'target': 'Manager' }, { 'btnTxt': 'On Status Change', 'target': 'Administrator' }, { 'btnTxt': 'On Re-assignment', 'target': 'Customer' }, { 'btnTxt': 'On Re-assignment', 'target': 'Sales Executive' }, { 'btnTxt': 'On Re-assignment', 'target': 'Manager' }, { 'btnTxt': 'On Re-assignment', 'target': 'Administrator' },
              { 'btnTxt': 'On First Follow Up', 'target': 'Customer' },
              { 'btnTxt': 'On First Follow Up', 'target': 'Sales Executive' },
              { 'btnTxt': 'On First Follow Up', 'target': 'Manager' },
              { 'btnTxt': 'On First Follow Up', 'target': 'Administrator' },

              { 'btnTxt': 'On Dead Status', 'target': 'Customer' },

              { 'btnTxt': 'On Dead Status', 'target': 'Sales Executive' },

              { 'btnTxt': 'On Dead Status', 'target': 'Manager' },

              { 'btnTxt': 'On Dead Status', 'target': 'Administrative' },
              { 'btnTxt': 'Bring To Live', 'target': 'Customer' },
              { 'btnTxt': 'Bring To Live', 'target': 'Sales Executive' },
              { 'btnTxt': 'Bring To Live', 'target': 'Manager' },
              { 'btnTxt': 'Bring To Live', 'target': 'Administrator' },
              { 'btnTxt': 'On Delete Booking', 'target': 'Customer' },
              { 'btnTxt': 'On Delete Booking', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Delete Booking', 'target': 'Manager' },
              { 'btnTxt': 'On Delete Booking', 'target': 'Administrator' },
              { 'btnTxt': 'On Cancel Booking', 'target': 'Customer' },
              { 'btnTxt': 'On Cancel Booking', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Cancel Booking', 'target': 'Manager' },
              { 'btnTxt': 'On Cancel Booking', 'target': 'Administrator' },
              { 'btnTxt': 'On Initialize Approve Reject', 'target': 'Customer' },
              { 'btnTxt': 'On Initialize Approve Reject', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Initialize Approve Reject', 'target': 'Manager' },
              { 'btnTxt': 'On Initialize Approve Reject', 'target': 'Administrator' }
              ].map((data, i) => (
                <section>
                  <div className='flex flex-row justify-between'>
                    <section className="flex  mt-[18px]">
                      <button onClick={() => triggerFun(data)}>
                        <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                          <PencilIcon
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          {data?.btnTxt}
                        </span>
                      </button>
                    </section>

                    <section className="flex  mt-[18px]">
                      <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                        {data?.target}
                      </span>
                    </section>
                  </div>
                </section>))}

            </div>
          </div>
        </section>

        <section className="m-4 inline-block">
          <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 w-96">
            <h2 className="text-sm font-semibold pb-2 border-b border-grey">{"Finance Templates"}</h2>

            <div className=" justify-between mb-4">
              {[{ 'btnTxt': 'On Payment', 'target': 'Sales Executive' }, { 'btnTxt': 'On Payment', 'target': 'Customer' }, { 'btnTxt': 'On Payment', 'target': 'Manager' }, { 'btnTxt': 'On Payment', 'target': 'Sales Executive' }, { 'btnTxt': 'On Payment', 'target': 'Administrator' }, { 'btnTxt': 'On Delete', 'target': 'Customer' }, { 'btnTxt': 'On Delete', 'target': 'Sales Executive' }, { 'btnTxt': 'On Delete', 'target': 'Manager' }, { 'btnTxt': 'On Delete', 'target': 'Administrator' }, { 'btnTxt': 'On Refund Pay', 'target': 'Customer' }, { 'btnTxt': 'On Refund Pay', 'target': 'Sales Executive' }, { 'btnTxt': 'On Refund Pay', 'target': 'Manager' }, { 'btnTxt': 'On Refund Pay', 'target': 'Administrator' }, { 'btnTxt': 'On Booking', 'target': 'Customer' }, { 'btnTxt': 'On Booking', 'target': 'Sales Executive' }, { 'btnTxt': 'On Booking', 'target': 'Manager' }, { 'btnTxt': 'On Booking', 'target': 'Administrator' }, { 'btnTxt': 'On Prepone', 'target': 'Customer' }, { 'btnTxt': 'On Prepone', 'target': 'Sales Executive' }, { 'btnTxt': 'On Prepone', 'target': 'Manager' }, { 'btnTxt': 'On Prepone', 'target': 'Administrator' },
              { 'btnTxt': 'On Postpone', 'target': 'Customer' },
              { 'btnTxt': 'On Postpone', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Postpone', 'target': 'Manager' },
              { 'btnTxt': 'On Postpone', 'target': 'Administrator' },
              { 'btnTxt': 'On Payment', 'target': 'Customer' },
              { 'btnTxt': 'On Payment', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Payment', 'target': 'Manager' }
                , { 'btnTxt': 'On Payment', 'target': 'Administrator' },

              { 'btnTxt': 'On Delete Payment', 'target': 'Customer' },
              { 'btnTxt': 'On Delete Payment', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Delete Payment', 'target': 'Manager' },
              { 'btnTxt': 'On Delete Payment', 'target': 'Administrator' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Customer' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Manager' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Administrator' },
              { 'btnTxt': 'On Refund Delete', 'target': 'Customer' },
              { 'btnTxt': 'On Refund Delete', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Refund Delete', 'target': 'Manager' },
              { 'btnTxt': 'On Refund Delete', 'target': 'Administrator' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Customer' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Sales Executive' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Manager' },
              { 'btnTxt': 'On Refund Pay', 'target': 'Administrator' }
              ].map((data, i) => (
                <section>
                  <div className='flex flex-row justify-between'>
                    <section className="flex  mt-[18px]">
                      <button onClick={() => triggerFun(data)}>
                        <span className="flex ml-2 items-center h-6 px-3 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                          <PencilIcon
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          {data?.btnTxt}
                        </span>
                      </button>
                    </section>

                    <section className="flex  mt-[18px]">
                      <span className="flex ml-2 items-center h-6 px-3 text-xs  text-green-800">
                        {data?.target}
                      </span>
                    </section>
                  </div>
                </section>))}

            </div>
          </div>
        </section>
      </div>

    </>
  )
}


export default MarkeingMessagesList
