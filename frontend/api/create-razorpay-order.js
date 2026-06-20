import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers for preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
    return res.status(200).end();
  }

  // Set CORS for actual response
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase Environment Variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ error: 'Not Authenticated' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.VITE_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: 49900, // 499.00 INR
      currency: 'INR',
      receipt: `rcpt_${user.id.slice(0,8)}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      throw new Error("Razorpay order creation failed");
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error('Razorpay Error:', JSON.stringify(error, null, 2), error);
    const errorMessage = error?.error?.description || error?.message || 'Razorpay order creation failed internally';
    return res.status(500).json({ error: errorMessage });
  }
}
