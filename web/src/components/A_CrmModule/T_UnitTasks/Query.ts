import {
  db,
  doc,
  increment,
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
    .from(`${orgId}_lead_logs`)
    .update({ projectId: 'uId' })
}
//get unit tasks
export const steamUnitTasks = async (orgId, data) => {
  // const itemsQuery = query(doc(db, `${orgId}_leads_log', 'W6sFKhgyihlsKmmqDG0r'))
  const { uid } = data
  console.log('is uid g', data, uid)
  const { data: lead_logs, error: error1 } = await supabase
    .from(`${orgId}_unit_tasks`)
    .select('*')
    .eq('Uuid', uid)
    .order('created_on', { ascending: false })
  console.log('task value is ', lead_logs, error1)
  return lead_logs
}

//create unit tasks
export const addLegalClarificationTicket = async (orgId, dta, user) => {
  const {
    taskTitle,
    taskdesc,
    dept,
    due_date,
    assignedTo,
    assignedToObj,
    followers,
    priorities,
    attachments,
    Uuid,
  } = dta
  console.log('adding item is ', priorities)
  let followA = []
  let attachA = []
  const followAUid = []
  const x = [assignedToObj?.uid || '']
  if (followers) {
    followA = await followers[0]?.map((d) => {
      const y: any = {}
      y.label = d?.name
      y.value = d?.uid
      x.push(d?.uid)
      followAUid.push(d?.uid)
      return y
    })
  }
  if (attachments) {
    attachA = await attachments?.map((d) => {
      const y: any = {}
      y.name = d?.name
      y.url = d?.url
      y.type = d?.type
      return y
    })
  }
  console.log('value is ', followA)

  const { data, error } = await supabase.from(`${orgId}_unit_tasks`).insert([
    {
      created_on: Timestamp.now().toMillis(),
      Uuid: Uuid,
      followersC: followA?.length || 0,
      by_email: user.email,
      by_name: user.displayName,
      by_uid: user.uid,
      dept: 'legal',
      due_date: due_date,
      priority: priorities,
      status: 'InProgress',
      desc: taskdesc,
      title: taskTitle,
      to_email: assignedToObj?.email,
      to_name: assignedToObj?.name,
      to_uid: assignedToObj?.uid,
      participantsA: followA,
      participantsC: followA?.length || 0,
      followersUid: followAUid || [],
      attachmentsCount: attachA?.length || 0,
      attachmentsA: attachA,
    },
  ])
  const { data: data4, error: error4 } = await supabase
    .from(`${orgId}_unit_logs`)
    .insert([
      {
        type: 'task',
        subtype: 'legal',
        T: Timestamp.now().toMillis(),
        Uuid: Uuid,
        by: user?.email,
        payload: { p: priorities },
        from: 'Created',
        to: 'InProgress',
      },
    ])
  await updateDoc(doc(db, `${orgId}_units`, Uuid), {
    T_pending_tasks: increment(1),
  })
  x.map(async (userId) => {
    // get phone no's
    const additionalUserInfo = await getUser(userId)
    await console.log('task details are', dta, additionalUserInfo)
    await sendWhatAppTextSms1(
      additionalUserInfo?.offPh,
      `New Legal Task Added By *${user.displayName}*
      \n \n *Due Date*:${prettyDateTime(
        due_date
      )}  \n *Priority*:${priorities} \n *Task*: ${taskTitle}`
    )
  })
  await console.log('data is ', data, error)
}
