// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import firebase from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getMessaging, getToken, } from 'firebase/messaging'
import { getStorage } from 'firebase/storage'
// import { initializeApp } from 'firebase-admin/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDlr5xlq378B5vyetXvE_rK1r4EhPhFTt4',
  authDomain: 'redefine-erp.firebaseapp.com',
  projectId: 'redefine-erp',
  storageBucket: 'redefine-erp.appspot.com',
  messagingSenderId: '805525655781',
  appId: '1:805525655781:web:dfa846398899fe3ddc840c',
  measurementId: 'G-C2BJ3N02SQ',
}


// Initialize Firebase

const app = initializeApp(firebaseConfig)
// initializeFirestore(app, settings)

// firebase.firestore().settings({ experimentalForceLongPolling: true });
// const db = getFirestore(app)
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
})
const storage = getStorage()
// const messagingF = messaging()
const messaging = getMessaging(app)





// export const generateToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     console.log("Notification Permission:", permission);

//     if (permission === 'granted') {
//       const token = await getToken(messaging, {
//         // vapidKey: "BD1_XkIVsHKlmeLmu389JEmo21shxxEDEKyGOh1lAeG9ruBBPzZlJdqKtI75dzRIZUo7LZILoBY3zDqhKW5Zrqw",
//       });
      
//       if (token) {
//         console.log("FCM Token:", token);
//         return token;
//       } else {
//         console.log("Failed to get FCM token.");
//         return null;
//       }
//     } else {
//       console.warn("Permission denied for notifications.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error generating FCM token:", error);
//     return null;
//   }
// };









// export const auth = app.auth()
const auth = getAuth()
const analytics = getAnalytics(app)

export { auth, db, storage, messaging, getToken, }
