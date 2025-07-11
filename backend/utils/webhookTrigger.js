// backend/utils/webhookTrigger.js
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const axios = require('axios');

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(),
});
const db = getFirestore();

async function triggerWebhooks({ userId, event, link }) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return;
    const webhooks = userSnap.data().webhooks || [];
    if (!webhooks.length) return;
    const payload = {
      userId,
      event, // 'link_created' or 'link_clicked'
      link,
      timestamp: new Date().toISOString(),
    };
    await Promise.all(
      webhooks.map(async (url) => {
        try {
          await axios.post(url, payload, { timeout: 5000 });
          console.log(`Webhook sent to ${url}`);
        } catch (err) {
          console.error(`Webhook error for ${url}:`, err.message);
        }
      })
    );
  } catch (err) {
    console.error('Webhook trigger error:', err.message);
  }
}

module.exports = { triggerWebhooks }; 