importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js');
self.importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js');

firebase.initializeApp({
  // Your Firebase configuration
  apiKey: 'AIzaSyDlr5xlq378B5vyetXvE_rK1r4EhPhFTt4',
  authDomain: 'redefine-erp.firebaseapp.com',
  projectId: 'redefine-erp',
  storageBucket: 'redefine-erp.appspot.com',
  messagingSenderId: '805525655781',
  appId: '1:805525655781:web:dfa846398899fe3ddc840c',
  measurementId: 'G-C2BJ3N02SQ',
});

const messaging = firebase.messaging();

// Customize notification behavior
messaging.setBackgroundMessageHandler((payload) => {
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    // Additional options can be added here
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

