const express = require('express');
const webpush = require('web-push');
const { query } = require('../database');

const router = express.Router();

// Generate VAPID keys dynamically on module load if not in environmental variables
let publicKey = process.env.VAPID_PUBLIC_KEY;
let privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  const keys = webpush.generateVAPIDKeys();
  publicKey = keys.publicKey;
  privateKey = keys.privateKey;
  process.env.VAPID_PUBLIC_KEY = publicKey;
  process.env.VAPID_PRIVATE_KEY = privateKey;
  console.log('\n======================================');
  console.log('GENERATED DYNAMIC VAPID KEYS FOR PUSH:');
  console.log('Public Key:', publicKey);
  console.log('Private Key:', privateKey);
  console.log('======================================\n');
}

const email = process.env.VAPID_EMAIL || 'mailto:info@urbanharvesthub.org';
webpush.setVapidDetails(email, publicKey, privateKey);

// GET /api/notifications/vapid-key - Get the VAPID public key
router.get('/vapid-key', (req, res) => {
  res.json({ publicKey });
});

// POST /api/notifications/subscribe - Save browser push subscription
router.post('/subscribe', async (req, res, next) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Subscription endpoint is required.' });
  }

  try {
    const jsonStr = JSON.stringify(subscription);
    // Avoid duplicates
    const existing = await query('SELECT id FROM push_subscriptions WHERE endpoint = ?', [subscription.endpoint]);
    if (existing.length === 0) {
      await query('INSERT INTO push_subscriptions (subscription, endpoint) VALUES (?, ?)', [jsonStr, subscription.endpoint]);
    }
    res.status(201).json({ message: 'Subscribed to push notifications successfully.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/send - Send dynamic notification (simulated / triggered)
router.post('/send', async (req, res, next) => {
  const { title, body, icon, url } = req.body;
  const payload = JSON.stringify({
    title: title || 'Urban Harvest Hub Notification',
    body: body || 'A new event/workshop is available. Check it out!',
    icon: icon || '/icons/icon-192x192.png',
    url: url || '/products'
  });

  try {
    const subscriptions = await query('SELECT * FROM push_subscriptions');
    let successes = 0;
    
    const sendPromises = subscriptions.map(async (subRecord) => {
      const sub = JSON.parse(subRecord.subscription);
      try {
        await webpush.sendNotification(sub, payload);
        successes++;
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // subscription expired or invalid, delete it
          await query('DELETE FROM push_subscriptions WHERE id = ?', [subRecord.id]);
        } else {
          console.error(`Error sending push notification to subscriber ID ${subRecord.id}:`, err);
        }
      }
    });

    await Promise.all(sendPromises);
    res.json({ 
      message: `Notification dispatch complete. Sent to ${successes} out of ${subscriptions.length} subscribers.` 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
