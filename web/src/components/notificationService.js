// src/services/notificationService.js
import { db, supabase } from './firebaseConfig'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'

// Send notification to user
export const sendNotification = async ({ orgId, userId, title, body, type, data = {} }) => {
  try {
    // Save to Firestore notifications collection
    await addDoc(collection(db, `${orgId}_notifications`), {
      title,
      body,
      userId,
      type,
      data,
      read: false,
      createdAt: new Date(),
    });

    // Optionally send via Supabase if needed
    await supabase.from(`${orgId}_notifications`).insert([{
      title,
      body,
      user_id: userId,
      type,
      data,
      read: false,
      created_at: new Date().toISOString()
    }]);

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

// Check for forgotten blocked units
export const checkForgottenBlockedUnits = async (orgId) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    // Query blocked units that haven't been unblocked
    const q = query(
      collection(db, `${orgId}_projects`),
      where('status', '==', 'customer_blocked'),
      where('blocked_at', '<=', twentyFourHoursAgo),
      where('last_reminder_sent', '==', null)
    );

    const snapshot = await getDocs(q);
    
    // Send reminders for each forgotten blocked unit
    for (const unitDoc of snapshot.docs) {
      const unitData = unitDoc.data();
      
      await sendNotification({
        orgId,
        userId: unitData.blocked_by,
        title: 'Blocked Unit Reminder',
        body: `Unit ${unitData.unit_no} has been blocked for more than 24 hours`,
        type: 'blocked_unit_reminder',
        data: {
          unitId: unitDoc.id,
          projectId: unitData.pId
        }
      });

      // Mark that we've sent a reminder
      await updateDoc(doc(db, `${orgId}_projects`, unitDoc.id), {
        last_reminder_sent: now
      });
    }
  } catch (error) {
    console.error('Error checking blocked units:', error);
  }
};

// Initialize the blocked unit checker
export const initBlockedUnitChecker = (orgId) => {
  // Run immediately
  checkForgottenBlockedUnits(orgId);
  
  // Then run every hour
  const intervalId = setInterval(() => checkForgottenBlockedUnits(orgId), 60 * 60 * 1000);
  
  return () => clearInterval(intervalId);
};