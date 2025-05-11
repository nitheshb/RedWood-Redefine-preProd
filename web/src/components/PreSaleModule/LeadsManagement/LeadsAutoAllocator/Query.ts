import {
  db,
  doc,
  getDoc,
  increment,
  setDoc,
  supabase,
  Timestamp,
  updateDoc,
} from 'src/context/db'
import { getUser } from 'src/context/dbQueryFirebase'
import { sendWhatAppTextSms1 } from 'src/util/axiosWhatAppApi'
import { prettyDateTime } from 'src/util/dateConverter'

// update unit task status
export const updateUnitTaskStatus = async (
  orgId,
  docId,
  data,
  by,
  enqueueSnackbar
) => {
  const { data: lead_logs, error } = await supabase
    .from(`${orgId}_LeadsAllocator`)
    .update({ order: 'uId' })
}
//get unit tasks
export const getLeadsAllocationOrder = async (orgId, uid) => {
  const docRef = doc(db, `${orgId}_LeadsAllocator`, uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data())
    return docSnap.data()
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!')
  }
}

export const upsertLeadsAllocator = async (orgId, id, data) => {
  console.log('values are ', id)

  try {
    const washingtonRef = doc(db, `${orgId}_LeadsAllocator`, id)

    await updateDoc(washingtonRef, data)
  } catch (error) {
    try {
      await setDoc(doc(db, `${orgId}_LeadsAllocator`, id), data)
    } catch (error) {
      console.log('error in LeadsAllocator update ', error)
    }
  }
}
