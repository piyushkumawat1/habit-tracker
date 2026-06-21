import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
    return res.status(200).end();
  }

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
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Verify user identity
    const supabaseUserClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ error: 'Not Authenticated' });
    }

    // Free upgrade logic
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ is_pro: true })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true, message: 'Upgraded to Pro for free!' });
  } catch (error) {
    console.error('Free Upgrade Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
