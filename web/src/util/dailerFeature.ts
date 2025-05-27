  import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore'
  import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import toast from 'react-hot-toast'
  import { db, storage } from 'src/context/firebaseConfig'

  export async function handleCallButtonClick(uid, name, number) {
    try {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        console.error('User not found!')
        return
      }

      const { fcmToken } = userSnap.data()
      console.error('Date', userSnap.data())
      if (!fcmToken) {
        toast.error('No Sales App exits for you')
        return
      }

      console.log('FCM Token:', fcmToken)

      await addDoc(collection(db, 'calls'), {
        name,
        number,
        fcmToken,
        // timestamp: Timestamp.now()
      })
    toast.success('Call triggered in your mobile', {
      duration: 1700 // Closes after 3 seconds
    })
      console.log('Call document added successfully!')
    } catch (error) {
      console.error('Error in call trigger:', error)
    }
  }