// backend/utils/linkHealthChecker.js
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const axios = require('axios');

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(),
});
const db = getFirestore();

async function checkLinkHealth(url, maxRedirects = 5) {
  try {
    let redirects = 0;
    let currentUrl = url;
    const visited = new Set();
    while (redirects < maxRedirects) {
      if (visited.has(currentUrl)) {
        return 'redirect_loop';
      }
      visited.add(currentUrl);
      const response = await axios.get(currentUrl, {
        timeout: 7000,
        maxRedirects: 0,
        validateStatus: null,
      });
      if (response.status >= 200 && response.status < 300) {
        return 'healthy';
      } else if (response.status === 301 || response.status === 302) {
        const loc = response.headers.location;
        if (!loc) return 'broken';
        currentUrl = loc.startsWith('http') ? loc : new URL(loc, currentUrl).toString();
        redirects++;
      } else if (response.status === 404) {
        return 'broken';
      } else {
        return 'broken';
      }
    }
    return 'redirect_loop';
  } catch (err) {
    if (err.code === 'ECONNABORTED') return 'timeout';
    return 'broken';
  }
}

async function checkAllLinks() {
  const linksRef = db.collection('links');
  const snapshot = await linksRef.get();
  const updates = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const url = data.original_url;
    if (!url) continue;
    const status = await checkLinkHealth(url);
    await doc.ref.update({ health_status: status });
    updates.push({ id: doc.id, url, health_status: status });
    console.log(`Checked: ${url} => ${status}`);
  }
  return updates;
}

// For manual triggering
if (require.main === module) {
  checkAllLinks().then(() => {
    console.log('All links checked.');
    process.exit(0);
  });
}

module.exports = { checkAllLinks, checkLinkHealth }; 