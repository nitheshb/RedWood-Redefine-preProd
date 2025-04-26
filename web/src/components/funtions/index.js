const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const db = admin.firestore()

exports.checkBlockedUnits = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const now = Date.now()
    const blockedUnits = await db
      .collection('units')
      .where('status', '==', 'customer_blocked')
      .where('unblock_due_date', '<', now) // Check expired blocks
      .get()

    blockedUnits.forEach(async (doc) => {
      const unitData = doc.data()

      const message = {
        notification: {
          title: 'Unit Still Blocked!',
          body: `The unit ${unitData.id} was supposed to be unblocked. Please take action.`,
        },
        token: unitData.userToken, // Ensure userToken is stored when blocking the unit
      }

      try {
        await admin.messaging().send(message)
        console.log(`Notification sent for blocked unit: ${unitData.id}`)
      } catch (error) {
        console.error('Error sending notification:', error)
      }
    })
  })
