// import React, { useEffect, useState } from 'react';
// import { getMessaging, onMessage } from 'firebase/messaging';
// import { generateToken, messaging } from 'src/context/firebaseConfig';


// const NotificationDemo = () => {
//   const [token, setToken] = useState(null);
//   const [message, setMessage] = useState(null);

//   const handleGenerateToken = async () => {
//     const fcmToken = await generateToken();
//     setToken(fcmToken);
//   };

//   useEffect(() => {
//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log('Foreground notification received:', payload);
//       setMessage(payload.notification);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🔔 Firebase Notification Demo</h2>

//       <button onClick={handleGenerateToken} style={styles.button}>
//         Generate FCM Token
//       </button>

//       {token && (
//         <div style={styles.tokenBox}>
//           <strong>📌 Your FCM Token:</strong>
//           <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{token}</pre>
//         </div>
//       )}

//       {message && (
//         <div style={styles.notificationBox}>
//           <h4>💡 New Notification:</h4>
//           <p><strong>Title:</strong> {message.title}</p>
//           <p><strong>Body:</strong> {message.body}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   button: {
//     padding: '10px 16px',
//     borderRadius: 4,
//     border: '1px solid #ccc',
//     backgroundColor: '#f0f0f0',
//     cursor: 'pointer',
//     marginBottom: 10,
//   },
//   tokenBox: {
//     marginTop: 10,
//     padding: 10,
//     background: '#f8f8f8',
//     border: '1px solid #ddd',
//   },
//   notificationBox: {
//     marginTop: 20,
//     padding: 10,
//     border: '1px solid green',
//     background: '#eaffea',
//   },
// };

// export default NotificationDemo;
