const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendCallNotification = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Only authenticated users can send notifications'
    );
  }

  try {
    const message = {
      token: data.token,
      notification: data.notification,
      data: data.data,
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      },
      android: {
        notification: {
          sound: 'default',
          channel_id: 'calls',
          priority: 'high'
        }
      }
    };

    const response = await admin.messaging().send(message);
    return { messageId: response };
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Update notification status in Firestore if token is invalid
    if (error.code === 'messaging/invalid-registration-token' || 
        error.code === 'messaging/registration-token-not-registered') {
      await admin.firestore()
        .collection(`${context.auth.token.orgId}_userDevices`)
        .doc(context.auth.uid)
        .update({
          fcmToken: null,
          tokenError: error.message
        });
    }
    
    throw new functions.https.HttpsError(
      'internal', 
      'Failed to send notification', 
      error.message
    );
  }
});