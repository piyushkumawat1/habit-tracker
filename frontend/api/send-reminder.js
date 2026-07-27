import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Initialize VAPID keys
// This runs on Vercel Serverless environment securely.
webpush.setVAPIDDetails(
  'mailto:admin@habitley.com',
  process.env.VITE_VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  // Add CORS headers so the frontend can call this route
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { userId, title, body, url } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Needs service role to bypass RLS and read subscriptions
    );

    // Fetch all active device subscriptions for the target user
    const { data: records, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error fetching subscriptions.' });
    }
    
    if (!records || !records.length) {
      return res.status(404).json({ error: 'No subscriptions found for user.' });
    }

    const payload = JSON.stringify({ 
      title: title || 'Habitley Reminder', 
      body: body || 'Time to complete your habit!', 
      url: url || '/dashboard' 
    });

    // Send notifications to all registered devices for this user
    const promises = records.map(record =>
      webpush.sendNotification(record.subscription, payload)
        .catch(err => {
          // If subscription has expired or vanished, remove it from the database
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log('Deleting expired subscription');
            return supabase.from('push_subscriptions').delete().eq('subscription', record.subscription);
          }
          console.error('Error sending push notification:', err);
        })
    );

    await Promise.all(promises);
    return res.status(200).json({ success: true, message: `Push sent to ${records.length} devices.` });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
