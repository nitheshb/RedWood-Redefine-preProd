// export function selldoLeadStageMapper(status) {
//   if (typeof status !== 'string') return status;
//   const normalized = status.trim().toLowerCase();
//   const statusMap = {
//     'unqualified': 'notinterested',
//     'incoming': 'new',
//     'prospect': 'followup',
//     'booked': 'booked',
//     'lost': 'junk',
//     'eoifilled': 'followup',
//     'rnr': 'junk',
//     'opportunity': 'followup',

//   };
// if(statusMap[status]==undefined){
//   console.log('serialisation failed', status)
// }
//   return statusMap[normalized] || `${normalized}-invalid`; // default to original if not found
// }

export function selldoLeadStageMapper(status, i) {
  try {
    console.log('normalized is ==>', typeof status,typeof status !== 'string', status, i)

  if (typeof status !== 'string'){
    console.log('normalized is ==>', typeof status,typeof status !== 'string', status, i)
    return status;
  }

  const normalized = status.trim().toLowerCase();
console.log('normalized is ', normalized, i)
  switch (normalized) {
    case 'unqualified':
      return 'notinterested';
    case 'incoming':
      return 'new';
    case 'prospect':
      return 'prospect';
    case 'Prospect':
        return 'prospect';
    case 'opportunity':
        return 'negotiation';
    case 'Opportunity':
          return 'negotiation';
    case 'booked':
      return 'booked';
    case 'follow up':
      return 'followup';
    case 'lost':
      return 'junk';
    case 'Lost':
        return 'junk';
    case 'rnr':
      return 'junk'
    case 'eoifilled':
      return 'negotiation';
    case 'eoi filled':
        return 'negotiation';

      //     'opportunity': 'followup',
    default:
    console.log('normalized is ', normalized)
      return status; // fallback to original if no match
  }
} catch (error) {

  console.error('normalized is ==>',error, typeof status,typeof status !== 'string', status, i)
return status
}
}